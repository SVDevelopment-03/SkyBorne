export type SubscriptionStatus =
  | "active"
  | "inactive"
  | "cancelled"
  | "suspended"
  | "expired"
  | "pending"
  | string;

export type Subscription = {
  _id?: string;
  plan?: string;
  status?: SubscriptionStatus;
  startDate?: string | Date;
  endDate?: string | Date;
  amount?: number;
  currency?: string;
  paymentMethod?: string;
  autoRenew?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type ClassCredits = {
  _id?: string;
  yoga?: number;
  zumba?: number;
  specialty?: number;
};

export type User = {
  id?: string;
  _id?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  role?: string;
  onboardingCompleted?: boolean;
  country?: string;
  countryCode?: string;
  state?: string;
  city?: string;
  address?: string;
  location?: string;
  plan?: string;
  pendingPlan?: string;
  pendingEffectiveDate?: string;
  pendingBillingType?: "monthly" | "yearly";
  subscription?: Subscription;
  subscriptionStatus?: string;
  cancelledAt?: string | null;
  isActive?: boolean;
  createdAt?: string;
  classCredits?: ClassCredits;
  totalClassCredits?: number;
  image?: string;
  totalClasses?: number;
  [key: string]: unknown;
};

export type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
};
