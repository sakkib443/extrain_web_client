"use client";

import { motion } from "framer-motion";
import { LuShoppingCart, LuTrendingUp, LuBadgeCheck, LuStar } from "react-icons/lu";

// Gentle floating animation helper
const float = (duration, delay = 0) => ({
    animate: { y: [0, -12, 0] },
    transition: { duration, repeat: Infinity, ease: "easeInOut", delay },
});

export default function CategoryHeroVisual() {
    return (
        <div className="relative hidden lg:flex items-center justify-center min-h-[440px]">
            {/* Glow blobs */}
            <div className="absolute left-6 top-8 w-72 h-72 bg-[#FD9A00]/20 rounded-full blur-3xl" />
            <div className="absolute right-6 bottom-8 w-60 h-60 bg-[#0CB2A9]/20 rounded-full blur-3xl" />

            {/* Main browser / store card */}
            <motion.div
                {...float(6)}
                className="relative w-[340px] rounded-2xl bg-white dark:bg-[#161616] border border-gray-100 dark:border-white/10 shadow-2xl shadow-black/10 overflow-hidden"
            >
                {/* top bar */}
                <div className="flex items-center gap-1.5 px-4 py-3 border-b border-gray-100 dark:border-white/5">
                    <span className="w-3 h-3 rounded-full bg-red-400" />
                    <span className="w-3 h-3 rounded-full bg-amber-400" />
                    <span className="w-3 h-3 rounded-full bg-green-400" />
                    <span className="ml-3 h-2 w-28 rounded-full bg-gray-100 dark:bg-white/10" />
                </div>
                {/* body */}
                <div className="p-4 space-y-3">
                    <div className="h-20 rounded-xl bg-gradient-to-r from-[#FD9A00] to-[#0CB2A9]" />
                    <div className="grid grid-cols-3 gap-2">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="rounded-lg bg-gray-50 dark:bg-white/[0.03] p-1.5 border border-gray-100 dark:border-white/5">
                                <div className="aspect-square rounded-md bg-gray-100 dark:bg-white/[0.06]" />
                                <div className="h-1 w-3/4 rounded-full bg-gray-200 dark:bg-white/10 mt-1.5" />
                                <div className="h-1 w-1/2 rounded-full bg-gray-200 dark:bg-white/10 mt-1" />
                            </div>
                        ))}
                    </div>
                    <div className="h-9 rounded-lg bg-gray-900 dark:bg-white" />
                </div>
            </motion.div>

            {/* Floating: cart (top-left) */}
            <motion.div
                {...float(5.5, 0.2)}
                className="absolute top-4 left-6 w-11 h-11 rounded-xl bg-gray-900 dark:bg-white flex items-center justify-center shadow-xl"
            >
                <LuShoppingCart className="text-white dark:text-gray-900" size={20} />
            </motion.div>

            {/* Floating: new order (top-right) */}
            <motion.div
                {...float(5, 0.6)}
                className="absolute top-10 right-0 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white dark:bg-[#161616] border border-gray-100 dark:border-white/10 shadow-xl"
            >
                <span className="w-8 h-8 rounded-lg bg-[#0CB2A9] flex items-center justify-center">
                    <LuBadgeCheck className="text-black" size={18} />
                </span>
                <div>
                    <p className="text-[10px] font-bold text-gray-800 dark:text-white leading-none mb-0.5">New Order</p>
                    <p className="text-[11px] text-[#FD9A00] font-black leading-none">+ ৳1,250</p>
                </div>
            </motion.div>

            {/* Floating: sales up (bottom-left) */}
            <motion.div
                {...float(7, 0.3)}
                className="absolute bottom-12 left-0 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white dark:bg-[#161616] border border-gray-100 dark:border-white/10 shadow-xl"
            >
                <span className="w-8 h-8 rounded-lg bg-[#FD9A00] flex items-center justify-center">
                    <LuTrendingUp className="text-white" size={18} />
                </span>
                <div>
                    <p className="text-[10px] font-bold text-gray-800 dark:text-white leading-none mb-0.5">Sales</p>
                    <p className="text-[11px] text-green-500 font-black leading-none">▲ 38%</p>
                </div>
            </motion.div>

            {/* Floating: rating (bottom-right) */}
            <motion.div
                {...float(6, 0.9)}
                className="absolute bottom-6 right-10 flex items-center gap-1 px-3 py-2 rounded-full bg-white dark:bg-[#161616] border border-gray-100 dark:border-white/10 shadow-xl"
            >
                <LuStar className="text-amber-400 fill-amber-400" size={14} />
                <span className="text-[11px] font-bold text-gray-800 dark:text-white">4.9</span>
            </motion.div>
        </div>
    );
}
