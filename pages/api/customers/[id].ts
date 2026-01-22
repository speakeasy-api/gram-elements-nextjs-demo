import type { NextApiRequest, NextApiResponse } from "next";
import { customers } from "../../../app/data/customers";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // getCustomer - Get a single customer by ID
  const customerId = parseInt(id as string, 10);

  if (isNaN(customerId)) {
    return res.status(400).json({ error: "Invalid customer ID" });
  }

  const customer = customers.find((c) => c.id === customerId);

  if (!customer) {
    return res.status(404).json({ error: "Customer not found" });
  }

  return res.status(200).json({ customer });
}
