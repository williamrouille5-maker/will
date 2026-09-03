"""
Wrapper de recherche web, utilisé pour retrouver le site officiel d'une entreprise
et le profil LinkedIn public d'un dirigeant.

Deux moteurs possibles :
- DuckDuckGo (gratuit, sans clé, via le package `ddgs`) -> utilisé par défaut
- SerpAPI (clé requise, free tier dispo) -> utilisé si SERPAPI_KEY est renseignée,
  nettement plus fiable / moins de rate-limiting sur de gros volumes (mode batch).
"""
import time
import requests
import config


def recherche_web(query: str, max_resultats: int = 5) -> list:
    """Retourne une liste de dicts {title, url, snippet}."""
    if config.SERPAPI_KEY:
        return _recherche_serpapi(query, max_resultats)
    return _recherche_ddg(query, max_resultats)


def _recherche_serpapi(query: str, max_resultats: int) -> list:
    resp = requests.get(
        "https://serpapi.com/search",
        params={"q": query, "api_key": config.SERPAPI_KEY, "num": max_resultats},
        timeout=config.REQUEST_TIMEOUT,
    )
    resp.raise_for_status()
    data = resp.json()
    out = []
    for r in data.get("organic_results", [])[:max_resultats]:
        out.append({
            "title": r.get("title", ""),
            "url": r.get("link", ""),
            "snippet": r.get("snippet", ""),
        })
    return out


def _recherche_ddg(query: str, max_resultats: int, retries: int = 2) -> list:
    try:
        from ddgs import DDGS
    except ImportError:
        raise ImportError(
            "Le package 'ddgs' n'est pas installé. Lance : pip install ddgs\n"
            "Ou renseigne une clé SERPAPI_KEY dans .env pour éviter DuckDuckGo."
        )

    for attempt in range(retries + 1):
        try:
            with DDGS() as ddgs:
                results = list(ddgs.text(query, max_results=max_resultats))
            out = []
            for r in results:
                out.append({
                    "title": r.get("title", ""),
                    "url": r.get("href", ""),
                    "snippet": r.get("body", ""),
                })
            return out
        except Exception:
            if attempt < retries:
                time.sleep(2 * (attempt + 1))  # backoff, DDG rate-limite vite
                continue
            return []
    return []
