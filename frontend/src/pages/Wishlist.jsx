
import { useEffect } from "react"
import { useWishlistStore } from "@/store/useWishlistStore"
import ProductGrid from "@/components/product/product-grid"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { Heart, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

export default function Wishlist() {
  const { wishlist, getWishlist, loading } = useWishlistStore()

  useEffect(() => {
    getWishlist()
  }, [getWishlist])

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f6f0] text-[#172b27]">
      <Header />

      <main className="flex-grow w-full">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-12 lg:py-16">

          {/* Page Heading */}
          <section className="mb-10 lg:mb-14">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-[#718477]" />
              <span className="font-sans text-[10px] sm:text-xs tracking-[0.28em] uppercase text-[#718477]">
                Your personal collection
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
              <div>
                <h1 className="font-editorial text-5xl sm:text-6xl lg:text-7xl font-normal leading-[0.95] tracking-tight text-[#172b27]">
                  My Wishlist<span className="text-[#718477]">.</span>
                </h1>
                <p className="font-sans text-sm text-[#879188] mt-4 max-w-md leading-7">
                  A collection of the products you love, saved for your next skincare ritual.
                </p>
              </div>

              {!loading && wishlist.length > 0 && (
                <div className="flex items-center gap-3 text-[#718477] font-sans text-xs tracking-[0.15em] uppercase">
                  <Heart size={15} strokeWidth={1.5} />
                  <span>
                    {wishlist.length} {wishlist.length === 1 ? "Saved Item" : "Saved Items"}
                  </span>
                </div>
              )}
            </div>
          </section>

          <div className="h-px bg-[#e7eae3] mb-10" />

          {/* Loading State */}
          {loading ? (
            <div className="min-h-[360px] flex flex-col items-center justify-center gap-5">
              <div className="w-10 h-10 rounded-full border border-[#dfe4dc] border-t-[#294b40] animate-spin" />
              <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-[#879188]">
                Loading your collection
              </p>
            </div>
          ) : wishlist.length > 0 ? (
            <section>
              <ProductGrid
                viewType="grid"
                products={wishlist}
                filters={{
                  category: [],
                  priceRange: [0, 10000],
                  skinType: [],
                  concern: []
                }}
              />
            </section>
          ) : (
            /* Empty Wishlist */
            <section className="min-h-[420px] flex items-center justify-center py-16">
              <div className="w-full max-w-xl mx-auto text-center">

                <div className="w-20 h-20 mx-auto mb-8 rounded-full border border-[#dfe4dc] flex items-center justify-center">
                  <Heart
                    size={32}
                    strokeWidth={1}
                    className="text-[#718477]"
                  />
                </div>

                <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#879188]">
                  Nothing saved yet
                </span>

                <h2 className="font-editorial text-4xl sm:text-5xl font-normal text-[#172b27] mt-4 mb-5">
                  Your collection awaits.
                </h2>

                <p className="font-sans text-sm leading-7 text-[#879188] max-w-sm mx-auto mb-9">
                  Discover skincare essentials and save the products that feel right for your routine.
                </p>

                <Link
                  to="/products"
                  className="group inline-flex items-center justify-center gap-4 bg-[#172b27] text-[#f8f6f0] px-8 py-4 font-sans text-[10px] tracking-[0.2em] uppercase hover:bg-[#294b40] transition-colors duration-300"
                >
                  Explore Products
                  <ArrowRight
                    size={15}
                    strokeWidth={1.5}
                    className="group-hover:translate-x-1 transition-transform duration-300"
                  />
                </Link>

              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
