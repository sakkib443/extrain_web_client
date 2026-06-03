"use client";

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import {
    LuChevronRight, LuArrowRight, LuShoppingBag, LuGraduationCap, LuBriefcase,
    LuLayoutDashboard, LuNewspaper, LuUtensils, LuBuilding2, LuStethoscope
} from 'react-icons/lu';

const HomeCategory = () => {
    const { language } = useLanguage();
    const isBn = language === 'bn';
    const bengaliClass = isBn ? "hind-siliguri" : "";

    // 8 website template categories. Each links to the website listing filtered by category.
    // Soft pastel accent per card (full literal classes so Tailwind JIT keeps them).
    const categories = [
        { id: 'ecommerce', icon: LuShoppingBag, title: 'E-Commerce', titleBn: 'ই-কমার্স', subtitle: 'Online Stores & Shops', subtitleBn: 'অনলাইন স্টোর ও শপ', href: '/category/ecommerce', iconBg: 'bg-violet-50/50 dark:bg-violet-500/[0.06]', iconText: 'text-violet-500', pill: 'bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300' },
        { id: 'lms', icon: LuGraduationCap, title: 'Learning Management', titleBn: 'লার্নিং ম্যানেজমেন্ট', subtitle: 'Education & Courses', subtitleBn: 'শিক্ষা ও কোর্স', href: '/category/learning-management', iconBg: 'bg-blue-50/50 dark:bg-blue-500/[0.06]', iconText: 'text-blue-500', pill: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300' },
        { id: 'business', icon: LuBriefcase, title: 'Business', titleBn: 'বিজনেস', subtitle: 'Corporate & Agency', subtitleBn: 'কর্পোরেট ও এজেন্সি', href: '/category/business', iconBg: 'bg-emerald-50/50 dark:bg-emerald-500/[0.06]', iconText: 'text-emerald-500', pill: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300' },
        { id: 'portfolio', icon: LuLayoutDashboard, title: 'Portfolio', titleBn: 'পোর্টফোলিও', subtitle: 'Personal & Creative', subtitleBn: 'পার্সোনাল ও ক্রিয়েটিভ', href: '/category/portfolio', iconBg: 'bg-amber-50/50 dark:bg-amber-500/[0.06]', iconText: 'text-amber-500', pill: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300' },
        { id: 'blog', icon: LuNewspaper, title: 'Blog & News', titleBn: 'ব্লগ ও নিউজ', subtitle: 'Blog & Magazine', subtitleBn: 'ব্লগ ও ম্যাগাজিন', href: '/category/blog', iconBg: 'bg-rose-50/50 dark:bg-rose-500/[0.06]', iconText: 'text-rose-500', pill: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300' },
        { id: 'restaurant', icon: LuUtensils, title: 'Restaurant', titleBn: 'রেস্টুরেন্ট', subtitle: 'Food & Cafe', subtitleBn: 'ফুড ও ক্যাফে', href: '/category/restaurant', iconBg: 'bg-orange-50/50 dark:bg-orange-500/[0.06]', iconText: 'text-orange-500', pill: 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-300' },
        { id: 'real-estate', icon: LuBuilding2, title: 'Real Estate', titleBn: 'রিয়েল এস্টেট', subtitle: 'Property & Listing', subtitleBn: 'প্রপার্টি ও লিস্টিং', href: '/category/real-estate', iconBg: 'bg-cyan-50/50 dark:bg-cyan-500/[0.06]', iconText: 'text-cyan-500', pill: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-300' },
        { id: 'healthcare', icon: LuStethoscope, title: 'Healthcare', titleBn: 'হেলথকেয়ার', subtitle: 'Medical & Clinic', subtitleBn: 'মেডিকেল ও ক্লিনিক', href: '/category/healthcare', iconBg: 'bg-red-50/50 dark:bg-red-500/[0.06]', iconText: 'text-red-500', pill: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-300' },
    ];

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] },
        }),
    };

    return (
        <section className='relative py-20 overflow-hidden'>
            {/* Background Elements - Static */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-[10%] w-72 h-72 bg-gradient-to-br from-[#FD9A00]/5 to-transparent rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-[10%] w-80 h-80 bg-gradient-to-br from-[#C4EE18]/5 to-transparent rounded-full blur-3xl"></div>
            </div>

            <div className='container mx-auto px-4 lg:px-16 relative z-10'>
                {/* Section Header */}
                <div className="flex flex-col items-center text-center mb-8 px-2">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-10 h-[2px] bg-[#C4EE18]" />
                        <span className={`text-[10px] font-black text-[#C4EE18] uppercase tracking-[0.4em] ${bengaliClass}`}>
                            {isBn ? 'আমাদের প্রোডাক্ট' : 'Our Products'}
                        </span>
                        <div className="w-10 h-[2px] bg-[#C4EE18]" />
                    </div>

                    <h2 className={`text-4xl lg:text-5xl font-black text-gray-950 dark:text-white mb-2 uppercase leading-[0.85] tracking-tighter max-w-3xl font-teko ${bengaliClass}`}>
                        {isBn ? <>ক্যাটাগরি <span className="text-[#C4EE18]">অনুযায়ী খুঁজুন</span></> : <>Browse <span className="text-[#C4EE18]">by Category</span></>}
                    </h2>

                    <div className="w-20 h-1 bg-gray-100 dark:bg-white/10 mb-2" />

                    <p className={`text-gray-500 dark:text-gray-400 text-sm lg:text-base max-w-2xl leading-relaxed ${bengaliClass}`}>
                        {isBn
                            ? 'আপনার প্রজেক্টের জন্য পারফেক্ট ওয়েবসাইট টেমপ্লেট খুঁজে নিন — ই-কমার্স, লার্নিং ম্যানেজমেন্ট, বিজনেস থেকে পোর্টফোলিও, ব্লগ এবং আরও অনেক ক্যাটাগরি এক জায়গায়।'
                            : 'Find the perfect website template for your project — from e-commerce and learning management to business, portfolio, blog and more, all in one place.'}
                    </p>
                </div>

                {/* Categories Grid - 8 website categories (reference-style cards) */}
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5'>
                    {categories.map((cat, index) => {
                        const Icon = cat.icon;

                        return (
                            <motion.div
                                key={cat.id}
                                custom={index}
                                variants={cardVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.2 }}
                            >
                                <Link
                                    href={cat.href}
                                    className="group block bg-white dark:bg-[#0d0d0d] rounded-md p-5 border border-[#ecedf1] dark:border-white/[0.06] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/[0.06] hover:border-gray-200 dark:hover:border-white/10"
                                >
                                    {/* Top: icon + text + chevron */}
                                    <div className="flex items-center gap-3.5">
                                        <div className={`w-12 h-12 shrink-0 rounded-md flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${cat.iconBg}`}>
                                            <Icon size={22} className={cat.iconText} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className={`text-lg sm:text-xl font-bold text-gray-700 dark:text-gray-200 leading-tight line-clamp-2 ${bengaliClass}`}>
                                                {isBn ? cat.titleBn : cat.title}
                                            </h3>
                                            <p className={`text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate ${bengaliClass}`}>
                                                {isBn ? cat.subtitleBn : cat.subtitle}
                                            </p>
                                        </div>
                                        <div className="w-7 h-7 shrink-0 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 transition-all duration-300 group-hover:bg-gray-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-gray-900">
                                            <LuChevronRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div className="my-4 border-t border-gray-50 dark:border-white/5" />

                                    {/* Bottom: explore + View All pill */}
                                    <div className="flex items-center justify-between">
                                        <span className={`text-xs text-gray-400 dark:text-gray-500 ${bengaliClass}`}>
                                            {isBn ? 'টেমপ্লেট দেখুন' : 'Explore templates'}
                                        </span>
                                        <span className="w-8 h-8 rounded-md bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 dark:text-gray-400 group-hover:bg-gray-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-gray-900 transition-all duration-300">
                                            <LuArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                                        </span>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default HomeCategory;
