import { products, type Product } from "./products";

export interface SaleRecord {
  productId: string;
  date: string;
  quantity: number;
  revenue: number;
}

export interface ProductSales {
  productId: string;
  totalQuantity: number;
  totalRevenue: number;
}

export interface MonthlySales {
  month: string;
  revenue: number;
  quantity: number;
}

// Generate realistic sales data for the past 6 months
function generateSalesData(): SaleRecord[] {
  const records: SaleRecord[] = [];
  const now = new Date();

  // Sales multipliers by product (some sell better than others)
  const salesMultipliers: Record<string, number> = {
    cavendish: 5.0,
    "organic-cavendish": 3.2,
    plantain: 2.8,
    "baby-banana": 2.0,
    "red-banana": 1.2,
    manzano: 1.5,
    "burro-banana": 0.8,
    "organic-plantain": 1.8,
  };

  for (let daysAgo = 180; daysAgo >= 0; daysAgo--) {
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    const dateStr = date.toISOString().split("T")[0];

    // Weekend boost
    const dayOfWeek = date.getDay();
    const weekendBoost = dayOfWeek === 0 || dayOfWeek === 6 ? 1.4 : 1.0;

    for (const product of products) {
      const multiplier = salesMultipliers[product.id] || 1.0;
      const baseQuantity = Math.floor(Math.random() * 50 + 20);
      const quantity = Math.floor(baseQuantity * multiplier * weekendBoost);
      const revenue = quantity * product.price;

      records.push({
        productId: product.id,
        date: dateStr,
        quantity,
        revenue: Math.round(revenue * 100) / 100,
      });
    }
  }

  return records;
}

export const salesData: SaleRecord[] = generateSalesData();

export function getProductSales(): ProductSales[] {
  const salesByProduct: Record<string, ProductSales> = {};

  for (const record of salesData) {
    if (!salesByProduct[record.productId]) {
      salesByProduct[record.productId] = {
        productId: record.productId,
        totalQuantity: 0,
        totalRevenue: 0,
      };
    }
    salesByProduct[record.productId].totalQuantity += record.quantity;
    salesByProduct[record.productId].totalRevenue += record.revenue;
  }

  return Object.values(salesByProduct).map((s) => ({
    ...s,
    totalRevenue: Math.round(s.totalRevenue * 100) / 100,
  }));
}

export function getMonthlySales(): MonthlySales[] {
  const salesByMonth: Record<string, MonthlySales> = {};

  for (const record of salesData) {
    const month = record.date.substring(0, 7); // YYYY-MM
    if (!salesByMonth[month]) {
      salesByMonth[month] = { month, revenue: 0, quantity: 0 };
    }
    salesByMonth[month].revenue += record.revenue;
    salesByMonth[month].quantity += record.quantity;
  }

  return Object.values(salesByMonth)
    .sort((a, b) => a.month.localeCompare(b.month))
    .map((s) => ({
      ...s,
      revenue: Math.round(s.revenue * 100) / 100,
    }));
}

export function getTotalStats() {
  const productSales = getProductSales();
  const totalRevenue = productSales.reduce((sum, p) => sum + p.totalRevenue, 0);
  const totalQuantity = productSales.reduce(
    (sum, p) => sum + p.totalQuantity,
    0
  );
  const avgOrderValue = totalRevenue / (totalQuantity || 1);

  return {
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    totalQuantity,
    activeProducts: products.length,
    avgOrderValue: Math.round(avgOrderValue * 100) / 100,
  };
}

export function getProductWithSales(): (Product & ProductSales)[] {
  const productSales = getProductSales();

  return products.map((product) => {
    const sales = productSales.find((s) => s.productId === product.id) || {
      productId: product.id,
      totalQuantity: 0,
      totalRevenue: 0,
    };
    return { ...product, ...sales };
  });
}
