// server/models/Transaction.ts
import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  title: String,
  amount: Number,
  type: String,
  category: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Transaction", TransactionSchema);