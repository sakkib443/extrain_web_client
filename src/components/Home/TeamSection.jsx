"use client";

import React from "react";
import { motion, useTransform } from "framer-motion";
import { LuMail, LuLinkedin } from "react-icons/lu";
import { FaFacebookF } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";
import useSectionMotion from "@/hooks/useSectionMotion";
import BracketLabel from "./BracketLabel";
import TiltCard from "./TiltCard";
import { Star4, EdgeDots, OrbitRing } from "./Decor";
import { TEAM } from "@/data/team";

const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    show: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.65, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
    }),
};
const viewport = { once: true, amount: 0.2 };

const initials = (name) => name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

const TeamSection = () => {
    const { language } = useLanguage();
    const isBn = language === "bn";
    const bn = isBn ? "hind-siliguri" : "";

    // ---- smooth scroll + mouse motion (same feel as the other home sections) ----
    const { ref: sectionRef, p, mx, reduce, isLg } = useSectionMotion();
    const s = isLg ? 1 : 0; // card-to-card offsets only where the four cards sit side by side
    const headY = useTransform(p, [0, 1], [20 * s, -20 * s]);
    const cardY0 = useTransform(p, [0, 1], [30 * s, -30 * s]);
    const cardY1 = useTransform(p, [0, 1], [10 * s, -10 * s]);
    const cardY2 = useTransform(p, [0, 1], [44 * s, -44 * s]);
    const cardY3 = useTransform(p, [0, 1], [18 * s, -18 * s]);
    const cardYs = [cardY0, cardY1, cardY2, cardY3];
    const ringX = useTransform(mx, [-0.5, 0.5], [30, -30]);
    const ringY = useTransform(p, [0, 1], [60, -60]);
    const starY = useTransform(p, [0, 1], [-60, 60]);
    const starX = useTransform(mx, [-0.5, 0.5], [-22, 22]);

    return (
        <section
            ref={sectionRef}
            id="team"
            className="relative overflow-hidden bg-[color:var(--tone-soft)] py-24 text-white lg:py-32"
        >
            {/* ===== background decoration ===== */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                <div className="absolute -bottom-24 right-1/4 h-80 w-80 rounded-full bg-[#F8921C]/[0.06] blur-3xl" />
                <EdgeDots />
                <motion.div
                    style={reduce ? undefined : { x: ringX, y: ringY }}
                    className="absolute -left-[14rem] top-[8%] hidden sm:block"
                >
                    <div className="relative aspect-square w-[30rem]">
                        <OrbitRing dashed className="absolute inset-0 border-white/[0.10]" />
                        <OrbitRing reverse dot="bottom" className="absolute inset-[16%] border-white/[0.07]" />
                    </div>
                </motion.div>
                <motion.div style={reduce ? undefined : { x: starX, y: starY }} className="absolute right-[10%] top-[10%] hidden md:block">
                    <Star4 size={40} filled className="decor-float text-[#F8921C]" style={{ animationDuration: "10s" }} />
                </motion.div>
            </div>

            <div className="container relative z-10 mx-auto px-6 lg:px-10">
                {/* ===== heading ===== */}
                <motion.div style={reduce ? undefined : { y: headY }} className="mx-auto max-w-2xl text-center">
                    <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewport} className="mb-7">
                        <BracketLabel bn={bn} size="lg">{isBn ? "আমাদের টিম" : "Our team"}</BracketLabel>
                    </motion.div>
                    <motion.h2
                        variants={fadeUp}
                        custom={1}
                        initial="hidden"
                        whileInView="show"
                        viewport={viewport}
                        style={{ color: "#fff" }}
                        className={`text-[1.7rem] font-bold leading-[1.25] sm:text-3xl lg:text-[2.35rem] ${bn}`}
                    >
                        {isBn ? (
                            <>আমাদের মেম্বারদের <i className="font-light">সাথে পরিচিত হোন</i></>
                        ) : (
                            <>Meet Our <i className="font-light">Members</i></>
                        )}
                    </motion.h2>
                    <motion.p
                        variants={fadeUp}
                        custom={2}
                        initial="hidden"
                        whileInView="show"
                        viewport={viewport}
                        className={`mt-4 text-sm leading-7 text-white/60 sm:text-base ${bn}`}
                    >
                        {isBn
                            ? "যারা প্রতিদিন আপনার ব্যবসাকে অনলাইনে এগিয়ে নিতে কাজ করছেন।"
                            : "The people who work every day to move your business forward online."}
                    </motion.p>
                </motion.div>

                {/* ===== member cards ===== */}
                <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
                    {TEAM.map((m, i) => {
                        const links = [
                            m.linkedin && { label: "LinkedIn", icon: LuLinkedin, href: m.linkedin },
                            m.facebook && { label: "Facebook", icon: FaFacebookF, href: m.facebook },
                            m.email && { label: "Email", icon: LuMail, href: `mailto:${m.email}` },
                        ].filter(Boolean);

                        return (
                            <motion.div key={m.id} style={reduce ? undefined : { y: cardYs[i % cardYs.length] }} className="h-full">
                                <motion.div
                                    variants={fadeUp}
                                    custom={i}
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={viewport}
                                    className="h-full"
                                >
                                    {/* leans toward the mouse + a light follows the pointer */}
                                    <TiltCard className="h-full" radius="1.25rem">
                                        <div className="group flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-white/10 bg-white/[0.03] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#F8921C]/60 hover:shadow-[0_24px_50px_-28px_rgba(248,146,28,0.55)]">
                                            <div className="relative aspect-[4/4.3] overflow-hidden bg-[color:var(--tone-deep)]">
                                                {m.photo ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img
                                                        src={m.photo}
                                                        alt={m.name}
                                                        loading="lazy"
                                                        style={{ objectPosition: m.pos || "50% 20%" }}
                                                        className="h-full w-full object-cover grayscale-[30%] transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                                                    />
                                                ) : (
                                                    <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[#F8921C]/15 to-transparent">
                                                        <span className="grid h-24 w-24 place-items-center rounded-full border border-[#F8921C]/40 bg-[#F8921C]/10 text-3xl font-bold text-[#F8921C]">
                                                            {initials(m.name)}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                                <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 text-[11px] font-bold tabular-nums text-[#F8921C] backdrop-blur-md">
                                                    0{i + 1}
                                                </span>
                                            </div>

                                            <div className="flex flex-1 flex-col p-5">
                                                <h3 style={{ color: "#fff" }} className="text-lg font-semibold leading-snug">
                                                    {m.name}
                                                </h3>
                                                <p className={`mt-1 text-[13px] font-medium leading-snug text-[#F8921C] ${bn}`}>
                                                    {isBn ? m.roleBn : m.role}
                                                </p>
                                                <span className="mt-4 block h-[3px] w-10 rounded-full bg-[#F8921C] transition-all duration-500 group-hover:w-24" />

                                                {links.length > 0 && (
                                                    <div className="mt-auto flex gap-2 pt-5">
                                                        {links.map(({ label, icon: Icon, href }) => (
                                                            <a
                                                                key={label}
                                                                href={href}
                                                                target={href.startsWith("mailto:") ? undefined : "_blank"}
                                                                rel="noopener noreferrer"
                                                                aria-label={`${m.name} on ${label}`}
                                                                className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-[#F8921C] hover:bg-[#F8921C] hover:text-black"
                                                            >
                                                                <Icon size={15} />
                                                            </a>
                                                        ))}
                                                    </div>
                                                )}
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

export default TeamSection;
