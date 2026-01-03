import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ChatWidget } from '@/components/ai-chat-widget/chat-widget';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: 'MYGlamBeauty Supply | Luxury Handmade Lashes for Queen Princess',
  description: 'Home of luxury beauty and handmade lashes. Premium mink lashes, faux mink sets, and beauty accessories for the modern queen.',
  keywords: ['lashes', 'mink lashes', 'beauty supply', 'luxury lashes', 'handmade lashes'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
