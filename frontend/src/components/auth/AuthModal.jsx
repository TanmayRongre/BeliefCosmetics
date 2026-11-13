
import { X, ShieldCheck } from "lucide-react"
import { useEffect, useState } from "react"
import { useAuthStore } from "../../store/useAuthStore"
import LoginForm from "./login-form"
import SignupForm from "./signup-form"

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authUser } = useAuthStore()
  const [isLogin, setIsLogin] = useState(true)

  useEffect(() => {
    if (authUser) {
      closeAuthModal()
    }
  }, [authUser, closeAuthModal])

  if (!isAuthModalOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-[#101b17]/65 backdrop-blur-sm">

      {/* Modal */}
      <div className="relative w-full max-w-[480px] max-h-[92vh] overflow-y-auto bg-[#f8f6f0] border border-[#e7eae3] shadow-2xl">

        {/* Top Accent */}
        <div className="h-1 w-full bg-[#294b40]" />

        {/* Close Button */}
        <button
          type="button"
          onClick={closeAuthModal}
          aria-label="Close authentication modal"
          className="absolute right-4 top-5 sm:right-6 sm:top-6 z-10 w-9 h-9 flex items-center justify-center border border-[#dfe4dc] text-[#718477] hover:bg-[#172b27] hover:text-[#f8f6f0] hover:border-[#172b27] transition-all duration-300"
        >
          <X size={17} strokeWidth={1.5} />
        </button>

        <div className="px-6 py-9 sm:px-10 sm:py-11">

          {/* Brand Identity */}
          <div className="text-center mb-9">

            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="w-8 h-px bg-[#718477]" />
              <span className="font-sans text-[9px] tracking-[0.35em] uppercase text-[#718477]">
                Belief Cosmetics
              </span>
              <span className="w-8 h-px bg-[#718477]" />
            </div>

            <h2 className="font-editorial text-4xl sm:text-5xl font-normal leading-tight text-[#172b27]">
              {isLogin ? (
                <>
                  Welcome <span className="italic text-[#718477]">Back.</span>
                </>
              ) : (
                <>
                  Begin Your <span className="italic text-[#718477]">Journey.</span>
                </>
              )}
            </h2>

            <p className="font-sans text-xs sm:text-sm text-[#879188] mt-4 leading-6 max-w-xs mx-auto">
              {isLogin
                ? "Sign in to access your account and discover your saved essentials."
                : "Create an account and make your skincare experience personal."}
            </p>
          </div>

          {/* Login / Signup Form */}
          {isLogin ? <LoginForm /> : <SignupForm />}

          {/* Switch Authentication */}
          <div className="mt-8 pt-6 border-t border-[#e7eae3] text-center">
            <p className="font-sans text-xs text-[#879188]">
              {isLogin
                ? "Don't have an account?"
                : "Already have an account?"}

              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 font-medium text-[#294b40] underline underline-offset-4 decoration-[#cbd5ca] hover:text-[#718477] transition-colors"
              >
                {isLogin ? "Create Account" : "Sign In"}
              </button>
            </p>
          </div>

          {/* Security Note */}
          <div className="flex items-center justify-center gap-2 mt-7">
            <ShieldCheck
              size={14}
              strokeWidth={1.5}
              className="text-[#718477]"
            />
            <span className="font-sans text-[9px] tracking-[0.15em] uppercase text-[#a1aaa1]">
              Your account, your privacy
            </span>
          </div>

        </div>

        {/* Bottom Accent */}
        <div className="h-px w-full bg-[#e7eae3]" />
      </div>
    </div>
  )
}
