
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import RecommendedProducts from "@/components/product/recommended-products"
import { useAuthStore } from "@/store/useAuthStore"
import axiosInstance from "@/lib/axios"
import { Loader } from "lucide-react"

const SkinAnalysisResults = () => {
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)

  const { authUser } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchResults = async () => {
      try {
        if (authUser) {
          // Fetch saved skin analysis from backend
          const res = await axiosInstance.get("/skin-analysis/profile")

          if (
            res.data &&
            res.data.recommendations &&
            res.data.recommendations.length > 0
          ) {
            setAnalysis(res.data)
          } else {
            navigate("/skin-analyzer")
          }
        } else {
          navigate("/skin-analyzer")
        }
      } catch (error) {
        console.error("Error fetching results:", error)
        navigate("/skin-analyzer")
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [authUser, navigate])

  const handleRetake = () => {
    navigate("/skin-analyzer", {
      state: { retake: true },
    })
  }

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f6f0] px-6">

        <div className="relative flex items-center justify-center">
          <div className="absolute h-20 w-20 rounded-full border border-[#dfe4dc]" />

          <div className="h-14 w-14 rounded-full border-[2px] border-[#dfe4dc] border-t-[#294b40] animate-spin" />

          <div className="absolute">
            <Loader
              size={17}
              strokeWidth={1.4}
              className="text-[#294b40]"
            />
          </div>
        </div>

        <div className="mt-8 text-center">
          <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-[#718477]">
            Belief Cosmetics
          </span>

          <h2 className="mt-3 font-editorial text-3xl text-[#172b27]">
            Preparing Your <span className="italic text-[#718477]">Results.</span>
          </h2>

          <p className="mt-3 font-sans text-xs text-[#879188]">
            Please wait while we retrieve your skin analysis.
          </p>
        </div>
      </div>
    )
  }

  if (!analysis) return null

  return (
    <main className="min-h-screen bg-[#f8f6f0]">
      <Header />

      <RecommendedProducts
        analysis={analysis}
        onReset={handleRetake}
      />

      <Footer />
    </main>
  )
}

export default SkinAnalysisResults
