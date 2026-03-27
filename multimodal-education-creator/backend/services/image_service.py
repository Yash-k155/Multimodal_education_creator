import asyncio
import base64
import httpx
from urllib.parse import quote

HEADERS = {
    "User-Agent": "MultimodalEducationCreator/1.0 (educational tool; https://github.com/education-creator)",
}


async def _fetch_as_data_url(url: str, client: httpx.AsyncClient) -> str | None:
    """Download an image and return it as a base64 data URL."""
    try:
        r = await client.get(url, headers={**HEADERS, "Referer": "https://en.wikipedia.org/"})
        if r.status_code == 200:
            content_type = r.headers.get("content-type", "image/png").split(";")[0].strip()
            b64 = base64.b64encode(r.content).decode("utf-8")
            return f"data:{content_type};base64,{b64}"
    except Exception:
        pass
    return None


async def search_wikipedia_image(query: str, client: httpx.AsyncClient) -> str | None:
    """
    Search Wikipedia for a query, find the first article with a thumbnail,
    download it and return it as a base64 data URL.
    """
    try:
        search_resp = await client.get(
            "https://en.wikipedia.org/w/api.php",
            params={
                "action": "query",
                "list": "search",
                "srsearch": query,
                "srlimit": 5,
                "format": "json",
            },
            headers=HEADERS,
        )
        search_resp.raise_for_status()
        results = search_resp.json().get("query", {}).get("search", [])

        for result in results:
            title = result.get("title", "")
            if not title:
                continue

            rest_resp = await client.get(
                f"https://en.wikipedia.org/api/rest_v1/page/summary/{quote(title)}",
                headers=HEADERS,
            )
            if rest_resp.status_code != 200:
                continue

            page = rest_resp.json()
            src = page.get("thumbnail", {}).get("source", "")
            if not src:
                continue

            # Upgrade to a larger size
            src = src.replace("/320px-", "/480px-").replace("/330px-", "/480px-").replace("/200px-", "/480px-")

            # Download and base64 encode
            data_url = await _fetch_as_data_url(src, client)
            if data_url:
                return data_url
            # Rate limited — return the raw URL as fallback
            return src

    except Exception:
        pass
    return None


def pollinations_image(prompt: str) -> str:
    encoded = quote(prompt[:150])
    return f"https://image.pollinations.ai/prompt/{encoded}?width=512&height=512&nologo=true&seed=42"


async def get_images_for_flashcards(topic: str, flashcards: list) -> list:
    """
    Return one image per flashcard as a base64 data URL (or public URL fallback).
    We reuse a single httpx client and share fetched results via a cache.
    """
    image_urls: list[str] = []
    cache: dict[str, str | None] = {}

    async with httpx.AsyncClient(timeout=15.0, follow_redirects=True) as client:
        # Fetch the main topic image first (used as fallback for cards)
        base_img = await search_wikipedia_image(topic, client)
        cache[topic] = base_img

        for card in flashcards:
            question = card.get("question", "")
            short_kw = " ".join(question.replace("?", "").split()[:4]).strip()
            card_query = f"{topic} {short_kw}".strip()

            if card_query not in cache:
                # Small delay to respect Wikimedia rate limits
                await asyncio.sleep(0.5)
                cache[card_query] = await search_wikipedia_image(card_query, client)

            img = cache[card_query] or base_img

            if not img:
                img = pollinations_image(f"educational illustration of {card_query}, clean textbook diagram")

            image_urls.append(img)

    return image_urls
