import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

// Type guard: checks if error is FetchBaseQueryError
function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === "object" && error !== null && "status" in error;
}

// Type guard: checks if error is SerializedError
function isSerializedError(error: unknown): error is SerializedError {
  return typeof error === "object" && error !== null && "message" in error;
}

export function handleApiError(error: unknown): void {
  if (isFetchBaseQueryError(error)) {
    const errData = (error.data ?? {}) as { message?: string };
    toast.error(errData.message || "Something went wrong");
    return;
  }

  if (isSerializedError(error)) {
    toast.error(error.message || "Unexpected error occurred");
    return;
  }

  // fallback for unknown errors
  toast.error("Something went wrong");
}
