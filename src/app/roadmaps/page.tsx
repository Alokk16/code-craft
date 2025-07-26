'use client'; // This interactive layout requires a Client Component

import { useState } from 'react';
import Link from 'next/link';
import { Youtube, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils'; // We'll use our utility function

// The data remains the same
const publicRoadmaps = [
  {
    id: 'frontend-1',
    title: 'Frontend Developer Roadmap',
    description: 'A step-by-step guide to becoming a modern frontend developer, covering HTML, CSS, JavaScript, React, and more.',
    youtube_links: [
      {
        title: 'Full Frontend Web Development Course for Beginners',
        url: 'https://www.youtube.com/watch?v=QA0XpGhLTSA',
      },
      {
        title: 'React JS Full Course for Beginners',
        url: 'https://www.youtube.com/watch?v=bMknfKXIFA8',
      },
      {
        title: 'Learn Tailwind CSS - Course for Beginners',
        url: 'https://www.youtube.com/watch?v=pfaSUYaSgPo',
      },
    ],
  },
  {
    id: 'backend-1',
    title: 'Backend Developer Roadmap',
    description: 'Learn to build the server-side of web applications. This path covers Node.js, Express, databases, APIs, and authentication.',
    youtube_links: [
      {
        title: 'Backend Web Development - Full Course for Beginners',
        url: 'https://www.youtube.com/watch?v=4-iC-9J2f6U',
      },
      {
        title: 'Node.js and Express.js - Full Course',
        url: 'https://www.youtube.com/watch?v=Oe421JkE95Y',
      },
      {
        title: 'Learn SQL In 60 Minutes',
        url: 'https://www.youtube.com/watch?v=p3qvj9hO_eQ',
      },
    ],
  },
  {
    id: 'devops-1',
    title: 'DevOps Roadmap',
    description: 'Understand the practices and tools that increase an organization\'s ability to deliver applications and services at high velocity.',
    youtube_links: [
      {
        title: 'DevOps Prerequisites Course - Getting started with DevOps',
        url: 'https://www.youtube.com/watch?v=Wvf0mBNGj6g'
      },
      {
        title: 'Docker Tutorial for Beginners',
        url: 'https://www.youtube.com/watch?v=3c-iBn73dDE'
      },
      {
        title: 'Kubernetes Course - Full Beginners Tutorial (Containerize Your Apps!)',
        url: 'https://www.youtube.com/watch?v=d6WC5n9G_sA'
      },
    ],
  },
];

export default function PublicRoadmapsPage() {
  const [selectedRoadmap, setSelectedRoadmap] = useState(publicRoadmaps[0]);

  return (
    <div className="container mx-auto max-w-7xl p-8 text-white">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Free Learning Roadmaps
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300">
          Select a path to view our curated learning guides and video tutorials.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
        {/* Left Column: Roadmap List */}
        <div className="md:col-span-1">
          <h2 className="text-lg font-semibold text-gray-400 mb-4">Choose a Path</h2>
          <div className="space-y-2">
            {publicRoadmaps.map((roadmap) => (
              <button
                key={roadmap.id}
                onClick={() => setSelectedRoadmap(roadmap)}
                className={cn(
                  'w-full text-left p-4 rounded-lg border border-transparent transition-colors',
                  selectedRoadmap.id === roadmap.id
                    ? 'bg-purple-900/50 border-purple-700'
                    : 'hover:bg-gray-800'
                )}
              >
                <h3 className="font-bold text-white">{roadmap.title}</h3>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Selected Roadmap Details */}
        <div className="md:col-span-2">
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-8 sticky top-24">
            <h2 className="text-3xl font-bold text-purple-400">{selectedRoadmap.title}</h2>
            <p className="mt-4 text-gray-300">{selectedRoadmap.description}</p>
            <div className="mt-8">
              <h3 className="text-xl font-semibold">Recommended Tutorials</h3>
              <div className="mt-4 space-y-3">
                {selectedRoadmap.youtube_links.map((video) => (
                  <Link
                    href={video.url}
                    key={video.title}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between rounded-lg bg-gray-800 p-3 transition-colors hover:bg-gray-700"
                  >
                    <div className="flex items-center gap-4">
                      <Youtube className="h-6 w-6 flex-shrink-0 text-red-500" />
                      <span className="font-medium">{video.title}</span>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-500 transition-transform group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}