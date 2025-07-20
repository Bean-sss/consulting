import { PromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { chatLLM } from '../llm/localLLM';
import { getVectorStore } from '../vectorstore/pgvector';

// Types for better type safety
interface VendorCompatibilityInput {
  vendor_profile: string;
  rfp_requirements: string;
}

interface SimpleCompatibilityInput {
  query: string;
}

interface CompatibilityDocument {
  pageContent: string;
}

// Constants
const RETRIEVER_DOCUMENTS_COUNT = 4;

// Helper function to retrieve relevant context from vector store
async function getRelevantContext(query: string): Promise<string> {
  try {
    const vectorStore = getVectorStore();
    const retriever = vectorStore.asRetriever(RETRIEVER_DOCUMENTS_COUNT);
    const documents: CompatibilityDocument[] = await retriever.invoke(query);
    
    return documents
      .map(doc => doc.pageContent)
      .join('\n');
  } catch (error) {
    // Return empty context if retrieval fails
    return '';
  }
}

// Detailed compatibility analysis prompt template
const DETAILED_COMPATIBILITY_PROMPT = `
You are a sourcing specialist with expertise in defense contracting and vendor evaluation.

Given the vendor profile and RFP requirements below, provide a comprehensive compatibility analysis in JSON format.

VENDOR PROFILE:
{vendor_profile}

RFP REQUIREMENTS:
{rfp_requirements}

RELEVANT CONTEXT:
{context}

EVALUATION CRITERIA:
Assess the vendor's suitability based on these key factors:

1. CAPABILITY ALIGNMENT: How well vendor capabilities match required expertise
2. SECURITY CLEARANCE: Whether vendor clearance meets or exceeds requirements
3. RELEVANT EXPERIENCE: Quality and relevance of past project experience
4. CERTIFICATIONS: Possession of required industry certifications
5. BUDGET COMPETITIVENESS: Likelihood of competitive pricing within budget
6. DELIVERY TIMELINE: Ability to meet project timeline requirements

REQUIRED JSON OUTPUT:
{{
  "overall_score": number (0-100),
  "confidence_level": "low" | "medium" | "high",
  "detailed_scores": {{
    "capability_match": number (0-100),
    "clearance_match": number (0-100),
    "experience_match": number (0-100),
    "certification_match": number (0-100),
    "budget_competitiveness": number (0-100),
    "timeline_feasibility": number (0-100)
  }},
  "strengths": ["specific vendor advantages"],
  "weaknesses": ["potential risks or gaps"],
  "rationale": "clear explanation of scoring methodology",
  "win_probability": number (0-100),
  "risk_level": "low" | "medium" | "high",
  "competition_level": "low" | "medium" | "high",
  "estimated_cost": "realistic cost estimate",
  "key_differentiators": ["unique vendor advantages"],
  "recommendations": ["actionable recommendations for this match"]
}}

Ensure all scores are data-driven and well-justified.`;

// Simple compatibility analysis prompt template
const SIMPLE_COMPATIBILITY_PROMPT = `
You are a defense contracting specialist evaluating vendor-RFP compatibility.

CONTEXT: {context}
EVALUATION REQUEST: {question}

Provide a quick compatibility assessment with an overall score and clear reasoning.

REQUIRED JSON OUTPUT:
{{
  "score": number (0-100),
  "rationale": "concise explanation of the compatibility assessment"
}}

Base your assessment on capability alignment, experience relevance, and requirement fulfillment.`;

// Create prompt templates
const detailedCompatibilityPrompt = PromptTemplate.fromTemplate(DETAILED_COMPATIBILITY_PROMPT);
const simpleCompatibilityPrompt = PromptTemplate.fromTemplate(SIMPLE_COMPATIBILITY_PROMPT);

/**
 * Detailed compatibility analysis chain
 * Provides comprehensive vendor-RFP compatibility scoring with detailed breakdown
 */
export const detailedCompatibilityChain = RunnableSequence.from([
  {
    vendor_profile: (input: VendorCompatibilityInput) => input.vendor_profile,
    rfp_requirements: (input: VendorCompatibilityInput) => input.rfp_requirements,
    context: RunnableSequence.from([
      (input: VendorCompatibilityInput) => 
        `${input.vendor_profile} ${input.rfp_requirements}`,
      getRelevantContext
    ])
  },
  detailedCompatibilityPrompt,
  chatLLM
]);

/**
 * Simple compatibility analysis chain
 * Provides quick compatibility score and rationale for rapid evaluation
 */
export const compatibilityChain = RunnableSequence.from([
  {
    context: RunnableSequence.from([
      (input: SimpleCompatibilityInput) => input.query,
      getRelevantContext
    ]),
    question: (input: SimpleCompatibilityInput) => input.query
  },
  simpleCompatibilityPrompt,
  chatLLM
]);
