import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/heading";
import { DashboardHeadingProps } from "@/types/home.type";
import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { DateFilter } from "@/components/ui/DateFilter";

const DashboardTitle = ({
  title,
  description,
  buttonText,
  selectText,
  dateFilter
}: DashboardHeadingProps) => {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex flex-col gap-1.5">
        <Typography
          title={title}
          type="baseTheme"
          cssClass="md:text-[25px]! md:leading-[30px] text-[#0A0A0A]!"
        />
        <Typography title={description} type="regularTheme" />
      </div>
      {buttonText && (
        <Button
          variant={"outlineBlackRect"}
          className="font-satoshi-700 font-bold text-[15px]! px-3! py-2! text-[#212C26] bg-[#FFFFFF01] border border-[#E8EEEA] shadow-[0px_1px_2px_0px_#0000000D]"
        >
          {buttonText}
        </Button>
      )}

      {selectText && (
        <Select defaultValue="1">
          <SelectTrigger
            className={cn(
              "font-satoshi-700 font-bold text-[15px]! text-[#212C26]! bg-[#FFFFFF01]! border border-[#E8EEEA] rounded-[10px] shadow-[0px_1px_2px_0px_#0000000D]"
            )}
          >
            <SelectValue placeholder="Select service"  />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="1" >Last 6 months</SelectItem>
              <SelectItem value="2">Last 3 months</SelectItem>
              <SelectItem value="3">Last Year</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
      {
        dateFilter && <DateFilter/>
      }
    </div>
  );
};

export default DashboardTitle;
