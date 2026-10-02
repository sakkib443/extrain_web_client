"use client";

import React from "react";
import Link from "next/link";
import { motion, useTransform } from "framer-motion";
import { LuCheck, LuMoveRight } from "react-icons/lu";
import { useLanguage } from "@/context/LanguageContext";
import useSectionMotion from "@/hooks/useSectionMotion";
import BracketLabel from "@/components/Home/BracketLabel";
import { Star4, Plus, EdgeDots, OrbitRing } from "@/components/Home/Decor";
import { reveal } from "./shared";

const WhySection = () => {
    const { language } = useLanguage();
    const isBn = language === "bn";
    const bn = isBn ? "hind-siliguri" : "";

    const { ref: sectionRef, p, mx, my, reduce, isLg } = useSectionMotion();
    const k = isLg ? 1 : 0.3;
    const headY = useTransform(p, [0, 1], [20 * k, -20 * k]);
    const imgY = useTransform(p, [0, 1], [30 * k, -30 * k]);
    const photoX = useTransform(mx, [-0.5, 0.5], [14, -14]);
    const photoY = useTransform([p, my], ([pv, mv]) => (pv - 0.5) * -26 * k + mv * -10);
    const frameX = useTransform(mx, [-0.5, 0.5], [-10, 10]);
    const ringX = useTransform(mx, [-0.5, 0.5], [26, -26]);
    const ringY = useTransform(p, [0, 1], [60, -60]);
    const starY = useTransform(p, [0, 1], [-60, 60]);
    const starX = useTransform(mx, [-0.5, 0.5], [-22, 22]);
    const plusY = useTransform(p, [0, 1], [50, -50]);

    const checks = [
        isBn ? "কাস্টম ওয়েবসাইট ও সফটওয়্যার ডেভেলপমেন্ট" : "Custom Website & Software Development",
        isBn ? "IELTS, LMS ও শিক্ষা প্রতিষ্ঠানের জন্য সফটওয়্যার" : "IELTS, LMS & Educational Software Solutions",
        isBn ? "রেডিমেড টেমপ্লেট ও স্ক্রিপ্ট মার্কেটপ্লেস" : "Ready-made Templates & Scripts Marketplace",
        isBn ? "২৪/৭ সাপোর্ট ও মেইনটেন্যান্স সেবা" : "24/7 Customer Support & Maintenance",
        isBn ? "আধুনিক UI/UX ডিজাইন ও ব্র্যান্ডিং" : "Modern UI/UX Design & Branding",
    ];

    return (
        <section
            ref={sectionRef}
            id="about-why"
            className="relative overflow-hidden bg-[color:var(--tone-deep)] py-24 text-white lg:py-32"
        >
            {/* ===== background decoration ===== */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                <div className="absolute -bottom-24 left-1/4 h-80 w-80 rounded-full bg-[#F8921C]/[0.06] blur-3xl" />
                <EdgeDots />
                <motion.div
                    style={reduce ? undefined : { x: ringX, y: ringY }}
                    className="absolute -right-[15rem] top-[6%] hidden sm:block"
                >
                    <div className="relative aspect-square w-[32rem]">
                        <OrbitRing dashed className="absolute inset-0 border-white/[0.10]" />
                        <OrbitRing reverse dot="bottom" className="absolute inset-[16%] border-white/[0.07]" />
                    </div>
                </motion.div>
                <motion.div style={reduce ? undefined : { x: starX, y: starY }} className="absolute left-[4%] top-[8%] hidden md:block">
                    <Star4 size={34} filled className="decor-float text-[#F8921C]" style={{ animationDuration: "10s" }} />
                </motion.div>
                <motion.div style={reduce ? undefined : { y: plusY }} className="absolute bottom-[10%] right-[44%] hidden text-[#F8921C]/60 lg:block">
                    <Plus size={18} />
                </motion.div>
            </div>

            <div className="container relative z-10 mx-auto px-6 lg:px-10">
                <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
                    {/* ---------- left: visual ---------- */}
                    <motion.div style={reduce ? undefined : { y: imgY }} className="relative mx-auto w-full max-w-[560px] lg:max-w-none">
                        <motion.div {...reveal(0)} className="relative">
                            {/* offset outline behind the photo */}
                            <motion.div
                                aria-hidden="true"
                                style={reduce ? undefined : { x: frameX }}
                                className="pointer-events-none absolute inset-0 -translate-x-3 translate-y-3 rounded-[2rem] border border-[#F8921C]/40 sm:-translate-x-4 sm:translate-y-4"
                            />
                            <div className="group relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-white/10 bg-[color:var(--tone-soft)]">
                                <motion.div
                                    style={reduce ? undefined : { x: photoX, y: photoY, scale: 1.08 }}
                                    className="absolute inset-0"
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src="https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=2070&auto=format&fit=crop"
                                        alt="Extrain Web professional software development team working on projects"
                                        loading="lazy"
                                        className="h-full w-full object-cover grayscale-[30%] transition-all duration-700 group-hover:grayscale-0"
                                    />
                                </motion.div>
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                <span className="absolute left-5 top-5 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 text-[11px] font-bold tabular-nums text-[#F8921C] backdrop-blur-md">
                                    Extrain Web
                                </span>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* ---------- right: content ---------- */}
                    <div>
                        <motion.div style={reduce ? undefined : { y: headY }}>
                            <motion.div {...reveal(0)} className="mb-7">
                                <BracketLabel bn={bn} size="lg">{isBn ? "কেন আমরা" : "Why choose us"}</BracketLabel>
                            </motion.div>

                            <motion.h2
                                {...reveal(1)}
                                style={{ color: "#fff" }}
                                className={`text-[1.7rem] font-bold leading-[1.25] sm:text-3xl lg:text-[2.35rem] ${bn}`}
                            >
                                {isBn ? (
                                    <>আমরা শুধু কোড লিখি না, <i className="font-light">অভিজ্ঞতা তৈরি করি</i></>
                                ) : (
                                    <>We Don&apos;t Just Code, <i className="font-light">We Craft Experiences</i></>
                                )}
                            </motion.h2>

                            <motion.p
                                {...reveal(2)}
                                className={`mt-5 max-w-xl text-sm leading-7 text-white/60 sm:text-base ${bn}`}
                            >
                                {isBn
                                    ? "Extrain Web বাংলাদেশের একটি শীর্ষস্থানীয় ওয়েব ও সফটওয়্যার ডেভেলপমেন্ট কোম্পানি। আমরা আধুনিক প্রযুক্তি এবং সৃজনশীল ডিজাইনের সমন্বয়ে ব্যবসায়িক সমস্যার ডিজিটাল সমাধান তৈরি করি।"
                                    : "Extrain Web is a leading web and software development company in Bangladesh. We combine cutting-edge technology with creative design to build digital solutions that solve real business problems."}
                            </motion.p>
                        </motion.div>

                        <ul className="mt-8 space-y-3">
                            {checks.map((text, i) => (
                                <motion.li key={i} {...reveal(i * 0.5)}>
                                    <div className="group flex items-center gap-3.5 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#F8921C]/60 hover:bg-white/[0.05]">
                                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#F8921C]/10 text-[#F8921C] transition-colors duration-300 group-hover:bg-[#F8921C] group-hover:text-black">
                                            <LuCheck size={15} />
                                        </span>
                                        <span className={`text-sm font-medium leading-snug text-white/80 sm:text-[15px] ${bn}`}>{text}</span>
                                    </div>
                                </motion.li>
                            ))}
                        </ul>

                        <motion.div {...reveal(3)} className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/contact"
                                    className={`inline-flex items-center rounded-full bg-[#F8921C] px-8 py-4 text-sm font-semibold uppercase tracking-wide text-black transition-colors hover:bg-[#e07d0a] ${bn ? "tracking-normal" : ""} ${bn}`}
                                >
                                    {isBn ? "আমাদের সাথে কথা বলুন" : "Talk to Us"}
                                </Link>
                                <Link
                                    href="/contact"
                                    aria-label={isBn ? "আমাদের সাথে কথা বলুন" : "Talk to Us"}
                                    className="grid h-[52px] w-[52px] place-items-center rounded-full bg-white text-[#0a0a0a] transition-colors hover:bg-[#F8921C]"
                                >
                                    <LuMoveRight size={22} />
                                </Link>
                            </div>
                            <Link
                                href="/website"
                                className={`inline-flex items-center rounded-full border border-white/25 px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:border-[#F8921C] hover:text-[#F8921C] ${bn ? "tracking-normal" : ""} ${bn}`}
                            >
                                {isBn ? "আমাদের কাজ দেখুন" : "See Our Work"}
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhySection;
