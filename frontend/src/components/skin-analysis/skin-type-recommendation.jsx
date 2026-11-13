
import { Link } from "react-router-dom"
import {
  Droplets,
  Sun,
  Blend,
  Leaf,
  ArrowRight,
} from "lucide-react"

export default function SkinTypeRecommendation() {
  const skinTypes = [
    {
      name: "Oily",
      description: "Balance excess shine and keep pores feeling fresh.",
      icon: Droplets,
      number: "01",
    },
    {
      name: "Dry",
      description: "Discover nourishing care for soft, hydrated skin.",
      icon: Sun,
      number: "02",
    },
    {
      name: "Combination",
      description: "Find the right balance for different skin zones.",
      icon: Blend,
      number: "03",
    },
    {
      name: "Sensitive",
      description: "Explore gentle care for delicate skin.",
      icon: Leaf,
      number: "04",
    },
  ]

  return (
    <section className="bg-[#f8f6f0] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">

        {/* Heading */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="font-sans text-[9px] font-semibold uppercase tracking-[0.35em] text-[#718477]">
            Skincare That Understands You
          </span>

          <h2 className="mt-4 font-editorial text-4xl leading-tight text-[#172b27] sm:text-5xl md:text-6xl">
            Find Your{" "}
            <span className="italic text-[#718477]">
              Perfect Match.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-lg font-sans text-sm leading-7 text-[#879188]">
            Every skin is different. Discover your skin type and explore
            personalized skincare recommendations made around your needs.
          </p>
        </div>

        {/* Skin Type Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {skinTypes.map((type) => {
            const Icon = type.icon

            return (
              <Link
                key={type.name}
                to={`/skin-analyzer?type=${type.name.toLowerCase()}`}
                className="group block outline-none focus-visible:ring-2 focus-visible:ring-[#294b40] focus-visible:ring-offset-4"
              >
                <div className="relative flex min-h-[275px] flex-col overflow-hidden border border-[#e7eae3] bg-white p-7 transition-all duration-500 hover:-translate-y-2 hover:border-[#718477]/60 hover:shadow-[0_18px_45px_rgba(23,43,39,0.08)] sm:p-8">

                  {/* Number */}
                  <span className="absolute right-7 top-7 font-sans text-[10px] tracking-[0.2em] text-[#b3bcb2]">
                    {type.number}
                  </span>

                  {/* Icon */}
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#dfe4dc] bg-[#f3f5ef] transition-all duration-500 group-hover:border-[#294b40] group-hover:bg-[#172b27]">
                    <Icon
                      size={23}
                      strokeWidth={1.4}
                      className="text-[#294b40] transition-colors duration-500 group-hover:text-[#f8f6f0]"
                    />
                  </div>

                  {/* Content */}
                  <div className="mt-8">
                    <h3 className="font-editorial text-3xl text-[#172b27] transition-colors duration-300 group-hover:text-[#718477]">
                      {type.name}
                    </h3>

                    <p className="mt-3 min-h-[48px] font-sans text-xs leading-6 text-[#879188]">
                      {type.description}
                    </p>
                  </div>

                  {/* Bottom Link */}
                  <div className="mt-auto flex items-center justify-between border-t border-[#e7eae3] pt-5">
                    <span className="font-sans text-[9px] font-semibold uppercase tracking-[0.2em] text-[#718477]">
                      Explore Skin Type
                    </span>

                    <ArrowRight
                      size={16}
                      strokeWidth={1.5}
                      className="text-[#294b40] transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Full Assessment */}
        <div className="mt-16 flex flex-col items-center text-center">
          <span className="mb-5 h-px w-12 bg-[#aab6a8]" />

          <p className="mb-5 font-sans text-xs text-[#879188]">
            Not sure about your skin type?
          </p>

          <Link
            to="/skin-analyzer"
            className="group inline-flex items-center gap-3 bg-[#172b27] px-8 py-4 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#f8f6f0] transition-all duration-300 hover:bg-[#294b40]"
          >
            Take Full Skin Assessment

            <ArrowRight
              size={15}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

      </div>
    </section>
  )
}
