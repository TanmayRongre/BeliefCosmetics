
import { useState } from "react";
import { Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import OrderDetails from "./order-details";

export default function OrdersSection({
  orders = [],
  setOrders = () => { },
  returns = [],
}) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState("orders");

  const statusColors = {
    Delivered: "bg-[#eaf1e9] text-[#42664b]",
    Processing: "bg-[#edf0e7] text-[#66794e]",
    Shipped: "bg-[#eaf0f2] text-[#526f7a]",
    Pending: "bg-[#f7f0df] text-[#92723b]",
    Cancelled: "bg-[#f6e9e7] text-[#a35e55]",
  };

  const handleOrderUpdate = (updatedOrder) => {
    setOrders(
      orders.map((order) =>
        order._id === updatedOrder._id ? updatedOrder : order
      )
    );

    setSelectedOrder(updatedOrder);
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatPrice = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN")}`;

  const paymentColors = {
    Paid: "bg-[#eaf1e9] text-[#42664b] border-[#dce9da]",
  };

  const returnStatusColors = {
    Requested: "bg-[#f7f0df] text-[#92723b]",
    Approved: "bg-[#eaf1e9] text-[#42664b]",
  };

  const currentData = activeTab === "orders" ? orders : returns;

  return (
    <div className="min-h-full bg-[#f8f6f0] p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-8 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#879188]">
            Belief Cosmetics / Administration
          </p>

          <h2 className="font-editorial text-4xl font-semibold leading-none text-[#172b27] sm:text-5xl">
            Recent{" "}
            <span className="italic text-[#718477]">
              {activeTab === "orders" ? "Orders" : "Returns"}
            </span>
          </h2>

          <p className="mt-3 text-sm text-[#879188]">
            {activeTab === "orders"
              ? "View and manage your customer orders."
              : "Review customer return requests."}
          </p>
        </div>

        {/* Tabs */}
        <div className="inline-flex w-fit items-center gap-1 rounded-full border border-[#e7eae3] bg-white p-1.5">
          <button
            onClick={() => setActiveTab("orders")}
            className={`rounded-full px-5 py-2.5 text-xs font-semibold transition-all duration-300 ${activeTab === "orders"
                ? "bg-[#172b27] text-[#f8f6f0] shadow-sm"
                : "text-[#718477] hover:bg-[#f1f2eb] hover:text-[#172b27]"
              }`}
          >
            Orders
            <span
              className={`ml-2 ${activeTab === "orders"
                  ? "text-[#c4d0c5]"
                  : "text-[#a0aaa2]"
                }`}
            >
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("returns")}
            className={`rounded-full px-5 py-2.5 text-xs font-semibold transition-all duration-300 ${activeTab === "returns"
                ? "bg-[#172b27] text-[#f8f6f0] shadow-sm"
                : "text-[#718477] hover:bg-[#f1f2eb] hover:text-[#172b27]"
              }`}
          >
            Returns
            <span
              className={`ml-2 ${activeTab === "returns"
                  ? "text-[#c4d0c5]"
                  : "text-[#a0aaa2]"
                }`}
            >
              {returns.length}
            </span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-hidden rounded-2xl border border-[#e7eae3] bg-white shadow-sm shadow-[#172b27]/[0.03]">
        {/* Table Header */}
        <div className="flex items-center justify-between border-b border-[#e7eae3] bg-[#fbfaf6] px-5 py-4 sm:px-6">
          <div>
            <h3 className="font-editorial text-2xl font-semibold text-[#172b27]">
              {activeTab === "orders" ? "Order Records" : "Return Records"}
            </h3>

            <p className="mt-0.5 text-[11px] text-[#879188]">
              {currentData.length}{" "}
              {activeTab === "orders" ? "orders" : "returns"} found
            </p>
          </div>

          <div className="hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a0aaa2] sm:block">
            Belief Cosmetics
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#e7eae3] bg-[#fbfaf6]">
                {activeTab === "orders" ? (
                  <>
                    {[
                      "Order ID",
                      "Customer",
                      "Date",
                      "Total",
                      "Payment",
                      "Status",
                      "Action",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#879188] sm:px-6"
                      >
                        {heading}
                      </th>
                    ))}
                  </>
                ) : (
                  <>
                    {[
                      "Return ID",
                      "Order ID",
                      "Customer",
                      "Type",
                      "Reason",
                      "Status",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#879188] sm:px-6"
                      >
                        {heading}
                      </th>
                    ))}
                  </>
                )}
              </tr>
            </thead>

            <tbody>
              <AnimatePresence mode="popLayout">
                {activeTab === "orders" ? (
                  orders.map((order, idx) => (
                    <motion.tr
                      key={order._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{
                        duration: 0.2,
                        delay: Math.min(idx * 0.025, 0.2),
                      }}
                      className="border-b border-[#edf0e9] transition-colors last:border-0 hover:bg-[#fbfaf6]"
                    >
                      {/* Order ID */}
                      <td className="whitespace-nowrap px-5 py-5 sm:px-6">
                        <span className="font-mono text-xs font-semibold tracking-wide text-[#294b40]">
                          #{order._id.slice(-6).toUpperCase()}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="px-5 py-5 sm:px-6">
                        <div>
                          <p className="text-sm font-semibold text-[#172b27]">
                            {order.user?.name || "Unknown"}
                          </p>

                          <p className="mt-1 text-xs text-[#879188]">
                            {order.user?.email || "—"}
                          </p>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="whitespace-nowrap px-5 py-5 text-xs text-[#718477] sm:px-6">
                        {formatDate(order.createdAt)}
                      </td>

                      {/* Total */}
                      <td className="whitespace-nowrap px-5 py-5 text-sm font-semibold text-[#172b27] sm:px-6">
                        {formatPrice(order.totalAmount)}
                      </td>

                      {/* Payment */}
                      <td className="whitespace-nowrap px-5 py-5 sm:px-6">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-semibold ${paymentColors[order.paymentStatus] ||
                            "border-[#f0e6ca] bg-[#f7f0df] text-[#92723b]"
                            }`}
                        >
                          {order.paymentStatus || "Unknown"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="whitespace-nowrap px-5 py-5 sm:px-6">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-[10px] font-semibold ${statusColors[order.status] ||
                            "bg-[#f1f2eb] text-[#718477]"
                            }`}
                        >
                          {order.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-5 py-5 sm:px-6">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          title="View Details"
                          aria-label={`View order ${order._id.slice(-6)}`}
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e7eae3] text-[#718477] transition-all duration-200 hover:border-[#172b27] hover:bg-[#172b27] hover:text-white"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  returns.map((ret, idx) => (
                    <motion.tr
                      key={ret._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{
                        duration: 0.2,
                        delay: Math.min(idx * 0.025, 0.2),
                      }}
                      className="border-b border-[#edf0e9] transition-colors last:border-0 hover:bg-[#fbfaf6]"
                    >
                      {/* Return ID */}
                      <td className="whitespace-nowrap px-5 py-5 sm:px-6">
                        <span className="font-mono text-xs font-semibold text-[#294b40]">
                          #{ret._id.slice(-6).toUpperCase()}
                        </span>
                      </td>

                      {/* Order ID */}
                      <td className="whitespace-nowrap px-5 py-5 text-xs text-[#718477] sm:px-6">
                        #{ret.orderId?._id?.slice(-6).toUpperCase() || "N/A"}
                      </td>

                      {/* Customer */}
                      <td className="px-5 py-5 sm:px-6">
                        <div>
                          <p className="text-sm font-semibold text-[#172b27]">
                            {ret.userId?.name || "Unknown"}
                          </p>

                          <p className="mt-1 text-xs text-[#879188]">
                            {ret.userId?.email || "—"}
                          </p>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="px-5 py-5 text-sm font-medium text-[#294b40] sm:px-6">
                        {ret.type || "—"}
                      </td>

                      {/* Reason */}
                      <td className="max-w-[240px] px-5 py-5 text-xs leading-relaxed text-[#879188] sm:px-6">
                        <span className="line-clamp-2">
                          {ret.reason || "—"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="whitespace-nowrap px-5 py-5 sm:px-6">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-[10px] font-semibold ${returnStatusColors[ret.status] ||
                            "bg-[#f1f2eb] text-[#718477]"
                            }`}
                        >
                          {ret.status || "Unknown"}
                        </span>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>

          {/* Empty State */}
          {currentData.length === 0 && (
            <div className="flex min-h-[260px] flex-col items-center justify-center px-6 py-12 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#edf0e7]">
                <span className="font-editorial text-2xl italic text-[#718477]">
                  B
                </span>
              </div>

              <h3 className="font-editorial text-2xl font-semibold text-[#172b27]">
                No {activeTab === "orders" ? "orders" : "returns"} yet
              </h3>

              <p className="mt-2 max-w-xs text-xs leading-relaxed text-[#879188]">
                {activeTab === "orders"
                  ? "Customer orders will appear here when they are placed."
                  : "Customer return requests will appear here when submitted."}
              </p>
            </div>
          )}
        </div>

        {/* Table Footer */}
        {currentData.length > 0 && (
          <div className="flex items-center justify-between border-t border-[#e7eae3] bg-[#fbfaf6] px-5 py-4 sm:px-6">
            <p className="text-[10px] uppercase tracking-[0.14em] text-[#879188]">
              Showing{" "}
              <span className="font-semibold text-[#294b40]">
                {currentData.length}
              </span>{" "}
              {activeTab === "orders" ? "orders" : "returns"}
            </p>

            <p className="font-editorial text-sm italic text-[#718477]">
              Belief Cosmetics
            </p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetails
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdate={handleOrderUpdate}
        />
      )}
    </div>
  );
}
