'use client'

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  profiles: { username: string };
}

export default function Comments({ pollId }: { pollId: string }) {
  const { supabase, user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      const { data, error } = await supabase
        .from('comments')
        .select('id, content, created_at, profiles(username)')
        .eq('poll_id', pollId)
        .order('created_at', { ascending: false });

      if (data) {
        setComments(data);
      }
    };
    fetchComments();
  }, [pollId, supabase]);

  useEffect(() => {
    const channel = supabase
      .channel(`comments_${pollId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'comments', filter: `poll_id=eq.${pollId}` },
        (payload) => {
          setComments((prevComments) => [payload.new as Comment, ...prevComments]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [pollId, supabase]);

  const handleCommentSubmit = async () => {
    if (!user) {
      toast.error('You must be logged in to comment.');
      return;
    }
    if (newComment.trim() === '') {
      toast.warning('Please enter a comment.');
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase
      .from('comments')
      .insert([{ poll_id: pollId, user_id: user.id, content: newComment }]);

    if (error) {
      toast.error(error.message);
    } else {
      setNewComment('');
    }

    setIsSubmitting(false);
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      <div className="space-y-4">
        {user && (
          <div className="flex flex-col gap-2">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
            />
            <Button onClick={handleCommentSubmit} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit
            </Button>
          </div>
        )}
        {comments.map((comment) => (
          <div key={comment.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <p className="font-bold">{comment.profiles.username}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(comment.created_at).toLocaleString()}
              </p>
            </div>
            <p>{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
