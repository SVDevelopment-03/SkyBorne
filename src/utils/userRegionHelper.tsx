/* eslint-disable @typescript-eslint/no-explicit-any */

import { ICountry, IRegion } from "@/store/api/countryApi";

/**
 * Normalizes country name by trimming whitespace and converting to lowercase
 * Removes parentheses syntax (e.g., "(the)"), articles, and extra spaces
 * @param country - Country name to normalize
 * @returns Normalized country name
 */
const normalizeCountryName = (country: string): string => {
  if (!country) return "";
  
  return country
    .trim()
    .toLowerCase()
    .replace(/\s*\([^)]*\)\s*/g, "")  // Remove (anything) including parentheses
    .replace(/\s+the\s*$/, "")        // Remove " the" at the end
    .replace(/\s+a\s*$/, "")          // Remove " a" at the end
    .replace(/\s+an\s*$/, "")         // Remove " an" at the end
    .trim();
};

/**
 * Finds the region for a user's country
 * @param userCountry - User's country name from store
 * @param countriesList - List of all countries with regions from the API
 * @returns Region object or null if not found
 */
export const getUserRegionFromCountry = (
  userCountry: string | null | undefined,
  countriesList: ICountry[]
): IRegion | null => {
  if (!userCountry || !countriesList || countriesList.length === 0) {
    return null;
  }

  const normalizedUserCountry = normalizeCountryName(userCountry);

  // Find matching country in the list
  const matchedCountry = countriesList.find((country) => {
    const normalizedListCountry = normalizeCountryName(country.name);
    return normalizedListCountry === normalizedUserCountry;
  });

  if (!matchedCountry) {
    return null;
  }

  // Return region if it's an object, otherwise it's just an ID (string)
  if (typeof matchedCountry.region === "object" && matchedCountry.region) {
    return matchedCountry.region as IRegion;
  }

  // If region is a string ID, we can't return full region object
  // You may need to populate it from API first
  return null;
};

/**
 * Gets user region data as a simple object
 * @param userCountry - User's country name from store
 * @param countriesList - List of all countries with regions from the API
 * @returns Object with region info or default values
 */
export const getUserRegionData = (
  userCountry: string | null | undefined,
  countriesList: ICountry[]
): {
  region: IRegion | null;
  countryFound: boolean;
} => {
  const region = getUserRegionFromCountry(userCountry, countriesList);
  const countryFound = countriesList.some(
    (country) =>
      normalizeCountryName(country.name) === normalizeCountryName(userCountry || "")
  );

  return {
    region,
    countryFound,
  };
};

/**
 * Gets just the region name for a user's country
 * @param userCountry - User's country name from store
 * @param countriesList - List of all countries with regions from the API
 * @returns Region name as string or "No Region"
 */
export const getUserRegionName = (
  userCountry: string | null | undefined,
  countriesList: ICountry[]
): string => {
  const region = getUserRegionFromCountry(userCountry, countriesList);
  
  if (!region) {
    return "No Region";
  }

  return region.name || "Unknown Region";
};