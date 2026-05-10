"use client";

import { useEffect } from "react";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
  show: boolean;
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

const toastStyles = {
  success: {
    icon: CheckCircle,
    border: "border-green-200",
    bg: "bg-green-50",
    iconColor: "text-green-600",
    textColor: "text-green-800",
  },

  error: {
    icon: XCircle,
    border: "border-red-200",
    bg: "bg-red-50",
    iconColor: "text-red-600",
    textColor: "text-red-800",
  },

  info: {
    icon: Info,
    border: "border-blue-200",
    bg: "bg-blue-50",
    iconColor: "text-blue-600",
    textColor: "text-blue-800",
  },

  warning: {
    icon: AlertTriangle,
    border: "border-yellow-200",
    bg: "bg-yellow-50",
    iconColor: "text-yellow-600",
    textColor: "text-yellow-800",
  },
};

const Toast = ({
  show,
  message,
  type = "success",
  duration = 10000,
  onClose,
}: ToastProps) => {
  const currentToast = toastStyles[type];
  const Icon = currentToast.icon;

  useEffect(() => {
    if (!show) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [show, duration, onClose]);

  if (!show) return null;

  return (
    <div
      className="
        fixed
        top-5
        right-5
        z-[9999]
        animate-in
        slide-in-from-top-5
        fade-in
      "
    >
      <div
        className={`
          flex
          items-start
          sm:gap-3
          min-w-[290px]
          max-w-md
          p-4
          rounded-2xl
          shadow-xl
          border
          backdrop-blur-sm
          ${currentToast.bg}
          ${currentToast.border}
        `}
      >
        {/* Icon */}
        <Icon
          className={`
            size-6
            mt-0.5
            flex-shrink-0
            ${currentToast.iconColor}
          `}
        />

        {/* Content */}
        <div className="flex-1">
          <p
            className={`
              text-sm
              font-medium
              leading-relaxed
              ${currentToast.textColor}
            `}
          >
            {message}
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="
            text-gray-400
            hover:text-gray-600
            transition-colors
          "
        >
          <X className="size-5" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
