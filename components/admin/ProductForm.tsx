'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save } from 'lucide-react';
import { Product, Category } from '@/lib/types';

interface Props {
  product?: Product;
  categories: Category[];
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

export default function ProductForm({ product, categories }: Props) {
  const router = useRouter();
  const isEdit = !!product;

  const [form, setForm] = useState({
    name: product?.name ?? '',
    slug: product?.slug ?? '',
    description: product?.description ?? '',
    price: product?.price?.toString() ?? '',
    category_id: product?.category_id ?? '',
    image_url: product?.image_url ?? '',
    stock: product?.stock?.toString() ?? '0',
    active: product?.active ?? true,
    featured: product?.featured ?? false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setForm((prev) => ({
      ...prev,
      name,
      slug: isEdit ? prev.slug : slugify(name),
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      name: form.name,
      slug: form.slug,
      description: form.description || null,
      price: parseFloat(form.price),
      category_id: form.category_id || null,
      image_url: form.image_url || null,
      stock: parseInt(form.stock, 10),
      active: form.active,
      featured: form.featured,
    };

    try {
      const url = isEdit ? `/api/admin/products/${product.id}` : '/api/admin/products';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error ?? 'Chyba při ukládání');
        return;
      }

      router.push('/admin/produkty');
      router.refresh();
    } catch {
      setError('Chyba připojení');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    background: '#111111',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#ffffff',
    borderRadius: '0.5rem',
    padding: '0.75rem 1rem',
    width: '100%',
    fontSize: '0.875rem',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '0.375rem',
    color: 'rgba(255,255,255,0.5)',
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Název */}
      <div>
        <label style={labelStyle}>
          Název produktu <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <input
          type="text"
          name="name"
          required
          value={form.name}
          onChange={handleNameChange}
          style={inputStyle}
          placeholder="Prémiový vosk CarPro"
        />
      </div>

      {/* Slug */}
      <div>
        <label style={labelStyle}>Slug (URL)</label>
        <input
          type="text"
          name="slug"
          required
          value={form.slug}
          onChange={handleChange}
          style={inputStyle}
          placeholder="premiumovy-vos-carpro"
        />
      </div>

      {/* Popis */}
      <div>
        <label style={labelStyle}>Popis</label>
        <textarea
          name="description"
          rows={4}
          value={form.description}
          onChange={handleChange}
          style={{ ...inputStyle, resize: 'vertical' }}
          placeholder="Popis produktu..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Cena */}
        <div>
          <label style={labelStyle}>
            Cena (Kč) <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            type="number"
            name="price"
            required
            min="0"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            style={inputStyle}
            placeholder="299.00"
          />
        </div>

        {/* Sklad */}
        <div>
          <label style={labelStyle}>Počet na skladě</label>
          <input
            type="number"
            name="stock"
            min="0"
            value={form.stock}
            onChange={handleChange}
            style={inputStyle}
            placeholder="10"
          />
        </div>
      </div>

      {/* Kategorie */}
      <div>
        <label style={labelStyle}>Kategorie</label>
        <select
          name="category_id"
          value={form.category_id}
          onChange={handleChange}
          style={inputStyle}
        >
          <option value="">— Bez kategorie —</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* URL obrázku */}
      <div>
        <label style={labelStyle}>URL obrázku</label>
        <input
          type="url"
          name="image_url"
          value={form.image_url}
          onChange={handleChange}
          style={inputStyle}
          placeholder="https://example.com/obrazek.jpg"
        />
        {form.image_url && (
          <div className="mt-2 w-24 h-24 rounded-lg overflow-hidden bg-gray-800">
            <img
              src={form.image_url}
              alt="Náhled"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      {/* Přepínače */}
      <div className="flex gap-8">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="active"
            checked={form.active}
            onChange={handleChange}
            className="sr-only"
          />
          <div
            className="relative w-10 h-5 rounded-full transition-colors"
            style={{ background: form.active ? '#e91e8c' : 'rgba(255,255,255,0.15)' }}
            onClick={() => setForm((prev) => ({ ...prev, active: !prev.active }))}
          >
            <span
              className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all"
              style={{ left: form.active ? '22px' : '2px' }}
            />
          </div>
          <span className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Aktivní (viditelný v e-shopu)
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <div
            className="relative w-10 h-5 rounded-full transition-colors"
            style={{ background: form.featured ? '#e91e8c' : 'rgba(255,255,255,0.15)' }}
            onClick={() => setForm((prev) => ({ ...prev, featured: !prev.featured }))}
          >
            <span
              className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all"
              style={{ left: form.featured ? '22px' : '2px' }}
            />
          </div>
          <span className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Doporučený (na homepage)
          </span>
        </label>
      </div>

      {/* Chyba */}
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      {/* Tlačítka */}
      <div className="flex items-center gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all disabled:opacity-70"
          style={{ background: 'linear-gradient(135deg, #e91e8c, #8b0048)', color: '#080808' }}
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {loading ? 'Ukládám...' : isEdit ? 'Aktualizovat produkt' : 'Vytvořit produkt'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/produkty')}
          className="px-6 py-3 rounded-lg text-sm font-medium transition-all"
          style={{ background: '#1a1a1a', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          Zrušit
        </button>
      </div>
    </form>
  );
}
