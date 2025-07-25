import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="bg-black text-white">
      <div className="container mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Your Journey to Becoming a Tech Professional
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-lg text-gray-300">
          Follow structured roadmaps, access quality resources, and join a supportive community — all in one place.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="/roadmaps"
            className="inline-flex items-center justify-center rounded-full bg-purple-600 px-8 py-3 text-base font-medium text-white shadow transition-colors hover:bg-purple-700"
          >
            Explore Roadmaps
          </Link>
          <Link
            href="/community"
            className="inline-flex items-center justify-center rounded-full border border-gray-600 px-8 py-3 text-base font-medium text-white transition-colors hover:bg-gray-800"
          >
            Join the Community <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;