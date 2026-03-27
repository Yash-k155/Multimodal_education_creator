import chromadb
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "chroma_db")

_client = None
_collection = None


def get_collection():
    global _client, _collection
    if _collection is None:
        _client = chromadb.PersistentClient(path=DB_PATH)
        # Use ChromaDB's built-in default embedding function (no external deps)
        _collection = _client.get_or_create_collection(
            name="education_topics",
            metadata={"hnsw:space": "cosine"},
        )
    return _collection


def store_topic(topic: str, explanation: str):
    collection = get_collection()
    import uuid
    doc_id = str(uuid.uuid4())
    # Let ChromaDB embed the document automatically
    collection.add(
        ids=[doc_id],
        documents=[f"{topic}: {explanation}"],
        metadatas=[{"topic": topic}],
    )


def search_topics(query: str, n_results: int = 5) -> list:
    collection = get_collection()

    count = collection.count()
    if count == 0:
        return []

    actual_n = min(n_results, count)
    # Let ChromaDB embed the query automatically
    results = collection.query(
        query_texts=[query],
        n_results=actual_n,
        include=["documents", "metadatas", "distances"],
    )

    items = []
    for i in range(len(results["ids"][0])):
        items.append(
            {
                "topic": results["metadatas"][0][i]["topic"],
                "explanation": results["documents"][0][i],
                "similarity": round(1 - results["distances"][0][i], 4),
            }
        )
    return items
