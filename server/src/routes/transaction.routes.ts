import express from "express";
import prisma from "../config/prisma";
import multer from "multer";
import csv from "csv-parser";
import fs from "fs";

const router = express.Router();

const upload = multer({
  dest: "uploads/",
});

/* =============================
   ADD TRANSACTION
============================= */
router.post("/", async (req, res) => {
  try {
    const { title, amount, type, category } = req.body;

    if (!title || !amount || !type || !category) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // TEMP fallback safety
    const cleanAmount = Number(amount);
    if (isNaN(cleanAmount)) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const newTx = await prisma.transaction.create({
      data: {
        title,
        amount: cleanAmount,
        type,
        category,
      },
    });

    res.json({ success: true, data: newTx });

  } catch (err: any) {
    console.error("ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

/* =============================
   GET ALL
============================= */
router.get("/", async (req, res) => {
  console.log("GET /api/transactions");

  try {
    const data = await prisma.transaction.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      data,
    });
  } catch (err: any) {
    console.error("GET ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* =============================
   DELETE
============================= */
router.delete("/:id", async (req, res) => {
  console.log("DELETE Transaction:", req.params.id);

  try {
    await prisma.transaction.delete({
      where: {
        id: req.params.id,
      },
    });

    res.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (err: any) {
    console.error("DELETE ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* =============================
   CSV UPLOAD
============================= */
router.post("/upload", upload.single("file"), (req: any, res) => {
  console.log("CSV Upload Route Reached");

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No CSV file uploaded",
    });
  }

  const results: any[] = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (row) => {
      results.push({
        title: row.title || row.Title,
        amount: Number(row.amount || row.Amount),
        type: (row.type || row.Type || "").toLowerCase(),
        category: row.category || row.Category,
      });
    })
    .on("end", async () => {
      try {
        const inserted = await prisma.transaction.createMany({
          data: results,
        });

        await prisma.uploadHistory.create({
          data: {
            fileName: req.file.originalname,
            rowCount: inserted.count,
            status: "SUCCESS",
          },
        });

        // safer delete (prevents crash)
        fs.unlink(req.file.path, () => {});

        res.json({
          success: true,
          message: "CSV Uploaded Successfully!",
          count: inserted.count,
        });
      } catch (err: any) {
  console.error("DB INSERT ERROR:", err);

  await prisma.uploadHistory.create({
    data: {
      fileName: req.file?.originalname || "Unknown",
      rowCount: 0,
      status: "FAILED",
    },
  });

  res.status(500).json({
    success: false,
    message: err.message,
  });
}
    })
    .on("error", (err) => {
      console.error("CSV ERROR:", err);

      res.status(500).json({
        success: false,
        message: "CSV processing failed",
      });
    });
});


export default router;