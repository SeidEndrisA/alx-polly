import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import PollsList from "./polls/PollsList"; // Re-using the polls list component

async function getTrendingPolls() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from('polls')
    .select(`
      id,
      question,
      poll_options ( votes ),
      profiles ( username )
    `)
    .order('created_at', { ascending: false })
    .limit(6);

  if (error) {
    console.error('Error fetching trending polls:', error);
    return [];
  }

  const processedData = data.map(poll => {
    const total_votes = poll.poll_options.reduce((acc, opt) => acc + opt.votes, 0);
    const author_username = poll.profiles?.username || null;
    return { id: poll.id, question: poll.question, total_votes, author_username };
  }).sort((a, b) => b.total_votes - a.total_votes); // Sort by votes

  return processedData;
}

export default async function HomePage() {
  const trendingPolls = await getTrendingPolls();

  return (
    <>
      <section className="w-full py-20 md:py-32 bg-muted/40">
        <div className="container mx-auto text-center px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
              Create and Share Polls in Seconds
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              The easiest way to create, share, and analyze polls. Get real-time results
              and engage your audience like never before.
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <Link href="/polls/create">
              <Button size="lg">Create a Poll</Button>
            </Link>
            <Link href="/polls">
              <Button size="lg" variant="outline">
                Browse Polls
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto py-20">
        <h2 className="text-3xl font-bold text-center mb-8">Trending Polls</h2>
        <PollsList polls={trendingPolls} />
      </section>
    </>
  );
}
