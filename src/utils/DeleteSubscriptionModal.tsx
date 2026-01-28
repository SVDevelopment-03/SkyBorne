/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { useCancelSubscriptionMutation } from "@/store/api/paymentApi";
import { Button } from "@/components/ui/button";

interface DeleteSubscriptionModalProps {
  open: boolean;
  onClose: () => void;
  subscriptionId?: string;
  subscriptionName?: string;
  onSuccess?: () => void; 
}

const DeleteSubscriptionModal = ({
  open,
  onClose,
  subscriptionId,
  subscriptionName,
  onSuccess,
}: DeleteSubscriptionModalProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cancelSubscription] = useCancelSubscriptionMutation();

  const handleConfirm = useCallback(async () => {
    if (!subscriptionId) {
      console.log("❌ No subscriptionId provided. Cannot cancel subscription.");
      return;
    }

    try {
      setIsProcessing(true);

      console.log("📤 Sending cancel subscription request to backend:", {
        subscriptionId,
      });

      const response = await cancelSubscription(subscriptionId).unwrap();

      console.log("📥 Response from backend:", response);

      if (response.success) {
        toast.success(response.message || "Subscription cancelled successfully!");
        onSuccess?.();
        onClose();
      } else {
        console.warn("⚠️ Backend returned failure:", response.message);
        toast.error(response.message || "Failed to cancel subscription");
      }
    } catch (err: any) {
      console.error("❌ Cancel subscription error:", err);
      toast.error(err?.data?.message || "Failed to cancel subscription");
    } finally {
      setIsProcessing(false);
    }
  }, [subscriptionId, cancelSubscription, onClose, onSuccess]);


  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center px-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 md:p-8 relative font-satoshi-regular">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition text-2xl"
        >
          &times;
        </button>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-satoshi-semibold text-gray-900 mb-4">
          Cancel Subscription
        </h2>

        {/* Confirmation Text */}
        <p className="text-gray-700 mb-6 text-sm md:text-base">
          Are you sure you want to cancel the subscription{" "}
          {subscriptionName ? (
            <span className="font-satoshi-medium">{subscriptionName}</span>
          ) : (
            ""
          )}
          ? This action cannot be undone.
        </p>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg border border-gray-300 font-satoshi-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition text-sm"
          >
            Keep Subscription
          </button>
          <Button
          variant={"theme"}
            onClick={handleConfirm}
            disabled={isProcessing}
            className={`px-6 py-2 rounded-lg font-satoshi-medium text-white transition text-sm
              ${isProcessing ? "bg-gray-300 cursor-not-allowed" : "bg-[#b95e82]"}
            `}
          >
            {isProcessing ? "Processing..." : "Yes, Cancel"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteSubscriptionModal;
