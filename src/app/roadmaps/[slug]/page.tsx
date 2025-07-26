// src/app/roadmaps/[slug]/page.tsx
import { supabase } from '@/lib/supabaseClient';
import { notFound } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import { Pencil } from 'lucide-react';
import RoadmapClientPage from '@/components/RoadmapClientPage';

// --- TYPE DEFINITIONS ---
type RoadmapPageProps = {
  params: {
    slug: string;
  };
};

type UserProgress = {
  topic_title: string;
};
// --- END TYPE DEFINITIONS ---

export default async function RoadmapPage({ params }: RoadmapPageProps) {
  const { slug } = params;
  const { userId } = auth();

  const { data: roadmap, error: roadmapError } = await supabase
    .from('roadmaps')
    .select('*')
    .eq('slug', slug)
    .single();

  if (roadmapError || !roadmap) {
    notFound();
  }

  // --- APPLY THE TYPE HERE ---
  let initialProgress: UserProgress[] = [];
  if (userId) {
    const { data: progressData, error: progressError } = await supabase
      .from('user_progress')
      .select('topic_title')
      .eq('user_id', userId)
      .eq('roadmap_id', roadmap.id);
    
    if (progressData) {
      initialProgress = progressData;
    }
  }

  return (
    <div className="container mx-auto max-w-4xl p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-extrabold tracking-tight text-white">{roadmap.title}</h1>
        {userId === roadmap.user_id && (
          <Link
            href={`/roadmaps/${roadmap.slug}/edit`}
            className="inline-flex items-center gap-2 rounded-md border border-gray-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Link>
        )}
      </div>
      <p className="mt-4 text-lg text-gray-400">{roadmap.description}</p>
      
      <RoadmapClientPage roadmap={roadmap} initialProgress={initialProgress} />
    </div>
  );
}