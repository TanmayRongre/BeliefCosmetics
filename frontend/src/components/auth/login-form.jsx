
import { useState } from "react"
import { Link } from "react-router-dom"
import { Eye, EyeOff, Loader, ArrowRight } from "lucide-react"
import { useAuthStore } from "../../store/useAuthStore"
import { GoogleLogin } from "@react-oauth/google"

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const { login, loggingIn, googleLogin } = useAuthStore()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    login(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">

      {/* Email */}
      <div>
        <label
          htmlFor="login-email"
          className="block font-sans text-[10px] tracking-[0.2em] uppercase text-[#718477] mb-3"
        >
          Email Address
        </label>

        <input
          id="login-email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          required
          autoComplete="email"
          className="w-full bg-transparent border-b border-[#dfe4dc] px-0 py-3 font-sans text-sm text-[#172b27] placeholder:text-[#a1aaa1] outline-none transition-colors duration-300 focus:border-[#294b40]"
        />
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor="login-password"
          className="block font-sans text-[10px] tracking-[0.2em] uppercase text-[#718477] mb-3"
        >
          Password
        </label>

        <div className="relative">
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
            autoComplete="current-password"
            className="w-full bg-transparent border-b border-[#dfe4dc] px-0 py-3 pr-11 font-sans text-sm text-[#172b27] placeholder:text-[#a1aaa1] outline-none transition-colors duration-300 focus:border-[#294b40]"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-[#879188] hover:text-[#294b40] transition-colors"
          >
            {showPassword ? (
              <EyeOff size={18} strokeWidth={1.5} />
            ) : (
              <Eye size={18} strokeWidth={1.5} />
            )}
          </button>
        </div>
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <label className="flex items-center gap-2.5 cursor-pointer group">
          <input
            type="checkbox"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
            className="w-4 h-4 accent-[#294b40] border-[#dfe4dc] cursor-pointer"
          />

          <span className="font-sans text-xs text-[#718477] group-hover:text-[#172b27] transition-colors">
            Remember me
          </span>
        </label>

        <Link
          to="/forgot-password"
          className="font-sans text-xs text-[#294b40] hover:text-[#718477] transition-colors underline underline-offset-4 decoration-[#dfe4dc]"
        >
          Forgot password?
        </Link>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loggingIn}
        className="group w-full flex items-center justify-center gap-3 bg-[#172b27] text-[#f8f6f0] py-4 px-5 font-sans text-[10px] tracking-[0.22em] uppercase hover:bg-[#294b40] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-8"
      >
        {loggingIn ? (
          <>
            <Loader size={17} className="animate-spin" />
            Signing In...
          </>
        ) : (
          <>
            Sign In
            <ArrowRight
              size={16}
              strokeWidth={1.5}
              className="group-hover:translate-x-1 transition-transform duration-300"
            />
          </>
        )}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-[#e7eae3]" />
        <span className="font-sans text-[9px] tracking-[0.2em] uppercase text-[#a1aaa1] whitespace-nowrap">
          Or continue with
        </span>
        <div className="flex-1 h-px bg-[#e7eae3]" />
      </div>

      {/* Google Login */}
      <div className="flex justify-center w-full">
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            googleLogin(credentialResponse.credential)
          }}
          onError={() => {
            console.log("Google auth failed")
          }}
          theme="outline"
          shape="rectangular"
          size="large"
          text="continue_with"
          width="100%"
        />
      </div>

      {/* Footer Note */}
      <p className="font-sans text-[10px] text-center leading-6 text-[#879188] pt-2">
        By signing in, you agree to continue your journey with Belief Cosmetics.
      </p>

    </form>
  )
}
