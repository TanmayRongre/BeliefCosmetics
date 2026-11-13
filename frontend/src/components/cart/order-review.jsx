
export default function OrderReview({
  items,
  subtotal,
  tax,
  shipping,
  total,
  discount = 0
}) {
  return (
    <div className="w-full bg-white/70 border border-[#e7eae3] p-5 sm:p-7 h-fit lg:sticky lg:top-24">

      {/* Header */}
      <div className="flex items-center gap-3 mb-7">
        <span className="w-7 h-px bg-[#718477]" />
        <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-[#718477]">
          Your Selection
        </span>
      </div>

      <div className="mb-6">
        <h2 className="font-editorial text-3xl sm:text-4xl text-[#172b27]">
          Order Review<span className="text-[#718477]">.</span>
        </h2>
        <p className="font-sans text-xs text-[#879188] mt-2">
          A final look at your chosen essentials.
        </p>
      </div>

      {/* Items */}
      <div className="space-y-5 pb-7 border-b border-[#e7eae3]">
        {items.map((item, index) => (
          <div
            key={item.id || index}
            className="flex items-center gap-4"
          >
            {/* Product Image */}
            <div className="w-[68px] h-[76px] bg-[#f8f6f0] border border-[#e7eae3] flex-shrink-0 flex items-center justify-center overflow-hidden">
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.name || "Product"}
                className="w-full h-full object-contain p-2"
              />
            </div>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
              <h3 className="font-editorial text-xl text-[#172b27] leading-tight line-clamp-2">
                {item.name}
              </h3>
              <p className="font-sans text-[10px] tracking-[0.12em] uppercase text-[#879188] mt-2">
                Quantity: {item.quantity}
              </p>
            </div>

            {/* Item Price */}
            <p className="font-sans text-sm font-medium text-[#294b40] whitespace-nowrap tabular-nums">
              ₹{(item.price * item.quantity).toLocaleString("en-IN")}
            </p>
          </div>
        ))}
      </div>

      {/* Price Breakdown */}
      <div className="space-y-4 py-7 border-b border-[#e7eae3]">
        <div className="flex justify-between items-center gap-4">
          <span className="font-sans text-sm text-[#879188]">
            Subtotal
          </span>
          <span className="font-sans text-sm text-[#172b27] tabular-nums">
            ₹{subtotal.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="flex justify-between items-center gap-4">
          <span className="font-sans text-sm text-[#879188]">
            Tax <span className="text-[10px]">(18%)</span>
          </span>
          <span className="font-sans text-sm text-[#172b27] tabular-nums">
            ₹{tax.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="flex justify-between items-center gap-4">
          <span className="font-sans text-sm text-[#879188]">
            Shipping
          </span>
          <span className={`font-sans text-sm tabular-nums ${shipping === 0 ? "text-[#294b40]" : "text-[#172b27]"}`}>
            {shipping === 0 ? "Complimentary" : `₹${shipping.toLocaleString("en-IN")}`}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between items-center gap-4">
            <span className="font-sans text-sm text-[#718477]">
              Coupon Discount
            </span>
            <span className="font-sans text-sm text-[#294b40] tabular-nums">
              -₹{discount.toLocaleString("en-IN")}
            </span>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="flex items-center justify-between gap-4 pt-6">
        <div>
          <h3 className="font-editorial text-2xl text-[#172b27]">
            Total
          </h3>
          <p className="font-sans text-[9px] tracking-[0.12em] uppercase text-[#879188] mt-1">
            Inclusive of applicable taxes
          </p>
        </div>

        <div className="text-right">
          {discount > 0 && (
            <p className="font-sans text-xs text-[#a1aaa1] line-through mb-1 tabular-nums">
              ₹{(total + discount).toLocaleString("en-IN")}
            </p>
          )}

          <p className="font-editorial text-3xl text-[#294b40] tabular-nums">
            ₹{total.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-7 pt-5 border-t border-[#e7eae3]">
        <p className="font-sans text-[10px] leading-5 text-[#879188] text-center">
          Thank you for choosing Belief Cosmetics. Your skincare journey begins here.
        </p>
      </div>

    </div>
  )
}
