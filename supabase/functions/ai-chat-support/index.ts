
import 'https://deno.land/x/xhr@0.1.0/mod.ts'
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const openAIApiKey = Deno.env.get('OPENAI_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (!openAIApiKey) {
      throw new Error("Missing OPENAI_API_KEY environment variable.")
    }

    const { messages } = await req.json()

    const completionConfig = {
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: "You are a friendly and helpful support assistant for a trip planning application. You can help users with questions about the app, travel tips, or destination ideas. Keep your answers concise and helpful."
            },
            ...messages,
        ],
        temperature: 0.7,
        max_tokens: 1024,
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(completionConfig),
    });

    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(`OpenAI API error: ${errorBody.error.message}`);
    }

    const data = await response.json()
    const aiResponse = data.choices[0].message;

    return new Response(JSON.stringify({ message: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
