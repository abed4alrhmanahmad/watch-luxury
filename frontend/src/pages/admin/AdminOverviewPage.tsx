import { useEffect, useState } from 'react';
import { adminAPI, AdminStats } from '@/services/adminApi';

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStats = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await adminAPI.stats();
      setStats(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load dashboard stats';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading dashboard...</p>;
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-md">
        <p className="text-sm">{error}</p>
        <button onClick={loadStats} className="mt-3 text-xs underline">Retry</button>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-3xl font-bold">Dashboard Overview</h2>
        <p className="text-sm text-muted-foreground">Business snapshot and activity</p>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value={currency.format(stats.total_revenue)} />
        <StatCard title="Monthly Revenue" value={currency.format(stats.monthly_revenue)} />
        <StatCard title="Total Orders" value={String(stats.total_orders)} />
        <StatCard title="Low Stock" value={String(stats.low_stock_count)} warning={stats.low_stock_count > 0} />
      </div>

      <div className="grid xl:grid-cols-2 gap-6">
        <section className="bg-card border border-border rounded-lg p-4">
          <h3 className="font-heading text-xl font-semibold mb-3">Top Selling Products</h3>
          {stats.top_selling_products.length === 0 ? (
            <p className="text-sm text-muted-foreground">No sales data yet.</p>
          ) : (
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-border">
                    <th className="py-2">Product</th>
                    <th className="py-2">Qty Sold</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.top_selling_products.map((item) => (
                    <tr key={item.name} className="border-b border-border/60">
                      <td className="py-2">{item.name}</td>
                      <td className="py-2 font-semibold">{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="bg-card border border-border rounded-lg p-4">
          <h3 className="font-heading text-xl font-semibold mb-3">Recent Orders</h3>
          {stats.recent_orders.length === 0 ? (
            <p className="text-sm text-muted-foreground">No orders yet.</p>
          ) : (
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-border">
                    <th className="py-2">Order</th>
                    <th className="py-2">Customer</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recent_orders.map((order) => (
                    <tr key={order.id} className="border-b border-border/60">
                      <td className="py-2">{order.order_number}</td>
                      <td className="py-2">{order.customer_email}</td>
                      <td className="py-2 capitalize">{order.status_display}</td>
                      <td className="py-2 font-semibold">{currency.format(Number(order.total))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function StatCard({ title, value, warning = false }: { title: string; value: string; warning?: boolean }) {
  return (
    <div className={`bg-card border rounded-lg p-4 ${warning ? 'border-amber-500/40' : 'border-border'}`}>
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{title}</p>
      <p className={`text-2xl font-heading font-bold mt-1 ${warning ? 'text-amber-600' : ''}`}>{value}</p>
    </div>
  );
}
