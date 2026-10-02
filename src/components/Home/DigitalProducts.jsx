"use client";

import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, useTransform, useScroll, useMotionValueEvent } from 'framer-motion';
import { fetchWebsites } from '@/redux/websiteSlice';
import { fetchCategories } from '@/redux/categorySlice';
import CollectionRow from './CollectionRow';
import { useLanguage } from '@/context/LanguageContext';
import useSectionMotion from '@/hooks/useSectionMotion';
import { LuArrowRight, LuLayers } from 'react-icons/lu';
import Link from 'next/link';
import BracketLabel from './BracketLabel';
import { Star4, Plus, EdgeDots, OrbitRing } from './Decor';

const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    show: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.65, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
    }),
};
const viewport = { once: true, amount: 0.15 };
const ROWS = 4; // how many products the home page lists

// "Explore full collection" — orange pill + white round arrow. Shown in the header on desktop and under the list on small screens.
const ExploreLink = ({ label, bn, isBn, className = "" }) => (
    <Link href="/website" className={`group items-center gap-1 ${className}`}>
        <span className={`inline-flex h-12 items-center rounded-full bg-[#F8921C] px-7 text-[13px] font-bold text-black transition-colors duration-300 group-hover:bg-[#e07d0a] ${isBn ? "" : "uppercase tracking-[0.04em]"} ${bn}`}>
            {label}
        </span>
        <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-black transition-all duration-300 group-hover:translate-x-0.5 group-hover:bg-[#F8921C]">
            <LuArrowRight className="h-[18px] w-[18px]" />
        </span>
    </Link>
);

const DigitalProducts = () => {
    const dispatch = useDispatch();
    const { websiteList = [], loading: isLoading } = useSelector((state) => state.websites || {});
    const { items: allCategories = [] } = useSelector((state) => state.categories || {});
    const { language } = useLanguage();
    const isBn = language === "bn";
    const bn = isBn ? "hind-siliguri" : "";

    const [selectedSubCategory, setSelectedSubCategory] = useState('all');

    // ---- smooth scroll + mouse motion (same feel as the other home sections) ----
    const { ref: sectionRef, p, mx, reduce, isLg } = useSectionMotion();
    const headY = useTransform(p, [0, 1], [20, -20]);
    const ringX = useTransform(mx, [-0.5, 0.5], [-28, 28]);
    const ringY = useTransform(p, [0, 1], [70, -70]);
    const starY = useTransform(p, [0, 1], [-60, 60]);
    const starX = useTransform(mx, [-0.5, 0.5], [22, -22]);
    const plusY = useTransform(p, [0, 1], [40, -40]);

    useEffect(() => {
        dispatch(fetchWebsites());
        dispatch(fetchCategories());
    }, [dispatch]);

    const subCategories = useMemo(() => {
        const parentCat = allCategories.find(cat =>
            cat.slug.toLowerCase() === 'website' && cat.isParent === true
        );
        if (!parentCat) return [];
        return allCategories.filter(cat => cat.parentCategory === parentCat._id || cat.parentCategory?._id === parentCat._id);
    }, [allCategories]);

    const displayList = useMemo(() => {
        const baseList = [...websiteList];

        // Sort by popularity (sales count) descending
        baseList.sort((a, b) => {
            const salesA = a.totalOrders || a.salesCount || 0;
            const salesB = b.totalOrders || b.salesCount || 0;
            return salesB - salesA;
        });

        if (selectedSubCategory !== 'all') {
            return baseList.filter(item =>
                item.category === selectedSubCategory ||
                item.category?._id === selectedSubCategory ||
                item.subcategory === selectedSubCategory ||
                item.subcategory?._id === selectedSubCategory
            ).slice(0, ROWS);
        }
        return baseList.slice(0, ROWS);
    }, [websiteList, selectedSubCategory]);

    // ---- focus: the hovered row, otherwise the row nearest the middle of the screen ----
    const { scrollY } = useScroll();
    const rowEls = useRef([]);
    const [focusIdx, setFocusIdx] = useState(0);
    const [hoverIdx, setHoverIdx] = useState(null);

    const pickFocus = useCallback(() => {
        const mid = window.innerHeight / 2;
        let best = 0, bestDist = Infinity;
        rowEls.current.forEach((el, i) => {
            if (!el) return;
            const r = el.getBoundingClientRect();
            const dist = Math.abs(r.top + r.height / 2 - mid);
            if (dist < bestDist) { bestDist = dist; best = i; }
        });
        setFocusIdx((prev) => (prev === best ? prev : best));
    }, []);
    useMotionValueEvent(scrollY, 'change', pickFocus);
    useEffect(() => {
        pickFocus();
        window.addEventListener('resize', pickFocus);
        return () => window.removeEventListener('resize', pickFocus);
    }, [displayList, pickFocus]);

    const n = displayList.length;

    const chipBase = "shrink-0 whitespace-nowrap rounded-full border px-5 py-2.5 text-[13px] font-medium transition-all duration-300";
    const chipOn = "border-[#F8921C] bg-[#F8921C] text-black shadow-[0_10px_24px_-12px_rgba(248,146,28,0.8)]";
    const chipOff = "border-white/15 bg-white/[0.03] text-white/70 hover:border-[#F8921C]/70 hover:text-[#F8921C]";
    const exploreLabel = isBn ? 'সবগুলো ওয়েবসাইট দেখুন' : 'Explore Full Collection';

    return (
        <section
            ref={sectionRef}
            id="collection"
            className="relative overflow-hidden bg-[color:var(--tone-deep)] py-24 text-white lg:py-32"
        >
            {/* ===== background decoration ===== */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                <div className="absolute -top-24 right-1/4 h-80 w-[34rem] rounded-full bg-[#F8921C]/[0.05] blur-3xl" />
                <div className="absolute -bottom-28 left-1/4 h-72 w-72 rounded-full bg-[#F8921C]/[0.05] blur-3xl" />
                <EdgeDots />
                <motion.div
                    style={reduce ? undefined : { x: ringX, y: ringY }}
                    className="absolute -right-[14rem] top-[10%] hidden sm:block"
                >
                    <div className="relative aspect-square w-[30rem]">
                        <OrbitRing className="absolute inset-0 border-white/[0.10]" />
                        <OrbitRing reverse dashed dot="bottom" className="absolute inset-[16%] border-[#F8921C]/20" />
                    </div>
                </motion.div>
                <motion.div style={reduce ? undefined : { x: starX, y: starY }} className="absolute right-[12%] top-[7%] hidden md:block">
                    <Star4 size={38} filled className="decor-float text-[#F8921C]" style={{ animationDuration: "10s" }} />
                </motion.div>
                <motion.div style={reduce ? undefined : { y: plusY }} className="absolute bottom-[9%] left-[6%] hidden md:block">
                    <Plus size={22} className="text-white/25" />
                </motion.div>
            </div>

            <div className="container relative z-10 mx-auto px-6 lg:px-10">
                {/* ===== header: title on the left, explore link on the right ===== */}
                <motion.div
                    style={reduce ? undefined : { y: headY }}
                    className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
                >
                    <div className="max-w-2xl">
                        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewport} className="mb-7">
                            <BracketLabel bn={bn} size="lg">{isBn ? 'আওয়ার কালেকশন' : 'Our Collection'}</BracketLabel>
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
                                <>পছন্দের <i className="font-light">ডিজিটাল প্রোডাক্টস</i></>
                            ) : (
                                <>Premium <i className="font-light">Digital Products</i></>
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
                                ? 'আমাদের প্রিমিয়াম সফটওয়্যার এবং রেডিমেড ওয়েবসাইট কালেকশন এক্সপ্লোর করুন যা আপনার ব্যবসা বাড়াতে সাহায্য করবে।'
                                : 'Explore our curated collection of elite software and ready-made websites designed for professional scale.'}
                        </motion.p>
                    </div>

                    <motion.div variants={fadeUp} custom={2} initial="hidden" whileInView="show" viewport={viewport} className="hidden lg:block">
                        <ExploreLink label={exploreLabel} bn={bn} isBn={isBn} className="inline-flex" />
                    </motion.div>
                </motion.div>

                {/* ===== filter row ===== */}
                {subCategories.length > 0 && (
                    <motion.div
                        variants={fadeUp}
                        custom={3}
                        initial="hidden"
                        whileInView="show"
                        viewport={viewport}
                        role="tablist"
                        aria-label={isBn ? 'ক্যাটাগরি ফিল্টার' : 'Filter by category'}
                        className="mt-10 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    >
                        <button
                            type="button"
                            role="tab"
                            aria-selected={selectedSubCategory === 'all'}
                            onClick={() => setSelectedSubCategory('all')}
                            className={`${chipBase} ${selectedSubCategory === 'all' ? chipOn : chipOff}`}
                        >
                            <span className={bn}>{isBn ? 'সবগুলো' : 'All Items'}</span>
                        </button>
                        {subCategories.map((sub) => (
                            <button
                                key={sub._id}
                                type="button"
                                role="tab"
                                aria-selected={selectedSubCategory === sub._id}
                                onClick={() => setSelectedSubCategory(sub._id)}
                                className={`${chipBase} ${selectedSubCategory === sub._id ? chipOn : chipOff}`}
                            >
                                <span className={bn}>{sub.name}</span>
                            </button>
                        ))}
                    </motion.div>
                )}

                {/* ===== products ===== */}
                {isLoading ? (
                    <div className="mt-10 flex flex-col gap-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex animate-pulse flex-col gap-4 rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-3 lg:flex-row lg:gap-6">
                                <div className="aspect-[16/10] rounded-[1.25rem] bg-white/[0.06] lg:aspect-auto lg:min-h-[17rem] lg:w-[44%]" />
                                <div className="flex-1 space-y-4 px-1 py-3">
                                    <div className="h-9 w-40 rounded-full bg-white/[0.06]" />
                                    <div className="h-6 w-4/5 rounded-lg bg-white/[0.06]" />
                                    <div className="h-12 w-full rounded-xl bg-white/[0.06]" />
                                    <div className="h-11 w-1/2 rounded-full bg-white/[0.06]" />
                                </div>
                                <div className="hidden w-[104px] rounded-[1.5rem] bg-white/[0.06] lg:block" />
                            </div>
                        ))}
                    </div>
                ) : n === 0 ? (
                    <div className="mt-10 flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-white/10 bg-white/[0.02] px-6 py-20 text-center">
                        <div className="mb-6 grid h-20 w-20 place-items-center rounded-full bg-[#F8921C]/10">
                            <LuLayers className="h-8 w-8 text-[#F8921C]" />
                        </div>
                        <h3 style={{ color: "#fff" }} className={`mb-2 text-xl font-bold ${bn}`}>
                            {isBn ? 'কোনো পণ্য খুঁজে পাওয়া যায়নি' : 'No Products Found'}
                        </h3>
                        <p className={`text-white/60 ${bn}`}>
                            {isBn ? 'দুঃখিত, এই ক্যাটাগরিতে বর্তমানে কোনো পণ্য নেই।' : 'Sorry, there are no products matching your criteria currently.'}
                        </p>
                    </div>
                ) : (
                    // rows one below the other; the focused one (mouse, else nearest the screen's middle) zooms in a little
                    <div className="mt-10 flex flex-col gap-7">
                        {displayList.map((item, i) => (
                            <motion.div
                                key={item._id}
                                ref={(el) => { rowEls.current[i] = el; }}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={viewport}
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                onPointerEnter={(e) => { if (e.pointerType === 'mouse') setHoverIdx(i); }}
                                onPointerLeave={() => setHoverIdx(null)}
                            >
                                <CollectionRow
                                    product={item}
                                    index={i}
                                    reverse={i % 2 === 1}
                                    active={hoverIdx !== null ? hoverIdx === i : focusIdx === i}
                                    zoom={isLg ? 1.03 : 1.015}
                                    type="website"
                                />
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* ===== footer link (small screens; on desktop it sits in the header) ===== */}
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={viewport}
                    className="mt-12 flex justify-center lg:hidden"
                >
                    <ExploreLink label={exploreLabel} bn={bn} isBn={isBn} className="inline-flex" />
                </motion.div>
            </div>
        </section>
    );
};

export default DigitalProducts;
