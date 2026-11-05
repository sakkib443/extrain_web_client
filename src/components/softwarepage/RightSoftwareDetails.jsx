"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchSoftware } from "../../redux/softwareSlice";
import ProductCard from "../sheard/ProductCard";
import { LuLayoutGrid, LuList, LuArrowUpDown, LuCpu, LuSearch, LuStar, LuBanknote } from "react-icons/lu";
import { useLanguage } from "@/context/LanguageContext";
import { setSelectedCategories } from "@/redux/categorySlice";

// Loading Skeleton (Synced with Course style)
const SoftwareCardSkeleton = () => (
    <div className="w-full animate-pulse">
        <div className="bg-white rounded-md border border-gray-100 overflow-hidden">
            <div className="h-48 bg-gray-100"></div>
            <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-50 rounded w-1/3"></div>
                <div className="h-6 bg-gray-50 rounded w-3/4"></div>
                <div className="h-4 bg-gray-50 rounded w-1/2"></div>
                <div className="h-px bg-gray-50"></div>
                <div className="flex justify-between">
                    <div className="h-8 bg-gray-50 rounded w-1/4"></div>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-4 h-4 bg-gray-50 rounded-full"></div>)}
                    </div>
                </div>
                <div className="flex gap-2 pt-2">
                    <div className="flex-1 h-10 bg-gray-50 rounded-md"></div>
                    <div className="w-24 h-10 bg-gray-50 rounded-md"></div>
                </div>
            </div>
        </div>
    </div>
);

const RightSoftwareDetails = ({ searchQuery, selectedType }) => {
    const dispatch = useDispatch();
    const { softwareList = [], loading = false } = useSelector((state) => state.software || {});
    const { items: categories = [], selectedCategories = [] } = useSelector((state) => state.categories || {});
    const { language } = useLanguage();
    const [sortBy, setSortBy] = useState("default");
    const [priceFilter, setPriceFilter] = useState("all");
    const [ratingFilter, setRatingFilter] = useState("all");
    const [isGridView, setIsGridView] = useState(true);

    useEffect(() => {
        dispatch(fetchSoftware());
    }, [dispatch]);

    // Get category name
    const getCategoryName = (category) => {
        if (!category) return "";
        if (typeof category === "string") return category;
        return category.name || "";
    };

    // Get count per category
    const getCategoryCount = (catName) => {
        return softwareList.filter(s => getCategoryName(s.category) === catName).length;
    };

    // Filter software
    const filteredSoftware = softwareList.filter((item) => {
        if (!item) return false;

        // Software Type filter (Script, Plugin, Full Software)
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

    // Sort software
    const sortedSoftware = [...filteredSoftware].sort((a, b) => {
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

    return (
        <div className="space-y-10">
            {/* Clean Filter Bar with Dropdowns (Synced with Website Page) */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-6">
                {/* Left Side - All Category + Category Dropdown + Price + Rating */}
                <div className="flex flex-wrap items-center gap-3">
                    {/* All Category Button */}
                    <button
                        onClick={() => {
                            dispatch(setSelectedCategories([]));
                            setPriceFilter("all");
                            setRatingFilter("all");
                        }}
                        className={`flex items-center gap-2 px-5 py-2 rounded-md text-[14px] !font-normal transition-all shadow-sm outfit ${selectedCategories.length === 0 && priceFilter === "all" && ratingFilter === "all"
                            ? "bg-[#FD9A00] text-white"
                            : "bg-gray-100 text-slate-500 hover:bg-gray-200"
                            }`}
                    >
                        <LuLayoutGrid size={14} />
                        <span className="!font-normal">{language === 'bn' ? 'সব ক্যাটাগরি' : 'All Category'}</span>
                    </button>

                    {/* Category Dropdown */}
                    <div className="relative min-w-[140px]">
                        <select
                            value={selectedCategories[0] || ""}
                            onChange={(e) => {
                                const val = e.target.value;
                                dispatch(setSelectedCategories(val ? [val] : []));
                            }}
                            className="appearance-none w-full pl-4 pr-9 py-2 bg-gray-50 border border-gray-200 rounded-md text-[14px] !font-normal text-slate-700 cursor-pointer focus:outline-none focus:border-rose-200 outfit"
                        >
                            <option value="">{language === 'bn' ? 'ক্যাটাগরি' : 'Category'}</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat.name}>
                                    {cat.name} ({getCategoryCount(cat.name)})
                                </option>
                            ))}
                        </select>
                        <LuArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    </div>

                    {/* Price Filter Dropdown */}
                    <div className="relative min-w-[120px]">
                        <select
                            value={priceFilter}
                            onChange={(e) => setPriceFilter(e.target.value)}
                            className="appearance-none w-full pl-4 pr-9 py-2 bg-gray-50 border border-gray-200 rounded-md text-[14px] !font-normal text-slate-700 cursor-pointer focus:outline-none focus:border-rose-200 outfit"
                        >
                            <option value="all">{language === 'bn' ? 'দাম' : 'Price'}</option>
                            <option value="free">{language === 'bn' ? 'ফ্রি' : 'Free'}</option>
                            <option value="under-50">{language === 'bn' ? '$৫০ এর নিচে' : 'Under $50'}</option>
                            <option value="50-100">$50 - $100</option>
                            <option value="100-plus">{language === 'bn' ? '$১০০+' : '$100+'}</option>
                        </select>
                        <LuBanknote className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    </div>

                    {/* Rating Filter Dropdown */}
                    <div className="relative min-w-[120px]">
                        <select
                            value={ratingFilter}
                            onChange={(e) => setRatingFilter(e.target.value)}
                            className="appearance-none w-full pl-4 pr-9 py-2 bg-gray-50 border border-gray-200 rounded-md text-[14px] !font-normal text-slate-700 cursor-pointer focus:outline-none focus:border-rose-200 outfit"
                        >
                            <option value="all">{language === 'bn' ? 'রেটিং' : 'Rating'}</option>
                            <option value="4-plus">4+ ⭐</option>
                            <option value="3-plus">3+ ⭐</option>
                            <option value="2-plus">2+ ⭐</option>
                        </select>
                        <LuStar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    </div>
                </div>

                {/* Right Side - Sort Dropdown + View Toggles */}
                <div className="flex items-center gap-3">
                    {/* Sort Dropdown */}
                    <div className="relative min-w-[150px]">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="appearance-none w-full pl-4 pr-9 py-2 bg-gray-50 border border-gray-200 rounded-md text-[14px] !font-normal text-slate-700 cursor-pointer focus:outline-none focus:border-rose-200 outfit"
                        >
                            <option value="default">{language === 'bn' ? 'সবচেয়ে জনপ্রিয়' : 'Most Popular'}</option>
                            <option value="rating">{language === 'bn' ? 'টপ রেটেড' : 'Top Rated'}</option>
                            <option value="price-low">{language === 'bn' ? 'দাম: কম' : 'Price: Low'}</option>
                            <option value="price-high">{language === 'bn' ? 'দাম: বেশি' : 'Price: High'}</option>
                        </select>
                        <LuArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    </div>

                    {/* View Toggles */}
                    <div className="flex items-center gap-1">
                        <button onClick={() => setIsGridView(true)} className={`p-2 rounded-md transition-all ${isGridView ? 'text-slate-900 bg-gray-100' : 'text-slate-300 hover:text-slate-500'}`}><LuLayoutGrid size={18} /></button>
                        <button onClick={() => setIsGridView(false)} className={`p-2 rounded-md transition-all ${!isGridView ? 'text-slate-900 bg-gray-100' : 'text-slate-300 hover:text-slate-500'}`}><LuList size={18} /></button>
                    </div>
                </div>
            </div>



            {/* Grid display */}
            {loading ? (
                <div className={`grid gap-8 ${isGridView ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <SoftwareCardSkeleton key={i} />
                    ))}
                </div>
            ) : sortedSoftware.length > 0 ? (
                <div className={`grid gap-8 ${isGridView ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                    {sortedSoftware.map((item) => (
                        <ProductCard key={item._id} product={item} type="software" view={isGridView ? 'grid' : 'list'} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-32 flex flex-col items-center justify-center space-y-6">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-slate-200 border border-gray-100">
                        <LuSearch size={48} />
                    </div>
                    <div className="space-y-2">
                        <p className="text-2xl font-normal text-slate-800 outfit">
                            {language === 'bn' ? 'কোনো টেম্পলেট পাওয়া যায়নি' : 'No templates found'}
                        </p>
                        <p className="text-slate-400 text-sm work font-normal">
                            {language === 'bn' ? 'অন্য কোনো কি-ওয়ার্ড বা ফিল্টার দিয়ে চেষ্টা করুন' : 'Try different keywords or filters'}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RightSoftwareDetails;
