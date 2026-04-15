import Link from 'next/link';
import { Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      className="mt-auto py-10 px-4"
      style={{ background: '#080808', borderTop: '1px solid rgba(212,168,83,0.2)' }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="text-center md:text-left">
            <p
              className="text-2xl font-bold tracking-widest"
              style={{ fontFamily: 'var(--font-cormorant)', color: '#d4a853' }}
            >
              It&apos;s Time
            </p>
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Prémiová autokosmetika
            </p>
          </div>

          {/* Navigace */}
          <div className="flex gap-6 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
            <Link href="/" className="hover:text-yellow-400 transition-colors">
              Domů
            </Link>
            <Link href="/produkty" className="hover:text-yellow-400 transition-colors">
              Produkty
            </Link>
            <Link href="/kosik" className="hover:text-yellow-400 transition-colors">
              Košík
            </Link>
          </div>

          {/* Kontakt */}
          <div className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
            <Mail size={14} style={{ color: '#d4a853' }} />
            <a
              href="mailto:xhypextream@gmail.com"
              className="hover:text-yellow-400 transition-colors"
            >
              xhypextream@gmail.com
            </a>
          </div>
        </div>

        <div
          className="mt-8 pt-6 text-center text-xs"
          style={{ borderTop: '1px solid rgba(212,168,83,0.1)', color: 'rgba(255,255,255,0.3)' }}
        >
          &copy; {new Date().getFullYear()} It&apos;s Time. Všechna práva vyhrazena.
        </div>
      </div>
    </footer>
  );
}
