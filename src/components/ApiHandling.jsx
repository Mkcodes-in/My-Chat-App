const API_Key = 'sk-sLspU2DAuHwc3j3AQJgOepuvfuutEwf3rVxIx8QjiqXYfZLc';

export async function AiResponseHandling(userMessage) {
  try {
    const res = await fetch('https://api.chatanywhere.com.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_Key}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: userMessage }]
      }),
    });

    const data = await res.json();
    return data?.choices?.[0]?.message?.content || 'No response from assistant';
  } catch (error) {
    console.error('API Error:', error);
    return 'Error contacting API';
  }
}
