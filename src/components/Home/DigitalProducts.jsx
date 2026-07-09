"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSoftware } from '@/redux/softwareSlice';
import { fetchWebsites } from '@/redux/websiteSlice';
import { fetchCategories } from '@/redux/categorySlice';
import ProductCard from '@/components/sheard/ProductCard';
import { useLanguage } from '@/context/LanguageContext';
import { LuGlobe, LuArrowRight, LuLayoutList, LuCode, LuLayers } from 'react-icons/lu';
import Link from 'next/link';

const DigitalProducts = () => {
    const dispatch = useDispatch();
    const { softwareList = [], loading: softwareLoading } = useSelector((state) => state.software || {});
    const { websiteList = [], loading: websiteLoading } = useSelector((state) => state.websites || {});
    const { items: allCategories = [], status: categoryStatus } = useSelector((state) => state.categories || {});
    const { language } = useLanguage();

    const [activeType, setActiveType] = useState('website');
    const [selectedSubCategory, setSelectedSubCategory] = useState('all');

    const bengaliClass = language === "bn" ? "hind-siliguri" : "";

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

    return (
        <section className="py-24 bg-[#FAFAFA] dark:bg-[#0A0A0A] relative overflow-hidden">
            {/* Background Texture - Elite Grid */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-[#0CB2A9]/5 to-transparent rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-[#90b800]/5 to-transparent rounded-full blur-[120px]" />
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
                    style={{ backgroundImage: 'linear-gradient(#0CB2A9 0.5px, transparent 0.5px), linear-gradient(90deg, #0CB2A9 0.5px, transparent 0.5px)', backgroundSize: '40px 40px' }}
                />
            </div>

            <div className="container mx-auto px-4 lg:px-16 relative z-10">

                {/* Header Section */}
                {/* Left-Aligned Modern Header */}
                <div className="flex flex-col items-center text-center mb-8 px-2">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="w-10 h-[2px] bg-[#0CB2A9]" />
                        <span className={`text-[10px] font-black text-[#0CB2A9] uppercase tracking-[0.4em] ${bengaliClass}`}>
                            {language === 'bn' ? 'আওয়ার কালেকশন' : 'Our Collection'}
                        </span>
                        <div className="w-10 h-[2px] bg-[#0CB2A9]" />
                    </div>

                    <h2 className={`text-4xl lg:text-5xl font-black text-gray-950 dark:text-white mb-2 uppercase leading-[0.85] tracking-tighter max-w-3xl font-poppins ${bengaliClass}`}>
                        {language === 'bn' ? 'পছন্দের' : 'Premium'}{' '}
                        <span className="text-[#0CB2A9]">{language === 'bn' ? 'ডিজিটাল প্রোডাক্টস' : 'Digital Products'}</span>
                    </h2>

                    <div className="w-20 h-1 bg-gray-100 dark:bg-white/10 mb-2" />

                    <p className={`text-gray-500 dark:text-gray-400 text-sm lg:text-base max-w-2xl leading-relaxed ${bengaliClass}`}>
                        {language === 'bn'
                            ? 'আমাদের প্রিমিয়াম সফটওয়্যার এবং রেডিমেড ওয়েবসাইট কালেকশন এক্সপ্লোর করুন যা আপনার ব্যবসা বাড়াতে সাহায্য করবে।'
                            : 'Explore our curated collection of elite software and ready-made websites designed for professional scale.'}
                    </p>
                </div>

                {/* Professional Filter Row - Left Aligned */}
                <div className="flex flex-wrap items-center gap-4 mb-6 px-2">
                    {/* Main Type Toggles */}
                    <div className="flex p-1 bg-slate-100 dark:bg-slate-900/50 rounded-md border border-slate-200 dark:border-slate-800 backdrop-blur-md">
                        <button
                            onClick={() => setActiveType('website')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-[13px] font-medium transition-all duration-300 ${activeType === 'website'
                                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                                }`}
                        >
                            <LuGlobe className="w-4 h-4" />
                            <span className={bengaliClass}>{language === 'bn' ? 'ওয়েবসাইট' : 'Websites'}</span>
                        </button>
                    </div>

                    {/* Vertical Divider for Desktop */}
                    <div className="hidden lg:block w-[1px] h-8 bg-gray-200 dark:bg-white/10 mx-2" />

                    {/* Sub-Category Filters - Same Row */}
                    {subCategories.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedSubCategory('all')}
                                className={`px-4 py-2.5 rounded-md text-[13px] font-medium border transition-all duration-300 ${selectedSubCategory === 'all'
                                    ? 'bg-[#0CB2A9] text-black border-[#0CB2A9] shadow-lg shadow-[#0CB2A9]/20'
                                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-[#0CB2A9] hover:text-[#0CB2A9]'
                                    }`}
                            >
                                {language === 'bn' ? 'সবগুলো' : 'All Items'}
                            </button>
                            {subCategories.map((sub) => (
                                <button
                                    key={sub._id}
                                    onClick={() => setSelectedSubCategory(sub._id)}
                                    className={`px-4 py-2.5 rounded-md text-[13px] font-medium border transition-all duration-300 ${selectedSubCategory === sub._id
                                        ? 'bg-[#0CB2A9] text-black border-[#0CB2A9] shadow-lg shadow-[#0CB2A9]/20'
                                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-[#0CB2A9] hover:text-[#0CB2A9]'
                                        }`}
                                >
                                    <span className={bengaliClass}>{sub.name}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
                    {isLoading ? (
                        [...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white dark:bg-gray-900 rounded-3xl p-4 border border-gray-100 dark:border-gray-800 h-[420px] shadow-sm animate-pulse">
                                <div className="w-full h-56 bg-gray-100 dark:bg-gray-800 rounded-2xl mb-6" />
                                <div className="h-5 bg-gray-100 dark:bg-gray-800 rounded-lg w-3/4 mb-4" />
                                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-lg w-1/2" />
                            </div>
                        ))
                    ) : (
                        displayList.length > 0 ? (
                            displayList.map((item) => (
                                <div key={item._id}>
                                    <ProductCard product={item} type={activeType} />
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 bg-white dark:bg-gray-900 rounded-[2.5rem] border-2 border-dashed border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center text-center px-6">
                                <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                                    <LuLayers className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                                </div>
                                <h3 className={`text-xl font-bold text-gray-900 dark:text-white mb-2 ${bengaliClass}`}>
                                    {language === 'bn' ? 'কোনো পণ্য খুঁজে পাওয়া যায়নি' : 'No Products Found'}
                                </h3>
                                <p className={`text-gray-500 dark:text-gray-400 ${bengaliClass}`}>
                                    {language === 'bn' ? 'দুঃখিত, এই ক্যাটাগরিতে বর্তমানে কোনো পণ্য নেই।' : 'Sorry, there are no products matching your criteria currently.'}
                                </p>
                            </div>
                        )
                    )}
                </div>

                {/* Professional Left-Aligned Footer Link */}
                <div className="text-left px-2">
                    <Link
                        href="/website"
                        className="inline-flex items-center gap-4 px-8 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium rounded-md border border-slate-200 dark:border-slate-800 hover:border-[#0CB2A9] transition-all duration-300 group shadow-sm font-poppins"
                    >
                        <span className={bengaliClass}>
                            {language === 'bn' ? 'সবগুলো প্রোডাক্ট দেখুন' : 'Explore Full Collection'}
                        </span>
                        <div className="w-8 h-8 rounded bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-[#0CB2A9] group-hover:text-black transition-all duration-300">
                            <LuArrowRight className="w-4 h-4" />
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default DigitalProducts;
