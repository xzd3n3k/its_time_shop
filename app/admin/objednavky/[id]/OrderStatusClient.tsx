'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface Props {
  orderId: string;
  currentStatus: string;
}

const statuses = [
  { value: 'pending', label: 'Čeká na zpracování' },
  { value: 'confirmed', label: 'Potvrzena' },
  { value: 'processing', label: 'Zpracovává se' },
  { value: 'shipped', label: 'Odesláno' },
  { value: 'delivered', label: 'Doručeno' },
  { value: 'cancelled', label: 'Zrušena' },
];

const statusColors: Record<string, string> = {
  pending: '#f59e0b',
  confirmed: '#3b82f6',
  processing: '#8b5cf6',
  shipped: '#06b6d4',
  delivered: '#22c55e',
  cancelled: '#ef4444',
};

export default function OrderStatusClient({ orderId, currentStatus }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setLoading(true);

    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) {
      setStatus(newStatus);
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-3">
      {loading && <Loader2 size={16} className="animate-spin" style={{ color: '#008abf' }} />}
      <div className="relative">
        <select
          value={status}
          onChange={handleChange}
          disabled={loading}
          className="pr-8 pl-3 py-2 rounded-lg text-sm font-medium appearance-none cursor-pointer"
          style={{
            background: `${statusColors[status] ?? '#6b7280'}20`,
            border: `1px solid ${statusColors[status] ?? '#6b7280'}50`,
            color: statusColors[status] ?? '#6b7280',
          }}
        >
          {statuses.map((s) => (
            <option key={s.value} value={s.value} style={{ background: '#1a1a1a', color: '#ffffff' }}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
