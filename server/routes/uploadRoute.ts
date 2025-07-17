import { Router } from "express";
import multer from "multer";
import fs from "fs/promises";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { loadPDF } from "../ai/loader/pdfLoader";
import { loadDOCX } from "../ai/loader/docxLoader";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { getVectorStore } from "../ai/vectorstore/pgvector";
import { extractionChain } from "../ai/chains/extractionChains";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload-rfp", upload.single("file"), async (req, res, next) => {
  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
      return res.status(500).json({ error: "Missing SUPABASE_URL or SUPABASE_KEY in environment" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    );

    const tmpFilePath = req.file.path;
    const fileBuffer = await fs.readFile(tmpFilePath);
    const originalName = req.file.originalname;
    const fileExtension = path.extname(originalName).toLowerCase();

    const { data: stored, error: storeErr } = await supabase
      .storage
      .from("documents")
      .upload(
        `uploads/${Date.now()}_${originalName}`,
        fileBuffer,
        { upsert: false }
      );
    if (storeErr) throw storeErr;

    const documentKey = stored.path;

    await supabase
      .from("rfp_metadata")
      .insert({ document: documentKey });

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
      console.error('Error loading document:', loadError);
      const errorMessage = loadError instanceof Error ? loadError.message : 'Unknown error occurred';
      return res.status(400).json({ error: `Failed to process file: ${errorMessage}` });
    }

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
      console.log('✅ Added', docsWithMetadata.length, 'documents to vector store');
    } catch (vectorError) {
      console.error('❌ Vector store error:', vectorError);
      console.log('⚠️ Continuing without vector store - metadata extraction will still work');
      
      for (const doc of docsWithMetadata) {
        await supabase
          .from('rfp_chunks')
          .insert({
            content: doc.pageContent,
            metadata: doc.metadata
          });
      }
      console.log('📝 Stored', docsWithMetadata.length, 'chunks in database (without embeddings)');
    }

    const fullText = splitDocs.map(d => d.pageContent).join("\n");
    console.log('Extracting from text:', fullText.substring(0, 200) + '...');
    
    const result = await extractionChain.invoke({ input: fullText });
    console.log('Extraction result:', result);
    
    let extracted;
    try {
      extracted = JSON.parse(result.content as string);
    } catch (parseError) {
      console.error('Failed to parse extraction result:', result.content);
      extracted = {
        project_title: "Unknown",
        budget: { min: 0, max: 0, currency: "USD" },
        security_clearance_required: "Unknown",
        timeline: "Unknown",
        contact: { name: "Unknown", email: "unknown@example.com", phone: "Unknown" }
      };
    }

    await supabase
      .from("rfp_metadata")
      .update({
        project_title: extracted.project_title || "Unknown",
        budget_min: extracted.budget?.min || 0,
        budget_max: extracted.budget?.max || 0,
        currency: extracted.budget?.currency || "USD",
        security_clearance: extracted.security_clearance_required || "Unknown",
        timeline: extracted.timeline || "Unknown",
        contact_name: extracted.contact?.name || "Unknown",
        contact_email: extracted.contact?.email || "unknown@example.com",
        contact_phone: extracted.contact?.phone || "Unknown"
      })
      .eq("document", documentKey);

    await fs.unlink(tmpFilePath);

    const { data: updatedRow } = await supabase
      .from("rfp_metadata")
      .select("*")
      .eq("document", documentKey)
      .single();

    res.json({ metadata: updatedRow });
  } catch (err) {
    console.error('Upload error:', err);
    next(err);
  }
});

router.get("/test-chunks", async (req, res, next) => {
  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
      return res.status(500).json({ error: "Missing SUPABASE_URL or SUPABASE_KEY in environment" });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    );

    const { data: chunks, error } = await supabase
      .from('rfp_chunks')
      .select('*')
      .limit(5);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ 
      count: chunks.length,
      chunks: chunks.map(chunk => ({
        id: chunk.id,
        content: chunk.content.substring(0, 100) + '...',
        metadata: chunk.metadata
      }))
    });
  } catch (err) {
    console.error('Test chunks error:', err);
    next(err);
  }
});

export default router;
