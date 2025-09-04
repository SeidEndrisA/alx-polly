'use client'
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAuth } from '../context/AuthProvider'
import { Button } from '@/components/ui/button'

const schema = z.object({
  email: z.string().email({ message: 'Enter a valid email' }),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type FormData = z.infer<typeof schema>

export const LoginForm: React.FC = () => {
  const { signIn } = useAuth()
  const { register, handleSubmit, formState } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    const res = await signIn(data.email, data.password)
    if (res.error) {
      alert(res.error.message)
    } else {
      window.location.href = '/'
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md">
      <div>
        <label className="block text-sm">Email</label>
        <input {...register('email')} placeholder="you@example.com" className="input" />
        {formState.errors.email && <p className="text-xs text-red-500">{formState.errors.email.message}</p>}
      </div>
      <div>
        <label className="block text-sm">Password</label>
        <input {...register('password')} type="password" placeholder="••••••" className="input" />
        {formState.errors.password && <p className="text-xs text-red-500">{formState.errors.password.message}</p>}
      </div>
      <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300">Sign in</button>
    </form>
  )
}

export default LoginForm
