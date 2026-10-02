"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { fetchWebsites } from "../../redux/websiteSlice";
import { setSelectedCategories } from "@/redux/categorySlice";
import ProductCard from "../sheard/ProductCard";
import { LuLayoutGrid, LuList, LuArrowUpDown, LuGlobe, LuStar, LuBanknote, LuX } from "react-icons/lu";
import { useLanguage } from "@/context/LanguageContext";

const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    show: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.65, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
    }),
};
const viewport = { once: true, amount: 0.12 };

// Loading skeleton (black theme)
const WebsiteCardSkeleton = () => (
    <div className="w-full animate-pulse">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
            <div className="aspect-[16/10] bg-white/[0.06]"></div>
            <div className="space-y-3 p-4">
                <div className="h-4 w-1/3 rounded bg-white/[0.06]"></div>
                <div className="h-6 w-3/4 rounded bg-white/[0.06]"></div>
                <div className="h-4 w-1/2 rounded bg-white/[0.06]"></div>
                <div className="h-px bg-white/10"></div>
                <div className="flex justify-between">
                    <div className="h-8 w-1/4 rounded bg-white/[0.06]"></div>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-4 w-4 rounded-full bg-white/[0.06]"></div>)}
                    </div>
                </div>
                <div className="flex gap-2 pt-2">
                    <div className="h-10 flex-1 rounded-full bg-white/[0.06]"></div>
                    <div className="h-10 w-24 rounded-full bg-white/[0.06]"></div>
                </div>
            </div>
        </div>
    </div>
);

// Dark dropdown. It turns orange when a value other than the default is chosen.
const FilterSelect = ({ icon: Icon, active, wrapClass = "", selectClass = "", children, ...props }) => (
    <div className={`relative ${wrapClass}`}>
        <select
            {...props}
            style={{ colorScheme: "dark" }}
            className={`h-10 w-full cursor-pointer appearance-none rounded-lg border pl-3.5 pr-9 text-[13.5px] outline-none transition-colors focus:border-[#F8921C] ${
                active
                    ? "border-[#F8921C]/70 bg-[#F8921C]/10 text-white"
                    : "border-white/10 bg-white/[0.05] text-white/80 hover:border-white/25"
            } ${selectClass}`}
        >
            {children}
        </select>
        <Icon
            className={`pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors ${active ? "text-[#F8921C]" : "text-white/40"}`}
            size={14}
        />
    </div>
);

const Opt = (props) => <option {...props} className="bg-[color:var(--tone-soft)] text-white" />;

const RightWebsiteDetails = ({ searchQuery, selectedType, setSearchQuery }) => {
    const dispatch = useDispatch();
    const { websiteList = [], loading = false } = useSelector((state) => state.websites || {});
    const { items: categories = [], selectedCategories = [] } = useSelector((state) => state.categories || {});
    const { language } = useLanguage();
    const isBn = language === "bn";
    const bn = isBn ? "hind-siliguri" : "";
    const [sortBy, setSortBy] = useState("default");
    const [priceFilter, setPriceFilter] = useState("all");
    const [ratingFilter, setRatingFilter] = useState("all");
    const [isGridView, setIsGridView] = useState(true);

    useEffect(() => {
        dispatch(fetchWebsites());
    }, [dispatch]);

    // Get category name
    const getCategoryName = (category) => {
        if (!category) return "";
        if (typeof category === "string") return category;
        return category.name || "";
    };

    // Get count per category
    const getCategoryCount = (catName) => {
        return websiteList.filter(w => getCategoryName(w.category) === catName).length;
    };

    // Filter websites
    const filteredWebsites = websiteList.filter((item) => {
        if (!item) return false;

        // Website Type filter (Static, Dynamic, Full System)
        const typeMatch = selectedType === "All" || item?.type === selectedType;

        // Category filter
        let categoryMatch = true;
        if (selectedCategories.length > 0) {
            const itemCategoryName = getCategoryName(item.category);
            categoryMatch = selectedCategories.includes(itemCategoryName);
        }

        // Search filter
        const q = (searchQuery || "").trim().toLowerCase();
        const searchMatch =
            q === "" ||
            (item.title && item.title.toLowerCase().includes(q)) ||
            (item.name && item.name.toLowerCase().includes(q)) ||
            getCategoryName(item.category).toLowerCase().includes(q);

        // Price filter
        const price = item.offerPrice || item.price || 0;
        let priceMatch = true;
        if (priceFilter === "free") priceMatch = price === 0;
        else if (priceFilter === "under-50") priceMatch = price > 0 && price <= 50;
        else if (priceFilter === "50-100") priceMatch = price > 50 && price <= 100;
        else if (priceFilter === "100-plus") priceMatch = price > 100;

        // Rating filter
        const rating = item.rating || 0;
        let ratingMatch = true;
        if (ratingFilter === "4-plus") ratingMatch = rating >= 4;
        else if (ratingFilter === "3-plus") ratingMatch = rating >= 3;
        else if (ratingFilter === "2-plus") ratingMatch = rating >= 2;

        return typeMatch && categoryMatch && searchMatch && priceMatch && ratingMatch;
    });

    // Sort websites
    const sortedWebsites = [...filteredWebsites].sort((a, b) => {
        switch (sortBy) {
            case "price-low":
                return (a.offerPrice || a.price) - (b.offerPrice || b.price);
            case "price-high":
                return (b.offerPrice || b.price) - (a.offerPrice || a.price);
            case "rating":
                return (b.rating || 0) - (a.rating || 0);
            default:
                return 0;
        }
    });

    const resetFilters = () => {
        dispatch(setSelectedCategories([]));
        setPriceFilter("all");
        setRatingFilter("all");
    };
    const filtersAtDefault = selectedCategories.length === 0 && priceFilter === "all" && ratingFilter === "all";
    const hasSearch = (searchQuery || "").trim() !== "";

    const gridClass = isGridView ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1";

    return (
        <div className="space-y-7">
            {/* ===== Filter bar ===== */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-[color:var(--tone-deep)]/60 p-2.5 sm:p-3">
                {/* Left Side - All Category + Category Dropdown + Price + Rating */}
                <div className="flex flex-wrap items-center gap-2">
                    {/* All Category chip */}
                    <button
                        type="button"
                        onClick={resetFilters}
                        className={`flex h-10 items-center gap-2 rounded-lg border px-4 text-[13.5px] font-semibold transition-all ${bn} ${
                            filtersAtDefault
                                ? "border-[#F8921C] bg-[#F8921C] text-black"
                                : "border-white/10 bg-white/[0.05] text-white/70 hover:border-[#F8921C]/60 hover:text-white"
                        }`}
                    >
                        <LuLayoutGrid size={14} />
                        <span>{isBn ? 'সব ক্যাটাগরি' : 'All Category'}</span>
                    </button>

                    {/* Category Dropdown */}
                    <FilterSelect
                        icon={LuArrowUpDown}
                        active={selectedCategories.length > 0}
                        wrapClass="min-w-[140px]"
                        selectClass={bn}
                        value={selectedCategories[0] || ""}
                        onChange={(e) => {
                            const val = e.target.value;
                            dispatch(setSelectedCategories(val ? [val] : []));
                        }}
                    >
                        <Opt value="">{isBn ? 'ক্যাটাগরি' : 'Category'}</Opt>
                        {categories.map((cat) => (
                            <Opt key={cat._id} value={cat.name}>
                                {cat.name} ({getCategoryCount(cat.name)})
                            </Opt>
                        ))}
                    </FilterSelect>

                    {/* Price Filter Dropdown */}
                    <FilterSelect
                        icon={LuBanknote}
                        active={priceFilter !== "all"}
                        wrapClass="min-w-[120px]"
                        selectClass={bn}
                        value={priceFilter}
                        onChange={(e) => setPriceFilter(e.target.value)}
                    >
                        <Opt value="all">{isBn ? 'দাম' : 'Price'}</Opt>
                        <Opt value="free">{isBn ? 'ফ্রি' : 'Free'}</Opt>
                        <Opt value="under-50">{isBn ? '$৫০ এর নিচে' : 'Under $50'}</Opt>
                        <Opt value="50-100">$50 - $100</Opt>
                        <Opt value="100-plus">{isBn ? '$১০০+' : '$100+'}</Opt>
                    </FilterSelect>

                    {/* Rating Filter Dropdown */}
                    <FilterSelect
                        icon={LuStar}
                        active={ratingFilter !== "all"}
                        wrapClass="min-w-[120px]"
                        selectClass={bn}
                        value={ratingFilter}
                        onChange={(e) => setRatingFilter(e.target.value)}
                    >
                        <Opt value="all">{isBn ? 'রেটিং' : 'Rating'}</Opt>
                        <Opt value="4-plus">4+ ⭐</Opt>
                        <Opt value="3-plus">3+ ⭐</Opt>
                        <Opt value="2-plus">2+ ⭐</Opt>
                    </FilterSelect>
                </div>

                {/* Right Side - Count + Sort Dropdown + View Toggles */}
                <div className="flex items-center gap-2">
                    <span className={`mr-1 hidden whitespace-nowrap text-[13px] text-white/50 md:inline ${bn}`}>
                        <b className="font-semibold text-white">{loading ? "…" : sortedWebsites.length}</b> {isBn ? "টি ওয়েবসাইট" : "websites"}
                    </span>
                    {/* Sort Dropdown */}
                    <FilterSelect
                        icon={LuArrowUpDown}
                        active={sortBy !== "default"}
                        wrapClass="min-w-[150px]"
                        selectClass={bn}
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <Opt value="default">{isBn ? 'সবচেয়ে জনপ্রিয়' : 'Most Popular'}</Opt>
                        <Opt value="rating">{isBn ? 'টপ রেটেড' : 'Top Rated'}</Opt>
                        <Opt value="price-low">{isBn ? 'দাম: কম' : 'Price: Low'}</Opt>
                        <Opt value="price-high">{isBn ? 'দাম: বেশি' : 'Price: High'}</Opt>
                    </FilterSelect>

                    {/* View Toggles */}
                    <div className="flex h-10 items-center gap-1 rounded-lg border border-white/10 bg-white/[0.05] p-1">
                        <button
                            type="button"
                            onClick={() => setIsGridView(true)}
                            aria-label={isBn ? "গ্রিড ভিউ" : "Grid view"}
                            aria-pressed={isGridView}
                            className={`grid h-8 w-8 place-items-center rounded-md transition-all ${isGridView ? "bg-[#F8921C] text-black" : "text-white/50 hover:text-white"}`}
                        >
                            <LuLayoutGrid size={16} />
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsGridView(false)}
                            aria-label={isBn ? "লিস্ট ভিউ" : "List view"}
                            aria-pressed={!isGridView}
                            className={`grid h-8 w-8 place-items-center rounded-md transition-all ${!isGridView ? "bg-[#F8921C] text-black" : "text-white/50 hover:text-white"}`}
                        >
                            <LuList size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* ===== Grid display ===== */}
            {loading ? (
                <div className={`grid gap-6 lg:gap-7 ${gridClass}`}>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <WebsiteCardSkeleton key={i} />
                    ))}
                </div>
            ) : sortedWebsites.length > 0 ? (
                <div className={`grid gap-6 lg:gap-7 ${gridClass}`}>
                    {sortedWebsites.map((item, i) => (
                        <motion.div
                            key={item._id}
                            variants={fadeUp}
                            custom={isGridView ? i % 3 : 0}
                            initial="hidden"
                            whileInView="show"
                            viewport={viewport}
                            className="h-full"
                        >
                            <ProductCard product={item} type="website" view={isGridView ? 'grid' : 'list'} theme="dark" />
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center space-y-6 py-24 text-center">
                    <div className="grid h-24 w-24 place-items-center rounded-full border border-[#F8921C]/30 bg-[#F8921C]/10 text-[#F8921C]">
                        <LuGlobe size={44} />
                    </div>
                    <div className="space-y-2">
                        <p className={`text-2xl font-semibold text-white ${bn}`}>
                            {isBn ? 'কোনো ওয়েবসাইট পাওয়া যায়নি' : 'No websites found'}
                        </p>
                        <p className={`text-sm text-white/60 ${bn}`}>
                            {isBn ? 'অন্য কোনো কি-ওয়ার্ড বা ফিল্টার দিয়ে চেষ্টা করুন' : 'Try different keywords or filters'}
                        </p>
                    </div>
                    {(!filtersAtDefault || hasSearch) && (
                        <button
                            type="button"
                            onClick={() => {
                                resetFilters();
                                if (setSearchQuery) setSearchQuery("");
                            }}
                            className={`inline-flex items-center gap-2 rounded-full bg-[#F8921C] px-7 py-3 text-sm font-semibold text-black transition-colors hover:bg-[#e07d0a] ${bn ? "" : "uppercase tracking-wide"} ${bn}`}
                        >
                            <LuX size={16} />
                            {isBn ? 'ফিল্টার মুছুন' : 'Clear All Filters'}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default RightWebsiteDetails;
