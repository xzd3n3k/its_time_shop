import Link from 'next/link';
import { CheckCircle, Package, ArrowRight, CreditCard, Copy } from 'lucide-react';
import QRCode from 'qrcode';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { ShopSettings } from '@/lib/types';

interface Props {
  searchParams: Promise<{ order?: string; payment?: string; total?: string }>;
}

export const metadata = {
  title: "Objednávka přijata | It's Time",
};

export const dynamic = 'force-dynamic';

// Převod českého čísla účtu na IBAN
function czechAccountToIBAN(account: string): string | null {
  const match = account.trim().replace(/\s/g, '').match(/^(?:(\d+)-)?(\d+)\/(\d{4})$/);
  if (!match) return null;
  const prefix = (match[1] ?? '0').padStart(6, '0');
  const number = match[2].padStart(10, '0');
  const bankCode = match[3];
  const bban = `${bankCode}${prefix}${number}`;
  const checkInput = `${bban}123500`; // CZ = 12,35 + 00
  const mod = BigInt(checkInput) % BigInt(97);
  const checkDigits = String(BigInt(98) - mod).padStart(2, '0');
  return `CZ${checkDigits}${bban}`;
}

function formatIBAN(iban: string): string {
  return iban.replace(/(.{4})/g, '$1 ').trim();
}

// Variabilní symbol = číslice z čísla objednávky, max 10 číslic
function orderToVS(orderNumber: string): string {
  const digits = orderNumber.replace(/\D/g, '');
  return digits.slice(-10);
}

async function getSettings(): Promise<ShopSettings | null> {
  const { data } = await supabase.from('settings').select('*').eq('id', 1).single();
  return data as ShopSettings | null;
}

async function generateSPDQR(iban: string, amount: number, vs: string, message: string): Promise<string> {
  const spd = [
    'SPD*1.0',
    `ACC:${iban}`,
    `AM:${amount.toFixed(2)}`,
    'CC:CZK',
    `X-VS:${vs}`,
    `MSG:${message.slice(0, 60)}`,
  ].join('*');

  return QRCode.toDataURL(spd, {
    errorCorrectionLevel: 'M',
    margin: 1,
    width: 200,
    color: { dark: '#1a1a1a', light: '#ffffff' },
  });
}

export default async function HotovePage({ searchParams }: Props) {
  const { order, payment, total } = await searchParams;

  const isBankTransfer = payment === 'bank_transfer';
  const totalAmount = total ? parseFloat(total) : 0;

  let settings: ShopSettings | null = null;
  let iban: string | null = null;
  let qrDataUrl: string | null = null;
  const vs = order ? orderToVS(order) : '';

  if (isBankTransfer) {
    settings = await getSettings();
    if (settings?.bank_account) {
      if (settings.bank_account.trim().toUpperCase().startsWith('CZ')) {
        iban = settings.bank_account.trim().replace(/\s/g, '');
      } else {
        iban = czechAccountToIBAN(settings.bank_account);
      }
    }
    console.log('[hotovo] QR inputs:', { hasSettings: !!settings, bank_account: settings?.bank_account, iban, totalAmount, order });
    if (iban && totalAmount > 0 && order) {
      try {
        qrDataUrl = await generateSPDQR(iban, totalAmount, vs, `Objednavka ${order}`);
        console.log('[hotovo] QR generated, length:', qrDataUrl?.length);
      } catch (err) {
        console.error('[hotovo] QR generation failed:', err);
        qrDataUrl = null;
      }
    } else {
      console.warn('[hotovo] QR skipped — missing iban/total/order');
    }
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 min-h-screen flex items-center justify-center px-4 py-12" style={{ background: '#fff5f9' }}>
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
            style={{ fontFamily: 'var(--font-heading)', color: '#1a1a1a' }}
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
              style={{ background: 'rgba(233,30,140,0.1)', border: '1px solid rgba(233,30,140,0.3)' }}
            >
              <Package size={20} style={{ color: '#e91e8c' }} />
              <div className="text-left">
                <p className="text-xs text-gray-500">Číslo objednávky</p>
                <p className="font-bold text-lg" style={{ color: '#e91e8c' }}>
                  {order}
                </p>
              </div>
            </div>
          )}

          {/* Platební údaje pro bankovní převod */}
          {isBankTransfer && (
            <div
              className="bg-white rounded-xl p-6 mb-6 text-left border shadow-sm"
              style={{ borderColor: 'rgba(233,30,140,0.25)' }}
            >
              <div className="flex items-center gap-2 mb-4">
                <CreditCard size={18} style={{ color: '#e91e8c' }} />
                <h2 className="font-semibold text-gray-800">Platební údaje</h2>
              </div>

              <div className="space-y-3 text-sm mb-5">
                {settings?.bank_account && (
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-gray-500 flex-shrink-0">Číslo účtu</span>
                    <span className="font-semibold text-gray-900 text-right">
                      {settings.bank_account}
                    </span>
                  </div>
                )}
                {iban && (
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-gray-500 flex-shrink-0">IBAN</span>
                    <span className="font-semibold text-gray-900 text-right font-mono text-xs leading-relaxed">
                      {formatIBAN(iban)}
                    </span>
                  </div>
                )}
                {totalAmount > 0 && (
                  <div className="flex justify-between items-center gap-4">
                    <span className="text-gray-500 flex-shrink-0">Částka</span>
                    <span className="font-bold text-lg" style={{ color: '#e91e8c' }}>
                      {totalAmount.toLocaleString('cs-CZ', { minimumFractionDigits: 2 })} Kč
                    </span>
                  </div>
                )}
                {vs && (
                  <div className="flex justify-between items-center gap-4">
                    <span className="text-gray-500 flex-shrink-0">Variabilní symbol</span>
                    <span className="font-semibold text-gray-900 font-mono">{vs}</span>
                  </div>
                )}
                <div className="flex justify-between items-center gap-4">
                  <span className="text-gray-500 flex-shrink-0">Zpráva pro příjemce</span>
                  <span className="font-semibold text-gray-900 text-right">{order}</span>
                </div>
              </div>

              {/* QR kód */}
              {qrDataUrl && (
                <div className="flex flex-col items-center gap-2 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500">Naskenujte QR kódem v bankovní aplikaci</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrDataUrl}
                    alt="QR kód pro platbu"
                    width={160}
                    height={160}
                    className="rounded-lg"
                    style={{ border: '1px solid #e5e7eb', padding: '6px', background: '#fff' }}
                  />
                  <p className="text-xs text-gray-400">Formát SPD – bankovní převod CZK</p>
                </div>
              )}

              {!settings?.bank_account && (
                <p className="text-xs text-gray-400 text-center">
                  Platební údaje vám zašleme e-mailem.
                </p>
              )}
            </div>
          )}

          {/* Co se stane dál */}
          <div className="bg-white rounded-xl p-5 mb-8 text-left space-y-3 border border-gray-100 shadow-sm">
            <h2 className="font-semibold text-gray-800 mb-3">Co se stane dál?</h2>

            {isBankTransfer && (
              <div className="flex items-start gap-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold"
                  style={{ background: '#e91e8c', color: '#080808' }}
                >
                  1
                </div>
                <div>
                  <p className="font-medium text-gray-800 text-sm">Proveďte platbu</p>
                  <p className="text-xs text-gray-500">Uhraďte částku na výše uvedený účet</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold"
                style={{ background: '#e91e8c', color: '#080808' }}
              >
                {isBankTransfer ? '2' : '1'}
              </div>
              <div>
                <p className="font-medium text-gray-800 text-sm">Potvrzení objednávky</p>
                <p className="text-xs text-gray-500">Na váš e-mail přijde potvrzení objednávky</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold"
                style={{ background: '#e91e8c', color: '#080808' }}
              >
                {isBankTransfer ? '3' : '2'}
              </div>
              <div>
                <p className="font-medium text-gray-800 text-sm">Příprava zboží</p>
                <p className="text-xs text-gray-500">Zboží připravíme k odeslání do 24 hodin</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold"
                style={{ background: '#e91e8c', color: '#080808' }}
              >
                {isBankTransfer ? '4' : '3'}
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
