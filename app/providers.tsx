'use client';

import { ThemeProvider } from '@/lib/theme-context';
import ThemeToggle from '@/components/ThemeToggle';
import Footer from '@/components/Footer';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ThemeToggle />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </ThemeProvider>
  );
}
