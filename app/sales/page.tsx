"use client";

import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { StatCard } from "../components/StatCard";
import { SalesChart } from "../components/SalesChart";
import { getTotalStats, getMonthlySales, getProductWithSales } from "../data/sales";

const stats = getTotalStats();
const monthlySales = getMonthlySales();
const productsWithSales = getProductWithSales();

// Sort by revenue to get top sellers
const topSellers = [...productsWithSales].sort((a, b) => b.totalRevenue - a.totalRevenue);

export default function SalesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Sales</h1>
            <p className="text-gray-500 mt-1">Track revenue and performance</p>
          </div>

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
              title="Avg. Order Value"
              value={`$${stats.avgOrderValue.toFixed(2)}`}
              icon="🧾"
              trend={{ value: 3.1, isPositive: true }}
            />
            <StatCard
              title="Conversion Rate"
              value="4.2%"
              icon="📈"
              trend={{ value: 0.8, isPositive: true }}
            />
          </div>

          {/* Sales Chart */}
          <div className="mb-8">
            <SalesChart data={monthlySales} />
          </div>

          {/* Top Sellers Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h3>
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
                  <th className="pb-3 font-medium">Product</th>
                  <th className="pb-3 font-medium">Category</th>
                  <th className="pb-3 font-medium text-right">Units Sold</th>
                  <th className="pb-3 font-medium text-right">Revenue</th>
                  <th className="pb-3 font-medium text-right">Avg. Price</th>
                </tr>
              </thead>
              <tbody>
                {topSellers.map((product, index) => (
                  <tr key={product.id} className="border-b border-gray-50 last:border-0">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{product.image}</span>
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">#{index + 1} Best Seller</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.category === "fresh" ? "bg-blue-100 text-blue-800" :
                        product.category === "organic" ? "bg-green-100 text-green-800" :
                        "bg-purple-100 text-purple-800"
                      }`}>
                        {product.category}
                      </span>
                    </td>
                    <td className="py-4 text-right font-medium text-gray-900">
                      {product.totalQuantity.toLocaleString()}
                    </td>
                    <td className="py-4 text-right font-medium text-green-600">
                      ${product.totalRevenue.toLocaleString()}
                    </td>
                    <td className="py-4 text-right text-gray-500">
                      ${product.price.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
