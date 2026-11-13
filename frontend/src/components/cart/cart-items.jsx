
import { Trash2, Minus, Plus } from "lucide-react"

export default function CartItems({ items, onUpdateQuantity, onRemoveItem }) {
  return (
    <div className="space-y-5">
      {items.map((item) => (
        <article
          key={item._id}
          className="bg-white/70 border border-[#e7eae3] p-4 sm:p-6 transition-colors duration-300 hover:border-[#cbd5ca]"
        >
          <div className="flex flex-col sm:flex-row gap-5 sm:gap-6">

            {/* Product Image */}
            <div className="w-full sm:w-28 h-32 sm:h-28 bg-[#f8f6f0] border border-[#e7eae3] flex-shrink-0 flex items-center justify-center overflow-hidden">
              <img
                src={item.product?.images?.[0] || "/placeholder.svg"}
                alt={item.product?.name || "Product"}
                className="w-full h-full object-contain p-3"
              />
            </div>

            {/* Product Details */}
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <span className="font-sans text-[9px] tracking-[0.22em] uppercase text-[#879188]">
                  Belief Cosmetics
                </span>

                <h3 className="font-editorial text-2xl text-[#172b27] mt-1 leading-tight">
                  {item.product?.name}
                </h3>

                {item.variant && (
                  <p className="font-sans text-xs text-[#879188] mt-2">
                    Variant: {item.variant}
                  </p>
                )}
              </div>

              <p className="font-sans text-sm font-medium text-[#294b40] mt-3">
                ₹{item.product?.price}
              </p>
            </div>

            {/* Quantity and Remove */}
            <div className="flex items-center justify-between sm:flex-col sm:items-end sm:justify-between gap-4">
              <div className="flex items-center border border-[#dfe4dc] h-10">
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
                  aria-label="Decrease quantity"
                  className="w-10 h-full flex items-center justify-center text-[#718477] hover:bg-[#f1f3ed] hover:text-[#172b27] transition-colors"
                >
                  <Minus size={13} strokeWidth={1.5} />
                </button>

                <span className="w-9 text-center font-sans text-sm text-[#172b27] tabular-nums">
                  {item.quantity}
                </span>

                <button
                  type="button"
                  onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
                  aria-label="Increase quantity"
                  className="w-10 h-full flex items-center justify-center text-[#718477] hover:bg-[#f1f3ed] hover:text-[#172b27] transition-colors"
                >
                  <Plus size={13} strokeWidth={1.5} />
                </button>
              </div>

              <button
                type="button"
                onClick={() => onRemoveItem(item._id)}
                className="inline-flex items-center gap-2 font-sans text-[9px] tracking-[0.16em] uppercase text-[#879188] hover:text-red-700 transition-colors"
              >
                <Trash2 size={14} strokeWidth={1.5} />
                <span>Remove</span>
              </button>
            </div>

            {/* Subtotal */}
            <div className="sm:min-w-[105px] sm:text-right border-t border-[#e7eae3] sm:border-t-0 pt-4 sm:pt-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
              <span className="font-sans text-[9px] tracking-[0.18em] uppercase text-[#879188]">
                Subtotal
              </span>

              <p className="font-editorial text-2xl text-[#172b27] tabular-nums">
                ₹{((item.product?.price || 0) * item.quantity).toLocaleString("en-IN")}
              </p>
            </div>

          </div>
        </article>
      ))}
    </div>
  )
}
