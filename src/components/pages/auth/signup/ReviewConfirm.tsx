import { PackageType } from "./PackageSelection";
import { ChevronLeft, Check, Loader2 } from "lucide-react";
import useGetUser from "@/hooks/useGetUser";
import { calculateVatFromBase, getVatRateForCountry } from "@/utils/vat";

interface SelectedPlanMeta {
  planKey: string;
  planName: string;
  monthlyPrice: number;
  yearlyPrice: number;
  classesTextMonthly: string;
  classesTextYearly: string;
}

interface ReviewConfirmProps {
  selectedPackage: PackageType | string;
  selectedPlanData?: SelectedPlanMeta | null;
  onConfirm: () => void;
  onBack: () => void;
  isLoading?: boolean;
  billingType?: "monthly" | "yearly";
}

const getClassesInfo = (
  pkg: string,
  billingType: "monthly" | "yearly" = "monthly",
): string => {
  const classInfo = {
    "gold-yoga": billingType === "monthly" ? "2 Yoga" : "24 Yoga",
    "gold-zumba": billingType === "monthly" ? "2 Zumba" : "24 Zumba",
    "gold-mixed": billingType === "monthly" ? "1 Yoga + 1 Zumba" : "12 Yoga + 12 Zumba",
    diamond: billingType === "monthly" ? "2 Yoga + 2 Zumba" : "24 Yoga + 24 Zumba",
    platinum: billingType === "monthly" ? "2 Yoga + 2 Zumba + 1 Specialized" : "24 Yoga + 24 Zumba + 12 Specialized",
  };
  return classInfo[pkg as keyof typeof classInfo] || "Custom classes";
};

const getPackageInfo = (
  pkg: string,
  billingType: "monthly" | "yearly" = "monthly",
) => {
  const monthlyPrices = {
    "gold-yoga": {
      name: "Gold Package",
      monthlyPrice: 100,
    },
    "gold-zumba": {
      name: "Gold Package",
      monthlyPrice: 100,
    },
    "gold-mixed": {
      name: "Gold Package",
      monthlyPrice: 100,
    },
    diamond: {
      name: "Diamond Package",
      monthlyPrice: 200,
    },
    platinum: {
      name: "Platinum Package",
      monthlyPrice: 300,
    },
  };

  const baseInfo =
    monthlyPrices[pkg as keyof typeof monthlyPrices] ||
    monthlyPrices["gold-yoga"];
  const yearlyPrice = Math.round(baseInfo.monthlyPrice * 12 * 0.95);

  return {
    ...baseInfo,
    price: billingType === "yearly" ? yearlyPrice : baseInfo.monthlyPrice,
    billingCycle: billingType === "yearly" ? "Yearly" : "Monthly",
    classes: getClassesInfo(pkg, billingType),
    discount: billingType === "yearly" ? "Save 5%" : null,
  };
};

export function ReviewConfirm({
  selectedPackage,
  selectedPlanData,
  onConfirm,
  onBack,
  isLoading,
  billingType = "monthly",
}: ReviewConfirmProps) {
  const packageInfo = selectedPlanData
    ? {
        name: selectedPlanData.planName,
        price:
          billingType === "yearly"
            ? selectedPlanData.yearlyPrice
            : selectedPlanData.monthlyPrice,
        billingCycle: billingType === "yearly" ? "Yearly" : "Monthly",
        classes:
          billingType === "yearly"
            ? selectedPlanData.classesTextYearly
            : selectedPlanData.classesTextMonthly,
        discount: billingType === "yearly" ? "Save 5%" : null,
      }
    : getPackageInfo(selectedPackage, billingType);

  const { user } = useGetUser();
  const vatRate = getVatRateForCountry(user?.country, user?.countryCode);
  const vatBreakdown = calculateVatFromBase(packageInfo.price, vatRate);
  const showVat = vatRate > 0;

  return (
    <div className="animate-fade-in">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-[#B95E82] mb-6 transition-colors"
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
            <div className="w-12 h-12 rounded-full bg-[#B95E82] flex items-center justify-center">
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
              <span className="text-gray-900 text-right">
                {packageInfo.classes}
              </span>
            </div>

            <div className="flex justify-between items-center py-3 px-4 bg-[#fcf6ef] rounded-xl">
              <span className="text-gray-600">Billing Cycle:</span>
              <span className="text-gray-900">{packageInfo.billingCycle}</span>
            </div>

            {packageInfo.discount && (
              <div className="flex justify-between items-center py-3 px-4 bg-green-50 rounded-xl border border-green-200">
                <span className="text-green-700 font-semibold">Discount:</span>
                <span className="text-green-700 font-semibold">{packageInfo.discount}</span>
              </div>
            )}

            {showVat && (
              <div className="flex justify-between items-center py-3 px-4 bg-[#fcf6ef] rounded-xl">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-gray-900">${vatBreakdown.subtotal.toFixed(2)}</span>
              </div>
            )}

            {showVat && (
              <div className="flex justify-between items-center py-3 px-4 bg-[#fcf6ef] rounded-xl">
                <span className="text-gray-600">VAT ({Math.round(vatRate * 100)}%):</span>
                <span className="text-gray-900">${vatBreakdown.vatAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between items-center py-4 px-4 bg-[#B95E82] text-white rounded-xl">
              <span className="text-lg">Total:</span>
              <span className="text-2xl">${showVat ? vatBreakdown.total.toFixed(2) : packageInfo.price}</span>
            </div>

            {/* Auto-Renew Checkbox */}
            <div className="border-t border-[#f0e5d8] pt-6 mb-6">
              <label className="flex items-start gap-3 group">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={true}
                    disabled
                    className="sr-only"
                  />
                  <div
                    className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all bg-[#B95E82] border-[#B95E82]`}
                  >
                    {
                      <svg
                        className="w-4 h-4 text-white"
                        viewBox="0 0 12 10"
                        fill="none"
                      >
                        <path
                          d="M1 5L4.5 8.5L11 1.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    }
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-satoshi-500 text-[#494949] text-base">
                    Your subscription will automatically renew each {packageInfo.billingCycle.toLowerCase()}.
                    Cancel anytime.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onBack}
            className="flex-1 bg-white border-2 border-[#d4a5bc] hover:border-[#B95E82] text-gray-700 py-3 px-6 rounded-full transition-all"
          >
            Change Package
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 bg-[#B95E82] hover:bg-[#B95E82] text-white py-3 px-6 rounded-full disabled:opacity-50 transition-all duration-300"
          >
            <span className="flex flex-row gap-2 items-center justify-center">
              {isLoading && (
                <Loader2
                  size={24}
                  className="animate-spin text-white! h-6! w-6!"
                />
              )}
              Confirm & Continue
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
