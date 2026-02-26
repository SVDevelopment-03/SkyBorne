

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useSelector } from "react-redux";
import { useGetCountriesQuery } from "@/store/api/countryApi";


const normalizeCountry = (country: string) => {
  return country
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
  const user = useSelector((state: any) => state.auth.user);
  const userCountry = normalizeCountry(user?.country);

  console.log("userCountry", userCountry);

  // Fetch countries list (same as CountryManagement)
  const { data: countriesData, isLoading, isError } = useGetCountriesQuery({
    page: 1,
    limit: 1000,
    search: "",
  });

    console.log("country data", countriesData);


  const countries :any= countriesData?.data?.countries || [];
  const matchedCountry = countries?.find(
    (country: any) => normalizeCountry(country.name) === userCountry
  );
    console.log("matchedCountry", matchedCountry);

  const regionObject =
    matchedCountry?.region && typeof matchedCountry.region === "object"
      ? matchedCountry.region
      : null;
  const region = regionObject?.name ?? " ";
  const timezone = regionObject?.timezone ?? null;
  console.log("region", region);


  return {
    region,
    timezone,
    userCountry,
    isLoading,
    isError,
  };
};
