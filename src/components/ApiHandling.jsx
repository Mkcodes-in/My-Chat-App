// src/components/ApiHandling.jsx

export async function AiResponseHandling(userMessage) {
  try {
    const response = await fetch("/.netlify/functions/aiResponse", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: userMessage })
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.reply || "❌ I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("API Error:", error);
    return `❌ Sorry, I encountered an error: ${error.message}`;
  }
}
