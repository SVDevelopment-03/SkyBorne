import Image from "next/image";
import React from "react";
interface FeatureProp {
  icon: string;
  alt: string;
  text: string;
}

const Feature = ({ icon, alt, text }: FeatureProp) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <Image src={icon} alt={alt} width={34} height={34} />
      <h2 className="text-base">{text}</h2>
    </div>
  );
};

const Features = () => {
  return (
    <div className="font-montserrat bg-[linear-gradient(135deg,rgba(255,247,221,0.2)_0.7%,rgba(255,207,189,0.1)_50%,rgba(255,247,221,0.2)_100%)] rounded-3xl flex flex-col gap-8 items-center justify-between pt-[82px] px-10">
      <div className="max-w-[650px] font-normal text-2xl text-[#494949] font-montserrat text-center">
        We believe wellness means nurturing every part of you body, mind, and
        spirit. Our journeys aren’t about perfection they’re about showing up,
        feeling present, and celebrating progress.
      </div>
      <span className="border-l h-10 border-[#494949]"></span>
      <div className="flex items-start gap-14 justify-between">
        <Feature
          icon="/images/science.svg"
          alt="Science image"
          text="Science-led Guidance"
        />
        <Feature
          icon="/images/celebration.svg"
          alt="Celebration Image"
          text="Celebrating Every Path"
        />
        <Feature
          icon={"/images/connection.svg"}
          alt="Connection Image"
          text="Connected for Strength"
        />
      </div>
      <div className="image">
        <Image src="/images/feature-image.svg" alt="features-image" width={700} height={482} className="w-full" />

      </div>
    </div>
  );
};

export default Features;
