"use client";

import Link from "next/link";
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

const config: ElementsConfig = {
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

export default function NewCustomerPage() {
  return (
    <GramElementsProvider config={config}>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/customers"
                className="text-gray-500 hover:text-gray-700 transition-colors"
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
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Add New Customer</h1>
                <p className="text-sm text-gray-500">
                  Use the AI assistant to onboard a new customer
                </p>
              </div>
            </div>
            <span className="text-2xl">🍌</span>
          </div>
        </header>

        {/* Full-width chat */}
        <div className="flex-1 flex flex-col">
          <Chat className="flex-1" />
        </div>
      </div>
    </GramElementsProvider>
  );
}
