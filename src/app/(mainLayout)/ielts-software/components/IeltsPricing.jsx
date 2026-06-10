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
} from "react-icons/lu";
import { FaWhatsapp } from "react-icons/fa";

const IeltsPricing = () => {
    const { language } = useLanguage();
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";
    const router = useRouter();
    const [expandedPackage, setExpandedPackage] = useState(null);

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
            color: "#C4EE18",
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

    const colorClasses = {
        secondary: {
            bg: "bg-[#C4EE18]/10",
            text: "text-[#C4EE18]",
            border: "border-[#C4EE18]/30",
            button: "bg-[#C4EE18] hover:bg-[#b3dc15] text-gray-900",
            gradient: "from-[#C4EE18] to-[#9fc412]",
            shadow: "shadow-[#C4EE18]/30"
        },
        primary: {
            bg: "bg-[#FD9A00]/10",
            text: "text-[#FD9A00]",
            border: "border-[#FD9A00]/30",
            button: "bg-[#FD9A00] hover:bg-[#e68a00]",
            gradient: "from-[#FD9A00] to-[#e68a00]",
            shadow: "shadow-[#FD9A00]/30"
        },
        tertiary: {
            bg: "bg-purple-500/10",
            text: "text-purple-400",
            border: "border-purple-500/30",
            button: "bg-purple-600 hover:bg-purple-700",
            gradient: "from-purple-600 to-purple-600",
            shadow: "shadow-purple-500/30"
        }
    };

    const handleContact = () => {
        window.open('https://wa.me/8801711946614', '_blank');
    };

    return (
        <section id="pricing" className="py-16 lg:py-20 bg-gray-50 dark:bg-[#0A0A0A]">
            <div className="container mx-auto px-10 lg:px-20">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FD9A00]/10 text-[#FD9A00] text-sm font-semibold mb-4">
                        <LuSparkles size={16} />
                        {language === 'bn' ? 'ইনস্টিটিউট লাইসেন্সিং' : 'Institute Licensing'}
                    </span>
                    <h2 className={`text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-6 ${bengaliClass}`}>
                        {language === 'bn' ? (
                            <>
                                আপনার ইনস্টিটিউটের জন্য{" "}
                                <span className="text-[#FD9A00]">সঠিক প্ল্যান</span>
                            </>
                        ) : (
                            <>
                                Choose the Right{" "}
                                <span className="text-[#FD9A00]">Plan</span>{" "}
                                for Your Institute
                            </>
                        )}
                    </h2>
                    <p className={`text-lg text-gray-600 dark:text-gray-400 ${bengaliClass}`}>
                        {language === 'bn'
                            ? 'আপনার প্রয়োজন অনুযায়ী প্ল্যান বেছে নিন। সব প্ল্যানে Admin Dashboard অন্তর্ভুক্ত।'
                            : 'Choose a plan based on your needs. All plans include Admin Dashboard.'}
                    </p>

                </motion.div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
                    {packages.map((pkg, index) => {
                        const colors = colorClasses[pkg.color];
                        return (
                            <motion.div
                                key={pkg.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className={`relative ${pkg.popular ? 'md:-mt-4 md:mb-4' : ''}`}
                            >
                                {/* Popular Badge */}
                                {pkg.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                                        <span className={`inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-gradient-to-r ${colors.gradient} text-white text-sm font-bold shadow-lg ${colors.shadow}`}>
                                            <LuSparkles size={14} />
                                            {language === 'bn' ? 'সবচেয়ে জনপ্রিয়' : 'Most Popular'}
                                        </span>
                                    </div>
                                )}

                                <div className={`h-full flex flex-col bg-white dark:bg-[#111] rounded-3xl p-8 border-2 ${pkg.popular ? colors.border : 'border-gray-100 dark:border-white/5'} ${pkg.popular ? `shadow-2xl ${colors.shadow}` : 'shadow-lg shadow-gray-200/50 dark:shadow-black/20'} hover:shadow-2xl transition-all duration-300`}>
                                    {/* Header */}
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className={`w-14 h-14 rounded-xl ${colors.bg} flex items-center justify-center`}>
                                            <pkg.icon size={24} className={colors.text} />
                                        </div>
                                        <div>
                                            <h3 className={`text-2xl font-black text-gray-900 dark:text-white ${bengaliClass}`}>{pkg.name}</h3>
                                            <p className={`text-sm text-gray-600 dark:text-gray-400 font-medium ${bengaliClass}`}>{pkg.subtitle}</p>
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="mb-8">
                                        {pkg.originalPrice && (
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xl text-gray-400 line-through">৳{pkg.originalPrice.toLocaleString()}</span>
                                                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-500/20 text-red-500">
                                                    {Math.round((1 - pkg.oneTimePrice / pkg.originalPrice) * 100)}% OFF
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-4xl font-black text-gray-900 dark:text-white">৳{pkg.oneTimePrice.toLocaleString()}</span>
                                        </div>
                                        {pkg.installments && (
                                            <div className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full ${colors.bg} ${colors.text} text-xs font-bold`}>
                                                <LuSparkles size={11} />
                                                {pkg.installments === 1
                                                    ? (language === 'bn' ? 'ওয়ান টাইম পেমেন্ট' : 'One-Time Payment')
                                                    : pkg.installments === 2
                                                    ? (language === 'bn' ? 'টু টাইম পেমেন্ট (কিস্তি সুবিধা)' : 'Two-Time Payment (Installment)')
                                                    : (language === 'bn' ? 'থ্রি টাইম পেমেন্ট (কিস্তি সুবিধা)' : 'Three-Time Payment (Installment)')}
                                            </div>
                                        )}
                                    </div>

                                    {/* Features */}
                                    <div className="flex-1 space-y-3 mb-8">
                                        {pkg.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center gap-3">
                                                {feature.included ? (
                                                    <div className={`w-5 h-5 rounded-full ${feature.highlight ? colors.bg : 'bg-green-100 dark:bg-green-500/20'} flex items-center justify-center shrink-0`}>
                                                        <LuCheck size={12} className={feature.highlight ? colors.text : 'text-green-600 dark:text-green-400'} />
                                                    </div>
                                                ) : (
                                                    <div className="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0">
                                                        <LuX size={12} className="text-gray-400" />
                                                    </div>
                                                )}
                                                <span className={`text-sm font-medium ${feature.included ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'} ${bengaliClass}`}>
                                                    {feature.text}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* All Features Toggle */}
                                    <button
                                        onClick={() => setExpandedPackage(expandedPackage === pkg.id ? null : pkg.id)}
                                        className={`w-full flex items-center justify-between gap-2 py-3 px-4 rounded-xl mb-4 border ${colors.border} ${colors.bg} transition-all duration-300 ${bengaliClass}`}
                                    >
                                        <span className={`text-sm font-semibold ${colors.text}`}>
                                            {expandedPackage === pkg.id
                                                ? (language === 'bn' ? 'কম দেখুন' : 'Show Less')
                                                : (language === 'bn' ? 'সব ফিচার দেখুন' : 'View All Features')}
                                        </span>
                                        <LuChevronDown
                                            size={16}
                                            className={`${colors.text} transition-transform duration-300 ${expandedPackage === pkg.id ? 'rotate-180' : ''}`}
                                        />
                                    </button>

                                    <AnimatePresence>
                                        {expandedPackage === pkg.id && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="overflow-hidden mb-4"
                                            >
                                                <div className="space-y-4 pt-1">
                                                    {allFeatureCategories.map((cat, catIdx) => (
                                                        <div key={catIdx} className="rounded-xl bg-gray-50 dark:bg-white/5 p-4">
                                                            <div className="flex items-center gap-2 mb-3">
                                                                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${cat.color}20` }}>
                                                                    <cat.icon size={14} style={{ color: cat.color }} />
                                                                </div>
                                                                <span className={`text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide ${bengaliClass}`}>
                                                                    {cat.title}
                                                                </span>
                                                            </div>
                                                            <div className="grid grid-cols-1 gap-1.5">
                                                                {cat.features.map((feat, fIdx) => (
                                                                    <div key={fIdx} className="flex items-center gap-2">
                                                                        <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${cat.color}20` }}>
                                                                            <LuCheck size={10} style={{ color: cat.color }} strokeWidth={3} />
                                                                        </div>
                                                                        <span className={`text-sm font-medium text-gray-700 dark:text-gray-300 ${bengaliClass}`}>{feat}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* CTA Buttons */}
                                    <div className="mt-auto flex flex-col gap-3">
                                        <motion.button
                                            onClick={handleContact}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl ${colors.button} text-white font-bold shadow-lg ${colors.shadow} transition-all duration-300 ${bengaliClass}`}
                                        >
                                            <FaWhatsapp size={18} />
                                            {language === 'bn' ? 'যোগাযোগ করুন' : 'Contact Us'}
                                            <LuArrowRight size={18} />
                                        </motion.button>
                                        {pkg.demoLink && (
                                            <motion.a
                                                href={pkg.demoLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl border-2 ${colors.border} ${colors.text} font-bold transition-all duration-300 hover:${colors.bg} hover:text-white ${bengaliClass}`}
                                            >
                                                <LuPlay size={18} />
                                                {language === 'bn' ? 'লাইভ ডেমো দেখুন' : 'Live Demo'}
                                            </motion.a>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Contact CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-12 text-center"
                >
                    <div className="inline-flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-[#FD9A00]/10 border border-[#FD9A00]/30">
                        <div className="w-14 h-14 rounded-full bg-[#FD9A00]/20 flex items-center justify-center">
                            <LuPhone size={24} className="text-[#FD9A00]" />
                        </div>
                        <div className="text-center sm:text-left">
                            <p className={`font-bold text-gray-900 dark:text-white ${bengaliClass}`}>
                                {language === 'bn' ? 'ডেমো দেখতে চান?' : 'Want to see a demo?'}
                            </p>
                            <p className={`text-sm text-gray-600 dark:text-gray-400 ${bengaliClass}`}>
                                {language === 'bn' ? 'আমাদের সাথে কথা বলুন, ফ্রি ডেমো পান!' : 'Talk to us for a free demo of the software!'}
                            </p>
                            <p className="text-lg font-bold text-[#FD9A00] mt-1">
                                +880 1711-946614
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <a
                                href="https://wa.me/8801711946614"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-colors ${bengaliClass}`}
                            >
                                <FaWhatsapp size={20} />
                                {language === 'bn' ? 'WhatsApp' : 'WhatsApp'}
                            </a>
                            <a
                                href="tel:+8801711946614"
                                className={`flex items-center gap-2 px-6 py-3 bg-[#FD9A00] hover:bg-[#e68a00] text-white font-bold rounded-xl transition-colors ${bengaliClass}`}
                            >
                                <LuPhone size={20} />
                                {language === 'bn' ? 'কল করুন' : 'Call Now'}
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default IeltsPricing;
