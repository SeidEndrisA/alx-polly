
import { notFound } from 'next/navigation';
import PollClient from './PollClient';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

// Revalidate every 30 seconds
export const revalidate = 30;

async function getPollData(id: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: poll, error } = await supabase
    .from('polls')
    .select('id, question, created_by')
    .eq('id', id)
    .single();

  if (error || !poll) {
    return null;
  }

  const { data: options } = await supabase
    .from('poll_options')
    .select('id, option_text, votes')
    .eq('poll_id', id)
    .order('id', { ascending: true });

  return { poll, options: options || [] };
}

export default async function PollPage({ params }: { params: { id: string } }) {
  const data = await getPollData(params.id);

  if (!data) {
    notFound();
  }

  return <PollClient initialData={data} pollId={params.id} />;
}
