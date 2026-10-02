'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/redux/cartSlice';
import {
    LuShoppingCart,
    LuEye,
    LuCheck,
    LuClock,
    LuUsers,
    LuLayoutGrid,
    LuLayers,
    LuList,
    LuHeart
} from 'react-icons/lu';
import { FaStar } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/providers/ThemeProvider";

// theme="dark" → the black site theme (home + website page). The default "light" is unchanged (software page, category pages).
const ProductCard = ({ product, type, view = "grid", theme = "light" }) => {
    const dispatch = useDispatch();
    const [isAdded, setIsAdded] = useState(false);
    const { isDark } = useTheme();
    const { language } = useLanguage();
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";
    const D = theme === "dark";

    const detailUrl = `/${type}/${product._id}`;

    // Get first image from images array or fallback
    const productImage = product.images?.[0] || product.image || "/images/placeholder.png";

    // Calculate discount percentage
    const hasDiscount = product.offerPrice && product.offerPrice > 0 && product.offerPrice < product.price;

    // Display Price logic
    const displayPrice = hasDiscount ? product.offerPrice : product.price;
    const originalPrice = product.price;

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(addToCart({
            id: product._id,
            title: product.title || product.name,
            price: displayPrice,
            image: productImage,
            type: type
        }));
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    // Fields
    const title = product.title || product.name || "Untitled Product";
    const categoryName = product.category?.name || (type === 'website' ? 'Website' : 'Software');
    const version = product.version || 'v1.0';
    const sales = product.totalOrders || product.salesCount || 0;
    const rating = product.rating || 0;
    const reviewsCount = product.reviews?.length || 0;
    const lastUpdated = product.updatedAt ? new Date(product.updatedAt).toLocaleDateString() : "Recently Updated";

    // List View Rendering
    if (view === "list") {
        return (
            <div className={D ? "group w-full flex flex-col md:flex-row bg-white/[0.03] rounded-2xl border border-white/10 overflow-hidden hover:border-[#F8921C]/60 hover:shadow-[0_24px_50px_-28px_rgba(248,146,28,0.55)] transition-all duration-300" : "group w-full flex flex-col md:flex-row bg-white dark:bg-[#0d0d0d] rounded-md border border-gray-100 dark:border-white/10 overflow-hidden hover:shadow-xl transition-all duration-300"}>
                {/* Left: Image (35%) */}
                <div className="relative w-full md:w-[35%] h-56 md:h-auto shrink-0 overflow-hidden p-3">
                    <Link href={detailUrl} className="block h-full w-full">
                        <img
                            src={productImage}
                            alt={`${title} - Professional ${type === 'website' ? 'Website Design' : 'Software Application'} in Bangladesh`}
                            className="h-full w-full object-cover rounded-lg transition-transform duration-700 group-hover:scale-105"
                        />
                    </Link>
                    {/* Eye Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[1px]">
                        <Link href={detailUrl} className="w-12 h-12 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/50 hover:bg-[#FD9A00] hover:border-[#FD9A00] transition-colors">
                            <LuEye className="ml-1" size={20} />
                        </Link>
                    </div>
                </div>

                {/* Middle: Content (40%) */}
                <div className={D ? "flex-1 p-6 border-r border-white/10 flex flex-col justify-center" : "flex-1 p-6 border-r border-gray-50 flex flex-col justify-center"}>
                    <Link href={detailUrl}>
                        <h3 style={D ? { color: "#fff" } : undefined} className={`text-xl font-bold leading-tight mb-2 transition-colors ${D ? "text-white" : "text-slate-800 hover:text-[#FD9A00]"} ${bengaliClass}`}>
                            {title}
                        </h3>
                    </Link>
                    <div className={D ? "flex items-center gap-2 mb-4 text-sm text-white/50" : "flex items-center gap-2 mb-4 text-sm text-slate-500"}>
                        <span className="italic">in</span>
                        <span className={D ? "font-medium text-white/80 bg-white/10 px-2 py-0.5 rounded text-xs uppercase tracking-wide" : "font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-xs uppercase tracking-wide"}>
                            {categoryName}
                        </span>
                    </div>

                    <ul className="space-y-2 mb-4">
                        <li className={D ? "flex items-start gap-2 text-sm text-white/65" : "flex items-start gap-2 text-sm text-slate-600"}>
                            <LuLayers className="text-[#FD9A00] mt-0.5 shrink-0" size={16} />
                            <span>Version: {version}</span>
                        </li>
                        <li className={D ? "flex items-start gap-2 text-sm text-white/65" : "flex items-start gap-2 text-sm text-slate-600"}>
                            <LuUsers className="text-[#FD9A00] mt-0.5 shrink-0" size={16} />
                            <span>{sales}+ Sales</span>
                        </li>
                        <li className={D ? "flex items-start gap-2 text-sm text-white/65" : "flex items-start gap-2 text-sm text-slate-600"}>
                            <LuCheck className="text-[#FD9A00] mt-0.5 shrink-0" size={16} />
                            <span>Lifetime Updates</span>
                        </li>
                    </ul>
                </div>

                {/* Right: Actions (25%) */}
                <div className={D ? "w-full md:w-[25%] p-6 bg-white/[0.02] flex flex-col items-center justify-center text-center gap-1 border-l border-white/10" : "w-full md:w-[25%] p-6 bg-gray-50/50 flex flex-col items-center justify-center text-center gap-1 border-l border-gray-100"}>
                    {/* Icons Top Right */}
                    <div className={D ? "flex w-full justify-end gap-2 mb-2 text-white/40" : "flex w-full justify-end gap-2 mb-2 text-slate-400"}>
                        <button className="hover:text-[#FD9A00]"><LuList size={18} /></button>
                        <button className="hover:text-amber-500"><LuHeart size={18} /></button>
                    </div>

                    <div className="text-3xl font-bold text-[#FD9A00] font-outfit mb-1">
                        ৳{displayPrice?.toLocaleString()}
                    </div>

                    <div className="flex text-amber-500 gap-0.5 text-xs mb-1">
                        {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={i < Math.round(rating) ? "fill-current" : D ? "text-white/20" : "text-slate-200"} />
                        ))}
                        <span className={D ? "text-white/45 ml-1" : "text-slate-400 ml-1"}>({reviewsCount})</span>
                    </div>

                    <p className={D ? "text-xs text-white/55 mb-1" : "text-xs text-slate-500 mb-1"}>{sales}+ Sales</p>
                    <p className={D ? "text-[10px] text-white/35 mb-4" : "text-[10px] text-slate-400 mb-4"}>Last updated: {lastUpdated}</p>

                    <div className="flex items-center gap-3 w-full">
                        <button
                            onClick={handleAddToCart}
                            disabled={isAdded}
                            className={`p-2.5 border rounded-md transition-colors ${isAdded ? 'bg-emerald-500 border-emerald-500 text-white' : (D ? 'bg-white/10 border-white/15 text-white/80 hover:text-[#F8921C] hover:border-[#F8921C]' : 'bg-white border-slate-200 text-slate-600 hover:text-[#FD9A00] hover:border-[#FD9A00]')}`}
                        >
                            {isAdded ? <LuCheck size={20} /> : <LuShoppingCart size={20} />}
                        </button>
                        <a
                            href={product.previewUrl || detailUrl}
                            target={product.previewUrl ? "_blank" : "_self"}
                            rel="noopener noreferrer"
                            className={D ? "flex-1 py-2.5 bg-transparent border border-[#F8921C] text-[#F8921C] rounded-md text-[14px] font-bold hover:bg-[#F8921C] hover:text-black transition-all flex items-center justify-center gap-2 uppercase tracking-wide font-poppins" : "flex-1 py-2.5 bg-white border border-[#FD9A00] text-[#FD9A00] rounded-md text-[14px] font-bold hover:bg-[#FD9A00] hover:text-white transition-all flex items-center justify-center gap-2 uppercase tracking-wide font-poppins"}
                        >
                            <LuEye size={18} />
                            {language === 'bn' ? 'লাইভ প্রিভিউ' : 'Live View'}
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    // Grid View Rendering
    return (
        <div className="group w-full h-full flex flex-col">
            <div className={D ? "relative h-full bg-white/[0.03] rounded-2xl border border-white/10 overflow-hidden transition-all duration-300 flex flex-col group-hover:-translate-y-1.5 group-hover:border-[#F8921C]/60 group-hover:shadow-[0_24px_50px_-28px_rgba(248,146,28,0.55)]" : "relative h-full bg-white dark:bg-[#0d0d0d] rounded-xl border border-gray-100 dark:border-white/10 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"}>

                {/* Image Section */}
                <div className="relative h-48 w-full overflow-hidden shrink-0">
                    <Link href={detailUrl} className="block h-full w-full">
                        <img
                            src={productImage}
                            alt={`${title} - Premium ${type === 'website' ? 'Website Template' : 'Software Solution'} for Business`}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </Link>

                    {/* Type Badge (Top Left) */}
                    <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 rounded bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider">
                            {type}
                        </span>
                    </div>

                    {/* Rating Badge (Top Right) */}
                    <div className={D ? "absolute top-3 right-3 bg-black/55 border border-white/15 backdrop-blur-md rounded px-1.5 py-0.5 flex items-center gap-1" : "absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded px-1.5 py-0.5 flex items-center gap-1 shadow-sm"}>
                        <FaStar className="text-amber-500 text-[10px]" />
                        <span className={D ? "text-[10px] font-bold text-white" : "text-[10px] font-bold text-slate-800"}>{rating}</span>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-4 flex flex-col flex-1">
                    {/* Category */}
                    <span className={`text-[10px] font-bold uppercase tracking-wide mb-1 ${D ? "text-white/45" : "text-slate-400"} ${bengaliClass}`}>
                        {categoryName}
                    </span>

                    {/* Title */}
                    <Link href={detailUrl} className="mb-2 block">
                        <h3 style={D ? { color: "#fff" } : undefined} className={`text-lg lg:text-xl font-black leading-tight line-clamp-2 transition-colors font-poppins uppercase ${D ? "text-white group-hover:text-[#F8921C]" : "text-slate-900 dark:text-white hover:text-black dark:hover:text-[#0CB2A9]"} ${bengaliClass}`}>
                            {title}
                        </h3>
                    </Link>

                    {/* Metadata (Sales) */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className={D ? "flex items-center gap-1 bg-white/5 border border-white/10 px-2 py-1 rounded text-[10px] font-bold text-white/65 font-poppins" : "flex items-center gap-1 bg-slate-100 dark:bg-white/5 px-2 py-1 rounded text-[10px] font-bold text-slate-600 dark:text-slate-400 font-poppins"}>
                            <LuUsers size={12} className={D ? "text-[#F8921C]" : "text-[#0CB2A9]"} />
                            <span>{sales.toLocaleString()} Units Sold</span>
                        </div>
                        <div className={D ? "flex items-center gap-1 bg-white/5 border border-white/10 px-2 py-1 rounded text-[10px] font-bold text-white/65 font-poppins" : "flex items-center gap-1 bg-slate-100 dark:bg-white/5 px-2 py-1 rounded text-[10px] font-bold text-slate-600 dark:text-slate-400 font-poppins"}>
                            <LuLayers size={12} className={D ? "text-[#F8921C]" : "text-[#0CB2A9]"} />
                            <span>Version {version}</span>
                        </div>
                    </div>

                    {/* Price & Actions */}
                    <div className={D ? "mt-auto flex items-center justify-between pt-4 border-t border-white/10" : "mt-auto flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/5"}>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2 leading-none">
                                <span className={D ? "text-2xl font-black text-[#F8921C] font-poppins" : "text-2xl font-black text-slate-950 dark:text-[#0CB2A9] font-poppins"}>
                                    ৳{displayPrice?.toLocaleString()}
                                </span>
                                {hasDiscount && (
                                    <span className={D ? "text-xs text-white/40 line-through font-medium mt-1" : "text-xs text-slate-400 line-through font-medium mt-1"}>
                                        ৳{originalPrice?.toLocaleString()}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleAddToCart}
                                disabled={isAdded}
                                className={`p-2.5 rounded-lg transition-all ${isAdded
                                    ? 'bg-emerald-500 text-white'
                                    : (D ? 'bg-white/10 text-white/80 hover:bg-white/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700')
                                    }`}
                                title="Add to Cart"
                            >
                                {isAdded ? <LuCheck size={18} /> : <LuShoppingCart size={18} />}
                            </button>
                            <a
                                href={product.previewUrl || detailUrl}
                                target={product.previewUrl ? "_blank" : "_self"}
                                rel="noopener noreferrer"
                                className={D ? "inline-flex items-center gap-2 px-5 py-2.5 bg-[#F8921C] text-black rounded-lg hover:bg-[#e07d0a] transition-all text-[14px] font-bold uppercase tracking-wider font-poppins" : "inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-200 transition-all text-[14px] font-bold uppercase tracking-wider font-poppins"}
                                title={product.previewUrl ? "Live Preview" : "View Details"}
                            >
                                <LuEye size={18} />
                                <span>{language === 'bn' ? 'লাইভ প্রিভিউ' : 'Live View'}</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
