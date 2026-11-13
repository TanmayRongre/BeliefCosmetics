
"use client"

import { useState } from "react"
import {
  AlertCircle,
  Check,
  Droplets,
  Sparkles,
  ShieldCheck,
  Sun,
  Moon,
  Leaf,
  ArrowRight,
} from "lucide-react"
import Stepper, { Step } from "@/components/ui/Stepper"

export default function SkinAnalyzerForm({ onAnalysisComplete }) {
  const [currentStep, setCurrentStep] = useState(1)

  const [answers, setAnswers] = useState({
    skinType: "",
    concerns: [],
    allergies: [],
    sleep: "",
    outdoors: false,
    sunscreen: false,
    currentRoutine: [],
    reactions: false,
    medications: "",
    goal: "",
  })

  const updateAnswer = (field, value) => {
    setAnswers((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const toggleArrayAnswer = (field, value) => {
    setAnswers((prev) => {
      const current = prev[field]
      const updated = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]

      return {
        ...prev,
        [field]: updated,
      }
    })
  }

  // Skin type options
  const skinTypes = [
    {
      id: "Oily",
      label: "Oily",
      desc: "Shiny T-zone, enlarged pores",
      image: "/OilySkin.jpg",
    },
    {
      id: "Dry",
      label: "Dry",
      desc: "Tight, flaky, rough texture",
      image: "/DrySkin.jpg",
    },
    {
      id: "Combination",
      label: "Combination",
      desc: "Oily T-zone, dry cheeks",
      image: "/combinationskin.jpg",
    },
    {
      id: "Normal",
      label: "Normal",
      desc: "Balanced, few imperfections",
      image: "/normalSkin.jpg",
    },
    {
      id: "Sensitive",
      label: "Sensitive",
      desc: "Redness, irritation prone",
      image: "/sensitveSkin.jpg",
    },
  ]

  // Skin concerns
  const concerns = [
    { id: "Acne", label: "Acne", image: "/Acne.jpg", desc: "Inflamed spots and pimples" },
    { id: "Breakouts", label: "Breakouts", image: "/Breakout.jpg", desc: "Sudden appearance of pimples" },
    { id: "Blackheads", label: "Blackheads", image: "/Blackheads.jpg", desc: "Open clogged pores" },
    { id: "Large pores", label: "Large pores", image: "/Largepores.jpg", desc: "Visible skin texture openings" },
    { id: "Pigmentation", label: "Pigmentation", image: "/Pigmentation.jpg", desc: "Dark patches on skin" },
    { id: "Dark spots", label: "Dark spots", image: "/Darkspots.jpg", desc: "Localized dark marks" },
    { id: "Uneven tone", label: "Uneven tone", image: "/UnevenTone.jpg", desc: "Inconsistent skin color" },
    { id: "Dullness", label: "Dullness", image: "/Dullness.jpg", desc: "Lack of radiance/glow" },
    { id: "Uneven texture", label: "Uneven texture", image: "/UnevenTexture.jpg", desc: "Rough or bumpy surface" },
    { id: "Fine lines", label: "Fine lines", image: "/Finelines.jpg", desc: "Small shallow wrinkles" },
    { id: "Wrinkles", label: "Wrinkles", image: "/Wrinkles.jpg", desc: "Deep creases and folds" },
    { id: "Loss of firmness", label: "Loss of firmness", image: "/LossOfFirmness.jpg", desc: "Sagging or loose skin" },
    { id: "Dryness", label: "Dryness", image: "/Dryness.jpg", desc: "Lack of moisture/oil" },
    { id: "Flakiness", label: "Flakiness", image: "/Flakiness.jpg", desc: "Peeling or scaling skin" },
    { id: "Redness", label: "Redness", image: "/Redness.jpg", desc: "Flushed or irritated skin" },
    { id: "Rosacea", label: "Rosacea", image: "/Rosacea.jpg", desc: "Chronic redness and bumps" },
    { id: "Sensitivity", label: "Sensitivity", image: "/sensitveSkin.jpg", desc: "Easily irritated skin" },
    { id: "Dark circles", label: "Dark circles", image: "/Darkcircles.jpg", desc: "Darkness under eyes" },
    { id: "Puffiness", label: "Puffiness", image: "/puffiness.jpg", desc: "Swelling around eyes" },
  ]

  const allergies = [
    "Parabens",
    "Sulfates",
    "Fragrance",
    "Alcohol",
    "Silicones",
    "Essential-oils",
  ]

  const routineItems = [
    "Vitamin C",
    "Retinol",
    "AHAs/BHAs",
    "Niacinamide",
    "Hyaluronic Acid",
    "None",
  ]

  const goals = [
    "Hydration",
    "Glow & Brightening",
    "Anti-ageing",
    "Reduce Breakouts",
    "Even Tone",
  ]

  const isNextDisabled = currentStep === 1 && !answers.skinType

  // Reusable selection button
  const SelectionButton = ({ selected, children, onClick, className = "" }) => (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex items-center justify-between gap-3 border px-4 py-3.5 text-left font-sans text-xs transition-all duration-300 ${selected
          ? "border-[#294b40] bg-[#e9eee8] text-[#172b27] ring-1 ring-[#294b40]/20"
          : "border-[#e7eae3] bg-white text-[#718078] hover:border-[#718477] hover:bg-[#f5f6f1]"
        } ${className}`}
    >
      <span>{children}</span>

      {selected && (
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#294b40] text-white">
          <Check size={12} strokeWidth={2.5} />
        </span>
      )}
    </button>
  )

  // Reusable section heading
  const StepHeading = ({ eyebrow, title, description }) => (
    <div className="mb-8">
      <span className="font-sans text-[9px] font-semibold uppercase tracking-[0.3em] text-[#718477]">
        {eyebrow}
      </span>

      <h2 className="mt-3 font-editorial text-3xl leading-tight text-[#172b27] sm:text-4xl">
        {title}
      </h2>

      {description && (
        <p className="mt-3 max-w-xl font-sans text-xs leading-6 text-[#879188] sm:text-sm">
          {description}
        </p>
      )}
    </div>
  )

  return (
    <section className="mx-auto w-full max-w-4xl py-6 sm:py-10">

      {/* Intro */}
      <div className="mb-8 px-4 text-center">
        <span className="font-sans text-[9px] font-semibold uppercase tracking-[0.35em] text-[#718477]">
          Belief Cosmetics
        </span>

        <h1 className="mt-3 font-editorial text-4xl text-[#172b27] sm:text-5xl">
          Your Skin, <span className="italic text-[#718477]">Understood.</span>
        </h1>

        <p className="mx-auto mt-3 max-w-md font-sans text-xs leading-6 text-[#879188]">
          A thoughtful assessment to help discover skincare recommendations
          that align with your skin and lifestyle.
        </p>
      </div>

      <div className="overflow-hidden border border-[#e7eae3] bg-[#fdfcf9] p-3 shadow-[0_12px_45px_rgba(23,43,39,0.04)] sm:p-6 md:p-8">

        <Stepper
          initialStep={1}
          onStepChange={(step) => setCurrentStep(step)}
          onFinalStepCompleted={() => onAnalysisComplete(answers)}
          backButtonText="Back"
          nextButtonText="Continue"
          stepCircleContainerClassName="bg-[#f8f6f0]"
          isNextDisabled={isNextDisabled}
        >

          {/* STEP 1: SKIN TYPE */}
          <Step>
            <div className="space-y-6 px-1 sm:px-2">

              <StepHeading
                eyebrow="Step 01 · Know Your Skin"
                title={<>How would you describe your <span className="italic text-[#718477]">skin type?</span></>}
                description="Choose the option that best describes how your skin naturally feels and behaves."
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {skinTypes.map((type) => {
                  const isSelected = answers.skinType === type.id

                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => updateAnswer("skinType", type.id)}
                      aria-pressed={isSelected}
                      className={`group relative flex min-h-[175px] overflow-hidden border text-left transition-all duration-500 sm:min-h-[190px] ${isSelected
                          ? "border-[#294b40] ring-2 ring-[#294b40]/20"
                          : "border-[#e7eae3] hover:border-[#718477]"
                        }`}
                    >
                      <img
                        src={type.image}
                        alt={type.label}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />

                      <div className={`absolute inset-0 bg-gradient-to-t from-[#101b17]/95 via-[#101b17]/35 to-transparent transition-opacity duration-300 ${isSelected ? "opacity-100" : "opacity-85 group-hover:opacity-95"
                        }`} />

                      {isSelected && (
                        <span className="absolute right-4 top-4 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-[#f8f6f0] text-[#294b40]">
                          <Check size={15} />
                        </span>
                      )}

                      <div className="relative z-10 mt-auto w-full p-5">
                        <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#d2dfd0]">
                          Skin Profile
                        </span>

                        <h3 className="mt-1 font-editorial text-2xl text-white">
                          {type.label}
                        </h3>

                        <p className="mt-1 font-sans text-[11px] text-white/75">
                          {type.desc}
                        </p>

                        <div className={`mt-3 h-px bg-white/60 transition-all duration-500 ${isSelected ? "w-12" : "w-0 group-hover:w-12"
                          }`} />
                      </div>
                    </button>
                  )
                })}
              </div>

              {!answers.skinType && (
                <p className="font-sans text-[10px] text-[#879188]">
                  Select a skin type to continue.
                </p>
              )}
            </div>
          </Step>

          {/* STEP 2: SKIN CONCERNS */}
          <Step>
            <div className="space-y-6 px-1 sm:px-2">

              <StepHeading
                eyebrow="Step 02 · Understand Your Concerns"
                title={<>What are your main <span className="italic text-[#718477]">skin concerns?</span></>}
                description="Select all that apply. You can choose multiple concerns."
              />

              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
                {concerns.map((concern) => {
                  const isSelected = answers.concerns.includes(concern.id)

                  return (
                    <div key={concern.id} className="group relative">

                      <button
                        type="button"
                        onClick={() => toggleArrayAnswer("concerns", concern.id)}
                        aria-pressed={isSelected}
                        className={`flex min-h-[54px] w-full items-center justify-between gap-2 border px-3 py-3 text-left font-sans text-[10px] transition-all duration-300 sm:text-xs ${isSelected
                            ? "border-[#294b40] bg-[#e9eee8] text-[#172b27]"
                            : "border-[#e7eae3] bg-white text-[#718078] hover:border-[#718477]"
                          }`}
                      >
                        <span>{concern.label}</span>

                        {isSelected && (
                          <Check size={13} className="shrink-0 text-[#294b40]" />
                        )}
                      </button>

                      {/* Hover Information */}
                      <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-3 w-48 -translate-x-1/2 translate-y-2 overflow-hidden border border-[#e7eae3] bg-white opacity-0 shadow-xl transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        <div className="h-28 overflow-hidden">
                          <img
                            src={concern.image}
                            alt={concern.label}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="p-3 text-center">
                          <p className="font-editorial text-lg text-[#172b27]">
                            {concern.label}
                          </p>

                          <p className="mt-1 font-sans text-[10px] leading-4 text-[#879188]">
                            {concern.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <p className="font-sans text-[10px] text-[#879188]">
                {answers.concerns.length} concern(s) selected
              </p>
            </div>
          </Step>

          {/* STEP 3: ALLERGIES */}
          <Step>
            <div className="space-y-6 px-1 sm:px-2">

              <StepHeading
                eyebrow="Step 03 · Your Skin's Safety"
                title={<>Any allergies or <span className="italic text-[#718477]">sensitivities?</span></>}
                description="Select ingredients that you know your skin reacts to. Leave everything unselected if you have none."
              />

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {allergies.map((allergy) => (
                  <SelectionButton
                    key={allergy}
                    selected={answers.allergies.includes(allergy)}
                    onClick={() => toggleArrayAnswer("allergies", allergy)}
                  >
                    {allergy}
                  </SelectionButton>
                ))}
              </div>

              <div className="border border-[#dfe4dc] bg-[#f3f5ef] p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <ShieldCheck
                    size={19}
                    strokeWidth={1.5}
                    className="mt-0.5 shrink-0 text-[#294b40]"
                  />

                  <div className="flex-1">
                    <h3 className="font-editorial text-xl text-[#172b27]">
                      No known sensitivities?
                    </h3>

                    <p className="mt-1 font-sans text-[11px] leading-5 text-[#879188]">
                      Select none if you don't have any known ingredient allergies.
                    </p>

                    <button
                      type="button"
                      onClick={() => updateAnswer("allergies", [])}
                      className={`mt-3 inline-flex items-center gap-2 border px-4 py-2 font-sans text-[10px] font-semibold uppercase tracking-wider transition-all ${answers.allergies.length === 0
                          ? "border-[#294b40] bg-[#294b40] text-white"
                          : "border-[#dfe4dc] bg-white text-[#294b40] hover:border-[#294b40]"
                        }`}
                    >
                      {answers.allergies.length === 0 && <Check size={13} />}
                      None
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Step>

          {/* STEP 4: LIFESTYLE */}
          <Step>
            <div className="space-y-8 px-1 sm:px-2">

              <StepHeading
                eyebrow="Step 04 · Everyday Habits"
                title={<>A little about your <span className="italic text-[#718477]">lifestyle.</span></>}
                description="Your daily habits can help us better understand your skincare needs."
              />

              {/* Sleep */}
              <div className="border-b border-[#e7eae3] pb-7">
                <div className="mb-4 flex items-center gap-3">
                  <Moon size={18} className="text-[#718477]" strokeWidth={1.5} />

                  <label className="font-editorial text-xl text-[#172b27]">
                    How many hours of sleep do you get?
                  </label>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {["< 6 hours", "6-8 hours", "> 8 hours"].map((opt) => (
                    <SelectionButton
                      key={opt}
                      selected={answers.sleep === opt}
                      onClick={() => updateAnswer("sleep", opt)}
                      className="justify-center text-center"
                    >
                      {opt}
                    </SelectionButton>
                  ))}
                </div>
              </div>

              {/* Sunscreen */}
              <div className="border-b border-[#e7eae3] pb-7">
                <div className="mb-4 flex items-center gap-3">
                  <Sun size={18} className="text-[#718477]" strokeWidth={1.5} />

                  <label className="font-editorial text-xl text-[#172b27]">
                    Do you use sunscreen daily?
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <SelectionButton
                    selected={answers.sunscreen === true}
                    onClick={() => updateAnswer("sunscreen", true)}
                    className="justify-center"
                  >
                    Yes, always
                  </SelectionButton>

                  <SelectionButton
                    selected={answers.sunscreen === false}
                    onClick={() => updateAnswer("sunscreen", false)}
                    className="justify-center"
                  >
                    No / Sometimes
                  </SelectionButton>
                </div>
              </div>

              {/* Outdoors */}
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <Sparkles size={18} className="text-[#718477]" strokeWidth={1.5} />

                  <label className="font-editorial text-xl text-[#172b27]">
                    Do you spend a lot of time outdoors?
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <SelectionButton
                    selected={answers.outdoors === true}
                    onClick={() => updateAnswer("outdoors", true)}
                    className="justify-center"
                  >
                    Yes
                  </SelectionButton>

                  <SelectionButton
                    selected={answers.outdoors === false}
                    onClick={() => updateAnswer("outdoors", false)}
                    className="justify-center"
                  >
                    No
                  </SelectionButton>
                </div>
              </div>
            </div>
          </Step>

          {/* STEP 5: CURRENT ROUTINE */}
          <Step>
            <div className="space-y-7 px-1 sm:px-2">

              <StepHeading
                eyebrow="Step 05 · Existing Skincare"
                title={<>What's in your current <span className="italic text-[#718477]">routine?</span></>}
                description="Tell us which active ingredients you currently use in your skincare routine."
              />

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {routineItems.map((item) => (
                  <SelectionButton
                    key={item}
                    selected={answers.currentRoutine.includes(item)}
                    onClick={() => toggleArrayAnswer("currentRoutine", item)}
                    className="min-h-[58px]"
                  >
                    {item}
                  </SelectionButton>
                ))}
              </div>

              {/* Safety Check */}
              <div className="border border-[#e8d9bf] bg-[#faf5eb] p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle
                    size={21}
                    strokeWidth={1.6}
                    className="mt-0.5 shrink-0 text-[#a17b42]"
                  />

                  <div className="min-w-0 flex-1">
                    <span className="font-sans text-[9px] font-semibold uppercase tracking-[0.2em] text-[#a17b42]">
                      Important Safety Check
                    </span>

                    <h3 className="mt-2 font-editorial text-xl text-[#172b27]">
                      Have you ever had a severe reaction to skincare products?
                    </h3>

                    <p className="mt-2 font-sans text-[11px] leading-5 text-[#8b806d]">
                      This helps us take your previous skincare experiences into account.
                    </p>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => updateAnswer("reactions", true)}
                        className={`flex min-w-[100px] items-center justify-center gap-2 border px-5 py-2.5 font-sans text-xs transition-all ${answers.reactions === true
                            ? "border-[#a17b42] bg-[#a17b42] text-white"
                            : "border-[#e8d9bf] bg-white text-[#806d4f] hover:border-[#a17b42]"
                          }`}
                      >
                        {answers.reactions === true && <Check size={13} />}
                        Yes
                      </button>

                      <button
                        type="button"
                        onClick={() => updateAnswer("reactions", false)}
                        className={`flex min-w-[100px] items-center justify-center gap-2 border px-5 py-2.5 font-sans text-xs transition-all ${answers.reactions === false
                            ? "border-[#294b40] bg-[#294b40] text-white"
                            : "border-[#e8d9bf] bg-white text-[#806d4f] hover:border-[#294b40]"
                          }`}
                      >
                        {answers.reactions === false && <Check size={13} />}
                        No
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Step>

          {/* STEP 6: PRIMARY GOAL */}
          <Step>
            <div className="space-y-6 px-1 sm:px-2">

              <StepHeading
                eyebrow="Step 06 · Your Skincare Goals"
                title={<>What would you love your skin to <span className="italic text-[#718477]">achieve?</span></>}
                description="Choose your primary skincare goal so we can tailor your recommendations."
              />

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {goals.map((goal, index) => {
                  const isSelected = answers.goal === goal

                  return (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => updateAnswer("goal", goal)}
                      aria-pressed={isSelected}
                      className={`group flex min-h-[76px] items-center justify-between gap-3 border px-5 py-4 text-left transition-all duration-300 ${isSelected
                          ? "border-[#294b40] bg-[#e9eee8] ring-1 ring-[#294b40]/20"
                          : "border-[#e7eae3] bg-white hover:border-[#718477] hover:bg-[#f5f6f1]"
                        }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="font-sans text-[9px] tracking-widest text-[#a4afa3]">
                          0{index + 1}
                        </span>

                        <span className={`font-editorial text-xl ${isSelected ? "text-[#172b27]" : "text-[#52645a]"
                          }`}>
                          {goal}
                        </span>
                      </div>

                      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all ${isSelected
                          ? "border-[#294b40] bg-[#294b40] text-white"
                          : "border-[#dfe4dc] text-transparent group-hover:border-[#718477]"
                        }`}>
                        <Check size={13} />
                      </span>
                    </button>
                  )
                })}
              </div>

              {answers.goal && (
                <div className="flex items-center gap-3 border border-[#dfe4dc] bg-[#f3f5ef] p-4">
                  <Leaf size={17} className="shrink-0 text-[#718477]" />

                  <p className="font-sans text-[11px] text-[#52645a]">
                    Your primary goal: <span className="font-semibold text-[#172b27]">{answers.goal}</span>
                  </p>
                </div>
              )}

              <div className="border-t border-[#e7eae3] pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e9eee8]">
                    <Droplets size={18} className="text-[#294b40]" strokeWidth={1.5} />
                  </div>

                  <div>
                    <p className="font-editorial text-lg text-[#172b27]">
                      Your skin journey starts here.
                    </p>

                    <p className="font-sans text-[10px] text-[#879188]">
                      Complete the assessment to explore your recommendations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Step>

        </Stepper>
      </div>
    </section>
  )
}
