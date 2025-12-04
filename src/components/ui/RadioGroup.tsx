interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface RadioGroupProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
}

export function RadioGroup({ label, value, onChange, options }: RadioGroupProps) {
  return (
    <div className="space-y-3">
      {label && (
        <label className="block">
          {label}
        </label>
      )}
      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-start gap-3 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center mt-0.5">
              <input
                type="radio"
                name={label}
                value={option.value}
                checked={value === option.value}
                onChange={(e) => onChange(e.target.value)}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 rounded-full border-2 transition-all ${
                  value === option.value
                    ? 'border-[#b95e82] bg-[#b95e82]'
                    : 'border-[#d4d4d4] bg-white group-hover:border-[#b95e82]'
                }`}
              >
                {value === option.value && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1">
              <div className="text-[#262626]">{option.label}</div>
              {option.description && (
                <p className="text-[#737373] mt-0.5">
                  {option.description}
                </p>
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
