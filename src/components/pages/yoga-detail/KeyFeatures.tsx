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
      } rounded-[10px] border border-[#CCCCCC] p-7.5 flex flex-col items-start max-w-[391px] gap-[42px] ${cssClass}`}
    >
      <Image
        src={image}
        alt="service-image"
        width={50}
        height={50}
        className="rounded-[10px] size-[50px] object-center"
      />
      <div className={`flex flex-col gap-3.5 items-start`}>
        <Typography
          title={title}
          cssClass="!text-[26px] leading-tight"
          type="xl"
        />
        <Typography
          title={description}
          type="regular"
          cssClass={`max-w-[338px] font-satoshi-400 leading-tight`}
        />
      </div>
    </div>
  );
};

const KeyFeatures = () => {
  return (
    <div className="flex flex-col items-center gap-18">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12 flex-wrap">
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
