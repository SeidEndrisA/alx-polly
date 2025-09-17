
import { createClient } from './client';

/**
 * Casts a vote on a poll.
 * @param pollId The ID of the poll to vote on.
 * @param optionId The ID of the option to vote for.
 * @returns An object containing the new vote record or an error.
 */
export async function castVote(pollId: string, optionId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('votes')
    .insert([
      { poll_id: pollId, option_id: optionId },
    ]);

  return { data, error };
}

/**
 * Retrieves the results for a poll.
 * @param pollId The ID of the poll to retrieve results for.
 * @returns An object containing the poll results or an error.
 */
export async function getPollResults(pollId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('options')
    .select('*, votes(*)')
    .eq('poll_id', pollId);

  return { data, error };
}
