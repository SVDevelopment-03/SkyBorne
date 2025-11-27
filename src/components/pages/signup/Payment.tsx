import { useState } from 'react';
import { PackageType } from './PackageSelection'; 
import { ChevronLeft, CreditCard, Smartphone, Lock } from 'lucide-react';

interface PaymentProps {
  selectedPackage: PackageType;
  onPayment: (autoRenew: boolean) => void;
  onBack: () => void;
}

const getPackagePrice = (pkg: PackageType): number => {
  const prices = {
    'gold-yoga': 100,
    'gold-zumba': 100,
    'gold-mixed': 100,
    'diamond': 200,
    'platinum': 300
  };
  return prices[pkg];
};

export function Payment({ selectedPackage, onPayment, onBack }: PaymentProps) {
  const [autoRenew, setAutoRenew] = useState(false);
  const price = getPackagePrice(selectedPackage);

  const handlePayment = () => {
    onPayment(autoRenew);
  };

  return (
    <div className="animate-fade-in">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-[#b97d9f] mb-6 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
        Back
      </button>

      <div className="text-center mb-12">
        <h1 className="mb-3 text-gray-800">Complete Your Payment</h1>
        <p className="text-gray-600">Payments are secure and encrypted.</p>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Lock className="w-4 h-4 text-[#8b6f47]" />
          <span className="text-sm text-gray-600">256-bit SSL Encryption</span>
        </div>

        <div className="bg-[#fef9f3] rounded-2xl p-8 shadow-sm border border-[#f0e5d8] mb-6">
          {/* Payment Methods */}
          <div className="mb-8">
            <h3 className="text-sm text-gray-700 mb-4">Payment Method</h3>
            
            <div className="space-y-3">
              <div className="Payment_Primary_Button bg-[#fcf6ef] border-2 border-[#b97d9f] rounded-xl p-5 cursor-pointer hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full border-2 border-[#b97d9f] bg-[#b97d9f] flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full" />
                  </div>
                  <CreditCard className="w-5 h-5 text-[#b97d9f]" />
                  <span className="text-gray-900">Credit / Debit Card</span>
                </div>
                
                {/* Card Input Fields */}
                <div className="mt-4 space-y-3">
                  <input
                    type="text"
                    placeholder="Card Number"
                    className="w-full px-4 py-3 bg-white border border-[#e8d4c0] rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#b97d9f] transition-colors"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="px-4 py-3 bg-white border border-[#e8d4c0] rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#b97d9f] transition-colors"
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      className="px-4 py-3 bg-white border border-[#e8d4c0] rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#b97d9f] transition-colors"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Cardholder Name"
                    className="w-full px-4 py-3 bg-white border border-[#e8d4c0] rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#b97d9f] transition-colors"
                  />
                </div>
              </div>

              <div className="bg-gray-100 border-2 border-gray-200 rounded-xl p-5 opacity-60 cursor-not-allowed">
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                  <Smartphone className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">Digital Wallet</span>
                  <span className="ml-auto text-sm text-gray-500">(coming soon)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Auto-Renew Checkbox */}
          <div className="border-t border-[#f0e5d8] pt-6 mb-6">
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={autoRenew}
                  onChange={(e) => setAutoRenew(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                    autoRenew
                      ? 'bg-[#b97d9f] border-[#b97d9f]'
                      : 'bg-white border-gray-300 group-hover:border-[#b97d9f]'
                  }`}
                >
                  {autoRenew && (
                    <svg className="w-4 h-4 text-white" viewBox="0 0 12 10" fill="none">
                      <path
                        d="M1 5L4.5 8.5L11 1.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <span className="text-sm text-gray-800">Enable auto-renew</span>
                <p className="text-xs text-gray-600 mt-1">Your subscription will automatically renew each month. Cancel anytime.</p>
              </div>
            </label>
          </div>

          {/* Total */}
          <div className="bg-[#b97d9f] text-white rounded-xl p-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm opacity-90">Total Amount</span>
              <span className="text-xs opacity-75">Due today</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-2xl">${price}.00</span>
              <span className="text-sm opacity-90">/month</span>
            </div>
          </div>
        </div>

        <button
          onClick={handlePayment}
          className="Payment_Primary_Button w-full bg-[#b97d9f] hover:bg-[#a16685] text-white py-4 px-8 rounded-full transition-all duration-300 text-lg shadow-lg"
        >
          Pay Now
        </button>

        <p className="text-center text-xs text-gray-500 mt-4">
          {`By clicking "Pay Now", you agree to our Terms of Service and Privacy Policy`}
        </p>
      </div>
    </div>
  );
}
