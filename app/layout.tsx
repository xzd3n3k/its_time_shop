import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: "It's Time – Prémiová autokosmetika",
  description:
    'Prémiová autokosmetika pro péči o váš automobil. Produkty nejvyšší kvality pro dokonalý výsledek.',
  keywords: ['autokosmetika', 'péče o auto', 'vosk', 'leštění', 'čištění auta'],
  openGraph: {
    title: "It's Time – Prémiová autokosmetika",
    description: 'Prémiová autokosmetika pro péči o váš automobil.',
    locale: 'cs_CZ',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs" className={`${cormorant.variable} ${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
