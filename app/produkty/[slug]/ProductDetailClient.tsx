'use client';

import Link from 'next/link';
import { ShoppingCart, Package, ChevronLeft, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '@/lib/types';
import { useCartStore } from '@/lib/cart';
import { useState } from 'react';

interface Props {
  product: Product;
}

export default function ProductDetailClient({ product }: Props) {
  const add = useCartStore((s) => s.add);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    add(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/produkty" className="flex items-center gap-1 hover:text-yellow-600 transition-colors">
          <ChevronLeft size={16} />
          Zpět na produkty
        </Link>
        {product.categories && (
          <>
            <span>/</span>
            <span style={{ color: '#008abf' }}>{product.categories.name}</span>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Obrázek */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative"
        >
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-lg">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <Package size={80} strokeWidth={1} />
              </div>
            )}
          </div>
          {product.featured && (
            <div
              className="absolute top-4 left-4 text-xs font-semibold px-3 py-1.5 rounded-full"
              style={{ background: '#008abf', color: '#080808' }}
            >
              Doporučujeme
            </div>
          )}
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          {product.categories && (
            <p
              className="text-sm uppercase tracking-widest mb-3 font-medium"
              style={{ color: '#008abf' }}
            >
              {product.categories.name}
            </p>
          )}

          <h1
            className="text-3xl md:text-4xl font-semibold mb-4 leading-tight"
            style={{ fontFamily: 'var(--font-heading)', color: '#1a1a1a' }}
          >
            {product.name}
          </h1>

          <div className="h-px bg-gradient-to-r from-yellow-400/40 to-transparent mb-6" />

          <p
            className="text-4xl font-bold mb-6"
            style={{ color: '#008abf' }}
          >
            {product.price.toFixed(2)} Kč
          </p>

          {/* Dostupnost */}
          <div className="flex items-center gap-2 mb-6">
            {product.stock > 0 ? (
              <>
                <CheckCircle size={18} className="text-green-500" />
                <span className="text-sm font-medium text-green-600">
                  Skladem ({product.stock} ks)
                </span>
              </>
            ) : (
              <>
                <XCircle size={18} className="text-red-400" />
                <span className="text-sm font-medium text-red-500">Není skladem</span>
              </>
            )}
          </div>

          {/* Popis */}
          {product.description && (
            <div className="mb-8">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3">
                Popis produktu
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

          {/* Tlačítko */}
          <button
            onClick={handleAdd}
            disabled={product.stock === 0}
            className="flex items-center justify-center gap-3 py-4 px-8 rounded-xl text-base font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: added
                ? '#22c55e'
                : product.stock > 0
                ? 'linear-gradient(135deg, #008abf, #432273)'
                : '#e5e7eb',
              color: product.stock > 0 || added ? '#080808' : '#9ca3af',
            }}
          >
            {added ? (
              <>
                <CheckCircle size={20} />
                Přidáno do košíku
              </>
            ) : (
              <>
                <ShoppingCart size={20} />
                {product.stock > 0 ? 'Přidat do košíku' : 'Vyprodáno'}
              </>
            )}
          </button>

          {product.stock > 0 && (
            <Link
              href="/kosik"
              className="mt-3 text-center text-sm font-medium transition-colors hover:underline"
              style={{ color: '#008abf' }}
            >
              Přejít do košíku
            </Link>
          )}
        </motion.div>
      </div>
    </div>
  );
}
