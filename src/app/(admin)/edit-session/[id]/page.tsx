/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { useEffect, useState } from "react";
import { Formik, FormikHelpers } from "formik";
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
} from "lucide-react";
import toast from "react-hot-toast";
import { useGetActiveTrainersQuery, useGetTrainersQuery } from "@/store/api/trainerApi";
import { useGetServicesQuery } from "@/store/api/publicApi";
import {
  useUpdateMeetingMutation,
  useGetMeetingByIdQuery,
} from "@/store/api/meetingApi";
import { useGetAllActiveRegionsQuery } from "@/store/api/regionApi";
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
  date: Date | undefined;
  liveRegion: string;
  liveTime: string;
  trainer: string;
  duration: number;
  autoRecording: boolean;
}

const validationSchema = Yup.object().shape({
  service: Yup.string().required("Service is required"),
  title: Yup.string().required("Title is required"),
  date: Yup.date().required("Date is required").typeError("Date is required"),
  liveRegion: Yup.string().required("Live region is required"),
  liveTime: Yup.string().required("Live time is required"),
  trainer: Yup.string().required("Trainer is required"),
  duration: Yup.number()
    .required("Duration is required")
    .min(30, "Duration must be at least 30 minutes")
    .max(480, "Duration cannot exceed 8 hours"),
  autoRecording: Yup.boolean(),
});

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

  let timezoneConversions: TimezoneConversion[] = [];

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

      // Build region options for dropdown
      const options = regions.map((region: any) => ({
        label: region.displayLabel,
        value: region._id,
      }));
      setRegionOptions(options);

      // Build timezone mapping
      const timezones: Record<string, string> = {};
      regions.forEach((region: any) => {
        timezones[region._id] = region.timezone;
      });
      setRegionTimezones(timezones);

      // Build replay times mapping
      const replayTimes: Record<string, string> = {};
      regions.forEach((region: any) => {
        replayTimes[region._id] = region.replayTime;
      });
      setFixedReplayTimes(replayTimes);
    }
  }, [regionsData?.data, regionsLoading]);

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

    // Create the live class start time in the live region's timezone
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

    // Calculate when the class ends in the live region
    const classEndTime = liveDateTime.add(duration, "minutes");

    return regionsData.data.map((region: any) => {
      if (region._id === liveRegionId) {
        // Live region shows the live class at the specified time
        return {
          region: region.displayLabel,
          localTime: liveTime,
          timezone: region.timezone,
          mode: "live",
          date: dayjs(date).format("YYYY-MM-DD"),
        };
      }

      // For replay regions, get when class ends in that region's timezone
      const classEndTimeInRegion = classEndTime.tz(region.timezone);

      // Get the scheduled replay time for this region
      const replayTimeStr = region.replayTime;
      const time24hReplay = convertTimeTo24Hour(replayTimeStr);
      const [replayHours, replayMinutes] = time24hReplay.split(":").map(Number);

      // Create the scheduled replay time on the original date in the region's timezone
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

      // Check if scheduled replay time is BEFORE or EQUAL to the class end time in that region
      const isBeforeLiveEnds =
        scheduledReplayTimeOnDate.isBefore(classEndTimeInRegion, "minute") ||
        scheduledReplayTimeOnDate.isSame(classEndTimeInRegion, "minute");

      let finalReplayDate = dayjs(date);

      // If the scheduled replay time is before or at the time class ends, schedule for next day
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

         const liveRegionName = regionOptions?.find(
      (r) => r.value === values.liveRegion
    )?.label || values.liveRegion;

    console.log("live region:", liveRegionName);

      const payload = {
        service: values.service,
        liveRegion: liveRegionName,
        liveTime: values.liveTime,
        trainer: values.trainer,
        title: values?.title,
        regions: timezoneConversions,
        duration: values.duration,
        startDate: values?.date,
        autoRecording: values.autoRecording,
        localTime: localDateTime.toISOString(),
      };

      console.log("Sending payload:", payload);

      const data: any = await updateMeeting({ id: meetingId, body: payload });

      if (data?.data?.success) {
        setButtonState("success");
        toast.success("Meeting updated successfully!");

        setTimeout(() => {
          setShowModal(true);
          router.push("/schedule-session");
          setTimeout(() => {
            setButtonState("default");
          }, 2000);
        }, 500);
      } else {
        toast.error(data?.data?.message || "Failed to update meeting");
        setButtonState("default");
      }
    } catch (error: any) {
      console.error("Error updating meeting:", error);
      toast.error(error.message || "Error updating meeting");
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

  // Show loading state while fetching form options
  const allDataLoaded =
    !regionsLoading && !trainersLoading && !servicesLoading;

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

  const initialValues: FormValues = {
    service: meeting.service?._id || "",
    date: new Date(meeting.startDate),
    liveRegion: meeting.liveRegion || "",
    title: meeting.title || "",
    liveTime: meeting.liveTime || "10:00 AM",
    trainer: meeting.trainer?._id || "",
    duration: meeting.duration || 60,
    autoRecording: meeting.autoRecording || true,
  };


  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, errors, touched, isSubmitting, setFieldValue, handleSubmit }) => {
        timezoneConversions = getTimezoneConversions(
          values.liveRegion,
          values.liveTime,
          values.date,
          values.duration
        );

        const currentService = serviceOptions?.find(
          (s) => s.value === values?.service
        );
        const serviceName = currentService?.label;

        const isFormValid =
          values.service &&
          values.date &&
          values.liveRegion &&
          values.trainer &&
          values?.title &&
          values.duration > 0;

        return (
          <div>
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

                {/* Section 2: Title & Date */}
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

                {/* Section 3: Live Region & Time */}
                <section className="space-y-4">
                  {/* <div className="bg-gradient-to-r from-[#d4849f]/20 to-[#f9d5c7]/20 rounded-xl p-4 space-y-4"> */}
                  <div className="bg-gradient-to-r from-[#d4849f]/20 to-[#f9d5c7]/20 rounded-xl p-3 sm:p-4 space-y-4 w-full overflow">
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

                    {/* <div className="grid md:grid-cols-2 gap-4"> */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
                      {/* {regionOptions && <div> */}
                      {regionOptions && <div className="w-full min-w-0">
                        <Select
                          label="🌍 Select Region"
                          value={values.liveRegion}
                          onChange={(val) => setFieldValue("liveRegion", val)}
                          options={regionOptions}
                          placeholder="Choose region..."
                        />
                        {errors.liveRegion && touched.liveRegion && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.liveRegion}
                          </p>
                        )}
                      </div>}

                      <div className="space-y-2 w-full min-w-[170px] sm:min-w-0">
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

                {/* Section 4: Trainer */}
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

                {/* Section 5: Duration */}
                <section className="space-y-4">
                  <h4 className="text-[#262626]">Duration (minutes)</h4>
                  <input
                    type="number"
                    name="duration"
                    value={values.duration}
                    onChange={(e) =>
                      setFieldValue("duration", parseInt(e.target.value) || 60)
                    }
                    min="30"
                    max="480"
                    className="w-full px-4 py-3 bg-[#F3F3F5] border border-[#e5e5e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b95e82]"
                    placeholder="Enter duration in minutes"
                  />
                  {errors.duration && touched.duration && (
                    <p className="text-red-500 text-sm">{errors.duration}</p>
                  )}
                </section>

                {/* Section 6: Global Time Conversion */}
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
                                 ( conversion.mode === "live" )
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
                                    <Badge type="live">
                                      <Star className="w-3.5 h-3.5" />
                                      Live
                                    </Badge>
                                  ) : (
                                    <Badge type="replay">
                                      <RotateCw className="w-3.5 h-3.5" />
                                      Replay
                                    </Badge>
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

                {/* Section 7: Recording Logic */}
                <section className="space-y-4">
                  <h4 className="text-[#262626]">Recording Logic</h4>
                  <div className="bg-[#f5f5f5] rounded-xl p-4">
                    <Toggle2
                      checked={values.autoRecording}
                      onChange={(val) => setFieldValue("autoRecording", val)}
                      label="Automatic recording distribution"
                      description="The system will share the recording with all non-live regions automatically."
                    />
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
                    type="button"
                    onClick={() => handleSubmit()}
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
                        {serviceName} — Week 1
                      </h4>
                      <p className="text-[#737373]">
                        Date:{" "}
                        {values.date ? format(values.date, "PPP") : "Not set"}
                      </p>
                      <p className="text-[#737373]">
                        Live Time: {values.liveTime} (
                        {regionOptions && 
                          regionOptions.find(
                            (r) => r.value === values.liveRegion
                          )?.label
                        }
                        )
                      </p>
                      <p className="text-[#737373]">
                        Duration: {values.duration} minutes
                      </p>
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
          </div>
        );
      }}
    </Formik>
  );
}