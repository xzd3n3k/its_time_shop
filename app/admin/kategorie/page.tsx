import { supabaseAdmin } from '@/lib/supabase';
import { Category } from '@/lib/types';
import KategorieClient from './KategorieClient';

async function getCategories(): Promise<Category[]> {
  const admin = supabaseAdmin();
  const { data } = await admin.from('categories').select('*').order('name');
  return data ?? [];
}

export const metadata = {
  title: "Kategorie | Admin | It's Time",
};

export default async function AdminKategoriePage() {
  const categories = await getCategories();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1
          className="text-3xl font-semibold"
          style={{ fontFamily: 'var(--font-heading)', color: '#ffffff' }}
        >
          Kategorie
        </h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Spravujte kategorie produktů
        </p>
      </div>

      <KategorieClient initialCategories={categories} />
    </div>
  );
}
