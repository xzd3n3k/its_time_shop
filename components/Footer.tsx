'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';
import { ShopSettings } from '@/lib/types';

export default function Footer() {
  const [settings, setSettings] = useState<ShopSettings | null>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error) setSettings(data);
      })
      .catch(() => {});
  }, []);

  return (
    <footer
      className="mt-auto py-10 px-4"
      style={{ background: '#080808', borderTop: '1px solid rgba(233,30,140,0.2)' }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="text-center md:text-left">
            <p
              className="text-2xl font-bold tracking-widest"
              style={{ fontFamily: 'var(--font-heading)', color: '#e91e8c' }}
            >
              {settings?.company_name ?? "It's Time"}
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
            <Link href="/kontakty" className="hover:text-yellow-400 transition-colors">
              Kontakty
            </Link>
            <Link href="/kosik" className="hover:text-yellow-400 transition-colors">
              Košík
            </Link>
          </div>

          {/* Kontakt */}
          <div className="flex flex-col gap-1.5 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
            {settings?.email && (
              <div className="flex items-center gap-2">
                <Mail size={13} style={{ color: '#e91e8c', flexShrink: 0 }} />
                <a href={`mailto:${settings.email}`} className="hover:text-yellow-400 transition-colors">
                  {settings.email}
                </a>
              </div>
            )}
            {settings?.phone && (
              <div className="flex items-center gap-2">
                <Phone size={13} style={{ color: '#e91e8c', flexShrink: 0 }} />
                <a href={`tel:${settings.phone}`} className="hover:text-yellow-400 transition-colors">
                  {settings.phone}
                </a>
              </div>
            )}
            {settings?.address && (
              <div className="flex items-center gap-2">
                <MapPin size={13} style={{ color: '#e91e8c', flexShrink: 0 }} />
                <span>{settings.address}</span>
              </div>
            )}
            {!settings && (
              <div className="flex items-center gap-2">
                <Mail size={13} style={{ color: '#e91e8c', flexShrink: 0 }} />
                <a href="mailto:xhypextream@gmail.com" className="hover:text-yellow-400 transition-colors">
                  xhypextream@gmail.com
                </a>
              </div>
            )}
          </div>
        </div>

        <div
          className="mt-8 pt-6 text-center text-xs"
          style={{ borderTop: '1px solid rgba(233,30,140,0.1)', color: 'rgba(255,255,255,0.3)' }}
        >
          &copy; {new Date().getFullYear()} {settings?.company_name ?? "It's Time"}. Všechna práva vyhrazena.
        </div>
      </div>
    </footer>
  );
}
