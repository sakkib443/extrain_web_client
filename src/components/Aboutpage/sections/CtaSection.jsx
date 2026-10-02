"use client";

import React from "react";
import Link from "next/link";
import { motion, useTransform } from "framer-motion";
import { LuMoveRight } from "react-icons/lu";
import { useLanguage } from "@/context/LanguageContext";
import useSectionMotion from "@/hooks/useSectionMotion";
import { Star4, Plus, EdgeDots, OrbitRing } from "@/components/Home/Decor";
import { reveal, outlineStyle, filledAccent } from "./shared";

const CtaSection = () => {
    const { language } = useLanguage();
    const isBn = language === "bn";
    const bn = isBn ? "hind-siliguri" : "";

    const { ref: sectionRef, p, mx, reduce, isLg } = useSectionMotion();
    const k = isLg ? 1 : 0.4;
    const panelY = useTransform(p, [0, 1], [24 * k, -24 * k]);
    const ringX = useTransform(mx, [-0.5, 0.5], [-28, 28]);
    const ringY = useTransform(p, [0, 1], [-50, 50]);
    const ring2X = useTransform(mx, [-0.5, 0.5], [24, -24]);
    const ring2Y = useTransform(p, [0, 1], [50, -50]);
    const starX = useTransform(mx, [-0.5, 0.5], [-22, 22]);
    const starY = useTransform(p, [0, 1], [-50, 50]);
    const plusY = useTransform(p, [0, 1], [40, -40]);

    return (
        <section
            ref={sectionRef}
            id="about-cta"
            className="relative overflow-hidden bg-[color:var(--tone-soft)] py-24 text-white lg:py-32"
        >
            {/* ===== background decoration ===== */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                <div className="absolute -top-24 left-1/4 h-80 w-80 rounded-full bg-[#F8921C]/[0.06] blur-3xl" />
                <EdgeDots />
            </div>

            <div className="container relative z-10 mx-auto px-6 lg:px-10">
                <motion.div style={reduce ? undefined : { y: panelY }}>
                    <motion.div
                        {...reveal(0)}
                        className="relative overflow-hidden rounded-[2rem] border border-[#F8921C]/30 bg-[color:var(--tone-deep)] px-6 py-16 text-center shadow-[0_40px_90px_-50px_rgba(248,146,28,0.55)] sm:px-12 lg:rounded-[2.5rem] lg:py-24"
                    >
                        {/* panel background: the hero streaks, an orange glow and slow rings */}
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-60"
                            style={{ backgroundImage: "url('/hero-bg.webp')" }}
                        />
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_115%,rgba(248,146,28,0.30),transparent_60%)]"
                        />
                        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-black/30" />
                        <motion.div
                            aria-hidden="true"
                            style={reduce ? undefined : { x: ringX, y: ringY }}
                            className="pointer-events-none absolute -left-[12rem] -top-[10rem] hidden sm:block"
                        >
                            <div className="relative aspect-square w-[26rem]">
                                <OrbitRing dashed className="absolute inset-0 border-white/[0.12]" />
                                <OrbitRing reverse dot="bottom" className="absolute inset-[16%] border-[#F8921C]/25" />
                            </div>
                        </motion.div>
                        <motion.div
                            aria-hidden="true"
                            style={reduce ? undefined : { x: ring2X, y: ring2Y }}
                            className="pointer-events-none absolute -bottom-[11rem] -right-[11rem] hidden sm:block"
                        >
                            <div className="relative aspect-square w-[24rem]">
                                <OrbitRing reverse className="absolute inset-0 border-white/[0.10]" />
                                <OrbitRing dashed dot="bottom" className="absolute inset-[18%] border-white/[0.07]" />
                            </div>
                        </motion.div>
                        <motion.div
                            aria-hidden="true"
                            style={reduce ? undefined : { x: starX, y: starY }}
                            className="pointer-events-none absolute right-[8%] top-[12%] hidden md:block"
                        >
                            <Star4 size={34} filled className="decor-float text-[#F8921C]" style={{ animationDuration: "10s" }} />
                        </motion.div>
                        <motion.div
                            aria-hidden="true"
                            style={reduce ? undefined : { y: plusY }}
                            className="pointer-events-none absolute bottom-[16%] left-[9%] hidden text-[#F8921C]/70 md:block"
                        >
                            <Plus size={20} />
                        </motion.div>

                        <div className="relative z-10 mx-auto max-w-3xl">
                            <motion.h2
                                {...reveal(1)}
                                style={{ color: "#fff" }}
                                className={
                                    isBn
                                        ? `text-[2rem] font-bold leading-[1.25] sm:text-4xl lg:text-[3.2rem] ${bn}`
                                        : "font-bold uppercase leading-[1.08] tracking-[-0.015em] text-[clamp(2.3rem,6.6vw,4.6rem)]"
                                }
                            >
                                {isBn ? (
                                    <>চলুন গড়ি <i className="font-light">আগামীর ভবিষ্যৎ</i></>
                                ) : (
                                    <>
                                        <span className="block text-white">LET&apos;S BUILD</span>
                                        <span className="block" style={outlineStyle}>
                                            THE F<span style={filledAccent}>U</span>TURE
                                        </span>
                                    </>
                                )}
                            </motion.h2>

                            <motion.p
                                {...reveal(2)}
                                className={`mx-auto mt-6 max-w-xl text-sm leading-7 text-white/70 sm:text-base ${bn}`}
                            >
                                {isBn
                                    ? "আপনার ডিজিটাল উপস্থিতি বদলাতে প্রস্তুত? হাজারো সন্তুষ্ট ক্লায়েন্টের সাথে যোগ দিন, যারা Extrain Web-কে বিশ্বাস করেন।"
                                    : "Ready to transform your digital presence? Join thousands of satisfied clients who trust Extrain Web."}
                            </motion.p>

                            <motion.div {...reveal(3)} className="mt-9 flex items-center justify-center gap-2">
                                <Link
                                    href="/contact"
                                    className={`inline-flex items-center rounded-full bg-[#F8921C] px-8 py-4 text-sm font-semibold uppercase tracking-wide text-black transition-colors hover:bg-[#e07d0a] ${bn ? "tracking-normal" : ""} ${bn}`}
                                >
                                    {isBn ? "প্রজেক্ট শুরু করুন" : "Start A Project"}
                                </Link>
                                <Link
                                    href="/contact"
                                    aria-label={isBn ? "প্রজেক্ট শুরু করুন" : "Start A Project"}
                                    className="grid h-[52px] w-[52px] place-items-center rounded-full bg-white text-[#0a0a0a] transition-colors hover:bg-[#F8921C]"
                                >
                                    <LuMoveRight size={22} />
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default CtaSection;
