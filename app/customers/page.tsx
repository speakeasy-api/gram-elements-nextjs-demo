"use client";

import { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { customers, getTotalCustomerStats, getCustomersByCountry, type Customer } from "../data/customers";
import {
  Chat,
  ElementsConfig,
  GramElementsProvider,
} from "@gram-ai/elements";
import "@gram-ai/elements/elements.css";
import { recommended } from "@gram-ai/elements/plugins";

const getSession = async () => {
  return fetch("/api/session", {
    method: "POST",
    headers: { "Gram-Project": "nano-banana-stand" },
  })
    .then((res) => res.json())
    .then((data) => data.client_token);
};

const newCustomerConfig: ElementsConfig = {
  projectSlug: "nano-banana-stand",
  mcp: "https://app.getgram.ai/mcp/speakeasy-team-13kr2",
  variant: "standalone",
  welcome: {
    title: "Customer Onboarding",
    subtitle: "I'll help you add a new customer to the system.",
    suggestions: [
      {
        title: "Start onboarding",
        label: "Add new customer",
        prompt: "I'd like to onboard a new customer. Please guide me through the process.",
      },
      {
        title: "Bulk import",
        label: "Import multiple",
        prompt: "I need to add multiple customers. What information do you need for each?",
      },
    ],
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

const countries = ["All", ...Array.from(new Set(customers.map((c) => c.country))).sort()];

export default function CustomersPage() {
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);
  const stats = getTotalCustomerStats();
  const customersByCountry = getCustomersByCountry();

  const filteredCustomers = selectedCountry === "All"
    ? customers
    : customers.filter((c) => c.country === selectedCountry);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isNewCustomerModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isNewCustomerModalOpen]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
              <p className="text-gray-500 mt-1">
                {stats.totalCustomers} customers across {stats.countries} countries
              </p>
            </div>
            <button
              onClick={() => setIsNewCustomerModalOpen(true)}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition-colors flex items-center gap-2"
            >
              <span>+</span>
              Add Customer
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">👥</span>
                <div>
                  <p className="text-sm text-gray-500">Total Customers</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">📦</span>
                <div>
                  <p className="text-sm text-gray-500">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOrders.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🌍</span>
                <div>
                  <p className="text-sm text-gray-500">Countries</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.countries}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">📊</span>
                <div>
                  <p className="text-sm text-gray-500">Avg Orders/Customer</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.avgOrdersPerCustomer}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filter */}
          <div className="mb-6 flex items-center gap-4">
            <label htmlFor="country-filter" className="text-sm font-medium text-gray-700">
              Filter by Country:
            </label>
            <select
              id="country-filter"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            >
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country} {country !== "All" && `(${customers.filter((c) => c.country === country).length})`}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-500">
              Showing {filteredCustomers.length} customer{filteredCustomers.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Customers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCustomers.map((customer) => (
              <CustomerCard key={customer.id} customer={customer} />
            ))}
          </div>

          {/* Top Countries Section */}
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Top Countries by Orders</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customers</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Orders</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Orders</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {customersByCountry.slice(0, 10).map((country, idx) => (
                    <tr key={country.country} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{country.country}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{country.customerCount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{country.totalOrders}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {Math.round(country.totalOrders / country.customerCount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* New Customer Modal */}
      {isNewCustomerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsNewCustomerModalOpen(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] mx-4 flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Add New Customer</h2>
                <p className="text-sm text-gray-500">
                  Use the AI assistant to onboard a new customer
                </p>
              </div>
              <button
                onClick={() => setIsNewCustomerModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Chat Content */}
            <div className="flex-1 min-h-0 relative">
              <GramElementsProvider config={newCustomerConfig}>
                <div className="absolute inset-0 overflow-y-auto">
                  <Chat />
                </div>
              </GramElementsProvider>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CustomerCard({ customer }: { customer: Customer }) {
  const orderTier = customer.orderCount >= 80 ? "gold" : customer.orderCount >= 50 ? "silver" : "bronze";
  const tierColors = {
    gold: "bg-yellow-100 text-yellow-800",
    silver: "bg-gray-100 text-gray-800",
    bronze: "bg-orange-100 text-orange-800",
  };
  const tierLabels = {
    gold: "Gold",
    silver: "Silver",
    bronze: "Bronze",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <span className="text-4xl">👤</span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${tierColors[orderTier]}`}>
          {tierLabels[orderTier]}
        </span>
      </div>

      <h3 className="font-semibold text-gray-900 text-lg">{customer.name}</h3>
      <p className="text-sm text-yellow-600 font-medium">{customer.country}</p>
      <p className="text-sm text-gray-500 mt-1">{customer.email}</p>
      <p className="text-sm text-gray-500">{customer.city}, {customer.state}</p>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Orders</span>
          <span className="text-lg font-bold text-gray-900">{customer.orderCount}</span>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-yellow-500 h-2 rounded-full"
            style={{ width: `${Math.min(customer.orderCount, 100)}%` }}
          />
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
          Contact
        </button>
        <button className="flex-1 px-3 py-2 text-sm font-medium text-yellow-700 bg-yellow-100 rounded-lg hover:bg-yellow-200 transition-colors">
          View Orders
        </button>
      </div>
    </div>
  );
}
