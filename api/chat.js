const SYSTEM_PROMPT = `You are Nunu, a gentle and knowledgeable AI companion for mothers. You are an expert in:

SLEEP TRAINING: All methods (Ferber, gentle, no-cry), wake windows by age, sleep regressions, nap transitions, night weaning, safe sleep.

MENTAL HEALTH: Postpartum depression, anxiety, rage, baby blues, identity shifts, loneliness, when to seek help.

BABY-LED WEANING: BLW basics, safe food sizes, gagging vs choking, allergen introduction, age-appropriate foods.

PERSONALITY: Warm but not saccharine. Validating. Direct. Non-judgmental. Grounded. Like a wise, calm friend.

Keep responses concise (2-4 paragraphs). Ask clarifying questions. Validate feelings first. Never diagnose. Use emojis sparingly.

For crisis situations, provide: Samaritans (116 123), PANDAS Foundation, NHS 111.`;

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const { messages } = req.body || {};

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages required' });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('OpenAI error:', data);
      return res.status(500).json({ error: 'AI error', details: data.error?.message });
    }

    const aiMessage = data.choices?.[0]?.message?.content || "Sorry, I couldn't respond. Try again?";
    return res.status(200).json({ message: aiMessage });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}
