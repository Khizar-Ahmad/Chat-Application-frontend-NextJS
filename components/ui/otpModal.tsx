"use client";

import { HiMiniXMark } from "react-icons/hi2";
import { useEffect, useRef, useState } from "react";
import { useAppContext } from "@/app/context-provider/context_Provider";

// interface OTPVerificationModalProps {
//   otpModalFlag: boolean;
//   setOtpModalFlag: React.Dispatch<React.SetStateAction<boolean>>;
//   email?: string;
//   onVerify: (otp: string) => void;
//   onResend?: () => void;
// }

const OTPVerificationModal = () => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);

  const [timer, setTimer] = useState<number>(60);
  const [email, setEmail] = useState<string>("");
  const { otpModalFlag, setOtpModalFlag, onVerify, onResend } = useAppContext();

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown Timer
  useEffect(() => {
    if (!otpModalFlag) return;

    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timer, otpModalFlag]);

  // Handle Input Change
  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;

    setOtp(updatedOtp);

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle Backspace
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle Paste
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const pastedData = e.clipboardData.getData("text").slice(0, 6).split("");

    const updatedOtp = [...otp];

    pastedData.forEach((char, index) => {
      if (/^\d$/.test(char)) {
        updatedOtp[index] = char;
      }
    });

    setOtp(updatedOtp);

    const focusIndex = pastedData.length >= 6 ? 5 : pastedData.length;

    inputRefs.current[focusIndex]?.focus();
  };

  // Verify OTP
  const handleVerify = () => {
    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      alert("Please enter complete OTP");
      return;
    }

    onVerify(finalOtp);
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (timer > 0) return;

    setTimer(60);
    setOtp(["", "", "", "", "", ""]);

    if (onResend) {
      await onResend();
    }
  };

  useEffect(() => {
    const val = localStorage.getItem("email");
    if (val) {
      setEmail(val);
    }
  }, []);

  if (!otpModalFlag) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center overflow-y-auto p-4 bg-black/40 backdrop-blur-sm">
      <div
        className="
          relative
          bg-white
          rounded-2xl
          p-6
          sm:p-8
          max-w-md
          w-full
          shadow-xl
          border
          border-gray-200
          max-h-[90vh]
          overflow-y-auto
          no-scrollbar
        "
      >
        {/* Close Button */}
        <HiMiniXMark
          className="
            absolute
            top-6
            right-6
            cursor-pointer
            size-6
            text-gray-500
            hover:text-black
            transition-colors
          "
          onClick={() => setOtpModalFlag(false)}
        />

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Verify OTP</h2>

          <p className="text-gray-500 mt-3 text-sm leading-relaxed">
            We have sent a 6-digit verification code to
          </p>

          <p className="text-purple-600 font-semibold mt-1 break-all">
            {email}
          </p>
        </div>

        {/* OTP Inputs */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              className="
              w-8
              h-10
                sm:w-12
                sm:h-14
                text-center
                text-xl
                font-bold
                border
                border-gray-300
                rounded-xl
                focus:outline-none
                focus:ring-2
                focus:ring-purple-500
                focus:border-transparent
                transition-all
              "
            />
          ))}
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          className="
            w-full
            bg-purple-600
            hover:bg-purple-700
            text-white
            py-3
            rounded-xl
            font-semibold
            transition-colors
          "
        >
          Verify OTP
        </button>

        {/* Resend OTP */}
        <div className="mt-6 text-center">
          {timer > 0 ? (
            <p className="text-sm text-gray-500">
              Resend OTP in{" "}
              <span className="font-semibold text-purple-600">{timer}s</span>
            </p>
          ) : (
            <button
              onClick={handleResendOtp}
              className="
                text-purple-600
                hover:text-purple-800
                font-semibold
                transition-colors
              "
            >
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationModal;
