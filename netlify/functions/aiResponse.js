// netlify/functions/aiResponse.js
const { OpenAI } = require("openai");

const client = new OpenAI({
  apiKey: process.env.A4F_API_KEY, // Secure env var
  baseURL: "https://api.a4f.co/v1",
});

exports.handler = async function (event, context) {
  try {
    const body = JSON.parse(event.body);
    const userMessage = body.message || "Hello!";

    const completion = await client.chat.completions.create({
      model: "provider-1/gpt-3.5-turbo-1106",
      messages: [
        {
          role: "system",
          content: "You are a helpful AI assistant. Respond to the user in a friendly and concise manner."
        },
        {
          role: "user",
          content: userMessage
        }
      ]
    });

    const reply = completion.choices[0].message.content;
    return {
      statusCode: 200,
      body: JSON.stringify({ reply }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
