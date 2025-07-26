// src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { auth } from '@clerk/nextjs/server';

export const createClerkSupabaseClient = () => {
  const cookieStore = cookies()
  const { getToken } = auth();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
      global: {
        // Get the Supabase token with a custom async function
        fetch: async (url, options) => {
          const token = await getToken({ template: 'supabase' });
          const headers = new Headers(options?.headers);
          headers.set('Authorization', `Bearer ${token}`);
          return fetch(url, { ...options, headers });
        }
      }
    }
  )
}