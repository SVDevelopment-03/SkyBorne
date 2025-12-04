"use client";
import { useState } from "react";
import CreateMeetingModal from "./CreatingMeeting";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/layout/sidebar";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import AdminSidebar from "@/components/layout/admin-sidebar";

export default function AdminMeetingsPage() {
  const [open, setOpen] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  console.log(user?.id);

  return (
    <>
      {/* <div className="flex items-start justify-end p-10">
        <Button
          onClick={() => setOpen(true)}
          variant={"themeRect"}
          className="py-1! min-h-[45px]!"
        >
          Create Meeting
        </Button>
      </div>

      <CreateMeetingModal
        open={open}
        onClose={() => setOpen(false)}
        adminId={user?.id}
      /> */}
    </>
  );
}
