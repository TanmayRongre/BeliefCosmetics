
import { useState } from "react";
import {
  X,
  Package,
  Truck,
  CreditCard,
  User,
  MapPin,
  Calendar,
  Download,
  FileText,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axiosInstance from "@/lib/axios";
import { toast } from "react-hot-toast";

export default function OrderDetails({ order, onClose, onUpdate }) {
  const [status, setStatus] = useState(order.status);
  const [trackingId, setTrackingId] = useState(order.trackingId || "");
  const [adminNotes, setAdminNotes] = useState(order.adminNotes || "");
  const [loading, setLoading] = useState(false);

  const statuses = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  const orderId = order._id.slice(-6).toUpperCase();

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const formatDateTime = (date) =>
    new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatPrice = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN")}`;

  const handleUpdate = async () => {
    setLoading(true);

    try {
      const res = await axiosInstance.put(`/orders/${order._id}/status`, {
        status,
        trackingId,
        adminNotes,
      });

      onUpdate(res.data);
      toast.success("Order updated successfully");
      onClose();
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    const img = new Image();
    img.src = "/beliefCosmetics.png";

    const generateInvoice = () => {
      // Brand header
      doc.setFillColor(248, 246, 240);
      doc.rect(0, 0, 210, 40, "F");

      if (img.complete && img.naturalWidth > 0) {
        const ratio = img.width / img.height;
        const logoWidth = 48;
        const logoHeight = logoWidth / ratio;

        doc.addImage(
          img,
          "PNG",
          14,
          5,
          logoWidth,
          Math.min(logoHeight, 28)
        );
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(15);
      doc.setTextColor(23, 43, 39);
      doc.text("INVOICE", 196, 23, { align: "right" });

      doc.setDrawColor(231, 234, 227);
      doc.line(14, 40, 196, 40);

      // Order information
      doc.setTextColor(23, 43, 39);
      doc.setFontSize(11);
      doc.text(`Order ID: #${orderId}`, 14, 53);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(90, 103, 95);

      doc.text(`Date: ${formatDate(order.createdAt)}`, 14, 60);
      doc.text(`Status: ${order.status}`, 14, 66);

      let paymentDisplay = `${order.paymentMethod}`;
      if (order.paymentMethod !== "Cash on Delivery") {
        paymentDisplay += ` (${order.paymentStatus})`;
      }

      doc.text(`Payment: ${paymentDisplay}`, 14, 72);

      // Billing address
      doc.setFont("helvetica", "bold");
      doc.setTextColor(23, 43, 39);
      doc.text("BILL TO", 120, 53);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(90, 103, 95);

      doc.text(order.address.fullName || "", 120, 60);
      doc.text(order.address.address || "", 120, 66);

      doc.text(
        `${order.address.city || ""}, ${order.address.state || ""} - ${order.address.pincode || ""}`,
        120,
        72
      );

      doc.text(`Phone: ${order.address.phone || ""}`, 120, 78);

      // Items table
      const tableColumn = ["Item", "Variant", "Qty", "Price", "Total"];

      const tableRows = order.items.map((item) => [
        item.name,
        item.variant || "-",
        item.quantity,
        `Rs. ${item.price}`,
        `Rs. ${item.price * item.quantity}`,
      ]);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 88,
        theme: "grid",
        headStyles: {
          fillColor: [23, 43, 39],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        styles: {
          fontSize: 9,
          cellPadding: 3,
          textColor: [55, 65, 60],
          lineColor: [231, 234, 227],
        },
        alternateRowStyles: {
          fillColor: [248, 246, 240],
        },
      });

      // Grand total
      const finalY = doc.lastAutoTable.finalY || 88;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(23, 43, 39);

      doc.text(
        `Grand Total: Rs. ${order.totalAmount}`,
        196,
        finalY + 15,
        { align: "right" }
      );

      // Footer
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.setTextColor(113, 132, 119);

      doc.text(
        "Thank you for shopping with Belief Cosmetics!",
        105,
        280,
        { align: "center" }
      );

      doc.save(`invoice_${order._id}.pdf`);
    };

    img.onload = generateInvoice;
    img.onerror = generateInvoice;

    if (img.complete) {
      generateInvoice();
    }
  };

  const SectionHeading = ({ icon: Icon, children }) => (
    <h3 className="mb-4 flex items-center gap-2 font-editorial text-2xl font-semibold text-[#172b27]">
      <Icon className="h-[18px] w-[18px] text-[#718477]" />
      {children}
    </h3>
  );

  const DetailRow = ({ label, children }) => (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="text-[#879188]">{label}</span>
      <span className="text-right font-medium text-[#294b40]">
        {children}
      </span>
    </div>
  );

  const inputClass =
    "w-full rounded-xl border border-[#e7eae3] bg-[#fbfaf6] px-4 py-3 text-sm text-[#172b27] outline-none transition-all placeholder:text-[#a0aaa2] focus:border-[#718477] focus:ring-2 focus:ring-[#718477]/10";

  const paymentStatusClass =
    order.paymentStatus === "Paid"
      ? "bg-[#eaf1e9] text-[#42664b]"
      : "bg-[#f7f0df] text-[#92723b]";

  const statusClass = {
    Pending: "bg-[#f7f0df] text-[#92723b]",
    Processing: "bg-[#edf0e7] text-[#66794e]",
    Shipped: "bg-[#eaf0f2] text-[#526f7a]",
    Delivered: "bg-[#eaf1e9] text-[#42664b]",
    Cancelled: "bg-[#f6e9e7] text-[#a35e55]",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#101c18]/55 p-3 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-[#e7eae3] bg-[#f8f6f0] shadow-2xl shadow-[#172b27]/15"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#e7eae3] bg-[#f8f6f0]/95 px-5 py-5 backdrop-blur-md sm:px-8">
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#879188]">
              Belief Cosmetics / Administration
            </p>

            <h2 className="font-editorial text-3xl font-semibold leading-none text-[#172b27] sm:text-4xl">
              Order Details
            </h2>

            <p className="mt-2 text-xs text-[#879188]">
              Order ID{" "}
              <span className="font-medium tracking-wider text-[#294b40]">
                #{orderId}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 rounded-full border border-[#dfe4dc] bg-white px-4 py-2.5 text-xs font-semibold text-[#294b40] transition-all hover:border-[#294b40] hover:bg-[#172b27] hover:text-white"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Invoice</span>
            </button>

            <button
              onClick={onClose}
              aria-label="Close order details"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e7eae3] text-[#718477] transition-all hover:border-[#172b27] hover:bg-[#172b27] hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-5 sm:p-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
            {/* Left column */}
            <div className="space-y-8">
              {/* Order items */}
              <section>
                <SectionHeading icon={Package}>
                  Order Items
                </SectionHeading>

                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-4 rounded-xl border border-[#e7eae3] bg-white p-3 transition-colors hover:border-[#cbd5ca]"
                    >
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#f8f6f0]">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="h-full w-full object-contain p-2"
                        />
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
                        <div>
                          <p className="font-editorial text-xl font-semibold leading-tight text-[#172b27]">
                            {item.name}
                          </p>

                          <p className="mt-1 text-xs text-[#879188]">
                            Variant: {item.variant || "N/A"}
                          </p>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs text-[#718477]">
                            Qty: {item.quantity}
                          </span>

                          <span className="text-sm font-semibold text-[#294b40]">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-[#dfe4dc] pt-4">
                  <span className="text-sm font-medium text-[#718477]">
                    Total Amount
                  </span>

                  <span className="font-editorial text-3xl font-semibold text-[#172b27]">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
              </section>

              {/* Payment information */}
              <section>
                <SectionHeading icon={CreditCard}>
                  Payment Information
                </SectionHeading>

                <div className="space-y-4 rounded-xl border border-[#e7eae3] bg-white p-5">
                  <DetailRow label="Payment Method">
                    {order.paymentMethod}
                  </DetailRow>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-[#879188]">
                      Payment Status
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${paymentStatusClass}`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>

                  {order.razorpayPaymentId && (
                    <div className="border-t border-[#e7eae3] pt-3">
                      <p className="mb-1 text-xs text-[#879188]">
                        Razorpay Payment ID
                      </p>

                      <p className="break-all font-mono text-xs text-[#294b40]">
                        {order.razorpayPaymentId}
                      </p>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Right column */}
            <div className="space-y-8">
              {/* Customer details */}
              <section>
                <SectionHeading icon={User}>
                  Customer Details
                </SectionHeading>

                <div className="space-y-5 rounded-xl border border-[#e7eae3] bg-white p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#edf0e7]">
                      <User className="h-4 w-4 text-[#718477]" />
                    </div>

                    <div className="min-w-0">
                      <p className="font-medium text-[#172b27]">
                        {order.user?.name || "Unknown"}
                      </p>

                      <p className="mt-1 break-all text-sm text-[#879188]">
                        {order.user?.email}
                      </p>

                      <p className="mt-1 text-sm text-[#879188]">
                        {order.user?.phone}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-[#e7eae3]" />

                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#edf0e7]">
                      <MapPin className="h-4 w-4 text-[#718477]" />
                    </div>

                    <div className="min-w-0">
                      <p className="font-medium text-[#172b27]">
                        {order.address.fullName}
                      </p>

                      <p className="mt-1 text-sm leading-relaxed text-[#879188]">
                        {order.address.address}
                      </p>

                      <p className="mt-1 text-sm text-[#879188]">
                        {order.address.city}, {order.address.state} -{" "}
                        {order.address.pincode}
                      </p>

                      <p className="mt-1 text-sm text-[#879188]">
                        Phone: {order.address.phone}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-[#e7eae3]" />

                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#edf0e7]">
                      <Calendar className="h-4 w-4 text-[#718477]" />
                    </div>

                    <div>
                      <p className="text-xs text-[#879188]">
                        Ordered On
                      </p>

                      <p className="mt-1 text-sm font-medium text-[#294b40]">
                        {formatDateTime(order.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Order management */}
              <section className="overflow-hidden rounded-xl border border-[#dfe4dc] bg-white">
                <div className="flex items-center gap-3 border-b border-[#e7eae3] bg-[#edf0e7]/60 px-5 py-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#172b27]">
                    <Truck className="h-5 w-5 text-[#f8f6f0]" />
                  </div>

                  <div>
                    <h3 className="font-editorial text-2xl font-semibold text-[#172b27]">
                      Order Management
                    </h3>

                    <p className="text-[10px] uppercase tracking-[0.16em] text-[#879188]">
                      Update order information
                    </p>
                  </div>
                </div>

                <div className="space-y-5 p-5">
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#718477]">
                      Order Status
                    </label>

                    <div className="relative">
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className={`${inputClass} appearance-none pr-10`}
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>

                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                        <span
                          className={`block h-2 w-2 rounded-full ${statusClass[status]?.split(" ")[0] ||
                            "bg-[#edf0e7]"
                            }`}
                        />
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#718477]">
                      Tracking ID
                    </label>

                    <input
                      type="text"
                      value={trackingId}
                      onChange={(e) => setTrackingId(e.target.value)}
                      placeholder="Enter tracking number"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#718477]">
                      Admin Notes
                    </label>

                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Internal notes..."
                      rows={3}
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  <button
                    onClick={handleUpdate}
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[#172b27] px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#f8f6f0] transition-all duration-300 hover:bg-[#294b40] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (
                      "Updating..."
                    ) : (
                      <>
                        <Truck className="h-4 w-4" />
                        Update Order
                      </>
                    )}
                  </button>
                </div>
              </section>
            </div>
          </div>

          {/* Bottom note */}
          <div className="mt-8 flex items-center justify-center gap-2 border-t border-[#e7eae3] pt-5">
            <FileText className="h-3.5 w-3.5 text-[#879188]" />
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#879188]">
              Belief Cosmetics · Order #{orderId}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
