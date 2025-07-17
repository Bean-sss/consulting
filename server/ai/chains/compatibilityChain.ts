import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { chatLLM } from "../llm/localLLM";
import { getVectorStore } from "../vectorstore/pgvector";

const prompt = PromptTemplate.fromTemplate(`
You are a sourcing specialist. Given vendor proposal and client requirements,
output an overall compatibility score (0-100) and a short rationale in JSON.

Context: {context}
Question: {question}

Answer in JSON format with "score" and "rationale" fields.
`);

export const compatibilityChain = RunnableSequence.from([
  {
    context: RunnableSequence.from([
      (input: { query: string }) => input.query,
      (query: string) => getVectorStore().asRetriever(4).invoke(query),
      (docs: any[]) => docs.map(doc => doc.pageContent).join("\n")
    ]),
    question: (input: { query: string }) => input.query
  },
  prompt,
  chatLLM
]);
