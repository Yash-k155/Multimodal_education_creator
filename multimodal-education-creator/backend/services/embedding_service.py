# ChromaDB handles embeddings internally via its built-in ONNX model.
# This module is kept for interface compatibility.

def get_model():
    return None


def generate_embedding(text: str) -> list:
    # Not used directly - ChromaDB's collection handles embeddings automatically.
    raise NotImplementedError("Use ChromaDB's built-in embedding via query_texts/documents.")
