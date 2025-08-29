# Product Competitor Scraper

A small FastAPI app that finds companies offering the same product, scoped by location, with a one-click Copy for each result (URL + overview).

## Why this tool?
- Quick competitor landscape for a product in a city/region/country
- Paste your own company URL to auto-extract keywords
- One-page UI, no external keys required

## Getting started

```bash
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
