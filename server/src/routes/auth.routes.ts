import express from "express";
import prisma from "../config/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const router = express.Router();

/* =====================
   REGISTER
===================== */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    res.json({
      success: true,
      user: { id: user.id, email: user.email },
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});
/* =====================
   LOGIN
===================== */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    await prisma.user.update({
      where: { email },
      data: {
        lastLogin: new Date(),
      },
    });

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const resetToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "15m" }
    );

    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    res.json({
      success: true,
      message: "Reset token generated",
      resetToken, 
    });

  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

   if (!user || user.resetToken !== token || !user.resetTokenExpiry) {
  return res.status(400).json({ message: "Invalid token" });
}

    if (new Date() > user.resetTokenExpiry) {
      return res.status(400).json({ message: "Token expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    res.json({
      success: true,
      message: "Password reset successful",
    });

  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;