"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";
import {
    LuCheck,
    LuX,
    LuBuilding,
    LuBuilding2,
    LuGraduationCap,
    LuSparkles,
    LuPhone,
    LuArrowRight,
    LuUsers,
    LuShield,
    LuBrain,
    LuHeadphones,
    LuMonitor,
    LuZap,
    LuChevronDown,
    LuPlay,
    LuVideo,
} from "react-icons/lu";
import { FaWhatsapp } from "react-icons/fa";
import BracketLabel from "@/components/Home/BracketLabel";
import { EdgeDots } from "@/components/Home/Decor";
import { reveal } from "@/components/Aboutpage/sections/shared";

const IeltsPricing = () => {
    const { language } = useLanguage();
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";
    const router = useRouter();
    const [expandedPackage, setExpandedPackage] = useState(null);
    const [featureVideoOpen, setFeatureVideoOpen] = useState(false);

    const allFeatureCategories = [
        {
            title: language === 'bn' ? "BC এক্সাম ইন্টারফেস" : "BC Exam Interface",
            icon: LuMonitor,
            color: "#FD9A00",
            features: [
                language === 'bn' ? "টেক্সট হাইলাইটিং ও নোট নেওয়া" : "Text Highlighting & Notes",
                language === 'bn' ? "রিয়েল টাইমার ও অটো সাবমিট" : "Real Timer & Auto Submit",
                language === 'bn' ? "হুবহু BC লেআউট, স্প্লিট-স্ক্রিন ভিউ" : "Exact BC Layout, Split-Screen View",
                language === 'bn' ? "ফুলস্ক্রিন এক্সাম মোড" : "Fullscreen Exam Mode",
                language === 'bn' ? "অ্যান্টি-চিটিং (ট্যাব সুইচ, কপি/পেস্ট ব্লক)" : "Anti-Cheating Protection",
                language === 'bn' ? "লিসেনিং অডিও প্লেয়ার" : "Audio Player for Listening",
                language === 'bn' ? "রাইটিং ওয়ার্ড কাউন্টার" : "Word Counter for Writing",
                language === 'bn' ? "প্রশ্ন নেভিগেশন ও সেকশন প্রগ্রেস" : "Question Navigation & Progress",
                language === 'bn' ? "মাল্টি-সেট এক্সাম সাপোর্ট" : "Multi-Set Exam Support",
            ]
        },
        {
            title: language === 'bn' ? "অ্যাডমিন প্যানেল" : "Admin Panel",
            icon: LuShield,
            color: "#0CB2A9",
            features: [
                language === 'bn' ? "সব রেজাল্ট দেখুন ও স্কোর পাবলিশ" : "View All Results & Publish Scores",
                language === 'bn' ? "স্টুডেন্ট ম্যানেজমেন্ট ও এক্সাম ID তৈরি" : "Student Management & Exam ID Creation",
                language === 'bn' ? "L/R/W সেট ক্রিয়েটর" : "L/R/W Set Creator",
                language === 'bn' ? "মক প্যাকেজ ও প্রাইসিং ম্যানেজমেন্ট" : "Mock Package & Pricing Management",
                language === 'bn' ? "রেভিনিউ অ্যানালিটিক্স ও মাসিক চার্ট" : "Revenue Analytics & Charts",
                language === 'bn' ? "রিপোর্ট এক্সপোর্ট (স্টুডেন্ট, পার্চেজ, রেজাল্ট)" : "Export Reports (Students, Purchases, Results)",
                language === 'bn' ? "রাইটিং এ এক্সামিনারের মন্তব্য" : "Examiner Remarks on Writing",
            ]
        },
        {
            title: language === 'bn' ? "স্টুডেন্ট ড্যাশবোর্ড" : "Student Dashboard",
            icon: LuGraduationCap,
            color: "#3B82F6",
            features: [
                language === 'bn' ? "সব মডিউল প্র্যাক্টিস (L/R/W)" : "All Module Practice (L/R/W)",
                language === 'bn' ? "রেজাল্ট হিস্ট্রি ও বিস্তারিত স্কোর" : "Result History & Detailed Score",
                language === 'bn' ? "পারফরম্যান্স অ্যানালিটিক্স ও ব্যান্ড স্কোর চার্ট" : "Performance Analytics & Band Score Charts",
                language === 'bn' ? "আনসার রিভিউ ও লিসেনিং ট্রান্সক্রিপ্ট" : "Answer Review & Listening Transcript",
                language === 'bn' ? "PDF স্কোর রিপোর্ট ডাউনলোড" : "PDF Score Report Download",
                language === 'bn' ? "গুগল লগইন ও OTP সাপোর্ট" : "Google Login & OTP Support",
            ]
        },
        {
            title: language === 'bn' ? "অটোমেশন ও স্মার্ট ফিচার" : "Automation & Smart Features",
            icon: LuZap,
            color: "#A855F7",
            features: [
                language === 'bn' ? "অটো মার্কিং (লিসেনিং ও রিডিং)" : "Auto Marking (Listening & Reading)",
                language === 'bn' ? "অটো এক্সাম ID জেনারেশন" : "Auto Exam ID Generation",
                language === 'bn' ? "অটো ইমেইল নোটিফিকেশন (Welcome, Result, OTP)" : "Auto Email Notifications (Welcome, Result, OTP)",
                language === 'bn' ? "চিটিং করলে অটো এক্সাম বন্ধ" : "Auto Exam Termination on Cheating",
                language === 'bn' ? "পেমেন্ট ইন্টিগ্রেশন (বিকাশ, নগদ, ব্যাংক)" : "Payment Integration (bKash, Nagad, Bank)",
                language === 'bn' ? "Google OAuth ও JWT অথেন্টিকেশন" : "Google OAuth & JWT Authentication",
                language === 'bn' ? "৫টি প্রিমিয়াম ব্র্যান্ডেড ইমেইল টেমপ্লেট" : "5 Premium Branded Email Templates",
            ]
        }
    ];

    const packages = [
        {
            id: "starter",
            demoLink: "https://bestieltsbd.vercel.app/",
            featureVideoUrl: "https://drive.google.com/file/d/1H2eCp2g0CI54kq3Ov72E8otdmwZ0u8wu/preview",
            name: language === 'bn' ? "স্টার্টার" : "Starter",
            subtitle: language === 'bn' ? "ছোট কোচিং সেন্টারের জন্য" : "For Small Coaching Centers",
            oneTimePrice: 12500,
            originalPrice: 25000,
            setupPrice: 10000,
            monthlyPrice: 1000,
            installments: 1,
            icon: LuBuilding,
            color: "secondary",
            popular: false,
            studentLimit: "Unlimited",
            features: [
                { text: language === 'bn' ? "কমপ্লিট এক্সাম ইঞ্জিন (L/R/W)" : "Complete Exam Engine (L/R/W)", included: true, highlight: true },
                { text: language === 'bn' ? "ইন্টারন্যাশনাল স্ট্যান্ডার্ড ইন্টারফেস (BC/IDP)" : "International Interface (BC/IDP Standard)", included: true, highlight: true },
                { text: language === 'bn' ? "স্মার্ট ফিচার: হাইলাইট, নোট, থিম, ফন্ট কন্ট্রোল" : "Smart Features: Highlight, Notes, 3 Themes, Font Control", included: true },
                { text: language === 'bn' ? "২০ সেট ফ্রি প্রিমিয়াম মক টেস্ট কোয়েশ্চেন" : "20 Sets Free Premium Mock Test Questions", included: true, highlight: true },
                { text: language === 'bn' ? "যেকোনো সময় আনলিমিটেড মক টেস্ট নেওয়া যাবে" : "Unlimited Mock Tests Can Be Conducted Anytime", included: true },
                { text: language === 'bn' ? "১০,০০০ স্টুডেন্ট আইডি (বার্ষিক)" : "10,000 Student IDs (Annual)", included: true },
                { text: language === 'bn' ? "১৮ ধরনের অ্যাডভান্সড কোশ্চেন টাইপ" : "18 Advanced Question Types", included: true },
                { text: language === 'bn' ? "মার্কিং: অটো (Listening & Reading) · ম্যানুয়াল (Writing) · Speaking স্কোর ইনপুট অপশন" : "Marking: Auto (Listening & Reading) · Manual (Writing) · Speaking Score Input", included: true },
                { text: language === 'bn' ? "অ্যাডভান্সড স্টুডেন্ট ড্যাশবোর্ড (রেজাল্ট, ভুল চেক, উত্তর দেখা)" : "Advanced Student Dashboard (Result, Review, Answers)", included: true },
                { text: language === 'bn' ? "Admin Dashboard থেকে Student Create, Manage এবং Result দেখার সুবিধা" : "Create, Manage Students & View Results from Admin Dashboard", included: true },
                { text: language === 'bn' ? "Student Dashboard থেকে নিজের Marking দেখার সুযোগ" : "Students Can View Their Own Marking from Student Dashboard", included: true },
                { text: language === 'bn' ? "অটো ইমেইল নোটিফিকেশন: স্টুডেন্ট একাউন্ট তৈরিতে Welcome Mail এবং রেজাল্ট পাবলিশ হলে Result Mail — সম্পূর্ণ অটোমেশন সিস্টেমের মাধ্যমে" : "Auto Email Notification: Welcome Mail on Student Registration & Result Mail on Result Published — via Automation System", included: true },
            ]
        },
        {
            id: "professional",
            demoLink: "https://bestieltsbd.com/",
            name: language === 'bn' ? "প্রফেশনাল" : "Professional",
            subtitle: language === 'bn' ? "AI সহ সম্পূর্ণ সমাধান" : "Complete AI Solution",
            oneTimePrice: 25000,
            originalPrice: 60000,
            setupPrice: 10000,
            monthlyPrice: 2000,
            installments: 2,
            icon: LuBuilding2,
            color: "primary",
            popular: true,
            studentLimit: "Unlimited",
            features: [
                { text: language === 'bn' ? "ইন্টারন্যাশনাল স্ট্যান্ডার্ড Learning Management System (LMS) ওয়েবসাইট বিল্ড" : "International Standard Learning Management System (LMS) Website Build", included: true, highlight: true },
                { text: language === 'bn' ? "মডার্ন প্রিমিয়াম লুকস ওয়েবসাইট বিল্ড" : "Modern Premium Looks Website Build", included: true, highlight: true },
                { text: language === 'bn' ? "কোর্স শোকেস — ওয়েবসাইটে সুন্দরভাবে কোর্স প্রদর্শন করানো যাবে" : "Course Showcase — Display Courses Beautifully on Website", included: true },
                { text: language === 'bn' ? "কমপ্লিট IELTS মক টেস্ট ইঞ্জিন (L/R/W)" : "Complete IELTS Mock Test Engine (L/R/W)", included: true, highlight: true },
                { text: language === 'bn' ? "ইন্টারন্যাশনাল স্ট্যান্ডার্ড ইন্টারফেস (BC/IDP)" : "International Interface (BC/IDP Standard)", included: true, highlight: true },
                { text: language === 'bn' ? "স্মার্ট ফিচার: হাইলাইট, নোট, থিম, ফন্ট কন্ট্রোল" : "Smart Features: Highlight, Notes, 3 Themes, Font Control", included: true },
                { text: language === 'bn' ? "২০ সেট ফ্রি প্রিমিয়াম মক টেস্ট কোয়েশ্চেন" : "20 Sets Free Premium Mock Test Questions", included: true, highlight: true },
                { text: language === 'bn' ? "পরবর্তীতে আরও প্রশ্ন আপলোড করার সুযোগ" : "Option to Upload More Questions Later", included: true },
                { text: language === 'bn' ? "যেকোনো সময় আনলিমিটেড মক টেস্ট নেওয়া যাবে" : "Unlimited Mock Tests Can Be Conducted Anytime", included: true },
                { text: language === 'bn' ? "আনলিমিটেড স্টুডেন্ট আইডি" : "Unlimited Student IDs", included: true },
                { text: language === 'bn' ? "মার্কিং: অটো (Listening & Reading) · ম্যানুয়াল (Writing) · Speaking স্কোর ইনপুট অপশন" : "Marking: Auto (Listening & Reading) · Manual (Writing) · Speaking Score Input", included: true },
                { text: language === 'bn' ? "অ্যাডভান্সড স্টুডেন্ট ড্যাশবোর্ড (রেজাল্ট, ভুল চেক, উত্তর দেখা)" : "Advanced Student Dashboard (Result, Review, Answers)", included: true },
                { text: language === 'bn' ? "Admin Dashboard থেকে Student Create, Manage এবং Result দেখার সুবিধা" : "Create, Manage Students & View Results from Admin Dashboard", included: true },
                { text: language === 'bn' ? "Student Dashboard থেকে নিজের Marking দেখার সুযোগ" : "Students Can View Their Own Marking from Student Dashboard", included: true },
                { text: language === 'bn' ? "অটো ইমেইল নোটিফিকেশন: স্টুডেন্ট একাউন্ট তৈরিতে Welcome Mail এবং রেজাল্ট পাবলিশ হলে Result Mail — সম্পূর্ণ অটোমেশন সিস্টেমের মাধ্যমে" : "Auto Email Notification: Welcome Mail on Student Registration & Result Mail on Result Published — via Automation System", included: true },
            ]
        },
        {
            id: "enterprise",
            demoLink: null,
            name: language === 'bn' ? "এন্টারপ্রাইজ" : "Enterprise",
            subtitle: language === 'bn' ? "প্রিমিয়াম বিজনেস সমাধান" : "Premium Business Solution",
            oneTimePrice: 120000,
            setupPrice: 20000,
            monthlyPrice: 4000,
            installments: 3,
            icon: LuGraduationCap,
            color: "tertiary",
            popular: false,
            studentLimit: "Unlimited",
            features: [
                { text: language === 'bn' ? "World-class Full Website Development" : "World-class Full Website Development", included: true, highlight: true },
                { text: language === 'bn' ? "মডার্ন প্রিমিয়াম লুকস ওয়েবসাইট বিল্ড" : "Modern Premium Looks Website Build", included: true, highlight: true },
                { text: language === 'bn' ? "অটো স্টুডেন্ট এনরোলমেন্ট সিস্টেম" : "Auto Student Enrollment System", included: true, highlight: true },
                { text: language === 'bn' ? "অটো পেমেন্ট সিস্টেম (বিকাশ, নগদ, ব্যাংক)" : "Auto Payment System (bKash, Nagad, Bank)", included: true, highlight: true },
                { text: language === 'bn' ? "অটো ব্যাচ ক্রিয়েশন সিস্টেম" : "Auto Batch Creation System", included: true },
                { text: language === 'bn' ? "কমপ্লিট IELTS মক টেস্ট ইঞ্জিন (L/R/W)" : "Complete IELTS Mock Test Engine (L/R/W)", included: true, highlight: true },
                { text: language === 'bn' ? "অটো মক টেস্ট পার্চেজ সিস্টেম" : "Auto Mock Test Purchase System", included: true },
                { text: language === 'bn' ? "অটো মার্কিং সিস্টেম" : "Auto Marking System", included: true },
                { text: language === 'bn' ? "অটো রেজাল্ট পাবলিশ সিস্টেম" : "Auto Result Publishing System", included: true },
                { text: language === 'bn' ? "Admin Dashboard: অটো রেভিনিউ ট্র্যাকিং সিস্টেম" : "Admin Dashboard: Auto Revenue Tracking System", included: true },
                { text: language === 'bn' ? "অর্ডার ম্যানেজমেন্ট সিস্টেম" : "Order Management System", included: true },
                { text: language === 'bn' ? "রেভিনিউ অ্যানালিটিক্স: দৈনিক, মাসিক ও বার্ষিক চার্ট ও রিপোর্ট" : "Revenue Analytics: Daily, Monthly & Yearly Charts & Reports", included: true },
                { text: language === 'bn' ? "রিপোর্ট ডাউনলোড সিস্টেম (PDF ও Excel)" : "Report Download System (PDF & Excel)", included: true },
                { text: language === 'bn' ? "প্রতিদিন কতটি মক টেস্ট কেনা হচ্ছে তার তথ্য" : "Daily Mock Test Purchase Statistics", included: true },
                { text: language === 'bn' ? "মক প্যাকেজ ম্যানেজমেন্ট সিস্টেম" : "Mock Package Management System", included: true },
                { text: language === 'bn' ? "প্যাকেজ সেলস ও অফার সিস্টেম" : "Package Sales & Offer System", included: true },
                { text: language === 'bn' ? "কুপন কোড সিস্টেম (ডিসকাউন্ট অফার)" : "Coupon Code System (Discount Offers)", included: true },
                { text: language === 'bn' ? "Student Dashboard: Exam দিয়ে Marking দেখার সুযোগ" : "Student Dashboard: View Marking After Exam", included: true },
                { text: language === 'bn' ? "কোথায় ভুল হয়েছে তা বিস্তারিত দেখার সুযোগ" : "Detailed Mistake Analysis — See Where You Went Wrong", included: true },
                { text: language === 'bn' ? "সঠিক উত্তর কী হওয়া উচিত ছিল তা দেখার সুযোগ" : "View Correct Answers — What the Right Answer Should Have Been", included: true },
                { text: language === 'bn' ? "Advanced AI Marking System (L/R/W/S)" : "Advanced AI Marking System (L/R/W/S)", included: true, highlight: true },
                { text: language === 'bn' ? "Premium High-Speed Hosting + Domain" : "Premium High-Speed Hosting + Domain", included: true },
                { text: language === 'bn' ? "Complete White-label Solution" : "Complete White-label Solution", included: true },
                { text: language === 'bn' ? "২ বছর Free Support & Updates" : "2 Years Free Support & Updates", included: true },
                { text: language === 'bn' ? "24/7 Dedicated Support Team" : "24/7 Dedicated Support Team", included: true },
                { text: language === 'bn' ? "Lifetime Source Code Access" : "Lifetime Source Code Access", included: true },
            ]
        }
    ];

    const handleContact = () => {
        window.open("https://wa.me/8801711946614", "_blank");
    };

    const isBn = language === "bn";
    const bn = bengaliClass;
    const payLabel = (n) =>
        n === 1
            ? (isBn ? "ওয়ান টাইম পেমেন্ট" : "One-time payment")
            : n === 2
            ? (isBn ? "দুই কিস্তিতে পেমেন্ট" : "Pay in 2 installments")
            : (isBn ? "তিন কিস্তিতে পেমেন্ট" : "Pay in 3 installments");

    return (
        <>
        <section id="pricing" className="relative scroll-mt-16 overflow-hidden bg-[color:var(--tone-soft)] py-24 text-white lg:py-32">
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                <div className="absolute left-1/2 top-40 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[#F8921C]/[0.06] blur-3xl" />
                <EdgeDots />
            </div>

            <div className="container relative z-10 mx-auto px-6 lg:px-10">
                {/* ===== heading ===== */}
                <div className="mx-auto max-w-2xl text-center">
                    <motion.div {...reveal(0)} className="mb-7">
                        <BracketLabel bn={bn} size="lg">{isBn ? "ইনস্টিটিউট লাইসেন্সিং" : "Licensing"}</BracketLabel>
                    </motion.div>
                    <motion.h2 {...reveal(1)} style={{ color: "#fff" }} className={`text-[1.7rem] font-bold leading-[1.25] sm:text-3xl lg:text-[2.35rem] ${bn}`}>
                        {isBn ? (
                            <>আপনার ইনস্টিটিউটের জন্য <i className="font-light">সঠিক প্ল্যান</i></>
                        ) : (
                            <>Choose the Right <i className="font-light">Plan</i> for Your Institute</>
                        )}
                    </motion.h2>
                    <motion.p {...reveal(2)} className={`mt-4 text-sm leading-7 text-white/60 sm:text-base ${bn}`}>
                        {isBn
                            ? "আপনার প্রয়োজন অনুযায়ী প্ল্যান বেছে নিন। সব প্ল্যানে Admin Dashboard অন্তর্ভুক্ত।"
                            : "Pick the plan that fits your needs. Every plan includes the Admin Dashboard."}
                    </motion.p>
                </div>

                {/* ===== cards ===== */}
                <div className="mx-auto mt-16 grid max-w-7xl items-start gap-6 lg:grid-cols-3">
                    {packages.map((pkg, index) => {
                        const pop = pkg.popular;
                        const open = expandedPackage === pkg.id;
                        return (
                            <motion.div key={pkg.id} {...reveal(index)} className={`relative ${pop ? "lg:-mt-5" : ""}`}>
                                {pop && (
                                    <span className={`absolute -top-3.5 left-1/2 z-10 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-[#F8921C] px-4 py-1.5 text-xs font-bold uppercase text-black shadow-[0_8px_24px_-8px_rgba(248,146,28,0.9)] ${bn ? "tracking-normal" : "tracking-wider"} ${bn}`}>
                                        <LuSparkles size={13} />
                                        {isBn ? "সবচেয়ে জনপ্রিয়" : "Most Popular"}
                                    </span>
                                )}

                                <div
                                    className={`flex h-full flex-col rounded-[1.5rem] border p-7 transition-all duration-300 sm:p-8 ${
                                        pop
                                            ? "border-[#F8921C]/70 bg-gradient-to-b from-[#F8921C]/[0.10] to-[color:var(--tone-deep)] shadow-[0_40px_80px_-40px_rgba(248,146,28,0.55)]"
                                            : "border-white/10 bg-[color:var(--tone-deep)] hover:border-white/25"
                                    }`}
                                >
                                    {/* header */}
                                    <div className="flex items-center gap-4">
                                        <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-xl ${pop ? "bg-[#F8921C] text-black" : "bg-[#F8921C]/10 text-[#F8921C]"}`}>
                                            <pkg.icon size={24} />
                                        </span>
                                        <div>
                                            <h3 style={{ color: "#fff" }} className={`text-xl font-bold ${bn}`}>{pkg.name}</h3>
                                            <p className={`text-[13px] text-white/55 ${bn}`}>{pkg.subtitle}</p>
                                        </div>
                                        <span className="ml-auto self-start text-sm font-bold tabular-nums text-white/20">0{index + 1}</span>
                                    </div>

                                    {/* price */}
                                    <div className="mt-7 border-y border-white/10 py-6">
                                        {pkg.originalPrice && (
                                            <div className="mb-1 flex items-center gap-2">
                                                <span className="text-base text-white/35 line-through">৳{pkg.originalPrice.toLocaleString()}</span>
                                                <span className="rounded-full bg-[#F8921C]/15 px-2 py-0.5 text-[11px] font-bold text-[#F8921C]">
                                                    {Math.round((1 - pkg.oneTimePrice / pkg.originalPrice) * 100)}% OFF
                                                </span>
                                            </div>
                                        )}
                                        <span className="text-[2.6rem] font-bold leading-none tracking-tight text-white">৳{pkg.oneTimePrice.toLocaleString()}</span>
                                        {pkg.installments && (
                                            <p className={`mt-3 flex items-center gap-1.5 text-[13px] text-white/60 ${bn}`}>
                                                <LuCheck size={14} className="text-[#F8921C]" />
                                                {payLabel(pkg.installments)}
                                            </p>
                                        )}
                                    </div>

                                    {/* features */}
                                    <ul className="mt-6 flex-1 space-y-3">
                                        {pkg.features.map((f, idx) => (
                                            <li key={idx} className="flex items-start gap-3">
                                                <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${f.highlight ? "bg-[#F8921C] text-black" : "bg-white/[0.07] text-[#F8921C]"}`}>
                                                    <LuCheck size={11} strokeWidth={3} />
                                                </span>
                                                <span className={`text-[13.5px] leading-snug ${f.highlight ? "font-medium text-white" : "text-white/70"} ${bn}`}>{f.text}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* all features toggle */}
                                    <button
                                        type="button"
                                        onClick={() => setExpandedPackage(open ? null : pkg.id)}
                                        aria-expanded={open}
                                        className={`mt-7 flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-white/80 transition-colors hover:border-[#F8921C]/50 hover:text-white ${bn}`}
                                    >
                                        {open ? (isBn ? "কম দেখুন" : "Show less") : (isBn ? "সব ফিচার দেখুন" : "View all features")}
                                        <LuChevronDown size={16} className={`text-[#F8921C] transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
                                    </button>

                                    <AnimatePresence>
                                        {open && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="space-y-3 pt-4">
                                                    {allFeatureCategories.map((cat) => (
                                                        <div key={cat.title} className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-4">
                                                            <div className="mb-3 flex items-center gap-2">
                                                                <cat.icon size={15} className="text-[#F8921C]" />
                                                                <span className={`text-[12px] font-bold uppercase text-white/85 ${bn ? "tracking-normal" : "tracking-wider"} ${bn}`}>{cat.title}</span>
                                                            </div>
                                                            <ul className="space-y-1.5">
                                                                {cat.features.map((feat) => (
                                                                    <li key={feat} className={`flex items-start gap-2 text-[13px] text-white/65 ${bn}`}>
                                                                        <LuCheck size={12} className="mt-1 shrink-0 text-[#F8921C]" strokeWidth={3} />
                                                                        {feat}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* CTAs */}
                                    <div className="mt-5 flex flex-col gap-2.5">
                                        <button
                                            type="button"
                                            onClick={handleContact}
                                            className={`group inline-flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-semibold uppercase transition-colors ${
                                                pop ? "bg-[#F8921C] text-black hover:bg-[#e07d0a]" : "bg-white text-black hover:bg-[#F8921C]"
                                            } ${bn ? "tracking-normal" : "tracking-wide"} ${bn}`}
                                        >
                                            <FaWhatsapp size={17} />
                                            {isBn ? "যোগাযোগ করুন" : "Contact Us"}
                                            <LuArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                                        </button>
                                        {(pkg.demoLink || pkg.featureVideoUrl) && (
                                            <div className="flex gap-2.5">
                                                {pkg.demoLink && (
                                                    <a
                                                        href={pkg.demoLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-white/20 py-3 text-[13px] font-semibold text-white transition-colors hover:border-[#F8921C] hover:text-[#F8921C] ${bn}`}
                                                    >
                                                        <LuPlay size={14} />
                                                        {isBn ? "লাইভ ডেমো" : "Live Demo"}
                                                    </a>
                                                )}
                                                {pkg.featureVideoUrl && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setFeatureVideoOpen(true)}
                                                        className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-white/20 py-3 text-[13px] font-semibold text-white transition-colors hover:border-[#F8921C] hover:text-[#F8921C] ${bn}`}
                                                    >
                                                        <LuVideo size={14} />
                                                        {isBn ? "ফিচার ভিডিও" : "Feature Video"}
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* ===== demo strip ===== */}
                <motion.div
                    {...reveal(1)}
                    className="mx-auto mt-14 flex max-w-4xl flex-col items-center gap-6 rounded-[1.5rem] border border-white/10 bg-[color:var(--tone-deep)] p-6 sm:flex-row sm:p-7"
                >
                    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#F8921C]/10 text-[#F8921C]">
                        <LuPhone size={22} />
                    </span>
                    <div className="text-center sm:text-left">
                        <p className={`font-semibold text-white ${bn}`}>{isBn ? "ডেমো দেখতে চান?" : "Want to see a demo?"}</p>
                        <p className={`text-sm text-white/55 ${bn}`}>{isBn ? "আমাদের সাথে কথা বলুন, ফ্রি ডেমো পান!" : "Talk to us for a free demo of the software."}</p>
                        <a href="tel:+8801711946614" className="mt-1 inline-block text-lg font-bold text-[#F8921C]">+880 1711-946614</a>
                    </div>
                    <div className="flex gap-2.5 sm:ml-auto">
                        <a
                            href="https://wa.me/8801711946614"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-full bg-[#F8921C] px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-[#e07d0a]"
                        >
                            <FaWhatsapp size={17} />
                            WhatsApp
                        </a>
                        <a
                            href="tel:+8801711946614"
                            className={`inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-[#F8921C] hover:text-[#F8921C] ${bn}`}
                        >
                            <LuPhone size={16} />
                            {isBn ? "কল করুন" : "Call"}
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>

        {/* ===== feature video modal ===== */}
        <AnimatePresence>
            {featureVideoOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
                    onClick={() => setFeatureVideoOpen(false)}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.92 }}
                        transition={{ duration: 0.25 }}
                        role="dialog"
                        aria-modal="true"
                        className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between bg-[color:var(--tone-soft)] px-5 py-3">
                            <span className={`flex items-center gap-2 text-sm font-semibold text-white ${bn}`}>
                                <LuVideo size={16} className="text-[#F8921C]" />
                                {isBn ? "ফিচার ভিডিও" : "Feature Video"}
                            </span>
                            <button
                                type="button"
                                onClick={() => setFeatureVideoOpen(false)}
                                aria-label="Close"
                                className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-[#F8921C] hover:text-black"
                            >
                                <LuX size={16} />
                            </button>
                        </div>
                        <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                            <iframe
                                src="https://drive.google.com/file/d/1H2eCp2g0CI54kq3Ov72E8otdmwZ0u8wu/preview"
                                className="absolute inset-0 h-full w-full"
                                allow="autoplay"
                                allowFullScreen
                                title="IELTS software feature video"
                            />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
        </>
    );
};

export default IeltsPricing;
