import './globals.css'
import { AuthProvider } from '@/context/AuthProvider'
import { ThemeProvider } from "@/context/ThemeProvider"
import { Toaster } from 'sonner'
import LayoutWrapper from '@/components/LayoutWrapper'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <LayoutWrapper>
              <main>{children}</main>
            </LayoutWrapper>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
