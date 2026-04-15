import { supabaseAdmin } from '@/lib/supabase';
import { Package, Tag, ShoppingBag, TrendingUp } from 'lucide-react';
import Link from 'next/link';

async function getDashboardStats() {
  const admin = supabaseAdmin();

  const [
    { count: totalProducts },
    { count: activeProducts },
    { count: totalCategories },
    { data: recentOrders },
    { count: todayOrders },
  ] = await Promise.all([
    admin.from('products').select('*', { count: 'exact', head: true }),
    admin.from('products').select('*', { count: 'exact', head: true }).eq('active', true),
    admin.from('categories').select('*', { count: 'exact', head: true }),
    admin
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5),
    admin
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date().toISOString().slice(0, 10)),
  ]);

  return { totalProducts, activeProducts, totalCategories, recentOrders, todayOrders };
}

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

export default async function AdminDashboard() {
  const { totalProducts, activeProducts, totalCategories, recentOrders, todayOrders } =
    await getDashboardStats();

  const stats = [
    { label: 'Celkem produktů', value: totalProducts ?? 0, icon: Package, color: '#d4a853' },
    { label: 'Aktivní produkty', value: activeProducts ?? 0, icon: TrendingUp, color: '#22c55e' },
    { label: 'Kategorie', value: totalCategories ?? 0, icon: Tag, color: '#3b82f6' },
    { label: 'Objednávky dnes', value: todayOrders ?? 0, icon: ShoppingBag, color: '#f59e0b' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1
          className="text-3xl font-semibold"
          style={{ fontFamily: 'var(--font-cormorant)', color: '#ffffff' }}
        >
          Dashboard
        </h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Přehled e-shopu
        </p>
      </div>

      {/* Statistiky */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-xl p-5"
            style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {label}
              </p>
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: `${color}20` }}
              >
                <Icon size={18} style={{ color }} />
              </div>
            </div>
            <p className="text-3xl font-bold" style={{ color }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Poslední objednávky */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}
        >
          <h2 className="font-semibold" style={{ color: '#ffffff' }}>
            Poslední objednávky
          </h2>
          <Link
            href="/admin/objednavky"
            className="text-xs font-medium"
            style={{ color: '#d4a853' }}
          >
            Zobrazit vše →
          </Link>
        </div>

        {(!recentOrders || recentOrders.length === 0) ? (
          <div className="py-12 text-center" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Žádné objednávky
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['Číslo', 'Zákazník', 'Celkem', 'Platba', 'Status', 'Datum'].map((h) => (
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
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/objednavky/${order.id}`}
                        className="text-sm font-medium hover:underline"
                        style={{ color: '#d4a853' }}
                      >
                        {order.order_number ?? '—'}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
                      {order.customer_name}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold" style={{ color: '#d4a853' }}>
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
                      {new Date(order.created_at).toLocaleDateString('cs-CZ')}
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
