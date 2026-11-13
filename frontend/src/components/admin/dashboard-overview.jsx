
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Package,
  ShoppingBag,
  Users,
  AlertCircle,
  Activity,
  DollarSign,
  Eye,
  CreditCard,
  Clock,
  TrendingUp,
} from "lucide-react";
import {
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
} from "recharts";
import {
  format,
  subDays,
  startOfDay,
  parseISO,
  isValid,
  isToday,
} from "date-fns";

// Visual colors only. These are not business data.
const CHART_COLORS = [
  "#294b40",
  "#718477",
  "#a8b5a5",
  "#c5a77b",
  "#9a8174",
  "#667c91",
  "#a18baf",
];

const getOrderDate = (order) => {
  if (!order?.createdAt) return null;

  const date =
    typeof order.createdAt === "string"
      ? parseISO(order.createdAt)
      : new Date(order.createdAt);

  return isValid(date) ? date : null;
};

const getProductId = (item) => {
  const product = item?.product;

  if (product && typeof product === "object") {
    return String(product._id || product.id || "");
  }

  return String(product || item?._id || item?.productId || "");
};

const getAmount = (value) => {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
};

const getQuantity = (item) => {
  const quantity = Number(item?.quantity);
  return Number.isFinite(quantity) && quantity > 0 ? quantity : 0;
};

const getCurrencyFormatter = (currency) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });

const formatCompactCurrency = (value, formatter) =>
  formatter.format(value);

export default function DashboardOverview({
  products = [],
  orders = [],
  customers = [],
  totalProductsCount,
  lowStockThreshold,
  currency = "INR",
}) {
  const [dateRange, setDateRange] = useState("7d");

  const currencyFormatter = useMemo(
    () => getCurrencyFormatter(currency),
    [currency]
  );

  // All-time statistics from actual backend records.
  const stats = useMemo(() => {
    const totalRevenue = orders.reduce(
      (sum, order) => sum + getAmount(order.totalAmount),
      0
    );

    const totalOrders = orders.length;
    const totalCustomers = customers.length;

    const totalProducts =
      totalProductsCount ?? products.length;

    const averageOrderValue =
      totalOrders > 0 ? totalRevenue / totalOrders : null;

    return [
      {
        label: "Total Revenue",
        value: currencyFormatter.format(totalRevenue),
        icon: DollarSign,
        color: "text-[#294b40]",
      },
      {
        label: "Total Orders",
        value: totalOrders.toLocaleString("en-IN"),
        icon: ShoppingBag,
        color: "text-[#718477]",
      },
      {
        label: "Total Customers",
        value: totalCustomers.toLocaleString("en-IN"),
        icon: Users,
        color: "text-[#879188]",
      },
      {
        label: "Total Products",
        value: Number(totalProducts).toLocaleString("en-IN"),
        icon: Package,
        color: "text-[#a18b74]",
      },
      {
        label: "Avg. Order Value",
        value:
          averageOrderValue === null
            ? "—"
            : currencyFormatter.format(averageOrderValue),
        icon: CreditCard,
        color: "text-[#667c91]",
      },
    ];
  }, [
    products,
    orders,
    customers,
    totalProductsCount,
    currencyFormatter,
  ]);

  // Sales chart: actual orders only.
  const salesData = useMemo(() => {
    const days = Number(dateRange.replace("d", ""));
    const today = startOfDay(new Date());

    const chartData = Array.from({ length: days }, (_, index) => {
      const date = subDays(today, days - 1 - index);

      return {
        date: format(date, "yyyy-MM-dd"),
        name:
          days === 7
            ? format(date, "EEE")
            : format(date, "dd MMM"),
        revenue: 0,
        orders: 0,
      };
    });

    const dataByDate = new Map(
      chartData.map((entry) => [entry.date, entry])
    );

    orders.forEach((order) => {
      const orderDate = getOrderDate(order);
      if (!orderDate) return;

      const dateKey = format(orderDate, "yyyy-MM-dd");
      const entry = dataByDate.get(dateKey);

      if (!entry) return;

      entry.revenue += getAmount(order.totalAmount);
      entry.orders += 1;
    });

    return chartData;
  }, [orders, dateRange]);

  const hasSalesData = salesData.some(
    (entry) => entry.orders > 0
  );

  // Discover every skin type present in actual customer profiles.
  const skinTypeData = useMemo(() => {
    const counts = new Map();

    customers.forEach((customer) => {
      const skinType = customer?.skinProfile?.skinType;

      if (
        typeof skinType !== "string" ||
        !skinType.trim()
      ) {
        return;
      }

      const normalizedType = skinType.trim();

      counts.set(
        normalizedType,
        (counts.get(normalizedType) || 0) + 1
      );
    });

    return Array.from(counts.entries())
      .map(([name, value], index) => ({
        name,
        value,
        color: CHART_COLORS[index % CHART_COLORS.length],
      }))
      .sort((a, b) => b.value - a.value);
  }, [customers]);

  // Inventory counts use the threshold supplied by the application.
  const separateStock = useMemo(() => {
    const outOfStock = products.filter(
      (product) => getAmount(product.stock) <= 0
    ).length;

    const thresholdIsConfigured =
      Number.isFinite(Number(lowStockThreshold)) &&
      lowStockThreshold !== null &&
      lowStockThreshold !== undefined &&
      lowStockThreshold !== "";

    const lowStock = thresholdIsConfigured
      ? products.filter((product) => {
        const stock = getAmount(product.stock);

        return (
          stock > 0 &&
          stock <= Number(lowStockThreshold)
        );
      }).length
      : null;

    return {
      outOfStock,
      lowStock,
      thresholdIsConfigured,
    };
  }, [products, lowStockThreshold]);

  // Rank products by actual quantities sold.
  const topProducts = useMemo(() => {
    const salesByProduct = new Map();

    orders.forEach((order) => {
      if (!Array.isArray(order.items)) return;

      order.items.forEach((item) => {
        const productId = getProductId(item);
        const quantity = getQuantity(item);

        if (!productId || quantity <= 0) return;

        const currentProduct = products.find(
          (product) =>
            String(product._id || product.id) === productId
        );

        const productObject =
          item.product && typeof item.product === "object"
            ? item.product
            : {};

        const name =
          currentProduct?.name ||
          productObject.name ||
          item.name;

        if (!name) return;

        const existing = salesByProduct.get(productId) || {
          id: productId,
          name,
          category:
            currentProduct?.category ||
            productObject.category ||
            item.category ||
            "",
          image:
            currentProduct?.images?.[0] ||
            currentProduct?.image ||
            productObject.images?.[0] ||
            productObject.image ||
            item.image ||
            null,
          price: getAmount(
            item.price ??
            currentProduct?.price ??
            productObject.price
          ),
          sales: 0,
          revenue: 0,
          views:
            currentProduct?.views ??
            productObject.views ??
            null,
        };

        existing.sales += quantity;
        existing.revenue +=
          getAmount(item.price ?? existing.price) * quantity;

        salesByProduct.set(productId, existing);
      });
    });

    return Array.from(salesByProduct.values())
      .sort((a, b) => b.sales - a.sales);
  }, [products, orders]);

  // Recent activity from actual orders and customer registrations.
  const recentActivity = useMemo(() => {
    const activities = [];

    orders.forEach((order) => {
      const date = getOrderDate(order);
      if (!date) return;

      activities.push({
        id: `order-${order._id || date.getTime()}`,
        type: "order",
        title: `Order #${order._id ? String(order._id).slice(-6) : ""}`,
        desc: currencyFormatter.format(
          getAmount(order.totalAmount)
        ),
        rawTime: date,
        color: "bg-[#294b40]",
      });
    });

    customers.forEach((customer) => {
      if (!customer.createdAt) return;

      const date =
        typeof customer.createdAt === "string"
          ? parseISO(customer.createdAt)
          : new Date(customer.createdAt);

      if (!isValid(date)) return;

      activities.push({
        id: `customer-${customer._id || date.getTime()}`,
        type: "customer",
        title: "New Customer",
        desc: customer.name || customer.email || "Customer",
        rawTime: date,
        color: "bg-[#718477]",
      });
    });

    return activities
      .sort((a, b) => b.rawTime - a.rawTime)
      .slice(0, 5)
      .map((activity) => ({
        ...activity,
        time: isToday(activity.rawTime)
          ? `Today, ${format(activity.rawTime, "HH:mm")}`
          : format(activity.rawTime, "dd MMM, HH:mm"),
      }));
  }, [orders, customers, currencyFormatter]);

  const topSkinType = skinTypeData[0]?.name;

  return (
    <div className="min-h-full space-y-6 bg-[#f8f6f0] p-5 md:p-6">

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.07 }}
              className="flex items-center justify-between rounded-2xl border border-[#e7eae3] bg-white px-5 py-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#879188]">
                  {stat.label}
                </p>

                <h3 className="mt-2 break-words text-xl font-semibold text-[#172b27]">
                  {stat.value}
                </h3>
              </div>

              <div className={`ml-3 rounded-full bg-[#f3f5f0] p-3 ${stat.color}`}>
                <Icon size={19} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Sales and Insights */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* Sales Overview */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-[#e7eae3] bg-white p-5 shadow-sm md:p-6 xl:col-span-2"
        >
          <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-editorial text-2xl text-[#172b27]">
                Sales Overview
              </h3>
              <p className="mt-1 text-sm text-[#879188]">
                Revenue from recorded orders
              </p>
            </div>

            <select
              value={dateRange}
              onChange={(event) => setDateRange(event.target.value)}
              className="rounded-lg border border-[#e7eae3] bg-[#f8f6f0] px-4 py-2 text-sm text-[#294b40] outline-none focus:border-[#718477]"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>

          <div className="h-72 w-full">
            {hasSalesData ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={salesData}
                  margin={{ top: 10, right: 12, left: 4, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="beliefRevenueGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#718477"
                        stopOpacity={0.35}
                      />
                      <stop
                        offset="95%"
                        stopColor="#718477"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e7eae3"
                  />

                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#879188", fontSize: 11 }}
                    dy={10}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    width={75}
                    tick={{ fill: "#879188", fontSize: 11 }}
                    tickFormatter={(value) =>
                      new Intl.NumberFormat("en-IN", {
                        notation: "compact",
                        maximumFractionDigits: 1,
                      }).format(value)
                    }
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderRadius: "12px",
                      border: "1px solid #e7eae3",
                    }}
                    formatter={(value, name) => [
                      name === "revenue"
                        ? currencyFormatter.format(value)
                        : value,
                      name === "revenue" ? "Revenue" : "Orders",
                    ]}
                    labelStyle={{ color: "#294b40" }}
                  />

                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#294b40"
                    strokeWidth={2.5}
                    fill="url(#beliefRevenueGradient)"
                    dot={false}
                    activeDot={{
                      r: 5,
                      fill: "#294b40",
                      stroke: "#ffffff",
                      strokeWidth: 2,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-[#dfe4dc] bg-[#f8f6f0]/60 text-center">
                <TrendingUp size={26} className="mb-3 text-[#a8b5a5]" />
                <p className="text-sm font-medium text-[#294b40]">
                  No sales data for this period
                </p>
                <p className="mt-1 text-xs text-[#879188]">
                  Recorded orders will appear here.
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Right Column */}
        <div className="space-y-6">

          {/* Inventory Health */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl border border-[#e7eae3] bg-white p-5 shadow-sm"
          >
            <h3 className="font-editorial text-2xl text-[#172b27]">
              Inventory Health
            </h3>

            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-red-100 bg-red-50 p-3">
                <div className="flex items-center gap-2">
                  <AlertCircle size={17} className="text-red-500" />
                  <span className="text-sm font-medium text-red-800">
                    Out of Stock
                  </span>
                </div>

                <span className="font-semibold text-red-800">
                  {separateStock.outOfStock}
                </span>
              </div>

              {separateStock.thresholdIsConfigured ? (
                <div className="flex items-center justify-between rounded-xl border border-amber-100 bg-amber-50 p-3">
                  <div className="flex items-center gap-2">
                    <Activity size={17} className="text-amber-600" />
                    <span className="text-sm font-medium text-amber-800">
                      Low Stock
                    </span>
                  </div>

                  <span className="font-semibold text-amber-800">
                    {separateStock.lowStock}
                  </span>
                </div>
              ) : (
                <p className="rounded-xl border border-dashed border-[#dfe4dc] p-3 text-xs text-[#879188]">
                  Low-stock threshold is not configured.
                </p>
              )}
            </div>
          </motion.div>

          {/* Skin Intelligence */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl border border-[#e7eae3] bg-white p-5 shadow-sm"
          >
            <h3 className="font-editorial text-2xl text-[#172b27]">
              Skin Intelligence
            </h3>

            {skinTypeData.length > 0 ? (
              <>
                <div className="relative mt-4 h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={skinTypeData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={48}
                        outerRadius={69}
                        paddingAngle={3}
                      >
                        {skinTypeData.map((entry) => (
                          <Cell
                            key={entry.name}
                            fill={entry.color}
                          />
                        ))}
                      </Pie>

                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[10px] uppercase tracking-wider text-[#879188]">
                      Most Common
                    </span>
                    <span className="mt-1 max-w-[110px] truncate text-center text-sm font-semibold text-[#294b40]">
                      {topSkinType}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
                  {skinTypeData.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center gap-1.5"
                    >
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />

                      <span className="text-xs text-[#718477]">
                        {item.name} ({item.value})
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex h-44 flex-col items-center justify-center text-center">
                <p className="text-sm text-[#718477]">
                  No skin analysis data available.
                </p>
                <p className="mt-1 text-xs text-[#a0a99f]">
                  Customer skin profiles will appear here.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Product Performance and Recent Activity */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* Top Performing Products */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-[#e7eae3] bg-white p-5 shadow-sm md:p-6 xl:col-span-2"
        >
          <div className="mb-6">
            <h3 className="font-editorial text-2xl text-[#172b27]">
              Top Performing Products
            </h3>
            <p className="mt-1 text-sm text-[#879188]">
              Ranked by actual units sold
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px]">
              <thead className="border-b border-[#e7eae3] text-left text-[10px] uppercase tracking-wider text-[#879188]">
                <tr>
                  <th className="pb-3 pl-2 font-semibold">Product</th>
                  <th className="pb-3 text-right font-semibold">Price</th>
                  <th className="pb-3 text-right font-semibold">Units Sold</th>
                  <th className="pb-3 text-right font-semibold">Views</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#f0f1ed]">
                {topProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="transition-colors hover:bg-[#f8f6f0]/70"
                  >
                    <td className="py-4 pl-2">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#e7eae3] bg-[#f8f6f0]">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Package
                              size={19}
                              className="text-[#a8b5a5]"
                            />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="max-w-[180px] truncate text-sm font-semibold text-[#294b40]">
                            {product.name}
                          </p>

                          {product.category && (
                            <p className="mt-0.5 text-xs text-[#879188]">
                              {product.category}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-4 text-right text-sm text-[#294b40]">
                      {currencyFormatter.format(product.price)}
                    </td>

                    <td className="py-4 text-right text-sm font-semibold text-[#294b40]">
                      {product.sales.toLocaleString("en-IN")}
                    </td>

                    <td className="py-4 text-right text-sm text-[#718477]">
                      {product.views === null
                        ? "—"
                        : Number(product.views).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}

                {topProducts.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-12 text-center text-sm text-[#879188]"
                    >
                      No product sales have been recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-[#e7eae3] bg-white p-5 shadow-sm md:p-6"
        >
          <h3 className="font-editorial text-2xl text-[#172b27]">
            Recent Activity
          </h3>

          <p className="mt-1 text-sm text-[#879188]">
            Latest recorded events
          </p>

          <div className="relative mt-6 space-y-5">
            {recentActivity.length > 0 && (
              <div className="absolute bottom-2 left-[9px] top-2 w-px bg-[#e7eae3]" />
            )}

            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="relative flex gap-3"
                >
                  <span
                    className={`relative z-10 mt-1 h-[19px] w-[19px] shrink-0 rounded-full border-4 border-white ${activity.color}`}
                  />

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#294b40]">
                      {activity.title}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-[#718477]">
                      {activity.desc}
                    </p>

                    <div className="mt-2 flex items-center gap-1.5 text-[10px] text-[#a0a99f]">
                      <Clock size={11} />
                      {activity.time}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="py-10 text-center text-sm text-[#879188]">
                No recent activity available.
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
