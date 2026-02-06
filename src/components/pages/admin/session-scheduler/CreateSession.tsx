/* eslint-disable @typescript-eslint/no-explicit-any */

// components/ClassScheduler.tsx
"use client";
import { useEffect, useState } from "react";
import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Select } from "@/components/ui/Select2";
import { TimePicker } from "@/components/ui/TimePicker";
import { Toggle2 } from "@/components/ui/Toggle2";
import { Badge } from "@/components/ui/Badge2";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  Clock,
  Globe,
  RotateCw,
  Star,
  Calendar as CalendarIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import { useGetActiveTrainersQuery } from "@/store/api/trainerApi";
import { useGetServicesQuery } from "@/store/api/publicApi";
import { useCreateMeetingMutation } from "@/store/api/meetingApi";
import useGetUser from "@/hooks/useGetUser";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { useRouter } from "next/navigation";
import { AnyARecord } from "dns";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);

// ============================================================================
// FIXED REGION/COUNTRY/TIMEZONE MAPPINGS
// ============================================================================

interface CountryData {
  id: string;
  displayLabel: string;
  timezone: string;
  gmtOffset: string; // e.g., "GMT+3", "GMT-5"
  replayTime: string;
}

interface RegionGroupData {
  groupName: string;
  countries: CountryData[];
}


// Define all region groups with their countries and timezones
const REGION_GROUPS: RegionGroupData[] = [
  {
    groupName: "Gulf",
    countries: [
      {
        id: "gulf-russia",
        displayLabel: "Russia/Moscow",
        timezone: "Europe/Moscow",
        gmtOffset: "GMT+3",
        replayTime: "1:00 PM",
      },
      {
        id: "gulf-uae",
        displayLabel: "UAE/Oman",
        timezone: "Asia/Dubai",
        gmtOffset: "GMT+4",
        replayTime: "2:00 PM",
      },
      {
        id: "gulf-iraq",
        displayLabel: "Asia/Iraq-Bahrain-Qatar-Saudi-K",
        timezone: "Asia/Baghdad",
        gmtOffset: "GMT+3",
        replayTime: "1:00 PM",
      },
    ],
  },
  {
    groupName: "APAC",
    countries: [
      {
        id: "apac-perth",
        displayLabel: "Australia-Perth",
        timezone: "Australia/Perth",
        gmtOffset: "GMT+8",
        replayTime: "6:00 PM",
      },
      {
        id: "apac-eucla",
        displayLabel: "Australia-Eucla",
        timezone: "Australia/Eucla",
        gmtOffset: "GMT+8:45",
        replayTime: "6:45 PM",
      },
      {
        id: "apac-darwin",
        displayLabel: "Australia-Darwin",
        timezone: "Australia/Darwin",
        gmtOffset: "GMT+9:30",
        replayTime: "7:30 PM",
      },
      {
        id: "apac-brisbane",
        displayLabel: "Australia-Brisbane",
        timezone: "Australia/Brisbane",
        gmtOffset: "GMT+10",
        replayTime: "8:00 PM",
      },
      {
        id: "apac-adelaide",
        displayLabel: "Australia-Adelaide",
        timezone: "Australia/Adelaide",
        gmtOffset: "GMT+10:30",
        replayTime: "8:30 PM",
      },
      {
        id: "apac-sydney",
        displayLabel: "Australia-Sydney",
        timezone: "Australia/Sydney",
        gmtOffset: "GMT+11",
        replayTime: "9:00 PM",
      },
      {
        id: "apac-nz",
        displayLabel: "New Zealand",
        timezone: "Pacific/Auckland",
        gmtOffset: "GMT+12",
        replayTime: "10:00 PM",
      },
      {
        id: "apac-hongkong",
        displayLabel: "Asia/Hong Kong",
        timezone: "Asia/Hong_Kong",
        gmtOffset: "GMT+8",
        replayTime: "6:00 PM",
      },
      {
        id: "apac-vietnam",
        displayLabel: "Vietnam",
        timezone: "Asia/Ho_Chi_Minh",
        gmtOffset: "GMT+7",
        replayTime: "5:00 PM",
      },
      {
        id: "apac-malaysia",
        displayLabel: "Malaysia",
        timezone: "Asia/Kuala_Lumpur",
        gmtOffset: "GMT+8",
        replayTime: "6:00 PM",
      },
      {
        id: "apac-philippines",
        displayLabel: "Philippines",
        timezone: "Asia/Manila",
        gmtOffset: "GMT+8",
        replayTime: "6:00 PM",
      },
      {
        id: "apac-shanghai",
        displayLabel: "Shanghai",
        timezone: "Asia/Shanghai",
        gmtOffset: "GMT+8",
        replayTime: "6:00 PM",
      },
      {
        id: "apac-singapore",
        displayLabel: "Singapore",
        timezone: "Asia/Singapore",
        gmtOffset: "GMT+8",
        replayTime: "6:00 PM",
      },
      {
        id: "apac-india",
        displayLabel: "India",
        timezone: "Asia/Kolkata",
        gmtOffset: "GMT+5:30",
        replayTime: "4:30 PM",
      },
    ],
  },
  {
    groupName: "Canada/USA",
    countries: [
      {
        id: "canus-vancouver",
        displayLabel: "Canada-Vancouver",
        timezone: "America/Vancouver",
        gmtOffset: "GMT-7",
        replayTime: "7:00 AM",
      },
      {
        id: "canus-edmonton",
        displayLabel: "Canada-Edmonton",
        timezone: "America/Edmonton",
        gmtOffset: "GMT-6",
        replayTime: "8:00 AM",
      },
      {
        id: "canus-winnipeg",
        displayLabel: "Canada-Winnipeg",
        timezone: "America/Winnipeg",
        gmtOffset: "GMT-5",
        replayTime: "9:00 AM",
      },
      {
        id: "canus-toronto",
        displayLabel: "Canada-Toronto",
        timezone: "America/Toronto",
        gmtOffset: "GMT-4",
        replayTime: "10:00 AM",
      },
      {
        id: "canus-atlantic",
        displayLabel: "Canada-Atlantic",
        timezone: "America/Halifax",
        gmtOffset: "GMT-3",
        replayTime: "11:00 AM",
      },
      {
        id: "canus-chicago",
        displayLabel: "USA-Chicago",
        timezone: "America/Chicago",
        gmtOffset: "GMT-6",
        replayTime: "8:00 AM",
      },
      {
        id: "canus-la",
        displayLabel: "USA-Los Angeles",
        timezone: "America/Los_Angeles",
        gmtOffset: "GMT-9",
        replayTime: "5:00 AM",
      },
      {
        id: "canus-grenada",
        displayLabel: "Grenada",
        timezone: "America/Grenada",
        gmtOffset: "GMT-4",
        replayTime: "10:00 AM",
      },
    ],
  },
  {
    groupName: "UK/Europe",
    countries: [
      {
        id: "eu-uk",
        displayLabel: "UK",
        timezone: "Europe/London",
        gmtOffset: "GMT+1",
        replayTime: "3:00 PM",
      },
      {
        id: "eu-ireland",
        displayLabel: "Ireland",
        timezone: "Europe/Dublin",
        gmtOffset: "GMT+1",
        replayTime: "3:00 PM",
      },
      {
        id: "eu-portugal",
        displayLabel: "Portugal",
        timezone: "Europe/Lisbon",
        gmtOffset: "GMT+1",
        replayTime: "3:00 PM",
      },
      {
        id: "eu-spain",
        displayLabel: "Spain",
        timezone: "Europe/Madrid",
        gmtOffset: "GMT+2",
        replayTime: "4:00 PM",
      },
      {
        id: "eu-italy",
        displayLabel: "Italy",
        timezone: "Europe/Rome",
        gmtOffset: "GMT+2",
        replayTime: "4:00 PM",
      },
      {
        id: "eu-france",
        displayLabel: "France",
        timezone: "Europe/Paris",
        gmtOffset: "GMT+2",
        replayTime: "4:00 PM",
      },
      {
        id: "eu-germany",
        displayLabel: "Germany",
        timezone: "Europe/Berlin",
        gmtOffset: "GMT+2",
        replayTime: "4:00 PM",
      },
      {
        id: "eu-netherlands",
        displayLabel: "Netherlands",
        timezone: "Europe/Amsterdam",
        gmtOffset: "GMT+2",
        replayTime: "4:00 PM",
      },
      {
        id: "eu-cyprus",
        displayLabel: "Cyprus",
        timezone: "Europe/Nicosia",
        gmtOffset: "GMT+3",
        replayTime: "5:00 PM",
      },
      {
        id: "eu-malta",
        displayLabel: "Malta",
        timezone: "Europe/Malta",
        gmtOffset: "GMT+2",
        replayTime: "4:00 PM",
      },
      {
        id: "eu-romania",
        displayLabel: "Romania",
        timezone: "Europe/Bucharest",
        gmtOffset: "GMT+3",
        replayTime: "5:00 PM",
      },
      {
        id: "eu-scotland",
        displayLabel: "Scotland",
        timezone: "Europe/London",
        gmtOffset: "GMT+1",
        replayTime: "3:00 PM",
      },
      {
        id: "eu-dublin",
        displayLabel: "Dublin",
        timezone: "Europe/Dublin",
        gmtOffset: "GMT+1",
        replayTime: "3:00 PM",
      },
      {
        id: "eu-armenia",
        displayLabel: "Armenia",
        timezone: "Asia/Yerevan",
        gmtOffset: "GMT+4",
        replayTime: "6:00 PM",
      },
      {
        id: "eu-austria",
        displayLabel: "Austria",
        timezone: "Europe/Vienna",
        gmtOffset: "GMT+2",
        replayTime: "4:00 PM",
      },
      {
        id: "eu-croatia",
        displayLabel: "Croatia",
        timezone: "Europe/Zagreb",
        gmtOffset: "GMT+2",
        replayTime: "4:00 PM",
      },
      {
        id: "eu-czechia",
        displayLabel: "Czech Republic",
        timezone: "Europe/Prague",
        gmtOffset: "GMT+2",
        replayTime: "4:00 PM",
      },
      {
        id: "eu-denmark",
        displayLabel: "Denmark",
        timezone: "Europe/Copenhagen",
        gmtOffset: "GMT+2",
        replayTime: "4:00 PM",
      },
      {
        id: "eu-finland",
        displayLabel: "Finland",
        timezone: "Europe/Helsinki",
        gmtOffset: "GMT+3",
        replayTime: "5:00 PM",
      },
      {
        id: "eu-greece",
        displayLabel: "Greece",
        timezone: "Europe/Athens",
        gmtOffset: "GMT+3",
        replayTime: "5:00 PM",
      },
      {
        id: "eu-hungary",
        displayLabel: "Hungary",
        timezone: "Europe/Budapest",
        gmtOffset: "GMT+2",
        replayTime: "4:00 PM",
      },
      {
        id: "eu-latvia",
        displayLabel: "Latvia",
        timezone: "Europe/Riga",
        gmtOffset: "GMT+3",
        replayTime: "5:00 PM",
      },
      {
        id: "eu-lithuania",
        displayLabel: "Lithuania",
        timezone: "Europe/Vilnius",
        gmtOffset: "GMT+3",
        replayTime: "5:00 PM",
      },
      {
        id: "eu-slovakia",
        displayLabel: "Slovakia",
        timezone: "Europe/Bratislava",
        gmtOffset: "GMT+2",
        replayTime: "4:00 PM",
      },
      {
        id: "eu-poland",
        displayLabel: "Poland",
        timezone: "Europe/Warsaw",
        gmtOffset: "GMT+2",
        replayTime: "4:00 PM",
      },
      {
        id: "eu-sweden",
        displayLabel: "Sweden",
        timezone: "Europe/Stockholm",
        gmtOffset: "GMT+2",
        replayTime: "4:00 PM",
      },
      {
        id: "eu-switzerland",
        displayLabel: "Switzerland",
        timezone: "Europe/Zurich",
        gmtOffset: "GMT+2",
        replayTime: "4:00 PM",
      },
      {
        id: "eu-africa-dar",
        displayLabel: "Africa/Dar es Salaam",
        timezone: "Africa/Dar_es_Salaam",
        gmtOffset: "GMT+3",
        replayTime: "5:00 PM",
      },
      {
        id: "eu-africa-freetown",
        displayLabel: "Africa/Freetown",
        timezone: "Africa/Freetown",
        gmtOffset: "GMT+0",
        replayTime: "2:00 PM",
      },
      {
        id: "eu-africa-johannesburg",
        displayLabel: "Africa/Johannesburg",
        timezone: "Africa/Johannesburg",
        gmtOffset: "GMT+2",
        replayTime: "4:00 PM",
      },
      {
        id: "eu-nigeria",
        displayLabel: "Nigeria",
        timezone: "Africa/Lagos",
        gmtOffset: "GMT+1",
        replayTime: "3:00 PM",
      },
    ],
  },
];

// ============================================================================
// END MAPPINGS
// ============================================================================

interface TimezoneConversion {
  region: string;
  country: string;
  gmtOffset: string;
  localTime: string;
  timezone: string;
  mode: "live" | "replay";
  date: string;
}

interface ClassSchedulerProps {
  onSuccess?: () => void;
}

interface FormValues {
  service: string;
  title: string;
  date: Date | undefined;
  liveRegionGroup: string;
  liveCountry: string;
  liveTime: string;
  trainer: string;
  duration: number;
  autoRecording: boolean;
    recurringType: "" | "weekly" | "monthly" | "custom";
  customInterval: number | "";
}

const validationSchema = Yup.object().shape({
  service: Yup.string().required("Service is required"),
  title: Yup.string().required("Title is required"),
  date: Yup.date().required("Date is required").typeError("Date is required"),
  liveRegionGroup: Yup.string().required("Region is required"),
  liveCountry: Yup.string(),
  liveTime: Yup.string().required("Live time is required"),
  trainer: Yup.string().required("Trainer is required"),
  duration: Yup.number()
    .required("Duration is required")
    .min(30, "Duration must be at least 30 minutes")
    .max(480, "Duration cannot exceed 8 hours"),
  autoRecording: Yup.boolean(),
    recurringType: Yup.string()
  .nullable()
  .when("autoRecording", {
    is: true,
    then: (schema) =>
      schema.required("Please select a recurring type"),
    otherwise: (schema) => schema.notRequired(),
  }),
  customInterval: Yup.number()
  .nullable()
  .when("recurringType", {
    is: (val:any) => val === "custom",
    then: (schema) => schema.required("Custom interval is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export function CreateSession({ onSuccess }: ClassSchedulerProps) {
  const router = useRouter();
  const { data, isLoading } = useGetActiveTrainersQuery({
    page: 1,
    limit: 100,
    search: "",
  });
  const [createMeeting] = useCreateMeetingMutation();
  const { user } = useGetUser();
  let timezoneConversions: any;

  const { data: serviceData, isLoading: serviceLoading } =
    useGetServicesQuery(undefined);

  const [serviceOptions, setServiceOption] = useState<
    { label: string; value: string }[] | null
  >(null);

  const [trainerOptions, setTrainerOptions] = useState<
    { label: string; value: string }[] | null
  >(null);

  const [regionGroupOptions, setRegionGroupOptions] = useState<
    { label: string; value: string }[] | null
  >(null);

  const [countryOptions, setCountryOptions] = useState<
    { label: string; value: string }[] | null
  >(null);

  const [showModal, setShowModal] = useState(false);
  const [buttonState, setButtonState] = useState<"default" | "success">(
    "default"
  );

  // Initialize region group options on mount
  useEffect(() => {
    const groupOptions = REGION_GROUPS.map((group) => ({
      label: group.groupName,
      value: group.groupName,
    }));
    setRegionGroupOptions(groupOptions);
  }, []);

  useEffect(() => {
    if (!serviceLoading && Array.isArray(serviceData?.data)) {
      const formatted = serviceData?.data.map((item: any) => ({
        label: item.title || item.name,
        value: item._id,
      }));
      setServiceOption(formatted);
    }
  }, [serviceData?.data, serviceLoading]);

  useEffect(() => {
    if (!isLoading && Array.isArray(data?.data)) {
      const formatted = data?.data.map((item: any) => ({
        label: item?.name,
        value: item?._id,
      }));
      setTrainerOptions(formatted);
    }
  }, [data?.data, isLoading]);

  const convertTimeTo24Hour = (time12h: string): string => {
    const [time, period] = time12h.split(" ");
    const [hours, minutes] = time.split(":").map(Number);

    let hours24 = hours;
    if (period === "PM" && hours !== 12) hours24 += 12;
    if (period === "AM" && hours === 12) hours24 = 0;

    return `${String(hours24).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}`;
  };

  // Get country data by country ID
  const getCountryData = (countryId: string): CountryData | null => {
    for (const group of REGION_GROUPS) {
      const country = group.countries.find((c) => c.id === countryId);
      if (country) return country;
    }
    return null;
  };

  const getTimezoneConversions = (
    liveCountryId: string,
    liveRegionGroup: string,
    liveTime: string,
    date: Date | undefined,
    duration: number = 60
  ): TimezoneConversion[] => {
    // If country is not selected, use first country in the region as reference
    let countryToUseId = liveCountryId;
    
    if (!countryToUseId && liveRegionGroup) {
      const regionGroup = REGION_GROUPS.find((g) => g.groupName === liveRegionGroup);
      if (regionGroup && regionGroup.countries.length > 0) {
        countryToUseId = regionGroup.countries[0].id;
      }
    }

    if (!countryToUseId || !liveTime || !date) return [];

    const liveCountryData = getCountryData(countryToUseId);
    if (!liveCountryData) return [];

    const time24hStr = convertTimeTo24Hour(liveTime);
    const [liveHours, liveMinutes] = time24hStr.split(":").map(Number);

    // Create the live class start time in the live country's timezone
    const liveDateTime = dayjs.tz(
      new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        liveHours,
        liveMinutes
      ),
      liveCountryData.timezone
    );

    // Calculate when the class ends
    const classEndTime = liveDateTime.add(duration, "minutes");

    // Generate conversions for all regions
    const conversions: TimezoneConversion[] = [];

    for (const regionGroup of REGION_GROUPS) {
      for (const country of regionGroup.countries) {
        if (country.id === countryToUseId) {
          // Live region
          conversions.push({
            region: regionGroup.groupName,
            country: country.displayLabel,
            gmtOffset: country.gmtOffset,
            localTime: liveTime,
            timezone: country.timezone,
            mode: "live",
            date: dayjs(date).format("YYYY-MM-DD"),
          });
        } else {
          // Replay region
          const classEndTimeInRegion = classEndTime.tz(country.timezone);

          const time24hReplay = convertTimeTo24Hour(country.replayTime);
          const [replayHours, replayMinutes] = time24hReplay
            .split(":")
            .map(Number);

          const scheduledReplayTimeOnDate = dayjs.tz(
            new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate(),
              replayHours,
              replayMinutes
            ),
            country.timezone
          );

          const isBeforeLiveEnds =
            scheduledReplayTimeOnDate.isBefore(classEndTimeInRegion, "minute") ||
            scheduledReplayTimeOnDate.isSame(classEndTimeInRegion, "minute");

          let finalReplayDate = dayjs(date);
          if (isBeforeLiveEnds) {
            finalReplayDate = finalReplayDate.add(1, "day");
          }

          conversions.push({
            region: regionGroup.groupName,
            country: country.displayLabel,
            gmtOffset: country.gmtOffset,
            localTime: country.replayTime,
            timezone: country.timezone,
            mode: "replay",
            date: finalReplayDate.format("YYYY-MM-DD"),
          });
        }
      }
    }

    return conversions;
  };

  const handleRegionGroupChange = (groupName: string, setFieldValue: any) => {
    setFieldValue("liveRegionGroup", groupName);
    setFieldValue("liveCountry", "");

    // Find the region group and set country options
    const regionGroup = REGION_GROUPS.find((g) => g.groupName === groupName);
    if (regionGroup) {
      const options = regionGroup.countries.map((country) => ({
        label: `${country.displayLabel} (${country.gmtOffset})`,
        value: country.id,
      }));
      setCountryOptions(options);
    } else {
      setCountryOptions(null);
    }
  };

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, resetForm }: FormikHelpers<FormValues>
  ) => {
    try {
      setButtonState("default");

      if (!values.date) {
        toast.error("Please select a date");
        setSubmitting(false);
        return;
      }

      const time24h = convertTimeTo24Hour(values.liveTime);
      const [hours, minutes] = time24h?.split(":").map(Number);

      const localDateTime = new Date(
        values.date.getFullYear(),
        values.date.getMonth(),
        values.date.getDate(),
        hours,
        minutes
      );

      const liveCountryData = getCountryData(values.liveCountry);
      const liveCountryName = liveCountryData?.displayLabel || values.liveCountry;

      const payload = {
        service: values.service,
        liveRegion: values.liveRegionGroup,
        liveCountry: liveCountryName,
        liveTime: values.liveTime,
        trainer: values.trainer,
        title: values?.title,
        regions: timezoneConversions,
        duration: values.duration,
        startDate: values?.date,
        isRecurring: values.autoRecording,
         recurringType: values.autoRecording ? values?.recurringType : null,
        recurringDays:
          values?.autoRecording && values?.recurringType === "custom"
            ? values.customInterval
            : null,
        localTime: localDateTime.toISOString(),
        adminId: user?.id,
      };

      console.log("Sending payload:", payload);

      const data: any = await createMeeting(payload);

      if (data?.data?.success) {
        setButtonState("success");
        toast.success("Schedule saved successfully!");

        setTimeout(() => {
          setShowModal(true);
          router.push("/schedule-session");
          setTimeout(() => {
            setButtonState("default");
            resetForm();
            onSuccess?.();
          }, 2000);
        }, 500);
      } else {
        toast.error(data?.data?.message || "Failed to save schedule");
        setButtonState("default");
      }
    } catch (error: any) {
      console.error("Error saving schedule:", error);
      toast.error(error.message || "Error saving schedule");
      setButtonState("default");
    } finally {
      setSubmitting(false);
    }
  };

  const initialValues: FormValues = {
    service: "",
    date: undefined,
    liveRegionGroup: "",
    liveCountry: "",
    title: "",
    liveTime: "10:00 AM",
    trainer: "",
    duration: 60,
    recurringType: "",
    customInterval: "",
    
    autoRecording: true,
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, isSubmitting, setFieldValue }) => {
        timezoneConversions = getTimezoneConversions(
          values.liveCountry,
          values.liveRegionGroup,
          values.liveTime,
          values.date,
          values.duration
        );

        const currentService = serviceOptions?.find(
          (s) => s.value === values?.service
        );
        const serviceName = currentService?.label;

        const liveCountryData = getCountryData(values.liveCountry);

        const isFormValid =
          values.service &&
          values.date &&
          values.liveRegionGroup &&
          values.trainer &&
          values?.title &&
          values.duration > 0;

        return (
          <Form>
            <div className="space-y-8 pb-20 lg:pb-0">
              {/* Header */}
              <div className="space-y-2">
                <h1 className="text-[#262626]">Class Scheduler</h1>
                <p className="text-[#737373]">
                  Plan weekly classes, assign live time, and deliver recorded
                  sessions across global regions automatically.
                </p>
              </div>

              {/* Main Content Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-[#e5e5e5] p-6 md:p-8 space-y-8">
                {/* Section 1: Select Service */}
                {serviceOptions && (
                  <section className="space-y-4">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5 text-[#b95e82]" />
                      <h3 className="text-large text-[#262626]">
                        Select Service
                      </h3>
                    </div>
                    <Select
                      value={values.service}
                      onChange={(val) => setFieldValue("service", val)}
                      options={serviceOptions}
                      placeholder="Choose a service..."
                    />
                    {errors.service && touched.service && (
                      <p className="text-red-500 text-sm">{errors.service}</p>
                    )}
                  </section>
                )}

                <section className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-[#b95e82]" />
                    <h3 className="text-large text-[#262626]">Title & Date</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Title Field */}
                    <div>
                      <input
                        type="text"
                        name="title"
                        value={values.title}
                        onChange={(e) => setFieldValue("title", e.target.value)}
                        placeholder="Enter session title..."
                        className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b95e82]"
                      />
                      {errors.title && touched.title && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.title}
                        </p>
                      )}
                    </div>

                    {/* Date Picker */}
                    <div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="themeRect"
                            type="button"
                            className="w-full max-h-[50px] min-h-[50px] justify-start text-left font-normal bg-white border border-[#E5E5E5]! hover:bg-[#F3F3F5] text-[#262626]"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 text-[#b95e82]" />
                            {values.date
                              ? format(values.date, "PPP")
                              : "Pick a date"}
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            className="rounded-lg"
                            selected={values.date}
                            onSelect={(date) => setFieldValue("date", date)}
                            disabled={(date) =>
                              date < new Date(new Date().setHours(0, 0, 0, 0))
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>

                      {errors.date && touched.date && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.date}
                        </p>
                      )}
                    </div>
                  </div>
                </section>

                {/* Section 2: Set Live Region & Country */}
                <section className="space-y-4">
                  <div className="bg-gradient-to-r from-[#d4849f]/20 to-[#f9d5c7]/20 rounded-xl p-4 space-y-4">
                    <div className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-[#b95e82]" />
                      <h3 className="text-large text-[#262626]">
                        Live Class Slot (Primary Region)
                      </h3>
                    </div>
                    <p className="text-[#737373]">
                      This will be the live session for this week. All other
                      regions will receive the recorded version automatically.
                    </p>

                    <div className="grid md:grid-cols-3 gap-4">
                      {/* Region Group Dropdown */}
                      <div>
                        <Select
                          label="🌍 Select Region"
                          value={values.liveRegionGroup}
                          onChange={(val) =>
                            handleRegionGroupChange(val, setFieldValue)
                          }
                          options={regionGroupOptions || []}
                          placeholder="Choose region..."
                        />
                        {errors.liveRegionGroup && touched.liveRegionGroup && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.liveRegionGroup}
                          </p>
                        )}
                      </div>

                      {/* Country Dropdown */}
                      <div>
                        <Select
                          label="🏙️ Countries"
                          value={values.liveCountry}
                          onChange={(val) => setFieldValue("liveCountry", val)}
                          options={countryOptions || []}
                          placeholder="Choose countries..."
                         
                        />
                      </div>

                      {/* Time Picker */}
                      <div className="space-y-2">
                        <label className="block flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#b95e82]" />
                          Select Time
                        </label>
                        <TimePicker
                          value={values.liveTime}
                          onChange={(val) => setFieldValue("liveTime", val)}
                        />
                        {errors.liveTime && touched.liveTime && (
                          <p className="text-red-500 text-sm">
                            {errors.liveTime}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 3: Assign Trainer */}
                {trainerOptions && (
                  <section className="space-y-4">
                    <h4 className="text-[#262626]">Trainer</h4>
                    <Select
                      value={values.trainer}
                      onChange={(val) => setFieldValue("trainer", val)}
                      options={trainerOptions}
                      placeholder="Select a trainer..."
                    />
                    {errors.trainer && touched.trainer && (
                      <p className="text-red-500 text-sm">{errors.trainer}</p>
                    )}
                  </section>
                )}

                {/* Section 3.5: Duration */}
                <section className="space-y-4">
                  <h4 className="text-[#262626]">Duration (minutes)</h4>
                  <input
                    type="number"
                    name="duration"
                    value={values.duration}
                    onChange={(e) =>
                      setFieldValue("duration", parseInt(e.target.value) || 60)
                    }
                    onBlur={() => setFieldValue("duration", values.duration)}
                    min="30"
                    max="480"
                    className="w-full px-4 py-3 bg-[#F3F3F5] border border-[#e5e5e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b95e82]"
                    placeholder="Enter duration in minutes"
                  />
                  {errors.duration && touched.duration && (
                    <p className="text-red-500 text-sm">{errors.duration}</p>
                  )}
                </section>

                {/* Section 4: Global Time Conversion */}
                <section className="space-y-4">
                  <div>
                    <h3 className="text-large text-[#262626] mb-1">
                      Global Time Preview
                    </h3>
                    <p className="text-[#737373]">
                      Converted automatically based on user time zones.
                    </p>
                  </div>

                  <div className="border border-[#e5e5e5] rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-[#fafafa] border-b border-[#e5e5e5]">
                            <th className="px-4 py-3 text-left text-[#525252]">
                              Region
                            </th>
                            <th className="px-4 py-3 text-left text-[#525252]">
                              Country
                            </th>
                            <th className="px-4 py-3 text-left text-[#525252]">
                              GMT Offset
                            </th>
                            <th className="px-4 py-3 text-left text-[#525252]">
                              Local Time
                            </th>
                            <th className="px-4 py-3 text-left text-[#525252]">
                              Timezone
                            </th>
                            <th className="px-4 py-3 text-left text-[#525252]">
                              Mode
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {timezoneConversions.map(
                            (conversion: any, index: number) => (
                              <tr
                                key={index}
                                className={`border-b border-[#e5e5e5] last:border-b-0 transition-colors ${
                                  conversion.mode === "live"
                                    ? "bg-[#e8f5e9]"
                                    : "bg-[#fff9e6]"
                                }`}
                              >
                                <td className="px-4 py-3 text-[#262626]">
                                  {conversion.region}
                                </td>
                                <td className="px-4 py-3 text-[#262626]">
                                  {conversion.country}
                                </td>
                                <td className="px-4 py-3 text-[#525252] font-semibold">
                                  {conversion.gmtOffset}
                                </td>
                                <td className="px-4 py-3 text-[#525252]">
                                  <div className="flex flex-col">
                                    <span>{conversion.localTime}</span>
                                    <span className="text-xs text-[#737373]">
                                      {conversion.date}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-[#737373]">
                                  {conversion?.timezone}
                                </td>
                                <td className="px-4 py-3">
                                  {conversion.mode === "live" ? (
                                    <div className="flex flex-col gap-1 max-w-[100px]">
                                      <Badge type="live">
                                        <Star className="w-3.5 h-3.5" />
                                        Live
                                      </Badge>
                                    </div>
                                  ) : (
                                    <div className="flex flex-col gap-1 max-w-[100px]">
                                      <Badge type="replay">
                                        <RotateCw className="w-3.5 h-3.5" />
                                        Replay
                                      </Badge>
                                      {conversion.date !==
                                        dayjs(values.date).format(
                                          "YYYY-MM-DD"
                                        ) && (
                                        <span className="text-xs text-[#737373]">
                                          Next Day
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>

                {/* Section 5: Recording Logic */}
              <section className="space-y-4">
                  <div className="flex items-center">
                    <h4 className="text-[#262626] mr-4">Recurring Class</h4>

                    <Toggle2
                      checked={values.autoRecording}
                      onChange={(val) => {
                        setFieldValue("autoRecording", val);

                        if (val && !values.recurringType) {
                          setFieldValue("recurringType", "weekly");
                        }

                        if (!val) {
                          setFieldValue("recurringType", "");
                          setFieldValue("customInterval", "");
                        }
                      }}
                    />
                  </div>
                </section>

                {values.autoRecording && (
                  <section className="space-y-6">
                    {/* Recurring Type */}
                    <div className="space-y-3">
                      <h4 className="text-[#262626]">Recurring Type</h4>

                      {/* Responsive container */}
                      <div className="w-full sm:w-full md:w-[70%] lg:w-1/2">
                        <div className="grid grid-cols-3 gap-2">
                          {["weekly", "monthly", "custom"].map((type) => {
                            const isActive = values.recurringType === type;

                            return (
                              <button
                                key={type}
                                type="button"
                                onClick={() => {
                                  setFieldValue("recurringType", type);
                                  if (type !== "custom") {
                                    setFieldValue("customInterval", "");
                                  }
                                }}
                                className={`
                                  h-[42px]
                                  px-2
                                  rounded-md
                                  border
                                  flex items-center justify-center
                                  transition-all duration-200
                                  text-sm capitalize

                                  ${
                                    isActive
                                      ? "bg-[#f7e9ef] border-[#b95e82] text-[#b95e82]"
                                      : "bg-white border-[#e5e5e5] text-[#525252] hover:bg-[#fafafa]"
                                  }

                                  font-satoshi font-medium
                                `}
                              >
                                {type}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Recurring Days – ONLY FOR CUSTOM */}
                    {values.recurringType === "custom" && (
                      <div className="space-y-3">
                        <h4 className="text-[#262626]">Recurring Days</h4>
                        <p className="text-sm text-[#737373]">
                          This will be configured automatically based on selected recurring type.
                        </p>
                        <div className="max-w-[160px]">
                          <input
                            type="number"
                            min={1}
                            max={30}
                            value={values.customInterval}
                            onChange={(e) =>
                              setFieldValue(
                                "customInterval",
                                Math.min(30, Math.max(1, Number(e.target.value)))
                              )
                            }
                            placeholder="1–30"
                            className="w-full px-3 py-2 rounded-md border border-[#e5e5e5] focus:ring-2 focus:ring-[#b95e82]"
                          />
                        </div>
                      </div>
                    )}
                  </section>
                )}

                {/* CTA Area */}
                <section className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-[#e5e5e5]">
                  <button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    className={`flex-1 sm:flex-none px-8 py-3 rounded-lg transition-all duration-300 ${
                      buttonState === "success"
                        ? "bg-[#7bc67e] text-white"
                        : !isFormValid
                        ? "bg-[#e5e5e5] text-[#a3a3a3] cursor-not-allowed"
                        : "bg-[linear-gradient(270deg,_#FBEFD8_-21.76%,_#B95E82_100%)] text-white hover:opacity-90"
                    }`}
                  >
                    {isSubmitting
                      ? "Saving..."
                      : buttonState === "success"
                      ? "✓ Schedule Saved"
                      : "Save Schedule"}
                  </button>
                </section>
              </div>

              {/* Trainer Panel Card */}
              {values.service && values.trainer && values.liveCountry && (
                <div className="bg-white rounded-2xl shadow-sm border border-[#e5e5e5] p-6 space-y-4">
                  <h3 className="text-large text-[#262626]">
                    Trainer • Class Details
                  </h3>
                  <div className="bg-gradient-to-r from-[#d4849f]/10 to-[#f9d5c7]/10 rounded-xl p-4 space-y-3">
                    <div className="space-y-1">
                      <h4 className="text-[#262626] capitalize">
                        {serviceName} — Week 1
                      </h4>
                      <p className="text-[#737373]">
                        Date:{" "}
                        {values.date ? format(values.date, "PPP") : "Not set"}
                      </p>
                      <p className="text-[#737373]">
                        Live Region: {values.liveRegionGroup}
                      </p>
                      <p className="text-[#737373]">
                        Live Country: {liveCountryData?.displayLabel}
                      </p>
                      <p className="text-[#737373]">
                        Live Time: {values.liveTime} (
                        {liveCountryData?.timezone})
                      </p>
                      <p className="text-[#737373]">
                        Duration: {values.duration} minutes
                      </p>
                      <p className="text-[#737373]">
                        Replay Regions:{" "}
                        {timezoneConversions
                          .filter((t: any) => t.mode === "replay")
                          .map(
                            (t: any) => `${t.region} - ${t.country}`
                          )
                          .slice(0, 5)
                          .join(" • ")}
                        {timezoneConversions.filter((t: any) => t.mode === "replay")
                          .length > 5 && " ..."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Confirmation Modal */}
              <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Schedule Saved"
                message="Your class has been scheduled successfully. Users will now see session times adjusted to their local timezone."
              />
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}