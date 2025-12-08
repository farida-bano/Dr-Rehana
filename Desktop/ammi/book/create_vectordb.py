import pickle
import os
import json
from typing import List, Dict, Any

from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import InMemoryVectorStore

# Attempt to import RST loaders, but handle potential ImportError
try:
    from langchain_community.document_loaders import RSTFilesInDirectoryLoader, RSTLoader
except ImportError:
    RSTFilesInDirectoryLoader = None
    RSTLoader = None
    print("Warning: RSTFilesInDirectoryLoader or RSTLoader not available. Install 'docutils' and 'rst2html' for RST support.")

def load_documents_from_sources(data_sources: List[Dict[str, str]]):
    documents = []
    for source in data_sources:
        source_type = source.get("type")
        source_path = source.get("path")
        if not source_path or not source_type:
            print(f"Warning: Invalid data source entry: {source}")
            continue

        print(f"Loading documents from {source_path} ({source_type})...")
        if source_type == "directory":
            for root, _, files in os.walk(source_path):
                for filename in files:
                    filepath = os.path.join(root, filename)
                    if filename.endswith(".md"):
                        loader = TextLoader(filepath)
                        documents.extend(loader.load())
                    elif filename.endswith(".rst"):
                        # Add RST loader if available, otherwise default to TextLoader or skip
                        if RSTFilesInDirectoryLoader:
                            try:
                                loader = RSTFilesInDirectoryLoader(root)
                                documents.extend(loader.load())
                            except Exception as e:
                                print(f"Error loading RST file {filepath}: {e}")
                        else:
                            print(f"Skipping RST file (RSTFilesInDirectoryLoader not available): {filepath}")
                    # Add more file type loaders as needed
                    else:
                        print(f"Skipping unsupported file type: {filename} in {filepath}")
        elif source_type == "file":
            if source_path.endswith(".md"):
                loader = TextLoader(source_path)
                documents.extend(loader.load())
            elif source_path.endswith(".rst"):
                if RSTLoader:
                    try:
                        loader = RSTLoader(source_path)
                        documents.extend(loader.load())
                    except Exception as e:
                        print(f"Error loading RST file {source_path}: {e}")
                else:
                    print(f"Skipping RST file (RSTLoader not available): {source_path}")
            else:
                print(f"Skipping unsupported file type for file source: {source_path}")
        else:
            print(f"Warning: Unsupported source type '{source_type}' for path '{source_path}'")
    return documents

def create_embeddings(config: Dict[str, Any]):
    embedding_config = config.get("embeddings", {})
    embedding_model_name = embedding_config.get("model_name", "sentence-transformers/all-MiniLM-L6-v2")
    
    # Placeholder for other embedding types
    if embedding_config.get("type") == "HuggingFaceEmbeddings":
        return HuggingFaceEmbeddings(model_name=embedding_model_name)
    else:
        print(f"Using default HuggingFaceEmbeddings with model: {embedding_model_name}")
        return HuggingFaceEmbeddings(model_name=embedding_model_name)

def create_vector_database(data_sources: List[Dict[str, str]], config: Dict[str, Any]):
    documents = load_documents_from_sources(data_sources)

    if not documents:
        print(f"No documents loaded from provided sources.")
        return

    # Split documents into chunks
    text_splitter_config = config.get("text_splitter", {})
    chunk_size = text_splitter_config.get("chunk_size", 500)
    chunk_overlap = text_splitter_config.get("chunk_overlap", 50)
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
    texts = text_splitter.split_documents(documents)

    # Initialize embeddings
    embeddings = create_embeddings(config)

    # Create and save VectorStore
    vectorstore_type = config.get("vectorstore", {}).get("type", "InMemoryVectorStore")
    vectorstore_path = config.get("vectorstore", {}).get("path", "vectorstore.pkl")

    vectordb = None
    if vectorstore_type == "InMemoryVectorStore":
        print("Creating InMemoryVectorStore...")
        vectordb = InMemoryVectorStore.from_documents(
            documents=texts,
            embedding=embeddings
        )
        print("InMemoryVectorStore created successfully.")
    # Add other vector store types here (e.g., Chroma, FAISS, Pinecone)
    else:
        print(f"Error: Unsupported vector store type: {vectorstore_type}")
        return

    # Save the vectorstore to a file
    with open(vectorstore_path, "wb") as f:
        pickle.dump(vectordb, f)
    print(f"VectorStore saved to {vectorstore_path}")

if __name__ == "__main__":
    config_file = "configs/data_config.json"
    if not os.path.exists(config_file):
        print(f"Error: Configuration file not found at {config_file}")
        exit(1)

    with open(config_file, 'r') as f:
        config = json.load(f)

    data_sources = config.get("data_sources", [])
    create_vector_database(data_sources, config)