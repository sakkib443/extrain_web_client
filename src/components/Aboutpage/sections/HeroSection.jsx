"use client";

import React from "react";
import Link from "next/link";
import { motion, useTransform } from "framer-motion";
import { LuMoveRight, LuPlay } from "react-icons/lu";
import { useLanguage } from "@/context/LanguageContext";
import useSectionMotion from "@/hooks/useSectionMotion";
import BracketLabel from "@/components/Home/BracketLabel";
import { Star4, EdgeDots, OrbitRing } from "@/components/Home/Decor";
import { outlineStyle, filledAccent } from "./shared";

const HeroSection = () => {
    const { language } = useLanguage();
    const isBn = language === "bn";
    const bn = isBn ? "hind-siliguri" : "";

    // ---- smooth scroll + mouse motion (same feel as the Home hero) ----
    const { ref: sectionRef, p, mx, my, reduce, isLg } = useSectionMotion();
    const k = isLg ? 1 : 0.4;
    const textY = useTransform(p, [0, 1], [14 * k, -34 * k]);
    const visY = useTransform(p, [0, 1], [22 * k, -22 * k]);
    const imgX = useTransform(mx, [-0.5, 0.5], [12, -12]);
    const imgY = useTransform([p, my], ([pv, mv]) => (pv - 0.5) * -22 + mv * -8);
    const smallX = useTransform(mx, [-0.5, 0.5], [16, -16]);
    const smallY = useTransform(p, [0, 1], [26 * k, -26 * k]);
    const glowX = useTransform(mx, [-0.5, 0.5], [-50, 50]);
    const ringX = useTransform(mx, [-0.5, 0.5], [-28, 28]);
    const ringY = useTransform(p, [0, 1], [-50, 50]);
    const starY = useTransform(p, [0, 1], [-60, 60]);
    const starX = useTransform(mx, [-0.5, 0.5], [-24, 24]);

    return (
        <section ref={sectionRef} id="about-hero" className="relative overflow-hidden bg-[color:var(--tone-deep)] text-white">
            {/* ===== background: the Home hero's streaks + soft glows ===== */}
            <div className="pointer-events-none absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/hero-bg.webp')" }} />
            <div className="pointer-events-none absolute inset-0 bg-black/30" />

            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                <motion.div
                    style={reduce ? undefined : { x: glowX }}
                    className="absolute -bottom-32 left-[8%] h-96 w-96 rounded-full bg-[#F8921C]/[0.10] blur-3xl"
                />
                <EdgeDots />
                <motion.div
                    style={reduce ? undefined : { x: ringX, y: ringY }}
                    className="absolute -right-[16rem] top-[6%] hidden sm:block"
                >
                    <div className="relative aspect-square w-[36rem]">
                        <OrbitRing dashed className="absolute inset-0 border-white/[0.12]" />
                        <OrbitRing reverse dot="bottom" className="absolute inset-[16%] border-[#F8921C]/25" />
                    </div>
                </motion.div>
                <motion.div style={reduce ? undefined : { x: starX, y: starY }} className="absolute left-[44%] top-[9%] hidden lg:block">
                    <Star4 size={34} filled className="decor-float text-[#F8921C]" style={{ animationDuration: "10s" }} />
                </motion.div>
            </div>

            <div className="container relative z-10 mx-auto px-6 lg:px-10">
                <div className="grid items-center gap-16 py-16 lg:min-h-[min(calc(100svh-65px),820px)] lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:py-20">
                    {/* ---------- left: copy ---------- */}
                    <motion.div style={reduce ? undefined : { y: textY }}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                            className="mb-12"
                        >
                            <BracketLabel bn={bn} size="lg">{isBn ? "আমাদের সম্পর্কে" : "About us"}</BracketLabel>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                            style={{ color: "#fff" }}
                            className="relative font-bold uppercase leading-[1.08] tracking-[-0.015em] text-[clamp(2.6rem,6.4vw,5.4rem)]"
                        >
                            {/* top-left bracket */}
                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute -top-4 left-0 hidden h-16 w-16 border-l border-t border-white/90 sm:block"
                            >
                                <i className="absolute -left-[5px] -top-[5px] h-2.5 w-2.5 bg-[#F8921C]" />
                                <i className="absolute -bottom-[5px] -left-[5px] h-2.5 w-2.5 bg-[#F8921C]" />
                            </span>

                            <span className="block text-white sm:pl-[0.55em]">WE ARE</span>
                            <span className="block">
                                <span className="relative inline-block">
                                    <span style={outlineStyle}>
                                        EXTR<span style={filledAccent}>A</span>IN
                                    </span>
                                    <span style={filledAccent}>.</span>
                                    {/* bottom-right bracket */}
                                    <span
                                        aria-hidden="true"
                                        className="pointer-events-none absolute -bottom-3 -right-8 hidden h-14 w-14 border-b border-r border-white/90 sm:block"
                                    >
                                        <i className="absolute -right-[5px] -top-[5px] h-2.5 w-2.5 bg-[#F8921C]" />
                                        <i className="absolute -bottom-[5px] -right-[5px] h-2.5 w-2.5 bg-[#F8921C]" />
                                    </span>
                                </span>
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className={`mt-9 max-w-md border-l-2 border-[#F8921C] py-0.5 pl-5 text-base leading-relaxed text-white/70 lg:text-lg ${bn}`}
                        >
                            {isBn
                                ? "আমরা ডিজিটাল যুগের কারিগর। আধুনিক প্রযুক্তি এবং শৈল্পিক ডিজাইনের সমন্বয়ে আমরা তৈরি করি অসাধারণ ডিজিটাল অভিজ্ঞতা।"
                                : "We are the architects of the digital age. Blending cutting-edge technology with artistic vision to craft exceptional digital experiences."}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.4 }}
                            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4"
                        >
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/contact"
                                    className={`inline-flex items-center rounded-full bg-[#F8921C] px-8 py-4 text-sm font-semibold uppercase tracking-wide text-black transition-colors hover:bg-[#e07d0a] ${bn ? "tracking-normal" : ""} ${bn}`}
                                >
                                    {isBn ? "যোগাযোগ করুন" : "Get in Touch"}
                                </Link>
                                <Link
                                    href="/contact"
                                    aria-label={isBn ? "যোগাযোগ করুন" : "Get in Touch"}
                                    className="grid h-[52px] w-[52px] place-items-center rounded-full bg-white text-[#0a0a0a] transition-colors hover:bg-[#F8921C]"
                                >
                                    <LuMoveRight size={22} />
                                </Link>
                            </div>
                            <Link
                                href="/portfolio"
                                className={`inline-flex items-center rounded-full border border-white/25 px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:border-[#F8921C] hover:text-[#F8921C] ${bn ? "tracking-normal" : ""} ${bn}`}
                            >
                                {isBn ? "পোর্টফোলিও" : "Our Portfolio"}
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* ---------- right: photo collage ---------- */}
                    <motion.div
                        style={reduce ? undefined : { y: visY }}
                        className="relative mx-auto w-full max-w-[540px] pb-10 lg:max-w-none lg:pb-12"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                            className="relative"
                        >
                            {/* offset outline behind the photo */}
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-0 translate-x-3 translate-y-3 rounded-[2rem] rounded-tl-[6rem] border border-[#F8921C]/40 sm:translate-x-4 sm:translate-y-4"
                            />

                            {/* main photo */}
                            <div className="group relative aspect-[5/4.4] overflow-hidden rounded-[2rem] rounded-tl-[6rem] border border-white/10 bg-[color:var(--tone-soft)]">
                                <motion.div
                                    style={reduce ? undefined : { x: imgX, y: imgY, scale: 1.08 }}
                                    className="absolute inset-0"
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src="/hero-office.webp"
                                        alt="Extrain Web Team collaborating on a website development project"
                                        style={{ objectPosition: "96% 30%" }}
                                        className="h-full w-full object-cover"
                                    />
                                </motion.div>
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />

                                {/* Watch Our Story */}
                                <div className="absolute left-12 top-4 flex items-center gap-3 sm:left-16 sm:top-6">
                                    <button
                                        type="button"
                                        aria-label={isBn ? "আমাদের গল্প দেখুন" : "Watch Our Story"}
                                        className="relative grid h-14 w-14 place-items-center rounded-full bg-white text-[#0a0a0a] shadow-xl transition-all duration-300 hover:scale-110 hover:bg-[#F8921C]"
                                    >
                                        <span aria-hidden="true" className="absolute inset-0 animate-ping rounded-full border border-white/40 [animation-duration:2.6s]" />
                                        <LuPlay size={20} className="relative ml-0.5" />
                                    </button>
                                    <span
                                        className={`hidden w-24 text-[10px] font-bold uppercase leading-tight text-white/80 sm:block ${bn ? "tracking-normal" : "tracking-[0.18em]"} ${bn}`}
                                    >
                                        {isBn ? "আমাদের গল্প দেখুন" : "Watch Our Story"}
                                    </span>
                                </div>

                                {/* 5+ years badge */}
                                <div className="absolute bottom-4 right-4 rounded-2xl border border-white/15 bg-black/50 px-5 py-4 backdrop-blur-md sm:bottom-6 sm:right-6">
                                    <div className="flex items-end gap-2">
                                        <span className="text-5xl font-bold leading-none text-[#F8921C]">5+</span>
                                        <span className={`mb-1 text-base font-medium text-white ${bn}`}>{isBn ? "বছর" : "Years"}</span>
                                    </div>
                                    <p
                                        className={`mt-1.5 text-[11px] uppercase text-white/70 ${bn ? "tracking-normal" : "tracking-[0.16em]"} ${bn}`}
                                    >
                                        {isBn ? "ডিজিটাল শ্রেষ্ঠত্বের" : "Of Digital Excellence"}
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* small team photo, overlapping the corner */}
                        <motion.div
                            style={reduce ? undefined : { x: smallX, y: smallY }}
                            className="absolute -left-3 bottom-0 z-10 w-[44%] sm:-left-8 lg:bottom-1"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <div className="rounded-2xl bg-[#F8921C] p-1.5 shadow-[0_24px_50px_-20px_rgba(0,0,0,0.8)]">
                                    <div className="aspect-[4/3] overflow-hidden rounded-xl bg-black">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src="/hero-team.webp"
                                            alt="Professional business meeting at Extrain Web office"
                                            style={{ objectPosition: "50% 25%" }}
                                            className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
