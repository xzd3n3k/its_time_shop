import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import { Order } from '@/lib/types';
import Link from 'next/link';
import { ChevronLeft, User, MapPin, CreditCard, Package } from 'lucide-react';
import OrderStatusClient from './OrderStatusClient';

interface Props {
  params: Promise<{ id: string }>;
}

const statusLabels: Record<string, string> = {
  pending: 'Čeká na zpracování',
  confirmed: 'Potvrzena',
  processing: 'Zpracovává se',
  shipped: 'Odesláno',
  delivered: 'Doručeno',
  cancelled: 'Zrušena',
};

const paymentLabels: Record<string, string> = {
  cash: 'Hotově (při převzetí)',
  bank_transfer: 'Bankovní převod',
};

async function getOrder(id: string): Promise<Order | null> {
  const admin = supabaseAdmin();
  const { data } = await admin.from('orders').select('*').eq('id', id).single();
  return data as Order | null;
}

export default async function ObjednavkaDetailPage({ params }: Props) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) notFound();

  return (
    <div className="p-8">
      <div className="mb-8">
        <Link
          href="/admin/objednavky"
          className="flex items-center gap-1.5 text-sm mb-4"
          style={{ color: 'rgba(255,255,255,0.4)' }}
        >
          <ChevronLeft size={16} />
          Zpět na objednávky
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="text-3xl font-semibold"
              style={{ fontFamily: 'var(--font-heading)', color: '#ffffff' }}
            >
              Objednávka {order.order_number}
            </h1>
            <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {new Date(order.created_at).toLocaleDateString('cs-CZ', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          {/* Status */}
          <OrderStatusClient orderId={order.id} currentStatus={order.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Zákazník */}
        <div
          className="rounded-xl p-6"
          style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <User size={16} style={{ color: '#e91e8c' }} />
            <h2 className="font-semibold text-sm" style={{ color: '#ffffff' }}>
              Zákazník
            </h2>
          </div>
          <div className="space-y-2 text-sm">
            <InfoRow label="Jméno" value={order.customer_name} />
            <InfoRow label="E-mail" value={order.customer_email} />
            {order.customer_phone && (
              <InfoRow label="Telefon" value={order.customer_phone} />
            )}
          </div>
        </div>

        {/* Doručení */}
        <div
          className="rounded-xl p-6"
          style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={16} style={{ color: '#e91e8c' }} />
            <h2 className="font-semibold text-sm" style={{ color: '#ffffff' }}>
              Doručovací adresa
            </h2>
          </div>
          <div className="space-y-2 text-sm">
            <InfoRow label="Ulice" value={order.customer_street} />
            <InfoRow label="Město" value={order.customer_city} />
            <InfoRow label="PSČ" value={order.customer_zip} />
          </div>
        </div>

        {/* Platba */}
        <div
          className="rounded-xl p-6"
          style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <CreditCard size={16} style={{ color: '#e91e8c' }} />
            <h2 className="font-semibold text-sm" style={{ color: '#ffffff' }}>
              Platba
            </h2>
          </div>
          <div className="space-y-2 text-sm">
            <InfoRow
              label="Způsob platby"
              value={paymentLabels[order.payment_method] ?? order.payment_method}
            />
            <InfoRow
              label="Stav"
              value={statusLabels[order.status] ?? order.status}
            />
          </div>
          {order.notes && (
            <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Poznámka</p>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>{order.notes}</p>
            </div>
          )}
        </div>

        {/* Položky objednávky */}
        <div
          className="rounded-xl p-6"
          style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Package size={16} style={{ color: '#e91e8c' }} />
            <h2 className="font-semibold text-sm" style={{ color: '#ffffff' }}>
              Položky objednávky
            </h2>
          </div>

          <div className="space-y-3">
            {Array.isArray(order.items) && order.items.map((item, i) => (
              <div
                key={i}
                className="flex justify-between items-center py-2"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
              >
                <div>
                  <p className="text-sm" style={{ color: '#ffffff' }}>
                    {item.product?.name ?? 'Produkt'}
                  </p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {Number(item.product?.price ?? 0).toFixed(2)} Kč × {item.quantity} ks
                  </p>
                </div>
                <p className="text-sm font-semibold" style={{ color: '#e91e8c' }}>
                  {(Number(item.product?.price ?? 0) * item.quantity).toFixed(2)} Kč
                </p>
              </div>
            ))}
          </div>

          <div
            className="flex justify-between items-center mt-4 pt-4"
            style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
          >
            <span className="font-semibold" style={{ color: '#ffffff' }}>
              Celkem:
            </span>
            <span className="text-xl font-bold" style={{ color: '#e91e8c' }}>
              {Number(order.total).toFixed(2)} Kč
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span style={{ color: 'rgba(255,255,255,0.4)' }}>{label}:</span>
      <span style={{ color: 'rgba(255,255,255,0.85)' }}>{value}</span>
    </div>
  );
}
