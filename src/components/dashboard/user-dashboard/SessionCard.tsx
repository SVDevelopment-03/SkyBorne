/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/heading";
import { ClockIcon, DashboardCalenderIcon } from "@/icons/dashboardIcon";
import { RootState } from "@/store";
import { useJoinMeetingMutation } from "@/store/api/meetingApi";
import { SessionProps } from "@/types/home.type";
import { formatLocalTime } from "@/utils/LocalTime";
import Image from "next/image";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { ZoomSessionFlow } from "./ZoomSessionFlow";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, Clock, PlayCircle, Users } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const SessionCard = ({
  meetingId,
  userId,
  startTime,
  joined,
  trainer,
  participants,
  participantsCount,
  image,
  time,
  date,
  title,
  duration,
}: SessionProps) => {
  console.log("meeting", userId, meetingId);
  const classItem = {
    meetingId,
    userId,
    joined,
    participants,
    participantsCount,
    image,
    time,
    startTime,
    date,
    title,
    duration,
    trainer,
  };

  const [joinMeeting, { isLoading: isJoining }] = useJoinMeetingMutation();
  const [showZoomFlow, setShowZoomFlow] = useState(false);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [showClassModal, setShowClassModal] = useState(false);

  const handleJoin = async () => {
    if (!meetingId || !userId) {
      toast.error("Missing meeting or user information");
      return;
    }

    try {
      // call backend join API which creates attendance record and returns joinUrl + attendanceId
      const res = await joinMeeting({ meetingId, userId }).unwrap();

      if (res?.joinUrl) {
        // store attendanceId to localStorage so Leave API can use it later
        if (res.attendanceId) {
          try {
            localStorage.setItem("attendanceId", String(res.attendanceId));
          } catch (e) {
            // ignore storage errors
          }
        }

        const joinUrl = res.joinUrl;

        toast.success("Joining meeting...");

        // open zoom web client in a new tab
        window.open(joinUrl, "_blank");
      } else {
        toast.error("Join URL not found");
      }
    } catch (err: any) {
      console.error("Join meeting error:", err);
      const msg =
        err?.data?.message || err?.message || "Failed to join meeting";
      toast.error(msg);
    }
  };

  const handleJoinClass = (classItem: any) => {
    setSelectedClass(classItem);
    setShowClassModal(true);
    toast.success(`You're set for ${classItem?.title}!`);
  };

  const handleCancelClass = (classItem: any) => {
    toast.error(`${classItem.name} has been cancelled`);
  };

  const handleRescheduleClass = (classItem: any) => {
    toast.success(`Rescheduling ${classItem.name}...`);
  };

  return (
    <div className="bg-[#FFF4F0] p-[11px] rounded-[15px] flex items-start justify-between w-full">
      <div className="flex items-center gap-[15px]">
        <Image
          className="rounded-[10px] bg-white"
          src={image}
          alt="session"
          height={108}
          width={131}
        />

        <div className="flex flex-col gap-4.5">
          <div className="flex flex-col">
            <Typography
              title={title}
              type="lg"
              cssClass="md:text-[20px]! text-[#0A0A0A]!"
            />

            <Typography
              title={
                <div className="flex items-center gap-1">
                  <ClockIcon />
                  <span className="text-sm text-[#313131]">
                    {time} · {duration}
                  </span>
                </div>
              }
              type="theme"
            />
          </div>

          <Button
            variant={"outlineGradientRect"}
            className="max-w-[85px]"
            onClick={() => handleJoinClass(classItem)}
            disabled={isJoining || joined}
          >
            {isJoining ? "Loading..." : joined ? "Joined" : "Join now"}
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-end justify-between h-full gap-10">
        {/* DATE */}
        <div className="rounded-[10px] bg-white px-3 py-2 flex items-center gap-1.25 min-w-[70px]">
          <DashboardCalenderIcon />
          <Typography
            title={date}
            type="lg"
            cssClass="md:text-sm! text-[#313131]!"
          />
        </div>

        {/* PARTICIPANTS */}
        <div className="flex items-center gap-2">
          {participants?.slice(0, 2).map((p, index) => (
            <div
              key={index}
              className={`${
                index === 0 ? "" : "-ml-6"
              } size-7.5 rounded-full overflow-hidden hover:scale-105 transition cursor-pointer`}
            >
              <Image
                src={p.avatar || "/images/default-avatar.png"}
                alt={p.name || "avatar"}
                width={30}
                height={30}
                className="object-cover"
              />
            </div>
          ))}

          {participantsCount > 2 && (
            <div className="-ml-6 size-7.5 rounded-full bg-[#494949] text-xs font-semibold font-montserrat text-white flex items-center justify-center hover:scale-105 transition cursor-pointer">
              {participantsCount > 2
                ? participantsCount - 2 + "+"
                : participantsCount}
            </div>
          )}

          {participantsCount > 2 && (
            <Typography
              title="Joined"
              cssClass="-ml-1 text-sm! text-[#313131]!"
            />
          )}
        </div>
      </div>

      {/* Class Details Modal */}
      <Dialog open={showClassModal} onOpenChange={setShowClassModal}>
        <DialogContent className="border-[#f0ccc4]">
          <DialogHeader>
            <DialogTitle className="text-[#494949]">
              Session Details
            </DialogTitle>
            <DialogDescription>
              {" You're all set for"} {selectedClass?.title ?? title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-br from-[#fef9f5] to-[#ffe8e8] rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="w-14 h-14">
                  <AvatarFallback className="bg-gradient-to-br from-[#b95e82] to-[#d97ba3] text-white">
                    {selectedClass?.trainer
                      ?.split(" ")
                      ?.map((n: string) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  {selectedClass?.trainer ? (
                    <p className="text-[#494949]">{selectedClass?.trainer}</p>
                  ) : (
                    <p className="text-sm text-[#717182]">Instructor</p>
                  )}
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-[#717182]">
                  <Calendar className="w-4 h-4" />
                  {selectedClass?.date} {selectedClass?.time}
                </div>
                <div className="flex items-center gap-2 text-[#717182]">
                  <Clock className="w-4 h-4" />
                  {selectedClass?.duration}
                </div>
                <div className="flex items-center gap-2 text-[#717182]">
                  <Users className="w-4 h-4" />
                  5 participants
                  {/* {selectedClass?.participants} */}
                </div>
              </div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>Reminder:</strong> Please join the session 5 minutes
                early to set up your space and equipment.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowClassModal(false)}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm! font-medium transition-all shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background text-foreground hover:bg-[#f0ccc4]! hover:border-[#f0ccc4]! hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4! py-2! has-[>svg]:px-3 border-[#e8eeea]"
            >
              Close
            </Button>
            <Button
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm! font-satoshi-500! transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive text-primary-foreground hover:bg-primary/90 h-9 px-4! py-2! has-[>svg]:px-3 bg-gradient-to-r from-[#b95e82] to-[#d97ba3]"
              onClick={() => {
                toast.success("Opening session...");
                setShowClassModal(false);
                setShowZoomFlow(true);
              }}
            >
              <PlayCircle className="w-4 h-4 mr-2" />
              Join Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Zoom Session Flow */}
      <ZoomSessionFlow
        isOpen={showZoomFlow}
        joinMeeting={handleJoin}
        onClose={() => setShowZoomFlow(false)}
        session={selectedClass}
      />
    </div>
  );
};

export default SessionCard;
