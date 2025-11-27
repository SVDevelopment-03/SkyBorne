import {
  DashboardIcon,
  PackagesIcon,
  ProgressIcon,
  SessionsIcon,
  NotificationsIcon,
  PaymentsIcon,
  ProfileIcon,
  FeedbackIcon,
  LogoutIcon,
  LogoutIconDark,
} from "@/icons/dashboardIcon";

export const SidebarNav = {
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: DashboardIcon,
      items: [],
    },
    {
      title: "Sessions",
      url: "#",
      icon: SessionsIcon,
      items: [],
    },
    {
      title: "Progress",
      url: "#",
      icon: ProgressIcon,
      items: [],
    },
    {
      title: "Packages",
      url: "#",
      icon: PackagesIcon,
      items: [],
    },
    {
      title: "Notifications",
      url: "#",
      icon: NotificationsIcon,
      items: [],
    },
    {
      title: "Payments",
      url: "#",
      icon: PaymentsIcon,
      items: [],
    },
    {
      title: "Profile",
      url: "#",
      icon: ProfileIcon,
      items: [],
    },
    {
      title: "Feedback",
      url: "#",
      icon: FeedbackIcon,
      items: [],
    },
    {
      title: "Logout",
      logout: true, // 👈 ADD THIS
      url: "#",
      icon: LogoutIconDark,
      items: [],
    },
  ],
};
