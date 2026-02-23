/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { useEffect, useState } from "react";
import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useRouter, useParams } from "next/navigation";
import { Select } from "@/components/ui/Select2";
import { TimePicker } from "@/components/ui/TimePicker";
import { Toggle2 } from "@/components/ui/Toggle2";
import { Badge } from "@/components/ui/Badge2";
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
  Loader,
  ArrowLeft,
  MapPin,
} from "lucide-react";
import toast from "react-hot-toast";
import { useGetActiveTrainersQuery } from "@/store/api/trainerApi";
import { useGetServicesQuery } from "@/store/api/publicApi";
import {
  useUpdateMeetingMutation,
  useGetMeetingByIdQuery,
} from "@/store/api/meetingApi";
import { useGetAllActiveRegionsQuery } from "@/store/api/regionApi";
import { useGetCountriesQuery } from "@/store/api/countryApi";
import useGetUser from "@/hooks/useGetUser";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);

interface TimezoneConversion {
  region: string;
  localTime: string;
  timezone: string;
  mode: "live" | "replay";
  date: string;
}

interface FormValues {
  service: string;
  title: string;
  fromDate: Date | undefined;
  toDate: Date | undefined;
  liveRegion: string;
  liveTime: string;
  trainer: string;
  duration: number;
  recurringClass: boolean;
  recurrenceType: "weekly" | "monthly" | "custom" | "bi-weekly";
  customDays: number[];
}

const validationSchema = Yup.object().shape({
  service: Yup.string().required("Service is required"),
  title: Yup.string().required("Title is required"),
  fromDate: Yup.date()
    .required("From date is required")
    .typeError("From date is required"),
  toDate: Yup.date()
    .required("To date is required")
    .typeError("To date is required")
    .min(Yup.ref("fromDate"), "To date must be after or equal to from date"),
  liveRegion: Yup.string().required("Live region is required"),
  liveTime: Yup.string().required("Live time is required"),
  trainer: Yup.string().required("Trainer is required"),
  duration: Yup.number()
    .required("Duration is required")
    .min(30, "Duration must be at least 30 minutes")
    .max(480, "Duration cannot exceed 8 hours"),
  recurringClass: Yup.boolean(),
  recurrenceType: Yup.string().when("recurringClass", {
    is: true,
    then: (schema) =>
      schema
        .required("Recurrence type is required")
        .oneOf(["weekly", "monthly", "custom", "bi-weekly"], "Invalid recurrence type"),
  }),
  customDays: Yup.array().when("recurrenceType", {
    is: (value: string) => value === "custom" || value === "bi-weekly",
    then: (schema) =>
      schema
        .of(Yup.number())
        .min(1, "Select at least one day for custom/bi-weekly recurrence"),
  }),
});

const DAYS_OF_WEEK = [
  { label: "Mon", value: 1 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 4 },
  { label: "Fri", value: 5 },
  { label: "Sat", value: 6 },
  { label: "Sun", value: 7 },
];

export default function EditMeeting() {
  const router = useRouter();
  const params = useParams();
  const meetingId = params.id as string;
  const { user } = useGetUser();

  // Queries
  const { data: meetingData, isLoading: meetingLoading } =
    useGetMeetingByIdQuery(meetingId, {
      skip: !meetingId,
    });

  const { data: trainersData, isLoading: trainersLoading } =
    useGetActiveTrainersQuery({
      page: 1,
      limit: 100,
      search: "",
    });

  const { data: serviceData, isLoading: servicesLoading } =
    useGetServicesQuery(undefined);

  const { data: regionsData, isLoading: regionsLoading } =
    useGetAllActiveRegionsQuery();

  const { data: countriesData, isLoading: countriesLoading } =
    useGetCountriesQuery({
      page: 1,
      limit: 1000,
      search: "",
    });

  // Mutations
  const [updateMeeting] = useUpdateMeetingMutation();

  // State
  const [serviceOptions, setServiceOption] = useState<
    { label: string; value: string }[] | null
  >(null);

  const [trainerOptions, setTrainerOptions] = useState<
    { label: string; value: string }[] | null
  >(null);

  const [regionOptions, setRegionOptions] = useState<
    { label: string; value: string }[] | null
  >(null);

  const [regionTimezones, setRegionTimezones] = useState<
    Record<string, string>
  >({});

  const [fixedReplayTimes, setFixedReplayTimes] = useState<
    Record<string, string>
  >({});

  const [showModal, setShowModal] = useState(false);
  const [buttonState, setButtonState] = useState<"default" | "success">(
    "default"
  );

  let timezoneConversions: any;

  const countries: any = countriesData?.data?.countries || [];

  // Build service options from API
  useEffect(() => {
    if (!servicesLoading && Array.isArray(serviceData?.data)) {
      const formatted = serviceData?.data.map((item: any) => ({
        label: item.title || item.name,
        value: item._id,
      }));
      setServiceOption(formatted);
    }
  }, [serviceData?.data, servicesLoading]);

  // Build trainer options from API
  useEffect(() => {
    if (!trainersLoading && Array.isArray(trainersData?.data)) {
      const formatted = trainersData?.data.map((item: any) => ({
        label: item?.name,
        value: item?._id,
      }));
      setTrainerOptions(formatted);
    }
  }, [trainersData?.data, trainersLoading]);

  // Build region options and mappings from API data
  useEffect(() => {
    if (!regionsLoading && Array.isArray(regionsData?.data)) {
      const regions = regionsData.data;

      const options = regions.map((region: any) => ({
        label: region.displayLabel,
        value: region._id,
      }));
      setRegionOptions(options);

      const timezones: Record<string, string> = {};
      regions.forEach((region: any) => {
        timezones[region._id] = region.timezone;
      });
      setRegionTimezones(timezones);

      const replayTimes: Record<string, string> = {};
      regions.forEach((region: any) => {
        replayTimes[region._id] = region.replayTime;
      });
      setFixedReplayTimes(replayTimes);
    }
  }, [regionsData?.data, regionsLoading]);

  // Get countries for selected region
  const getCountriesForRegion = (regionId: string) => {
    if (!regionId || !countries.length) return [];
    const countryData = countries.filter(
      (country: any) => country.region?._id === regionId
    );
    return countryData;
  };

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

  const getTimezoneConversions = (
    liveRegionId: string,
    liveTime: string,
    date: Date | undefined,
    duration: number = 60
  ): TimezoneConversion[] => {
    if (!liveRegionId || !liveTime || !date || !regionsData?.data) return [];

    const time24hStr = convertTimeTo24Hour(liveTime);
    const [liveHours, liveMinutes] = time24hStr.split(":").map(Number);

    const liveRegionTz = regionTimezones[liveRegionId];
    const liveDateTime = dayjs.tz(
      new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        liveHours,
        liveMinutes
      ),
      liveRegionTz
    );

    const classEndTime = liveDateTime.add(duration, "minutes");

    return regionsData.data.map((region: any) => {
      if (region._id === liveRegionId) {
        return {
          region: region.displayLabel,
          localTime: liveTime,
          timezone: region.timezone,
          mode: "live",
          date: dayjs(date).format("YYYY-MM-DD"),
        };
      }

      const classEndTimeInRegion = classEndTime.tz(region.timezone);
      const replayTimeStr = region.replayTime;
      const time24hReplay = convertTimeTo24Hour(replayTimeStr);
      const [replayHours, replayMinutes] = time24hReplay.split(":").map(Number);

      const scheduledReplayTimeOnDate = dayjs.tz(
        new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          replayHours,
          replayMinutes
        ),
        region.timezone
      );

      const isBeforeLiveEnds =
        scheduledReplayTimeOnDate.isBefore(classEndTimeInRegion, "minute") ||
        scheduledReplayTimeOnDate.isSame(classEndTimeInRegion, "minute");

      let finalReplayDate = dayjs(date);

      if (isBeforeLiveEnds) {
        finalReplayDate = finalReplayDate.add(1, "day");
      }

      return {
        region: region.displayLabel,
        localTime: replayTimeStr,
        timezone: region.timezone,
        mode: "replay",
        date: finalReplayDate.format("YYYY-MM-DD"),
      };
    });
  };

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    try {
      setButtonState("default");

      if (!values.fromDate || !values.toDate) {
        toast.error("Please select both from and to dates");
        setSubmitting(false);
        return;
      }

      const time24h = convertTimeTo24Hour(values.liveTime);
      const [hours, minutes] = time24h?.split(":").map(Number);

      const localDateTime = new Date(
        values.fromDate.getFullYear(),
        values.fromDate.getMonth(),
        values.fromDate.getDate(),
        hours,
        minutes
      );

      const liveRegionName =
        regionOptions?.find((r) => r.value === values.liveRegion)?.label ||
        values.liveRegion;

      const payload = {
        service: values.service,
        liveRegion: liveRegionName,
        liveTime: values.liveTime,
        trainer: values.trainer,
        title: values?.title,
        regions: timezoneConversions,
        duration: values.duration,
        startDate: values?.fromDate,
        weeklyEndDate: values?.toDate,
        recurringClass: values.recurringClass,
        recurrenceType: values.recurringClass ? values.recurrenceType : null,
        customDays:
          values.recurringClass &&
          (values.recurrenceType === "custom" ||
            values.recurrenceType === "bi-weekly")
            ? values.customDays
            : null,
        localTime: localDateTime.toISOString(),
      };

      await updateMeeting({ id: meetingId, body: payload }).unwrap();

      setButtonState("success");
      toast.success("Meeting updated successfully!");

      setTimeout(() => {
        setShowModal(true);
        router.push("/schedule-session");
        setTimeout(() => {
          setButtonState("default");
        }, 2000);
      }, 500);
    } catch (error: any) {
      console.error("Error updating meeting:", error);
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Error updating meeting",
      );
      setButtonState("default");
    } finally {
      setSubmitting(false);
    }
  };

  // Show loading state while fetching meeting data
  if (meetingLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin mx-auto mb-4 text-[#b95e82]" />
          <p className="text-[#737373]">Loading meeting details...</p>
        </div>
      </div>
    );
  }

  if (!meetingData?.data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-[#737373]">Meeting not found</p>
        <Button
          variant="theme"
          onClick={() => router.push("/schedule-session")}
        >
          Back to Meetings
        </Button>
      </div>
    );
  }

  const allDataLoaded =
    !regionsLoading && !trainersLoading && !servicesLoading && !countriesLoading;

  if (!allDataLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin mx-auto mb-4 text-[#b95e82]" />
          <p className="text-[#737373]">Loading form data...</p>
        </div>
      </div>
    );
  }

  const meeting = meetingData.data;

  const resolvedLiveRegionValue = (() => {
    const savedRegion = String(meeting.liveRegion || "").trim();
    if (!savedRegion) return "";

    // Prefer exact ID match first.
    const byId = regionsData?.data?.find((r: any) => r?._id === savedRegion);
    if (byId?._id) return byId._id;

    // Backward compatibility: older data may store display label instead of ID.
    const byLabel = regionsData?.data?.find(
      (r: any) =>
        String(r?.displayLabel || "")
          .trim()
          .toLowerCase() === savedRegion.toLowerCase(),
    );
    if (byLabel?._id) return byLabel._id;

    return "";
  })();

  const initialValues: FormValues = {
    service: meeting.service?._id || "",
    fromDate: new Date(meeting.startDate),
    toDate: meeting.weeklyEndDate ? new Date(meeting.weeklyEndDate) : undefined,
    liveRegion: resolvedLiveRegionValue,
    title: meeting.title || "",
    liveTime: meeting.liveTime || "10:00 AM",
    trainer: meeting.trainer?._id || "",
    duration: meeting.duration || 60,
    recurringClass: meeting.recurringClass || false,
    recurrenceType: (meeting.recurrenceType as "weekly" | "monthly" | "custom" | "bi-weekly") || "weekly",
    customDays: meeting.customDays || [],
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({
        values,
        errors,
        touched,
        isSubmitting,
        setFieldValue,
      }) => {
        timezoneConversions = getTimezoneConversions(
          values.liveRegion,
          values.liveTime,
          values.fromDate,
          values.duration
        );

        const currentService = serviceOptions?.find(
          (s) => s.value === values?.service
        );
        const serviceName = currentService?.label;

        const regionCountries = getCountriesForRegion(values.liveRegion);

        const isFormValid =
          values.service &&
          values.fromDate &&
          values.toDate &&
          values.liveRegion &&
          values.trainer &&
          values?.title &&
          values.duration > 0 &&
          (!values.recurringClass ||
            (!["custom", "bi-weekly"].includes(values.recurrenceType) ||
              values.customDays.length > 0));

        return (
          <Form>
            <div className="space-y-8 pb-20 lg:pb-0">
              {/* Header with Back Button */}
              <div className="flex items-center gap-4 px-4">
                <button
                  type="button"
                  onClick={() => router.push("/schedule-session")}
                  className="p-2 hover:bg-[#f3f3f5] rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-[#262626]" />
                </button>
                <div className="space-y-2">
                  <h1 className="text-[#262626]">Edit Session</h1>
                  <p className="text-[#737373]">
                    Update class details and schedule across global regions.
                  </p>
                </div>
              </div>

              {/* Main Content Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-[#e5e5e5] p-6 md:p-8 space-y-8 mx-4">
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

                {/* Section 2: Title & Date Range */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-[#b95e82]" />
                    <h3 className="text-large text-[#262626]">
                      Title & Date Range
                    </h3>
                  </div>

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

                  {/* Date Range Pickers */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* From Date */}
                    <div>
                      <label className="block text-sm text-[#525252] mb-2">
                        From Date
                      </label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="themeRect"
                            type="button"
                            className="w-full max-h-[50px] min-h-[50px] justify-start text-left font-normal bg-white border border-[#E5E5E5]! hover:bg-[#F3F3F5] text-[#262626]"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 text-[#b95e82]" />
                            {values.fromDate
                              ? format(values.fromDate, "PPP")
                              : "Pick from date"}
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            className="rounded-lg"
                            selected={values.fromDate}
                            onSelect={(date) => setFieldValue("fromDate", date)}
                            disabled={(date) =>
                              date < new Date(new Date().setHours(0, 0, 0, 0))
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>

                      {errors.fromDate && touched.fromDate && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.fromDate}
                        </p>
                      )}
                    </div>

                    {/* To Date */}
                    <div>
                      <label className="block text-sm text-[#525252] mb-2">
                        To Date
                      </label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="themeRect"
                            type="button"
                            className="w-full max-h-[50px] min-h-[50px] justify-start text-left font-normal bg-white border border-[#E5E5E5]! hover:bg-[#F3F3F5] text-[#262626]"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 text-[#b95e82]" />
                            {values.toDate
                              ? format(values.toDate, "PPP")
                              : "Pick to date"}
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            className="rounded-lg"
                            selected={values.toDate}
                            onSelect={(date) => setFieldValue("toDate", date)}
                            disabled={(date) =>
                              !values.fromDate ||
                              date < values.fromDate
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>

                      {errors.toDate && touched.toDate && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.toDate}
                        </p>
                      )}
                    </div>
                  </div>
                </section>

                {/* Section 3: Recurring Class Options */}
                <section className="space-y-4">
                  <div className="bg-[#f5f5f5] rounded-xl p-4">
                    <Toggle2
                      checked={values.recurringClass}
                      onChange={(val) => {
                        setFieldValue("recurringClass", val);
                        if (!val) {
                          setFieldValue("customDays", []);
                        }
                      }}
                      label="Recurring Class"
                      description="Enable to create recurring class sessions"
                    />

                    {values.recurringClass && (
                      <div className="mt-6 space-y-4">
                        {/* Recurrence Type Selection */}
                        <div>
                          <label className="block text-sm text-[#525252] mb-2">
                            Recurrence Pattern
                          </label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {["weekly", "monthly", "custom", "bi-weekly"].map((type) => (
                              <button
                                key={type}
                                type="button"
                                onClick={() =>
                                  setFieldValue("recurrenceType", type)
                                }
                                className={`px-4 py-3 rounded-lg border-2 transition-all capitalize ${
                                  values.recurrenceType === type
                                    ? "border-[#b95e82] bg-[#b95e82]/10 text-[#b95e82]"
                                    : "border-[#e5e5e5] bg-white text-[#737373] hover:border-[#b95e82]/30"
                                }`}
                              >
                                {type}
                              </button>
                            ))}
                          </div>
                          {errors.recurrenceType && touched.recurrenceType && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.recurrenceType}
                            </p>
                          )}
                        </div>

                        {/* Custom Days Selection */}
                        {(values.recurrenceType === "custom" ||
                          values.recurrenceType === "bi-weekly") && (
                          <div>
                            <label className="block text-sm text-[#525252] mb-2">
                              Select Days
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {DAYS_OF_WEEK.map((day) => (
                                <button
                                  key={day.value}
                                  type="button"
                                  onClick={() => {
                                    const currentDays = values.customDays || [];
                                    const newDays = currentDays.includes(
                                      day.value
                                    )
                                      ? currentDays.filter(
                                          (d) => d !== day.value
                                        )
                                      : [...currentDays, day.value];
                                    setFieldValue("customDays", newDays);
                                  }}
                                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                                    values.customDays?.includes(day.value)
                                      ? "border-[#b95e82] bg-[#b95e82] text-white"
                                      : "border-[#e5e5e5] bg-white text-[#737373] hover:border-[#b95e82]/30"
                                  }`}
                                >
                                  {day.label}
                                </button>
                              ))}
                            </div>
                            {errors.customDays && touched.customDays && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.customDays}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </section>

                {/* Section 4: Set Live Region & Time */}
                <section className="space-y-4">
                  <div className="bg-gradient-to-r from-[#d4849f]/20 to-[#f9d5c7]/20 rounded-xl p-4 space-y-4">
                    <div className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-[#b95e82]" />
                      <h3 className="text-large text-[#262626]">
                        Live Class Slot (Primary Region)
                      </h3>
                    </div>
                    <p className="text-[#737373]">
                      This will be the live session. All other regions will
                      receive the recorded version automatically.
                    </p>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Select
                          label="🌍 Select Region"
                          value={values.liveRegion}
                          onChange={(val) => setFieldValue("liveRegion", val)}
                          options={regionOptions || []}
                          placeholder="Choose region..."
                        />
                        {errors.liveRegion && touched.liveRegion && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.liveRegion}
                          </p>
                        )}

                        {/* Display Countries for Selected Region */}
                        {values.liveRegion && regionCountries.length > 0 && (
                          <div className="mt-3 p-3 bg-white/50 rounded-lg border border-[#e5e5e5]">
                            <div className="flex items-center gap-2 mb-2">
                              <MapPin className="w-4 h-4 text-[#b95e82]" />
                              <span className="text-sm text-[#525252]">
                                Countries in this region:
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {regionCountries.map((country: any) => (
                                <span
                                  key={country._id}
                                  className="px-2 py-1 bg-white text-xs text-[#737373] rounded border border-[#e5e5e5]"
                                >
                                  {country.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

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

                {/* Section 5: Assign Trainer */}
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

                {/* Section 6: Duration */}
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

                {/* Section 7: Global Time Preview */}
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
                              Local Time
                            </th>
                            <th className="px-4 py-3 text-left text-[#525252]">
                              Format
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
                                        dayjs(values.fromDate).format(
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

                {/* CTA Area */}
                <section className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-[#e5e5e5]">
                  <Button
                    variant="outlineCancel"
                    type="button"
                    onClick={() => router.push("/schedule-session")}
                    className="flex-1 sm:flex-none rounded-lg"
                  >
                    Cancel
                  </Button>
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
                      ? "Updating..."
                      : buttonState === "success"
                      ? "✓ Updated"
                      : "Update Meeting"}
                  </button>
                </section>
              </div>

              {/* Class Details Card */}
              {values.service && values.trainer && values.liveRegion && (
                <div className="bg-white rounded-2xl shadow-sm border border-[#e5e5e5] p-6 mx-4 space-y-4">
                  <h3 className="text-large text-[#262626]">
                    Trainer • Class Details
                  </h3>
                  <div className="bg-gradient-to-r from-[#d4849f]/10 to-[#f9d5c7]/10 rounded-xl p-4 space-y-3">
                    <div className="space-y-1">
                      <h4 className="text-[#262626] capitalize">
                        {serviceName}
                      </h4>
                      <p className="text-[#737373]">
                        Date Range:{" "}
                        {values.fromDate && values.toDate
                          ? `${format(values.fromDate, "PPP")} - ${format(values.toDate, "PPP")}`
                          : "Not set"}
                      </p>
                      <p className="text-[#737373]">
                        Live Time: {values.liveTime} (
                        {
                          regionOptions?.find(
                            (r) => r.value === values.liveRegion
                          )?.label
                        }
                        )
                      </p>
                      <p className="text-[#737373]">
                        Duration: {values.duration} minutes
                      </p>
                      {values.recurringClass && (
                        <p className="text-[#737373]">
                          Recurrence:{" "}
                          <span className="capitalize">
                            {values.recurrenceType}
                          </span>
                          {(values.recurrenceType === "custom" ||
                            values.recurrenceType === "bi-weekly") &&
                            values.customDays.length > 0 &&
                            ` (${values.customDays
                              .map(
                                (d) =>
                                  DAYS_OF_WEEK.find((day) => day.value === d)
                                    ?.label
                              )
                              .join(", ")})`}
                        </p>
                      )}
                      <p className="text-[#737373]">
                        Replay Regions:{" "}
                        {timezoneConversions
                          .filter((t: any) => t.mode === "replay")
                          .map((t: any) => t.region)
                          .join(" • ")}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Confirmation Modal */}
              <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Meeting Updated"
                message="Your class has been updated successfully. Changes will reflect immediately."
              />
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}
