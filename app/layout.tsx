import type { Metadata } from 'next';
import { Outfit, DM_Sans } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  variable: '--font-heading',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const dmSans = DM_Sans({
  variable: '--font-body',
  subsets: ['latin'],
  display: 'swap',
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
    <html lang="cs" className={`${outfit.variable} ${dmSans.variable} h-full`}>
      <body className="min-h-full flex flex-col" style={{ fontFamily: 'var(--font-body)' }}>
        {children}
      </body>
    </html>
  );
}
