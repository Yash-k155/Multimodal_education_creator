# Multimodal Education Creator

A full-stack AI-powered educational content generator. Enter any topic and receive a rich explanation, key points, interactive flip flashcards, and a Wikipedia image gallery — all generated in seconds.

## Stack
- **Backend**: Python 3.10+ · FastAPI · Uvicorn · Groq LLM (`llama-3.1-8b-instant`) · ChromaDB
- **Frontend**: React · Vite · TailwindCSS
- **Images**: Wikipedia REST API (downloaded and embedded as base64 — no browser hotlink issues)

---

## Prerequisites

| Tool | Min Version |
|------|-------------|
| Python | 3.10+ |
| Node.js | 18+ |
| npm | 9+ |

---

## Local Setup & Run

### Step 1 — Get a Groq API key

Sign up free at [console.groq.com](https://console.groq.com), create an API key, then create the file `backend/.env`:

```
GROQ_API_KEY=your_actual_groq_api_key_here
```

---

### Step 2 — Start the backend

```bash
cd multimodal-education-creator/backend

# (recommended) create a virtual environment
python3 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate

# install dependencies
pip install -r requirements.txt

# start the server (auto-reloads on file changes)
python3 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend runs at: **http://localhost:8000**

---

### Step 3 — Start the frontend (new terminal)

```bash
cd multimodal-education-creator/frontend

npm install
npm run dev
```

Frontend runs at: **http://localhost:5173**

> Vite automatically proxies `/generate-content` and `/search` to `http://localhost:8000` — no extra config needed.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check |
| `POST` | `/generate-content` | Generate lesson content for a topic |
| `GET` | `/search?query=` | Semantic search over previously generated topics |

### Example

```bash
curl -X POST http://localhost:8000/generate-content \
  -H "Content-Type: application/json" \
  -d '{"topic": "Photosynthesis"}'
```

---

## Project Structure

```
multimodal-education-creator/
├── backend/
│   ├── main.py                    # FastAPI app & routes
│   ├── requirements.txt
│   ├── .env                       # GROQ_API_KEY goes here (create this)
│   └── services/
│       ├── llm_service.py         # Groq LLM (llama-3.1-8b-instant)
│       ├── image_service.py       # Wikipedia fetch → base64 data URLs
│       └── vector_store.py        # ChromaDB semantic search
└── frontend/
    ├── package.json
    ├── vite.config.js             # Proxy: /generate-content, /search → :8000
    └── src/
        ├── App.jsx
        └── pages/Generator.jsx
```
