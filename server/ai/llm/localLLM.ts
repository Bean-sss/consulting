import { ChatOllama } from "@langchain/ollama";

export const chatLLM = new ChatOllama({
  model: "llama3",
  baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
  temperature:0.1,
  topP: 0.9
}); 