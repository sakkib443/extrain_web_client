"use client";

import React, { useState, useEffect } from 'react';
import { motion, useTransform } from 'framer-motion';
import { LuQuote, LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { useLanguage } from '@/context/LanguageContext';
import useSectionMotion from '@/hooks/useSectionMotion';
import BracketLabel from './BracketLabel';
import TiltCard from './TiltCard';
import { Star4, Plus, EdgeDots, OrbitRing } from './Decor';

const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    show: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.65, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
    }),
};
const viewport = { once: true, amount: 0.2 };

const TestimonialSection = () => {
    const { language } = useLanguage();
    const isBn = language === "bn";
    const bn = isBn ? "hind-siliguri" : "";

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
            content: "Professional team with great attention to detail. They built our SaaS dashboard with Next.js and the performance is impressive — fast loading, secure, and rock solid on mobile. Will definitely come back for our next project.",
            contentBn: "প্রফেশনাল টিম, প্রতিটা ডিটেইলে নজর। আমাদের SaaS ড্যাশবোর্ডটা Next.js দিয়ে বানিয়েছে, পারফরম্যান্স অসাধারণ — দ্রুত লোড, নিরাপদ, আর মোবাইলেও একদম স্মুথ। পরের প্রোজেক্টের জন্য অবশ্যই আবার আসব।",
            company: "Zayed Tech",
            companyBn: "যায়েদ টেক"
        }
    ];

    // ---- smooth scroll + mouse motion (same feel as the other home sections) ----
    const { ref: sectionRef, p, mx, my, reduce } = useSectionMotion();
    const headY = useTransform(p, [0, 1], [20, -20]);
    const carouselY = useTransform(p, [0, 1], [14, -14]);
    const ringX = useTransform(mx, [-0.5, 0.5], [-28, 28]);
    const ringY = useTransform(p, [0, 1], [60, -60]);
    const quoteX = useTransform(mx, [-0.5, 0.5], [22, -22]);
    const quoteY = useTransform([p, my], ([pv, mv]) => (0.5 - pv) * 2 * 36 + mv * -16);
    const starY = useTransform(p, [0, 1], [-60, 60]);
    const starX = useTransform(mx, [-0.5, 0.5], [22, -22]);
    const plusY = useTransform(p, [0, 1], [44, -44]);

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

    const navBtn = "grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/[0.03] text-white/70 transition-all hover:border-[#F8921C] hover:bg-[#F8921C] hover:text-black";

    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden bg-[color:var(--tone-soft)] py-24 text-white lg:py-32"
        >
            {/* ===== background decoration ===== */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                <div className="absolute -top-24 left-1/4 h-80 w-80 rounded-full bg-[#F8921C]/[0.06] blur-3xl" />
                <div className="absolute -bottom-28 right-1/4 h-72 w-72 rounded-full bg-[#F8921C]/[0.05] blur-3xl" />
                <EdgeDots />
                <motion.div
                    style={reduce ? undefined : { x: ringX, y: ringY }}
                    className="absolute -right-[14rem] top-[6%] hidden sm:block"
                >
                    <div className="relative aspect-square w-[30rem]">
                        <OrbitRing dashed className="absolute inset-0 border-white/[0.10]" />
                        <OrbitRing reverse dot="bottom" className="absolute inset-[16%] border-[#F8921C]/20" />
                    </div>
                </motion.div>
                {/* big faint quote mark */}
                <motion.div
                    style={reduce ? undefined : { x: quoteX, y: quoteY }}
                    className="absolute -left-10 top-[3%] hidden text-white/[0.04] md:block"
                >
                    <LuQuote size={240} strokeWidth={1.2} />
                </motion.div>
                <motion.div style={reduce ? undefined : { x: starX, y: starY }} className="absolute left-[12%] top-[8%] hidden md:block">
                    <Star4 size={36} filled className="decor-float text-[#F8921C]" style={{ animationDuration: "10s" }} />
                </motion.div>
                <motion.div style={reduce ? undefined : { y: plusY }} className="absolute bottom-[8%] right-[9%] hidden md:block">
                    <Plus size={22} className="text-white/25" />
                </motion.div>
            </div>

            <div className="container relative z-10 mx-auto px-6 lg:px-10">
                {/* ===== heading ===== */}
                <motion.div style={reduce ? undefined : { y: headY }} className="mx-auto max-w-2xl text-center">
                    <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewport} className="mb-7">
                        <BracketLabel bn={bn} size="lg">{isBn ? 'গ্রাহকদের মতামত' : 'Client Feedback'}</BracketLabel>
                    </motion.div>
                    <motion.h2
                        variants={fadeUp}
                        custom={1}
                        initial="hidden"
                        whileInView="show"
                        viewport={viewport}
                        style={{ color: "#fff" }}
                        className={`text-[1.7rem] font-bold leading-[1.25] sm:text-3xl lg:text-[2.35rem] ${bn}`}
                    >
                        {isBn ? (
                            <>আস্থা রাখছে <i className="font-light">শত শত ব্যবসা</i></>
                        ) : (
                            <>Trusted by <i className="font-light">Businesses Worldwide</i></>
                        )}
                    </motion.h2>
                    <motion.p
                        variants={fadeUp}
                        custom={2}
                        initial="hidden"
                        whileInView="show"
                        viewport={viewport}
                        className={`mt-4 text-sm leading-7 text-white/60 sm:text-base ${bn}`}
                    >
                        {isBn
                            ? "আমাদের প্রিমিয়াম স্ক্রিপ্ট ও কাস্টম ওয়েব সমাধান কীভাবে ব্যবসা বাড়াতে সাহায্য করছে দেখুন।"
                            : "See how our premium scripts and custom web solutions are helping businesses grow."}
                    </motion.p>
                </motion.div>

                {/* ===== carousel ===== */}
                <motion.div style={reduce ? undefined : { y: carouselY }} className="mt-14">
                    <motion.div
                        variants={fadeUp}
                        custom={3}
                        initial="hidden"
                        whileInView="show"
                        viewport={viewport}
                        className="relative"
                        onMouseEnter={() => setPaused(true)}
                        onMouseLeave={() => setPaused(false)}
                    >
                        {/* Track viewport (padded so the hover lift and glow are not clipped) */}
                        <div className="-mx-3 -my-6 overflow-hidden py-6">
                            <motion.div
                                className="flex"
                                animate={{ x: `-${safeIndex * (100 / visible)}%` }}
                                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                            >
                                {testimonials.map((item, i) => (
                                    <div
                                        key={i}
                                        className="w-full flex-shrink-0 px-3 sm:w-1/2 lg:w-1/3"
                                    >
                                        {/* leans toward the mouse + a light follows the pointer */}
                                        <TiltCard className="h-full" radius="1rem">
                                            <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#F8921C]/60 hover:shadow-[0_24px_50px_-28px_rgba(248,146,28,0.55)] lg:p-8">
                                                <div className="absolute left-0 top-0 h-[3px] w-full origin-left scale-x-0 bg-gradient-to-r from-[#F8921C] via-[#F8921C]/60 to-transparent transition-transform duration-500 group-hover:scale-x-100" />

                                                <div className="mb-6 flex items-center justify-between">
                                                    <div className="flex gap-1">
                                                        {[...Array(5)].map((_, k) => (
                                                            <svg key={k} className="h-4 w-4 text-[#F8921C]" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                            </svg>
                                                        ))}
                                                    </div>
                                                    <LuQuote size={30} className="text-white/15 transition-colors duration-300 group-hover:text-[#F8921C]/50" />
                                                </div>

                                                <p className={`mb-8 flex-1 text-sm leading-relaxed text-white/70 lg:text-[15px] ${bn}`}>
                                                    &quot;{isBn ? item.contentBn : item.content}&quot;
                                                </p>

                                                <div className="flex items-center gap-4 border-t border-white/10 pt-6">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={item.image}
                                                        alt={isBn ? item.nameBn : item.name}
                                                        className="h-12 w-12 rounded-full object-cover ring-2 ring-white/10 transition-all duration-300 group-hover:ring-[#F8921C]/70"
                                                    />
                                                    <div>
                                                        <h4 style={{ color: "#fff" }} className={`text-base font-bold ${bn}`}>
                                                            {isBn ? item.nameBn : item.name}
                                                        </h4>
                                                        <p className={`text-xs font-medium text-[#F8921C] ${bn}`}>
                                                            {isBn ? `${item.roleBn} @ ${item.companyBn}` : `${item.role} @ ${item.company}`}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </TiltCard>
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
                                    className={navBtn}
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
                                                backgroundColor: i === safeIndex ? '#F8921C' : 'rgba(255,255,255,0.22)',
                                            }}
                                        />
                                    ))}
                                </div>

                                <button
                                    onClick={goNext}
                                    aria-label="Next testimonial"
                                    className={navBtn}
                                >
                                    <LuChevronRight size={20} />
                                </button>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default TestimonialSection;
