"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, useTransform } from "framer-motion";
import {
    LuCode, LuMegaphone, LuCamera, LuMoveRight, LuArrowUpRight,
    LuMonitorSmartphone, LuSearch, LuRocket, LuChevronRight,
} from "react-icons/lu";
import { useLanguage } from "@/context/LanguageContext";
import useSectionMotion from "@/hooks/useSectionMotion";
import BracketLabel from "./BracketLabel";
import TiltCard from "./TiltCard";

const avatars = [
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&q=80",
];

// The three services — each one owns an image in the collage and a card on the right.
const services = [
    {
        id: "web",
        icon: LuCode,
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1000&q=80",
        pos: "50% 50%",
        title: "Web Design & Development",
        titleBn: "ওয়েব ডিজাইন ও ডেভেলপমেন্ট",
        desc: "Fast, responsive websites and web apps that turn visitors into customers.",
        descBn: "দ্রুত, রেসপনসিভ ওয়েবসাইট ও ওয়েব অ্যাপ — যা ভিজিটরকে কাস্টমারে বদলায়।",
        href: "/website",
    },
    {
        id: "marketing",
        icon: LuMegaphone,
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&q=80",
        pos: "50% 45%",
        title: "Digital Marketing",
        titleBn: "ডিজিটাল মার্কেটিং",
        desc: "SEO, social media and paid campaigns that bring real customers.",
        descBn: "SEO, সোশ্যাল মিডিয়া ও পেইড ক্যাম্পেইন — যা আসল কাস্টমার আনে।",
        href: "/digital-marketing",
    },
    {
        id: "media",
        icon: LuCamera,
        image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1000&q=80",
        pos: "38% 50%",
        title: "Content & Media",
        titleBn: "কন্টেন্ট ও মিডিয়া",
        desc: "Photography, video, graphics and copy that tell your story.",
        descBn: "ফটোগ্রাফি, ভিডিও, গ্রাফিক্স ও লেখা — যা আপনার গল্প বলে।",
        href: "/media-content",
    },
];

// How a business grows with us, one step after another (the three cards on the right).
// The services themselves have their own section, so these cards describe the path, not the services.
const steps = [
    {
        id: "build",
        icon: LuMonitorSmartphone,
        title: "Build Your Online Base",
        titleBn: "অনলাইন ভিত্তি তৈরি",
        desc: "A fast, professional website and a ready-to-sell Facebook page.",
        descBn: "দ্রুত, প্রফেশনাল ওয়েবসাইট আর বিক্রির জন্য তৈরি ফেসবুক পেজ।",
        href: "/website",
    },
    {
        id: "optimize",
        icon: LuSearch,
        title: "Set Up & Optimize",
        titleBn: "সেটআপ ও অপটিমাইজেশন",
        desc: "Pixel setup, SEO and optimization, so people find you and every visit is tracked.",
        descBn: "পিক্সেল সেটআপ, SEO ও অপটিমাইজেশন, যাতে মানুষ আপনাকে খুঁজে পায় আর প্রতিটি ভিজিট মাপা যায়।",
        href: "/contact",
    },
    {
        id: "grow",
        icon: LuRocket,
        title: "Run Ads & Grow",
        titleBn: "অ্যাড চালান, বিজনেস বাড়ান",
        desc: "Targeted ads bring real customers and take your business toward success.",
        descBn: "টার্গেটেড অ্যাডে আসল কাস্টমার আসে আর আপনার বিজনেস সফলতার দিকে এগোয়।",
        href: "/contact",
    },
];

const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    show: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.65, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
    }),
};
const viewport = { once: true, amount: 0.2 };

const AboutServices = () => {
    const { language } = useLanguage();
    const isBn = language === "bn";
    const bn = isBn ? "hind-siliguri" : "";
    const [hovered, setHovered] = useState(null);

    // ---- smooth scroll + mouse motion (same feel as the hero and services) ----
    // Every layer moves at its own speed/direction; at mid-scroll all sit in their normal place.
    const { ref: sectionRef, p, mx, my, reduce, isLg } = useSectionMotion();
    const k = isLg ? 1 : 0.3; // phones/tablets: much smaller movement so nothing runs into the text below
    const tileAY = useTransform([p, my], ([pv, mv]) => (0.5 - pv) * 2 * 34 * k + mv * -14);
    const tileBY = useTransform([p, my], ([pv, mv]) => (0.5 - pv) * 2 * 72 * k + mv * -22);
    const tileCY = useTransform([p, my], ([pv, mv]) => (0.5 - pv) * 2 * -58 * k + mv * 26);
    const tileAX = useTransform(mx, [-0.5, 0.5], [18, -18]);
    const tileBX = useTransform(mx, [-0.5, 0.5], [-26, 26]);
    const tileCX = useTransform(mx, [-0.5, 0.5], [34, -34]);
    const flowerY = useTransform(p, [0, 1], [70, -70]);
    const flowerRot = useTransform(p, [0, 1], [-140, 140]);
    const wordY = useTransform(p, [0, 1], [100, -100]);
    const wordX = useTransform(mx, [-0.5, 0.5], [18, -18]);
    const textY = useTransform(p, [0, 1], [isLg ? 24 : 0, isLg ? -24 : 0]);
    const cardY0 = useTransform(p, [0, 1], [isLg ? 34 : 0, isLg ? -34 : 0]);
    const cardY1 = useTransform(p, [0, 1], [isLg ? 12 : 0, isLg ? -12 : 0]);
    const cardY2 = useTransform(p, [0, 1], [isLg ? 52 : 0, isLg ? -52 : 0]);
    const cardYs = [cardY0, cardY1, cardY2];

    // One collage tile: image + small "01 · Title" pill. Lights up when its card is hovered.
    // (plain function, not a component, so hovering never remounts the images)
    const renderTile = (index, className = "") => {
        const s = services[index];
        const on = hovered === index;
        return (
            <div
                className={`relative overflow-hidden rounded-[2rem] ring-2 transition-all duration-500 ${on ? "ring-[#F8921C]/80" : "ring-transparent"} ${className}`}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={s.image}
                    alt={s.title}
                    style={{ objectPosition: s.pos }}
                    className={`h-full w-full object-cover transition-transform duration-700 ease-out ${on ? "scale-110" : "scale-100"}`}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />
                <div
                    className={`absolute left-4 top-4 flex items-center gap-2 rounded-full border py-1.5 pl-3 pr-4 backdrop-blur-md transition-colors duration-300 ${on ? "border-[#F8921C] bg-[#F8921C] text-black" : "border-white/15 bg-black/45 text-white/90"}`}
                >
                    <span className={`text-[11px] font-bold tabular-nums ${on ? "text-black" : "text-[#F8921C]"}`}>0{index + 1}</span>
                    <span className={`text-[11px] font-semibold uppercase ${bn ? "tracking-normal" : "tracking-[0.12em]"} ${bn}`}>
                        {isBn ? s.titleBn : s.title}
                    </span>
                </div>
            </div>
        );
    };

    return (
        <section ref={sectionRef} id="about-us" className="relative overflow-hidden bg-[color:var(--tone-deep)] py-24 text-white lg:py-40">
            {/* one soft glow */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-24 left-1/3 h-80 w-80 rounded-full bg-[#F8921C]/[0.06] blur-3xl" />
            </div>

            {/* flower decoration — left edge, vertically centred (wide screens only).
                The wrapper follows the scroll and turns with it; the flower itself also keeps spinning slowly. */}
            <motion.div
                aria-hidden="true"
                style={reduce ? undefined : { y: flowerY, rotate: flowerRot }}
                className="pointer-events-none absolute left-2 top-1/2 hidden -translate-y-1/2 opacity-[0.38] min-[1650px]:block"
            >
                <svg
                    viewBox="0 0 120 120"
                    className="about-flower h-44 w-44"
                    fill="none"
                    stroke="#F8921C"
                    strokeWidth="1.3"
                    style={{ maskImage: "radial-gradient(circle, #000 52%, transparent 100%)", WebkitMaskImage: "radial-gradient(circle, #000 52%, transparent 100%)" }}
                >
                    {Array.from({ length: 10 }).map((_, i) => (
                        <ellipse key={i} cx="60" cy="21" rx="9" ry="19" transform={`rotate(${i * 36} 60 60)`} />
                    ))}
                    <circle cx="60" cy="60" r="15" strokeOpacity="0.55" />
                    <circle cx="60" cy="60" r="6.5" fill="#F8921C" fillOpacity="0.65" stroke="none" />
                </svg>
            </motion.div>

            {/* big vertical "GROWTH" watermark — right edge. It is SVG text: the colour is the letters' own fill (orange at
                the bottom, melting into the black toward the top) plus a thin grey outline. There is no background
                anywhere behind it. It slides up as you scroll down and leans with the mouse. */}
            <motion.div
                aria-hidden="true"
                style={reduce ? undefined : { x: wordX, y: wordY }}
                className="pointer-events-none absolute inset-0 hidden min-[1650px]:block"
            >
                <svg viewBox="0 0 180 800" className="absolute right-2 top-1/2 h-[54rem] w-auto -translate-y-1/2 select-none">
                    <defs>
                        {/* runs along the text: x1 = start of the word (visual bottom) → x2 = its end (visual top) */}
                        <linearGradient id="growthFill" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0" stopColor="#F8921C" stopOpacity="0.5" />
                            <stop offset="0.5" stopColor="#F8921C" stopOpacity="0.2" />
                            <stop offset="1" stopColor="#F8921C" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <text
                        transform="translate(150 780) rotate(-90)"
                        fill="url(#growthFill)"
                        stroke="rgba(176,180,190,0.2)"
                        strokeWidth="1.6"
                        paintOrder="stroke"
                        fontSize="175"
                        fontWeight="800"
                        style={{ fontFamily: "var(--font-jakarta), sans-serif" }}
                    >
                        GROWTH
                    </text>
                </svg>
            </motion.div>

            <div className="container relative z-10 mx-auto px-6 lg:px-10">
                {/* ===== body: collage  |  label + heading + cards ===== */}
                <div className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">

                    {/* ---------- left: three images, staggered collage ---------- */}
                    <div className="relative mx-auto w-full max-w-[520px] lg:max-w-none">
                        {/* Each tile has three layers: scroll/mouse motion (outer) → entrance reveal → slow idle float. */}

                        {/* 1 — wide, on top */}
                        <motion.div style={reduce ? undefined : { x: tileAX, y: tileAY }} className="relative z-0">
                            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewport}>
                                <div className="about-float-a">
                                    {renderTile(0, "h-[220px] sm:h-[290px]")}
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* 2 + 3 — side by side, dark frames cut into the top image, right one sits lower */}
                        <div className="relative z-10 -mt-12 flex items-start">
                            <motion.div
                                style={reduce ? undefined : { x: tileBX, y: tileBY }}
                                className="-ml-[14px] w-[56%]"
                            >
                                <motion.div variants={fadeUp} custom={1} initial="hidden" whileInView="show" viewport={viewport}>
                                    <div className="about-float-b rounded-[2.4rem] border-[14px] border-[color:var(--tone-deep)] bg-[color:var(--tone-deep)]">
                                        {renderTile(1, "h-[250px] sm:h-[340px]")}
                                    </div>
                                </motion.div>
                            </motion.div>

                            <motion.div
                                style={reduce ? undefined : { x: tileCX, y: tileCY }}
                                className="-mr-[14px] mt-10 w-[44%]"
                            >
                                <motion.div variants={fadeUp} custom={2} initial="hidden" whileInView="show" viewport={viewport}>
                                    <div className="about-float-c rounded-[2.4rem] border-[14px] border-[color:var(--tone-deep)] bg-[color:var(--tone-deep)]">
                                        {renderTile(2, "h-[220px] sm:h-[300px]")}
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>

                    {/* ---------- right: sub-heading label, heading, then three cards side by side ---------- */}
                    <div className="flex flex-col">
                        {/* label + heading drift gently with the scroll */}
                        <motion.div style={reduce ? undefined : { y: textY }}>
                            <motion.div
                                variants={fadeUp}
                                initial="hidden"
                                whileInView="show"
                                viewport={viewport}
                                className="mb-7"
                            >
                                <BracketLabel bn={bn} size="lg">{isBn ? "গ্রোথ রোডম্যাপ" : "Growth roadmap"}</BracketLabel>
                            </motion.div>

                            <motion.h2
                                variants={fadeUp}
                                initial="hidden"
                                whileInView="show"
                                viewport={viewport}
                                style={{ color: "#fff" }}
                                className={`text-[1.7rem] font-bold leading-[1.25] sm:text-3xl lg:text-[2.35rem] ${bn}`}
                            >
                                {isBn ? (
                                    <>
                                        তিনটি স্পষ্ট ধাপে <i className="font-light">বিজনেস বাড়ান</i>।
                                    </>
                                ) : (
                                    <>
                                        Three Clear Steps to <i className="font-light">Grow Your Business</i>.
                                    </>
                                )}
                            </motion.h2>
                        </motion.div>

                        <div className="mt-8 grid gap-4 sm:grid-cols-3">
                            {steps.map((s, i) => {
                                const Icon = s.icon;
                                return (
                                  <motion.div key={s.id} style={reduce ? undefined : { y: cardYs[i] }} className="relative h-full">
                                    {/* arrow to the next step (sits in the gap between two cards) */}
                                    {i < steps.length - 1 && (
                                        <span
                                            aria-hidden="true"
                                            className="pointer-events-none absolute -right-[21px] top-[34px] z-20 hidden h-7 w-7 place-items-center rounded-full bg-[#F8921C] text-black shadow-[0_6px_16px_-6px_rgba(248,146,28,0.9)] sm:grid"
                                        >
                                            <LuChevronRight size={16} />
                                        </span>
                                    )}
                                    <motion.div
                                        variants={fadeUp}
                                        custom={i + 1}
                                        initial="hidden"
                                        whileInView="show"
                                        viewport={viewport}
                                        className="h-full"
                                    >
                                      {/* leans toward the mouse + a light follows the pointer */}
                                      <TiltCard className="h-full" radius="1rem">
                                        <Link
                                            href={s.href}
                                            onMouseEnter={() => setHovered(i)}
                                            onMouseLeave={() => setHovered(null)}
                                            onFocus={() => setHovered(i)}
                                            onBlur={() => setHovered(null)}
                                            className="group relative flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#F8921C]/60 hover:bg-white/[0.05] hover:shadow-[0_24px_50px_-28px_rgba(248,146,28,0.55)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F8921C]"
                                        >
                                            <span className="flex items-start justify-between">
                                                <span className="grid h-14 w-14 place-items-center rounded-xl bg-[#F8921C]/10 text-[#F8921C] transition-colors duration-300 group-hover:bg-[#F8921C] group-hover:text-black">
                                                    <Icon size={26} />
                                                </span>
                                                <span className="text-sm font-bold tabular-nums text-white/25 transition-colors group-hover:text-[#F8921C]">
                                                    0{i + 1}
                                                </span>
                                            </span>

                                            <span className={`mt-5 block text-[17px] font-semibold leading-snug text-white ${bn}`}>
                                                {isBn ? s.titleBn : s.title}
                                            </span>
                                            <span className={`mt-2 block text-[13px] leading-6 text-white/60 ${bn}`}>
                                                {isBn ? s.descBn : s.desc}
                                            </span>

                                            <span className={`mt-auto inline-flex items-center gap-1.5 pt-5 text-[13px] font-semibold text-[#F8921C] transition-all duration-300 group-hover:gap-2.5 ${bn}`}>
                                                {isBn ? "বিস্তারিত" : "Learn more"}
                                                <LuArrowUpRight size={16} />
                                            </span>
                                        </Link>
                                      </TiltCard>
                                    </motion.div>
                                  </motion.div>
                                );
                            })}
                        </div>

                        {/* CTA + small client note */}
                        <motion.div
                            variants={fadeUp}
                            custom={4}
                            initial="hidden"
                            whileInView="show"
                            viewport={viewport}
                            className="mt-8 flex flex-wrap items-center justify-between gap-5"
                        >
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/about"
                                    className={`inline-flex items-center rounded-full bg-[#F8921C] px-8 py-4 text-sm font-semibold uppercase tracking-wide text-black transition-colors hover:bg-[#e07d0a] ${bn}`}
                                >
                                    {isBn ? "আরও জানুন" : "About more"}
                                </Link>
                                <Link
                                    href="/about"
                                    aria-label="About more"
                                    className="grid h-[52px] w-[52px] place-items-center rounded-full bg-white text-[#0a0a0a] transition-colors hover:bg-[#F8921C]"
                                >
                                    <LuMoveRight size={22} />
                                </Link>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex -space-x-2">
                                    {avatars.map((url, i) => (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            key={i}
                                            src={url}
                                            alt="Happy client"
                                            className="h-8 w-8 rounded-full border-2 border-[color:var(--tone-deep)] object-cover"
                                        />
                                    ))}
                                </div>
                                <span className={`text-xs leading-tight text-white/70 ${bn}`}>
                                    <b className="block text-sm font-bold text-white">300+</b>
                                    {isBn ? "সন্তুষ্ট ক্লায়েন্ট" : "happy clients"}
                                </span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes aboutFloat {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(var(--about-float, -7px)); }
                }
                @keyframes aboutFlowerSpin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .about-float-a { --about-float: -5px; animation: aboutFloat 9s ease-in-out infinite; }
                .about-float-b { --about-float: -8px; animation: aboutFloat 7s ease-in-out infinite; animation-delay: -2s; }
                .about-float-c { --about-float: -6px; animation: aboutFloat 8s ease-in-out infinite; animation-delay: -4s; }
                .about-flower { animation: aboutFlowerSpin 40s linear infinite; }
                @media (prefers-reduced-motion: reduce) {
                    .about-float-a, .about-float-b, .about-float-c, .about-flower { animation: none; }
                }
            `}</style>
        </section>
    );
};

export default AboutServices;
