export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  const SERP_API_KEY = process.env.SERP_API_KEY;

  if (!GROQ_API_KEY || !SERP_API_KEY) {
    return res.status(500).json({ error: 'API keys not configured on server' });
  }

  const { action, payload } = req.body;

  try {
    // ── Groq LLM call ──────────────────────────────────────────────────────────
    if (action === 'groq') {
      const { systemPrompt, userMessage } = payload;
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage }
          ],
          temperature: 0.1,
          max_tokens: 800
        })
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        return res.status(response.status).json({ error: err?.error?.message || 'Groq error' });
      }
      const data = await response.json();
      return res.status(200).json({ result: data.choices[0].message.content.trim() });
    }

    // ── SerpAPI Shopping search ────────────────────────────────────────────────
    if (action === 'serp') {
      const { query, country } = payload;
      const params = new URLSearchParams({
        engine: 'google_shopping',
        q: query,
        gl: country || 'us',
        hl: 'en',
        api_key: SERP_API_KEY
      });
      const response = await fetch(`https://serpapi.com/search.json?${params}`);
      if (!response.ok) {
        return res.status(response.status).json({ error: `SerpAPI error ${response.status}` });
      }
      const data = await response.json();
      return res.status(200).json({ results: data.shopping_results || [] });
    }

    return res.status(400).json({ error: 'Unknown action' });

  } catch (err) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
