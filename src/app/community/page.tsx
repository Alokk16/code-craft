// src/app/community/page.tsx
import { Users, BookOpenCheck, GitFork } from 'lucide-react';

export default function CommunityPage() {
  return (
    <div className="container mx-auto max-w-4xl p-8 text-white">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Join the <span className="text-purple-400">CodeCraft</span> Community
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300">
          Learning to code can be challenging, but you don't have to do it alone. Our community is being built to help you connect, collaborate, and grow with fellow developers.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Benefit 1 */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-900/50">
            <Users className="h-6 w-6 text-purple-400" />
          </div>
          <h3 className="mt-4 text-xl font-bold">Connect & Network</h3>
          <p className="mt-2 text-gray-400">Find study partners, mentors, and friends who share your passion for technology.</p>
        </div>

        {/* Benefit 2 */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-900/50">
            <BookOpenCheck className="h-6 w-6 text-purple-400" />
          </div>
          <h3 className="mt-4 text-xl font-bold">Share Knowledge</h3>
          <p className="mt-2 text-gray-400">Ask questions, share your projects, and learn from the collective experience of the community.</p>
        </div>

        {/* Benefit 3 */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-900/50">
            <GitFork className="h-6 w-6 text-purple-400" />
          </div>
          <h3 className="mt-4 text-xl font-bold">Collaborate on Projects</h3>
          <p className="mt-2 text-gray-400">Work together on open-source projects to build real-world experience and a strong portfolio.</p>
        </div>
      </div>
      
      <div className="mt-20 text-center">
        <h2 className="text-3xl font-bold text-white">Feature Coming Soon!</h2>
        <p className="mt-4 text-gray-400">We are working hard to build a supportive and inclusive space. Stay tuned for updates!</p>
      </div>
    </div>
  );
}