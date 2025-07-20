import { ChatOllama } from '@langchain/ollama';

// LLM Configuration Constants
const DEFAULT_MODEL = 'llama3';
const DEFAULT_BASE_URL = 'http://localhost:11434';
const DEFAULT_TEMPERATURE = 0.1;
const DEFAULT_TOP_P = 0.9;

// LLM Configuration Interface
interface LLMConfig {
  model: string;
  baseUrl: string;
  temperature: number;
  topP: number;
}

// Create LLM configuration
function createLLMConfig(): LLMConfig {
  return {
    model: process.env.OLLAMA_MODEL || DEFAULT_MODEL,
    baseUrl: process.env.OLLAMA_BASE_URL || DEFAULT_BASE_URL,
    temperature: DEFAULT_TEMPERATURE,
    topP: DEFAULT_TOP_P
  };
}

/**
 * Local LLM instance configured for defense RFP analysis
 * Uses Ollama with optimized settings for structured output generation
 */
export const chatLLM = new ChatOllama(createLLMConfig()); 