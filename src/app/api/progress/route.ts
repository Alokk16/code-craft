// src/app/api/progress/route.ts
import { supabase } from '@/lib/supabaseClient';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { roadmap_id, topic_title, is_completed } = await request.json();

    if (is_completed) {
      // Use upsert to insert a new record or ignore if it already exists.
      const { error } = await supabase.from('user_progress').upsert(
        {
          user_id: userId,
          roadmap_id: roadmap_id,
          topic_title: topic_title,
        },
        { onConflict: 'user_id,roadmap_id,topic_title' }
      );

      if (error) throw error;
    } else {
      // The delete logic remains the same.
      const { error } = await supabase
        .from('user_progress')
        .delete()
        .eq('user_id', userId)
        .eq('roadmap_id', roadmap_id)
        .eq('topic_title', topic_title);

      if (error) throw error;
    }

    return NextResponse.json({ message: 'Progress updated' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}