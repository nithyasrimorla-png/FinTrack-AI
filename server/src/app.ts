import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import transactionRoutes from "./routes/transaction.routes";
import uploadsRouter from "./routes/uploads";
const app = express();

// =============================
// Middlewares
// =============================
app.use(cors({
  origin: "http://localhost:3000", // change in production
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/uploads", uploadsRouter);
// =============================
// Health Check Route
// =============================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API is running !",
  });
});

// =============================
// Routes
// =============================
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);

// =============================
// 404 Handler (IMPORTANT)
// =============================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;