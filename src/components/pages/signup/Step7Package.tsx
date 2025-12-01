import { useState } from 'react';
import { PackageSelection } from './PackageSelection'; 
import { ReviewConfirm } from './ReviewConfirm'; 
import { Payment } from './Payment'; 
import { Confirmation } from './Confirmation'; 
import useGetUser from '@/hooks/useGetUser';
import { useCreatePaymentOrderMutation } from '@/store/api/paymentApi';

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
    const {user} = useGetUser(); 
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

const [createPaymentOrder,{isLoading}] = useCreatePaymentOrderMutation();
  const price = getPackagePrice(state.selectedPackage!);


const handlePaymentTransaction = async () => {
  try {
    const res = await createPaymentOrder({
      amount: price,
      currency: "USD",
      userId: user?.id ,
       plan: state.selectedPackage 
    }).unwrap();

    setTimeout(() => {
      
      window.location.href = res.paymentLink;
    }, 6000);

  } catch (err) {
    console.error(err);
  }
};

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
  handlePaymentTransaction()
    
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
            isLoading={isLoading}
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