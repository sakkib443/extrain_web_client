"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import { LuX, LuChevronLeft, LuChevronRight, LuMaximize2 } from "react-icons/lu";
import { useLanguage } from "@/context/LanguageContext";
import useSectionMotion from "@/hooks/useSectionMotion";
import BracketLabel from "./BracketLabel";
import { useHomeMedia } from "./HomeMediaContext";

// The photos, their order, each column's width and the row height come from Dashboard → Design → Home Page → Photos
// (defaults in data/homeMedia.js). A row is a list of columns: a column is either one tall tile or two tiles stacked.
// All columns in a row have the same height, so the top and bottom edges line up. Every tile shares ONE shape.
const GAP = 16;

// Endless loop: a row is drawn twice and slides by exactly one set (-50%), so ONE set must be wider than the
// screen (plus the scroll-linked shift, 90px) or the row runs out on the right at the end of every cycle.
// If a set is too short it is repeated. The loop time follows the length so the speed stays the same.
const MIN_SET = 2800; // px, unscaled — covers screens up to ~2700px wide
const SPEED = { a: 23, b: 21 }; // px per second
const loopInfo = (cols, speed) => {
    const setW = cols.reduce((n, c) => n + c.w + GAP, 0);
    const reps = Math.max(1, Math.ceil(MIN_SET / setW));
    return { reps, dur: Math.round((setW * reps) / speed) };
};

const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    show: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.65, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
    }),
};
const viewport = { once: true, amount: 0.2 };

const GallerySection = () => {
    const { language } = useLanguage();
    const isBn = language === "bn";
    const bn = isBn ? "hind-siliguri" : "";

    const { gallery } = useHomeMedia();
    const ROW_H = gallery.rowHeight; // desktop px, scaled on smaller screens via --gal-s
    const { rows, ALL } = useMemo(() => {
        let n = 0;
        const built = gallery.rows.map((r, i) => ({
            cols: r.columns.map((c) => ({ ...c, items: c.items.map((it) => ({ ...it, idx: n++ })) })),
            loop: loopInfo(r.columns, i % 2 ? SPEED.b : SPEED.a),
            reverse: i % 2 === 1, // rows slide in opposite directions
        }));
        return { rows: built, ALL: built.flatMap((r) => r.cols.flatMap((c) => c.items)) };
    }, [gallery]);

    const [open, setOpen] = useState(null); // index into ALL, or null
    const closeRef = useRef(null);

    // ---- smooth scroll + mouse motion (same feel as the hero and services) ----
    const { ref: sectionRef, p, my, reduce } = useSectionMotion();
    // Both rows only ever shift to the left of their start, so the edges never show a gap.
    const rowAX = useTransform(p, [0, 1], [0, -90]);
    const rowBX = useTransform(p, [0, 1], [-90, 0]);
    const rowAY = useTransform(my, [-0.5, 0.5], [-9, 9]); // mouse: rows slide past each other
    const rowBY = useTransform(my, [-0.5, 0.5], [9, -9]);
    // Fast scrolling leans the photos a little (skew follows the page's scroll speed).
    const { scrollY } = useScroll();
    const scrollSpeed = useSpring(useVelocity(scrollY), { stiffness: 120, damping: 30 });
    const skewX = useTransform(scrollSpeed, [-2400, 0, 2400], [6, 0, -6]);
    const headY = useTransform(p, [0, 1], [26, -26]);

    const close = useCallback(() => setOpen(null), []);
    const total = ALL.length;
    const step = useCallback((dir) => setOpen((i) => (i === null ? i : (i + dir + total) % total)), [total]);

    // lightbox: keyboard, scroll lock, focus
    useEffect(() => {
        if (open === null) return;
        const onKey = (e) => {
            if (e.key === "Escape") close();
            else if (e.key === "ArrowRight") step(1);
            else if (e.key === "ArrowLeft") step(-1);
        };
        window.addEventListener("keydown", onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        closeRef.current?.focus();
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
        };
    }, [open, close, step]);

    // One tile — always the same rounded rectangle, fills whatever space its column gives it.
    // `dup` = the looped copy (hidden from assistive tech, not focusable).
    const renderTile = (item, key, dup) => (
        <button
            key={key}
            type="button"
            onClick={() => setOpen(item.idx)}
            aria-label={`${isBn ? item.labelBn : item.label} — ${isBn ? "বড় করে দেখুন" : "view larger"}`}
            aria-hidden={dup || undefined}
            tabIndex={dup ? -1 : 0}
            className="group relative block min-h-0 w-full flex-1 overflow-hidden rounded-[1.25rem] bg-[#141414] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F8921C]"
        >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={item.src}
                alt={dup ? "" : isBn ? item.labelBn : item.label}
                loading="lazy"
                decoding="async"
                draggable={false}
                style={item.pos ? { objectPosition: item.pos } : undefined}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <span className="pointer-events-none absolute right-3 top-3 grid h-9 w-9 scale-75 place-items-center rounded-full bg-[#F8921C] text-black opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                <LuMaximize2 size={16} />
            </span>
            <span
                className={`pointer-events-none absolute bottom-3 left-3 translate-y-2 rounded-full border border-white/20 bg-black/60 px-3.5 py-1.5 text-xs font-semibold text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 ${bn}`}
            >
                {isBn ? item.labelBn : item.label}
            </span>
        </button>
    );

    const renderColumn = (col, key, dup) => (
        <div key={key} className="shrink-0" style={{ paddingRight: `calc(${GAP}px * var(--gal-s, 1))` }}>
            <div
                className="flex flex-col"
                style={{
                    width: `calc(${col.w}px * var(--gal-s, 1))`,
                    height: `calc(${ROW_H}px * var(--gal-s, 1))`,
                    gap: `calc(${GAP}px * var(--gal-s, 1))`,
                }}
            >
                {col.items.map((it, i) => renderTile(it, `${key}-${i}`, dup))}
            </div>
        </div>
    );

    const renderRow = (cols, reverse, loop) => {
        // one full set = the columns repeated loop.reps times; `copy` marks everything that is not the first copy
        const renderSet = (tag, copy) =>
            Array.from({ length: loop.reps }).flatMap((_, r) =>
                cols.map((c, i) => renderColumn(c, `${tag}-${r}-${i}`, copy || r > 0))
            );
        return (
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}>
            {/* py-3: room for the up/down mouse motion inside the clipped row */}
            <div
                className="gallery-row overflow-hidden py-3"
                style={{
                    maskImage: "linear-gradient(to right, transparent, #000 7%, #000 93%, transparent)",
                    WebkitMaskImage: "linear-gradient(to right, transparent, #000 7%, #000 93%, transparent)",
                }}
            >
                {/* scroll / mouse / scroll-speed motion lives here; the endless sliding is on the track inside */}
                <motion.div style={reduce ? undefined : { x: reverse ? rowBX : rowAX, y: reverse ? rowBY : rowAY, skewX }}>
                    <div
                        className={`gallery-track flex w-max items-start ${reverse ? "gallery-rev" : ""}`}
                        style={{ "--gallery-dur": `${loop.dur}s` }}
                    >
                        {renderSet("a", false)}
                        <div className="gallery-dup flex items-start" aria-hidden="true">
                            {renderSet("b", true)}
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
        );
    };

    const current = open !== null ? ALL[open] || null : null;

    return (
        <section
            ref={sectionRef}
            id="gallery"
            className="relative overflow-hidden bg-[color:var(--tone-soft)] py-24 text-white [--gal-s:0.68] sm:[--gal-s:0.85] lg:[--gal-s:1] lg:py-28"
        >
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute right-1/4 top-0 h-80 w-80 rounded-full bg-[#F8921C]/[0.05] blur-3xl" />
            </div>

            {/* ===== header (kept in the normal page width) ===== */}
            <motion.div style={reduce ? undefined : { y: headY }} className="container relative z-10 mx-auto px-6 lg:px-10">
                <div className="mb-12 flex flex-col gap-6 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewport}>
                            <BracketLabel bn={bn}>{isBn ? "গ্যালারি" : "Gallery"}</BracketLabel>
                        </motion.div>
                        <motion.h2
                            variants={fadeUp}
                            custom={1}
                            initial="hidden"
                            whileInView="show"
                            viewport={viewport}
                            style={{ color: "#fff" }}
                            className={`mt-6 text-3xl font-bold leading-[1.2] sm:text-4xl lg:text-[2.6rem] ${bn}`}
                        >
                            {isBn ? (
                                <>
                                    আমাদের <i className="font-light">ক্রিয়েটিভ যাত্রার</i> মুহূর্তগুলো
                                </>
                            ) : (
                                <>
                                    Moments from our <i className="font-light">creative journey</i>
                                </>
                            )}
                        </motion.h2>
                    </div>

                    <motion.p
                        variants={fadeUp}
                        custom={2}
                        initial="hidden"
                        whileInView="show"
                        viewport={viewport}
                        className={`max-w-sm text-sm leading-7 text-white/60 ${bn}`}
                    >
                        {isBn
                            ? "আমাদের কাজ, আমাদের টিম আর প্রতিদিনের ক্রিয়েটিভ মুহূর্ত। যেকোনো ছবিতে ক্লিক করে বড় করে দেখুন।"
                            : "Our work, our team and everyday creative moments. Click any photo to see it larger."}
                    </motion.p>
                </div>
            </motion.div>

            {/* ===== full-width rows: edge to edge, opposite directions ===== */}
            <div className="relative z-10 space-y-1">
                {rows.map((r, i) => (
                    <React.Fragment key={i}>{renderRow(r.cols, r.reverse, r.loop)}</React.Fragment>
                ))}
            </div>

            {/* ===== lightbox ===== */}
            {current &&
                typeof document !== "undefined" &&
                createPortal(
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-label={isBn ? current.labelBn : current.label}
                        className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
                        onClick={close}
                    >
                        <button
                            ref={closeRef}
                            type="button"
                            onClick={close}
                            aria-label="Close"
                            className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-[#F8921C] hover:text-black"
                        >
                            <LuX size={22} />
                        </button>

                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); step(-1); }}
                            aria-label="Previous photo"
                            className="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-[#F8921C] hover:text-black sm:left-6"
                        >
                            <LuChevronLeft size={24} />
                        </button>
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); step(1); }}
                            aria-label="Next photo"
                            className="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-[#F8921C] hover:text-black sm:right-6"
                        >
                            <LuChevronRight size={24} />
                        </button>

                        <figure className="flex max-h-full max-w-full flex-col items-center" onClick={(e) => e.stopPropagation()}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                key={current.full}
                                src={current.full}
                                alt={isBn ? current.labelBn : current.label}
                                className="max-h-[80vh] max-w-[92vw] rounded-2xl object-contain shadow-2xl"
                            />
                            <figcaption className={`mt-4 flex items-center gap-3 text-sm text-white/80 ${bn}`}>
                                <span className="font-semibold text-white">{isBn ? current.labelBn : current.label}</span>
                                <span className="text-white/40">·</span>
                                <span className="tabular-nums text-[#F8921C]">
                                    {open + 1} / {ALL.length}
                                </span>
                            </figcaption>
                        </figure>
                    </div>,
                    document.body
                )}
        </section>
    );
};

export default GallerySection;
