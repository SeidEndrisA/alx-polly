import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import UserPollsList from './UserPollsList';

export default async function ProfilePage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/signin');
  }

  const { data: polls, error } = await supabase
    .rpc('get_user_polls', { user_id_arg: user.id });

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tighter">My Profile</h1>
        <p className="text-muted-foreground">{user.email}</p>
      </div>

      <div>
        <h2 className="text-2xl font-bold tracking-tighter mb-4">My Polls</h2>
        <UserPollsList initialPolls={polls || []} />
      </div>
    </div>
  );
}
