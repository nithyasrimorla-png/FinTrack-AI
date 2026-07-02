import express from "express";
import prisma from "../config/prisma";
import multer from "multer";
import csv from "csv-parser";
import fs from "fs";
import auth, { AuthRequest } from "../middleware/auth.middleware";

const router = express.Router();

const upload = multer({
  dest: "uploads/",
});

/* =============================
   ADD TRANSACTION
============================= */
router.post("/", auth, async (req: AuthRequest, res) => {
  try {
    const { title, amount, type, category } = req.body;

    if (!title || !amount || !type || !category) {
      return res.status(400).json({ message: "Missing fields" });
    }

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
        userId: req.user.id,
      },
    });

    res.json({
      success: true,
      data: newTx,
    });
  } catch (err: any) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
});

/* =============================
   GET USER TRANSACTIONS
============================= */
router.get("/", auth, async (req: AuthRequest, res) => {
  try {
    const data = await prisma.transaction.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      data,
    });
  } catch (err: any) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
});

/* =============================
   DELETE TRANSACTION
============================= */
router.delete("/:id", auth, async (req: AuthRequest, res) => {
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
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
});

/* =============================
   CSV UPLOAD
============================= */
router.post(
  "/upload",
  auth,
  upload.single("file"),
  (req: AuthRequest, res) => {
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
          userId: req.user.id,
        });
      })
      .on("end", async () => {
        try {
          const inserted = await prisma.transaction.createMany({
            data: results,
          });

          await prisma.uploadHistory.create({
            data: {
              fileName: req.file!.originalname,
              rowCount: inserted.count,
              status: "SUCCESS",
              userId: req.user.id,
            },
          });

          fs.unlink(req.file!.path, () => {});

          res.json({
            success: true,
            message: "CSV Uploaded Successfully!",
            count: inserted.count,
          });
        } catch (err: any) {
          console.error(err);

          await prisma.uploadHistory.create({
            data: {
              fileName: req.file!.originalname,
              rowCount: 0,
              status: "FAILED",
              userId: req.user.id,
            },
          });

          res.status(500).json({
            success: false,
            message: err.message,
          });
        }
      })
      .on("error", () => {
        res.status(500).json({
          success: false,
          message: "CSV Processing Failed",
        });
      });
  }
);

export default router;