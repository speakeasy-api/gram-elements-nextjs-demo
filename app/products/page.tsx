"use client";

import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { ProductCard } from "../components/ProductCard";
import { getProductWithSales } from "../data/sales";

const productsWithSales = getProductWithSales();

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-500 mt-1">Manage your banana inventory</p>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition-colors">
              All Products
            </button>
            <button className="px-4 py-2 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors border border-gray-200">
              Fresh
            </button>
            <button className="px-4 py-2 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors border border-gray-200">
              Organic
            </button>
            <button className="px-4 py-2 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors border border-gray-200">
              Specialty
            </button>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productsWithSales.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Add Product Button */}
          <div className="mt-8 flex justify-center">
            <button className="px-6 py-3 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition-colors flex items-center gap-2">
              <span className="text-xl">+</span>
              Add New Product
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
