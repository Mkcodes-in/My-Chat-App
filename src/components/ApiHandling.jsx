import axios from 'axios';

const API_KEY = "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";
export async function AiResponseHandling(prompt) {
  const workingModels = [
    {
      name: "openai/gpt-3.5-turbo",
      emoji: "🙂‍↔️",
      prompt: `(Friendly Hindi/English) ${prompt} - Reply like a close friend with emotions`
    },
    {
      name: "meta-llama/llama-3-8b-instruct",
      emoji: "👹",
      prompt: `(Casual tone) ${prompt} - Give a warm response with 1 emoji`
    },
    {
      name: "google/gemini-pro",
      emoji: "✨",
      prompt: `(Creative reply needed) ${prompt} - Respond in Hinglish`
    }
  ];

  for (const model of workingModels) {
    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: model.name,
          messages: [{ role: "user", content: model.prompt }],
          temperature: 0.7,
          max_tokens: 300
        },
        {
          headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "HTTP-Referer": window.location.href,
          },
          timeout: 5000
        }
      );
      return `${model.emoji} ${response.data.choices[0].message.content}`;
    } catch (error) {
      console.log(`[${model.name}] Skipping:`, error.message);
    }
  }

  return "Oops! something went wrong please try again later 😅";
}
