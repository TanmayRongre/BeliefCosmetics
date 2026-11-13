
import { useState } from "react"
import { Link } from "react-router-dom"
import axiosInstance from "@/lib/axios"
import { toast } from "react-hot-toast"
import {
  Tag,
  Truck,
  ShieldCheck,
  RotateCcw,
  Headset,
  ArrowRight,
  Check
} from "lucide-react"

export default function CartSummary({
  items,
  onCheckout,
  couponCode,
  setCouponCode,
  isCouponApplied,
  setIsCouponApplied,
  discount,
  setDiscount
}) {
  const [couponLoading, setCouponLoading] = useState(false)

  const inclusiveSubtotal = items.reduce(
    (sum, item) => sum + ((item.product?.price || 0) * item.quantity),
    0
  )

  const tax = Math.round(inclusiveSubtotal - (inclusiveSubtotal / 1.18))
  const subtotal = inclusiveSubtotal - tax

  const totalQuantity = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  )

  const standardShipping = totalQuantity * 50
  const shipping = inclusiveSubtotal > 1500 ? 0 : standardShipping
  const total = inclusiveSubtotal + shipping - discount

  const remainingForFreeShipping = Math.max(0, 1500 - inclusiveSubtotal)

  const handleApplyCoupon = async () => {
    if (!couponCode || couponLoading || isCouponApplied) return

    setCouponLoading(true)

    try {
      const res = await axiosInstance.post("/cart/validate-coupon", {
        code: couponCode
      })

      if (res.data.valid) {
        setIsCouponApplied(true)

        if (res.data.type === "free_delivery") {
          if (shipping > 0) {
            setDiscount(shipping)
            toast.success(res.data.message)
          } else {
            toast.success("Free delivery already applied on orders above ₹1500!")
            setDiscount(0)
          }
        }
      }
    } catch (error) {
      console.error("Coupon error:", error)
      toast.error(error.response?.data?.message || "Invalid Coupon Code")
      setIsCouponApplied(false)
      setDiscount(0)
    } finally {
      setCouponLoading(false)
    }
  }

  return (
    <div className="w-full">

      {/* Summary Heading */}
      <div className="flex items-center gap-3 mb-7">
        <span className="w-7 h-px bg-[#718477]" />
        <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-[#718477]">
          Payment Details
        </span>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-5 pb-7 border-b border-[#e7eae3]">
        <div className="flex items-center justify-between gap-4">
          <span className="font-sans text-sm text-[#879188]">
            Subtotal
          </span>
          <span className="font-sans text-sm text-[#172b27] tabular-nums">
            ₹{subtotal.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="font-sans text-sm text-[#879188]">
            Tax <span className="text-[10px]">(18% included)</span>
          </span>
          <span className="font-sans text-sm text-[#172b27] tabular-nums">
            ₹{tax.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="font-sans text-sm text-[#879188]">
            Shipping
          </span>
          <span className={`font-sans text-sm tabular-nums ${shipping === 0 ? "text-[#294b40]" : "text-[#172b27]"}`}>
            {shipping === 0 ? "Complimentary" : `₹${shipping.toLocaleString("en-IN")}`}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex items-center justify-between gap-4">
            <span className="font-sans text-sm text-[#718477]">
              Coupon Discount
            </span>
            <span className="font-sans text-sm text-[#294b40] tabular-nums">
              -₹{discount.toLocaleString("en-IN")}
            </span>
          </div>
        )}
      </div>

      {/* Shipping Information */}
      {shipping === 0 ? (
        <div className="flex items-center gap-3 bg-[#edf1eb] p-4 mt-5">
          <Truck size={17} strokeWidth={1.5} className="text-[#294b40] shrink-0" />
          <div>
            <p className="font-sans text-xs font-medium text-[#294b40]">
              Complimentary Shipping
            </p>
            <p className="font-sans text-[10px] text-[#718477] mt-1">
              Free delivery applied to your order.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3 bg-[#f4f3ed] p-4 mt-5">
          <Truck size={17} strokeWidth={1.5} className="text-[#718477] shrink-0 mt-0.5" />
          <p className="font-sans text-xs leading-5 text-[#718477]">
            Add products worth{" "}
            <span className="font-semibold text-[#294b40]">
              ₹{remainingForFreeShipping.toLocaleString("en-IN")}
            </span>{" "}
            more for complimentary shipping.
          </p>
        </div>
      )}

      {/* Coupon Section */}
      <div className="mt-8 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Tag size={15} strokeWidth={1.5} className="text-[#718477]" />
          <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#718477]">
            Promotional Code
          </label>
        </div>

        <div className="flex border border-[#dfe4dc] focus-within:border-[#718477] transition-colors">
          <input
            type="text"
            placeholder="Enter coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            disabled={isCouponApplied || couponLoading}
            className="w-full min-w-0 bg-transparent px-4 py-3 font-sans text-xs text-[#172b27] placeholder:text-[#a1aaa1] outline-none disabled:opacity-60 uppercase"
          />

          <button
            type="button"
            onClick={handleApplyCoupon}
            disabled={isCouponApplied || !couponCode.trim() || couponLoading}
            className="shrink-0 px-4 sm:px-5 bg-[#172b27] text-[#f8f6f0] font-sans text-[9px] tracking-[0.15em] uppercase hover:bg-[#294b40] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {couponLoading ? "Checking..." : isCouponApplied ? "Applied" : "Apply"}
          </button>
        </div>

        {isCouponApplied && (
          <p className="flex items-center gap-2 mt-3 font-sans text-xs text-[#294b40]">
            <Check size={14} />
            Coupon applied successfully!
          </p>
        )}
      </div>

      {/* Total */}
      <div className="border-t border-[#dfe4dc] pt-6 mb-7">
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="font-editorial text-2xl text-[#172b27]">
              Total
            </span>
            <p className="font-sans text-[9px] tracking-[0.12em] uppercase text-[#879188] mt-1">
              Inclusive of applicable taxes
            </p>
          </div>

          <div className="text-right">
            {discount > 0 && (
              <p className="font-sans text-xs text-[#a1aaa1] line-through mb-1">
                ₹{(total + discount).toLocaleString("en-IN")}
              </p>
            )}
            <p className="font-editorial text-3xl text-[#294b40] tabular-nums">
              ₹{total.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </div>

      {/* Checkout */}
      <button
        type="button"
        onClick={onCheckout}
        className="group w-full flex items-center justify-center gap-3 bg-[#172b27] text-[#f8f6f0] py-4 px-5 font-sans text-[10px] tracking-[0.2em] uppercase hover:bg-[#294b40] transition-colors duration-300"
      >
        Proceed to Checkout
        <ArrowRight
          size={15}
          strokeWidth={1.5}
          className="group-hover:translate-x-1 transition-transform duration-300"
        />
      </button>

      {/* Continue Shopping */}
      <Link
        to="/products"
        className="mt-3 w-full flex items-center justify-center border border-[#dfe4dc] text-[#718477] py-4 px-5 font-sans text-[10px] tracking-[0.2em] uppercase hover:border-[#718477] hover:text-[#172b27] transition-colors duration-300"
      >
        Continue Shopping
      </Link>

      {/* Trust Information */}
      <div className="mt-8 pt-6 border-t border-[#e7eae3] space-y-4">
        <div className="flex items-center gap-3">
          <ShieldCheck size={16} strokeWidth={1.4} className="text-[#718477]" />
          <span className="font-sans text-[10px] text-[#879188]">
            Secure checkout
          </span>
        </div>

        <div className="flex items-center gap-3">
          <RotateCcw size={16} strokeWidth={1.4} className="text-[#718477]" />
          <span className="font-sans text-[10px] text-[#879188]">
            14-day return policy
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Headset size={16} strokeWidth={1.4} className="text-[#718477]" />
          <span className="font-sans text-[10px] text-[#879188]">
            Customer support available
          </span>
        </div>
      </div>

    </div>
  )
}
