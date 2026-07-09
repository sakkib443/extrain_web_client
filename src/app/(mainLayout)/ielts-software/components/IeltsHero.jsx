"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import {
    LuPlay,
    LuArrowRight,
    LuBuilding2,
    LuUsers,
    LuHighlighter,
    LuPencil,
    LuSun,
    LuType,
    LuShieldCheck,
    LuCircleCheck,
} from "react-icons/lu";

const IeltsHero = () => {
    const { language } = useLanguage();
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";

    const features = [
        { icon: LuHighlighter, text: language === "bn" ? "হাইলাইট করুন" : "Text Highlight" },
        { icon: LuPencil, text: language === "bn" ? "নোট নিন" : "Take Notes" },
        { icon: LuSun, text: language === "bn" ? "থিম পরিবর্তন" : "Theme Change" },
        { icon: LuType, text: language === "bn" ? "ফন্ট সাইজ" : "Font Size" },
    ];

    const scrollToPricing = () => {
        document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <section className="relative flex items-center overflow-hidden bg-white dark:bg-[#0A0A0A]">
            {/* Soft static background glows — adds depth without motion */}
            <div className="absolute top-0 right-0 w-[38rem] h-[38rem] bg-[#FD9A00]/10 dark:bg-[#FD9A00]/[0.07] rounded-full blur-[120px] -translate-y-1/3 translate-x-1/4 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[32rem] h-[32rem] bg-[#0CB2A9]/10 dark:bg-[#0CB2A9]/[0.06] rounded-full blur-[120px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-20 pt-16 pb-20 lg:pt-24 lg:pb-24 relative z-10">
                <div className="grid lg:grid-cols-2 gap-10 lg:gap-8 items-center">
                    {/* ============ LEFT CONTENT ============ */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15, duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FD9A00]/10 border border-[#FD9A00]/25 text-[#FD9A00] text-xs font-semibold mb-4"
                        >
                            <LuBuilding2 size={14} />
                            <span className={bengaliClass}>
                                {language === "bn" ? "কোচিং সেন্টার ও ইনস্টিটিউটের জন্য" : "For Coaching Centers & Institutes"}
                            </span>
                        </motion.div>

                        {/* Heading */}
                        <h1
                            className={`text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white leading-[1.1] mb-4 font-poppins uppercase tracking-tight ${bengaliClass}`}
                        >
                            {language === "bn" ? (
                                <>
                                    আপনার <span className="text-[#FD9A00]">IELTS</span>{" "}
                                    <span className="relative inline-block">
                                        <span className="relative z-10">কোচিং সেন্টারের</span>
                                        <span className="absolute bottom-1 left-0 w-full h-3 bg-[#0CB2A9]/30"></span>
                                    </span>
                                    <br />
                                    জন্য সম্পূর্ণ সমাধান
                                </>
                            ) : (
                                <>
                                    COMPLETE <span className="text-[#FD9A00]">IELTS</span>{" "}
                                    <span className="relative inline-block">
                                        <span className="relative z-10">SOLUTION</span>
                                        <span className="absolute bottom-1 left-0 w-full h-3 bg-[#0CB2A9]/30"></span>
                                    </span>
                                    <br />
                                    FOR YOUR INSTITUTE
                                </>
                            )}
                        </h1>

                        {/* Description */}
                        <p className={`text-sm lg:text-base text-gray-600 dark:text-gray-400 mb-5 leading-relaxed max-w-xl ${bengaliClass}`}>
                            {language === "bn"
                                ? "British Council এর অনলাইন পরীক্ষার হুবহু ইন্টারফেস। Student Dashboard, Admin Panel, Auto Result, AI Speaking Assessment সহ সম্পূর্ণ প্যাকেজ। আপনার স্টুডেন্টদের দিন আসল পরীক্ষার অভিজ্ঞতা।"
                                : "Exact replica of British Council online exam interface. Complete package with Student Dashboard, Admin Panel, Auto Result, AI Speaking Assessment. Give your students real exam experience."}
                        </p>

                        {/* Feature chips */}
                        <div className="flex flex-wrap gap-2 mb-5">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.35 + index * 0.08, duration: 0.4 }}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 text-xs"
                                >
                                    <feature.icon size={13} className="text-[#FD9A00]" />
                                    <span className={bengaliClass}>{feature.text}</span>
                                </motion.div>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <motion.button
                                onClick={scrollToPricing}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`group flex items-center justify-center gap-2 px-6 py-3 text-sm bg-[#FD9A00] hover:bg-[#e68a00] text-white font-bold rounded-xl shadow-lg shadow-[#FD9A00]/30 hover:shadow-[#FD9A00]/50 transition-all ${bengaliClass}`}
                            >
                                {language === "bn" ? "লাইসেন্স নিন" : "Get License"}
                                <LuArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                            </motion.button>
                            <motion.a
                                href="https://bestieltsbd.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`group flex items-center justify-center gap-2 px-6 py-3 text-sm bg-[#0CB2A9] hover:bg-[#b3dd10] text-black font-bold rounded-xl shadow-lg shadow-[#0CB2A9]/30 hover:shadow-[#0CB2A9]/50 transition-all ${bengaliClass}`}
                            >
                                <LuPlay size={16} />
                                {language === "bn" ? "লাইভ ডেমো" : "Live Demo"}
                            </motion.a>
                        </div>

                        {/* Trust Badges */}
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5 mt-6 pt-5 border-t border-gray-200 dark:border-white/10">
                            <div className="flex items-center gap-2">
                                <LuBuilding2 className="text-[#0CB2A9]" size={18} />
                                <span className={`text-gray-600 dark:text-gray-400 text-xs ${bengaliClass}`}>
                                    {language === "bn" ? "৫০+ কোচিং সেন্টার" : "50+ Coaching Centers"}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <LuUsers className="text-[#0CB2A9]" size={18} />
                                <span className={`text-gray-600 dark:text-gray-400 text-xs ${bengaliClass}`}>
                                    {language === "bn" ? "১০,০০০+ স্টুডেন্ট" : "10,000+ Students"}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <LuShieldCheck className="text-[#0CB2A9]" size={18} />
                                <span className={`text-gray-600 dark:text-gray-400 text-xs ${bengaliClass}`}>
                                    {language === "bn" ? "BC মানের ইন্টারফেস" : "BC Standard Interface"}
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* ============ RIGHT CONTENT — Product Image ============ */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                        className="relative flex justify-center"
                    >
                        <div className="relative w-full" style={{ maxWidth: "470px" }}>
                            {/* Static glow halo behind image */}
                            <div className="absolute -inset-6 bg-gradient-to-tr from-[#FD9A00]/25 via-transparent to-[#0CB2A9]/25 rounded-[2.5rem] blur-3xl pointer-events-none" />

                            {/* Gradient frame */}
                            <div className="relative rounded-3xl p-[1.5px] bg-gradient-to-br from-[#FD9A00]/50 via-gray-200/40 to-[#0CB2A9]/50 dark:from-[#FD9A00]/40 dark:via-white/10 dark:to-[#0CB2A9]/40 shadow-2xl shadow-black/10 dark:shadow-black/40">
                                <div className="rounded-3xl overflow-hidden bg-white dark:bg-[#111]">
                                    <Image
                                        src="/images/IELTSPOST.gif"
                                        alt="IELTS Mock Test Software"
                                        width={480}
                                        height={480}
                                        className="w-full h-auto block"
                                        unoptimized
                                        priority
                                    />
                                </div>
                            </div>

                            {/* Single clean stat badge — bottom, static */}
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.5 }}
                                className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-white/90 dark:bg-[#161616]/90 backdrop-blur-md border border-gray-100 dark:border-white/10 shadow-xl whitespace-nowrap"
                            >
                                <div className="w-8 h-8 rounded-lg bg-[#0CB2A9]/20 flex items-center justify-center shrink-0">
                                    <LuCircleCheck className="text-[#0CB2A9]" size={18} />
                                </div>
                                <div className="text-left">
                                    <p className={`text-gray-900 dark:text-white font-bold text-sm leading-tight ${bengaliClass}`}>
                                        {language === "bn" ? "অটো রেজাল্ট ও মার্কিং" : "Auto Result & Marking"}
                                    </p>
                                    <p className={`text-gray-500 dark:text-gray-400 text-xs ${bengaliClass}`}>
                                        {language === "bn" ? "Listening · Reading · Writing" : "Listening · Reading · Writing"}
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default IeltsHero;
