
import { useState, useEffect } from "react"
import axiosInstance from "@/lib/axios"
import toast from "react-hot-toast"
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Instagram,
  Facebook,
  Twitter,
  ArrowUpRight,
} from "lucide-react"
import { useAuthStore } from "@/store/useAuthStore"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

export default function ContactPage() {
  const { authUser } = useAuthStore()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (authUser) {
      setFormData((prev) => ({
        ...prev,
        name: authUser.name || "",
        email: authUser.email || "",
      }))
    }
  }, [authUser])

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await axiosInstance.post("/contact", formData)

      toast.success("Message sent successfully!")

      setFormData({
        name: authUser?.name || "",
        email: authUser?.email || "",
        subject: "",
        message: "",
      })
    } catch (error) {
      console.error("Error sending message:", error)
      toast.error(
        error.response?.data?.message || "Failed to send message"
      )
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    "w-full border-b border-[#dfe4dc] bg-transparent px-0 py-3.5 text-sm text-[#172b27] placeholder:text-[#a0aaa2] outline-none transition-colors duration-300 focus:border-[#294b40]"

  const labelClass =
    "mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#718477]"

  const socialLinks = [
    { Icon: Instagram, label: "Instagram" },
    { Icon: Facebook, label: "Facebook" },
    { Icon: Twitter, label: "Twitter" },
  ]

  return (
    <div className="min-h-screen bg-[#f8f6f0] font-sans text-[#172b27]">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="px-5 pb-14 pt-20 md:px-10 md:pb-20 md:pt-28">
          <div className="mx-auto max-w-7xl text-center">
            <div className="mb-6 flex items-center justify-center gap-4">
              <span className="h-px w-8 bg-[#718477]" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#718477]">
                Contact Belief
              </span>

              <span className="h-px w-8 bg-[#718477]" />
            </div>

            <h1 className="font-editorial text-5xl font-normal leading-[1.05] tracking-tight text-[#172b27] md:text-7xl">
              Let's start a{" "}
              <span className="italic text-[#718477]">
                conversation.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-[#879188] md:text-base">
              We're always happy to hear from you. Whether you have a
              question, feedback, or need assistance, our team is here
              to help.
            </p>
          </div>
        </section>

        {/* Contact Content */}
        <section className="px-5 pb-20 md:px-10 md:pb-28">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">

            {/* Contact Information */}
            <aside className="lg:col-span-4">
              <div className="border-t border-[#dfe4dc] pt-7">
                <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#718477]">
                  Get in touch
                </span>

                <h2 className="mt-5 font-editorial text-4xl font-normal leading-tight text-[#172b27] md:text-5xl">
                  We'd love to{" "}
                  <span className="italic text-[#718477]">
                    hear from you.
                  </span>
                </h2>

                <p className="mt-5 max-w-sm text-sm leading-7 text-[#879188]">
                  Have questions about our products or need help with
                  something? Reach out to us through any of the
                  following channels.
                </p>
              </div>

              {/* Contact Details */}
              <div className="mt-12">

                {/* Email */}
                <div className="flex items-start gap-5 border-b border-[#dfe4dc] py-7 first:border-t">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#dfe4dc] text-[#294b40]">
                    <Mail size={18} strokeWidth={1.4} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#718477]">
                      Email us
                    </p>

                    <a
                      href="mailto:korplz1408@gmail.com"
                      className="mt-2 block break-all text-sm text-[#172b27] transition-colors hover:text-[#718477]"
                    >
                      OfficialBeliefCosmetics.com
                    </a>

                    <p className="mt-2 text-xs text-[#879188]">
                      Our friendly team is here to help.
                    </p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-5 border-b border-[#dfe4dc] py-7">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#dfe4dc] text-[#294b40]">
                    <MapPin size={18} strokeWidth={1.4} />
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#718477]">
                      Visit us
                    </p>

                    <p className="mt-2 text-sm leading-6 text-[#172b27]">
                      Ganpat Bazar, Bhaderwah, J&K
                    </p>

                    <p className="mt-2 text-xs text-[#879188]">
                      Come say hello at our store.
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-5 border-b border-[#dfe4dc] py-7">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#dfe4dc] text-[#294b40]">
                    <Phone size={18} strokeWidth={1.4} />
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#718477]">
                      Call us
                    </p>

                    <a
                      href="tel:+918130610431"
                      className="mt-2 block text-sm text-[#172b27] transition-colors hover:text-[#718477]"
                    >
                      +91 8130610431
                    </a>

                    <p className="mt-2 text-xs text-[#879188]">
                      Monday – Friday: 9AM – 6PM
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-9">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#718477]">
                  Follow us
                </p>

                <div className="mt-5 flex gap-3">
                  {socialLinks.map(({ Icon, label }) => (
                    <a
                      key={label}
                      href="#"
                      aria-label={label}
                      className="flex h-10 w-10 items-center justify-center border border-[#dfe4dc] text-[#294b40] transition-all duration-300 hover:border-[#172b27] hover:bg-[#172b27] hover:text-[#f8f6f0]"
                    >
                      <Icon size={17} strokeWidth={1.5} />
                    </a>
                  ))}
                </div>
              </div>
            </aside>

            {/* Contact Form */}
            <div className="lg:col-span-8">
              <div className="border border-[#dfe4dc] bg-white/50 p-6 sm:p-9 md:p-12">

                {/* Form Heading */}
                <div className="mb-10 border-b border-[#dfe4dc] pb-8">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#718477]">
                    Your message matters
                  </span>

                  <h2 className="mt-3 font-editorial text-3xl font-normal text-[#172b27] md:text-4xl">
                    Send us a message
                  </h2>

                  <p className="mt-3 text-xs leading-6 text-[#879188]">
                    Fill in your details and tell us how we can help.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-9">

                  {/* Name and Email */}
                  <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className={labelClass}>
                        Full name *
                      </label>

                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        disabled={!!authUser}
                        className={`${inputClass} ${authUser
                            ? "cursor-not-allowed opacity-60"
                            : ""
                          }`}
                        placeholder="Your full name"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className={labelClass}>
                        Email address *
                      </label>

                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!!authUser}
                        className={`${inputClass} ${authUser
                            ? "cursor-not-allowed opacity-60"
                            : ""
                          }`}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className={labelClass}>
                      Subject
                    </label>

                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="How can we help you?"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className={labelClass}>
                      Your message *
                    </label>

                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      className={`${inputClass} resize-y`}
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="group flex w-full items-center justify-between bg-[#172b27] px-6 py-4 text-[#f8f6f0] transition-colors duration-300 hover:bg-[#294b40] disabled:cursor-not-allowed disabled:opacity-60 sm:w-[260px]"
                    >
                      <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">
                        {loading ? "Sending..." : "Send Message"}
                      </span>

                      {loading ? (
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#f8f6f0] border-t-transparent" />
                      ) : (
                        <ArrowUpRight
                          size={19}
                          strokeWidth={1.5}
                          className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                        />
                      )}
                    </button>

                    <p className="mt-5 text-[10px] leading-5 text-[#879188]">
                      Thank you for reaching out to Belief Cosmetics.
                      We look forward to connecting with you.
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
