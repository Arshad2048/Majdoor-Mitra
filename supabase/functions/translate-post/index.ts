import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// We define 'req' as a 'Request' type to fix the "implicitly any" error
serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { text, target_lang } = await req.json();

    if (!text || !target_lang) {
      return new Response(JSON.stringify({ error: "Missing text or target_lang" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Detecting language: If it has Hindi characters, source is 'hi', else 'en'
    const isHindi = /[\u0900-\u097F]/.test(text);
    const sourceLang = isHindi ? 'hi' : 'en';
    
    // Avoid translating to the same language
    if (sourceLang === target_lang) {
        return new Response(JSON.stringify({ translatedText: text }), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
    }

    // MyMemory API has a 500 character limit for free tier
    // We need to chunk the text if it's too long
    const CHUNK_SIZE = 450;
    
    // Split by sentences or fallback to raw chunks
    const chunkText = (str: string, size: number) => {
      const chunks = [];
      let currentChunk = '';
      
      // Split by common punctuation
      const sentences = str.match(/[^.!?\n]+[.!?\n]+/g) || [str];
      
      for (const sentence of sentences) {
        if ((currentChunk + sentence).length > size) {
          if (currentChunk) chunks.push(currentChunk.trim());
          
          // If a single sentence is longer than chunk size, we have to hard split it
          if (sentence.length > size) {
             let temp = sentence;
             while (temp.length > size) {
               chunks.push(temp.slice(0, size));
               temp = temp.slice(size);
             }
             currentChunk = temp;
          } else {
             currentChunk = sentence;
          }
        } else {
          currentChunk += sentence;
        }
      }
      if (currentChunk.trim()) chunks.push(currentChunk.trim());
      
      return chunks.length > 0 ? chunks : [str];
    };

    const textChunks = chunkText(text, CHUNK_SIZE);
    let translatedText = '';

    for (const chunk of textChunks) {
      if (!chunk.trim()) continue;
      
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk)}&langpair=${sourceLang}|${target_lang}`
      );

      const data = await response.json();

      if (data.responseStatus !== 200) {
        throw new Error(data.responseDetails || "Translation failed for chunk");
      }

      translatedText += data.responseData.translatedText + ' ';
    }
    
    translatedText = translatedText.trim();

    return new Response(JSON.stringify({ translatedText }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    // Handling error as a string safely to fix the "unknown type" error
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
