"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    FiCheck,
    FiUsers,
    FiTarget,
    FiAward,
    FiGlobe,
    FiZap,
    FiPlay
} from 'react-icons/fi';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import WhatWeProvide from '@/components/Home/WhatWeProvide';

// ==================== ANIMATIONS ====================
const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
};

const SectionLabel = ({ text }) => (
    <motion.div
        variants={fadeInUp}
        className="inline-flex items-center gap-3 mb-4 lg:mb-8"
    >
        <div className="w-12 h-[2px] bg-[#FD9A00]" />
        <span className="text-sm lg:text-base uppercase tracking-widest font-bold text-[#FD9A00] font-poppins">
            {text}
        </span>
    </motion.div>
);

export default function AboutContent() {
    const { language } = useLanguage();
    const isBN = language === 'bn';

    return (
        <div className="relative bg-white dark:bg-[#0A0A0A] selection:bg-[#FD9A00] selection:text-black font-poppins text-gray-900 dark:text-white overflow-hidden">

            {/* Background Grid */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
                style={{ backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

            {/* ==================== HERO SECTION ==================== */}
            <section className="relative min-h-[85vh] flex items-center pt-12 pb-20 overflow-hidden">
                <motion.div className="absolute top-[30%] right-[-10%] w-[40vw] h-[40vw] bg-[#FD9A00]/10 rounded-full blur-[100px] pointer-events-none"
                    animate={{ x: [0, 50, 0], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 15, repeat: Infinity }} />

                <div className="container mx-auto px-6 lg:px-12 relative z-10 h-full flex flex-col justify-center">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">

                        <motion.div
                            initial="initial"
                            animate="animate"
                            variants={{
                                animate: { transition: { staggerChildren: 0.1 } }
                            }}
                        >
                            <SectionLabel text={isBN ? "আমাদের সম্পর্কে" : "ABOUT US"} />

                            <div className="relative mb-6">
                                <motion.h1
                                    variants={fadeInUp}
                                    className="text-[10vw] lg:text-[5rem] leading-[0.85] font-black uppercase font-poppins text-gray-950 dark:text-white"
                                >
                                    WE ARE <br />
                                    <span className="text-[#FD9A00]">EXTRAIN.</span>
                                </motion.h1>

                                <motion.div
                                    variants={fadeInUp}
                                    className="absolute bottom-4 right-0 lg:right-20 hidden lg:flex items-center gap-4"
                                >
                                    <div className="w-16 h-16 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black hover:scale-110 transition-transform cursor-pointer shadow-xl">
                                        <FiPlay size={24} className="ml-1" />
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-widest opacity-60 w-20 leading-tight">Watch Our Story</span>
                                </motion.div>
                            </div>

                            <motion.p
                                variants={fadeInUp}
                                className="text-xl lg:text-2xl font-light leading-relaxed text-gray-600 dark:text-gray-300 max-w-xl mb-10 border-l-4 border-[#FD9A00] pl-6 py-1"
                            >
                                {isBN
                                    ? "আমরা ডিজিটাল যুগের কারিগর। আধুনিক প্রযুক্তি এবং শৈল্পিক ডিজাইনের সমন্বয়ে আমরা তৈরি করি অসাধারণ ডিজিটাল অভিজ্ঞতা।"
                                    : "We are the architects of the digital age. Blending cutting-edge technology with artistic vision to craft exceptional digital experiences."}
                            </motion.p>

                            <motion.div variants={fadeInUp} className="flex gap-6">
                                <Link href="/contact" className="px-8 py-3 bg-[#FD9A00] hover:bg-[#e68a00] text-white font-bold font-poppins uppercase text-xl rounded-none transition-all shadow-lg shadow-[#FD9A00]/20">
                                    {isBN ? "যোগাযোগ করুন" : "Get in Touch"}
                                </Link>
                                <Link href="/portfolio" className="px-8 py-3 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 hover:border-[#FD9A00] text-gray-900 dark:text-white font-bold font-poppins uppercase text-xl rounded-none transition-all">
                                    {isBN ? "পোর্টফোলিও" : "Our Portfolio"}
                                </Link>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="relative h-[600px] hidden lg:block"
                        >
                            <div className="absolute top-0 right-10 w-[80%] h-[90%] bg-gray-200 dark:bg-[#111] overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
                                    alt="Extrain Web Team collaborating on a website development project"
                                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 opacity-80 hover:opacity-100"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                <div className="absolute bottom-10 left-10 text-white">
                                    <div className="flex items-end gap-2 mb-1">
                                        <span className="text-6xl font-black font-poppins leading-none text-[#FD9A00]">5+</span>
                                        <span className="text-lg font-medium mb-1">Years</span>
                                    </div>
                                    <p className="uppercase tracking-widest text-sm opacity-80">Of Digital Excellence</p>
                                </div>
                            </div>

                            <div className="absolute bottom-0 left-0 w-[45%] h-[40%] bg-[#FD9A00] p-2 shadow-2xl">
                                <div className="w-full h-full overflow-hidden bg-black relative group">
                                    <img
                                        src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop"
                                        alt="Professional business meeting at Extrain Web office"
                                        className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ==================== MISSION SECTION ==================== */}
            <section className="py-24 lg:py-32 relative bg-white dark:bg-[#0A0A0A]">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="grid lg:grid-cols-2 gap-20">
                        <div>
                            <SectionLabel text={isBN ? "মিশন" : "OUR MISSION"} />
                            <h2 className="text-4xl lg:text-6xl font-black uppercase font-poppins leading-[0.9] text-gray-900 dark:text-white mb-8">
                                EMPOWERING <span className="text-[#FD9A00]">NEXT-GEN</span> <br />
                                DIGITAL LEADERS.
                            </h2>
                        </div>
                        <div className="space-y-8">
                            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                                We believe in a world where technology is accessible, beautiful, and functional. Our mission is to provide the highest quality digital assets and education to help you succeed in the modern economy.
                            </p>

                            <div className="grid sm:grid-cols-2 gap-6">
                                {[
                                    { icon: FiTarget, title: "Precision", desc: "Pixel-perfect execution in every project." },
                                    { icon: FiZap, title: "Speed", desc: "Optimized for performance and scale." },
                                    { icon: FiGlobe, title: "Global", desc: "Connecting minds across borders." },
                                    { icon: FiUsers, title: "Community", desc: "Building a network of elite creators." }
                                ].map((item, idx) => (
                                    <div key={idx} className="p-6 border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 rounded-xl hover:border-[#FD9A00] transition-colors group">
                                        <item.icon className="text-[#FD9A00] text-2xl mb-4 group-hover:scale-110 transition-transform" />
                                        <h3 className="font-bold text-lg font-poppins uppercase tracking-wide mb-2">{item.title}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== WHAT WE PROVIDE ==================== */}
            <WhatWeProvide />

            {/* ==================== WHY CHOOSE US SECTION ==================== */}
            <section className="py-24 bg-gray-50 dark:bg-[#111] overflow-hidden">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left - Visual */}
                        <div className="relative">
                            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=2070&auto=format&fit=crop"
                                    alt="Extrain Web professional software development team working on projects"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-8 left-8 right-8">
                                    <div className="grid grid-cols-3 gap-4">
                                        {[
                                            { num: "50+", label: isBN ? "সন্তুষ্ট ক্লায়েন্ট" : "Happy Clients" },
                                            { num: "100+", label: isBN ? "সম্পন্ন প্রজেক্ট" : "Projects Done" },
                                            { num: "5+", label: isBN ? "বছরের অভিজ্ঞতা" : "Years Experience" },
                                        ].map((stat, idx) => (
                                            <div key={idx} className="text-center bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                                                <span className="text-3xl font-black font-poppins text-[#FD9A00] block">{stat.num}</span>
                                                <span className="text-xs text-white/80 font-medium">{stat.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right - Content */}
                        <div>
                            <SectionLabel text={isBN ? "কেন আমরা" : "WHY CHOOSE US"} />
                            <h2 className="text-4xl lg:text-6xl font-black uppercase font-poppins leading-[0.9] text-gray-900 dark:text-white mb-6">
                                {isBN ? (
                                    <>আমরা শুধু কোড <span className="text-[#FD9A00]">লিখি না,</span><br />অভিজ্ঞতা তৈরি করি</>
                                ) : (
                                    <>WE DON'T JUST <span className="text-[#FD9A00]">CODE,</span><br />WE CRAFT EXPERIENCES</>
                                )}
                            </h2>

                            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                                {isBN
                                    ? "Extrain Web বাংলাদেশের একটি শীর্ষস্থানীয় ওয়েব ও সফটওয়্যার ডেভেলপমেন্ট কোম্পানি। আমরা আধুনিক প্রযুক্তি এবং সৃজনশীল ডিজাইনের সমন্বয়ে ব্যবসায়িক সমস্যার ডিজিটাল সমাধান তৈরি করি।"
                                    : "Extrain Web is a leading web and software development company in Bangladesh. We combine cutting-edge technology with creative design to build digital solutions that solve real business problems."}
                            </p>

                            <div className="space-y-4 mb-8">
                                {[
                                    { icon: FiCheck, text: isBN ? "কাস্টম ওয়েবসাইট ও সফটওয়্যার ডেভেলপমেন্ট" : "Custom Website & Software Development" },
                                    { icon: FiCheck, text: isBN ? "IELTS, LMS ও শিক্ষা প্রতিষ্ঠানের জন্য সফটওয়্যার" : "IELTS, LMS & Educational Software Solutions" },
                                    { icon: FiCheck, text: isBN ? "রেডিমেড টেমপ্লেট ও স্ক্রিপ্ট মার্কেটপ্লেস" : "Ready-made Templates & Scripts Marketplace" },
                                    { icon: FiCheck, text: isBN ? "২৪/৭ সাপোর্ট ও মেইনটেন্যান্স সেবা" : "24/7 Customer Support & Maintenance" },
                                    { icon: FiCheck, text: isBN ? "আধুনিক UI/UX ডিজাইন ও ব্র্যান্ডিং" : "Modern UI/UX Design & Branding" },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-[#FD9A00]/10 flex items-center justify-center flex-shrink-0">
                                            <item.icon className="text-[#FD9A00]" size={14} />
                                        </div>
                                        <span className="text-gray-700 dark:text-gray-300 font-medium">{item.text}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-4">
                                <Link href="/contact" className="px-8 py-3 bg-[#FD9A00] hover:bg-[#e68a00] text-white font-bold font-poppins uppercase text-xl rounded-none transition-all shadow-lg shadow-[#FD9A00]/20">
                                    {isBN ? "আমাদের সাথে কথা বলুন" : "Talk to Us"}
                                </Link>
                                <Link href="/website" className="px-8 py-3 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 hover:border-[#FD9A00] text-gray-900 dark:text-white font-bold font-poppins uppercase text-xl rounded-none transition-all">
                                    {isBN ? "আমাদের কাজ দেখুন" : "See Our Work"}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== CTA SECTION ==================== */}
            <section className="py-32 bg-[#FD9A00] relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                <div className="container mx-auto px-6 lg:px-12 text-center relative z-10">
                    <h2 className="text-5xl lg:text-[7rem] leading-[0.8] font-black uppercase font-poppins text-black mb-8">
                        LET'S BUILD <br /> THE FUTURE
                    </h2>
                    <p className="text-xl text-black/70 max-w-2xl mx-auto mb-12 font-medium">
                        Ready to transform your digital presence? Join thousands of satisfied clients who trust Extrain Web.
                    </p>
                    <Link href="/contact" className="inline-block px-12 py-5 bg-black text-white text-2xl font-bold font-poppins uppercase tracking-widest hover:scale-105 transition-transform shadow-2xl">
                        Start A Project
                    </Link>
                </div>
            </section>
        </div>
    );
}
