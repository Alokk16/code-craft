// src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { auth } from '@clerk/nextjs/server';

export const createClerkSupabaseClient = () => {
  const cookieStore = cookies()
  
  // --- Start of Debugging Code ---
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("CRITICAL DEBUG: Supabase URL or Anon Key is missing from environment variables.");
  } else {
    console.log(`DEBUG: Initializing Supabase client for URL: ${supabaseUrl}`);
  }
  // --- End of Debugging Code ---

  return createServerClient(
    supabaseUrl!,
    supabaseAnonKey!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
      global: {
        fetch: async (url, options) => {
          const { getToken } = auth();
          const token = await getToken({ template: 'supabase' });
          const headers = new Headers(options?.headers);
          headers.set('Authorization', `Bearer ${token}`);
          
          // --- Start of Debugging Code ---
          console.log(`DEBUG: Supabase fetch called for URL:`, url);
          console.log(`DEBUG: Request headers include Authorization:`, headers.has('Authorization'));
          // --- End of Debugging Code ---

          return fetch(url, { ...options, headers });
        }
      }
    }
  )
}