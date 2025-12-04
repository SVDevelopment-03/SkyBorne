/* eslint-disable @typescript-eslint/no-explicit-any */

// components/ClassScheduler.tsx
"use client";
import { useEffect, useState } from "react";
import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Select } from "@/components/ui/Select2";
import { TimePicker } from "@/components/ui/TimePicker";
import { Toggle2 } from "@/components/ui/Toggle2";
import { RadioGroup } from "@/components/ui/RadioGroup";
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
import { useGetTrainersQuery } from "@/store/api/trainerApi";
import { useGetServicesQuery } from "@/store/api/publicApi";
import { useCreateMeetingMutation } from "@/store/api/meetingApi";
import useGetUser from "@/hooks/useGetUser";
import dayjs from "dayjs";

dayjs.extend(utc);
dayjs.extend(timezone);

interface TimezoneConversion {
  region: string;
  localTime: string;
  timezone: string;
  mode: "live" | "replay";
}

interface ClassSchedulerProps {
  onSuccess?: () => void;
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
  rotationEnabled: string;
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
  rotationEnabled: Yup.string().oneOf(
    ["enabled", "disabled"],
    "Invalid rotation option"
  ),
});

export function ClassScheduler({ onSuccess }: ClassSchedulerProps) {
  const { data, isLoading, isError } = useGetTrainersQuery(undefined);
  const [createMeeting] = useCreateMeetingMutation();
  const { user } = useGetUser();
  let timezoneConversions:any;

  const {
    data: serviceData,
    isLoading: serviceLoading,
    isError: serviceError,
  } = useGetServicesQuery(undefined);

  const [serviceOptions, setServiceOption] = useState<
    { label: string; value: string }[] | null
  >(null);

  const [trainerOptions, setTrainerOptions] = useState<
    { label: string; value: string }[] | null
  >(null);

  const [showModal, setShowModal] = useState(false);
  const [buttonState, setButtonState] = useState<"default" | "success">(
    "default"
  );

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

  const regionOptions = [
    { value: "gulf", label: "Gulf" },
    { value: "apac", label: "APAC" },
    { value: "canada-usa", label: "Canada / USA" },
    { value: "uk-europe", label: "UK / Europe" },
  ];

  const rotationOptions = [
    { value: "enabled", label: "Enabled", description: "(Recommended)" },
    { value: "disabled", label: "Disabled", description: "(Manual Selection)" },
  ];

  const regionTimezones: Record<string, string> = {
    gulf: "Asia/Dubai",
    apac: "Asia/Singapore",
    "canada-usa": "America/New_York",
    "uk-europe": "Europe/London",
  };

  const getTimezoneConversions = (
    liveRegion: string,
    liveTime: string,
    date: Date | undefined
  ): TimezoneConversion[] => {
    if (!liveRegion || !liveTime || !date) return [];

    const time24 = convertTimeTo24Hour(liveTime);
    const regionTZ = regionTimezones[liveRegion];

    const liveDateTime = dayjs.tz(
      `${format(date, "yyyy-MM-dd")} ${time24}`,
      regionTZ
    );

    return Object.entries(regionTimezones).map(([regionKey, tz]) => {
      const converted = liveDateTime.tz(tz).format("hh:mm A");

      return {
        region:
          regionOptions.find((r) => r.value === regionKey)?.label || regionKey,
        localTime: converted,
        timezone: tz,
        mode: regionKey === liveRegion ? "live" : "replay",
      };
    });
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
      const [hours, minutes] = time24h.split(":").map(Number);

      const localDateTime = new Date(
        values.date.getFullYear(),
        values.date.getMonth(),
        values.date.getDate(),
        hours,
        minutes
      );

      const payload = {
        service: values.service,
        liveRegion: values.liveRegion,
        liveTime: values.liveTime,
        trainer: values.trainer,
        title: values?.title,
        regions: timezoneConversions,
        duration: values.duration,
        startDate: values?.date,
        autoRecording: values.autoRecording,
        rotationEnabled: values.rotationEnabled === "enabled",
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
    liveRegion: "gulf",
    title: "",
    liveTime: "10:00 AM",
    trainer: "",
    duration: 60,
    autoRecording: true,
    rotationEnabled: "enabled",
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, isSubmitting, setFieldValue }) => {
         timezoneConversions = getTimezoneConversions(
          values.liveRegion,
          values.liveTime,
          values.date
        );

        console.log(
          timezoneConversions,
          values.liveRegion,
          values.liveTime,
          values.date
        );

        const isFormValid =
          values.service &&
          values.date &&
          values.liveRegion &&
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

                {/* Section 2: Set Live Region & Time */}
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

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
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
                          {timezoneConversions.map((conversion:any, index:number) => (
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
                                {conversion.localTime}
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
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>

                {/* Section 5: Recording Logic */}
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

                {/* Section 6: Weekly Rotation Rule */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h4 className="text-[#262626]">Live Region Rotation</h4>
                    <div className="group relative">
                      <div className="w-4 h-4 rounded-full bg-[#d4d4d4] text-white flex items-center justify-center cursor-help text-xs">
                        ?
                      </div>
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-64 bg-[#262626] text-white p-3 rounded-lg shadow-lg z-10">
                        <p className="text-xs">
                          Each week, the live region will rotate so every
                          timezone receives live instruction equally.
                        </p>
                      </div>
                    </div>
                  </div>
                  <RadioGroup
                    value={values.rotationEnabled}
                    onChange={(val) => setFieldValue("rotationEnabled", val)}
                    options={rotationOptions}
                  />
                </section>

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
              {values.service && values.trainer && values.liveRegion && (
                <div className="bg-white rounded-2xl shadow-sm border border-[#e5e5e5] p-6 space-y-4">
                  <h3 className="text-large text-[#262626]">
                    Trainer • Class Details
                  </h3>
                  <div className="bg-gradient-to-r from-[#d4849f]/10 to-[#f9d5c7]/10 rounded-xl p-4 space-y-3">
                    <div className="space-y-1">
                      <h4 className="text-[#262626] capitalize">
                        {values.service.replace("-", " ")} — Week 1
                      </h4>
                      <p className="text-[#737373]">
                        Date:{" "}
                        {values.date ? format(values.date, "PPP") : "Not set"}
                      </p>
                      <p className="text-[#737373]">
                        Live Time: {values.liveTime} (
                        {
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
                          .filter((t:any) => t.mode === "replay")
                          .map((t:any) => t.region)
                          .join(" • ")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-[#b95e82]">
                      <RotateCw className="w-4 h-4" />
                      <span>Recording Needed After Session</span>
                    </div>
                    <button
                      type="button"
                      className="bg-[#b95e82] text-white px-6 py-2 rounded-lg hover:bg-[#9a4c6d] transition-colors"
                    >
                      Upload Recording
                    </button>
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
