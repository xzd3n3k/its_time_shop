'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, Check } from 'lucide-react';
import { ShopSettings } from '@/lib/types';

const inputStyle: React.CSSProperties = {
  background: '#111111',
  border: '1px solid rgba(255,255,255,0.12)',
  color: '#ffffff',
  borderRadius: '0.5rem',
  padding: '0.625rem 0.875rem',
  fontSize: '0.875rem',
  width: '100%',
  outline: 'none',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.7rem',
  fontWeight: 600,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.4)',
  marginBottom: '0.375rem',
};

export default function NastaveniPage() {
  const [form, setForm] = useState<Omit<ShopSettings, 'id'>>({
    company_name: '',
    email: '',
    address: '',
    phone: '',
    bank_account: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((data: ShopSettings) => {
        if (data && data.id) {
          setForm({
            company_name: data.company_name ?? '',
            email: data.email ?? '',
            address: data.address ?? '',
            phone: data.phone ?? '',
            bank_account: data.bank_account ?? '',
          });
        }
      })
      .catch(() => setError('Nepodařilo se načíst nastavení.'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const res = await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (data.success) {
      setSaved(true);
    } else {
      setError(data.error ?? 'Chyba při ukládání.');
    }
    setSaving(false);
  };

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#ffffff' }}>
          Nastavení obchodu
        </h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Údaje se zobrazují v patičce a na stránce Kontakty.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
          <Loader2 size={16} className="animate-spin" />
          <span className="text-sm">Načítám…</span>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="rounded-xl p-6 space-y-5"
          style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div>
            <label style={labelStyle}>Název firmy</label>
            <input
              type="text"
              value={form.company_name}
              onChange={(e) => handleChange('company_name', e.target.value)}
              style={inputStyle}
              placeholder="It's Time s.r.o."
            />
          </div>

          <div>
            <label style={labelStyle}>E-mail</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              style={inputStyle}
              placeholder="info@itstime.cz"
            />
          </div>

          <div>
            <label style={labelStyle}>Sídlo / Adresa</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => handleChange('address', e.target.value)}
              style={inputStyle}
              placeholder="Hlavní 1, 602 00 Brno"
            />
          </div>

          <div>
            <label style={labelStyle}>Telefon</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              style={inputStyle}
              placeholder="+420 123 456 789"
            />
          </div>

          <div>
            <label style={labelStyle}>Číslo účtu</label>
            <input
              type="text"
              value={form.bank_account}
              onChange={(e) => handleChange('bank_account', e.target.value)}
              style={inputStyle}
              placeholder="123456789/0100"
            />
          </div>

          {error && (
            <p className="text-sm" style={{ color: '#ef4444' }}>
              {error}
            </p>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #e91e8c, #8b0048)', color: '#080808' }}
            >
              {saving ? (
                <Loader2 size={15} className="animate-spin" />
              ) : saved ? (
                <Check size={15} />
              ) : (
                <Save size={15} />
              )}
              {saving ? 'Ukládám…' : saved ? 'Uloženo!' : 'Uložit nastavení'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
