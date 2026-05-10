"use client";

import { useState } from "react";
import { LockKeyhole, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { resetPasswordSchema } from "@/schemas/resetPasswordSchema";
import axios from "axios";
import { useAppContext } from "../../context-provider/context_Provider";
import Toast from "@/components/ui/toast";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

const ResetPasswordPage = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");
  const { setShowToast, toastType, showToast, toastMessage, resetPassword } =
    useAppContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
  });

  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const [password, setPassword] = useState<string>("");

  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  // Reset Password Handler
  const handleResetPassword = async (data: any) => {
    // e.preventDefault();

    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    const payload = { new_password: data.password, token };

    try {
      setLoading(true);

      // API Call Here
      console.log({
        password: data.password,
        confirm_password: data.confirmPassword,
      });

      await resetPassword(payload);

      router.push("/");

      // Example:
      // await axios.post("/api/reset-password", {
      //   password,
      //   token,
      // });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        px-4
        py-10
        bg-gradient-to-br
        from-purple-100
        via-white
        to-indigo-100
      "
    >
      <div
        className="
          w-full
          max-w-md
          bg-white/90
          backdrop-blur-md
          border
          border-gray-200
          rounded-3xl
          shadow-2xl
          p-6
          sm:p-8
        "
      >
        {/* Logo/Icon */}
        <div className="flex justify-center mb-6">
          <div
            className="
              bg-purple-100
              p-4
              rounded-full
            "
          >
            <LockKeyhole
              className="
                size-10
                text-purple-600
              "
            />
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1
            className="
              text-3xl
              font-bold
              text-gray-800
            "
          >
            Reset Password
          </h1>

          <p
            className="
              text-sm
              text-gray-500
              mt-3
              leading-relaxed
            "
          >
            Create a strong new password for your account.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(handleResetPassword)}
          className="space-y-6"
        >
          {/* New Password */}
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
              New Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                // value={password}
                // onChange={(e) =>
                //   setPassword(e.target.value)
                // }
                {...register("password")}
                placeholder="Enter new password"
                className="
                  w-full
                  px-4
                  py-3
                  pr-12
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
              {errors?.password && (
                <p className="text-red-500">{errors?.password?.message}</p>
              )}

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                  hover:text-gray-600
                  transition-colors
                "
              >
                {showPassword ? (
                  <EyeOff className="size-5" />
                ) : (
                  <Eye className="size-5" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
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
              Confirm Password
            </label>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                // value={confirmPassword}
                // onChange={(e) =>
                //   setConfirmPassword(
                //     e.target.value
                //   )
                // }
                {...register("confirmPassword")}
                placeholder="Confirm new password"
                className="
                  w-full
                  px-4
                  py-3
                  pr-12
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

              {errors?.confirmPassword && (
                <p className="text-red-500">
                  {errors?.confirmPassword?.message}
                </p>
              )}
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                  hover:text-gray-600
                  transition-colors
                "
              >
                {showConfirmPassword ? (
                  <EyeOff className="size-5" />
                ) : (
                  <Eye className="size-5" />
                )}
              </button>
            </div>
          </div>

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
            {loading ? "Resetting Password..." : "Reset Password"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p
            className="
              text-sm
              text-gray-500
            "
          >
            Make sure your password is at least 6 characters long.
          </p>
        </div>
      </div>
      <Toast
        show={showToast}
        message={toastMessage}
        type={toastType}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};

export default ResetPasswordPage;
