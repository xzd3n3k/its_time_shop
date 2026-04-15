import Link from 'next/link';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Props {
  searchParams: Promise<{ order?: string }>;
}

export const metadata = {
  title: "Objednávka přijata | It's Time",
};

export default async function HotovePage({ searchParams }: Props) {
  const { order } = await searchParams;

  return (
    <>
      <Navbar />
      <main className="flex-1 min-h-screen flex items-center justify-center px-4" style={{ background: '#faf8f4' }}>
        <div className="max-w-lg w-full text-center">
          {/* Ikona */}
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'rgba(34,197,94,0.1)', border: '2px solid rgba(34,197,94,0.3)' }}
          >
            <CheckCircle size={48} className="text-green-500" />
          </div>

          <h1
            className="text-4xl md:text-5xl font-light mb-4"
            style={{ fontFamily: 'var(--font-cormorant)', color: '#1a1a1a' }}
          >
            Děkujeme za vaši objednávku!
          </h1>

          <div className="gold-line" />

          <p className="text-gray-600 mb-6 mt-4 leading-relaxed">
            Vaše objednávka byla úspěšně přijata. Brzy vás budeme kontaktovat
            na zadané emailové adrese.
          </p>

          {order && (
            <div
              className="flex items-center justify-center gap-3 p-4 rounded-xl mb-6"
              style={{ background: 'rgba(212,168,83,0.1)', border: '1px solid rgba(212,168,83,0.3)' }}
            >
              <Package size={20} style={{ color: '#d4a853' }} />
              <div className="text-left">
                <p className="text-xs text-gray-500">Číslo objednávky</p>
                <p className="font-bold text-lg" style={{ color: '#d4a853' }}>
                  {order}
                </p>
              </div>
            </div>
          )}

          <div
            className="bg-white rounded-xl p-5 mb-8 text-left space-y-3 border border-gray-100 shadow-sm"
          >
            <h2 className="font-semibold text-gray-800 mb-3">Co se stane dál?</h2>
            <div className="flex items-start gap-3">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold"
                style={{ background: '#d4a853', color: '#080808' }}
              >
                1
              </div>
              <div>
                <p className="font-medium text-gray-800 text-sm">Potvrzení objednávky</p>
                <p className="text-xs text-gray-500">Na váš e-mail přijde potvrzení objednávky</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold"
                style={{ background: '#d4a853', color: '#080808' }}
              >
                2
              </div>
              <div>
                <p className="font-medium text-gray-800 text-sm">Příprava zboží</p>
                <p className="text-xs text-gray-500">Zboží připravíme k odeslání do 24 hodin</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold"
                style={{ background: '#d4a853', color: '#080808' }}
              >
                3
              </div>
              <div>
                <p className="font-medium text-gray-800 text-sm">Doručení</p>
                <p className="text-xs text-gray-500">Doručení na zadanou adresu</p>
              </div>
            </div>
          </div>

          <Link href="/produkty" className="btn-gold rounded-lg inline-flex items-center gap-2">
            Pokračovat v nákupu
            <ArrowRight size={18} />
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
