'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthProvider'
import PollResultsChart from './PollResultsChart'
import PollVotingForm from './PollVotingForm'
import SharePoll from './SharePoll'

// Define types for our data
type Option = { id: string; option_text: string; votes: number };
type Poll = { id: string; question: string; created_by: string };
type InitialData = { poll: Poll; options: Option[] };

export default function PollClient({ initialData, pollId }: { initialData: InitialData, pollId: string }) {
  const { user, supabase } = useAuth();
  const [poll, setPoll] = useState<Poll>(initialData.poll);
  const [options, setOptions] = useState<Option[]>(initialData.options);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if the user has already voted
    const checkUserVote = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('user_votes')
        .select('option_id')
        .eq('user_id', user.id)
        .eq('poll_id', pollId)
        .single();

      if (data) {
        setHasVoted(true);
      }
      setLoading(false);
    };

    checkUserVote();
  }, [user, pollId]);

  useEffect(() => {
    const channel = supabase
      .channel(`poll_${pollId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'poll_options', filter: `poll_id=eq.${pollId}` },
        (payload) => {
          setOptions((currentOptions) =>
            currentOptions.map((option) =>
              option.id === payload.new.id ? { ...option, votes: payload.new.votes } : option
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [pollId]);

  const handleVoteSuccess = () => {
    setHasVoted(true);
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tighter mb-2">{poll.question}</h1>
        <SharePoll pollId={pollId} />
      </div>

      {hasVoted ? (
        <PollResultsChart options={options} />
      ) : (
        <PollVotingForm options={options} pollId={pollId} onVoteSuccess={handleVoteSuccess} />
      )}
    </div>
  );
}
