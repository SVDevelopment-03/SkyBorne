"use client";
import useGetUser from "@/hooks/useGetUser";
import { useState } from "react";
import { SelectedPlanMeta, UpgradePlan } from "./UpgradePlan";
import { ReviewConfirm } from "@/components/pages/auth/signup/ReviewConfirm";
import { Payment } from "@/components/pages/auth/signup/Payment";
import { Confirmation } from "@/components/pages/auth/signup/Confirmation";
import { useUpgradePlanOrderMutation } from "@/store/api/paymentApi";
import toast from "react-hot-toast";
import { PackageType } from "@/components/pages/auth/signup/PackageSelection";

interface CheckoutState {
  selectedPackage: string | null;
  autoRenew: boolean;
}

const Page = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [billingType, setBillingType] = useState<"monthly" | "yearly">(
    "monthly",
  );
  const [selectedPlanData, setSelectedPlanData] =
    useState<SelectedPlanMeta | null>(null);
  const [state, setState] = useState<CheckoutState>({
    selectedPackage: null as string | null,
    autoRenew: false,
  });
  const { user } = useGetUser();

  const [upgradePlanOrder, { isLoading }] = useUpgradePlanOrderMutation();
  const price =
    billingType === "yearly"
      ? selectedPlanData?.yearlyPrice || 0
      : selectedPlanData?.monthlyPrice || 0;

  const handlePaymentTransaction = async () => {
    try {
      const response = await upgradePlanOrder({
        amount: price,
        currency: "USD",
        userId: user?.id,
        plan: selectedPlanData?.planKey || state.selectedPackage,
        billingType: billingType,
      }).unwrap();

      if (response?.checkoutUrl) {
        window.location.assign(response.checkoutUrl);
        return;
      }

      toast.success("Plan upgraded successfully");
      goToStep(4);
    } catch (err) {
      toast.error("Plan upgrade failed");
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
        <UpgradePlan
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
