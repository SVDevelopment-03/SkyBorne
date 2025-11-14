import { Typography } from "@/components/ui/heading";
import { keyFeatureDetail } from "@/constants/yoga-details.constant";
import Image from "next/image";

interface KeyFeatureProp {
  image: string;
  title: string;
  description: string;
  cssClass?: string;
  isMain?: boolean;
}

const KeyFeature = ({
  image,
  title,
  description,
  cssClass,
  isMain,
}: KeyFeatureProp) => {
  return (
    <div
      className={`${
        isMain ? "bg-[#FBEFD8]" : ""
      } rounded-[10px] border border-[#CCCCCC] p-4 md:p-7.5 flex flex-col items-start max-md:min-w-[230px] xl:max-w-[391px]  gap-6 md:gap-10.5 max-md:w-[230px] h-full ${cssClass}`}
    >
      <Image
        src={image}
        alt="service-image"
        width={50}
        height={50}
        className="rounded-[10px] size-7.5 md:size-12.5 object-contain object-center"
      />
      <div className={`flex flex-col gap-3.5 items-start`}>
        <Typography
          title={title}
          cssClass="!text-base md:!text-[26px] leading-tight"
          type="xl"
        />
        <Typography
          title={description}
          type="regular"
          cssClass={`max-w-[338px] max-md:text-[10px] font-satoshi-400 leading-tight`}
        />
      </div>
    </div>
  );
};

const KeyFeatures = () => {
  return (
    <div className="flex flex-col md:items-center gap-18 max-md:overflow-x-auto max-md:w-full">
      <div className="flex items-start md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 xl:gap-12 md:flex-wrap w-full">
        {keyFeatureDetail?.map((ourValue) => (
          <KeyFeature
            key={ourValue?.id}
            image={ourValue?.image}
            title={ourValue?.title}
            description={ourValue?.description}
            cssClass={ourValue?.cssClass}
            isMain={ourValue?.isMain}
          />
        ))}
      </div>
    </div>
  );
};

export default KeyFeatures;
