import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Package, Tag, ShoppingBag, LogOut, Settings } from 'lucide-react';

export const metadata = {
  title: "Admin | It's Time",
};

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
}

const navItems: NavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/produkty', label: 'Produkty', icon: Package },
  { href: '/admin/kategorie', label: 'Kategorie', icon: Tag },
  { href: '/admin/objednavky', label: 'Objednávky', icon: ShoppingBag },
  { href: '/admin/nastaveni', label: 'Nastavení', icon: Settings },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';

  // Login stránka nepotřebuje auth — vrať jen children bez sidebar layoutu
  if (pathname.startsWith('/admin/login')) {
    return <>{children}</>;
  }

  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');

  if (!session || session.value !== 'authenticated') {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#080808' }}>
      {/* Sidebar */}
      <aside
        className="w-64 flex-shrink-0 flex flex-col"
        style={{ background: '#0e0e0e', borderRight: '1px solid rgba(233,30,140,0.15)' }}
      >
        {/* Logo */}
        <div
          className="px-6 py-5 border-b"
          style={{ borderColor: 'rgba(233,30,140,0.15)' }}
        >
          <Link href="/admin">
            <h1
              className="text-2xl font-bold tracking-widest"
              style={{ fontFamily: 'var(--font-heading)', color: '#e91e8c' }}
            >
              It&apos;s Time
            </h1>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Administrace
            </p>
          </Link>
        </div>

        {/* Navigace */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group"
              style={{ color: 'rgba(255,255,255,0.65)' }}
            >
              <Icon
                size={18}
                style={{ color: 'rgba(233,30,140,0.7)' }}
              />
              {label}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div
          className="px-3 py-4 border-t"
          style={{ borderColor: 'rgba(233,30,140,0.15)' }}
        >
          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              <LogOut size={18} style={{ color: 'rgba(255,100,100,0.7)' }} />
              Odhlásit se
            </button>
          </form>
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs mt-1 transition-all"
            style={{ color: 'rgba(255,255,255,0.35)' }}
          >
            ← Přejít na e-shop
          </Link>
        </div>
      </aside>

      {/* Hlavní obsah */}
      <main className="flex-1 overflow-auto" style={{ background: '#111111' }}>
        {children}
      </main>
    </div>
  );
}
