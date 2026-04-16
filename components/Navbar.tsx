'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCartStore } from '@/lib/cart';
import CartDrawer from './CartDrawer';

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems());

  return (
    <>
      <nav
        className="sticky top-0 z-30 w-full"
        style={{ background: '#080808', borderBottom: '1px solid rgba(233,30,140,0.2)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="text-2xl font-bold tracking-wide flex-shrink-0"
              style={{
                fontFamily: 'var(--font-heading)',
                color: '#e91e8c',
                letterSpacing: '0.15em',
              }}
            >
              It&apos;s Time
            </Link>

            {/* Pravá část – desktop nav + košík */}
            <div className="flex items-center gap-2">
              {/* Desktop navigace – těsně vlevo od košíku */}
              <div className="hidden md:flex items-center gap-1 mr-4">
                <Link
                  href="/"
                  className="text-sm font-medium px-3 py-2 rounded-lg transition-colors hover:bg-white/10 hover:text-[#e91e8c]"
                  style={{ color: 'rgba(255,255,255,0.75)' }}
                >
                  Domů
                </Link>
                <Link
                  href="/produkty"
                  className="text-sm font-medium px-3 py-2 rounded-lg transition-colors hover:bg-white/10 hover:text-[#e91e8c]"
                  style={{ color: 'rgba(255,255,255,0.75)' }}
                >
                  Produkty
                </Link>
                <Link
                  href="/kontakty"
                  className="text-sm font-medium px-3 py-2 rounded-lg transition-colors hover:bg-white/10 hover:text-[#e91e8c]"
                  style={{ color: 'rgba(255,255,255,0.75)' }}
                >
                  Kontakty
                </Link>
              </div>

              {/* Košík */}
              <button
                onClick={() => setDrawerOpen(true)}
                className="relative p-2 rounded-full transition-colors hover:bg-white/10"
                style={{ color: '#e91e8c' }}
                aria-label="Otevřít košík"
              >
                <ShoppingCart size={22} />
                {totalItems > 0 && (
                  <span
                    className="absolute -top-1 -right-1 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                    style={{ background: '#e91e8c', color: '#080808' }}
                  >
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </button>

              {/* Hamburger (mobile) */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-full transition-colors hover:bg-white/10"
                style={{ color: '#e91e8c' }}
                aria-label="Menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu – absolutní overlay, nepřesouvá obsah */}
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <div
              className="md:hidden fixed inset-0 top-16 z-40 bg-black/50"
              onClick={() => setMobileOpen(false)}
            />
            {/* Menu panel */}
            <div
              className="md:hidden absolute left-0 right-0 z-50 border-t shadow-xl"
              style={{ background: '#111111', borderColor: 'rgba(233,30,140,0.25)' }}
            >
              <div className="px-4 py-3 space-y-1">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center text-sm font-medium px-3 py-3 rounded-lg transition-colors hover:bg-white/10 hover:text-[#e91e8c]"
                  style={{ color: 'rgba(255,255,255,0.8)' }}
                >
                  Domů
                </Link>
                <Link
                  href="/produkty"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center text-sm font-medium px-3 py-3 rounded-lg transition-colors hover:bg-white/10 hover:text-[#e91e8c]"
                  style={{ color: 'rgba(255,255,255,0.8)' }}
                >
                  Produkty
                </Link>
                <Link
                  href="/kontakty"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center text-sm font-medium px-3 py-3 rounded-lg transition-colors hover:bg-white/10 hover:text-[#e91e8c]"
                  style={{ color: 'rgba(255,255,255,0.8)' }}
                >
                  Kontakty
                </Link>
              </div>
            </div>
          </>
        )}
      </nav>

      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
