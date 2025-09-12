'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useDebounce } from 'use-debounce';
import { useAuth } from '@/context/AuthProvider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PollsList from './PollsList'; // Using the new PollsList component
import { User } from '@supabase/supabase-js';

export default function PollsPage() {
  const { supabase } = useAuth();
  const [polls, setPolls] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all') // 'all', 'open', 'closed'
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single();
        if (profile) {
          setUsername(profile.username);
        }
      }
    };
    fetchUser();
  }, [supabase]);

  const fetchPolls = useCallback(async () => {
    setLoading(true);
    let { data, error } = await supabase.rpc('get_all_polls');

    console.log('Fetching polls with:', { searchTerm, statusFilter, debouncedSearchTerm });
    console.log('Supabase RPC response - Data:', data);
    console.log('Supabase RPC response - Error:', error);

    if (error) {
      console.error('Error fetching polls:', error);
      setPolls([]);
    } else {
      let filteredData = data;

      if (debouncedSearchTerm) {
        filteredData = filteredData.filter(poll => 
          poll.question.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        );
      }

      if (statusFilter === 'open') {
        filteredData = filteredData.filter(poll => 
          !poll.closing_date || new Date(poll.closing_date) > new Date()
        );
      } else if (statusFilter === 'closed') {
        filteredData = filteredData.filter(poll => 
          poll.closing_date && new Date(poll.closing_date) <= new Date()
        );
      } else if (statusFilter === 'my_polls') {
        filteredData = filteredData.filter(poll => 
          user && poll.created_by === user.id
        );
      } else if (statusFilter === 'trending') {
        filteredData = filteredData.sort((a, b) => b.total_votes - a.total_votes);
      }

      setPolls(filteredData);
    }
    setLoading(false);
  }, [supabase, debouncedSearchTerm, statusFilter, user]);

  useEffect(() => {
    fetchPolls();
  }, [fetchPolls]);

  return (
    <div className="container mx-auto py-8">
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40 rounded-xl mb-8">
        <div className="container px-4 md:px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter leading-tight">
              {username ? `Welcome back, ${username} 👋` : 'Explore Polls'}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              {username ? 'Ready to vote or create a new poll today?' : 'Discover and create engaging polls on any topic.'}
            </p>
            <Link href="/polls/create">
              <Button size="lg" className="mt-4">Create a New Poll</Button>
            </Link>
          </div>
        </div>
      </section>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex w-full md:w-auto items-center gap-2">
          <Input
            type="text"
            placeholder="Search polls..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64"
          />
          <Select onValueChange={setStatusFilter} defaultValue={statusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="my_polls">My Polls</SelectItem>
              <SelectItem value="trending">Trending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {loading ? (
        <div className="text-center py-10">Loading polls...</div>
      ) : (
        polls.length === 0 && statusFilter === 'my_polls' ? (
          <div className="text-center py-10">
            <p className="text-lg text-muted-foreground mb-4">You haven't created any polls yet.</p>
            <Link href="/polls/create">
              <Button size="lg">+ Create Your First Poll</Button>
            </Link>
          </div>
        ) : (
          <PollsList polls={polls} />
        )
      )}
    </div>
  );
}