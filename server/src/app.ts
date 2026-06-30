import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import transactionRoutes from "./routes/transaction.routes";
const app = express();

app.use(cors());
app.use(express.json());

// IMPORTANT: API PREFIX
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);

export default app;