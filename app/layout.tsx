import './globals.css';
import './swal-custom.css';
import { Providers } from './providers';

export const metadata = {
  title: 'Kin Reviewer - Smart Learning Platform',
  description: 'Premium spaced repetition learning with AI-powered insights',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/Logos/puzzle.png" type="image/png" />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
