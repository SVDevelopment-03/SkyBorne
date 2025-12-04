import { ChevronDown } from 'lucide-react';

interface SelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  helper?: string;
}

export function Select({ label, value, onChange, options, placeholder, helper }: SelectProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block">
          {label}
        </label>
      )}
      {helper && (
        <p className="text-[#737373]">
          {helper}
        </p>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-white border border-[#d4d4d4] rounded-lg px-4 py-3 pr-10 text-[#262626] cursor-pointer hover:border-[#b95e82] focus:outline-none focus:ring-2 focus:ring-[#b95e82] focus:border-transparent transition-all"
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#737373] pointer-events-none" />
      </div>
    </div>
  );
}
