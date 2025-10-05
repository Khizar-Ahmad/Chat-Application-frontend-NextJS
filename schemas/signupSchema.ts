import * as yup from "yup";

export const signupSchema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters"),

  email: yup
    .string()
    .required("Email is required")
    .email("Must be a valid email"),

  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),

  confirm_password: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("password")], "Passwords must match"),
});