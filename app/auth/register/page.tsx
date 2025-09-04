'use client'
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAuth } from '@/context/AuthProvider'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export default function RegisterPage() {
  const { signUp } = useAuth()
  const { register, handleSubmit, formState } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data: any) => {
    const res = await signUp(data.email, data.password)
    if (res.error) alert(res.error.message)
    else window.location.href = '/auth/login'
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-8 rounded-lg shadow-md w-full max-w-2xl">
        <h1 className="text-2xl font-semibold mb-4">Create account</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm">Email</label>
            <input {...register('email')} className="input" />
          </div>
          <div>
            <label className="block text-sm">Password</label>
            <input {...register('password')} type="password" className="input" />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300">Create account</button>
        </form>
      </div>
    </div>
  )
}
