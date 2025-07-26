'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { Sparkles } from 'lucide-react';

// Schema for the user's input
const domainSchema = z.object({
  domain: z.string().min(5, { message: 'Please describe the domain you want to learn.' }),
});
type DomainValues = z.infer<typeof domainSchema>;

export default function CreateRoadmapPage() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DomainValues>({
    resolver: zodResolver(domainSchema),
  });

  const onSubmit = async ({ domain }: DomainValues) => {
    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain }),
      });

      // If the response is not OK, we need to read the error message from it
      if (!response.ok) {
        const errorData = await response.json();
        // Throw an error with the specific message from our API
        throw new Error(errorData.error || 'Something went wrong on the server.');
      }
      
      toast.success('Roadmap generated and saved successfully!');
      router.push('/dashboard');
      router.refresh();
    } catch (e: any) {
      // Now this will display the actual error message from the backend
      toast.error(e.message);
    } finally {
      setIsGenerating(false);
    }
  };


  return (
    <div className="container mx-auto max-w-2xl p-8">
      <h1 className="text-3xl font-bold mb-6">Generate a New Roadmap</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          {isGenerating ? 'Generating and Saving...' : 'Generate with AI'}
        </button>
      </form>

      {/* The preview and separate save button are no longer needed */}
    </div>
  );
}