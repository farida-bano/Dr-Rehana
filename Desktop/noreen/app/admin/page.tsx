'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Plus, Edit2, Trash2, TrendingUp, ShoppingBag, Clock } from 'lucide-react';
import Link from 'next/link';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  isAvailable: boolean;
}

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: Array<{ quantity: number; price: number }>;
}

interface Analytics {
  totalOrdersToday: number;
  revenueToday: number;
  totalOrders: number;
  totalRevenue: number;
}

export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'menu' | 'orders' | 'analytics'>('menu');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/sign-in');
    }
  }, [isLoaded, user, router]);

  useEffect(() => {
    if (isLoaded && user) {
      fetchAdminData();
    }
  }, [isLoaded, user]);

  const fetchAdminData = async () => {
    try {
      setIsLoading(true);
      const [menuRes, ordersRes, analyticsRes] = await Promise.all([
        fetch('/api/admin/menu'),
        fetch('/api/admin/orders'),
        fetch('/api/admin/analytics'),
      ]);

      if (menuRes.ok) setMenuItems(await menuRes.json());
      if (ordersRes.ok) setOrders(await ordersRes.json());
      if (analyticsRes.ok) setAnalytics(await analyticsRes.json());
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage MaaKiRasoi</p>
            </div>
            <Link
              href="/"
              className="text-orange-600 hover:text-orange-700 font-semibold"
            >
              ← Back to Store
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('menu')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'menu'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Menu Items
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'orders'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Orders
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Analytics
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : activeTab === 'menu' ? (
          <MenuTab
            items={menuItems}
            onRefresh={fetchAdminData}
            showForm={showMenuForm}
            setShowForm={setShowMenuForm}
            editingItem={editingItem}
            setEditingItem={setEditingItem}
          />
        ) : activeTab === 'orders' ? (
          <OrdersTab orders={orders} />
        ) : (
          <AnalyticsTab analytics={analytics} />
        )}
      </div>
    </div>
  );
}

function MenuTab({
  items,
  onRefresh,
  showForm,
  setShowForm,
  editingItem,
  setEditingItem,
}: {
  items: MenuItem[];
  onRefresh: () => void;
  showForm: boolean;
  setShowForm: (show: boolean) => void;
  editingItem: MenuItem | null;
  setEditingItem: (item: MenuItem | null) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Menu Items</h2>
        <button
          onClick={() => {
            setEditingItem(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition"
        >
          <Plus className="w-5 h-5" />
          Add Item
        </button>
      </div>

      {showForm && (
        <MenuForm
          item={editingItem}
          onClose={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
          onSuccess={() => {
            setShowForm(false);
            setEditingItem(null);
            onRefresh();
          }}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {item.image && (
              <div className="w-full h-40 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-4xl">
                {item.image}
              </div>
            )}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{item.description}</p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-bold text-orange-600">Rs. {item.price}</span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    item.isAvailable
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {item.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingItem(item)}
                  className="flex-1 flex items-center justify-center gap-2 border border-orange-600 text-orange-600 py-2 rounded hover:bg-orange-50 transition"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => deleteMenuItem(item.id, onRefresh)}
                  className="flex-1 flex items-center justify-center gap-2 border border-red-600 text-red-600 py-2 rounded hover:bg-red-50 transition"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MenuForm({
  item,
  onClose,
  onSuccess,
}: {
  item: MenuItem | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    price: item?.price || 0,
    description: item?.description || '',
    image: item?.image || '',
    isAvailable: item?.isAvailable ?? true,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const method = item ? 'PUT' : 'POST';
      const endpoint = item ? `/api/admin/menu/${item.id}` : '/api/admin/menu';

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSuccess();
      } else {
        alert('Failed to save item');
      }
    } catch (error) {
      console.error('Error saving item:', error);
      alert('Error saving item');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {item ? 'Edit Item' : 'Add New Item'}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Item Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Daal Chawal"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Price (Rs.) *
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              placeholder="350"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe the dish..."
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Emoji/Image
          </label>
          <input
            type="text"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            placeholder="e.g., 🍛"
            maxLength={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isAvailable}
            onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
            className="w-4 h-4 rounded border-gray-300 text-orange-600"
          />
          <span className="text-sm text-gray-700">Available</span>
        </label>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : item ? 'Update Item' : 'Add Item'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border-2 border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function OrdersTab({ orders }: { orders: Order[] }) {
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredOrders = statusFilter === 'all'
    ? orders
    : orders.filter(o => o.status === statusFilter);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Orders</h2>

      <div className="flex gap-2 mb-6">
        {['all', 'pending', 'preparing', 'out_for_delivery', 'delivered'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              statusFilter === status
                ? 'bg-orange-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:border-orange-600'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Order ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Amount</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900 font-mono">{order.id.slice(0, 8)}</td>
                <td className="px-6 py-4 text-sm font-semibold text-orange-600">Rs. {order.totalAmount}</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      order.status === 'delivered'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'preparing'
                        ? 'bg-blue-100 text-blue-800'
                        : order.status === 'out_for_delivery'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {order.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm">
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="preparing">Preparing</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AnalyticsTab({ analytics }: { analytics: any }) {
  if (!analytics) return <div>Loading analytics...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Orders Today</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {analytics.totalOrdersToday}
              </p>
            </div>
            <ShoppingBag className="w-12 h-12 text-orange-100" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Revenue Today</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">
                Rs. {analytics.revenueToday}
              </p>
            </div>
            <TrendingUp className="w-12 h-12 text-green-100" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {analytics.totalOrders}
              </p>
            </div>
            <Clock className="w-12 h-12 text-blue-100" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">
                Rs. {analytics.totalRevenue}
              </p>
            </div>
            <TrendingUp className="w-12 h-12 text-orange-100" />
          </div>
        </div>
      </div>
    </div>
  );
}

async function deleteMenuItem(id: string, onRefresh: () => void) {
  if (!confirm('Are you sure you want to delete this item?')) return;

  try {
    const response = await fetch(`/api/admin/menu/${id}`, { method: 'DELETE' });
    if (response.ok) {
      onRefresh();
    }
  } catch (error) {
    console.error('Error deleting item:', error);
    alert('Failed to delete item');
  }
}
