"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import {
    LuMonitor,
    LuShield,
    LuGraduationCap,
    LuZap,
    LuBuilding2,
    LuCheck,
    LuChevronRight,
    LuSparkles
} from "react-icons/lu";
import styles from "./IeltsFeatures.module.css";

const IeltsFeatures = () => {
    const { language } = useLanguage();
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";
    const [activeCard, setActiveCard] = useState(null);

    const featureCategories = [
        {
            title: language === 'bn' ? "BC এক্সাম ইন্টারফেস" : "BC Exam Interface",
            subtitle: language === 'bn' ? "আসল পরীক্ষার হুবহু অভিজ্ঞতা" : "Exact Real Exam Experience",
            icon: LuMonitor,
            color: "#FD9A00",
            features: [
                language === 'bn' ? "টেক্সট হাইলাইটিং ও নোট নেওয়া" : "Text Highlighting & Take Notes",
                language === 'bn' ? "রিয়েল টাইমার ও অটো সাবমিট" : "Real Timer & Auto Submit",
                language === 'bn' ? "হুবহু BC লেআউট, স্প্লিট-স্ক্রিন ভিউ" : "Exact BC Layout, Split-Screen View",
                language === 'bn' ? "ফুলস্ক্রিন এক্সাম মোড" : "Fullscreen Exam Mode",
                language === 'bn' ? "অ্যান্টি-চিটিং (ট্যাব সুইচ, কপি/পেস্ট ব্লক)" : "Anti-Cheating (Tab Switch, Copy/Paste Block)",
                language === 'bn' ? "লিসেনিং এর জন্য অডিও প্লেয়ার" : "Audio Player for Listening",
                language === 'bn' ? "রাইটিং এর জন্য ওয়ার্ড কাউন্টার" : "Word Counter for Writing",
                language === 'bn' ? "প্রশ্ন নেভিগেশন ও সেকশন প্রগ্রেস" : "Question Navigation & Section Progress",
                language === 'bn' ? "ডেমো মোড (কেনার আগে ট্রাই করুন)" : "Demo Mode (Try Before Buy)",
                language === 'bn' ? "মাল্টি-সেট এক্সাম সাপোর্ট" : "Multi-Set Exam Support",
            ]
        },
        {
            title: language === 'bn' ? "অ্যাডমিন প্যানেল" : "Admin Panel",
            subtitle: language === 'bn' ? "ইনস্টিটিউট ম্যানেজমেন্ট" : "Institute Management",
            icon: LuShield,
            color: "#C4EE18",
            features: [
                language === 'bn' ? "সব রেজাল্ট দেখুন ও স্কোর পাবলিশ" : "View All Results & Publish Scores",
                language === 'bn' ? "স্টুডেন্ট ম্যানেজমেন্ট ও এক্সাম ID তৈরি" : "Student Management & Exam ID Creation",
                language === 'bn' ? "লিসেনিং, রিডিং, রাইটিং ও স্পিকিং সেট ক্রিয়েটর" : "Listening, Reading, Writing & Speaking Set Creator",
                language === 'bn' ? "মক প্যাকেজ ও বান্ডেল প্রাইসিং ম্যানেজমেন্ট" : "Mock Package & Bundle Pricing Management",
                language === 'bn' ? "কুপন কোড ম্যানেজমেন্ট" : "Coupon Code Management",
                language === 'bn' ? "রেভিনিউ অ্যানালিটিক্স ও মাসিক চার্ট" : "Revenue Analytics & Monthly Charts",
                language === 'bn' ? "রিপোর্ট এক্সপোর্ট (স্টুডেন্ট, পার্চেজ, রেজাল্ট)" : "Reports Export (Students, Purchases, Results)",
                language === 'bn' ? "পেমেন্ট চ্যানেল ব্রেকডাউন (বিকাশ, নগদ, ব্যাংক)" : "Payment Channel Breakdown (bKash, Nagad, Bank)",
                language === 'bn' ? "রাইটিং এ এক্সামিনারের মন্তব্য" : "Examiner Remarks on Writing",
            ]
        },
        {
            title: language === 'bn' ? "স্টুডেন্ট প্যানেল" : "Student Panel",
            subtitle: language === 'bn' ? "স্টুডেন্টদের জন্য" : "For Students",
            icon: LuGraduationCap,
            color: "#3B82F6",
            features: [
                language === 'bn' ? "সব মডিউল প্র্যাক্টিস (লিসেনিং, রিডিং, রাইটিং)" : "All Module Practice (Listening, Reading, Writing)",
                language === 'bn' ? "রেজাল্ট হিস্ট্রি ও বিস্তারিত স্কোর ব্রেকডাউন" : "Result History & Detailed Score Breakdown",
                language === 'bn' ? "পারফরম্যান্স অ্যানালিটিক্স ও ব্যান্ড স্কোর চার্ট" : "Performance Analytics & Band Score Charts",
                language === 'bn' ? "PDF স্কোর রিপোর্ট ও ইনভয়েস ডাউনলোড" : "PDF Score Report & Invoice Download",
                language === 'bn' ? "আনসার রিভিউ ও লিসেনিং ট্রান্সক্রিপ্ট" : "Answer Review & Listening Transcript",
                language === 'bn' ? "ফ্রি মক টেস্ট ক্লেইম" : "Free Mock Test Claim",
                language === 'bn' ? "মক টেস্ট কিনুন ও কুপন ব্যবহার করুন" : "Purchase Mock Tests & Apply Coupon",
                language === 'bn' ? "গুগল লগইন ও পাসওয়ার্ড ভুলে গেছেন (OTP)" : "Google Login & Forgot Password (OTP)",
            ]
        },
        {
            title: language === 'bn' ? "অটোমেশন ও স্মার্ট ফিচার" : "Automation & Smart Features",
            subtitle: language === 'bn' ? "বিল্ট-ইন ইন্টেলিজেন্স" : "Built-in Intelligence",
            icon: LuZap,
            color: "#A855F7",
            features: [
                language === 'bn' ? "অটো মার্কিং (লিসেনিং ও রিডিং ইনস্ট্যান্ট গ্রেডিং)" : "Auto Marking (Listening & Reading Instant Grading)",
                language === 'bn' ? "অটো এক্সাম ID জেনারেশন ও স্টুডেন্ট রেকর্ড তৈরি" : "Auto Exam ID Generation & Student Record Creation",
                language === 'bn' ? "অটো ইমেইল নোটিফিকেশন (Welcome, Purchase, Result, OTP)" : "Auto Email Notifications (Welcome, Purchase, Result, OTP)",
                language === 'bn' ? "চিটিং করলে অটো এক্সাম টার্মিনেশন" : "Auto Exam Termination on Cheating",
                language === 'bn' ? "অটো টাইমার ও অটো সাবমিট" : "Auto Timer & Auto Submit",
                language === 'bn' ? "পেমেন্ট ইন্টিগ্রেশন (বিকাশ, নগদ, ব্যাংক)" : "Payment Integration (bKash, Nagad, Bank)",
                language === 'bn' ? "কুপন ভ্যালিডেশন ও ডিসকাউন্ট ক্যালকুলেশন" : "Coupon Validation & Discount Calculation",
                language === 'bn' ? "Google OAuth ও JWT অথেন্টিকেশন" : "Google OAuth & JWT Authentication",
                language === 'bn' ? "৫টি প্রিমিয়াম ব্র্যান্ডেড ইমেইল টেমপ্লেট" : "5 Premium Branded Email Templates",
            ]
        }
    ];

    const totalFeatures = featureCategories.reduce((acc, cat) => acc + cat.features.length, 0);

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                {/* Background Decorations */}
                <div className={`${styles.bgOrb} ${styles.bgOrb1}`} />
                <div className={`${styles.bgOrb} ${styles.bgOrb2}`} />
                <div className={`${styles.bgOrb} ${styles.bgOrb3}`} />

                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className={styles.header}
                >
                    <motion.span
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className={styles.badge}
                    >
                        <LuBuilding2 size={15} />
                        {language === 'bn' ? 'কোচিং সেন্টারের জন্য সম্পূর্ণ সমাধান' : 'Complete Solution for Coaching Centers'}
                    </motion.span>

                    <h2 className={`${styles.title} ${bengaliClass}`}>
                        {language === 'bn' ? (
                            <>
                                আমাদের সফটওয়্যারে যা যা{" "}
                                <span className={styles.titleHighlight}>আছে</span>
                            </>
                        ) : (
                            <>
                                Everything In Our{" "}
                                <span className={styles.titleHighlight}>Software</span>
                            </>
                        )}
                    </h2>

                    <p className={`${styles.subtitle} ${bengaliClass}`}>
                        {language === 'bn'
                            ? 'British Council এর এক্সাম ইন্টারফেস, Admin Panel, Student Dashboard এবং স্মার্ট অটোমেশন — সব একসাথে।'
                            : 'British Council exam interface, Admin Panel, Student Dashboard and Smart Automation — all in one package.'}
                    </p>

                    {/* Stats Row */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className={styles.stats}
                    >
                        <div className={styles.stat}>
                            <span className={styles.statNumber}>{totalFeatures}+</span>
                            <span className={`${styles.statLabel} ${bengaliClass}`}>
                                {language === 'bn' ? 'ফিচারস' : 'Features'}
                            </span>
                        </div>
                        <div className={styles.statDivider} />
                        <div className={styles.stat}>
                            <span className={styles.statNumber}>4</span>
                            <span className={`${styles.statLabel} ${bengaliClass}`}>
                                {language === 'bn' ? 'মডিউল' : 'Modules'}
                            </span>
                        </div>
                        <div className={styles.statDivider} />
                        <div className={styles.stat}>
                            <span className={styles.statNumber}>100%</span>
                            <span className={`${styles.statLabel} ${bengaliClass}`}>
                                {language === 'bn' ? 'অটোমেটেড' : 'Automated'}
                            </span>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Feature Cards Grid - 2x2 */}
                <div className={styles.grid}>
                    {featureCategories.map((category, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
                            className={styles.card}
                            onMouseEnter={() => setActiveCard(index)}
                            onMouseLeave={() => setActiveCard(null)}
                            style={{
                                '--card-color': category.color,
                                '--card-glow': `${category.color}20`,
                            }}
                        >
                            {/* Gradient border overlay */}
                            <div className={styles.cardBorder} />

                            {/* Card Content */}
                            <div className={styles.cardInner}>
                                {/* Card Header */}
                                <div className={styles.cardHeader}>
                                    <div className={styles.iconWrap}>
                                        <div className={styles.iconGlow} />
                                        <div className={styles.icon}>
                                            <category.icon size={22} />
                                        </div>
                                    </div>
                                    <div className={styles.cardTitles}>
                                        <h3 className={`${styles.cardTitle} ${bengaliClass}`}>
                                            {category.title}
                                        </h3>
                                        <p className={`${styles.cardSubtitle} ${bengaliClass}`}>
                                            {category.subtitle}
                                        </p>
                                    </div>
                                    <div className={styles.cardCount}>
                                        {category.features.length}
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className={styles.cardDivider} />

                                {/* Features List */}
                                <ul className={styles.featureList}>
                                    {category.features.map((feature, fIndex) => (
                                        <motion.li
                                            key={fIndex}
                                            initial={{ opacity: 0, x: -12 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.35, delay: 0.15 + fIndex * 0.04 }}
                                            className={styles.featureItem}
                                        >
                                            <div className={styles.featureCheck}>
                                                <LuCheck size={12} strokeWidth={3} />
                                            </div>
                                            <span className={`${styles.featureText} ${bengaliClass}`}>
                                                {feature}
                                            </span>
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className={styles.cta}
                >
                    <div className={styles.ctaInner}>
                        <div className={styles.ctaContent}>
                            <div className={styles.ctaIcon}>
                                <LuSparkles size={22} />
                            </div>
                            <div>
                                <p className={`${styles.ctaTitle} ${bengaliClass}`}>
                                    {language === 'bn' ? 'আপনার ব্র্যান্ডিং সহ কাস্টমাইজ করুন' : 'Customize With Your Branding'}
                                </p>
                                <p className={`${styles.ctaDesc} ${bengaliClass}`}>
                                    {language === 'bn' ? 'লোগো, কালার, ডোমেইন — সবকিছু আপনার মতো করে' : 'Logo, colors, domain — everything tailored to you'}
                                </p>
                            </div>
                        </div>
                        <a
                            href="#pricing"
                            className={`${styles.ctaBtn} ${bengaliClass}`}
                        >
                            {language === 'bn' ? 'প্রাইসিং দেখুন' : 'View Pricing'}
                            <LuChevronRight size={16} />
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default IeltsFeatures;
