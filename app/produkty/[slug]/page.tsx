import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductDetailClient from './ProductDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string): Promise<Product | null> {
  const { data } = await supabase
    .from('products')
    .select('*, categories(id, name, slug, created_at)')
    .eq('slug', slug)
    .eq('active', true)
    .single();
  return data as Product | null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: 'Produkt nenalezen' };
  return {
    title: `${product.name} | It's Time`,
    description: product.description ?? `Prémiová autokosmetika - ${product.name}`,
    openGraph: {
      title: product.name,
      description: product.description ?? undefined,
      images: product.image_url ? [product.image_url] : [],
    },
  };
}

export default async function ProduktDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  return (
    <>
      <Navbar />
      <main className="flex-1" style={{ background: '#faf8f4' }}>
        <ProductDetailClient product={product} />
      </main>
      <Footer />
    </>
  );
}
