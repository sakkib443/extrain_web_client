"use client";

import { FaWhatsapp, FaArrowUp } from "react-icons/fa";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Combined Floating Buttons Component
 * - WhatsApp chat button (Always visible)
 * - Scroll to Top button (Visible after 400px scroll)
 * - WhatsApp button moves up when Scroll button appears
 */
const WhatsAppButton = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [showScroll, setShowScroll] = useState(false);

    useEffect(() => {
        const checkScroll = () => {
            if (window.scrollY > 400) {
                setShowScroll(true);
            } else {
                setShowScroll(false);
            }
        };

        window.addEventListener("scroll", checkScroll);
        // Initial check
        checkScroll();
        return () => window.removeEventListener("scroll", checkScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <div className="fixed bottom-24 right-6 z-[999] flex flex-col items-end gap-4 pointer-events-none">
            {/* WhatsApp Button Wrapper */}
            <motion.div
                layout
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="flex items-center gap-3 group pointer-events-auto"
            >
                {/* Tooltip */}
                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="px-4 py-2 bg-white dark:bg-slate-800 text-gray-800 dark:text-white text-sm font-bold rounded-xl shadow-2xl border border-gray-100 dark:border-slate-700 poppins whitespace-nowrap"
                        >
                            Chat with us!
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main WhatsApp Button */}
                <a
                    href="https://wa.me/8801711946614?text=Hello%20Extrain%20Web!%20I%20want%20to%20know%20more%20about%20your%20services."
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="relative block"
                >
                    {/* Ring Animations */}
                    <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-20"></div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#25D366] to-[#128C7E] rounded-full blur-sm opacity-0 group-hover:opacity-40 transition-opacity"></div>

                    {/* Button Body */}
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="relative w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-[0_10px_25px_-5px_rgba(37,211,102,0.4)] hover:shadow-[0_15px_30px_-5px_rgba(37,211,102,0.6)] transition-all duration-300"
                    >
                        <FaWhatsapp className="text-3xl" />
                    </motion.div>
                </a>
            </motion.div>

            {/* Scroll to Top Button */}
            <AnimatePresence>
                {showScroll && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0, y: 30 }}
                        whileHover={{
                            scale: 1.1,
                            backgroundColor: "rgb(255, 255, 255)",
                        }}
                        whileTap={{ scale: 0.9 }}
                        onClick={scrollToTop}
                        className="w-14 h-14 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-rose-600 dark:text-rose-500 rounded-full flex items-center justify-center shadow-xl border border-gray-200/50 dark:border-slate-700/50 transition-all pointer-events-auto group"
                        aria-label="Scroll to top"
                    >
                        <motion.div
                            animate={{ y: [0, -3, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <FaArrowUp size={22} />
                        </motion.div>

                        {/* Shadow Effect */}
                        <div className="absolute inset-0 rounded-full bg-rose-500/5 blur-lg -z-10 group-hover:bg-rose-500/10"></div>
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
};

export default WhatsAppButton;
