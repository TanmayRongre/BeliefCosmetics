
import { useState } from "react"
import { Eye, EyeOff, Loader, ArrowRight } from "lucide-react"
import { useAuthStore } from "../../store/useAuthStore"

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false)
  const { signup, signingUp } = useAuthStore()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
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

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match")
      return
    }

    if (!formData.agreeToTerms) {
      alert("Please agree to terms")
      return
    }

    signup(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">

      {/* Full Name */}
      <div>
        <label
          htmlFor="signup-name"
          className="block font-sans text-[10px] tracking-[0.2em] uppercase text-[#718477] mb-3"
        >
          Full Name
        </label>

        <input
          id="signup-name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your full name"
          required
          autoComplete="name"
          className="w-full bg-transparent border-b border-[#dfe4dc] px-0 py-3 font-sans text-sm text-[#172b27] placeholder:text-[#a1aaa1] outline-none transition-colors duration-300 focus:border-[#294b40]"
        />
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="signup-email"
          className="block font-sans text-[10px] tracking-[0.2em] uppercase text-[#718477] mb-3"
        >
          Email Address
        </label>

        <input
          id="signup-email"
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
          htmlFor="signup-password"
          className="block font-sans text-[10px] tracking-[0.2em] uppercase text-[#718477] mb-3"
        >
          Password
        </label>

        <div className="relative">
          <input
            id="signup-password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
            required
            autoComplete="new-password"
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

      {/* Confirm Password */}
      <div>
        <label
          htmlFor="signup-confirm-password"
          className="block font-sans text-[10px] tracking-[0.2em] uppercase text-[#718477] mb-3"
        >
          Confirm Password
        </label>

        <input
          id="signup-confirm-password"
          type={showPassword ? "text" : "password"}
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Re-enter your password"
          required
          autoComplete="new-password"
          className="w-full bg-transparent border-b border-[#dfe4dc] px-0 py-3 font-sans text-sm text-[#172b27] placeholder:text-[#a1aaa1] outline-none transition-colors duration-300 focus:border-[#294b40]"
        />
      </div>

      {/* Terms and Conditions */}
      <label className="flex items-start gap-3 cursor-pointer group pt-1">
        <input
          type="checkbox"
          name="agreeToTerms"
          checked={formData.agreeToTerms}
          onChange={handleChange}
          className="w-4 h-4 mt-0.5 shrink-0 accent-[#294b40] border-[#dfe4dc] cursor-pointer"
        />

        <span className="font-sans text-xs leading-6 text-[#879188] group-hover:text-[#172b27] transition-colors">
          I agree to Belief Cosmetics'{" "}
          <span className="text-[#294b40] underline underline-offset-4 decoration-[#dfe4dc]">
            Terms of Service
          </span>{" "}
          and{" "}
          <span className="text-[#294b40] underline underline-offset-4 decoration-[#dfe4dc]">
            Privacy Policy
          </span>
        </span>
      </label>

      {/* Submit */}
      <button
        type="submit"
        disabled={signingUp}
        className="group w-full flex items-center justify-center gap-3 bg-[#172b27] text-[#f8f6f0] py-4 px-5 font-sans text-[10px] tracking-[0.22em] uppercase hover:bg-[#294b40] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-8"
      >
        {signingUp ? (
          <>
            <Loader size={17} className="animate-spin" />
            Creating Account...
          </>
        ) : (
          <>
            Create Account
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

      {/* Social Buttons - Original visual-only behavior preserved */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className="flex items-center justify-center py-3.5 border border-[#dfe4dc] font-sans text-[10px] tracking-[0.15em] uppercase text-[#294b40] hover:bg-[#edf1eb] transition-colors duration-300"
        >
          Google
        </button>

        <button
          type="button"
          className="flex items-center justify-center py-3.5 border border-[#dfe4dc] font-sans text-[10px] tracking-[0.15em] uppercase text-[#294b40] hover:bg-[#edf1eb] transition-colors duration-300"
        >
          Apple
        </button>
      </div>

      {/* Footer Note */}
      <p className="font-sans text-[10px] text-center leading-6 text-[#879188] pt-2">
        Begin your skincare journey with Belief Cosmetics.
      </p>

    </form>
  )
}
