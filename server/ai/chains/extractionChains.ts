import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { chatLLM } from "../llm/localLLM";

const prompt = PromptTemplate.fromTemplate(`
You are an RFP analyst. Extract the following information from the RFP text and return it as a JSON object:

- project_title: string
- budget: object with min, max, and currency fields
- security_clearance_required: string
- timeline: string
- contact: object with name, email, and phone fields

RFP TEXT:
{input}

Return only the JSON object, no additional text.
`);

export const extractionChain = RunnableSequence.from([prompt, chatLLM]);
