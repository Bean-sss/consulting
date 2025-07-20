import { Router } from 'express';
import multer from 'multer';
import fs from 'fs/promises';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { loadPDF } from '../ai/loader/pdfLoader';
import { loadDOCX } from '../ai/loader/docxLoader';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { getVectorStore } from '../ai/vectorstore/pgvector';
import { extractionChain } from '../ai/chains/extractionChains';

const router = Router();

// Configuration
const UPLOAD_DIRECTORY = 'uploads/';
const SUPPORTED_FILE_TYPES = ['.pdf', '.docx', '.txt'];
const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 100;

// Configure multer for file uploads
const upload = multer({ dest: UPLOAD_DIRECTORY });

// Helper function to create Supabase client
function createSupabaseClient() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_KEY in environment');
  }
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
}

// Helper function to validate file type
function isValidFileType(filename: string): boolean {
  const extension = path.extname(filename).toLowerCase();
  return SUPPORTED_FILE_TYPES.includes(extension);
}

// Helper function to load document based on file type
async function loadDocument(filePath: string, originalName: string) {
  const fileExtension = path.extname(originalName).toLowerCase();
  
  switch (fileExtension) {
    case '.pdf':
      return await loadPDF(filePath);
    
    case '.docx':
      return await loadDOCX(filePath);
    
    case '.txt':
      const textContent = await fs.readFile(filePath, 'utf-8');
      return [{
        pageContent: textContent,
        metadata: { source: originalName }
      }];
    
    default:
      throw new Error(`Unsupported file type: ${fileExtension}`);
  }
}

// Helper function to upload file to Supabase storage
async function uploadFileToStorage(supabase: any, fileBuffer: Buffer, originalName: string) {
  const fileName = `uploads/${Date.now()}_${originalName}`;
  
  const { data: stored, error } = await supabase
    .storage
    .from('documents')
    .upload(fileName, fileBuffer, { upsert: false });
  
  if (error) {
    throw new Error(`Failed to upload file to storage: ${error.message}`);
  }
  
  return stored.path;
}

// Helper function to store document chunks
async function storeDocumentChunks(supabase: any, documents: any[], documentKey: string) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: CHUNK_SIZE,
    chunkOverlap: CHUNK_OVERLAP
  });
  
  const splitDocs = await splitter.splitDocuments(documents);
  const docsWithMetadata = splitDocs.map(doc => ({
    ...doc,
    metadata: { ...doc.metadata, documentKey }
  }));
  
  try {
    // Try to store in vector store first
    await getVectorStore().addDocuments(docsWithMetadata);
  } catch (vectorError) {
    // Fallback to database storage without embeddings
    for (const doc of docsWithMetadata) {
      await supabase
        .from('rfp_chunks')
        .insert({
          content: doc.pageContent,
          metadata: doc.metadata
        });
    }
  }
  
  return splitDocs;
}

// Helper function to extract JSON from AI response
function extractJSONFromResponse(content: string): any {
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
  
  // Extract JSON object from potentially malformed response
  const jsonStart = jsonString.indexOf('{');
  const jsonEnd = jsonString.lastIndexOf('}');
  
  if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
    jsonString = jsonString.substring(jsonStart, jsonEnd + 1);
  }
  
  return JSON.parse(jsonString);
}

// Helper function to create fallback extracted data
function createFallbackExtractedData(): any {
  return {
    project_title: 'Extracted Document',
    budget: { min: 0, max: 0, currency: 'USD' },
    security_clearance_required: 'Unknown',
    timeline: 'Not specified',
    contact: { name: 'Unknown', email: 'unknown@example.com', phone: 'Unknown' },
    due_date: null,
    agency: 'Unknown',
    rfp_number: `RFP-${Date.now()}`,
    description: 'Document uploaded for analysis',
    required_capabilities: [],
    required_certifications: [],
    categories: []
  };
}

// Helper function to update RFP metadata in database
async function updateRFPMetadata(supabase: any, documentKey: string, extractedData: any) {
  await supabase
    .from('rfp_metadata')
    .update({
      project_title: extractedData.project_title || 'Unknown',
      budget_min: extractedData.budget?.min || 0,
      budget_max: extractedData.budget?.max || 0,
      currency: extractedData.budget?.currency || 'USD',
      security_clearance: extractedData.security_clearance_required || 'Unknown',
      timeline: extractedData.timeline || 'Unknown',
      contact_name: extractedData.contact?.name || 'Unknown',
      contact_email: extractedData.contact?.email || 'unknown@example.com',
      contact_phone: extractedData.contact?.phone || 'Unknown'
    })
    .eq('document', documentKey);
}

/**
 * POST /api/upload-rfp
 * Uploads and processes RFP documents with AI extraction
 */
router.post('/upload-rfp', upload.single('file'), async (req, res, next) => {
  let tempFilePath: string | null = null;
  
  try {
    const supabase = createSupabaseClient();
    
    // Validate file upload
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded',
        message: 'Please select a file to upload'
      });
    }
    
    const { originalname, path: uploadPath } = req.file;
    tempFilePath = uploadPath;
    
    // Validate file type
    if (!isValidFileType(originalname)) {
      return res.status(400).json({
        error: 'Unsupported file type',
        message: `Supported formats: ${SUPPORTED_FILE_TYPES.join(', ')}`,
        receivedType: path.extname(originalname)
      });
    }
    
    // Read and upload file to storage
    const fileBuffer = await fs.readFile(tempFilePath);
    const documentKey = await uploadFileToStorage(supabase, fileBuffer, originalname);
    
    // Create initial RFP metadata entry
    await supabase
      .from('rfp_metadata')
      .insert({ document: documentKey });
    
    // Load and process document
    const documents = await loadDocument(tempFilePath, originalname);
    const splitDocs = await storeDocumentChunks(supabase, documents, documentKey);
    
    // Extract metadata using AI
    const fullText = splitDocs.map(doc => doc.pageContent).join('\n');
    const extractionResult = await extractionChain.invoke({ input: fullText });
    
    let extractedData;
    try {
      const content = extractionResult.content as string;
      extractedData = extractJSONFromResponse(content);
    } catch (parseError) {
      // Use fallback data if extraction fails
      extractedData = createFallbackExtractedData();
    }
    
    // Update RFP metadata with extracted information
    await updateRFPMetadata(supabase, documentKey, extractedData);
    
    // Clean up temporary file
    await fs.unlink(tempFilePath);
    tempFilePath = null;
    
    // Return updated metadata
    const { data: updatedMetadata } = await supabase
      .from('rfp_metadata')
      .select('*')
      .eq('document', documentKey)
      .single();
    
    res.json({
      success: true,
      metadata: updatedMetadata,
      message: 'RFP document uploaded and processed successfully'
    });
    
  } catch (error) {
    // Clean up temporary file on error
    if (tempFilePath) {
      try {
        await fs.unlink(tempFilePath);
      } catch (unlinkError) {
        // Ignore cleanup errors
      }
    }
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('Missing SUPABASE_URL')) {
        return res.status(500).json({
          error: 'Server configuration error',
          message: 'Database connection not configured'
        });
      }
      
      if (error.message.includes('Failed to upload file')) {
        return res.status(500).json({
          error: 'File storage error',
          message: 'Unable to store uploaded file'
        });
      }
    }
    
    // Generic error handling
    next(error);
  }
});

export default router;
