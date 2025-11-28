"use client";
import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const UserAvatar = ({ name }: { name: string }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setMounted(true); // mark component as mounted on client
    }, 0);
  }, []);

  if (!mounted) return null;

  return (
    <Avatar className="h-11 w-11">
      <AvatarImage src={"/path/to/user-dp.jpg"} />
      <AvatarFallback className="bg-[#b95e82] text-white">
        {name.toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
