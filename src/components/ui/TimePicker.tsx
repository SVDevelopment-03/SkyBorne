import { useEffect, useState } from "react";

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function TimePicker({ value, onChange }: TimePickerProps) {
  const parseTime = (timeStr: string) => {
    const [time = "10:00", period = "AM"] = timeStr.split(" ");
    const [hour = "10", minute = "00"] = time.split(":");
    return { hour, minute, period };
  };

  const parsed = parseTime(value);

  const [hour, setHour] = useState(parsed.hour);
  const [minute, setMinute] = useState(parsed.minute);
  const [period, setPeriod] = useState<"AM" | "PM">(parsed.period as "AM" | "PM");

  // Sync only when value changes externally
  useEffect(() => {
    setTimeout(() => {
      setHour(parsed.hour);
      setMinute(parsed.minute);
      setPeriod(parsed.period as "AM" | "PM");
    }, 0);
  }, [value]);

  const commit = (h: string, m: string, p: "AM" | "PM") => {
    onChange(`${h.padStart(2, "0")}:${m.padStart(2, "0")} ${p}`);
  };

  const getSafeHour = (h: string) => {
    const num = Number(h);
    if (Number.isNaN(num) || num < 1) return "01";
    return String(Math.min(num, 12)).padStart(2, "0");
  };

  const getSafeMinute = (m: string) => {
    const num = Number(m);
    if (Number.isNaN(num) || num < 0) return "00";
    return String(Math.min(num, 59)).padStart(2, "0");
  };

  // ---------- Hour ----------
const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const val = e.target.value.replace(/\D/g, "");

  // allow empty (so user can edit)
  if (val === "") {
    setHour("");
    commit("01", minute || "00", period);
    return;
  }

  // prevent typing > 12
  if (Number(val) > 12) return;

  setHour(val);
  commit(getSafeHour(val), getSafeMinute(minute || "00"), period);
};

const handleHourBlur = () => {
  let num = Number(hour);
  if (!num) num = 1;
  num = Math.min(Math.max(num, 1), 12);
  commit(String(num), minute || "00", period);
};


  // ---------- Minute ----------
  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    setMinute(val);
    commit(getSafeHour(hour || "01"), getSafeMinute(val || "00"), period);
  };

  const handleMinuteBlur = () => {
    let num = Number(minute);
    if (isNaN(num)) num = 0;
    num = Math.min(Math.max(num, 0), 59);
    commit(hour || "10", String(num), period);
  };

  // ---------- Period ----------
  const handlePeriodChange = (p: "AM" | "PM") => {
    setPeriod(p);
    commit(hour || "10", minute || "00", p);
  };

  return (
    // <div className="flex items-center gap-2">
    <div className="flex flex-wrap items-center gap-2 min-w-0">
      <input
        type="text"
        value={hour}
        onChange={handleHourChange}
        onBlur={handleHourBlur}
        placeholder="HH"
        maxLength={2}
        className="w-14 px-3 py-2 border rounded-lg text-center"
      />

      <span className="text-[#737373]">:</span>

      <input
        type="text"
        value={minute}
        onChange={handleMinuteChange}
        onBlur={handleMinuteBlur}
        placeholder="MM"
        maxLength={2}
        className="w-14 px-3 py-2 border rounded-lg text-center"
      />

      {/* <div className="flex border rounded-lg overflow-hidden"> */}
      <div className="flex border rounded-lg overflow-hidden flex-shrink-0">
        <button
          type="button"
          onClick={() => handlePeriodChange("AM")}
          className={`px-3 py-2 ${
            period === "AM" ? "bg-[#b95e82] text-white" : "bg-white"
          }`}
        >
          AM
        </button>
        <button
          type="button"
          onClick={() => handlePeriodChange("PM")}
          className={`px-3 py-2 ${
            period === "PM" ? "bg-[#b95e82] text-white" : "bg-white"
          }`}
        >
          PM
        </button>
      </div>
    </div>
  );
}
