"use client";

import Image from "next/image";
import { motion, useTransform } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import useSectionMotion from "@/hooks/useSectionMotion";
import BracketLabel from "@/components/Home/BracketLabel";
import { Star4, EdgeDots, OrbitRing } from "@/components/Home/Decor";
import { outlineStyle, filledAccent } from "@/components/Aboutpage/sections/shared";
import {
    LuPlay, LuMoveRight, LuBuilding2, LuUsers, LuHighlighter, LuPencil, LuSun, LuType, LuShieldCheck, LuCircleCheck,
} from "react-icons/lu";

const IeltsHero = () => {
    const { language } = useLanguage();
    const isBn = language === "bn";
    const bn = isBn ? "hind-siliguri" : "";

    const features = [
        { icon: LuHighlighter, text: isBn ? "হাইলাইট করুন" : "Text Highlight" },
        { icon: LuPencil, text: isBn ? "নোট নিন" : "Take Notes" },
        { icon: LuSun, text: isBn ? "থিম পরিবর্তন" : "Theme Change" },
        { icon: LuType, text: isBn ? "ফন্ট সাইজ" : "Font Size" },
    ];

    const trust = [
        { icon: LuBuilding2, value: isBn ? "৫০+" : "50+", label: isBn ? "কোচিং সেন্টার" : "Coaching Centers" },
        { icon: LuUsers, value: isBn ? "১০,০০০+" : "10,000+", label: isBn ? "স্টুডেন্ট" : "Students" },
        { icon: LuShieldCheck, value: "BC", label: isBn ? "মানের ইন্টারফেস" : "Standard Interface" },
    ];

    const scrollToPricing = () => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });

    // ---- scroll + mouse motion (same feel as the About hero) ----
    const { ref, p, mx, my, reduce, isLg } = useSectionMotion();
    const k = isLg ? 1 : 0.4;
    const textY = useTransform(p, [0, 1], [14 * k, -34 * k]);
    const visY = useTransform(p, [0, 1], [22 * k, -22 * k]);
    const imgX = useTransform(mx, [-0.5, 0.5], [10, -10]);
    const imgY = useTransform(my, [-0.5, 0.5], [8, -8]);
    const glowX = useTransform(mx, [-0.5, 0.5], [-50, 50]);
    const ringX = useTransform(mx, [-0.5, 0.5], [-28, 28]);
    const ringY = useTransform(p, [0, 1], [-50, 50]);
    const starY = useTransform(p, [0, 1], [-60, 60]);
    const starX = useTransform(mx, [-0.5, 0.5], [-24, 24]);

    return (
        <section ref={ref} className="relative overflow-hidden bg-[color:var(--tone-deep)] text-white">
            <div className="pointer-events-none absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/hero-bg.webp')" }} />
            <div className="pointer-events-none absolute inset-0 bg-black/30" />

            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                <motion.div style={reduce ? undefined : { x: glowX }} className="absolute -bottom-32 left-[8%] h-96 w-96 rounded-full bg-[#F8921C]/[0.10] blur-3xl" />
                <EdgeDots />
                <motion.div style={reduce ? undefined : { x: ringX, y: ringY }} className="absolute -right-[16rem] top-[6%] hidden sm:block">
                    <div className="relative aspect-square w-[36rem]">
                        <OrbitRing dashed className="absolute inset-0 border-white/[0.12]" />
                        <OrbitRing reverse dot="bottom" className="absolute inset-[16%] border-[#F8921C]/25" />
                    </div>
                </motion.div>
                <motion.div style={reduce ? undefined : { x: starX, y: starY }} className="absolute left-[46%] top-[12%] hidden lg:block">
                    <Star4 size={34} filled className="decor-float text-[#F8921C]" style={{ animationDuration: "10s" }} />
                </motion.div>
            </div>

            <div className="container relative z-10 mx-auto px-6 lg:px-10">
                <div className="grid items-center gap-16 pb-20 pt-32 lg:min-h-[min(calc(100svh-65px),820px)] lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
                    {/* ---------- left: copy ---------- */}
                    <motion.div style={reduce ? undefined : { y: textY }}>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="mb-12">
                            <BracketLabel bn={bn} size="lg">{isBn ? "কোচিং সেন্টারের জন্য" : "For institutes"}</BracketLabel>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                            style={{ color: "#fff" }}
                            className="relative font-bold uppercase leading-[1.08] tracking-[-0.015em] text-[clamp(2.4rem,5.6vw,4.9rem)]"
                        >
                            <span aria-hidden="true" className="pointer-events-none absolute -top-4 left-0 hidden h-16 w-16 border-l border-t border-white/90 sm:block">
                                <i className="absolute -left-[5px] -top-[5px] h-2.5 w-2.5 bg-[#F8921C]" />
                                <i className="absolute -bottom-[5px] -left-[5px] h-2.5 w-2.5 bg-[#F8921C]" />
                            </span>

                            <span className="block text-white sm:pl-[0.55em]">IELTS</span>
                            <span className="block">
                                <span style={outlineStyle}>
                                    MOCK TE<span style={filledAccent}>S</span>T
                                </span>
                            </span>
                            <span className="block">
                                <span className="relative inline-block text-white">
                                    SOFTWARE<span style={filledAccent}>.</span>
                                    <span aria-hidden="true" className="pointer-events-none absolute -bottom-3 -right-8 hidden h-14 w-14 border-b border-r border-white/90 sm:block">
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
                            className={`mt-9 max-w-lg border-l-2 border-[#F8921C] py-0.5 pl-5 text-base leading-relaxed text-white/70 lg:text-lg ${bn}`}
                        >
                            {isBn
                                ? "British Council এর অনলাইন পরীক্ষার হুবহু ইন্টারফেস। Student Dashboard, Admin Panel, Auto Result, AI Speaking Assessment সহ সম্পূর্ণ প্যাকেজ।"
                                : "An exact replica of the British Council online exam — with Student Dashboard, Admin Panel, Auto Result and AI Speaking Assessment in one package."}
                        </motion.p>

                        {/* feature chips */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.35 }}
                            className="mt-6 flex flex-wrap gap-2"
                        >
                            {features.map(({ icon: Icon, text }) => (
                                <span key={text} className={`inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.05] px-3.5 py-1.5 text-xs text-white/80 backdrop-blur-sm ${bn}`}>
                                    <Icon size={13} className="text-[#F8921C]" />
                                    {text}
                                </span>
                            ))}
                        </motion.div>

                        {/* CTAs */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.4 }}
                            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4"
                        >
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={scrollToPricing}
                                    className={`inline-flex items-center rounded-full bg-[#F8921C] px-8 py-4 text-sm font-semibold uppercase text-black transition-colors hover:bg-[#e07d0a] ${bn ? "tracking-normal" : "tracking-wide"} ${bn}`}
                                >
                                    {isBn ? "লাইসেন্স নিন" : "Get License"}
                                </button>
                                <button
                                    type="button"
                                    onClick={scrollToPricing}
                                    aria-label={isBn ? "প্যাকেজ দেখুন" : "See packages"}
                                    className="grid h-[52px] w-[52px] place-items-center rounded-full bg-white text-[#0a0a0a] transition-colors hover:bg-[#F8921C]"
                                >
                                    <LuMoveRight size={22} />
                                </button>
                            </div>
                            <a
                                href="https://bestieltsbd.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-flex items-center gap-2 rounded-full border border-white/25 px-8 py-4 text-sm font-semibold uppercase text-white transition-colors hover:border-[#F8921C] hover:text-[#F8921C] ${bn ? "tracking-normal" : "tracking-wide"} ${bn}`}
                            >
                                <LuPlay size={15} />
                                {isBn ? "লাইভ ডেমো" : "Live Demo"}
                            </a>
                        </motion.div>

                        {/* trust row */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.7, delay: 0.55 }}
                            className="mt-10 grid max-w-lg grid-cols-3 divide-x divide-white/10 border-t border-white/10 pt-6"
                        >
                            {trust.map(({ icon: Icon, value, label }) => (
                                <div key={label} className="px-3 first:pl-0">
                                    <div className="flex items-center gap-1.5">
                                        <Icon size={15} className="text-[#F8921C]" />
                                        <span className="text-xl font-bold text-white">{value}</span>
                                    </div>
                                    <p className={`mt-1 text-[12px] leading-tight text-white/55 ${bn}`}>{label}</p>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* ---------- right: product preview ---------- */}
                    <motion.div style={reduce ? undefined : { y: visY }} className="relative mx-auto w-full max-w-[500px] pb-8">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                            className="relative"
                        >
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-0 translate-x-3 translate-y-3 rounded-[2rem] rounded-tl-[6rem] border border-[#F8921C]/40 sm:translate-x-4 sm:translate-y-4"
                            />
                            <div className="relative overflow-hidden rounded-[2rem] rounded-tl-[6rem] border border-white/10 bg-[color:var(--tone-soft)]">
                                <motion.div style={reduce ? undefined : { x: imgX, y: imgY, scale: 1.04 }}>
                                    <Image
                                        src="/images/IELTSPOST.gif"
                                        alt="IELTS Mock Test Software"
                                        width={500}
                                        height={500}
                                        className="block h-auto w-full"
                                        unoptimized
                                        priority
                                    />
                                </motion.div>
                            </div>

                            {/* auto-marking badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7, duration: 0.5 }}
                                className="absolute -bottom-6 -left-3 flex items-center gap-3 rounded-2xl border border-white/15 bg-black/60 px-5 py-3.5 shadow-2xl backdrop-blur-md sm:-left-8"
                            >
                                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#F8921C] text-black">
                                    <LuCircleCheck size={20} />
                                </span>
                                <span>
                                    <span className={`block text-sm font-bold text-white ${bn}`}>{isBn ? "অটো রেজাল্ট ও মার্কিং" : "Auto Result & Marking"}</span>
                                    <span className="block text-xs text-white/60">Listening · Reading · Writing</span>
                                </span>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default IeltsHero;
