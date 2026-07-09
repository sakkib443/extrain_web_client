"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Preloader = () => {
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [phase, setPhase] = useState(1); // 1: loading, 2: reveal
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        // Check if this is the first visit in this session
        const hasVisited = sessionStorage.getItem('hasVisited');

        if (hasVisited) {
            setLoading(false);
            setShowContent(true);
            return;
        }

        // Faster progress - complete in ~1.2 seconds
        let current = 0;
        const interval = setInterval(() => {
            current += 5; // Fast increment
            if (current >= 100) {
                current = 100;
                clearInterval(interval);
            }
            setProgress(current);
        }, 25);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (progress >= 100) {
            // Start reveal phase
            const timer1 = setTimeout(() => {
                setPhase(2);
            }, 300);

            // Hide preloader and show content with blur effect
            const timer2 = setTimeout(() => {
                setShowContent(true);
            }, 800);

            const timer3 = setTimeout(() => {
                setLoading(false);
                sessionStorage.setItem('hasVisited', 'true');
            }, 1600);

            return () => {
                clearTimeout(timer1);
                clearTimeout(timer2);
                clearTimeout(timer3);
            };
        }
    }, [progress]);

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    className="fixed inset-0 z-[9999] overflow-hidden bg-[#0A0A0A]"
                    animate={phase === 2 ? { y: "-100%" } : { y: 0 }}
                    exit={{ y: "-100%" }}
                    transition={{
                        duration: 1.1,
                        ease: [0.76, 0, 0.24, 1],
                    }}
                >
                    {/* Content Container (Logo, Number, Grid) */}
                    <div className="absolute inset-0">
                        {/* Grid Pattern */}
                        <div
                            className="absolute inset-0 opacity-[0.04]"
                            style={{
                                backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
                                backgroundSize: '60px 60px'
                            }}
                        />

                        {/* Gradient Orbs */}
                        <motion.div
                            className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#FD9A00]/10 rounded-full blur-[150px]"
                            animate={{
                                scale: [1, 1.3, 1],
                                x: [0, 50, 0],
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <motion.div
                            className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#0CB2A9]/10 rounded-full blur-[150px]"
                            animate={{
                                scale: [1, 1.2, 1],
                                x: [0, -40, 0],
                            }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                        />

                        {/* Content Container */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">

                            {/* Greeting Text - Small on top */}
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className="text-[10px] md:text-xs text-gray-500 uppercase tracking-[0.5em] mb-6 font-medium"
                            >
                                Assalamu Alaikum
                            </motion.p>

                            {/* Animated Logo */}
                            <div className="overflow-hidden mb-6">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <motion.img
                                    src="/extrain-logo.png"
                                    alt="Extrain Web"
                                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                    className="h-12 md:h-16 lg:h-20 w-auto object-contain brightness-0 invert"
                                />
                            </div>

                            {/* Progress Number */}
                            <div className="relative mb-8">
                                <div className="text-[80px] md:text-[120px] lg:text-[160px] font-black text-white/5 font-poppins leading-none select-none">
                                    {progress.toString().padStart(2, '0')}
                                </div>

                                {/* Overlay Number */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-[60px] md:text-[100px] lg:text-[130px] font-black font-poppins leading-none bg-gradient-to-r from-[#FD9A00] via-[#FFBA4F] to-[#0CB2A9] bg-clip-text text-transparent">
                                        {progress.toString().padStart(2, '0')}
                                    </span>
                                    <span className="text-[30px] md:text-[50px] text-[#0CB2A9] font-bold font-poppins">%</span>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-[200px] md:w-[300px] relative">
                                <div className="h-[2px] bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-[#FD9A00] via-[#FFBA4F] to-[#0CB2A9] rounded-full"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>

                            {/* Loading Text */}
                            <motion.p
                                className="mt-6 text-[10px] text-gray-600 uppercase tracking-[0.3em] font-medium"
                                animate={{ opacity: [0.4, 0.8, 0.4] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                Loading...
                            </motion.p>
                        </div>
                    </div>

                    {/* Reveal Overlay - Orange (Stays on top and moves up) */}
                    <motion.div
                        className="absolute inset-0 bg-[#FD9A00]"
                        initial={{ y: "100%" }}
                        animate={phase === 2 ? { y: 0 } : { y: "100%" }}
                        transition={{
                            duration: 0.5,
                            ease: [0.76, 0, 0.24, 1],
                        }}
                    />

                    {/* Reveal Overlay - Green (Stays on top and moves up) */}
                    <motion.div
                        className="absolute inset-0 bg-[#0CB2A9]"
                        initial={{ y: "100%" }}
                        animate={phase === 2 ? { y: 0 } : { y: "100%" }}
                        transition={{
                            duration: 0.5,
                            ease: [0.76, 0, 0.24, 1],
                            delay: 0.1
                        }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Preloader;
