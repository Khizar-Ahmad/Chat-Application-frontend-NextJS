"use client";

import { useState } from "react";
import { HiMiniXMark } from "react-icons/hi2";
import { Mail } from "lucide-react";
import { forgetPassword } from "@/schemas/forgetPasswordSchema";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppContext } from "@/app/context-provider/context_Provider";

interface ForgotPasswordModalProps {
  forgotPasswordModalFlag: boolean;
  setForgotPasswordModalFlag: React.Dispatch<React.SetStateAction<boolean>>;
}

const ForgotPasswordModal = ({
  forgotPasswordModalFlag,
  setForgotPasswordModalFlag,
}: ForgotPasswordModalProps) => {
  const [email, setEmail] = useState<string>("");
  const { forgotPassword } = useAppContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(forgetPassword),
  });

  const [loading, setLoading] = useState<boolean>(false);

  // Forgot Password Handler
  const handleForgotPassword = async (data: any) => {
    try {
      setLoading(true);

      // API CALL HERE
      console.log({
        email,
      });

      await forgotPassword({ email: data?.email });
      // Example:
      // await axios.post(
      //   "/api/forgot-password",
      //   { email }
      // );

      // Success Example
      // setShowToast(true)
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (!forgotPasswordModalFlag) return null;

  return (
    <div
      className="
        fixed
        inset-0
        z-[60]
        flex
        items-center
        justify-center
        bg-black/40
        backdrop-blur-sm
        p-4
         no-scrollbar
        overflow-auto
        slide-up
      "
    >
      <div
        className="
          relative
          w-full
          max-w-md
          bg-white
          rounded-3xl
          shadow-2xl
          border
          border-gray-200
          p-6
          sm:p-8
          animate-in
          fade-in
          zoom-in-95
          
        "
      >
        {/* Close Button */}
        <button
          onClick={() => setForgotPasswordModalFlag(false)}
          className="
            absolute
            top-5
            right-5
            text-gray-400
            hover:text-black
            transition-colors
          "
        >
          <HiMiniXMark className="size-6" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div
            className="
              bg-purple-100
              p-4
              rounded-full
            "
          >
            <Mail
              className="
                size-10
                text-purple-600
              "
            />
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h2
            className="
              text-3xl
              font-bold
              text-gray-800
            "
          >
            Forgot Password?
          </h2>

          <p
            className="
              text-gray-500
              text-sm
              mt-3
              leading-relaxed
            "
          >
            Enter your email address and we will send you a password reset link.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(handleForgotPassword)}
          className="space-y-6"
        >
          {/* Email Input */}
          <div>
            <label
              className="
                block
                text-sm
                font-medium
                text-gray-700
                mb-2
              "
            >
              Email Address
            </label>

            <input
              type="email"
              //   value={email}
              //   onChange={(e) =>
              //     setEmail(e.target.value)
              //   }
              {...register("email")}
              placeholder="Enter your email"
              className="
                w-full
                px-4
                py-3
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
          </div>
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              bg-purple-600
              hover:bg-purple-700
              disabled:opacity-70
              disabled:cursor-not-allowed
              text-white
              py-3
              rounded-xl
              font-semibold
              transition-all
              duration-200
              shadow-lg
              hover:shadow-xl
            "
          >
            {loading ? "Sending Reset Link..." : "Send Reset Link"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p
            className="
              text-sm
              text-gray-500
              leading-relaxed
            "
          >
            We’ll send a secure password reset link to your registered email.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
