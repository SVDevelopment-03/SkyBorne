/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { useCancelSubscriptionMutation, useUpdateCancelSubscriptionStatusMutation } from "@/store/api/paymentApi";
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
  const [description, setDescription] = useState("");
  const [cancelSubscription] = useCancelSubscriptionMutation();
  const [updateCancelSubscriptionStatus] = useUpdateCancelSubscriptionStatusMutation();
  const handleClose = useCallback(() => {
    setDescription("");
    onClose();
  }, [onClose]);

  const handleConfirm = useCallback(async () => {
    if (!subscriptionId) {
      console.log("❌ No subscriptionId provided. Cannot cancel subscription.");
      return;
    }

    if (!description.trim()) {
      toast.error("Please enter a cancellation description.");
      return;
    }

    try {
      setIsProcessing(true);

      const response = await cancelSubscription({
        userId: subscriptionId,
        adminDescription: description.trim(),
      }).unwrap();

      if (response.success) {
        toast.success(response.message || "Subscription cancelled successfully!");
        setDescription("");
        onSuccess?.();
        handleClose();
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
  }, [subscriptionId, description, cancelSubscription, handleClose, onSuccess]);

  const handleRetain = useCallback(async () => {
    if (!subscriptionId) {
      console.log("❌ No subscriptionId provided. Cannot retain subscription.");
      return;
    }

    if (!description.trim()) {
      toast.error("Please enter a cancellation description.");
      return;
    }

    try {
      setIsProcessing(true);
      const response = await updateCancelSubscriptionStatus({
        userId: subscriptionId,
        status: "retained",
        adminDescription: description.trim(),
      }).unwrap();

      if (response.success) {
        toast.success(response.message || "Subscription retained successfully!");
        onSuccess?.();
        handleClose();
        return;
      }

      toast.error(response.message || "Failed to retain subscription");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to retain subscription");
    } finally {
      setIsProcessing(false);
    }
  }, [subscriptionId, description, updateCancelSubscriptionStatus, onSuccess, handleClose]);


  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center px-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 md:p-8 relative font-satoshi-regular">
        {/* Close Button */}
        <button
          onClick={handleClose}
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

        <label className="block text-gray-700 font-satoshi-medium mb-2 text-sm">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter cancellation description"
          rows={4}
          maxLength={500}
          className="w-full px-4 py-3 border rounded-xl text-black focus:outline-none focus:ring-2 resize-none text-sm mb-1 border-gray-300 focus:border-[#b95e82] focus:ring-[#b95e82]/20"
        />
        <div className="flex justify-end text-xs text-gray-400 mb-6">
          <span>{description.length}/500</span>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={handleRetain}
            disabled={isProcessing || !description.trim()}
            className={`px-6 py-2 rounded-lg border border-gray-300 font-satoshi-medium transition text-sm ${
              isProcessing || !description.trim()
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "text-gray-700 bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Retain Subscription
          </button>
          <Button
          variant={"theme"}
            onClick={handleConfirm}
            disabled={isProcessing || !description.trim()}
            className={`px-6 py-2 rounded-lg font-satoshi-medium text-white transition text-sm
              ${isProcessing || !description.trim() ? "bg-gray-300 cursor-not-allowed" : "bg-[#b95e82]"}
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
