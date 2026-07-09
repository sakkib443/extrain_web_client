"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { LuArrowRight, LuStar, LuSparkles } from "react-icons/lu";
import { useLanguage } from "@/context/LanguageContext";

const avatars = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
];

/**
 * Interactive particle constellation.
 * Performance-minded: capped particle count, rAF paused when the hero is
 * off-screen or the tab is hidden, disabled for reduced-motion / touch users.
 */
function Constellation() {
    const ref = useRef(null);

    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const canHover = window.matchMedia("(hover: hover)").matches;
        const DPR = Math.min(window.devicePixelRatio || 1, 2);

        let w = 0, h = 0, rect = null, particles = [], raf = 0;
        let running = true, visible = true;
        const mouse = { x: -9999, y: -9999 };
        const LINK = 130;

        const build = () => {
            rect = canvas.getBoundingClientRect();
            w = rect.width; h = rect.height;
            canvas.width = Math.floor(w * DPR);
            canvas.height = Math.floor(h * DPR);
            ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
            const count = Math.min(75, Math.max(22, Math.floor((w * h) / 17000)));
            particles = Array.from({ length: count }, () => ({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.35,
                vy: (Math.random() - 0.5) * 0.35,
                r: Math.random() * 1.5 + 0.7,
            }));
        };

        const render = () => {
            ctx.clearRect(0, 0, w, h);
            const n = particles.length;
            for (let i = 0; i < n; i++) {
                const p = particles[i];
                p.x += p.vx; p.y += p.vy;
                if (p.x <= 0 || p.x >= w) p.vx *= -1;
                if (p.y <= 0 || p.y >= h) p.vy *= -1;

                for (let j = i + 1; j < n; j++) {
                    const q = particles[j];
                    const dx = p.x - q.x, dy = p.y - q.y;
                    const d2 = dx * dx + dy * dy;
                    if (d2 < LINK * LINK) {
                        const a = (1 - Math.sqrt(d2) / LINK) * 0.2;
                        ctx.strokeStyle = `rgba(255,255,255,${a})`;
                        ctx.lineWidth = 0.6;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
                    }
                }

                if (mouse.x > -9998) {
                    const mx = p.x - mouse.x, my = p.y - mouse.y;
                    const md2 = mx * mx + my * my;
                    if (md2 < 175 * 175) {
                        const a = (1 - Math.sqrt(md2) / 175) * 0.55;
                        ctx.strokeStyle = `rgba(253,154,0,${a})`;
                        ctx.lineWidth = 0.9;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
                    }
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, 6.2832);
                ctx.fillStyle = "rgba(12,178,169,0.85)";
                ctx.fill();
            }
        };

        const loop = () => {
            render();
            if (running && visible) raf = requestAnimationFrame(loop);
        };
        const start = () => {
            if (reduce) { render(); return; }
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(loop);
        };

        build();
        start();

        const onResize = () => { build(); if (reduce) render(); };
        const onScroll = () => { rect = canvas.getBoundingClientRect(); };
        const onMove = (e) => {
            if (!rect) return;
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        };
        const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };
        const onVis = () => {
            visible = !document.hidden;
            if (visible && running) start();
        };

        const io = new IntersectionObserver(
            ([entry]) => {
                running = entry.isIntersecting;
                if (running && visible) start();
            },
            { threshold: 0 }
        );
        io.observe(canvas);

        window.addEventListener("resize", onResize);
        window.addEventListener("scroll", onScroll, { passive: true });
        document.addEventListener("visibilitychange", onVis);
        if (canHover) {
            window.addEventListener("mousemove", onMove);
            document.addEventListener("mouseleave", onLeave);
        }

        return () => {
            running = false;
            cancelAnimationFrame(raf);
            io.disconnect();
            window.removeEventListener("resize", onResize);
            window.removeEventListener("scroll", onScroll);
            document.removeEventListener("visibilitychange", onVis);
            window.removeEventListener("mousemove", onMove);
            document.removeEventListener("mouseleave", onLeave);
        };
    }, []);

    return <canvas ref={ref} className="absolute inset-0 h-full w-full pointer-events-none" aria-hidden="true" />;
}

const Hero = () => {
    const { language } = useLanguage();
    const isBn = language === "bn";
    const bn = isBn ? "hind-siliguri" : "";

    const rotating = isBn
        ? ["ওয়েবসাইট", "অনলাইন স্টোর", "সফটওয়্যার", "প্ল্যাটফর্ম"]
        : ["Website", "Online Store", "Software", "Platform"];
    const [idx, setIdx] = useState(0);

    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const t = setInterval(() => setIdx((i) => (i + 1) % rotating.length), 2600);
        return () => clearInterval(t);
    }, [rotating.length]);

    const fadeUp = {
        hidden: { opacity: 0, y: 22 },
        show: (i = 0) => ({
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, delay: 0.05 + i * 0.09, ease: [0.16, 1, 0.3, 1] },
        }),
    };

    return (
        <section className="relative overflow-hidden bg-[#060B10] text-white">
            {/* ===== Animated brand glows (pure gradients — no blur filter) ===== */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="hero-glow hero-glow-1 absolute -top-[20%] -left-[10%] w-[55%] h-[70%]" style={{ background: "radial-gradient(circle at center, rgba(253,154,0,0.28), transparent 60%)" }} />
                <div className="hero-glow hero-glow-2 absolute top-[8%] -right-[14%] w-[60%] h-[80%]" style={{ background: "radial-gradient(circle at center, rgba(12,178,169,0.26), transparent 60%)" }} />
                <div className="hero-glow hero-glow-3 absolute -bottom-[28%] left-[22%] w-[52%] h-[64%]" style={{ background: "radial-gradient(circle at center, rgba(12,178,169,0.16), transparent 60%)" }} />
            </div>

            {/* ===== Subtle grid, faded to the center ===== */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
                    backgroundSize: "54px 54px",
                    maskImage: "radial-gradient(ellipse 80% 70% at 50% 42%, black 15%, transparent 78%)",
                    WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 42%, black 15%, transparent 78%)",
                }}
            />

            {/* ===== Live particle constellation ===== */}
            <Constellation />

            {/* ===== Vignette for depth ===== */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse 100% 90% at 50% 0%, transparent 45%, rgba(0,0,0,0.55))" }}
            />

            {/* ===== Content ===== */}
            <div className="relative z-10 container mx-auto px-6 lg:px-10">
                <div className="min-h-[92vh] flex flex-col items-center justify-center text-center py-24 lg:py-28">

                    {/* eyebrow */}
                    <motion.div
                        variants={fadeUp} initial="hidden" animate="show" custom={0}
                        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur px-4 py-1.5 mb-7"
                    >
                        <LuSparkles className="text-[#FD9A00]" size={14} />
                        <span className={`text-[11px] lg:text-xs font-semibold tracking-wide text-white/80 ${bn}`}>
                            {isBn ? "ওয়েবসাইট ও সফটওয়্যার মার্কেটপ্লেস" : "Website & Software Marketplace"}
                        </span>
                    </motion.div>

                    {/* headline with rotating word */}
                    <motion.h1
                        variants={fadeUp} initial="hidden" animate="show" custom={1}
                        style={{ color: "#ffffff", fontWeight: 700 }}
                        className={`font-poppins tracking-tight leading-[1.05] ${isBn ? "hind-siliguri text-4xl sm:text-5xl lg:text-6xl" : "text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem]"}`}
                    >
                        {isBn ? "লঞ্চ করুন আপনার" : "Launch Your Next"}
                        <span className="relative block mt-3 h-[1.3em]">
                            <AnimatePresence>
                                <motion.span
                                    key={idx}
                                    initial={{ y: 24, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -24, opacity: 0 }}
                                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                                    className="absolute inset-x-0 top-0 whitespace-nowrap bg-gradient-to-r from-[#FD9A00] via-[#FFC24D] to-[#0CB2A9] bg-clip-text text-transparent"
                                >
                                    {rotating[idx]}
                                </motion.span>
                            </AnimatePresence>
                        </span>
                    </motion.h1>

                    {/* subtext */}
                    <motion.p
                        variants={fadeUp} initial="hidden" animate="show" custom={2}
                        className={`text-white/60 text-base lg:text-lg max-w-2xl leading-relaxed mt-6 ${bn}`}
                    >
                        {isBn
                            ? "প্রিমিয়াম রেডিমেড টেমপ্লেট ও সফটওয়্যার ব্রাউজ করুন — অথবা কাস্টম কিছু বানাতে আমাদের টিমকে দিন। দ্রুত, নিরাপদ ও SEO-রেডি।"
                            : "Browse premium, ready-made templates & software — or hire our team to build something custom. Fast, secure & SEO-ready."}
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        variants={fadeUp} initial="hidden" animate="show" custom={3}
                        className="flex flex-col sm:flex-row items-center gap-4 mt-10"
                    >
                        <Link
                            href="/website"
                            className={`group inline-flex items-center justify-center gap-2 rounded-full bg-[#FD9A00] px-8 py-4 text-sm font-bold text-white shadow-[0_10px_35px_-8px_rgba(253,154,0,0.65)] hover:shadow-[0_14px_45px_-8px_rgba(253,154,0,0.85)] hover:-translate-y-0.5 transition-all ${bn}`}
                        >
                            {isBn ? "টেমপ্লেট ব্রাউজ করুন" : "Browse Templates"}
                            <LuArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/contact"
                            className={`inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-sm font-bold text-white backdrop-blur hover:bg-white/10 hover:border-white/35 transition-all ${bn}`}
                        >
                            {isBn ? "ফ্রি কোটেশন নিন" : "Get a Free Quote"}
                        </Link>
                    </motion.div>

                    {/* trust bar */}
                    <motion.div
                        variants={fadeUp} initial="hidden" animate="show" custom={4}
                        className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mt-14"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex -space-x-3">
                                {avatars.map((url, i) => (
                                    <img key={i} src={url} alt="Happy Extrain Web client" className="w-9 h-9 rounded-full border-2 border-[#060B10] object-cover" />
                                ))}
                            </div>
                            <p className={`text-sm text-white/60 text-left ${bn}`}>
                                {isBn ? "৫০+ ব্যবসা আমাদের ওপর ভরসা রাখে" : "Trusted by 50+ businesses"}
                            </p>
                        </div>

                        <div className="h-6 w-px bg-white/15 hidden sm:block" />

                        <div className="flex items-center gap-2">
                            <div className="flex gap-0.5 text-[#FD9A00]">
                                {[...Array(5)].map((_, i) => (
                                    <LuStar key={i} size={15} className="fill-[#FD9A00]" />
                                ))}
                            </div>
                            <span className={`text-sm text-white/60 ${bn}`}>
                                <b className="text-white font-bold">4.9/5</b> {isBn ? "রেটিং" : "rating"}
                            </span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ===== soft fade into the next (light) section ===== */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-white dark:to-[#020202] pointer-events-none" />

            <style jsx>{`
                @keyframes heroGlow1 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(9%, 11%) scale(1.14); }
                }
                @keyframes heroGlow2 {
                    0%, 100% { transform: translate(0, 0) scale(1.06); }
                    50% { transform: translate(-11%, 7%) scale(1); }
                }
                @keyframes heroGlow3 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(7%, -9%) scale(1.12); }
                }
                .hero-glow { will-change: transform; }
                .hero-glow-1 { animation: heroGlow1 22s ease-in-out infinite; }
                .hero-glow-2 { animation: heroGlow2 27s ease-in-out infinite; }
                .hero-glow-3 { animation: heroGlow3 31s ease-in-out infinite; }
                @media (prefers-reduced-motion: reduce) {
                    .hero-glow-1, .hero-glow-2, .hero-glow-3 { animation: none; }
                }
            `}</style>
        </section>
    );
};

export default Hero;
