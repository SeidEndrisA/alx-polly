'use client'

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from 'sonner';
import { Loader2, Trash2, Edit, Eye } from 'lucide-react';

type Poll = { id: string; question: string };

export default function UserPollsList({ initialPolls }: { initialPolls: Poll[] }) {
  const { supabase } = useAuth();
  const [polls, setPolls] = useState(initialPolls);
  const [isDeleting, setIsDeleting] = useState<string | null>(null); // Store ID of poll being deleted

  const handleDelete = async (pollId: string) => {
    setIsDeleting(pollId);

    // First, delete related records in user_votes and poll_options
    const { error: votesError } = await supabase.from('user_votes').delete().eq('poll_id', pollId);
    const { error: optionsError } = await supabase.from('poll_options').delete().eq('poll_id', pollId);

    if (votesError || optionsError) {
      console.error('Error deleting related data:', votesError || optionsError);
      toast.error('Failed to delete poll dependencies. Please try again.');
      setIsDeleting(null);
      return;
    }

    // Now, delete the poll itself
    const { error: pollError } = await supabase.from('polls').delete().eq('id', pollId);

    if (pollError) {
      console.error('Error deleting poll:', pollError);
      toast.error('Failed to delete poll. Please try again.');
    } else {
      setPolls((prevPolls) => prevPolls.filter((poll) => poll.id !== pollId));
      toast.success('Poll deleted successfully.');
    }
    setIsDeleting(null);
  };

  if (polls.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        <p>You haven't created any polls yet.</p>
        <Link href="/polls/create">
            <Button className="mt-4">Create Your First Poll</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {polls.map((poll) => (
        <Card key={poll.id}>
          <CardHeader>
            <CardTitle>{poll.question}</CardTitle>
          </CardHeader>
          <CardFooter className="flex justify-end gap-2">
            <Link href={`/polls/${poll.id}`}>
              <Button variant="outline" size="sm"><Eye className="mr-2 h-4 w-4" />View</Button>
            </Link>
            <Button variant="outline" size="sm" disabled>
              <Edit className="mr-2 h-4 w-4" />Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" disabled={isDeleting === poll.id}>
                  {isDeleting === poll.id ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="mr-2 h-4 w-4" />
                  )}
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your poll and all its data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDelete(poll.id)}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
