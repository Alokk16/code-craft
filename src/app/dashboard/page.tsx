import { UserButton } from '@clerk/nextjs';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import DeleteRoadmapButton from '@/components/DeleteRoadmapButton';

type Roadmap = {
  id: string;
  title: string;
  description: string;
  slug: string;
  created_at: string;
};

export default async function DashboardPage() {
  const { data: roadmaps, error } = await supabase.from('roadmaps').select('*');

  if (error) {
    console.error('Error fetching roadmaps:', error);
    return (
      <div className="container mx-auto max-w-7xl p-8">
        <p className="text-red-500">Could not load roadmaps. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/roadmaps/create"
            className="inline-flex items-center gap-2 rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-purple-700"
          >
            <PlusCircle className="h-4 w-4" />
            New Roadmap
          </Link>
          <UserButton />
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold">Your Roadmaps</h2>
        {Array.isArray(roadmaps) && roadmaps.length > 0 ? (
          <ul className="mt-4 space-y-4">
            {roadmaps.map((roadmap: Roadmap) => (
              <li key={roadmap.id} className="rounded-lg border border-gray-700 bg-gray-800 p-4">
                <div className="flex items-center justify-between">
                  <Link href={`/roadmaps/${roadmap.slug}`}>
                    <h3 className="text-xl font-bold text-white hover:underline">{roadmap.title}</h3>
                  </Link>
                  <DeleteRoadmapButton roadmapId={roadmap.id} />
                </div>
                <p className="mt-2 text-gray-400">{roadmap.description}</p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-4 rounded-lg border-2 border-dashed border-gray-600 p-8 text-center">
            <p className="text-gray-400">You haven't created any roadmaps yet.</p>
            <p className="text-sm text-gray-500">Click "New Roadmap" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}