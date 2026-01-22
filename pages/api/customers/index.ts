import type { NextApiRequest, NextApiResponse } from "next";
import { customers, type Customer } from "../../../app/data/customers";

// In-memory store for new customers (in production, use a database)
let customersStore = [...customers];
let nextId = customers.length + 1;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    // getCustomers - List all customers with optional filtering
    const { country, limit, offset } = req.query;

    let result = [...customersStore];

    // Filter by country if provided
    if (country && typeof country === "string") {
      result = result.filter(
        (c) => c.country.toLowerCase() === country.toLowerCase()
      );
    }

    // Pagination
    const limitNum = limit ? parseInt(limit as string, 10) : result.length;
    const offsetNum = offset ? parseInt(offset as string, 10) : 0;
    result = result.slice(offsetNum, offsetNum + limitNum);

    return res.status(200).json({
      customers: result,
      total: customersStore.length,
      filtered: result.length,
    });
  }

  if (req.method === "POST") {
    // createCustomer - Create a new customer
    const { name, email, phone, address, city, state, zip, country } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    // Check for duplicate email
    if (customersStore.some((c) => c.email === email)) {
      return res.status(400).json({ error: "Customer with this email already exists" });
    }

    const newCustomer: Customer = {
      id: nextId++,
      name,
      email,
      phone: phone || "",
      address: address || "",
      city: city || "",
      state: state || "",
      zip: zip || "",
      country: country || "USA",
      orderCount: 0,
    };

    customersStore.push(newCustomer);

    return res.status(201).json({
      message: "Customer created successfully",
      customer: newCustomer,
    });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
