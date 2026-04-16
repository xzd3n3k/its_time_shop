export const dynamic = 'force-dynamic';

import { supabase } from '@/lib/supabase';
import { Product, Category } from '@/lib/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductsClient from './ProductsClient';

async function getProducts(): Promise<Product[]> {
  const { data } = await supabase
    .from('products')
    .select('*, categories(id, name, slug, created_at)')
    .eq('active', true)
    .order('created_at', { ascending: false });
  return (data as Product[]) ?? [];
}

async function getCategories(): Promise<Category[]> {
  const { data } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  return data ?? [];
}

export const metadata = {
  title: "Produkty | It's Time",
  description: 'Kompletní nabídka prémiové autokosmetiky.',
};

export default async function ProduktyPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <>
      <Navbar />
      <main className="flex-1 min-h-screen" style={{ background: '#fff5f9' }}>
        {/* Hlavička */}
        <div
          className="py-16 px-4 text-center"
          style={{ background: '#080808' }}
        >
          <p
            className="text-sm uppercase tracking-[0.25em] mb-3"
            style={{ color: '#e91e8c' }}
          >
            Náš sortiment
          </p>
          <h1
            className="text-4xl md:text-5xl font-light"
            style={{ fontFamily: 'var(--font-heading)', color: '#ffffff' }}
          >
            Produkty
          </h1>
          <div className="gold-line" />
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          <ProductsClient products={products} categories={categories} />
        </div>
      </main>
      <Footer />
    </>
  );
}
