import React from "react";
import { Button } from "./button";
import { CustomButtonsProps } from "@/types/home.type";

const CustomButtons = ({
  variant = "theme",
  text,
  cssClass,
}: CustomButtonsProps) => {
  return (
    <Button
      variant={variant}
      className={`px-[42px]! py-3! text-lg! leading-tight! font-satoshi-500 max-h-9 ${cssClass}`}
    >
      {text}
    </Button>
  );
};

export default CustomButtons;
