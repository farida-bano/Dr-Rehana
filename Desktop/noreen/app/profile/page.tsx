'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Plus, Trash2, MapPin, Phone, Mail } from 'lucide-react';
import { AddressForm } from '@/components/address-form';

interface Address {
  id: string;
  street: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
}

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      fetchAddresses();
    }
  }, [isLoaded, user]);

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
      setIsLoading(false);
    }
  };

  if (!isLoaded) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please sign in to view your profile</p>
      </div>
    );
  }

  const handleAddAddress = async (data: { street: string; city: string; postalCode: string; isDefault?: boolean }) => {
    try {
      const method = editingAddress ? 'PUT' : 'POST';
      const endpoint = editingAddress ? `/api/addresses/${editingAddress.id}` : '/api/addresses';

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        await fetchAddresses();
        setShowAddressForm(false);
        setEditingAddress(null);
      }
    } catch (error) {
      console.error('Error saving address:', error);
      alert('Failed to save address');
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      const response = await fetch(`/api/addresses/${id}`, { method: 'DELETE' });
      if (response.ok) {
        await fetchAddresses();
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      alert('Failed to delete address');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const response = await fetch(`/api/addresses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDefault: true }),
      });

      if (response.ok) {
        await fetchAddresses();
      }
    } catch (error) {
      console.error('Error setting default address:', error);
      alert('Failed to set default address');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h1>
              <div className="space-y-1 mt-2 text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{user.emailAddresses[0]?.emailAddress}</span>
                </div>
                {user.phoneNumbers[0]?.phoneNumber && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{user.phoneNumbers[0].phoneNumber}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Addresses */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Delivery Addresses</h2>
            <button
              onClick={() => {
                setEditingAddress(null);
                setShowAddressForm(true);
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition"
            >
              <Plus className="w-5 h-5" />
              Add Address
            </button>
          </div>

          {/* Address Form */}
          {showAddressForm && (
            <div className="mb-8 p-6 bg-orange-50 rounded-lg border-2 border-orange-200">
              <AddressForm
                initialData={editingAddress || undefined}
                onSubmit={handleAddAddress}
                onCancel={() => {
                  setShowAddressForm(false);
                  setEditingAddress(null);
                }}
              />
            </div>
          )}

          {/* Addresses List */}
          <div className="space-y-4">
            {addresses.length === 0 ? (
              <p className="text-gray-600 text-center py-8">
                No addresses saved yet. Add one to get started!
              </p>
            ) : (
              addresses.map((address) => (
                <div
                  key={address.id}
                  className={`p-6 rounded-lg border-2 transition ${
                    address.isDefault
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 bg-white hover:border-orange-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-5 h-5 text-orange-600" />
                        <h3 className="font-semibold text-gray-900">
                          {address.city}
                        </h3>
                        {address.isDefault && (
                          <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 ml-7">{address.street}</p>
                      <p className="text-gray-600 ml-7">{address.postalCode}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {!address.isDefault && (
                        <button
                          onClick={() => handleSetDefault(address.id)}
                          className="px-3 py-1 text-sm border border-orange-600 text-orange-600 rounded hover:bg-orange-50 transition"
                        >
                          Set Default
                        </button>
                      )}
                      <button
                        onClick={() => setEditingAddress(address)}
                        className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAddress(address.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
