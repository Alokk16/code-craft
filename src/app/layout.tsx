import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes'; // Import the dark theme
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CodeCraft',
  description: 'Your journey to becoming a tech professional.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en" className="dark">
        <body className={inter.className}>
          <Navbar />
          <main className="pt-16">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}