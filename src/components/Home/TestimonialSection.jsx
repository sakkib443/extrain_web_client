"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { LuQuote, LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { useLanguage } from '@/context/LanguageContext';

const TestimonialSection = () => {
    const { language } = useLanguage();
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";

    const testimonials = [
        {
            name: "Ahsanullah Shaon",
            nameBn: "আহসানউল্লাহ শাওন",
            role: "Founder & CEO",
            roleBn: "ফাউন্ডার ও সিইও",
            image: "/images/Testimonial/Ahsanullah Shaon.jpg",
            content: "Extrain Web built our e-commerce platform exactly the way we wanted. Mobile-friendly, super fast, and the admin panel is so easy that our staff manages everything without any coding. Sales went up within weeks of going live.",
            contentBn: "এক্সট্রেন ওয়েব আমাদের ই-কমার্স প্ল্যাটফর্মটা ঠিক যেভাবে চেয়েছিলাম সেভাবেই বানিয়ে দিয়েছে। মোবাইল ফ্রেন্ডলি, খুব দ্রুত, আর অ্যাডমিন প্যানেল এত সহজ যে আমাদের স্টাফরা কোডিং ছাড়াই সব ম্যানেজ করে। লাইভ হওয়ার কয়েক সপ্তাহেই বিক্রি বেড়ে গেছে।",
            company: "Shaon Mart BD",
            companyBn: "শাওন মার্ট বিডি"
        },
        {
            name: "Md Abu Sayeed",
            nameBn: "মোঃ আবু সাঈদ",
            role: "Director",
            roleBn: "ডিরেক্টর",
            image: "/images/Testimonial/Md Abu Sayeed.jpg",
            content: "We hired Extrain Web for our coaching center's LMS website. Batch management, attendance, online exam, certificate — everything works smoothly. The team responded fast and delivered before the deadline. Highly recommended.",
            contentBn: "আমাদের কোচিং সেন্টারের LMS ওয়েবসাইটের জন্য এক্সট্রেন ওয়েবকে নিয়েছিলাম। ব্যাচ ম্যানেজমেন্ট, অ্যাটেনডেন্স, অনলাইন পরীক্ষা, সার্টিফিকেট — সবকিছু দারুণ চলছে। টিম খুব দ্রুত রেসপন্স করে এবং সময়ের আগেই ডেলিভারি দিয়েছে। অবশ্যই রিকমেন্ড করি।",
            company: "Sayeed Academy",
            companyBn: "সাঈদ একাডেমি"
        },
        {
            name: "Afsana Mimi",
            nameBn: "আফসানা মিমি",
            role: "Brand Owner",
            roleBn: "ব্র্যান্ড ওনার",
            image: "/images/Testimonial/Afsana Mimi (2).jpg",
            content: "I needed a stylish online store for my fashion brand and Extrain Web delivered beyond my expectations. The design is premium, the checkout flow is smooth with bKash and Nagad, and customer support is always on point. Couldn't be happier.",
            contentBn: "আমার ফ্যাশন ব্র্যান্ডের জন্য সুন্দর একটা অনলাইন স্টোর দরকার ছিল, এক্সট্রেন ওয়েব আমার প্রত্যাশার চেয়েও বেশি দিয়েছে। ডিজাইন প্রিমিয়াম, বিকাশ-নগদে চেকআউট ফ্লো খুব মসৃণ, আর কাস্টমার সাপোর্ট সবসময় চমৎকার। একদম খুশি আমি।",
            company: "Mimi's Closet",
            companyBn: "মিমি'স ক্লোজেট"
        },
        {
            name: "Zayed Uddin",
            nameBn: "যায়েদ উদ্দিন",
            role: "Startup Founder",
            roleBn: "স্টার্টআপ ফাউন্ডার",
            image: "/images/Testimonial/Zayed Uddin.jpg",
            content: "Professional team with great attention to detail. They built our SaaS dashboard with Next.js and the performance is impressive — fast loading, secure, and SEO-ready out of the box. Will definitely come back for our next project.",
            contentBn: "প্রফেশনাল টিম, প্রতিটা ডিটেইলে নজর। আমাদের SaaS ড্যাশবোর্ডটা Next.js দিয়ে বানিয়েছে, পারফরম্যান্স অসাধারণ — দ্রুত লোড, নিরাপদ, আর SEO-রেডি। পরের প্রোজেক্টের জন্য অবশ্যই আবার আসব।",
            company: "Zayed Tech",
            companyBn: "যায়েদ টেক"
        }
    ];

    const isBn = language === 'bn';

    // ─── Carousel state ───
    const total = testimonials.length;
    const [visible, setVisible] = useState(3);
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        const update = () => {
            if (typeof window === 'undefined') return;
            if (window.matchMedia('(min-width: 1024px)').matches) setVisible(3);
            else if (window.matchMedia('(min-width: 640px)').matches) setVisible(2);
            else setVisible(1);
        };
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    const maxIndex = Math.max(0, total - visible);
    const safeIndex = Math.min(index, maxIndex);

    useEffect(() => { if (index > maxIndex) setIndex(maxIndex); }, [maxIndex, index]);

    useEffect(() => {
        if (paused || maxIndex === 0) return;
        const t = setInterval(() => setIndex(i => (i >= maxIndex ? 0 : i + 1)), 4500);
        return () => clearInterval(t);
    }, [paused, maxIndex]);

    const goPrev = () => setIndex(i => (i <= 0 ? maxIndex : i - 1));
    const goNext = () => setIndex(i => (i >= maxIndex ? 0 : i + 1));

    return (
        <section className="py-24 bg-white dark:bg-[#0A0A0A] overflow-hidden relative border-t border-gray-100 dark:border-white/5">
            {/* Subtle Grid Background */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
                style={{ backgroundImage: 'linear-gradient(#0CB2A9 0.5px, transparent 0.5px), linear-gradient(90deg, #0CB2A9 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }}
            />

            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                {/* Section Header */}
                <div className="mb-16 text-center max-w-3xl mx-auto">
                    <span className={`inline-block py-1 px-3 rounded-full bg-[#0CB2A9]/10 text-[#0CB2A9] text-[10px] font-bold uppercase tracking-[0.2em] mb-4 border border-[#0CB2A9]/20 ${bengaliClass}`}>
                        {language === 'bn' ? 'গ্রাহকদের মতামত' : 'Client Feedback'}
                    </span>
                    <h2 className={`text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white capitalize leading-tight mb-4 ${bengaliClass}`}>
                        {isBn ? (
                            <>আস্থা রাখছে <span className="text-[#0CB2A9]">শত শত</span> ব্যবসা</>
                        ) : (
                            <>Trusted by <span className="text-[#0CB2A9]">Businesses</span> Worldwide</>
                        )}
                    </h2>
                    <p className={`text-gray-500 dark:text-gray-400 text-sm lg:text-base ${bengaliClass}`}>
                        {isBn
                            ? "আমাদের প্রিমিয়াম স্ক্রিপ্ট ও কাস্টম ওয়েব সমাধান কীভাবে ব্যবসা বাড়াতে সাহায্য করছে দেখুন।"
                            : "See how our premium scripts and custom web solutions are helping businesses grow."}
                    </p>
                </div>

                {/* ─── Carousel ─── */}
                <div
                    className="relative"
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                >
                    {/* Track viewport */}
                    <div className="overflow-hidden -mx-3">
                        <motion.div
                            className="flex"
                            animate={{ x: `-${safeIndex * (100 / visible)}%` }}
                            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        >
                            {testimonials.map((item, i) => (
                                <div
                                    key={i}
                                    className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 px-3"
                                >
                                    <motion.div
                                        className="group h-full"
                                        whileHover={{ y: -6 }}
                                        transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                                    >
                                        <div className="h-full bg-white dark:bg-[#111] p-8 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-[#0CB2A9]/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-[#0CB2A9]/10 flex flex-col relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#0CB2A9] to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

                                            <div className="mb-6 flex items-center justify-between">
                                                <div className="flex gap-1">
                                                    {[...Array(5)].map((_, k) => (
                                                        <svg key={k} className="w-4 h-4 text-[#0CB2A9]" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    ))}
                                                </div>
                                                <LuQuote className="text-gray-200 dark:text-gray-800 text-3xl group-hover:text-[#0CB2A9]/20 transition-colors" />
                                            </div>

                                            <p className={`text-gray-600 dark:text-gray-300 text-sm lg:text-[15px] leading-relaxed mb-8 flex-1 ${bengaliClass}`}>
                                                &quot;{isBn ? item.contentBn : item.content}&quot;
                                            </p>

                                            <div className="flex items-center gap-4 pt-6 border-t border-gray-100 dark:border-gray-800">
                                                <img src={item.image} alt={isBn ? item.nameBn : item.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-800" />
                                                <div>
                                                    <h4 className={`text-base font-bold text-gray-900 dark:text-white ${bengaliClass}`}>
                                                        {isBn ? item.nameBn : item.name}
                                                    </h4>
                                                    <p className={`text-xs text-gray-500 dark:text-gray-400 font-medium ${bengaliClass}`}>
                                                        {isBn ? `${item.roleBn} @ ${item.companyBn}` : `${item.role} @ ${item.company}`}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Controls: prev / dots / next */}
                    {maxIndex > 0 && (
                        <div className="mt-10 flex items-center justify-center gap-5">
                            <button
                                onClick={goPrev}
                                aria-label="Previous testimonial"
                                className="w-11 h-11 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center hover:border-[#0CB2A9] hover:text-[#0CB2A9] hover:shadow-md transition-all"
                            >
                                <LuChevronLeft size={20} />
                            </button>

                            <div className="flex items-center gap-2">
                                {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setIndex(i)}
                                        aria-label={`Go to slide ${i + 1}`}
                                        className="relative h-2.5 rounded-full transition-all duration-300"
                                        style={{
                                            width: i === safeIndex ? 28 : 10,
                                            backgroundColor: i === safeIndex ? '#0CB2A9' : '#D1D5DB',
                                        }}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={goNext}
                                aria-label="Next testimonial"
                                className="w-11 h-11 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center hover:border-[#0CB2A9] hover:text-[#0CB2A9] hover:shadow-md transition-all"
                            >
                                <LuChevronRight size={20} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default TestimonialSection;
