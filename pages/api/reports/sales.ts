import type { NextApiRequest, NextApiResponse } from "next";
import {
  getTotalStats,
  getMonthlySales,
  getProductWithSales,
  getProductSales,
} from "../../../app/data/sales";
import { getCustomersByCountry, getTotalCustomerStats } from "../../../app/data/customers";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // createSalesReport - Generate a comprehensive sales report
  const { type = "full", startDate, endDate } = req.body;

  const stats = getTotalStats();
  const monthlySales = getMonthlySales();
  const productSales = getProductSales();
  const productsWithSales = getProductWithSales();
  const customersByCountry = getCustomersByCountry();
  const customerStats = getTotalCustomerStats();

  // Filter monthly sales by date range if provided
  let filteredMonthlySales = monthlySales;
  if (startDate) {
    filteredMonthlySales = filteredMonthlySales.filter(
      (s) => s.month >= startDate
    );
  }
  if (endDate) {
    filteredMonthlySales = filteredMonthlySales.filter(
      (s) => s.month <= endDate
    );
  }

  // Sort products by revenue for top sellers
  const topSellers = [...productsWithSales]
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 5);

  // Sort products by quantity for most popular
  const mostPopular = [...productsWithSales]
    .sort((a, b) => b.totalQuantity - a.totalQuantity)
    .slice(0, 5);

  // Calculate category breakdown
  const categoryBreakdown = productsWithSales.reduce(
    (acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = { revenue: 0, quantity: 0, products: 0 };
      }
      acc[product.category].revenue += product.totalRevenue;
      acc[product.category].quantity += product.totalQuantity;
      acc[product.category].products += 1;
      return acc;
    },
    {} as Record<string, { revenue: number; quantity: number; products: number }>
  );

  const report = {
    generatedAt: new Date().toISOString(),
    reportType: type,
    dateRange: {
      start: startDate || monthlySales[0]?.month || null,
      end: endDate || monthlySales[monthlySales.length - 1]?.month || null,
    },
    summary: {
      totalRevenue: stats.totalRevenue,
      totalUnitsSold: stats.totalQuantity,
      activeProducts: stats.activeProducts,
      averagePrice: stats.avgOrderValue,
      totalCustomers: customerStats.totalCustomers,
      totalCustomerOrders: customerStats.totalOrders,
      countriesServed: customerStats.countries,
    },
    monthlySales: filteredMonthlySales,
    topSellingProducts: topSellers.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      revenue: p.totalRevenue,
      unitsSold: p.totalQuantity,
      price: p.price,
    })),
    mostPopularProducts: mostPopular.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      unitsSold: p.totalQuantity,
      revenue: p.totalRevenue,
    })),
    categoryBreakdown: Object.entries(categoryBreakdown).map(([category, data]) => ({
      category,
      revenue: Math.round(data.revenue * 100) / 100,
      unitsSold: data.quantity,
      productCount: data.products,
    })),
    topCustomerCountries: customersByCountry.slice(0, 10),
  };

  return res.status(200).json({
    message: "Sales report generated successfully",
    report,
  });
}
