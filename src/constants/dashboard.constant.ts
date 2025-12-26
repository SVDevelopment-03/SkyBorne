import {
  DashboardIcon,
  PackagesIcon,
  SessionsIcon,
  PaymentsIcon,
  ProfileIcon,
  FeedbackIcon,
  LogoutIcon,
  LogoutIconDark,
} from "@/icons/dashboardIcon";
import {
  UserCog,
  Globe,
  Layers,
  BadgeDollarSign,
  User,
  Users,
  MessageSquare,
  CircleDollarSign,
} from "lucide-react";

export const SidebarNav = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: DashboardIcon,
      items: [],
    },
    {
      title: "Sessions",
      url: "/user-session",
      icon: SessionsIcon,
      items: [],
    },
    // {
    //   title: "Progress",
    //   url: "/progress",
    //   icon: ProgressIcon,
    //   items: [],
    // },
    {
      title: "Packages",
      url: "/user-packages",
      icon: PackagesIcon,
      items: [],
    },
    // {
    //   title: "Notifications",
    //   url: "/upcoming",
    //   icon: NotificationsIcon,
    //   items: [],
    // },
    {
      title: "Payments",
      url: "/payments",
      icon: PaymentsIcon,
      items: [],
    },
    {
      title: "Profile",
      url: "/profile",
      icon: ProfileIcon,
      items: [],
    },
    {
      title: "Feedback",
      url: "/feedback",
      icon: MessageSquare,
      items: [],
    },
    
    // {
    //   title: "Feedback",
    //   url: "/upcoming",
    //   icon: FeedbackIcon,
    //   items: [],
    // },
    {
      title: "Logout",
      logout: true, // 👈 ADD THIS
      url: "#",
      icon: LogoutIconDark,
      items: [],
    },
  ],
};

export const AdminNav = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin-dashboard",
      icon: DashboardIcon,
      items: [],
    },
    {
      title: "Class Management",
      url: "/schedule-session",
      icon: SessionsIcon,
      items: ["/create-session", "/edit-session"],
    },
    {
      title: "Trainer Management",
      url: "/trainers",
      icon: UserCog,
      items: [],
    },
    {
      title: "User Management",
      url: "/user-management",
      icon: Users,
      items: [],
    },
    {
      title: "Region Management",
      url: "/regions",
      icon: Globe,
      items: [],
    },
    {
      title: "Service Management",
      url: "/services",
      icon: Layers,
      items: [],
    },
    {
      title: "Payment Management",
      url: "/payment-management",
      icon: BadgeDollarSign,
      items: [],
    },
    {
      title: "Logout",
      logout: true,
      url: "#",
      icon: LogoutIconDark,
      items: [],
    },
  ],
};

export const TrainerNav = {
  navMain: [
    {
      title: "Dashboard",
      url: "/trainer-dashboard",
      icon: DashboardIcon,
      items: [],
    },
    {
      title: "Session",
      url: "/trainer-session",
      icon: SessionsIcon,
      items: [],
    },
     {
      title: "Earnings",
      url: "/trainer-earnings",
      icon: CircleDollarSign,
      items: [],
    },
     {
      title: "Feedback",
      url: "/trainer-feedback",
      icon: MessageSquare,
      items: [],
    },
    {
      title: "Logout",
      logout: true,
      url: "#",
      icon: LogoutIconDark,
      items: [],
    },
  ],
};
