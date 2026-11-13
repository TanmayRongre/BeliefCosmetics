
"use client"

import { useState } from "react"
import {
  X,
  Heart,
  ShoppingBag,
  Star,
  Check,
  Sparkles,
  Leaf,
} from "lucide-react"

import { useAuthStore } from "@/store/useAuthStore"
import { useCartStore } from "@/store/useCartStore"
import { useWishlistStore } from "@/store/useWishlistStore"

export default function ProductQuickView({ product, onClose }) {
  const [adding, setAdding] = useState(false)

  const { authUser, openAuthModal } = useAuthStore()
  const { addToCart } = useCartStore()

  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useWishlistStore()

  if (!product) return null

  const productId = product._id || product.id
  const image =
    product.images?.[0] || product.image || "/placeholder.svg"

  const skinTypes = product.skinType || product.skinTypes || []
  const concerns = product.concerns || product.skinConcerns || []
  const tags = product.tags || product.allergyLabels || []
  const ingredients = product.ingredients || []

  const wishlisted = isInWishlist(productId)

  const outOfStock =
    product.status === "Out of Stock" || product.stock === 0

  const handleAddToCart = async () => {
    if (!authUser) {
      openAuthModal({ type: "login" })
      return
    }

    if (outOfStock || adding) return

    try {
      setAdding(true)
      await addToCart(productId, 1)
      onClose()
    } finally {
      setAdding(false)
    }
  }

  const handleWishlist = () => {
    if (!authUser) {
      openAuthModal({ type: "wishlist" })
      return
    }

    if (wishlisted) {
      removeFromWishlist(productId)
    } else {
      addToWishlist(productId)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#172b27]/70 p-3 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Quick view: ${product.name}`}
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[min(720px,92vh)] w-full max-w-[900px] flex-col overflow-hidden border border-[#e7eae3] bg-[#f8f6f0] shadow-2xl"
      >
        {/* Modal header */}
        <div className="flex h-[68px] shrink-0 items-center justify-between border-b border-[#e7eae3] px-5 sm:px-8">
          <div>
            <p className="font-sans text-[9px] uppercase tracking-[0.28em] text-[#718477]">
              Belief Cosmetics
            </p>

            <p className="font-editorial text-xl leading-tight text-[#172b27]">
              Product Details
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close quick view"
            className="flex h-9 w-9 items-center justify-center border border-[#dfe4dc] text-[#172b27] transition-all duration-300 hover:border-[#172b27] hover:bg-[#172b27] hover:text-[#f8f6f0]"
          >
            <X size={17} strokeWidth={1.5} />
          </button>
        </div>

        {/* Scrollable product content */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2">

            {/* Product image */}
            <div className="relative flex min-h-[300px] items-center justify-center overflow-hidden bg-[#f0f1eb] sm:min-h-[380px] md:min-h-[520px]">
              <div className="absolute left-0 top-0 h-40 w-40 rounded-full bg-[#718477]/10 blur-3xl" />

              <img
                src={image}
                alt={product.name}
                className="relative z-10 h-full max-h-[520px] w-full object-contain p-8 transition-transform duration-700 hover:scale-105 sm:p-12"
              />

              <div className="absolute bottom-5 left-5 z-20">
                <span className="border border-[#dfe4dc] bg-[#f8f6f0]/95 px-4 py-2 font-sans text-[9px] uppercase tracking-[0.18em] text-[#294b40]">
                  {product.category || "Skincare"}
                </span>
              </div>

              {outOfStock && (
                <div className="absolute right-5 top-5 z-20">
                  <span className="bg-[#172b27] px-3 py-2 font-sans text-[9px] uppercase tracking-[0.16em] text-[#f8f6f0]">
                    Sold Out
                  </span>
                </div>
              )}
            </div>

            {/* Product information */}
            <div className="flex flex-col px-6 py-7 sm:px-9 sm:py-9">

              {/* Product title */}
              <div className="mb-6">
                <div className="mb-4 flex items-center gap-2">
                  <Sparkles
                    size={13}
                    strokeWidth={1.5}
                    className="text-[#718477]"
                  />

                  <p className="font-sans text-[9px] uppercase tracking-[0.22em] text-[#718477]">
                    Thoughtfully made skincare
                  </p>
                </div>

                <h2 className="mb-3 font-editorial text-3xl leading-[1.15] text-[#172b27] sm:text-[40px]">
                  {product.name}
                </h2>

                <p className="font-sans text-2xl font-medium text-[#172b27]">
                  ₹{product.price}
                </p>
              </div>

              {/* Rating */}
              <div className="mb-7 flex items-center gap-2 border-b border-[#e7eae3] pb-6">
                <Star
                  size={14}
                  className="fill-[#718477] text-[#718477]"
                />

                <span className="font-sans text-xs text-[#294b40]">
                  {product.rating
                    ? Number(product.rating).toFixed(1)
                    : "New"}
                </span>

                <span className="h-1 w-1 rounded-full bg-[#c5ccc2]" />

                <span className="font-sans text-xs text-[#879188]">
                  {product.reviews || 0} Reviews
                </span>
              </div>

              {/* Description */}
              {product.description && (
                <div className="mb-7">
                  <h3 className="mb-3 font-editorial text-2xl text-[#172b27]">
                    About this product
                  </h3>

                  <p className="font-sans text-xs leading-7 text-[#718477]">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Skin types */}
              <div className="mb-7">
                <h3 className="mb-3 font-editorial text-2xl text-[#172b27]">
                  Suitable for
                </h3>

                <div className="flex flex-wrap gap-2">
                  {skinTypes.length > 0 ? (
                    skinTypes.map((type) => (
                      <span
                        key={type}
                        className="border border-[#dfe4dc] bg-white/50 px-3 py-2 font-sans text-[10px] tracking-wide text-[#718477]"
                      >
                        {type}
                      </span>
                    ))
                  ) : (
                    <span className="font-sans text-xs text-[#879188]">
                      Not specified
                    </span>
                  )}
                </div>
              </div>

              {/* Skin concerns */}
              {concerns.length > 0 && (
                <div className="mb-7">
                  <h3 className="mb-3 font-editorial text-2xl text-[#172b27]">
                    Skin concerns
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {concerns.map((concern) => (
                      <span
                        key={concern}
                        className="border border-[#dfe4dc] bg-[#f0f1eb] px-3 py-2 font-sans text-[10px] text-[#718477]"
                      >
                        {concern}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Ingredients */}
              <div className="mb-7">
                <h3 className="mb-3 font-editorial text-2xl text-[#172b27]">
                  Ingredients
                </h3>

                {ingredients.length > 0 ? (
                  <p className="font-sans text-xs leading-7 text-[#718477]">
                    {ingredients.join(", ")}
                  </p>
                ) : (
                  <p className="font-sans text-xs text-[#879188]">
                    Ingredient information not available.
                  </p>
                )}
              </div>

              {/* Product highlights */}
              {tags.length > 0 && (
                <div className="mb-5">
                  <h3 className="mb-3 font-editorial text-2xl text-[#172b27]">
                    Product highlights
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-2 bg-[#e9eee7] px-3 py-2 font-sans text-[10px] text-[#294b40]"
                      >
                        <Check size={11} strokeWidth={2} />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Brand note */}
              <div className="mt-auto border-t border-[#e7eae3] pt-5">
                <div className="flex items-center gap-2">
                  <Leaf
                    size={14}
                    strokeWidth={1.5}
                    className="text-[#718477]"
                  />

                  <p className="font-sans text-[9px] uppercase tracking-[0.17em] text-[#879188]">
                    A considered approach to skincare
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed footer actions */}
        <div className="flex shrink-0 items-center gap-3 border-t border-[#e7eae3] bg-[#f8f6f0] px-5 py-4 sm:px-8">
          <button
            type="button"
            onClick={handleWishlist}
            aria-label={
              wishlisted
                ? "Remove from wishlist"
                : "Add to wishlist"
            }
            className={`flex h-12 w-12 shrink-0 items-center justify-center border transition-all duration-300 ${wishlisted
                ? "border-[#172b27] bg-[#172b27] text-white"
                : "border-[#dfe4dc] text-[#294b40] hover:border-[#172b27] hover:bg-[#172b27] hover:text-white"
              }`}
          >
            <Heart
              size={18}
              strokeWidth={1.5}
              className={wishlisted ? "fill-current" : ""}
            />
          </button>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={outOfStock || adding}
            className="flex h-12 flex-1 items-center justify-between bg-[#172b27] px-5 font-sans text-[10px] uppercase tracking-[0.18em] text-[#f8f6f0] transition-all duration-300 hover:bg-[#294b40] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span>
              {outOfStock
                ? "Sold Out"
                : adding
                  ? "Adding..."
                  : "Add to Bag"}
            </span>

            <ShoppingBag size={16} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  )
}
