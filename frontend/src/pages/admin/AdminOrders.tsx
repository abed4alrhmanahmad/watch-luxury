import { useEffect, useState } from 'react';
import { Search, Eye } from 'lucide-react';
import { adminAPI, AdminOrder, PaginatedResponse } from '@/services/adminApi';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

const STATUS_OPTIONS = ['pending', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [search, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const res = await adminAPI.orders.list(params);
      setOrders(res.data.results || res.data);
    } catch (err) {
      toast.error('Failed to load orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      setUpdatingId(orderId);
      await adminAPI.orders.updateStatus(orderId, newStatus);
      toast.success('Order status updated');
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
      fetchOrders();
    } catch (err) {
      toast.error('Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleViewDetails = (order: AdminOrder) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-900/50 text-green-400';
      case 'shipped':
        return 'bg-blue-900/50 text-blue-400';
      case 'pending':
        return 'bg-yellow-900/50 text-yellow-400';
      case 'cancelled':
        return 'bg-red-900/50 text-red-400';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Orders</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gray-800 border-gray-700 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <Input
              placeholder="Search by order #, customer, or email..."
              className="pl-10 bg-gray-700 border-gray-600 text-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </Card>

        <Card className="bg-gray-800 border-gray-700 p-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-gray-700 border-gray-600">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              <SelectItem value="">All Statuses</SelectItem>
              {STATUS_OPTIONS.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Card>
      </div>

      {/* Orders Table */}
      <Card className="bg-gray-800 border-gray-700 p-6">
        {loading ? (
          <div className="text-center text-gray-400">Loading...</div>
        ) : orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-700">
                <tr>
                  <th className="text-left py-3 px-4 text-gray-400">Order #</th>
                  <th className="text-left py-3 px-4 text-gray-400">Customer</th>
                  <th className="text-left py-3 px-4 text-gray-400">Date</th>
                  <th className="text-left py-3 px-4 text-gray-400">Total</th>
                  <th className="text-left py-3 px-4 text-gray-400">Status</th>
                  <th className="text-center py-3 px-4 text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-700/50">
                    <td className="py-4 px-4 font-semibold">#{order.order_number}</td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-semibold">{order.customer_name}</p>
                        <p className="text-xs text-gray-400">{order.customer_email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-300">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 font-semibold">${parseFloat(order.total).toFixed(2)}</td>
                    <td className="py-4 px-4">
                      <Select
                        value={order.status}
                        onValueChange={(val) => handleStatusChange(order.id, val)}
                        disabled={updatingId === order.id}
                      >
                        <SelectTrigger className={`w-32 text-xs ${getStatusColor(order.status)}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          {STATUS_OPTIONS.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleViewDetails(order)}
                        className="text-blue-400 hover:bg-blue-900/50"
                      >
                        <Eye size={16} className="mr-1" /> View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-gray-400">No orders found</div>
        )}
      </Card>

      {/* Order Detail Dialog */}
      {selectedOrder && (
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Order #{selectedOrder.order_number}</DialogTitle>
              <DialogDescription>Order details and items</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Order Status & Totals */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Status</label>
                  <p className={`text-lg font-semibold mt-1 inline-block px-3 py-1 rounded ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status_display}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Date</label>
                  <p className="text-lg font-semibold mt-1">
                    {new Date(selectedOrder.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-gray-700/50 p-4 rounded">
                <h3 className="font-semibold mb-3">Shipping Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="text-gray-400">Name</label>
                    <p>{selectedOrder.shipping_full_name}</p>
                  </div>
                  <div>
                    <label className="text-gray-400">Email</label>
                    <p>{selectedOrder.shipping_email}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-gray-400">Address</label>
                    <p>
                      {selectedOrder.shipping_address}, {selectedOrder.shipping_city},{' '}
                      {selectedOrder.shipping_state} {selectedOrder.shipping_zip},
                      {selectedOrder.shipping_country}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold mb-3">Items</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex justify-between bg-gray-700/50 p-3 rounded">
                      <div className="flex-1">
                        <p className="font-semibold">{item.product_name}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${parseFloat(item.unit_price).toFixed(2)}</p>
                        <p className="text-xs text-gray-400">
                          Subtotal: ${parseFloat(item.subtotal).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="bg-gray-700/50 p-4 rounded space-y-2 text-right">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${parseFloat(selectedOrder.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>${parseFloat(selectedOrder.shipping_cost).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>${parseFloat(selectedOrder.tax).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t border-gray-600 pt-2">
                  <span>Total:</span>
                  <span className="text-amber-400">${parseFloat(selectedOrder.total).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
