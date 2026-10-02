"use client";

import React from "react";
import Link from "next/link";
import { motion, useTransform } from "framer-motion";
import {
    LuMegaphone, LuSearch, LuTarget, LuShare2, LuCrosshair, LuTrendingUp,
    LuCamera, LuVideo, LuClapperboard, LuPalette, LuPenTool, LuSparkles,
    LuMoveRight, LuArrowUpRight, LuChevronRight, LuPhone, LuCheck,
} from "react-icons/lu";
import { FaWhatsapp } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";
import useSectionMotion from "@/hooks/useSectionMotion";
import BracketLabel from "@/components/Home/BracketLabel";
import TiltCard from "@/components/Home/TiltCard";
import { Star4, EdgeDots, OrbitRing } from "@/components/Home/Decor";
import { outlineStyle, filledAccent, reveal } from "@/components/Aboutpage/sections/shared";

// One template for the service pages (Digital Marketing, Media & Content). Content lives in data/servicePages.js.
// Black theme, same look as the About / Contact pages: hero (deep) → services (soft) → packages (deep) → process (soft) → CTA (deep).

const ICONS = {
    megaphone: LuMegaphone, search: LuSearch, target: LuTarget, share: LuShare2, crosshair: LuCrosshair, chart: LuTrendingUp,
    camera: LuCamera, video: LuVideo, clapper: LuClapperboard, palette: LuPalette, pen: LuPenTool, brand: LuSparkles,
};

const PHONE = "+8801711946614";

// the outlined word with one filled orange letter
const OutlineWord = ({ word, accent }) => (
    <span style={outlineStyle}>
        {word.split("").map((ch, i) => (
            <span key={i} style={i === accent ? filledAccent : undefined}>{ch}</span>
        ))}
    </span>
);

function Hero({ d, isBn, bn }) {
    const { ref, p, mx, my, reduce, isLg } = useSectionMotion();
    const k = isLg ? 1 : 0.4;
    const textY = useTransform(p, [0, 1], [14 * k, -34 * k]);
    const visY = useTransform(p, [0, 1], [22 * k, -22 * k]);
    const imgX = useTransform(mx, [-0.5, 0.5], [12, -12]);
    const imgY = useTransform([p, my], ([pv, mv]) => (pv - 0.5) * -22 + mv * -8);
    const glowX = useTransform(mx, [-0.5, 0.5], [-50, 50]);
    const ringX = useTransform(mx, [-0.5, 0.5], [-28, 28]);
    const ringY = useTransform(p, [0, 1], [-50, 50]);
    const starY = useTransform(p, [0, 1], [-60, 60]);
    const starX = useTransform(mx, [-0.5, 0.5], [-24, 24]);

    const scrollToServices = () => document.getElementById("services-list")?.scrollIntoView({ behavior: "smooth" });

    return (
        <section ref={ref} className="relative overflow-hidden bg-[color:var(--tone-deep)]">
            <div className="pointer-events-none absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/hero-bg.webp')" }} />
            <div className="pointer-events-none absolute inset-0 bg-black/30" />
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                <motion.div style={reduce ? undefined : { x: glowX }} className="absolute -bottom-32 left-[8%] h-96 w-96 rounded-full bg-[#F8921C]/[0.10] blur-3xl" />
                <EdgeDots />
                <motion.div style={reduce ? undefined : { x: ringX, y: ringY }} className="absolute -right-[16rem] top-[6%] hidden sm:block">
                    <div className="relative aspect-square w-[36rem]">
                        <OrbitRing dashed className="absolute inset-0 border-white/[0.12]" />
                        <OrbitRing reverse dot="bottom" className="absolute inset-[16%] border-[#F8921C]/25" />
                    </div>
                </motion.div>
                <motion.div style={reduce ? undefined : { x: starX, y: starY }} className="absolute left-[44%] top-[12%] hidden lg:block">
                    <Star4 size={34} filled className="decor-float text-[#F8921C]" style={{ animationDuration: "10s" }} />
                </motion.div>
            </div>

            <div className="container relative z-10 mx-auto px-6 lg:px-10">
                <div className="grid items-center gap-16 pb-20 pt-28 lg:min-h-[min(calc(100svh-65px),780px)] lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:pt-32">
                    {/* ---------- copy ---------- */}
                    <motion.div style={reduce ? undefined : { y: textY }}>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="mb-12">
                            <BracketLabel bn={bn} size="lg">{isBn ? d.labelBn : d.label}</BracketLabel>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                            style={{ color: "#fff" }}
                            className="relative font-bold uppercase leading-[1.08] tracking-[-0.015em] text-[clamp(2.6rem,6.4vw,5.4rem)]"
                        >
                            <span aria-hidden="true" className="pointer-events-none absolute -top-4 left-0 hidden h-16 w-16 border-l border-t border-white/90 sm:block">
                                <i className="absolute -left-[5px] -top-[5px] h-2.5 w-2.5 bg-[#F8921C]" />
                                <i className="absolute -bottom-[5px] -left-[5px] h-2.5 w-2.5 bg-[#F8921C]" />
                            </span>
                            <span className="block text-white sm:pl-[0.55em]">{d.line1}</span>
                            <span className="block">
                                <span className="relative inline-block">
                                    <OutlineWord word={d.line2} accent={d.accentIndex} />
                                    <span style={filledAccent}>.</span>
                                    <span aria-hidden="true" className="pointer-events-none absolute -bottom-3 -right-8 hidden h-14 w-14 border-b border-r border-white/90 sm:block">
                                        <i className="absolute -right-[5px] -top-[5px] h-2.5 w-2.5 bg-[#F8921C]" />
                                        <i className="absolute -bottom-[5px] -right-[5px] h-2.5 w-2.5 bg-[#F8921C]" />
                                    </span>
                                </span>
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className={`mt-9 max-w-md border-l-2 border-[#F8921C] py-0.5 pl-5 text-base leading-relaxed text-white/70 lg:text-lg ${bn}`}
                        >
                            {isBn ? d.introBn : d.intro}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.4 }}
                            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4"
                        >
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/contact"
                                    className={`inline-flex items-center rounded-full bg-[#F8921C] px-8 py-4 text-sm font-semibold uppercase text-black transition-colors hover:bg-[#e07d0a] ${bn ? "tracking-normal" : "tracking-wide"} ${bn}`}
                                >
                                    {isBn ? "কোটেশন নিন" : "Get a Quote"}
                                </Link>
                                <Link
                                    href="/contact"
                                    aria-label={isBn ? "কোটেশন নিন" : "Get a Quote"}
                                    className="grid h-[52px] w-[52px] place-items-center rounded-full bg-white text-[#0a0a0a] transition-colors hover:bg-[#F8921C]"
                                >
                                    <LuMoveRight size={22} />
                                </Link>
                            </div>
                            <button
                                type="button"
                                onClick={scrollToServices}
                                className={`inline-flex items-center rounded-full border border-white/25 px-8 py-4 text-sm font-semibold uppercase text-white transition-colors hover:border-[#F8921C] hover:text-[#F8921C] ${bn ? "tracking-normal" : "tracking-wide"} ${bn}`}
                            >
                                {isBn ? "সার্ভিসগুলো দেখুন" : "Our Services"}
                            </button>
                        </motion.div>
                    </motion.div>

                    {/* ---------- photo ---------- */}
                    <motion.div style={reduce ? undefined : { y: visY }} className="relative mx-auto w-full max-w-[540px] lg:max-w-none">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                            className="relative"
                        >
                            <div aria-hidden="true" className="pointer-events-none absolute inset-0 translate-x-3 translate-y-3 rounded-[2rem] rounded-tl-[6rem] border border-[#F8921C]/40 sm:translate-x-4 sm:translate-y-4" />
                            <div className="relative aspect-[5/4.4] overflow-hidden rounded-[2rem] rounded-tl-[6rem] border border-white/10 bg-[color:var(--tone-soft)]">
                                <motion.div style={reduce ? undefined : { x: imgX, y: imgY, scale: 1.08 }} className="absolute inset-0">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={d.image} alt={d.imageAlt} className="h-full w-full object-cover" />
                                </motion.div>
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />
                                <div className="absolute bottom-4 right-4 rounded-2xl border border-white/15 bg-black/50 px-5 py-4 backdrop-blur-md sm:bottom-6 sm:right-6">
                                    <span className="block text-4xl font-bold leading-none text-[#F8921C]">{d.badge.value}</span>
                                    <p className={`mt-1.5 text-[11px] uppercase text-white/75 ${bn ? "tracking-normal" : "tracking-[0.16em]"} ${bn}`}>
                                        {isBn ? d.badge.textBn : d.badge.text}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

function Services({ d, isBn, bn }) {
    const [t1, t2] = isBn ? d.servicesTitleBn : d.servicesTitle;
    return (
        <section id="services-list" className="relative scroll-mt-16 overflow-hidden bg-[color:var(--tone-soft)] py-24 lg:py-32">
            <div className="pointer-events-none absolute -top-24 left-1/3 h-80 w-80 rounded-full bg-[#F8921C]/[0.06] blur-3xl" aria-hidden="true" />
            <div className="container relative z-10 mx-auto px-6 lg:px-10">
                <div className="mx-auto max-w-2xl text-center">
                    <motion.div {...reveal(0)} className="mb-7">
                        <BracketLabel bn={bn} size="lg">{isBn ? "আমাদের সার্ভিস" : "What we do"}</BracketLabel>
                    </motion.div>
                    <motion.h2 {...reveal(1)} style={{ color: "#fff" }} className={`text-[1.7rem] font-bold leading-[1.25] sm:text-3xl lg:text-[2.35rem] ${bn}`}>
                        {t1} <i className="font-light">{t2}</i>
                    </motion.h2>
                </div>

                <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {d.services.map((s, i) => {
                        const Icon = ICONS[s.icon] || LuSparkles;
                        return (
                            <motion.div key={s.title} {...reveal(i % 3)} className="h-full">
                                <TiltCard className="h-full" radius="1.25rem">
                                    <div className="group flex h-full flex-col rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#F8921C]/60 hover:bg-white/[0.05] hover:shadow-[0_24px_50px_-28px_rgba(248,146,28,0.55)] sm:p-7">
                                        <div className="flex items-start justify-between">
                                            <span className="grid h-14 w-14 place-items-center rounded-xl bg-[#F8921C]/10 text-[#F8921C] transition-colors duration-300 group-hover:bg-[#F8921C] group-hover:text-black">
                                                <Icon size={24} />
                                            </span>
                                            <span className="text-sm font-bold tabular-nums text-white/20 transition-colors group-hover:text-[#F8921C]">0{i + 1}</span>
                                        </div>
                                        <h3 style={{ color: "#fff" }} className={`mt-6 text-[18px] font-semibold leading-snug ${bn}`}>{isBn ? s.titleBn : s.title}</h3>
                                        <p className={`mt-2 text-[14px] leading-6 text-white/60 ${bn}`}>{isBn ? s.descBn : s.desc}</p>
                                        <span className="mt-6 block h-[3px] w-10 rounded-full bg-[#F8921C] transition-all duration-500 group-hover:w-20" />
                                    </div>
                                </TiltCard>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function Packages({ d, isBn, bn }) {
    if (!d.packages?.length) return null;
    const waFor = (pkg) =>
        `https://wa.me/${PHONE.replace("+", "")}?text=${encodeURIComponent(`Hello Extrain Web! I'm interested in the ${pkg.name} package (${d.label}).`)}`;

    return (
        <section id="packages" className="relative scroll-mt-16 overflow-hidden bg-[color:var(--tone-deep)] py-24 lg:py-32">
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                <div className="absolute left-1/2 top-48 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[#F8921C]/[0.07] blur-3xl" />
                <EdgeDots />
            </div>
            <div className="container relative z-10 mx-auto px-6 lg:px-10">
                <div className="mx-auto max-w-2xl text-center">
                    <motion.div {...reveal(0)} className="mb-7">
                        <BracketLabel bn={bn} size="lg">{isBn ? "প্যাকেজ ও দাম" : "Packages"}</BracketLabel>
                    </motion.div>
                    <motion.h2 {...reveal(1)} style={{ color: "#fff" }} className={`text-[1.7rem] font-bold leading-[1.25] sm:text-3xl lg:text-[2.35rem] ${bn}`}>
                        {isBn ? <>আপনার জন্য <i className="font-light">সঠিক প্যাকেজ</i></> : <>Choose the Right <i className="font-light">Package</i></>}
                    </motion.h2>
                </div>

                <div className="mx-auto mt-16 grid max-w-6xl items-stretch gap-6 lg:grid-cols-3">
                    {d.packages.map((pkg, i) => {
                        const pop = pkg.popular;
                        return (
                            <motion.div key={pkg.name} {...reveal(i)} className={`relative ${pop ? "lg:-my-4" : ""}`}>
                                {pop && (
                                    <span className={`absolute -top-3.5 left-1/2 z-10 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-[#F8921C] px-4 py-1.5 text-xs font-bold uppercase text-black shadow-[0_8px_24px_-8px_rgba(248,146,28,0.9)] ${bn ? "tracking-normal" : "tracking-wider"} ${bn}`}>
                                        <LuSparkles size={13} />
                                        {isBn ? "সবচেয়ে জনপ্রিয়" : "Most Popular"}
                                    </span>
                                )}
                                <div
                                    className={`flex h-full flex-col rounded-[1.5rem] border p-7 sm:p-8 ${
                                        pop
                                            ? "border-[#F8921C]/70 bg-gradient-to-b from-[#F8921C]/[0.12] to-[color:var(--tone-soft)] shadow-[0_40px_80px_-40px_rgba(248,146,28,0.55)]"
                                            : "border-white/10 bg-[color:var(--tone-soft)]"
                                    }`}
                                >
                                    <div className="flex items-baseline justify-between">
                                        <h3 style={{ color: "#fff" }} className={`text-xl font-bold ${bn}`}>{isBn ? pkg.nameBn : pkg.name}</h3>
                                        <span className="text-sm font-bold tabular-nums text-white/20">0{i + 1}</span>
                                    </div>
                                    <p className={`mt-1 text-[13px] text-white/55 ${bn}`}>{isBn ? pkg.taglineBn : pkg.tagline}</p>

                                    <div className="mt-6 flex items-baseline gap-2 border-y border-white/10 py-6">
                                        <span className="text-[2.6rem] font-bold leading-none tracking-tight text-white">৳{pkg.price.toLocaleString("en-IN")}</span>
                                        <span className={`text-sm text-white/50 ${bn}`}>{isBn ? pkg.periodBn : pkg.period}</span>
                                    </div>

                                    <ul className="mt-6 flex-1 space-y-3">
                                        {pkg.features.map(([en, bnText]) => (
                                            <li key={en} className="flex items-start gap-3">
                                                <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${pop ? "bg-[#F8921C] text-black" : "bg-[#F8921C]/15 text-[#F8921C]"}`}>
                                                    <LuCheck size={11} strokeWidth={3} />
                                                </span>
                                                <span className={`text-[14px] leading-snug text-white/75 ${bn}`}>{isBn ? bnText : en}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <a
                                        href={waFor(pkg)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`group mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-semibold uppercase transition-colors ${
                                            pop ? "bg-[#F8921C] text-black hover:bg-[#e07d0a]" : "bg-white text-black hover:bg-[#F8921C]"
                                        } ${bn ? "tracking-normal" : "tracking-wide"} ${bn}`}
                                    >
                                        <FaWhatsapp size={17} />
                                        {isBn ? "প্যাকেজটি নিন" : "Get Started"}
                                        <LuMoveRight size={16} className="transition-transform group-hover:translate-x-1" />
                                    </a>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {(d.packagesNote || d.packagesNoteBn) && (
                    <motion.p {...reveal(1)} className={`mx-auto mt-12 max-w-2xl text-center text-[13px] leading-6 text-white/50 ${bn}`}>
                        * {isBn ? d.packagesNoteBn : d.packagesNote}{" "}
                        {isBn ? "কাস্টম প্যাকেজের জন্য " : "Need something custom? "}
                        <Link href="/contact" className="font-semibold text-[#F8921C] underline-offset-4 hover:underline">
                            {isBn ? "যোগাযোগ করুন" : "Contact us"}
                        </Link>
                        {isBn ? "।" : "."}
                    </motion.p>
                )}
            </div>
        </section>
    );
}

function Process({ d, isBn, bn }) {
    return (
        <section className="relative overflow-hidden bg-[color:var(--tone-soft)] py-24 lg:py-32">
            <div className="container relative z-10 mx-auto px-6 lg:px-10">
                <div className="mx-auto max-w-2xl text-center">
                    <motion.div {...reveal(0)} className="mb-7">
                        <BracketLabel bn={bn} size="lg">{isBn ? "কাজের ধাপ" : "How we work"}</BracketLabel>
                    </motion.div>
                    <motion.h2 {...reveal(1)} style={{ color: "#fff" }} className={`text-[1.7rem] font-bold leading-[1.25] sm:text-3xl lg:text-[2.35rem] ${bn}`}>
                        {isBn ? <>চারটি <i className="font-light">সহজ ধাপ</i></> : <>Four <i className="font-light">Simple Steps</i></>}
                    </motion.h2>
                </div>

                <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {d.steps.map((s, i) => (
                        <motion.div key={s.title} {...reveal(i)} className="relative h-full">
                            {i < d.steps.length - 1 && (
                                <span aria-hidden="true" className="pointer-events-none absolute -right-[19px] top-[30px] z-20 hidden h-7 w-7 place-items-center rounded-full bg-[#F8921C] text-black shadow-[0_6px_16px_-6px_rgba(248,146,28,0.9)] lg:grid">
                                    <LuChevronRight size={16} />
                                </span>
                            )}
                            <div className="h-full rounded-[1.25rem] border border-white/10 bg-[color:var(--tone-deep)]/60 p-6">
                                <span className="text-4xl font-bold tabular-nums text-[#F8921C]">0{i + 1}</span>
                                <h3 style={{ color: "#fff" }} className={`mt-4 text-[17px] font-semibold ${bn}`}>{isBn ? s.titleBn : s.title}</h3>
                                <p className={`mt-2 text-[13.5px] leading-6 text-white/60 ${bn}`}>{isBn ? s.descBn : s.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function Cta({ d, isBn, bn }) {
    const [t1, t2] = isBn ? d.ctaTitleBn : d.ctaTitle;
    const wa = `https://wa.me/${PHONE.replace("+", "")}?text=${encodeURIComponent(d.whatsappText)}`;
    return (
        <section className="relative overflow-hidden bg-[color:var(--tone-deep)] py-24 lg:py-28">
            <div className="container relative z-10 mx-auto px-6 lg:px-10">
                <motion.div {...reveal(0)} className="relative overflow-hidden rounded-[2rem] rounded-tl-[5rem] border border-white/10 bg-[color:var(--tone-soft)] px-6 py-16 text-center sm:px-12 lg:py-20">
                    <div className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: "url('/hero-bg.webp')" }} aria-hidden="true" />
                    <div className="pointer-events-none absolute -bottom-24 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-[#F8921C]/[0.14] blur-3xl" aria-hidden="true" />
                    <div className="pointer-events-none absolute -right-40 -top-40 hidden aspect-square w-[26rem] sm:block" aria-hidden="true">
                        <OrbitRing dashed className="absolute inset-0 border-white/[0.10]" />
                        <OrbitRing reverse dot="bottom" className="absolute inset-[18%] border-[#F8921C]/25" />
                    </div>

                    <div className="relative mx-auto max-w-3xl">
                        <h2 style={{ color: "#fff" }} className={`text-[1.9rem] font-bold leading-[1.2] sm:text-4xl lg:text-[3rem] ${bn}`}>
                            {t1} <i className="font-light text-[#F8921C]">{t2}</i>
                        </h2>
                        <p className={`mx-auto mt-5 max-w-xl text-base leading-7 text-white/65 ${bn}`}>
                            {isBn ? "আপনার প্রয়োজন জানান — আমরা ফ্রি পরামর্শ ও কোটেশন দেব।" : "Tell us what you need — we'll get back with a free consultation and quote."}
                        </p>
                        <div className="mt-9 flex flex-wrap items-center justify-center gap-x-5 gap-y-4">
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/contact"
                                    className={`inline-flex items-center rounded-full bg-[#F8921C] px-8 py-4 text-sm font-semibold uppercase text-black transition-colors hover:bg-[#e07d0a] ${bn ? "tracking-normal" : "tracking-wide"} ${bn}`}
                                >
                                    {isBn ? "যোগাযোগ করুন" : "Get in Touch"}
                                </Link>
                                <Link href="/contact" aria-label={isBn ? "যোগাযোগ করুন" : "Get in Touch"} className="grid h-[52px] w-[52px] place-items-center rounded-full bg-white text-[#0a0a0a] transition-colors hover:bg-[#F8921C]">
                                    <LuArrowUpRight size={22} />
                                </Link>
                            </div>
                            <a
                                href={wa}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-flex items-center gap-2 rounded-full border border-white/25 px-8 py-4 text-sm font-semibold uppercase text-white transition-colors hover:border-[#F8921C] hover:text-[#F8921C] ${bn ? "tracking-normal" : "tracking-wide"} ${bn}`}
                            >
                                <FaWhatsapp size={17} />
                                WhatsApp
                            </a>
                        </div>
                        <a href={`tel:${PHONE}`} className="mt-8 inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-[#F8921C]">
                            <LuPhone size={15} className="text-[#F8921C]" />
                            +880 1711-946614
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

export default function ServicePage({ data }) {
    const { language } = useLanguage();
    const isBn = language === "bn";
    const bn = isBn ? "hind-siliguri" : "";
    const props = { d: data, isBn, bn };

    return (
        <div className="relative overflow-x-clip bg-[color:var(--tone-deep)] text-white selection:bg-[#F8921C] selection:text-black">
            <Hero {...props} />
            <Services {...props} />
            <Packages {...props} />
            <Process {...props} />
            <Cta {...props} />
        </div>
    );
}
