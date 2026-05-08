'use client';

import { usePathname } from 'next/navigation';
import './globals.css';
import './swal-custom.css';
import { ThemeProvider } from '@/lib/theme-context';
import ThemeToggle from '@/components/ThemeToggle';
import Footer from '@/components/Footer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <head>
        <title>Kin Reviewer - Smart Learning Platform</title>
        <meta name="description" content="Premium spaced repetition learning with AI-powered insights" />
        <link rel="icon" href="/Logos/puzzle.png" type="image/png" />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <ThemeProvider>
          <ThemeToggle />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
