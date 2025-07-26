// src/app/api/generate-roadmap/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  console.log('API route hit. Processing request...');

  // Step 1: Check for Google API Key
  const googleApiKey = process.env.GOOGLE_API_KEY;
  if (!googleApiKey) {
    console.error('CRITICAL: GOOGLE_API_KEY is not set in .env.local');
    return NextResponse.json({ error: 'Server configuration error: Missing API Key.' }, { status: 500 });
  }

  // Step 2: Authenticate the user
  const { userId } = auth();
  if (!userId) {
    console.log('Unauthorized: User not logged in.');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { domain } = await request.json();
    console.log(`Received domain: "${domain}" from user: ${userId}`);

    if (!domain) {
      console.log('Validation Error: Domain is required.');
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
    }

    // Step 3: Call the Gemini API
    console.log('Initializing Google Generative AI...');
    const genAI = new GoogleGenerativeAI(googleApiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      You are an expert in creating developer career roadmaps.
      A user wants a learning roadmap for the domain: "${domain}".
      Generate a detailed, structured learning path in a valid JSON format.
      The JSON object must have a single key "sections", which is an array.
      Each object in the "sections" array should have a "title" (string) and a "topics" (array of objects).
      Each object in the "topics" array should have a "title" (string) and a "description" (string).
      Do not include any text, explanations, or markdown formatting before or after the JSON object.
      Your entire response should be only the raw JSON object.
    `;

    console.log('Sending prompt to Gemini...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log('Received response from Gemini.');

    const jsonText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const jsonData = JSON.parse(jsonText);
    console.log('Successfully parsed JSON from Gemini response.');

    // Step 4: Save to Supabase
    const slug = domain.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    console.log(`Saving to Supabase with slug: ${slug}`);

    const { error: supabaseError } = await supabase.from('roadmaps').insert({
      title: `Roadmap for ${domain}`,
      description: `An AI-generated learning path for ${domain}.`,
      content: jsonData,
      slug: slug,
      user_id: userId,
    });

    if (supabaseError) {
      throw new Error(`Supabase error: ${supabaseError.message}`);
    }

    console.log('Successfully saved to Supabase.');
    return NextResponse.json({ message: 'Roadmap generated and saved successfully!' });

  } catch (error: any) {
    // This will now catch and log the specific error
    console.error('--- A CRASH OCCURRED IN THE API ROUTE ---');
    console.error(error);
    console.error('--- END OF CRASH REPORT ---');
    return NextResponse.json({ error: `Failed to generate roadmap: ${error.message}` }, { status: 500 });
  }
}