import express from "express";
import prisma from "../config/prisma";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const uploads = await prisma.uploadHistory.findMany({
      orderBy: { uploadedAt: "desc" },
    });

    res.json(uploads);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;