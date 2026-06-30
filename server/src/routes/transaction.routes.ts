import express from "express";
import multer from "multer";
import csv from "csv-parser";
import fs from "fs";

const router = express.Router();

// Multer configuration
const upload = multer({
  dest: "uploads/",
});

// Dummy in-memory storage
let transactions: any[] = [];

// =============================
// Add Transaction
// =============================
router.post("/", (req, res) => {
  const { title, amount, type, category } = req.body;

  const newTx = {
    id: Date.now(),
    title,
    amount,
    type,
    category,
  };

  transactions.push(newTx);

  res.json({
    success: true,
    data: newTx,
  });
});

// =============================
// Get All Transactions
// =============================
router.get("/", (req, res) => {
  res.json({
    success: true,
    data: transactions,
  });
});

// =============================
// Delete Transaction
// =============================
router.delete("/:id", (req, res) => {
  transactions = transactions.filter(
    (t) => t.id !== Number(req.params.id)
  );

  res.json({
    success: true,
    message: "Deleted successfully",
  });
});

// =============================
// Upload CSV
// =============================
router.post(
  "/upload",
  upload.single("file"),
  (req: any, res) => {
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
          id: Date.now() + Math.random(),

          title: row.title,

          amount: Number(row.amount),

          type: row.type.toLowerCase(),

          category: row.category,
        });
      })
      .on("end", () => {
        transactions.push(...results);

        // Delete uploaded temp file
        fs.unlinkSync(req.file.path);

        res.json({
          success: true,
          message: "CSV Uploaded Successfully 🚀",
          count: results.length,
          data: results,
        });
      })
      .on("error", (err) => {
        console.error(err);

        res.status(500).json({
          success: false,
          message: "Failed to process CSV",
        });
      });
  }
);

export default router;