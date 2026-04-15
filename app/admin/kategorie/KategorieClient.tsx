'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, Plus, X, Check, Loader2 } from 'lucide-react';
import { Category } from '@/lib/types';

interface Props {
  initialCategories: Category[];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export default function KategorieClient({ initialCategories }: Props) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const inputStyle: React.CSSProperties = {
    background: '#111111',
    border: '1px solid rgba(255,255,255,0.12)',
    color: '#ffffff',
    borderRadius: '0.5rem',
    padding: '0.5rem 0.75rem',
    fontSize: '0.875rem',
  };

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setLoading(true);

    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName.trim(), slug: newSlug || slugify(newName) }),
    });

    const data = await res.json();
    if (data.success && data.category) {
      setCategories((prev) => [...prev, data.category]);
      setNewName('');
      setNewSlug('');
      router.refresh();
    }
    setLoading(false);
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditSlug(cat.slug);
  };

  const handleUpdate = async (id: string) => {
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editName, slug: editSlug }),
    });
    if (res.ok) {
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, name: editName, slug: editSlug } : c))
      );
      setEditingId(null);
      router.refresh();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Smazat tuto kategorii? Produkty zůstanou bez kategorie.')) return;
    setDeletingId(id);
    const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      router.refresh();
    }
    setDeletingId(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Seznam kategorií */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div
          className="px-6 py-4 border-b"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}
        >
          <h2 className="font-semibold text-sm" style={{ color: '#ffffff' }}>
            Existující kategorie ({categories.length})
          </h2>
        </div>

        {categories.length === 0 ? (
          <div className="py-12 text-center" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Žádné kategorie
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
            {categories.map((cat) => (
              <div key={cat.id} className="px-6 py-4">
                {editingId === cat.id ? (
                  <div className="flex items-center gap-3">
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => {
                          setEditName(e.target.value);
                          setEditSlug(slugify(e.target.value));
                        }}
                        style={{ ...inputStyle, width: '100%' }}
                        placeholder="Název kategorie"
                      />
                      <input
                        type="text"
                        value={editSlug}
                        onChange={(e) => setEditSlug(e.target.value)}
                        style={{ ...inputStyle, width: '100%' }}
                        placeholder="slug"
                      />
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleUpdate(cat.id)}
                        className="p-1.5 rounded-lg"
                        style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}
                      >
                        <Check size={14} />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-1.5 rounded-lg"
                        style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#ffffff' }}>
                        {cat.name}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                        /{cat.slug}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startEdit(cat)}
                        className="p-1.5 rounded-lg"
                        style={{ background: 'rgba(0,138,191,0.1)', color: '#008abf' }}
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        disabled={deletingId === cat.id}
                        className="p-1.5 rounded-lg"
                        style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Přidat kategorii */}
      <div
        className="rounded-xl p-6"
        style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <h2 className="font-semibold text-sm mb-5" style={{ color: '#ffffff' }}>
          Přidat novou kategorii
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Název kategorie *
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value);
                setNewSlug(slugify(e.target.value));
              }}
              style={{ ...inputStyle, width: '100%' }}
              placeholder="Vosky a leštěnky"
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Slug (URL)
            </label>
            <input
              type="text"
              value={newSlug}
              onChange={(e) => setNewSlug(e.target.value)}
              style={{ ...inputStyle, width: '100%' }}
              placeholder="vosky-a-lestenky"
            />
          </div>
          <button
            onClick={handleAdd}
            disabled={loading || !newName.trim()}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #008abf, #432273)', color: '#080808' }}
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Plus size={16} />
            )}
            {loading ? 'Přidávám...' : 'Přidat kategorii'}
          </button>
        </div>
      </div>
    </div>
  );
}
