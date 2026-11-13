
import { useState } from "react"
import { motion } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"
import { Heart, ShoppingBag, ArrowUpRight } from "lucide-react"
import ProductQuickView from "@/components/product/product-quick-view"
import { useWishlistStore } from "@/store/useWishlistStore"
import { useAuthStore } from "@/store/useAuthStore"
import { useCartStore } from "@/store/useCartStore"

export default function ProductGrid({
  viewType,
  filters,
  products = [],
}) {
  const [selectedProduct, setSelectedProduct] = useState(null)

  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useWishlistStore()

  const { authUser, openAuthModal } = useAuthStore()
  const { addToCart } = useCartStore()
  const navigate = useNavigate()

  // Products are filtered on the server
  const filteredProducts = products

  const getProductId = (product) => product._id || product.id

  const getProductImage = (product) =>
    product.images?.[0] || product.image || "/placeholder.svg"

  const getProductTags = (product) =>
    (product.allergyLabels || product.tags || []).slice(0, 2)

  const isOutOfStock = (product) =>
    product.status === "Out of Stock" || product.stock === 0

  const handleBuyNow = async (e, product) => {
    e.preventDefault()
    e.stopPropagation()

    if (!authUser) {
      openAuthModal({ type: "login" })
      return
    }

    await addToCart(getProductId(product), 1)
    navigate("/cart")
  }

  const handleAddToCart = (e, product) => {
    e.preventDefault()
    e.stopPropagation()

    if (!authUser) {
      openAuthModal({ type: "login" })
      return
    }

    addToCart(getProductId(product), 1)
  }

  const handleWishlistToggle = (e, productId) => {
    e.preventDefault()
    e.stopPropagation()

    if (!authUser) {
      openAuthModal({ type: "wishlist" })
      return
    }

    if (isInWishlist(productId)) {
      removeFromWishlist(productId)
    } else {
      addToWishlist(productId)
    }
  }

  // Empty state
  if (filteredProducts.length === 0) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center px-6 py-20 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[#e7eae3] bg-[#f1f2ec]">
          <Heart
            className="h-8 w-8 text-[#718477]"
            strokeWidth={1.2}
          />
        </div>

        <p className="mb-2 font-sans text-[10px] uppercase tracking-[0.25em] text-[#879188]">
          Your search
        </p>

        <h3 className="mb-3 font-editorial text-3xl text-[#172b27]">
          No Products Found
        </h3>

        <p className="max-w-sm font-sans text-sm leading-7 text-[#879188]">
          We couldn't find any products matching your filters.
          Try adjusting your search or filter criteria.
        </p>
      </div>
    )
  }

  // GRID VIEW
  if (viewType === "grid") {
    return (
      <>
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product, index) => {
            const productId = getProductId(product)
            const wishlisted = isInWishlist(productId)
            const tags = getProductTags(product)

            return (
              <motion.div
                key={productId}
                layout
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.45,
                  delay: Math.min(index * 0.05, 0.25),
                }}
                className="group flex h-[510px] min-w-0 flex-col overflow-hidden"
              >
                {/* Product image */}
                <div className="relative h-[290px] shrink-0 overflow-hidden bg-[#f1f2ec]">
                  <Link
                    to={`/products/${productId}`}
                    className="block h-full w-full"
                  >
                    <motion.img
                      layoutId={`product-image-${productId}`}
                      src={getProductImage(product)}
                      alt={product.name}
                      className="h-full w-full object-contain p-7 transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </Link>

                  {/* Wishlist */}
                  <button
                    type="button"
                    onClick={(e) =>
                      handleWishlistToggle(e, productId)
                    }
                    aria-label={
                      wishlisted
                        ? "Remove from wishlist"
                        : "Add to wishlist"
                    }
                    className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 ${wishlisted
                        ? "border-[#172b27] bg-[#172b27] text-white"
                        : "border-[#e7eae3] bg-[#f8f6f0] text-[#294b40] hover:border-[#172b27] hover:bg-[#172b27] hover:text-white"
                      }`}
                  >
                    <Heart
                      size={17}
                      strokeWidth={1.5}
                      className={wishlisted ? "fill-current" : ""}
                    />
                  </button>

                  {/* Category / Stock */}
                  <div className="absolute bottom-4 left-4">
                    {isOutOfStock(product) ? (
                      <span className="bg-[#172b27] px-3 py-1.5 font-sans text-[9px] uppercase tracking-[0.16em] text-white">
                        Sold Out
                      </span>
                    ) : (
                      <span className="border border-[#dfe4dc] bg-[#f8f6f0]/95 px-3 py-1.5 font-sans text-[9px] uppercase tracking-[0.16em] text-[#294b40]">
                        {product.category}
                      </span>
                    )}
                  </div>
                </div>

                {/* Product details */}
                <div className="flex min-h-0 flex-1 flex-col pt-5">
                  {/* Name and price */}
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <Link
                      to={`/products/${productId}`}
                      className="min-w-0 flex-1"
                    >
                      <h3 className="line-clamp-2 min-h-[52px] font-editorial text-[23px] leading-tight text-[#172b27] transition-colors duration-300 group-hover:text-[#718477]">
                        {product.name}
                      </h3>
                    </Link>

                    <span className="shrink-0 pt-1 font-sans text-sm font-medium text-[#172b27]">
                      ₹{product.price}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="mb-4 flex h-[18px] shrink-0 items-center gap-2">
                    <span className="text-xs text-[#718477]">
                      ★ {product.rating
                        ? product.rating.toFixed(1)
                        : "New"}
                    </span>

                    <span className="h-1 w-1 rounded-full bg-[#c5ccc2]" />

                    <span className="font-sans text-[11px] text-[#879188]">
                      {product.reviews || 0} Reviews
                    </span>
                  </div>

                  {/* Fixed tag area */}
                  <div className="mb-4 flex h-[26px] shrink-0 flex-wrap content-start gap-2 overflow-hidden">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="border border-[#dfe4dc] px-2.5 py-1 font-sans text-[9px] uppercase tracking-[0.1em] text-[#718477]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Fixed bottom button */}
                  <button
                    type="button"
                    onClick={(e) => handleAddToCart(e, product)}
                    disabled={isOutOfStock(product)}
                    className="mt-auto flex w-full shrink-0 items-center justify-between border border-[#172b27] bg-[#172b27] px-5 py-3.5 font-sans text-[10px] uppercase tracking-[0.18em] text-[#f8f6f0] transition-all duration-300 hover:bg-[#294b40] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <span>
                      {isOutOfStock(product) ? "Sold Out" : "Add to Bag"}
                    </span>

                    <ShoppingBag size={15} strokeWidth={1.5} />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>

        {selectedProduct && (
          <ProductQuickView
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </>
    )
  }

  // LIST VIEW
  return (
    <>
      <div className="space-y-0">
        {filteredProducts.map((product, index) => {
          const productId = getProductId(product)
          const wishlisted = isInWishlist(productId)

          return (
            <motion.div
              key={productId}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.35,
                delay: Math.min(index * 0.04, 0.2),
              }}
              className="group flex min-h-[176px] flex-col gap-5 border-b border-[#e7eae3] py-5 sm:flex-row sm:items-center"
            >
              {/* Image */}
              <Link
                to={`/products/${productId}`}
                className="h-[136px] w-full shrink-0 overflow-hidden bg-[#f1f2ec] sm:w-[136px]"
              >
                <img
                  src={getProductImage(product)}
                  alt={product.name}
                  className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                />
              </Link>

              {/* Details */}
              <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                <div>
                  <p className="mb-2 font-sans text-[9px] uppercase tracking-[0.2em] text-[#718477]">
                    {product.category}
                  </p>

                  <Link to={`/products/${productId}`}>
                    <h3 className="line-clamp-2 min-h-[52px] font-editorial text-2xl leading-tight text-[#172b27] transition-colors group-hover:text-[#718477]">
                      {product.name}
                    </h3>
                  </Link>

                  <p className="mt-2 line-clamp-2 min-h-[40px] font-sans text-xs leading-5 text-[#879188]">
                    {product.ingredients?.length
                      ? product.ingredients.join(", ")
                      : ""}
                  </p>
                </div>

                <div className="flex h-[18px] items-center gap-2">
                  <span className="text-xs text-[#718477]">
                    ★ {product.rating
                      ? product.rating.toFixed(1)
                      : "New"}
                  </span>

                  <span className="h-1 w-1 rounded-full bg-[#c5ccc2]" />

                  <span className="font-sans text-[11px] text-[#879188]">
                    {product.reviews || 0} Reviews
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex shrink-0 items-center justify-between gap-4 sm:min-h-[136px] sm:flex-col sm:items-end">
                <button
                  type="button"
                  onClick={(e) =>
                    handleWishlistToggle(e, productId)
                  }
                  aria-label={
                    wishlisted
                      ? "Remove from wishlist"
                      : "Add to wishlist"
                  }
                  className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300 ${wishlisted
                      ? "border-[#172b27] bg-[#172b27] text-white"
                      : "border-[#dfe4dc] text-[#294b40] hover:bg-[#172b27] hover:text-white"
                    }`}
                >
                  <Heart
                    size={16}
                    strokeWidth={1.5}
                    className={wishlisted ? "fill-current" : ""}
                  />
                </button>

                <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                  <p className="font-sans text-base font-medium text-[#172b27]">
                    ₹{product.price}
                  </p>

                  <button
                    type="button"
                    onClick={(e) => handleAddToCart(e, product)}
                    disabled={isOutOfStock(product)}
                    className="flex items-center gap-3 bg-[#172b27] px-5 py-3 font-sans text-[10px] uppercase tracking-[0.16em] text-[#f8f6f0] transition-colors hover:bg-[#294b40] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {isOutOfStock(product) ? "Sold Out" : "Add to Bag"}
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {selectedProduct && (
        <ProductQuickView
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  )
}
