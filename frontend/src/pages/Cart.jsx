
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuthStore } from "@/store/useAuthStore"
import { useCartStore } from "@/store/useCartStore"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import CartItems from "@/components/cart/cart-items"
import CartSummary from "@/components/cart/cart-summary"
import { Loader, ShoppingBag, ArrowRight } from "lucide-react"

export default function Cart() {
  const { authUser, openAuthModal } = useAuthStore()
  const { cart, getCart, updateQuantity, removeFromCart, loading } = useCartStore()
  const navigate = useNavigate()

  const [couponCode, setCouponCode] = useState("")
  const [isCouponApplied, setIsCouponApplied] = useState(false)
  const [discount, setDiscount] = useState(0)

  useEffect(() => {
    if (authUser) {
      getCart()
    }
  }, [authUser, getCart])

  const handleUpdateQuantity = (id, quantity) => {
    updateQuantity(id, quantity)
  }

  const handleRemoveItem = (id) => {
    removeFromCart(id)
  }

  const handleCheckout = () => {
    if (!authUser) {
      openAuthModal({ type: "checkout" })
    } else {
      navigate("/checkout", {
        state: {
          couponCode: isCouponApplied ? couponCode : "",
          discount: discount,
          isCouponApplied: isCouponApplied
        }
      })
    }
  }

  if (loading && !cart) {
    return (
      <div className="min-h-screen bg-[#f8f6f0] flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-5">
          <Loader className="w-9 h-9 animate-spin text-[#294b40]" strokeWidth={1.2} />
          <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-[#879188]">
            Loading your cart
          </p>
        </div>
        <Footer />
      </div>
    )
  }

  const cartItems = cart?.items || []

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f6f0] text-[#172b27]">
      <Header />

      <main className="flex-1 w-full">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-12 lg:py-16">

          {/* Page Heading */}
          <section className="mb-10 lg:mb-14">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-[#718477]" />
              <span className="font-sans text-[10px] sm:text-xs tracking-[0.28em] uppercase text-[#718477]">
                Your shopping selection
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
              <div>
                <h1 className="font-editorial text-5xl sm:text-6xl lg:text-7xl font-normal leading-[0.95] tracking-tight text-[#172b27]">
                  Shopping Cart<span className="text-[#718477]">.</span>
                </h1>
                <p className="font-sans text-sm text-[#879188] mt-4 leading-7">
                  Review your selection before making it part of your routine.
                </p>
              </div>

              <div className="flex items-center gap-3 text-[#718477] font-sans text-xs tracking-[0.15em] uppercase">
                <ShoppingBag size={16} strokeWidth={1.5} />
                <span>
                  {cartItems.length} {cartItems.length === 1 ? "Item" : "Items"}
                </span>
              </div>
            </div>
          </section>

          <div className="h-px bg-[#e7eae3] mb-10" />

          {cartItems.length > 0 ? (
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">

              {/* Cart Products */}
              <div className="lg:col-span-8 min-w-0">
                <div className="flex items-center justify-between border-b border-[#dfe4dc] pb-5 mb-6">
                  <h2 className="font-editorial text-2xl sm:text-3xl text-[#172b27]">
                    Your Selection
                  </h2>
                  <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#879188]">
                    {cartItems.length} Products
                  </span>
                </div>

                <CartItems
                  items={cartItems}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveItem={handleRemoveItem}
                />

                <div className="mt-8 pt-6 border-t border-[#e7eae3]">
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-3 font-sans text-[10px] tracking-[0.2em] uppercase text-[#718477] hover:text-[#172b27] transition-colors duration-300 group"
                  >
                    <ArrowRight
                      size={14}
                      className="rotate-180 group-hover:-translate-x-1 transition-transform duration-300"
                    />
                    Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Cart Summary */}
              <aside className="lg:col-span-4 min-w-0 lg:sticky lg:top-8">
                <div className="border border-[#e7eae3] bg-white/50 p-5 sm:p-7 lg:p-8">
                  <div className="mb-6 pb-5 border-b border-[#e7eae3]">
                    <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-[#879188]">
                      Order Overview
                    </span>
                    <h2 className="font-editorial text-3xl text-[#172b27] mt-2">
                      Order Summary
                    </h2>
                  </div>

                  <CartSummary
                    items={cartItems}
                    onCheckout={handleCheckout}
                    couponCode={couponCode}
                    setCouponCode={setCouponCode}
                    isCouponApplied={isCouponApplied}
                    setIsCouponApplied={setIsCouponApplied}
                    discount={discount}
                    setDiscount={setDiscount}
                  />
                </div>
              </aside>
            </section>
          ) : (
            /* Empty Cart */
            <section className="min-h-[420px] flex items-center justify-center py-16">
              <div className="w-full max-w-xl mx-auto text-center">

                <div className="w-20 h-20 mx-auto mb-8 rounded-full border border-[#dfe4dc] flex items-center justify-center">
                  <ShoppingBag
                    size={32}
                    strokeWidth={1}
                    className="text-[#718477]"
                  />
                </div>

                <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#879188]">
                  Your bag is waiting
                </span>

                <h2 className="font-editorial text-4xl sm:text-5xl font-normal text-[#172b27] mt-4 mb-5">
                  A little something is missing.
                </h2>

                <p className="font-sans text-sm leading-7 text-[#879188] max-w-sm mx-auto mb-9">
                  Explore our collection of skincare essentials and find something special for your daily ritual.
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
