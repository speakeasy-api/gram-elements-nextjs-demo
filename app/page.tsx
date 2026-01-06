"use client";
import { Chat, ElementsConfig, GramElementsProvider } from "@gram-ai/elements";
import "@gram-ai/elements/elements.css";
import { recommended } from "@gram-ai/elements/plugins";
import { fakeCustomerAndOrderData } from "./fakeData";

const config: ElementsConfig = {
  projectSlug: "adamtest",
  mcp: "https://chat.speakeasy.com/mcp/speakeasy-team-my_api",
  variant: "widget",
  welcome: {
    title: "Hello!",
    subtitle: "How can I help you today?",
    suggestions: [
      {
        title: "Call all available tools",
        label: "Tool calling demonstration",
        action: "Call all available tools",
      },
      {
        title: "Plot customer orders by country",
        label: "Generate a chart",
        action: `Show the following data in a bar chart by total order count for each country:\n ${JSON.stringify(
          fakeCustomerAndOrderData
        )}`,
      },
    ],
  },
  modal: {
    defaultOpen: true,
    expandable: true,
    title: "Chat with me",
    dimensions: {
      default: {
        width: 1000,
        height: 1000,
      },
      expanded: {
        width: 1200,
        height: 800,
      },
    },
  },
  model: {
    showModelPicker: true,
  },
  tools: {
    expandToolGroupsByDefault: true,
  },
  plugins: recommended,
};

async function getSession() {
  return fetch("/api/session", { method: "POST" })
    .then((res) => res.json())
    .then((data) => data.client_token);
}

export default function Home() {
  return (
    <GramElementsProvider config={config} getSession={getSession}>
      <Chat />
    </GramElementsProvider>
  );
}
