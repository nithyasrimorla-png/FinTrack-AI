import express from "express";
import prisma from "../config/prisma";
import auth, { AuthRequest } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", auth, async (req: AuthRequest, res) => {
  try {
    const uploads = await prisma.uploadHistory.findMany({
      where: {
        userId: req.user!.id,
      },
      orderBy: {
        uploadedAt: "desc",
      },
    });

    res.json(uploads);
  } catch (err: any) {
    res.status(500).json({
      message: err.message,
    });
  }
});

export default router;