# Defense RFP Platform

An AI-powered platform for processing and analyzing defense RFP (Request for Proposal) documents with automated field extraction and vendor compatibility scoring.

## Prerequisites

- Node.js
- Supabase account and project
- Ollama (for local LLM inference)

## Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd consulting
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
PORT=3000
SUPABASE_URL=your_supabase_url_here
SUPABASE_KEY=your_supabase_anon_key_here
OLLAMA_BASE_URL=http://localhost:11434
```

### 3. Database Setup
1. **Create a Supabase project** at [supabase.com](https://supabase.com)

2. **Enable pgvector extension** in your Supabase dashboard
   
3. **Run the supabase-setup.sql** in your Supabase SQL Editor:

4. **Create a storage bucket**:
   - Go to Storage in your Supabase dashboard
   - Create a new bucket named `documents`
   - Set permissions as needed (public/private)

### 4 AI Models Setup

Install and configure Ollama:

```bash
# Install Ollama (https://ollama.ai/)
# Then pull required models:
ollama pull llama3
ollama pull nomic-embed-text

# Start Ollama service
ollama serve
```

### 5 Build and Run

```bash
# Build the application
npm run build

# Start the development server
npm run dev
```

The application will be available at http://localhost:5173 (frontend) and the backend API at http://localhost:3000

### Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build frontend and compile backend TypeScript
- `npm run server` - Run only the backend server
- `npm run preview` - Preview the built frontend

### Project Structure

```
├── src/                    # Frontend React code
│   ├── components/         # React components
│   ├── App.jsx            # Main app component
│   └── main.jsx           # App entry point
├── server/                 # Backend Node.js code
│   ├── ai/                # AI/ML components
│   │   ├── chains/        # LangChain processing chains
│   │   ├── embedding/     # Embedding models
│   │   ├── loader/        # Document loaders
│   │   ├── llm/           # Language models
│   │   └── vectorstore/   # Vector database integration
│   ├── routes/            # API routes
│   └── config/            # Configuration files
├── public/assets/          # Static assets (images, videos)
├── uploads/               # Temporary file uploads
└── dist/                  # Build output (gitignored)
```
