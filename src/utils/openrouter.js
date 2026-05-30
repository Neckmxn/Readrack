const BASE_URL = 'https://openrouter.ai/api/v1'
const API_KEY  = import.meta.env.VITE_OPENROUTER_API_KEY

export async function chatWithAI(messages, model = 'openai/gpt-4o') {
  const response = await fetch(`${BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Readrack'
    },
    body: JSON.stringify({
      model,
      messages,
      stream: false,
      max_tokens: 2048
    })
  })
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err?.error?.message || 'OpenRouter API error')
  }
  const data = await response.json()
  return data.choices[0].message.content
}

export async function streamChatWithAI(messages, onChunk, model = 'openai/gpt-4o') {
  const response = await fetch(`${BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Readrack'
    },
    body: JSON.stringify({
      model,
      messages,
      stream: true,
      max_tokens: 2048
    })
  })

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let full = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const chunk = decoder.decode(value)
    const lines = chunk.split('\n').filter(l => l.startsWith('data: '))
    for (const line of lines) {
      const data = line.slice(6)
      if (data === '[DONE]') continue
      try {
        const json = JSON.parse(data)
        const delta = json.choices?.[0]?.delta?.content || ''
        full += delta
        onChunk(delta, full)
      } catch (_) {}
    }
  }
  return full
}

export async function analyzeWithVision(imageBase64, prompt, model = 'openai/gpt-4o') {
  const response = await fetch(`${BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Readrack'
    },
    body: JSON.stringify({
      model,
      messages: [{
        role: 'user',
        content: [
          { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}` } },
          { type: 'text', text: prompt }
        ]
      }],
      max_tokens: 2048
    })
  })
  if (!response.ok) throw new Error('Vision API error')
  const data = await response.json()
  return data.choices[0].message.content
}
