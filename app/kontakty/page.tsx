export const dynamic = 'force-dynamic';

import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin, CreditCard } from 'lucide-react';
import { ShopSettings } from '@/lib/types';

async function getSettings(): Promise<ShopSettings | null> {
  const { data } = await supabase.from('settings').select('*').eq('id', 1).single();
  return data as ShopSettings | null;
}

export const metadata = {
  title: "Kontakty | It's Time",
};

export default async function KontaktyPage() {
  const settings = await getSettings();

  const contacts = [
    settings?.email && {
      icon: Mail,
      label: 'E-mail',
      value: settings.email,
      href: `mailto:${settings.email}`,
    },
    settings?.phone && {
      icon: Phone,
      label: 'Telefon',
      value: settings.phone,
      href: `tel:${settings.phone}`,
    },
    settings?.address && {
      icon: MapPin,
      label: 'Sídlo',
      value: settings.address,
      href: null,
    },
    settings?.bank_account && {
      icon: CreditCard,
      label: 'Číslo účtu',
      value: settings.bank_account,
      href: null,
    },
  ].filter(Boolean) as Array<{
    icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
    label: string;
    value: string;
    href: string | null;
  }>;

  return (
    <>
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section
          className="py-16 px-4 text-center"
          style={{
            background: 'linear-gradient(180deg, #0e0e0e 0%, #080808 100%)',
            borderBottom: '1px solid rgba(233,30,140,0.15)',
          }}
        >
          <h1
            className="text-4xl md:text-5xl font-bold tracking-tight mb-3"
            style={{ fontFamily: 'var(--font-heading)', color: '#ffffff' }}
          >
            Kontakty
          </h1>
          <p className="text-base max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Máte otázku nebo potřebujete poradit? Neváhejte nás kontaktovat.
          </p>
        </section>

        {/* Obsah */}
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto">
            {/* Karta s údaji */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{ background: '#111111', border: '1px solid rgba(233,30,140,0.15)' }}
            >
              {/* Hlavička */}
              <div
                className="px-8 py-6 border-b"
                style={{ borderColor: 'rgba(233,30,140,0.15)', background: '#0e0e0e' }}
              >
                <h2
                  className="text-xl font-semibold"
                  style={{ fontFamily: 'var(--font-heading)', color: '#ffffff' }}
                >
                  {settings?.company_name ?? "It's Time"}
                </h2>
                <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  Prémiová autokosmetika
                </p>
              </div>

              {/* Kontaktní údaje */}
              {contacts.length > 0 ? (
                <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                  {contacts.map(({ icon: Icon, label, value, href }) => (
                    <div key={label} className="flex items-start gap-5 px-8 py-5">
                      <div
                        className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center mt-0.5"
                        style={{ background: 'rgba(233,30,140,0.1)' }}
                      >
                        <Icon size={18} style={{ color: '#e91e8c' }} />
                      </div>
                      <div>
                        <p
                          className="text-xs font-semibold uppercase tracking-wider mb-1"
                          style={{ color: 'rgba(255,255,255,0.35)' }}
                        >
                          {label}
                        </p>
                        {href ? (
                          <a
                            href={href}
                            className="text-sm font-medium transition-colors hover:text-yellow-400"
                            style={{ color: '#ffffff' }}
                          >
                            {value}
                          </a>
                        ) : (
                          <p className="text-sm font-medium" style={{ color: '#ffffff' }}>
                            {value}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-8 py-12 text-center" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  Kontaktní údaje nebyly dosud nastaveny.
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
