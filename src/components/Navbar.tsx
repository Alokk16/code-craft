// src/components/Navbar.tsx
import Link from 'next/link';
import { CodeXml } from 'lucide-react';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <CodeXml className="h-7 w-7 text-purple-400" />
          <span className="text-xl font-bold text-white">CodeCraft</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/roadmaps" className="text-sm font-medium text-gray-300 transition-colors hover:text-white">
            Roadmaps
          </Link>
          <Link href="/resources" className="text-sm font-medium text-gray-300 transition-colors hover:text-white">
            Resources
          </Link>
          <Link href="/community" className="text-sm font-medium text-gray-300 transition-colors hover:text-white">
            Community
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <SignedOut>
            <Link href="/sign-in" className="text-sm font-medium text-gray-300 transition-colors hover:text-white">
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex h-9 items-center justify-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-purple-700"
            >
              Sign Up
            </Link>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard" className="text-sm font-medium text-gray-300 transition-colors hover:text-white">
              Dashboard
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </header>
  );
};

export default Navbar;