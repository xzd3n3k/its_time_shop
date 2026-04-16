'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, Package } from 'lucide-react';
import { Product } from '@/lib/types';

interface Props {
  products: Product[];
}

export default function AdminProductsClient({ products: initial }: Props) {
  const router = useRouter();
  const [products, setProducts] = useState(initial);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleToggleActive = async (product: Product) => {
    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !product.active }),
    });
    if (res.ok) {
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, active: !p.active } : p))
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Opravdu chcete smazat tento produkt?')) return;
    setDeletingId(id);
    const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      router.refresh();
    }
    setDeletingId(null);
  };

  if (products.length === 0) {
    return (
      <div
        className="rounded-xl py-16 text-center"
        style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <Package size={40} strokeWidth={1} style={{ color: 'rgba(255,255,255,0.2)', margin: '0 auto 12px' }} />
        <p style={{ color: 'rgba(255,255,255,0.3)' }}>Žádné produkty</p>
        <Link
          href="/admin/produkty/novy"
          className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg text-sm"
          style={{ background: '#e91e8c', color: '#080808', fontWeight: 600 }}
        >
          Přidat první produkt
        </Link>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {['Obrázek', 'Název', 'Kategorie', 'Cena', 'Sklad', 'Aktivní', 'Akce'].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: 'rgba(255,255,255,0.35)' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
              >
                {/* Obrázek */}
                <td className="px-5 py-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-800">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package size={16} style={{ color: 'rgba(255,255,255,0.2)' }} />
                      </div>
                    )}
                  </div>
                </td>

                {/* Název */}
                <td className="px-5 py-3">
                  <Link
                    href={`/admin/produkty/${product.id}`}
                    className="text-sm font-medium hover:underline"
                    style={{ color: '#ffffff' }}
                  >
                    {product.name}
                  </Link>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    {product.slug}
                  </p>
                </td>

                {/* Kategorie */}
                <td className="px-5 py-3 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  {product.categories?.name ?? '—'}
                </td>

                {/* Cena */}
                <td className="px-5 py-3 text-sm font-semibold" style={{ color: '#e91e8c' }}>
                  {Number(product.price).toFixed(2)} Kč
                </td>

                {/* Sklad */}
                <td className="px-5 py-3">
                  <span
                    className="text-xs font-medium px-2 py-1 rounded-full"
                    style={{
                      background: product.stock > 0 ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                      color: product.stock > 0 ? '#22c55e' : '#ef4444',
                    }}
                  >
                    {product.stock} ks
                  </span>
                </td>

                {/* Toggle aktivní */}
                <td className="px-5 py-3">
                  <button
                    onClick={() => handleToggleActive(product)}
                    className="relative w-10 h-5 rounded-full transition-colors"
                    style={{
                      background: product.active ? '#e91e8c' : 'rgba(255,255,255,0.15)',
                    }}
                  >
                    <span
                      className="absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all shadow"
                      style={{ left: product.active ? '22px' : '2px' }}
                    />
                  </button>
                </td>

                {/* Akce */}
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/produkty/${product.id}`}
                      className="p-1.5 rounded-lg transition-colors"
                      style={{ color: '#e91e8c', background: 'rgba(233,30,140,0.1)' }}
                    >
                      <Pencil size={14} />
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      disabled={deletingId === product.id}
                      className="p-1.5 rounded-lg transition-colors"
                      style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
