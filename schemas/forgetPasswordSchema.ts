"use client";
import * as yup from "yup";

export const forgetPassword = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Must be a valid email"),

});