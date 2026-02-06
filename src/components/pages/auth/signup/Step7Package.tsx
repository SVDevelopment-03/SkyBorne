"use client";
import {
  PackageSelection,
  PackageType,
} from "@/components/pages/auth/signup/PackageSelection";
import useGetUser from "@/hooks/useGetUser";
import { useState } from "react";
import { ReviewConfirm } from "@/components/pages/auth/signup/ReviewConfirm";
import { Payment } from "@/components/pages/auth/signup/Payment";
import { Confirmation } from "@/components/pages/auth/signup/Confirmation";
import { useCreatePaymentOrderMutation } from "@/store/api/paymentApi";
import toast from "react-hot-toast";

export interface CheckoutState {
  selectedPackage: PackageType | null;
  autoRenew: boolean;
}

const Page = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [billingType, setBillingType] = useState<"monthly" | "yearly">("monthly");
  const [state, setState] = useState<CheckoutState>({
    selectedPackage: null,
    autoRenew: false,
  });
  const { user } = useGetUser();
  
  const getPackagePrice = (pkg: PackageType, billing: "monthly" | "yearly" = "monthly"): number => {
    const monthlyPrices = {
      "gold-yoga": 100,
      "gold-zumba": 100,
      "gold-mixed": 100,
      diamond: 200,
      platinum: 300,
    };
    const basePrice = monthlyPrices[pkg];
    return billing === "yearly" ? Math.round(basePrice * 12 * 0.95) : basePrice;
  };

  const [createPaymentOrder, { isLoading }] = useCreatePaymentOrderMutation();
  const price = getPackagePrice(state.selectedPackage!, billingType);

  const handlePaymentTransaction = async () => {
    try {
      const res = await createPaymentOrder({
        amount: price,
        currency: "USD",
        userId: user?.id,
        plan: state.selectedPackage,
        billingType: billingType,
      }).unwrap();

      localStorage.setItem("orderRef", res?.orderRef);

      setTimeout(() => {
        window.location.href = res.paymentLink;
      }, 100);
    } catch (err) {
      toast.error("Paymnent order failed");
      console.error(err);
    }
  };

  const updateState = (updates: Partial<CheckoutState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const handlePackageSelect = (packageType: PackageType) => {
    updateState({ selectedPackage: packageType });
    goToStep(2);
  };

  const handleReviewConfirm = () => {
    handlePaymentTransaction();
  };

  const handlePayment = (autoRenew: boolean) => {
    updateState({ autoRenew });
    goToStep(4);
  };

  return (
    <div className="p-[30px]">
      {currentStep === 1 && (
        <PackageSelection
          onSelect={handlePackageSelect}
          currentPlan={user?.plan}
          expiryDate={user?.subscription?.endDate}
          subscription={user?.subscription}
          classCredits={user?.classCredits}
          totalClassCredits={user?.totalClassCredits}
          onBillingTypeChange={setBillingType}
        />
      )}
      {currentStep === 2 && (
        <ReviewConfirm
          selectedPackage={state.selectedPackage!}
          onConfirm={handleReviewConfirm}
          isLoading={isLoading}
          onBack={() => goToStep(1)}
          billingType={billingType}
        />
      )}

      {currentStep === 3 && (
        <Payment
          selectedPackage={state.selectedPackage!}
          onPayment={handlePayment}
          onBack={() => goToStep(2)}
          billingType={billingType}
        />
      )}

      {currentStep === 4 && <Confirmation />}
    </div>
  );
};

export default Page;




