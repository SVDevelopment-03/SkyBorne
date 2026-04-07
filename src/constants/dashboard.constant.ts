import {
  DashboardIcon,
  PlanIcon,
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
  TicketX,
  ShoppingCart,
  ShoppingBag,
  Package,
  Users as CustomersIcon,
  Warehouse,
  Tag,
  Truck,
  CreditCard,
  Heart,
  BarChart3,
  ChevronDown,
  Package2Icon,
  Boxes,
  Mail,
  AlertTriangle,
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
      title: "Products",
      url: "",
      icon: Package2Icon,
      items: [
        {
          title: "Products",
          url: "/product",
          icon: Package2Icon,
        },
        {
          title: "Cart",
          url: "/cart",
          icon: ShoppingBag,
        },
        {
          title: "Checkout",
          url: "/checkout",
          icon: ShoppingCart,
        },
        {
          title: "My Orders",
          url: "/my-orders",
          icon: Truck,
        },
        {
          title: "Interested",
          url: "/product-interests",
          icon: Heart,
        },
      ],
      isCollapsible: true,
      collapsibleIcon: ChevronDown,
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
      title: "Cancel Subscription",
      url: "/cancel-subscription",
      icon: TicketX,
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
      title: "Plan Management",
      url: "/plans",
      icon: PlanIcon,
      items: ["/create-plan", "/edit-plan"],
    },
    {
      title: "Payment Management",
      url: "/payment-management",
      icon: BadgeDollarSign,
      items: [],
    },
    {
      title: "Recurring Failed",
      url: "/recurring-failed",
      icon: AlertTriangle,
      items: [],
    },
    {
      title: "Reminder Management",
      url: "/mail-management",
      icon: Mail,
      items: [],
    },
    {
      title: "Feedback Management",
      url: "/feedback-management",
      icon: MessageSquare,
      items: [],
    },
    // Ecom Module with collapsible sub-items
    {
      title: "Ecom",
      url: "",
      icon: ShoppingCart,
      items: [
        {
          title: "Products",
          url: "/products",
          icon: Package,
        },
        {
          title: "Categories",
          url: "/categories",
          icon: Tag,
        },
        {
          title: "Inventory",
          url: "/inventory",
          icon: Boxes,
        },
        {
          title: "Interested",
          url: "/interests",
          icon: Heart,
        },
        {
          title: "Customers",
          url: "/customers",
          icon: CustomersIcon,
        },
        {
          title: "Orders",
          url: "/orders",
          icon: ShoppingCart,
        },
       
        {
          title: "Payments",
          url: "/payment-list",
          icon: CreditCard,
        },
      ],
      isCollapsible: true,
      collapsibleIcon: ChevronDown,
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
