/* eslint-disable @next/next/no-img-element */
"use client";

// A website on the listing pages. Websites are not sold through a cart: the customer looks at the live site and orders
// with the form, this design already chosen. So the card stays simple: photo, name, price (if there is one), two buttons.

import React from "react";
import Link from "next/link";
import { LuEye, LuArrowRight } from "react-icons/lu";
import { useLanguage } from "@/context/LanguageContext";
import { optimizeImage } from "@/lib/optimizeImage";
import { orderUrl } from "@/lib/orderLink";

const WebsiteCard = ({ product, view = "grid", theme = "light" }) => {
    const { language } = useLanguage();
    const isBn = language === "bn";
    const bn = isBn ? "hind-siliguri" : "";
    const D = theme === "dark";

    const title = product.title || product.name || "Untitled";
    const detailUrl = `/website/${product._id}`;
    const image = optimizeImage(product.images?.[0] || product.image || "/images/placeholder.png", 800);
    const category = product.category?.name || (isBn ? "ওয়েবসাইট" : "Website");
    const hasDiscount = product.offerPrice > 0 && product.offerPrice < product.price;
    const price = hasDiscount ? product.offerPrice : product.price;
    const live = product.previewUrl || detailUrl;

    const card = D
        ? "border-white/10 bg-[color:var(--tone-deep)] hover:border-[#F8921C]/60 hover:shadow-[0_24px_50px_-28px_rgba(248,146,28,0.55)]"
        : "border-gray-100 bg-white shadow-sm hover:shadow-lg dark:border-white/10 dark:bg-[#0d0d0d]";
    const heading = D ? "group-hover:text-[#F8921C]" : "text-slate-900 group-hover:text-[#FD9A00] dark:text-white";
    const muted = D ? "text-white/55" : "text-slate-500";
    const outline = D
        ? "border-white/15 text-white hover:border-[#F8921C] hover:text-[#F8921C]"
        : "border-slate-200 text-slate-700 hover:border-[#FD9A00] hover:text-[#FD9A00] dark:border-white/15 dark:text-white";

    const priceLine = price > 0 && (
        <p className={`text-sm ${muted} ${bn}`}>
            <span className={D ? "font-semibold text-white" : "font-semibold text-slate-900 dark:text-white"}>৳{price.toLocaleString()}</span>
            {hasDiscount && <span className="ml-2 text-xs line-through opacity-60">৳{product.price.toLocaleString()}</span>}
        </p>
    );

    const buttons = (
        <div className="grid grid-cols-2 gap-2">
            <a
                href={live}
                target={product.previewUrl ? "_blank" : "_self"}
                rel="noopener noreferrer"
                className={`inline-flex h-11 items-center justify-center gap-1.5 rounded-lg border text-[13px] font-semibold transition-colors ${outline} ${bn}`}
            >
                <LuEye size={16} />
                {product.previewUrl ? (isBn ? "লাইভ প্রিভিউ" : "Live Preview") : (isBn ? "বিস্তারিত" : "Details")}
            </a>
            <Link
                href={orderUrl(title)}
                className={`inline-flex h-11 items-center justify-center gap-1.5 rounded-lg bg-[#F8921C] text-[13px] font-semibold text-black transition-colors hover:bg-[#e07d0a] ${bn}`}
            >
                {isBn ? "অর্ডার করুন" : "Confirm Order"}
                <LuArrowRight size={16} />
            </Link>
        </div>
    );

    if (view === "list") {
        return (
            <div className={`group flex w-full flex-col overflow-hidden rounded-2xl border transition-all duration-300 md:flex-row ${card}`}>
                <Link href={detailUrl} className="relative block aspect-[16/10] w-full shrink-0 overflow-hidden md:w-[34%]">
                    <img src={image} alt={`${title} website design`} loading="lazy" className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                </Link>
                <div className="flex flex-1 flex-col justify-center gap-3 p-5 md:p-6">
                    <span className={`text-xs ${muted} ${bn}`}>{category}</span>
                    <Link href={detailUrl}>
                        <h3 style={D ? { color: "#fff" } : undefined} className={`text-xl font-semibold leading-snug transition-colors ${heading} ${bn}`}>{title}</h3>
                    </Link>
                    {product.description && <p className={`line-clamp-2 text-sm leading-6 ${muted} ${bn}`}>{product.description}</p>}
                    {priceLine}
                    <div className="max-w-md">{buttons}</div>
                </div>
            </div>
        );
    }

    return (
        <div className={`group flex h-full w-full flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${card}`}>
            <Link href={detailUrl} className="relative block aspect-[16/10] w-full shrink-0 overflow-hidden bg-white/[0.04]">
                <img src={image} alt={`${title} website design`} loading="lazy" className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                <span className={`absolute left-3 top-3 max-w-[70%] truncate rounded-md border border-white/15 bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md ${bn}`}>
                    {category}
                </span>
            </Link>
            <div className="flex flex-1 flex-col gap-2 p-5">
                <Link href={detailUrl} className="block">
                    <h3 style={D ? { color: "#fff" } : undefined} className={`line-clamp-2 text-[17px] font-semibold leading-snug transition-colors ${heading} ${bn}`}>{title}</h3>
                </Link>
                {priceLine}
                <div className="mt-auto pt-3">{buttons}</div>
            </div>
        </div>
    );
};

export default WebsiteCard;
