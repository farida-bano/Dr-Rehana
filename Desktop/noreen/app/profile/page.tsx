'use client';

import { useState } from 'react';
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
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      street: '123 Main Street, Apt 4B',
      city: 'Karachi',
      postalCode: '75500',
      isDefault: true,
    },
  ]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

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

  const handleAddAddress = (data: { street: string; city: string; postalCode: string; isDefault?: boolean }) => {
    const address: Address = {
      id: editingAddress?.id || Date.now().toString(),
      street: data.street,
      city: data.city,
      postalCode: data.postalCode,
      isDefault: data.isDefault || false,
    };

    if (editingAddress) {
      setAddresses(
        addresses.map((a) =>
          a.id === editingAddress.id ? address : a
        )
      );
      setEditingAddress(null);
    } else {
      setAddresses([...addresses, address]);
    }
    setShowAddressForm(false);
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter((a) => a.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setAddresses(
      addresses.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
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
