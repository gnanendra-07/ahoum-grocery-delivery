import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, ArrowRight, CheckCircle2, Home, Briefcase, Plus } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';

export const LocationSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, setActiveAddress, setCustomLocation } = useAuthStore();

  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    user?.activeAddressId || user?.addresses[0]?.id || 'addr-1'
  );
  const [showAddCustom, setShowAddCustom] = useState<boolean>(false);
  const [label, setLabel] = useState<string>('Home');
  const [street, setStreet] = useState<string>('');
  const [city, setCity] = useState<string>('Springfield');
  const [zipCode, setZipCode] = useState<string>('97477');

  const handleConfirm = () => {
    if (showAddCustom && street.trim()) {
      setCustomLocation(label, street.trim(), city, zipCode);
    } else if (selectedAddressId) {
      setActiveAddress(selectedAddressId);
    }
    navigate('/');
  };

  return (
    <div className="max-w-md mx-auto min-h-screen sm:min-h-[80vh] flex flex-col justify-between p-6 bg-white sm:rounded-3xl border border-gray-100 shadow-md space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full">
          Final Step
        </span>
        <h1 className="text-2xl font-black text-gray-900 pt-1">Select Delivery Location</h1>
        <p className="text-xs text-gray-500">
          Where should we deliver your 10-minute fresh groceries?
        </p>
      </div>

      {/* Map Illustration Placeholder */}
      <div className="bg-gradient-to-br from-brand-50 to-emerald-50 p-4 rounded-2xl border border-brand-100 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-md flex-shrink-0">
          <Navigation className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <span className="text-xs font-bold text-gray-900 block">Detecting Express Delivery Zone</span>
          <span className="text-[11px] text-brand-700 font-medium">10-Minute Dark Store Active in Springfield</span>
        </div>
      </div>

      {/* Address Selection List */}
      <div className="space-y-3 my-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Saved Addresses</span>

        {user?.addresses.map((addr) => {
          const isSelected = selectedAddressId === addr.id && !showAddCustom;
          const Icon = addr.label.toLowerCase().includes('work') ? Briefcase : Home;

          return (
            <div
              key={addr.id}
              onClick={() => {
                setSelectedAddressId(addr.id);
                setShowAddCustom(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedAddressId(addr.id);
                  setShowAddCustom(false);
                }
              }}
              role="button"
              tabIndex={0}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start justify-between gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                isSelected
                  ? 'border-brand-500 bg-brand-50/50 shadow-sm'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl mt-0.5 ${isSelected ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-900 block">{addr.label}</span>
                  <p className="text-[11px] text-gray-500 leading-snug">
                    {addr.street}, {addr.city} - {addr.zipCode}
                  </p>
                </div>
              </div>

              {isSelected && <CheckCircle2 className="w-5 h-5 text-brand-600 fill-brand-100 flex-shrink-0" />}
            </div>
          );
        })}

        {/* Custom Address Toggle / Input */}
        {!showAddCustom ? (
          <button
            onClick={() => setShowAddCustom(true)}
            className="w-full py-3 px-4 border border-dashed border-gray-300 hover:border-brand-400 text-gray-600 hover:text-brand-600 text-xs font-bold rounded-2xl transition-colors flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            type="button"
          >
            <Plus className="w-4 h-4" /> Add New Custom Delivery Address
          </button>
        ) : (
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3 text-xs">
            <span className="font-bold text-gray-800 block">New Address Details</span>
            <div className="flex gap-2">
              <select
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                aria-label="Address label"
                className="bg-white border border-gray-200 text-xs font-bold text-gray-900 rounded-xl px-2 py-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                <option value="Home">Home</option>
                <option value="Work">Work</option>
                <option value="Other">Other</option>
              </select>
              <input
                type="text"
                placeholder="Street Address (e.g. 123 Main St)"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="flex-1 p-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              />
              <input
                type="text"
                placeholder="Zip Code"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Confirm Action */}
      <div className="pt-2 border-t border-gray-100">
        <button
          onClick={handleConfirm}
          className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          type="button"
        >
          <MapPin className="w-4 h-4" />
          <span>Confirm Location & Start Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
