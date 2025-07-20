-- Supabase Setup for Defense RFP Platform (FIXED VERSION)
-- Run this in your Supabase SQL Editor

CREATE EXTENSION IF NOT EXISTS vector;

-- Drop existing tables if they exist (to avoid column conflicts)
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS compatibility_scores CASCADE;
DROP TABLE IF EXISTS vendor_proposals CASCADE;
DROP TABLE IF EXISTS vendor_profiles CASCADE;
DROP TABLE IF EXISTS rfp_chunks CASCADE;
DROP TABLE IF EXISTS rfp_metadata CASCADE;

-- Drop existing functions
DROP FUNCTION IF EXISTS match_documents(vector, float, int);
DROP FUNCTION IF EXISTS update_compatibility_scores_for_rfp(INTEGER);
DROP FUNCTION IF EXISTS get_vendor_recommendations(INTEGER, INTEGER);
DROP FUNCTION IF EXISTS get_rfp_recommendations(INTEGER, INTEGER);
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Create RFP metadata table
CREATE TABLE rfp_metadata (
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
    status TEXT DEFAULT 'draft',
    agency TEXT,
    due_date DATE,
    rfp_number TEXT UNIQUE,
    description TEXT,
    requirements TEXT[],
    categories TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RFP chunks table for vector search
CREATE TABLE rfp_chunks (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    metadata JSONB,
    embedding vector(768),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vendor profiles table
CREATE TABLE vendor_profiles (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    location TEXT,
    website TEXT,
    employees_count TEXT,
    founded_year INTEGER,
    clearance_level TEXT,
    description TEXT,
    logo_url TEXT,
    phone TEXT,
    certifications TEXT[],
    capabilities TEXT[],
    specialties TEXT[],
    past_performance_score INTEGER DEFAULT 0,
    active_contracts_count INTEGER DEFAULT 0,
    total_contract_value TEXT,
    key_personnel TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vendor proposals table
CREATE TABLE vendor_proposals (
    id SERIAL PRIMARY KEY,
    vendor_id INTEGER REFERENCES vendor_profiles(id) ON DELETE CASCADE,
    rfp_id INTEGER REFERENCES rfp_metadata(id) ON DELETE CASCADE,
    proposed_budget DECIMAL(15,2),
    delivery_timeline TEXT,
    technical_approach TEXT,
    team_composition TEXT,
    status TEXT DEFAULT 'submitted',
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    documents TEXT[], -- Array of document paths
    match_score INTEGER,
    compatibility_analysis JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(vendor_id, rfp_id)
);

-- Create compatibility scores table
CREATE TABLE compatibility_scores (
    id SERIAL PRIMARY KEY,
    rfp_id INTEGER REFERENCES rfp_metadata(id) ON DELETE CASCADE,
    vendor_id INTEGER REFERENCES vendor_profiles(id) ON DELETE CASCADE,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    rationale TEXT,
    factors JSONB, -- Detailed scoring factors
    win_probability INTEGER,
    competition_level TEXT,
    estimated_cost TEXT,
    risk_level TEXT DEFAULT 'medium',
    reasons TEXT[],
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(rfp_id, vendor_id)
);

-- Create notifications table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_type TEXT NOT NULL CHECK (user_type IN ('vendor', 'contractor')),
    user_id INTEGER, -- vendor_id or contractor_id depending on user_type
    rfp_id INTEGER REFERENCES rfp_metadata(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'new_match', 'score_update', 'proposal_submitted', etc.
    title TEXT NOT NULL,
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fixed function for document matching (resolves metadata column ambiguity)
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
        chunks.id,
        chunks.content,
        chunks.metadata,
        (chunks.embedding <=> query_embedding) AS similarity
    FROM rfp_chunks chunks
    WHERE 1 - (chunks.embedding <=> query_embedding) > match_threshold
    ORDER BY (chunks.embedding <=> query_embedding)
    LIMIT match_count;
END;
$$;

-- Function to update compatibility scores for all vendors when a new RFP is added
CREATE OR REPLACE FUNCTION update_compatibility_scores_for_rfp(rfp_id_param INTEGER)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    -- This will be triggered by the application after RFP analysis
    -- Insert placeholder compatibility scores for all active vendors
    INSERT INTO compatibility_scores (rfp_id, vendor_id, score, rationale, calculated_at)
    SELECT 
        rfp_id_param,
        v.id,
        0, -- Will be updated by AI scoring
        'Pending AI analysis',
        NOW()
    FROM vendor_profiles v
    ON CONFLICT (rfp_id, vendor_id) DO NOTHING;
END;
$$;

-- Function to get vendor match recommendations for RFP
CREATE OR REPLACE FUNCTION get_vendor_recommendations(rfp_id_param INTEGER, limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
    vendor_id INTEGER,
    vendor_name TEXT,
    score INTEGER,
    rationale TEXT,
    win_probability INTEGER,
    risk_level TEXT,
    estimated_cost TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cs.vendor_id,
        vp.name,
        cs.score,
        cs.rationale,
        cs.win_probability,
        cs.risk_level,
        cs.estimated_cost
    FROM compatibility_scores cs
    JOIN vendor_profiles vp ON cs.vendor_id = vp.id
    WHERE cs.rfp_id = rfp_id_param
    ORDER BY cs.score DESC
    LIMIT limit_count;
END;
$$;

-- Function to get RFP recommendations for vendor
CREATE OR REPLACE FUNCTION get_rfp_recommendations(vendor_id_param INTEGER, limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
    rfp_id INTEGER,
    project_title TEXT,
    rfp_number TEXT,
    agency TEXT,
    score INTEGER,
    win_probability INTEGER,
    due_date DATE,
    budget_min DECIMAL,
    budget_max DECIMAL
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cs.rfp_id,
        rm.project_title,
        rm.rfp_number,
        rm.agency,
        cs.score,
        cs.win_probability,
        rm.due_date,
        rm.budget_min,
        rm.budget_max
    FROM compatibility_scores cs
    JOIN rfp_metadata rm ON cs.rfp_id = rm.id
    WHERE cs.vendor_id = vendor_id_param
      AND rm.status = 'active'
      AND rm.due_date > CURRENT_DATE
    ORDER BY cs.score DESC
    LIMIT limit_count;
END;
$$;

-- Create indexes for performance
CREATE INDEX rfp_chunks_embedding_idx ON rfp_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX rfp_metadata_document_idx ON rfp_metadata(document);
CREATE INDEX rfp_metadata_created_at_idx ON rfp_metadata(created_at);
CREATE INDEX rfp_metadata_status_idx ON rfp_metadata(status);
CREATE INDEX rfp_metadata_due_date_idx ON rfp_metadata(due_date);

CREATE INDEX vendor_profiles_email_idx ON vendor_profiles(email);
CREATE INDEX vendor_profiles_capabilities_idx ON vendor_profiles USING GIN(capabilities);
CREATE INDEX vendor_profiles_clearance_idx ON vendor_profiles(clearance_level);

CREATE INDEX vendor_proposals_vendor_id_idx ON vendor_proposals(vendor_id);
CREATE INDEX vendor_proposals_rfp_id_idx ON vendor_proposals(rfp_id);
CREATE INDEX vendor_proposals_status_idx ON vendor_proposals(status);

CREATE INDEX compatibility_scores_rfp_id_idx ON compatibility_scores(rfp_id);
CREATE INDEX compatibility_scores_vendor_id_idx ON compatibility_scores(vendor_id);
CREATE INDEX compatibility_scores_score_idx ON compatibility_scores(score);

CREATE INDEX notifications_user_type_id_idx ON notifications(user_type, user_id);
CREATE INDEX notifications_is_read_idx ON notifications(is_read);

-- Enable Row Level Security
ALTER TABLE rfp_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE rfp_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE compatibility_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policies (allowing all for now - can be restricted later)
CREATE POLICY "Allow all operations on rfp_metadata" ON rfp_metadata FOR ALL USING (true);
CREATE POLICY "Allow all operations on rfp_chunks" ON rfp_chunks FOR ALL USING (true);
CREATE POLICY "Allow all operations on vendor_profiles" ON vendor_profiles FOR ALL USING (true);
CREATE POLICY "Allow all operations on vendor_proposals" ON vendor_proposals FOR ALL USING (true);
CREATE POLICY "Allow all operations on compatibility_scores" ON compatibility_scores FOR ALL USING (true);
CREATE POLICY "Allow all operations on notifications" ON notifications FOR ALL USING (true);

-- Create trigger function for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_rfp_metadata_updated_at 
    BEFORE UPDATE ON rfp_metadata 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendor_profiles_updated_at 
    BEFORE UPDATE ON vendor_profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendor_proposals_updated_at 
    BEFORE UPDATE ON vendor_proposals 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_compatibility_scores_updated_at 
    BEFORE UPDATE ON compatibility_scores 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample vendor data for testing
INSERT INTO vendor_profiles (name, email, location, employees_count, clearance_level, description, capabilities, specialties, past_performance_score, active_contracts_count, total_contract_value, certifications) VALUES
('Defense Solutions Inc.', 'contact@defensesolutions.com', 'Arlington, VA', '500-1000', 'Top Secret', 'Leading cybersecurity solutions provider specializing in defense applications.', ARRAY['Cybersecurity', 'Software Development', 'Systems Integration', 'Cloud Solutions'], ARRAY['Zero Trust Architecture', 'Threat Intelligence', 'Incident Response'], 98, 12, '$45M', ARRAY['DFARS', 'ITAR', 'ISO 27001', 'CMMC Level 3']),
('Autonomous Systems Corp.', 'info@autonomoussystems.com', 'San Diego, CA', '200-500', 'Secret', 'Cutting-edge autonomous systems and AI solutions for defense applications.', ARRAY['AI/ML', 'Robotics', 'Autonomous Systems', 'Computer Vision'], ARRAY['Autonomous Navigation', 'Machine Learning', 'Sensor Fusion'], 95, 8, '$25M', ARRAY['ITAR', 'AS9100', 'ISO 9001']),
('Space Communications Ltd.', 'contact@spacecomm.com', 'Colorado Springs, CO', '1000+', 'Top Secret', 'Premier satellite communication systems integrator with global reach.', ARRAY['Satellite Systems', 'RF Communications', 'Ground Systems', 'Encryption'], ARRAY['Satellite Communications', 'Ground Station Integration', 'Secure Communications'], 97, 15, '$78M', ARRAY['ITAR', 'ISO 27001', 'AS9100']),
('Maritime AI Corp.', 'hello@maritimeai.com', 'Norfolk, VA', '100-200', 'Secret', 'Specialized AI solutions for maritime and naval operations.', ARRAY['AI/ML', 'Maritime Systems', 'Autonomous Vehicles', 'Data Analytics'], ARRAY['Maritime AI', 'Autonomous Underwater Vehicles', 'Naval Analytics'], 92, 6, '$18M', ARRAY['ITAR', 'ISO 9001']);

-- Success message
SELECT 'Database setup completed successfully! All tables, functions, and sample data have been created.' AS status; 