
"use client"

import { useState, useEffect } from "react"
import axiosInstance from "@/lib/axios"
import toast from "react-hot-toast"
import {
  Trash2,
  Search,
  Mail,
  Loader,
  Eye,
  X,
  MessageSquare,
  ArrowUpRight,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function AdminContactMessages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMessage, setSelectedMessage] = useState(null)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const res = await axiosInstance.get(
        "/contact/admin/contact-messages"
      )
      setMessages(res.data)
    } catch (error) {
      console.error("Error fetching messages:", error)
      toast.error("Failed to fetch messages")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (
      !window.confirm("Are you sure you want to delete this message?")
    ) return

    try {
      await axiosInstance.delete(
        `/contact/admin/contact-messages/${id}`
      )

      setMessages((prev) =>
        prev.filter((msg) => msg._id !== id)
      )

      toast.success("Message deleted successfully")

      if (selectedMessage?._id === id) {
        setSelectedMessage(null)
      }
    } catch (error) {
      console.error("Error deleting message:", error)
      toast.error("Failed to delete message")
    }
  }

  const filteredMessages = messages.filter((msg) => {
    const name = msg.name || ""
    const email = msg.email || ""
    const subject = msg.subject || ""

    const search = searchTerm.toLowerCase()

    return (
      name.toLowerCase().includes(search) ||
      email.toLowerCase().includes(search) ||
      subject.toLowerCase().includes(search)
    )
  })

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatFullDate = (date) => {
    return new Date(date).toLocaleString("en-US", {
      dateStyle: "full",
      timeStyle: "short",
    })
  }

  if (loading) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center bg-[#f8f6f0]">
        <div className="flex flex-col items-center gap-4">
          <Loader
            size={28}
            className="animate-spin text-[#294b40]"
          />
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#879188]">
            Loading messages
          </p>
        </div>
      </div>
    )
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
            Customer Communication
          </p>

          <div className="flex items-baseline gap-3">
            <h1 className="font-editorial text-4xl font-medium tracking-tight text-[#172b27] sm:text-5xl">
              Messages
            </h1>

            <span className="rounded-full bg-[#e9eee7] px-3 py-1 text-xs font-medium text-[#526b5b]">
              {messages.length}
            </span>
          </div>

          <p className="mt-2 text-sm text-[#718477]">
            Manage inquiries from your customers.
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
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-full border border-[#e7eae3] bg-white py-3 pl-11 pr-4 text-sm text-[#172b27] outline-none transition-all placeholder:text-[#a2aaa2] focus:border-[#718477] focus:ring-4 focus:ring-[#718477]/10"
          />
        </div>
      </motion.div>

      {/* Messages Container */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08 }}
        className="overflow-hidden rounded-2xl border border-[#e7eae3] bg-white"
      >
        {/* Table Heading */}
        <div className="flex items-center justify-between border-b border-[#e7eae3] px-5 py-4 sm:px-6">
          <div>
            <h2 className="font-editorial text-xl text-[#172b27]">
              Customer Inquiries
            </h2>
            <p className="mt-0.5 text-[11px] text-[#879188]">
              Messages received through your website
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f1f3ed] text-[#526b5b]">
            <Mail size={17} strokeWidth={1.6} />
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead>
              <tr className="border-b border-[#e7eae3] bg-[#fafaf7]">
                <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#879188]">
                  Sender
                </th>

                <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#879188]">
                  Subject
                </th>

                <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#879188]">
                  Message Preview
                </th>

                <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#879188]">
                  Date
                </th>

                <th className="px-6 py-4 text-right text-[10px] font-semibold uppercase tracking-[0.16em] text-[#879188]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              <AnimatePresence mode="popLayout">
                {filteredMessages.length === 0 ? (
                  <motion.tr
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan={5} className="px-6 py-20">
                      <div className="flex flex-col items-center text-center">
                        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#f1f3ed] text-[#718477]">
                          <MessageSquare
                            size={27}
                            strokeWidth={1.4}
                          />
                        </div>

                        <h3 className="font-editorial text-2xl text-[#172b27]">
                          No messages found
                        </h3>

                        <p className="mt-2 max-w-sm text-sm text-[#879188]">
                          We couldn't find any messages matching your
                          search.
                        </p>
                      </div>
                    </td>
                  </motion.tr>
                ) : (
                  filteredMessages.map((msg, idx) => (
                    <motion.tr
                      key={msg._id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{
                        duration: 0.25,
                        delay: Math.min(idx * 0.035, 0.25),
                      }}
                      className="group border-b border-[#edf0ea] last:border-0 transition-colors hover:bg-[#fafaf7]"
                    >
                      {/* Sender */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eaf0e9] font-editorial text-lg text-[#294b40]">
                            {(msg.name || "?").charAt(0).toUpperCase()}
                          </div>

                          <div className="min-w-0">
                            <p className="max-w-[170px] truncate text-sm font-medium text-[#172b27]">
                              {msg.name}
                            </p>

                            <a
                              href={`mailto:${msg.email}`}
                              className="mt-1 block max-w-[190px] truncate text-xs text-[#879188] transition-colors hover:text-[#294b40]"
                            >
                              {msg.email}
                            </a>
                          </div>
                        </div>
                      </td>

                      {/* Subject */}
                      <td className="px-6 py-5">
                        <span className="inline-flex max-w-[170px] truncate rounded-full bg-[#f1f3ed] px-3 py-1.5 text-[10px] font-medium text-[#526b5b]">
                          {msg.subject || "No Subject"}
                        </span>
                      </td>

                      {/* Preview */}
                      <td className="px-6 py-5">
                        <p className="max-w-[230px] truncate text-xs leading-relaxed text-[#718477]">
                          {msg.message}
                        </p>
                      </td>

                      {/* Date */}
                      <td className="whitespace-nowrap px-6 py-5">
                        <span className="text-xs text-[#879188]">
                          {formatDate(msg.createdAt)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="whitespace-nowrap px-6 py-5">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedMessage(msg)}
                            title="View Details"
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e7eae3] text-[#526b5b] transition-all hover:border-[#294b40] hover:bg-[#172b27] hover:text-white"
                          >
                            <Eye size={15} />
                          </button>

                          <button
                            onClick={() => handleDelete(msg._id)}
                            title="Delete Message"
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e7eae3] text-[#a35c4c] transition-all hover:border-[#a35c4c] hover:bg-[#a35c4c] hover:text-white"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="flex flex-col gap-1 border-t border-[#e7eae3] bg-[#fafaf7] px-5 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-[11px] text-[#879188]">
            Showing{" "}
            <span className="font-semibold text-[#526b5b]">
              {filteredMessages.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-[#526b5b]">
              {messages.length}
            </span>{" "}
            messages
          </p>

          <p className="text-[10px] uppercase tracking-[0.15em] text-[#a2aaa2]">
            Belief Cosmetics · Admin
          </p>
        </div>
      </motion.div>

      {/* Message Details Modal */}
      <AnimatePresence>
        {selectedMessage && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#101a16]/50 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMessage(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="message-modal-title"
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl overflow-hidden rounded-2xl border border-[#e7eae3] bg-[#fdfcf8] shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-[#e7eae3] px-6 py-5 sm:px-8">
                <div>
                  <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#879188]">
                    Customer Communication
                  </p>

                  <h3
                    id="message-modal-title"
                    className="font-editorial text-2xl text-[#172b27]"
                  >
                    Message Details
                  </h3>
                </div>

                <button
                  onClick={() => setSelectedMessage(null)}
                  aria-label="Close message details"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e7eae3] text-[#718477] transition-all hover:bg-[#172b27] hover:text-white"
                >
                  <X size={17} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="max-h-[70vh] space-y-7 overflow-y-auto px-6 py-7 sm:px-8">

                {/* Sender Information */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.18em] text-[#879188]">
                      Sender
                    </label>

                    <p className="text-sm font-medium text-[#172b27]">
                      {selectedMessage.name}
                    </p>

                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="mt-1 inline-flex items-center gap-1 text-xs text-[#526b5b] transition-colors hover:text-[#172b27]"
                    >
                      {selectedMessage.email}
                      <ArrowUpRight size={12} />
                    </a>
                  </div>

                  <div>
                    <label className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.18em] text-[#879188]">
                      Received
                    </label>

                    <p className="text-sm leading-relaxed text-[#294b40]">
                      {formatFullDate(selectedMessage.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="h-px bg-[#e7eae3]" />

                {/* Subject */}
                <div>
                  <label className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.18em] text-[#879188]">
                    Subject
                  </label>

                  <h4 className="font-editorial text-2xl text-[#172b27]">
                    {selectedMessage.subject || "No Subject"}
                  </h4>
                </div>

                {/* Message */}
                <div className="rounded-xl border border-[#e7eae3] bg-white p-5 sm:p-6">
                  <label className="mb-3 block text-[9px] font-semibold uppercase tracking-[0.18em] text-[#879188]">
                    Message
                  </label>

                  <p className="whitespace-pre-wrap text-sm leading-7 text-[#526b5b]">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end border-t border-[#e7eae3] bg-[#fafaf7] px-6 py-4 sm:px-8">
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="rounded-full bg-[#172b27] px-7 py-3 text-xs font-medium text-white transition-all hover:bg-[#294b40]"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
