import { supabaseAdmin } from '@/lib/supabase';
import { Category } from '@/lib/types';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import ProductForm from '@/components/admin/ProductForm';

async function getCategories(): Promise<Category[]> {
  const admin = supabaseAdmin();
  const { data } = await admin.from('categories').select('*').order('name');
  return data ?? [];
}

export const metadata = {
  title: "Nový produkt | Admin | It's Time",
};

export default async function NovyProduktPage() {
  const categories = await getCategories();

  return (
    <div className="p-8">
      <div className="mb-8">
        <Link
          href="/admin/produkty"
          className="flex items-center gap-1.5 text-sm mb-4 transition-colors"
          style={{ color: 'rgba(255,255,255,0.4)' }}
        >
          <ChevronLeft size={16} />
          Zpět na produkty
        </Link>
        <h1
          className="text-3xl font-semibold"
          style={{ fontFamily: 'var(--font-heading)', color: '#ffffff' }}
        >
          Nový produkt
        </h1>
      </div>

      <div
        className="rounded-xl p-8"
        style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
