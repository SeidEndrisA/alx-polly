'use client'

import CreatePollForm from '@/components/CreatePollForm'

export default function CreatePollPage() {
  return (
    <div className="container mx-auto max-w-2xl py-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tighter">Create a New Poll</h1>
        <p className="text-muted-foreground">
          Fill out the form below to create a new poll. You can add up to 10 options.
        </p>
      </div>
      <CreatePollForm />
    </div>
  )
}
