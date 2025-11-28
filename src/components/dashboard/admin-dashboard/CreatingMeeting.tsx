/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input2 } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useCreateMeetingMutation } from "@/store/api/meetingApi";
import toast from "react-hot-toast";

// --------------------------
// Yup Schema
// --------------------------
const MeetingSchema = Yup.object().shape({
  topic: Yup.string().required("Meeting name is required"),
  start_time: Yup.string().required("Start time is required"),
  duration: Yup.number()
    .required("Duration is required")
    .min(30, "Duration must be at least 30 minutes"),
});

interface Props {
  open: boolean;
  onClose: () => void;
  adminId: string;
}

export default function CreateMeetingModal({ open, onClose, adminId }: Props) {
  const [createMeeting] = useCreateMeetingMutation();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="
    max-w-lg
    p-10

    data-[state=open]:animate-in
    data-[state=open]:fade-in-0
    data-[state=open]:zoom-in-95
    data-[state=open]:slide-in-from-top-20
    data-[state=closed]:animate-out
    data-[state=closed]:fade-out-0
    data-[state=closed]:zoom-out-95
    data-[state=closed]:slide-out-to-top-20
    duration-500
  "
      >
        <DialogHeader>
          <DialogTitle className="md:text-[24px]! font-bold font-satoshi-500">
            Create New Meeting
          </DialogTitle>
        </DialogHeader>

        <Formik
          initialValues={{
            topic: "",
            start_time: "",
            duration: "",
          }}
          validationSchema={MeetingSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            const payload = {
              ...values,
              start_time: new Date(values.start_time).toISOString(),
              local_time:values.start_time,
              adminId,
            };


            console.log("payload", payload?.start_time,values.start_time);
            

            try {
              const result = await createMeeting(payload).unwrap();

              if (result.success) {
                toast.success("Meeting created successfully!");
                resetForm();
                onClose();
              } else {
                toast.error("Unable to create meeting. Try again.");
              }
            } catch (error: any) {
              toast.error(error?.data?.message || "API error occurred");
            }

            setSubmitting(false);
          }}
        >
          {({ errors, touched, isSubmitting, handleChange }) => (
            <Form className="space-y-6 pt-4">
              {/* Meeting Name */}
              <div className="flex flex-col gap-2">
                <Label>Meeting Name</Label>
                <Input2
                  name="topic"
                  placeholder="Enter meeting name"
                  onChange={handleChange}
                  className="bg-[#F3F3F5] min-h-[55px]"
                />
                {errors.topic && touched.topic && (
                  <p className="text-red-500 text-sm mt-1">{errors.topic}</p>
                )}
              </div>

              {/* Start Time */}
              <div className="flex flex-col gap-2">
                <Label>Start Time</Label>
                <Input2
                  type="datetime-local"
                  name="start_time"
                  onChange={handleChange}
                  className="bg-[#F3F3F5] min-h-[55px]"
                />
                {errors.start_time && touched.start_time && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.start_time}
                  </p>
                )}
              </div>

              {/* Duration */}
              <div className="flex flex-col gap-2">
                <Label>Duration (minutes)</Label>
                <Input2
                  type="number"
                  name="duration"
                  onChange={handleChange}
                  placeholder="Enter duration"
                  className="bg-[#F3F3F5] min-h-[55px]"
                />
                {errors.duration && touched.duration && (
                  <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
                )}
              </div>

              {/* Buttons */}
              <div className="mt-8">
                <DialogFooter className="mt-4">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    variant={"theme"}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating..." : "Create Meeting"}
                  </Button>
                </DialogFooter>
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
