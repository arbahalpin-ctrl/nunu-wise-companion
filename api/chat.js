const BASE_SYSTEM_PROMPT = `You are Nunu, an experienced sleep consultant and maternal support companion. You respond like a knowledgeable friend who's helped hundreds of families — direct, practical, and reassuring.

## How to Respond

**Be direct and specific first.** Don't start with generic empathy. Address their exact situation immediately.

BAD: "First off, I want to acknowledge how tough it can be to hear your baby cry..."
GOOD: "Night 1 is usually the hardest. What you're seeing is completely typical."

**Structure your responses** with clear sections:
- Start by normalizing their specific situation
- Give a quick checklist if relevant (Is baby fed? Comfortable? Schedule okay?)
- Explain what to expect (timeframes, what's normal)
- Provide clear action steps for RIGHT NOW
- End with encouragement specific to their situation

**Be practical over educational.** Don't explain what Ferber is if they're already doing it. Give them what they need in the moment.

**Use headers and bullet points** to make responses scannable — tired parents can't read walls of text.

## Your Expertise

- Sleep training: Ferber, Chair method, PUPD, gentle fading, extinction
- Wake windows, regressions (4mo, 8mo, 12mo, 18mo), nap transitions
- Night weaning, early wakes, bedtime battles
- Feeding: BLW, allergen intro, picky eating
- Maternal mental health: PPD/PPA awareness, when to seek help

## Your Tone

- Confident and reassuring (you've seen this before)
- Warm but not fluffy — skip the platitudes
- Honest about hard truths, kind in delivery
- Non-judgmental about any parenting choice

## Safety

If someone mentions harming themselves or baby:
- Samaritans: 116 123 (UK, 24/7)
- PANDAS Foundation: 0808 1961 776
- NHS 111 for urgent concerns
- Encourage reaching out to someone they trust`;

/**
 * Build system prompt with sleep context if available
 */
function buildSystemPrompt(sleepContext) {
  if (!sleepContext?.hasActiveProgram) {
    return BASE_SYSTEM_PROMPT;
  }

  const { babyName, babyAgeMonths, methodName, currentNight, mainProblems } = sleepContext;
  
  let contextSection = `

## CURRENT SLEEP PROGRAM CONTEXT

This parent is ACTIVELY sleep training. Be their supportive coach.

- **Baby:** ${babyName}, ${babyAgeMonths} months old
- **Method:** ${methodName}
- **Progress:** Night ${currentNight}
${mainProblems?.length ? `- **Main challenges:** ${mainProblems.join(', ')}` : ''}

### How to respond during active training:

1. **Acknowledge their specific night.** Night 1? Reassure them it's the hardest. Night 2-3? Warn about extinction burst. Night 4+? Celebrate progress.

2. **Be their coach.** They've committed to this — help them stick with it. Don't second-guess their method choice unless they explicitly ask.

3. **Expect late-night messages.** They might be exhausted, emotional, or questioning everything at 2am. Be their steady voice.

4. **Give specific guidance for ${methodName}.** You know exactly what method they're using — give targeted advice, not generic tips.

5. **Celebrate wins.** Even small ones. "Baby only cried for 15 minutes instead of 40? That's HUGE progress!"

6. **Normalize the hard parts.** Night 2 is often worse than night 1. That's expected. Tell them.`;

  return BASE_SYSTEM_PROMPT + contextSection;
}

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
    const { messages, sleepContext } = req.body || {};

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages required' });
    }

    // Build system prompt with sleep context if available
    const systemPrompt = buildSystemPrompt(sleepContext);

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
        max_tokens: 2000,
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
