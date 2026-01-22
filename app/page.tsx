"use client";
import {
  Chat,
  ElementsConfig,
  GramElementsProvider,
  ChatHistory,
} from "@gram-ai/elements";
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
        prompt: "Call all available tools",
      },
      {
        title: "Plot customer orders by country",
        label: "Generate a chart",
        prompt: `Show the following data in a bar chart by total order count for each country:\n ${JSON.stringify(
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
        width: 800,
        height: 700,
      },
      expanded: {
        width: 1000,
        height: 900,
      },
    },
  },
  model: {
    showModelPicker: true,
  },
  tools: {
    expandToolGroupsByDefault: true,

    // nolan: change this
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
      <div className="flex flex-row min-w-full min-h-screen justify-stretch">
        <Chat />
      </div>
    </GramElementsProvider>
  );
}
