import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";

export type PackageType =
  | "gold-yoga"
  | "gold-zumba"
  | "gold-mixed"
  | "diamond"
  | "platinum";

interface PackageSelectionProps {
  onSelect: (packageType: PackageType) => void;
}

interface GoldOption {
  id: PackageType;
  label: string;
  description: string;
}

const goldOptions: GoldOption[] = [
  {
    id: "gold-yoga",
    label: "2 Yoga",
    description: "",
  },
  {
    id: "gold-zumba",
    label: "2 Zumba",
    description: "",
  },
  {
    id: "gold-mixed",
    label: "Mixed",
    description: "(1 Yoga + 1 Zumba)",
  },
];

export function PackageSelection({ onSelect }: PackageSelectionProps) {
  const [selectedGoldOption, setSelectedGoldOption] =
    useState<PackageType | null>(null);
  const [goldAccordionOpen, setGoldAccordionOpen] = useState(false);
  const [diamondAccordionOpen, setDiamondAccordionOpen] = useState(false);
  const [platinumAccordionOpen, setPlatinumAccordionOpen] = useState(false);

  const handleGoldSelect = () => {
    if (selectedGoldOption) {
      onSelect(selectedGoldOption);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="mb-3 text-gray-800">Choose Your Plan</h1>
        <p className="text-gray-600">
          Select a membership that fits your wellness goals.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        {/* Gold Package Card with Radio Options */}
        <div className="Package_Card_Default bg-[#FFCFBD33] rounded-3xl p-8 shadow-sm border border-[#f0e5d8]">
          <div className="min-h-[570px]">
            <div className="mb-6">
              <div className="inline-block bg-white border border-[#e8d4c0] rounded-full px-5 py-2 mb-4">
                <span className="text-sm text-gray-700">🟡 Gold Package</span>
              </div>
              <h2 className="text-3xl text-gray-800 mb-2">
                $100 <span className="text-lg text-gray-600">/Month</span>
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Includes: 2 Classes per Month
              </p>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-700 mb-3">Choose Class Type:</p>

              <div className="space-y-3 bg-[#fcf6ef] rounded-2xl p-4">
                {goldOptions.map((option) => (
                  <div
                    key={option.id}
                    onClick={() => setSelectedGoldOption(option.id)}
                    className={`cursor-pointer rounded-xl p-3 transition-all ${
                      selectedGoldOption === option.id
                        ? "bg-white border-2 border-[#b97d9f]"
                        : "bg-white/60 border-2 border-transparent hover:border-[#d4a5bc]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          selectedGoldOption === option.id
                            ? "border-[#b97d9f] bg-[#b97d9f]"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedGoldOption === option.id && (
                          <div className="w-2.5 h-2.5 bg-white rounded-full" />
                        )}
                      </div>
                      <div className="flex-1">
                        <span className="text-sm text-gray-800">
                          {option.label} {option.description}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#fcf6ef] rounded-xl p-4 mb-6 text-sm">
              <p className="text-gray-800">
                Original Value: <span className="line-through">$120</span> → You
                Pay <span className="text-[#b97d9f]">$100</span>
              </p>
            </div>

            {/* Accordion for breakdown */}
            {/* <div className="border-t border-[#f0e5d8] pt-4 mb-6">
              <button
                onClick={() => setGoldAccordionOpen(!goldAccordionOpen)}
                className="flex items-center justify-between w-full text-sm text-gray-700 hover:text-[#b97d9f] transition-colors"
              >
                <span>📄 View Cost Calculation</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${
                    goldAccordionOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  goldAccordionOpen
                    ? "max-h-48 opacity-100 mt-4"
                    : "max-h-0 opacity-0"
                }`}
              >
                <table className="w-full text-sm">
                  <thead className="border-b border-[#f0e5d8]">
                    <tr className="text-left text-gray-600">
                      <th className="pb-2">Item</th>
                      <th className="pb-2 text-center">Qty</th>
                      <th className="pb-2 text-right">Rate</th>
                      <th className="pb-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    <tr className="border-b border-[#f5ebe0]">
                      <td className="py-2">Classes</td>
                      <td className="py-2 text-center">2</td>
                      <td className="py-2 text-right">$60</td>
                      <td className="py-2 text-right">$120</td>
                    </tr>
                    <tr className="border-b border-[#f5ebe0]">
                      <td className="py-2">Discount</td>
                      <td className="py-2 text-center">—</td>
                      <td className="py-2 text-right">17%</td>
                      <td className="py-2 text-right text-[#8b6f47]">-$20</td>
                    </tr>
                    <tr>
                      <td className="py-2">Total</td>
                      <td className="py-2 text-center">—</td>
                      <td className="py-2 text-right">—</td>
                      <td className="py-2 text-right text-[#b97d9f]">$100</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div> */}
          </div>
          <button
            onClick={handleGoldSelect}
            disabled={!selectedGoldOption}
            className="w-full bg-[#B95E82] hover:bg-[#a16685] text-white py-3 px-6 rounded-full transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Select Gold Package
          </button>
        </div>

        {/* Diamond Package Card */}
        <div className="Package_Card_Default bg-[#FFCFBD33] rounded-3xl p-8 shadow-sm border border-[#f0e5d8]">
          <div className="min-h-[570px]">
            <div className="mb-6">
              <div className="inline-block bg-white border border-[#e8d4c0] rounded-full px-5 py-2 mb-4">
                <span className="text-sm text-gray-700">
                  💎 Diamond Package
                </span>
              </div>
              <h2 className="text-3xl text-gray-800 mb-2">
                $200 <span className="text-lg text-gray-600">/Month</span>
              </h2>
              <p className="text-sm text-gray-600 mb-4">Includes:</p>
            </div>

            <div className="bg-[#fcf6ef] rounded-2xl p-5 mb-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#b97d9f] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-800">2 Yoga Classes</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#b97d9f] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-800">2 Zumba Classes</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#fcf6ef] rounded-xl p-4 mb-6 text-sm">
              <p className="text-gray-800">
                Original Value: <span className="line-through">$240</span> → You
                Pay <span className="text-[#b97d9f]">$200</span>
              </p>
            </div>

            {/* Accordion for breakdown */}
            {/* <div className="border-t border-[#f0e5d8] pt-4 mb-6">
              <button
                onClick={() => setDiamondAccordionOpen(!diamondAccordionOpen)}
                className="flex items-center justify-between w-full text-sm text-gray-700 hover:text-[#b97d9f] transition-colors"
              >
                <span>📄 View Cost Calculation</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${
                    diamondAccordionOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  diamondAccordionOpen
                    ? "max-h-64 opacity-100 mt-4"
                    : "max-h-0 opacity-0"
                }`}
              >
                <table className="w-full text-sm">
                  <thead className="border-b border-[#f0e5d8]">
                    <tr className="text-left text-gray-600">
                      <th className="pb-2">Item</th>
                      <th className="pb-2 text-center">Qty</th>
                      <th className="pb-2 text-right">Rate</th>
                      <th className="pb-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    <tr className="border-b border-[#f5ebe0]">
                      <td className="py-2">Yoga</td>
                      <td className="py-2 text-center">2</td>
                      <td className="py-2 text-right">$60</td>
                      <td className="py-2 text-right">$120</td>
                    </tr>
                    <tr className="border-b border-[#f5ebe0]">
                      <td className="py-2">Zumba</td>
                      <td className="py-2 text-center">2</td>
                      <td className="py-2 text-right">$60</td>
                      <td className="py-2 text-right">$120</td>
                    </tr>
                    <tr className="border-b border-[#f5ebe0]">
                      <td className="py-2">Discount</td>
                      <td className="py-2 text-center">—</td>
                      <td className="py-2 text-right">17%</td>
                      <td className="py-2 text-right text-[#8b6f47]">-$40</td>
                    </tr>
                    <tr>
                      <td className="py-2">Total</td>
                      <td className="py-2 text-center">—</td>
                      <td className="py-2 text-right">—</td>
                      <td className="py-2 text-right text-[#b97d9f]">$200</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div> */}
          </div>
          <button
            onClick={() => onSelect("diamond")}
            className="w-full bg-[#B95E82] hover:bg-[#a16685] text-white py-3 px-6 rounded-full transition-all duration-300"
          >
            Select Diamond Package
          </button>
        </div>

        {/* Platinum Package Card */}
        <div className="Package_Card_Default relative bg-[#B95E82] rounded-3xl p-8 shadow-lg text-white">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-[#b97d9f] px-4 py-1 rounded-full text-sm shadow-md">
            ⭐ Best Value
          </div>
          <div className="min-h-[570px]">
            <div className="mb-6 mt-2">
              <div className="inline-block bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-5 py-2 mb-4">
                <span className="text-sm text-white">🔷 Platinum Package</span>
              </div>
              <h2 className="text-3xl mb-2">
                $300 <span className="text-lg opacity-90">/Month</span>
              </h2>
              <p className="text-sm opacity-90 mb-4">Includes:</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 mb-6 border border-white/20">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">2 Yoga Classes</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">2 Zumba Classes</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">1 Specialized Class</span>
                </li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6 text-sm border border-white/20">
              <p>
                Original Value:{" "}
                <span className="line-through opacity-75">$360</span> → You Pay{" "}
                <span className="font-medium">$300</span>
              </p>
            </div>

            {/* Accordion for breakdown */}
            {/* <div className="border-t border-white/20 pt-4 mb-6">
              <button
                onClick={() => setPlatinumAccordionOpen(!platinumAccordionOpen)}
                className="flex items-center justify-between w-full text-sm text-white hover:text-white/80 transition-colors"
              >
                <span>📄 View Cost Calculation</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${
                    platinumAccordionOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  platinumAccordionOpen
                    ? "max-h-80 opacity-100 mt-4"
                    : "max-h-0 opacity-0"
                }`}
              >
                <table className="w-full text-sm">
                  <thead className="border-b border-white/20">
                    <tr className="text-left text-white/90">
                      <th className="pb-2">Item</th>
                      <th className="pb-2 text-center">Qty</th>
                      <th className="pb-2 text-right">Rate</th>
                      <th className="pb-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="text-white/90">
                    <tr className="border-b border-white/10">
                      <td className="py-2">Yoga</td>
                      <td className="py-2 text-center">2</td>
                      <td className="py-2 text-right">$60</td>
                      <td className="py-2 text-right">$120</td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="py-2">Zumba</td>
                      <td className="py-2 text-center">2</td>
                      <td className="py-2 text-right">$60</td>
                      <td className="py-2 text-right">$120</td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="py-2">Specialized</td>
                      <td className="py-2 text-center">1</td>
                      <td className="py-2 text-right">$120</td>
                      <td className="py-2 text-right">$120</td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="py-2">Discount</td>
                      <td className="py-2 text-center">—</td>
                      <td className="py-2 text-right">17%</td>
                      <td className="py-2 text-right">-$60</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-white">Total</td>
                      <td className="py-2 text-center">—</td>
                      <td className="py-2 text-right">—</td>
                      <td className="py-2 text-right text-white">$300</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div> */}
          </div>
          <button
            onClick={() => onSelect("platinum")}
            className="w-full bg-white text-[#b97d9f] hover:bg-white/95 py-3 px-6 rounded-full transition-all duration-300"
          >
            Select Platinum Package
          </button>
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600">Flexible sessions. No lock-in.</p>
      </div>
    </div>
  );
}
