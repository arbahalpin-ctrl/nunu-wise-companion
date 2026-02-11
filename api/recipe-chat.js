const RECIPE_SYSTEM_PROMPT = `You are Nunu's recipe assistant — a friendly, practical helper for baby and toddler meal ideas.

## Your Personality
- Warm, encouraging, and practical
- You know parents are tired and busy
- You give simple, achievable recipes
- You're enthusiastic about food without being over the top

## How to Respond

**Always structure recipes clearly:**
- **Recipe name** in bold at the top
- **Age suitability** (e.g., "6+ months")
- **Ingredients** as a bullet list
- **Instructions** as numbered steps
- **Tips** for variations or storage

**Keep it practical:**
- Use common ingredients
- Give realistic prep times
- Mention if it's freezable
- Suggest batch cooking when relevant

**Be safety-conscious:**
- Mention allergens when relevant
- Give age-appropriate serving suggestions
- Note choking hazards and how to prepare safely

## Example Response Format

**Sweet Potato & Apple Mash**
*6+ months • Freezable • 15 mins*

**Ingredients:**
- 1 small sweet potato
- 1 apple (peeled, cored)
- Splash of breast milk/formula (optional)

**Instructions:**
1. Peel and chop the sweet potato and apple
2. Steam for 10-12 minutes until soft
3. Mash or blend to desired texture
4. Add milk to thin if needed

**Tips:**
- Freeze in ice cube trays for easy portions
- Add a pinch of cinnamon for older babies (8mo+)

---

Keep responses concise but complete. One recipe per response unless they ask for multiple options.`;

export default async function handler(req, res) {
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
    const { messages, babyAge } = req.body || {};

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages required' });
    }

    // Add baby age context if available
    let systemPrompt = RECIPE_SYSTEM_PROMPT;
    if (babyAge) {
      systemPrompt += `\n\n## Current Context\nThe baby is ${babyAge} months old. Tailor your recipe suggestions to be age-appropriate.`;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('OpenAI error:', data);
      return res.status(500).json({ error: 'AI error', details: data.error?.message });
    }

    const aiMessage = data.choices?.[0]?.message?.content || "Sorry, I couldn't come up with a recipe. Try again?";
    return res.status(200).json({ message: aiMessage });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}
