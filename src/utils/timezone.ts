import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezonePlugin from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezonePlugin);


const normalizeTimezone = (tz: string): string => {
  const map: Record<string, string> = {
    "Asia/Calcutta": "Asia/Kolkata",
  };
  return map[tz] || tz;
};

const mapTimezoneToRegion = (tz: string): string => {
  const timezone = normalizeTimezone(tz);
  const offset = dayjs().tz(timezone).utcOffset(); 

  if (offset === 180 || offset === 240) {
    return "Gulf";
  }

  if (timezone.startsWith("Europe/")) {
    return "UK / Europe";
  }

  if (timezone.startsWith("America/")) {
    return "Canada / USA";
  }

  if (
    timezone.startsWith("Asia/") ||
    timezone.startsWith("Australia/") ||
    timezone.startsWith("Pacific/")
  ) {
    return "APAC";
  }

  return "APAC";
};


export const getUserRegion = (): {
  timezone: string;
  region: string;
} => {
  const tzGuess = dayjs.tz.guess();
  const timezone = normalizeTimezone(tzGuess);
  const region = mapTimezoneToRegion(timezone);

  console.log("🌍 Detected User Region:", { timezone, region });

  return { timezone, region };
};
