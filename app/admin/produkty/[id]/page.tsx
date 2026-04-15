import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import { Product, Category } from '@/lib/types';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import ProductForm from '@/components/admin/ProductForm';

interface Props {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string): Promise<Product | null> {
  const admin = supabaseAdmin();
  const { data } = await admin
    .from('products')
    .select('*, categories(id, name, slug, created_at)')
    .eq('id', id)
    .single();
  return data as Product | null;
}

async function getCategories(): Promise<Category[]> {
  const admin = supabaseAdmin();
  const { data } = await admin.from('categories').select('*').order('name');
  return data ?? [];
}

export default async function EditProduktPage({ params }: Props) {
  const { id } = await params;
  const [product, categories] = await Promise.all([getProduct(id), getCategories()]);

  if (!product) notFound();

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
          style={{ fontFamily: 'var(--font-cormorant)', color: '#ffffff' }}
        >
          Upravit produkt
        </h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
          {product.name}
        </p>
      </div>

      <div
        className="rounded-xl p-8"
        style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <ProductForm product={product} categories={categories} />
      </div>
    </div>
  );
}
