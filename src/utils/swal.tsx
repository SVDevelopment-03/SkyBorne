"use client";

import { useEffect, useRef } from "react";
import Swal from "sweetalert2";

interface SuccessAlertProps {
  message: string;
  onClose?: () => void;
  duration?: number;
}

const SuccessAlert = ({
  message,
  onClose,
  duration = 1500,
}: SuccessAlertProps) => {
  const hasShown = useRef(false);

  useEffect(() => {
    if (hasShown.current) return;
    hasShown.current = true;

    Swal.fire({
      icon: "success",
      title: "Success",
      html: `<p style="
        font-size:16px;
        color:#494949;
        margin-top:8px;
      ">${message}</p>`,

      // Custom Look
      background: "#ffffff",
      customClass: {
        popup: "custom-swal-popup",
        title: "custom-swal-title",
      },

      // Auto-close
      timer: duration,
      showConfirmButton: false,
      timerProgressBar: true,

      willClose: () => {
        if (onClose) setTimeout(() => onClose(), 0);
      },
    });
  }, [message, duration, onClose]);

  return null;
};

export default SuccessAlert;
