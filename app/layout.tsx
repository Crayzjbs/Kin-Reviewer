'use client';

import { useEffect } from 'react';
import './globals.css';
import { storage } from '@/lib/storage';
import StarfieldBackground from '@/components/StarfieldBackground';
import Footer from '@/components/Footer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    storage.loadFromBackend();
  }, []);

  return (
    <html lang="en" className="dark">
      <head>
        <title>Exam Anki - Smart Review System</title>
        <meta name="description" content="Anki-style exam review with spaced repetition and AI-powered analogies" />
        <link rel="icon" href="/Logos/puzzle.png" type="image/png" />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <StarfieldBackground />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
