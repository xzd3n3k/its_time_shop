export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Award, Truck, Headphones } from 'lucide-react';

async function getFeaturedProducts(): Promise<Product[]> {
  const { data } = await supabase
    .from('products')
    .select('*, categories(id, name, slug, created_at)')
    .eq('featured', true)
    .eq('active', true)
    .limit(4);
  return (data as Product[]) ?? [];
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  const features = [
    {
      icon: Award,
      title: 'Prémiová kvalita',
      desc: 'Vybíráme pouze produkty nejvyšší kvality od ověřených výrobců.',
    },
    {
      icon: Truck,
      title: 'Rychlé dodání',
      desc: 'Objednávky expedujeme do 24 hodin. Doručení po celé ČR.',
    },
    {
      icon: Headphones,
      title: 'Odborné poradenství',
      desc: 'Naši experti vám poradí s výběrem správného produktu pro vaše auto.',
    },
  ];

  return (
    <>
      <Navbar />

      {/* Hero sekce */}
      <section
        className="relative min-h-screen flex items-center justify-center px-4"
        style={{
          background: 'linear-gradient(135deg, #080808 0%, #1a1a1a 50%, #0e0e0e 100%)',
        }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, #d4a853 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, #d4a853 0%, transparent 40%)`,
          }}
        />

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <p
            className="text-sm uppercase tracking-[0.3em] mb-6"
            style={{ color: '#d4a853' }}
          >
            Prémiová autokosmetika
          </p>

          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-light mb-6 leading-tight"
            style={{
              fontFamily: 'var(--font-cormorant)',
              color: '#ffffff',
            }}
          >
            Prémiová péče
            <br />
            <span style={{ color: '#d4a853' }}>o váš automobil</span>
          </h1>

          <div className="gold-line mx-auto mb-6" />

          <p
            className="text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.7)' }}
          >
            Objevte svět prémiové autokosmetiky. Produkty, které váš automobil
            nejen ochrání, ale dodají mu dokonalý lesk.
          </p>

          <Link href="/produkty" className="btn-gold text-base px-8 py-4 rounded-lg">
            Prohlédnout produkty
          </Link>
        </div>
      </section>

      {/* Doporučené produkty */}
      {featuredProducts.length > 0 && (
        <section className="py-20 px-4" style={{ background: '#faf8f4' }}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <p
                className="text-sm uppercase tracking-[0.25em] mb-3"
                style={{ color: '#d4a853' }}
              >
                Výběr pro vás
              </p>
              <h2
                className="text-4xl md:text-5xl font-light mb-4"
                style={{ fontFamily: 'var(--font-cormorant)', color: '#1a1a1a' }}
              >
                Doporučené produkty
              </h2>
              <div className="gold-line" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="text-center mt-10">
              <Link href="/produkty" className="btn-dark inline-flex items-center gap-2 rounded-lg">
                Zobrazit všechny produkty
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Proč my? */}
      <section className="py-20 px-4" style={{ background: '#080808' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p
              className="text-sm uppercase tracking-[0.25em] mb-3"
              style={{ color: '#d4a853' }}
            >
              Naše hodnoty
            </p>
            <h2
              className="text-4xl md:text-5xl font-light mb-4"
              style={{ fontFamily: 'var(--font-cormorant)', color: '#ffffff' }}
            >
              Proč si vybrat nás?
            </h2>
            <div className="gold-line" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="glass-card p-8 text-center">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
                    style={{
                      background: 'rgba(212,168,83,0.15)',
                      border: '1px solid rgba(212,168,83,0.3)',
                    }}
                  >
                    <Icon size={24} style={{ color: '#d4a853' }} />
                  </div>
                  <h3
                    className="text-xl font-semibold mb-3"
                    style={{ fontFamily: 'var(--font-cormorant)', color: '#ffffff' }}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
