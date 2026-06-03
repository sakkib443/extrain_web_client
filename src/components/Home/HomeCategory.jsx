"use client";

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import {
    LuArrowRight, LuShoppingBag, LuGraduationCap, LuBriefcase,
    LuLayoutDashboard, LuNewspaper, LuUtensils, LuBuilding2, LuStethoscope
} from 'react-icons/lu';

const HomeCategory = () => {
    const { language } = useLanguage();
    const isBn = language === 'bn';
    const bengaliClass = isBn ? "hind-siliguri" : "";

    // 8 website template categories. Each links to the website listing filtered by category.
    // `gradient` / `accent` color literals are kept full so Tailwind JIT picks them up.
    const categories = [
        {
            id: 'ecommerce', icon: LuShoppingBag,
            title: 'E-Commerce', titleBn: 'ই-কমার্স',
            subtitle: 'Online Stores & Shops', subtitleBn: 'অনলাইন স্টোর ও শপ',
            href: '/website?category=ecommerce',
            gradient: 'from-rose-500 to-pink-600', accent: 'text-rose-500', shadow: 'group-hover:shadow-rose-500/25',
        },
        {
            id: 'lms', icon: LuGraduationCap,
            title: 'Learning Management', titleBn: 'লার্নিং ম্যানেজমেন্ট',
            subtitle: 'Education & Courses', subtitleBn: 'শিক্ষা ও কোর্স',
            href: '/website?category=learning-management',
            gradient: 'from-indigo-500 to-violet-600', accent: 'text-indigo-500', shadow: 'group-hover:shadow-indigo-500/25',
        },
        {
            id: 'business', icon: LuBriefcase,
            title: 'Business', titleBn: 'বিজনেস',
            subtitle: 'Corporate & Agency', subtitleBn: 'কর্পোরেট ও এজেন্সি',
            href: '/website?category=business',
            gradient: 'from-blue-500 to-cyan-600', accent: 'text-blue-500', shadow: 'group-hover:shadow-blue-500/25',
        },
        {
            id: 'portfolio', icon: LuLayoutDashboard,
            title: 'Portfolio', titleBn: 'পোর্টফোলিও',
            subtitle: 'Personal & Creative', subtitleBn: 'পার্সোনাল ও ক্রিয়েটিভ',
            href: '/website?category=portfolio',
            gradient: 'from-amber-500 to-orange-600', accent: 'text-amber-500', shadow: 'group-hover:shadow-amber-500/25',
        },
        {
            id: 'blog', icon: LuNewspaper,
            title: 'Blog & News', titleBn: 'ব্লগ ও নিউজ',
            subtitle: 'Blog & Magazine', subtitleBn: 'ব্লগ ও ম্যাগাজিন',
            href: '/website?category=blog',
            gradient: 'from-emerald-500 to-teal-600', accent: 'text-emerald-500', shadow: 'group-hover:shadow-emerald-500/25',
        },
        {
            id: 'restaurant', icon: LuUtensils,
            title: 'Restaurant', titleBn: 'রেস্টুরেন্ট',
            subtitle: 'Food & Cafe', subtitleBn: 'ফুড ও ক্যাফে',
            href: '/website?category=restaurant',
            gradient: 'from-orange-500 to-red-600', accent: 'text-orange-500', shadow: 'group-hover:shadow-orange-500/25',
        },
        {
            id: 'real-estate', icon: LuBuilding2,
            title: 'Real Estate', titleBn: 'রিয়েল এস্টেট',
            subtitle: 'Property & Listing', subtitleBn: 'প্রপার্টি ও লিস্টিং',
            href: '/website?category=real-estate',
            gradient: 'from-sky-500 to-blue-600', accent: 'text-sky-500', shadow: 'group-hover:shadow-sky-500/25',
        },
        {
            id: 'healthcare', icon: LuStethoscope,
            title: 'Healthcare', titleBn: 'হেলথকেয়ার',
            subtitle: 'Medical & Clinic', subtitleBn: 'মেডিকেল ও ক্লিনিক',
            href: '/website?category=healthcare',
            gradient: 'from-fuchsia-500 to-purple-600', accent: 'text-fuchsia-500', shadow: 'group-hover:shadow-fuchsia-500/25',
        },
    ];

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] },
        }),
    };

    return (
        <section className='relative py-24 overflow-hidden'>
            {/* Background Elements - Static */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-[10%] w-72 h-72 bg-gradient-to-br from-[#FD9A00]/5 to-transparent rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-[10%] w-80 h-80 bg-gradient-to-br from-[#FD9A00]/5 to-transparent rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-[#FD9A00]/3 to-[#FD9A00]/3 rounded-full blur-3xl"></div>
                <div className="absolute top-32 right-[15%] w-16 h-16 border-2 border-[#FD9A00]/20 rounded-xl"></div>
                <div className="absolute top-1/4 left-[8%] w-12 h-12 border-2 border-[#FD9A00]/20 rounded-full"></div>
                <div className="absolute bottom-1/4 right-[8%] w-20 h-20 border-2 border-[#FD9A00]/15 rounded-2xl"></div>
                <div className="absolute bottom-32 left-[20%] w-8 h-8 bg-[#FD9A00]/10 rounded-lg"></div>
                <div className="absolute top-40 left-[5%] flex flex-col gap-2 opacity-30">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex gap-2">
                            {[...Array(3)].map((_, j) => (<div key={j} className="w-1.5 h-1.5 bg-[#FD9A00] rounded-full"></div>))}
                        </div>
                    ))}
                </div>
                <div className="absolute bottom-40 right-[5%] flex flex-col gap-2 opacity-30">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex gap-2">
                            {[...Array(3)].map((_, j) => (<div key={j} className="w-1.5 h-1.5 bg-[#FD9A00] rounded-full"></div>))}
                        </div>
                    ))}
                </div>
            </div>

            <div className='container mx-auto px-4 lg:px-16 relative z-10'>
                {/* Section Header */}
                <div className="text-left mb-10 px-2">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-[2px] bg-[#C4EE18]" />
                        <span className={`text-[10px] font-black text-[#C4EE18] uppercase tracking-[0.4em] ${bengaliClass}`}>
                            {isBn ? 'আমাদের প্রোডাক্ট' : 'Our Products'}
                        </span>
                    </div>

                    <h2 className={`text-5xl lg:text-7xl font-black text-gray-950 dark:text-white mb-2 uppercase leading-[0.85] tracking-tighter max-w-3xl font-teko ${bengaliClass}`}>
                        {isBn ? <>ক্যাটাগরি <br /><span className="text-[#C4EE18]">অনুযায়ী খুঁজুন</span></> : <>Browse <br /><span className="text-[#C4EE18]">by Category</span></>}
                    </h2>

                    <div className="w-20 h-1 bg-gray-100 dark:bg-white/10 mb-4" />

                    <p className={`text-gray-500 dark:text-gray-400 text-sm lg:text-base max-w-2xl leading-relaxed ${bengaliClass}`}>
                        {isBn
                            ? 'আপনার প্রজেক্টের জন্য পারফেক্ট ওয়েবসাইট টেমপ্লেট খুঁজে নিন — ই-কমার্স, লার্নিং ম্যানেজমেন্ট, বিজনেস থেকে পোর্টফোলিও, ব্লগ এবং আরও অনেক ক্যাটাগরি এক জায়গায়।'
                            : 'Find the perfect website template for your project — from e-commerce and learning management to business, portfolio, blog and more, all in one place.'}
                    </p>
                </div>

                {/* Categories Grid - 8 website categories */}
                <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6'>
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
                                    className={`group relative bg-white dark:bg-[#0d0d0d] rounded-xl p-5 sm:p-6 border border-gray-100 dark:border-white/5 transition-all duration-500 hover:-translate-y-1.5 hover:border-transparent hover:shadow-2xl ${cat.shadow} block overflow-hidden h-full`}
                                >
                                    {/* Number Indicator */}
                                    <div className="absolute top-3 right-4 text-4xl font-black text-slate-50 dark:text-white/[0.04] transition-colors pointer-events-none font-teko select-none">
                                        0{index + 1}
                                    </div>

                                    <div className="relative z-10">
                                        {/* Animated Icon Box */}
                                        <div className="mb-5">
                                            <div className={`w-14 h-14 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-[8deg] group-hover:shadow-lg group-hover:bg-gradient-to-br ${cat.gradient}`}>
                                                <Icon size={26} className={`${cat.accent} group-hover:text-white transition-all duration-500 group-hover:-rotate-[8deg]`} />
                                            </div>
                                        </div>

                                        {/* Text Content */}
                                        <div className="mb-4">
                                            <h3 className={`text-lg sm:text-xl font-black text-gray-950 dark:text-white mb-1 uppercase tracking-tight font-teko leading-tight ${bengaliClass}`}>
                                                {isBn ? cat.titleBn : cat.title}
                                            </h3>
                                            <p className={`text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 font-poppins ${bengaliClass}`}>
                                                {isBn ? cat.subtitleBn : cat.subtitle}
                                            </p>
                                        </div>

                                        {/* Bottom CTA */}
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-white/5">
                                            <span className={`text-[11px] font-bold ${cat.accent} uppercase tracking-wider font-poppins ${bengaliClass}`}>
                                                {isBn ? 'টেমপ্লেট দেখুন' : 'View Templates'}
                                            </span>
                                            <div className={`w-7 h-7 rounded-lg bg-slate-50 dark:bg-white/5 flex items-center justify-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:bg-gradient-to-br ${cat.gradient} transition-all duration-500`}>
                                                <LuArrowRight size={14} className="text-white" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hover reveal line */}
                                    <div className={`absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r ${cat.gradient} group-hover:w-full transition-all duration-700`} />
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
