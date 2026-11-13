
'use client'

import { useState } from "react"
import { X, Heart, ShoppingBag, Star, Check } from "lucide-react"
import { useAuthStore } from "@/store/useAuthStore"
import { useCartStore } from "@/store/useCartStore"
import { useWishlistStore } from "@/store/useWishlistStore"

export default function ProductQuickView({ product, onClose }) {
  const [adding, setAdding] = useState(false)

  const { authUser, openAuthModal } = useAuthStore()
  const { addToCart } = useCartStore()
  const { addToWishlist, removeFromWishlist, isInWishlist } =
    useWishlistStore()

  if (!product) return null

  const productId = product._id || product.id
  const image = product.images?.[0] || product.image || "/placeholder.svg"

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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#172b27]/65 p-3 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Quick view: ${product.name}`}
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[min(680px,90vh)] w-full max-w-[850px] flex-col overflow-hidden border border-[#e7eae3] bg-[#f8f6f0] shadow-2xl"
      >
        {/* Header */}
        <div className="flex h-[66px] shrink-0 items-center justify-between border-b border-[#e7eae3] px-5 sm:px-8">
          <div>
            <p className="font-sans text-[9px] uppercase tracking-[0.25em] text-[#718477]">
              Belief Cosmetics
            </p>
            <p className="font-editorial text-lg leading-tight text-[#172b27]">
              Product Details
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close quick view"
            className="flex h-9 w-9 items-center justify-center border border-[#dfe4dc] text-[#172b27] transition-colors hover:bg-[#172b27] hover:text-white"
          >
            <X size={17} strokeWidth={1.5} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 gap-0 md:grid-cols-2">

            {/* Product image */}
            <div className="relative flex h-[280px] items-center justify-center overflow-hidden bg-[#f1f2ec] sm:h-[340px] md:h-[490px]">
              <img
                src={image}
                alt={product.name}
                className="h-full w-full object-contain p-8 sm:p-12"
              />

              <div className="absolute bottom-5 left-5">
                <span className="border border-[#dfe4dc] bg-[#f8f6f0]/95 px-3 py-1.5 font-sans text-[9px] uppercase tracking-[0.16em] text-[#294b40]">
                  {product.category || "Skincare"}
                </span>
              </div>
            </div>

            {/* Product information */}
            <div className="flex flex-col p-6 sm:p-8 md:p-9">

              <div className="mb-5">
                <p className="mb-3 font-sans text-[9px] uppercase tracking-[0.22em] text-[#718477]">
                  Thoughtfully made skincare
                </p>

                <h2 className="mb-3 font-editorial text-3xl leading-tight text-[#172b27] sm:text-4xl">
                  {product.name}
                </h2>

                <p className="font-sans text-2xl font-medium text-[#172b27]">
                  ₹{product.price}
                </p>
              </div>

              {/* Rating */}
              <div className="mb-6 flex items-center gap-2 border-b border-[#e7eae3] pb-5">
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
                <div className="mb-6">
                  <h3 className="mb-2 font-editorial text-xl text-[#172b27]">
                    About this product
                  </h3>

                  <p className="font-sans text-xs leading-6 text-[#718477]">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Skin types */}
              <div className="mb-6">
                <h3 className="mb-3 font-editorial text-xl text-[#172b27]">
                  Suitable for
                </h3>

                <div className="flex min-h-[28px] flex-wrap gap-2">
                  {skinTypes.length > 0 ? (
                    skinTypes.map((type) => (
                      <span
                        key={type}
                        className="border border-[#dfe4dc] px-3 py-1.5 font-sans text-[10px] text-[#718477]"
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

              {/* Concerns */}
              {concerns.length > 0 && (
                <div className="mb-6">
                  <h3 className="mb-3 font-editorial text-xl text-[#172b27]">
                    Skin concerns
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {concerns.map((concern) => (
                      <span
                        key={concern}
                        className="border border-[#dfe4dc] bg-[#f1f2ec] px-3 py-1.5 font-sans text-[10px] text-[#718477]"
                      >
                        {concern}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Ingredients */}
              <div className="mb-6">
                <h3 className="mb-3 font-editorial text-xl text-[#172b27]">
                  Ingredients
                </h3>

                {ingredients.length > 0 ? (
                  <p className="font-sans text-xs leading-6 text-[#718477]">
                    {ingredients.join(", ")}
                  </p>
                ) : (
                  <p className="font-sans text-xs text-[#879188]">
                    Ingredient information not available.
                  </p>
                )}
              </div>

              {/* Product tags */}
              {tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="mb-3 font-editorial text-xl text-[#172b27]">
                    Product highlights
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1.5 bg-[#e9eee7] px-3 py-1.5 font-sans text-[10px] text-[#294b40]"
                      >
                        <Check size={11} />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Fixed footer actions */}
        <div className="flex shrink-0 items-center gap-3 border-t border-[#e7eae3] bg-[#f8f6f0] px-5 py-4 sm:px-8">
          <button
            type="button"
            onClick={handleWishlist}
            aria-label={
              wishlisted ? "Remove from wishlist" : "Add to wishlist"
            }
            className={`flex h-12 w-12 shrink-0 items-center justify-center border transition-colors ${wishlisted
                ? "border-[#172b27] bg-[#172b27] text-white"
                : "border-[#dfe4dc] text-[#294b40] hover:border-[#172b27]"
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
            className="flex h-12 flex-1 items-center justify-between bg-[#172b27] px-5 font-sans text-[10px] uppercase tracking-[0.18em] text-[#f8f6f0] transition-colors hover:bg-[#294b40] disabled:cursor-not-allowed disabled:opacity-40"
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
