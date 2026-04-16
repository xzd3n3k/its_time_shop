import { supabaseAdmin } from '@/lib/supabase';
import { Order } from '@/lib/types';
import Link from 'next/link';
import DeleteOrderButton from '@/components/admin/DeleteOrderButton';

const statusLabels: Record<string, string> = {
  pending: 'Čeká',
  confirmed: 'Potvrzena',
  processing: 'Zpracovává se',
  shipped: 'Odesláno',
  delivered: 'Doručeno',
  cancelled: 'Zrušena',
};

const statusColors: Record<string, string> = {
  pending: '#f59e0b',
  confirmed: '#3b82f6',
  processing: '#8b5cf6',
  shipped: '#06b6d4',
  delivered: '#22c55e',
  cancelled: '#ef4444',
};

const paymentLabels: Record<string, string> = {
  cash: 'Hotově',
  bank_transfer: 'Převodem',
};

interface Props {
  searchParams: Promise<{ status?: string }>;
}

async function getOrders(status?: string): Promise<Order[]> {
  const admin = supabaseAdmin();
  let query = admin.from('orders').select('*').order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data } = await query;
  return (data as Order[]) ?? [];
}

export const metadata = {
  title: "Objednávky | Admin | It's Time",
};

export default async function AdminObjednavkyPage({ searchParams }: Props) {
  const { status } = await searchParams;
  const orders = await getOrders(status);

  const statuses = ['', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1
          className="text-3xl font-semibold"
          style={{ fontFamily: 'var(--font-heading)', color: '#ffffff' }}
        >
          Objednávky
        </h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Celkem {orders.length} objednávek
        </p>
      </div>

      {/* Filtr statusu */}
      <div className="flex flex-wrap gap-2 mb-6">
        {statuses.map((s) => (
          <Link
            key={s}
            href={s ? `/admin/objednavky?status=${s}` : '/admin/objednavky'}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
            style={
              status === s || (!status && !s)
                ? { background: '#e91e8c', color: '#080808' }
                : { background: '#1a1a1a', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }
            }
          >
            {s ? statusLabels[s] : 'Všechny'}
          </Link>
        ))}
      </div>

      {/* Tabulka */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        {orders.length === 0 ? (
          <div className="py-16 text-center" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Žádné objednávky
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['Číslo', 'Zákazník', 'Celkem', 'Platba', 'Status', 'Datum', 'Detail', ''].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: 'rgba(255,255,255,0.35)' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="transition-colors hover:bg-white/5"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                  >
                    <td className="px-6 py-4 text-sm font-medium" style={{ color: '#e91e8c' }}>
                      {order.order_number ?? '—'}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm" style={{ color: '#ffffff' }}>
                        {order.customer_name}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        {order.customer_email}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold" style={{ color: '#e91e8c' }}>
                      {Number(order.total).toFixed(2)} Kč
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                      {paymentLabels[order.payment_method] ?? order.payment_method}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="text-xs font-medium px-2.5 py-1 rounded-full"
                        style={{
                          background: `${statusColors[order.status] ?? '#6b7280'}20`,
                          color: statusColors[order.status] ?? '#6b7280',
                        }}
                      >
                        {statusLabels[order.status] ?? order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      {new Date(order.created_at).toLocaleDateString('cs-CZ', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/objednavky/${order.id}`}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
                        style={{ background: 'rgba(233,30,140,0.1)', color: '#e91e8c' }}
                      >
                        Detail
                      </Link>
                    </td>
                    <td className="px-4 py-4">
                      <DeleteOrderButton orderId={order.id} orderNumber={order.order_number ?? undefined} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
