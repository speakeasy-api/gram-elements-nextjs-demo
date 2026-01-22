import { Gram } from "@gram-ai/functions";
import * as z from "zod/mini";
import {
  products,
  customers,
  getProductWithSales,
  getMonthlySales,
  getTotalStats,
  getCustomersByCountry,
  type Product,
  type Customer,
} from "./data.ts";

// In-memory stores for created items
const createdCustomers: Customer[] = [];
const createdProducts: Product[] = [];
let nextCustomerId = customers.length + 1;

const gram = new Gram()
  .tool({
    name: "greet",
    description: "Greet someone special",
    inputSchema: { name: z.string() },
    async execute(ctx, input) {
      return ctx.json({ message: `Hello, ${input.name}!` });
    },
  })
  .tool({
    name: "get-customers",
    description:
      "Get a list of all customers. Optionally filter by country or paginate results. Parameters: country (string) - filter by country name, limit (number) - max results, offset (number) - skip for pagination.",
    inputSchema: {
      country: z.optional(z.string()),
      limit: z.optional(z.number()),
      offset: z.optional(z.number()),
    },
    async execute(ctx, input) {
      let result = [...customers, ...createdCustomers];

      // Filter by country if provided
      if (input.country) {
        result = result.filter(
          (c) => c.country.toLowerCase() === input.country!.toLowerCase()
        );
      }

      // Pagination
      const limitNum = input.limit || result.length;
      const offsetNum = input.offset || 0;
      result = result.slice(offsetNum, offsetNum + limitNum);

      return ctx.json({
        customers: result,
        total: customers.length + createdCustomers.length,
        filtered: result.length,
      });
    },
  })
  .tool({
    name: "get-customer",
    description:
      "Get detailed information about a specific customer by their ID. Parameters: id (number) - the unique customer identifier.",
    inputSchema: {
      id: z.number(),
    },
    async execute(ctx, input) {
      const customerId = input["id"];
      const allCustomers = [...customers, ...createdCustomers];
      const customer = allCustomers.find((c) => c.id === customerId);

      if (!customer) {
        return ctx.json({ error: "Customer not found" });
      }

      return ctx.json({ customer });
    },
  })
  .tool({
    name: "create-customer",
    description:
      "Create a new customer. Required: name (string), email (string). Optional: phone, address, city, state, zip, country (defaults to USA).",
    inputSchema: {
      name: z.string(),
      email: z.string(),
      phone: z.optional(z.string()),
      address: z.optional(z.string()),
      city: z.optional(z.string()),
      state: z.optional(z.string()),
      zip: z.optional(z.string()),
      country: z.optional(z.string()),
    },
    async execute(ctx, input) {
      const allCustomers = [...customers, ...createdCustomers];

      // Check for duplicate email
      if (allCustomers.some((c) => c.email === input.email)) {
        return ctx.json({ error: "Customer with this email already exists" });
      }

      const newCustomer: Customer = {
        id: nextCustomerId++,
        name: input.name,
        email: input.email,
        phone: input.phone || "",
        address: input.address || "",
        city: input.city || "",
        state: input.state || "",
        zip: input.zip || "",
        country: input.country || "USA",
        orderCount: 0,
      };

      createdCustomers.push(newCustomer);

      return ctx.json({
        message: "Customer created successfully",
        customer: newCustomer,
      });
    },
  })
  .tool({
    name: "get-products",
    description:
      "Get a list of all banana products. Optional filters: category ('fresh', 'organic', 'specialty'), minPrice (number), maxPrice (number).",
    inputSchema: {
      category: z.optional(z.enum(["fresh", "organic", "specialty"])),
      minPrice: z.optional(z.number()),
      maxPrice: z.optional(z.number()),
    },
    async execute(ctx, input) {
      let result = [...products, ...createdProducts];

      // Filter by category if provided
      if (input.category) {
        result = result.filter((p) => p.category === input.category);
      }

      // Filter by price range
      if (input.minPrice !== undefined) {
        result = result.filter((p) => p.price >= input.minPrice!);
      }
      if (input.maxPrice !== undefined) {
        result = result.filter((p) => p.price <= input.maxPrice!);
      }

      return ctx.json({
        products: result,
        total: products.length + createdProducts.length,
        filtered: result.length,
      });
    },
  })
  .tool({
    name: "get-product",
    description:
      "Get detailed information about a specific banana product by ID, including sales data. Parameters: id (string) - product ID like 'cavendish', 'red-banana', 'plantain'.",
    inputSchema: {
      id: z.string(),
    },
    async execute(ctx, input) {
      const productId = input["id"];
      const allProducts = [...products, ...createdProducts];
      const product = allProducts.find((p) => p.id === productId);

      if (!product) {
        return ctx.json({ error: "Product not found" });
      }

      // Get product with sales data
      const productsWithSales = getProductWithSales();
      const productWithSales = productsWithSales.find((p) => p.id === productId);

      return ctx.json({
        product: productWithSales || product,
      });
    },
  })
  .tool({
    name: "create-product",
    description:
      "Create a new banana product. Required: name (string), price (number), category ('fresh', 'organic', 'specialty'). Optional: description (string), stock (number).",
    inputSchema: {
      name: z.string(),
      description: z.optional(z.string()),
      price: z.number(),
      category: z.enum(["fresh", "organic", "specialty"]),
      stock: z.optional(z.number()),
    },
    async execute(ctx, input) {
      // Generate a slug ID from the name
      const id = input.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const allProducts = [...products, ...createdProducts];

      // Check for duplicate ID
      if (allProducts.some((p) => p.id === id)) {
        return ctx.json({ error: "Product with this name already exists" });
      }

      const newProduct: Product = {
        id,
        name: input.name,
        description: input.description || "",
        price: input.price,
        image: "🍌",
        category: input.category,
        stock: input.stock || 0,
      };

      createdProducts.push(newProduct);

      return ctx.json({
        message: "Product created successfully",
        product: newProduct,
      });
    },
  })
  .tool({
    name: "onboard-customer",
    description:
      "Onboard a new customer with full details. This is the preferred tool for the customer onboarding flow. Required: name (string), email (string), phone (string), address (string), city (string), state (string), zip (string), country (string). Returns the created customer with a welcome message.",
    inputSchema: {
      name: z.string(),
      email: z.string(),
      phone: z.string(),
      address: z.string(),
      city: z.string(),
      state: z.string(),
      zip: z.string(),
      country: z.string(),
    },
    async execute(ctx, input) {
      const allCustomers = [...customers, ...createdCustomers];

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.email)) {
        return ctx.json({
          success: false,
          error: "Invalid email format. Please provide a valid email address."
        });
      }

      // Check for duplicate email
      if (allCustomers.some((c) => c.email.toLowerCase() === input.email.toLowerCase())) {
        return ctx.json({
          success: false,
          error: "A customer with this email already exists in the system."
        });
      }

      const newCustomer: Customer = {
        id: nextCustomerId++,
        name: input.name,
        email: input.email,
        phone: input.phone,
        address: input.address,
        city: input.city,
        state: input.state,
        zip: input.zip,
        country: input.country,
        orderCount: 0,
      };

      createdCustomers.push(newCustomer);

      return ctx.json({
        success: true,
        message: `Customer "${newCustomer.name}" has been successfully onboarded!`,
        customer: newCustomer,
        summary: {
          customerId: newCustomer.id,
          fullName: newCustomer.name,
          email: newCustomer.email,
          location: `${newCustomer.city}, ${newCustomer.state}, ${newCustomer.country}`,
          status: "Active",
          tier: "Bronze (New Customer)",
        },
        nextSteps: [
          "Customer can now place orders",
          "Send welcome email with account details",
          "Assign a sales representative if needed",
        ],
      });
    },
  })
  .tool({
    name: "create-sales-report",
    description:
      "Generate a comprehensive sales report with revenue, top sellers, category breakdown, and customer data. Optional: type ('full' or 'summary'), startDate (YYYY-MM), endDate (YYYY-MM).",
    inputSchema: {
      type: z.optional(z.enum(["full", "summary"])),
      startDate: z.optional(z.string()),
      endDate: z.optional(z.string()),
    },
    async execute(ctx, input) {
      const stats = getTotalStats();
      const monthlySales = getMonthlySales();
      const productsWithSales = getProductWithSales();
      const customersByCountry = getCustomersByCountry();

      // Filter monthly sales by date range if provided
      let filteredMonthlySales = monthlySales;
      if (input.startDate) {
        filteredMonthlySales = filteredMonthlySales.filter(
          (s) => s.month >= input.startDate!
        );
      }
      if (input.endDate) {
        filteredMonthlySales = filteredMonthlySales.filter(
          (s) => s.month <= input.endDate!
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
      const categoryBreakdown: Record<string, { revenue: number; quantity: number; products: number }> = {};
      for (const product of productsWithSales) {
        const cat = product.category;
        if (!categoryBreakdown[cat]) {
          categoryBreakdown[cat] = { revenue: 0, quantity: 0, products: 0 };
        }
        const entry = categoryBreakdown[cat]!;
        entry.revenue += product.totalRevenue;
        entry.quantity += product.totalQuantity;
        entry.products += 1;
      }

      const totalCustomerOrders = customers.reduce((sum, c) => sum + c.orderCount, 0);
      const countriesServed = new Set(customers.map((c) => c.country)).size;

      const report = {
        generatedAt: new Date().toISOString(),
        reportType: input.type || "full",
        dateRange: {
          start: input.startDate || monthlySales[0]?.month || null,
          end: input.endDate || monthlySales[monthlySales.length - 1]?.month || null,
        },
        summary: {
          totalRevenue: stats.totalRevenue,
          totalUnitsSold: stats.totalQuantity,
          activeProducts: stats.activeProducts,
          averagePrice: stats.avgOrderValue,
          totalCustomers: customers.length,
          totalCustomerOrders,
          countriesServed,
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

      return ctx.json({
        message: "Sales report generated successfully",
        report,
      });
    },
  });

export default gram;
