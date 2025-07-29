'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Sparkles, LoaderCircle, Upload } from 'lucide-react';
import { toast } from 'sonner';
import pdfParse from 'pdf-parse';
import { Buffer } from 'buffer'; // Import Buffer

// --- MISSING SCHEMAS AND TYPES ---
const resumeSchema = z.object({
  jobDescription: z.string().min(50, { message: 'Please paste the full job description.' }),
});
type ResumeValues = z.infer<typeof resumeSchema>;

type AnalysisResult = {
  score: number;
  strengths: string;
  weaknesses: string;
  suggestions: string;
};
// --- END OF MISSING CODE ---

export default function ResumeAnalyzerPage() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resumeText, setResumeText] = useState('');
  const [fileName, setFileName] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResumeValues>({
    resolver: zodResolver(resumeSchema),
  });

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file.');
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result;
        if (arrayBuffer instanceof ArrayBuffer) {
          // --- CORRECTED TYPE CONVERSION ---
          const buffer = Buffer.from(arrayBuffer);
          const data = await pdfParse(buffer);
          // --- END OF CORRECTION ---
          setResumeText(data.text);
          toast.success('Resume parsed successfully!');
        }
      } catch (error) {
        toast.error('Failed to parse PDF file.');
        setFileName('');
        setResumeText('');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const onSubmit = async (data: ResumeValues) => {
    if (!resumeText) {
      toast.error('Please upload and parse a resume first.');
      return;
    }
    setIsLoading(true);
    setAnalysisResult(null);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log({ resumeText, jobDescription: data.jobDescription });
    toast.info("UI is ready. Next, we'll build the AI backend.");
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto max-w-5xl p-8 text-white">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          AI Resume Analyzer
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300">
          Upload your resume and a job description to get instant feedback and a match score.
        </p>
      </div>

      <div className="mt-12">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Resume Upload Area */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Your Resume (PDF)
              </label>
              <label
                htmlFor="resume-upload"
                className="relative flex flex-col items-center justify-center w-full h-full p-3 border-2 border-dashed border-gray-600 rounded-md cursor-pointer hover:border-purple-500 hover:bg-gray-800/50 transition-colors"
              >
                <Upload className="h-10 w-10 text-gray-400" />
                <span className="mt-2 text-sm text-gray-300">
                  {fileName ? 'File selected:' : 'Click to upload your resume'}
                </span>
                {fileName && <p className="text-purple-400 font-semibold">{fileName}</p>}
                <input id="resume-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf" />
              </label>
            </div>
            {/* Job Description Area */}
            <div>
              <label htmlFor="jobDescription" className="block text-sm font-medium mb-1">
                Job Description
              </label>
              <textarea
                id="jobDescription"
                {...register('jobDescription')}
                rows={20}
                className="w-full p-3 border border-gray-700 rounded-md bg-gray-800 text-white font-mono text-sm resize-none"
                placeholder="Paste the full job description here..."
              />
              {errors.jobDescription && <p className="text-red-500 text-xs mt-1">{errors.jobDescription.message}</p>}
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-md disabled:bg-gray-500 transition-colors"
          >
            {isLoading ? (
              <LoaderCircle className="h-5 w-5 animate-spin" />
            ) : (
              <Sparkles className="h-5 w-5" />
            )}
            {isLoading ? 'Analyzing...' : 'Analyze My Resume'}
          </button>
        </form>
      </div>
    </div>
  );
}