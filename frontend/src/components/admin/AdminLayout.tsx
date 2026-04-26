import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/messages', label: 'Messages' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="grid md:grid-cols-[240px_1fr] min-h-screen">
        <aside className="border-r border-border bg-card p-4 md:p-6">
          <div className="mb-8">
            <p className="text-xs font-body tracking-widest text-muted-foreground">ADMIN PANEL</p>
            <h1 className="font-heading text-2xl font-bold">ChronoLux</h1>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `block px-3 py-2 text-sm rounded-md transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-10 pt-4 border-t border-border space-y-2 text-xs font-body text-muted-foreground">
            <p>{user?.full_name || user?.email}</p>
            <p>{user?.is_superuser ? 'Role: Admin' : 'Role: Staff'}</p>
            <button
              onClick={logout}
              className="mt-2 px-3 py-2 text-xs rounded-md border border-border hover:bg-muted"
            >
              Logout
            </button>
            <Link to="/" className="block px-3 py-2 text-xs rounded-md hover:bg-muted">
              Back to Store
            </Link>
          </div>
        </aside>

        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
