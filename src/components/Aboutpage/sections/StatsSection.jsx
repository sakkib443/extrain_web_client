"use client";

import React, { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useTransform } from "framer-motion";
import { LuUsers, LuBriefcase, LuAward } from "react-icons/lu";
import { useLanguage } from "@/context/LanguageContext";
import useSectionMotion from "@/hooks/useSectionMotion";
import TiltCard from "@/components/Home/TiltCard";
import { Star4, OrbitRing } from "@/components/Home/Decor";
import { reveal } from "./shared";

// Counts up from 0 the first time it scrolls into view.
const CountUp = ({ to, reduce }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, amount: 0.6 });
    const [n, setN] = useState(to);
    useEffect(() => {
        if (!inView || reduce) return;
        setN(0);
        const ctrl = animate(0, to, {
            duration: 1.8,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (v) => setN(Math.round(v)),
        });
        return () => ctrl.stop();
    }, [inView, to, reduce]);
    return <span ref={ref}>{n}</span>;
};

const StatsSection = () => {
    const { language } = useLanguage();
    const isBn = language === "bn";
    const bn = isBn ? "hind-siliguri" : "";

    const { ref: sectionRef, p, mx, reduce, isLg } = useSectionMotion();
    const s = isLg ? 1 : 0;
    const cardY0 = useTransform(p, [0, 1], [18 * s, -18 * s]);
    const cardY1 = useTransform(p, [0, 1], [4 * s, -4 * s]);
    const cardY2 = useTransform(p, [0, 1], [30 * s, -30 * s]);
    const cardYs = [cardY0, cardY1, cardY2];
    const ringX = useTransform(mx, [-0.5, 0.5], [-26, 26]);
    const ringY = useTransform(p, [0, 1], [-50, 50]);
    const starX = useTransform(mx, [-0.5, 0.5], [-22, 22]);
    const starY = useTransform(p, [0, 1], [50, -50]);

    const stats = [
        { icon: LuUsers, num: 50, label: isBn ? "সন্তুষ্ট ক্লায়েন্ট" : "Happy Clients" },
        { icon: LuBriefcase, num: 100, label: isBn ? "সম্পন্ন প্রজেক্ট" : "Projects Done" },
        { icon: LuAward, num: 5, label: isBn ? "বছরের অভিজ্ঞতা" : "Years Experience" },
    ];

    return (
        <section
            ref={sectionRef}
            id="about-stats"
            className="relative overflow-hidden bg-[color:var(--tone-deep)] py-20 text-white lg:py-24"
        >
            {/* ===== background decoration ===== */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                <div className="absolute left-1/2 top-1/2 h-72 w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F8921C]/[0.06] blur-3xl" />
                <motion.div
                    style={reduce ? undefined : { x: ringX, y: ringY }}
                    className="absolute -right-[14rem] -top-[12rem] hidden sm:block"
                >
                    <div className="relative aspect-square w-[28rem]">
                        <OrbitRing dashed reverse dot="bottom" className="absolute inset-0 border-white/[0.09]" />
                        <OrbitRing className="absolute inset-[18%] border-white/[0.06]" />
                    </div>
                </motion.div>
                <motion.div style={reduce ? undefined : { x: starX, y: starY }} className="absolute bottom-[12%] left-[6%] hidden md:block">
                    <Star4 size={30} className="decor-float text-[#F8921C]/70" style={{ animationDuration: "11s" }} />
                </motion.div>
            </div>

            <div className="container relative z-10 mx-auto px-6 lg:px-10">
                <div className="grid gap-4 sm:grid-cols-3 lg:gap-6">
                    {stats.map((st, i) => {
                        const Icon = st.icon;
                        return (
                            <motion.div key={st.label} style={reduce ? undefined : { y: cardYs[i] }} className="h-full">
                                <motion.div {...reveal(i)} className="h-full">
                                    <TiltCard className="h-full" radius="1.25rem">
                                        <div className="group relative flex h-full items-center gap-5 overflow-hidden rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#F8921C]/60 hover:shadow-[0_24px_50px_-28px_rgba(248,146,28,0.55)] sm:flex-col sm:items-start sm:gap-6 lg:p-8">
                                            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-[#F8921C]/10 text-[#F8921C] transition-colors duration-300 group-hover:bg-[#F8921C] group-hover:text-black">
                                                <Icon size={26} />
                                            </span>
                                            <div>
                                                <p className="flex items-baseline text-[3.2rem] font-bold leading-none text-white lg:text-[4rem]">
                                                    <CountUp to={st.num} reduce={reduce} />
                                                    <span className="text-[#F8921C]">+</span>
                                                </p>
                                                <p className={`mt-3 text-sm font-medium text-white/60 ${bn}`}>{st.label}</p>
                                                <span className="mt-4 hidden h-[3px] w-10 rounded-full bg-[#F8921C] transition-all duration-500 group-hover:w-24 sm:block" />
                                            </div>
                                        </div>
                                    </TiltCard>
                                </motion.div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
