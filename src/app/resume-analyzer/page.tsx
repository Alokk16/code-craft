'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Sparkles, LoaderCircle, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const jobTitles = [
  "Frontend Developer",
  "Backend Developer",
  "Full-Stack Developer",
  "DevOps Engineer",
  "Data Scientist",
  "AI / ML Engineer",
  "Mobile App Developer (iOS/Android)",
  "Software Engineer in Test (SDET)",
];

const resumeSchema = z.object({
  jobDescription: z.string({ required_error: 'Please select a job title.' }),
  resumeFile: z.instanceof(FileList)
    .refine((files) => files?.length === 1, 'Resume PDF is required.')
    .refine((files) => files?.[0]?.type === 'application/pdf', 'Only PDF files are accepted.'),
});
type ResumeValues = z.infer<typeof resumeSchema>;

type AnalysisResult = {
  score: number;
  strengths: string;
  weaknesses: string;
  suggestions: string;
};

export default function ResumeAnalyzerPage() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState('');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ResumeValues>({
    resolver: zodResolver(resumeSchema),
  });

  const onSubmit = async (data: ResumeValues) => {
    setIsLoading(true);
    setAnalysisResult(null);

    // Create a FormData object to send the file and text
    const formData = new FormData();
    formData.append('resumeFile', data.resumeFile[0]);
    formData.append('jobDescription', data.jobDescription);

    try {
      const response = await fetch('/api/analyze-resume', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to analyze resume.');
      }
      
      setAnalysisResult(result);
      toast.success('Analysis complete!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-7xl p-8 text-white">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          AI Resume Analyzer
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300">
          Upload your resume and select a job description to get instant feedback and a match score.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Left Column: Inputs */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Your Resume (PDF)</CardTitle>
              </CardHeader>
              <CardContent>
                <label
                  htmlFor="resumeFile"
                  className="relative flex flex-col items-center justify-center w-full py-12 border-2 border-dashed border-gray-600 rounded-md cursor-pointer hover:border-purple-500 hover:bg-gray-800/50 transition-colors"
                >
                  <Upload className="h-10 w-10 text-gray-400" />
                  <span className="mt-2 text-sm text-gray-300">
                    {fileName ? 'File selected:' : 'Click to upload'}
                  </span>
                  {fileName && <p className="text-purple-400 font-semibold mt-1">{fileName}</p>}
                </label>
                <input
                  id="resumeFile"
                  type="file"
                  className="sr-only"
                  {...register('resumeFile', {
                    onChange: (e) => setFileName(e.target.files?.[0]?.name || ''),
                  })}
                  accept=".pdf"
                />
                {errors.resumeFile && <p className="text-red-500 text-xs mt-2">{errors.resumeFile.message as string}</p>}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Target Job Role</CardTitle>
              </CardHeader>
              <CardContent>
                <Controller
                  control={control}
                  name="jobDescription"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a job role..." />
                      </SelectTrigger>
                      <SelectContent>
                        {jobTitles.map((title) => (
                          <SelectItem key={title} value={title}>
                            {title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.jobDescription && <p className="text-red-500 text-xs mt-2">{errors.jobDescription.message}</p>}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Analysis Result */}
          <div className="space-y-8">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Analysis Result</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-96">
                    <LoaderCircle className="h-12 w-12 animate-spin text-purple-400" />
                    <p className="mt-4 text-gray-400">Analyzing your resume...</p>
                  </div>
                ) : analysisResult ? (
                  <div className="space-y-6">
                    <div className="text-center">
                      <p className="text-lg text-gray-300">Your Score:</p>
                      <p className="text-7xl font-bold text-purple-400">{analysisResult.score}<span className="text-3xl text-gray-400">/100</span></p>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-green-400">Strengths</h3>
                        <p className="text-gray-300 whitespace-pre-wrap mt-1">{analysisResult.strengths}</p>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-yellow-400">Weaknesses</h3>
                        <p className="text-gray-300 whitespace-pre-wrap mt-1">{analysisResult.weaknesses}</p>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-blue-400">Suggestions</h3>
                        <p className="text-gray-300 whitespace-pre-wrap mt-1">{analysisResult.suggestions}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-96 text-center">
                    <p className="text-gray-400">Your analysis will appear here.</p>
                    <p className="text-sm text-gray-500">Upload your resume and select a job role to get started.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="mt-8">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-md disabled:bg-gray-500 transition-colors"
          >
            <Sparkles className="h-5 w-5" />
            Analyze My Resume
          </button>
        </div>
      </form>
    </div>
  );
}