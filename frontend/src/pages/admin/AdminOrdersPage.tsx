import { useEffect, useState } from 'react';
import { adminAPI, AdminOrder, PaginatedResponse } from '@/services/adminApi';

const statusOptions = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [selected, setSelected] = useState<AdminOrder | null>(null);

  const loadOrders = async (params?: Record<string, string>) => {
    try {
      setLoading(true);
      setError('');
      const { data } = await adminAPI.orders.list(params || {
        ...(search ? { search } : {}),
        ...(status ? { status } : {}),
      });
      const paged = data as PaginatedResponse<AdminOrder>;
      setOrders(paged.results || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (orderId: number, nextStatus: string) => {
    try {
      await adminAPI.orders.updateStatus(orderId, nextStatus);
      loadOrders();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-heading text-3xl font-bold">Order Management</h2>
        <p className="text-sm text-muted-foreground">Track, filter, and update order fulfillment</p>
      </div>

      <div className="bg-card border border-border rounded-lg p-3 flex flex-wrap gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search order # or customer"
          className="px-3 py-2 border border-border rounded-md bg-background text-sm"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-3 py-2 border border-border rounded-md bg-background text-sm"
        >
          <option value="">All Statuses</option>
          {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <button onClick={() => loadOrders()} className="px-4 py-2 rounded-md border border-border text-sm">Apply</button>
      </div>

      {error && <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 p-3 rounded-md">{error}</div>}

      <div className="bg-card border border-border rounded-lg overflow-auto">
        {loading ? (
          <p className="p-4 text-sm text-muted-foreground">Loading orders...</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-border">
                <th className="p-3">Order</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Status</th>
                <th className="p-3">Total</th>
                <th className="p-3">Placed</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-border/60">
                  <td className="p-3 font-medium">{o.order_number}</td>
                  <td className="p-3">
                    <p>{o.shipping_full_name}</p>
                    <p className="text-xs text-muted-foreground">{o.shipping_email}</p>
                  </td>
                  <td className="p-3 capitalize">{o.status_display}</td>
                  <td className="p-3 font-semibold">${Number(o.total).toFixed(2)}</td>
                  <td className="p-3">{new Date(o.created_at).toLocaleDateString()}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <select
                        defaultValue={o.status}
                        onChange={(e) => updateStatus(o.id, e.target.value)}
                        className="px-2 py-1 border border-border rounded-md bg-background text-xs"
                      >
                        {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <button onClick={() => setSelected(o)} className="px-2 py-1 text-xs border border-border rounded-md">View</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-card border border-border rounded-lg p-4 max-h-[90vh] overflow-auto">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-heading text-2xl">Order {selected.order_number}</h3>
                <p className="text-sm text-muted-foreground">{selected.shipping_full_name} • {selected.shipping_email}</p>
              </div>
              <button onClick={() => setSelected(null)} className="px-3 py-2 text-sm border border-border rounded-md">Close</button>
            </div>

            <div className="mt-4 grid md:grid-cols-2 gap-4">
              <div className="border border-border rounded-md p-3">
                <p className="text-xs text-muted-foreground">Shipping Address</p>
                <p className="mt-1 text-sm">{selected.shipping_address}</p>
                <p className="text-sm">{selected.shipping_city}, {selected.shipping_state} {selected.shipping_zip}</p>
                <p className="text-sm">{selected.shipping_country}</p>
                <p className="mt-1 text-sm">Phone: {selected.shipping_phone}</p>
              </div>
              <div className="border border-border rounded-md p-3 text-sm">
                <p>Subtotal: ${Number(selected.subtotal).toFixed(2)}</p>
                <p>Shipping: ${Number(selected.shipping_cost).toFixed(2)}</p>
                <p>Tax: ${Number(selected.tax).toFixed(2)}</p>
                <p className="font-semibold mt-2">Total: ${Number(selected.total).toFixed(2)}</p>
              </div>
            </div>

            <div className="mt-4 border border-border rounded-md overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-border">
                    <th className="p-2">Item</th>
                    <th className="p-2">Unit</th>
                    <th className="p-2">Qty</th>
                    <th className="p-2">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {selected.items.map((item) => (
                    <tr key={item.id} className="border-b border-border/60">
                      <td className="p-2">{item.product_name}</td>
                      <td className="p-2">${Number(item.unit_price).toFixed(2)}</td>
                      <td className="p-2">{item.quantity}</td>
                      <td className="p-2">${Number(item.subtotal).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
