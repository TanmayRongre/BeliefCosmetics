
import { useState } from "react";
import { Search, X } from "lucide-react";

export default function SearchBar({
  onSearch,
  initialValue = "",
}) {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();

    const query = searchTerm.trim();
    if (!query) return;

    onSearch?.(query);
  };

  const clearSearch = () => {
    setSearchTerm("");
    onSearch?.("");
  };

  const suggestions = [
    "Sunscreen",
    "Serum",
    "Moisturiser",
    "Toner",
  ];

  return (
    <section className="relative w-full overflow-hidden bg-[#F8F6F0] px-5 py-12 sm:px-8 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-4xl">

        {/* Brand Logo */}
        <div className="mb-7 flex justify-center">
          <img
            src="/beliefCosmetics.png"
            alt="Belief Cosmetics"
            className="h-12 w-auto object-contain sm:h-14"
          />
        </div>

        {/* Editorial Heading */}
        <div className="mb-9 text-center">

          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#84988A]" />

            <span className="font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-[#718477]">
              Find Your Essentials
            </span>

            <span className="h-px w-8 bg-[#84988A]" />
          </div>

          <h2 className="font-editorial text-4xl leading-[1.1] tracking-[-0.035em] text-[#172B27] sm:text-5xl md:text-6xl">
            Discover your{" "}
            <span className="italic">skincare.</span>
          </h2>

          <p className="mx-auto mt-4 max-w-lg font-sans text-sm font-light leading-7 text-[#69766E] sm:text-base">
            Explore products, ingredients, and solutions
            thoughtfully selected for your skin.
          </p>
        </div>

        {/* Search Form */}
        <form
          onSubmit={handleSubmit}
          role="search"
          className="
            group relative flex items-center
            rounded-full border border-[#E5E3D9]
            bg-white p-2
            shadow-[0_10px_35px_rgba(23,43,39,0.05)]
            transition-all duration-300
            focus-within:border-[#84988A]
            focus-within:shadow-[0_12px_40px_rgba(23,43,39,0.10)]
          "
        >
          {/* Search Icon */}
          <div className="flex shrink-0 items-center pl-3 sm:pl-5">
            <Search
              size={20}
              strokeWidth={1.6}
              className="text-[#718477] transition-colors duration-300 group-focus-within:text-[#172B27]"
            />
          </div>

          {/* Search Input */}
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products, ingredients, or concerns..."
            aria-label="Search products, ingredients, or skin concerns"
            className="
              min-w-0 flex-1 border-none bg-transparent
              px-3 py-3.5
              font-sans text-sm font-light text-[#172B27]
              outline-none placeholder:text-[#A0A69F]
              focus:ring-0 sm:px-4 sm:text-base
            "
          />

          {/* Clear Button */}
          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Clear search"
              className="
                mr-1 flex h-9 w-9 shrink-0
                items-center justify-center
                rounded-full text-[#84988A]
                transition-colors duration-200
                hover:bg-[#F0F1EA]
                hover:text-[#172B27]
              "
            >
              <X size={17} />
            </button>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!searchTerm.trim()}
            className="
              flex shrink-0 items-center justify-center gap-2
              rounded-full bg-[#172B27]
              px-5 py-3.5
              font-sans text-xs font-medium tracking-wide
              text-[#F8F6F0]
              transition-all duration-300
              hover:bg-[#294B40]
              disabled:cursor-not-allowed disabled:opacity-40
              sm:px-7
            "
          >
            <span className="hidden sm:inline">Search</span>
            <Search size={16} strokeWidth={1.8} />
          </button>
        </form>

        {/* Search Suggestions */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-3">
          <span className="font-sans text-[9px] font-medium uppercase tracking-[0.2em] text-[#929B91]">
            Explore
          </span>

          {suggestions.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => {
                setSearchTerm(term);
                onSearch?.(term);
              }}
              className="
                rounded-full border border-[#E5E3D9]
                bg-transparent px-4 py-2
                font-sans text-[11px] text-[#65746A]
                transition-all duration-300
                hover:border-[#172B27]
                hover:bg-[#172B27]
                hover:text-[#F8F6F0]
              "
            >
              {term}
            </button>
          ))}
        </div>

        {/* Bottom Decorative Detail */}
        <div className="mt-12 flex items-center justify-center gap-3">
          <span className="h-px w-10 bg-[#E0E3DA]" />
          <span className="h-1 w-1 rounded-full bg-[#84988A]" />
          <span className="h-px w-10 bg-[#E0E3DA]" />
        </div>

      </div>
    </section>
  );
}
