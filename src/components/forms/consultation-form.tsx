import React from "react";
import Heading from "../ui/heading";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const ConsultationForm = () => {
  return (
    <div className="flex flex-col gap-7.5 md:gap-12 bg-[#FBEFD8] rounded-[30px] flex-1 h-full p-8 pt-9">
      <Heading
        title="Don’t know which direction to choose?"
        description="We support your journey ask us about Skyborne classes, membership, or wellness. Our team is ready to help you."
        cssClass="!items-start text-left"
        elemClass={{
          heading: "text-4xl max-w-[450px] text-[#494949]",
          paragraph: "!text-[#1D1D1DCC]/80",
        }}
      />
      <div className="flex flex-col gap-5 justify-center">
        <div className="grid grid-cols-2 items-center gap-x-5 gap-y-3 md:gap-[34px]">
          <Input type="text" placeholder="Name" />
          <Input type="email" placeholder="Email" />
          <Input type="email" placeholder="Phone number" />
          <Select>
            <SelectTrigger
              className={cn(
                "w-full min-h-[51px] h-9 bg-transparent text-lg shadow-xs outline-none border-0 border-b border-[rgba(0,0,0,0.52)] rounded-none",
                "focus-visible:border-b-2 focus-visible:border-ring focus-visible:ring-0 [&>svg]:hidden text-black/50 px-0! font-arial"
              )}
            >
              <SelectValue placeholder="Select service" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="yoga">Yoga</SelectItem>
                <SelectItem value="dance">Dance</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* <Input type="text" placeholder="Select service" /> */}
        </div>
        <Textarea placeholder="Write the message" className="h-25" />
        <Button variant={"outline"} className="w-fit md:max-w-[250px] md:mt-3">
          Get Free Consultation
        </Button>
      </div>
    </div>
  );
};

export default ConsultationForm;
