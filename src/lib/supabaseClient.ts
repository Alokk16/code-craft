// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// Get the Supabase URL and Key from your environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);