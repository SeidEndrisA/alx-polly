'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthProvider'
import { z } from 'zod'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner"
import { Loader2, Trash2 } from 'lucide-react'

const pollSchema = z.object({
  question: z.string().min(1, 'Question is required.').max(280, 'Question must be 280 characters or less.'),
  options: z
    .array(z.object({ text: z.string().min(1, 'Option cannot be empty.').max(100, 'Option must be 100 characters or less.') }))
    .min(2, 'At least two options are required.')
    .max(10, 'You can have a maximum of 10 options.'),
});

type PollFormValues = z.infer<typeof pollSchema>;

export default function CreatePollForm() {
  const router = useRouter()
  const { user, supabase } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<PollFormValues>({
    resolver: zodResolver(pollSchema),
    defaultValues: {
      question: '',
      options: [{ text: '' }, { text: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "options",
  });

  const onSubmit = async (data: PollFormValues) => {
    setIsSubmitting(true)
    if (!user) {
      toast.error('You must be logged in to create a poll.')
      setIsSubmitting(false)
      return
    }

    const { data: pollData, error: pollError } = await supabase
      .from('polls')
      .insert({ question: data.question, created_by: user.id })
      .select()
      .single()

    if (pollError) {
      console.error('Error creating poll:', pollError)
      toast.error('Failed to create poll. Please try again.')
      setIsSubmitting(false)
      return
    }

    const pollId = pollData.id

    const optionObjects = data.options.map(option => ({
      poll_id: pollId,
      option_text: option.text,
    }))

    const { error: optionsError } = await supabase
      .from('poll_options')
      .insert(optionObjects)

    if (optionsError) {
      console.error('Error creating poll options:', optionsError)
      toast.error('Failed to save poll options. Please try again.')
      // Here you might want to delete the poll that was just created
      setIsSubmitting(false)
      return
    }

    toast.success('Poll created successfully!')
    router.push(`/polls/${pollId}`)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-8">
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Poll Question</FormLabel>
              <FormControl>
                <Input placeholder="What should we do for our next team event?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          {fields.map((field, index) => (
            <FormField
              key={field.id}
              control={form.control}
              name={`options.${index}.text`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Option {index + 1}</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input placeholder={`Option ${index + 1}`} {...field} />
                    </FormControl>
                    {fields.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => append({ text: '' })}
            disabled={fields.length >= 10}
          >
            + Add Option
          </Button>
          <FormField
            control={form.control}
            name="options"
            render={() => <FormMessage />}
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            size="lg"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? 'Creating Poll...' : 'Create Poll'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
