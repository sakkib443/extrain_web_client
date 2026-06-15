"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { LuArrowRight, LuArrowUpRight, LuStar, LuZap, LuCheck } from "react-icons/lu";
import { useLanguage } from "@/context/LanguageContext";
import { API_BASE_URL } from "@/config/api";

const avatars = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100",
];

const Hero = () => {
    const { language } = useLanguage();
    const isBn = language === "bn";
    const bn = isBn ? "hind-siliguri" : "";

    const [softwareCount, setSoftwareCount] = useState(3);
    const [websiteCount, setWebsiteCount] = useState(35);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const [softRes, webRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/software`),
                    fetch(`${API_BASE_URL}/websites`),
                ]);
                const softData = await softRes.json();
                const webData = await webRes.json();
                const softNum = softData.meta?.total || (Array.isArray(softData.data) ? softData.data.length : 0);
                const webNum = webData.meta?.total || (Array.isArray(webData.data) ? webData.data.length : 0);
                if (softNum > 0) setSoftwareCount(softNum);
                if (webNum > 0) setWebsiteCount(webNum);
            } catch (error) {
                console.error("Error fetching counts:", error);
            }
        };
        fetchCounts();
    }, []);

    const totalClients = websiteCount + softwareCount;

    // Staggered entrance
    const container = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
    };
    const item = {
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
    };

    // Floating glass stat cards (desktop only)
    const floatCards = [
        { icon: <LuZap size={18} />, label: isBn ? "পারফরম্যান্স" : "Performance", value: "99", pos: "top-[22%] left-[5%]", delay: 0, color: "#C4EE18" },
        { icon: <LuStar size={18} />, label: isBn ? "ক্লায়েন্ট রেটিং" : "Client Rating", value: "4.9", pos: "top-[18%] right-[6%]", delay: 0.7, color: "#FD9A00" },
        { icon: <LuCheck size={18} />, label: isBn ? "প্রজেক্ট ডেলিভারড" : "Projects Done", value: `${totalClients}+`, pos: "bottom-[16%] right-[9%]", delay: 1.2, color: "#C4EE18" },
    ];

    return (
        <section className="relative min-h-[600px] lg:min-h-[88vh] flex items-center overflow-hidden bg-white dark:bg-[#0A0A0A] pt-6 pb-16 lg:pt-12 lg:pb-20">
            {/* ===== Animated Aurora Background ===== */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* faded grid */}
                <div
                    className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
                    style={{
                        backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
                        backgroundSize: "44px 44px",
                        maskImage: "radial-gradient(ellipse 70% 60% at 50% 45%, black 30%, transparent 78%)",
                        WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 45%, black 30%, transparent 78%)",
                    }}
                />
                {/* aurora blob — lime */}
                <motion.div
                    className="absolute -top-32 -left-24 w-[60vw] h-[60vw] max-w-[620px] max-h-[620px] rounded-full bg-[#C4EE18]/30 dark:bg-[#C4EE18]/20 blur-[120px]"
                    animate={{ x: [0, 60, 0], y: [0, 40, 0], scale: [1, 1.15, 1] }}
                    transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
                />
                {/* aurora blob — orange */}
                <motion.div
                    className="absolute top-[18%] -right-28 w-[55vw] h-[55vw] max-w-[600px] max-h-[600px] rounded-full bg-[#FD9A00]/25 dark:bg-[#FD9A00]/20 blur-[120px]"
                    animate={{ x: [0, -50, 0], y: [0, 50, 0], scale: [1.1, 1, 1.1] }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                />
                {/* aurora blob — soft lime bottom */}
                <motion.div
                    className="absolute -bottom-44 left-1/3 w-[50vw] h-[50vw] max-w-[520px] max-h-[520px] rounded-full bg-[#C4EE18]/20 blur-[120px]"
                    animate={{ x: [0, 40, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                />
            </div>

            {/* ===== Floating Glass Cards (desktop) ===== */}
            {floatCards.map((c, i) => (
                <motion.div
                    key={i}
                    className={`hidden lg:flex absolute ${c.pos} z-20 items-center gap-3 px-4 py-3 rounded-2xl bg-white/70 dark:bg-white/[0.06] backdrop-blur-xl border border-white/70 dark:border-white/10 shadow-xl shadow-black/5`}
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ opacity: 1, y: [0, -12, 0], scale: 1 }}
                    transition={{
                        opacity: { duration: 0.6, delay: 0.8 + c.delay },
                        scale: { duration: 0.6, delay: 0.8 + c.delay },
                        y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: c.delay },
                    }}
                    whileHover={{ scale: 1.06 }}
                >
                    <span className="w-9 h-9 rounded-xl flex items-center justify-center text-black shrink-0" style={{ backgroundColor: c.color }}>
                        {c.icon}
                    </span>
                    <div>
                        <p className="text-lg font-black font-teko leading-none text-gray-900 dark:text-white">{c.value}</p>
                        <p className={`text-[10px] text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider ${bn}`}>{c.label}</p>
                    </div>
                </motion.div>
            ))}

            {/* ===== Main Content ===== */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="visible"
                className="container relative z-10 mx-auto px-6 lg:px-12 max-w-4xl text-center flex flex-col items-center"
            >
                {/* Eyebrow badge */}
                <motion.div
                    variants={item}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 dark:bg-white/5 backdrop-blur border border-gray-200 dark:border-white/10 shadow-sm mb-6"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C4EE18] opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C4EE18]" />
                    </span>
                    <span className={`text-[11px] lg:text-xs font-bold tracking-[0.18em] text-gray-700 dark:text-gray-200 ${isBn ? "hind-siliguri" : "uppercase"}`}>
                        {isBn ? "ওয়েব ও সফটওয়্যার এজেন্সি" : "Web & Software Agency"}
                    </span>
                </motion.div>

                {/* Headline — language-aware typography */}
                <motion.h1
                    variants={item}
                    className={`mb-6 text-gray-950 dark:text-white ${
                        isBn
                            ? "hind-siliguri font-bold leading-[1.2] text-5xl sm:text-6xl lg:text-7xl"
                            : "font-teko uppercase font-black tracking-tight leading-[0.92] text-5xl sm:text-6xl lg:text-8xl"
                    }`}
                >
                    {isBn ? (
                        <>
                            <span className="block">মডার্ন ওয়েবসাইট</span>
                            <span className="block bg-gradient-to-r from-[#FD9A00] via-[#C4EE18] to-[#FD9A00] bg-clip-text text-transparent hero-shine">
                                ও সফটওয়্যার
                            </span>
                        </>
                    ) : (
                        <>
                            <span className="block">Modern Websites</span>
                            <span className="block bg-gradient-to-r from-[#FD9A00] via-[#C4EE18] to-[#FD9A00] bg-clip-text text-transparent hero-shine">
                                &amp; Software
                            </span>
                        </>
                    )}
                </motion.h1>

                {/* Subtext */}
                <motion.p variants={item} className={`text-gray-500 dark:text-gray-400 text-base lg:text-lg max-w-2xl leading-relaxed mb-9 ${bn}`}>
                    {isBn
                        ? "এক্সট্রেন ওয়েব হাই-পারফরম্যান্স ওয়েবসাইট, প্রিমিয়াম টেমপ্লেট ও কাস্টম সফটওয়্যার বানায় — দ্রুত, নিরাপদ ও SEO-রেডি, যা আপনার ব্যবসা বাড়ায়।"
                        : "We design & develop high-performance websites, premium templates and custom software — fast, secure and SEO-ready, built to grow your business."}
                </motion.p>

                {/* CTAs */}
                <motion.div variants={item} className="flex flex-col sm:flex-row items-center gap-4 mb-12 w-full sm:w-auto">
                    <Link
                        href="/contact"
                        className={`group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#FD9A00] hover:bg-[#e68a00] text-white font-bold text-sm shadow-lg shadow-[#FD9A00]/30 transition-all hover:-translate-y-0.5 ${bn}`}
                    >
                        {isBn ? "শুরু করুন" : "Get Started"}
                        <LuArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        href="/website"
                        className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/70 dark:bg-white/5 backdrop-blur border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-bold text-sm hover:border-[#C4EE18] hover:shadow-md transition-all hover:-translate-y-0.5 ${bn}`}
                    >
                        {isBn ? "আমাদের কাজ দেখুন" : "View Our Work"}
                        <LuArrowUpRight size={17} />
                    </Link>
                </motion.div>

                {/* Trust row */}
                <motion.div variants={item} className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-3">
                            {avatars.map((url, i) => (
                                <img key={i} src={url} alt="client" className="w-9 h-9 rounded-full border-2 border-white dark:border-[#0A0A0A] object-cover" />
                            ))}
                            <span className="w-9 h-9 rounded-full border-2 border-white dark:border-[#0A0A0A] bg-[#C4EE18] text-black text-[10px] font-black flex items-center justify-center">
                                {totalClients}+
                            </span>
                        </div>
                        <p className={`text-xs text-gray-500 dark:text-gray-400 font-medium text-left ${bn}`}>
                            {isBn ? "সন্তুষ্ট গ্রাহক" : "Happy clients"}
                            <br />
                            <span className="text-gray-900 dark:text-white font-bold">{isBn ? "বিশ্বজুড়ে" : "worldwide"}</span>
                        </p>
                    </div>

                    <div className="h-8 w-px bg-gray-200 dark:bg-white/10 hidden sm:block" />

                    <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <LuStar key={i} size={15} className="fill-[#FD9A00] text-[#FD9A00]" />
                            ))}
                        </div>
                        <p className={`text-xs text-gray-500 dark:text-gray-400 font-medium ${bn}`}>
                            <span className="text-gray-900 dark:text-white font-bold">4.9/5</span> {isBn ? "রেটিং" : "rating"}
                        </p>
                    </div>
                </motion.div>
            </motion.div>

            {/* gradient-shine keyframes */}
            <style jsx global>{`
                @keyframes heroShine {
                    to {
                        background-position: 200% center;
                    }
                }
                .hero-shine {
                    background-size: 200% auto;
                    animation: heroShine 4s linear infinite;
                }
            `}</style>
        </section>
    );
};

export default Hero;
