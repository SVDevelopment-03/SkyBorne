interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
}

export function Toggle2({ checked, onChange, label, description }: ToggleProps) {
  return (
    <div className="flex items-start gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#b95e82] focus:ring-offset-2 ${
          checked ? 'bg-[#b95e82]' : 'bg-[#d4d4d4]'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
      {(label || description) && (
        <div className="flex-1">
          {label && (
            <div className="flex items-center gap-2">
              <span className="text-[#262626]">{label}</span>
            </div>
          )}
          {description && (
            <p className="text-[#737373] mt-1">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
