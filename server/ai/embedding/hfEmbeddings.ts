import { OllamaEmbeddings } from "@langchain/ollama";

export const hfEmbeddings = new OllamaEmbeddings({
  model: "nomic-embed-text",
  baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434"
});
