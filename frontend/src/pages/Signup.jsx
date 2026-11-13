
import { Link } from "react-router-dom"
import { ArrowRight, Leaf } from "lucide-react"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import SignupForm from "@/components/auth/signup-form"

export default function Signup() {
  return (
    <main className="min-h-screen bg-[#f8f6f0] font-sans">
      <Header />

      {/* Signup Section */}
      <section className="relative overflow-hidden px-5 py-16 sm:py-20 lg:py-24">

        {/* Subtle background decoration */}
        <div className="pointer-events-none absolute -right-32 -top-20 h-96 w-96 rounded-full bg-[#718477]/[0.07] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-[#294b40]/[0.05] blur-3xl" />

        <div className="relative mx-auto max-w-[520px]">

          {/* Intro */}
          <div className="mb-10 text-center">

            <div className="mb-6 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-[#718477]" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#718477]">
                Your Journey Begins
              </span>
              <span className="h-px w-8 bg-[#718477]" />
            </div>

            <h1 className="font-editorial text-5xl leading-[1.05] tracking-[-0.04em] text-[#172b27] sm:text-6xl">
              Join Our
              <br />
              <span className="italic text-[#718477]">
                Community.
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-sm text-sm leading-7 text-[#879188]">
              Create your Belief Cosmetics account and discover
              skincare that understands you.
            </p>
          </div>

          {/* Signup Card */}
          <div className="rounded-[4px] border border-[#e7eae3] bg-white/80 px-6 py-8 shadow-[0_15px_60px_rgba(23,43,39,0.04)] sm:px-10 sm:py-10">

            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#edf1eb]">
                <Leaf size={18} className="text-[#294b40]" />
              </div>

              <div>
                <h2 className="font-editorial text-2xl text-[#172b27]">
                  Create Your Account
                </h2>
                <p className="mt-0.5 text-xs text-[#879188]">
                  A more personal skincare experience.
                </p>
              </div>
            </div>

            <SignupForm />

            {/* Login Link */}
            <div className="mt-8 border-t border-[#e7eae3] pt-7 text-center">
              <p className="mb-3 text-sm text-[#879188]">
                Already have an account?
              </p>

              <Link
                to="/login"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-[#294b40] transition-colors hover:text-[#718477]"
              >
                Sign in to your account
                <ArrowRight
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>

            {/* Terms */}
            <div className="mt-7 border-t border-[#e7eae3] pt-6">
              <p className="text-center text-[11px] leading-6 text-[#9aa49a]">
                By creating an account, you agree to our{" "}
                <Link
                  to="/terms"
                  className="font-medium text-[#294b40] underline underline-offset-4 hover:text-[#718477]"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="font-medium text-[#294b40] underline underline-offset-4 hover:text-[#718477]"
                >
                  Privacy Policy
                </Link>.
              </p>
            </div>
          </div>

          {/* Brand Footer */}
          <div className="mt-10 text-center">
            <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-[#a0aaa0]">
              Thoughtful Skincare. A Personal Experience.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
