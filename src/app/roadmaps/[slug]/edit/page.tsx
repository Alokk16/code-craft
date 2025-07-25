// src/app/roadmaps/[slug]/edit/page.tsx
import { supabase } from '@/lib/supabaseClient';
import { notFound } from 'next/navigation';
import EditRoadmapForm from '@/components/EditRoadmapForm';

type EditRoadmapPageProps = {
  params: {
    slug: string;
  };
};

export default async function EditRoadmapPage({ params }: EditRoadmapPageProps) {
  const { data: roadmap } = await supabase
    .from('roadmaps')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (!roadmap) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-2xl p-8">
      <h1 className="text-3xl font-bold mb-6">Edit Roadmap</h1>
      <EditRoadmapForm roadmap={roadmap} />
    </div>
  );
}