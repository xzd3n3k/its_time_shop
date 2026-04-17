'use client';

import { useState, FormEvent } from 'react';
import { Search, Package, AlertCircle, Loader2, CheckCircle2, Clock, Truck, PackageCheck, XCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { CartItem, Order } from '@/lib/types';

type TrackedOrder = Pick<Order, 'order_number' | 'status' | 'payment_method' | 'total' | 'items' | 'created_at'>;

const STATUS_ORDER: Order['status'][] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

const STATUS_LABELS: Record<Order['status'], string> = {
  pending: 'Čeká na zpracování',
  confirmed: 'Potvrzeno',
  processing: 'Připravuje se k odeslání',
  shipped: 'Odesláno',
  delivered: 'Doručeno',
  cancelled: 'Zrušeno',
};

const STATUS_DESCRIPTIONS: Record<Order['status'], string> = {
  pending: 'Vaši objednávku jsme přijali a čeká na zpracování.',
  confirmed: 'Objednávka byla potvrzena.',
  processing: 'Objednávku balíme k odeslání.',
  shipped: 'Zásilka je na cestě k vám.',
  delivered: 'Zásilka byla doručena.',
  cancelled: 'Objednávka byla zrušena.',
};

const STEP_ICONS = [Clock, CheckCircle2, Package, Truck, PackageCheck];

function paymentLabel(method: string): string {
  if (method === 'cash') return 'Hotově při převzetí';
  if (method === 'bank_transfer') return 'Bankovním převodem';
  return method;
}

export default function SledovaniObjednavkyPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<TrackedOrder | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = orderNumber.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const res = await fetch(`/api/orders/track/${encodeURIComponent(trimmed)}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error ?? 'Objednávku se nepodařilo najít.');
        return;
      }
      setOrder(data.order);
    } catch {
      setError('Chyba připojení. Zkuste to prosím znovu.');
    } finally {
      setLoading(false);
    }
  };

  const isCancelled = order?.status === 'cancelled';
  const currentStep = order && !isCancelled ? STATUS_ORDER.indexOf(order.status) : -1;

  return (
    <>
      <Navbar />
      <main className="flex-1 min-h-screen" style={{ background: '#fff5f9' }}>
        {/* Hlavička */}
        <div className="py-12 px-4 text-center" style={{ background: '#080808' }}>
          <p className="text-sm uppercase tracking-[0.25em] mb-3" style={{ color: '#e91e8c' }}>
            Stav zásilky
          </p>
          <h1
            className="text-4xl md:text-5xl font-light"
            style={{ fontFamily: 'var(--font-heading)', color: '#ffffff' }}
          >
            Sledování objednávky
          </h1>
          <div className="gold-line" />
        </div>

        <div className="max-w-3xl mx-auto px-4 py-12">
          {/* Vyhledávací formulář */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8"
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Číslo objednávky
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="IT-20260417-1234"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-blue-50 text-sm font-mono"
              />
              <button
                type="submit"
                disabled={loading || !orderNumber.trim()}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed btn-gold"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Hledám...
                  </>
                ) : (
                  <>
                    <Search size={16} />
                    Vyhledat
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Číslo objednávky najdete v potvrzovacím e-mailu (např. IT-20260417-1234).
            </p>
          </form>

          {/* Chybová hláška */}
          {error && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-100 mb-8">
              <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Výsledek */}
          {order && (
            <div className="space-y-6">
              {/* Hlavička objednávky */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Číslo objednávky</p>
                    <p className="text-xl font-bold" style={{ color: '#e91e8c' }}>{order.order_number}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Vytvořeno</p>
                    <p className="text-sm font-medium text-gray-800">
                      {new Date(order.created_at).toLocaleString('cs-CZ', { dateStyle: 'long', timeStyle: 'short' })}
                    </p>
                  </div>
                </div>

                {/* Aktuální stav badge */}
                <div
                  className="flex items-center gap-3 p-4 rounded-lg"
                  style={{
                    background: isCancelled ? 'rgba(239,68,68,0.08)' : 'rgba(233,30,140,0.08)',
                    border: `1px solid ${isCancelled ? 'rgba(239,68,68,0.3)' : 'rgba(233,30,140,0.3)'}`,
                  }}
                >
                  {isCancelled ? (
                    <XCircle size={22} className="text-red-500 flex-shrink-0" />
                  ) : (
                    <CheckCircle2 size={22} style={{ color: '#e91e8c' }} className="flex-shrink-0" />
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">{STATUS_LABELS[order.status]}</p>
                    <p className="text-xs text-gray-600">{STATUS_DESCRIPTIONS[order.status]}</p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              {!isCancelled && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h2 className="font-semibold text-gray-800 mb-5">Průběh zpracování</h2>
                  <ol className="space-y-4">
                    {STATUS_ORDER.map((step, idx) => {
                      const Icon = STEP_ICONS[idx];
                      const reached = idx <= currentStep;
                      const active = idx === currentStep;
                      return (
                        <li key={step} className="flex items-start gap-3">
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
                            style={{
                              background: reached ? '#e91e8c' : '#f3f4f6',
                              color: reached ? '#ffffff' : '#9ca3af',
                              boxShadow: active ? '0 0 0 4px rgba(233,30,140,0.15)' : 'none',
                            }}
                          >
                            <Icon size={16} />
                          </div>
                          <div className="pt-1">
                            <p
                              className="text-sm font-medium"
                              style={{ color: reached ? '#111827' : '#9ca3af' }}
                            >
                              {STATUS_LABELS[step]}
                            </p>
                            {active && (
                              <p className="text-xs text-gray-500 mt-0.5">{STATUS_DESCRIPTIONS[step]}</p>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              )}

              {/* Položky */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="font-semibold text-gray-800 mb-4">Obsah objednávky</h2>
                <div className="divide-y divide-gray-100">
                  {(order.items as CartItem[]).map((item) => (
                    <div key={item.product.id} className="flex items-center justify-between py-3 gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.product.name}</p>
                        <p className="text-xs text-gray-500">
                          {item.quantity} × {item.product.price.toLocaleString('cs-CZ')} Kč
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900 flex-shrink-0">
                        {(item.product.price * item.quantity).toLocaleString('cs-CZ')} Kč
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Způsob platby</span>
                    <span className="font-medium text-gray-900">{paymentLabel(order.payment_method)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <span className="font-semibold text-gray-900">Celkem</span>
                    <span className="text-2xl font-bold" style={{ color: '#e91e8c' }}>
                      {order.total.toLocaleString('cs-CZ', { minimumFractionDigits: 2 })} Kč
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
