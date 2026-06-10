"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import {
    LuPhone,
    LuPresentation,
    LuSettings,
    LuRocket,
    LuArrowRight,
    LuBuilding2,
    LuUsers,
    LuTrendingUp,
    LuAward
} from "react-icons/lu";

const IeltsHowItWorks = () => {
    const { language } = useLanguage();
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";

    const steps = [
        {
            step: "01",
            icon: LuPhone,
            title: language === 'bn' ? "আমাদের সাথে যোগাযোগ করুন" : "Contact Us",
            description: language === 'bn'
                ? "WhatsApp বা ফোনে আমাদের সাথে যোগাযোগ করুন। আপনার প্রয়োজন জানান।"
                : "Contact us via WhatsApp or phone. Tell us about your requirements.",
            color: "primary"
        },
        {
            step: "02",
            icon: LuPresentation,
            title: language === 'bn' ? "ফ্রি ডেমো দেখুন" : "Get Free Demo",
            description: language === 'bn'
                ? "আমরা আপনাকে সফটওয়্যারের সম্পূর্ণ ডেমো দেখাব। সব ফিচার ব্যাখ্যা করব।"
                : "We'll give you a complete demo of the software. Explain all features.",
            color: "secondary"
        },
        {
            step: "03",
            icon: LuSettings,
            title: language === 'bn' ? "সেটআপ ও ট্রেনিং" : "Setup & Training",
            description: language === 'bn'
                ? "আপনার ইনস্টিটিউটের নামে সেটআপ করে দেব। Admin ট্রেনিং দেব।"
                : "We'll set up with your institute branding. Provide admin training.",
            color: "primary"
        },
        {
            step: "04",
            icon: LuRocket,
            title: language === 'bn' ? "লাইভ হয়ে যান!" : "Go Live!",
            description: language === 'bn'
                ? "আপনার স্টুডেন্টদের অ্যাক্সেস দিন। BC মানের প্র্যাক্টিস শুরু করুন।"
                : "Give your students access. Start British Council standard practice.",
            color: "secondary"
        }
    ];

    const colorClasses = {
        primary: {
            bg: "bg-[#FD9A00]",
            light: "bg-[#FD9A00]/10",
            text: "text-[#FD9A00]",
            border: "border-[#FD9A00]/30"
        },
        secondary: {
            bg: "bg-[#C4EE18]",
            light: "bg-[#C4EE18]/10",
            text: "text-[#C4EE18]",
            border: "border-[#C4EE18]/30"
        }
    };

    return (
        <section className="py-20 lg:py-28 bg-gray-50 dark:bg-[#111]">
            <div className="container mx-auto px-10 lg:px-20">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C4EE18]/10 text-[#C4EE18] text-sm font-semibold mb-4">
                        <LuArrowRight size={16} />
                        {language === 'bn' ? 'সহজ প্রক্রিয়া' : 'Simple Process'}
                    </span>
                    <h2 className={`text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-6 ${bengaliClass}`}>
                        {language === 'bn' ? (
                            <>
                                কিভাবে{" "}
                                <span className="text-[#FD9A00]">শুরু করবেন?</span>
                            </>
                        ) : (
                            <>
                                How to{" "}
                                <span className="text-[#FD9A00]">Get Started?</span>
                            </>
                        )}
                    </h2>
                    <p className={`text-lg text-gray-600 dark:text-gray-400 ${bengaliClass}`}>
                        {language === 'bn'
                            ? 'মাত্র ৪টি সহজ ধাপে আপনার ইনস্টিটিউটে IELTS সফটওয়্যার চালু করুন'
                            : 'Launch IELTS software in your institute in just 4 simple steps'}
                    </p>
                </motion.div>

                {/* Steps */}
                <div className="relative max-w-5xl mx-auto">
                    {/* Connection Line - Desktop */}
                    <div className="hidden lg:block absolute top-24 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-[#FD9A00] via-[#C4EE18] to-[#FD9A00] opacity-30"></div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        {steps.map((step, index) => {
                            const colors = colorClasses[step.color];
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.15 }}
                                    className="relative text-center"
                                >
                                    {/* Step Number */}
                                    <div className="relative inline-block mb-6">
                                        <div className={`w-20 h-20 rounded-2xl ${colors.light} flex items-center justify-center border-2 ${colors.border} relative z-10`}>
                                            <step.icon size={32} className={colors.text} />
                                        </div>
                                        {/* Step Badge */}
                                        <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full ${colors.bg} ${step.color === 'secondary' ? 'text-gray-900' : 'text-white'} flex items-center justify-center text-sm font-bold shadow-lg`}>
                                            {step.step}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <h3 className={`text-xl font-bold text-gray-900 dark:text-white mb-3 ${bengaliClass}`}>
                                        {step.title}
                                    </h3>
                                    <p className={`text-gray-600 dark:text-gray-400 leading-relaxed ${bengaliClass}`}>
                                        {step.description}
                                    </p>

                                    {/* Arrow for Mobile/Tablet */}
                                    {index < steps.length - 1 && (
                                        <div className="lg:hidden flex justify-center py-4">
                                            <LuArrowRight size={24} className="text-gray-300 dark:text-gray-600 rotate-90 md:rotate-0" />
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default IeltsHowItWorks;
