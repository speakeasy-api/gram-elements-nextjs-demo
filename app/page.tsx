"use client";
import { Chat, ElementsConfig, GramElementsProvider } from "@gram-ai/elements";
import "@gram-ai/elements/elements.css";
import { recommended } from "@gram-ai/elements/plugins";

const config: ElementsConfig = {
  projectSlug: "adamtest",
  mcp: "https://chat.speakeasy.com/mcp/speakeasy-team-my_api",
  chatEndpoint: "/api/chat",
  variant: "widget",
  welcome: {
    title: "Hello!",
    subtitle: "How can I help you today?",
    suggestions: [
      {
        title: "Generate chart",
        label: "Generate a chart",
        action: "Generate a chart for the following data: [1, 2, 3, 4, 5]",
      },
    ],
  },
  modal: {
    defaultOpen: true,
    expandable: true,
  },
  model: {
    showModelPicker: true,
    defaultModel: "openai/gpt-4o",
  },
  plugins: recommended,
};

export default function Home() {
  return (
    <GramElementsProvider config={config}>
      <Chat />
    </GramElementsProvider>
  );
}
