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
import { SelectedPlanMeta, UpgradePlan } from "@/app/(user)/user-packages/UpgradePlan";

export interface CheckoutState {
  selectedPackage: string | null;
  autoRenew: boolean;
}

const Page = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [billingType, setBillingType] = useState<"monthly" | "yearly">("monthly");
  const [selectedPlanData, setSelectedPlanData] =
    useState<SelectedPlanMeta | null>(null);
  const [state, setState] = useState<CheckoutState>({
    selectedPackage: null,
    autoRenew: false,
  });
  const { user } = useGetUser();

  const [createPaymentOrder, { isLoading }] = useCreatePaymentOrderMutation();
  const price =
    billingType === "yearly"
      ? selectedPlanData?.yearlyPrice || 0
      : selectedPlanData?.monthlyPrice || 0;
  const handlePaymentTransaction = async () => {
    try {
      const res = await createPaymentOrder({
        amount: price,
        currency: "USD",
        userId: user?.id,
        plan: selectedPlanData?.planKey || state.selectedPackage,
        billingType: billingType,
      }).unwrap();

      localStorage.setItem("orderRef", res?.orderRef);
      localStorage.setItem("paymentAmount", String(price));
      localStorage.setItem("paymentCurrency", "USD");

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

  const handlePackageSelect = (packageType: string) => {
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
          onSelectPlanData={setSelectedPlanData}
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
          selectedPackage={state.selectedPackage || ""}
          selectedPlanData={selectedPlanData}
          onConfirm={handleReviewConfirm}
          isLoading={isLoading}
          onBack={() => goToStep(1)}
          billingType={billingType}
        />
      )}

      {currentStep === 3 && (
        <Payment
          selectedPackage={state.selectedPackage as unknown as PackageType}
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

