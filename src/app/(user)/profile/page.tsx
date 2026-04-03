/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import "react-phone-number-input/style.css";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Save,
  AlertCircle,
  Loader2,
} from "lucide-react";
import useGetUser from "@/hooks/useGetUser";
import { useUpdateProfileMutation } from "@/store/api/authApi";
import { PackageType } from "../user-packages/UpgradePlan";
import PhoneInput, {
  isValidPhoneNumber,
  parsePhoneNumber,
} from "react-phone-number-input";
import toast from "react-hot-toast";
import { Country, State } from "country-state-city";
import { CommonSelect, SelectOptionItem } from "@/components/ui/CountrySelect";
import { Input2 } from "@/components/ui/input";

interface UserProp {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  city: string;
}

const isValidEmail = (email: string) => {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(email) 
         && !/\.\./.test(email)  
         && !/^\./.test(email)    
         && !/\.$/.test(email);   
};

const ALL_COUNTRIES = Country.getAllCountries();
const COUNTRY_OPTIONS: SelectOptionItem[] = ALL_COUNTRIES.map((country) => ({
  label: country.name,
  value: country.isoCode,
}));
const COUNTRY_NAME_BY_CODE = new Map(
  ALL_COUNTRIES.map((country) => [country.isoCode, country.name])
);
const COUNTRY_CODE_BY_NAME = new Map(
  ALL_COUNTRIES.map((country) => [country.name.toLowerCase(), country.isoCode])
);

const resolveCountryCode = (value: string, fallback = "") => {
  if (!value) return fallback;
  const trimmed = value.trim();
  if (/^[a-z]{2}$/i.test(trimmed)) return trimmed.toUpperCase();
  return COUNTRY_CODE_BY_NAME.get(trimmed.toLowerCase()) || fallback || "";
};

const resolveCountryName = (value: string) => {
  if (!value) return "";
  const trimmed = value.trim();
  if (/^[a-z]{2}$/i.test(trimmed)) {
    return COUNTRY_NAME_BY_CODE.get(trimmed.toUpperCase()) || trimmed;
  }
  return trimmed;
};

export default function UserProfile() {
  const { user } = useGetUser();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [formData, setFormData] = useState<UserProp>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    state: "",
    city: "",
  });

  const [errors, setErrors] = useState<{
    email?: string;
    phone?: string;
    city?: string;
  }>({});

  const [updateError, setUpdateError] = useState<string>("");
  const [updateSuccess, setUpdateSuccess] = useState<string>("");

  // Initialize form data when user data loads
  useEffect(() => {
    if (user) {
      const userCountry = typeof user.country === "string" ? user.country : "";
      const userCountryCode =
        typeof user.countryCode === "string" ? user.countryCode : "";
      const userPhone =
        typeof user.phoneNumber === "string" ? user.phoneNumber : "";
      const resolvedCountryCode = resolveCountryCode(
        userCountry,
        userCountryCode
      );

      setTimeout(() => {
        setFormData({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          phone: userPhone,
          country: resolvedCountryCode,
          state: user.state || "",
          city: user.city || "",
        });
      }, 0);
    }
  }, [user]);

  // Get initials for avatar
  const getInitials = () => {
    const first = user?.firstName?.charAt(0) || "U";
    const last = user?.lastName?.charAt(0) || "";
    return (first + last).toUpperCase();
  };

  // Get member since date
  const getMemberSince = () => {
    if (!user?.createdAt) return "N/A";
    return new Date(user.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  // Get plan display name
  const getPlanDisplayName = (plan?: string) => {
    const planMap: Record<string, string> = {
      "gold-yoga": "Gold Yoga",
      "gold-zumba": "Gold Zumba",
      "gold-mixed": "Gold Mixed",
      diamond: "Diamond",
      platinum: "Platinum",
    };
    if (!plan) return "Premium Member";
    return planMap[plan] || "Premium Member";
  };

  const handleInputChange = <K extends keyof UserProp>(
    field: K,
    value: UserProp[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setErrors({});

    // EMAIL VALIDATION
    if (!formData.email || !isValidEmail(formData.email)) {
      setErrors({ email: "Please enter a valid email address" });
      toast.error("Invalid email address");
      return;
    }

    // PHONE VALIDATION
    if (!formData.phone || !isValidPhoneNumber(formData.phone)) {
      setErrors({ phone: "Please enter a valid phone number" });
      toast.error("Invalid phone number");
      return;
    }

    // CITY VALIDATION
    if (!formData.city || !formData.city.trim()) {
      setErrors({ city: "City is required" });
      toast.error("City is required");
      return;
    }

    try {
      setUpdateError("");
      setUpdateSuccess("");

      // Only send changed fields
      const userCountry = typeof user?.country === "string" ? user.country : "";
      const userCountryCode =
        typeof user?.countryCode === "string" ? user.countryCode : "";
      const resolvedCountryCode = resolveCountryCode(
        userCountry,
        userCountryCode
      );

      const updatePayload: Partial<UserProp> = {};
      (Object.keys(formData) as (keyof UserProp)[]).forEach((key) => {
        const userValue =
          key === "phone"
            ? user?.phoneNumber
            : key === "country"
              ? resolvedCountryCode
              : user?.[key];

        if (formData[key] !== userValue) {
          updatePayload[key] = formData[key];
        }
      });

      if (updatePayload.phone) {
        const phoneNumber = parsePhoneNumber(updatePayload.phone);
        updatePayload.phone = phoneNumber?.number;
      }

      if (Object.keys(updatePayload).length === 0) {
        setUpdateSuccess("No changes to save");
        setIsEditing(false);
        return;
      }
      await updateProfile(updatePayload).unwrap();
      toast.success("Profile updated successfully!")
      setUpdateSuccess("Profile updated successfully!");
      setIsEditing(false);
    } catch (err: any) {
       toast.error(err?.data?.message || "Failed to update profile")
      setUpdateError(err?.data?.message || "Failed to update profile");
    }
  };

  const handleCancel = () => {
    // Reset form to original user data
    if (user) {
      const userCountry = typeof user.country === "string" ? user.country : "";
      const userCountryCode =
        typeof user.countryCode === "string" ? user.countryCode : "";
      const resolvedCountryCode = resolveCountryCode(
        userCountry,
        userCountryCode
      );

      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phoneNumber || "",
        country: resolvedCountryCode,
        state: user.state || "",
        city: user.city || "",
      });
    }
    setIsEditing(false);
    setUpdateError("");
  };

  const stateOptions: SelectOptionItem[] = formData.country
    ? State.getStatesOfCountry(formData.country).map((region) => ({
        label: region.name,
        value: region.name,
      }))
    : [];

  if (!user) {
    return (
      <div className="p-4 lg:p-8">
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <div>
            <h3 className="text-red-600 font-semibold">
              Error Loading Profile
            </h3>
            <p className="text-sm text-red-600">Failed to load user profile</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 lg:p-8 space-y-5 sm:space-y-6">
      <div>
        <h1 className="text-3xl text-[#1A1A1A] mb-2">My Profile</h1>
        <p className="text-[#6B6B6B]">
          Manage your personal information and preferences
        </p>
      </div>

      {/* Profile Header */}
      <Card
        className="border-none"
        style={{
          borderRadius: "24px",
          background: "#B95E82",
        }}
      >
        <CardContent className="p-8">
          <div className="flex flex-col sm:flex-col md:flex-row items-center gap-4 sm:gap-6 text-white">
            <div className="relative">
              <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl sm:text-4xl md:text-5xl font-bold">
                {getInitials()}
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-xl sm:text-2xl md:text-3xl mb-1 sm:mb-2">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-white/90 mb-4">
                {getPlanDisplayName(user?.plan)}
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    Member since {getMemberSince()}
                  </span>
                </div>
                {user.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{user.location}</span>
                  </div>
                )}
              </div>
            </div>
            <Button
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              disabled={isUpdating}
              className="w-full sm:w-auto bg-white text-[#b95e82] hover:bg-gray-50 hover:text-[#494949] disabled:opacity-50" 
              style={{ borderRadius: "12px" }}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : isEditing ? (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card className="border-[#e5e5e5] mb-20 sm:mb-0" style={{ borderRadius: "24px" }}>
        <CardHeader>
          <CardTitle className="text-xl text-[#1A1A1A]">
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-[#6B6B6B] mb-2 block">
                First Name
              </label>
              <input
                type="text"
                value={formData.firstName || ""}
                disabled={!isEditing}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className="w-full px-4 py-2 border border-[#e5e5e5] rounded-xl focus:outline-none focus:border-[#b95e82] focus:ring-2 focus:ring-[#b95e82]/20 disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="text-sm text-[#6B6B6B] mb-2 block">
                Last Name
              </label>
              <input
                type="text"
                value={formData.lastName || ""}
                disabled={!isEditing}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className="w-full px-4 py-2 border border-[#e5e5e5] rounded-xl focus:outline-none focus:border-[#b95e82] focus:ring-2 focus:ring-[#b95e82]/20 disabled:bg-gray-50"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-[#6B6B6B] mb-2 block">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6B6B6B] pointer-events-none" />
              <input
                type="email"
                value={formData.email || ""}
                disabled={!isEditing}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border border-[#e5e5e5] rounded-xl focus:outline-none 
                ${errors.email ? "border-red-500" : "border-[#e5e5e5]"} disabled:bg-gray-50 disabled:opacity-50`}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>
            {/* <p className="text-xs text-[#6B6B6B] mt-1">
              You can update your email address
            </p> */}
          </div>

          {/* <div>
            <label className="text-sm text-[#6B6B6B] mb-2 block">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6B6B6B]" />
              <input
                type="tel"
                value={formData.phone || ""}
                disabled={!isEditing}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[#e5e5e5] rounded-xl focus:outline-none focus:border-[#b95e82] focus:ring-2 focus:ring-[#b95e82]/20 disabled:bg-gray-50"
              />
            </div>
          </div> */}

          <div>
            <label className="text-sm text-[#6B6B6B] mb-2 block">
              Phone Number
            </label>
           <div className="relative">
              {isEditing ? (
                <PhoneInput
                  international
                  defaultCountry="AE"
                  value={formData.phone}
                  onChange={(value) => handleInputChange("phone", value || "")}
                  className={`w-full px-4 py-2 border rounded-xl focus:outline-none ${errors.phone ? "border-red-500" : "border-[#e5e5e5]"}`}
                  // className="w-full px-4 py-2 border border-[#e5e5e5] rounded-xl focus:outline-none focus:border-[#b95e82] focus:ring-2 focus:ring-[#b95e82]/20"
                />
              ) : (
                <>
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6B6B6B]" />
                  <input
                    type="tel"
                    value={formData.phone || ""}
                    disabled={true}
                    className="w-full pl-10 pr-4 py-2 border border-[#e5e5e5] rounded-xl focus:outline-none disabled:bg-gray-50 cursor-not-allowed"
                  />
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              {isEditing ? (
                <CommonSelect
                  options={COUNTRY_OPTIONS}
                  label="Country"
                  value={formData.country}
                  onChange={(value) => {
                    handleInputChange("country", value);
                    if (value !== formData.country) {
                      handleInputChange("state", "");
                    }
                  }}
                />
              ) : (
                <>
                  <label className="text-sm text-[#6B6B6B] mb-2 block">
                    Country
                  </label>
                  <input
                    type="text"
                    value={resolveCountryName(formData.country) || ""}
                    disabled
                    className="w-full px-4 py-2 border border-[#e5e5e5] rounded-xl focus:outline-none disabled:bg-gray-50 cursor-not-allowed"
                  />
                </>
              )}
            </div>
            <div>
              {isEditing ? (
                <CommonSelect
                  options={stateOptions}
                  label="State"
                  value={formData.state}
                  onChange={(value) => handleInputChange("state", value)}
                />
              ) : (
                <>
                  <label className="text-sm text-[#6B6B6B] mb-2 block">
                    State
                  </label>
                  <input
                    type="text"
                    value={formData.state || ""}
                    disabled
                    className="w-full px-4 py-2 border border-[#e5e5e5] rounded-xl focus:outline-none disabled:bg-gray-50 cursor-not-allowed"
                  />
                </>
              )}
            </div>
          </div>

          <div>
            {isEditing ? (
              <div className="flex flex-col gap-3">
                <label className="text-sm text-[#6B6B6B] mb-1">
                  City *
                </label>
                <Input2
                  name="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className="bg-[#F3F3F5] min-h-[55px]"
                />
                {errors.city && (
                  <p className="text-xs text-red-500">{errors.city}</p>
                )}
              </div>
            ) : (
              <>
                <label className="text-sm text-[#6B6B6B] mb-2 block">
                  City
                </label>
                <input
                  type="text"
                  value={formData.city || ""}
                  disabled
                  className="w-full px-4 py-2 border border-[#e5e5e5] rounded-xl focus:outline-none disabled:bg-gray-50 cursor-not-allowed"
                />
              </>
            )}
          </div>

          {isEditing && (
            <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4">
              <Button
                onClick={handleCancel}
                variant="outline"
                type="button"
                className="border-[#e5e5e5]"
                style={{ borderRadius: "12px" }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isUpdating}
                className="bg-[#b95e82] text-white hover:bg-[#a04d6f] disabled:opacity-50"
                style={{ borderRadius: "12px" }}
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* <Card
        className="border-2 border-red-200 bg-red-50/50"
        style={{ borderRadius: "24px" }}
      >
        <CardHeader>
          <CardTitle className="text-xl text-red-600">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-[#1A1A1A] mb-1">Delete Account</h4>
              <p className="text-sm text-[#6B6B6B]">
                Once you delete your account, there is no going back. Please be
                certain.
              </p>
            </div>
            <Button
              variant="outline"
              className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
              style={{ borderRadius: "12px" }}
            >
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}
