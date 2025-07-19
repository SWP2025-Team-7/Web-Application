import type { Metadata } from 'next'
import React from 'react'
import './globals.css'
import { AuthProvider } from '@/hooks/use-auth'

export const metadata: Metadata = {
  title: 'Web App',
  description: '',
  generator: '',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
