'use client';

import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/lib/cart';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function KosikPage() {
  const { items, remove, updateQuantity, totalPrice } = useCartStore();

  return (
    <>
      <Navbar />
      <main className="flex-1 min-h-screen" style={{ background: '#faf8f4' }}>
        {/* Hlavička */}
        <div className="py-12 px-4 text-center" style={{ background: '#080808' }}>
          <p className="text-sm uppercase tracking-[0.25em] mb-3" style={{ color: '#008abf' }}>
            Váš výběr
          </p>
          <h1
            className="text-4xl md:text-5xl font-light"
            style={{ fontFamily: 'var(--font-heading)', color: '#ffffff' }}
          >
            Košík
          </h1>
          <div className="gold-line" />
        </div>

        <div className="max-w-5xl mx-auto px-4 py-12">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag size={64} strokeWidth={1} className="mx-auto mb-6 text-gray-300" />
              <h2 className="text-2xl font-light text-gray-500 mb-4">Váš košík je prázdný</h2>
              <p className="text-gray-400 mb-8">Přidejte produkty z našeho sortimentu</p>
              <Link href="/produkty" className="btn-gold rounded-lg">
                Přejít na produkty
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Položky */}
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Položky ({items.length})
                </h2>

                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex gap-4"
                  >
                    {/* Obrázek */}
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {item.product.image_url ? (
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <ShoppingBag size={24} />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <Link
                            href={`/produkty/${item.product.slug}`}
                            className="font-semibold text-gray-900 hover:text-yellow-600 transition-colors line-clamp-2"
                          >
                            {item.product.name}
                          </Link>
                          {item.product.categories && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              {item.product.categories.name}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => remove(item.product.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1 flex-shrink-0"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        {/* Množství */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:border-yellow-400 transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center font-semibold text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:border-yellow-400 transition-colors"
                            disabled={item.quantity >= item.product.stock}
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* Cena */}
                        <p className="font-bold text-lg" style={{ color: '#008abf' }}>
                          {(item.product.price * item.quantity).toFixed(2)} Kč
                        </p>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {item.product.price.toFixed(2)} Kč / ks
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Souhrn */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-24">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Souhrn objednávky</h2>

                  <div className="space-y-3 mb-4">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex justify-between text-sm text-gray-600">
                        <span className="truncate max-w-32">
                          {item.product.name} ×{item.quantity}
                        </span>
                        <span className="font-medium ml-2 flex-shrink-0">
                          {(item.product.price * item.quantity).toFixed(2)} Kč
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-100 pt-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900">Celkem:</span>
                      <span className="text-2xl font-bold" style={{ color: '#008abf' }}>
                        {totalPrice().toFixed(2)} Kč
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">vč. DPH</p>
                  </div>

                  <Link
                    href="/pokladna"
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-lg font-semibold btn-gold"
                  >
                    Pokračovat k pokladně
                    <ArrowRight size={18} />
                  </Link>

                  <Link
                    href="/produkty"
                    className="block text-center mt-3 text-sm text-gray-500 hover:text-yellow-600 transition-colors"
                  >
                    Pokračovat v nákupu
                  </Link>
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
