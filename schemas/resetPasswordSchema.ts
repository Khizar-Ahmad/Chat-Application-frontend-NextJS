"use client";

import * as yup from "yup";

export const resetPasswordSchema = yup.object({
  password: yup
    .string()
    .required("New password is required")
    .min(
      6,
      "Password must be at least 6 characters"
    ),

  confirmPassword: yup
    .string()
    .required(
      "Confirm password is required"
    )
    .oneOf(
      [yup.ref("password")],
      "Passwords must match"
    ),
});