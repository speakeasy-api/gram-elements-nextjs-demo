import type { Product } from "../data/products";
import type { ProductSales } from "../data/sales";

type ProductWithSales = Product & ProductSales;

interface ProductCardProps {
  product: ProductWithSales;
}

export function ProductCard({ product }: ProductCardProps) {
  const stockStatus =
    product.stock > 500 ? "In Stock" : product.stock > 100 ? "Low Stock" : "Critical";
  const stockColor =
    product.stock > 500
      ? "bg-green-100 text-green-800"
      : product.stock > 100
        ? "bg-yellow-100 text-yellow-800"
        : "bg-red-100 text-red-800";

  const categoryColors: Record<string, string> = {
    fresh: "bg-blue-100 text-blue-800",
    organic: "bg-green-100 text-green-800",
    specialty: "bg-purple-100 text-purple-800",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <span className="text-5xl">{product.image}</span>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[product.category]}`}
        >
          {product.category}
        </span>
      </div>

      <h3 className="font-semibold text-gray-900 text-lg">{product.name}</h3>
      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-2xl font-bold text-yellow-600">
          ${product.price.toFixed(2)}
        </span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${stockColor}`}>
          {stockStatus}
        </span>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500">Units Sold</p>
            <p className="text-lg font-semibold text-gray-900">
              {product.totalQuantity.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Revenue</p>
            <p className="text-lg font-semibold text-green-600">
              ${product.totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <p className="text-xs text-gray-500 mb-1">Stock Level</p>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-yellow-500 h-2 rounded-full"
            style={{ width: `${Math.min((product.stock / 1500) * 100, 100)}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">{product.stock} units</p>
      </div>
    </div>
  );
}
