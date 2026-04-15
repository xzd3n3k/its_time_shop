import { supabaseAdmin } from '@/lib/supabase';
import { Product } from '@/lib/types';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import AdminProductsClient from './AdminProductsClient';

const PAGE_SIZE = 20;

interface Props {
  searchParams: Promise<{ page?: string }>;
}

async function getProducts(page: number): Promise<{ products: Product[]; total: number }> {
  const admin = supabaseAdmin();
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, count } = await admin
    .from('products')
    .select('*, categories(id, name, slug, created_at)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  return { products: (data as Product[]) ?? [], total: count ?? 0 };
}

export default async function AdminProduktyPage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? '1', 10));
  const { products, total } = await getProducts(page);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-3xl font-semibold"
            style={{ fontFamily: 'var(--font-cormorant)', color: '#ffffff' }}
          >
            Produkty
          </h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Celkem {total} produktů
          </p>
        </div>
        <Link
          href="/admin/produkty/novy"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold"
          style={{ background: 'linear-gradient(135deg, #d4a853, #b8922e)', color: '#080808' }}
        >
          <Plus size={16} />
          Přidat produkt
        </Link>
      </div>

      <AdminProductsClient products={products} />

      {/* Paginace */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/produkty?page=${p}`}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all"
              style={
                p === page
                  ? { background: '#d4a853', color: '#080808' }
                  : { background: '#1a1a1a', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.08)' }
              }
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
