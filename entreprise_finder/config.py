"""
Configuration centrale du programme.
Toutes les clés/API sont chargées depuis un fichier .env (voir .env.example).
Aucune clé n'est codée en dur ici.
"""
import os
from dotenv import load_dotenv

load_dotenv()

# --- API officielle gratuite (aucune clé requise) ---
RECHERCHE_ENTREPRISES_URL = "https://recherche-entreprises.api.gouv.fr/search"

# --- IA (optionnel mais recommandé) ---
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
USE_AI = bool(ANTHROPIC_API_KEY)

# --- Vérification SMTP ---
SMTP_FROM_ADDRESS = os.getenv("SMTP_FROM_ADDRESS", "verif@example.com")
SMTP_TIMEOUT = int(os.getenv("SMTP_TIMEOUT", "8"))
SMTP_HELO_DOMAIN = os.getenv("SMTP_HELO_DOMAIN", "example.com")

# --- Fallback si le port 25 est bloqué (API tierce, optionnel) ---
# Ex: https://www.mailboxvalidator.com/ ou https://verifalia.com/ ont un free tier.
# Laisse vide si tu n'en as pas / si tu comptes uniquement sur le check direct.
FALLBACK_VERIFY_API_URL = os.getenv("FALLBACK_VERIFY_API_URL", "")
FALLBACK_VERIFY_API_KEY = os.getenv("FALLBACK_VERIFY_API_KEY", "")

# --- Recherche web (pour LinkedIn + domaine société) ---
# ddgs = DuckDuckGo, gratuit, sans clé, mais peut être rate-limité si usage intensif.
# Si tu as une clé SerpAPI (free tier dispo), le programme l'utilisera en priorité.
SERPAPI_KEY = os.getenv("SERPAPI_KEY", "")

# --- Réglages généraux ---
REQUEST_TIMEOUT = 10
MAX_WORKERS = 5  # parallélisation du traitement en mode batch (CSV)
USER_AGENT = "Mozilla/5.0 (compatible; EntrepriseFinder/1.0; +recherche interne)"

# Domaines à exclure quand on cherche le "site officiel" d'une entreprise
DOMAINES_EXCLUS = [
    "linkedin.com", "societe.com", "infogreffe.fr", "pagesjaunes.fr",
    "verif.com", "pappers.fr", "bfmtv.com", "lesechos.fr", "wikipedia.org",
    "facebook.com", "instagram.com", "twitter.com", "x.com", "indeed.com",
    "glassdoor.fr", "kompass.com", "manageo.fr", "bloomberg.com",
]
