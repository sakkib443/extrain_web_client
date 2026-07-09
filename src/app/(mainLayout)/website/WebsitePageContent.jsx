"use client";
import React, { Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWebsites } from "@/redux/websiteSlice";
import { fetchCategories } from "@/redux/categorySlice";
import dynamic from "next/dynamic";
import { LuGlobe, LuPlus } from "react-icons/lu";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";

const RightWebsiteDetails = dynamic(
    () => import("@/components/websitepage/RightWebsiteDetails"),
    { ssr: false }
);

// Loading fallback component
const LoadingFallback = () => (
    <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-[#0CB2A9] border-t-transparent rounded-full animate-spin"></div>
    </div>
);

export default function WebsitePageContent({ initialWebsites = [] }) {
    const dispatch = useDispatch();
    const { websiteList = initialWebsites, loading } = useSelector((state) => state.websites || {});
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState("All");
    const [mounted, setMounted] = useState(false);
    const { language } = useLanguage();
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";

    useEffect(() => {
        setMounted(true);
        // We still dispatch to keep Redux in sync for other components, 
        // but initial render uses initialWebsites from props
        dispatch(fetchWebsites());
        dispatch(fetchCategories({ type: 'website' }));
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

            {/* Ambient Animated Blobs - Green Theme to match Website color */}
            <motion.div
                animate={{ x: [0, 50, 0], y: [0, 30, 0], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="fixed top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#0CB2A9]/5 rounded-full blur-[120px] pointer-events-none z-0"
            />
            <motion.div
                animate={{ x: [0, -30, 0], y: [0, -50, 0], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear", delay: 2 }}
                className="fixed bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#0CB2A9]/5 rounded-full blur-[100px] pointer-events-none z-0"
            />

            {/* Main Content Container */}
            <div className="relative z-10">
                {/* Hero Header Section - Left Aligned */}
                <section className="relative overflow-hidden pt-20 pb-6 lg:pt-24 lg:pb-8">
                    <div className="container mx-auto px-4 lg:px-16">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="max-w-4xl"
                        >
                            {/* Modern Left Header */}
                            <div className="flex items-center gap-3 mb-6">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: 40 }}
                                    transition={{ delay: 0.5, duration: 0.5 }}
                                    className="h-[2px] bg-[#0CB2A9]"
                                />
                                <span className={`text-[10px] font-black text-[#0CB2A9] uppercase tracking-[0.4em] ${bengaliClass}`}>
                                    {language === 'bn' ? 'প্রিমিয়াম ওয়েবসাইট' : 'Premium Websites'}
                                </span>
                            </div>

                            <motion.h1
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                                className={`text-5xl lg:text-7xl font-black text-gray-950 dark:text-white mb-6 uppercase leading-[0.85] tracking-tighter font-poppins ${bengaliClass}`}
                            >
                                {language === 'bn' ? 'আমাদের' : 'Our Website '}<span className="text-[#0CB2A9]">{language === 'bn' ? 'মার্কেটপ্লেস' : 'Marketplace'}</span>
                            </motion.h1>

                            <p className={`text-gray-500 dark:text-gray-400 text-sm lg:text-base max-w-2xl leading-relaxed mb-10 ${bengaliClass}`}>
                                {language === 'bn'
                                    ? 'রেডি-মেড ওয়েবসাইট সমাধান যা আপনার ব্যবসাকে দ্রুত অনলাইনে নিয়ে আসবে। আমাদের মার্কেটপ্লেসে আছে সেরা ডিজাইনের ওয়েবসাইট সমুহ।'
                                    : 'Fully functional, ready-to-deploy websites for startups and enterprises. Get online in minutes with our premium templates.'}
                            </p>

                            {/* Stats - Left Aligned & Modern */}
                            <div className="flex flex-wrap items-center gap-12">
                                <div className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 bg-gray-50 dark:bg-white/5 rounded-md flex items-center justify-center border border-gray-100 dark:border-white/10 group-hover:border-[#0CB2A9] transition-colors">
                                        <LuGlobe className="text-gray-400 group-hover:text-[#0CB2A9] transition-colors text-xl" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black text-gray-900 dark:text-white font-poppins leading-none mb-1">{websiteList.length || '0'}+</p>
                                        <p className={`text-[11px] font-bold text-gray-400 uppercase tracking-widest ${bengaliClass}`}>{language === 'bn' ? 'ওয়েবসাইট' : 'Websites'}</p>
                                    </div>
                                </div>

                                <div className="w-px h-12 bg-gray-200 dark:bg-white/10 hidden sm:block"></div>

                                <div className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 bg-gray-50 dark:bg-white/5 rounded-md flex items-center justify-center border border-gray-100 dark:border-white/10 group-hover:border-[#0CB2A9] transition-colors">
                                        <LuPlus className="text-gray-400 group-hover:text-[#0CB2A9] transition-colors text-xl" />
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
                            <RightWebsiteDetails
                                searchQuery={searchQuery}
                                selectedType={selectedType}
                            />
                        </motion.div>
                    </Suspense>
                </section>
            </div>
        </div>
    );
}
