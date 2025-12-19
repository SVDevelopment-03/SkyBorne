import { Typography } from "@/components/ui/heading";
import HeadingDiv from "@/components/ui/HeadingDiv";
import { OurValueProp } from "@/types/home.type";
import Image from "next/image";

const OurValue = ({
  image,
  title,
  description,
  cssClass,
  isStart,
}: OurValueProp) => {
  return (
    <div
      className={`bg-[#FFE8E8] py-3 md:p-7.5 2xl:p-12 flex flex-col justify-center ${
        isStart ? "items-start pl-2.5 pr-3" : "items-end pl-4 pr-2.5"
      } max-lg:w-[calc(50%-10px)] lg:min-w-[45%] min-h-[174px] 2xl:min-h-[20em] gap-4.5 md:gap-12 lg:gap-20 ${cssClass}`}
    >
      <Image
        src={image}
        alt="service-image"
        width={45}
        height={45}
        className="rounded-[10px] object-center size-4 md:size-11"
      />
      <div
        className={`flex flex-col gap-2.5 ${
          isStart ? "items-start" : "items-end"
        }`}
      >
        <Typography
          title={title}
          cssClass={`!text-xs md:text-2xl lg:!text-[30px] whitespace-nowrap ${
            isStart ? "text-start" : "text-end"
          }`}
          type="xl"
        />
        <Typography
          title={description}
          type="regular"
          cssClass={`max-w-[122px] md:max-w-[60%] lg:max-w-[348px] max-md:!text-xs ${
            isStart ? "" : "text-end"
          }`}
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
    <div className="flex flex-col items-center gap-8.5 md:gap-13 lg:gap-18">
      <HeadingDiv
        badge="Our Values"
        title="The Heart of Everything We Do"
        description="Our values create the foundation for every experience, class, and connection at Skyborne"
        cssClass=""
      />
      <div className="flex items-center justify-center gap-2.5 md:gap-4 lg:gap-7.5 flex-wrap w-full">
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
