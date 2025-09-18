'use client'

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Poll = { 
  id: string; 
  question: string; 
  total_votes: number; 
  author_username: string | null;
};

export default function PollsList({ polls }: { polls: Poll[] }) {
  if (polls.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        <p>No polls found.</p>
        <Link href="/polls/create">
            <Button className="mt-4">Create a Poll</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {polls.map((poll) => (
        <Card key={poll.id}>
          <CardHeader>
            <CardTitle>{poll.question}</CardTitle>
            <CardDescription>
              Created by {poll.author_username || 'Anonymous'}
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-between">
            <div className="text-sm font-semibold text-muted-foreground">
              {poll.total_votes} votes
            </div>
            <Link href={`/polls/${poll.id}`} aria-label={`View poll: ${poll.question}`}>
              <Button variant="outline">View Poll</Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
