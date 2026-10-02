/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/cartSlice";
import { LuShoppingCart, LuCheck, LuArrowRight, LuLayers, LuUsers, LuGlobe, LuCode, LuEye } from "react-icons/lu";
import { useLanguage } from "@/context/LanguageContext";
import { optimizeImage } from "@/lib/optimizeImage";

// Home "Our Collection" row. Wide panel: image + sale badge | category, name, facts, price, buttons | vertical index tab.
// Odd rows are mirrored (flex-row-reverse on the same DOM order). The focused row (`active` — the hovered one, otherwise the one
// nearest the middle of the screen) zooms in a little, gets an orange wash and full brightness; the others rest slightly dimmed.
const CollectionRow = ({ product, index, reverse, active = false, zoom = 1.03, type = "website" }) => {
    const dispatch = useDispatch();
    const { language } = useLanguage();
    const isBn = language === "bn";
    const bn = isBn ? "hind-siliguri" : "";
    const [isAdded, setIsAdded] = useState(false);


    const detailUrl = `/${type}/${product._id}`;
    const title = product.title || product.name || "Untitled Product";
    const image = optimizeImage(product.images?.[0] || product.image || "/images/placeholder.png", 1000);
    const category = product.category?.name || (isBn ? "ওয়েবসাইট" : "Website");
    const platform = product.platform || "";

    const hasDiscount = product.offerPrice > 0 && product.offerPrice < product.price;
    const price = hasDiscount ? product.offerPrice : product.price;
    const off = hasDiscount ? Math.round((1 - product.offerPrice / product.price) * 100) : 0;
    const sales = product.totalOrders || product.salesCount || 0;
    const tech = (product.technologies || []).filter(Boolean).slice(0, 2).join(", ");

    // The address the demo lives at — shown as a chip on the image.
    let host = "";
    try { host = new URL(product.previewUrl).hostname.replace(/^www\./, ""); } catch { /* no demo link */ }

    const handleAddToCart = () => {
        dispatch(addToCart({ id: product._id, title, price, image, type }));
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    const facts = [
        platform && { icon: LuLayers, text: platform },
        tech && { icon: LuCode, text: tech },
        sales > 0
            ? { icon: LuUsers, text: `${sales.toLocaleString()} ${isBn ? "বিক্রি" : "sold"}` }
            : product.previewUrl && { icon: LuGlobe, text: isBn ? "লাইভ ডেমো আছে" : "Live demo available" },
    ].filter(Boolean);

    const idx = String(index + 1).padStart(2, "0");
    const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F8921C]";

    return (
        <motion.article
            initial={false}
            animate={{ scale: active ? zoom : 1, opacity: active ? 1 : 0.8 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className={`group relative flex flex-col gap-4 overflow-hidden rounded-[1.75rem] border p-3 transition-[border-color,box-shadow] duration-700 lg:gap-6 ${reverse ? "lg:flex-row-reverse" : "lg:flex-row"} ${active
                ? "border-[#F8921C]/45 shadow-[0_30px_70px_-34px_rgba(248,146,28,0.6)]"
                : "border-white/10"}`}
            style={{ background: "#141518" }}
        >
            {/* orange wash + faint vertical stripes, faded in while the row is active */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 transition-opacity duration-700"
                style={{
                    opacity: active ? 1 : 0,
                    background: [
                        "repeating-linear-gradient(90deg, rgba(255,255,255,0.035) 0 2px, transparent 2px 16px)",
                        `linear-gradient(${reverse ? 255 : 105}deg, rgba(248,146,28,0.32) 0%, rgba(150,70,0,0.16) 40%, rgba(26,27,31,0) 78%)`,
                    ].join(","),
                }}
            />

            {/* ===== image ===== */}
            <div className="relative aspect-[16/10] overflow-hidden rounded-[1.25rem] border border-white/10 bg-[#0b0c0e] lg:aspect-auto lg:min-h-[17rem] lg:w-[44%] lg:shrink-0">
                <Link href={detailUrl} aria-label={title} className={`absolute inset-0 block ${focusRing}`}>
                    <img
                        src={image}
                        alt={`${title} — ready-made website`}
                        loading="lazy"
                        className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                    />
                </Link>

                {off > 0 && (
                    <div className={`pointer-events-none absolute top-3 w-[76px] overflow-hidden rounded-2xl bg-white text-center shadow-[0_12px_28px_-12px_rgba(0,0,0,0.7)] ${reverse ? "lg:right-3 left-3 lg:left-auto" : "left-3"}`}>
                        <div className="pt-2.5 text-[1.6rem] font-extrabold leading-none text-black">
                            {off}<span className="text-[0.95rem]">%</span>
                        </div>
                        <div className={`mt-2 bg-[#F8921C] pb-1 pt-1.5 text-[11px] font-bold text-black [border-radius:50%_50%_0_0/100%_100%_0_0] ${bn}`}>
                            {isBn ? "ছাড়" : "OFF"}
                        </div>
                    </div>
                )}

                {host && (
                    <span className={`pointer-events-none absolute bottom-3 inline-flex max-w-[70%] items-center gap-1.5 rounded-full border border-white/15 bg-black/60 px-3 py-1 text-[11px] text-white/80 backdrop-blur-md ${reverse ? "left-3 lg:left-auto lg:right-3" : "left-3"}`}>
                        <LuGlobe size={12} className="shrink-0 text-[#F8921C]" />
                        <span className="truncate">{host}</span>
                    </span>
                )}
            </div>

            {/* ===== content ===== */}
            <div className="relative flex min-w-0 flex-1 flex-col justify-between gap-5 px-1 py-1 lg:py-3">
                <div>
                    <span className={`inline-flex items-center rounded-full bg-white px-5 py-2 text-[12px] font-semibold text-black ${isBn ? "" : "uppercase tracking-[0.04em]"} ${bn}`}>
                        {category}
                    </span>

                    <Link href={detailUrl} className="mt-5 block">
                        <h3 style={{ color: "#fff" }} className={`line-clamp-2 text-[1.2rem] font-semibold leading-snug sm:text-[1.35rem] lg:text-[1.5rem] ${bn}`}>
                            <span className="text-white transition-colors duration-300 group-hover:text-[#F8921C]">{title}</span>
                        </h3>
                    </Link>
                </div>

                {facts.length > 0 && (
                    <div className={`flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-[13px] text-white/65 ${bn}`}>
                        {facts.map(({ icon: Icon, text }) => (
                            <span key={text} className="inline-flex items-center gap-2">
                                <Icon size={15} className="shrink-0 text-[#F8921C]" />
                                {text}
                            </span>
                        ))}
                        <span aria-hidden="true" className={`ml-auto hidden h-5 w-5 place-items-center rounded-full border border-[#F8921C]/60 transition-opacity duration-500 sm:grid ${active ? "opacity-100" : "opacity-0"}`}>
                            <i className="h-2 w-2 rounded-full bg-[#F8921C]" />
                        </span>
                    </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
                    <div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-[1.6rem] font-extrabold leading-none text-white">৳{price?.toLocaleString()}</span>
                            {hasDiscount && (
                                <span className="text-xs font-medium text-white/40 line-through">৳{product.price?.toLocaleString()}</span>
                            )}
                        </div>
                        <span className={`mt-1.5 block text-[11px] text-white/45 ${bn}`}>
                            {isBn ? "এককালীন পেমেন্ট" : "One-time payment"}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleAddToCart}
                            disabled={isAdded}
                            aria-label={isBn ? "কার্টে যোগ করুন" : "Add to cart"}
                            title={isBn ? "কার্টে যোগ করুন" : "Add to cart"}
                            className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border transition-all duration-300 ${focusRing} ${isAdded
                                ? "border-emerald-500 bg-emerald-500 text-white"
                                : "border-white/15 bg-white/[0.04] text-white/75 hover:border-[#F8921C] hover:text-[#F8921C]"}`}
                        >
                            {isAdded ? <LuCheck size={18} /> : <LuShoppingCart size={18} />}
                        </button>

                        {/* pill + round arrow, same pairing as the site's other buttons */}
                        <div className="flex items-center gap-1">
                            <a
                                href={product.previewUrl || detailUrl}
                                target={product.previewUrl ? "_blank" : "_self"}
                                rel="noopener noreferrer"
                                className={`inline-flex h-11 items-center gap-2 rounded-full bg-[#F8921C] px-6 text-[13px] font-bold text-black transition-colors duration-300 hover:bg-[#e07d0a] ${focusRing} ${isBn ? "" : "uppercase tracking-[0.04em]"} ${bn}`}
                            >
                                <LuEye size={16} />
                                {isBn ? "লাইভ প্রিভিউ" : "Live Preview"}
                            </a>
                            <Link
                                href={detailUrl}
                                aria-label={isBn ? "বিস্তারিত দেখুন" : "View details"}
                                title={isBn ? "বিস্তারিত দেখুন" : "View details"}
                                className={`grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-black transition-all duration-300 hover:bg-[#F8921C] group-hover:translate-x-0.5 ${focusRing}`}
                            >
                                <LuArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== index tab (a strip on phones, a vertical tab from lg) ===== */}
            <div className="relative flex items-center gap-3 overflow-hidden rounded-2xl border border-white/10 bg-black/25 p-2.5 lg:w-[104px] lg:shrink-0 lg:flex-col lg:items-stretch lg:gap-0 lg:rounded-[1.5rem] lg:p-0 lg:pb-5">
                <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-base font-extrabold transition-colors duration-500 lg:h-[104px] lg:w-full lg:rounded-none lg:text-[1.9rem] ${active ? "bg-[#F8921C] text-black" : "bg-white/[0.07] text-white"}`}>
                    {idx}
                </span>

                <div className={`flex min-w-0 flex-1 items-baseline gap-2 lg:flex-none lg:items-end lg:justify-center lg:gap-2.5 lg:pt-5 ${bn}`}>
                    <span className="truncate text-sm font-bold text-white lg:max-h-[12.5rem] lg:text-[1.15rem] lg:[rotate:180deg] lg:[writing-mode:vertical-rl]">
                        {category}
                    </span>
                    {platform && (
                        <span className="truncate text-xs text-white/50 lg:max-h-[12.5rem] lg:[rotate:180deg] lg:[writing-mode:vertical-rl]">
                            {platform}
                        </span>
                    )}
                </div>

                {/* little accent bar with a caret, lit while the row is active */}
                <span aria-hidden="true" className="relative mx-auto mt-4 hidden h-[3px] w-10 rounded-full bg-[#F8921C] lg:block">
                    <i className={`absolute -top-[6px] left-1/2 h-0 w-0 -translate-x-1/2 border-x-[6px] border-b-[6px] border-x-transparent border-b-[#F8921C] transition-opacity duration-500 ${active ? "opacity-100" : "opacity-40"}`} />
                </span>
            </div>
        </motion.article>
    );
};

export default CollectionRow;
