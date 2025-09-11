
'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/Header'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const showHeader = !pathname.startsWith('/auth')

  return (
    <>
      {showHeader && <Header />}
      {children}
    </>
  )
}
