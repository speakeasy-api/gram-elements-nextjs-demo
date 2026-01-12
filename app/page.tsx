"use client";
import { Chat, ElementsConfig, GramElementsProvider } from "@gram-ai/elements";
import "@gram-ai/elements/elements.css";
import { recommended } from "@gram-ai/elements/plugins";
import { fakeCustomerAndOrderData } from "./fakeData";

// We require a custom session function because our session endpoint is mounted on a non-standard path
// (e.g Elements expects /chat/session, but our session endpoint is mounted on /api/session)
const getSession = async () => {
  return fetch("/api/session", {
    method: "POST",
    headers: { "Gram-Project": "adamtest" },
  })
    .then((res) => res.json())
    .then((data) => data.client_token);
};

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
  api: {
    sessionFn: getSession,
  },
};

export default function Home() {
  return (
    <GramElementsProvider config={config}>
      <Chat />
    </GramElementsProvider>
  );
}
