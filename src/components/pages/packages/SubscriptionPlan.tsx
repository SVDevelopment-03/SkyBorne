"use client";
import CustomButtons from "@/components/ui/CustomButtons";
import Heading from "@/components/ui/heading";
import { useGetPlansQuery } from "@/store/api/publicApi";
import { IPlan } from "@/types/home.type";
import { SkeletonSubscription, Subscription } from "../home/Subscription";
import { useEffect, useState } from "react";

const SubscriptionPlans = () => {
  const [hydrated, setHydrated] = useState(false);
  const [isSelected, setIsSelected] = useState(1);
  const { data, isLoading, error } = useGetPlansQuery(undefined);
  const plans: IPlan[] = data?.data || [];

  useEffect(() => {
    setTimeout(() => {
      setHydrated(true);
    }, 0);
  }, []);

  if (!hydrated) return null;

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
            <CustomButtons variant={"theme"} text="Monthly" />
            <CustomButtons variant={"themeOutline"} text="Yearly" />
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
