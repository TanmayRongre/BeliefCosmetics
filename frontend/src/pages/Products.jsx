
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "../lib/axios";
import Header from "../components/layout/header";
import Footer from "../components/layout/footer";
import ProductFilters from "../components/product/product-filters";
import ProductGrid from "../components/product/product-grid";
import ProductCategoryCircles from "../components/product/product-category-circles";
import {
  Grid,
  List,
  Loader,
  Search,
  X,
  Filter,
  ChevronDown,
  ArrowRight,
  SlidersHorizontal,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import toast from "react-hot-toast";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

const pageTransition = {
  duration: 0.5,
  ease: [0.22, 1, 0.36, 1],
};

export default function Products() {
  const [searchParams] = useSearchParams();
  const shouldReduceMotion = useReducedMotion();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState("grid");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [filters, setFilters] = useState({
    skinType: [],
    category: [],
    priceRange: [0, 5000],
    concern: [],
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const productsSectionRef = useRef(null);
  const searchInputRef = useRef(null);

  // Supports both direct filter objects and functional updates.
  const handleSetFilters = (newFilters) => {
    setFilters((currentFilters) =>
      typeof newFilters === "function"
        ? newFilters(currentFilters)
        : newFilters
    );
    setPage(1);
  };

  // Sync search and category from URL.
  useEffect(() => {
    const q = searchParams.get("q") || "";
    const categoryParam = searchParams.get("category");

    setSearchQuery(q);
    setPage(1);

    if (categoryParam) {
      setFilters((current) => ({
        ...current,
        category: [categoryParam],
      }));
    }
  }, [searchParams]);

  // Scroll to products when searching.
  useEffect(() => {
    if (searchQuery && productsSectionRef.current) {
      const offsetTop =
        productsSectionRef.current.getBoundingClientRect().top +
        window.scrollY -
        110;

      window.scrollTo({
        top: offsetTop,
        behavior: shouldReduceMotion ? "auto" : "smooth",
      });
    }
  }, [searchQuery, shouldReduceMotion]);

  // Fetch products.
  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      setLoading(true);

      try {
        const params = new URLSearchParams();

        params.append("page", page);
        params.append("limit", 12);

        if (searchQuery.trim()) {
          params.append("search", searchQuery.trim());
        }

        if (filters.priceRange[0] !== undefined) {
          params.append("minPrice", filters.priceRange[0]);
        }

        if (filters.priceRange[1] !== undefined) {
          params.append("maxPrice", filters.priceRange[1]);
        }

        if (sortBy) params.append("sortBy", sortBy);
        if (order) params.append("order", order);

        filters.category.forEach((cat) =>
          params.append("category", cat)
        );

        filters.skinType.forEach((type) =>
          params.append("skinType", type)
        );

        filters.concern.forEach((concern) =>
          params.append("concern", concern)
        );

        const res = await axios.get(`/products?${params.toString()}`);

        if (!isMounted) return;

        setProducts(res.data.products || []);
        setTotalPages(res.data.totalPages || 1);
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching products:", error);
          toast.error("Failed to load products");
        }
      } finally {
        if (isMounted) {
          setLoading(false);

          if (productsSectionRef.current && page > 1) {
            const offsetTop =
              productsSectionRef.current.getBoundingClientRect().top +
              window.scrollY -
              110;

            window.scrollTo({
              top: offsetTop,
              behavior: shouldReduceMotion ? "auto" : "smooth",
            });
          }
        }
      }
    };

    const timeoutId = setTimeout(fetchProducts, 300);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [page, filters, searchQuery, sortBy, order, shouldReduceMotion]);

  const handleSortChange = (value) => {
    const [newSort, newOrder] = value.split("-");
    setSortBy(newSort);
    setOrder(newOrder);
    setPage(1);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setPage(1);
  };

  const closeMobileFilters = () => setMobileFiltersOpen(false);

  const pageNumbers = (() => {
    const startPage = Math.max(
      1,
      Math.min(page - 1, totalPages - 2)
    );
    const endPage = Math.min(totalPages, startPage + 2);

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, index) => startPage + index
    );
  })();

  return (
    <div className="min-h-screen overflow-hidden bg-[#f8f7f2] text-[#172b27]">
      <Header />

      {/* ================= HERO SECTION ================= */}
      <section className="relative flex min-h-[540px] items-center justify-center overflow-hidden md:min-h-[650px]">
        <motion.div
          className="absolute inset-0"
          initial={shouldReduceMotion ? false : { scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
        >
          <img
            src="/product_Hero.jpg"
            alt="Belief Cosmetics skincare collection"
            className="h-full w-full object-cover"
          />
        </motion.div>

        <div className="absolute inset-0 bg-[#f8f7f2]/75" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#f8f7f2]/30 via-transparent to-[#f8f7f2]" />

        {/* Decorative shapes */}
        <motion.div
          className="absolute -right-24 top-20 h-72 w-72 rounded-full border border-[#71877a]/20 md:h-96 md:w-96"
          animate={
            shouldReduceMotion
              ? {}
              : { rotate: 360 }
          }
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        />

        <motion.div
          className="absolute -left-24 bottom-0 h-64 w-64 rounded-full border border-[#71877a]/20 md:h-80 md:w-80"
          animate={
            shouldReduceMotion
              ? {}
              : { rotate: -360 }
          }
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-24 text-center md:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mx-auto max-w-4xl"
          >
            <motion.div variants={itemVariants}>
              <span className="mb-7 inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.35em] text-[#63796b] md:text-xs">
                <span className="h-px w-8 bg-[#829585]" />
                The Belief Collection
                <span className="h-px w-8 bg-[#829585]" />
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="mb-7 font-editorial text-5xl font-medium leading-[0.98] tracking-[-0.035em] text-[#172b27] sm:text-6xl md:text-8xl"
            >
              Find Skincare
              <br />
              <span className="font-normal italic text-[#71877a]">
                That Feels Like You.
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mx-auto max-w-xl text-sm leading-8 text-[#5e6b63] md:text-base"
            >
              Thoughtfully selected skincare for every ritual,
              every concern, and every kind of skin.
              Discover your everyday essentials.
            </motion.p>

            <motion.div variants={itemVariants} className="mt-10">
              <button
                onClick={() =>
                  productsSectionRef.current?.scrollIntoView({
                    behavior: shouldReduceMotion ? "auto" : "smooth",
                    block: "start",
                  })
                }
                className="group inline-flex items-center gap-4 border border-[#263d34] bg-[#263d34] px-8 py-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-transparent hover:text-[#263d34]"
              >
                Explore Collection
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex">
          <span className="text-[9px] uppercase tracking-[0.3em] text-[#65766b]">
            Discover
          </span>
          <motion.div
            className="h-10 w-px origin-top bg-[#829585]"
            animate={shouldReduceMotion ? {} : { scaleY: [0.4, 1, 0.4] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
        </div>
      </section>

      {/* ================= MAIN CONTENT ================= */}
      <main className="mx-auto max-w-[1440px] px-5 pb-24 pt-12 md:px-10 md:pt-20">

        {/* Category circles */}
        <motion.section
          initial={shouldReduceMotion ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={pageTransition}
          className="mb-16 md:mb-24"
        >
          <div className="mb-8 text-center">
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#829585]">
              Shop by your needs
            </span>
            <h2 className="mt-3 font-editorial text-4xl text-[#172b27] md:text-5xl">
              Find Your Ritual
            </h2>
          </div>

          <ProductCategoryCircles
            filters={filters}
            setFilters={handleSetFilters}
          />
        </motion.section>

        {/* Products and filters */}
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">

          {/* Desktop sidebar */}
          <motion.aside
            initial={shouldReduceMotion ? false : { opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={pageTransition}
            className="hidden w-64 flex-shrink-0 lg:block"
          >
            <div className="sticky top-28">
              <div className="mb-5 flex items-center gap-3">
                <SlidersHorizontal className="h-4 w-4 text-[#71877a]" />
                <h3 className="font-editorial text-2xl text-[#172b27]">
                  Refine Selection
                </h3>
              </div>

              <div className="border-t border-[#dfe3dc] pt-5">
                <ProductFilters
                  filters={filters}
                  setFilters={handleSetFilters}
                />
              </div>
            </div>
          </motion.aside>

          {/* Product content */}
          <div className="min-w-0 flex-1" ref={productsSectionRef}>

            {/* Toolbar */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={pageTransition}
              className="mb-7 border-b border-[#dfe3dc] pb-6"
            >
              <div className="flex flex-col gap-6">

                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#829585]">
                      Carefully curated for you
                    </span>
                    <h2 className="mt-2 font-editorial text-4xl text-[#172b27] md:text-5xl">
                      The Collection
                    </h2>
                    <p className="mt-2 text-xs tracking-wide text-[#77837b]">
                      Explore products made for your skin.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#718077]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#829585]" />
                    {loading ? "Updating collection..." : `${products.length} products shown`}
                  </div>
                </div>

                {/* Search and controls */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                  <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#829585]" />

                    <input
                      ref={searchInputRef}
                      type="search"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setPage(1);
                      }}
                      placeholder="Search the collection..."
                      className="h-12 w-full border border-[#dfe3dc] bg-white/70 pl-11 pr-10 text-xs text-[#263d34] outline-none transition-all placeholder:text-[#9ba69e] focus:border-[#71877a] focus:bg-white focus:ring-2 focus:ring-[#71877a]/10"
                    />

                    {searchQuery && (
                      <button
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#71877a] transition hover:text-[#172b27]"
                        aria-label="Clear search"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-3 sm:justify-end">

                    {/* Sort */}
                    <div className="relative">
                      <select
                        value={`${sortBy}-${order}`}
                        onChange={(e) => handleSortChange(e.target.value)}
                        className="h-11 appearance-none border border-[#dfe3dc] bg-white py-2 pl-4 pr-10 text-[11px] font-medium tracking-wide text-[#34483e] outline-none transition hover:border-[#829585] focus:border-[#71877a]"
                      >
                        <option value="createdAt-desc">Newest Arrivals</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="name-asc">Name: A to Z</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#71877a]" />
                    </div>

                    {/* Mobile filters */}
                    <button
                      onClick={() => setMobileFiltersOpen(true)}
                      className="flex h-11 items-center gap-2 border border-[#dfe3dc] bg-white px-4 text-[11px] font-medium tracking-wide text-[#34483e] transition hover:border-[#829585] lg:hidden"
                      aria-label="Open filters"
                    >
                      <Filter className="h-4 w-4" />
                      Filters
                    </button>

                    {/* View toggle */}
                    <div className="flex h-11 items-center border border-[#dfe3dc] bg-white p-1">
                      <button
                        onClick={() => setViewType("grid")}
                        className={`flex h-9 w-9 items-center justify-center transition-all duration-300 ${viewType === "grid"
                            ? "bg-[#263d34] text-white"
                            : "text-[#849087] hover:bg-[#f1f2ed] hover:text-[#263d34]"
                          }`}
                        aria-label="Grid view"
                        aria-pressed={viewType === "grid"}
                      >
                        <Grid className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => setViewType("list")}
                        className={`flex h-9 w-9 items-center justify-center transition-all duration-300 ${viewType === "list"
                            ? "bg-[#263d34] text-white"
                            : "text-[#849087] hover:bg-[#f1f2ed] hover:text-[#263d34]"
                          }`}
                        aria-label="List view"
                        aria-pressed={viewType === "list"}
                      >
                        <List className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Product grid */}
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex min-h-[420px] flex-col items-center justify-center gap-5"
                >
                  <div className="relative flex h-14 w-14 items-center justify-center">
                    <div className="absolute inset-0 animate-spin rounded-full border border-[#dfe3dc] border-t-[#263d34]" />
                    <Loader className="h-5 w-5 text-[#71877a]" />
                  </div>
                  <div className="text-center">
                    <p className="font-editorial text-2xl text-[#263d34]">
                      Curating your collection
                    </p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[#94a097]">
                      Just a moment
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={`${page}-${sortBy}-${order}-${searchQuery}-${viewType}`}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={pageTransition}
                >
                  {products.length > 0 ? (
                    <ProductGrid
                      viewType={viewType}
                      filters={filters}
                      products={products}
                    />
                  ) : (
                    <div className="flex min-h-[400px] flex-col items-center justify-center border border-dashed border-[#d4dcd3] bg-white/40 px-6 text-center">
                      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#e9eee7]">
                        <Search className="h-6 w-6 text-[#71877a]" />
                      </div>
                      <h3 className="font-editorial text-3xl text-[#263d34]">
                        Nothing found just yet
                      </h3>
                      <p className="mt-3 max-w-sm text-sm leading-7 text-[#7b877f]">
                        We couldn't find products matching your selection.
                        Try adjusting your search or filters.
                      </p>
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setFilters({
                            skinType: [],
                            category: [],
                            priceRange: [0, 5000],
                            concern: [],
                          });
                          setPage(1);
                        }}
                        className="mt-7 inline-flex items-center gap-2 border-b border-[#263d34] pb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#263d34] transition hover:text-[#71877a]"
                      >
                        Clear all filters
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-16 flex flex-wrap items-center justify-center gap-2"
              >
                <button
                  disabled={page === 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  className="mr-2 border border-[#dfe3dc] bg-white px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#34483e] transition hover:border-[#71877a] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                {pageNumbers.map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => setPage(pageNumber)}
                    aria-current={page === pageNumber ? "page" : undefined}
                    className={`flex h-11 w-11 items-center justify-center text-xs transition-all duration-300 ${page === pageNumber
                        ? "bg-[#263d34] text-white shadow-lg shadow-[#263d34]/15"
                        : "border border-[#dfe3dc] bg-white text-[#526258] hover:border-[#71877a] hover:bg-[#eef1eb]"
                      }`}
                  >
                    {pageNumber}
                  </button>
                ))}

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                  className="ml-2 border border-[#dfe3dc] bg-white px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#34483e] transition hover:border-[#71877a] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      {/* ================= MOBILE FILTER DRAWER ================= */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            <motion.button
              type="button"
              aria-label="Close filters"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileFilters}
              className="absolute inset-0 h-full w-full bg-[#101b16]/55 backdrop-blur-sm"
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute bottom-0 left-0 right-0 max-h-[88vh] overflow-y-auto rounded-t-[28px] bg-[#f8f7f2] shadow-2xl"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#dfe3dc] bg-[#f8f7f2]/95 px-6 py-5 backdrop-blur-md">
                <div>
                  <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#829585]">
                    Personalise your selection
                  </span>
                  <h2 className="mt-1 font-editorial text-3xl text-[#172b27]">
                    Refine Selection
                  </h2>
                </div>

                <button
                  onClick={closeMobileFilters}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#dfe3dc] bg-white text-[#263d34] transition hover:bg-[#e9eee7]"
                  aria-label="Close filters"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="px-6 pb-10 pt-6">
                <ProductFilters
                  filters={filters}
                  setFilters={handleSetFilters}
                />

                <button
                  onClick={closeMobileFilters}
                  className="mt-8 w-full bg-[#263d34] py-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#405a4d]"
                >
                  View Products
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
