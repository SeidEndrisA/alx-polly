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
    let { data, error } = await supabase.rpc('get_all_polls');

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
      }

      setPolls(filteredData);
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
