import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'House of Glory - Data Collection System',
  description: 'Professional data collection and management system for House of Glory.',
  
  icons: {
  icon: '/afm_big_logo.png',
},
  
  openGraph: {
    images: [
      {
        url: 'https://afm-house-of-glory-member-form.vercel.app/afm_big_logo.png',
        width: 1200,
        height: 630,
        alt: 'AFM House of Glory',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [
      'https://afm-house-of-glory-member-form.vercel.app/afm_big_logo.png',
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
