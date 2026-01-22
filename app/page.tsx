"use client";

import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { StatCard } from "./components/StatCard";
import { ProductCard } from "./components/ProductCard";
import { SalesChart } from "./components/SalesChart";
import { getTotalStats, getMonthlySales, getProductWithSales } from "./data/sales";

const stats = getTotalStats();
const monthlySales = getMonthlySales();
const productsWithSales = getProductWithSales();

export default function Home() {
  return (
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
    </div>
  );
}
