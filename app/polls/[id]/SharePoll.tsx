'use client'

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Share2, Copy } from "lucide-react";
import QRCode from "react-qr-code";
import { toast } from 'sonner';

export default function SharePoll({ pollId }: { pollId: string }) {
  const [url, setUrl] = useState('');

  useEffect(() => {
    // Ensure window is defined (runs only on client-side)
    if (typeof window !== 'undefined') {
      setUrl(window.location.href);
    }
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
  };

  if (!url) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Share this poll</h4>
            <p className="text-sm text-muted-foreground">
              Anyone with the link can view and vote on this poll.
            </p>
          </div>
          <div className="flex items-center justify-center p-4 bg-white rounded-md">
            <QRCode value={url} size={128} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="link">Poll Link</Label>
            <div className="flex items-center gap-2">
              <Input id="link" value={url} readOnly className="h-9" />
              <Button variant="outline" size="icon" onClick={copyToClipboard}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
