import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Check, Package } from "lucide-react";
import { useMemo, useState } from "react";
import { useGetPlansQuery } from "@/store/api/publicApi";
import { IPlan } from "@/types/home.type";
import useGetUser from "@/hooks/useGetUser";

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

export interface SelectedPlanMeta {
  planKey: string;
  planName: string;
  monthlyPrice: number;
  yearlyPrice: number;
  classesTextMonthly: string;
  classesTextYearly: string;
}

interface PackageSelectionProps {
  onSelect: (packageType: string) => void;
  onSelectPlanData: (plan: SelectedPlanMeta) => void;
  currentPlan?: string;
  pendingPlan?: string;
  pendingBillingType?: "monthly" | "yearly";
  pendingEffectiveDate?: string | Date | null;
  expiryDate?: Date;
  subscription?: Subscription;
  totalClassCredits?: number;
  classCredits?: ClassCredits;
  onBillingTypeChange?: (billingType: "monthly" | "yearly") => void;
}

interface GoldOption {
  id: string;
  label: string;
  description: string;
}

const formatDate = (date: string | Date): string => {
  if (!date) return "N/A";
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const toNumber = (value: unknown): number => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

const formatCount = (value: number): string => {
  if (!Number.isFinite(value)) return "0";
  const rounded = Math.round(value);
  if (Math.abs(value - rounded) < 1e-6) return String(rounded);
  return Number(value.toFixed(2)).toString();
};

const calculateTotalRemainingClasses = (classCredits?: ClassCredits): number => {
  return (
    toNumber(classCredits?.yoga) +
    toNumber(classCredits?.zumba) +
    toNumber(classCredits?.specialty)
  );
};

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const normalizePlanKey = (plan: IPlan): string => {
  const normalizedName = (plan.name || "").toLowerCase().trim();
  const services = (plan.services || []).map((service) =>
    service.toLowerCase().trim(),
  );
  const serviceClassCountMap = new Map(
    (plan.serviceClassCounts || []).map((entry) => [
      String(entry.service || "").toLowerCase().trim(),
      Number(entry.classCountPerMonth || 0),
    ]),
  );
  const yogaCount = Array.from(serviceClassCountMap.entries()).reduce(
    (sum, [service, count]) => (service.includes("yoga") ? sum + count : sum),
    0,
  );
  const zumbaCount = Array.from(serviceClassCountMap.entries()).reduce(
    (sum, [service, count]) => (service.includes("zumba") ? sum + count : sum),
    0,
  );
  const count = Number(plan.classCountPerMonth || yogaCount + zumbaCount || 0);

  if ((count === 2 && services.length === 1 && services.includes("yoga")) || yogaCount === 2) {
    return "gold-yoga";
  }
  if ((count === 2 && services.length === 1 && services.includes("zumba")) || zumbaCount === 2) {
    return "gold-zumba";
  }
  if (
    (count === 2 &&
      services.includes("yoga") &&
      services.includes("zumba")) ||
    (yogaCount === 1 && zumbaCount === 1)
  ) {
    return "gold-mixed";
  }
  if (
    (count === 4 &&
      services.includes("yoga") &&
      services.includes("zumba")) ||
    (yogaCount === 2 && zumbaCount === 2)
  ) {
    return "diamond";
  }
  if (
    count === 5 ||
    (yogaCount === 2 &&
      zumbaCount === 2 &&
      Number(plan.classCountPerMonth || 0) === 5)
  ) {
    return "platinum";
  }

  // Name-based fallback for legacy/custom DB data
  if (normalizedName.includes("platinum")) {
    return "platinum";
  }
  if (normalizedName.includes("diamond")) {
    return "diamond";
  }
  if (normalizedName.includes("gold")) {
    if (normalizedName.includes("yoga")) return "gold-yoga";
    if (normalizedName.includes("zumba")) return "gold-zumba";
    if (normalizedName.includes("mixed")) return "gold-mixed";

    // Generic "Gold Package" fallback
    return "gold-mixed";
  }

  return slugify(plan.name || "");
};

const BASE_PLAN_KEYS = new Set([
  "gold-yoga",
  "gold-zumba",
  "gold-mixed",
  "diamond",
  "platinum",
]);

const FALLBACK_CLASSES_TEXT: Record<
  string,
  { monthly: string; yearly: string }
> = {
  "gold-yoga": { monthly: "2 Yoga", yearly: "24 Yoga" },
  "gold-zumba": { monthly: "2 Zumba", yearly: "24 Zumba" },
  "gold-mixed": { monthly: "1 Yoga + 1 Zumba", yearly: "12 Yoga + 12 Zumba" },
  diamond: { monthly: "2 Yoga + 2 Zumba", yearly: "24 Yoga + 24 Zumba" },
  platinum: {
    monthly: "2 Yoga + 2 Zumba + 1 Specialized",
    yearly: "24 Yoga + 24 Zumba + 12 Specialized",
  },
};

const getFallbackClassesText = (
  planKey: string,
  billingType: "monthly" | "yearly",
): string => {
  const entry = FALLBACK_CLASSES_TEXT[planKey];
  if (!entry) return "";
  return billingType === "yearly" ? entry.yearly : entry.monthly;
};

const getPaymentPlanRef = (plan: IPlan, normalizedKey: string): string => {
  if (BASE_PLAN_KEYS.has(normalizedKey)) {
    return normalizedKey;
  }

  if (plan.uuid) return plan.uuid;
  if (plan.planId) return plan.planId;
  if (plan._id) return plan._id;
  if (plan.name?.trim()) return plan.name.trim();

  return normalizedKey;
};

const getClassesText = (plan: IPlan, billingType: "monthly" | "yearly") => {
  const serviceCounts = Array.isArray(plan.serviceClassCounts)
    ? plan.serviceClassCounts.filter(
        (entry) => String(entry.service || "").trim().length > 0,
      )
    : [];
  const totalServiceCount = serviceCounts.reduce(
    (sum, entry) => sum + toNumber(entry.classCountPerMonth),
    0,
  );
  const count = toNumber(plan.classCountPerMonth) || totalServiceCount;

  const serviceSummary = serviceCounts
    .map((entry) => {
      const service = String(entry.service || "").trim();
      const serviceCount = Math.max(0, toNumber(entry.classCountPerMonth));
      if (!service) return "";
      const displayCount =
        billingType === "yearly" ? serviceCount * 12 : serviceCount;
      return `${formatCount(displayCount)} ${service}`;
    })
    .filter(Boolean)
    .join(" + ");

  const services = (plan.services || []).join(" + ");
  if (serviceSummary) return serviceSummary;

  if (count <= 0) {
    const fallback = getFallbackClassesText(normalizePlanKey(plan), billingType);
    if (fallback) return fallback;
    return "0 Classes";
  }
  if (billingType === "yearly") {
    return `${formatCount(count * 12)} Classes per Year`;
  }
  return services
    ? `${formatCount(count)} Classes (${services})`
    : `${formatCount(count)} Classes`;
};

const getServiceClassLines = (
  plan: IPlan,
  billingType: "monthly" | "yearly",
): string[] => {
  const serviceClassCounts = Array.isArray(plan.serviceClassCounts)
    ? plan.serviceClassCounts
        .filter(
          (entry) =>
            String(entry.service || "").trim().length > 0 &&
            Number(entry.classCountPerMonth || 0) >= 0,
        )
        .map((entry) => ({
          service: String(entry.service).trim(),
          classCountPerMonth: Math.max(0, toNumber(entry.classCountPerMonth)),
        }))
    : [];

  if (serviceClassCounts.length > 0) {
    return serviceClassCounts.map((entry) => {
      const displayCount =
        billingType === "yearly"
          ? entry.classCountPerMonth * 12
          : entry.classCountPerMonth;
      return `${formatCount(displayCount)} ${entry.service} Classes`;
    });
  }

  return (plan.services || [])
    .filter((service) => String(service || "").trim().length > 0)
    .map((service) => `${formatCount(0)} ${String(service).trim()} Classes`);
};

const getCustomPlanIcon = (monthlyPrice: number): string => {
  if (monthlyPrice >= 90 && monthlyPrice <= 110) return "🟡";
  if (monthlyPrice >= 190 && monthlyPrice <= 210) return "💎";
  if (monthlyPrice >= 290 && monthlyPrice <= 310) return "🔷";
  return "✨";
};

const toTitleCase = (value: string): string =>
  value
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const FIXED_PLAN_NAME_MAP: Record<string, string> = {
  "gold-yoga": "Gold Package",
  "gold-zumba": "Gold Package",
  "gold-mixed": "Gold Package",
  diamond: "Diamond Package",
  platinum: "Platinum Package",
};

export function UpgradePlan({
  onSelect,
  onSelectPlanData,
  currentPlan,
  pendingPlan,
  pendingBillingType,
  pendingEffectiveDate,
  subscription,
  classCredits,
  totalClassCredits,
  onBillingTypeChange,
}: PackageSelectionProps) {
  const [billingType, setBillingType] = useState<"monthly" | "yearly">(
    "monthly",
  );
  const { data } = useGetPlansQuery(undefined);
  const { user } = useGetUser();

  const plansWithMeta = useMemo(() => {
    const plans: IPlan[] = data?.data || [];
    return plans
      .map((plan) => {
        const monthlyPrice = Number(plan.price || 0);
        const yearlyPrice = Math.round(monthlyPrice * 12 * 0.95);
        const planKey = normalizePlanKey(plan);
        const paymentPlanRef = getPaymentPlanRef(plan, planKey);
        return {
          ...plan,
          planKey,
          paymentPlanRef,
          monthlyPrice,
          yearlyPrice,
          monthlyClassesText: getClassesText(plan, "monthly"),
          yearlyClassesText: getClassesText(plan, "yearly"),
        };
      })
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [data]);

  const normalizePlanValue = (value?: string) =>
    String(value || "").toLowerCase().trim();

  const isPlanMatch = (
    value: string | undefined,
    plan: (typeof plansWithMeta)[number] | undefined,
  ) => {
    if (!value || !plan) return false;
    const normalizedValue = normalizePlanValue(value);
    if (!normalizedValue) return false;
    const candidates = [
      plan.paymentPlanRef,
      plan.planKey,
      plan.uuid,
      plan.planId,
      plan._id,
      plan.name,
      slugify(plan.name || ""),
    ]
      .filter(Boolean)
      .map((entry) => normalizePlanValue(String(entry)));
    return candidates.includes(normalizedValue);
  };

  const resolvePlanDisplayName = (value?: string) => {
    const raw = String(value || "").trim();
    if (!raw) return "No plan";

    const normalized = raw.toLowerCase();
    if (FIXED_PLAN_NAME_MAP[normalized]) {
      return FIXED_PLAN_NAME_MAP[normalized];
    }

    const matchedPlan = plansWithMeta.find((plan) =>
      isPlanMatch(raw, plan),
    );

    if (matchedPlan?.name) {
      return toTitleCase(matchedPlan.name);
    }

    const maybeUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        raw,
      ) || /^[0-9a-f]{24}$/i.test(raw);

    if (maybeUuid) {
      return "Custom Plan";
    }

    return toTitleCase(raw.replace(/-/g, " "));
  };

  const currentPlanDisplayName = useMemo(
    () => resolvePlanDisplayName(currentPlan),
    [currentPlan, plansWithMeta],
  );
  const pendingPlanDisplayName = useMemo(
    () => resolvePlanDisplayName(pendingPlan),
    [pendingPlan, plansWithMeta],
  );

  const planMap = useMemo(() => {
    const map = new Map<string, (typeof plansWithMeta)[number]>();
    plansWithMeta.forEach((plan) => map.set(plan.planKey, plan));
    return map;
  }, [plansWithMeta]);

  const goldYogaPlan = planMap.get("gold-yoga");
  const goldZumbaPlan = planMap.get("gold-zumba");
  const goldMixedPlan = planMap.get("gold-mixed");
  const diamondPlan = planMap.get("diamond");
  const platinumPlan = planMap.get("platinum");
  const additionalPlans = plansWithMeta.filter(
    (plan) =>
      ![
        "gold-yoga",
        "gold-zumba",
        "gold-mixed",
        "diamond",
        "platinum",
      ].includes(plan.planKey),
  );

  const activeGoldOptions: GoldOption[] = [
    {
      id: "gold-yoga",
      label: billingType === "monthly" ? "2 Yoga" : "24 Yoga",
      description: "",
    },
    {
      id: "gold-zumba",
      label: billingType === "monthly" ? "2 Zumba" : "24 Zumba",
      description: "",
    },
    {
      id: "gold-mixed",
      label: "Mixed",
      description:
        billingType === "monthly"
          ? "(1 Yoga + 1 Zumba)"
          : "(12 Yoga + 12 Zumba)",
    },
  ];

  const defaultGoldOption =
    activeGoldOptions.find((opt) => opt.id === currentPlan)?.id ||
    activeGoldOptions[0]?.id ||
    null;
  const [selectedGoldOption, setSelectedGoldOption] = useState<string | null>(
    defaultGoldOption,
  );

  const hasPendingPlan =
    Boolean(pendingPlan) &&
    normalizePlanValue(pendingPlan) !== normalizePlanValue(currentPlan);
  const pendingEffectiveLabel = pendingEffectiveDate
    ? formatDate(pendingEffectiveDate)
    : "the end of your current subscription";

  const pendingGoldOption = activeGoldOptions.find((option) => {
    if (!pendingPlan) return false;
    if (normalizePlanValue(pendingPlan) === normalizePlanValue(option.id)) {
      return true;
    }
    return isPlanMatch(pendingPlan, planMap.get(option.id));
  });
  const isPendingGoldPlan =
    Boolean(pendingGoldOption) ||
    normalizePlanValue(pendingPlan || "").startsWith("gold");

  const isCurrentGoldPlan =
    currentPlan === "gold-yoga" ||
    currentPlan === "gold-zumba" ||
    currentPlan === "gold-mixed";
  const isDiamondPlan = (currentPlan || "").toLowerCase() === "diamond";
  const isPlatinumPlan = (currentPlan || "").toLowerCase() === "platinum";
  const isPendingDiamondPlan = isPlanMatch(pendingPlan, diamondPlan);
  const isPendingPlatinumPlan = isPlanMatch(pendingPlan, platinumPlan);

  const sessionsRemaining = calculateTotalRemainingClasses(classCredits);
  const includedSessions = Number(totalClassCredits || 0);
  const renewalDate = formatDate(subscription?.endDate || "");
  const subscriptionStatus = subscription?.status || "inactive";
  const isSubscriptionActive = subscriptionStatus === "active";
  const displaySessionsRemaining = isSubscriptionActive ? sessionsRemaining : 0;
  const displayUsedSessions = isSubscriptionActive
    ? Math.max(0, includedSessions - sessionsRemaining)
    : 0;
  const displaySessionsRemainingLabel = formatCount(displaySessionsRemaining);
  const includedSessionsLabel = formatCount(includedSessions);
  const displayUsedSessionsLabel = formatCount(displayUsedSessions);

  const goldMonthly =
    Number(goldYogaPlan?.monthlyPrice) ||
    Number(goldZumbaPlan?.monthlyPrice) ||
    Number(goldMixedPlan?.monthlyPrice) ||
    100;
  const diamondMonthly = Number(diamondPlan?.monthlyPrice || 200);
  const platinumMonthly = Number(platinumPlan?.monthlyPrice || 300);

  const goldYearly = Math.round(goldMonthly * 12 * 0.95);
  const diamondYearly = Math.round(diamondMonthly * 12 * 0.95);
  const platinumYearly = Math.round(platinumMonthly * 12 * 0.95);

  const selectPlanByKey = (planKey: string) => {
    const plan = planMap.get(planKey);
    if (!plan) return;

    onSelectPlanData({
      planKey: plan.paymentPlanRef,
      planName: plan.name,
      monthlyPrice: plan.monthlyPrice,
      yearlyPrice: plan.yearlyPrice,
      classesTextMonthly: plan.monthlyClassesText,
      classesTextYearly: plan.yearlyClassesText,
    });
    onSelect(plan.paymentPlanRef);
  };

  const handleGoldSelect = () => {
    if (selectedGoldOption) {
      const selectedPlan = planMap.get(selectedGoldOption);

      if (selectedPlan) {
        selectPlanByKey(selectedGoldOption);
        return;
      }

      const classesMonthlyMap: Record<string, string> = {
        "gold-yoga": "2 Yoga",
        "gold-zumba": "2 Zumba",
        "gold-mixed": "1 Yoga + 1 Zumba",
      };
      const classesYearlyMap: Record<string, string> = {
        "gold-yoga": "24 Yoga",
        "gold-zumba": "24 Zumba",
        "gold-mixed": "12 Yoga + 12 Zumba",
      };

      onSelectPlanData({
        planKey: selectedGoldOption,
        planName: "Gold Package",
        monthlyPrice: goldMonthly,
        yearlyPrice: goldYearly,
        classesTextMonthly: classesMonthlyMap[selectedGoldOption] || "2 Classes",
        classesTextYearly: classesYearlyMap[selectedGoldOption] || "24 Classes",
      });
      onSelect(selectedGoldOption);
    }
  };

  return (
    <div>
      <div className="py-4">
        <h1 className="text-3xl text-[#1A1A1A] mb-2 font-satoshi-700">
          My Packages
        </h1>
        <p className="text-[#6B6B6B] font-satoshi-400">
          Manage your subscription and explore upgrade options
        </p>
      </div>

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
            <div className="flex flex-col sm:flex-row items-start gap-4 w-full">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Package className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 flex flex-col sm:flex-row sm:items-center w-full">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl capitalize">
                      {currentPlanDisplayName}
                    </h2>
                    <Badge
                      className="bg-white/20 text-white backdrop-blur-sm py-1!"
                      style={{ borderRadius: "8px" }}
                    >
                      {subscriptionStatus === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-white/90 mb-4">
                    {billingType === "monthly" ? "Monthly" : "Yearly"} Subscription
                  </p>
                  {hasPendingPlan && (
                    <p className="text-white/90 text-sm">
                      Scheduled: {pendingPlanDisplayName}
                      {pendingBillingType
                        ? ` (${pendingBillingType === "monthly" ? "Monthly" : "Yearly"})`
                        : ""}{" "}
                      starting {pendingEffectiveLabel}
                    </p>
                  )}
                </div>
                <div className="space-y-2 md:ml-auto w-full md:w-auto">
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    <span className="break-words">
                      {displaySessionsRemainingLabel} of {includedSessionsLabel} sessions
                      remaining
                    </span>
                  </div>
                  {isSubscriptionActive && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      <span>Renews on {renewalDate}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {isSubscriptionActive && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-satoshi-500 text-[16px] text-white/90">
                  Session Usage
                </span>
                <span className="text-white/90">
                  {displayUsedSessionsLabel}/{includedSessionsLabel} used
                </span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3 backdrop-blur-sm">
                <div
                  className="h-full bg-white rounded-full font-satoshi-500 text-[16px]"
                  style={{
                    width:
                      includedSessions > 0
                        ? `${((displayUsedSessions / includedSessions) * 100).toFixed(2)}%`
                        : "0%",
                  }}
                />
              </div>
            </div>
          )}

        </CardContent>
      </Card>

      <div className="animate-fade-in overflow-y-auto">
        <div className="text-center mb-8 sm:mb-12 mt-4">
          <h1 className="mb-3 text-gray-800">Upgrade Your Plan</h1>
          <p className="text-gray-600">
            Select a membership that fits your wellness goals.
          </p>
        </div>

        <div className="flex items-center justify-center mb-8">
          <div className="rounded-4xl bg-[#FFE8E8] py-2 px-3 sm:px-5 flex items-center gap-2 sm:gap-5 mx-auto w-fit max-w-full">
            <button
              onClick={() => {
                setBillingType("monthly");
                onBillingTypeChange?.("monthly");
              }}
              className={`px-4 sm:px-6 py-2 text-sm sm:text-base rounded-full font-medium transition-all ${
                billingType === "monthly"
                  ? "bg-[#B95E82] text-white"
                  : "text-[#B95E82] hover:bg-white/50"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => {
                setBillingType("yearly");
                onBillingTypeChange?.("yearly");
              }}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                billingType === "yearly"
                  ? "bg-[#B95E82] text-white"
                  : "text-[#B95E82] hover:bg-white/50"
              }`}
            >
              Yearly
            </button>
          </div>
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
            gap-4 sm:gap-6 md:gap-8 mb-6 bg-white
            p-4 sm:p-6 md:p-10 rounded-xl items-stretch"
        >
          {activeGoldOptions.length > 0 && (
            <div className="flex flex-col Package_Card_Default bg-[#FFCFBD33] rounded-3xl p-5 sm:p-6 md:p-8 shadow-sm border border-[#f0e5d8] h-full">
              <div className="flex-1">
                <div className="mb-6">
                  <div className="flex justify-center mb-4">
                    <div className="bg-white border border-[#e8d4c0] rounded-full px-5 py-2">
                      <span className="text-sm text-gray-700">🟡 Gold Package</span>
                    </div>
                  </div>
                  <h2 className="text-2xl sm:text-3xl text-gray-800 mb-2 break-words">
                    {billingType === "monthly" ? (
                      <>
                        ${goldMonthly} <span className="text-lg text-gray-600">/Month</span>
                      </>
                    ) : (
                      <>
                        ${goldYearly.toFixed(0)} <span className="text-lg text-gray-600">/Year</span>
                      </>
                    )}
                  </h2>
                  <p className="text-sm text-gray-600 mb-2">
                    Includes: {billingType === "monthly" ? "2 Classes per Month" : "24 Classes per Year (2/Month)"}
                  </p>
                  {billingType === "yearly" && (
                    <p className="text-xs text-green-600 font-semibold">
                      ✓ Save 5% vs Monthly
                    </p>
                  )}
                                  </div>

                <div className="">
                  <p className="text-sm text-gray-700 mb-3">Choose Class Type:</p>

                  <div className="space-y-3 bg-[#fcf6ef] rounded-2xl p-4">
                    {activeGoldOptions.map((option) => (
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
                            <span className="text-sm text-gray-800 break-words">
                              {option.label} {option.description}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-auto pt-4">
                <button
                  onClick={handleGoldSelect}
                  disabled={!selectedGoldOption}
                  className="w-full bg-[#B95E82] hover:bg-[#a16685] text-white py-3 px-6 rounded-full transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isCurrentGoldPlan
                    ? "Current Plan"
                    : isPendingGoldPlan
                      ? "Scheduled"
                      : "Select Gold Package"}
                </button>
              </div>
            </div>
          )}

          {diamondPlan && (
            <div className="flex flex-col Package_Card_Default bg-[#FFCFBD33] rounded-3xl p-5 sm:p-6 md:p-8 shadow-sm border border-[#f0e5d8] h-full">
              <div className="flex-1">
                <div className="mb-6">
                  <div className="flex justify-center mb-4">
                    <div className="bg-white border border-[#e8d4c0] rounded-full px-5 py-2">
                      <span className="text-sm text-gray-700">
                        💎 Diamond Package
                      </span>
                    </div>
                  </div>
                  <h2 className="text-2xl sm:text-3xl text-gray-800 mb-2 break-words">
                    {billingType === "monthly" ? (
                      <>
                        ${diamondMonthly} <span className="text-lg text-gray-600">/Month</span>
                      </>
                    ) : (
                      <>
                        ${diamondYearly.toFixed(0)} <span className="text-lg text-gray-600">/Year</span>
                      </>
                    )}
                  </h2>
                  <p className="text-sm text-gray-600 mb-2">
                    Includes: {billingType === "monthly" ? "2 Yoga + 2 Zumba per Month" : "24 Yoga + 24 Zumba per Year (2 each/Month)"}
                  </p>
                  {billingType === "yearly" && (
                    <p className="text-xs text-green-600 font-semibold">
                      ✓ Save 5% vs Monthly
                    </p>
                  )}
                                  </div>

                <div className="bg-[#fcf6ef] rounded-2xl p-5 mb-6">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#b97d9f] shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-800">
                        {billingType === "monthly" ? "2 Yoga Classes" : "24 Yoga Classes"}
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#b97d9f] shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-800">
                        {billingType === "monthly" ? "2 Zumba Classes" : "24 Zumba Classes"}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-auto pt-4">
                <button
                  onClick={() => selectPlanByKey("diamond")}
                  className="w-full bg-[#B95E82] hover:bg-[#a16685] text-white py-3 px-6 rounded-full transition-all duration-300"
                >
                  {isDiamondPlan
                    ? "Current Plan"
                    : isPendingDiamondPlan
                      ? "Scheduled"
                      : "Select Diamond Package"}
                </button>
              </div>
            </div>
          )}

          {platinumPlan && (
            <div className="relative flex flex-col Package_Card_Default bg-[#B95E82] rounded-3xl p-5 sm:p-6 md:p-8 shadow-lg text-white h-full">
              <div className="flex-1">
                <div className="absolute -top-2 sm:-top-3 left-1/2 -translate-x-1/2 bg-white text-[#b97d9f] px-2 sm:px-3 py-1 text-[10px] sm:text-sm rounded-full shadow-md whitespace-nowrap">
                  ⭐ Best Value
                </div>
                <div className="">
                  <div className="mb-6 mt-2">
                    <div className="flex justify-center mb-4">
                      <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-5 py-2">
                        <span className="text-sm text-white">
                          🔷 Platinum Package
                        </span>
                      </div>
                    </div>
                    <h2 className="text-3xl mb-2">
                      {billingType === "monthly" ? (
                        <>
                          ${platinumMonthly} <span className="text-lg opacity-90">/Month</span>
                        </>
                      ) : (
                        <>
                          ${platinumYearly.toFixed(0)} <span className="text-lg opacity-90">/Year</span>
                        </>
                      )}
                    </h2>
                    <p className="text-sm opacity-90 mb-2">
                      Includes: {billingType === "monthly" ? "2 Yoga + 2 Zumba + 1 Specialized per Month" : "24 Yoga + 24 Zumba + 12 Specialized per Year"}
                    </p>
                    {billingType === "yearly" && (
                      <p className="text-xs opacity-75 font-semibold">
                        ✓ Save 5% vs Monthly
                      </p>
                    )}
                                      </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 mb-6 border border-white/20">
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 shrink-0 mt-0.5" />
                        <span className="text-sm">
                          {billingType === "monthly" ? "2 Yoga Classes" : "24 Yoga Classes"}
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 shrink-0 mt-0.5" />
                        <span className="text-sm">
                          {billingType === "monthly" ? "2 Zumba Classes" : "24 Zumba Classes"}
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 shrink-0 mt-0.5" />
                        <span className="text-sm">
                          {billingType === "monthly" ? "1 Specialized Class" : "12 Specialized Classes"}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="mt-auto pt-4">
                  <button
                    onClick={() => selectPlanByKey("platinum")}
                    className="w-full  bg-white text-[#b97d9f] hover:bg-white/95 py-3 px-6 rounded-full transition-all duration-300"
                  >
                  {isPlatinumPlan
                    ? "Current Plan"
                    : isPendingPlatinumPlan
                      ? "Scheduled"
                      : "Select Platinum Package"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {additionalPlans.map((plan) => (
            <div
              key={plan._id}
              className="flex flex-col Package_Card_Default bg-[#FFCFBD33] rounded-3xl p-5 sm:p-6 md:p-8 shadow-sm border border-[#f0e5d8] h-full"
            >
              <div className="flex-1">
                <div className="mb-6">
                  <div className="flex justify-center mb-4">
                    <div className="bg-white border border-[#e8d4c0] rounded-full px-5 py-2">
                      <span className="text-sm text-gray-700">
                        {getCustomPlanIcon(plan.monthlyPrice)}{" "}
                        {toTitleCase(plan.name)}
                      </span>
                    </div>
                  </div>
                  <h2 className="text-2xl sm:text-3xl text-gray-800 mb-2 break-words">
                    {billingType === "monthly" ? (
                      <>
                        ${plan.monthlyPrice}{" "}
                        <span className="text-lg text-gray-600">/Month</span>
                      </>
                    ) : (
                      <>
                        ${plan.yearlyPrice}{" "}
                        <span className="text-lg text-gray-600">/Year</span>
                      </>
                    )}
                  </h2>
                  <p className="text-sm text-gray-600 mb-2">
                    Includes:{" "}
                    {billingType === "monthly"
                      ? plan.monthlyClassesText
                      : plan.yearlyClassesText}
                  </p>
                  {billingType === "yearly" && (
                    <p className="text-xs text-green-600 font-semibold">
                      ✓ Save 5% vs Monthly
                    </p>
                  )}
                                  </div>

                {getServiceClassLines(plan, billingType).length > 0 && (
                  <div className="bg-[#fcf6ef] rounded-2xl p-5 mb-6">
                    <ul className="space-y-3">
                      {getServiceClassLines(plan, billingType).map((line) => (
                        <li
                          className="flex items-start gap-3"
                          key={`${plan._id}-${line}`}
                        >
                          <Check className="w-5 h-5 text-[#b97d9f] shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-800">{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="mt-auto pt-4">
                {(() => {
                  const isCurrentAdditionalPlan =
                    (currentPlan || "").toLowerCase() ===
                      plan.planKey.toLowerCase() ||
                    (currentPlan || "").toLowerCase() ===
                      String(plan.paymentPlanRef || "").toLowerCase();
                  const isPendingAdditionalPlan = isPlanMatch(pendingPlan, plan);
                  return (
                <button
                  onClick={() => selectPlanByKey(plan.planKey)}
                  className="w-full bg-[#B95E82] hover:bg-[#a16685] text-white py-3 px-6 rounded-full transition-all duration-300"
                >
                  {isCurrentAdditionalPlan
                    ? "Current Plan"
                    : isPendingAdditionalPlan
                      ? "Scheduled"
                      : `Select ${toTitleCase(plan.name)}`}
                </button>
                  );
                })()}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Flexible sessions. No lock-in.
          </p>
        </div>
      </div>
    </div>
  );
}
