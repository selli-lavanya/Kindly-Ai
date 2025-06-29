export async function analyzeMessageHuggingFace(text, apiKey, language = "en") {
  // Use the English-only model (multilingual not available)
  const modelUrl =
    "https://api-inference.huggingface.co/models/bhadresh-savani/distilbert-base-uncased-emotion";
  const response = await fetch(modelUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inputs: text }),
  });
  if (!response.ok) throw new Error("Hugging Face API error");
  const result = await response.json();
  return { result, usedFallback: language !== "en" };
}
// Utility for OpenAI GPT-4 rewrite suggestions
export async function getGPTRewrites(text, context, apiKey) {
  const prompt = `Rewrite the following message for a ${context} in three ways: (1) softer, (2) more confident, (3) more clear.\nMessage: ${text}`;
  // Try GPT-3.5 first for broader access
  let response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
      temperature: 0.7,
    }),
  });
  if (!response.ok) throw new Error("OpenAI API error");
  return response.json();
}
// Utility for Hugging Face text generation (rewrites)
export async function getCohereRewrite(text, context, style, apiKey) {
  const prompt = `Rewrite the following message for a ${context} in a ${style} way:\nMessage: ${text}`;
  const response = await fetch("https://api.cohere.ai/v1/generate", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Cohere-Version": "2022-12-06",
    },
    body: JSON.stringify({
      model: "command",
      prompt,
      max_tokens: 300,
      temperature: 0.7,
      num_generations: 1,
      stop_sequences: [],
    }),
  });
  if (!response.ok) throw new Error("Cohere API error");
  const data = await response.json();
  if (Array.isArray(data.generations)) {
    return data.generations.map((gen) => gen.text.trim());
  }
  return [];
}
export async function getHuggingFaceRewrites(text, context, apiKey) {
  // Use a generic T5 model for paraphrasing
  const prompt = `paraphrase: ${text} </s>`;
  const response = await fetch(
    "https://api-inference.huggingface.co/models/t5-base",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: prompt }),
    },
  );
  if (!response.ok) throw new Error("Hugging Face Paraphrase API error");
  const data = await response.json();
  if (Array.isArray(data) && data[0]?.generated_text) {
    return data[0].generated_text.split("\n").filter(Boolean);
  }
  return [];
}
