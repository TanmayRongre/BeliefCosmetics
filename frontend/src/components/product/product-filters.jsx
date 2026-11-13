
import { ChevronRight, Check, RotateCcw } from "lucide-react"
import { useState } from "react"

export default function ProductFilters({ filters, setFilters }) {
  const [expandedSections, setExpandedSections] = useState({
    skinType: false,
    category: false,
    price: false,
    concern: false,
  })

  const skinTypes = [
    "Oily",
    "Dry",
    "Combination",
    "Sensitive",
    "Normal",
  ]

  const categories = [
    "Face Wash",
    "Bath Salt",
    "Ubtan",
    "Soap",
    "Gel",
    "Fragrance Balm",
  ]

  const concerns = [
    "Acne",
    "Breakouts",
    "Blackheads",
    "Large pores",
    "Uneven texture",
    "Pigmentation",
    "Dark spots",
    "Uneven tone",
    "Dullness",
    "Fine lines",
    "Wrinkles",
    "Loss of firmness",
    "Dryness",
    "Flakiness",
    "Redness",
    "Rosacea",
    "Sensitivity",
    "Dark circles",
    "Puffiness",
  ]

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      skinType: false,
      category: false,
      price: false,
      concern: false,
      [section]: !prev[section],
    }))
  }

  const handleFilterChange = (key, value) => {
    setFilters({
      ...filters,
      [key]: filters[key].includes(value)
        ? filters[key].filter((item) => item !== value)
        : [...filters[key], value],
    })
  }

  const clearAll = () => {
    setFilters({
      skinType: [],
      category: [],
      priceRange: [0, 5000],
      concern: [],
    })
  }

  const hasActiveFilters =
    filters.skinType.length > 0 ||
    filters.category.length > 0 ||
    filters.concern.length > 0 ||
    filters.priceRange[0] !== 0 ||
    filters.priceRange[1] !== 5000

  const activeCount =
    filters.skinType.length +
    filters.category.length +
    filters.concern.length +
    (filters.priceRange[0] !== 0 ||
      filters.priceRange[1] !== 5000
      ? 1
      : 0)

  const sections = [
    {
      id: "skinType",
      title: "Skin Type",
      description: "Find your skin match",
      options: skinTypes,
    },
    {
      id: "category",
      title: "Category",
      description: "Explore product types",
      options: categories,
    },
    {
      id: "concern",
      title: "Skin Concerns",
      description: "Care for what matters",
      options: concerns,
    },
  ]

  const selectedPrice = filters.priceRange[1]

  return (
    <aside className="font-sans text-[#172b27]">

      {/* Filter Header */}
      <div className="mb-7 flex items-center justify-between border-b border-[#e7eae3] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-editorial text-2xl text-[#172b27]">
              Filters
            </h2>

            {activeCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#294b40] px-1.5 text-[9px] font-semibold text-white">
                {activeCount}
              </span>
            )}
          </div>

          <p className="mt-1 text-[9px] font-medium uppercase tracking-[0.18em] text-[#879188]">
            Refine your selection
          </p>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="group inline-flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.13em] text-[#879188] transition-colors hover:text-[#294b40]"
          >
            <RotateCcw
              size={12}
              className="transition-transform duration-300 group-hover:-rotate-45"
            />
            Clear All
          </button>
        )}
      </div>

      {/* Selected Filters */}
      {activeCount > 0 && (
        <div className="mb-7">
          <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#879188]">
            Active Selections
          </p>

          <div className="flex flex-wrap gap-2">
            {[
              ...filters.skinType.map((value) => ({
                key: "skinType",
                value,
              })),
              ...filters.category.map((value) => ({
                key: "category",
                value,
              })),
              ...filters.concern.map((value) => ({
                key: "concern",
                value,
              })),
            ].map((item) => (
              <button
                key={`${item.key}-${item.value}`}
                type="button"
                onClick={() =>
                  handleFilterChange(item.key, item.value)
                }
                className="inline-flex items-center gap-2 border border-[#dfe4dc] bg-[#edf0e9] px-3 py-2 text-[10px] text-[#294b40] transition-colors hover:border-[#718477]"
              >
                {item.value}
                <span className="text-[#879188]">×</span>
              </button>
            ))}

            {(filters.priceRange[0] !== 0 ||
              filters.priceRange[1] !== 5000) && (
                <button
                  type="button"
                  onClick={() =>
                    setFilters({
                      ...filters,
                      priceRange: [0, 5000],
                    })
                  }
                  className="inline-flex items-center gap-2 border border-[#dfe4dc] bg-[#edf0e9] px-3 py-2 text-[10px] text-[#294b40] transition-colors hover:border-[#718477]"
                >
                  ₹{filters.priceRange[0]} – ₹
                  {filters.priceRange[1]}
                  <span className="text-[#879188]">×</span>
                </button>
              )}
          </div>
        </div>
      )}

      {/* Filter Accordions */}
      <div>
        {sections.map((section) => {
          const isExpanded = expandedSections[section.id]
          const selectedValues = filters[section.id]

          return (
            <div
              key={section.id}
              className="border-b border-[#e7eae3] py-5"
            >
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                aria-expanded={isExpanded}
                className="group flex w-full items-center justify-between gap-3 text-left"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.17em] text-[#294b40] transition-colors group-hover:text-[#718477]">
                      {section.title}
                    </span>

                    {selectedValues.length > 0 && (
                      <span className="text-[9px] font-medium text-[#718477]">
                        ({selectedValues.length})
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-[10px] text-[#9aa49a]">
                    {section.description}
                  </p>
                </div>

                <ChevronRight
                  size={16}
                  className={`shrink-0 text-[#879188] transition-transform duration-300 ${isExpanded ? "rotate-90" : ""
                    }`}
                />
              </button>

              <div
                className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isExpanded
                    ? "grid-rows-[1fr]"
                    : "grid-rows-[0fr]"
                  }`}
              >
                <div className="overflow-hidden">
                  <div className="space-y-1 pt-5">
                    {section.options.map((option) => {
                      const isSelected =
                        selectedValues.includes(option)

                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() =>
                            handleFilterChange(
                              section.id,
                              option
                            )
                          }
                          aria-pressed={isSelected}
                          className={`group flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left transition-all duration-200 ${isSelected
                              ? "bg-[#edf0e9] text-[#294b40]"
                              : "text-[#718078] hover:bg-[#f3f4ee] hover:text-[#172b27]"
                            }`}
                        >
                          <span
                            className={`text-xs ${isSelected
                                ? "font-semibold"
                                : "font-normal"
                              }`}
                          >
                            {option}
                          </span>

                          <span
                            className={`flex h-4 w-4 shrink-0 items-center justify-center border transition-all ${isSelected
                                ? "border-[#294b40] bg-[#294b40] text-white"
                                : "border-[#d5ddd4] bg-transparent text-transparent group-hover:border-[#718477]"
                              }`}
                          >
                            {isSelected && <Check size={10} />}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {/* Price Range */}
        <div className="py-5">
          <button
            type="button"
            onClick={() => toggleSection("price")}
            aria-expanded={expandedSections.price}
            className="group flex w-full items-center justify-between gap-3 text-left"
          >
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.17em] text-[#294b40] transition-colors group-hover:text-[#718477]">
                Price Range
              </span>

              <p className="mt-1 text-[10px] text-[#9aa49a]">
                Find your everyday essentials
              </p>
            </div>

            <ChevronRight
              size={16}
              className={`shrink-0 text-[#879188] transition-transform duration-300 ${expandedSections.price ? "rotate-90" : ""
                }`}
            />
          </button>

          <div
            className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${expandedSections.price
                ? "grid-rows-[1fr]"
                : "grid-rows-[0fr]"
              }`}
          >
            <div className="overflow-hidden">
              <div className="pt-6">

                {/* Price values */}
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="mb-1 text-[8px] font-semibold uppercase tracking-[0.15em] text-[#9aa49a]">
                      Minimum
                    </p>
                    <span className="font-editorial text-xl text-[#172b27]">
                      ₹{filters.priceRange[0]}
                    </span>
                  </div>

                  <span className="mx-3 h-px flex-1 bg-[#dfe4dc]" />

                  <div className="text-right">
                    <p className="mb-1 text-[8px] font-semibold uppercase tracking-[0.15em] text-[#9aa49a]">
                      Maximum
                    </p>
                    <span className="font-editorial text-xl text-[#172b27]">
                      ₹{selectedPrice}
                    </span>
                  </div>
                </div>

                {/* Range slider */}
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
                  value={selectedPrice}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      priceRange: [
                        filters.priceRange[0],
                        Number.parseInt(e.target.value, 10),
                      ],
                    })
                  }
                  aria-label="Maximum price"
                  className="h-1 w-full cursor-pointer appearance-none rounded-full bg-[#dfe4dc] accent-[#294b40]"
                />

                <div className="mt-3 flex justify-between text-[9px] font-medium tracking-wide text-[#9aa49a]">
                  <span>₹0</span>
                  <span>₹5,000</span>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setFilters({
                      ...filters,
                      priceRange: [0, 5000],
                    })
                  }
                  className="mt-5 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#718477] underline underline-offset-4 transition-colors hover:text-[#172b27]"
                >
                  Reset price
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom brand note */}
      <div className="mt-5 border-t border-[#e7eae3] pt-5">
        <p className="font-editorial text-lg italic text-[#879188]">
          Thoughtful care, for your skin.
        </p>
      </div>
    </aside>
  )
}
