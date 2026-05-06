"use client";
import { useAppContext } from "@/app/context-provider/context_Provider";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "@/schemas/loginSchema";
import { HiMiniXMark } from "react-icons/hi2";

interface SignupFormData {
  email: string;
  password: string;
}
export default function LoginModal() {
  const { login,setLoginModalFlag,setSigupModalFlag } = useAppContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: yupResolver(loginSchema),
  });

  const triggerLoginHandler = async (data: SignupFormData) => {
    console.log(data);
    const obj = { email: data?.email, password: data?.password };
    await login(obj);
  };

  return (
    <div
      id="loginModal"
      className="fixed inset-0 modal-backdrop flex items-center justify-center z-50"
    >
      <div className="relative bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl slide-up">
      <HiMiniXMark  className="absolute top-10 right-8 cursor-pointer size-6 text-black" onClick={()=>{
        setLoginModalFlag(false)
      }}/>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Welcome Back</h3>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <i data-lucide="x" className="w-6 h-6"></i>
          </button>
        </div>

        <form
          className="space-y-6"
          onSubmit={handleSubmit(triggerLoginHandler)}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              {...register("email")}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              {...register("password")}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <a
              href="#"
              className="text-sm text-purple-600 hover:text-purple-800 transition-colors"
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?
            <button className="text-purple-600 hover:text-purple-800 transition-colors font-medium" onClick={()=>{
              setLoginModalFlag(false)
              setSigupModalFlag(true)
            }}>
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
