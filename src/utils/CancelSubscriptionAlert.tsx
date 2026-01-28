/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useSendCancellationReasonMutation } from "@/store/api/paymentApi";
import useGetUser from "@/hooks/useGetUser";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";

interface CancelSubscriptionModalProps {
  open: boolean;
  onClose: () => void;
}

const CancelSubscriptionModal = ({ open, onClose }: CancelSubscriptionModalProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [reason, setReason] = useState("");
  const userId = useSelector((state: any) => state.auth.user?._id);
  const { user } = useGetUser();
  const [sendCancellationReason] = useSendCancellationReasonMutation();

  const planName = user?.plan || "Your Plan";
  const endDate = user?.subscription?.endDate
    ? new Date(user.subscription.endDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A";

  const handleConfirm = useCallback(async () => {
    if (!userId) {
      console.warn("❌ No userId found. User not logged in?");
      toast.error("User not authenticated. Please login again.");
      return;
    }

    if (reason.trim().length < 10) {
      toast.error("Please enter at least 10 characters.");
      return;
    }

    try {
      setIsProcessing(true);
      await sendCancellationReason({ userId, description: reason }).unwrap();
      toast.success("Cancel request sent successfully");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to send cancellation request.");
    } finally {
      setIsProcessing(false);
    }
  }, [userId, reason, sendCancellationReason, onClose]);

  const isReasonValid = reason.trim().length >= 10 && reason.trim().length <= 500;

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center px-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 md:p-8 relative font-satoshi-regular">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition text-2xl"
        >
          &times;
        </button>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-satoshi-semibold text-gray-900 mb-3">
          Request to Cancel Subscription
        </h2>

        {/* Description */}
        <p className="text-gray-700 mb-4 text-sm md:text-base">
          You will lose access to premium features after{" "}
          <span className="font-satoshi-medium">{endDate}</span>.
        </p>

        {/* Reason Box */}
        <label className="block text-gray-700 font-satoshi-medium mb-2 text-sm">
          Reason for Cancelling <span className="text-red-500">*</span>
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Please tell us why you are cancelling your subscription..."
          rows={5}
          maxLength={500}
          className={`w-full px-4 py-3 border rounded-xl text-black focus:outline-none focus:ring-2 resize-none text-sm mb-1
            ${
              reason.length < 10 && reason.length > 0
                ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                : "border-gray-300 focus:border-[#b95e82] focus:ring-[#b95e82]/20"
            }
          `}
        />
        <div className="flex justify-between text-xs text-gray-400 mb-6">
          <span>{reason.length < 10 ? "Minimum 10 characters required" : ""}</span>
          <span>{reason.length}/500</span>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg border border-gray-300 font-satoshi-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition text-sm"
          >
            Keep Subscription
          </button>
          <Button
            onClick={handleConfirm}
            variant={"theme"}
            disabled={!isReasonValid || isProcessing}
            className={`px-6 py-2 rounded-lg font-satoshi-medium text-white transition text-sm
              ${
                isReasonValid
                  ? ""
                  : "bg-gray-300 cursor-not-allowed"
              }
            `}
          >
            {isProcessing ? "Processing..." : "Yes, Request Cancellation"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CancelSubscriptionModal;
