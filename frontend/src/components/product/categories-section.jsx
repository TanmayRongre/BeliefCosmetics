
import { useState, useEffect } from "react"
import {
  Layers3,
  Package,
  Plus,
  ArrowUpRight,
  CheckCircle2,
  CircleDashed,
} from "lucide-react"
import axiosInstance from "../../lib/axios"

export default function CategoriesSection() {
  const [categories, setCategories] = useState([
    { id: 1, name: "Face Wash", productCount: 0, status: "Active" },
    { id: 2, name: "Bath Salt", productCount: 0, status: "Active" },
    { id: 3, name: "Ubtan", productCount: 0, status: "Active" },
    { id: 4, name: "Soap", productCount: 0, status: "Active" },
    { id: 5, name: "Gel", productCount: 0, status: "Active" },
    { id: 6, name: "Fragrance Balm", productCount: 0, status: "Active" },
  ])

  useEffect(() => {
    let isMounted = true

    const fetchCategoryCounts = async () => {
      try {
        const res = await axiosInstance.get("/products/categories")

        if (isMounted && Array.isArray(res.data)) {
          const mapped = res.data.map((cat, idx) => ({
            id: cat.productId || idx + 1,
            name: cat.name,
            productCount: cat.count || 0,
            status: cat.count > 0 ? "Active" : "Empty",
          }))

          setCategories(mapped)
        }
      } catch (err) {
        console.error("Error fetching categories:", err)
      }
    }

    fetchCategoryCounts()

    return () => {
      isMounted = false
    }
  }, [])

  const totalProducts = categories.reduce(
    (total, category) => total + category.productCount,
    0
  )

  const activeCategories = categories.filter(
    (category) => category.status === "Active"
  ).length

  return (
    <div className="min-h-full bg-[#f8f6f0] p-5 font-sans sm:p-8 lg:p-10">

      {/* Page Header */}
      <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Layers3 size={14} className="text-[#718477]" />
            <span className="text-[10px] uppercase tracking-[0.24em] text-[#718477]">
              Store Management
            </span>
          </div>

          <h1 className="font-editorial text-4xl text-[#172b27] sm:text-5xl">
            Categories
          </h1>

          <p className="mt-2 text-sm text-[#879188]">
            Manage and monitor your product categories.
          </p>
        </div>

        <button
          type="button"
          className="flex h-11 items-center justify-center gap-2 self-start bg-[#172b27] px-5 text-[10px] uppercase tracking-[0.16em] text-[#f8f6f0] transition-colors hover:bg-[#294b40] sm:self-auto"
        >
          <Plus size={15} strokeWidth={1.7} />
          Add Category
        </button>
      </div>

      {/* Overview Cards */}
      <div className="mb-9 grid grid-cols-1 gap-4 sm:grid-cols-3">

        <div className="flex h-[120px] items-center justify-between border border-[#e7eae3] bg-white p-5">
          <div>
            <p className="mb-3 text-[9px] uppercase tracking-[0.18em] text-[#879188]">
              Total Categories
            </p>

            <h2 className="font-editorial text-3xl text-[#172b27]">
              {categories.length}
            </h2>
          </div>

          <div className="flex h-11 w-11 items-center justify-center bg-[#f1f2ec] text-[#718477]">
            <Layers3 size={20} strokeWidth={1.4} />
          </div>
        </div>

        <div className="flex h-[120px] items-center justify-between border border-[#e7eae3] bg-white p-5">
          <div>
            <p className="mb-3 text-[9px] uppercase tracking-[0.18em] text-[#879188]">
              Total Products
            </p>

            <h2 className="font-editorial text-3xl text-[#172b27]">
              {totalProducts}
            </h2>
          </div>

          <div className="flex h-11 w-11 items-center justify-center bg-[#f1f2ec] text-[#718477]">
            <Package size={20} strokeWidth={1.4} />
          </div>
        </div>

        <div className="flex h-[120px] items-center justify-between border border-[#e7eae3] bg-white p-5">
          <div>
            <p className="mb-3 text-[9px] uppercase tracking-[0.18em] text-[#879188]">
              Active Categories
            </p>

            <h2 className="font-editorial text-3xl text-[#172b27]">
              {activeCategories}
            </h2>
          </div>

          <div className="flex h-11 w-11 items-center justify-center bg-[#e9eee7] text-[#294b40]">
            <CheckCircle2 size={20} strokeWidth={1.4} />
          </div>
        </div>

      </div>

      {/* Categories Section Heading */}
      <div className="mb-5 flex items-center justify-between border-b border-[#dfe4dc] pb-4">
        <div>
          <h2 className="font-editorial text-2xl text-[#172b27]">
            All Categories
          </h2>

          <p className="mt-1 text-[11px] text-[#879188]">
            {categories.length} categories in your store
          </p>
        </div>

        <span className="text-[9px] uppercase tracking-[0.18em] text-[#718477]">
          Category Overview
        </span>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((category, index) => (
          <div
            key={category.id}
            className="group flex h-[225px] flex-col border border-[#e7eae3] bg-white p-6 transition-all duration-300 hover:border-[#b9c5b8] hover:shadow-[0_8px_25px_rgba(23,43,39,0.05)]"
          >
            {/* Card Top */}
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center bg-[#f1f2ec] text-[#718477] transition-colors duration-300 group-hover:bg-[#172b27] group-hover:text-white">
                <Layers3 size={19} strokeWidth={1.4} />
              </div>

              <span className="font-editorial text-lg text-[#c5ccc2]">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            {/* Category Details */}
            <div className="mt-5">
              <h3 className="line-clamp-1 font-editorial text-[25px] leading-tight text-[#172b27]">
                {category.name}
              </h3>

              <div className="mt-2 flex items-center gap-2">
                <span className="font-editorial text-3xl text-[#294b40]">
                  {category.productCount}
                </span>

                <span className="font-sans text-[10px] uppercase tracking-[0.13em] text-[#879188]">
                  Products
                </span>
              </div>
            </div>

            {/* Card Footer */}
            <div className="mt-auto flex items-center justify-between border-t border-[#edf0e9] pt-4">
              <span
                className={`flex items-center gap-2 text-[9px] uppercase tracking-[0.14em] ${category.status === "Active"
                    ? "text-[#52745e]"
                    : "text-[#a0a69d]"
                  }`}
              >
                {category.status === "Active" ? (
                  <CheckCircle2 size={13} />
                ) : (
                  <CircleDashed size={13} />
                )}

                {category.status}
              </span>

              <button
                type="button"
                className="flex items-center gap-2 text-[10px] uppercase tracking-[0.13em] text-[#718477] transition-colors hover:text-[#172b27]"
              >
                Edit
                <ArrowUpRight size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {categories.length === 0 && (
        <div className="flex min-h-[250px] flex-col items-center justify-center border border-dashed border-[#dfe4dc] text-center">
          <Layers3 size={30} className="mb-4 text-[#aab5a8]" />

          <h3 className="font-editorial text-2xl text-[#172b27]">
            No Categories Found
          </h3>

          <p className="mt-2 text-xs text-[#879188]">
            Your product categories will appear here.
          </p>
        </div>
      )}
    </div>
  )
}
