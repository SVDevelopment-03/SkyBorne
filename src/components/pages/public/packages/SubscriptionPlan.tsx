"use client";
import CustomButtons from "@/components/ui/CustomButtons";
import Heading from "@/components/ui/heading";
import { useGetPlansQuery } from "@/store/api/publicApi";
import { IPlan } from "@/types/home.type";
import { SkeletonSubscription, Subscription } from "../home/Subscription";
import { useEffect, useState } from "react";
import FullPageLoader from "@/components/ui/FullPageLoader";

const ALLOWED_PACKAGE_PRICES = [100, 200, 300];

const toNumericPrice = (value: unknown): number => {
  if (typeof value === "number") return value;
  const parsed = Number(String(value ?? "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) ? parsed : NaN;
};

const SubscriptionPlans = () => {
  const [hydrated, setHydrated] = useState(false);
  const [isSelected, setIsSelected] = useState(1);
  const [isYearly, setIsYearly] = useState(false);
  const { data, isLoading, error } = useGetPlansQuery(undefined);
  const plans: IPlan[] = (data?.data || [])
    .filter((plan: IPlan) =>
      ALLOWED_PACKAGE_PRICES.includes(toNumericPrice(plan?.price)),
    )
    .sort(
      (a: IPlan, b: IPlan) =>
        toNumericPrice(a?.price) - toNumericPrice(b?.price),
    );

  useEffect(() => {
    setTimeout(() => {
      setHydrated(true);
    }, 0);
  }, []);

  if (!hydrated) return <FullPageLoader label="Loading plans..." />;

  return (
    <div className="max-w-[1268px] w-full mx-auto">
      <div className="flex flex-col gap-8 md:gap-11 items-center justify-center rounded-2xl md:rounded-[30px] max-md:pb-7.5 max-lg:px-4 text-[#494949]">
        <Heading
          title={"Find Your Perfect Wellness Plan"}
          description={
            "Choose a package that fits your goals and schedule. Flexible options make it easy to start and grow at your pace."
          }
          elemClass={{ heading: "text-black max-md:!text-[25px]" }}
        />
        <div className="flex flex-col items-center gap-16 w-full">
          <div className="rounded-4xl bg-[#FFE8E8] py-2 px-5 flex items-center gap-5">
            <CustomButtons
              variant={!isYearly ? "theme" : "themeOutline"}
              text="Monthly"
              onClick={() => setIsYearly(false)}
            />
            <CustomButtons
              variant={isYearly ? "theme" : "themeOutline"}
              text="Yearly"
              onClick={() => setIsYearly(true)}
            />
          </div>
          <div className="w-full max-lg:overflow-x-auto max-lg:[scrollbar-width:none]">
            <div className="flex items-center justify-center gap-5 md:gap-14 pt-10 pb-3 min-w-[800px]">
              {isLoading &&
                [1, 2, 3].map((i) => <SkeletonSubscription key={i} />)}
              {!isLoading &&
                !error &&
                plans?.map((plan, index) => {
                  return (
                    <Subscription
                      key={plan?.name}
                      name={plan?.name}
                      features={plan?.features}
                      image={plan?.image}
                      isSelected={index == isSelected}
                      price={plan?.price}
                      isYearly={isYearly}
                    />
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
