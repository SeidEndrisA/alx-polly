'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function HomePage() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const redirectUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setTimeout(() => {
        if (user) {
          router.push('/polls');
        } else {
          router.push('/auth/signin');
        }
      }, 3000);
    };
    redirectUser();
  }, [router, supabase]);

  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">Modern Polling App</h1>
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
        The easiest way to create, share, and analyze polls. Get real-time results
        and engage your audience like never before.
      </p>
    </div>
  );
}
