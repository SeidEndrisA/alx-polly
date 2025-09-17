'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPollResults } from '@/lib/supabase/polls';
import { useEffect, useState } from 'react';


type Option = { id: string; option_text: string; votes: { length: number }[] };

interface PollResultsChartProps {
  pollId: string;
}

const COLORS = ['#3b82f6', '#10b981', '#ef4444', '#f97316', '#8b5cf6', '#d946ef'];

export default function PollResultsChart({ pollId }: PollResultsChartProps) {
  const [options, setOptions] = useState<Option[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);

  useEffect(() => {
    const fetchResults = async () => {
      const { data, error } = await getPollResults(pollId);
      if (data) {
        setOptions(data as any);
        const total = data.reduce((acc, option) => acc + option.votes.length, 0);
        setTotalVotes(total);
      }
    };
    fetchResults();
  }, [pollId]);

  const sortedOptions = [...options].sort((a, b) => a.votes.length - b.votes.length);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Results</span>
          <span className="text-sm font-normal text-muted-foreground">
            Total Votes: {totalVotes}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart
              layout="vertical"
              data={sortedOptions}
              margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
            >
              <XAxis type="number" hide />
              <YAxis
                dataKey="option_text"
                type="category"
                width={150}
                tickLine={false}
                axisLine={false}
                tick={{ fill: 'hsl(var(--foreground))' }}
              />
              <Tooltip
                cursor={{ fill: 'hsl(var(--accent))' }}
                contentStyle={{
                  background: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))'
                }}
              />
              <Bar dataKey="votes.length" barSize={30} radius={[0, 8, 8, 0]}>
                {sortedOptions.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}