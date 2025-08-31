import dbConnect from "@/lib/databaseconnect";
import Invoice from "@/models/invoice";

export async function GET() {
  await dbConnect();

  const now = new Date();
  const lastYear = new Date();
  lastYear.setMonth(now.getMonth() - 11);

  // Aggregation pipeline
  const revenue = await Invoice.aggregate([
    {
      $match: {
        status: { $regex: /^paid$/i }, // case-insensitive "Paid"
        createdAt: {
          $gte: new Date(lastYear.getFullYear(), lastYear.getMonth(), 1),
          $lte: now,
        },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        totalRevenue: { $sum: "$totalAmount" }, // ✅ fixed field name
        invoiceCount: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  const MONTH_NAMES = [
    "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const months = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ year: d.getFullYear(), month: d.getMonth() + 1 });
  }

  // Fill months that have no revenue
  const filled = months.map((m) => {
    const found = revenue.find(
      (r) => r._id.year === m.year && r._id.month === m.month
    );
    return {
      month: `${MONTH_NAMES[m.month]} `,
      totalRevenue: found ? found.totalRevenue : 0,
      invoiceCount: found ? found.invoiceCount : 0,
    };
  });

  return Response.json(filled);
}
