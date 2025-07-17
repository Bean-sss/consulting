-- Supabase Setup for Defense RFP Platform
-- Run this in your Supabase SQL Editor

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS rfp_metadata (
    id SERIAL PRIMARY KEY,
    document TEXT NOT NULL UNIQUE,
    project_title TEXT,
    budget_min DECIMAL(15,2),
    budget_max DECIMAL(15,2),
    currency TEXT DEFAULT 'USD',
    security_clearance TEXT,
    timeline TEXT,
    contact_name TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rfp_chunks (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    metadata JSONB,
    embedding vector(768),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION match_documents(
    query_embedding vector(768),
    match_threshold float DEFAULT 0.78,
    match_count int DEFAULT 5
)
RETURNS TABLE (
    id bigint,
    content text,
    metadata jsonb,
    similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        rfp_chunks.id,
        rfp_chunks.content,
        rfp_chunks.metadata,
        (rfp_chunks.embedding <=> query_embedding) AS similarity
    FROM rfp_chunks
    WHERE 1 - (rfp_chunks.embedding <=> query_embedding) > match_threshold
    ORDER BY (rfp_chunks.embedding <=> query_embedding)
    LIMIT match_count;
END;
$$;

CREATE INDEX IF NOT EXISTS rfp_chunks_embedding_idx ON rfp_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX IF NOT EXISTS rfp_metadata_document_idx ON rfp_metadata(document);
CREATE INDEX IF NOT EXISTS rfp_metadata_created_at_idx ON rfp_metadata(created_at);

ALTER TABLE rfp_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE rfp_chunks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on rfp_metadata" ON rfp_metadata
    FOR ALL USING (true);

CREATE POLICY "Allow all operations on rfp_chunks" ON rfp_chunks
    FOR ALL USING (true);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language plpgsql;

CREATE TRIGGER update_rfp_metadata_updated_at 
    BEFORE UPDATE ON rfp_metadata 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 