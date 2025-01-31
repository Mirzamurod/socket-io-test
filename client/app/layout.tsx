import { ReactNode } from 'react'
import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import { ThemeProvider } from '@/components/providers/theme.provider'
import QueryProvider from '@/components/providers/query.provider'
import { Toaster } from '@/components/ui/toaster'
import SessionProvider from '@/components/providers/session.provider'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-spaceGrotesk',
})

export const metadata: Metadata = {
  title: 'Test Socket Io',
  description: 'Written by Mirzamurod',
  icons: { icon: 'https://telegram.org/img/website_icon.svg?4' },
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <SessionProvider>
      <QueryProvider>
        <html lang='en' suppressHydrationWarning>
          <body className={`${spaceGrotesk.variable} antialiased`} suppressHydrationWarning>
            <ThemeProvider
              attribute='class'
              defaultTheme='system'
              enableSystem
              disableTransitionOnChange
            >
              <main>{children}</main>
              <Toaster />
            </ThemeProvider>
          </body>
        </html>
      </QueryProvider>
    </SessionProvider>
  )
}
