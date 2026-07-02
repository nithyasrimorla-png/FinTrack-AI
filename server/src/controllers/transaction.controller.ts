import prisma from "../config/prisma";
import fs from "fs";
import csv from "csv-parser";
import { Request, Response } from "express";

// CREATE
export const createTransaction = async (req: Request, res: Response) => {
  try {
    const { title, amount, type, category } = req.body;

    const tx = await prisma.transaction.create({
      data: {
        title,
        amount: Number(amount),
        type,
        category,
      },
    });

    res.json({ success: true, data: tx });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET ALL
export const getTransactions = async (req: Request, res: Response) => {
  try {
    const data = await prisma.transaction.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

// DELETE
export const deleteTransaction = async (req: Request, res: Response) => {
  try {
    await prisma.transaction.delete({
      where: {
        id: req.params.id,
      },
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

// CSV UPLOAD
export const uploadCSV = (req: any, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file" });
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
        await prisma.transaction.createMany({
          data: results,
        });

        fs.unlinkSync(req.file.path);

        res.json({
          success: true,
          message: "CSV uploaded",
          count: results.length,
        });
      } catch (err) {
        res.status(500).json({ success: false, message: "DB error" });
      }
    })
    .on("error", () => {
      res.status(500).json({ success: false, message: "CSV error" });
    });
};