"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import { LuMoveRight, LuArrowUpRight } from "react-icons/lu";
import { useLanguage } from "@/context/LanguageContext";
import { API_BASE_URL } from "@/config/api";
import { CLIENTS } from "@/data/clients";
import useSectionMotion from "@/hooks/useSectionMotion";
import BracketLabel from "./BracketLabel";
import TiltCard from "./TiltCard";
import { Star4, OrbitRing } from "./Decor";

const avatars = [
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&q=80",
];

const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    show: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.65, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
    }),
};
const viewport = { once: true, amount: 0.15 };

// Scrolling strip geometry (px). Pills have a fixed width so the loop length can be computed exactly.
const PILL_W = 232;
const PILL_GAP = 16;
const ITEM_W = PILL_W + PILL_GAP;
const MIN_SET_W = 2600; // one copy of the set must be at least as wide as the widest screen
const STRIP_SPEED = 55; // px per second

const firstLetter = (s = "") => ([...s.trim()][0] || "?").toUpperCase();
const keyOf = (s = "") => s.trim().toLowerCase();

// Square company mark: the logo (on a white tile, so any logo stays readable) or, without a logo, the first letter.
// The caller gives the size, corner radius and letter size through className.
const Mark = ({ client, name, className = "" }) => (
    <span
        className={`grid shrink-0 place-items-center overflow-hidden transition-colors duration-300 ${
            client.logo ? "bg-white" : "bg-[#F8921C]/10 text-[#F8921C] group-hover:bg-[#F8921C] group-hover:text-black"
        } ${className}`}
    >
        {client.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={client.logo} alt={name} className="h-full w-full object-contain p-1.5" />
        ) : (
            <span aria-hidden="true">{firstLetter(name)}</span>
        )}
    </span>
);

const ClientsSection = () => {
    const { language } = useLanguage();
    const isBn = language === "bn";
    const bn = isBn ? "hind-siliguri" : "";

    // ---- smooth scroll + mouse motion (same feel as the hero and services) ----
    // (these hooks must stay above the early `return null` below)
    const { ref: sectionRef, p, mx, reduce, isLg } = useSectionMotion();
    const s = isLg ? 1 : 0; // card-to-card scroll offsets only where the three cards sit side by side
    const cardY0 = useTransform(p, [0, 1], [24 * s, -24 * s]);
    const cardY1 = useTransform(p, [0, 1], [8 * s, -8 * s]);
    const cardY2 = useTransform(p, [0, 1], [38 * s, -38 * s]);
    const cardYs = [cardY0, cardY1, cardY2];
    const headY = useTransform(p, [0, 1], [18 * s, -18 * s]);
    // fast scrolling leans the scrolling strip a little
    const { scrollY } = useScroll();
    const scrollSpeed = useSpring(useVelocity(scrollY), { stiffness: 120, damping: 30 });
    const stripSkew = useTransform(scrollSpeed, [-2400, 0, 2400], [5, 0, -5]);
    // background decoration: different depths → they drift apart as you scroll / move the mouse
    const ringLX = useTransform(mx, [-0.5, 0.5], [30, -30]);
    const ringLY = useTransform(p, [0, 1], [70, -70]);
    const ringRX = useTransform(mx, [-0.5, 0.5], [-26, 26]);
    const ringRY = useTransform(p, [0, 1], [-60, 60]);
    const starAY = useTransform(p, [0, 1], [-70, 70]);
    const starAX = useTransform(mx, [-0.5, 0.5], [-24, 24]);

    // companies of approved testimonials (managed in the admin dashboard)
    const [live, setLive] = useState([]);
    useEffect(() => {
        const ctrl = new AbortController();
        (async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/testimonials/public`, { signal: ctrl.signal });
                const json = await res.json();
                if (!json?.success || !Array.isArray(json.data)) return;
                setLive(
                    json.data
                        .filter((t) => t?.companyName)
                        .map((t) => ({
                            name: t.companyName,
                            nameBn: t.companyNameBn,
                            note: t.clientDesignation,
                            noteBn: t.clientDesignationBn,
                            logo: null,
                            image: null,
                        }))
                );
            } catch {
                /* offline / API down → the hand-written list is still shown */
            }
        })();
        return () => ctrl.abort();
    }, []);

    const { featured, strip, stripSet, duration } = useMemo(() => {
        const seen = new Set();
        const all = [...CLIENTS, ...live].filter((c) => {
            const k = keyOf(c.name);
            if (!k || seen.has(k)) return false;
            seen.add(k);
            return true;
        });

        // top row: the clients marked featured (max 3); if none are marked, the first three
        const marked = all.filter((c) => c.featured);
        const featured = (marked.length ? marked : all).slice(0, 3);
        const featuredKeys = new Set(featured.map((c) => keyOf(c.name)));

        // bottom row: everyone else. While there are fewer than 3 others there is nothing worth scrolling,
        // so the strip lists all clients instead of staying empty.
        const others = all.filter((c) => !featuredKeys.has(keyOf(c.name)));
        const strip = others.length >= 3 ? others : all;

        // repeat the set until one copy is wider than any screen, then derive the speed from its length
        const perSet = strip.length ? Math.max(1, Math.ceil(MIN_SET_W / (strip.length * ITEM_W))) : 1;
        const stripSet = Array.from({ length: perSet }, () => strip).flat();
        const duration = Math.round((stripSet.length * ITEM_W) / STRIP_SPEED);

        return { featured, strip, stripSet, duration };
    }, [live]);

    if (featured.length === 0) return null;

    const nameOf = (c) => (isBn ? c.nameBn || c.name : c.name);
    const noteOf = (c) => (isBn ? c.noteBn || c.note : c.note);

    // one copy of the strip; `hidden` copies are skipped by screen readers
    const renderSet = (hidden, tag) =>
        stripSet.map((c, i) => {
            const name = nameOf(c);
            const isCopy = hidden || i >= strip.length;
            return (
                <div
                    key={`${tag}-${i}`}
                    data-pill
                    aria-hidden={isCopy || undefined}
                    className="shrink-0"
                    style={{ width: PILL_W, marginRight: PILL_GAP }}
                >
                    <div className="flex h-[4.4rem] items-center gap-3.5 rounded-2xl border border-white/10 bg-white/[0.03] px-4 transition-colors duration-300 hover:border-[#F8921C]/60 hover:bg-white/[0.07]">
                        <Mark
                            client={c}
                            name={name}
                            className="h-11 w-11 rounded-lg text-lg font-bold"
                        />
                        <span className={`line-clamp-2 break-words text-[15px] font-semibold leading-snug text-white ${bn}`}>
                            {name}
                        </span>
                    </div>
                </div>
            );
        });

    return (
        <section
            ref={sectionRef}
            id="clients"
            // Large screens: the whole section fits in one screen (minus the 65px sticky header) with the
            // content centred, so the leftover height becomes even padding above and below. Every gap scales
            // with the screen height (vh) instead of using fixed sizes.
            className="relative overflow-hidden bg-[color:var(--tone-deep)] py-24 text-white lg:flex lg:min-h-[min(calc(100svh-65px),880px)] lg:flex-col lg:justify-center lg:py-[clamp(2rem,6vh,5rem)]"
        >
            {/* ===== background decoration ===== */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                <div className="absolute left-1/2 top-0 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-[#F8921C]/[0.05] blur-3xl" />

                {/* two rings half hidden at the screen edges; each turns slowly with a glowing dot on its rim */}
                <motion.div
                    style={reduce ? undefined : { x: ringLX, y: ringLY }}
                    className="absolute -left-[15rem] top-[16%] hidden sm:block"
                >
                    <div className="relative aspect-square w-[34rem]">
                        <OrbitRing className="absolute inset-0 border-white/[0.10]" />
                        <OrbitRing reverse dashed dot="bottom" className="absolute inset-[15%] border-[#F8921C]/25" />
                    </div>
                </motion.div>
                <motion.div
                    style={reduce ? undefined : { x: ringRX, y: ringRY }}
                    className="absolute -right-[12rem] bottom-[4%] hidden sm:block"
                >
                    <div className="relative aspect-square w-[28rem]">
                        <OrbitRing dashed reverse dot="bottom" className="absolute inset-0 border-white/[0.09]" />
                        <OrbitRing className="absolute inset-[18%] border-white/[0.06]" />
                    </div>
                </motion.div>

                {/* just one small sparkle */}
                <motion.div style={reduce ? undefined : { x: starAX, y: starAY }} className="absolute right-[13%] top-[9%] hidden md:block">
                    <Star4 size={40} filled className="decor-float text-[#F8921C]" style={{ animationDuration: "10s" }} />
                </motion.div>
            </div>

            <div className="container relative z-10 mx-auto px-6 lg:px-10">
                {/* ===== centred header ===== */}
                <motion.div
                    style={reduce ? undefined : { y: headY }}
                    className="mb-14 flex flex-col items-center text-center lg:mb-[clamp(1.25rem,3.6vh,3.25rem)]"
                >
                    <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewport}>
                        <BracketLabel bn={bn}>{isBn ? "আমাদের ক্লায়েন্ট" : "Our clients"}</BracketLabel>
                    </motion.div>

                    <motion.h2
                        variants={fadeUp}
                        custom={1}
                        initial="hidden"
                        whileInView="show"
                        viewport={viewport}
                        style={{ color: "#fff" }}
                        className={`mt-6 max-w-2xl text-3xl font-bold leading-[1.2] sm:text-4xl lg:mt-[clamp(0.75rem,2vh,1.5rem)] lg:text-[clamp(1.9rem,4.6vh,2.6rem)] ${bn}`}
                    >
                        {isBn ? (
                            <>
                                যাদের সাথে আমরা <i className="font-light">কাজ করেছি</i>
                            </>
                        ) : (
                            <>
                                Companies we have <i className="font-light">worked with</i>
                            </>
                        )}
                    </motion.h2>

                    <motion.p
                        variants={fadeUp}
                        custom={2}
                        initial="hidden"
                        whileInView="show"
                        viewport={viewport}
                        className={`mt-5 max-w-xl text-sm leading-7 text-white/60 sm:text-base lg:mt-[clamp(0.5rem,1.6vh,1.25rem)] lg:[@media(max-height:820px)]:hidden ${bn}`}
                    >
                        {isBn
                            ? "ছোট স্টার্টআপ থেকে প্রতিষ্ঠিত ব্র্যান্ড, প্রতিটি ক্লায়েন্টের সাথে আমরা একসাথে বেড়ে উঠেছি।"
                            : "From young startups to established brands, we grow together with every client."}
                    </motion.p>
                </motion.div>

                {/* ===== ROW 1 — main clients, big cards with a picture ===== */}
                <div className="flex flex-wrap justify-center gap-6">
                    {featured.map((c, i) => {
                        const name = nameOf(c);
                        const note = noteOf(c);
                        return (
                          <motion.div
                            key={keyOf(c.name)}
                            style={reduce ? undefined : { y: cardYs[i] }}
                            className="w-full md:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]"
                          >
                            <motion.div
                                variants={fadeUp}
                                custom={i}
                                initial="hidden"
                                whileInView="show"
                                viewport={viewport}
                                className="h-full"
                            >
                              {/* leans toward the mouse + a light follows the pointer */}
                              <TiltCard className="h-full" radius="1.5rem">
                                <div className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition-all duration-300 hover:-translate-y-2 hover:border-[#F8921C]/60 hover:shadow-[0_30px_60px_-30px_rgba(248,146,28,0.55)]">
                                    {/* picture area */}
                                    <div className="relative h-52 overflow-hidden bg-[color:var(--tone-soft)] lg:h-[clamp(8.5rem,20vh,13rem)]">
                                        {c.image ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={c.image}
                                                alt={name}
                                                loading="lazy"
                                                style={{ objectPosition: c.pos || "50% 50%" }}
                                                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="relative grid h-full w-full place-items-center">
                                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_55%,rgba(248,146,28,0.28),transparent_62%)] transition-opacity duration-500 group-hover:opacity-100" />
                                                <div className="absolute inset-0 opacity-[0.06] [background-image:repeating-linear-gradient(115deg,#fff_0,#fff_1px,transparent_1px,transparent_26px)]" />
                                                {c.logo ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img
                                                        src={c.logo}
                                                        alt={name}
                                                        loading="lazy"
                                                        className="relative h-28 w-auto max-w-[70%] object-contain transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                ) : (
                                                    <span
                                                        aria-hidden="true"
                                                        className="relative text-[6.5rem] font-extrabold leading-none text-[#F8921C] transition-transform duration-500 group-hover:scale-110 lg:text-[clamp(4rem,10vh,6.5rem)]"
                                                    >
                                                        {firstLetter(name)}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

                                        <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 text-[11px] font-bold tabular-nums text-[#F8921C] backdrop-blur-md">
                                            0{i + 1}
                                        </span>
                                        <span className="absolute right-4 top-4 grid h-10 w-10 scale-75 place-items-center rounded-full bg-[#F8921C] text-black opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                                            <LuArrowUpRight size={18} />
                                        </span>
                                    </div>

                                    {/* text */}
                                    <div className="p-6 lg:p-[clamp(1rem,2.2vh,1.5rem)]">
                                        {/* square logo first, then the name */}
                                        <div className="flex items-center gap-3.5">
                                            <Mark client={c} name={name} className="h-[3.1rem] w-[3.1rem] rounded-xl text-xl font-bold" />
                                            <div className="min-w-0">
                                                <h3 style={{ color: "#fff" }} className={`line-clamp-2 break-words text-xl font-semibold leading-snug ${bn}`}>
                                                    {name}
                                                </h3>
                                                {note && <p className={`mt-0.5 text-sm text-white/55 ${bn}`}>{note}</p>}
                                            </div>
                                        </div>
                                        <span className="mt-4 block h-[3px] w-10 rounded-full bg-[#F8921C] transition-all duration-500 group-hover:w-24" />
                                    </div>
                                </div>
                              </TiltCard>
                            </motion.div>
                          </motion.div>
                        );
                    })}
                </div>

                {/* ===== divider between the rows ===== */}
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={viewport}
                    className="my-12 flex items-center justify-center gap-5 lg:my-[clamp(1rem,3vh,3.25rem)]"
                >
                    <span className="h-px w-16 bg-white/15 sm:w-28" />
                    <span className={`text-sm font-semibold text-white/60 ${bn ? "" : "uppercase tracking-[0.18em]"} ${bn}`}>
                        {isBn ? "এবং আরও অনেকে" : "and many more"}
                    </span>
                    <span className="h-px w-16 bg-white/15 sm:w-28" />
                </motion.div>
            </div>

            {/* ===== ROW 2 — every other company, scrolling edge to edge ===== */}
            <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.1 }}
                className="relative z-10"
            >
                <div
                    className="clients-row overflow-hidden"
                    style={{
                        maskImage: "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
                        WebkitMaskImage: "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
                    }}
                >
                    {/* leans with the page's scroll speed; the endless sliding is on the track inside */}
                    <motion.div style={reduce ? undefined : { skewX: stripSkew }}>
                        <div className="clients-track flex w-max" style={{ "--clients-dur": `${duration}s` }}>
                            {renderSet(false, "a")}
                            <div className="clients-dup flex" aria-hidden="true">
                                {renderSet(true, "b")}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* ===== count + link ===== */}
            <div className="container relative z-10 mx-auto px-6 lg:px-10">
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={viewport}
                    className="mt-14 flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-10 lg:mt-[clamp(1.25rem,3.4vh,3.25rem)]"
                >
                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-2.5">
                            {avatars.map((url, i) => (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    key={i}
                                    src={url}
                                    alt="Happy client"
                                    className="h-10 w-10 rounded-full border-2 border-[color:var(--tone-deep)] object-cover"
                                />
                            ))}
                        </div>
                        <span className={`text-sm leading-tight text-white/70 ${bn}`}>
                            <b className="block text-lg font-bold text-white">300+</b>
                            {isBn ? "সন্তুষ্ট ক্লায়েন্ট" : "happy clients"}
                        </span>
                    </div>

                    <span className="hidden h-10 w-px bg-white/15 sm:block" />

                    <div className="flex items-center gap-2">
                        <Link
                            href="/happy-clients"
                            className={`inline-flex items-center gap-1.5 rounded-full bg-[#F8921C] px-8 py-4 text-sm font-semibold uppercase tracking-wide text-black transition-colors hover:bg-[#e07d0a] ${bn ? "tracking-normal" : ""} ${bn}`}
                        >
                            {isBn ? "ক্লায়েন্টদের মতামত" : "Client stories"}
                            <LuArrowUpRight size={17} />
                        </Link>
                        <Link
                            href="/happy-clients"
                            aria-label="Client stories"
                            className="grid h-[52px] w-[52px] place-items-center rounded-full bg-white text-[#0a0a0a] transition-colors hover:bg-[#F8921C]"
                        >
                            <LuMoveRight size={22} />
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default ClientsSection;
