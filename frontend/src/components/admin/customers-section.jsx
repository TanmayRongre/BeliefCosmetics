
import { useState } from "react"
import {
  Search,
  Mail,
  Phone,
  Calendar,
  Users,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function CustomersSection({ customers = [] }) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCustomers = customers.filter((customer) => {
    const name = customer.name || ""
    const email = customer.email || ""
    const search = searchTerm.toLowerCase()

    return (
      name.toLowerCase().includes(search) ||
      email.toLowerCase().includes(search)
    )
  })

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  return (
    <div className="min-h-full bg-[#f8f6f0] p-4 sm:p-6 lg:p-8">

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"
      >
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#879188]">
            Customer Management
          </p>

          <div className="flex items-baseline gap-3">
            <h1 className="font-editorial text-4xl font-medium tracking-tight text-[#172b27] sm:text-5xl">
              Customers
            </h1>

            <span className="rounded-full bg-[#e9eee7] px-3 py-1 text-xs font-medium text-[#526b5b]">
              {customers.length}
            </span>
          </div>

          <p className="mt-2 text-sm text-[#718477]">
            Manage and view your customer base.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:max-w-[320px]">
          <Search
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#879188]"
          />

          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-full border border-[#e7eae3] bg-white py-3 pl-11 pr-4 text-sm text-[#172b27] outline-none transition-all placeholder:text-[#a2aaa2] focus:border-[#718477] focus:ring-4 focus:ring-[#718477]/10"
          />
        </div>
      </motion.div>

      {/* Customers Table */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08 }}
        className="overflow-hidden rounded-2xl border border-[#e7eae3] bg-white"
      >
        {/* Table Header */}
        <div className="flex items-center justify-between border-b border-[#e7eae3] px-5 py-4 sm:px-6">
          <div>
            <h2 className="font-editorial text-xl text-[#172b27]">
              Customer Directory
            </h2>

            <p className="mt-0.5 text-[11px] text-[#879188]">
              Your registered customer information
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f1f3ed] text-[#526b5b]">
            <Users size={18} strokeWidth={1.6} />
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead>
              <tr className="border-b border-[#e7eae3] bg-[#fafaf7]">
                <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#879188]">
                  Customer
                </th>

                <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#879188]">
                  Contact Information
                </th>

                <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#879188]">
                  Joined Date
                </th>

                <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#879188]">
                  Role
                </th>
              </tr>
            </thead>

            <tbody>
              <AnimatePresence mode="popLayout">
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer, idx) => (
                    <motion.tr
                      key={customer._id}
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
                      {/* Customer */}
                      <td className="whitespace-nowrap px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#dce5da] bg-[#eaf0e9] font-editorial text-xl text-[#294b40]">
                            {(customer.name || "?")
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <p className="text-sm font-medium text-[#172b27]">
                              {customer.name}
                            </p>

                            <p className="mt-1 text-[10px] text-[#a0a89f]">
                              ID: {customer._id?.slice(-6)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Contact Information */}
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2 text-xs text-[#526b5b]">
                            <Mail
                              size={14}
                              className="shrink-0 text-[#879188]"
                            />

                            <span className="max-w-[220px] truncate">
                              {customer.email}
                            </span>
                          </div>

                          {customer.phone && (
                            <div className="flex items-center gap-2 text-xs text-[#718477]">
                              <Phone
                                size={14}
                                className="shrink-0 text-[#879188]"
                              />

                              <span>{customer.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Joined Date */}
                      <td className="whitespace-nowrap px-6 py-5">
                        <div className="flex items-center gap-2 text-xs text-[#718477]">
                          <Calendar
                            size={14}
                            className="text-[#879188]"
                          />

                          {formatDate(customer.createdAt)}
                        </div>
                      </td>

                      {/* Role */}
                      <td className="whitespace-nowrap px-6 py-5">
                        <span className="inline-flex rounded-full border border-[#dce5da] bg-[#eaf0e9] px-3 py-1.5 text-[10px] font-semibold capitalize tracking-wide text-[#526b5b]">
                          {customer.role}
                        </span>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <motion.tr
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan={4} className="px-6 py-20">
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#f1f3ed] text-[#718477]">
                          <Search
                            size={26}
                            strokeWidth={1.5}
                          />
                        </div>

                        <h3 className="font-editorial text-2xl text-[#172b27]">
                          No customers found
                        </h3>

                        <p className="mt-2 max-w-sm text-sm text-[#879188]">
                          Try adjusting your search terms to find a
                          customer.
                        </p>
                      </div>
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-1 border-t border-[#e7eae3] bg-[#fafaf7] px-5 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-[11px] text-[#879188]">
            Showing{" "}
            <span className="font-semibold text-[#526b5b]">
              {filteredCustomers.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-[#526b5b]">
              {customers.length}
            </span>{" "}
            customers
          </p>

          <p className="text-[10px] uppercase tracking-[0.15em] text-[#a2aaa2]">
            Belief Cosmetics · Admin
          </p>
        </div>
      </motion.div>
    </div>
  )
}
