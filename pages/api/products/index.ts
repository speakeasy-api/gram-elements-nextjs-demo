import type { NextApiRequest, NextApiResponse } from "next";
import { products, type Product } from "../../../app/data/products";

// In-memory store for products (in production, use a database)
let productsStore = [...products];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    // getProducts - List all products with optional filtering
    const { category, minPrice, maxPrice } = req.query;

    let result = [...productsStore];

    // Filter by category if provided
    if (category && typeof category === "string") {
      result = result.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by price range
    if (minPrice) {
      const min = parseFloat(minPrice as string);
      result = result.filter((p) => p.price >= min);
    }
    if (maxPrice) {
      const max = parseFloat(maxPrice as string);
      result = result.filter((p) => p.price <= max);
    }

    return res.status(200).json({
      products: result,
      total: productsStore.length,
      filtered: result.length,
    });
  }

  if (req.method === "POST") {
    // createProduct - Create a new product
    const { name, description, price, category, stock } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ error: "Name and price are required" });
    }

    if (!["fresh", "organic", "specialty"].includes(category)) {
      return res.status(400).json({
        error: "Category must be one of: fresh, organic, specialty",
      });
    }

    // Generate a slug ID from the name
    const id = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Check for duplicate ID
    if (productsStore.some((p) => p.id === id)) {
      return res.status(400).json({ error: "Product with this name already exists" });
    }

    const newProduct: Product = {
      id,
      name,
      description: description || "",
      price: parseFloat(price),
      image: "🍌",
      category: category || "fresh",
      stock: stock ? parseInt(stock, 10) : 0,
    };

    productsStore.push(newProduct);

    return res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
