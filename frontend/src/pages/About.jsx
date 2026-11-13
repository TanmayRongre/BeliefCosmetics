
import React from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import {
  Users,
  Award,
  Leaf,
  Heart,
  ArrowRight,
  Microscope,
  ScanLine,
  ShieldCheck,
  FlaskConical,
  Fingerprint,
  ShieldAlert,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 24, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.65, ease: "easeOut" },
  },
};

const values = [
  {
    icon: Award,
    title: "Quality First",
    desc: "Every formula is tested for safety, stability, and skin compatibility.",
  },
  {
    icon: Leaf,
    title: "Conscious & Responsible",
    desc: "We choose ingredients and packaging that reduce unnecessary harm.",
  },
  {
    icon: Users,
    title: "Inclusive by Design",
    desc: "Products created for different skin types, tones, and concerns.",
  },
  {
    icon: Heart,
    title: "Honest Communication",
    desc: "We don’t promise overnight miracles. We promise consistency and care.",
  },
];

const skinFactors = [
  { icon: Fingerprint, label: "Your specific Skin Type" },
  { icon: Microscope, label: "Unique Skin Concerns" },
  { icon: ShieldAlert, label: "Sensitivities & Allergies" },
];

const problems = [
  {
    title: "Confusion",
    description:
      "Struggling to choose the right product for your unique needs.",
  },
  {
    title: "Mystery",
    description:
      "Not understanding ingredients or what they actually do.",
  },
  {
    title: "Reactions",
    description:
      "Dealing with breakouts caused by wrong formulations.",
  },
];

const sciencePoints = [
  "Balanced concentrations",
  "Skin-barrier friendly",
  "No harsh combinations",
];

const transparencyPoints = [
  "Every ingredient listed",
  "Clear purpose explained",
  "Sensitivity warnings highlighted",
];

function SectionLabel({ children, light = false }) {
  return (
    <div
      className={`inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] ${light ? "text-white/80" : "text-[#718477]"
        }`}
    >
      <span
        className={`h-px w-8 ${light ? "bg-white/70" : "bg-[#718477]"
          }`}
      />
      {children}
    </div>
  );
}

function ArrowButton({ to, children, icon: Icon = ArrowRight }) {
  return (
    <Link
      to={to}
      className="group inline-flex items-center justify-between gap-8 rounded-full bg-[#172b27] py-2 pl-7 pr-2 text-sm font-medium text-white transition-all duration-300 hover:bg-[#294b40] hover:shadow-lg"
    >
      <span>{children}</span>
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f8f6f0] text-[#172b27] transition-transform duration-300 group-hover:rotate-[-35deg]">
        <Icon className="h-4 w-4" />
      </span>
    </Link>
  );
}

function FeatureCard({ icon: Icon, title, description, points, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="group rounded-2xl border border-[#e7eae3] bg-[#f8f6f0] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#718477]/50 hover:shadow-[0_18px_45px_rgba(23,43,39,0.07)] md:p-9"
    >
      <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-full bg-[#e9eee7] text-[#294b40] transition-colors duration-300 group-hover:bg-[#172b27] group-hover:text-white">
        <Icon className="h-6 w-6" strokeWidth={1.5} />
      </div>

      <h3 className="mb-4 font-editorial text-3xl leading-tight text-[#172b27]">
        {title}
      </h3>

      <p className="mb-7 text-sm leading-7 text-[#718077]">
        {description}
      </p>

      <ul className="space-y-3 border-t border-[#e2e7df] pt-6">
        {points.map((point) => (
          <li
            key={point}
            className="flex items-center gap-3 text-sm text-[#43564d]"
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#718477]" />
            {point}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export default function About() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f8f6f0] text-[#172b27]">
      <Header />

      {/* Hero */}
      <section className="relative flex min-h-[620px] items-center overflow-hidden md:min-h-[720px]">
        <img
          src="/about.jpg"
          alt="Belief Cosmetics skincare"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-[#f8f6f0]/75" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#f8f6f0]/95 via-[#f8f6f0]/65 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-28 md:px-12">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="max-w-4xl"
          >
            <motion.div variants={itemVariants}>
              <SectionLabel>Our Philosophy</SectionLabel>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="mt-8 max-w-4xl font-editorial text-6xl leading-[0.98] tracking-tight text-[#172b27] sm:text-7xl md:text-8xl lg:text-[104px]"
            >
              Skincare That
              <br />
              Understands
              <br />
              <span className="italic text-[#718477]">Your Skin.</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-8 max-w-xl text-base leading-8 text-[#58685e] md:text-lg"
            >
              At Belief Cosmetics, we believe skincare should be personal,
              transparent, and backed by real science — not trends. Every skin
              is different, and your skincare should be too.
            </motion.p>

            <motion.div variants={itemVariants} className="mt-9">
              <ArrowButton to="/products">
                Discover our products
              </ArrowButton>
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 right-0 hidden h-24 w-1/3 rounded-tl-[100%] bg-[#f8f6f0]/50 md:block" />
      </section>

      <main className="mx-auto max-w-7xl px-6 pb-24 md:px-12">

        {/* Why We Started */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid items-center gap-14 py-24 md:grid-cols-2 md:gap-20 md:py-32"
        >
          <motion.div variants={itemVariants} className="max-w-xl">
            <SectionLabel>Why We Started</SectionLabel>

            <h2 className="mt-7 font-editorial text-5xl leading-[1.05] text-[#172b27] md:text-6xl">
              The Industry Was
              <br />
              <span className="italic text-[#718477]">
                Missing Something.
              </span>
            </h2>

            <p className="mt-8 text-base leading-8 text-[#718077]">
              The skincare industry is crowded with promises — but too often,
              products are sold without understanding the person using them.
            </p>

            <div className="mt-9 border-l border-[#718477] py-2 pl-6">
              <p className="font-editorial text-2xl italic leading-relaxed text-[#294b40] md:text-3xl">
                “Belief Cosmetics was created to change that — by putting skin
                understanding first.”
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="relative min-h-[540px] overflow-hidden rounded-2xl"
          >
            <img
              src="/image7.avif"
              alt="Skincare confusion"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-[#172b27]/25" />

            <div className="relative flex min-h-[540px] flex-col items-center justify-center gap-5 p-7">
              {problems.map((problem, index) => (
                <motion.div
                  key={problem.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: index * 0.12 }}
                  className={`w-full max-w-sm rounded-xl border border-white/50 bg-[#f8f6f0]/85 p-6 shadow-xl backdrop-blur-md ${index === 1 ? "md:-translate-x-5" : "md:translate-x-5"
                    }`}
                >
                  <div className="mb-2 flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e8ece5] text-sm text-[#718477]">
                      0{index + 1}
                    </span>
                    <h3 className="font-editorial text-2xl text-[#172b27]">
                      {problem.title}
                    </h3>
                  </div>
                  <p className="pl-10 text-sm leading-6 text-[#718077]">
                    {problem.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.section>

        {/* Our Approach */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={containerVariants}
          className="grid items-center gap-14 border-t border-[#e7eae3] py-24 md:grid-cols-2 md:gap-20 md:py-32"
        >
          <motion.div
            variants={itemVariants}
            className="relative order-2 md:order-1"
          >
            <div className="absolute -bottom-5 -left-5 h-2/3 w-2/3 rounded-2xl bg-[#e9eee7]" />

            <div className="relative h-[430px] overflow-hidden rounded-2xl md:h-[540px]">
              <img
                src="https://assets.conversion.ai/i/01766a4d-d92c-4323-9429-c78d860188c9?utm_source=chatgpt.com"
                alt="Personalized skincare analysis"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#172b27]/80 via-transparent to-transparent" />

              <div className="absolute bottom-0 left-0 p-8 md:p-10">
                <div className="mb-3 flex items-center gap-3 text-white">
                  <ScanLine className="h-6 w-6 text-[#c5d2c4]" />
                  <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                    Smart Skin Analysis
                  </span>
                </div>
                <p className="max-w-xs font-editorial text-3xl leading-tight text-white md:text-4xl">
                  A more personal approach to skincare.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="order-1 md:order-2"
          >
            <SectionLabel>Our Approach</SectionLabel>

            <h2 className="mt-7 font-editorial text-5xl leading-[1.05] text-[#172b27] md:text-6xl">
              Skin First,
              <br />
              <span className="italic text-[#718477]">Always.</span>
            </h2>

            <p className="mt-8 text-base leading-8 text-[#718077]">
              We don’t believe in one-size-fits-all skincare. That’s why we
              built a Skin Analyzer that looks at:
            </p>

            <div className="mt-8 space-y-5">
              {skinFactors.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e9eee7] text-[#294b40]">
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <span className="text-sm font-medium text-[#294b40] md:text-base">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            <p className="mt-8 text-sm leading-7 text-[#718077]">
              Based on this, we recommend products that actually make sense
              for your skin — not just what’s trending.
            </p>

            <div className="mt-9">
              <ArrowButton to="/skin-analyzer" icon={ScanLine}>
                Try the Skin Analyzer
              </ArrowButton>
            </div>
          </motion.div>
        </motion.section>

        {/* Science & Transparency */}
        <section
          className="relative mb-24 overflow-hidden rounded-2xl bg-cover bg-center md:mb-32"
          style={{ backgroundImage: "url('/image10.jpg')" }}
        >
          <div className="absolute inset-0 bg-[#172b27]/80" />

          <div className="relative z-10 mx-auto max-w-6xl px-6 py-20 md:px-12 md:py-28">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mx-auto mb-14 max-w-2xl text-center"
            >
              <SectionLabel light>Why Belief</SectionLabel>

              <h2 className="mt-6 font-editorial text-5xl leading-tight text-white md:text-7xl">
                Science & <span className="italic text-[#c5d2c4]">Transparency.</span>
              </h2>

              <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-white/70">
                Thoughtful skincare begins with understanding what goes into
                every product and why it matters.
              </p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2">
              <FeatureCard
                icon={FlaskConical}
                title="Powered by Science, Kept Simple"
                description="Our formulations are created using dermatologically studied ingredients and clean, well-researched actives."
                points={sciencePoints}
              />

              <FeatureCard
                icon={ShieldCheck}
                title="Radical Transparency"
                description="We believe you deserve to know what you’re putting on your skin. No hidden formulas. No confusing claims."
                points={transparencyPoints}
                delay={0.15}
              />
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="mb-24 md:mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-14 text-center"
          >
            <SectionLabel>What We Stand For</SectionLabel>

            <h2 className="mt-6 font-editorial text-5xl text-[#172b27] md:text-6xl">
              Our Values in Practice
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#879188]">
              More than just words on a page. The principles behind everything
              we do.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {values.map((item, index) => (
              <motion.div
                key={item.title}
                variants={itemVariants}
                className="group rounded-2xl border border-[#e7eae3] bg-white/60 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#718477]/50 hover:bg-white hover:shadow-[0_16px_40px_rgba(23,43,39,0.06)] md:p-8"
              >
                <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-full bg-[#e9eee7] text-[#294b40] transition-all duration-300 group-hover:bg-[#172b27] group-hover:text-white">
                  <item.icon className="h-5 w-5" strokeWidth={1.5} />
                </div>

                <span className="text-[10px] font-semibold tracking-[0.2em] text-[#a0aaa0]">
                  0{index + 1}
                </span>

                <h3 className="mt-3 font-editorial text-2xl leading-tight text-[#172b27]">
                  {item.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-[#879188]">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Final CTA */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-2xl bg-[#172b27]"
        >
          <div
            className="absolute inset-0 bg-cover bg-center opacity-[0.12] mix-blend-screen"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&q=80')",
            }}
          />

          <div className="absolute -right-24 -top-32 h-96 w-96 rounded-full border border-white/10" />
          <div className="absolute -right-12 -top-20 h-72 w-72 rounded-full border border-white/10" />

          <div className="relative z-10 mx-auto max-w-4xl px-6 py-20 text-center md:px-12 md:py-28">
            <SectionLabel light>Made With Belief</SectionLabel>

            <h2 className="mt-7 font-editorial text-5xl leading-[1.05] text-white md:text-7xl">
              Built by People
              <br />
              <span className="italic text-[#c5d2c4]">Who Care About Skin.</span>
            </h2>

            <p className="mx-auto mt-7 max-w-2xl text-sm leading-8 text-white/70 md:text-base">
              Belief Cosmetics is built by a team of formulators, technologists,
              and skincare enthusiasts who believe that better skin starts
              with better understanding.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/skin-analyzer"
                className="group inline-flex w-full items-center justify-between gap-6 rounded-full bg-[#f8f6f0] py-2 pl-7 pr-2 text-sm font-medium text-[#172b27] transition-all duration-300 hover:bg-white sm:w-auto"
              >
                <span>Start Your Skin Analysis</span>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e9eee7]">
                  <ScanLine className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
                </span>
              </Link>

              <Link
                to="/products"
                className="group inline-flex w-full items-center justify-between gap-6 rounded-full border border-white/30 py-2 pl-7 pr-2 text-sm font-medium text-white transition-all duration-300 hover:border-white hover:bg-white/10 sm:w-auto"
              >
                <span>Explore Products</span>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            </div>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}
