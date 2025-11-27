"use client";

import { useEffect, useRef } from "react";
import { useLeaveMeetingMutation } from "@/store/api/meetingApi";

export default function AutoLeaveTracker() {
  const [leaveMeeting] = useLeaveMeetingMutation();

  const leaveCalledRef = useRef(false);

  const triggerLeaveMeeting = async () => {
    const attendanceId = localStorage.getItem("attendanceId");
    if (!attendanceId) return;

    if (leaveCalledRef.current) return;
    leaveCalledRef.current = true;

    try {
      await leaveMeeting({ attendanceId }).unwrap();

      console.log("Meeting ended → progress saved");

      localStorage.removeItem("attendanceId");
      sessionStorage.setItem("leaveCalled", "true");
    } catch (err) {
      console.error("Leave meeting error:", err);
    }
  };

  // ------------------------------
  // TRIGGER WHEN PAGE LOADS
  // ------------------------------
  useEffect(() => {
    const attendanceId = localStorage.getItem("attendanceId");
    if (!attendanceId) return;

    if (sessionStorage.getItem("leaveCalled")) return;

    triggerLeaveMeeting();
  }, []);

  // ------------------------------
  // TRIGGER WHEN USER RETURNS FROM ZOOM
  // ------------------------------
  useEffect(() => {
    const handleFocus = () => {
      triggerLeaveMeeting();
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        triggerLeaveMeeting();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  // ------------------------------
  // TRIGGER ON BROWSER CLOSE / TAB CLOSE
  // ------------------------------
  useEffect(() => {
    const handleUnload = (e: BeforeUnloadEvent) => {
      const attendanceId = localStorage.getItem("attendanceId");
      if (!attendanceId) return;

      // Send API in background
      navigator.sendBeacon(
        "/meetings/leave",
        JSON.stringify({ attendanceId })
      );

      // Mark as called
      sessionStorage.setItem("leaveCalled", "true");
      localStorage.removeItem("attendanceId");
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  return null;
}
