import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Package, ShoppingCart, Mail, Users, LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: BarChart3 },
    { path: '/admin/products', label: 'Products', icon: Package },
    { path: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { path: '/admin/messages', label: 'Messages', icon: Mail },
    { path: '/admin/users', label: 'Users', icon: Users },
  ];

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gray-800 border-r border-gray-700 transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold text-amber-500">ChronoLux</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-gray-700 rounded"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  active
                    ? 'bg-amber-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-700">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-red-400 hover:bg-red-900/20"
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6">
          <h2 className="text-xl font-semibold">Admin Dashboard</h2>
          <div className="text-sm text-gray-400">
            Logged in as <span className="text-amber-500">admin@chronolux.com</span>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-gray-950">
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
