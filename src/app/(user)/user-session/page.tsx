/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { useState } from "react";
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
} from "lucide-react";
import {
  useGetUpcomingMeetingsQuery,
  useJoinMeetingMutation,
  useLeaveMeetingMutation,
} from "@/store/api/meetingApi";
import useGetUser from "@/hooks/useGetUser";

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
}

export default function UserSessions() {
  const { user } = useGetUser();
  const [filter, setFilter] = useState<"all" | "upcoming" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // RTK Query hooks
  const {
    data: meetingsData,
    isLoading,
    error: fetchError,
    refetch,
  } = useGetUpcomingMeetingsQuery({
    region: "",
    search: searchQuery,
  });

  const [joinMeeting] = useJoinMeetingMutation();
  const [leaveMeeting] = useLeaveMeetingMutation();

  // Transform and filter meetings
  const sessions: Session[] = (meetingsData?.meetings || []).map(
    (meeting: any) => ({
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
      status:
        new Date(meeting.localTime) > new Date() ? "upcoming" : "completed",
      participants: 0,
      maxParticipants: 20,
      level: "Intermediate",
      service: meeting.service?.title || "Wellness",
      joinUrl: meeting.joinUrl,
      recordingUrl: meeting.recordingUrl,
      regions: meeting.regions,
      liveRegion: meeting.liveRegion,
      _id: meeting._id,
    })
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
    (s) => s.status === "completed"
  ).length;

  const handleJoinSession = async (session: Session) => {
    try {
      const result = await joinMeeting({
        meetingId: session._id,
        userId: user?.id,
        region: session.liveRegion || "Global",
      }).unwrap();

      if (result.success) {
        window.open(result.data.accessUrl, "_blank");
      }
    } catch (err: any) {
      console.error("Error joining session:", err);
      alert(err?.data?.message || "Failed to join session");
    }
  };

  const handleViewRecording = (session: Session) => {
    if (session.recordingUrl) {
      window.open(session.recordingUrl, "_blank");
    } else {
      alert("Recording not yet available");
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
    <div className="p-4 lg:p-8 space-y-6">
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
                  {sessions.length}
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
            <div className="flex gap-2 w-full md:w-auto">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                onClick={() => setFilter("all")}
                className={
                  filter === "all" ? "bg-[#b95e82] hover:bg-[#a04d6f]" : ""
                }
                style={{ borderRadius: "12px" }}
              >
                All Sessions
              </Button>
              <Button
                variant={filter === "upcoming" ? "default" : "outline"}
                onClick={() => setFilter("upcoming")}
                className={
                  filter === "upcoming" ? "bg-[#b95e82] hover:bg-[#a04d6f]" : ""
                }
                style={{ borderRadius: "12px" }}
              >
                Upcoming ({upcomingCount})
              </Button>
              <Button
                variant={filter === "completed" ? "default" : "outline"}
                onClick={() => setFilter("completed")}
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
                onChange={(e) => setSearchQuery(e.target.value)}
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSessions.map((session) => {
            const startTime = new Date(session?.localTime as string); // e.g., 2025-12-10T08:30:00.000Z
            const now = new Date();

            // calculate difference in minutes
            const diffMs = startTime.getTime() - now.getTime();
            const diffMinutes = diffMs / 1000 / 60;

            // allow joining only when remaining time <= 5 minutes
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
                        with {session.trainer}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-[#6B6B6B]">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{session.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#6B6B6B]">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">
                        {session.time} • {session.duration} min
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[#6B6B6B]">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{session.type}</span>
                    </div>
                    {/* <div className="flex items-center gap-2 text-[#6B6B6B]">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">
                      {session.regions?.length || 1} regions available
                    </span>
                  </div> */}
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
                      <>
                        <Button
                          className="flex-1 bg-[#b95e82] hover:bg-[#a04d6f] text-white"
                          style={{ borderRadius: "12px" }}
                          disabled={isJoinDisabled}
                          onClick={() => handleJoinSession(session)}
                        >
                          Join Session
                        </Button>
                        {/* <Button 
                        variant="outline"
                        className="flex-1 border-[#b95e82] text-[#b95e82] hover:bg-[#b95e82]/10"
                        style={{ borderRadius: '12px' }}
                      >
                        View Details
                      </Button> */}
                      </>
                    ) : (
                      <>
                        <Button
                          className="flex-1 bg-[#5eb9b4] hover:bg-[#4a9d98] text-white"
                          style={{ borderRadius: "12px" }}
                          onClick={() => handleViewRecording(session)}
                        >
                          Watch Recording
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 border-[#5eb9b4] text-[#5eb9b4] hover:bg-[#5eb9b4]/10"
                          style={{ borderRadius: "12px" }}
                        >
                          View Summary
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
