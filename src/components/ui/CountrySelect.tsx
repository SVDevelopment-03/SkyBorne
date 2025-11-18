import React, { useMemo } from "react";
import countryList from "react-select-country-list";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  touched?: boolean;
}

export interface SelectOptionItem {
  value: string;
  label: string;
}

export interface CommonSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  touched?: boolean;
  options: SelectOptionItem[]; // ⬅️ FIXED
}

const CountrySelect = ({
  value,
  onChange,
  error,
  touched,
}: CountrySelectProps) => {
  const options = useMemo(() => countryList().getData(), []);

  return (
    <div className="flex flex-col gap-[18px]">
      <Label>Country*</Label>

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full bg-[#F3F3F5] min-h-[55px] cursor-pointer">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>

        <SelectContent className="max-h-64 overflow-y-auto">
          {options.map((c) => (
            <SelectItem
              key={c.value}
              value={c.value}
              className="w-full min-h-12 text-base"
            >
              {c.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {touched && error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export const CommonSelect: React.FC<CommonSelectProps> = ({
  label,
  value,
  onChange,
  error,
  touched,
  options,
}) => {
  return (
    <div className="flex flex-col gap-[18px]">
      <Label>{label}</Label>

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full bg-[#F3F3F5] min-h-[55px] text-lg cursor-pointer">
          <SelectValue placeholder={`Select your ${label.toLowerCase()}`} />
        </SelectTrigger>

        <SelectContent className="max-h-64 overflow-y-auto">
          {options.map((item) => (
            <SelectItem
              key={item.value}
              value={item.value}
              className="w-full min-h-12 text-base"
            >
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {touched && error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default CountrySelect;
