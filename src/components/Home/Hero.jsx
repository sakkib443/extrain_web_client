"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FiPlay, FiArrowDown } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";
import { API_BASE_URL } from "@/config/api";

const avatars = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100"
];

const tickerItems = [
    { en: "DESIGN", bn: "ডিজাইন" },
    { en: "DEVELOPMENT", bn: "ডেভেলপমেন্ট" },
    { en: "STRATEGY", bn: "স্ট্র্যাটেজি" },
    { en: "SOLUTIONS", bn: "সল্যুশন" },
];

const Hero = () => {
    const { language } = useLanguage();
    const isBn = language === 'bn';
    const bengaliClass = isBn ? "hind-siliguri" : "";

    const [softwareCount, setSoftwareCount] = useState(3);
    const [websiteCount, setWebsiteCount] = useState(35);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const [softRes, webRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/software`),
                    fetch(`${API_BASE_URL}/websites`)
                ]);
                const softData = await softRes.json();
                const webData = await webRes.json();
                const softNum = softData.meta?.total || (Array.isArray(softData.data) ? softData.data.length : 0);
                const webNum = webData.meta?.total || (Array.isArray(webData.data) ? webData.data.length : 0);
                if (softNum > 0) setSoftwareCount(softNum);
                if (webNum > 0) setWebsiteCount(webNum);
            } catch (error) {
                console.error('Error fetching counts:', error);
            }
        };
        fetchCounts();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
        }
    };

    const floatingVariants = {
        animate: {
            y: [0, -10, 0],
            transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }
    };

    const translations = {
        description: isBn ? "আমরা এক্সট্রেন ওয়েব, আপনার ব্যবসার জন্য ক্রিয়েটিভ এবং ইউজার-কেন্দ্রিক ডিজিটাল সমাধান তৈরি করি।" : "We're Extrain Web, to build creative & user-centric designs also develop for customer.",
        line1: isBn ? "ওয়েবসাইট ও" : "WEBSITE &",
        line2Part1: isBn ? "সফটওয়্যার" : "SOFTWARE",
        line2Part2: isBn ? "সল্যুশন" : "SOLUTION",
        line3: isBn ? "সাথে এক্সট্রেন ওয়েব" : "WITH EXTRAIN WEB.",
        statsCount: `${websiteCount + softwareCount}+`,
        statsText: isBn ? "সন্তুষ্ট গ্রাহক বিশ্বজুড়ে।" : "customers in world-wide.",
        agencyType: isBn ? "গ্লোবাল ডিজিটাল মার্কেটপ্লেস।" : "Global Digital Marketplace."
    };

    return (
        <section className="relative lg:min-h-[90vh] flex flex-col pt-24 lg:pt-32 pb-0 lg:pb-12 overflow-hidden bg-white dark:bg-[#0A0A0A]">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
                style={{ backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

            {/* Floating Geometric Shapes - Simple Elements with Hover */}
            {/* Circle 1 - Top Right */}
            <motion.div
                className="absolute top-[12%] right-[12%] w-5 h-5 border-2 border-[#FD9A00]/40 rounded-full hidden lg:block cursor-pointer"
                animate={{ y: [0, -15, 0], rotate: [0, 180, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 2, borderColor: "#FD9A00", borderWidth: "3px" }}
            />
            {/* Circle 2 - Left Side */}
            <motion.div
                className="absolute top-[30%] left-[6%] w-4 h-4 border-2 border-[#C4EE18]/50 rounded-full hidden lg:block cursor-pointer"
                animate={{ y: [0, 20, 0], x: [0, 5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                whileHover={{ scale: 2.5, backgroundColor: "#C4EE18", borderColor: "#C4EE18" }}
            />
            {/* Circle 3 - Bottom Right */}
            <motion.div
                className="absolute bottom-[40%] right-[20%] w-3 h-3 bg-[#FD9A00]/30 rounded-full hidden lg:block cursor-pointer"
                animate={{ y: [0, -12, 0], x: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                whileHover={{ scale: 3, backgroundColor: "#FD9A00" }}
            />

            {/* Square 1 - Rotating */}
            <motion.div
                className="absolute top-[22%] left-[18%] w-4 h-4 border-2 border-[#C4EE18]/30 hidden lg:block cursor-pointer"
                animate={{ rotate: [0, 90, 180, 270, 360], y: [0, -10, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                whileHover={{ scale: 2, borderColor: "#C4EE18", backgroundColor: "rgba(196, 238, 24, 0.2)" }}
            />
            {/* Square 2 */}
            <motion.div
                className="absolute bottom-[50%] right-[8%] w-3 h-3 border-2 border-[#FD9A00]/25 hidden lg:block cursor-pointer"
                animate={{ rotate: [45, 135, 225, 315, 405] }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 3 }}
                whileHover={{ scale: 2.5, borderColor: "#FD9A00", backgroundColor: "rgba(253, 154, 0, 0.2)" }}
            />

            {/* Plus Sign 1 */}
            <motion.div
                className="absolute top-[45%] left-[10%] text-[#C4EE18]/40 text-2xl font-light hidden lg:block cursor-pointer select-none"
                animate={{ rotate: [0, 90, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.8, color: "#C4EE18" }}
            >
                +
            </motion.div>
            {/* Plus Sign 2 */}
            <motion.div
                className="absolute top-[18%] right-[25%] text-[#FD9A00]/35 text-xl font-light hidden lg:block cursor-pointer select-none"
                animate={{ rotate: [0, -90, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                whileHover={{ scale: 2, color: "#FD9A00" }}
            >
                +
            </motion.div>

            {/* Dots Pattern */}
            <motion.div
                className="absolute top-[55%] right-[15%] hidden lg:block cursor-pointer"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ opacity: 1, scale: 1.2 }}
            >
                <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 bg-[#FD9A00]/40 rounded-full" />
                    <div className="w-1.5 h-1.5 bg-[#FD9A00]/40 rounded-full" />
                    <div className="w-1.5 h-1.5 bg-[#FD9A00]/40 rounded-full" />
                </div>
            </motion.div>

            {/* Small Line Elements */}
            <motion.div
                className="absolute top-[35%] right-[5%] w-8 h-[2px] bg-[#C4EE18]/30 hidden lg:block cursor-pointer"
                animate={{ x: [0, 10, 0], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ width: "60px", backgroundColor: "#C4EE18" }}
            />
            <motion.div
                className="absolute bottom-[55%] left-[15%] w-6 h-[2px] bg-[#FD9A00]/25 hidden lg:block cursor-pointer"
                animate={{ x: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                whileHover={{ width: "50px", backgroundColor: "#FD9A00" }}
            />

            {/* Diamond Shape */}
            <motion.div
                className="absolute top-[60%] left-[5%] w-3 h-3 border-2 border-[#FD9A00]/30 hidden lg:block cursor-pointer"
                style={{ transform: "rotate(45deg)" }}
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                whileHover={{ scale: 2, borderColor: "#FD9A00", backgroundColor: "rgba(253, 154, 0, 0.15)" }}
            />

            {/* Ring Element */}
            <motion.div
                className="absolute top-[40%] right-[30%] w-6 h-6 border border-[#C4EE18]/20 rounded-full hidden lg:block cursor-pointer"
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeOut" }}
                whileHover={{ scale: 1.8, borderWidth: "2px", borderColor: "#C4EE18" }}
            />

            <div className="container relative z-10 px-6 lg:px-12 max-w-[1400px] mx-auto flex-1">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12">

                    {/* Left Content Area */}
                    <div className="flex-1">
                        <motion.div variants={containerVariants} initial="hidden" animate="visible">

                            {/* Row 1: Desc + Line 1 + Bird */}
                            <div className="flex items-start gap-6 lg:gap-12 mb-2 lg:mb-4">
                                <motion.div
                                    variants={itemVariants}
                                    className="w-32 lg:w-48 pt-4 hidden md:block group cursor-default"
                                    whileHover={{ x: 5 }}
                                >
                                    <div className="w-12 lg:w-16 h-[1.5px] bg-black dark:bg-white mb-3 transition-all duration-300 group-hover:w-20 group-hover:bg-[#FD9A00]" />
                                    <p className={`text-[10px] lg:text-[11px] leading-relaxed text-gray-500 font-medium transition-colors duration-300 group-hover:text-gray-700 dark:group-hover:text-gray-300 ${bengaliClass}`}>
                                        {translations.description}
                                    </p>
                                </motion.div>

                                <motion.h1
                                    className={`text-4xl sm:text-5xl lg:text-[85px] font-black text-gray-950 dark:text-white uppercase font-teko leading-[0.95] tracking-tight cursor-default ${bengaliClass}`}
                                    whileHover={{ scale: 1.02, x: 5 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    {translations.line1}
                                </motion.h1>

                                <motion.div
                                    variants={floatingVariants}
                                    animate="animate"
                                    className="mt-2 hidden lg:block cursor-pointer"
                                    whileHover={{ scale: 1.3, rotate: 10 }}
                                >
                                    <svg width="60" height="40" viewBox="0 0 112 60" fill="none" className="text-gray-900 dark:text-white transition-colors hover:text-[#FD9A00]">
                                        <path d="M0 1C30.8503 1 34.8743 21.4865 34.8743 42.3801C46.3872 37.2924 68.8096 33.4936 66.3952 59C71.3134 46.6764 81.1497 11.5146 112 11.5146" stroke="currentColor" strokeWidth="1.5" />
                                        <path d="M40.5749 20.3333C41.1337 22.4815 42.1844 27.5918 41.9162 30.848C43.7046 29.039 48.4216 25.8281 52.982 27.4561" stroke="currentColor" strokeWidth="1.5" />
                                    </svg>
                                </motion.div>
                            </div>

                            {/* Row 2: SOFTWARE + Arrow + SOLUTION */}
                            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-2 lg:gap-6 ml-0 lg:ml-48 mb-2 lg:mb-4">
                                <motion.h1
                                    className={`text-4xl sm:text-5xl lg:text-[85px] font-black uppercase font-teko leading-[0.95] tracking-tight cursor-default ${bengaliClass}`}
                                    style={{ color: '#FD9A00' }}
                                    whileHover={{ scale: 1.05, textShadow: "0 0 20px rgba(253, 154, 0, 0.5)" }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    {translations.line2Part1}
                                </motion.h1>

                                <motion.div
                                    className="h-10 lg:h-14 px-3 lg:px-8 bg-[#C4EE18] rounded-full flex items-center justify-center shadow-lg cursor-pointer"
                                    whileHover={{ scale: 1.15, boxShadow: "0 10px 30px rgba(196, 238, 24, 0.4)" }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ type: "spring", stiffness: 400 }}
                                >
                                    <motion.svg
                                        className="w-8 lg:w-10 text-black"
                                        viewBox="0 0 40 16"
                                        fill="currentColor"
                                        whileHover={{ x: 5 }}
                                    >
                                        <path d="M29.88 15.8569L39.552 9.01379C39.6896 8.90372 39.8026 8.75338 39.8808 8.57638C39.959 8.39937 40 8.20127 40 8C40 7.79873 39.959 7.60063 39.8808 7.42363C39.8026 7.24662 39.6896 7.09628 39.552 6.98621L29.88 0.143139C29.6915 0.0179054 29.4743 -0.0269382 29.2628 0.0156776C29.0512 0.0582934 28.8572 0.185945 28.7114 0.378507C28.5656 0.571069 28.4763 0.817589 28.4575 1.0792C28.4387 1.34081 28.4916 1.60264 28.6077 1.8234L31.4128 6.82663L0.958012 6.82663C0.70393 6.82663 0.460255 6.95026 0.280594 7.1703C0.100933 7.39035 0 7.6888 0 8C0 8.3112 0.100933 8.60965 0.280594 8.8297C0.460255 9.04975 0.70393 9.17337 0.958012 9.17337L31.4128 9.17337L28.6077 14.1766C28.4916 14.3974 28.4387 14.6592 28.4575 14.9208C28.4763 15.1824 28.5656 15.4289 28.7114 15.6215C28.8572 15.8141 29.0512 15.9417 29.2628 15.9843C29.4743 16.0269 29.6915 15.9821 29.88 15.8569Z" />
                                    </motion.svg>
                                </motion.div>

                                <motion.h1
                                    className={`text-4xl sm:text-5xl lg:text-[85px] font-black text-gray-950 dark:text-white uppercase font-teko leading-[0.95] tracking-tight cursor-default ${bengaliClass}`}
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    {translations.line2Part2}
                                </motion.h1>
                            </motion.div>

                            {/* Row 3: SOLUTIONS. + Shape */}
                            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3 lg:gap-6 ml-0 lg:ml-30 mb-12 relative">
                                <motion.span
                                    className={`lg:absolute lg:-top-1 lg:-left-16 text-2xl lg:text-4xl text-[#FD9A00] font-normal lowercase tracking-wide z-10 caveat cursor-default ${bengaliClass}`}
                                    whileHover={{ scale: 1.2, rotate: -5 }}
                                >
                                    {isBn ? "সাথে" : "with"}
                                </motion.span>
                                <motion.h1
                                    className={`text-4xl sm:text-5xl lg:text-[85px] font-black text-gray-950 dark:text-white uppercase font-teko leading-[0.95] tracking-tight cursor-default ${bengaliClass}`}
                                    whileHover={{ scale: 1.02, x: 5 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    {isBn ? "এক্সট্রেন ওয়েব" : "EXTRA IN WEB."}
                                </motion.h1>
                                <motion.div
                                    className="w-10 lg:w-12 h-10 lg:h-12 border-4 border-[#C4EE18] rounded-full hidden lg:block cursor-pointer"
                                    whileHover={{ scale: 1.3, rotate: 180, borderColor: "#FD9A00" }}
                                    transition={{ type: "spring", stiffness: 200 }}
                                />
                            </motion.div>

                            {/* Bottom Row: Stats & Play */}
                            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-10 lg:gap-16 ml-0 lg:ml-20">
                                <motion.div
                                    className="flex items-center gap-4 cursor-default"
                                    whileHover={{ x: 5 }}
                                >
                                    <div className="flex -space-x-3">
                                        {avatars.map((url, i) => (
                                            <motion.img
                                                key={i}
                                                src={url}
                                                className="w-10 h-10 rounded-full border-2 border-white dark:border-[#0A0A0A] object-cover shadow-sm"
                                                alt="User"
                                                whileHover={{ scale: 1.2, zIndex: 10 }}
                                                transition={{ type: "spring", stiffness: 300 }}
                                            />
                                        ))}
                                    </div>
                                    <p className={`text-[12px] leading-tight text-gray-400 font-medium ${bengaliClass}`}>
                                        We have <span className="font-bold text-gray-900 dark:text-white text-base">{translations.statsCount}</span><br />
                                        {translations.statsText}
                                    </p>
                                </motion.div>

                                <div className="flex items-center gap-4 -ml-2.5">
                                    <motion.div
                                        className="w-12 h-12 bg-black dark:bg-white rounded-full flex items-center justify-center text-white dark:text-black cursor-pointer shadow-lg"
                                        whileHover={{ scale: 1.2, boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)" }}
                                        whileTap={{ scale: 0.9 }}
                                        transition={{ type: "spring", stiffness: 400 }}
                                    >
                                        <FiPlay className="ml-1" size={18} />
                                    </motion.div>
                                    <p className={`text-[12px] leading-tight text-gray-400 font-medium ${bengaliClass}`}>
                                        {isBn ? "আমরা গ্লোবাল" : "We're Global"}<br />
                                        <span className="font-bold text-gray-900 dark:text-white">{translations.agencyType}</span>
                                    </p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Right Card Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="w-full lg:w-[360px] bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-white/5 rounded-xl lg:rounded-md p-5 lg:p-8 lg:mt-40 shadow-md lg:shadow-xl overflow-hidden group"
                    >
                        <div className="flex items-center gap-3 lg:gap-4 mb-6 lg:mb-14">
                            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-black dark:bg-white rounded-full flex items-center justify-center text-white dark:text-black font-black text-lg lg:text-xl">
                                E.
                            </div>
                            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-[#C4EE18] rounded-full flex items-center justify-center text-black shadow-inner transition-transform group-hover:rotate-45">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <path d="M7 17l10-10M17 17V7H7" />
                                </svg>
                            </div>
                        </div>

                        <h3 className={`text-lg lg:text-xl font-black text-gray-900 dark:text-white mb-1.5 uppercase font-teko ${bengaliClass}`}>
                            {isBn ? "এক্সট্রেন প্রোভাইডার" : "Extrain Provider"}
                        </h3>
                        <p className={`text-[11px] lg:text-[12px] text-gray-500 leading-relaxed mb-4 lg:mb-6 ${bengaliClass}`}>
                            {isBn ? "২০১৯ থেকে আপনার বিশ্বস্ত ডিজিটাল পার্টনার।" : "Helping businesses scale with expert solutions since 2019."}
                        </p>

                        {/* Project Info Stats — each box links to its own page */}
                        <div className="grid grid-cols-2 gap-3 pt-3 lg:pt-4 border-t border-gray-100 dark:border-white/10">
                            <Link
                                href="/website"
                                className="p-3 bg-white dark:bg-black/40 rounded-md border border-gray-100 dark:border-white/5 shadow-sm hover:border-[#FD9A00] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                            >
                                <h4 className="text-lg lg:text-xl font-black text-gray-900 dark:text-white font-teko leading-none">{websiteCount}+</h4>
                                <p className={`text-[9px] text-gray-500 uppercase font-bold tracking-wider mt-1 ${bengaliClass}`}>
                                    {isBn ? "ওয়েবসাইট" : "Websites"}
                                </p>
                            </Link>
                            <Link
                                href="/ielts-software"
                                className="p-3 bg-white dark:bg-black/40 rounded-md border border-gray-100 dark:border-white/5 shadow-sm hover:border-[#FD9A00] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                            >
                                <h4 className="text-lg lg:text-xl font-black text-gray-900 dark:text-white font-teko leading-none">{softwareCount}+</h4>
                                <p className={`text-[9px] text-gray-500 uppercase font-bold tracking-wider mt-1 ${bengaliClass}`}>
                                    {isBn ? "সফটওয়্যার" : "Software"}
                                </p>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Infinite Text Marquee (Ticker) - As requested */}
            <div className="relative mt-10 lg:mt-0 lg:absolute lg:bottom-8 lg:left-0 w-full bg-[#C4EE18] py-3 lg:py-5 overflow-hidden border-t-2 border-black/5">
                <motion.div
                    className="flex whitespace-nowrap items-center"
                    animate={{ x: [0, "-50%"] }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    {/* Duplicate contents for seamless loop */}
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="flex items-center">
                            {tickerItems.map((item, idx) => (
                                <React.Fragment key={idx}>
                                    <span className={`text-xl lg:text-3xl font-black text-black uppercase tracking-tighter mx-8 lg:mx-12 font-teko`}>
                                        {isBn ? item.bn : item.en}
                                    </span>
                                    {idx % 2 === 0 ? (
                                        <span className="text-black text-2xl lg:text-4xl">●</span>
                                    ) : (
                                        <div className="flex items-center">
                                            <svg className="w-8 lg:w-12 h-6 lg:h-8 text-black" viewBox="0 0 40 16" fill="currentColor">
                                                <path d="M29.88 15.8569L39.552 9.01379C39.6896 8.90372 39.8026 8.75338 39.8808 8.57638C39.959 8.39937 40 8.20127 40 8C40 7.79873 39.959 7.60063 39.8808 7.42363C39.8026 7.24662 39.6896 7.09628 39.552 6.98621L29.88 0.143139C29.6915 0.0179054 29.4743 -0.0269382 29.2628 0.0156776C29.0512 0.0582934 28.8572 0.185945 28.7114 0.378507C28.5656 0.571069 28.4763 0.817589 28.4575 1.0792C28.4387 1.34081 28.4916 1.60264 28.6077 1.8234L31.4128 6.82663L0.958012 6.82663C0.70393 6.82663 0.460255 6.95026 0.280594 7.1703C0.100933 7.39035 0 7.6888 0 8C0 8.3112 0.100933 8.60965 0.280594 8.8297C0.460255 9.04975 0.70393 9.17337 0.958012 9.17337L31.4128 9.17337L28.6077 14.1766C28.4916 14.3974 28.4387 14.6592 28.4575 14.9208C28.4763 15.1824 28.5656 15.4289 28.7114 15.6215C28.8572 15.8141 29.0512 15.9417 29.2628 15.9843C29.4743 16.0269 29.6915 15.9821 29.88 15.8569Z" />
                                            </svg>
                                        </div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Scroll Down Indication - Positioned above ticker */}
            <div className="absolute left-6 lg:left-12 bottom-20 lg:bottom-28 hidden lg:flex flex-col items-center gap-4 opacity-30">
                <FiArrowDown size={20} className="animate-bounce" />
                <div className="w-[1px] h-12 bg-black dark:bg-white" />
            </div>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&display=swap');
                .caveat { font-family: 'Caveat', cursive; }
            `}</style>
        </section>
    );
};

export default Hero;
