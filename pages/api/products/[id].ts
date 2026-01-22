import type { NextApiRequest, NextApiResponse } from "next";
import { products } from "../../../app/data/products";
import { getProductWithSales } from "../../../app/data/sales";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // getProduct - Get a single product by ID with sales data
  const productId = id as string;

  const product = products.find((p) => p.id === productId);

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  // Get product with sales data
  const productsWithSales = getProductWithSales();
  const productWithSales = productsWithSales.find((p) => p.id === productId);

  return res.status(200).json({
    product: productWithSales || product,
  });
}
