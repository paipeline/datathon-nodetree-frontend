// This is the temporary api for the chatbot, it will be replaced by the new api by the real backend api
// obsolete

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { messages } = await req.json();

    console.log("api 被调用");
    
    const systemMessage = {
      role: "system",
      content: "返回数学公式的时候需要额外添加$$符号包裹latex公式"
    };

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [systemMessage, ...messages],
      temperature: 0.7,
      stream: false,
    });

    return new Response(JSON.stringify({
      content: completion.choices[0].message.content
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'API request failed' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}