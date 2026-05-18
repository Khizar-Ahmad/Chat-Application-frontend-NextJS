"use client";

import SignupModal from "@/components/ui/signupModal";
import LoginModal from "@/components/ui/loginModal";

import { useEffect, useState } from "react";
import { useAppContext } from "../context-provider/context_Provider";
import SideBar from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import OTPVerificationModal from "@/components/ui/otpModal";
import Toast from "@/components/ui/toast";
import ForgotPasswordModal from "@/components/ui/forget-password-modal";
interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
}

export function Hero() {
  const {
    sigupModalFlag,
    loginModalFlag,
    setLoginModalFlag,
    setSigupModalFlag,
    otpModalFlag,
    setOtpModalFlag,
    showToast,
    toastMessage,
    toastType,
    setShowToast,
    forgotPasswordModalFlag,
    setForgotPasswordModalFlag,
    wsRef,
  } = useAppContext();

  useEffect(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  return (
    <>
      {/* <section className="flex flex-col items-center justify-center text-center py-24 px-6 bg-gradient-to-b h-[90vh] from-white to-gray-50">
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
        Welcome to <span className="text-primary">MyApp</span>
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
        Build modern apps faster with Next.js, Tailwind, and shadcn/ui.  
        A beautiful starter template to get your project running.
      </p>
      <div className="mt-8 flex gap-4">
        <Button size="lg">Get Started</Button>
        <Button size="lg" variant="outline">Learn More</Button>
      </div>
    </section> */}

      <main className="container mx-auto px-6 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-16">
            <h2 className="text-2xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Connect.
              <br />
              <span className="text-purple-600">Let's Connect...</span>
              <br />
              <span className="max-sm:hidden">Collaborate.</span>
            </h2>
            <p className="text-lg sm:text-xl text-purple-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Experience seamless conversations with our modern chat platform.
              Built for teams, designed for everyone.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {/* <button onclick="openModal('signupModal')" className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all transform hover:scale-105 shadow-2xl"> */}
              <button
                className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all transform hover:scale-105 shadow-2xl"
                onClick={() => {
                  setSigupModalFlag(true);
                }}
              >
                Get Started Free
              </button>
              <button className="text-white border-2 border-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-purple-600 transition-all">
                Watch Demo
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="glass-effect rounded-2xl p-8 slide-up">
              <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 floating-animation">
                <i data-lucide="zap" className="w-8 h-8 text-white"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Lightning Fast
              </h3>
              <p className="text-gray-600">
                Real-time messaging with instant delivery and synchronization
                across all devices.
              </p>
            </div>

            {/* <div className="glass-effect rounded-2xl p-8 slide-up" style="animation-delay: 0.1s;"> */}
            <div className="glass-effect rounded-2xl p-8 slide-up">
              {/* <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 floating-animation" style="animation-delay: 2s;"> */}
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 floating-animation">
                <i data-lucide="shield" className="w-8 h-8 text-white"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Secure & Private
              </h3>
              <p className="text-gray-600">
                End-to-end encryption ensures your conversations stay private
                and secure.
              </p>
            </div>

            {/* <div className="glass-effect rounded-2xl p-8 slide-up" style="animation-delay: 0.2s;"> */}
            <div className="glass-effect rounded-2xl p-8 slide-up">
              {/* <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 floating-animation" style="animation-delay: 4s;"> */}
              <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 floating-animation">
                <i data-lucide="users" className="w-8 h-8 text-white"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Team Collaboration
              </h3>
              <p className="text-gray-600">
                Create channels, share files, and collaborate seamlessly with
                your team.
              </p>
            </div>
          </div>

          <div className="glass-effect rounded-3xl p-6 sm:p-12">
            <h3 className="  text-xl  sm:text-3xl font-bold text-gray-800 mb-4">
              Ready to transform your communication?
            </h3>
            <p className="text-gray-600 text-lg mb-8">
              Join thousands of teams already using ChatFlow to stay connected.
            </p>
            {/* <button onclick="openModal('signupModal')" className="bg-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-purple-700 transition-all transform hover:scale-105 shadow-xl"> */}
            <button
              className="bg-purple-600 text-white px-3 sm:px-8 py-4 rounded-xl font-semibold text-base  sm:text-lg hover:bg-purple-700 transition-all transform hover:scale-105 shadow-xl"
              onClick={() => {
                setSigupModalFlag(true);
              }}
            >
              Start Chatting Now
            </button>
          </div>
        </div>
      </main>

      {sigupModalFlag && <SignupModal />}
      {loginModalFlag && <LoginModal />}
      {otpModalFlag && <OTPVerificationModal />}
      <Toast
        show={showToast}
        message={toastMessage}
        type={toastType}
        onClose={() => setShowToast(false)}
      />
      <ForgotPasswordModal
        forgotPasswordModalFlag={forgotPasswordModalFlag}
        setForgotPasswordModalFlag={setForgotPasswordModalFlag}
      />
    </>
  );
}
