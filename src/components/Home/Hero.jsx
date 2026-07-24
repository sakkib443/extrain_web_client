"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
    LuArrowRight,
    LuStar,
    LuSparkles,
    LuZap,
    LuBadgeCheck,
    LuHeadphones,
    LuPhone,
} from "react-icons/lu";
import { FaWhatsapp } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";

const avatars = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
];

const PHONE = "01711946614";
const WHATSAPP = "https://wa.me/8801711946614";

const Hero = () => {
    const { language } = useLanguage();
    const isBn = language === "bn";
    const bn = isBn ? "hind-siliguri" : "";

    const rotating = isBn
        ? ["ই-কমার্স ওয়েবসাইট", "রিয়েল এস্টেট সাইট", "সার্ভিস ওয়েবসাইট", "কর্পোরেট সাইট"]
        : ["E-commerce Website", "Real Estate Site", "Service Website", "Corporate Site"];
    const [idx, setIdx] = useState(0);

    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const t = setInterval(() => setIdx((i) => (i + 1) % rotating.length), 2600);
        return () => clearInterval(t);
    }, [rotating.length]);

    const fadeUp = {
        hidden: { opacity: 0, y: 22 },
        show: (i = 0) => ({
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, delay: 0.05 + i * 0.09, ease: [0.16, 1, 0.3, 1] },
        }),
    };

    const bullets = [
        {
            icon: LuBadgeCheck,
            text: isBn ? "NSDA Level 3 সার্টিফাইড ডেভেলপার" : "NSDA Level 3 certified developers",
        },
        {
            icon: LuZap,
            text: isBn ? "Next.js • Node.js • Laravel" : "Next.js • Node.js • Laravel",
        },
        {
            icon: LuHeadphones,
            text: isBn ? "আজীবন টেকনিক্যাল সাপোর্ট" : "Lifetime technical support",
        },
    ];

    return (
        <section className="relative overflow-hidden bg-[#FBFCFB] dark:bg-[#0B0F14]">
            {/* ===== Soft mesh background ===== */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        "linear-gradient(180deg,#FFFDF8 0%,#F5FBFA 45%,#FFFFFF 100%)",
                }}
            />
            <div className="absolute inset-0 pointer-events-none dark:hidden">
                <div
                    className="hero-blob hero-blob-1 absolute -top-[18%] -left-[8%] w-[52%] h-[62%]"
                    style={{ background: "radial-gradient(circle at center, rgba(253,154,0,0.22), transparent 62%)" }}
                />
                <div
                    className="hero-blob hero-blob-2 absolute top-[4%] -right-[12%] w-[58%] h-[74%]"
                    style={{ background: "radial-gradient(circle at center, rgba(12,178,169,0.22), transparent 62%)" }}
                />
                <div
                    className="hero-blob hero-blob-3 absolute -bottom-[26%] left-[26%] w-[50%] h-[60%]"
                    style={{ background: "radial-gradient(circle at center, rgba(12,178,169,0.13), transparent 62%)" }}
                />
            </div>

            {/* dark-mode counterpart (kept subtle) */}
            <div className="absolute inset-0 pointer-events-none hidden dark:block">
                <div className="absolute -top-[18%] -left-[8%] w-[52%] h-[62%]" style={{ background: "radial-gradient(circle at center, rgba(253,154,0,0.16), transparent 62%)" }} />
                <div className="absolute top-[4%] -right-[12%] w-[58%] h-[74%]" style={{ background: "radial-gradient(circle at center, rgba(12,178,169,0.16), transparent 62%)" }} />
            </div>

            {/* ===== Fine dot grid, faded outward ===== */}
            <div
                className="absolute inset-0 pointer-events-none opacity-70 dark:opacity-30"
                style={{
                    backgroundImage: "radial-gradient(rgba(15,53,73,0.13) 1px, transparent 1px)",
                    backgroundSize: "26px 26px",
                    maskImage: "radial-gradient(ellipse 85% 75% at 50% 40%, black 10%, transparent 76%)",
                    WebkitMaskImage: "radial-gradient(ellipse 85% 75% at 50% 40%, black 10%, transparent 76%)",
                }}
            />

            {/* ===== Content ===== */}
            <div className="relative z-10 container mx-auto px-6 lg:px-10">
                <div className="min-h-[88vh] grid lg:grid-cols-[1.05fr_1fr] items-center gap-14 lg:gap-10 py-24 lg:py-24">

                    {/* ---------- Left: copy ---------- */}
                    <div className="text-center lg:text-left">
                        {/* eyebrow */}
                        <motion.div
                            variants={fadeUp} initial="hidden" animate="show" custom={0}
                            className="inline-flex items-center gap-2 rounded-full border border-[#0CB2A9]/25 bg-white/70 dark:bg-white/5 dark:border-white/15 backdrop-blur px-4 py-1.5 mb-7 shadow-[0_4px_20px_-8px_rgba(12,178,169,0.5)]"
                        >
                            <LuSparkles className="text-[#FD9A00]" size={14} />
                            <span className={`text-[11px] lg:text-xs font-semibold tracking-wide text-slate-700 dark:text-white/80 ${bn}`}>
                                {isBn
                                    ? "NSDA Level 3 সার্টিফাইড ডেভেলপার টিম"
                                    : "NSDA Level 3 Certified Developer Team"}
                            </span>
                        </motion.div>

                        {/* headline with rotating word */}
                        <motion.h1
                            variants={fadeUp} initial="hidden" animate="show" custom={1}
                            className={`font-poppins font-bold tracking-tight leading-[1.06] text-slate-900 dark:text-white ${isBn ? "hind-siliguri text-3xl sm:text-4xl lg:text-[3.2rem] xl:text-[3.6rem]" : "text-3xl sm:text-4xl lg:text-5xl xl:text-[3.5rem]"}`}
                        >
                            {isBn ? "আমরা বানাই আপনার" : "We Build Your"}
                            <span className="relative block mt-2 h-[1.3em]">
                                <AnimatePresence>
                                    <motion.span
                                        key={idx}
                                        initial={{ y: 24, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -24, opacity: 0 }}
                                        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                                        className="absolute inset-x-0 top-0 whitespace-nowrap bg-gradient-to-r from-[#FD9A00] via-[#F9A93C] to-[#0CB2A9] bg-clip-text text-transparent lg:text-left text-center"
                                    >
                                        {rotating[idx]}
                                    </motion.span>
                                </AnimatePresence>
                            </span>
                        </motion.h1>

                        {/* subtext */}
                        <motion.p
                            variants={fadeUp} initial="hidden" animate="show" custom={2}
                            className={`text-slate-600 dark:text-white/60 text-base lg:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed mt-6 ${bn}`}
                        >
                            {isBn
                                ? "বাংলাদেশের সবচেয়ে মডার্ন ও ফাস্ট ওয়েবসাইট — Next.js, Node.js, PHP ও Laravel দিয়ে তৈরি। রেডিমেড টেমপ্লেট কিনুন, অথবা আপনার ব্যবসার জন্য কাস্টম বানিয়ে নিন।"
                                : "The most modern & fastest websites in Bangladesh — built with Next.js, Node.js, PHP & Laravel. Buy a ready-made template, or get one built custom for your business."}
                        </motion.p>

                        {/* quick bullets */}
                        <motion.ul
                            variants={fadeUp} initial="hidden" animate="show" custom={3}
                            className="flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2.5 mt-6"
                        >
                            {bullets.map(({ icon: Icon, text }) => (
                                <li key={text} className={`flex items-center gap-2 text-sm text-slate-600 dark:text-white/60 ${bn}`}>
                                    <span className="grid place-items-center w-5 h-5 rounded-full bg-[#0CB2A9]/12 text-[#0CB2A9]">
                                        <Icon size={12} />
                                    </span>
                                    {text}
                                </li>
                            ))}
                        </motion.ul>

                        {/* CTAs */}
                        <motion.div
                            variants={fadeUp} initial="hidden" animate="show" custom={4}
                            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mt-9"
                        >
                            <Link
                                href="/website"
                                className={`group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-[#FD9A00] px-8 py-4 text-sm font-bold text-white shadow-[0_12px_35px_-10px_rgba(253,154,0,0.8)] hover:shadow-[0_16px_45px_-10px_rgba(253,154,0,0.95)] hover:-translate-y-0.5 transition-all ${bn}`}
                            >
                                {isBn ? "টেমপ্লেট দেখুন" : "Browse Templates"}
                                <LuArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <a
                                href={WHATSAPP}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-slate-300 dark:border-white/20 bg-white/80 dark:bg-white/5 px-8 py-4 text-sm font-bold text-slate-800 dark:text-white backdrop-blur hover:border-[#25D366] hover:text-[#128C4A] dark:hover:bg-white/10 transition-all ${bn}`}
                            >
                                <FaWhatsapp size={18} className="text-[#25D366]" />
                                {isBn ? "হোয়াটসঅ্যাপে কথা বলুন" : "Chat on WhatsApp"}
                            </a>
                        </motion.div>

                        {/* direct call */}
                        <motion.a
                            variants={fadeUp} initial="hidden" animate="show" custom={5}
                            href={`tel:+88${PHONE}`}
                            className={`inline-flex items-center gap-2 mt-5 text-sm text-slate-600 dark:text-white/60 hover:text-[#0CB2A9] transition-colors ${bn}`}
                        >
                            <LuPhone size={15} className="text-[#0CB2A9]" />
                            {isBn ? "সরাসরি কল করুন:" : "Call us directly:"}
                            <b className="text-slate-900 dark:text-white font-bold tracking-wide">{PHONE}</b>
                        </motion.a>

                        {/* trust bar */}
                        <motion.div
                            variants={fadeUp} initial="hidden" animate="show" custom={6}
                            className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3 mt-10"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex -space-x-3">
                                    {avatars.map((url, i) => (
                                        <img
                                            key={i}
                                            src={url}
                                            alt="Happy Extrain Web client"
                                            className="w-9 h-9 rounded-full border-2 border-white dark:border-[#0B0F14] object-cover shadow-sm"
                                        />
                                    ))}
                                </div>
                                <p className={`text-sm text-slate-600 dark:text-white/60 text-left ${bn}`}>
                                    {isBn ? "৫০+ ব্যবসা আমাদের ওপর ভরসা রাখে" : "Trusted by 50+ businesses"}
                                </p>
                            </div>

                            <div className="h-6 w-px bg-slate-300 dark:bg-white/15 hidden sm:block" />

                            <div className="flex items-center gap-2">
                                <div className="flex gap-0.5 text-[#FD9A00]">
                                    {[...Array(5)].map((_, i) => (
                                        <LuStar key={i} size={15} className="fill-[#FD9A00]" />
                                    ))}
                                </div>
                                <span className={`text-sm text-slate-600 dark:text-white/60 ${bn}`}>
                                    <b className="text-slate-900 dark:text-white font-bold">4.9/5</b> {isBn ? "রেটিং" : "rating"}
                                </span>
                            </div>
                        </motion.div>
                    </div>

                    {/* ---------- Right: floating preview ---------- */}
                    <motion.div
                        initial={{ opacity: 0, y: 34 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.75, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="relative hidden lg:block"
                    >
                        {/* glow behind the card */}
                        <div
                            className="absolute inset-6 rounded-[2rem] pointer-events-none"
                            style={{ background: "radial-gradient(circle at 50% 40%, rgba(12,178,169,0.28), transparent 70%)" }}
                        />

                        <div className="hero-float relative rounded-2xl bg-white dark:bg-[#101820] border border-slate-200/80 dark:border-white/10 shadow-[0_30px_70px_-30px_rgba(15,53,73,0.45)] overflow-hidden">
                            {/* browser chrome */}
                            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 dark:border-white/10 bg-slate-50/80 dark:bg-white/5">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                                <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                                <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                                <div className="ml-3 flex-1 h-6 rounded-full bg-white dark:bg-white/10 border border-slate-200/80 dark:border-white/10 flex items-center px-3">
                                    <span className="text-[10px] font-medium text-slate-400 dark:text-white/40 tracking-wide">
                                        extrainweb.com
                                    </span>
                                </div>
                            </div>

                            {/* fake page */}
                            <div className="p-5">
                                <div className="rounded-xl bg-gradient-to-br from-[#0CB2A9] via-[#12A8B4] to-[#0F8FA8] p-5 text-white">
                                    <div className="h-2.5 w-24 rounded-full bg-white/40" />
                                    <div className="mt-3 h-3.5 w-3/4 rounded-full bg-white/85" />
                                    <div className="mt-2 h-3.5 w-1/2 rounded-full bg-white/60" />
                                    <div className="mt-4 flex gap-2">
                                        <div className="h-7 w-24 rounded-full bg-[#FD9A00]" />
                                        <div className="h-7 w-20 rounded-full bg-white/25" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3 mt-4">
                                    {[0, 1, 2].map((i) => (
                                        <div
                                            key={i}
                                            className="rounded-lg border border-slate-100 dark:border-white/10 bg-slate-50/70 dark:bg-white/5 p-3"
                                        >
                                            <div className="h-10 rounded-md bg-gradient-to-br from-[#0CB2A9]/25 to-[#FD9A00]/20" />
                                            <div className="mt-2.5 h-2 w-full rounded-full bg-slate-200 dark:bg-white/15" />
                                            <div className="mt-1.5 h-2 w-2/3 rounded-full bg-slate-200/70 dark:bg-white/10" />
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 space-y-2">
                                    <div className="h-2 w-full rounded-full bg-slate-200/80 dark:bg-white/10" />
                                    <div className="h-2 w-5/6 rounded-full bg-slate-200/60 dark:bg-white/10" />
                                </div>
                            </div>
                        </div>

                        {/* floating badge — tech stack */}
                        <div className="hero-chip hero-chip-1 absolute -left-6 top-16 flex items-center gap-2.5 rounded-xl bg-white dark:bg-[#101820] border border-slate-200/80 dark:border-white/10 px-3.5 py-2.5 shadow-[0_18px_40px_-18px_rgba(15,53,73,0.5)]">
                            <span className="grid place-items-center w-8 h-8 rounded-lg bg-[#FD9A00]/12 text-[#FD9A00]">
                                <LuZap size={16} />
                            </span>
                            <div className="leading-tight">
                                <p className="text-[11px] font-bold text-slate-900 dark:text-white">Next.js + Node.js</p>
                                <p className={`text-[10px] text-slate-500 dark:text-white/50 ${bn}`}>
                                    {isBn ? "সুপার ফাস্ট লোডিং" : "Super fast loading"}
                                </p>
                            </div>
                        </div>

                        {/* floating badge — certification */}
                        <div className="hero-chip hero-chip-2 absolute -right-5 bottom-24 flex items-center gap-2.5 rounded-xl bg-white dark:bg-[#101820] border border-slate-200/80 dark:border-white/10 px-3.5 py-2.5 shadow-[0_18px_40px_-18px_rgba(15,53,73,0.5)]">
                            <span className="grid place-items-center w-8 h-8 rounded-lg bg-[#0CB2A9]/12 text-[#0CB2A9]">
                                <LuBadgeCheck size={16} />
                            </span>
                            <div className="leading-tight">
                                <p className="text-[11px] font-bold text-slate-900 dark:text-white">NSDA Level 3</p>
                                <p className={`text-[10px] text-slate-500 dark:text-white/50 ${bn}`}>
                                    {isBn ? "সার্টিফাইড ডেভেলপার" : "Certified developers"}
                                </p>
                            </div>
                        </div>

                        {/* floating badge — lifetime support */}
                        <div className="hero-chip hero-chip-3 absolute left-8 -bottom-5 flex items-center gap-2.5 rounded-xl bg-white dark:bg-[#101820] border border-slate-200/80 dark:border-white/10 px-3.5 py-2.5 shadow-[0_18px_40px_-18px_rgba(15,53,73,0.5)]">
                            <span className="grid place-items-center w-8 h-8 rounded-lg bg-[#0CB2A9]/12 text-[#0CB2A9]">
                                <LuHeadphones size={16} />
                            </span>
                            <div className="leading-tight">
                                <p className={`text-[11px] font-bold text-slate-900 dark:text-white ${bn}`}>
                                    {isBn ? "আজীবন সাপোর্ট" : "Lifetime support"}
                                </p>
                                <p className={`text-[10px] text-slate-500 dark:text-white/50 ${bn}`}>
                                    {isBn ? "ডেলিভারির পরেও" : "Even after delivery"}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ===== soft fade into the next section ===== */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-white dark:to-[#020202] pointer-events-none" />

            <style jsx>{`
                @keyframes heroBlob1 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(8%, 10%) scale(1.12); }
                }
                @keyframes heroBlob2 {
                    0%, 100% { transform: translate(0, 0) scale(1.05); }
                    50% { transform: translate(-10%, 6%) scale(1); }
                }
                @keyframes heroBlob3 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(6%, -8%) scale(1.1); }
                }
                @keyframes heroFloat {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-12px); }
                }
                .hero-blob { will-change: transform; }
                .hero-blob-1 { animation: heroBlob1 22s ease-in-out infinite; }
                .hero-blob-2 { animation: heroBlob2 27s ease-in-out infinite; }
                .hero-blob-3 { animation: heroBlob3 31s ease-in-out infinite; }
                .hero-float { animation: heroFloat 7s ease-in-out infinite; will-change: transform; }
                .hero-chip { animation: heroFloat 6s ease-in-out infinite; will-change: transform; }
                .hero-chip-1 { animation-delay: -1.5s; }
                .hero-chip-2 { animation-delay: -3s; }
                .hero-chip-3 { animation-delay: -4.5s; }
                @media (prefers-reduced-motion: reduce) {
                    .hero-blob-1, .hero-blob-2, .hero-blob-3,
                    .hero-float, .hero-chip { animation: none; }
                }
            `}</style>
        </section>
    );
};

export default Hero;
