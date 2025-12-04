import { useState } from 'react';

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function TimePicker({ value, onChange }: TimePickerProps) {
  const [hour, setHour] = useState('10');
  const [minute, setMinute] = useState('00');
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');

  const handleTimeChange = (newHour: string, newMinute: string, newPeriod: 'AM' | 'PM') => {
    const timeString = `${newHour}:${newMinute} ${newPeriod}`;
    onChange(timeString);
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={hour}
        onChange={(e) => {
          const val = e.target.value.replace(/\D/g, '').slice(0, 2);
          if (val === '' || (parseInt(val) >= 1 && parseInt(val) <= 12)) {
            setHour(val);
            handleTimeChange(val, minute, period);
          }
        }}
        placeholder="HH"
        maxLength={2}
        className="w-14 px-3 py-2 border border-[#d4d4d4] rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-[#b95e82] focus:border-transparent"
      />
      <span className="text-[#737373]">:</span>
      <input
        type="text"
        value={minute}
        onChange={(e) => {
          const val = e.target.value.replace(/\D/g, '').slice(0, 2);
          if (val === '' || parseInt(val) < 60) {
            setMinute(val);
            handleTimeChange(hour, val, period);
          }
        }}
        placeholder="MM"
        maxLength={2}
        className="w-14 px-3 py-2 border border-[#d4d4d4] rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-[#b95e82] focus:border-transparent"
      />
      <div className="flex border border-[#d4d4d4] rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => {
            setPeriod('AM');
            handleTimeChange(hour, minute, 'AM');
          }}
          className={`px-3 py-2 transition-colors ${
            period === 'AM' ? 'bg-[#b95e82] text-white' : 'bg-white text-[#737373] hover:bg-[#f5f5f5]'
          }`}
        >
          AM
        </button>
        <button
          type="button"
          onClick={() => {
            setPeriod('PM');
            handleTimeChange(hour, minute, 'PM');
          }}
          className={`px-3 py-2 transition-colors ${
            period === 'PM' ? 'bg-[#b95e82] text-white' : 'bg-white text-[#737373] hover:bg-[#f5f5f5]'
          }`}
        >
          PM
        </button>
      </div>
    </div>
  );
}
