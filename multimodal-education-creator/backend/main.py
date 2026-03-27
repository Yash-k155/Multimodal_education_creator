import os
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from services.llm_service import generate_educational_content
from services.image_service import get_images_for_flashcards
from services.vector_store import store_topic, search_topics

app = FastAPI(title="Multimodal Education Creator", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TopicRequest(BaseModel):
    topic: str


class ContentResponse(BaseModel):
    topic: str
    explanation: str
    keyPoints: list
    summary: str
    flashcards: list
    image_urls: list


@app.get("/")
async def root():
    return {"message": "Multimodal Education Creator API", "status": "running"}


@app.post("/generate-content", response_model=ContentResponse)
async def generate_content(request: TopicRequest):
    topic = request.topic.strip()
    if not topic:
        raise HTTPException(status_code=400, detail="Topic cannot be empty")

    try:
        content = await generate_educational_content(topic)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LLM generation failed: {str(e)}")

    try:
        image_urls = await get_images_for_flashcards(topic, content.get("flashcards", []))
    except Exception:
        image_urls = []

    try:
        store_topic(topic, content.get("explanation", ""))
    except Exception:
        pass

    return ContentResponse(
        topic=topic,
        explanation=content.get("explanation", ""),
        keyPoints=content.get("keyPoints", []),
        summary=content.get("summary", ""),
        flashcards=content.get("flashcards", []),
        image_urls=image_urls,
    )


@app.get("/search")
async def search(query: str = Query(..., description="Search query")):
    if not query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    try:
        results = search_topics(query)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

    return {"query": query, "results": results}
