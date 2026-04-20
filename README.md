# Price Hunter IL 🎯

Multi-agent price comparison tool — Israel vs abroad, all prices in ₪.

## Stack
- Frontend: vanilla HTML/CSS/JS
- Backend: Vercel serverless function (`/api/search.js`)
- LLM: Groq (llama-3.3-70b-versatile)
- Search: SerpAPI Google Shopping

## Project structure
```
price-hunter-il/
├── public/
│   └── index.html      ← frontend, zero API keys
├── api/
│   └── search.js       ← serverless function, holds keys server-side
├── vercel.json         ← routing config
└── README.md
```

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to vercel.com → New Project → import your GitHub repo
3. Add environment variables in Vercel dashboard (Settings → Environment Variables):
   - `GROQ_API_KEY` — your Groq API key
   - `SERP_API_KEY` — your SerpAPI key
4. Deploy — done!

## Local dev
```bash
npm i -g vercel
vercel dev
```
Add a `.env` file locally:
```
GROQ_API_KEY=gsk_...
SERP_API_KEY=...
```
