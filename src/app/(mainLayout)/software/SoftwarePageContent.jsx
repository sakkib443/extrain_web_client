"use client";
import React, { Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSoftware } from "@/redux/softwareSlice";
import { fetchCategories, setSelectedCategories } from "@/redux/categorySlice";
import dynamic from "next/dynamic";
import { LuCpu, LuPlus } from "react-icons/lu";
import { useLanguage } from "@/context/LanguageContext";
import { IoSearchSharp } from "react-icons/io5";
import { motion } from "framer-motion";

const RightSoftwareDetails = dynamic(
    () => import("@/components/softwarepage/RightSoftwareDetails"),
    { ssr: false }
);

// Loading fallback component
const LoadingFallback = () => (
    <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-[#0CB2A9] border-t-transparent rounded-full animate-spin"></div>
    </div>
);

export default function SoftwarePageContent({ initialSoftware = [] }) {
    const dispatch = useDispatch();
    const { softwareList = initialSoftware, loading } = useSelector((state) => state.software || {});
    const { items: categories = [], selectedCategories = [] } = useSelector((state) => state.categories || {});
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState("All");
    const [mounted, setMounted] = useState(false);
    const { language } = useLanguage();
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";

    useEffect(() => {
        setMounted(true);
        dispatch(fetchSoftware());
        dispatch(fetchCategories({ type: 'software' }));
    }, [dispatch]);

    if (!mounted) return <LoadingFallback />;

    return (
        <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300 relative selection:bg-[#0CB2A9] selection:text-black">
            {/* Unified Filtered Background - Spans entire page */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
                    style={{ backgroundImage: 'linear-gradient(#000 0.5px, transparent 0.5px), linear-gradient(90deg, #000 0.5px, transparent 0.5px)', backgroundSize: '40px 40px' }}
                />
            </div>

            {/* Ambient Animated Blobs - Orange Theme */}
            <motion.div
                animate={{ x: [0, 50, 0], y: [0, 30, 0], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="fixed top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#FD9A00]/5 rounded-full blur-[120px] pointer-events-none z-0"
            />
            <motion.div
                animate={{ x: [0, -30, 0], y: [0, -50, 0], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear", delay: 2 }}
                className="fixed bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#FD9A00]/5 rounded-full blur-[100px] pointer-events-none z-0"
            />

            {/* Main Content Container */}
            <div className="relative z-10">
                {/* Header Section - Transparent BG */}
                <section className="relative overflow-hidden pt-20 pb-6 lg:pt-24 lg:pb-8">
                    <div className="container mx-auto px-4 lg:px-16">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="max-w-4xl"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: 40 }}
                                    transition={{ delay: 0.5, duration: 0.5 }}
                                    className="h-[2px] bg-[#FD9A00]"
                                />
                                <span className={`text-[10px] font-black text-[#FD9A00] uppercase tracking-[0.4em] ${bengaliClass}`}>
                                    {language === 'bn' ? 'প্রিমিয়াম সফটওয়্যার' : 'Premium Software'}
                                </span>
                            </div>

                            <motion.h1
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                                className={`text-5xl lg:text-7xl font-black text-gray-950 dark:text-white mb-3 uppercase leading-[0.85] tracking-tighter font-poppins ${bengaliClass}`}
                            >
                                {language === 'bn' ? 'আমাদের' : 'Our Software '}<span className="text-[#FD9A00]">{language === 'bn' ? 'মার্কেটপ্লেস' : 'Marketplace'}</span>
                            </motion.h1>

                            <p className={`text-gray-500 dark:text-gray-400 text-sm lg:text-base max-w-2xl leading-relaxed mb-8 ${bengaliClass}`}>
                                {language === 'bn'
                                    ? 'প্রিমিয়াম সফটওয়্যার, স্ক্রিপ্ট এবং প্লাগিন সমুহ। আপনার কাজকে করবে আরও সহজ।'
                                    : 'Premium software, scripts and plugins for your creative projects. Get started in minutes.'}
                            </p>

                            {/* Search Bar */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                                className="relative max-w-md mb-10"
                            >
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <IoSearchSharp className="text-gray-400 text-lg" />
                                </div>
                                <input
                                    type="text"
                                    placeholder={language === 'bn' ? 'সফটওয়্যার খুঁজুন...' : 'Search software...'}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className={`block w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-white/10 rounded-xl bg-gray-50/50 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FD9A00]/20 focus:border-[#FD9A00] transition-all text-sm font-medium ${bengaliClass}`}
                                />
                            </motion.div>

                            {/* Stats */}
                            <div className="flex flex-wrap items-center gap-12">
                                <div className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 bg-gray-50 dark:bg-white/5 rounded-md flex items-center justify-center border border-gray-200 dark:border-white/10 group-hover:border-[#FD9A00] transition-colors">
                                        <LuCpu className="text-gray-400 group-hover:text-[#FD9A00] transition-colors text-xl" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black text-gray-900 dark:text-white font-poppins leading-none mb-1">{softwareList.length || '0'}+</p>
                                        <p className={`text-[11px] font-bold text-gray-400 uppercase tracking-widest ${bengaliClass}`}>{language === 'bn' ? 'সফটওয়্যার' : 'Software'}</p>
                                    </div>
                                </div>

                                <div className="w-px h-12 bg-gray-200 dark:bg-white/10 hidden sm:block"></div>

                                <div className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 bg-gray-50 dark:bg-white/5 rounded-md flex items-center justify-center border border-gray-200 dark:border-white/10 group-hover:border-[#FD9A00] transition-colors">
                                        <LuPlus className="text-gray-400 group-hover:text-[#FD9A00] transition-colors text-xl" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black text-gray-900 dark:text-white font-poppins leading-none mb-1">24/7</p>
                                        <p className={`text-[11px] font-bold text-gray-400 uppercase tracking-widest ${bengaliClass}`}>{language === 'bn' ? 'সাপোর্ট' : 'Support'}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Main Content Area */}
                <section className="container mx-auto px-4 lg:px-16 pb-20">
                    <Suspense fallback={<LoadingFallback />}>
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                        >
                            <RightSoftwareDetails
                                searchQuery={searchQuery}
                                selectedType={selectedType}
                                setSelectedType={setSelectedType}
                            />
                        </motion.div>
                    </Suspense>
                </section>
            </div>
        </div>
    );
}
