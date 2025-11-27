import { useState } from 'react';
import { PackageSelection } from './PackageSelection'; 
import { ReviewConfirm } from './ReviewConfirm'; 
import { Payment } from './Payment'; 
import { Confirmation } from './Confirmation'; 

export type PackageType = 'gold-yoga' | 'gold-zumba' | 'gold-mixed' | 'diamond' | 'platinum';

export interface CheckoutState {
  selectedPackage: PackageType | null;
  autoRenew: boolean;
}

export default function Step7Packages() {
  const [currentStep, setCurrentStep] = useState(1);
  const [state, setState] = useState<CheckoutState>({
    selectedPackage: null,
    autoRenew: false
  });

  const updateState = (updates: Partial<CheckoutState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const handlePackageSelect = (packageType: PackageType) => {
    updateState({ selectedPackage: packageType });
    goToStep(2);
  };

  const handleReviewConfirm = () => {
    goToStep(3);
  };

  const handlePayment = (autoRenew: boolean) => {
    updateState({ autoRenew });
    goToStep(4);
  };

  const totalSteps = 4;

  return (
    <div className="">
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {currentStep === 1 && (
          <PackageSelection onSelect={handlePackageSelect} />
        )}
        
        {currentStep === 2 && (
          <ReviewConfirm 
            selectedPackage={state.selectedPackage!}
            onConfirm={handleReviewConfirm}
            onBack={() => goToStep(1)}
          />
        )}
        
        {currentStep === 3 && (
          <Payment
            selectedPackage={state.selectedPackage!}
            onPayment={handlePayment}
            onBack={() => goToStep(2)}
          />
        )}
        
        {currentStep === 4 && (
          <Confirmation />
        )}
      </main>
    </div>
  );
}