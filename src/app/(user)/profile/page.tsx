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
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logout } from "@/store/slices/authSlice";
import useGetUser from "@/hooks/useGetUser";
import { useUpdateProfileMutation, useDeleteAccountMutation } from "@/store/api/authApi";
import { PackageType } from "../user-packages/UpgradePlan";
import PhoneInput, {
  isValidPhoneNumber,
  parsePhoneNumber,
} from "react-phone-number-input";
import toast from "react-hot-toast";

function DeleteAccountButton() {
  const [deleteAccount, { isLoading }] = useDeleteAccountMutation();
  const router = useRouter();
  const dispatch = useDispatch();

  const handleDelete = async () => {
    const html = `
      <p>Deleting your account will send a deletion request to the admin for review and approval. Once approved, your profile and all associated data will be permanently removed from our services. This action cannot be undone.</p>
      <p style="margin-top:12px">If you would like to proceed, click <strong>Delete</strong> below. You may also use the <a href=\"https://skybornedrop.com/account/delete\" target=\"_blank\">website link</a> to complete the deletion process if preferred.</p>
    `;

    const result = await Swal.fire({
      title: "Delete Account",
      html,
      icon: "warning",
      input: "textarea",
      inputLabel: "Reason for deletion (optional)",
      inputPlaceholder: "Share any feedback for the admin team...",
      inputAttributes: {
        "aria-label": "Reason for account deletion",
      },
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      buttonsStyling: false,
      customClass: {
        confirmButton:
          "swal-confirm-btn px-6 py-2 rounded-md font-semibold text-white bg-red-600 hover:bg-red-700",
        cancelButton:
          "swal-cancel-btn px-6 py-2 rounded-md font-semibold border border-black text-black bg-transparent ml-3",
      },
      allowOutsideClick: true,
    });

    if (!result.isConfirmed) return;

    try {
      const reason = String(result.value || "").trim();
      const response = await deleteAccount(reason ? { reason } : undefined).unwrap();

      const status = response?.data?.status || response?.status || response?.data?.result?.status;

      if (status === "requested") {
        toast.success("Deletion requested — pending admin review");
        return;
      } else {
        toast.success(response?.message || "Account deletion completed");
      }

      // Clear local auth and redirect to login
      dispatch(logout());
      router.push("/login");
    } catch (err: any) {
      console.error("Delete account failed", err);
      toast.error(err?.data?.message || err?.message || "Unable to delete account");
    }
  };

  return (
    <Button
      variant="outline"
      className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
      style={{ borderRadius: "12px" }}
      onClick={handleDelete}
      disabled={isLoading}
    >
      Delete Account
    </Button>
  );
}

interface UserProp {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
}

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
  });

  console.log("user data", user);

  const [updateError, setUpdateError] = useState<string>("");
  const [updateSuccess, setUpdateSuccess] = useState<string>("");

  // Initialize form data when user data loads
  useEffect(() => {
    if (user) {
      setTimeout(() => {
        setFormData({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          phone: user.phoneNumber || "",
          country: user.country || "",
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
  const getPlanDisplayName = (plan: PackageType) => {
    const planMap = {
      "gold-yoga": "Gold Yoga",
      "gold-zumba": "Gold Zumba",
      "gold-mixed": "Gold Mixed",
      diamond: "Diamond",
      platinum: "Platinum",
    };
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
    try {
      setUpdateError("");
      setUpdateSuccess("");

      // Only send changed fields
      const updatePayload: Partial<UserProp> = {};
      (Object.keys(formData) as (keyof UserProp)[]).forEach((key) => {
        const userValue = key === "phone" ? user?.phoneNumber : user?.[key];

        if (formData[key] !== userValue) {
          updatePayload[key] = formData[key];
        }
      });

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
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phoneNumber || "",
        country: user.location || "",
      });
    }
    setIsEditing(false);
    setUpdateError("");
  };

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
    <div className="p-4 lg:p-8 space-y-6">
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
          <div className="flex flex-col md:flex-row items-center gap-6 text-white">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-5xl font-bold">
                {getInitials()}
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl mb-2">
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
              className="bg-white text-[#b95e82] hover:bg-gray-50 hover:text-[#494949] disabled:opacity-50"
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
      <Card className="border-[#e5e5e5]" style={{ borderRadius: "24px" }}>
        <CardHeader>
          <CardTitle className="text-xl text-[#1A1A1A]">
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6B6B6B]" />
              <input
                type="email"
                value={formData.email || ""}
                disabled={true}
                className="w-full pl-10 pr-4 py-2 border border-[#e5e5e5] rounded-xl focus:outline-none disabled:bg-gray-50 cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <p className="text-xs text-[#6B6B6B] mt-1">
              Email cannot be changed
            </p>
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
                  className="w-full px-4 py-2 border border-[#e5e5e5] rounded-xl focus:outline-none focus:border-[#b95e82] focus:ring-2 focus:ring-[#b95e82]/20"
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

          {isEditing && (
            <div className="flex gap-3 justify-end pt-4">
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

      <Card className="border-2 border-red-200 bg-red-50/50" style={{ borderRadius: "24px" }}>
        <CardHeader>
          <CardTitle className="text-xl text-red-600">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-[#1A1A1A] mb-1">Delete Account</h4>
              <p className="text-sm text-[#6B6B6B]">
                Deleting your account will send a deletion request to the admin for review and approval. Once approved, your profile and all associated data will be permanently removed from our services. This action cannot be undone.
              </p>
              <p className="text-sm text-[#6B6B6B] mt-2">
                If you would like to proceed, click "Delete" below. You may also use the <a className="text-[#b95e82] underline" href="https://skybornedrop.com/account/delete" target="_blank" rel="noreferrer">website link</a> to complete the deletion process if preferred.
              </p>
            </div>
            <DeleteAccountButton />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
