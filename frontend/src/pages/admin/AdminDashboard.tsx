import { useEffect, useState } from 'react';
import { BarChart3, ShoppingCart, Package, Users, AlertCircle, TrendingUp } from 'lucide-react';
import { adminAPI, AdminStats } from '@/services/adminApi';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminAPI.stats();
        setStats(res.data);
      } catch (err) {
        setError('Failed to load dashboard stats');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (error) {
    return <div className="text-red-400">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 bg-gray-700" />
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Revenue Card */}
          <Card className="bg-gray-800 border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold text-white mt-2">
                  ${stats.total_revenue.toFixed(2)}
                </p>
                <p className="text-xs text-green-400 mt-1">
                  This month: ${stats.monthly_revenue.toFixed(2)}
                </p>
              </div>
              <TrendingUp className="text-amber-500" size={40} />
            </div>
          </Card>

          {/* Orders Card */}
          <Card className="bg-gray-800 border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Orders</p>
                <p className="text-3xl font-bold text-white mt-2">{stats.total_orders}</p>
                <p className="text-xs text-blue-400 mt-1">
                  This month: {stats.monthly_orders}
                </p>
              </div>
              <ShoppingCart className="text-blue-500" size={40} />
            </div>
          </Card>

          {/* Products Card */}
          <Card className="bg-gray-800 border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Products</p>
                <p className="text-3xl font-bold text-white mt-2">{stats.total_products}</p>
                <p className="text-xs text-red-400 mt-1">
                  Low stock: {stats.low_stock_count}
                </p>
              </div>
              <Package className="text-purple-500" size={40} />
            </div>
          </Card>

          {/* Users Card */}
          <Card className="bg-gray-800 border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-white mt-2">{stats.total_users}</p>
                <p className="text-xs text-cyan-400 mt-1">Registered customers</p>
              </div>
              <Users className="text-cyan-500" size={40} />
            </div>
          </Card>
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <Card className="bg-gray-800 border-gray-700 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <BarChart3 className="mr-2" size={20} /> Recent Orders
            </h3>
            {stats?.recent_orders && stats.recent_orders.length > 0 ? (
              <div className="space-y-3">
                {stats.recent_orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 bg-gray-700/50 rounded hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-semibold">#{order.order_number}</p>
                      <p className="text-sm text-gray-400">{order.customer_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${parseFloat(order.total).toFixed(2)}</p>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          order.status === 'delivered'
                            ? 'bg-green-900/50 text-green-400'
                            : order.status === 'shipped'
                              ? 'bg-blue-900/50 text-blue-400'
                              : 'bg-yellow-900/50 text-yellow-400'
                        }`}
                      >
                        {order.status_display}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No recent orders</p>
            )}
          </Card>
        </div>

        {/* Order Status Breakdown */}
        <div>
          <Card className="bg-gray-800 border-gray-700 p-6">
            <h3 className="text-lg font-semibold mb-4">Orders by Status</h3>
            <div className="space-y-3">
              {stats?.orders_by_status ? (
                Object.entries(stats.orders_by_status).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <span className="capitalize text-gray-400">{status}</span>
                    <span className="font-semibold text-amber-500">{count}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No orders yet</p>
              )}
            </div>
          </Card>

          {/* Low Stock Alert */}
          {stats && stats.low_stock_count > 0 && (
            <Card className="bg-red-900/30 border-red-700 p-6 mt-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center text-red-400">
                <AlertCircle className="mr-2" size={20} /> Low Stock Alert
              </h3>
              <p className="text-red-300">{stats.low_stock_count} products running low</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
