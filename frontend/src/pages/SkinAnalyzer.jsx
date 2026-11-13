
import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Sparkles } from "lucide-react"

import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import SkinAnalyzerForm from "@/components/skin-analysis/skin-analyzer-form"
import { useAuthStore } from "@/store/useAuthStore"
import axiosInstance from "@/lib/axios"
import toast from "react-hot-toast"

export default function SkinAnalyzer() {
  const [loading, setLoading] = useState(true)

  const { authUser } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Skip saved-result check when retaking the assessment
    if (location.state?.retake) {
      setLoading(false)
      return
    }

    const checkSavedResults = async () => {
      setLoading(true)

      try {
        if (authUser) {
          const res = await axiosInstance.get("/skin-analysis/profile")

          if (
            res.data &&
            res.data.recommendations &&
            res.data.recommendations.length > 0
          ) {
            navigate("/skin-analyzer/results")
          }
        }
      } catch (error) {
        // Ignore missing saved profiles
      } finally {
        setLoading(false)
      }
    }

    checkSavedResults()
  }, [authUser, navigate, location.state])

  const handleAnalysisComplete = async (answers) => {
    try {
      await axiosInstance.post("/skin-analysis/evaluate", {
        answers,
        userId: authUser?._id,
      })

      toast.success("Analysis complete!")
      navigate("/skin-analyzer/results")
    } catch (error) {
      console.error("Analysis failed", error)
      toast.error("Failed to analyze skin profile. Please try again.")
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8f6f0] flex flex-col">
        <Header />

        <section className="flex-1 flex items-center justify-center px-6 py-24">
          <div className="flex flex-col items-center text-center">
            <div className="relative flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border border-[#dfe4dc] border-t-[#294b40] animate-spin" />

              <Sparkles
                size={22}
                strokeWidth={1.5}
                className="absolute text-[#294b40]"
              />
            </div>

            <h2 className="font-editorial text-3xl text-[#172b27] mt-7">
              Preparing Your Assessment
            </h2>

            <p className="font-sans text-sm text-[#879188] mt-2">
              Creating a space for your skin journey...
            </p>
          </div>
        </section>

        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f8f6f0] text-[#172b27]">
      <Header />

      <section className="relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-[#718477]/[0.06] blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 right-0 w-72 h-72 rounded-full bg-[#294b40]/[0.05] blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <SkinAnalyzerForm
            onAnalysisComplete={handleAnalysisComplete}
          />
        </div>
      </section>

      <Footer />
    </main>
  )
}
