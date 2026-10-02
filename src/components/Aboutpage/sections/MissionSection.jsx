"use client";

import React from "react";
import { motion, useTransform } from "framer-motion";
import { LuTarget, LuZap, LuGlobe, LuUsers } from "react-icons/lu";
import { useLanguage } from "@/context/LanguageContext";
import useSectionMotion from "@/hooks/useSectionMotion";
import BracketLabel from "@/components/Home/BracketLabel";
import TiltCard from "@/components/Home/TiltCard";
import { Star4, Plus, EdgeDots, OrbitRing } from "@/components/Home/Decor";
import { reveal } from "./shared";

const VALUES = [
    {
        icon: LuTarget,
        title: "Precision",
        titleBn: "নির্ভুলতা",
        desc: "Pixel-perfect execution in every project.",
        descBn: "প্রতিটি প্রজেক্টে পিক্সেল-পারফেক্ট কাজ।",
    },
    {
        icon: LuZap,
        title: "Speed",
        titleBn: "গতি",
        desc: "Optimized for performance and scale.",
        descBn: "পারফরম্যান্স ও স্কেলের জন্য অপটিমাইজড।",
    },
    {
        icon: LuGlobe,
        title: "Global",
        titleBn: "বৈশ্বিক",
        desc: "Connecting minds across borders.",
        descBn: "সীমানা পেরিয়ে মানুষের সাথে মানুষের সংযোগ।",
    },
    {
        icon: LuUsers,
        title: "Community",
        titleBn: "কমিউনিটি",
        desc: "Building a network of elite creators.",
        descBn: "সেরা ক্রিয়েটরদের একটি নেটওয়ার্ক গড়ে তোলা।",
    },
];

const MissionSection = () => {
    const { language } = useLanguage();
    const isBn = language === "bn";
    const bn = isBn ? "hind-siliguri" : "";

    const { ref: sectionRef, p, mx, reduce, isLg } = useSectionMotion();
    const s = isLg ? 1 : 0; // card-to-card offsets only where the layout is side by side
    const headY = useTransform(p, [0, 1], [22 * s, -22 * s]);
    const cardY0 = useTransform(p, [0, 1], [26 * s, -26 * s]);
    const cardY1 = useTransform(p, [0, 1], [8 * s, -8 * s]);
    const cardY2 = useTransform(p, [0, 1], [40 * s, -40 * s]);
    const cardY3 = useTransform(p, [0, 1], [16 * s, -16 * s]);
    const cardYs = [cardY0, cardY1, cardY2, cardY3];
    const ringX = useTransform(mx, [-0.5, 0.5], [30, -30]);
    const ringY = useTransform(p, [0, 1], [60, -60]);
    const starY = useTransform(p, [0, 1], [-60, 60]);
    const starX = useTransform(mx, [-0.5, 0.5], [-22, 22]);
    const plusY = useTransform(p, [0, 1], [50, -50]);

    return (
        <section
            ref={sectionRef}
            id="about-mission"
            className="relative overflow-hidden bg-[color:var(--tone-soft)] py-24 text-white lg:py-32"
        >
            {/* ===== background decoration ===== */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                <div className="absolute -top-24 left-1/4 h-80 w-80 rounded-full bg-[#F8921C]/[0.06] blur-3xl" />
                <div className="absolute -bottom-24 right-1/4 h-72 w-72 rounded-full bg-[#F8921C]/[0.05] blur-3xl" />
                <EdgeDots />
                <motion.div
                    style={reduce ? undefined : { x: ringX, y: ringY }}
                    className="absolute -left-[16rem] bottom-[2%] hidden sm:block"
                >
                    <div className="relative aspect-square w-[30rem]">
                        <OrbitRing dashed className="absolute inset-0 border-white/[0.10]" />
                        <OrbitRing reverse dot="bottom" className="absolute inset-[16%] border-white/[0.07]" />
                    </div>
                </motion.div>
                <motion.div style={reduce ? undefined : { x: starX, y: starY }} className="absolute right-[7%] top-[8%] hidden md:block">
                    <Star4 size={36} filled className="decor-float text-[#F8921C]" style={{ animationDuration: "10s" }} />
                </motion.div>
                <motion.div style={reduce ? undefined : { y: plusY }} className="absolute left-[46%] top-[14%] hidden text-[#F8921C]/60 lg:block">
                    <Plus size={18} />
                </motion.div>
            </div>

            <div className="container relative z-10 mx-auto px-6 lg:px-10">
                <div className="grid items-center gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
                    {/* ===== left: label, heading, paragraph ===== */}
                    <motion.div style={reduce ? undefined : { y: headY }}>
                        <motion.div {...reveal(0)} className="mb-7">
                            <BracketLabel bn={bn} size="lg">{isBn ? "মিশন" : "Our mission"}</BracketLabel>
                        </motion.div>
                        <motion.h2
                            {...reveal(1)}
                            style={{ color: "#fff" }}
                            className={`text-[1.7rem] font-bold leading-[1.25] sm:text-3xl lg:text-[2.35rem] ${bn}`}
                        >
                            {isBn ? (
                                <>আগামী প্রজন্মের ডিজিটাল <i className="font-light">লিডারদের ক্ষমতায়ন।</i></>
                            ) : (
                                <>Empowering Next-Gen <i className="font-light">Digital Leaders.</i></>
                            )}
                        </motion.h2>
                        <motion.p
                            {...reveal(2)}
                            className={`mt-5 max-w-lg text-sm leading-7 text-white/60 sm:text-base ${bn}`}
                        >
                            {isBn
                                ? "আমরা এমন একটি বিশ্বে বিশ্বাস করি যেখানে প্রযুক্তি সহজলভ্য, সুন্দর ও কার্যকর। আধুনিক অর্থনীতিতে আপনার সাফল্যের জন্য সর্বোচ্চ মানের ডিজিটাল অ্যাসেট ও শিক্ষা দেওয়াই আমাদের লক্ষ্য।"
                                : "We believe in a world where technology is accessible, beautiful, and functional. Our mission is to provide the highest quality digital assets and education to help you succeed in the modern economy."}
                        </motion.p>
                    </motion.div>

                    {/* ===== right: four value cards ===== */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:gap-5">
                        {VALUES.map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <motion.div key={item.title} style={reduce ? undefined : { y: cardYs[i] }} className="h-full">
                                    <motion.div {...reveal(i)} className="h-full">
                                        {/* leans toward the mouse + a light follows the pointer */}
                                        <TiltCard className="h-full" radius="1rem">
                                            <div className="group relative flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#F8921C]/60 hover:bg-white/[0.05] hover:shadow-[0_24px_50px_-28px_rgba(248,146,28,0.55)]">
                                                <span className="flex items-start justify-between">
                                                    <span className="grid h-14 w-14 place-items-center rounded-xl bg-[#F8921C]/10 text-[#F8921C] transition-colors duration-300 group-hover:bg-[#F8921C] group-hover:text-black">
                                                        <Icon size={26} />
                                                    </span>
                                                    <span className="text-sm font-bold tabular-nums text-white/25 transition-colors group-hover:text-[#F8921C]">
                                                        0{i + 1}
                                                    </span>
                                                </span>
                                                <h3 style={{ color: "#fff" }} className={`mt-5 text-[17px] font-semibold leading-snug ${bn}`}>
                                                    {isBn ? item.titleBn : item.title}
                                                </h3>
                                                <p className={`mt-2 text-[13px] leading-6 text-white/60 ${bn}`}>
                                                    {isBn ? item.descBn : item.desc}
                                                </p>
                                                <span className="mt-5 block h-[3px] w-10 rounded-full bg-[#F8921C] transition-all duration-500 group-hover:w-24" />
                                            </div>
                                        </TiltCard>
                                    </motion.div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MissionSection;
