
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { sendPollClosingAlert } from '@/lib/email';

async function checkPolls() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: polls, error } = await supabase
    .from('polls')
    .select('id, question, closing_date, created_by(*)')
    .lt('closing_date', new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString())
    .gt('closing_date', new Date().toISOString());

  if (error) {
    console.error('Error fetching polls:', error);
    return;
  }

  if (polls) {
    for (const poll of polls) {
      const { data: notification, error: notificationError } = await supabase
        .from('notifications')
        .select('id')
        .eq('poll_id', poll.id)
        .eq('type', 'closing_alert')
        .single();

      if (!notification) {
        await sendPollClosingAlert(poll.created_by.email, poll.question);
        await supabase.from('notifications').insert([
          {
            poll_id: poll.id,
            user_id: poll.created_by.id,
            type: 'closing_alert',
            sent_at: new Date().toISOString(),
          },
        ]);
      }
    }
  }
}

checkPolls();
