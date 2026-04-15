'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CreditCard, Banknote, Wallet, AlertCircle, Loader2 } from 'lucide-react';
import { useCartStore } from '@/lib/cart';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

type PaymentMethod = 'cash' | 'bank_transfer';

export default function PokladnaPage() {
  const router = useRouter();
  const { items, totalPrice, clear } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payment, setPayment] = useState<PaymentMethod>('cash');

  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    customer_street: '',
    customer_city: '',
    customer_zip: '',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          payment_method: payment,
          total: totalPrice(),
          items: items,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error ?? 'Nepodařilo se vytvořit objednávku. Zkuste to prosím znovu.');
        return;
      }

      clear();
      router.push(`/pokladna/hotovo?order=${data.orderNumber}`);
    } catch {
      setError('Chyba připojení. Zkuste to prosím znovu.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="flex-1 min-h-screen flex items-center justify-center" style={{ background: '#faf8f4' }}>
          <div className="text-center">
            <p className="text-gray-700 mb-4">Váš košík je prázdný</p>
            <Link href="/produkty" className="btn-gold rounded-lg">
              Přejít na produkty
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 min-h-screen" style={{ background: '#faf8f4' }}>
        {/* Hlavička */}
        <div className="py-12 px-4 text-center" style={{ background: '#080808' }}>
          <p className="text-sm uppercase tracking-[0.25em] mb-3" style={{ color: '#008abf' }}>
            Dokončení nákupu
          </p>
          <h1
            className="text-4xl md:text-5xl font-light"
            style={{ fontFamily: 'var(--font-heading)', color: '#ffffff' }}
          >
            Pokladna
          </h1>
          <div className="gold-line" />
        </div>

        <div className="max-w-6xl mx-auto px-4 py-12">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Formulář */}
              <div className="lg:col-span-2 space-y-6">
                {/* Osobní údaje */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-800 mb-5">Kontaktní údaje</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Jméno a příjmení <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="customer_name"
                        required
                        value={form.customer_name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#008abf] focus:ring-2 focus:ring-blue-50 text-sm"
                        placeholder="Jan Novák"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        E-mail <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="customer_email"
                        required
                        value={form.customer_email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#008abf] focus:ring-2 focus:ring-blue-50 text-sm"
                        placeholder="jan@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Telefon
                      </label>
                      <input
                        type="tel"
                        name="customer_phone"
                        value={form.customer_phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#008abf] focus:ring-2 focus:ring-blue-50 text-sm"
                        placeholder="+420 777 000 000"
                      />
                    </div>
                  </div>
                </div>

                {/* Doručovací adresa */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-800 mb-5">Doručovací adresa</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Ulice a číslo popisné <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="customer_street"
                        required
                        value={form.customer_street}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#008abf] focus:ring-2 focus:ring-blue-50 text-sm"
                        placeholder="Hlavní 123"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Město <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="customer_city"
                          required
                          value={form.customer_city}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#008abf] focus:ring-2 focus:ring-blue-50 text-sm"
                          placeholder="Praha"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          PSČ <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="customer_zip"
                          required
                          value={form.customer_zip}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#008abf] focus:ring-2 focus:ring-blue-50 text-sm"
                          placeholder="110 00"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Poznámka k objednávce
                      </label>
                      <textarea
                        name="notes"
                        value={form.notes}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#008abf] focus:ring-2 focus:ring-blue-50 text-sm resize-none"
                        placeholder="Případné poznámky k doručení..."
                      />
                    </div>
                  </div>
                </div>

                {/* Platba */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-800 mb-5">Způsob platby</h2>
                  <div className="space-y-3">
                    {/* Hotově */}
                    <label
                      className="flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all"
                      style={{
                        borderColor: payment === 'cash' ? '#008abf' : '#e5e7eb',
                        background: payment === 'cash' ? 'rgba(0,138,191,0.05)' : '#ffffff',
                      }}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="cash"
                        checked={payment === 'cash'}
                        onChange={() => setPayment('cash')}
                        className="sr-only"
                      />
                      <Banknote size={22} style={{ color: payment === 'cash' ? '#008abf' : '#9ca3af' }} />
                      <div>
                        <p className="font-medium text-gray-900">Hotově</p>
                        <p className="text-xs text-gray-600">Platba při převzetí</p>
                      </div>
                      {payment === 'cash' && (
                        <div
                          className="ml-auto w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ background: '#008abf' }}
                        >
                          <div className="w-2 h-2 rounded-full bg-white" />
                        </div>
                      )}
                    </label>

                    {/* Bankovní převod */}
                    <label
                      className="flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all"
                      style={{
                        borderColor: payment === 'bank_transfer' ? '#008abf' : '#e5e7eb',
                        background: payment === 'bank_transfer' ? 'rgba(0,138,191,0.05)' : '#ffffff',
                      }}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="bank_transfer"
                        checked={payment === 'bank_transfer'}
                        onChange={() => setPayment('bank_transfer')}
                        className="sr-only"
                      />
                      <Wallet size={22} style={{ color: payment === 'bank_transfer' ? '#008abf' : '#9ca3af' }} />
                      <div>
                        <p className="font-medium text-gray-900">Bankovní převod</p>
                        <p className="text-xs text-gray-600">Platba převodem na účet</p>
                      </div>
                      {payment === 'bank_transfer' && (
                        <div
                          className="ml-auto w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ background: '#008abf' }}
                        >
                          <div className="w-2 h-2 rounded-full bg-white" />
                        </div>
                      )}
                    </label>

                    {/* Platební karta – disabled */}
                    <div
                      className="flex items-center gap-4 p-4 rounded-lg border-2 border-gray-100 opacity-50 cursor-not-allowed"
                    >
                      <CreditCard size={22} className="text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-400">Platební karta</p>
                        <p className="text-xs text-gray-400">Připravujeme</p>
                      </div>
                      <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                        Brzy
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Souhrn objednávky */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-24">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Vaše objednávka</h2>

                  <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex justify-between text-sm">
                        <span className="text-gray-700 truncate max-w-32">
                          {item.product.name} ×{item.quantity}
                        </span>
                        <span className="font-semibold ml-2 flex-shrink-0 text-gray-900">
                          {(item.product.price * item.quantity).toFixed(2)} Kč
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-100 pt-4 mb-6">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-700">Doprava:</span>
                      <span className="text-sm font-medium text-gray-900">dle dohody</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900">Celkem:</span>
                      <span className="text-2xl font-bold" style={{ color: '#008abf' }}>
                        {totalPrice().toFixed(2)} Kč
                      </span>
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-100 mb-4">
                      <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-red-600">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-base transition-all disabled:opacity-70 disabled:cursor-not-allowed btn-gold"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Odesílám...
                      </>
                    ) : (
                      'Dokončit objednávku'
                    )}
                  </button>

                  <p className="text-xs text-gray-600 text-center mt-3">
                    Odesláním souhlasíte s podmínkami prodeje
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
