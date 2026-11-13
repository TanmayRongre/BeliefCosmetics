
import { useState, useMemo } from "react"
import {
    ArrowLeft,
    Check,
    AlertTriangle,
    Star,
    Droplets,
    Sparkles,
    Sun,
    Waves,
    SprayCan,
    ShieldAlert,
    ShoppingBag,
    Smile,
    Lightbulb,
    Leaf,
    FlaskConical,
    ArrowRight,
} from "lucide-react"
import { Link } from "react-router-dom"

import { useCartStore } from "@/store/useCartStore"
import { useAuthStore } from "@/store/useAuthStore"

const PRODUCT_CATEGORIES = [
    "Face Wash",
    "Bath Salt",
    "Ubtan",
    "Soap",
    "Gel",
    "Fragrance Balm",
]

const SKIN_IMAGES = {
    Oily: "/OilySkin.jpg",
    Dry: "/DrySkin.jpg",
    Combination: "/combinationskin.jpg",
    Normal: "/normalSkin.jpg",
    Sensitive: "/sensitveSkin.jpg",
}

const ICON_MAP = {
    Droplets,
    Spray: SprayCan,
    Sparkles,
    Waves,
    Sun,
    Smile,
}

function getProductCategory(category) {
    const value = (category || "").toLowerCase()

    return (
        PRODUCT_CATEGORIES.find((item) =>
            value.includes(item.toLowerCase())
        ) ||
        category ||
        "Other"
    )
}

function sortCategories(categories) {
    return [...categories].sort((a, b) => {
        const indexA = PRODUCT_CATEGORIES.indexOf(a)
        const indexB = PRODUCT_CATEGORIES.indexOf(b)

        if (indexA !== -1 && indexB !== -1) return indexA - indexB
        if (indexA !== -1) return -1
        if (indexB !== -1) return 1

        return a.localeCompare(b)
    })
}

function SectionHeading({ icon: Icon, children, description }) {
    return (
        <div className="mb-6">
            <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center border border-[#dfe4dc] bg-white text-[#294b40]">
                    <Icon size={17} strokeWidth={1.5} />
                </div>

                <h2 className="font-editorial text-2xl text-[#172b27] sm:text-3xl">
                    {children}
                </h2>
            </div>

            {description && (
                <p className="mt-2 pl-12 font-sans text-xs leading-6 text-[#879188]">
                    {description}
                </p>
            )}
        </div>
    )
}

function Tag({ children, highlighted = false }) {
    return (
        <span
            className={`inline-flex items-center border px-3 py-1.5 font-sans text-[10px] tracking-wide ${highlighted
                    ? "border-[#dce6db] bg-[#e9eee7] text-[#294b40]"
                    : "border-[#dfe4dc] bg-white text-[#718477]"
                }`}
        >
            {children}
        </span>
    )
}

export default function RecommendedProducts({
    analysis,
    onReset,
    isEmbedded = false,
}) {
    const { addToCart } = useCartStore()
    const { authUser, openAuthModal } = useAuthStore()

    const [activeCategory, setActiveCategory] = useState("All")

    const recommendations = analysis?.recommendations || []

    const groupedProducts = useMemo(() => {
        const groups = {}

        recommendations.forEach((product) => {
            const category = getProductCategory(product.category)

            if (!groups[category]) {
                groups[category] = []
            }

            groups[category].push(product)
        })

        return groups
    }, [recommendations])

    const availableCategories = useMemo(() => {
        return sortCategories(Object.keys(groupedProducts))
    }, [groupedProducts])

    if (!analysis) return null

    const { profile, analysisResult } = analysis

    const { insights, routine, skinTypeInfo } = analysisResult || {}

    // Backward compatibility
    if (!analysisResult) {
        return (
            <div className="flex min-h-[400px] items-center justify-center bg-[#f8f6f0] px-6">
                <div className="max-w-md text-center">
                    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#e9eee7] text-[#294b40]">
                        <AlertTriangle size={23} strokeWidth={1.5} />
                    </div>

                    <h2 className="font-editorial text-3xl text-[#172b27]">
                        Updated Analysis Required
                    </h2>

                    <p className="mt-3 font-sans text-sm leading-6 text-[#879188]">
                        Please retake the skin assessment to view your detailed
                        results and personalized skincare recommendations.
                    </p>

                    <button
                        type="button"
                        onClick={onReset}
                        className="mt-6 inline-flex items-center gap-2 bg-[#172b27] px-6 py-3 font-sans text-[10px] uppercase tracking-[0.16em] text-[#f8f6f0] transition-colors hover:bg-[#294b40]"
                    >
                        <ArrowLeft size={15} />
                        Retake Assessment
                    </button>
                </div>
            </div>
        )
    }

    const skinImage = SKIN_IMAGES[profile?.skinType] || SKIN_IMAGES.Normal

    const filteredCategories =
        activeCategory === "All"
            ? availableCategories
            : availableCategories.filter(
                (category) => category === activeCategory
            )

    const handleAddToCart = (e, product) => {
        e.preventDefault()
        e.stopPropagation()

        if (!authUser) {
            openAuthModal({ type: "login" })
            return
        }

        addToCart(product._id, 1)
    }

    return (
        <div
            className={`min-h-screen ${isEmbedded
                    ? "bg-transparent pb-0"
                    : "bg-[#f8f6f0] pb-20"
                }`}
        >
            {/* 01 — Skin Profile */}
            <section
                className={
                    isEmbedded
                        ? "px-0 pb-8 pt-0"
                        : "border-b border-[#e7eae3] bg-[#f1f2ec] px-4 py-10 sm:py-14"
                }
            >
                <div
                    className={`mx-auto ${isEmbedded ? "max-w-full" : "max-w-6xl"
                        }`}
                >
                    {!isEmbedded && (
                        <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                            <div>
                                <p className="mb-2 font-sans text-[9px] uppercase tracking-[0.25em] text-[#718477]">
                                    Your personal skincare journey
                                </p>

                                <h1 className="font-editorial text-4xl text-[#172b27] sm:text-5xl">
                                    Your Skin Profile
                                </h1>
                            </div>

                            {profile?._id && (
                                <span className="font-sans text-[10px] tracking-[0.15em] text-[#879188]">
                                    PROFILE #{profile._id.slice(-6).toUpperCase()}
                                </span>
                            )}
                        </div>
                    )}

                    <div className="overflow-hidden border border-[#e7eae3] bg-white">
                        <div className="grid grid-cols-1 md:grid-cols-[0.85fr_1.5fr]">
                            {/* Skin image */}
                            <div className="relative min-h-[260px] overflow-hidden bg-[#e9eee7] sm:min-h-[340px] md:min-h-[410px]">
                                <img
                                    src={skinImage}
                                    alt={`${profile?.skinType || "Normal"} Skin`}
                                    className="absolute inset-0 h-full w-full object-cover"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-[#172b27]/65 via-transparent to-transparent" />

                                <div className="absolute bottom-6 left-6 right-6">
                                    <p className="mb-2 font-sans text-[9px] uppercase tracking-[0.25em] text-white/70">
                                        Your skin type
                                    </p>

                                    <h2 className="font-editorial text-4xl text-white sm:text-5xl">
                                        {profile?.skinType || "Normal"} Skin
                                    </h2>
                                </div>
                            </div>

                            {/* Profile details */}
                            <div className="flex flex-col justify-center p-6 sm:p-9 md:p-10">
                                <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <p className="font-sans text-[9px] uppercase tracking-[0.22em] text-[#718477]">
                                            Analysis result
                                        </p>

                                        <h3 className="mt-2 font-editorial text-3xl text-[#172b27]">
                                            Understanding Your Skin
                                        </h3>
                                    </div>

                                    <div
                                        className={`inline-flex items-center gap-2 border px-3 py-2 ${profile?.skinType === "Sensitive" ||
                                                profile?.history?.reactions
                                                ? "border-amber-200 bg-amber-50 text-amber-700"
                                                : "border-[#dce6db] bg-[#e9eee7] text-[#294b40]"
                                            }`}
                                    >
                                        {profile?.skinType === "Sensitive" ||
                                            profile?.history?.reactions ? (
                                            <>
                                                <AlertTriangle size={13} />
                                                <span className="font-sans text-[9px] uppercase tracking-wider">
                                                    Sensitive
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <Check size={13} />
                                                <span className="font-sans text-[9px] uppercase tracking-wider">
                                                    Resilient
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {skinTypeInfo?.description && (
                                    <p className="mb-6 max-w-xl font-sans text-sm leading-7 text-[#718477]">
                                        {skinTypeInfo.description}
                                    </p>
                                )}

                                {skinTypeInfo?.careFocus && (
                                    <div className="mb-7 flex items-start gap-3 border-l-2 border-[#718477] bg-[#f1f2ec] px-4 py-3">
                                        <Sparkles
                                            size={16}
                                            className="mt-0.5 shrink-0 text-[#718477]"
                                        />

                                        <div>
                                            <p className="font-sans text-[9px] uppercase tracking-[0.18em] text-[#879188]">
                                                Your skincare focus
                                            </p>

                                            <p className="mt-1 font-editorial text-xl text-[#172b27]">
                                                {skinTypeInfo.careFocus}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <p className="mb-3 font-sans text-[9px] uppercase tracking-[0.2em] text-[#879188]">
                                        Primary concerns
                                    </p>

                                    <div className="flex flex-wrap gap-2">
                                        {profile?.concerns?.length > 0 ? (
                                            profile.concerns.map((concern) => (
                                                <Tag key={concern}>{concern}</Tag>
                                            ))
                                        ) : (
                                            <span className="font-sans text-xs text-[#879188]">
                                                No specific concerns listed.
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main results */}
            <div
                className={`mx-auto space-y-12 ${isEmbedded
                        ? "max-w-full px-0 py-7"
                        : "max-w-6xl px-4 py-12 sm:py-16"
                    }`}
            >
                {/* 02 — Key Insights */}
                {insights?.length > 0 && (
                    <section>
                        <SectionHeading
                            icon={Lightbulb}
                            description="Important observations from your skin assessment."
                        >
                            Key Insights
                        </SectionHeading>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            {insights.slice(0, 3).map((insight, index) => (
                                <div
                                    key={index}
                                    className="group border border-[#e7eae3] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#b9c8b8] hover:shadow-md"
                                >
                                    <div className="mb-5 flex h-9 w-9 items-center justify-center border border-[#dfe4dc] bg-[#f1f2ec] font-editorial text-xl text-[#294b40]">
                                        {String(index + 1).padStart(2, "0")}
                                    </div>

                                    <p className="font-sans text-sm leading-7 text-[#718477]">
                                        {insight}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* 03 — Suggested Routine */}
                {routine?.length > 0 && (
                    <section>
                        <SectionHeading
                            icon={Droplets}
                            description="A suggested skincare routine based on your profile."
                        >
                            Your Suggested Routine
                        </SectionHeading>

                        <div className="space-y-3">
                            {routine.map((step, index) => {
                                const Icon = ICON_MAP[step.icon] || Star

                                return (
                                    <div
                                        key={index}
                                        className="grid grid-cols-1 gap-4 border border-[#e7eae3] bg-white p-5 transition-colors duration-300 hover:border-[#c6d2c4] sm:grid-cols-[190px_1fr_auto] sm:items-center sm:gap-6 sm:p-6"
                                    >
                                        {/* Step details */}
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-[#dfe4dc] bg-[#f1f2ec] text-[#294b40]">
                                                <Icon size={20} strokeWidth={1.4} />
                                            </div>

                                            <div>
                                                <p className="mb-1 font-sans text-[9px] uppercase tracking-[0.18em] text-[#879188]">
                                                    Step {String(index + 1).padStart(2, "0")}
                                                </p>

                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="font-editorial text-xl text-[#172b27]">
                                                        {step.step}
                                                    </h3>

                                                    {step.frequency &&
                                                        ["Optional", "Occasional"].includes(
                                                            step.frequency
                                                        ) && (
                                                            <span className="border border-[#dfe4dc] bg-[#f1f2ec] px-2 py-1 font-sans text-[8px] uppercase tracking-wider text-[#718477]">
                                                                {step.frequency}
                                                            </span>
                                                        )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Product or advice */}
                                        <div className="min-w-0">
                                            {step.product ? (
                                                <Link
                                                    to={`/products/${step.product._id}`}
                                                    className="group/product flex items-center gap-4"
                                                >
                                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center border border-[#e7eae3] bg-[#f1f2ec] p-2">
                                                        <img
                                                            src={
                                                                step.product.images?.[0] ||
                                                                "/placeholder.svg"
                                                            }
                                                            alt={step.product.name}
                                                            className="h-full w-full object-contain"
                                                        />
                                                    </div>

                                                    <div>
                                                        <p className="mb-1 font-sans text-[8px] uppercase tracking-[0.18em] text-[#879188]">
                                                            Recommended product
                                                        </p>

                                                        <p className="font-sans text-sm font-medium text-[#172b27] transition-colors group-hover/product:text-[#718477]">
                                                            {step.product.name}
                                                        </p>
                                                    </div>

                                                    <ArrowRight
                                                        size={15}
                                                        className="ml-auto shrink-0 text-[#879188] transition-transform group-hover/product:translate-x-1"
                                                    />
                                                </Link>
                                            ) : (
                                                <p className="font-sans text-xs leading-6 text-[#718477]">
                                                    {step.genericAdvice}
                                                </p>
                                            )}
                                        </div>

                                        {/* Add to cart */}
                                        {step.product && (
                                            <button
                                                type="button"
                                                onClick={(e) =>
                                                    handleAddToCart(e, step.product)
                                                }
                                                aria-label={`Add ${step.product.name} to cart`}
                                                title="Add to Cart"
                                                className="flex h-11 w-full items-center justify-center gap-2 bg-[#172b27] px-5 font-sans text-[9px] uppercase tracking-[0.15em] text-[#f8f6f0] transition-colors hover:bg-[#294b40] sm:w-auto"
                                            >
                                                <ShoppingBag size={15} />
                                                <span className="sm:hidden">Add to Bag</span>
                                            </button>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </section>
                )}

                {/* 04 — Top Recommendations */}
                <section>
                    <div className="mb-7">
                        <SectionHeading
                            icon={ShoppingBag}
                            description="Explore products selected according to your skin profile and concerns."
                        >
                            Recommended For You
                        </SectionHeading>
                    </div>

                    {/* Category filters */}
                    <div className="mb-8 border-b border-[#dfe4dc]">
                        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
                            {["All", ...availableCategories].map((category) => (
                                <button
                                    key={category}
                                    type="button"
                                    onClick={() => setActiveCategory(category)}
                                    className={`shrink-0 border px-5 py-2.5 font-sans text-[9px] uppercase tracking-[0.13em] transition-all duration-300 ${activeCategory === category
                                            ? "border-[#172b27] bg-[#172b27] text-[#f8f6f0]"
                                            : "border-[#dfe4dc] bg-white text-[#718477] hover:border-[#172b27] hover:text-[#172b27]"
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product groups */}
                    {filteredCategories.length === 0 ? (
                        <div className="border border-[#e7eae3] bg-white px-6 py-16 text-center">
                            <ShoppingBag
                                size={27}
                                strokeWidth={1.3}
                                className="mx-auto mb-4 text-[#718477]"
                            />

                            <h3 className="font-editorial text-2xl text-[#172b27]">
                                No Products Found
                            </h3>

                            <p className="mt-2 font-sans text-xs text-[#879188]">
                                No products are currently available in this category.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-12">
                            {filteredCategories.map((category) => (
                                <div key={category}>
                                    <div className="mb-5 flex items-center justify-between">
                                        <div>
                                            <p className="mb-1 font-sans text-[8px] uppercase tracking-[0.22em] text-[#879188]">
                                                Explore collection
                                            </p>

                                            <h3 className="font-editorial text-2xl text-[#172b27] sm:text-3xl">
                                                {category}
                                            </h3>
                                        </div>

                                        <span className="font-sans text-[10px] text-[#879188]">
                                            {groupedProducts[category].length} Products
                                        </span>
                                    </div>

                                    {/* Horizontal product slider */}
                                    <div className="-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-5 scrollbar-hide">
                                        {groupedProducts[category].map((product) => (
                                            <div
                                                key={product._id}
                                                className="w-[255px] min-w-[255px] snap-start sm:w-[285px] sm:min-w-[285px]"
                                            >
                                                <Link
                                                    to={`/products/${product._id}`}
                                                    className="group flex h-full flex-col overflow-hidden border border-[#e7eae3] bg-white transition-all duration-500 hover:-translate-y-1 hover:border-[#c6d2c4] hover:shadow-lg"
                                                >
                                                    {/* Product image */}
                                                    <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden bg-[#f1f2ec] p-7">
                                                        {product.matchScore && (
                                                            <div className="absolute right-3 top-3 z-10 flex items-center gap-1.5 border border-[#dfe4dc] bg-[#f8f6f0]/95 px-3 py-1.5">
                                                                <Sparkles
                                                                    size={11}
                                                                    className="text-[#718477]"
                                                                />

                                                                <span className="font-sans text-[9px] font-medium text-[#294b40]">
                                                                    {product.matchScore}% Match
                                                                </span>
                                                            </div>
                                                        )}

                                                        <img
                                                            src={
                                                                product.images?.[0] ||
                                                                "/placeholder.svg"
                                                            }
                                                            alt={product.name}
                                                            className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-110"
                                                        />

                                                        <div className="absolute bottom-3 left-3">
                                                            <span className="bg-[#f8f6f0]/90 px-3 py-1.5 font-sans text-[8px] uppercase tracking-[0.15em] text-[#718477]">
                                                                {product.category || "Skincare"}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Product information */}
                                                    <div className="flex flex-1 flex-col p-4 sm:p-5">
                                                        <p className="mb-2 font-sans text-[8px] uppercase tracking-[0.18em] text-[#879188]">
                                                            Belief Cosmetics
                                                        </p>

                                                        <h4 className="mb-2 line-clamp-1 font-editorial text-xl text-[#172b27] transition-colors group-hover:text-[#718477]">
                                                            {product.name}
                                                        </h4>

                                                        <div className="mb-4 min-h-[28px]">
                                                            {product.matchReasons &&
                                                                product.matchReasons.length > 0 && (
                                                                    <p className="line-clamp-2 font-sans text-[10px] leading-5 text-[#879188]">
                                                                        Suitable for your {profile?.skinType} skin
                                                                    </p>
                                                                )}
                                                        </div>

                                                        <div className="mt-auto flex items-center justify-between border-t border-[#e7eae3] pt-4">
                                                            <span className="font-sans text-lg font-medium text-[#172b27]">
                                                                ₹{product.price}
                                                            </span>

                                                            <button
                                                                type="button"
                                                                onClick={(e) =>
                                                                    handleAddToCart(e, product)
                                                                }
                                                                aria-label={`Add ${product.name} to cart`}
                                                                title="Add to Cart"
                                                                className="flex h-10 w-10 items-center justify-center bg-[#172b27] text-[#f8f6f0] transition-all duration-300 hover:bg-[#294b40]"
                                                            >
                                                                <ShoppingBag
                                                                    size={16}
                                                                    strokeWidth={1.5}
                                                                />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* 05 — Retake Assessment */}
                <section className="border-t border-[#dfe4dc] pt-10">
                    <div className="mx-auto max-w-xl text-center">
                        <div className="mb-4 flex justify-center">
                            <div className="flex h-11 w-11 items-center justify-center border border-[#dfe4dc] bg-white text-[#718477]">
                                <FlaskConical size={19} strokeWidth={1.4} />
                            </div>
                        </div>

                        <h2 className="font-editorial text-3xl text-[#172b27]">
                            Your Skin, Your Journey
                        </h2>

                        <p className="mt-2 font-sans text-xs leading-6 text-[#879188]">
                            Your skincare needs can change over time. Revisit your
                            assessment whenever you want to review your profile.
                        </p>

                        <button
                            type="button"
                            onClick={onReset}
                            className="mt-7 inline-flex items-center gap-3 border border-[#172b27] bg-transparent px-7 py-3.5 font-sans text-[9px] uppercase tracking-[0.17em] text-[#172b27] transition-all duration-300 hover:bg-[#172b27] hover:text-[#f8f6f0]"
                        >
                            <ArrowLeft size={14} />
                            Retake Analysis
                        </button>
                    </div>
                </section>
            </div>
        </div>
    )
}
