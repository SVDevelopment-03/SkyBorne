import React from "react";
interface HeadingProps {
  title: string;
  description: string;
  cssClass?: string;
  elemClass?: {
    heading?: string;
    paragraph?: string;
  };
}

type TypeProp = "lg" | "xl" | "regular" | "lgBlack";

const Heading = ({ title, description, cssClass, elemClass }: HeadingProps) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center gap-2 md:gap-6 font-satoshi-500 ${cssClass}`}
    >
      <h2 className={`text-[30px] md:text-5xl ${elemClass?.heading}`}>
        {title}
      </h2>
      <p
        className={`text-sm md:text-lg  text-[#1D1D1D] max-w-80 md:max-w-[492px] ${elemClass?.paragraph}`}
      >
        {description}
      </p>
    </div>
  );
};

export default Heading;

export const BannerHeading = ({
  title,
  cssClass = "",
}: {
  title: string;
  cssClass?: string;
}) => {
  return (
    <h2
      className={`font-satoshi-500 font-medium text-[80px] text-[#FFFFFF] max-w-[567px] leading-[1.1] ${cssClass}`}
    >
      {title}
    </h2>
  );
};

export const Typography = ({
  title,
  type = "lg",
  cssClass,
}: {
  title: string;
  type?: TypeProp;
  cssClass?: string;
}) => {
  //lg:18px
  const variant: Record<string, string> = {
    regular: "font-satoshi-400 font-normal text-lg text-black/80",
    lg: "font-satoshi-500 font-medium text-lg text-[#1D1D1D]",
    lgBlack: "font-satoshi-500 font-medium text-lg text-[#000000]",
    xl: "font-satoshi-500 font-medium text-[50px] text-[#000000]",
  };
  return <h2 className={`${variant[type]} ${cssClass}`}>{title}</h2>;
};
