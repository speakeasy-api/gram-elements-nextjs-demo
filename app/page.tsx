"use client";
import { Chat, ElementsConfig, GramElementsProvider } from "@gram-ai/elements";
import "@gram-ai/elements/elements.css";

const config: ElementsConfig = {
  projectSlug: "adamtest",
  mcp: "https://chat.speakeasy.com/mcp/speakeasy-team-my_api",
  chatEndpoint: "/api/chat",
  variant: "widget",
  welcome: {
    title: "Hello!",
    subtitle: "How can I help you today?",
    suggestions: [],
  },
  modal: {
    defaultOpen: true,
    expandable: true,
  },
  model: {
    showModelPicker: true,
    defaultModel: "openai/gpt-4o",
  },
};

export default function Home() {
  return (
    <GramElementsProvider config={config}>
      <Chat />
    </GramElementsProvider>
  );
}
