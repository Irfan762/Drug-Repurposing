# Mock Vector Search Service
# In production, use Pinecone, Milvus, or PGVector

class VectorStore:
    def __init__(self):
        self.index = {}

    async def search(self, query: str, top_k: int = 5):
        # Mock Semantic Search
        return [
            {"doc_id": "PMID:123", "score": 0.89, "text": "Metformin reduces oxidative stress..."},
            {"doc_id": "PATENT:US999", "score": 0.85, "text": "Method for treating Alzheimer's with biguanides..."}
        ]

vector_store = VectorStore()
