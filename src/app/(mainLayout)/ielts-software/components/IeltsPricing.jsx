"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
    LuRepeat
} from "react-icons/lu";
import { FaWhatsapp } from "react-icons/fa";

const IeltsPricing = () => {
    const { language } = useLanguage();
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";
    const router = useRouter();
    const [pricingMode, setPricingMode] = useState('onetime'); // 'onetime' or 'subscription'

    const packages = [
        {
            id: "starter",
            name: language === 'bn' ? "স্টার্টার" : "Starter",
            subtitle: language === 'bn' ? "ছোট কোচিং সেন্টারের জন্য" : "For Small Coaching Centers",
            oneTimePrice: 42999,
            setupPrice: 10000,
            monthlyPrice: 1000,
            icon: LuBuilding,
            color: "secondary",
            popular: false,
            studentLimit: "Unlimited",
            features: [
                { text: language === 'bn' ? "৪টি মডিউল (L/R/W/S)" : "4 Modules (L/R/W/S)", included: true, highlight: true },
                { text: language === 'bn' ? "Unlimited Mock Question Upload" : "Unlimited Mock Question Upload", included: true, highlight: true },
                { text: language === 'bn' ? "Admin Dashboard" : "Admin Dashboard", included: true },
                { text: language === 'bn' ? "Listening & Reading - Auto Marking" : "Listening & Reading - Auto Marking", included: true },
                { text: language === 'bn' ? "Writing & Speaking - Trainer Review" : "Writing & Speaking - Trainer Review", included: true },
                { text: language === 'bn' ? "Student Dashboard" : "Student Dashboard", included: true },
                { text: language === 'bn' ? "Student Marking View" : "Student Marking View", included: true },
                { text: language === 'bn' ? "AI Auto Marking (All)" : "AI Auto Marking (All)", included: false },
                { text: language === 'bn' ? "Class Practice & Mock Test" : "Class Practice & Mock Test", included: false },
                { text: language === 'bn' ? "Email Support" : "Email Support", included: true },
            ]
        },
        {
            id: "professional",
            name: language === 'bn' ? "প্রফেশনাল" : "Professional",
            subtitle: language === 'bn' ? "AI সহ সম্পূর্ণ সমাধান" : "Complete AI Solution",
            oneTimePrice: 80000,
            setupPrice: 10000,
            monthlyPrice: 2000,
            icon: LuBuilding2,
            color: "primary",
            popular: true,
            studentLimit: "Unlimited",
            features: [
                { text: language === 'bn' ? "৪টি মডিউল (L/R/W/S)" : "4 Modules (L/R/W/S)", included: true, highlight: true },
                { text: language === 'bn' ? "Unlimited Question Upload" : "Unlimited Question Upload", included: true },
                { text: language === 'bn' ? "AI Auto Marking (সব ৪টি)" : "AI Auto Marking (All 4)", included: true, highlight: true },
                { text: language === 'bn' ? "Admin Dashboard + Review" : "Admin Dashboard + Review", included: true },
                { text: language === 'bn' ? "Student Dashboard + Answer Sheet" : "Student Dashboard + Answer Sheet", included: true },
                { text: language === 'bn' ? "Class Practice System" : "Class Practice System", included: true },
                { text: language === 'bn' ? "Free Mock Test" : "Free Mock Test", included: true },
                { text: language === 'bn' ? "Practice Module" : "Practice Module", included: true },
                { text: language === 'bn' ? "Priority Support" : "Priority Support", included: true },
                { text: language === 'bn' ? "১ বছর আপডেট" : "1 Year Updates", included: true },
            ]
        },
        {
            id: "enterprise",
            name: language === 'bn' ? "এন্টারপ্রাইজ" : "Enterprise",
            subtitle: language === 'bn' ? "প্রিমিয়াম বিজনেস সমাধান" : "Premium Business Solution",
            oneTimePrice: 250000,
            setupPrice: 20000,
            monthlyPrice: 4000,
            icon: LuGraduationCap,
            color: "tertiary",
            popular: false,
            studentLimit: "Unlimited",
            features: [
                { text: language === 'bn' ? "World-class Full Website Development" : "World-class Full Website Development", included: true, highlight: true },
                { text: language === 'bn' ? "Advanced AI Marking System (L/R/W/S)" : "Advanced AI Marking System (L/R/W/S)", included: true, highlight: true },
                { text: language === 'bn' ? "Premium High-Speed Hosting + Domain" : "Premium High-Speed Hosting + Domain", included: true },
                { text: language === 'bn' ? "Auto Student Enrollment & Payment Gateway" : "Auto Student Enrollment & Payment Gateway", included: true },
                { text: language === 'bn' ? "Complete White-label Solution" : "Complete White-label Solution", included: true },
                { text: language === 'bn' ? "২ বছর Free Support & Updates" : "2 Years Free Support & Updates", included: true },
                { text: language === 'bn' ? "Unlimited Mock Tests & Practice" : "Unlimited Mock Tests & Practice", included: true },
                { text: language === 'bn' ? "Admin + Student Dashboard (Pro)" : "Admin + Student Dashboard (Pro)", included: true },
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
            <div className="container mx-auto px-4 lg:px-6">
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

                    {/* Pricing Toggle */}
                    <div className="mt-8 inline-flex items-center p-1.5 bg-gray-100 dark:bg-white/5 rounded-xl">
                        <button
                            onClick={() => setPricingMode('onetime')}
                            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${bengaliClass} ${
                                pricingMode === 'onetime'
                                    ? 'bg-white dark:bg-[#111] text-gray-900 dark:text-white shadow-md'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                            }`}
                        >
                            {language === 'bn' ? 'এককালীন' : 'One-time'}
                        </button>
                        <button
                            onClick={() => setPricingMode('subscription')}
                            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${bengaliClass} ${
                                pricingMode === 'subscription'
                                    ? 'bg-white dark:bg-[#111] text-gray-900 dark:text-white shadow-md'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                            }`}
                        >
                            <LuRepeat size={14} />
                            {language === 'bn' ? 'সাবস্ক্রিপশন' : 'Subscription'}
                        </button>
                    </div>
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

                                <div className={`h-full bg-white dark:bg-[#111] rounded-3xl p-8 border-2 ${pkg.popular ? colors.border : 'border-gray-100 dark:border-white/5'} ${pkg.popular ? `shadow-2xl ${colors.shadow}` : 'shadow-lg shadow-gray-200/50 dark:shadow-black/20'} hover:shadow-2xl transition-all duration-300`}>
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
                                        {pricingMode === 'onetime' ? (
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-4xl font-black text-gray-900 dark:text-white">৳{pkg.oneTimePrice.toLocaleString()}</span>
                                                <span className="text-lg text-gray-400">{language === 'bn' ? '/এককালীন' : '/one-time'}</span>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-3xl font-black text-gray-900 dark:text-white">৳{pkg.monthlyPrice.toLocaleString()}</span>
                                                    <span className="text-base text-gray-400">{language === 'bn' ? '/মাস' : '/month'}</span>
                                                </div>
                                                <p className={`text-sm text-gray-500 dark:text-gray-400 ${bengaliClass}`}>
                                                    + ৳{pkg.setupPrice.toLocaleString()} {language === 'bn' ? 'সেটআপ ফি (এককালীন)' : 'setup fee (one-time)'}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Features */}
                                    <div className="space-y-3 mb-8">
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
                                                <span className={`text-sm ${feature.included ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'} ${feature.highlight ? 'font-semibold' : ''} ${bengaliClass}`}>
                                                    {feature.text}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* CTA Button */}
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
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Features Comparison */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-16 max-w-4xl mx-auto"
                >
                    <div className="bg-white dark:bg-[#111] rounded-2xl p-8 border border-gray-100 dark:border-white/5">
                        <h3 className={`text-xl font-bold text-gray-900 dark:text-white mb-6 text-center ${bengaliClass}`}>
                            {language === 'bn' ? 'সব প্ল্যানে যা যা অন্তর্ভুক্ত' : 'Included in All Plans'}
                        </h3>
                        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { icon: LuHeadphones, text: language === 'bn' ? '৪টি মডিউল (L/R/W/S)' : 'All 4 Modules' },
                                { icon: LuShield, text: language === 'bn' ? 'Admin Dashboard' : 'Admin Dashboard' },
                                { icon: LuUsers, text: language === 'bn' ? 'Student Dashboard' : 'Student Dashboard' },
                                { icon: LuBrain, text: language === 'bn' ? 'Unlimited Questions' : 'Unlimited Questions' },
                            ].map((item, index) => (
                                <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                                    <div className="w-10 h-10 rounded-lg bg-[#FD9A00]/10 flex items-center justify-center">
                                        <item.icon className="text-[#FD9A00]" size={20} />
                                    </div>
                                    <span className={`text-sm font-medium text-gray-700 dark:text-gray-300 ${bengaliClass}`}>
                                        {item.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

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
