import fitz                                  # For reading PDF text
from sentence_transformers import SentenceTransformer  # For AI “understanding”
from sklearn.metrics.pairwise import cosine_similarity # For comparing text
import re, json, argparse

# 1. Read all text from a PDF file
def read_pdf_text(path):
    pdf = fitz.open(path)
    pages = [page.get_text("text") for page in pdf]
    return "\n".join(pages)

# 2. Clean up the text (lowercase + single spaces)
def clean_text(text):
    text = text.lower()
    return re.sub(r"\s+", " ", text)

# 3. Split long text into small chunks (5,000 characters)
def split_into_chunks(text, size=5000):
    return [ text[i:i+size] for i in range(0, len(text), size) ]

# 4. Turn chunks into vectors the AI can compare
def get_embeddings(chunks, model_name="all-MiniLM-L6-v2"):
    model = SentenceTransformer(model_name)
    return model.encode(chunks)

# 5. Compare two sets of embeddings and get an overall score
def compare_vectors(v1, v2):
    matrix = cosine_similarity(v1, v2)
    best_matches = matrix.max(axis=1)     # Best match for each chunk
    return best_matches.mean(), best_matches.tolist()

# 6. Main function: ties everything together
def score(rfp_path, bid_path):
    # Read & clean both documents
    rfp_text = clean_text(read_pdf_text(rfp_path))
    bid_text = clean_text(read_pdf_text(bid_path))

    # Split into chunks
    rfp_chunks = split_into_chunks(rfp_text)
    bid_chunks = split_into_chunks(bid_text)

    # Get embeddings
    rfp_vecs = get_embeddings(rfp_chunks)
    bid_vecs = get_embeddings(bid_chunks)

    # Compare and compute score
    overall_score, per_chunk_scores = compare_vectors(rfp_vecs, bid_vecs)

    # Build a simple result
    return {
        "compatibility_score": round(float(overall_score), 3),
        "per_chunk_scores": [ round(float(s), 3) for s in per_chunk_scores ]
    }

# 7. Command-line interface
if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Simple RFP vs. Bid Compatibility Scorer"
    )
    parser.add_argument("--rfp", required=True, help="Path to your RFP PDF")
    parser.add_argument("--bid", required=True, help="Path to the Bid PDF")
    args = parser.parse_args()

    result = score(args.rfp, args.bid)
    print(json.dumps(result, indent=2))
