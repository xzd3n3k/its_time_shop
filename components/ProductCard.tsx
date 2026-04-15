'use client';

import Link from 'next/link';
import { ShoppingCart, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '@/lib/types';
import { useCartStore } from '@/lib/cart';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const add = useCartStore((s) => s.add);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    add(product);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-100"
    >
      <Link href={`/produkty/${product.slug}`} className="block">
        {/* Obrázek */}
        <div className="relative h-52 bg-gray-100 overflow-hidden">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <Package size={48} strokeWidth={1} />
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white text-sm font-medium bg-black/70 px-3 py-1 rounded-full">
                Vyprodáno
              </span>
            </div>
          )}
          {product.featured && product.stock > 0 && (
            <div
              className="absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded-full"
              style={{ background: '#008abf', color: '#080808' }}
            >
              Doporučujeme
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          {product.categories && (
            <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: '#0077a6' }}>
              {product.categories.name}
            </p>
          )}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">{product.name}</h3>
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold" style={{ color: '#008abf' }}>
              {product.price.toFixed(2)} Kč
            </p>
            <p className="text-xs text-gray-400">
              {product.stock > 0 ? `Skladem (${product.stock} ks)` : 'Není skladem'}
            </p>
          </div>
        </div>
      </Link>

      {/* Tlačítko */}
      <div className="px-4 pb-4">
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: product.stock > 0 ? 'linear-gradient(135deg, #008abf, #432273)' : '#e5e7eb',
            color: product.stock > 0 ? '#080808' : '#9ca3af',
          }}
        >
          <ShoppingCart size={16} />
          {product.stock > 0 ? 'Přidat do košíku' : 'Vyprodáno'}
        </button>
      </div>
    </motion.div>
  );
}
