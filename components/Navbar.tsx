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
              className="text-2xl font-bold tracking-wide"
              style={{
                fontFamily: 'var(--font-heading)',
                color: '#e91e8c',
                letterSpacing: '0.15em',
              }}
            >
              It&apos;s Time
            </Link>

            {/* Desktop navigace */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/"
                className="text-sm font-medium transition-colors hover:text-yellow-400"
                style={{ color: 'rgba(255,255,255,0.8)' }}
              >
                Domů
              </Link>
              <Link
                href="/produkty"
                className="text-sm font-medium transition-colors hover:text-yellow-400"
                style={{ color: 'rgba(255,255,255,0.8)' }}
              >
                Produkty
              </Link>
            </div>

            {/* Pravá část */}
            <div className="flex items-center gap-3">
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

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            className="md:hidden border-t"
            style={{ background: '#0e0e0e', borderColor: 'rgba(233,30,140,0.2)' }}
          >
            <div className="px-4 py-4 space-y-3">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-medium py-2 transition-colors hover:text-yellow-400"
                style={{ color: 'rgba(255,255,255,0.8)' }}
              >
                Domů
              </Link>
              <Link
                href="/produkty"
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-medium py-2 transition-colors hover:text-yellow-400"
                style={{ color: 'rgba(255,255,255,0.8)' }}
              >
                Produkty
              </Link>
            </div>
          </div>
        )}
      </nav>

      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
