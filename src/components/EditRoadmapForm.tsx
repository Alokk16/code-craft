'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

const editRoadmapSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(10),
  content: z.string().min(20),
});

type EditRoadmapValues = z.infer<typeof editRoadmapSchema>;

export default function EditRoadmapForm({ roadmap }: { roadmap: any }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditRoadmapValues>({
    resolver: zodResolver(editRoadmapSchema),
    defaultValues: {
      title: roadmap.title,
      description: roadmap.description,
      content: JSON.stringify(roadmap.content, null, 2),
    },
  });

  const onSubmit = async (data: EditRoadmapValues) => {
    try {
      const parsedContent = JSON.parse(data.content);
      const response = await fetch(`/api/roadmaps/${roadmap.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          content: parsedContent,
        }),
      });

      if (!response.ok) throw new Error('Failed to update roadmap');

      toast.success('Roadmap updated successfully!');
      router.push(`/roadmaps/${roadmap.slug}`);
      router.refresh();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
        <input id="title" {...register('title')} className="w-full p-2 border border-gray-700 rounded-md bg-gray-800 text-white" />
        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
        <textarea id="description" {...register('description')} className="w-full p-2 border border-gray-700 rounded-md bg-gray-800 text-white" rows={3}></textarea>
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
      </div>
      <div>
        <label htmlFor="content" className="block text-sm font-medium mb-1">Content (JSON)</label>
        <textarea id="content" {...register('content')} className="w-full p-2 border border-gray-700 rounded-md bg-gray-800 text-white font-mono" rows={10}></textarea>
        {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>}
      </div>
      <button type="submit" disabled={isSubmitting} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-500">
        {isSubmitting ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
}