import { PromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { chatLLM } from '../llm/localLLM';

// Types for better type safety
interface ExtractionInput {
  input: string;
}

interface VendorMatchingInput {
  rfp_data: string;
}

// RFP Data Extraction Prompt
const RFP_EXTRACTION_PROMPT = `
You are a specialized RFP document analyst with expertise in defense contracting requirements.

Your task is to extract structured information from the provided RFP document text.

EXTRACTION REQUIREMENTS:
Parse the document and extract the following information into a valid JSON object:

REQUIRED FIELDS:
- project_title: The main project or contract title
- budget: Object containing {{min: number, max: number, currency: "USD"}}
- security_clearance_required: Required clearance level (e.g., "Secret", "Top Secret")
- timeline: Project duration (e.g., "36 months", "3 years")
- contact: Object with {{name: string, email: string, phone: string}}
- due_date: Proposal due date in YYYY-MM-DD format
- agency: Contracting agency or department name
- rfp_number: Official RFP or solicitation number
- description: Brief project description (max 200 characters)
- required_capabilities: Array of technical capabilities needed
- required_certifications: Array of required industry certifications
- categories: Array of relevant categories ["Defense", "IT", "Cybersecurity", etc.]

CRITICAL INSTRUCTIONS:
1. Return ONLY a valid JSON object
2. No additional text, explanations, or markdown formatting
3. If information is not found, use appropriate defaults:
   - Unknown strings: "Not specified"
   - Missing numbers: 0
   - Missing arrays: []
4. Ensure all extracted numbers are actual numbers, not strings

RFP DOCUMENT TEXT:
{input}

JSON OUTPUT:`;

// Vendor Matching Analysis Prompt
const VENDOR_MATCHING_PROMPT = `
You are a vendor sourcing strategist specializing in defense contracting.

Analyze the provided RFP data and determine the ideal vendor characteristics and market conditions.

RFP INFORMATION:
{rfp_data}

ANALYSIS REQUIREMENTS:
Based on the RFP requirements, assess what type of vendors would be most suitable and provide market intelligence.

REQUIRED JSON OUTPUT:
{{
  "ideal_capabilities": ["array of most critical capabilities"],
  "minimum_clearance": "required security clearance level",
  "expected_competition_level": "low" | "medium" | "high",
  "estimated_bidders": number (realistic estimate),
  "key_factors": ["critical factors for vendor selection"],
  "market_conditions": {{
    "difficulty_level": "low" | "medium" | "high",
    "typical_lead_time": "estimated timeline for vendor response",
    "budget_competitiveness": "assessment of budget vs market rates"
  }},
  "vendor_profile": {{
    "company_size": "small" | "medium" | "large" | "any",
    "experience_years": number,
    "geographic_preference": "location considerations if any"
  }}
}}

INSTRUCTIONS:
- Return ONLY the JSON object
- Base assessments on realistic market conditions
- Consider the complexity and requirements of the RFP`;

// Create prompt templates
const extractionPrompt = PromptTemplate.fromTemplate(RFP_EXTRACTION_PROMPT);
const vendorMatchingPrompt = PromptTemplate.fromTemplate(VENDOR_MATCHING_PROMPT);

/**
 * RFP Data Extraction Chain
 * Extracts structured information from RFP documents for processing
 */
export const extractionChain = RunnableSequence.from([
  {
    input: (input: ExtractionInput) => input.input
  },
  extractionPrompt,
  chatLLM
]);

/**
 * Vendor Matching Analysis Chain
 * Analyzes RFP requirements to determine ideal vendor characteristics
 */
export const vendorMatchingChain = RunnableSequence.from([
  {
    rfp_data: (input: VendorMatchingInput) => input.rfp_data
  },
  vendorMatchingPrompt,
  chatLLM
]);
