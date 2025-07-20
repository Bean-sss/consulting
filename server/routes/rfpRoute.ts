import { Router, Request, Response } from "express";
import multer from "multer";
import fs from "fs/promises";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { extractionChain, vendorMatchingChain } from "../ai/chains/extractionChains";
import { detailedCompatibilityChain } from "../ai/chains/compatibilityChain";
import { loadPDF } from "../ai/loader/pdfLoader";
import { loadDOCX } from "../ai/loader/docxLoader";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { getVectorStore } from "../ai/vectorstore/pgvector";

const router = Router();
const upload = multer({ dest: "uploads/" });

// Create new RFP from form data
router.post("/create-rfp", async (req: Request, res: Response) => {
  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
      return res.status(500).json({ error: "Missing SUPABASE_URL or SUPABASE_KEY in environment" });
    }

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    const {
      project_title,
      rfp_number,
      agency,
      due_date,
      budget_min,
      budget_max,
      currency = 'USD',
      security_clearance,
      timeline,
      description,
      required_capabilities,
      required_certifications,
      technical_requirements,
      contact_name,
      contact_email,
      contact_phone,
      status = 'draft'
    } = req.body;

    // Validate required fields
    if (!project_title || !agency || !due_date) {
      return res.status(400).json({ 
        error: "project_title, agency, and due_date are required" 
      });
    }

    // Create RFP
    const { data: rfp, error: rfpError } = await supabase
      .from("rfp_metadata")
      .insert({
        project_title,
        rfp_number: rfp_number || `RFP-${Date.now()}`,
        agency,
        due_date,
        budget_min: budget_min ? parseFloat(budget_min) : null,
        budget_max: budget_max ? parseFloat(budget_max) : null,
        currency,
        security_clearance,
        timeline,
        description,
        requirements: required_capabilities || [],
        categories: technical_requirements || [],
        contact_name,
        contact_email,
        contact_phone,
        status,
        document: `rfp_${Date.now()}.json` // Placeholder document reference
      })
      .select()
      .single();

    if (rfpError) {
      // Handle duplicate RFP number by generating a unique one
      if (rfpError.code === '23505' && rfpError.message.includes('rfp_number')) {
        const originalRfpNumber = rfp_number || `RFP-${Date.now()}`;
        const uniqueRfpNumber = `${originalRfpNumber}-${Date.now()}`;
        
        const { data: retryRfp, error: retryError } = await supabase
          .from("rfp_metadata")
          .insert({
            project_title,
            rfp_number: uniqueRfpNumber,
            agency,
            due_date,
            budget_min: budget_min ? parseFloat(budget_min) : null,
            budget_max: budget_max ? parseFloat(budget_max) : null,
            currency,
            security_clearance,
            timeline,
            description,
            requirements: required_capabilities || [],
            categories: technical_requirements || [],
            contact_name,
            contact_email,
            contact_phone,
            status,
            document: `rfp_${Date.now()}.json` // Placeholder document reference
          })
          .select()
          .single();
          
        if (retryError) {
          return res.status(500).json({ error: "Failed to create RFP after handling duplicate" });
        }
        
        // Use the successfully created RFP with unique number
        const finalRfp = retryRfp;
        
        res.json({ 
          rfp: finalRfp,
          message: `RFP created successfully (RFP number was adjusted to ${uniqueRfpNumber} to ensure uniqueness)` 
        });

        // If status is active, calculate compatibility scores in background
        if (status === 'active') {
          calculateVendorCompatibilityScores(supabase, finalRfp.id, {
            project_title,
            budget_min,
            budget_max,
            currency,
            security_clearance,
            timeline,
            description,
            requirements: required_capabilities || [],
            categories: technical_requirements || []
          }).catch(() => {
            // Silently handle errors in background processing
          });
        }

        return;
      }
      
      return res.status(500).json({ error: "Failed to create RFP" });
    }

    // Return success immediately, then calculate compatibility scores in background
    res.json({ 
      rfp,
      message: "RFP created successfully" 
    });

    // If status is active, calculate compatibility scores in background
    if (status === 'active') {
      // Don't await - let this run in background
      calculateVendorCompatibilityScores(supabase, rfp.id, {
        project_title,
        budget_min,
        budget_max,
        currency,
        security_clearance,
        timeline,
        description,
        requirements: required_capabilities || [],
        categories: technical_requirements || []
      }).catch(() => {
        // Silently handle errors in background processing
      });
    }

  } catch (error) {
    res.status(500).json({ error: "Failed to create RFP" });
  }
});

// Enhanced RFP upload with automatic vendor matching
router.post("/upload-rfp-enhanced", upload.single("file"), async (req: Request, res: Response) => {
  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
      return res.status(500).json({ error: "Missing SUPABASE_URL or SUPABASE_KEY in environment" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    const tmpFilePath = req.file.path;
    const fileBuffer = await fs.readFile(tmpFilePath);
    const originalName = req.file.originalname;
    const fileExtension = path.extname(originalName).toLowerCase();

    // Upload file to storage
    const { data: stored, error: storeErr } = await supabase
      .storage
      .from("documents")
      .upload(
        `rfps/${Date.now()}_${originalName}`,
        fileBuffer,
        { upsert: false }
      );
    
    if (storeErr) throw storeErr;
    const documentKey = stored.path;

    // Process document content
    let docs;
    try {
      if (fileExtension === '.pdf') {
        docs = await loadPDF(tmpFilePath);
      } else if (fileExtension === '.docx') {
        docs = await loadDOCX(tmpFilePath);
      } else if (fileExtension === '.txt') {
        const textContent = await fs.readFile(tmpFilePath, 'utf-8');
        docs = [{
          pageContent: textContent,
          metadata: { source: originalName }
        }];
      } else {
        throw new Error(`Unsupported file type: ${fileExtension}`);
      }
    } catch (loadError) {
      return res.status(400).json({ 
        error: `Failed to process file: ${loadError instanceof Error ? loadError.message : 'Unknown error'}` 
      });
    }

    // Split and store document chunks
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 100
    });
    const splitDocs = await splitter.splitDocuments(docs);
    const docsWithMetadata = splitDocs.map(doc => ({
      ...doc,
      metadata: { ...doc.metadata, documentKey }
    }));
    
    try {
      await getVectorStore().addDocuments(docsWithMetadata);
    } catch (vectorError) {
      // Store in database without embeddings as fallback
      for (const doc of docsWithMetadata) {
        await supabase
          .from('rfp_chunks')
          .insert({
            content: doc.pageContent,
            metadata: doc.metadata
          });
      }
    }

    // Extract RFP metadata using enhanced AI
    const fullText = splitDocs.map(d => d.pageContent).join("\n");
    const extractionResult = await extractionChain.invoke({ input: fullText });
    
    let extracted: any;
    try {
      const content = extractionResult.content as string;
      
      // Try to extract JSON from the response, handling various formats
      let jsonString = content.trim();
      
      // Remove markdown code blocks if present
      if (jsonString.includes('```json')) {
        const jsonMatch = jsonString.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          jsonString = jsonMatch[1].trim();
        }
      } else if (jsonString.includes('```')) {
        const jsonMatch = jsonString.match(/```\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          jsonString = jsonMatch[1].trim();
        }
      }
      
      // Remove any leading/trailing text that might not be JSON
      const jsonStart = jsonString.indexOf('{');
      const jsonEnd = jsonString.lastIndexOf('}');
      
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        jsonString = jsonString.substring(jsonStart, jsonEnd + 1);
      }
      
      extracted = JSON.parse(jsonString);
      
      // Enhanced field mapping and cleanup
      if (extracted) {
        // Extract timeline from various patterns
        if (!extracted.timeline || extracted.timeline === "") {
          const timelinePatterns = [
            /contract duration[:\s]*([^.\n]+)/i,
            /project duration[:\s]*([^.\n]+)/i,
            /timeline[:\s]*([^.\n]+)/i,
            /(\d+)\s*months?/i,
            /(\d+)\s*years?/i
          ];
          
          for (const pattern of timelinePatterns) {
            const match = fullText.match(pattern);
            if (match) {
              extracted.timeline = match[1].trim();
              break;
            }
          }
        }
        
        // Ensure budget values are properly extracted
        if (extracted.budget) {
          if (typeof extracted.budget.min === 'string') {
            extracted.budget.min = parseInt(extracted.budget.min.replace(/[,$]/g, '')) || 0;
          }
          if (typeof extracted.budget.max === 'string') {
            extracted.budget.max = parseInt(extracted.budget.max.replace(/[,$]/g, '')) || 0;
          }
        }
        
        // Clean up contact information
        if (extracted.contact) {
          if (extracted.contact.name && extracted.contact.name.includes(',')) {
            extracted.contact.name = extracted.contact.name.split(',')[0].trim();
          }
        }
        
        // Ensure categories are populated if empty
        if (!extracted.categories || extracted.categories.length === 0) {
          extracted.categories = ["Defense", "IT"];
          if (extracted.required_capabilities) {
            if (extracted.required_capabilities.some((cap: string) => cap.toLowerCase().includes('cyber'))) {
              extracted.categories.push("Cybersecurity");
            }
            if (extracted.required_capabilities.some((cap: string) => cap.toLowerCase().includes('ai') || cap.toLowerCase().includes('machine learning'))) {
              extracted.categories.push("AI/ML");
            }
          }
        }
      }
    } catch (parseError) {
      // Fallback with more robust defaults
      extracted = {
        project_title: "Extracted Document",
        budget: { min: 0, max: 0, currency: "USD" },
        security_clearance_required: "Unknown",
        timeline: "Not specified",
        contact: { name: "Unknown", email: "unknown@example.com", phone: "Unknown" },
        due_date: null,
        agency: "Unknown",
        rfp_number: `RFP-${Date.now()}`,
        description: "Document uploaded for analysis",
        required_capabilities: [],
        required_certifications: [],
        categories: []
      };
    }

    // Create RFP entry
    const { data: rfp, error: rfpError } = await supabase
      .from("rfp_metadata")
      .insert({
        document: documentKey,
        project_title: extracted.project_title || "Unknown",
        rfp_number: extracted.rfp_number || `RFP-${Date.now()}`,
        agency: extracted.agency || "Unknown",
        due_date: extracted.due_date || null,
        budget_min: extracted.budget?.min || 0,
        budget_max: extracted.budget?.max || 0,
        currency: extracted.budget?.currency || "USD",
        security_clearance: extracted.security_clearance_required || "Unknown",
        timeline: extracted.timeline || "Unknown",
        description: extracted.description || "No description available",
        requirements: extracted.required_capabilities || [],
        categories: extracted.categories || [],
        contact_name: extracted.contact?.name || "Unknown",
        contact_email: extracted.contact?.email || "unknown@example.com",
        contact_phone: extracted.contact?.phone || "Unknown",
        status: 'active'
      })
      .select()
      .single();

    if (rfpError) {
      // Handle duplicate RFP number by generating a unique one
      if (rfpError.code === '23505' && rfpError.message.includes('rfp_number')) {
        const uniqueRfpNumber = `${extracted.rfp_number || 'RFP'}-${Date.now()}`;
        
        const { data: retryRfp, error: retryError } = await supabase
          .from("rfp_metadata")
          .insert({
            document: documentKey,
            project_title: extracted.project_title || "Unknown",
            rfp_number: uniqueRfpNumber,
            agency: extracted.agency || "Unknown",
            due_date: extracted.due_date || null,
            budget_min: extracted.budget?.min || 0,
            budget_max: extracted.budget?.max || 0,
            currency: extracted.budget?.currency || "USD",
            security_clearance: extracted.security_clearance_required || "Unknown",
            timeline: extracted.timeline || "Unknown",
            description: extracted.description || "No description available",
            requirements: extracted.required_capabilities || [],
            categories: extracted.categories || [],
            contact_name: extracted.contact?.name || "Unknown",
            contact_email: extracted.contact?.email || "unknown@example.com",
            contact_phone: extracted.contact?.phone || "Unknown",
            status: 'active'
          })
          .select()
          .single();
          
        if (retryError) {
          return res.status(500).json({ error: "Failed to create RFP entry after handling duplicate" });
        }
        
        // Use the successfully created RFP with unique number
        const finalRfp = retryRfp;
        extracted.rfp_number = uniqueRfpNumber; // Update extracted data to reflect the new number
        
        // Get vendor matching analysis for the retry case
        let retryVendorMatchingAnalysis: any = null;
        try {
          const vendorMatchingResult = await vendorMatchingChain.invoke({
            rfp_data: JSON.stringify(extracted)
          });
          retryVendorMatchingAnalysis = JSON.parse(vendorMatchingResult.content as string);
            } catch (matchingError) {
      // Continue without vendor matching analysis
    }
        
        // Continue with vendor compatibility scoring
        await calculateVendorCompatibilityScores(supabase, finalRfp.id, extracted, retryVendorMatchingAnalysis);

        // Clean up temp file
        await fs.unlink(tmpFilePath);

        res.json({ 
          rfp: finalRfp,
          extracted_data: extracted,
          vendor_matching_analysis: retryVendorMatchingAnalysis,
          message: "RFP uploaded and analyzed successfully (RFP number was adjusted to ensure uniqueness)"
        });
        return;
      }
      
      return res.status(500).json({ error: "Failed to create RFP entry" });
    }

    // Get vendor matching analysis
    let vendorMatchingAnalysis: any = null;
    try {
      const vendorMatchingResult = await vendorMatchingChain.invoke({
        rfp_data: JSON.stringify(extracted)
      });
      vendorMatchingAnalysis = JSON.parse(vendorMatchingResult.content as string);
    } catch (matchingError) {
      // Continue without vendor matching analysis
    }

    // Calculate compatibility scores for all vendors
    await calculateVendorCompatibilityScores(supabase, rfp.id, extracted, vendorMatchingAnalysis);

    // Clean up temp file
    await fs.unlink(tmpFilePath);

    res.json({ 
      rfp,
      extracted_data: extracted,
      vendor_matching_analysis: vendorMatchingAnalysis,
      message: "RFP uploaded and analyzed successfully"
    });

  } catch (error) {
    res.status(500).json({ error: "Failed to process RFP upload" });
  }
});

// Extract RFP data without creating RFP (for form auto-fill)
router.post("/extract-rfp-data", upload.single("file"), async (req: Request, res: Response) => {
  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
      return res.status(500).json({ error: "Missing SUPABASE_URL or SUPABASE_KEY in environment" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const tmpFilePath = req.file.path;
    const originalName = req.file.originalname;
    const fileExtension = path.extname(originalName).toLowerCase();

    // Process document content
    let docs;
    try {
      if (fileExtension === '.pdf') {
        docs = await loadPDF(tmpFilePath);
      } else if (fileExtension === '.docx') {
        docs = await loadDOCX(tmpFilePath);
      } else if (fileExtension === '.txt') {
        const textContent = await fs.readFile(tmpFilePath, 'utf-8');
        docs = [{
          pageContent: textContent,
          metadata: { source: originalName }
        }];
      } else {
        throw new Error(`Unsupported file type: ${fileExtension}`);
      }
    } catch (loadError) {
      return res.status(400).json({ 
        error: `Failed to process file: ${loadError instanceof Error ? loadError.message : 'Unknown error'}` 
      });
    }

    // Split documents for processing
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 100
    });
    const splitDocs = await splitter.splitDocuments(docs);

    // Extract RFP metadata using AI
    const fullText = splitDocs.map(d => d.pageContent).join("\n");
    const extractionResult = await extractionChain.invoke({ input: fullText });
    
    let extracted: any;
    try {
      const content = extractionResult.content as string;
      
      // Try to extract JSON from the response, handling various formats
      let jsonString = content.trim();
      
      // Remove markdown code blocks if present
      if (jsonString.includes('```json')) {
        const jsonMatch = jsonString.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          jsonString = jsonMatch[1].trim();
        }
      } else if (jsonString.includes('```')) {
        const jsonMatch = jsonString.match(/```\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          jsonString = jsonMatch[1].trim();
        }
      }
      
      // Remove any leading/trailing text that might not be JSON
      const jsonStart = jsonString.indexOf('{');
      const jsonEnd = jsonString.lastIndexOf('}');
      
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        jsonString = jsonString.substring(jsonStart, jsonEnd + 1);
      }
      
      extracted = JSON.parse(jsonString);
      
      // Enhanced field mapping and cleanup
      if (extracted) {
        // Extract timeline from various patterns
        if (!extracted.timeline || extracted.timeline === "") {
          const timelinePatterns = [
            /contract duration[:\s]*([^.\n]+)/i,
            /project duration[:\s]*([^.\n]+)/i,
            /timeline[:\s]*([^.\n]+)/i,
            /(\d+)\s*months?/i,
            /(\d+)\s*years?/i
          ];
          
          for (const pattern of timelinePatterns) {
            const match = fullText.match(pattern);
            if (match) {
              extracted.timeline = match[1].trim();
              break;
            }
          }
        }
        
        // Ensure budget values are properly extracted
        if (extracted.budget) {
          if (typeof extracted.budget.min === 'string') {
            extracted.budget.min = parseInt(extracted.budget.min.replace(/[,$]/g, '')) || 0;
          }
          if (typeof extracted.budget.max === 'string') {
            extracted.budget.max = parseInt(extracted.budget.max.replace(/[,$]/g, '')) || 0;
          }
        }
        
        // Clean up contact information
        if (extracted.contact) {
          if (extracted.contact.name && extracted.contact.name.includes(',')) {
            extracted.contact.name = extracted.contact.name.split(',')[0].trim();
          }
        }
        
        // Ensure categories are populated if empty
        if (!extracted.categories || extracted.categories.length === 0) {
          extracted.categories = ["Defense", "IT"];
          if (extracted.required_capabilities) {
            if (extracted.required_capabilities.some((cap: string) => cap.toLowerCase().includes('cyber'))) {
              extracted.categories.push("Cybersecurity");
            }
            if (extracted.required_capabilities.some((cap: string) => cap.toLowerCase().includes('ai') || cap.toLowerCase().includes('machine learning'))) {
              extracted.categories.push("AI/ML");
            }
          }
        }
      }
    } catch (parseError) {
      // Fallback with more robust defaults
      extracted = {
        project_title: "Extracted Document",
        budget: { min: 0, max: 0, currency: "USD" },
        security_clearance_required: "Unknown",
        timeline: "Not specified",
        contact: { name: "Unknown", email: "unknown@example.com", phone: "Unknown" },
        due_date: null,
        agency: "Unknown",
        rfp_number: `RFP-${Date.now()}`,
        description: "Document uploaded for analysis",
        required_capabilities: [],
        required_certifications: [],
        categories: []
      };
    }

    // Clean up temp file
    await fs.unlink(tmpFilePath);

    // Return extracted data only - DO NOT create RFP in database
    res.json({
      success: true,
      extracted_data: extracted,
      message: "Document processed successfully. Data extracted for form auto-fill."
    });

  } catch (error) {
    // Clean up temp file on error
    if (req.file?.path) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        // Ignore cleanup errors
      }
    }
    
    res.status(500).json({ 
      error: "Failed to process document",
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get RFP details with vendor recommendations
router.get("/rfp/:rfpId", async (req: Request, res: Response) => {
  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
      return res.status(500).json({ error: "Missing SUPABASE_URL or SUPABASE_KEY in environment" });
    }

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    const { rfpId } = req.params;

    // Get RFP details
    const { data: rfp, error: rfpError } = await supabase
      .from("rfp_metadata")
      .select("*")
      .eq("id", rfpId)
      .single();

    if (rfpError || !rfp) {
      return res.status(404).json({ error: "RFP not found" });
    }

    // Get vendor recommendations
    const { data: recommendations, error: recError } = await supabase
      .rpc('get_vendor_recommendations', {
        rfp_id_param: parseInt(rfpId),
        limit_count: 20
      });

    if (recError) {
      // Continue without recommendations
    }

    // Get submitted proposals
    const { data: proposals, error: proposalError } = await supabase
      .from("vendor_proposals")
      .select(`
        *,
        vendor_profiles (
          name,
          email,
          location,
          capabilities,
          clearance_level,
          past_performance_score
        )
      `)
      .eq("rfp_id", rfpId)
      .order("match_score", { ascending: false });

    if (proposalError) {
      // Continue without proposals
    }

    res.json({ 
      rfp,
      vendor_recommendations: recommendations || [],
      submitted_proposals: proposals || []
    });

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch RFP details" });
  }
});

// Get all RFPs for contractor dashboard
router.get("/rfps", async (req: Request, res: Response) => {
  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
      return res.status(500).json({ error: "Missing SUPABASE_URL or SUPABASE_KEY in environment" });
    }

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    const { status, agency } = req.query;

    let query = supabase
      .from("rfp_metadata")
      .select("*")
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    if (agency) {
      query = query.eq("agency", agency);
    }

    const { data: rfps, error } = await query;

    if (error) {
      return res.status(500).json({ error: "Failed to fetch RFPs" });
    }

    res.json({ rfps });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch RFPs" });
  }
});

// Update RFP status
router.put("/rfp/:rfpId/status", async (req: Request, res: Response) => {
  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
      return res.status(500).json({ error: "Missing SUPABASE_URL or SUPABASE_KEY in environment" });
    }

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    const { rfpId } = req.params;
    const { status } = req.body;

    if (!status || !['draft', 'active', 'closed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: "Valid status required (draft, active, closed, cancelled)" });
    }

    const { data: rfp, error } = await supabase
      .from("rfp_metadata")
      .update({ status })
      .eq("id", rfpId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: "Failed to update RFP status" });
    }

    // If status changed to active, calculate compatibility scores
    if (status === 'active') {
      await calculateVendorCompatibilityScores(supabase, parseInt(rfpId), {
        project_title: rfp.project_title,
        budget_min: rfp.budget_min,
        budget_max: rfp.budget_max,
        currency: rfp.currency,
        security_clearance: rfp.security_clearance,
        timeline: rfp.timeline,
        description: rfp.description,
        requirements: rfp.requirements || [],
        categories: rfp.categories || []
      });
    }

    res.json({ rfp, message: "RFP status updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update RFP status" });
  }
});

// Get RFP analytics and market data
router.get("/analytics", async (req: Request, res: Response) => {
  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
      return res.status(500).json({ error: "Missing SUPABASE_URL or SUPABASE_KEY in environment" });
    }

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

    // Get RFP counts by status
    const { data: rfpStats } = await supabase
      .from("rfp_metadata")
      .select("status")
      .then(result => {
        const stats = result.data?.reduce((acc: any, rfp: any) => {
          acc[rfp.status] = (acc[rfp.status] || 0) + 1;
          return acc;
        }, {});
        return { data: stats };
      });

    // Get vendor counts by capability
    const { data: vendorCapabilities } = await supabase
      .from("vendor_profiles")
      .select("capabilities")
      .then(result => {
        const capabilityCounts: any = {};
        result.data?.forEach((vendor: any) => {
          vendor.capabilities?.forEach((cap: string) => {
            capabilityCounts[cap] = (capabilityCounts[cap] || 0) + 1;
          });
        });
        return { data: capabilityCounts };
      });

    // Get average compatibility scores
    const { data: avgScores } = await supabase
      .from("compatibility_scores")
      .select("score")
      .then(result => {
        const scores = result.data?.map((s: any) => s.score) || [];
        const avg = scores.length > 0 ? scores.reduce((a: number, b: number) => a + b, 0) / scores.length : 0;
        return { data: { average: Math.round(avg), total_evaluations: scores.length } };
      });

    res.json({
      rfp_statistics: rfpStats || {},
      vendor_capabilities: vendorCapabilities || {},
      compatibility_metrics: avgScores || {}
    });

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

// Helper function to calculate fallback compatibility score
function calculateFallbackScore(vendor: any, rfpData: any): number {
  let score = 50; // Base score
  
  // Check clearance match
  if (vendor.clearance_level && rfpData.security_clearance) {
    const vendorClearance = vendor.clearance_level.toLowerCase();
    const requiredClearance = rfpData.security_clearance.toLowerCase();
    
    if (vendorClearance.includes('top secret') && requiredClearance.includes('top secret')) {
      score += 20;
    } else if (vendorClearance.includes('secret') && requiredClearance.includes('secret')) {
      score += 15;
    } else if (requiredClearance === 'none' || requiredClearance === 'unknown') {
      score += 10;
    }
  }
  
  // Check capability overlap
  if (vendor.capabilities && rfpData.requirements) {
    const vendorCaps = vendor.capabilities.map((c: string) => c.toLowerCase());
    const requiredCaps = rfpData.requirements.map((r: string) => r.toLowerCase());
    const overlap = vendorCaps.filter((cap: string) => 
      requiredCaps.some((req: string) => req.includes(cap) || cap.includes(req))
    );
    score += Math.min(20, overlap.length * 5);
  }
  
  // Use past performance as indicator
  if (vendor.past_performance_score) {
    score += Math.min(10, vendor.past_performance_score / 10);
  }
  
  return Math.min(100, Math.max(0, score));
}

// Helper function to calculate vendor compatibility scores for an RFP
async function calculateVendorCompatibilityScores(
  supabase: any, 
  rfpId: number, 
  rfpData: any, 
  vendorMatchingAnalysis?: any
) {
  try {
    // Initialize compatibility scores for all vendors
    await supabase.rpc('update_compatibility_scores_for_rfp', { rfp_id_param: rfpId });

    // Get all vendors
    const { data: vendors } = await supabase
      .from("vendor_profiles")
      .select("*");

    if (!vendors) return;

    // Calculate detailed scores for each vendor (with timeout and error handling)
    const vendorPromises = vendors.map(async (vendor: any) => {
      try {
        // Set a timeout for AI processing
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('AI processing timeout')), 15000) // 15 second timeout
        );

        const vendorProfile = `
          Name: ${vendor.name}
          Capabilities: ${vendor.capabilities?.join(', ') || 'None'}
          Clearance: ${vendor.clearance_level || 'None'}
          Certifications: ${vendor.certifications?.join(', ') || 'None'}
          Experience: ${vendor.past_performance_score || 0}% performance score
          Location: ${vendor.location || 'Not specified'}
          Company Size: ${vendor.employees_count || 'Not specified'}
          Specialties: ${vendor.specialties?.join(', ') || 'None'}
        `;

        const rfpRequirements = `
          Project: ${rfpData.project_title || 'Unknown'}
          Budget: ${rfpData.budget_min || 0} - ${rfpData.budget_max || 0} ${rfpData.currency || 'USD'}
          Clearance Required: ${rfpData.security_clearance || 'None'}
          Timeline: ${rfpData.timeline || 'Not specified'}
          Requirements: ${rfpData.requirements?.join(', ') || 'None'}
          Categories: ${rfpData.categories?.join(', ') || 'None'}
          Description: ${rfpData.description || 'No description'}
        `;

        // Race between AI call and timeout
        const aiPromise = detailedCompatibilityChain.invoke({
          vendor_profile: vendorProfile,
          rfp_requirements: rfpRequirements
        });

        const compatibilityResult = await Promise.race([aiPromise, timeoutPromise]) as any;
        const analysis = JSON.parse(compatibilityResult.content as string);

        await supabase
          .from("compatibility_scores")
          .update({
            score: analysis.overall_score || 0,
            rationale: analysis.rationale || 'AI-generated compatibility analysis',
            factors: analysis.detailed_scores || {},
            win_probability: analysis.win_probability || null,
            competition_level: analysis.competition_level || 'medium',
            estimated_cost: analysis.estimated_cost || null,
            risk_level: analysis.risk_level || 'medium',
            reasons: analysis.strengths || []
          })
          .match({ rfp_id: rfpId, vendor_id: vendor.id });

        // Create notification for high-scoring vendors
        if (analysis.overall_score >= 70) {
          await supabase
            .from("notifications")
            .insert({
              user_type: 'vendor',
              user_id: vendor.id,
              rfp_id: rfpId,
              type: 'new_match',
              title: 'New High-Match RFP Available',
              message: `A new RFP matching your capabilities (${analysis.overall_score}% match) is now available`,
              metadata: {
                match_score: analysis.overall_score,
                rfp_title: rfpData.project_title
              }
            });
        }

        return { success: true, vendor: vendor.name };

      } catch (vendorError) {
        // Set default score if AI fails or times out
        const fallbackScore = calculateFallbackScore(vendor, rfpData);
        
        await supabase
          .from("compatibility_scores")
          .update({
            score: fallbackScore,
            rationale: 'Fallback score - AI analysis unavailable',
            win_probability: Math.max(0, fallbackScore - 20),
            risk_level: 'medium'
          })
          .match({ rfp_id: rfpId, vendor_id: vendor.id });

        return { success: false, vendor: vendor.name, error: vendorError instanceof Error ? vendorError.message : 'Unknown error' };
      }
    });

    // Process all vendors concurrently with a maximum wait time
    try {
      await Promise.allSettled(vendorPromises);
    } catch (error) {
      // Even if some fail, continue with the process
    }

    // Compatibility scores updated successfully
  } catch (error) {
    // Error calculating vendor compatibility scores
  }
}

export default router; 