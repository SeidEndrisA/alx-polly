'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthProvider';

export default function AdminPage() {
  const { supabase, user } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      const checkAdminRole = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (data && data.role === 'admin') {
          setIsAdmin(true);
        } else {
          router.push('/polls');
        }
      };
      checkAdminRole();
    } else {
      router.push('/auth/signin');
    }
  }, [user, supabase, router]);

  if (!isAdmin) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p>Welcome, admin!</p>
    </div>
  );
}
