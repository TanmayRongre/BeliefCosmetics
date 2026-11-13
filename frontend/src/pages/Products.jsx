
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
  ArrowUpRight,
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
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

const pageTransition = {
  duration: 0.45,
  ease: [0.22, 1, 0.36, 1],
};

const initialFilters = {
  skinType: [],
  category: [],
  priceRange: [0, 5000],
  concern: [],
};

export default function Products() {
  const [searchParams] = useSearchParams();
  const shouldReduceMotion = useReducedMotion();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState("grid");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("q") || ""
  );
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [filters, setFilters] = useState(initialFilters);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const productsSectionRef = useRef(null);
  const searchInputRef = useRef(null);

  const handleSetFilters = (newFilters) => {
    setFilters((currentFilters) =>
      typeof newFilters === "function"
        ? newFilters(currentFilters)
        : newFilters
    );
    setPage(1);
  };

  // Sync search and category with URL.
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

        filters.category.forEach((category) =>
          params.append("category", category)
        );

        filters.skinType.forEach((type) =>
          params.append("skinType", type)
        );

        filters.concern.forEach((concern) =>
          params.append("concern", concern)
        );

        const res = await axios.get(
          `/products?${params.toString()}`
        );

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
  }, [
    page,
    filters,
    searchQuery,
    sortBy,
    order,
    shouldReduceMotion,
  ]);

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

  const clearFilters = () => {
    setSearchQuery("");
    setFilters(initialFilters);
    setPage(1);
  };

  const closeMobileFilters = () => {
    setMobileFiltersOpen(false);
  };

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
    <div className="min-h-screen overflow-hidden bg-[#f8f6f0] font-sans text-[#172b27]">
      <Header />

      {/* HERO */}
      <section className="relative flex min-h-[530px] items-center justify-center overflow-hidden bg-[#e9ece4] md:min-h-[620px]">

        <motion.div
          className="absolute inset-0"
          initial={shouldReduceMotion ? false : { scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <img
            src="/product_Hero.jpg"
            alt="Belief Cosmetics skincare collection"
            className="h-full w-full object-cover"
          />
        </motion.div>

        <div className="absolute inset-0 bg-[#f8f6f0]/65" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#f8f6f0]/20 via-transparent to-[#f8f6f0]" />

        <div className="pointer-events-none absolute -right-28 top-16 h-80 w-80 rounded-full border border-[#718477]/25 md:h-[440px] md:w-[440px]" />
        <div className="pointer-events-none absolute -left-28 bottom-0 h-64 w-64 rounded-full border border-[#718477]/20 md:h-80 md:w-80" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-24 text-center md:px-8">

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mx-auto max-w-4xl"
          >
            <motion.div variants={itemVariants}>
              <span className="mb-7 inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#718477]">
                <span className="h-px w-8 bg-[#718477]" />
                The Belief Collection
                <span className="h-px w-8 bg-[#718477]" />
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="font-editorial text-5xl font-medium leading-[0.98] tracking-[-0.04em] text-[#172b27] sm:text-6xl md:text-8xl"
            >
              Find Skincare
              <br />
              <span className="font-normal italic text-[#718477]">
                That Feels Like You.
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mx-auto mt-7 max-w-xl text-sm leading-8 text-[#65736a] md:text-base"
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
                className="group inline-flex items-center gap-4 bg-[#172b27] px-8 py-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-white transition-colors duration-300 hover:bg-[#294b40]"
              >
                Explore Collection
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex">
          <span className="text-[9px] font-medium uppercase tracking-[0.3em] text-[#718477]">
            Discover
          </span>
          <div className="h-10 w-px bg-[#718477]/70" />
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="mx-auto max-w-[1440px] px-5 pb-24 pt-14 sm:px-8 md:pt-20 lg:px-14">

        {/* CATEGORY SECTION */}
        <motion.section
          initial={shouldReduceMotion ? false : { opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={pageTransition}
          className="mb-16 md:mb-24"
        >
          <div className="mb-9 text-center">
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#718477]">
              Shop by your needs
            </span>

            <h2 className="mt-3 font-editorial text-4xl tracking-[-0.03em] text-[#172b27] md:text-5xl">
              Find Your Ritual
            </h2>
          </div>

          <ProductCategoryCircles
            filters={filters}
            setFilters={handleSetFilters}
          />
        </motion.section>

        {/* PRODUCT AREA */}
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-14">

          {/* DESKTOP FILTER SIDEBAR */}
          <motion.aside
            initial={shouldReduceMotion ? false : { opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={pageTransition}
            className="hidden w-64 shrink-0 lg:block"
          >
            <div className="sticky top-28">
              <div className="mb-6 flex items-center gap-3">
                <SlidersHorizontal
                  size={16}
                  className="text-[#718477]"
                />

                <h3 className="font-editorial text-2xl text-[#172b27]">
                  Refine Selection
                </h3>
              </div>

              <div className="border-t border-[#e7eae3] pt-6">
                <ProductFilters
                  filters={filters}
                  setFilters={handleSetFilters}
                />
              </div>
            </div>
          </motion.aside>

          {/* PRODUCT CONTENT */}
          <div
            className="min-w-0 flex-1"
            ref={productsSectionRef}
          >

            {/* TOOLBAR */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={pageTransition}
              className="mb-8 border-b border-[#e7eae3] pb-7"
            >
              <div className="flex flex-col gap-6">

                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#718477]">
                      Carefully curated for you
                    </span>

                    <h2 className="mt-2 font-editorial text-4xl tracking-[-0.03em] text-[#172b27] md:text-5xl">
                      The Collection
                    </h2>

                    <p className="mt-2 text-xs leading-6 text-[#879188]">
                      Explore products made for your skin.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#879188]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#718477]" />
                    {loading
                      ? "Updating collection..."
                      : `${products.length} products shown`}
                  </div>
                </div>

                {/* SEARCH AND CONTROLS */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                  <div className="relative w-full sm:max-w-xs">
                    <Search
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#879188]"
                    />

                    <input
                      ref={searchInputRef}
                      type="search"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setPage(1);
                      }}
                      placeholder="Search the collection..."
                      className="h-12 w-full border border-[#e7eae3] bg-white/70 pl-11 pr-10 text-xs text-[#172b27] outline-none transition-all placeholder:text-[#a0aaa0] focus:border-[#718477] focus:bg-white focus:ring-2 focus:ring-[#718477]/10"
                    />

                    {searchQuery && (
                      <button
                        onClick={clearSearch}
                        aria-label="Clear search"
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#879188] transition hover:text-[#172b27]"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-3 sm:justify-end">

                    {/* SORT */}
                    <div className="relative">
                      <select
                        value={`${sortBy}-${order}`}
                        onChange={(e) =>
                          handleSortChange(e.target.value)
                        }
                        className="h-11 appearance-none border border-[#e7eae3] bg-white py-2 pl-4 pr-10 text-[11px] font-medium text-[#52685b] outline-none transition hover:border-[#718477] focus:border-[#718477]"
                      >
                        <option value="createdAt-desc">
                          Newest Arrivals
                        </option>
                        <option value="price-asc">
                          Price: Low to High
                        </option>
                        <option value="price-desc">
                          Price: High to Low
                        </option>
                        <option value="name-asc">
                          Name: A to Z
                        </option>
                      </select>

                      <ChevronDown
                        size={14}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#879188]"
                      />
                    </div>

                    {/* MOBILE FILTERS */}
                    <button
                      onClick={() => setMobileFiltersOpen(true)}
                      className="flex h-11 items-center gap-2 border border-[#e7eae3] bg-white px-4 text-[11px] font-medium text-[#52685b] transition hover:border-[#718477] lg:hidden"
                      aria-label="Open filters"
                    >
                      <Filter size={15} />
                      Filters
                    </button>

                    {/* VIEW TOGGLE */}
                    <div className="flex h-11 items-center border border-[#e7eae3] bg-white p-1">
                      <button
                        onClick={() => setViewType("grid")}
                        className={`flex h-9 w-9 items-center justify-center transition-all ${viewType === "grid"
                            ? "bg-[#172b27] text-white"
                            : "text-[#879188] hover:bg-[#f3f4ee] hover:text-[#172b27]"
                          }`}
                        aria-label="Grid view"
                        aria-pressed={viewType === "grid"}
                      >
                        <Grid size={16} />
                      </button>

                      <button
                        onClick={() => setViewType("list")}
                        className={`flex h-9 w-9 items-center justify-center transition-all ${viewType === "list"
                            ? "bg-[#172b27] text-white"
                            : "text-[#879188] hover:bg-[#f3f4ee] hover:text-[#172b27]"
                          }`}
                        aria-label="List view"
                        aria-pressed={viewType === "list"}
                      >
                        <List size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* PRODUCT GRID */}
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
                    <div className="absolute inset-0 animate-spin rounded-full border border-[#e7eae3] border-t-[#294b40]" />
                    <Loader
                      size={20}
                      className="text-[#718477]"
                    />
                  </div>

                  <div className="text-center">
                    <p className="font-editorial text-2xl text-[#172b27]">
                      Curating your collection
                    </p>

                    <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[#a0aaa0]">
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
                    <div className="flex min-h-[400px] flex-col items-center justify-center border border-dashed border-[#dfe4dc] bg-white/40 px-6 text-center">
                      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#edf0e9]">
                        <Search
                          size={24}
                          className="text-[#718477]"
                        />
                      </div>

                      <h3 className="font-editorial text-3xl text-[#172b27]">
                        Nothing found just yet
                      </h3>

                      <p className="mt-3 max-w-sm text-sm leading-7 text-[#879188]">
                        We couldn't find products matching your
                        selection. Try adjusting your search or filters.
                      </p>

                      <button
                        onClick={clearFilters}
                        className="mt-7 inline-flex items-center gap-2 border-b border-[#294b40] pb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#294b40] transition hover:text-[#718477]"
                      >
                        Clear all filters
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* PAGINATION */}
            {!loading && totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-16 flex flex-wrap items-center justify-center gap-2"
              >
                <button
                  disabled={page === 1}
                  onClick={() =>
                    setPage((current) => Math.max(1, current - 1))
                  }
                  className="mr-2 border border-[#e7eae3] bg-white px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#52685b] transition hover:border-[#718477] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                {pageNumbers.map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => setPage(pageNumber)}
                    aria-current={
                      page === pageNumber ? "page" : undefined
                    }
                    className={`flex h-11 w-11 items-center justify-center text-xs transition-all ${page === pageNumber
                        ? "bg-[#172b27] text-white"
                        : "border border-[#e7eae3] bg-white text-[#52685b] hover:border-[#718477] hover:bg-[#edf0e9]"
                      }`}
                  >
                    {pageNumber}
                  </button>
                ))}

                <button
                  disabled={page === totalPages}
                  onClick={() =>
                    setPage((current) =>
                      Math.min(totalPages, current + 1)
                    )
                  }
                  className="ml-2 border border-[#e7eae3] bg-white px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#52685b] transition hover:border-[#718477] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      {/* MOBILE FILTER DRAWER */}
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
              className="absolute inset-0 h-full w-full bg-[#172b27]/55 backdrop-blur-sm"
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="absolute bottom-0 left-0 right-0 max-h-[88vh] overflow-y-auto rounded-t-[24px] bg-[#f8f6f0] shadow-2xl"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#e7eae3] bg-[#f8f6f0]/95 px-6 py-5 backdrop-blur-md">
                <div>
                  <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#718477]">
                    Personalise your selection
                  </span>

                  <h2 className="mt-1 font-editorial text-3xl text-[#172b27]">
                    Refine Selection
                  </h2>
                </div>

                <button
                  onClick={closeMobileFilters}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e7eae3] bg-white text-[#294b40] transition hover:bg-[#edf0e9]"
                  aria-label="Close filters"
                >
                  <X size={17} />
                </button>
              </div>

              <div className="px-6 pb-10 pt-6">
                <ProductFilters
                  filters={filters}
                  setFilters={handleSetFilters}
                />

                <button
                  onClick={closeMobileFilters}
                  className="mt-8 w-full bg-[#172b27] py-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#294b40]"
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
