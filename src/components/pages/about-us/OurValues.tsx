import { Typography } from "@/components/ui/heading";
import HeadingDiv from "@/components/ui/HeadingDiv";
import Image from "next/image";

interface OurValueProp {
  image: string;
  title: string;
  description: string;
  cssClass?: string;
  isStart?: boolean;
}

const OurValue = ({
  image,
  title,
  description,
  cssClass,
  isStart,
}: OurValueProp) => {
  return (
    <div
      className={`bg-[#FFE8E8] p-[30px] flex flex-col ${
        isStart ? "items-start" : "items-end"
      } min-w-[577px] gap-20 ${cssClass}`}
    >
      <Image
        src={image}
        alt="service-image"
        className="rounded-[10px] h-full object-center"
        width={45}
        height={45}
      />
      <div
        className={`flex flex-col gap-2.5 ${
          isStart ? "items-start" : "items-end"
        }`}
      >
        <Typography title={title} cssClass="!text-[30px]" type="xl" />
        <Typography
          title={description}
          type="regular"
          cssClass={`max-w-[348px] ${isStart ? "" : "text-end"}`}
        />
      </div>
    </div>
  );
};

const OurValues = () => {
  const ourValueDetail = [
    {
      id: 1,
      cssClass:
        "rounded-tl-[12px] rounded-tr-[12px] rounded-br-[500px] rounded-bl-[12px]",
      image: "/images/mask-group.jpg",
      title: "Inclusivity",
      description:
        "Everyone is welcome. Every age, body, and background has a place in the Skyborne community",
    },
    {
      id: 2,
      cssClass:
        "rounded-tl-[12px] rounded-tr-[12px] rounded-br-[12px] rounded-bl-[500px]",
      image: "/images/mask-group.jpg",
      title: "Progress Over Perfection",
      description:
        "We celebrate personal progress and curiosity, not just outcomes. Every small win matters",
    },
    {
      id: 3,
      cssClass:
        "rounded-tl-[12px] rounded-tr-[500px] rounded-br-[12px] rounded-bl-[12px]",
      image: "/images/mask-group.jpg",
      title: "Trusted Guidance",
      description:
        "Everyone is welcome. Every age, body, and background has a place in the Skyborne community",
    },
    {
      id: 4,
      cssClass:
        "rounded-tl-[500px] rounded-tr-[12px] rounded-br-[12px] rounded-bl-[12px]",
      image: "/images/mask-group.jpg",
      title: "Community Energy",
      description:
        "Our certified professionals offer honest advice, encouragement, and proven expertise",
    },
  ];
  return (
    <div className="flex flex-col items-center gap-18">
      <HeadingDiv
        badge="Our Values"
        title="The Heart of Everything We Do"
        description="Our values create the foundation for every experience, class, and connection at Skyborne"
      />
      <div className="flex items-center justify-center gap-[30px] flex-wrap max-w-[1184px]">
        {ourValueDetail?.map((ourValue, i) => (
          <OurValue
            key={ourValue?.id}
            image={ourValue?.image}
            title={ourValue?.title}
            description={ourValue?.description}
            cssClass={ourValue?.cssClass}
            isStart={i % 2 == 0}
          />
        ))}
      </div>
    </div>
  );
};

export default OurValues;
