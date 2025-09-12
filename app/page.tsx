'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { User } from '@supabase/supabase-js';

export default function HomePage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getUser();
  }, [supabase]);

  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">Modern Polling App</h1>
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
        The easiest way to create, share, and analyze polls. Get real-time results
        and engage your audience like never before.
      </p>
      <div className="flex gap-4">
        {loading ? (
          <p>Loading...</p>
        ) : user ? (
          <Button onClick={() => router.push('/polls')}>View Polls</Button>
        ) : (
          <Button onClick={() => router.push('/auth/signin')}>Sign In</Button>
        )}
      </div>
    </div>
  );
}
