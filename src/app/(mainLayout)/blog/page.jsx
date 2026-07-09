'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
    FiClock,
    FiTrendingUp,
    FiBookOpen,
    FiArrowRight,
    FiChevronLeft,
    FiChevronRight,
} from 'react-icons/fi';
import { API_BASE_URL } from '@/config/api';
import { useLanguage } from '@/context/LanguageContext';

export default function BlogPage() {
    const { language } = useLanguage();
    const [blogs, setBlogs] = useState([]);
    const [featuredBlogs, setFeaturedBlogs] = useState([]);
    const [popularBlogs, setPopularBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [activeTab, setActiveTab] = useState('popular');
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";

    // Translations
    const t = {
        bn: {
            popular: 'জনপ্রিয়',
            recent: 'সাম্প্রতিক',
            editorsPick: 'সম্পাদকের পছন্দ',
            trending: 'ট্রেন্ডিং',
            aboutUs: 'আমাদের সম্পর্কে',
            aboutDesc: 'আমরা প্রযুক্তি, ডিজাইন এবং ক্যারিয়ার সম্পর্কে মানসম্মত কন্টেন্ট তৈরি করি। আমাদের লক্ষ্য হলো আপনাদের সাথে সেরা জ্ঞান শেয়ার করা।',
            popularPosts: 'জনপ্রিয় পোস্ট',
            followUs: 'আমাদের ফলো করুন',
            noBlogsFound: 'কোনো ব্লগ পাওয়া যায়নি',
            comingSoon: 'শীঘ্রই নতুন কন্টেন্ট আসছে!',
            min: 'মিনিট',
            heroTitle: 'ব্লগ',
            heroSubtitle: 'প্রযুক্তি, ডিজাইন এবং ক্যারিয়ার সম্পর্কে আমাদের সেরা আর্টিকেল পড়ুন',
        },
        en: {
            popular: 'Popular',
            recent: 'Recent',
            editorsPick: "Editor's Pick",
            trending: 'Trending',
            aboutUs: 'About Us',
            aboutDesc: 'We create quality content about technology, design, and career. Our goal is to share the best knowledge with you.',
            popularPosts: 'Popular Posts',
            followUs: 'Follow Us',
            noBlogsFound: 'No blogs found',
            comingSoon: 'New content coming soon!',
            min: 'min',
            heroTitle: 'Blog',
            heroSubtitle: 'Read our best articles about technology, design and career',
        }
    };

    const text = t[language] || t.bn;

    useEffect(() => {
        const fetchBlogs = async () => {
            setLoading(true);
            try {
                let url = `${API_BASE_URL}/blogs?status=published&page=${currentPage}&limit=9`;

                const res = await fetch(url);
                const data = await res.json();
                if (data.success) {
                    setBlogs(data.data || []);
                    setTotalPages(data.meta?.totalPages || 1);
                }

                const featuredRes = await fetch(`${API_BASE_URL}/blogs/featured?limit=5`);
                const featuredData = await featuredRes.json();
                if (featuredData.success) setFeaturedBlogs(featuredData.data || []);

                const popularRes = await fetch(`${API_BASE_URL}/blogs/popular?limit=5`);
                const popularData = await popularRes.json();
                if (popularData.success) setPopularBlogs(popularData.data || []);
            } catch (error) {
                console.error('Failed to fetch blogs:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, [currentPage]);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-[#FD9A00]/30 border-t-[#FD9A00] rounded-full"
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300 selection:bg-[#FD9A00] selection:text-black">

            {/* Unified Filtered Background - Spans entire page */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
                    style={{ backgroundImage: 'linear-gradient(#000 0.5px, transparent 0.5px), linear-gradient(90deg, #000 0.5px, transparent 0.5px)', backgroundSize: '40px 40px' }}
                />
            </div>

            {/* Ambient Animated Blobs */}
            <motion.div
                animate={{ x: [0, 50, 0], y: [0, 30, 0], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="fixed top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#FD9A00]/5 rounded-full blur-[120px] pointer-events-none z-0"
            />
            <motion.div
                animate={{ x: [0, -30, 0], y: [0, -50, 0], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear", delay: 2 }}
                className="fixed bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#FD9A00]/5 rounded-full blur-[100px] pointer-events-none z-0"
            />

            {/* Clean Hero Section */}
            <section className="relative pt-24 pb-12 overflow-hidden">
                <div className="container mx-auto px-4 lg:px-16 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-left"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-[2px] bg-[#FD9A00]" />
                            <span className={`text-[12px] font-black text-[#FD9A00] uppercase tracking-[0.3em] ${bengaliClass}`}>
                                {language === 'bn' ? 'ব্লগ' : 'Blog'}
                            </span>
                        </div>

                        {/* Title - Smaller */}
                        <h1 className={`text-5xl lg:text-7xl font-black text-gray-950 dark:text-white mb-6 uppercase leading-[0.85] tracking-tighter font-poppins ${bengaliClass}`}>
                            {language === 'bn' ? 'জ্ঞান ও ' : 'Knowledge & '}
                            <span className="text-[#FD9A00]">{language === 'bn' ? 'অনুপ্রেরণা' : 'Inspiration'}</span>
                        </h1>

                        {/* Description - Compact */}
                        <p className={`text-base text-gray-500 dark:text-gray-400 max-w-lg leading-relaxed ${bengaliClass}`}>
                            {text.heroSubtitle}
                        </p>
                    </motion.div>
                </div>
            </section>

            <div className="container mx-auto px-4 lg:px-16 py-8 relative z-10">

                {/* Featured Section - Main Featured Post + Popular/Recent Sidebar */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">

                    {/* Main Featured Post - Image Top, Content Below */}
                    <div className="lg:col-span-2 h-full">
                        {featuredBlogs[0] || blogs[0] ? (
                            <Link href={`/blog/${(featuredBlogs[0] || blogs[0]).slug}`} className="group block h-full">
                                <div className="bg-gray-50/50 dark:bg-white/5 rounded-3xl overflow-hidden border border-gray-100 dark:border-white/10 h-full flex flex-col hover:border-[#FD9A00]/30 transition-all duration-500">
                                    {/* Image */}
                                    <div className="relative h-[400px] overflow-hidden">
                                        {(featuredBlogs[0] || blogs[0]).thumbnail ? (
                                            <Image
                                                src={(featuredBlogs[0] || blogs[0]).thumbnail}
                                                alt={(featuredBlogs[0] || blogs[0]).title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black" />
                                        )}
                                        {/* Category Badge on Image */}
                                        <span className={`absolute top-6 left-6 px-4 py-2 rounded-lg bg-black/50 backdrop-blur-md border border-white/10 text-white text-[12px] font-bold font-poppins uppercase tracking-widest ${bengaliClass}`}>
                                            {(featuredBlogs[0] || blogs[0]).category?.name || 'Featured'}
                                        </span>
                                    </div>

                                    {/* Content Below Image */}
                                    <div className="p-8 flex-1 flex flex-col">
                                        {/* Title */}
                                        <h2 className={`text-3xl font-bold font-poppins uppercase text-gray-900 dark:text-white mb-4 leading-[0.9] group-hover:text-[#FD9A00] transition-colors line-clamp-2 ${bengaliClass}`}>
                                            {(featuredBlogs[0] || blogs[0]).title}
                                        </h2>

                                        {/* Excerpt */}
                                        <p className={`text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-6 flex-1 leading-relaxed ${bengaliClass}`}>
                                            {(featuredBlogs[0] || blogs[0]).excerpt || 'Read our latest featured article...'}
                                        </p>

                                        {/* Author & Date */}
                                        <div className="flex items-center gap-4 text-sm pt-6 border-t border-gray-200 dark:border-white/10">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-[#FD9A00]/20 flex items-center justify-center text-[#FD9A00] text-sm font-bold font-poppins">
                                                    {(featuredBlogs[0] || blogs[0]).author?.firstName?.[0] || 'A'}
                                                </div>
                                                <span className={`font-bold font-poppins uppercase tracking-wider text-gray-700 dark:text-gray-300 ${bengaliClass}`}>{(featuredBlogs[0] || blogs[0]).author?.firstName}</span>
                                            </div>
                                            <span className="text-gray-300 dark:text-gray-600">•</span>
                                            <span className={`text-[#FD9A00] font-bold font-poppins uppercase tracking-wider ${bengaliClass}`}>{formatDate((featuredBlogs[0] || blogs[0]).publishedAt || (featuredBlogs[0] || blogs[0]).createdAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ) : (
                            <div className="h-full min-h-[400px] rounded-3xl bg-gray-100 dark:bg-white/5 flex items-center justify-center border border-gray-200 dark:border-white/10">
                                <FiBookOpen className="text-gray-400 dark:text-gray-600" size={48} />
                            </div>
                        )}
                    </div>

                    {/* Popular/Recent Sidebar */}
                    <div className="bg-gray-50/50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10 p-6 min-h-[400px] flex flex-col">
                        {/* Tabs */}
                        <div className="flex gap-2 mb-6 p-1 bg-white dark:bg-black/20 rounded-xl border border-gray-100 dark:border-white/5">
                            <button
                                onClick={() => setActiveTab('popular')}
                                className={`flex-1 py-2.5 rounded-lg text-sm font-bold font-poppins uppercase tracking-wider transition-all ${activeTab === 'popular'
                                    ? 'bg-[#FD9A00] text-white shadow-md'
                                    : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'
                                    } ${bengaliClass}`}
                            >
                                {text.popular}
                            </button>
                            <button
                                onClick={() => setActiveTab('recent')}
                                className={`flex-1 py-2.5 rounded-lg text-sm font-bold font-poppins uppercase tracking-wider transition-all ${activeTab === 'recent'
                                    ? 'bg-[#FD9A00] text-white shadow-md'
                                    : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'
                                    } ${bengaliClass}`}
                            >
                                {text.recent}
                            </button>
                        </div>

                        {/* Posts List - Equal Height Cards with Excerpt */}
                        <div className="flex-1 flex flex-col gap-2">
                            {(activeTab === 'popular' ? popularBlogs : blogs).slice(0, 4).map((blog, index) => (
                                <Link key={blog._id} href={`/blog/${blog.slug}`} className="group flex-1 flex items-start gap-4 p-3 rounded-2xl hover:bg-white dark:hover:bg-white/10 hover:shadow-lg hover:shadow-black/5 transition-all duration-300">
                                    <div className="w-20 h-20 relative rounded-xl overflow-hidden flex-shrink-0 bg-gray-200 dark:bg-white/10">
                                        {blog.thumbnail ? (
                                            <Image
                                                src={blog.thumbnail}
                                                alt={blog.title}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <FiBookOpen className="text-gray-400" size={18} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 py-1">
                                        <h4 className={`font-bold font-poppins uppercase text-gray-800 dark:text-white text-lg leading-[0.9] line-clamp-2 group-hover:text-[#FD9A00] transition-colors mb-1 ${bengaliClass}`}>
                                            {blog.title}
                                        </h4>
                                        <p className={`text-[11px] font-bold text-[#FD9A00] font-poppins uppercase tracking-wider mt-1 ${bengaliClass}`}>
                                            {formatDate(blog.publishedAt || blog.createdAt)}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Blog Cards Section Header */}
                <div className="flex items-center justify-between mb-8">
                    <h2 className={`text-4xl font-black font-poppins uppercase text-gray-900 dark:text-white ${bengaliClass}`}>
                        {language === 'bn' ? 'সকল আর্টিকেল' : 'All Articles'}
                    </h2>
                </div>

                {/* Blog Grid */}
                {blogs.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10">
                        <div className="w-20 h-20 mx-auto mb-6 bg-[#FD9A00]/10 rounded-2xl flex items-center justify-center">
                            <FiBookOpen className="text-[#FD9A00]" size={32} />
                        </div>
                        <h3 className={`text-xl font-bold font-poppins uppercase text-gray-800 dark:text-white mb-2 ${bengaliClass}`}>{text.noBlogsFound}</h3>
                        <p className={`text-gray-500 dark:text-gray-400 ${bengaliClass}`}>{text.comingSoon}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {(activeTab === 'popular' ? popularBlogs : blogs).map((blog, index) => (
                            <motion.div
                                key={blog._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="group"
                            >
                                <Link href={`/blog/${blog.slug}`} className="block h-full">
                                    <div className="bg-gray-50/50 dark:bg-white/5 rounded-3xl overflow-hidden border border-gray-100 dark:border-white/10 hover:border-[#FD9A00]/50 transition-all duration-500 hover:shadow-xl hover:shadow-[#FD9A00]/10 hover:-translate-y-2 h-full flex flex-col">
                                        {/* Image Container */}
                                        <div className="relative h-60 overflow-hidden">
                                            {blog.thumbnail ? (
                                                <Image
                                                    src={blog.thumbnail}
                                                    alt={blog.title}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-200 dark:bg-white/5 flex items-center justify-center">
                                                    <FiBookOpen className="text-gray-400" size={40} />
                                                </div>
                                            )}

                                            {/* Category Badge */}
                                            <div className="absolute top-4 left-4">
                                                <span className={`px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md text-[10px] font-bold font-poppins uppercase tracking-widest text-white border border-white/10 ${bengaliClass}`}>
                                                    {blog.category?.name || (language === 'bn' ? 'ব্লগ' : 'Blog')}
                                                </span>
                                            </div>

                                            {/* Reading Time Badge */}
                                            <div className="absolute top-4 right-4">
                                                <span className={`px-3 py-1.5 rounded-lg bg-[#FD9A00] text-black text-[10px] font-bold font-poppins uppercase tracking-widest flex items-center gap-1.5 ${bengaliClass}`}>
                                                    <FiClock size={12} />
                                                    5 {text.min}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6 flex-1 flex flex-col">
                                            {/* Meta Info */}
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-8 h-8 rounded-full bg-[#FD9A00]/20 flex items-center justify-center text-[#FD9A00] text-xs font-bold font-poppins">
                                                    {blog.author?.firstName?.[0] || 'A'}
                                                </div>
                                                <div>
                                                    <p className={`text-sm font-bold font-poppins uppercase tracking-wider text-gray-800 dark:text-white ${bengaliClass}`}>
                                                        {blog.author?.firstName || 'Author'}
                                                    </p>
                                                    <p className={`text-[10px] font-bold text-gray-400 uppercase tracking-widest ${bengaliClass}`}>
                                                        {formatDate(blog.publishedAt || blog.createdAt)}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Title */}
                                            <h3 className={`text-2xl font-bold font-poppins uppercase text-gray-900 dark:text-white group-hover:text-[#FD9A00] transition-colors duration-300 line-clamp-2 mb-3 leading-[0.9] ${bengaliClass}`}>
                                                {blog.title}
                                            </h3>

                                            {/* Excerpt */}
                                            <p className={`text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed mb-6 flex-1 ${bengaliClass}`}>
                                                {blog.excerpt || 'Click to read more about this interesting topic...'}
                                            </p>

                                            {/* Read More */}
                                            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-white/10 mt-auto">
                                                <span className={`text-sm font-bold font-poppins uppercase tracking-wider text-[#FD9A00] group-hover:text-white transition-colors flex items-center gap-2 ${bengaliClass}`}>
                                                    {language === 'bn' ? 'আরো পড়ুন' : 'Read More'}
                                                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
                                                </span>
                                                <div className="flex items-center gap-1 text-gray-400">
                                                    <FiTrendingUp size={14} />
                                                    <span className="text-xs font-bold font-poppins">{blog.views || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-3 mt-20">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="w-12 h-12 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-gray-400 disabled:opacity-40 hover:bg-[#FD9A00] hover:border-[#FD9A00] hover:text-white transition-all shadow-sm"
                        >
                            <FiChevronLeft size={20} />
                        </button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-12 h-12 rounded-xl font-bold font-poppins text-lg transition-all ${currentPage === page
                                    ? 'bg-[#FD9A00] text-white shadow-lg shadow-[#FD9A00]/30'
                                    : 'bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-[#FD9A00] hover:border-[#FD9A00] hover:text-white'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="w-12 h-12 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-gray-400 disabled:opacity-40 hover:bg-[#FD9A00] hover:border-[#FD9A00] hover:text-white transition-all shadow-sm"
                        >
                            <FiChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>
        </div >
    );
}
