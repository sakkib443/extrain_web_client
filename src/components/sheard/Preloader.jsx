"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Preloader = () => {
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Only greet on the first page of a session.
        if (sessionStorage.getItem("hasVisited")) {
            setLoading(false);
            return;
        }

        let current = 0;
        const interval = setInterval(() => {
            current += 4;
            if (current >= 100) {
                current = 100;
                clearInterval(interval);
            }
            setProgress(current);
        }, 20);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (progress < 100) return;
        const timer = setTimeout(() => {
            setLoading(false);
            sessionStorage.setItem("hasVisited", "true");
        }, 320);
        return () => clearTimeout(timer);
    }, [progress]);

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FFFDF8]"
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <motion.img
                        src="/extrain-logo.png"
                        alt="Extrain Web"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                        className="h-10 md:h-12 w-auto object-contain"
                    />

                    <div className="mt-8 h-[2px] w-36 md:w-44 rounded-full bg-slate-900/10 overflow-hidden">
                        <div
                            className="h-full rounded-full bg-[#0CB2A9] transition-[width] duration-150 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Preloader;
