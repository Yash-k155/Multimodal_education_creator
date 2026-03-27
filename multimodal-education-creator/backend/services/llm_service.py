import os
import json
import httpx
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = (os.getenv("GROQ_API_KEY") or "").strip()
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
MODEL = "llama-3.1-8b-instant"


async def generate_educational_content(topic: str) -> dict:
    prompt = f"""You are an expert educator. For the topic "{topic}", generate educational content in the following JSON format exactly:

{{
  "explanation": "A clear 2-3 paragraph explanation of the topic",
  "keyPoints": ["Key point 1", "Key point 2", "Key point 3", "Key point 4", "Key point 5"],
  "summary": "A concise 1-2 sentence summary",
  "flashcards": [
    {{"question": "Question 1?", "answer": "Answer 1"}},
    {{"question": "Question 2?", "answer": "Answer 2"}},
    {{"question": "Question 3?", "answer": "Answer 3"}},
    {{"question": "Question 4?", "answer": "Answer 4"}},
    {{"question": "Question 5?", "answer": "Answer 5"}}
  ]
}}

Return ONLY valid JSON, no markdown, no code blocks, no extra text."""

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": MODEL,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7,
        "max_tokens": 2048,
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(GROQ_URL, headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()

    raw_content = data["choices"][0]["message"]["content"].strip()

    # Strip markdown code blocks if present
    if raw_content.startswith("```"):
        lines = raw_content.split("\n")
        raw_content = "\n".join(lines[1:-1]) if lines[-1] == "```" else "\n".join(lines[1:])
    raw_content = raw_content.strip()

    try:
        result = json.loads(raw_content)
    except json.JSONDecodeError:
        # Attempt to extract JSON object from the response
        start = raw_content.find("{")
        end = raw_content.rfind("}") + 1
        if start != -1 and end > start:
            result = json.loads(raw_content[start:end])
        else:
            raise ValueError("Could not parse JSON from LLM response")

    # Validate required keys
    required = ["explanation", "keyPoints", "summary", "flashcards"]
    for key in required:
        if key not in result:
            raise ValueError(f"Missing key in LLM response: {key}")

    return result
