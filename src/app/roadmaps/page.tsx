// src/app/roadmaps/page.tsx
'use client'; // This component is now interactive, so we mark it as a client component.

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { Youtube, LoaderCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'; // We will create this file next

// Define TypeScript types for our data
type YoutubeLink = {
  title: string;
  url: string;
};

type PublicRoadmap = {
  id: string;
  title:string;
  description: string;
  youtube_links: YoutubeLink[];
};

export default function PublicRoadmapsPage() {
  const [roadmaps, setRoadmaps] = useState<PublicRoadmap[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRoadmaps = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('public_roadmaps')
        .select('*');
      
      if (data) {
        setRoadmaps(data);
      }
      setIsLoading(false);
    };

    fetchRoadmaps();
  }, []);

  return (
    <div className="container mx-auto max-w-4xl p-8 text-white">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Free Learning Roadmaps
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300">
          Curated learning paths and video tutorials to help you start your journey in tech, completely free.
        </p>
      </div>

      <div className="mt-12 w-full">
        {isLoading ? (
          <div className="flex justify-center items-center p-16">
            <LoaderCircle className="h-12 w-12 animate-spin text-purple-400" />
          </div>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {roadmaps.map((roadmap) => (
              <AccordionItem value={roadmap.id} key={roadmap.id}>
                <AccordionTrigger>
                  <div className="text-left">
                    <h2 className="text-xl font-semibold">{roadmap.title}</h2>
                    <p className="text-sm text-gray-400 mt-1">{roadmap.description}</p>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-4">
                    {roadmap.youtube_links.map((video) => (
                       <Link
                        href={video.url}
                        key={video.title}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 rounded-lg bg-gray-800 p-3 transition-colors hover:bg-gray-700"
                      >
                        <Youtube className="h-6 w-6 flex-shrink-0 text-red-500" />
                        <span className="font-medium">{video.title}</span>
                      </Link>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
}