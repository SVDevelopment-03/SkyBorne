interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function TimePicker({ value, onChange }: TimePickerProps) {
  // Parse the time string to get hour and minute
  const parseTime = (timeStr: string) => {
    const parts = timeStr.split(":");
    const hour = parts[0];
    const minuteAndPeriod = parts[1]?.split(" ");
    const minute = minuteAndPeriod?.[0] || "00";
    const period = minuteAndPeriod?.[1] || "AM";
    return { hour, minute, period };
  };

  const { hour, minute, period } = parseTime(value);

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={hour}
        disabled
        placeholder="HH"
        maxLength={2}
        className="w-14 px-3 py-2 border border-[#d4d4d4] rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-[#b95e82] focus:border-transparent bg-[#f5f5f5] text-[#737373] cursor-not-allowed"
      />
      <span className="text-[#737373]">:</span>
      <input
        type="text"
        value={minute}
        disabled
        placeholder="MM"
        maxLength={2}
        className="w-14 px-3 py-2 border border-[#d4d4d4] rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-[#b95e82] focus:border-transparent bg-[#f5f5f5] text-[#737373] cursor-not-allowed"
      />
      <div className="flex border border-[#d4d4d4] rounded-lg overflow-hidden">
        <button
          type="button"
          disabled
          className={`px-3 py-2 transition-colors cursor-not-allowed ${
            period === "AM"
              ? "bg-[#b95e82] text-white"
              : "bg-white text-[#737373] opacity-50"
          }`}
        >
          AM
        </button>
        <button
          type="button"
          disabled
          className={`px-3 py-2 transition-colors cursor-not-allowed ${
            period === "PM"
              ? "bg-[#b95e82] text-white"
              : "bg-white text-[#737373] opacity-50"
          }`}
        >
          PM
        </button>
      </div>
    </div>
  );
}
