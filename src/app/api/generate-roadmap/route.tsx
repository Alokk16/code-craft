// src/app/api/generate-roadmap/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Initialize the Google AI client with your API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(request: Request) {
  try {
    const { domain } = await request.json();

    if (!domain) {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // This is our "prompt engineering". We guide the AI to give us a specific output.
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

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up the response to ensure it's valid JSON
    const jsonText = text.replace(/```json/g, '').replace(/```/g, '').trim();

    // Validate and parse the JSON
    const jsonData = JSON.parse(jsonText);

    return NextResponse.json(jsonData);

  } catch (error) {
    console.error('AI generation error:', error);
    return NextResponse.json({ error: 'Failed to generate roadmap' }, { status: 500 });
  }
}