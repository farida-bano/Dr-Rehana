'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { Package, Clock, CheckCircle, Truck, AlertCircle } from 'lucide-react';

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered';
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

export default function OrdersPage() {
  const { user, isLoaded } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      fetchOrders();
    }
  }, [isLoaded, user]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please sign in to view your orders</p>
      </div>
    );
  }

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
      case 'preparing':
        return <Package className="w-5 h-5 text-orange-600" />;
      case 'out_for_delivery':
        return <Truck className="w-5 h-5 text-purple-600" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
  };

  const getStatusLabel = (status: Order['status']) => {
    const labels: Record<Order['status'], string> = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      preparing: 'Preparing',
      out_for_delivery: 'Out for Delivery',
      delivered: 'Delivered',
    };
    return labels[status];
  };

  const getStatusColor = (status: Order['status']) => {
    const colors: Record<Order['status'], string> = {
      pending: 'bg-yellow-50 border-yellow-200',
      confirmed: 'bg-blue-50 border-blue-200',
      preparing: 'bg-orange-50 border-orange-200',
      out_for_delivery: 'bg-purple-50 border-purple-200',
      delivered: 'bg-green-50 border-green-200',
    };
    return colors[status];
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No orders yet
            </h2>
            <p className="text-gray-600 mb-6">
              Start ordering delicious meals from MaaKiRasoi!
            </p>
            <a
              href="/menu"
              className="inline-block bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition"
            >
              Browse Menu
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className={`bg-white rounded-xl shadow-md overflow-hidden border-l-4 ${
                  order.status === 'delivered'
                    ? 'border-l-green-600'
                    : 'border-l-orange-600'
                }`}
              >
                {/* Order Header */}
                <div className={`p-6 border-b ${getStatusColor(order.status)}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {order.id}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(order.date).toLocaleDateString('en-PK', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <span className="font-semibold text-gray-900">
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6 border-b">
                  <h4 className="font-semibold text-gray-900 mb-4">Items</h4>
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-gray-700"
                      >
                        <span>
                          {item.name} x {item.quantity}
                        </span>
                        <span className="font-semibold">
                          Rs. {item.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Footer */}
                <div className="p-6 bg-gray-50 flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    Total: Rs. {order.total}
                  </span>
                  <button className="px-6 py-2 border-2 border-orange-600 text-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition">
                    Reorder
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
