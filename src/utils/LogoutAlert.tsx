"use client";

import { useEffect } from "react";
import Swal from "sweetalert2";

interface LogoutAlertProps {
  onConfirm: () => void;
  onClose: () => void;
  title?: string;
  text?: string;
}

const LogoutAlert = ({
  onConfirm,
  onClose,
  title = "Are you sure?",
  text = "You will be logged out!",
}: LogoutAlertProps) => {
  useEffect(() => {
    Swal.fire({
      title,
      text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Logout",
      cancelButtonText: "Cancel",
      buttonsStyling: false,
      customClass: {
        confirmButton:
          "swal-confirm-btn px-6 py-2 rounded-md font-semibold text-white",
        cancelButton:
          "swal-cancel-btn px-6 py-2 rounded-md font-semibold border border-black text-black bg-transparent ml-3",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm();
      }
      // ALWAYS call onClose so parent can reset showAlert
      onClose();
    });
  }, [onConfirm, onClose, title, text]);

  return null;
};

export default LogoutAlert;
