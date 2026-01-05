import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Check, Package } from "lucide-react";
import { useState } from "react";

export type PackageType =
  | "gold-yoga"
  | "gold-zumba"
  | "gold-mixed"
  | "diamond"
  | "platinum";

interface Subscription {
  startDate: string | Date;
  endDate: string | Date;
  status: "active" | "inactive" | "cancelled";
  _id?: string;
}

interface ClassCredits {
  yoga: number;
  zumba: number;
  specialty: number;
  _id?: string;
}

interface PackageSelectionProps {
  onSelect: (packageType: PackageType) => void;
  currentPlan: PackageType;
  expiryDate: Date;
  subscription: Subscription;
  totalClassCredits: number;
  classCredits: ClassCredits;
}

interface GoldOption {
  id: PackageType;
  label: string;
  description: string;
}

// Total classes included in each plan
const PLAN_CONFIG = {
  "gold-yoga": { yoga: 2, zumba: 0, specialty: 0, total: 2 },
  "gold-zumba": { yoga: 0, zumba: 2, specialty: 0, total: 2 },
  "gold-mixed": { yoga: 1, zumba: 1, specialty: 0, total: 2 },
  "diamond": { yoga: 2, zumba: 2, specialty: 0, total: 4 },
  "platinum": { yoga: 2, zumba: 2, specialty: 1, total: 5 },
};

const goldOptions: GoldOption[] = [
  {
    id: "gold-yoga",
    label: "2 Yoga",
    description: "",
  },
  {
    id: "gold-zumba",
    label: "2 Zumba",
    description: "",
  },
  {
    id: "gold-mixed",
    label: "Mixed",
    description: "(1 Yoga + 1 Zumba)",
  },
];

const formatDate = (date: string | Date): string => {
  if (!date) return "N/A";
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const currentPlanIds = ["gold-yoga", "gold-zumba", "gold-mixed"];

// Calculate total remaining classes from classCredits
const calculateTotalRemainingClasses = (classCredits: ClassCredits): number => {
  return (classCredits?.yoga || 0) + (classCredits?.zumba || 0) + (classCredits?.specialty || 0);
};

// Get total classes from current plan
const getTotalClassesFromPlan = (plan: PackageType): number => {
  return PLAN_CONFIG[plan]?.total || 0;
};

// Calculate used classes
const calculateUsedClasses = (plan: PackageType, classCredits: ClassCredits): number => {
  const total = getTotalClassesFromPlan(plan);
  const remaining = calculateTotalRemainingClasses(classCredits);
  return Math.max(0, total - remaining);
};

export function UpgradePlan({ onSelect, currentPlan, expiryDate ,subscription,classCredits,totalClassCredits}: PackageSelectionProps) {
  const isCurrentGoldPlan = currentPlanIds?.includes(currentPlan);
  const isDiamondPlan = currentPlan?.toLowerCase() === "diamond";
  const isPlatinumPlan = currentPlan?.toLowerCase() === "platinum";

  const [selectedGoldOption, setSelectedGoldOption] = useState<PackageType | null>(
    isCurrentGoldPlan ? currentPlan : null
  );

  const handleGoldSelect = () => {
    if (selectedGoldOption) {
      onSelect(selectedGoldOption);
    }
  };

  // Calculate classes from classCredits
  const totalSessionsIncluded = totalClassCredits;
  const sessionsRemaining = calculateTotalRemainingClasses(classCredits);
  const sessionsUsed = calculateUsedClasses(currentPlan, classCredits);

  const renewalDate = formatDate(subscription?.endDate);
  const subscriptionStatus = subscription?.status || "inactive";


  return (
    <div>
     <div className="py-4">
        <h1 className="text-3xl text-[#1A1A1A] mb-2 font-satoshi-700">My Packages</h1>
        <p className="text-[#6B6B6B] font-satoshi-400">Manage your subscription and explore upgrade options</p>
      </div>

      {/* Current Package */}
<Card
        className="border-none"
        style={{
          borderRadius: "30px",
          background: "#B95E82",
          marginBottom: "16px",
        }}
      >
        <CardContent className="p-8 py-2">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-white">
            <div className="flex items-start gap-4 w-full">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Package className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 flex items-center w-full">
                <div>

                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-2xl capitalize">{currentPlan?.replace("-", " ")}</h2>
                  <Badge
                    className="bg-white/20 text-white backdrop-blur-sm py-1!"
                    style={{ borderRadius: "8px" }}
                  >
                    {subscriptionStatus === "active" ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <p className="text-white/90 mb-4">Monthly Subscription</p>
                </div>
                <div className="space-y-2 ml-auto">
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    <span>
                      {sessionsRemaining} of {totalSessionsIncluded} sessions remaining
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>Renews on {renewalDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-satoshi-500 text-[16px] text-white/90">Session Usage</span>
              <span className="text-white/90">{totalSessionsIncluded - sessionsRemaining}/{totalSessionsIncluded} used</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3 backdrop-blur-sm">
              <div
                className="h-full bg-white rounded-full font-satoshi-500 text-[16px]"
                style={{
                  width: `${((totalSessionsIncluded - sessionsRemaining) / totalSessionsIncluded) * 100}%`,
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

    <div className="animate-fade-in overflow-y-auto">
      <div className="text-center mb-12 mt-4">
        <h1 className="mb-3 text-gray-800">Upgrade Your Plan</h1>
        <p className="text-gray-600">
          Select a membership that fits your wellness goals.
        </p>
      </div>

      <div
        className="grid grid-cols-[1fr_1fr_1fr]
  justify-start lg:justify-center gap-6 md:gap-10 mb-6 bg-white
  p-4 sm:p-6 md:p-12 rounded-xl"
      >
        {/* Gold Package Card with Radio Options */}
        <div className="relative min-h-[610px] Package_Card_Default bg-[#FFCFBD33] rounded-3xl p-8 shadow-sm border border-[#f0e5d8] max-h-[550px] h-[550px]">
          <div className="min-h-[450px]">
            <div className="mb-6">
              <div className="inline-block bg-white border border-[#e8d4c0] rounded-full px-5 py-2 mb-4">
                <span className="text-sm text-gray-700">🟡 Gold Package</span>
              </div>
              <h2 className="text-3xl text-gray-800 mb-2">
                $100 <span className="text-lg text-gray-600">/Month</span>
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Includes: 2 Classes per Month
              </p>
            </div>

            <div className="">
              <p className="text-sm text-gray-700 mb-3">Choose Class Type:</p>

              <div className="space-y-3 bg-[#fcf6ef] rounded-2xl p-4">
                {goldOptions.map((option) => (
                  <div
                    key={option.id}
                    onClick={() => setSelectedGoldOption(option.id)}
                    className={`cursor-pointer rounded-xl p-3 transition-all ${
                      selectedGoldOption === option.id
                        ? "bg-white border-2 border-[#b97d9f]"
                        : "bg-white/60 border-2 border-transparent hover:border-[#d4a5bc]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                          selectedGoldOption === option.id
                            ? "border-[#b97d9f] bg-[#b97d9f]"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedGoldOption === option.id && (
                          <div className="w-2.5 h-2.5 bg-white rounded-full" />
                        )}
                      </div>
                      <div className="flex-1">
                        <span className="text-sm text-gray-800">
                          {option.label} {option.description}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#fcf6ef] rounded-xl p-4 px-7 mb-6 text-xs lg:text-sm">
              <p className="text-gray-800">
                Original Value: <span className="line-through">$120</span> → You
                Pay <span className="text-[#b97d9f]">$100</span>
              </p>
            </div>
          </div>
          <div className="absolute bottom-2 right-1 w-full p-6">
            <button
              onClick={handleGoldSelect}
              disabled={!selectedGoldOption}
              className="w-full bg-[#B95E82] hover:bg-[#a16685] text-white py-3 px-6 rounded-full transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isCurrentGoldPlan ? "Current Plan" : "Select Gold Package"}
            </button>
          </div>
        </div>

        {/* Diamond Package Card */}
        <div className="relative min-h-[610px] Package_Card_Default bg-[#FFCFBD33] rounded-3xl p-8 shadow-sm border border-[#f0e5d8] max-h-[600px]  h-[550px]">
          <div className="min-h-[450px]">
            <div className="mb-6">
              <div className="inline-block bg-white border border-[#e8d4c0] rounded-full px-5 py-2 mb-4">
                <span className="text-sm text-gray-700">
                  💎 Diamond Package
                </span>
              </div>
              <h2 className="text-3xl text-gray-800 mb-2">
                $200 <span className="text-lg text-gray-600">/Month</span>
              </h2>
              <p className="text-sm text-gray-600 mb-4">Includes:</p>
            </div>

            <div className="bg-[#fcf6ef] rounded-2xl p-5 mb-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#b97d9f] shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-800">2 Yoga Classes</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#b97d9f] shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-800">2 Zumba Classes</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#fcf6ef] rounded-xl p-4 mb-6 text-sm">
              <p className="text-gray-800">
                Original Value: <span className="line-through">$240</span> → You
                Pay <span className="text-[#b97d9f]">$200</span>
              </p>
            </div>
          </div>
          <div className="absolute bottom-2 right-1 w-full p-6">
            <button
              onClick={() => onSelect("diamond")}
              className="w-full bg-[#B95E82] hover:bg-[#a16685] text-white py-3 px-6 rounded-full transition-all duration-300"
            >
              {isDiamondPlan ? "Current Plan" : "Select Diamond Package"}
            </button>
          </div>
        </div>

        {/* Platinum Package Card */}
        <div className="relative min-h-[610px] Package_Card_Default bg-[#B95E82] rounded-3xl p-8 shadow-lg text-white max-h-[600px]  h-[550px]">
          <div className="min-h-[450px]">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-[#b97d9f] px-4 py-1 rounded-full text-sm shadow-md">
              ⭐ Best Value
            </div>
            <div className="">
              <div className="mb-6 mt-2">
                <div className="inline-block bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-5 py-2 mb-4">
                  <span className="text-sm text-white">
                    🔷 Platinum Package
                  </span>
                </div>
                <h2 className="text-3xl mb-2">
                  $300 <span className="text-lg opacity-90">/Month</span>
                </h2>
                <p className="text-sm opacity-90 mb-4">Includes:</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 mb-6 border border-white/20">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 shrink-0 mt-0.5" />
                    <span className="text-sm">2 Yoga Classes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 shrink-0 mt-0.5" />
                    <span className="text-sm">2 Zumba Classes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 shrink-0 mt-0.5" />
                    <span className="text-sm">1 Specialized Class</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6 text-sm border border-white/20">
                <p>
                  Original Value:{" "}
                  <span className="line-through opacity-75">$360</span> → You
                  Pay <span className="font-medium">$300</span>
                </p>
              </div>
            </div>
            <div className="absolute bottom-2 right-1 w-full p-6">
              <button
                onClick={() => onSelect("platinum")}
                className="w-full  bg-white text-[#b97d9f] hover:bg-white/95 py-3 px-6 rounded-full transition-all duration-300"
              >
                {isPlatinumPlan ? "Current Plan" : "Select Platinum Package"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600">Flexible sessions. No lock-in.</p>
      </div>
    </div>
    </div>
  );
}