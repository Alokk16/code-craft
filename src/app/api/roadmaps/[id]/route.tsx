import { supabase } from '@/lib/supabaseClient';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = auth();
  const { id } = params;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { error } = await supabase
    .from('roadmaps')
    .delete()
    .eq('id', id)
    .eq('user_id', userId); // Double-check ownership

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Roadmap deleted' }, { status: 200 });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = auth();
  const { id } = params;
  const body = await request.json();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { error } = await supabase
    .from('roadmaps')
    .update({
      title: body.title,
      description: body.description,
      content: body.content,
    })
    .eq('id', id)
    .eq('user_id', userId); // Ensure user owns the roadmap

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Roadmap updated' }, { status: 200 });
}