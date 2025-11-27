"use client";
import React from "react";
interface HeadingProps {
  title: string;
  isUpdated?: boolean;
  isMain?: boolean;
  description: string;
  cssClass?: string;
  elemClass?: {
    heading?: string;
    paragraph?: string;
  };
}

export type TypeProp =
  | "lg"
  | "xl"
  | "regular"
  | "lgBlack"
  | "xl2"
  | "theme"
  | "xxl"
  | "baseTheme"
  | "regularTheme"
  ;

const Heading = ({
  title,
  description,
  cssClass,
  elemClass,
  isUpdated,
  isMain,
}: HeadingProps) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center gap-2 md:gap-6 font-satoshi-500 ${cssClass}`}
    >
      <h2 className={`text-[30px] md:text-5xl ${elemClass?.heading}`}>
        {title}
      </h2>
      {!isUpdated ? (
        <p
          className={`text-sm md:text-lg max-w-80 md:max-w-[492px] text-[#1D1D1D] ${elemClass?.paragraph}`}
        >
          {description}
        </p>
      ) : (
        <p
          className={`text-sm md:text-lg max-w-80 md:max-w-[492px] ${elemClass?.paragraph}`}
          style={isMain ? { color: "#FFFFFF" } : { color: "rgba(0,0,0,0.7)" }}
        >
          {description}
        </p>
      )}
    </div>
  );
};

export const WhiteHeading = ({
  title,
  description,
  cssClass,
  elemClass,
}: HeadingProps) => {
  return (
    <div
      className={`flex flex-col gap-5 md:gap-[30px] text-[#FFFFFF] font-satoshi-500 ${cssClass}`}
    >
      <h2
        className={`font-medium text-lg md:text-[25px] leading-[1.1] ${elemClass?.heading}`}
      >
        {title}
      </h2>
      <p
        className={`text-xs md:text-lg leading-[1.1] font-satoshi-400 font-normal ${elemClass?.paragraph}`}
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
      className={`font-satoshi-500 font-medium text-[24px] md:text-[60px] text-[#FFFFFF] max-w-[567px] leading-[1.1] ${cssClass}`}
    >
      {title}
    </h2>
  );
};

export const Typography = ({
  title,
  type = "lg",
  cssClass,
  onClick,
}: {
  title: string | React.ReactNode;
  type?: TypeProp;
  cssClass?: string;
  onClick?: () => void;
}) => {
  //lg:18px
  const variant: Record<string, string> = {
    theme: "font-satoshi-500 font-medium text-lg text-[#494949]",
    regular: "font-satoshi-400 font-normal text-lg text-black/80",
    regularTheme: "font-satoshi-400 font-normal text-lg text-[#494949]",
    lg: "font-satoshi-500 font-medium text-sm md:text-base lg:text-lg text-[#1D1D1D]",
    lgBlack: "font-satoshi-500 font-medium text-lg text-[#000000]",
    xl: "font-satoshi-500 font-medium text-[25px] md:text-[40px] lg:text-[50px] text-[#000000]",
    xl2: "font-satoshi-500 font-medium text-[50px] text-[#494949]",
    xxl: "font-satoshi-700 font-bold text-3xl md:text-[35px] text-[#494949]",
    baseTheme: "font-satoshi-700 font-bold text-[12px] md:text-[16px] text-[#B95E82]",
  };
  return (
    <h2 className={`${variant[type]} ${cssClass}`} onClick={onClick}>
      {title}
    </h2>
  );
};
