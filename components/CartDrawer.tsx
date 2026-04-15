'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/lib/cart';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, remove, updateQuantity, totalPrice } = useCartStore();
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100" style={{ background: '#080808' }}>
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} color="#d4a853" />
                <span className="font-semibold text-lg" style={{ color: '#d4a853', fontFamily: 'var(--font-cormorant)' }}>
                  Košík ({items.length})
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                style={{ color: '#d4a853' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 text-center gap-4">
                  <ShoppingBag size={48} strokeWidth={1} />
                  <p>Váš košík je prázdný</p>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    {/* Obrázek */}
                    <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-200 flex-shrink-0">
                      {item.product.image_url ? (
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <ShoppingBag size={20} />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 truncate">{item.product.name}</p>
                      <p className="text-sm font-semibold mt-1" style={{ color: '#d4a853' }}>
                        {(item.product.price * item.quantity).toFixed(2)} Kč
                      </p>

                      {/* Množství */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:border-yellow-500 transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:border-yellow-500 transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>

                    {/* Smazat */}
                    <button
                      onClick={() => remove(item.product.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1 self-start"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-5 border-t border-gray-100 space-y-3">
                <div className="flex justify-between text-base font-semibold">
                  <span>Celkem:</span>
                  <span style={{ color: '#d4a853' }}>{totalPrice().toFixed(2)} Kč</span>
                </div>
                <Link
                  href="/kosik"
                  onClick={onClose}
                  className="block w-full text-center btn-dark rounded-md py-3 font-semibold transition-all"
                >
                  Zobrazit košík
                </Link>
                <Link
                  href="/pokladna"
                  onClick={onClose}
                  className="block w-full text-center btn-gold rounded-md py-3 font-semibold"
                >
                  Pokladna
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
