'use client'
import React from 'react'
import LoginForm from '@/components/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-8 rounded-lg shadow-md w-full max-w-2xl">
        <h1 className="text-2xl font-semibold mb-4">Sign in</h1>
        <LoginForm />
      </div>
    </div>
  )
}
