// src/app/roadmaps/[slug]/page.tsx
import { supabase } from '@/lib/supabaseClient';
import { notFound } from 'next/navigation';
import { CheckCircle2, Pencil } from 'lucide-react';
import Link from 'next/link';

// TYPE DEFINITIONS THAT WERE MISSING
type RoadmapPageProps = {
  params: {
    slug: string;
  };
};

type Topic = {
  title: string;
  description: string;
};

type Section = {
  title: string;
  topics: Topic[];
};

export default async function RoadmapPage({ params }: RoadmapPageProps) {
  const { slug } = params;

  // DATA FETCHING LOGIC THAT WAS MISSING
  const { data: roadmap, error } = await supabase
    .from('roadmaps')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !roadmap) {
    notFound();
  }

  const content = roadmap.content as { sections: Section[] };

  return (
    <div className="container mx-auto max-w-4xl p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-extrabold tracking-tight text-white">{roadmap.title}</h1>
        <Link
          href={`/roadmaps/${roadmap.slug}/edit`}
          className="inline-flex items-center gap-2 rounded-md border border-gray-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
        >
          <Pencil className="h-4 w-4" />
          Edit
        </Link>
      </div>
      <p className="mt-4 text-lg text-gray-400">{roadmap.description}</p>
      
      <div className="mt-12 space-y-12">
        {content?.sections?.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <h2 className="mb-6 text-2xl font-bold text-purple-400">
              {section.title}
            </h2>
            <div className="space-y-4">
              {section.topics.map((topic, topicIndex) => (
                <div key={topicIndex} className="flex items-start gap-4 rounded-lg border border-gray-700 bg-gray-800 p-4">
                  <div className="mt-1 flex-shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-gray-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{topic.title}</h3>
                    <p className="mt-1 text-gray-400">{topic.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}