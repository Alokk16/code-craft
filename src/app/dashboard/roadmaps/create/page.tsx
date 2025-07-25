'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { Sparkles } from 'lucide-react';

// Simplified schema for the initial input
const domainSchema = z.object({
  domain: z.string().min(5, { message: 'Please describe the domain you want to learn.' }),
});
type DomainValues = z.infer<typeof domainSchema>;

export default function CreateRoadmapPage() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [title, setTitle] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<DomainValues>({
    resolver: zodResolver(domainSchema),
  });

  // Function to call our new API route
  const handleGenerate = async ({ domain }: DomainValues) => {
    setIsGenerating(true);
    setGeneratedContent(null);
    setTitle(domain); // Use the domain as the title

    try {
      const response = await fetch('/api/generate-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate roadmap from AI.');
      }

      const data = await response.json();
      setGeneratedContent(data);
      toast.success('Roadmap generated successfully!');
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to save the generated roadmap
  const handleSaveRoadmap = async () => {
    if (!generatedContent || !title) return;

    const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

    const { error } = await supabase.from('roadmaps').insert({
      title: `Roadmap for ${title}`,
      description: `An AI-generated learning path for ${title}.`,
      content: generatedContent,
      slug: slug,
    });

    if (error) {
      toast.error('Failed to save roadmap: ' + error.message);
    } else {
      toast.success('Roadmap saved!');
      router.push('/dashboard');
    }
  };

  return (
    <div className="container mx-auto max-w-2xl p-8">
      <h1 className="text-3xl font-bold mb-6">Generate a New Roadmap</h1>
      <form onSubmit={handleSubmit(handleGenerate)} className="space-y-4">
        <div>
          <label htmlFor="domain" className="block text-sm font-medium mb-1">
            What do you want to learn?
          </label>
          <input
            id="domain"
            {...register('domain')}
            placeholder="e.g., 'Frontend Development with React' or 'Python for Data Science'"
            className="w-full p-2 border border-gray-700 rounded-md bg-gray-800 text-white"
          />
          {errors.domain && <p className="text-red-500 text-xs mt-1">{errors.domain.message}</p>}
        </div>
        <button
          type="submit"
          disabled={isGenerating}
          className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-500"
        >
          <Sparkles className="h-4 w-4" />
          {isGenerating ? 'Generating...' : 'Generate with AI'}
        </button>
      </form>

      {generatedContent && (
        <div className="mt-8 rounded-lg border border-purple-500 bg-gray-800 p-6">
          <h2 className="text-xl font-bold">Generated Roadmap Preview</h2>
          <p className="text-gray-400 mt-1">Review the generated content below and save it.</p>
          <pre className="mt-4 max-h-80 overflow-y-auto rounded bg-black p-4 text-sm">
            {JSON.stringify(generatedContent, null, 2)}
          </pre>
          <button
            onClick={handleSaveRoadmap}
            className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md"
          >
            Save This Roadmap
          </button>
        </div>
      )}
    </div>
  );
}