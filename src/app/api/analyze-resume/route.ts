// src/app/api/analyze-resume/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import pdf from 'pdf-parse';

// This is required for pdf-parse to work in the Next.js edge runtime
export const config = {
  runtime: 'edge',
};

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const resumeFile = formData.get('resumeFile') as File | null;
    const jobDescription = formData.get('jobDescription') as string | null;

    if (!resumeFile || !jobDescription) {
      return NextResponse.json({ error: 'Missing resume or job description.' }, { status: 400 });
    }

    // Parse the PDF file
    const fileBuffer = Buffer.from(await resumeFile.arrayBuffer());
    const pdfData = await pdf(fileBuffer);
    const resumeText = pdfData.text;

    // AI Prompt Engineering
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `
      You are an expert career coach and resume reviewer.
      Analyze the following resume text against the provided job description for the role of "${jobDescription}".

      Resume Text:
      ---
      ${resumeText}
      ---

      Job Description:
      ---
      ${jobDescription}
      ---

      Based on the analysis, provide the following in a valid JSON format:
      1.  "score": An integer score from 0 to 100 representing how well the resume matches the job description.
      2.  "strengths": A string in markdown format explaining the key strengths of the resume for this specific job.
      3.  "weaknesses": A string in markdown format explaining the key weaknesses and what's missing.
      4.  "suggestions": A string in markdown format with actionable suggestions for improving the resume.

      Your entire response must be only the raw JSON object, with no markdown formatting.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const jsonData = JSON.parse(jsonText);

    return NextResponse.json(jsonData);
  } catch (error) {
    console.error('Resume analysis error:', error);
    return NextResponse.json({ error: 'Failed to analyze resume' }, { status: 500 });
  }
}