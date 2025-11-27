import { PackageType } from './PackageSelection'; 
import { ChevronLeft, Check } from 'lucide-react';

interface ReviewConfirmProps {
  selectedPackage: PackageType;
  onConfirm: () => void;
  onBack: () => void;
}

const getPackageInfo = (pkg: PackageType) => {
  const packages = {
    'gold-yoga': {
      name: 'Gold Package',
      details: '2 Yoga',
      price: 100
    },
    'gold-zumba': {
      name: 'Gold Package',
      details: '2 Zumba',
      price: 100
    },
    'gold-mixed': {
      name: 'Gold Package',
      details: 'Mixed (1 Yoga + 1 Zumba)',
      price: 100
    },
    'diamond': {
      name: 'Diamond Package',
      details: '2 Yoga + 2 Zumba',
      price: 200
    },
    'platinum': {
      name: 'Platinum Package',
      details: '2 Yoga + 2 Zumba + 1 Specialized',
      price: 300
    }
  };
  return packages[pkg];
};

export function ReviewConfirm({ selectedPackage, onConfirm, onBack }: ReviewConfirmProps) {
  const packageInfo = getPackageInfo(selectedPackage);

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
        <h1 className="mb-3 text-gray-800">Review Your Selection</h1>
        <p className="text-gray-600">Make sure everything looks correct.</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-[#fef9f3] rounded-2xl p-8 shadow-sm border border-[#f0e5d8] mb-8">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[#f0e5d8]">
            <div className="w-12 h-12 rounded-full bg-[#b97d9f] flex items-center justify-center">
              <Check className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg text-gray-800">Selected Plan</h3>
              <p className="text-sm text-gray-600">Your wellness membership</p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center py-3 px-4 bg-[#fcf6ef] rounded-xl">
              <span className="text-gray-600">Plan:</span>
              <span className="text-gray-900">{packageInfo.name}</span>
            </div>

            <div className="flex justify-between items-start py-3 px-4 bg-[#fcf6ef] rounded-xl">
              <span className="text-gray-600">Includes:</span>
              <span className="text-gray-900 text-right">{packageInfo.details}</span>
            </div>

            <div className="flex justify-between items-center py-3 px-4 bg-[#fcf6ef] rounded-xl">
              <span className="text-gray-600">Billing Cycle:</span>
              <span className="text-gray-900">Monthly</span>
            </div>

            <div className="flex justify-between items-center py-4 px-4 bg-[#b97d9f] text-white rounded-xl">
              <span className="text-lg">Total:</span>
              <span className="text-2xl">${packageInfo.price}</span>
            </div>
          </div>

          <div className="bg-[#fcf6ef] rounded-xl p-4 border border-[#e8d4c0]">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-[#b97d9f] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-white" />
              </div>
              <div className="text-sm text-gray-700">
                <p className="mb-1">17% discount already applied to this plan</p>
                <p className="text-xs text-gray-600">{`You're getting the best value for your wellness journey`}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onBack}
            className="flex-1 bg-white border-2 border-[#d4a5bc] hover:border-[#b97d9f] text-gray-700 py-3 px-6 rounded-full transition-all"
          >
            Change Package
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-[#b97d9f] hover:bg-[#a16685] text-white py-3 px-6 rounded-full transition-all duration-300"
          >
            Confirm & Continue
          </button>
        </div>
      </div>
    </div>
  );
}
