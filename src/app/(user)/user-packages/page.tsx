"use client";
import {
  PackageSelection,
  PackageType,
} from "@/components/pages/auth/signup/PackageSelection";
import { CheckoutState } from "@/components/pages/auth/signup/Step7Package";
import { useState } from "react";

const Page = () => {
  const [state, setState] = useState<CheckoutState>({
    selectedPackage: null,
    autoRenew: false,
  });

  const updateState = (updates: Partial<CheckoutState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const handlePackageSelect = (packageType: PackageType) => {
    updateState({ selectedPackage: packageType });
  };

  return (
    <div>
      <PackageSelection onSelect={handlePackageSelect} />
    </div>
  );
};

export default Page;
