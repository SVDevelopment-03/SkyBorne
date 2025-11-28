import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/heading";
import { useSignup } from "./SignupContext";
import { motion, Variants } from "framer-motion";
import HomeIcon from "@/utils/homeIcon";

const RightIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M26.2923 7.88477L11.8365 22.3406L5.26562 15.7698"
      stroke="#B95E82"
      strokeWidth="2.62834"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12, // items animate one-by-one
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 35, // starts lower
  },
  visible: {
    opacity: 1,
    y: 0, // moves up
    transition: {
      type: "spring",
      stiffness: 220, // bounce power
      damping: 18, // smoothness
    },
  },
};

const Step1 = () => {
  const { step, setStep, totalSteps, formData, updateStepData } = useSignup();
  const selected = formData?.step1?.motivation;

  const handleSelect = (id: string) => {
    updateStepData("step1", { motivation: id });
  };

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const motivations = [
    {
      id: "1",
      title: "Move more & improve flexibility",
    },
    {
      id: "2",
      title: "Get fit & stronger",
    },
    {
      id: "3",
      title: "Eat healthy & feel better",
    },
    {
      id: "4",
      title: "Reduce stress",
    },
    {
      id: "5",
      title: "Build a lasting habit",
    },
    {
      id: "6",
      title: "Just exploring",
    },
  ];
  return (
    <div className="flex flex-col gap-8 md:gap-10 h-full">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-3">
          <Typography
            title="What inspired you to join Skyborne?"
            type="xxl"
            cssClass="leading-tight"
          />
          <Typography
            title="What inspired you to join Skyborne?"
            type="theme"
          />
        </div>
        <HomeIcon />
      </div>
      <div className="flex flex-col gap-8 h-full overflow-auto [scrollbar-width:none]">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-4.5"
        >
          {motivations?.map((motivation) => (
            <motion.div
              key={motivation?.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              onClick={() => handleSelect(motivation?.id)}
              className={`${
                selected === motivation?.id ? "bg-[#FFE8E8]" : "bg-[#FFFFFF]"
              } border-[2.5px] rounded-[22px] cursor-pointer relative p-[26px] ${
                selected === motivation?.id
                  ? "border-[#B95E82]"
                  : "border-[#E5E7EB]"
              }`}
            >
              <Typography
                title={motivation?.title}
                cssClass="xl:!text-[22px] xl:!leading-[31px] text-[#0A0A0A]!"
              />
              {selected === motivation?.id && (
                <div className="absolute right-[27px] top-[30px]">
                  <RightIcon />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
        <div className="flex flex-col items-center pt-2">
          <p className="font-arial text-lg font-normal leading-5">
            Not sure?
            <span
              className="font-satoshi-700 font-bold text-[#B95E82] pl-2 cursor-pointer"
              onClick={nextStep}
            >
              Skip this step
            </span>
          </p>
        </div>
        <div className="flex justify-center items-center gap-4 md:gap-5.5">
          <Button
            variant={"outlineBlack"}
            onClick={prevStep}
            className="px-12 md:p-3.5! md:min-w-[246px] font-medium"
          >
            Back
          </Button>
          <Button
            variant={"theme"}
            onClick={nextStep}
            className="px-12 md:p-3.5! md:min-w-[246px] font-medium"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Step1;
