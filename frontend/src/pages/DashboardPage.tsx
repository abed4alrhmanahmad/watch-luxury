import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ordersAPI } from '@/services/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';

interface OrderItem {
  id: number;
  product_name: string;
  product_image: string;
  unit_price: string;
  quantity: number;
  subtotal: string;
}

interface Order {
  id: number;
  order_number: string;
  status: string;
  status_display: string;
  total: string;
  subtotal: string;
  shipping_cost: string;
  tax: string;
  created_at: string;
  items: OrderItem[];
}

type Tab = 'DASHBOARD' | 'MY ORDERS' | 'ACCOUNT DETAILS';

const statusColor: Record<string, string> = {
  pending: 'text-amber-600',
  processing: 'text-blue-600',
  shipped: 'text-indigo-600',
  delivered: 'text-green-600',
  cancelled: 'text-red-600',
};

const DashboardPage = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('DASHBOARD');
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    fetchOrders();
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const { data } = await ordersAPI.list();
      setOrders(data.results ?? data);
    } catch {
      // ignore
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const totalSpent = orders.reduce((sum, o) => sum + parseFloat(o.total), 0);
  const completedOrders = orders.filter((o) => o.status === 'delivered').length;
  const pendingOrders = orders.filter((o) => ['pending', 'processing', 'shipped'].includes(o.status)).length;

  const tabs: Tab[] = ['DASHBOARD', 'MY ORDERS', 'ACCOUNT DETAILS'];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />

      <div className="container py-6">
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-body mb-8">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <span className="text-foreground">My Account</span>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="space-y-1">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`block w-full text-left px-4 py-2.5 text-xs font-body font-semibold tracking-wider transition-colors ${
                  tab === t ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {t}
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2.5 text-xs font-body font-semibold tracking-wider text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              LOGOUT
            </button>
          </aside>

          {/* Content */}
          <div className="md:col-span-3">
            {/* ── DASHBOARD TAB ────────────────────────────── */}
            {tab === 'DASHBOARD' && (
              <>
                <h1 className="font-heading text-2xl font-bold mb-2">DASHBOARD</h1>
                <p className="font-body text-muted-foreground mb-8">
                  Welcome back, {user?.first_name || 'there'}!
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: 'TOTAL ORDERS', value: orders.length },
                    { label: 'PENDING', value: pendingOrders },
                    { label: 'COMPLETED', value: completedOrders },
                    { label: 'TOTAL SPENT', value: `$${totalSpent.toFixed(2)}` },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-card border border-border p-4 text-center">
                      <p className="font-heading text-2xl font-bold text-foreground">{value}</p>
                      <p className="text-[10px] font-body text-muted-foreground tracking-wider mt-1">{label}</p>
                    </div>
                  ))}
                </div>

                <h2 className="font-heading text-xl font-semibold mb-4">RECENT ORDERS</h2>
                <OrderTable orders={orders.slice(0, 5)} loading={ordersLoading} onSelect={setSelectedOrder} />
                <button onClick={() => setTab('MY ORDERS')} className="mt-4 text-sm font-body text-accent hover:text-primary">
                  View All Orders →
                </button>
              </>
            )}

            {/* ── MY ORDERS TAB ────────────────────────────── */}
            {tab === 'MY ORDERS' && (
              <>
                <h1 className="font-heading text-2xl font-bold mb-6">MY ORDERS</h1>
                {selectedOrder ? (
                  <OrderDetail order={selectedOrder} onBack={() => setSelectedOrder(null)} />
                ) : (
                  <OrderTable orders={orders} loading={ordersLoading} onSelect={setSelectedOrder} />
                )}
              </>
            )}

            {/* ── ACCOUNT DETAILS TAB ──────────────────────── */}
            {tab === 'ACCOUNT DETAILS' && (
              <>
                <h1 className="font-heading text-2xl font-bold mb-6">ACCOUNT DETAILS</h1>
                <div className="bg-card border border-border p-6 max-w-md space-y-4">
                  {[
                    { label: 'First Name', value: user?.first_name },
                    { label: 'Last Name', value: user?.last_name },
                    { label: 'Email', value: user?.email },
                    { label: 'Phone', value: user?.phone || '—' },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-xs font-body font-bold tracking-wider text-muted-foreground">{label.toUpperCase()}</p>
                      <p className="text-sm font-body text-foreground mt-0.5">{value}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

function OrderTable({
  orders,
  loading,
  onSelect,
}: {
  orders: Order[];
  loading: boolean;
  onSelect: (o: Order) => void;
}) {
  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="bg-card border border-border p-12 text-center">
        <p className="text-muted-foreground font-body">No orders yet.</p>
        <Link to="/shop" className="mt-4 inline-block text-sm font-body text-accent hover:text-primary">
          Start Shopping →
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border">
      <div className="hidden md:grid grid-cols-5 gap-4 p-4 border-b border-border text-xs font-body font-bold tracking-wider text-muted-foreground">
        <span>ORDER</span>
        <span>DATE</span>
        <span>STATUS</span>
        <span>TOTAL</span>
        <span></span>
      </div>
      {orders.map((order) => (
        <div
          key={order.id}
          className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 border-b border-border last:border-0 text-sm font-body items-center"
        >
          <span className="font-semibold text-foreground">{order.order_number}</span>
          <span className="text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</span>
          <span className={`font-medium capitalize ${statusColor[order.status] || 'text-foreground'}`}>
            {order.status_display}
          </span>
          <span className="font-semibold">${parseFloat(order.total).toFixed(2)}</span>
          <button
            onClick={() => onSelect(order)}
            className="text-xs text-accent hover:text-primary font-semibold text-right md:text-left"
          >
            VIEW
          </button>
        </div>
      ))}
    </div>
  );
}

function OrderDetail({ order, onBack }: { order: Order; onBack: () => void }) {
  return (
    <div>
      <button onClick={onBack} className="text-sm font-body text-accent hover:text-primary mb-6">
        ← Back to Orders
      </button>

      <div className="bg-card border border-border p-6 mb-6">
        <div className="flex flex-wrap gap-6 mb-6">
          <div>
            <p className="text-xs font-body font-bold tracking-wider text-muted-foreground">ORDER</p>
            <p className="text-sm font-body font-semibold mt-0.5">{order.order_number}</p>
          </div>
          <div>
            <p className="text-xs font-body font-bold tracking-wider text-muted-foreground">DATE</p>
            <p className="text-sm font-body mt-0.5">{new Date(order.created_at).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-xs font-body font-bold tracking-wider text-muted-foreground">STATUS</p>
            <p className={`text-sm font-body font-medium capitalize mt-0.5 ${statusColor[order.status] || ''}`}>
              {order.status_display}
            </p>
          </div>
        </div>

        <h3 className="text-xs font-body font-bold tracking-wider text-muted-foreground mb-3">ITEMS</h3>
        <div className="space-y-3 mb-6">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-3 items-center">
              {item.product_image && (
                <img src={item.product_image} alt={item.product_name} className="w-14 h-14 object-cover bg-muted" />
              )}
              <div className="flex-1">
                <p className="text-sm font-body font-medium">{item.product_name}</p>
                <p className="text-xs text-muted-foreground">Qty: {item.quantity} × ${parseFloat(item.unit_price).toFixed(2)}</p>
              </div>
              <span className="text-sm font-body font-semibold">${parseFloat(item.subtotal).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-4 space-y-1 text-sm font-body max-w-xs ml-auto">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${parseFloat(order.subtotal).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span>{parseFloat(order.shipping_cost) === 0 ? 'Free' : `$${parseFloat(order.shipping_cost).toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax</span>
            <span>${parseFloat(order.tax).toFixed(2)}</span>
          </div>
          <div className="border-t border-border pt-1 flex justify-between font-semibold">
            <span>Total</span>
            <span>${parseFloat(order.total).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
