'use client';

import { useState } from 'react';
import { useEffect } from 'react';
import { useCart } from '@/lib/store';
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const subtotal = getTotalPrice();
  const deliveryFee = 150;
  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">Add some delicious meals to get started!</p>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition"
            >
              <ArrowLeft className="w-5 h-5" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-4 p-6 ${
                    index !== items.length - 1 ? 'border-b' : ''
                  }`}
                >
                  {/* Item Image */}
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                    {item.image}
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                    <p className="text-orange-600 font-bold">Rs. {item.price}</p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:bg-gray-200 rounded transition"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4 text-gray-700" />
                    </button>
                    <span className="w-8 text-center font-semibold text-gray-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:bg-gray-200 rounded transition"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="text-right min-w-fit">
                    <p className="font-bold text-gray-900">
                      Rs. {(item.price * item.quantity).toFixed(0)}
                    </p>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Continue Shopping Link */}
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold mt-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-20">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 pb-6 border-b">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>Rs. {deliveryFee}</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-gray-900">
                  <span>Total</span>
                  <span className="text-orange-600">Rs. {total.toFixed(0)}</span>
                </div>
              </div>

              <button
                onClick={() => setIsCheckingOut(true)}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition mb-3"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => clearCart()}
                className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Clear Cart
              </button>

              {/* Promo Code (Placeholder) */}
              <div className="mt-6 pt-6 border-t">
                <input
                  type="text"
                  placeholder="Promo code"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button className="w-full mt-2 text-orange-600 font-semibold text-sm hover:text-orange-700">
                  Apply Code
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Checkout Modal Trigger */}
        {isCheckingOut && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center">
            <div className="bg-white w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto">
              <CheckoutForm
                subtotal={subtotal}
                deliveryFee={deliveryFee}
                total={total}
                onClose={() => setIsCheckingOut(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CheckoutForm({
  subtotal,
  deliveryFee,
  total,
  onClose,
}: {
  subtotal: number;
  deliveryFee: number;
  total: number;
  onClose: () => void;
}) {
  const { items, clearCart } = useCart();
  const [step, setStep] = useState<'address' | 'payment' | 'confirm'>('address');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    addressId: '',
    phone: '',
    notes: '',
    paymentMethod: 'cod',
  });

  const handleAddressChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, addressId: e.target.value });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, phone: e.target.value });
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, notes: e.target.value });
  };

  const handlePaymentChange = (method: string) => {
    setFormData({ ...formData, paymentMethod: method });
  };

  const handlePlaceOrder = async () => {
    if (!formData.addressId || !formData.phone) {
      alert('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          addressId: formData.addressId,
          phone: formData.phone,
          notes: formData.notes,
          paymentMethod: formData.paymentMethod,
          totalAmount: total,
          items: items.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      });

      if (!response.ok) throw new Error('Failed to place order');

      const order = await response.json();
      setStep('confirm');
      // Store order for success page
      localStorage.setItem('lastOrder', JSON.stringify(order));
      // Clear cart after successful order
      clearCart();
    } catch (error) {
      alert('Error placing order. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'confirm') {
    return <OrderConfirmation onClose={onClose} />;
  }

  return (
    <div className="p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Checkout</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl"
        >
          ×
        </button>
      </div>

      {/* Step Indicator */}
      <div className="flex gap-4 mb-8">
        <div className="flex-1 h-2 rounded-full bg-orange-600" />
        <div
          className={`flex-1 h-2 rounded-full ${
            step !== 'address' ? 'bg-orange-600' : 'bg-gray-300'
          }`}
        />
        <div className="flex-1 h-2 rounded-full bg-gray-300" />
      </div>

      {/* Address Step */}
      {step === 'address' && (
        <AddressStep
          formData={formData}
          onAddressChange={handleAddressChange}
          onPhoneChange={handlePhoneChange}
          onNotesChange={handleNotesChange}
          onNext={() => setStep('payment')}
          onClose={onClose}
        />
      )}

      {/* Payment Step */}
      {step === 'payment' && (
        <PaymentStep
          formData={formData}
          onPaymentChange={handlePaymentChange}
          onBack={() => setStep('address')}
          onConfirm={() => setStep('confirm')}
          subtotal={subtotal}
          deliveryFee={deliveryFee}
          total={total}
        />
      )}

      {/* Order Summary (Always Visible) */}
      <div className="mt-8 pt-8 border-t">
        <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>Rs. {subtotal.toFixed(0)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Delivery Fee</span>
            <span>Rs. {deliveryFee}</span>
          </div>
          <div className="flex justify-between font-bold text-gray-900 pt-2 border-t">
            <span>Total</span>
            <span className="text-orange-600">Rs. {total.toFixed(0)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {step === 'payment' && (
        <div className="flex gap-3 mt-8">
          <button
            onClick={() => setStep('address')}
            className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Back
          </button>
          <button
            onClick={handlePlaceOrder}
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
          >
            {isLoading ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      )}

      {step === 'address' && (
        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => setStep('payment')}
            disabled={!formData.addressId || !formData.phone}
            className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
}

function AddressStep({
  formData,
  onAddressChange,
  onPhoneChange,
  onNotesChange,
  onNext,
  onClose,
}: {
  formData: any;
  onAddressChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNotesChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onNext: () => void;
  onClose: () => void;
}) {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await fetch('/api/addresses');
        if (response.ok) {
          const data = await response.json();
          setAddresses(data);
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
      } finally {
        setIsLoadingAddresses(false);
      }
    };

    fetchAddresses();
  }, []);

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Address</h3>

      <div className="space-y-4">
        {/* Address Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Select Address *
          </label>
          <select
            value={formData.addressId}
            onChange={onAddressChange}
            disabled={isLoadingAddresses}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
          >
            <option value="">
              {isLoadingAddresses ? 'Loading addresses...' : 'Choose a saved address'}
            </option>
            {addresses.map((addr) => (
              <option key={addr.id} value={addr.id}>
                {addr.street}, {addr.city}
              </option>
            ))}
          </select>
          <Link
            href="/profile"
            className="text-sm text-orange-600 hover:text-orange-700 mt-2 inline-block"
          >
            + Add new address
          </Link>
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={onPhoneChange}
            placeholder="e.g., +92 300 1234567"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Special Instructions */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Special Instructions (Optional)
          </label>
          <textarea
            value={formData.notes}
            onChange={onNotesChange}
            placeholder="e.g., Extra spicy, no onions, etc."
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
          />
        </div>
      </div>
    </div>
  );
}

function PaymentStep({
  formData,
  onPaymentChange,
  onBack,
  onConfirm,
  subtotal,
  deliveryFee,
  total,
}: {
  formData: any;
  onPaymentChange: (method: string) => void;
  onBack: () => void;
  onConfirm: () => void;
  subtotal: number;
  deliveryFee: number;
  total: number;
}) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>

      <div className="space-y-3">
        {/* Cash on Delivery */}
        <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition hover:bg-orange-50"
          style={{
            borderColor: formData.paymentMethod === 'cod' ? '#f97316' : '#e5e7eb',
          }}
        >
          <input
            type="radio"
            name="payment"
            value="cod"
            checked={formData.paymentMethod === 'cod'}
            onChange={(e) => onPaymentChange(e.target.value)}
            className="w-4 h-4 text-orange-600"
          />
          <div className="ml-4 flex-1">
            <p className="font-semibold text-gray-900">Cash on Delivery</p>
            <p className="text-sm text-gray-600">Pay when your order arrives</p>
          </div>
          <span className="text-2xl">💵</span>
        </label>

        {/* JazzCash */}
        <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition hover:bg-orange-50 opacity-60"
          style={{
            borderColor: formData.paymentMethod === 'jazzcash' ? '#f97316' : '#e5e7eb',
          }}
        >
          <input
            type="radio"
            name="payment"
            value="jazzcash"
            checked={formData.paymentMethod === 'jazzcash'}
            onChange={(e) => onPaymentChange(e.target.value)}
            className="w-4 h-4 text-orange-600"
            disabled
          />
          <div className="ml-4 flex-1">
            <p className="font-semibold text-gray-900">JazzCash</p>
            <p className="text-sm text-gray-600">Coming soon</p>
          </div>
          <span className="text-2xl">📱</span>
        </label>

        {/* Easypaisa */}
        <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition hover:bg-orange-50 opacity-60"
          style={{
            borderColor: formData.paymentMethod === 'easypaisa' ? '#f97316' : '#e5e7eb',
          }}
        >
          <input
            type="radio"
            name="payment"
            value="easypaisa"
            checked={formData.paymentMethod === 'easypaisa'}
            onChange={(e) => onPaymentChange(e.target.value)}
            className="w-4 h-4 text-orange-600"
            disabled
          />
          <div className="ml-4 flex-1">
            <p className="font-semibold text-gray-900">Easypaisa</p>
            <p className="text-sm text-gray-600">Coming soon</p>
          </div>
          <span className="text-2xl">💳</span>
        </label>
      </div>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          ℹ️ JazzCash and Easypaisa integration coming soon. For now, please use Cash on Delivery.
        </p>
      </div>
    </div>
  );
}

function OrderConfirmation({ onClose }: { onClose: () => void }) {
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const lastOrder = localStorage.getItem('lastOrder');
    if (lastOrder) {
      setOrder(JSON.parse(lastOrder));
    }
  }, []);

  if (!order) {
    return (
      <div className="p-6 sm:p-8 text-center">
        <p className="text-gray-600">Loading order details...</p>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">✓</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
        <p className="text-gray-600">Your delicious meal is being prepared</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Order ID</p>
            <p className="text-lg font-bold text-gray-900">{order.id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="text-lg font-bold text-orange-600">Rs. {order.totalAmount}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Estimated Delivery Time</p>
            <p className="text-lg font-bold text-gray-900">30-45 minutes</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Payment Method</p>
            <p className="text-lg font-bold text-gray-900 capitalize">
              {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Link
          href="/orders"
          className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition text-center block"
        >
          Track Order
        </Link>
        <button
          onClick={onClose}
          className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
