/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Users,
  Search,
  MapPin,
  Loader,
  AlertCircle,
  PlayCircle,
} from "lucide-react";
import {
  useGetAllTrainerMeetingsQuery,
  useGetUpcomingMeetingsQuery,
  useJoinMeetingMutation,
  useLeaveMeetingMutation,
} from "@/store/api/meetingApi";
import useGetUser from "@/hooks/useGetUser";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import toast from "react-hot-toast";
import { ZoomSessionFlow } from "@/components/dashboard/user-dashboard/ZoomSessionFlow"; 
import CustomPagination from "@/components/ui/CustromPagination";
import { useUserRegionFromStore } from "@/utils/timezone";
interface Session {
  id: string;
  name: string;
  trainer: string;
  date: string;
  time: string;
  localTime: string;
  duration: number;
  type: string;
  status: "upcoming" | "completed";
  participants: number;
  maxParticipants: number;
  level: string;
  service: string;
  joinUrl: string;
  recordingUrl: string;
  regions: Array<{
    region: string;
    localTime: string;
    timezone: string;
    mode: "live" | "replay";
  }>;
  liveRegion: string;
  _id: string;
  joined?: boolean;
}

/**
 * ✅ Helper function to determine meeting status
 * Meetings show as "completed" 1 hour AFTER they end
 * Logic: completion time = localTime + duration + 1 hour buffer
 */
const calculateMeetingStatus = (
  meeting: any,
  meetingStatus: string,
): "upcoming" | "completed" => {
  const now = new Date();

  // First check if meeting has explicit status from Zoom
  if (meetingStatus === "completed") {
    return "completed";
  }
  if (meetingStatus === "failed") {
    return "completed"; // Treat failed as completed
  }

  // For pending meetings, check if meeting end time + 1 hour buffer has passed
  const meetingTime = new Date(meeting.localTime);
  const meetingDurationMs = (meeting.duration || 0) * 60 * 1000; // Convert minutes to milliseconds
  const oneHourMs = 60 * 60 * 1000; // 1 hour in milliseconds

  // Calculate when meeting should be marked as completed
  // = meeting start time + duration + 1 hour buffer
  const meetingCompletionTime = new Date(
    meetingTime.getTime() + meetingDurationMs + oneHourMs,
  );

  if (now >= meetingCompletionTime) {
    // Current time has passed meeting end time + 1 hour buffer
    return "completed";
  }

  return "upcoming";
};

export default function TrainerSessions() {
  const { user } = useGetUser();
  const [filter, setFilter] = useState<"all" | "upcoming" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [showClassModal, setShowClassModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [showZoomFlow, setShowZoomFlow] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [userRegion, setUserRegion] = useState<{
    region: string | null;
  } | null>(null);
  const { region } = useUserRegionFromStore();
  // RTK Query hooks - ✅ NOW INCLUDES REGION PARAMETER TO MATCH UserSessions
  const {
    data: meetingsResponse,
    isLoading,
    error: fetchError,
    refetch,
  } = useGetAllTrainerMeetingsQuery({
    region: userRegion?.region,
    search: searchQuery,
    page,
    limit: 50,
    sortBy: "localTime",
    sortOrder: "asc",
  });
  const [joinMeeting, { isLoading: isJoining }] = useJoinMeetingMutation();
  const [leaveMeeting] = useLeaveMeetingMutation();
  useEffect(() => {
    setTimeout(() => {
      setUserRegion({ region: region });
    }, 0);
  }, [region]);

  const formatDateWithTimezone = (iso: string, tz?: string) => {
    if (!iso) return "N/A";
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };
  const formatTimeWithTimezone = (iso: string, tz?: string) => {
    if (!iso) return "N/A";
    return new Date(iso).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };
  const formatDateTimeWithTimezone = (isoString: string) => {
    const date = formatDateWithTimezone(isoString);
    const time = formatTimeWithTimezone(isoString);
    return `${date}, ${time}`;
  };
  // Transform and filter meetings
  const sessions: Session[] = (meetingsResponse?.data?.meetings || []).map(
    (meeting: any) => {
      // ✅ Use the helper function to calculate status
      const calculatedStatus = calculateMeetingStatus(meeting, meeting.status);

      return {
        id: meeting._id,
        name: meeting.title,
        trainer: meeting.trainer?.name || "Unknown Trainer",
        date: new Date(meeting.localTime).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        time: new Date(meeting.localTime).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        duration: meeting.duration,
        localTime: meeting?.localTime,
        type: "Online",
        status: calculatedStatus, // Use calculated status
        participants: 0,
        maxParticipants: 20,
        level: "Intermediate",
        service: meeting.service?.title || "Wellness",
        joinUrl: meeting.joinUrl,
        recordingUrl: meeting.recordingUrl,
        regions: meeting.regions,
        liveRegion: meeting.liveRegion,
        _id: meeting._id,
        joined: meeting.joined || false,
      };
    },
  );
  const filteredSessions = sessions.filter((session) => {
    const matchesFilter = filter === "all" || session.status === filter;
    const matchesSearch =
      session.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.trainer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.service.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  const upcomingCount = sessions.filter((s) => s.status === "upcoming").length;
  const completedCount = sessions.filter(
    (s) => s.status === "completed",
  ).length;
  const pagination = meetingsResponse?.data?.pagination;
  const handleJoinClass = (session: Session) => {
    const regionInfo = session?.regions?.find(
      (r: any) => r.region == userRegion?.region,
    );
    const formattedDate = formatDateWithTimezone(
      session?.localTime,
      "live",
    );
    const classItem = {
      meetingId: session._id,
      userId: user?.id,
      joined: session.joined,
      participants: [],
      participantsCount: 0,
      image: "/images/upcoming-ico.jpg",
      time: regionInfo?.localTime,
      startTime: session?.localTime,
      date: formattedDate,
      title: session.name,
      duration: `${session.duration} min`,
      trainer: session.trainer,
    };
    setSelectedClass(classItem);
    setShowClassModal(true);
    toast.success(`You're set for ${session.name}!`);
  };
  const handleJoinMeeting = async (session: Session) => {
    if (!session._id || !user?.id || !session.liveRegion) {
      toast.error("Missing meeting or user information");
      return;
    }
    // Open popup FIRST (synchronously from user interaction)
    const popup = window.open(
      "",
      "zoomMeetingPopup",
      "width=1000,height=700,left=200,top=100,toolbar=no,menubar=no,scrollbars=yes,resizable=yes",
    );
    if (!popup) {
      toast.error("Popup blocked. Please allow popups for this site.");
      return;
    }
    try {
      const res = await joinMeeting({
        meetingId: session._id,
        userId: user?.id,
        region: userRegion?.region,
      }).unwrap();
      const { accessUrl: joinUrl, mode } = res?.data;
      if (!joinUrl) {
        toast.error("Access URL not found");
        popup.close();
        return;
      }
      if (mode === "live") {
        popup.location.href = joinUrl;
        toast.success("Joining meeting...");
      } else {
        popup.close();
        setVideoUrl(joinUrl);
        setShowVideoPlayer(true);
      }
    } catch (err: any) {
      console.error("Join meeting error:", err);
      popup?.close();
      toast.error(
        err?.data?.message || err?.message || "Failed to join meeting",
      );
    }
  };
  const handleViewRecording = async (session: Session) => {
    if (!session._id || !user?.id || !session.liveRegion) {
      toast.error("Missing meeting or user information");
      return;
    }
    try {
      const res = await joinMeeting({
        meetingId: session._id,
        userId: user?.id,
        region: userRegion?.region,
      }).unwrap();
      const { recordUrl } = res?.data;
      if (!recordUrl) {
        toast.error("Recording URL not found");
        return;
      }
      setVideoUrl(recordUrl);
      setShowVideoPlayer(true);
    } catch (err: any) {
      console.error("View recording error:", err);
      toast.error(
        err?.data?.message || err?.message || "Failed to load recording",
      );
    }
  };
  if (isLoading) {
    return (
      <div className="p-4 lg:p-8 space-y-6">
        <div>
          <h1 className="text-3xl text-[#1A1A1A] mb-2">My Sessions</h1>
          <p className="text-[#6B6B6B]">
            View and manage all your yoga and wellness sessions
          </p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader className="w-8 h-8 text-[#b95e82] animate-spin mx-auto mb-2" />
            <p className="text-[#6B6B6B]">Loading sessions...</p>
          </div>
        </div>
      </div>
    );
  }
  if (fetchError) {
    return (
      <div className="p-4 lg:p-8 space-y-6">
        <div>
          <h1 className="text-3xl text-[#1A1A1A] mb-2">My Sessions</h1>
          <p className="text-[#6B6B6B]">
            View and manage all your yoga and wellness sessions
          </p>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div>
              <p className="text-red-800 font-medium">Error loading sessions</p>
              <p className="text-red-600 text-sm">
                Please try again later or contact support
              </p>
            </div>
            <Button
              onClick={() => refetch()}
              className="ml-auto bg-red-600 hover:bg-red-700"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div className="p-4 lg:p-8 space-y-6 overflow-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl text-[#1A1A1A] mb-2">My Sessions</h1>
        <p className="text-[#6B6B6B]">
          View and manage all your yoga and wellness sessions
        </p>
      </div>
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-[#e5e5e5]" style={{ borderRadius: "20px" }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B6B6B] mb-1 font-satoshi-500">
                  Total Sessions
                </p>
                <p className="text-3xl text-[#494949] font-satoshi-500">
                  {pagination?.total || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#b95e82]/20 to-[#d4a5b9]/20 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-[#b95e82]" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#e5e5e5]" style={{ borderRadius: "20px" }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B6B6B] mb-1 font-satoshi-500">
                  Upcoming
                </p>
                <p className="text-3xl text-[#494949] font-satoshi-500">
                  {upcomingCount}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#b95e82]/20 to-[#d4a5b9]/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-[#b95e82]" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#e5e5e5]" style={{ borderRadius: "20px" }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B6B6B] mb-1 font-satoshi-500">
                  Completed
                </p>
                <p className="text-3xl text-[#494949] font-satoshi-500">
                  {completedCount}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#b95e82]/20 to-[#d4a5b9]/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-[#b95e82]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Filter and Search */}
      <Card className="border-[#e5e5e5]" style={{ borderRadius: "20px" }}>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                onClick={() => {
                  setFilter("all");
                  setPage(1);
                }}
                className={
                  filter === "all" ? "bg-[#b95e82] hover:bg-[#a04d6f]" : ""
                }
                style={{ borderRadius: "12px" }}
              >
                All Sessions
              </Button>
              <Button
                variant={filter === "upcoming" ? "default" : "outline"}
                onClick={() => {
                  setFilter("upcoming");
                  setPage(1);
                }}
                className={
                  filter === "upcoming" ? "bg-[#b95e82] hover:bg-[#a04d6f]" : ""
                }
                style={{ borderRadius: "12px" }}
              >
                Upcoming ({upcomingCount})
              </Button>
              <Button
                variant={filter === "completed" ? "default" : "outline"}
                onClick={() => {
                  setFilter("completed");
                  setPage(1);
                }}
                className={
                  filter === "completed"
                    ? "bg-[#b95e82] hover:bg-[#a04d6f]"
                    : ""
                }
                style={{ borderRadius: "12px" }}
              >
                Completed ({completedCount})
              </Button>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6B6B6B]" />
              <input
                type="text"
                placeholder="Search sessions..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-[#e5e5e5] rounded-xl focus:outline-none focus:border-[#b95e82] focus:ring-2 focus:ring-[#b95e82]/20"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Sessions List */}
      {filteredSessions.length === 0 ? (
        <Card className="border-[#e5e5e5]" style={{ borderRadius: "24px" }}>
          <CardContent className="p-12 text-center">
            <Calendar className="w-12 h-12 text-[#d4a5b9] mx-auto mb-4 opacity-50" />
            <p className="text-[#6B6B6B] text-lg">No sessions found</p>
            <p className="text-[#b4b4b4] text-sm mt-1">
              Try adjusting your search or filters
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredSessions.map((session) => {
              const regionInfo = session?.regions?.find(
                (r: any) => r.region == userRegion?.region,
              );
              const formattedTime = formatTimeWithTimezone(
                session?.localTime,
              );
              const formattedDate = formatDateWithTimezone(
                session?.localTime
              );
              const startTime = new Date(session?.localTime as string);
              const now = new Date();
              const diffMs = startTime.getTime() - now.getTime();
              const diffMinutes = diffMs / 1000 / 60;
              const isJoinDisabled = diffMinutes > 5;
            
              return (
                <Card
                  key={session.id}
                  className="border-[#e5e5e5] hover:shadow-lg transition-shadow"
                  style={{ borderRadius: "24px" }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl text-[#1A1A1A]">
                            {session.name}
                          </h3>
                          <Badge
                            className={`py-1! ${
                              session.status === "upcoming"
                                ? "bg-[#27AE60]/10 text-[#27AE60]"
                                : "bg-[#5eb9b4]/10 text-[#5eb9b4]"
                            }`}
                            style={{ borderRadius: "8px" }}
                          >
                            {session.status === "upcoming"
                              ? "Upcoming"
                              : "Completed"}
                          </Badge>
                        </div>
                        <p className="text-sm text-[#6B6B6B]">
                          with {session?.trainer}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-[#6B6B6B]">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">{formattedDate}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#6B6B6B]">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">
                          {formattedTime} • {session.duration} min
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[#6B6B6B]">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{session.type}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <Badge
                        className="bg-[#b95e82]/10 text-[#b95e82] py-1!"
                        style={{ borderRadius: "8px" }}
                      >
                        {session.service}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      {session.status === "upcoming" ? (
                        <Button
                          className="flex-1 bg-[#b95e82] hover:bg-[#a04d6f] text-white"
                          style={{ borderRadius: "12px" }}
                          onClick={() => handleJoinClass(session)}
                        >
                          {isJoining
                            ? "Loading..."
                            : session.joined
                              ? "Joined"
                              : "Join Session"}
                        </Button>
                      ) : (
                        <>
                          <Button
                            className="flex-1 bg-[#b95e82] hover:bg-[#a04d6f] text-white"
                            style={{ borderRadius: "12px" }}
                            onClick={() => handleViewRecording(session)}
                          >
                            Watch Recording
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center pt-4">
              <CustomPagination
                totalPages={pagination.totalPages}
                currentPage={pagination.currentPage}
                onPageChange={setPage}
                visiblePages={3}
              />
            </div>
          )}
        </>
      )}
      {/* Session Details Modal */}
      <Dialog open={showClassModal} onOpenChange={setShowClassModal}>
        <DialogContent className="border-[#f0ccc4]">
          <DialogHeader>
            <DialogTitle className="text-[#494949]">
              Session Details
            </DialogTitle>
            <DialogDescription>
              You're all set for {selectedClass?.title}
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
      {selectedClass && (
        <ZoomSessionFlow
          isOpen={showZoomFlow}
          isLive={true}
          joinMeeting={() =>
            handleJoinMeeting(
              filteredSessions.find(
                (s) => s._id === selectedClass.meetingId,
              ) as Session,
            )
          }
          onClose={() => setShowZoomFlow(false)}
          session={selectedClass}
        />
      )}
      {/* Video Player Modal */}
      {showVideoPlayer && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-4xl rounded-lg p-4">
            <button
              className="mb-3 text-right w-full"
              onClick={() => setShowVideoPlayer(false)}
            >
              Close
            </button>
            <video
              src={videoUrl as string}
              controls
              autoPlay
              playsInline
              crossOrigin="anonymous"
              className="w-full rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}