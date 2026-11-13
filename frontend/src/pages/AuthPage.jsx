
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { GoogleLogin } from "@react-oauth/google";
import {
  Eye,
  EyeOff,
  Loader,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "../lib/axios";
import toast from "react-hot-toast";

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const {
    login,
    signup,
    googleLogin,
    loading: storeLoading,
  } = useAuthStore();

  const navigate = useNavigate();
  const location = useLocation();
  const inputRefs = useRef([]);

  const isLoading = loading || storeLoading;

  // URL-based authentication mode
  useEffect(() => {
    const path = location.pathname;

    if (path === "/signup") setMode("signup");
    else if (path === "/login") setMode("login");
    else if (path === "/forgot-password") setMode("forgot-password");
    else if (path === "/verify-otp") setMode("verify-otp");
    else if (path === "/reset-password") setMode("reset-password");

    if (location.state?.email) {
      setFormData((prev) => ({
        ...prev,
        email: location.state.email,
      }));
    }

    if (location.state?.otp) {
      setFormData((prev) => ({
        ...prev,
        otp: location.state.otp,
      }));
    }
  }, [location.pathname, location.state]);

  // OTP input handling
  const handleOtpChange = (e, index) => {
    const value = e.target.value;

    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = formData.otp.split("");

    while (newOtp.length < 6) {
      newOtp.push("");
    }

    newOtp[index] = value;

    const newOtpString = newOtp.join("").slice(0, 6);

    setFormData((prev) => ({
      ...prev,
      otp: newOtpString,
    }));

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (
      e.key === "Backspace" &&
      !formData.otp[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === "login") {
      await login({
        email: formData.email,
        password: formData.password,
      });
    } else if (mode === "signup") {
      await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
    } else if (mode === "forgot-password") {
      setLoading(true);

      try {
        await axios.post("/auth/forgot-password", {
          email: formData.email,
        });

        toast.success("OTP sent to your email");

        navigate("/verify-otp", {
          state: { email: formData.email },
        });
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    } else if (mode === "verify-otp") {
      if (formData.otp.length !== 6) {
        return toast.error("OTP must be 6 digits");
      }

      setLoading(true);

      try {
        await axios.post("/auth/verify-otp", {
          email: formData.email,
          otp: formData.otp,
        });

        toast.success("OTP verified successfully");

        navigate("/reset-password", {
          state: {
            email: formData.email,
            otp: formData.otp,
          },
        });
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Invalid OTP"
        );
      } finally {
        setLoading(false);
      }
    } else if (mode === "reset-password") {
      if (formData.newPassword !== formData.confirmPassword) {
        return toast.error("Passwords do not match");
      }

      if (formData.newPassword.length < 6) {
        return toast.error(
          "Password must be at least 6 characters"
        );
      }

      setLoading(true);

      try {
        await axios.post("/auth/reset-password", {
          email: formData.email,
          otp: formData.otp,
          newPassword: formData.newPassword,
        });

        toast.success(
          "Password reset successfully! Please login."
        );

        navigate("/login");
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
          "Error resetting password"
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGoogleSuccess = (credentialResponse) => {
    if (credentialResponse.credential) {
      googleLogin(credentialResponse.credential);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case "login":
        return "Welcome Back.";
      case "signup":
        return "Create Account.";
      case "forgot-password":
        return "Forgot Password?";
      case "verify-otp":
        return "Verify Your Email.";
      case "reset-password":
        return "New Password.";
      default:
        return "Welcome Back.";
    }
  };

  const getDescription = () => {
    switch (mode) {
      case "login":
        return "Sign in to access your account, manage your orders and keep your skincare journey close.";
      case "signup":
        return "Create your Belief Cosmetics account and begin a more personal skincare journey.";
      case "forgot-password":
        return "Enter your email address and we'll send you an OTP to reset your password.";
      case "verify-otp":
        return `Enter the 6-digit code sent to ${formData.email || "your email"}.`;
      case "reset-password":
        return "Create a new password for your account.";
      default:
        return "";
    }
  };

  const inputClass =
    "w-full rounded-full border border-[#e7eae3] bg-[#fffdf4] px-6 py-3.5 text-sm text-[#172b27] outline-none transition-all placeholder:text-[#879188] focus:border-[#718477] focus:ring-2 focus:ring-[#718477]/10";

  const labelClass =
    "mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#718477]";

  return (
    <main className="flex min-h-dvh flex-col bg-[#f8f6f0] font-sans lg:h-dvh lg:min-h-0 lg:flex-row lg:overflow-hidden">

      {/* LEFT EDITORIAL PANEL */}
      <section className="relative hidden min-h-0 w-[45%] overflow-hidden bg-[#263b35] lg:block">

        <img
          src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=1200&h=1600&fit=crop&q=80"
          alt="Skincare product"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-[#172b27]/25" />

        <div className="absolute inset-0 bg-gradient-to-t from-[#172b27]/95 via-[#172b27]/15 to-[#172b27]/10" />

        {/* Brand wordmark */}
        <Link
          to="/"
          className="absolute left-10 top-9 z-10 text-white"
        >
          <img
            src="/beliefCosmetics.png"
            alt="Belief Cosmetics"
            className="h-auto w-[150px] object-contain object-left"
          />
        </Link>

        {/* Editorial content */}
        <div className="absolute bottom-12 left-10 right-10 z-10 xl:bottom-16 xl:left-14 xl:right-14">

          <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/75">
            The Belief Experience
          </p>

          <h1 className="font-editorial text-[clamp(3rem,5.1vw,5.5rem)] leading-[0.98] tracking-[-0.045em] text-white">
            Skincare is
            <br />
            personal.
            <br />
            <span className="italic text-[#dce5d8]">
              So is your care.
            </span>
          </h1>

          <p className="mt-7 max-w-md text-sm leading-7 text-white/75">
            Thoughtful skincare, meaningful ingredients, and a more
            personal approach to understanding your skin.
          </p>

          <div className="mt-12 flex items-center gap-4">
            <span className="h-px w-12 bg-white/60" />
            <span className="text-[9px] font-medium uppercase tracking-[0.3em] text-white/75">
              Belief Cosmetics
            </span>
          </div>
        </div>
      </section>

      {/* RIGHT AUTH PANEL */}
      <section className="relative flex min-h-dvh flex-1 flex-col bg-[#f8f6f0] lg:h-full lg:min-h-0 lg:overflow-y-auto">

        {/* Header */}
        <header className="flex shrink-0 items-center justify-between px-6 py-6 sm:px-10 lg:px-12 xl:px-16">

          <Link
            to="/"
            className="font-sans text-[10px] font-semibold uppercase tracking-[0.25em] text-[#718477]"
          >
            Belief Cosmetics
          </Link>

          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-medium text-[#718477] transition-colors hover:text-[#172b27]"
          >
            Return to Store
            <ArrowRight size={15} />
          </Link>
        </header>

        {/* Form area */}
        <div className="flex flex-1 items-center justify-center px-6 pb-10 pt-5 sm:px-10 lg:min-h-0 lg:px-12 lg:py-4 xl:px-16">

          <div className="w-full max-w-[445px]">

            {/* Heading */}
            <div className="mb-8 lg:mb-7">

              <div className="mb-6 flex items-center gap-3">
                <span className="h-px w-8 bg-[#718477]" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#718477]">
                  Your Account
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  <h2 className="font-editorial text-[clamp(2.8rem,5vw,3.8rem)] leading-[1.05] tracking-[-0.04em] text-[#172b27]">
                    {getTitle()}
                  </h2>

                  <p className="mt-5 max-w-md text-sm leading-7 text-[#879188]">
                    {getDescription()}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Authentication form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Name */}
              {mode === "signup" && (
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: e.target.value,
                      })
                    }
                    className={inputClass}
                    required
                  />
                </div>
              )}

              {/* Email */}
              {[
                "login",
                "signup",
                "forgot-password",
              ].includes(mode) && (
                  <div>
                    <label className={labelClass}>Email Address</label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          email: e.target.value,
                        })
                      }
                      className={inputClass}
                      required
                    />
                  </div>
                )}

              {/* Login / Signup password */}
              {["login", "signup"].includes(mode) && (
                <div>
                  <label className={labelClass}>Password</label>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          password: e.target.value,
                        })
                      }
                      className={`${inputClass} pr-14`}
                      required
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-[#879188] transition-colors hover:text-[#172b27]"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* OTP */}
              {mode === "verify-otp" && (
                <div>
                  <label className={labelClass}>
                    Verification Code
                  </label>

                  <div className="flex justify-between gap-2 sm:gap-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <input
                        key={index}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        ref={(el) =>
                          (inputRefs.current[index] = el)
                        }
                        value={formData.otp[index] || ""}
                        onChange={(e) =>
                          handleOtpChange(e, index)
                        }
                        onKeyDown={(e) =>
                          handleOtpKeyDown(e, index)
                        }
                        className="h-12 min-w-0 flex-1 rounded-xl border border-[#e7eae3] bg-[#fffdf4] text-center text-xl font-semibold text-[#172b27] outline-none transition-all focus:border-[#718477] focus:ring-2 focus:ring-[#718477]/10"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Reset password */}
              {mode === "reset-password" && (
                <>
                  <div>
                    <label className={labelClass}>
                      New Password
                    </label>

                    <div className="relative">
                      <input
                        type={
                          showPassword ? "text" : "password"
                        }
                        placeholder="Enter new password"
                        value={formData.newPassword}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            newPassword: e.target.value,
                          })
                        }
                        className={`${inputClass} pr-14`}
                        required
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(!showPassword)
                        }
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-[#879188] hover:text-[#172b27]"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Confirm New Password
                    </label>

                    <input
                      type="password"
                      placeholder="Confirm your new password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className={inputClass}
                      required
                    />
                  </div>
                </>
              )}

              {/* Remember me / Forgot password */}
              {mode === "login" && (
                <div className="flex items-center justify-between gap-3 px-1 pt-1">

                  <label className="flex cursor-pointer items-center gap-2 text-xs text-[#718477]">
                    <input
                      id="remember-me"
                      type="checkbox"
                      className="h-4 w-4 accent-[#172b27]"
                    />
                    Remember me
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-xs font-medium text-[#294b40] transition-colors hover:text-[#718477]"
                  >
                    Forgot Password?
                  </Link>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="group flex min-h-[54px] w-full items-center justify-center gap-3 rounded-full bg-[#172b27] px-8 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:bg-[#294b40] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <Loader size={19} className="animate-spin" />
                ) : (
                  <>
                    {mode === "login"
                      ? "Sign In"
                      : mode === "signup"
                        ? "Create Account"
                        : mode === "forgot-password"
                          ? "Send OTP"
                          : mode === "verify-otp"
                            ? "Verify OTP"
                            : "Reset Password"}

                    <ArrowRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>

              {/* Google Login */}
              {["login", "signup"].includes(mode) && (
                <>
                  <div className="flex items-center gap-4 py-1">
                    <span className="h-px flex-1 bg-[#e3e7df]" />
                    <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#a0aaa0]">
                      Or continue with
                    </span>
                    <span className="h-px flex-1 bg-[#e3e7df]" />
                  </div>

                  <div className="flex justify-center">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={() =>
                        console.log("Login Failed")
                      }
                      useOneTap
                      shape="circle"
                    />
                  </div>
                </>
              )}
            </form>

            {/* Account navigation */}
            <div className="mt-7 border-t border-[#e7eae3] pt-6 text-center">

              {mode === "login" && (
                <p className="text-sm text-[#879188]">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="font-semibold text-[#294b40] underline underline-offset-4 transition-colors hover:text-[#718477]"
                  >
                    Create Account
                  </Link>
                </p>
              )}

              {mode === "signup" && (
                <p className="text-sm text-[#879188]">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-semibold text-[#294b40] underline underline-offset-4 transition-colors hover:text-[#718477]"
                  >
                    Sign In
                  </Link>
                </p>
              )}

              {[
                "forgot-password",
                "verify-otp",
                "reset-password",
              ].includes(mode) && (
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#294b40] transition-colors hover:text-[#718477]"
                  >
                    <ArrowLeft size={15} />
                    Back to Login
                  </Link>
                )}
            </div>

            {/* Footer */}
            <p className="mt-7 text-center text-[9px] font-medium uppercase tracking-[0.2em] text-[#a0aaa0]">
              Thoughtful skincare. A personal experience.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
