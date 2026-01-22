"use client";

import { usePathname } from "next/navigation";
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

export function ChatWidget() {
  const pathname = usePathname();
  const isOverviewPage = pathname === "/";

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
      defaultOpen: isOverviewPage,
      expandable: true,
      title: "nano🍌 Assistant",
      dimensions: {
        default: { width: 600, height: 700 },
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

  return (
    <GramElementsProvider config={config}>
      <Chat />
    </GramElementsProvider>
  );
}
