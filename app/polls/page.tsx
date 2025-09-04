'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useDebounce } from 'use-debounce';
import { useAuth } from '@/context/AuthProvider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PollsList from './PollsList'; // Using the new PollsList component

export default function PollsPage() {
  const { supabase } = useAuth();
  const [polls, setPolls] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all') // 'all', 'open', 'closed'
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  const fetchPolls = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('polls')
      .select(`
        id,
        question,
        poll_options ( votes ),
        profiles ( username )
      `);

    if (debouncedSearchTerm) {
      query = query.ilike('question', `%${debouncedSearchTerm}%`);
    }

    if (statusFilter === 'open') {
      query = query.or('closing_date.is.null,closing_date.gt.now()');
    } else if (statusFilter === 'closed') {
      query = query.lte('closing_date', 'now()');
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching polls:', error);
      setPolls([]);
    } else {
      const processedData = data.map(poll => {
        const total_votes = poll.poll_options.reduce((acc, opt) => acc + opt.votes, 0);
        const author_username = poll.profiles?.username || null;
        return { id: poll.id, question: poll.question, total_votes, author_username };
      });
      setPolls(processedData);
    }
    setLoading(false);
  }, [supabase, debouncedSearchTerm, statusFilter]);

  useEffect(() => {
    fetchPolls();
  }, [fetchPolls]);

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold tracking-tighter">All Polls</h1>
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
            </SelectContent>
          </Select>
          <Link href="/polls/create">
            <Button className="whitespace-nowrap">Create New Poll</Button>
          </Link>
        </div>
      </div>
      {loading ? (
        <div className="text-center py-10">Loading polls...</div>
      ) : (
        <PollsList polls={polls} />
      )}
    </div>
  );
}
