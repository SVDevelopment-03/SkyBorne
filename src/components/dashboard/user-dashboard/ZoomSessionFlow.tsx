import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import {
  Video,
  CheckCircle,
  Clock,
  Calendar,
  Loader2,
  ExternalLink,
  PlayCircle,
  Users,
  Shield,
  AlertTriangle,
  MessageCircle,
  Download,
  Maximize2,
  Mic,
  MicOff,
  VideoOff,
  Phone,
  Settings as SettingsIcon,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface ZoomSessionFlowProps {
  isOpen: boolean;
  joinMeeting:()=>void;
  onClose: () => void;
  session: {
    title: string;
    trainer: string;
    time: string;
    duration: string;
    startTime: string;
  } | null;
}

type FlowStep =
  | "upcoming"
  | "access-check"
  | "join-ready"
  | "embedded-meeting"
  | "completed"
  | "browser-fallback"
  | "error"
  | "recording";

const calculateSecondsLeft = (isoTime: string) => {
  const meetingTime = new Date(isoTime).getTime();
  const now = Date.now();
  const diff = meetingTime - now; // milliseconds
  return diff > 0 ? Math.floor(diff / 1000) : 0;
};

const formatCountdown = (sec: number) => {
  const d = Math.floor(sec / (3600 * 24));
  const h = Math.floor((sec % (3600 * 24)) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;

  if (d > 0) return `${d}d ${h}h ${m}m ${s}s`;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  return `${m}m ${s}s`;
};

export function ZoomSessionFlow({
  isOpen,
  onClose,
  joinMeeting,
  session,
}: ZoomSessionFlowProps) {
  const [currentStep, setCurrentStep] = useState<FlowStep>("upcoming");
  const [progress, setProgress] = useState(0);
  const [countdown, setCountdown] = useState(0); // 2 minutes in seconds
  const [meetingDuration, setMeetingDuration] = useState(0);

  const { user } = useSelector((state: RootState) => state.auth);

  // Access Check Progress
  useEffect(() => {
    if (currentStep === "access-check") {
      setTimeout(() => {
        setProgress(0);
      }, 0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setCurrentStep("join-ready"), 500);
            return 100;
          }
          return prev + 10;
        });
      }, 150);
      return () => clearInterval(interval);
    }
  }, [currentStep]);

  // Join Ready Countdown
  useEffect(() => {
    if (currentStep === "join-ready" && session?.startTime) {
      const secondsLeft = calculateSecondsLeft(session?.startTime);
      setTimeout(() => {
        setCountdown(secondsLeft);
      }, 0);

      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 0) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [currentStep, session?.startTime]);

  // Meeting Duration Timer
  useEffect(() => {
    if (currentStep === "embedded-meeting") {
      const interval = setInterval(() => {
        setMeetingDuration((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [currentStep]);

  const handleJoinSession = () => {
    setCurrentStep("access-check");
  };

  const handleJoinNow = () => {
    handleClose()
    joinMeeting()
  };

  const handleEndSession = () => {
    setCurrentStep("completed");
  };

  const handleTryAgain = () => {
    setCurrentStep("access-check");
  };

  const handleOpenBrowser = () => {
    // In production: window.open(zoomUrl, '_blank');
    setCurrentStep("embedded-meeting");
  };

  const handleViewRecording = () => {
    setCurrentStep("recording");
  };

  const handleClose = () => {
    setCurrentStep("upcoming");
    setProgress(0);
    setMeetingDuration(0);
    onClose();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  if (!session) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <VisuallyHidden>
        <DialogTitle>Upcoming Session</DialogTitle>
      </VisuallyHidden>

      <DialogContent
        className={cn(
          "border-[#f0ccc4] max-w-2xl",
          currentStep === "embedded-meeting" && "max-w-5xl",
          currentStep === "recording" && "max-w-4xl"
        )}
      >
        {/* Screen 1: Dashboard - Upcoming Session */}
        {currentStep === "upcoming" && (
          <div className="space-y-6 p-6">
            <div>
              <h2 className="text-2xl text-[#494949] mb-2 font-semibold!">Upcoming Session</h2>
              <div className="h-1 w-20 bg-gradient-to-r from-[#b95e82] to-[#d97ba3] rounded-full" />
            </div>

            {/* Session Card */}
            <div className="bg-gradient-to-br from-[#fef9f5] to-[#ffe8e8] rounded-xl border-2 border-[#f0ccc4] p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#b95e82] to-[#d97ba3] flex items-center justify-center flex-shrink-0">
                  <Video className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl text-[#494949] mb-2">
                    {session?.title}
                  </h3>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[#717182]">
                      <Calendar className="w-4 h-4" />
                      <span>{session.time}</span>
                    </div>
                    <Badge className="bg-blue-500 text-white border-0 py-0.5! px-2! text-xs!">
                      <Video className="w-3 h-3 mr-1" />
                      Live Session
                    </Badge>
                  </div>

                  <p className="text-sm text-[#717182] mt-3">
                    <Clock className="w-3 h-3 inline mr-1" />
                    Duration: {session.duration}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Text */}
            {user?.onboardingCompleted ? (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-800 text-center">
                  <CheckCircle className="w-4 h-4 inline mr-1" />
                  Your subscription is active. You will join on the browser.
                </p>
              </div>
            ) : (
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm text-red-800 text-center">
                  <XCircle className="w-4 h-4 inline mr-1" />
                  Your subscription is inactive. Please unlock a plan.
                </p>
              </div>
            )}

            <Button
              onClick={handleJoinSession}
              className="w-full h-12 bg-gradient-to-r from-[#b95e82] to-[#d97ba3] hover:opacity-90"
              size="lg"
              // disabled={!user?.onboardingCompleted}
            >
              <PlayCircle className="w-5 h-5 mr-2" />
              Join Session
            </Button>
          </div>
        )}

        {/* Screen 2: Access Check (Validation) */}
        {currentStep === "access-check" && (
          <div className="space-y-6 p-8">
            <div className="text-center space-y-4">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#b95e82] to-[#d97ba3] flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-white animate-spin" />
              </div>

              {/* <div>
                <h2 className="text-2xl text-[#494949] mb-2">
                  Checking Your Access
                </h2>
                <div className="h-1 w-24 bg-gradient-to-r from-[#b95e82] to-[#d97ba3] rounded-full mx-auto" />
              </div>

              <div className="space-y-3 py-8">
                <p className="text-[#717182] flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#b95e82]" />
                  Validating subscription…
                </p>
                <p className="text-[#717182] flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#b95e82]" />
                  Preparing secure session access…
                </p>
              </div> */}

              <Progress value={progress} className="h-2 max-w-xs mx-auto" />

              <p className="text-sm text-[#717182] pt-4">
                Please wait while we connect your class.
              </p>
            </div>
          </div>
        )}

        {/* Screen 3: Join Ready */}
        {currentStep === "join-ready" && (
          <div className="space-y-6 p-6">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mb-4">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>

              <h2 className="text-2xl text-[#494949] mb-2">
                {"You're Ready to Join"}
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-[#b95e82] to-[#d97ba3] rounded-full mx-auto" />
            </div>

            {/* Session Details */}
            <div className="bg-gradient-to-br from-[#fef9f5] to-[#ffe8e8] rounded-xl border border-[#f0ccc4] p-6 space-y-4">
              <div className="text-center">
                <h3 className="text-xl text-[#494949] mb-4">
                  {session?.title}
                </h3>

                <div className="inline-flex items-center gap-4 px-8 py-5 bg-white rounded-xl border-2 border-[#b95e82] shadow-sm">
                  <Clock className="w-8 h-8 text-[#b95e82]" />
                  <div className="text-left">
                    <p className="text-xs text-[#717182] mb-1">Starts in</p>
                    <p className="text-3xl text-[#494949]">
                      {formatCountdown(countdown)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Subtext */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900 text-center">
                <Shield className="w-4 h-4 inline mr-1" />
                The class will redirect you to zoom on browser.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm! font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background! text-foreground hover:bg-accent! hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4! py-2! has-[>svg]:px-3 border-[]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleJoinNow}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive text-primary-foreground hover:bg-primary/90 rounded-md px-6 has-[>svg]:px-4 flex-1 bg-gradient-to-r from-[#b95e82] to-[#d97ba3] hover:opacity-90 px-4! py-2!"
                size="lg"
              >
                <Video className="w-5 h-5 mr-2" />
                Join Now
              </Button>
            </div>

            {/* <Button
              variant="ghost"
              onClick={() => setCurrentStep("browser-fallback")}
              className="w-full text-[#717182] hover:text-[#494949]"
            >
              Having trouble? Try browser join →
            </Button> */}
          </div>
        )}

        {/* Screen 4: Embedded Zoom Meeting (Meeting SDK) */}
        {currentStep === "embedded-meeting" && (
          <div className="space-y-4 p-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-[#f0ccc4]">
              <div>
                <h3 className="text-lg text-[#494949]">
                  Live Class In Progress
                </h3>
                <p className="text-xs text-[#717182]">
                  Powered by Zoom (Meeting SDK)
                </p>
              </div>
              <Badge className="bg-red-500 text-white border-0 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-white mr-2 inline-block" />
                LIVE
              </Badge>
            </div>

            {/* Embedded Zoom Meeting Window */}
            <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 aspect-video border-2 border-slate-700">
              {/* Large Placeholder Box */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-6 p-8">
                  <div className="w-32 h-32 mx-auto rounded-2xl bg-gradient-to-br from-[#b95e82] to-[#d97ba3] flex items-center justify-center shadow-2xl">
                    <Video className="w-16 h-16 text-white" />
                  </div>
                  <div className="text-white space-y-3">
                    <h3 className="text-2xl">Zoom Meeting SDK – Live Feed</h3>
                    <p className="text-sm text-white/70 max-w-md">
                      This is where the embedded Zoom Meeting SDK will render
                      the live video feed, participant gallery, and meeting
                      controls.
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-4 text-white/60 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>24 participants</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(meetingDuration)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Zoom SDK Controls Bar */}
              <div className="absolute bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-sm border-t border-slate-700 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="border-white/20 text-white text-xs"
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      {formatTime(meetingDuration)}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3">
                    <button className="w-11 h-11 rounded-lg bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-colors">
                      <Mic className="w-5 h-5 text-white" />
                    </button>
                    <button className="w-11 h-11 rounded-lg bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-colors">
                      <Video className="w-5 h-5 text-white" />
                    </button>
                    <button className="w-11 h-11 rounded-lg bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-colors">
                      <Users className="w-5 h-5 text-white" />
                    </button>
                    <button className="w-11 h-11 rounded-lg bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-colors">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </button>
                    <button
                      className="w-11 h-11 rounded-lg bg-red-600 hover:bg-red-700 flex items-center justify-center transition-colors"
                      onClick={handleEndSession}
                    >
                      <Phone className="w-5 h-5 text-white rotate-[135deg]" />
                    </button>
                  </div>

                  <button className="w-11 h-11 rounded-lg bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-colors">
                    <SettingsIcon className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Session Info Overlay */}
              <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10">
                <p className="text-xs text-white/90">{session?.title}</p>
              </div>

              {/* Participant Count */}
              <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10">
                <p className="text-xs text-white/90">
                  <Users className="w-3 h-3 inline mr-1" />
                  24 live
                </p>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleEndSession}
                variant="outline"
                className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
              >
                End Session
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setCurrentStep("browser-fallback")}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Need Help?
              </Button>
            </div>
          </div>
        )}

        {/* Screen 5: Session Completed */}
        {currentStep === "completed" && (
          <div className="space-y-6 p-6">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mb-4 animate-pulse">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>

              <h2 className="text-2xl text-[#494949] mb-2">
                Session Completed
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-[#b95e82] to-[#d97ba3] rounded-full mx-auto mb-4" />

              <Badge className="bg-green-100 text-green-700 border-0 px-4 py-1">
                <CheckCircle className="w-4 h-4 mr-1" />
                Attendance Recorded
              </Badge>
            </div>

            {/* Session Stats */}
            <div className="bg-gradient-to-br from-[#fef9f5] to-[#ffe8e8] rounded-xl border border-[#f0ccc4] p-6 space-y-4">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-xl bg-white flex items-center justify-center border-2 border-[#b95e82]">
                  <Video className="w-8 h-8 text-[#b95e82]" />
                </div>
                <div>
                  <h3 className="text-lg text-[#494949] mb-1">
                    {session?.title}
                  </h3>
                  <p className="text-sm text-[#717182]">{session.trainer}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-4">
                <div className="text-center p-3 bg-white rounded-lg">
                  <p className="text-xs text-[#717182] mb-1">Duration</p>
                  <p className="text-sm text-[#494949]">{session.duration}</p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <p className="text-xs text-[#717182] mb-1">Trainer</p>
                  <p className="text-sm text-[#494949]">Specialist</p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <p className="text-xs text-[#717182] mb-1">Recording</p>
                  <p className="text-sm text-[#494949]">6 hours</p>
                </div>
              </div>
            </div>

            {/* Points Display */}
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-5 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border border-amber-200">
                <p className="text-3xl text-amber-700 mb-1">+50</p>
                <p className="text-xs text-amber-800">Points Earned</p>
              </div>
              <div className="text-center p-5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                <p className="text-3xl text-purple-700 mb-1">🎉</p>
                <p className="text-xs text-purple-800">Goal Achieved</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <Button
                onClick={handleViewRecording}
                className="w-full h-12 bg-gradient-to-r from-[#b95e82] to-[#d97ba3] hover:opacity-90"
                size="lg"
              >
                <PlayCircle className="w-5 h-5 mr-2" />
                View Recording
              </Button>
              <Button
                variant="outline"
                onClick={handleClose}
                className="w-full"
              >
                Explore More Classes
              </Button>
            </div>
          </div>
        )}

        {/* Screen 6: Backup Browser Join (Fallback) */}
        {currentStep === "browser-fallback" && (
          <div className="space-y-6 p-6">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mb-4">
                <ExternalLink className="w-10 h-10 text-white" />
              </div>

              <h2 className="text-2xl text-[#494949] mb-2">
                Having Trouble Joining?
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-[#b95e82] to-[#d97ba3] rounded-full mx-auto" />
            </div>

            <div className="bg-gradient-to-br from-[#fef9f5] to-[#ffe8e8] rounded-xl border border-[#f0ccc4] p-6 space-y-4">
              <p className="text-center text-[#717182]">
                You can also open the class in your browser.
              </p>

              <div className="space-y-2 text-sm text-[#717182]">
                <p className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 text-green-600" />
                  Your attendance will still be tracked
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 text-green-600" />
                  No additional login required
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 text-green-600" />
                  Same great experience
                </p>
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-sm text-amber-900 text-center">
                <Shield className="w-4 h-4 inline mr-1" />
                {"You'll still be marked present when you join."}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                onClick={handleOpenBrowser}
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:opacity-90"
                size="lg"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                Open Zoom in Browser
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentStep("join-ready")}
                className="w-full"
              >
                Back to App Join
              </Button>
              <Button
                variant="ghost"
                onClick={() => setCurrentStep("error")}
                className="w-full text-[#717182]"
              >
                Still having issues? Get help →
              </Button>
            </div>
          </div>
        )}

        {/* Error Screen */}
        {currentStep === "error" && (
          <div className="space-y-6 p-6">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center mb-4">
                <AlertTriangle className="w-10 h-10 text-white" />
              </div>

              <h2 className="text-2xl text-[#494949] mb-2">Unable to Join</h2>
              <div className="h-1 w-24 bg-gradient-to-r from-red-500 to-red-600 rounded-full mx-auto" />
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200 p-6 space-y-4">
              <p className="text-center text-red-800">
                {" We're having trouble connecting you to the session."}
              </p>

              <div className="space-y-2 text-sm text-red-700">
                <p className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-red-600 mt-2" />
                  Check your internet connection
                </p>
                <p className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-red-600 mt-2" />
                  {"Make sure you're using a supported browser"}
                </p>
                <p className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-red-600 mt-2" />
                  Try refreshing the page
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                onClick={handleTryAgain}
                className="w-full h-12 bg-gradient-to-r from-[#b95e82] to-[#d97ba3] hover:opacity-90"
                size="lg"
              >
                Try Again
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentStep("browser-fallback")}
                className="w-full"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open in Browser
              </Button>
              <Button
                variant="ghost"
                className="w-full text-[#b95e82] hover:text-[#d97ba3] hover:bg-pink-50"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat with Support
              </Button>
            </div>
          </div>
        )}

        {/* Recording Screen */}
        {currentStep === "recording" && (
          <div className="space-y-6 p-6">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mb-4">
                <PlayCircle className="w-10 h-10 text-white" />
              </div>

              <h2 className="text-2xl text-[#494949] mb-2">
                Watch Your Session
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-[#b95e82] to-[#d97ba3] rounded-full mx-auto" />
            </div>

            {/* Video Player Placeholder */}
            <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 aspect-video border-2 border-slate-700">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 mx-auto rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <PlayCircle className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-white space-y-2">
                    <h3 className="text-lg">Zoom Cloud Recording Player</h3>
                    <p className="text-sm text-white/70">{session?.title}</p>
                    <Badge className="bg-white/20 text-white border-0">
                      {session.duration} • 1080p HD
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Play Button Overlay */}
              <button className="absolute inset-0 flex items-center justify-center hover:bg-black/20 transition-colors group">
                <div className="w-16 h-16 rounded-full bg-white group-hover:bg-white/90 flex items-center justify-center transition-all transform group-hover:scale-110">
                  <PlayCircle className="w-8 h-8 text-[#b95e82]" />
                </div>
              </button>

              {/* Duration Badge */}
              <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm rounded px-2 py-1">
                <p className="text-xs text-white">{session.duration}</p>
              </div>
            </div>

            {/* Recording Info */}
            <div className="bg-gradient-to-br from-[#fef9f5] to-[#ffe8e8] rounded-xl border border-[#f0ccc4] p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center border border-[#f0ccc4]">
                  <Video className="w-6 h-6 text-[#b95e82]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-[#494949] mb-1">{session?.title}</h3>
                  <p className="text-sm text-[#717182]">
                    with {session.trainer ? session.trainer : ""}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-[#717182]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {session?.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {session?.duration}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                className="flex-1 h-12 bg-gradient-to-r from-[#b95e82] to-[#d97ba3] hover:opacity-90"
                size="lg"
              >
                <PlayCircle className="w-5 h-5 mr-2" />
                Play Recording
              </Button>
              <Button variant="outline" className="h-12 px-6" size="lg">
                <Download className="w-5 h-5" />
              </Button>
            </div>

            <Button variant="outline" onClick={handleClose} className="w-full">
              Back to Dashboard
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
