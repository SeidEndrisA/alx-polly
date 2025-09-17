'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { User } from '@supabase/supabase-js'
import { castVote } from '@/lib/supabase/polls';



type Option = { id: string; option_text: string; votes: number };

interface PollVotingFormProps {
  options: Option[];
  pollId: string;
  onVoteSuccess: () => void;
  user: User | null;
}

export default function PollVotingForm({ options, pollId, onVoteSuccess, user }: PollVotingFormProps) {
  
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVote = async () => {
    if (!user) {
      toast.error('You must be logged in to vote.');
      return;
    }
    if (!selectedOption) {
      toast.warning('Please select an option to vote.');
      return;
    }

    setIsSubmitting(true);

    const { error } = await castVote(pollId, selectedOption);

    if (error) {
      console.error('Error voting:', error);
      toast.error(error.message || 'Failed to submit vote. You may have already voted.');
    } else {
      toast.success('Your vote has been cast!');
      onVoteSuccess();
    }

    setIsSubmitting(false);
  };

  return (
    <div className="space-y-4">
      <RadioGroup onValueChange={setSelectedOption} className="space-y-2">
        {options.map((option) => (
          <Label 
            key={option.id}
            htmlFor={option.id}
            className="flex items-center gap-4 rounded-2xl border p-6 cursor-pointer hover:bg-accent/50 transition-colors [&:has([data-state=checked])]:bg-accent"
          >
            <RadioGroupItem value={option.id} id={option.id} />
            <span className="text-lg font-semibold">{option.option_text}</span>
          </Label>
        ))}
      </RadioGroup>
      <Button
        onClick={handleVote}
        disabled={isSubmitting || !selectedOption}
        className="w-full"
        size="lg"
      >
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Submit Your Vote
      </Button>
    </div>
  );
}
