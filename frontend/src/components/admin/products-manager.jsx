
"use client"

import { useState } from "react"
import {
  Edit2,
  Trash2,
  Plus,
  Upload,
  RefreshCw,
  Search,
  ArrowUpDown,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import axiosInstance from "../../lib/axios"
import toast from "react-hot-toast"

export default function ProductsManager({
  products,
  setProducts,
  page,
  setPage,
  totalPages,
  totalProducts,
  search,
  setSearch,
  sortBy,
  setSortBy,
  order,
  setOrder,
}) {
  const navigate = useNavigate()
  const [cleaning, setCleaning] = useState(false)

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await axiosInstance.delete(`/products/${id}`)
        setProducts(products.filter((p) => p._id !== id))
        toast.success("Product deleted successfully")
      } catch (error) {
        console.error("Error deleting product:", error)
        toast.error("Failed to delete product")
      }
    }
  }

  const handleCleanup = async () => {
    setCleaning(true)

    try {
      const res = await axiosInstance.post("/products/cleanup-duplicates")

      if (res.data.deletedCount > 0) {
        toast.success(
          `Cleaned up ${res.data.deletedCount} duplicate products`
        )
        window.location.reload()
      } else {
        toast.success("No duplicate products found")
      }
    } catch (error) {
      console.error("Cleanup error:", error)
      toast.error("Failed to cleanup duplicates")
    } finally {
      setCleaning(false)
    }
  }

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
    setPage(1)
  }

  const handleSortChange = (e) => {
    setSortBy(e.target.value)
    setPage(1)
  }

  const toggleOrder = () => {
    setOrder((prev) => (prev === "asc" ? "desc" : "asc"))
    setPage(1)
  }

  const getStockStyle = (stock) => {
    if (stock > 30) {
      return "bg-[#eaf0e9] text-[#294b40] border-[#d5e2d4]"
    }

    if (stock > 10) {
      return "bg-[#f5f0df] text-[#8a7139] border-[#e9dfbd]"
    }

    return "bg-[#f5e9e5] text-[#a35c4c] border-[#ead4cd]"
  }

  return (
    <div className="min-h-full bg-[#f8f6f0] p-4 sm:p-6 lg:p-8">

      {/* Page Heading */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mb-8 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between"
      >
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#879188]">
            Inventory Management
          </p>

          <div className="flex flex-wrap items-baseline gap-3">
            <h1 className="font-editorial text-4xl font-medium tracking-tight text-[#172b27] sm:text-5xl">
              Products
            </h1>

            <span className="text-sm text-[#879188]">
              {totalProducts} total
            </span>
          </div>

          <p className="mt-2 text-sm text-[#718477]">
            Manage your product collection and inventory.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleCleanup}
            disabled={cleaning}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#dfe4dc] bg-white px-4 py-2.5 text-xs font-medium text-[#294b40] transition-all duration-300 hover:border-[#294b40] hover:bg-[#f1f3ed] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={15}
              className={cleaning ? "animate-spin" : ""}
            />
            {cleaning ? "Cleaning..." : "Cleanup"}
          </button>

          <button
            onClick={() => navigate("/admin/bulk-products")}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#dfe4dc] bg-white px-4 py-2.5 text-xs font-medium text-[#294b40] transition-all duration-300 hover:border-[#294b40] hover:bg-[#f1f3ed]"
          >
            <Upload size={15} />
            Bulk Upload
          </button>

          <button
            onClick={() => navigate("/admin/add-product")}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#172b27] px-5 py-2.5 text-xs font-medium text-white transition-all duration-300 hover:bg-[#294b40] hover:shadow-lg hover:shadow-[#172b27]/10"
          >
            <Plus size={16} />
            Add Product
          </button>
        </div>
      </motion.div>

      {/* Search and Sorting */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08 }}
        className="mb-6 rounded-2xl border border-[#e7eae3] bg-white p-4 sm:p-5"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          {/* Search */}
          <div className="relative w-full lg:max-w-md">
            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#879188]"
            />

            <input
              type="text"
              placeholder="Search products by name..."
              value={search}
              onChange={handleSearchChange}
              className="w-full rounded-full border border-[#e7eae3] bg-[#fafaf7] py-3 pl-11 pr-4 text-sm text-[#172b27] outline-none transition-all placeholder:text-[#a2aaa2] focus:border-[#718477] focus:bg-white focus:ring-4 focus:ring-[#718477]/10"
            />
          </div>

          {/* Sort */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#879188]">
              Sort by
            </span>

            <select
              value={sortBy}
              onChange={handleSortChange}
              className="min-w-[140px] rounded-full border border-[#e7eae3] bg-[#fafaf7] px-4 py-3 text-xs font-medium text-[#294b40] outline-none transition-all hover:border-[#718477] focus:border-[#718477]"
            >
              <option value="createdAt">Date Added</option>
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="stock">Stock</option>
            </select>

            <button
              onClick={toggleOrder}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#e7eae3] bg-[#fafaf7] px-4 py-3 text-xs font-medium text-[#294b40] transition-all hover:border-[#718477] hover:bg-[#f1f3ed]"
            >
              <ArrowUpDown size={14} />
              {order === "asc" ? "Ascending" : "Descending"}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Products Table */}
      {products.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center rounded-2xl border border-[#e7eae3] bg-white px-6 py-20 text-center"
        >
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#f1f3ed] text-[#718477]">
            <Package size={27} strokeWidth={1.4} />
          </div>

          <h3 className="font-editorial text-2xl text-[#172b27]">
            No products found
          </h3>

          <p className="mt-2 max-w-sm text-sm text-[#879188]">
            There are currently no products to display.
          </p>

          <button
            onClick={() => navigate("/admin/add-product")}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#172b27] px-6 py-3 text-xs font-medium text-white transition-all hover:bg-[#294b40]"
          >
            <Plus size={15} />
            Add Your First Product
          </button>
        </motion.div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.14 }}
            className="mb-6 overflow-hidden rounded-2xl border border-[#e7eae3] bg-white"
          >
            <div className="flex items-center justify-between border-b border-[#e7eae3] px-5 py-4 sm:px-6">
              <div>
                <h2 className="font-editorial text-xl text-[#172b27]">
                  Product Collection
                </h2>
                <p className="mt-0.5 text-[11px] text-[#879188]">
                  Your current inventory
                </p>
              </div>

              <span className="rounded-full bg-[#f1f3ed] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#526b5b]">
                {products.length} items
              </span>
            </div>

            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead>
                  <tr className="border-b border-[#e7eae3] bg-[#fafaf7]">
                    <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#879188]">
                      Image
                    </th>
                    <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#879188]">
                      Product
                    </th>
                    <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#879188]">
                      Category
                    </th>
                    <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#879188]">
                      Price
                    </th>
                    <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#879188]">
                      Stock
                    </th>
                    <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#879188]">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <AnimatePresence mode="popLayout">
                    {products.map((product, idx) => (
                      <motion.tr
                        key={product._id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{
                          duration: 0.25,
                          delay: Math.min(idx * 0.035, 0.25),
                        }}
                        className="border-b border-[#edf0ea] last:border-0 transition-colors hover:bg-[#fafaf7]"
                      >
                        {/* Image */}
                        <td className="px-6 py-4">
                          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border border-[#e7eae3] bg-[#f8f6f0]">
                            <img
                              src={product.images?.[0] || "/placeholder.svg"}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </td>

                        {/* Product Name */}
                        <td className="px-6 py-4">
                          <p className="max-w-[220px] truncate text-sm font-medium text-[#172b27]">
                            {product.name}
                          </p>
                          <p className="mt-1 text-[10px] text-[#a0a89f]">
                            Product ID: {product._id?.slice(-6)}
                          </p>
                        </td>

                        {/* Category */}
                        <td className="px-6 py-4">
                          <span className="inline-flex rounded-full bg-[#f1f3ed] px-3 py-1.5 text-[10px] font-medium text-[#526b5b]">
                            {product.category}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold tabular-nums text-[#172b27]">
                            ₹{product.price}
                          </span>
                        </td>

                        {/* Stock */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center rounded-full border px-3 py-1.5 text-[10px] font-semibold ${getStockStyle(
                              product.stock
                            )}`}
                          >
                            {product.stock} units
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                navigate(`/admin/edit-product/${product._id}`)
                              }
                              title="Edit Product"
                              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e7eae3] text-[#526b5b] transition-all hover:border-[#294b40] hover:bg-[#172b27] hover:text-white"
                            >
                              <Edit2 size={15} />
                            </button>

                            <button
                              onClick={() => handleDelete(product._id)}
                              title="Delete Product"
                              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e7eae3] text-[#a35c4c] transition-all hover:border-[#a35c4c] hover:bg-[#a35c4c] hover:text-white"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Pagination */}
          <div className="flex flex-col gap-4 rounded-2xl border border-[#e7eae3] bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-xs text-[#879188]">
              Page{" "}
              <span className="font-semibold text-[#294b40]">{page}</span>
              {" "}of{" "}
              <span className="font-semibold text-[#294b40]">
                {totalPages}
              </span>
            </p>

            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="inline-flex items-center gap-2 rounded-full border border-[#e7eae3] px-4 py-2.5 text-xs font-medium text-[#526b5b] transition-all hover:border-[#294b40] hover:bg-[#f1f3ed] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={15} />
                Previous
              </button>

              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="inline-flex items-center gap-2 rounded-full bg-[#172b27] px-4 py-2.5 text-xs font-medium text-white transition-all hover:bg-[#294b40] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
