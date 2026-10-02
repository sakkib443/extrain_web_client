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
import { FaFacebookF, FaStar } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";
import { TEAM } from "@/data/team";
import useIntroReady from "@/hooks/useIntroReady";

// Left contact rail — just the three ways people actually reach us.
const socials = [
    { label: "Email", icon: LuMail, href: "mailto:info.extrainweb@gmail.com" },
    { label: "Phone", icon: LuPhone, href: "tel:+8801711946614" },
    { label: "Facebook", icon: FaFacebookF, href: "https://www.facebook.com/Extrain%20Web" },
];

// Text reads bottom-to-top, like the reference rail.
const verticalText = { writingMode: "vertical-rl", transform: "rotate(180deg)" };

// The four faces next to the "300+" are our own team (src/data/team.js).
const teamFaces = TEAM.slice(0, 4);

// The team photos are half-length shots, so in a small circle the face would be tiny. Each one is zoomed onto the face:
// x / y = where the face sits in the photo (0-1), z = zoom. A new member without an entry gets a sensible default.
const FACE_CROP = {
    bdm: { x: 0.54, y: 0.21, z: 1.9 },
    pm: { x: 0.48, y: 0.24, z: 1.9 },
    dev1: { x: 0.52, y: 0.3, z: 1.55 },
    dev2: { x: 0.44, y: 0.46, z: 1.35 },
};
const faceStyle = (id) => {
    const { x, y, z } = FACE_CROP[id] || { x: 0.5, y: 0.25, z: 1.6 };
    const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
    // slide the face towards the middle of the circle, but never so far that the photo's edge shows
    const tx = clamp(0.5 - x, -(z - 1) * (1 - x), (z - 1) * x) * 100;
    const ty = clamp(0.5 - y, -(z - 1) * (1 - y), (z - 1) * y) * 100;
    return { transformOrigin: `${x * 100}% ${y * 100}%`, transform: `translate(${tx}%, ${ty}%) scale(${z})` };
};

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

// ---- entrance choreography ----
// Plays when the page is first visible: right after the greeting preloader starts opening (or at once on later visits).
// `delay` is seconds after that moment; INTRO_LEAD lets the curtain get out of the way first.
const EASE = [0.16, 1, 0.3, 1];
const INTRO_LEAD = 0.35;
const SHOWN = { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0, filter: "blur(0px)" };
const intro = (ready, delay, from = { opacity: 0, y: 30 }, duration = 0.9) => ({
    initial: from,
    animate: ready ? SHOWN : from,
    transition: { duration, delay: ready ? INTRO_LEAD + delay : 0, ease: EASE },
});

// one headline line: rises out of a soft blur
const Line = ({ ready, delay, className = "", style, children }) => (
    <motion.span
        className={`block ${className}`}
        style={style}
        {...intro(ready, delay, { opacity: 0, y: "0.55em", filter: "blur(12px)" }, 1)}
    >
        {children}
    </motion.span>
);

// paragraph that appears word by word
const Words = ({ ready, delay, text }) =>
    text.split(" ").map((w, i) => (
        <motion.span
            key={i}
            className="inline-block whitespace-pre"
            {...intro(ready, delay + i * 0.025, { opacity: 0, y: 10, filter: "blur(6px)" }, 0.6)}
        >
            {w + " "}
        </motion.span>
    ));

const Hero = () => {
    const { language } = useLanguage();
    const isBn = language === "bn";
    const bn = isBn ? "hind-siliguri" : "";
    const reduce = useReducedMotion();
    const ready = useIntroReady();

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
                <motion.aside
                    aria-label="Social links"
                    {...intro(ready, 0.55, { opacity: 0, x: "-100%" }, 0.9)}
                    className="absolute left-0 top-20 bottom-0 z-10 hidden xl:flex w-16 flex-col overflow-hidden border-r border-white/10 bg-white/[0.03]"
                >
                    {socials.map(({ label, icon: Icon, href }, i) => (
                        <motion.a
                            {...intro(ready, 0.75 + i * 0.1, { opacity: 0, x: -16 }, 0.6)}
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
                        </motion.a>
                    ))}
                    <motion.div {...intro(ready, 1.05, { opacity: 0 }, 0.6)} className="flex min-h-0 flex-1 items-center justify-center">
                        <span style={verticalText} className="text-[12px] font-semibold uppercase tracking-[0.1em] text-white/60">
                            Follow us:
                        </span>
                    </motion.div>
                </motion.aside>

                <div className="relative z-10 container mx-auto px-6 lg:px-10">
                    <div className="home-rail-offset relative grid lg:grid-cols-[1.4fr_0.6fr] items-center gap-10 pt-32 pb-14 lg:pb-20 lg:min-h-[calc(100vh-130px)]">

                        {/* ---------- Left: copy ---------- */}
                        <motion.div style={reduce ? undefined : { y: textY, opacity: textOpacity }}>
                            {/* phones only: small eyebrow pill above the headline */}
                            <motion.div
                                {...intro(ready, 0, { opacity: 0, y: 14 }, 0.7)}
                                className={`mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] py-1.5 pl-2.5 pr-4 backdrop-blur-sm sm:hidden ${bn}`}
                            >
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F8921C] opacity-60" />
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#F8921C]" />
                                </span>
                                <span className={`text-[11px] font-semibold uppercase text-white/85 ${bn ? "tracking-normal" : "tracking-[0.18em]"}`}>
                                    {isBn ? "ওয়েব ও ডিজিটাল এজেন্সি" : "Web & Digital Agency"}
                                </span>
                            </motion.div>

                            {/* headline with corner brackets (phones: an orange accent bar on the left instead) */}
                            <h1
                                className="relative border-l-[3px] border-[#F8921C] pl-4 font-poppins font-bold uppercase tracking-[-0.015em] leading-[1.12] text-[clamp(2.2rem,4.6vw,4.8rem)] sm:border-l-0 sm:pl-0 sm:leading-[1.08]"
                            >
                                {/* top-left bracket — draws in from its corner */}
                                <motion.span
                                    aria-hidden="true"
                                    style={{ originX: 0, originY: 0 }}
                                    {...intro(ready, 0.1, { opacity: 0, scale: 0.3 }, 0.8)}
                                    className="pointer-events-none absolute -top-4 left-0 hidden sm:block w-16 h-16 border-t border-l border-white/90"
                                >
                                    <i className="absolute -top-[5px] -left-[5px] w-2.5 h-2.5 bg-[#F8921C]" />
                                    <i className="absolute -bottom-[5px] -left-[5px] w-2.5 h-2.5 bg-[#F8921C]" />
                                </motion.span>

                                {/* the three lines rise in one after another */}
                                <Line ready={ready} delay={0.15} className="pl-0 text-white tracking-[-0.015em] sm:pl-[0.55em] md:whitespace-nowrap" style={{ fontSize: "1.1em" }}>
                                    WE ARE BEST WEB
                                </Line>
                                <Line ready={ready} delay={0.3} className="tracking-[-0.015em] md:whitespace-nowrap" style={{ fontSize: "0.9em" }}>
                                    <span className="text-white">&amp; DIGITAL</span>{" "}
                                    <span style={outlineStyle}>
                                        CRE<span style={filledA}>A</span>TIVE
                                    </span>
                                </Line>
                                <Line ready={ready} delay={0.45} className="text-white tracking-[-0.015em] md:whitespace-nowrap" style={{ fontSize: "0.74em" }}>
                                    AGENCY{" "}
                                    <span className="relative inline-block">
                                        BUSINESS
                                        {/* bottom-right bracket — draws in from its corner */}
                                        <motion.span
                                            aria-hidden="true"
                                            style={{ originX: 1, originY: 1 }}
                                            {...intro(ready, 0.7, { opacity: 0, scale: 0.3 }, 0.8)}
                                            className="pointer-events-none absolute -bottom-3 -right-8 hidden sm:block w-14 h-16 border-b border-r border-white/90"
                                        >
                                            <i className="absolute -top-[5px] -right-[5px] w-2.5 h-2.5 bg-[#F8921C]" />
                                            <i className="absolute -bottom-[5px] -right-[5px] w-2.5 h-2.5 bg-[#F8921C]" />
                                        </motion.span>
                                    </span>
                                </Line>
                            </h1>

                            {/* phones only: a short divider between headline and copy */}
                            <span aria-hidden="true" className="mt-6 flex items-center gap-2 sm:hidden">
                                <i className="h-[2px] w-12 rounded-full bg-[#F8921C]" />
                                <i className="h-[2px] w-24 rounded-full bg-gradient-to-r from-white/40 to-transparent" />
                            </span>

                            {/* description */}
                            <p className={`mt-5 sm:mt-9 max-w-md text-white/70 text-base lg:text-lg leading-relaxed ${bn}`}>
                                <Words
                                    ready={ready}
                                    delay={0.65}
                                    text={
                                        isBn
                                            ? "ওয়েব ডেভেলপমেন্ট, ডিজিটাল মার্কেটিং ও ক্রিয়েটিভ কন্টেন্ট — আমরা আপনার ব্যবসাকে অনলাইনে এগিয়ে নিই, দ্রুত ও আধুনিকভাবে।"
                                            : "Web development, digital marketing and creative content — we help your business grow online, fast and modern."
                                    }
                                />
                            </p>

                            {/* CTA: pill + round arrow */}
                            <motion.div
                                {...intro(ready, 1.0, { opacity: 0, y: 24 }, 0.8)}
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
                                <motion.div
                                    className="w-full h-full"
                                    {...intro(ready, 0.5, { opacity: 0, scale: 0.4, rotate: -120 }, 1.4)}
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
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ================= Big image — spans text area + band, flush right ================= */}
            {/* rises up from the bottom edge, unveiling from below */}
            <motion.div
                {...intro(
                    ready,
                    0.2,
                    { opacity: 0.4, y: 120, clipPath: "inset(100% 0% 0% 0%)" },
                    1.3
                )}
                animate={ready ? { opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)" } : { opacity: 0.4, y: 120, clipPath: "inset(100% 0% 0% 0%)" }}
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

            {/* ================= B. Band: client panel beside the image ================= */}
            {/* A dark bronze panel (not a flat orange block): its left edge lines up with the headline above, it sits flush
                against the photo and the bottom of the hero, and the content reads top to bottom in one clear order. */}
            <div ref={bandRef} className="relative order-3 lg:order-none bg-[color:var(--tone-deep)] lg:min-h-[340px]">
                <div className="lg:flex lg:min-h-[340px]">
                    {/* same left edge as the headline (container padding + the social-rail offset) */}
                    <div
                        aria-hidden="true"
                        className="hidden lg:block shrink-0 box-content home-rail-offset"
                        style={{ width: "calc(max(0px, (100% - 1280px) / 2) + 1.5rem)" }}
                    />

                    <motion.div
                        {...intro(ready, 0.6, { opacity: 0, y: 70 }, 1.1)}
                        className="relative mx-4 my-8 flex-1 overflow-hidden rounded-3xl border border-[#F8921C]/25 px-6 py-7 shadow-[inset_0_1px_0_rgba(255,214,150,0.18)] lg:mx-0 lg:my-0 lg:flex lg:flex-col lg:justify-center lg:rounded-none lg:rounded-tl-[2rem] lg:border-b-0 lg:border-r-0 lg:px-10 lg:py-9"
                        style={{
                            background:
                                "radial-gradient(120% 95% at 0% 0%, rgba(248,146,28,0.30) 0%, rgba(248,146,28,0.07) 45%, rgba(248,146,28,0) 70%), linear-gradient(135deg, #2b1b09 0%, #18120b 52%, #100d09 100%)",
                        }}
                    >
                        {/* a fine gold line along the top */}
                        <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#F8921C]/60 to-transparent" />

                        {/* 1 · the number (left) · who says so: faces + rating (right) */}
                        <motion.div
                            style={reduce ? undefined : { y: cardY, opacity: cardOpacity }}
                            className="flex flex-wrap items-end justify-between gap-x-5 gap-y-4"
                        >
                            <div className="flex items-end gap-3">
                                <p className="text-[3.3rem] font-extrabold leading-none text-white">
                                    300<span className="text-[#F8921C]">+</span>
                                </p>
                                <p className={`pb-1.5 font-semibold leading-tight text-white/65 ${isBn ? "text-[16px]" : "text-[13px] uppercase tracking-[0.12em]"} ${bn}`}>
                                    {isBn ? "সন্তুষ্ট গ্রাহক" : <>Happy<br />Customers</>}
                                </p>
                            </div>

                            <div className="flex flex-col items-start gap-2.5 pb-1 sm:items-end">
                                <div className="flex -space-x-3">
                                    {teamFaces.map((m) => (
                                        <span
                                            key={m.id}
                                            title={m.name}
                                            className="relative block h-12 w-12 overflow-hidden rounded-full border-2 border-[#1c140a] bg-[#2a1b09] transition-transform duration-300 hover:z-10 hover:-translate-y-1"
                                        >
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={m.photo}
                                                alt={m.name}
                                                style={faceStyle(m.id)}
                                                className="absolute inset-0 h-full w-full object-cover"
                                            />
                                        </span>
                                    ))}
                                </div>
                                <div className="flex items-center gap-1 text-[#F8921C]" aria-label="5 out of 5 stars">
                                    {[...Array(5)].map((_, i) => <FaStar key={i} size={13} />)}
                                </div>
                            </div>
                        </motion.div>

                        {/* 2 · divider */}
                        <span aria-hidden="true" className="my-6 block h-px w-full bg-gradient-to-r from-[#F8921C]/50 via-white/10 to-transparent" />

                        {/* 3 · what we do (left) · the way on (right) */}
                        <motion.div
                            style={reduce ? undefined : { y: copyY }}
                            className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8"
                        >
                            <p className={`max-w-[21rem] text-balance text-[0.93rem] leading-relaxed text-white/70 ${bn}`}>
                                {isBn
                                    ? "আমরা ওয়েবসাইট, মার্কেটিং ও কন্টেন্টের মাধ্যমে ব্র্যান্ডকে বাড়াতে সাহায্য করি — সত্যিকারের ফলাফল নিয়ে।"
                                    : "We build websites, run marketing and create content that help brands grow, with real results."}
                            </p>

                            <div className="flex shrink-0 items-center gap-1">
                                <Link
                                    href="/happy-clients"
                                    className={`inline-flex h-11 items-center rounded-full border border-[#F8921C]/60 px-6 text-[13px] font-bold text-white transition-colors duration-300 hover:bg-[#F8921C] hover:text-black ${isBn ? "" : "uppercase tracking-[0.04em]"} ${bn}`}
                                >
                                    {isBn ? "আরও দেখুন" : "See More"}
                                </Link>
                                <Link
                                    href="/happy-clients"
                                    aria-label={isBn ? "আরও দেখুন" : "See more"}
                                    className="grid h-11 w-11 place-items-center rounded-full bg-white text-[#0a0a0a] transition-colors duration-300 hover:bg-[#F8921C]"
                                >
                                    <LuArrowUpRight size={18} />
                                </Link>
                            </div>
                        </motion.div>
                    </motion.div>

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
