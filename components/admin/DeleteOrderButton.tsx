'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Loader2 } from 'lucide-react';

export default function DeleteOrderButton({ orderId, orderNumber }: { orderId: string; orderNumber?: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await fetch(`/api/admin/orders/${orderId}`, { method: 'DELETE' });
      router.refresh();
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  };

  if (confirming) {
    return (
      <div className="flex items-center gap-1.5">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-xs font-medium px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1"
          style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}
        >
          {loading ? <Loader2 size={12} className="animate-spin" /> : null}
          Smazat
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-xs font-medium px-2.5 py-1.5 rounded-lg transition-all"
          style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}
        >
          Zrušit
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      title={`Smazat objednávku ${orderNumber ?? ''}`}
      className="p-1.5 rounded-lg transition-all hover:bg-red-500/15 text-gray-500 hover:text-red-500"
    >
      <Trash2 size={15} />
    </button>
  );
}
