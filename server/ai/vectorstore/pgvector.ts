import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";
import { hfEmbeddings } from "../embedding/hfEmbeddings";

let vectorStore: SupabaseVectorStore | null = null;

function getVectorStore(): SupabaseVectorStore {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_KEY in environment");
  }

  if (!vectorStore) {
    try {
      const supabaseClient = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_KEY
      );

      vectorStore = new SupabaseVectorStore(
        hfEmbeddings,
        {
          client: supabaseClient,
          tableName: "rfp_chunks",
          queryName: "match_documents",
          filter: {
            // Assuming filter is an object, adjust if needed
            // For example, if you want to filter by a specific column
            // filter: {
            //   column: "document_id",
            //   value: "some_document_id",
            // },
          },
        }
      );
      
      console.log("Vector store initialized successfully");
    } catch (error) {
      console.error("Failed to initialize vector store:", error);
      throw error;
    }
  }

  return vectorStore;
}

export { getVectorStore }; 