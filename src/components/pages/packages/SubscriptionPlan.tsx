import CustomButtons from "@/components/ui/CustomButtons";
import Heading from "@/components/ui/heading";
import SubscriptionPanUi from "@/components/ui/SubscriptionPlanUi";

const SubscriptionPlans = () => {
  const plansDetail = [
    {
      id: 1,
      name: "Starter Plan",
      price: "0",
      description: "Wellness for beginners or focused paths.",
      features: [
        "Up to 2 yoga group sessions/week",
        "Access to Yoga only",
        "Community chat, attendance tracker",
        "Beginner-friendly guidance",
        "No long-term commitment",
      ],
      isMain: false,
    },
    {
      id: 2,
      name: "Flex Plan",
      price: "0",
      description: "Balance, variety, and tools for steady progress.",
      features: [
        "4 sessions/week across Yoga + Fitness",
        "Downloadable wellness guides",
        "Habit tracker & reminder nudges",
        "Priority booking for workshops",
        "Support for changing needs",
      ],
      isMain: true,
    },
    {
      id: 3,
      name: "All Access Plan",
      price: "0",
      description: "Full access for holistic living and big goals",
      features: [
        "Unlimited sessions",
        "Exclusive webinars & milestone rewards",
        "Priority booking always",
        "Community challenges & leaderboards",
        "Personalized feedback and coaching",
      ],
      isMain: false,
    },
  ];

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
            <div className="grid grid-cols-3 items-center justify-center gap-4 lg:gap-9 w-full min-w-[800px]">
              {plansDetail?.map((plan) => {
                return (
                  <SubscriptionPanUi
                    key={plan?.id}
                    name={plan?.name}
                    description={plan?.description}
                    features={plan?.features}
                    price={plan?.price}
                    isMain={plan?.isMain}
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
