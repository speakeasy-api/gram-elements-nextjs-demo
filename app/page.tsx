"use client";
import {
  Chat,
  ElementsConfig,
  GramElementsProvider,
} from "@gram-ai/elements";
import "@gram-ai/elements/elements.css";
import { recommended } from "@gram-ai/elements/plugins";

import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { StatCard } from "./components/StatCard";
import { ProductCard } from "./components/ProductCard";
import { SalesChart } from "./components/SalesChart";
import { getTotalStats, getMonthlySales, getProductWithSales } from "./data/sales";

const getSession = async () => {
  return fetch("/api/session", {
    method: "POST",
    headers: { "Gram-Project": "nano-banana-stand" },
  })
    .then((res) => res.json())
    .then((data) => data.client_token);
};

const stats = getTotalStats();
const monthlySales = getMonthlySales();
const productsWithSales = getProductWithSales();

const config: ElementsConfig = {
  projectSlug: "nano-banana-stand",
  mcp: "https://app.getgram.ai/mcp/speakeasy-team-13kr2",
  variant: "widget",
  welcome: {
    title: "nano🍌 Assistant",
    subtitle: "Ask me about products, sales, or inventory!",
    suggestions: [
      {
        title: "View all products",
        label: "Get product catalog",
        prompt: "Show me all the banana products we have in stock",
      },
      {
        title: "Sales report",
        label: "Generate full report",
        prompt: "Generate a comprehensive sales report for the business",
      },
      {
        title: "Customer list",
        label: "View customers",
        prompt: "Show me our customer list grouped by country",
      },
      {
        title: "Organic bananas",
        label: "Filter by category",
        prompt: "What organic banana products do we sell?",
      },
    ],
  },
  modal: {
    defaultOpen: false,
    expandable: true,
    title: "nano🍌 Assistant",
    dimensions: {
      default: { width: 400, height: 600 },
      expanded: { width: 800, height: 700 },
    },
  },
  model: {
    showModelPicker: true,
    
  },
  tools: {
    expandToolGroupsByDefault: true,
    toolsRequiringApproval: () => true,
  },
  plugins: recommended,
  api: {
    sessionFn: getSession,
  },
};

export default function Home() {
  return (
    <GramElementsProvider config={config}>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="flex">
          <Sidebar />

          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Revenue"
              value={`$${stats.totalRevenue.toLocaleString()}`}
              icon="💰"
              trend={{ value: 12.5, isPositive: true }}
            />
            <StatCard
              title="Units Sold"
              value={stats.totalQuantity.toLocaleString()}
              icon="📦"
              trend={{ value: 8.2, isPositive: true }}
            />
            <StatCard
              title="Active Products"
              value={stats.activeProducts}
              icon="🍌"
            />
            <StatCard
              title="Avg. Price"
              value={`$${stats.avgOrderValue.toFixed(2)}`}
              icon="📊"
              trend={{ value: 2.1, isPositive: false }}
            />
          </div>

          {/* Sales Chart */}
          <div className="mb-8">
            <SalesChart data={monthlySales} />
          </div>

          {/* Products Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Products</h2>
              <span className="text-sm text-gray-500">
                {productsWithSales.length} products
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {productsWithSales.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </main>
        </div>

        {/* Chat Widget */}
        <Chat />
      </div>
    </GramElementsProvider>
  );
}
