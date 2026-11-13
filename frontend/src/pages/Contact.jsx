
import { useState } from "react"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import {
  Mail,
  Phone,
  Instagram,
  Linkedin,
  Twitter,
  Facebook,
  ArrowUpRight,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (
      formData.phone &&
      !/^\d{10,}$/.test(formData.phone.replace(/\D/g, ""))
    ) {
      newErrors.phone = "Please enter a valid phone number"
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Please select a subject"
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required"
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Existing simulated submission behavior
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Message Sent Successfully!",
        description:
          "Thank you for reaching out. We will get back to you soon.",
      })

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClass = (field) =>
    `w-full rounded-none border-b bg-transparent px-0 py-3.5 text-sm text-[#172b27] placeholder:text-[#a0aaa2] outline-none transition-colors duration-300 focus:border-[#294b40] ${errors[field] ? "border-red-500" : "border-[#dfe4dc]"
    }`

  const labelClass =
    "mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#718477]"

  const socialLinks = [
    { Icon: Instagram, label: "Instagram" },
    { Icon: Linkedin, label: "LinkedIn" },
    { Icon: Twitter, label: "Twitter" },
    { Icon: Facebook, label: "Facebook" },
  ]

  return (
    <div className="min-h-screen bg-[#f8f6f0] font-sans text-[#172b27]">
      <Header />

      <main>
        {/* Page Introduction */}
        <section className="px-5 pb-14 pt-20 md:px-10 md:pb-20 md:pt-28">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex items-center justify-center gap-4">
              <span className="h-px w-8 bg-[#718477]" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#718477]">
                Contact Belief
              </span>
              <span className="h-px w-8 bg-[#718477]" />
            </div>

            <h1 className="font-editorial text-center text-5xl font-normal leading-[1.05] tracking-tight text-[#172b27] md:text-7xl">
              We're here to{" "}
              <span className="italic text-[#718477]">listen.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-lg text-center text-sm leading-7 text-[#879188] md:text-base">
              Questions, feedback, or simply want to say hello?
              We'd love to hear from you.
            </p>
          </div>
        </section>

        {/* Contact Layout */}
        <section className="px-5 pb-20 md:px-10 md:pb-28">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">

            {/* Contact Details */}
            <aside className="order-2 lg:order-1 lg:col-span-4">
              <div className="border-t border-[#dfe4dc] pt-7">
                <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#718477]">
                  Get in touch
                </span>

                <h2 className="mt-5 font-editorial text-4xl font-normal leading-tight text-[#172b27] md:text-5xl">
                  A little conversation can make a{" "}
                  <span className="italic text-[#718477]">difference.</span>
                </h2>

                <p className="mt-5 max-w-sm text-sm leading-7 text-[#879188]">
                  Reach out to our team for product inquiries, feedback,
                  collaborations, or support. We're always glad to help.
                </p>
              </div>

              {/* Email */}
              <div className="mt-12 border-b border-[#dfe4dc] pb-7">
                <div className="flex items-start gap-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#dfe4dc] text-[#294b40]">
                    <Mail size={18} strokeWidth={1.4} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#718477]">
                      Email
                    </p>
                    <a
                      href="mailto:info@beliefcosmetics.com"
                      className="mt-2 block break-all text-sm text-[#172b27] transition-colors hover:text-[#718477]"
                    >
                      info@beliefcosmetics.com
                    </a>
                    <p className="mt-2 text-xs text-[#879188]">
                      24-hour response
                    </p>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="border-b border-[#dfe4dc] py-7">
                <div className="flex items-start gap-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#dfe4dc] text-[#294b40]">
                    <Phone size={18} strokeWidth={1.4} />
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#718477]">
                      Phone
                    </p>
                    <p className="mt-2 text-sm text-[#172b27]">
                      +91 800-BEAUTY-1
                    </p>
                    <p className="mt-2 text-xs text-[#879188]">
                      Mon–Fri, 9AM–6PM IST
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="pt-8">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#718477]">
                  Follow us
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  {socialLinks.map(({ Icon, label }) => (
                    <a
                      key={label}
                      href="#"
                      aria-label={label}
                      className="flex h-10 w-10 items-center justify-center border border-[#dfe4dc] text-[#294b40] transition-all duration-300 hover:border-[#172b27] hover:bg-[#172b27] hover:text-[#f8f6f0]"
                    >
                      <Icon size={16} strokeWidth={1.5} />
                    </a>
                  ))}
                </div>
              </div>
            </aside>

            {/* Contact Form */}
            <div className="order-1 lg:order-2 lg:col-span-8">
              <form
                onSubmit={handleSubmit}
                noValidate
                className="border border-[#dfe4dc] bg-white/50 p-6 sm:p-9 md:p-12"
              >
                <div className="mb-10 border-b border-[#dfe4dc] pb-7">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#718477]">
                    We'd love to hear from you
                  </span>

                  <h2 className="mt-3 font-editorial text-3xl font-normal text-[#172b27] md:text-4xl">
                    Send us a message
                  </h2>

                  <p className="mt-3 text-xs leading-6 text-[#879188]">
                    Complete the form below and share what's on your mind.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2">
                  {/* Name */}
                  <div>
                    <label htmlFor="contact-name" className={labelClass}>
                      Full name *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={inputClass("name")}
                      placeholder="Your full name"
                    />
                    {errors.name && (
                      <p className="mt-2 text-xs text-red-600">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="contact-email" className={labelClass}>
                      Email address *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={inputClass("email")}
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="mt-2 text-xs text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="contact-phone" className={labelClass}>
                      Phone number
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={inputClass("phone")}
                      placeholder="Your phone number"
                    />
                    {errors.phone && (
                      <p className="mt-2 text-xs text-red-600">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="contact-subject" className={labelClass}>
                      Subject *
                    </label>
                    <select
                      id="contact-subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`${inputClass("subject")} cursor-pointer`}
                    >
                      <option value="">Select a subject</option>
                      <option value="product-inquiry">Product Inquiry</option>
                      <option value="feedback">Feedback</option>
                      <option value="collaboration">Collaboration</option>
                      <option value="support">Support</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.subject && (
                      <p className="mt-2 text-xs text-red-600">
                        {errors.subject}
                      </p>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div className="mt-9">
                  <label htmlFor="contact-message" className={labelClass}>
                    Your message *
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className={`${inputClass("message")} resize-y`}
                    placeholder="Write your message here..."
                  />
                  {errors.message && (
                    <p className="mt-2 text-xs text-red-600">
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group mt-10 flex w-full items-center justify-between bg-[#172b27] px-6 py-4 text-[#f8f6f0] transition-colors duration-300 hover:bg-[#294b40] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="text-[10px] font-semibold uppercase tracking-[0.22em]">
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </span>

                  <ArrowUpRight
                    size={19}
                    strokeWidth={1.5}
                    className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                  />
                </button>

                <p className="mt-5 text-center text-[10px] leading-5 text-[#879188]">
                  Thank you for getting in touch with Belief Cosmetics.
                </p>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
