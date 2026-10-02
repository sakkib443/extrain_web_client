"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, useTransform } from 'framer-motion';
import { fetchSoftware } from '@/redux/softwareSlice';
import { fetchWebsites } from '@/redux/websiteSlice';
import { fetchCategories } from '@/redux/categorySlice';
import ProductCard from '@/components/sheard/ProductCard';
import { useLanguage } from '@/context/LanguageContext';
import useSectionMotion from '@/hooks/useSectionMotion';
import { LuGlobe, LuArrowRight, LuLayers } from 'react-icons/lu';
import Link from 'next/link';
import BracketLabel from './BracketLabel';
import TiltCard from './TiltCard';
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

const DigitalProducts = () => {
    const dispatch = useDispatch();
    const { softwareList = [], loading: softwareLoading } = useSelector((state) => state.software || {});
    const { websiteList = [], loading: websiteLoading } = useSelector((state) => state.websites || {});
    const { items: allCategories = [], status: categoryStatus } = useSelector((state) => state.categories || {});
    const { language } = useLanguage();
    const isBn = language === "bn";
    const bn = isBn ? "hind-siliguri" : "";

    const [activeType, setActiveType] = useState('website');
    const [selectedSubCategory, setSelectedSubCategory] = useState('all');

    // ---- smooth scroll + mouse motion (same feel as the other home sections) ----
    const { ref: sectionRef, p, mx, reduce, isLg } = useSectionMotion();
    const s = isLg ? 1 : 0; // card offsets only where the three columns sit side by side
    const headY = useTransform(p, [0, 1], [20 * s, -20 * s]);
    const cardY0 = useTransform(p, [0, 1], [28 * s, -28 * s]);
    const cardY1 = useTransform(p, [0, 1], [8 * s, -8 * s]);
    const cardY2 = useTransform(p, [0, 1], [42 * s, -42 * s]);
    const cardYs = [cardY0, cardY1, cardY2];
    const ringX = useTransform(mx, [-0.5, 0.5], [-28, 28]);
    const ringY = useTransform(p, [0, 1], [70, -70]);
    const starY = useTransform(p, [0, 1], [-60, 60]);
    const starX = useTransform(mx, [-0.5, 0.5], [22, -22]);
    const plusY = useTransform(p, [0, 1], [40, -40]);

    useEffect(() => {
        dispatch(fetchSoftware());
        dispatch(fetchWebsites());
        dispatch(fetchCategories());
    }, [dispatch]);

    const subCategories = useMemo(() => {
        const parentCat = allCategories.find(cat =>
            cat.slug.toLowerCase() === activeType.toLowerCase() && cat.isParent === true
        );
        if (!parentCat) return [];
        return allCategories.filter(cat => cat.parentCategory === parentCat._id || cat.parentCategory?._id === parentCat._id);
    }, [allCategories, activeType]);

    useEffect(() => {
        setSelectedSubCategory('all');
    }, [activeType]);

    const displayList = useMemo(() => {
        let baseList = [...(activeType === 'software' ? softwareList : websiteList)];

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
            ).slice(0, 6);
        }
        return baseList.slice(0, 6);
    }, [activeType, softwareList, websiteList, selectedSubCategory]);

    const isLoading = activeType === 'software' ? softwareLoading : websiteLoading;

    const chipBase = "rounded-full border px-5 py-2.5 text-[13px] font-medium transition-all duration-300";
    const chipOn = "border-[#F8921C] bg-[#F8921C] text-black shadow-[0_10px_24px_-12px_rgba(248,146,28,0.8)]";
    const chipOff = "border-white/15 bg-white/[0.03] text-white/70 hover:border-[#F8921C]/70 hover:text-[#F8921C]";

    return (
        <section
            ref={sectionRef}
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
                <motion.div style={reduce ? undefined : { x: starX, y: starY }} className="absolute left-[9%] top-[9%] hidden md:block">
                    <Star4 size={38} filled className="decor-float text-[#F8921C]" style={{ animationDuration: "10s" }} />
                </motion.div>
                <motion.div style={reduce ? undefined : { y: plusY }} className="absolute bottom-[9%] left-[6%] hidden md:block">
                    <Plus size={22} className="text-white/25" />
                </motion.div>
            </div>

            <div className="container relative z-10 mx-auto px-6 lg:px-10">
                {/* ===== heading ===== */}
                <motion.div style={reduce ? undefined : { y: headY }} className="mx-auto max-w-2xl text-center">
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
                </motion.div>

                {/* ===== filter row ===== */}
                <motion.div
                    variants={fadeUp}
                    custom={3}
                    initial="hidden"
                    whileInView="show"
                    viewport={viewport}
                    className="mt-10 flex flex-wrap items-center justify-center gap-4"
                >
                    {/* Main Type Toggles */}
                    <div className="flex rounded-full border border-white/10 bg-white/[0.04] p-1 backdrop-blur-md">
                        <button
                            onClick={() => setActiveType('website')}
                            className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-semibold transition-all duration-300 ${activeType === 'website'
                                ? 'bg-[#F8921C] text-black'
                                : 'text-white/60 hover:text-white'
                                }`}
                        >
                            <LuGlobe className="h-4 w-4" />
                            <span className={bn}>{isBn ? 'ওয়েবসাইট' : 'Websites'}</span>
                        </button>
                    </div>

                    {/* Vertical Divider for Desktop */}
                    {subCategories.length > 0 && <div className="mx-2 hidden h-8 w-px bg-white/15 lg:block" />}

                    {/* Sub-Category Filters - Same Row */}
                    {subCategories.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-2">
                            <button
                                onClick={() => setSelectedSubCategory('all')}
                                className={`${chipBase} ${selectedSubCategory === 'all' ? chipOn : chipOff}`}
                            >
                                <span className={bn}>{isBn ? 'সবগুলো' : 'All Items'}</span>
                            </button>
                            {subCategories.map((sub) => (
                                <button
                                    key={sub._id}
                                    onClick={() => setSelectedSubCategory(sub._id)}
                                    className={`${chipBase} ${selectedSubCategory === sub._id ? chipOn : chipOff}`}
                                >
                                    <span className={bn}>{sub.name}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* ===== content grid ===== */}
                <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-7">
                    {isLoading ? (
                        [...Array(4)].map((_, i) => (
                            <div key={i} className="h-[420px] animate-pulse rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                                <div className="mb-6 h-56 w-full rounded-xl bg-white/[0.06]" />
                                <div className="mb-4 h-5 w-3/4 rounded-lg bg-white/[0.06]" />
                                <div className="h-4 w-1/2 rounded-lg bg-white/[0.06]" />
                            </div>
                        ))
                    ) : (
                        displayList.length > 0 ? (
                            displayList.map((item, i) => (
                                <motion.div
                                    key={item._id}
                                    style={reduce ? undefined : { y: cardYs[i % cardYs.length] }}
                                    className="h-full"
                                >
                                    <motion.div
                                        variants={fadeUp}
                                        custom={i % 3}
                                        initial="hidden"
                                        whileInView="show"
                                        viewport={viewport}
                                        className="h-full"
                                    >
                                        {/* leans toward the mouse + a light follows the pointer */}
                                        <TiltCard className="h-full" radius="1rem">
                                            <ProductCard product={item} type={activeType} theme="dark" />
                                        </TiltCard>
                                    </motion.div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-white/10 bg-white/[0.02] px-6 py-20 text-center">
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
                        )
                    )}
                </div>

                {/* ===== footer link ===== */}
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={viewport}
                    className="mt-14 flex justify-center"
                >
                    <Link
                        href="/website"
                        className="group inline-flex items-center gap-4 rounded-full border border-white/15 bg-white/[0.03] py-2 pl-8 pr-2 font-medium text-white transition-all duration-300 hover:border-[#F8921C]/70 hover:bg-white/[0.06] hover:shadow-[0_18px_40px_-24px_rgba(248,146,28,0.7)]"
                    >
                        <span className={`text-sm font-semibold ${bn}`}>
                            {isBn ? 'সবগুলো প্রোডাক্ট দেখুন' : 'Explore Full Collection'}
                        </span>
                        <span className="grid h-11 w-11 place-items-center rounded-full bg-[#F8921C] text-black transition-transform duration-300 group-hover:translate-x-0.5">
                            <LuArrowRight className="h-[18px] w-[18px]" />
                        </span>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default DigitalProducts;
