import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../stores/useCartStore';
import { useAuthStore } from '../stores/useAuthStore';
import { PaymentMethod } from '../types';
import { formatCurrency } from '../utils/formatters';
import { MapPin, CreditCard, Smartphone, Banknote, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, getSubtotal, getTaxAmount, deliveryFee, getTotalAmount, clearCart } = useCartStore();
  const { user, activeAddress, setActiveAddress, isSimulatingFailures } = useAuthStore();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const subtotal = getSubtotal();
  const tax = getTaxAmount();
  const total = getTotalAmount();

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 900));

      if (isSimulatingFailures && Math.random() < 0.5) {
        throw new Error('Payment authorization failed due to network timeout.');
      }

      clearCart();
      navigate('/checkout/success', {
        state: {
          orderId: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
          total,
          itemCount: items.reduce((s, i) => s + i.quantity, 0),
          address: activeAddress,
          paymentMethod,
        },
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Transaction failed.';
      navigate('/checkout/failure', {
        state: {
          errorMessage,
          paymentMethod,
          total,
        },
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2.5 bg-white rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          type="button"
          aria-label="Go back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Checkout</h1>
      </div>

      {/* Desktop 2-Column Grid */}
      <div className="md:grid md:grid-cols-3 md:gap-8 md:items-start space-y-6 md:space-y-0">
        {/* Left Column (2 cols): Delivery Address & Payment Options */}
        <div className="md:col-span-2 space-y-6">
          {/* Delivery Address Box */}
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-brand-600" />
              Select Delivery Address
            </h3>

            {user && user.addresses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {user.addresses.map((addr) => {
                  const isSelected = activeAddress?.id === addr.id;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => setActiveAddress(addr.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-colors flex items-start justify-between gap-3 ${
                        isSelected
                          ? 'border-brand-500 bg-brand-50/40'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-gray-900">{addr.label}</span>
                          {addr.isDefault && (
                            <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {addr.street}, {addr.apartment && `${addr.apartment}, `}{addr.city} - {addr.zipCode}
                        </p>
                      </div>

                      <div className="mt-0.5">
                        {isSelected ? (
                          <CheckCircle2 className="w-5 h-5 text-brand-600 fill-brand-100" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-gray-300" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-red-500">No address available.</p>
            )}
          </div>

          {/* Payment Options */}
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Payment Method</h3>

            <div className="space-y-3">
              {/* UPI */}
              <label
                onClick={() => setPaymentMethod('upi')}
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-colors ${
                  paymentMethod === 'upi'
                    ? 'border-brand-500 bg-brand-50/50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <Smartphone className="w-6 h-6 text-brand-600" />
                  <div>
                    <span className="text-sm font-bold text-gray-900 block">UPI / GPay / PhonePe</span>
                    <span className="text-xs text-gray-500">Instant express approval</span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'upi'}
                  onChange={() => setPaymentMethod('upi')}
                  className="accent-brand-600 w-4 h-4"
                />
              </label>

              {/* Card */}
              <label
                onClick={() => setPaymentMethod('card')}
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-colors ${
                  paymentMethod === 'card'
                    ? 'border-brand-500 bg-brand-50/50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <CreditCard className="w-6 h-6 text-brand-600" />
                  <div>
                    <span className="text-sm font-bold text-gray-900 block">Credit / Debit Card</span>
                    <span className="text-xs text-gray-500">Visa, Mastercard, RuPay</span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="accent-brand-600 w-4 h-4"
                />
              </label>

              {/* COD */}
              <label
                onClick={() => setPaymentMethod('cod')}
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-colors ${
                  paymentMethod === 'cod'
                    ? 'border-brand-500 bg-brand-50/50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <Banknote className="w-6 h-6 text-brand-600" />
                  <div>
                    <span className="text-sm font-bold text-gray-900 block">Cash on Delivery</span>
                    <span className="text-xs text-gray-500">Pay cash upon 10-min arrival</span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="accent-brand-600 w-4 h-4"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Order Summary & Action Button */}
        <div className="md:col-span-1 md:sticky md:top-24 space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-3 text-xs sm:text-sm">
            <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-3 text-sm">
              Order Summary
            </h3>
            <div className="flex justify-between text-gray-600">
              <span>Items ({items.length})</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Express Delivery</span>
              <span>{formatCurrency(deliveryFee)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Taxes (5%)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-gray-900 pt-3 border-t border-gray-100">
              <span>Grand Total</span>
              <span className="text-brand-600">{formatCurrency(total)}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={isProcessing}
            className="w-full py-4 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            type="button"
          >
            {isProcessing ? (
              <span>Authorizing Order...</span>
            ) : (
              <>
                <span>Pay & Place Order ({formatCurrency(total)})</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
