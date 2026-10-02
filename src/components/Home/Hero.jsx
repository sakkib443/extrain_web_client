"use client";

import React, { useEffect, useRef, useState } from "react";
import {
    motion,
    useMotionValue,
    useReducedMotion,
    useScroll,
    useSpring,
    useTransform,
} from "framer-motion";
import Link from "next/link";
import {
    LuMoveRight,
    LuArrowUpRight,
    LuMail,
    LuPhone,
    LuChevronLeft,
    LuChevronRight,
} from "react-icons/lu";
import { FaFacebookF } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";

// Left contact rail — just the three ways people actually reach us.
const socials = [
    { label: "Email", icon: LuMail, href: "mailto:info.extrainweb@gmail.com" },
    { label: "Phone", icon: LuPhone, href: "tel:+8801711946614" },
    { label: "Facebook", icon: FaFacebookF, href: "https://www.facebook.com/Extrain%20Web" },
];

// Text reads bottom-to-top, like the reference rail.
const verticalText = { writingMode: "vertical-rl", transform: "rotate(180deg)" };

const avatars = [
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&q=80",
];

// Big hero image options — switch with the arrows. `pos` keeps faces / logo in frame when cropped.
const HERO_IMAGES = [
    { src: "/hero-office.webp", alt: "Extrain Web team in our office", pos: "92% 25%" },
    { src: "/hero-team.webp", alt: "Our creative team at work", pos: "50% 25%" },
];

// Outlined "CREATIVE" — hollow letters, only the A is filled orange.
const outlineStyle = {
    color: "transparent",
    WebkitTextStroke: "1.5px rgba(255,255,255,0.85)",
    letterSpacing: "0",
};
const filledA = { color: "#F8921C", WebkitTextStroke: "0" };

const SCROLL_SPRING = { stiffness: 110, damping: 28, mass: 0.4 };

const Hero = () => {
    const { language } = useLanguage();
    const isBn = language === "bn";
    const bn = isBn ? "hind-siliguri" : "";
    const reduce = useReducedMotion();

    const heroRef = useRef(null);
    const bandRef = useRef(null);

    // image switcher
    const [slide, setSlide] = useState(0);
    const go = (dir) => setSlide((i) => (i + dir + HERO_IMAGES.length) % HERO_IMAGES.length);

    // ---- mouse (smoothed, no re-renders) ----
    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const smx = useSpring(mx, { stiffness: 90, damping: 22 });
    const smy = useSpring(my, { stiffness: 90, damping: 22 });

    useEffect(() => {
        if (reduce) return;
        const onMove = (e) => {
            mx.set(e.clientX / window.innerWidth - 0.5);   // -0.5 .. 0.5
            my.set(e.clientY / window.innerHeight - 0.5);
        };
        window.addEventListener("mousemove", onMove, { passive: true });
        return () => window.removeEventListener("mousemove", onMove);
    }, [reduce, mx, my]);

    // ---- scroll (smoothed, no re-renders) ----
    const { scrollY } = useScroll();
    const sy = useSpring(scrollY, { stiffness: 120, damping: 30, mass: 0.4 });

    const { scrollYProgress: heroRaw } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
    const heroP = useSpring(heroRaw, SCROLL_SPRING);

    const { scrollYProgress: bandRaw } = useScroll({ target: bandRef, offset: ["start end", "end start"] });
    const bandP = useSpring(bandRaw, SCROLL_SPRING);

    // text column drifts down a little slower than the page and softly fades
    const textY = useTransform(heroP, [0, 1], [0, 140]);
    const textOpacity = useTransform(heroP, [0, 0.6], [1, 0.35]);

    // orb: same mouse + scroll feel as before
    const orbX = useTransform(smx, (v) => v * 40);
    const orbY = useTransform([smy, sy], ([m, s]) => m * 40 - s * 0.18);

    // big image: inner parallax (the frame stays flush with the next section)
    // travel stays inside the zoom margin so the corner logo in the photo is never cut
    const imgX = useTransform(smx, (v) => v * -16);
    const imgY = useTransform([heroP, smy], ([p, m]) => (p - 0.5) * 16 + m * -6);

    // client band: card + copy glide in as the band scrolls into view
    const cardY = useTransform(bandP, [0, 0.35, 1], [14, 0, -24]);
    const cardOpacity = useTransform(bandP, [0, 0.15], [0.6, 1]);
    const copyY = useTransform(bandP, [0, 0.35, 1], [10, 0, -14]);

    return (
        <section ref={heroRef} className="relative flex flex-col lg:block overflow-hidden bg-[color:var(--tone-deep)] text-white">

            {/* ================= A. Text area (background image) ================= */}
            <div className="relative overflow-hidden">
                {/* Background image (green + purple glow, diagonal streaks) */}
                <div
                    className="absolute inset-0 pointer-events-none bg-cover bg-center"
                    style={{ backgroundImage: "url('/hero-bg.webp')" }}
                />
                {/* subtle dark overlay for text contrast */}
                <div className="absolute inset-0 pointer-events-none bg-black/25" />

                {/* ===== Left social rail (xl and up) ===== */}
                <aside
                    aria-label="Social links"
                    className="absolute left-0 top-20 bottom-0 z-10 hidden xl:flex w-16 flex-col overflow-hidden border-r border-white/10 bg-white/[0.03]"
                >
                    {socials.map(({ label, icon: Icon, href }) => (
                        <a
                            key={label}
                            href={href}
                            target={href.startsWith("mailto:") ? undefined : "_blank"}
                            rel="noopener noreferrer"
                            aria-label={label}
                            className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2.5 border-b border-white/10 text-white/90 hover:text-[#F8921C] transition-colors"
                        >
                            <span style={verticalText} className="text-[12px] font-semibold uppercase tracking-[0.1em]">
                                {label}
                            </span>
                            <Icon size={14} />
                        </a>
                    ))}
                    <div className="flex min-h-0 flex-1 items-center justify-center">
                        <span style={verticalText} className="text-[12px] font-semibold uppercase tracking-[0.1em] text-white/60">
                            Follow us:
                        </span>
                    </div>
                </aside>

                <div className="relative z-10 container mx-auto px-6 lg:px-10">
                    <div className="home-rail-offset relative grid lg:grid-cols-[1.4fr_0.6fr] items-center gap-10 pt-32 pb-14 lg:pb-20 lg:min-h-[calc(100vh-130px)]">

                        {/* ---------- Left: copy ---------- */}
                        <motion.div style={reduce ? undefined : { y: textY, opacity: textOpacity }}>
                            {/* headline with corner brackets */}
                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                                className="relative font-poppins font-bold uppercase tracking-[-0.015em] leading-[1.08] text-[clamp(2.2rem,4.6vw,4.8rem)]"
                            >
                                {/* top-left bracket */}
                                <span
                                    aria-hidden="true"
                                    className="pointer-events-none absolute -top-4 left-0 hidden sm:block w-16 h-16 border-t border-l border-white/90"
                                >
                                    <i className="absolute -top-[5px] -left-[5px] w-2.5 h-2.5 bg-[#F8921C]" />
                                    <i className="absolute -bottom-[5px] -left-[5px] w-2.5 h-2.5 bg-[#F8921C]" />
                                </span>

                                <span className="block pl-[0.55em] text-white md:whitespace-nowrap">WE ARE BEST</span>
                                <span className="block text-white md:whitespace-nowrap">WEB &amp; DIGITAL</span>
                                <span className="block md:whitespace-nowrap">
                                    <span style={outlineStyle}>
                                        CRE<span style={filledA}>A</span>TIVE
                                    </span>{" "}
                                    <span className="text-white">AGENCY</span>
                                </span>
                                <span className="block text-white">
                                    <span className="relative inline-block">
                                        BUSINESS
                                        {/* bottom-right bracket */}
                                        <span
                                            aria-hidden="true"
                                            className="pointer-events-none absolute -bottom-3 -right-8 hidden sm:block w-14 h-16 border-b border-r border-white/90"
                                        >
                                            <i className="absolute -top-[5px] -right-[5px] w-2.5 h-2.5 bg-[#F8921C]" />
                                            <i className="absolute -bottom-[5px] -right-[5px] w-2.5 h-2.5 bg-[#F8921C]" />
                                        </span>
                                    </span>
                                </span>
                            </motion.h1>

                            {/* description */}
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                className={`mt-9 max-w-md text-white/70 text-base lg:text-lg leading-relaxed ${bn}`}
                            >
                                {isBn
                                    ? "ওয়েব ডেভেলপমেন্ট, ডিজিটাল মার্কেটিং ও ক্রিয়েটিভ কন্টেন্ট — আমরা আপনার ব্যবসাকে অনলাইনে এগিয়ে নিই, দ্রুত ও আধুনিকভাবে।"
                                    : "Web development, digital marketing and creative content — we help your business grow online, fast and modern."}
                            </motion.p>

                            {/* CTA: pill + round arrow */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.4 }}
                                className="mt-8 flex items-center gap-2"
                            >
                                <Link
                                    href="#services"
                                    className={`inline-flex items-center rounded-full bg-[#F8921C] px-8 py-4 text-sm font-semibold uppercase tracking-wide text-black hover:bg-[#e07d0a] transition-colors ${bn}`}
                                >
                                    {isBn ? "আমাদের সার্ভিস" : "Our Services"}
                                </Link>
                                <Link
                                    href="#services"
                                    aria-label="Our services"
                                    className="grid place-items-center w-[52px] h-[52px] rounded-full bg-white text-[#0a0a0a] hover:bg-[#F8921C] transition-colors"
                                >
                                    <LuMoveRight size={22} />
                                </Link>
                            </motion.div>
                        </motion.div>

                        {/* ---------- Right: golden orb (spin + float + mouse/scroll parallax) ---------- */}
                        <div className="relative hidden lg:block h-[420px]">
                            <motion.div
                                style={reduce ? undefined : { x: orbX, y: orbY }}
                                className="absolute top-0 right-0 w-[240px] h-[240px] z-20"
                            >
                                <div className="orb-float w-full h-full">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src="/hero-1rightimg1-233x244.png"
                                        alt="Golden 3D orb"
                                        className="orb-spin w-full h-full object-contain drop-shadow-[0_30px_60px_rgba(245,184,20,0.35)]"
                                    />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ================= Big image — spans text area + band, flush right ================= */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="group relative z-[5] order-2 lg:order-none w-full aspect-[3/2] lg:aspect-auto lg:w-[52%] lg:absolute lg:right-0 lg:bottom-0 lg:h-[min(calc(38vh+306px),37.6vw)] overflow-hidden rounded-t-[48px] lg:rounded-t-none lg:rounded-tl-[140px] bg-[color:var(--tone-deep)]"
            >
                {/* inner layer carries the parallax; slightly oversized so edges never show */}
                <motion.div
                    style={reduce ? undefined : { x: imgX, y: imgY, scale: 1.05 }}
                    className="absolute inset-0"
                >
                    {HERO_IMAGES.map((img, i) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            key={img.src}
                            src={img.src}
                            alt={img.alt}
                            aria-hidden={i !== slide}
                            style={{ objectPosition: img.pos }}
                            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out ${i === slide ? "opacity-100" : "opacity-0"}`}
                        />
                    ))}
                </motion.div>

                {/* small switch arrows, one on each side */}
                <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label="Previous image"
                    className="absolute left-4 lg:left-[90px] top-1/2 z-10 -translate-y-1/2 grid place-items-center w-10 h-10 rounded-full bg-white/90 text-[#0a0a0a] shadow-md backdrop-blur transition-colors hover:bg-[#F8921C] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#F8921C]"
                >
                    <LuChevronLeft size={20} />
                </button>
                <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label="Next image"
                    className="absolute right-4 lg:right-[90px] top-1/2 z-10 -translate-y-1/2 grid place-items-center w-10 h-10 rounded-full bg-white/90 text-[#0a0a0a] shadow-md backdrop-blur transition-colors hover:bg-[#F8921C] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#F8921C]"
                >
                    <LuChevronRight size={20} />
                </button>
            </motion.div>

            {/* ================= B. Band: client box beside the image ================= */}
            <div ref={bandRef} className="relative order-3 lg:order-none bg-[color:var(--tone-deep)] lg:min-h-[340px]">
                <div className="lg:flex lg:min-h-[340px]">
                    <div className="hidden lg:block w-[17%] shrink-0" />

                    <div className="flex-1 bg-[#F8921C] text-black px-6 py-8 lg:px-9 lg:py-10 lg:flex lg:flex-col lg:justify-center">
                        {/* client card */}
                        <motion.div
                            style={reduce ? undefined : { y: cardY, opacity: cardOpacity }}
                            className="flex items-center gap-4 rounded-xl bg-white px-5 py-4 shadow-sm"
                        >
                            <div className="flex items-center shrink-0">
                                <div className="flex -space-x-3">
                                    {avatars.map((url, i) => (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            key={i}
                                            src={url}
                                            alt="Happy customer"
                                            className="w-11 h-11 rounded-full border-2 border-white object-cover"
                                        />
                                    ))}
                                </div>
                                <span className="ml-2 grid place-items-center w-11 h-11 rounded-full bg-[#F8921C] text-black text-[11px] font-extrabold border-2 border-white">
                                    7K+
                                </span>
                            </div>
                            <span className="h-10 w-px bg-black/15 shrink-0" />
                            <div className={`leading-tight ${bn}`}>
                                <p className="text-lg font-bold text-black">300 +</p>
                                <p className="text-sm text-black/70">
                                    {isBn ? "সন্তুষ্ট গ্রাহক" : "Happy Customers"}
                                </p>
                            </div>
                        </motion.div>

                        <motion.div style={reduce ? undefined : { y: copyY }}>
                            <p className={`mt-5 text-sm leading-relaxed text-black/80 max-w-md ${bn}`}>
                                {isBn
                                    ? "আমরা ওয়েবসাইট, মার্কেটিং ও কন্টেন্টের মাধ্যমে ব্র্যান্ডকে বাড়াতে সাহায্য করি — সত্যিকারের ফলাফল নিয়ে।"
                                    : "We build websites, run marketing and create content that help brands grow, with real results."}
                            </p>

                            <Link
                                href="/happy-clients"
                                className={`mt-4 inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-black hover:gap-2.5 transition-all ${bn}`}
                            >
                                {isBn ? "আরও দেখুন" : "See More"}
                                <LuArrowUpRight size={16} />
                            </Link>
                        </motion.div>
                    </div>

                    {/* space under the image */}
                    <div className="hidden lg:block w-[52%] shrink-0" />
                </div>
            </div>

            <style jsx>{`
                @keyframes floatY {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-18px); }
                }
                @keyframes spin360 {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .orb-float { animation: floatY 7s ease-in-out infinite; will-change: transform; }
                .orb-spin { animation: spin360 22s linear infinite; will-change: transform; }
                @media (prefers-reduced-motion: reduce) {
                    .orb-float, .orb-spin { animation: none; }
                }
            `}</style>
        </section>
    );
};

export default Hero;
