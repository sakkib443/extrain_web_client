"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useTransform } from "framer-motion";
import { LuQuote, LuChevronLeft, LuChevronRight, LuMoveRight, LuArrowUpRight } from "react-icons/lu";
import { useLanguage } from "@/context/LanguageContext";
import useSectionMotion from "@/hooks/useSectionMotion";
import BracketLabel from "./BracketLabel";
import TiltCard from "./TiltCard";
import { Star4, Plus, EdgeDots, OrbitRing } from "./Decor";

const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    show: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.65, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
    }),
};
const viewport = { once: true, amount: 0.2 };

// `highlight` / `highlightBn` must be an exact piece of `content` / `contentBn` — it gets marked in the quote.
const TESTIMONIALS = [
    {
        name: "Ahsanullah Shaon",
        nameBn: "আহসানউল্লাহ শাওন",
        role: "Founder & CEO",
        roleBn: "ফাউন্ডার ও সিইও",
        image: "/images/Testimonial/ahsanullah-shaon.webp",
        content: "Extrain Web built our e-commerce platform exactly the way we wanted. Mobile-friendly, super fast, and the admin panel is so easy that our staff manages everything without any coding. Sales went up within weeks of going live.",
        contentBn: "এক্সট্রেন ওয়েব আমাদের ই-কমার্স প্ল্যাটফর্মটা ঠিক যেভাবে চেয়েছিলাম সেভাবেই বানিয়ে দিয়েছে। মোবাইল ফ্রেন্ডলি, খুব দ্রুত, আর অ্যাডমিন প্যানেল এত সহজ যে আমাদের স্টাফরা কোডিং ছাড়াই সব ম্যানেজ করে। লাইভ হওয়ার কয়েক সপ্তাহেই বিক্রি বেড়ে গেছে।",
        highlight: "Sales went up within weeks of going live",
        highlightBn: "লাইভ হওয়ার কয়েক সপ্তাহেই বিক্রি বেড়ে গেছে",
        company: "Shaon Mart BD",
        companyBn: "শাওন মার্ট বিডি",
    },
    {
        name: "Afsana Mimi",
        nameBn: "আফসানা মিমি",
        role: "Brand Owner",
        roleBn: "ব্র্যান্ড ওনার",
        image: "/images/Testimonial/afsana-mimi.webp",
        content: "I needed a stylish online store for my fashion brand and Extrain Web delivered beyond my expectations. The design is premium, the checkout flow is smooth with bKash and Nagad, and customer support is always on point. Couldn't be happier.",
        contentBn: "আমার ফ্যাশন ব্র্যান্ডের জন্য সুন্দর একটা অনলাইন স্টোর দরকার ছিল, এক্সট্রেন ওয়েব আমার প্রত্যাশার চেয়েও বেশি দিয়েছে। ডিজাইন প্রিমিয়াম, বিকাশ-নগদে চেকআউট ফ্লো খুব মসৃণ, আর কাস্টমার সাপোর্ট সবসময় চমৎকার। একদম খুশি আমি।",
        highlight: "delivered beyond my expectations",
        highlightBn: "আমার প্রত্যাশার চেয়েও বেশি দিয়েছে",
        company: "Mimi's Closet",
        companyBn: "মিমি'স ক্লোজেট",
    },
    {
        name: "Zayed Uddin",
        nameBn: "যায়েদ উদ্দিন",
        role: "Startup Founder",
        roleBn: "স্টার্টআপ ফাউন্ডার",
        image: "/images/Testimonial/zayed-uddin.webp",
        content: "Professional team with great attention to detail. They built our SaaS dashboard with Next.js and the performance is impressive — fast loading, secure, and rock solid on mobile. Will definitely come back for our next project.",
        contentBn: "প্রফেশনাল টিম, প্রতিটা ডিটেইলে নজর। আমাদের SaaS ড্যাশবোর্ডটা Next.js দিয়ে বানিয়েছে, পারফরম্যান্স অসাধারণ — দ্রুত লোড, নিরাপদ, আর মোবাইলেও একদম স্মুথ। পরের প্রোজেক্টের জন্য অবশ্যই আবার আসব।",
        highlight: "the performance is impressive",
        highlightBn: "পারফরম্যান্স অসাধারণ",
        company: "Zayed Tech",
        companyBn: "যায়েদ টেক",
    },
];

const AUTOPLAY_SECONDS = 9; // slow on purpose; it stops for good as soon as the visitor picks one themselves

const Stars = ({ className = "h-4 w-4" }) => (
    <div className="flex gap-1" aria-label="5 out of 5 stars" role="img">
        {[...Array(5)].map((_, k) => (
            <svg key={k} className={`${className} text-[#F8921C]`} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ))}
    </div>
);

// the quote with its key phrase marked like a highlighter pen
const renderQuote = (text, phrase) => {
    const i = phrase ? text.indexOf(phrase) : -1;
    if (i < 0) return text;
    return (
        <>
            {text.slice(0, i)}
            <mark className="rounded-sm bg-transparent px-0.5 font-semibold text-white [box-shadow:inset_0_-0.45em_0_rgba(248,146,28,0.38)]">
                {phrase}
            </mark>
            {text.slice(i + phrase.length)}
        </>
    );
};

const TestimonialSection = () => {
    const { language } = useLanguage();
    const isBn = language === "bn";
    const bn = isBn ? "hind-siliguri" : "";

    // ---- smooth scroll + mouse motion (same feel as the other home sections) ----
    const { ref: sectionRef, p, mx, my, reduce, isLg } = useSectionMotion();
    const s = isLg ? 1 : 0;
    const headY = useTransform(p, [0, 1], [18 * s, -18 * s]);
    const cardY = useTransform(p, [0, 1], [34 * s, -34 * s]);
    const ringX = useTransform(mx, [-0.5, 0.5], [-28, 28]);
    const ringY = useTransform(p, [0, 1], [60, -60]);
    const quoteX = useTransform(mx, [-0.5, 0.5], [22, -22]);
    const quoteY = useTransform([p, my], ([pv, mv]) => (0.5 - pv) * 2 * 36 + mv * -16);
    const starY = useTransform(p, [0, 1], [-60, 60]);
    const starX = useTransform(mx, [-0.5, 0.5], [22, -22]);
    const plusY = useTransform(p, [0, 1], [44, -44]);

    // ---- which testimonial is in the spotlight ----
    const total = TESTIMONIALS.length;
    const [active, setActive] = useState(0);
    const [picked, setPicked] = useState(false); // true once the visitor chose one → autoplay stays off
    const [paused, setPaused] = useState(false);
    const autoplay = !picked && !reduce;

    const choose = (i) => { setPicked(true); setActive(i); };
    const go = (dir) => choose((active + dir + total) % total);
    const advance = () => setActive((i) => (i + 1) % total); // called when the progress bar of the active tab runs out

    const t = TESTIMONIALS[active];
    const text = isBn ? t.contentBn : t.content;
    const phrase = isBn ? t.highlightBn : t.highlight;

    const navBtn = "grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/[0.03] text-white/70 transition-all hover:border-[#F8921C] hover:bg-[#F8921C] hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F8921C]";

    return (
        <section
            ref={sectionRef}
            id="testimonials"
            className="relative overflow-hidden bg-[color:var(--tone-soft)] py-24 text-white lg:py-32"
        >
            {/* ===== background decoration ===== */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                <div className="absolute -top-24 left-1/4 h-80 w-80 rounded-full bg-[#F8921C]/[0.06] blur-3xl" />
                <div className="absolute -bottom-28 right-1/4 h-72 w-72 rounded-full bg-[#F8921C]/[0.05] blur-3xl" />
                <EdgeDots />
                <motion.div style={reduce ? undefined : { x: ringX, y: ringY }} className="absolute -right-[14rem] top-[6%] hidden sm:block">
                    <div className="relative aspect-square w-[30rem]">
                        <OrbitRing dashed className="absolute inset-0 border-white/[0.10]" />
                        <OrbitRing reverse dot="bottom" className="absolute inset-[16%] border-[#F8921C]/20" />
                    </div>
                </motion.div>
                <motion.div style={reduce ? undefined : { x: quoteX, y: quoteY }} className="absolute -left-10 top-[3%] hidden text-white/[0.04] md:block">
                    <LuQuote size={240} strokeWidth={1.2} />
                </motion.div>
                <motion.div style={reduce ? undefined : { x: starX, y: starY }} className="absolute right-[12%] top-[8%] hidden md:block">
                    <Star4 size={36} filled className="decor-float text-[#F8921C]" style={{ animationDuration: "10s" }} />
                </motion.div>
                <motion.div style={reduce ? undefined : { y: plusY }} className="absolute bottom-[8%] left-[9%] hidden md:block">
                    <Plus size={22} className="text-white/25" />
                </motion.div>
            </div>

            <div
                className="container relative z-10 mx-auto px-6 lg:px-10"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
                onFocus={() => setPaused(true)}
                onBlur={() => setPaused(false)}
            >
                <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">

                    {/* ---------- left: heading, rating, who is speaking ---------- */}
                    <motion.div style={reduce ? undefined : { y: headY }}>
                        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewport} className="mb-7">
                            <BracketLabel bn={bn} size="lg">{isBn ? "গ্রাহকদের মতামত" : "Client Feedback"}</BracketLabel>
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
                                <>আস্থা রাখছে <i className="font-light">শত শত ব্যবসা</i></>
                            ) : (
                                <>Trusted by <i className="font-light">Businesses Worldwide</i></>
                            )}
                        </motion.h2>
                        <motion.p
                            variants={fadeUp}
                            custom={2}
                            initial="hidden"
                            whileInView="show"
                            viewport={viewport}
                            className={`mt-4 max-w-md text-sm leading-7 text-white/60 sm:text-base ${bn}`}
                        >
                            {isBn
                                ? "আমাদের প্রিমিয়াম স্ক্রিপ্ট ও কাস্টম ওয়েব সমাধান কীভাবে ব্যবসা বাড়াতে সাহায্য করছে দেখুন।"
                                : "See how our premium scripts and custom web solutions are helping businesses grow."}
                        </motion.p>

                        {/* rating summary */}
                        <motion.div
                            variants={fadeUp}
                            custom={3}
                            initial="hidden"
                            whileInView="show"
                            viewport={viewport}
                            className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex -space-x-2.5">
                                    {TESTIMONIALS.map((x) => (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            key={x.name}
                                            src={x.image}
                                            alt=""
                                            className="h-10 w-10 rounded-full border-2 border-[color:var(--tone-soft)] object-cover"
                                        />
                                    ))}
                                </div>
                                <div className={`leading-tight ${bn}`}>
                                    <Stars className="h-3.5 w-3.5" />
                                    <p className="mt-1 text-xs text-white/60">
                                        <b className="font-bold text-white">300+</b> {isBn ? "সন্তুষ্ট ক্লায়েন্ট" : "happy clients"}
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* who is speaking — pick one (also a tab list for keyboard / screen reader users) */}
                        <motion.div
                            variants={fadeUp}
                            custom={4}
                            initial="hidden"
                            whileInView="show"
                            viewport={viewport}
                            role="tablist"
                            aria-label={isBn ? "ক্লায়েন্ট বেছে নিন" : "Choose a client"}
                            className="mt-8 flex flex-col gap-3"
                        >
                            {TESTIMONIALS.map((x, i) => {
                                const on = i === active;
                                return (
                                    <button
                                        key={x.name}
                                        type="button"
                                        role="tab"
                                        id={`tm-tab-${i}`}
                                        aria-selected={on}
                                        aria-controls="tm-panel"
                                        onClick={() => choose(i)}
                                        className={`group relative flex items-center gap-4 overflow-hidden rounded-2xl border px-4 py-3.5 text-left transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F8921C] ${
                                            on
                                                ? "border-[#F8921C]/60 bg-white/[0.06]"
                                                : "border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04]"
                                        }`}
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={x.image}
                                            alt=""
                                            className={`h-12 w-12 shrink-0 rounded-full object-cover ring-2 transition-all duration-300 ${on ? "ring-[#F8921C]" : "ring-white/10 grayscale-[40%] group-hover:grayscale-0"}`}
                                        />
                                        <span className="min-w-0 flex-1">
                                            <span className={`block truncate text-[15px] font-semibold ${on ? "text-white" : "text-white/80"} ${bn}`}>
                                                {isBn ? x.nameBn : x.name}
                                            </span>
                                            <span className={`block truncate text-xs ${on ? "text-[#F8921C]" : "text-white/50"} ${bn}`}>
                                                {isBn ? `${x.roleBn} @ ${x.companyBn}` : `${x.role} @ ${x.company}`}
                                            </span>
                                        </span>
                                        <span className="text-xs font-bold tabular-nums text-white/25 transition-colors group-hover:text-[#F8921C]">
                                            0{i + 1}
                                        </span>

                                        {/* progress of the automatic change (static full bar once the visitor chose / reduced motion) */}
                                        {on && (
                                            <span className="absolute inset-x-0 bottom-0 h-[3px] bg-white/10">
                                                {autoplay ? (
                                                    <span
                                                        key={active}
                                                        className="tm-progress block h-full origin-left bg-[#F8921C]"
                                                        style={{ animationDuration: `${AUTOPLAY_SECONDS}s`, animationPlayState: paused ? "paused" : "running" }}
                                                        onAnimationEnd={advance}
                                                    />
                                                ) : (
                                                    <span className="block h-full bg-[#F8921C]" />
                                                )}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </motion.div>
                    </motion.div>

                    {/* ---------- right: the spotlight quote ---------- */}
                    <motion.div style={reduce ? undefined : { y: cardY }}>
                        <motion.div variants={fadeUp} custom={2} initial="hidden" whileInView="show" viewport={viewport}>
                            <TiltCard radius="1.75rem" max={3}>
                                <div
                                    id="tm-panel"
                                    role="tabpanel"
                                    aria-labelledby={`tm-tab-${active}`}
                                    className="relative flex min-h-[27rem] flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-7 sm:min-h-[25rem] sm:p-10 lg:p-12"
                                >
                                    <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#F8921C] via-[#F8921C]/50 to-transparent" />
                                    <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#F8921C]/[0.10] blur-3xl" />
                                    <LuQuote size={64} strokeWidth={1.4} className="pointer-events-none absolute right-7 top-7 text-white/[0.09] sm:right-10 sm:top-9" aria-hidden="true" />

                                    <AnimatePresence mode="wait" initial={false}>
                                        <motion.div
                                            key={active}
                                            initial={reduce ? false : { opacity: 0, x: 26 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={reduce ? { opacity: 0 } : { opacity: 0, x: -26 }}
                                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                            className="relative flex flex-1 flex-col"
                                        >
                                            <Stars className="h-[1.1rem] w-[1.1rem]" />

                                            <blockquote className={`mt-6 flex-1 text-[1.15rem] font-medium leading-[1.65] text-white/85 sm:text-[1.35rem] sm:leading-[1.6] ${bn}`}>
                                                &ldquo;{renderQuote(text, phrase)}&rdquo;
                                            </blockquote>

                                            <div className="mt-8 flex items-center gap-4 border-t border-white/10 pt-6">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={t.image}
                                                    alt={isBn ? t.nameBn : t.name}
                                                    className="h-14 w-14 rounded-full object-cover ring-2 ring-[#F8921C]/70"
                                                />
                                                <div className="min-w-0">
                                                    <h3 style={{ color: "#fff" }} className={`text-lg font-bold leading-snug ${bn}`}>
                                                        {isBn ? t.nameBn : t.name}
                                                    </h3>
                                                    <p className={`text-sm font-medium text-[#F8921C] ${bn}`}>
                                                        {isBn ? `${t.roleBn} @ ${t.companyBn}` : `${t.role} @ ${t.company}`}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </TiltCard>
                        </motion.div>

                        {/* controls + link to the video stories */}
                        <motion.div
                            variants={fadeUp}
                            custom={3}
                            initial="hidden"
                            whileInView="show"
                            viewport={viewport}
                            className="mt-7 flex flex-wrap items-center justify-between gap-5"
                        >
                            <div className="flex items-center gap-3">
                                <button type="button" onClick={() => go(-1)} aria-label="Previous testimonial" className={navBtn}>
                                    <LuChevronLeft size={20} />
                                </button>
                                <button type="button" onClick={() => go(1)} aria-label="Next testimonial" className={navBtn}>
                                    <LuChevronRight size={20} />
                                </button>
                                <span className="ml-1 text-sm font-bold tabular-nums text-white/50">
                                    <span className="text-white">0{active + 1}</span> / 0{total}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Link
                                    href="/happy-clients"
                                    className={`inline-flex items-center gap-1.5 rounded-full bg-[#F8921C] px-7 py-3.5 text-sm font-semibold uppercase text-black transition-colors hover:bg-[#e07d0a] ${isBn ? "tracking-normal" : "tracking-wide"} ${bn}`}
                                >
                                    {isBn ? "ভিডিও স্টোরি দেখুন" : "Watch client stories"}
                                    <LuArrowUpRight size={17} />
                                </Link>
                                <Link
                                    href="/happy-clients"
                                    aria-label="Watch client stories"
                                    className="grid h-[48px] w-[48px] place-items-center rounded-full bg-white text-[#0a0a0a] transition-colors hover:bg-[#F8921C]"
                                >
                                    <LuMoveRight size={20} />
                                </Link>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default TestimonialSection;
