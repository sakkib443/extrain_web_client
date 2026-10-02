"use client";

import { motion, useTransform } from "framer-motion";
import { LuLayoutGrid, LuCode, LuHeadphones, LuArrowRight } from "react-icons/lu";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import useSectionMotion from "@/hooks/useSectionMotion";
import BracketLabel from "./BracketLabel";
import TiltCard from "./TiltCard";
import { Star4, Plus, EdgeDots, OrbitRing } from "./Decor";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};
const viewport = { once: true, amount: 0.2 };

const features = [
  { icon: LuLayoutGrid, titleKey: "premiumDesign", descKey: "premiumDesignDesc" },
  { icon: LuCode, titleKey: "readyScripts", descKey: "readyScriptsDesc" },
  { icon: LuHeadphones, titleKey: "lifetimeSupport", descKey: "lifetimeSupportDesc" },
];

// Self-contained: used on the Home page and on /about (it brings its own background).
const WhatWeProvide = () => {
  const { t, language } = useLanguage();
  const isBn = language === "bn";
  const bn = isBn ? "hind-siliguri" : "";

  // ---- smooth scroll + mouse motion (same feel as the other home sections) ----
  const { ref: sectionRef, p, mx, reduce, isLg } = useSectionMotion();
  const s = isLg ? 1 : 0; // card-to-card offsets only where the three cards sit side by side
  const headY = useTransform(p, [0, 1], [20 * s, -20 * s]);
  const cardY0 = useTransform(p, [0, 1], [30 * s, -30 * s]);
  const cardY1 = useTransform(p, [0, 1], [10 * s, -10 * s]);
  const cardY2 = useTransform(p, [0, 1], [44 * s, -44 * s]);
  const cardYs = [cardY0, cardY1, cardY2];
  const ringX = useTransform(mx, [-0.5, 0.5], [28, -28]);
  const ringY = useTransform(p, [0, 1], [60, -60]);
  const ring2X = useTransform(mx, [-0.5, 0.5], [-24, 24]);
  const ring2Y = useTransform(p, [0, 1], [-50, 50]);
  const starY = useTransform(p, [0, 1], [-60, 60]);
  const starX = useTransform(mx, [-0.5, 0.5], [-22, 22]);
  const plusY = useTransform(p, [0, 1], [50, -50]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[color:var(--tone-soft)] py-24 text-white lg:py-32"
    >
      {/* ===== background decoration ===== */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-20 left-1/4 h-80 w-80 rounded-full bg-[#F8921C]/[0.06] blur-3xl" />
        <div className="absolute -bottom-24 right-1/4 h-72 w-72 rounded-full bg-[#F8921C]/[0.05] blur-3xl" />
        <EdgeDots />
        <motion.div
          style={reduce ? undefined : { x: ringX, y: ringY }}
          className="absolute -left-[14rem] top-[12%] hidden sm:block"
        >
          <div className="relative aspect-square w-[30rem]">
            <OrbitRing dashed className="absolute inset-0 border-white/[0.10]" />
            <OrbitRing reverse dot="bottom" className="absolute inset-[16%] border-white/[0.07]" />
          </div>
        </motion.div>
        <motion.div
          style={reduce ? undefined : { x: ring2X, y: ring2Y }}
          className="absolute -right-[12rem] bottom-[2%] hidden md:block"
        >
          <div className="relative aspect-square w-[24rem]">
            <OrbitRing reverse dot="bottom" className="absolute inset-0 border-[#F8921C]/20" />
            <OrbitRing dashed className="absolute inset-[18%] border-white/[0.07]" />
          </div>
        </motion.div>
        <motion.div style={reduce ? undefined : { x: starX, y: starY }} className="absolute right-[10%] top-[9%] hidden md:block">
          <Star4 size={38} filled className="decor-float text-[#F8921C]" style={{ animationDuration: "10s" }} />
        </motion.div>
        <motion.div style={reduce ? undefined : { y: plusY }} className="absolute bottom-[10%] left-[8%] hidden md:block">
          <Plus size={22} className="text-white/25" />
        </motion.div>
      </div>

      <div className="container relative z-10 mx-auto px-6 lg:px-10">
        {/* ===== heading ===== */}
        <motion.div style={reduce ? undefined : { y: headY }} className="mx-auto max-w-2xl text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewport} className="mb-7">
            <BracketLabel bn={bn} size="lg">{t("whatWeProvide.badge")}</BracketLabel>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            custom={1}
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            style={{ color: "#fff" }}
            className={`text-[1.7rem] font-bold leading-[1.25] sm:text-3xl lg:text-[2.35rem] ${bn}`}
          >
            {t("whatWeProvide.title1")}
            <i className="font-light">{t("whatWeProvide.title2")}</i>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={2}
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            className={`mt-4 text-sm leading-7 text-white/60 sm:text-base ${bn}`}
          >
            {t("whatWeProvide.subtitle")}
          </motion.p>
        </motion.div>

        {/* ===== feature cards ===== */}
        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                style={reduce ? undefined : { y: cardYs[index % cardYs.length] }}
                className="h-full"
              >
                <motion.div
                  variants={fadeUp}
                  custom={index}
                  initial="hidden"
                  whileInView="show"
                  viewport={viewport}
                  className="h-full"
                >
                  {/* leans toward the mouse + a light follows the pointer */}
                  <TiltCard className="h-full" radius="1rem">
                    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#F8921C]/60 hover:bg-white/[0.05] hover:shadow-[0_24px_50px_-28px_rgba(248,146,28,0.55)] lg:p-8">
                      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#F8921C]/[0.07] transition-opacity duration-500 group-hover:bg-[#F8921C]/[0.14]" />

                      <div className="relative flex items-start justify-between">
                        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#F8921C]/10 text-[#F8921C] transition-colors duration-300 group-hover:bg-[#F8921C] group-hover:text-black">
                          <Icon size={28} />
                        </div>
                        <span className="text-sm font-bold tabular-nums text-white/25 transition-colors group-hover:text-[#F8921C]">
                          0{index + 1}
                        </span>
                      </div>

                      <h3
                        style={{ color: "#fff" }}
                        className={`relative mt-6 text-xl font-semibold leading-snug lg:text-[1.35rem] ${bn}`}
                      >
                        {t(`whatWeProvide.features.${feature.titleKey}`)}
                      </h3>
                      <p className={`relative mt-3 mb-6 flex-1 text-sm leading-7 text-white/60 ${bn}`}>
                        {t(`whatWeProvide.features.${feature.descKey}`)}
                      </p>

                      <div className="relative flex items-center justify-between border-t border-white/10 pt-4">
                        <span className={`text-xs font-bold uppercase text-white ${bn ? "tracking-normal" : "tracking-widest"} ${bn}`}>
                          {t("whatWeProvide.learnMore")}
                        </span>
                        <span className="grid h-9 w-9 place-items-center rounded-full bg-[#F8921C]/10 text-[#F8921C] transition-colors duration-300 group-hover:bg-[#F8921C] group-hover:text-black">
                          <LuArrowRight size={16} className="-rotate-45 transition-transform duration-300 group-hover:rotate-0" />
                        </span>
                      </div>

                      <span className="absolute bottom-0 left-0 h-[3px] w-0 rounded-b-2xl bg-[#F8921C] transition-all duration-500 group-hover:w-full" />
                    </div>
                  </TiltCard>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* ===== link ===== */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="mt-14 flex justify-center"
        >
          <Link
            href="/about"
            className="group inline-flex items-center gap-4 rounded-full border border-white/15 bg-white/[0.03] py-2 pl-8 pr-2 text-white transition-all duration-300 hover:border-[#F8921C]/70 hover:bg-white/[0.06] hover:shadow-[0_18px_40px_-24px_rgba(248,146,28,0.7)]"
          >
            <span className={`text-sm font-semibold ${bn}`}>{t("whatWeProvide.learnMoreAboutUs")}</span>
            <span className="grid h-11 w-11 place-items-center rounded-full bg-[#F8921C] text-black transition-transform duration-300 group-hover:translate-x-0.5">
              <LuArrowRight size={18} />
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default WhatWeProvide;
