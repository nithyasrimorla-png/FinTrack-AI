export function generateInsights(transactions: any[]) {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((a, b) => a + Number(b.amount), 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((a, b) => a + Number(b.amount), 0);

  const foodSpend = transactions
    .filter((t) => t.category?.toLowerCase() === "food")
    .reduce((a, b) => a + Number(b.amount), 0);

  const travelSpend = transactions
    .filter((t) => t.category?.toLowerCase() === "travel")
    .reduce((a, b) => a + Number(b.amount), 0);

  const insights = [];

  if (expense > income) {
    insights.push("⚠️ You are spending more than you earn!");
  }

  if (foodSpend > income * 0.3) {
    insights.push("🍔 High spending on Food detected");
  }

  if (travelSpend > income * 0.2) {
    insights.push("✈️ Travel expenses are quite high");
  }

  if (expense < income) {
    insights.push("✅ Good job! You are saving money this month");
  }

  return insights;
}