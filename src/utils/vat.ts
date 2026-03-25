const normalizeCountryValue = (value?: string | null): string =>
  String(value ?? "").trim().toLowerCase();

const UAE_NAME_VARIANTS = new Set([
  "united arab emirates",
  "united arab emirates (the)",
  "uae",
  "ae",
]);

export const isUnitedArabEmirates = (
  country?: string | null,
  countryCode?: string | null,
): boolean => {
  const code = normalizeCountryValue(countryCode);
  if (code === "ae") return true;

  const name = normalizeCountryValue(country);
  return UAE_NAME_VARIANTS.has(name);
};

export const getVatRateForCountry = (
  country?: string | null,
  countryCode?: string | null,
): number => (isUnitedArabEmirates(country, countryCode) ? 0.05 : 0);

const roundCurrency = (value: number): number => {
  if (!Number.isFinite(value)) return 0;
  return Math.round((value + Number.EPSILON) * 100) / 100;
};

export const calculateVatFromBase = (baseAmount: number, vatRate: number) => {
  const subtotal = roundCurrency(baseAmount);
  const vatAmount = roundCurrency(subtotal * (vatRate || 0));
  const total = roundCurrency(subtotal + vatAmount);

  return {
    subtotal,
    vatAmount,
    total,
    vatRate: vatRate || 0,
  };
};
