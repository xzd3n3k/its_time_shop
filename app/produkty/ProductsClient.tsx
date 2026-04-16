'use client';

import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { Product, Category } from '@/lib/types';
import ProductCard from '@/components/ProductCard';

interface ProductsClientProps {
  products: Product[];
  categories: Category[];
}

export default function ProductsClient({ products, categories }: ProductsClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat = !selectedCategory || p.category_id === selectedCategory;
      const matchSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <>
      {/* Vyhledávání */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Hledat produkty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Kategorie filtry */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory(null)}
            className="px-4 py-2 rounded-full text-sm font-medium transition-all"
            style={
              !selectedCategory
                ? { background: '#e91e8c', color: '#080808' }
                : { background: '#ffffff', color: '#6b7280', border: '1px solid #e5e7eb' }
            }
          >
            Vše
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all"
              style={
                selectedCategory === cat.id
                  ? { background: '#e91e8c', color: '#080808' }
                  : { background: '#ffffff', color: '#6b7280', border: '1px solid #e5e7eb' }
              }
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Výsledky */}
      <p className="text-sm text-gray-500 mb-6">
        Zobrazeno {filtered.length} {filtered.length === 1 ? 'produkt' : filtered.length < 5 ? 'produkty' : 'produktů'}
      </p>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg mb-2">Žádné produkty nenalezeny</p>
          <p className="text-sm">Zkuste změnit filtr nebo vyhledávání</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  );
}
