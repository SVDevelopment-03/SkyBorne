import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import {
  useGetCountriesQuery,
} from "@/store/api/countryApi";
import type { ICountry, IRegion } from "@/store/api/countryApi";

const normalizeCountry = (country?: string | null) => {
  return String(country ?? "")
    .replace(/\s*\(.*?\)\s*/g, "") // remove parentheses + content
    .trim()
    .toLowerCase();
};


/**
 * Custom hook to get user's region from auth store
 * Uses country list from CountryManagement API
 * 
 * @returns Object with region info, user country, and loading state
 */
export const useUserRegionFromStore = () => {
  // Get user from auth store
  const user = useSelector((state: RootState) => state.auth.user);
  const userCountry = normalizeCountry(user?.country);

  // Fetch countries list (same as CountryManagement)
  const { data: countriesData, isLoading, isError } = useGetCountriesQuery({
    page: 1,
    limit: 1000,
    search: "",
  });

  const countries: ICountry[] = countriesData?.data?.countries || [];
  const matchedCountry = countries.find(
    (country) => normalizeCountry(country.name) === userCountry
  );

  const regionObject: IRegion | null =
    matchedCountry?.region && typeof matchedCountry.region === "object"
      ? (matchedCountry.region as IRegion)
      : null;
  const region = regionObject?.name ?? null;
  const timezone = regionObject?.timezone ?? null;

  return {
    region,
    timezone,
    userCountry,
    isLoading,
    isError,
  };
};
