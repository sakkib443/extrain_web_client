"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { LuArrowUpRight } from "react-icons/lu";
import { useLanguage } from "@/context/LanguageContext";

const avatars = [
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&q=80",
];

const Hero = () => {
    const { language } = useLanguage();
    const isBn = language === "bn";
    const bn = isBn ? "hind-siliguri" : "";

    // mouse + scroll parallax
    const [mouse, setMouse] = useState({ x: 0, y: 0 });
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        if (typeof window === "undefined") return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const onMove = (e) => {
            setMouse({
                x: e.clientX / window.innerWidth - 0.5,   // -0.5 .. 0.5
                y: e.clientY / window.innerHeight - 0.5,
            });
        };
        const onScroll = () => setScrollY(window.scrollY);

        window.addEventListener("mousemove", onMove, { passive: true });
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("scroll", onScroll);
        };
    }, []);

    // parallax transforms
    const orbParallax = {
        transform: `translate3d(${mouse.x * 40}px, ${mouse.y * 40 - scrollY * 0.18}px, 0)`,
    };
    const photoParallax = {
        transform: `translate3d(${mouse.x * -26}px, ${mouse.y * -26 + scrollY * 0.08}px, 0)`,
    };

    return (
        <section className="relative overflow-hidden bg-[#0a0a0a] text-white">
            {/* ===== Background image (green + purple glow, diagonal streaks) ===== */}
            <div
                className="absolute inset-0 pointer-events-none bg-cover bg-center"
                style={{ backgroundImage: "url('/hero-bg.webp')" }}
            />
            {/* subtle dark overlay for text contrast */}
            <div className="absolute inset-0 pointer-events-none bg-black/25" />

            {/* ===== Content ===== */}
            <div className="relative z-10 container mx-auto px-6 lg:px-10">
                <div className="relative min-h-[92vh] flex flex-col justify-center pt-32 pb-20 lg:pt-36">

                    {/* ---- Top: customers badge ---- */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="flex items-center gap-4 mb-4"
                    >
                        <div className="flex items-center">
                            <div className="flex -space-x-3">
                                {avatars.map((url, i) => (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        key={i}
                                        src={url}
                                        alt="Happy customer"
                                        className="w-11 h-11 rounded-full border-2 border-[#0a0a0a] object-cover"
                                    />
                                ))}
                            </div>
                            <span className="ml-2 grid place-items-center w-11 h-11 rounded-full bg-[#F8921C] text-black text-[11px] font-extrabold border-2 border-[#0a0a0a]">
                                7K+
                            </span>
                        </div>
                        <div className={`leading-tight ${bn}`}>
                            <p className="text-lg font-bold text-white">300 +</p>
                            <p className="text-sm text-white/70">
                                {isBn ? "সন্তুষ্ট গ্রাহক" : "Happy Customers"}
                            </p>
                        </div>
                    </motion.div>

                    {/* ---- Headline ---- */}
                    <div className="relative">
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className="font-poppins font-extrabold tracking-tight leading-[0.9] text-[15vw] lg:text-[10.5rem]"
                        >
                            <span className="block text-white">INNOVATIVE</span>
                            <span className="block">
                                <span className="text-white">DIG</span>
                                <span className="text-[#F8921C]">ITAL</span>
                            </span>
                        </motion.h1>

                        {/* golden orb (right) — parallax wrapper → float → spin */}
                        <div
                            style={orbParallax}
                            className="absolute right-[3%] top-[4%] w-[16vw] h-[16vw] max-w-[240px] max-h-[240px] hidden md:block z-20 transition-transform duration-300 ease-out"
                        >
                            <div className="orb-float w-full h-full">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src="/hero-1rightimg1-233x244.png"
                                    alt="Golden 3D orb"
                                    className="orb-spin w-full h-full object-contain drop-shadow-[0_30px_60px_rgba(245,184,20,0.35)]"
                                />
                            </div>
                        </div>

                        {/* team photo (lower-left, rounded-square) — parallax */}
                        <div
                            style={photoParallax}
                            className="absolute left-[0%] top-[104%] w-[14vw] max-w-[180px] aspect-square hidden md:block z-20 transition-transform duration-300 ease-out"
                        >
                            <div className="photo-float w-full h-full">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80"
                                    alt="Our team at work"
                                    className="w-full h-full object-cover rounded-[2rem] border border-white/10 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)]"
                                />
                                {/* little yellow triangle accent */}
                                <span className="absolute -top-3 right-6 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[18px] border-b-[#F8921C] rotate-12" />
                            </div>
                        </div>
                    </div>

                    {/* ---- Bottom-right description ---- */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="mt-10 lg:mt-16 lg:ml-auto lg:max-w-md flex items-start gap-4"
                    >
                        {/* curved arrow */}
                        <svg width="70" height="80" viewBox="0 0 70 80" fill="none" className="shrink-0 mt-2 hidden lg:block">
                            <path d="M8 72 C 20 40, 40 20, 58 12" stroke="#F8921C" strokeWidth="3" strokeLinecap="round" />
                            <path d="M46 10 L60 10 L58 24" stroke="#F8921C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        </svg>
                        <p className={`text-white/80 text-base lg:text-lg leading-relaxed ${bn}`}>
                            {isBn
                                ? "একটি ডিজিটাল এজেন্সি ব্যবসাকে তাদের অনলাইন উপস্থিতি, ব্র্যান্ডিং, মার্কেটিং, ইউজার এক্সপেরিয়েন্স এবং প্রযুক্তিতে সাহায্য করে। এখানে সাধারণ কাজের একটি বিবরণ।"
                                : "A digital agency helps businesses with their online presence, branding, marketing, user experience, and often technology. Here's a breakdown of typical"}
                        </p>
                    </motion.div>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.6 }}
                        className="mt-8 lg:ml-auto"
                    >
                        <Link
                            href="/website"
                            className={`group inline-flex items-center gap-2 rounded-full bg-[#F8921C] px-8 py-4 text-sm font-bold text-black hover:bg-[#e07d0a] hover:-translate-y-0.5 transition-all ${bn}`}
                        >
                            {isBn ? "টেমপ্লেট দেখুন" : "Browse Templates"}
                            <LuArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </Link>
                    </motion.div>
                </div>
            </div>

            <style jsx>{`
                @keyframes floatY {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-18px); }
                }
                @keyframes floatYsmall {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                @keyframes spin360 {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .orb-float { animation: floatY 7s ease-in-out infinite; will-change: transform; }
                .orb-spin { animation: spin360 22s linear infinite; will-change: transform; }
                .photo-float { animation: floatYsmall 9s ease-in-out infinite; will-change: transform; }
                @media (prefers-reduced-motion: reduce) {
                    .orb-float, .orb-spin, .photo-float { animation: none; }
                }
            `}</style>
        </section>
    );
};

export default Hero;
