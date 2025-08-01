import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { NextAuthProvider } from './Providers';
import Header from '@/components/Header'; // Importálás

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Deepo Content Generator',
  description: 'AI-powered content generation tool for T-DEPO',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          <Header />
          <main>{children}</main>
        </NextAuthProvider>
      </body>
    </html>
  );
}
