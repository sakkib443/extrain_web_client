"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import { LuArrowUpRight, LuMegaphone, LuCamera, LuCode, LuZap, LuBadgeCheck } from "react-icons/lu";
import { useLanguage } from "@/context/LanguageContext";
import useSectionMotion from "@/hooks/useSectionMotion";
import BracketLabel from "./BracketLabel";
import { Star4, EdgeDots } from "./Decor";
import SolarSystem from "./SolarSystem";

// Order on screen: left · centre (featured, bigger) · right.
const services = [
    {
        id: "marketing",
        icon: LuMegaphone,
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1000&q=80",
        badge: "Marketing",
        badgeBn: "মার্কেটিং",
        title: "Digital Marketing",
        titleBn: "ডিজিটাল মার্কেটিং",
        meta: [
            { icon: LuZap, text: "SEO · Social media", textBn: "SEO · সোশ্যাল মিডিয়া" },
            { icon: LuBadgeCheck, text: "Paid campaigns", textBn: "পেইড ক্যাম্পেইন" },
        ],
        pill: "Growth & Ads",
        pillBn: "গ্রোথ ও অ্যাড",
        href: "/contact",
    },
    {
        id: "web",
        icon: LuCode,
        // a person working at a monitor with a full website open on it (Unsplash, by Campaign Creators)
        image: "https://images.unsplash.com/photo-1542744095-70fccefd4b65?w=1400&q=80",
        pos: "50% 45%",
        badge: "Web",
        badgeBn: "ওয়েব",
        title: "Web Design & Development",
        titleBn: "ওয়েব ডিজাইন ও ডেভেলপমেন্ট",
        meta: [
            { icon: LuZap, text: "Next.js · Node.js · Laravel", textBn: "Next.js · Node.js · Laravel" },
            { icon: LuBadgeCheck, text: "Lifetime support", textBn: "আজীবন সাপোর্ট" },
        ],
        pill: "Business & E-commerce",
        pillBn: "বিজনেস ও ই-কমার্স",
        href: "/website",
        featured: true,
    },
    {
        id: "media",
        icon: LuCamera,
        image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1000&q=80",
        badge: "Media",
        badgeBn: "মিডিয়া",
        title: "Content & Media",
        titleBn: "কন্টেন্ট ও মিডিয়া",
        meta: [
            { icon: LuZap, text: "Photo & Video", textBn: "ফটো ও ভিডিও" },
            { icon: LuBadgeCheck, text: "Graphics & Copy", textBn: "গ্রাফিক্স ও কপি" },
        ],
        pill: "Branding & Media",
        pillBn: "ব্র্যান্ডিং ও মিডিয়া",
        href: "/contact",
    },
];

const SPRING = { stiffness: 140, damping: 18, mass: 0.5 };

// One service card. Three layers of motion, each on its own element so they never fight:
//   outer  → scroll parallax (lg only)      middle → entrance reveal      inner → hover tilt + glare
function ServiceCard({ s, index, isBn, bn, reduce, parallaxY }) {
    const Icon = s.icon;
    const featured = !!s.featured;

    // hover tilt: pointer position inside the card, 0..1
    const mx = useMotionValue(0.5);
    const my = useMotionValue(0.5);
    const rotateX = useSpring(useTransform(my, [0, 1], [6, -6]), SPRING);
    const rotateY = useSpring(useTransform(mx, [0, 1], [-8, 8]), SPRING);
    const gx = useTransform(mx, [0, 1], [0, 100]);
    const gy = useTransform(my, [0, 1], [0, 100]);
    const glare = useMotionTemplate`radial-gradient(420px circle at ${gx}% ${gy}%, rgba(255,255,255,0.22), transparent 55%)`;

    const onMove = (e) => {
        if (reduce) return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
    };
    const onLeave = () => {
        mx.set(0.5);
        my.set(0.5);
    };

    // large screens: image heights follow the screen height, so the whole section fits one screen
    const imgH = featured
        ? "h-[300px] sm:h-[380px] lg:h-[clamp(14rem,40vh,27rem)]"
        : "h-[280px] sm:h-[325px] lg:h-[clamp(11rem,31vh,21.7rem)]";

    return (
        <motion.div style={reduce || !parallaxY ? undefined : { y: parallaxY }}>
            {/* the only element that watches the viewport; the image reveal below follows it via variants.
                (A fully clipped element is never reported as "in view", so it can't trigger itself.) */}
            <motion.div
                variants={{
                    hidden: { opacity: 0, y: 60, scale: 0.94 },
                    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.85, delay: index * 0.14, ease: [0.16, 1, 0.3, 1] } },
                }}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.15 }}
            >
                <motion.div
                    onMouseMove={onMove}
                    onMouseLeave={onLeave}
                    style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 1100 }}
                    className="group relative"
                >
                    <Link
                        href={s.href}
                        className="block rounded-[2rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F8921C]"
                    >
                        {/* image block */}
                        <div className="relative">
                            <motion.div
                                variants={{
                                    hidden: { clipPath: "inset(100% 0% 0% 0% round 2rem)" },
                                    show: {
                                        clipPath: "inset(0% 0% 0% 0% round 2rem)",
                                        transition: { duration: 1.1, delay: index * 0.14 + 0.1, ease: [0.16, 1, 0.3, 1] },
                                    },
                                }}
                                className={`relative overflow-hidden rounded-[2rem] bg-[#141414] ${imgH}`}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={s.image}
                                    alt={s.title}
                                    loading="lazy"
                                    decoding="async"
                                    style={{ objectPosition: s.pos || "50% 50%" }}
                                    className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.12]"
                                />
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />

                                {/* light that follows the pointer */}
                                <motion.div
                                    style={{ background: glare }}
                                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                />
                                {/* orange wave spreading from the arrow button */}
                                <span className="pointer-events-none absolute -bottom-6 -right-6 h-12 w-12 scale-0 rounded-full bg-[#F8921C]/35 transition-transform duration-[900ms] ease-out group-hover:scale-[32]" />

                                {/* badge */}
                                <div className="absolute left-4 top-4 z-10 transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-105">
                                    <div className="w-[72px] overflow-hidden rounded-2xl bg-white text-center shadow-lg">
                                        <span className="mx-auto mt-3 block w-fit text-black">
                                            <Icon size={28} />
                                        </span>
                                        <span className={`mt-2 block bg-[#F8921C] py-1 text-[10px] font-bold uppercase text-black ${bn ? "tracking-normal" : "tracking-wide"} ${bn}`}>
                                            {isBn ? s.badgeBn : s.badge}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* round arrow — outside the clipped image so it can overhang its edge */}
                            <span
                                className={`absolute -bottom-7 right-6 z-20 grid place-items-center rounded-full bg-[#F8921C] text-black shadow-[0_14px_30px_-10px_rgba(248,146,28,0.8)] transition-all duration-500 ease-out group-hover:rotate-45 ${featured ? "h-16 w-16 group-hover:scale-110" : "h-14 w-14 scale-0 group-hover:scale-100"}`}
                            >
                                <LuArrowUpRight size={featured ? 30 : 26} />
                            </span>
                        </div>

                        {/* text */}
                        <div className="px-1 pt-6">
                            <div className={`flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-white/65 ${bn}`}>
                                {s.meta.map(({ icon: MIcon, text, textBn }) => (
                                    <span key={text} className="inline-flex items-center gap-1.5">
                                        <MIcon size={14} className="text-[#F8921C]" />
                                        {isBn ? textBn : text}
                                    </span>
                                ))}
                            </div>

                            <h3
                                style={{ color: "#fff" }}
                                className={`mt-3 font-semibold leading-snug ${featured ? "text-[1.6rem]" : "text-[1.3rem]"} ${bn}`}
                            >
                                <span className="bg-gradient-to-r from-[#F8921C] to-[#F8921C] bg-[length:0%_2px] bg-bottom bg-no-repeat pb-1 transition-[background-size] duration-500 [box-decoration-break:clone] group-hover:bg-[length:100%_2px]">
                                    {isBn ? s.titleBn : s.title}
                                </span>
                            </h3>

                            <span
                                className={`mt-4 inline-block rounded-full border border-white/25 px-4 py-2 text-[11px] font-semibold uppercase text-white transition-colors duration-300 group-hover:border-[#F8921C] group-hover:bg-[#F8921C] group-hover:text-black ${bn ? "tracking-normal" : "tracking-wide"} ${bn}`}
                            >
                                {isBn ? s.pillBn : s.pill}
                            </span>
                        </div>
                    </Link>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}

const HomeCategory = () => {
    const { language } = useLanguage();
    const isBn = language === "bn";
    const bn = isBn ? "hind-siliguri" : "";
    const { ref: sectionRef, p, mx, my, reduce } = useSectionMotion();

    // scroll parallax only where the three cards sit side by side
    const [isLg, setIsLg] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia("(min-width: 1024px)");
        const apply = () => setIsLg(mq.matches);
        apply();
        mq.addEventListener("change", apply);
        return () => mq.removeEventListener("change", apply);
    }, []);

    // zero at mid-scroll → the three cards line up when the section is centred; they fan in/out around it
    const yLeft = useTransform(p, [0, 1], [60, -60]);
    const yMid = useTransform(p, [0, 1], [20, -20]);
    const yRight = useTransform(p, [0, 1], [95, -95]);
    const ys = [yLeft, yMid, yRight];

    // background decorations: they drift with the scroll and lean away from the mouse (different depths)
    const starAY = useTransform(p, [0, 1], [-80, 80]);
    const starAX = useTransform(mx, [-0.5, 0.5], [-28, 28]);
    const starBY = useTransform(p, [0, 1], [110, -110]);
    const starBX = useTransform(mx, [-0.5, 0.5], [36, -36]);
    const starCY = useTransform(p, [0, 1], [-50, 50]);
    const starCX = useTransform(my, [-0.5, 0.5], [-18, 18]);

    const fadeUp = {
        hidden: { opacity: 0, y: 28 },
        show: (i = 0) => ({
            opacity: 1,
            y: 0,
            transition: { duration: 0.65, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
        }),
    };

    return (
        <section
            ref={sectionRef}
            id="services"
            // Large screens: the whole section fits in one screen (minus the 65px sticky header) with the content
            // centred, so the leftover height is even empty space above and below. Gaps scale with the screen height.
            className="relative overflow-hidden bg-[color:var(--tone-soft)] py-24 text-white lg:flex lg:min-h-[min(calc(100svh-65px),880px)] lg:flex-col lg:justify-center lg:py-[clamp(2rem,6vh,5rem)]"
        >
            {/* ===== background decoration ===== */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                <div className="absolute left-[8%] top-16 h-72 w-72 rounded-full bg-[#F8921C]/[0.06] blur-3xl" />
                <div className="absolute bottom-16 right-[8%] h-80 w-80 rounded-full bg-[#F8921C]/[0.05] blur-3xl" />

                {/* dots, only toward the edges */}
                <EdgeDots />

                {/* 3D solar system behind the cards: it leans with the mouse and turns with the scroll */}
                <SolarSystem p={p} mx={mx} my={my} reduce={reduce} />

                {/* sparkles: a solid orange one and a small one */}
                <motion.div
                    style={reduce ? undefined : { x: starBX, y: starBY }}
                    className="absolute bottom-[12%] left-[6%] hidden md:block"
                >
                    <Star4 size={50} filled className="decor-float text-[#F8921C]" style={{ animationDuration: "12s" }} />
                </motion.div>
                <motion.div
                    style={reduce ? undefined : { x: starCX, y: starCY }}
                    className="absolute left-[15%] top-[19%] hidden md:block"
                >
                    <Star4 size={28} className="decor-float text-[#F8921C]/80" style={{ animationDuration: "7s" }} />
                </motion.div>
            </div>

            <div className="container relative z-10 mx-auto px-6 lg:px-10">
                {/* centred header */}
                <div className="mb-14 flex flex-col items-center text-center lg:mb-[clamp(1.25rem,3.6vh,3.25rem)]">
                    <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
                        <BracketLabel bn={bn}>{isBn ? "আমাদের সার্ভিস" : "Our services"}</BracketLabel>
                    </motion.div>
                    <motion.h2
                        variants={fadeUp}
                        custom={1}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.3 }}
                        style={{ color: "#fff" }}
                        className={`mt-6 max-w-2xl text-3xl font-bold leading-[1.2] sm:text-4xl lg:mt-[clamp(0.75rem,2vh,1.5rem)] lg:text-[clamp(1.9rem,4.6vh,2.6rem)] ${bn}`}
                    >
                        {isBn ? (
                            <>
                                আপনার <i className="font-light">ডিজিটাল গ্রোথের</i> সার্ভিস
                            </>
                        ) : (
                            <>
                                Services That Power Your <i className="font-light">Digital Growth</i>
                            </>
                        )}
                    </motion.h2>
                </div>

                {/* three cards: side · featured · side */}
                <div className="grid items-start gap-x-6 gap-y-14 lg:grid-cols-[1fr_1.85fr_1fr]">
                    {services.map((s, i) => (
                        <ServiceCard
                            key={s.id}
                            s={s}
                            index={i}
                            isBn={isBn}
                            bn={bn}
                            reduce={reduce}
                            parallaxY={isLg ? ys[i] : undefined}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HomeCategory;
