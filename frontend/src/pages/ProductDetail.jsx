
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import {
  Heart,
  Share2,
  Loader,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  CreditCard,
  Minus,
  Plus,
  ArrowLeft,
  ArrowRight,
  Check,
  Sparkles,
} from "lucide-react"
import { useAuthStore } from "@/store/useAuthStore"
import { useCartStore } from "@/store/useCartStore"
import { useWishlistStore } from "@/store/useWishlistStore"
import axiosInstance from "@/lib/axios"
import toast from "react-hot-toast"
import ProductReviews from "@/components/product/product-reviews"

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("details")
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [hoveredImage, setHoveredImage] = useState(null)

  const { authUser, openAuthModal } = useAuthStore()
  const { addToCart } = useCartStore()
  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useWishlistStore()

  const fetchProduct = async () => {
    try {
      const res = await axiosInstance.get(`/products/${id}`)
      setProduct(res.data)

      if (
        res.data.variants?.length > 0 &&
        !selectedVariant
      ) {
        setSelectedVariant(res.data.variants[0].name)
      }

      setCurrentImageIndex(0)
      setHoveredImage(null)
    } catch (error) {
      console.error("Error fetching product:", error)
      toast.error("Failed to load product details")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProduct()
  }, [id])

  // Automatic image slider
  useEffect(() => {
    if (!product?.images?.length || isHovered) return

    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prev) => (prev + 1) % product.images.length
      )
    }, 10000)

    return () => clearInterval(interval)
  }, [product, isHovered])

  // Reset gallery when variant changes
  useEffect(() => {
    setCurrentImageIndex(0)
    setHoveredImage(null)
  }, [selectedVariant])

  const nextSlide = () => {
    if (!product?.images?.length) return

    setCurrentImageIndex(
      (prev) => (prev + 1) % product.images.length
    )
  }

  const prevSlide = () => {
    if (!product?.images?.length) return

    setCurrentImageIndex(
      (prev) =>
        (prev - 1 + product.images.length) %
        product.images.length
    )
  }

  const handleAddToCart = () => {
    if (!authUser) {
      openAuthModal({ type: "cart" })
      return
    }

    addToCart(product._id, quantity, selectedVariant)
  }

  const handleWishlistToggle = () => {
    if (!authUser) {
      openAuthModal({ type: "wishlist" })
      return
    }

    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id)
    } else {
      addToWishlist(product._id)
    }
  }

  const handleBuyNow = async () => {
    if (!authUser) {
      openAuthModal({ type: "login" })
      return
    }

    await addToCart(product._id, quantity, selectedVariant)
    navigate("/cart")
  }

  const wishlistActive = product
    ? isInWishlist(product._id)
    : false

  const selectedVariantData = product?.variants?.find(
    (variant) => variant.name === selectedVariant
  )

  const displayedImage =
    hoveredImage ||
    product?.images?.[currentImageIndex] ||
    (selectedVariantData?.image || "/placeholder.svg")

  const tabs = [
    { id: "details", label: "Product Details" },
    { id: "ingredients", label: "Ingredients" },
    { id: "reviews", label: "Reviews" },
  ]

  // Loading state
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f6f0]">
        <div className="flex flex-col items-center gap-4">
          <Loader className="h-8 w-8 animate-spin text-[#294b40]" />
          <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#879188]">
            Preparing your experience
          </p>
        </div>
      </main>
    )
  }

  // Product not found
  if (!product) {
    return (
      <main className="flex min-h-screen flex-col bg-[#f8f6f0]">
        <Header />

        <div className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
          <Sparkles className="mb-5 h-8 w-8 text-[#718477]" />

          <h1 className="font-editorial text-5xl text-[#172b27]">
            Product Not Found
          </h1>

          <p className="mt-4 text-sm text-[#879188]">
            The product you're looking for may no longer be available.
          </p>

          <button
            onClick={() => navigate("/products")}
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#172b27] px-7 py-3.5 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-[#294b40]"
          >
            Explore Products
            <ArrowRight size={15} />
          </button>
        </div>

        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f8f6f0] font-sans text-[#172b27]">
      <Header />

      {/* Product breadcrumb */}
      <div className="mx-auto max-w-[1440px] px-5 pt-7 sm:px-8 lg:px-14">
        <button
          onClick={() => navigate("/products")}
          className="group inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#879188] transition-colors hover:text-[#172b27]"
        >
          <ArrowLeft
            size={14}
            className="transition-transform group-hover:-translate-x-1"
          />
          Back to Collection
        </button>
      </div>

      {/* Main product section */}
      <section className="mx-auto max-w-[1440px] px-5 pb-16 pt-8 sm:px-8 sm:pt-12 lg:px-14 lg:pb-24">

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-20 xl:gap-24">

          {/* Product Gallery */}
          <div className="min-w-0">

            <div
              className="group relative aspect-[4/4.5] overflow-hidden bg-[#efeee7]"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Main image */}
              <AnimatePresence mode="wait">
                <motion.img
                  key={displayedImage}
                  src={displayedImage}
                  alt={product.name}
                  initial={{ opacity: 0.5, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="absolute inset-0 h-full w-full object-contain p-8 sm:p-12"
                />
              </AnimatePresence>

              {/* Category label */}
              <div className="absolute left-5 top-5 z-10">
                <span className="bg-[#f8f6f0]/90 px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#294b40] backdrop-blur-sm">
                  {product.category}
                </span>
              </div>

              {/* Wishlist */}
              <button
                onClick={handleWishlistToggle}
                aria-label="Toggle wishlist"
                className={`absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 ${wishlistActive
                    ? "border-[#294b40] bg-[#294b40] text-white"
                    : "border-[#dfe4dc] bg-[#f8f6f0]/90 text-[#294b40] hover:bg-[#294b40] hover:text-white"
                  }`}
              >
                <Heart
                  size={18}
                  className={wishlistActive ? "fill-current" : ""}
                />
              </button>

              {/* Gallery arrows */}
              {product.images?.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    aria-label="Previous image"
                    className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-[#f8f6f0]/80 text-[#172b27] opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-[#172b27] hover:text-white group-hover:opacity-100 max-sm:opacity-100"
                  >
                    <ChevronLeft size={19} />
                  </button>

                  <button
                    onClick={nextSlide}
                    aria-label="Next image"
                    className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-[#f8f6f0]/80 text-[#172b27] opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-[#172b27] hover:text-white group-hover:opacity-100 max-sm:opacity-100"
                  >
                    <ChevronRight size={19} />
                  </button>
                </>
              )}

              {/* Image counter */}
              {product.images?.length > 1 && (
                <div className="absolute bottom-5 right-5 text-[10px] font-medium tracking-widest text-[#718477]">
                  {String(currentImageIndex + 1).padStart(2, "0")}
                  {" / "}
                  {String(product.images.length).padStart(2, "0")}
                </div>
              )}
            </div>

            {/* Thumbnail gallery */}
            {product.images?.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onMouseEnter={() => setHoveredImage(img)}
                    onMouseLeave={() => setHoveredImage(null)}
                    onClick={() => setCurrentImageIndex(idx)}
                    aria-label={`View product image ${idx + 1}`}
                    className={`relative aspect-square overflow-hidden bg-[#efeee7] transition-all duration-300 ${currentImageIndex === idx
                        ? "ring-1 ring-[#294b40] ring-offset-2 ring-offset-[#f8f6f0]"
                        : "opacity-65 hover:opacity-100"
                      }`}
                  >
                    <img
                      src={img || "/placeholder.svg"}
                      alt={`${product.name} ${idx + 1}`}
                      className="h-full w-full object-contain p-2"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Gallery note */}
            <div className="mt-6 flex items-center justify-between border-t border-[#e7eae3] pt-5">
              <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#879188]">
                Belief Cosmetics
              </p>

              <p className="text-[9px] uppercase tracking-[0.15em] text-[#879188]">
                Thoughtfully considered
              </p>
            </div>
          </div>

          {/* Product Information */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="flex flex-col justify-center"
          >
            <div className="mb-7">
              <div className="mb-5 flex items-center gap-3">
                <span className="h-px w-8 bg-[#718477]" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#718477]">
                  {product.category || "Skincare"}
                </span>
              </div>

              <h1 className="font-editorial text-5xl leading-[1.05] tracking-[-0.04em] text-[#172b27] sm:text-6xl xl:text-7xl">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1 text-[#718477]">
                  <span className="text-base">★</span>
                  <span className="text-sm font-semibold">
                    {product.rating
                      ? product.rating.toFixed(1)
                      : "New"}
                  </span>
                </div>

                <span className="h-3 w-px bg-[#dfe4dc]" />

                <span className="text-xs text-[#879188]">
                  {product.reviews || 0} Reviews
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="border-y border-[#e7eae3] py-6">
              <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#879188]">
                Price
              </p>

              <div className="flex items-baseline gap-3">
                <span className="font-editorial text-4xl text-[#172b27] sm:text-5xl">
                  ₹{product.price}
                </span>

                {product.discountPrice != null &&
                  Number(product.discountPrice) > 0 && (
                    <span className="text-sm text-[#879188] line-through">
                      ₹{product.price}
                    </span>
                  )}
              </div>
            </div>

            {/* Allergy tags */}
            {product.allergyLabels?.length > 0 && (
              <div className="flex flex-wrap gap-2 py-6">
                {product.allergyLabels.map((tag) => (
                  <span
                    key={tag}
                    className="border border-[#dfe4dc] px-3 py-2 text-[9px] font-medium uppercase tracking-[0.12em] text-[#718477]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            <div className="pb-7">
              <p className="text-sm leading-8 text-[#718078]">
                {product.description}
              </p>
            </div>

            {/* Variants */}
            {product.variants?.length > 0 && (
              <div className="mb-7">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#294b40]">
                    Select Variant
                  </h3>

                  <span className="text-xs text-[#879188]">
                    {selectedVariant}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant._id || variant.name}
                      type="button"
                      onClick={() =>
                        setSelectedVariant(variant.name)
                      }
                      className={`inline-flex items-center gap-2 border px-5 py-3 text-xs transition-all duration-300 ${selectedVariant === variant.name
                          ? "border-[#294b40] bg-[#294b40] text-white"
                          : "border-[#dfe4dc] bg-transparent text-[#718477] hover:border-[#294b40] hover:text-[#294b40]"
                        }`}
                    >
                      {selectedVariant === variant.name && (
                        <Check size={13} />
                      )}
                      {variant.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Skin type */}
            {product.skinType?.length > 0 && (
              <div className="mb-6">
                <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#294b40]">
                  Best For
                </h3>

                <div className="flex flex-wrap gap-2">
                  {product.skinType.map((type) => (
                    <span
                      key={type}
                      className="bg-[#edf0e9] px-4 py-2 text-xs text-[#52685b]"
                    >
                      {type} Skin
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Skin concerns */}
            {product.skinConcerns?.length > 0 && (
              <div className="mb-8">
                <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#294b40]">
                  Addresses
                </h3>

                <div className="flex flex-wrap gap-2">
                  {product.skinConcerns.map((concern) => (
                    <span
                      key={concern}
                      className="border border-[#dfe4dc] px-4 py-2 text-xs text-[#718477]"
                    >
                      {concern}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity selector */}
            <div className="mb-6 flex items-center justify-between border-y border-[#e7eae3] py-5">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#294b40]">
                Quantity
              </span>

              <div className="flex items-center border border-[#dfe4dc]">
                <button
                  type="button"
                  onClick={() =>
                    setQuantity(Math.max(1, quantity - 1))
                  }
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                  className="flex h-10 w-10 items-center justify-center text-[#718477] transition-colors hover:bg-[#edf0e9] disabled:opacity-40"
                >
                  <Minus size={14} />
                </button>

                <span className="min-w-10 text-center text-sm font-medium tabular-nums text-[#172b27]">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase quantity"
                  className="flex h-10 w-10 items-center justify-center text-[#718477] transition-colors hover:bg-[#edf0e9]"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Purchase actions */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">

              <button
                onClick={handleAddToCart}
                className="group flex min-h-[54px] items-center justify-center gap-3 bg-[#172b27] px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:bg-[#294b40]"
              >
                <ShoppingBag size={17} />
                Add to Bag
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>

              <button
                onClick={handleWishlistToggle}
                aria-label="Toggle wishlist"
                className={`flex h-[54px] items-center justify-center gap-2 border px-6 transition-all duration-300 ${wishlistActive
                    ? "border-[#294b40] bg-[#294b40] text-white"
                    : "border-[#dfe4dc] text-[#294b40] hover:border-[#294b40] hover:bg-[#edf0e9]"
                  }`}
              >
                <Heart
                  size={18}
                  className={wishlistActive ? "fill-current" : ""}
                />
                <span className="text-[10px] font-semibold uppercase tracking-widest sm:hidden">
                  Wishlist
                </span>
              </button>
            </div>

            <button
              onClick={handleBuyNow}
              className="mt-3 flex min-h-[54px] w-full items-center justify-center gap-3 border border-[#294b40] bg-transparent px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#294b40] transition-all duration-300 hover:bg-[#294b40] hover:text-white"
            >
              <CreditCard size={17} />
              Buy Now
            </button>

            {/* Share control */}
            <button
              type="button"
              className="mt-5 inline-flex items-center gap-2 self-start text-[10px] font-semibold uppercase tracking-[0.16em] text-[#879188] transition-colors hover:text-[#294b40]"
            >
              <Share2 size={14} />
              Share Product
            </button>
          </motion.div>
        </div>
      </section>

      {/* Product information tabs */}
      <section className="border-t border-[#e7eae3] bg-[#f3f2eb]">
        <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 lg:px-14 lg:py-20">

          {/* Section heading */}
          <div className="mb-10">
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#718477]">
              Discover More
            </p>

            <h2 className="font-editorial text-4xl tracking-[-0.03em] text-[#172b27] sm:text-5xl">
              The Details Matter.
            </h2>
          </div>

          {/* Tabs navigation */}
          <div className="flex gap-7 overflow-x-auto border-b border-[#dfe4dc] sm:gap-12">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative shrink-0 pb-5 text-[10px] font-semibold uppercase tracking-[0.17em] transition-colors ${activeTab === tab.id
                    ? "text-[#294b40]"
                    : "text-[#9aa49a] hover:text-[#294b40]"
                  }`}
              >
                {tab.label}

                {activeTab === tab.id && (
                  <motion.span
                    layoutId="product-tab-indicator"
                    className="absolute bottom-0 left-0 h-[2px] w-full bg-[#294b40]"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="min-h-[190px] py-9">

            <AnimatePresence mode="wait">
              {activeTab === "details" && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="max-w-3xl"
                >
                  <h3 className="mb-4 font-editorial text-3xl text-[#172b27]">
                    How to Use
                  </h3>

                  <p className="text-sm leading-8 text-[#718078]">
                    {product.howToUse || "Apply as needed."}
                  </p>
                </motion.div>
              )}

              {activeTab === "ingredients" && (
                <motion.div
                  key="ingredients"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  <h3 className="mb-6 font-editorial text-3xl text-[#172b27]">
                    Key Ingredients
                  </h3>

                  {product.ingredients?.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                      {product.ingredients.map((ingredient) => (
                        <div
                          key={ingredient}
                          className="flex items-center gap-3 border border-[#dfe4dc] bg-[#f8f6f0] px-5 py-4"
                        >
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#edf0e9]">
                            <Sparkles
                              size={13}
                              className="text-[#718477]"
                            />
                          </span>

                          <span className="text-sm text-[#52685b]">
                            {ingredient}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-[#879188]">
                      Ingredient information is not available.
                    </p>
                  )}
                </motion.div>
              )}

              {activeTab === "reviews" && (
                <motion.div
                  key="reviews"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  <ProductReviews
                    productId={product._id}
                    productRating={product.rating}
                    totalReviews={product.reviews}
                    onReviewAdded={fetchProduct}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
