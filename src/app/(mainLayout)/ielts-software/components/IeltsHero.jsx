"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { LuPlay, LuArrowRight, LuCircleCheck, LuBuilding2, LuUsers, LuShield, LuHighlighter, LuPencil, LuSun, LuType, LuChartBar, LuBrain, LuBookOpen, LuGraduationCap } from "react-icons/lu";

const IeltsHero = () => {
    const { language } = useLanguage();
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";

    const features = [
        { icon: LuHighlighter, text: language === 'bn' ? "হাইলাইট করুন" : "Text Highlight" },
        { icon: LuPencil, text: language === 'bn' ? "নোট নিন" : "Take Notes" },
        { icon: LuSun, text: language === 'bn' ? "থিম পরিবর্তন" : "Theme Change" },
        { icon: LuType, text: language === 'bn' ? "ফন্ট সাইজ" : "Font Size" },
    ];

    const scrollToPricing = () => {
        document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-white dark:bg-[#0A0A0A]">
            {/* Background Grid Pattern - Same as Home */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
                style={{ backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

            {/* Floating Geometric Shapes */}
            <motion.div
                className="absolute top-[12%] right-[12%] w-5 h-5 border-2 border-[#FD9A00]/40 rounded-full hidden lg:block"
                animate={{ y: [0, -15, 0], rotate: [0, 180, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute top-[30%] left-[6%] w-4 h-4 border-2 border-[#C4EE18]/50 rounded-full hidden lg:block"
                animate={{ y: [0, 20, 0], x: [0, 5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
            <motion.div
                className="absolute bottom-[40%] right-[20%] w-3 h-3 bg-[#FD9A00]/30 rounded-full hidden lg:block"
                animate={{ y: [0, -12, 0], x: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
            <motion.div
                className="absolute top-[22%] left-[18%] w-4 h-4 border-2 border-[#C4EE18]/30 hidden lg:block"
                animate={{ rotate: [0, 90, 180, 270, 360], y: [0, -10, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
                className="absolute top-[45%] left-[10%] text-[#C4EE18]/40 text-2xl font-light hidden lg:block select-none"
                animate={{ rotate: [0, 90, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            >
                +
            </motion.div>
            <motion.div
                className="absolute top-[18%] right-[25%] text-[#FD9A00]/35 text-xl font-light hidden lg:block select-none"
                animate={{ rotate: [0, -90, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            >
                +
            </motion.div>

            <div className="container mx-auto px-4 lg:px-6 py-20 lg:py-28 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Badge - B2B Focus */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FD9A00]/10 border border-[#FD9A00]/30 text-[#FD9A00] text-sm font-semibold mb-6"
                        >
                            <LuBuilding2 size={16} />
                            {language === 'bn' ? 'কোচিং সেন্টার ও ইনস্টিটিউটের জন্য' : 'For Coaching Centers & Institutes'}
                        </motion.div>

                        {/* Main Heading */}
                        <h1 className={`text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white leading-tight mb-6 font-teko uppercase tracking-tight ${bengaliClass}`}>
                            {language === 'bn' ? (
                                <>
                                    আপনার <span className="text-[#FD9A00]">IELTS</span>{" "}
                                    <span className="relative inline-block">
                                        <span className="relative z-10">কোচিং সেন্টারের</span>
                                        <span className="absolute bottom-1 left-0 w-full h-3 bg-[#C4EE18]/30"></span>
                                    </span>
                                    <br />জন্য সম্পূর্ণ সমাধান
                                </>
                            ) : (
                                <>
                                    COMPLETE <span className="text-[#FD9A00]">IELTS</span>{" "}
                                    <span className="relative inline-block">
                                        <span className="relative z-10">SOLUTION</span>
                                        <span className="absolute bottom-1 left-0 w-full h-3 bg-[#C4EE18]/30"></span>
                                    </span>
                                    <br />FOR YOUR INSTITUTE
                                </>
                            )}
                        </h1>

                        {/* Description - B2B */}
                        <p className={`text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed max-w-xl ${bengaliClass}`}>
                            {language === 'bn'
                                ? 'British Council এর অনলাইন পরীক্ষার হুবহু ইন্টারফেস। Student Dashboard, Admin Panel, Auto Result, AI Speaking Assessment সহ সম্পূর্ণ প্যাকেজ। আপনার স্টুডেন্টদের দিন আসল পরীক্ষার অভিজ্ঞতা।'
                                : 'Exact replica of British Council online exam interface. Complete package with Student Dashboard, Admin Panel, Auto Result, AI Speaking Assessment. Give your students real exam experience.'}
                        </p>

                        {/* British Council Interface Features */}
                        <div className="flex flex-wrap gap-3 mb-8">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.4 + index * 0.1 }}
                                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 text-sm"
                                >
                                    <feature.icon size={16} className="text-[#FD9A00]" />
                                    <span className={bengaliClass}>{feature.text}</span>
                                </motion.div>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap gap-4">
                            <motion.button
                                onClick={scrollToPricing}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`group flex items-center gap-3 px-8 py-4 bg-[#FD9A00] hover:bg-[#e68a00] text-white font-bold rounded-xl shadow-lg shadow-[#FD9A00]/30 hover:shadow-[#FD9A00]/50 transition-all ${bengaliClass}`}
                            >
                                {language === 'bn' ? 'লাইসেন্স নিন' : 'Get License'}
                                <LuArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                            <motion.a
                                href="https://bestieltsbd.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`group flex items-center gap-3 px-8 py-4 bg-[#C4EE18] hover:bg-[#b3dd10] text-black font-bold rounded-xl shadow-lg shadow-[#C4EE18]/30 hover:shadow-[#C4EE18]/50 transition-all ${bengaliClass}`}
                            >
                                <LuPlay size={20} />
                                {language === 'bn' ? 'লাইভ ডেমো' : 'Live Demo'}
                            </motion.a>
                        </div>

                        {/* Trust Badges */}
                        <div className="flex items-center gap-6 mt-10 pt-8 border-t border-gray-200 dark:border-white/10">
                            <div className="flex items-center gap-2">
                                <LuBuilding2 className="text-[#C4EE18]" size={20} />
                                <span className={`text-gray-600 dark:text-gray-400 text-sm ${bengaliClass}`}>
                                    {language === 'bn' ? '৫০+ কোচিং সেন্টার' : '50+ Coaching Centers'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <LuUsers className="text-[#C4EE18]" size={20} />
                                <span className={`text-gray-600 dark:text-gray-400 text-sm ${bengaliClass}`}>
                                    {language === 'bn' ? '১০,০০০+ স্টুডেন্ট' : '10,000+ Students'}
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Content - Feature Showcase */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="relative"
                    >
                        <div className="relative">
                            {/* Admin Dashboard Preview */}
                            <div className="relative bg-white dark:bg-[#111] rounded-2xl p-6 border border-gray-200 dark:border-white/10 shadow-2xl shadow-gray-200/50 dark:shadow-black/50">
                                {/* Browser Header */}
                                <div className="flex items-center gap-2 pb-4 border-b border-gray-100 dark:border-white/10 mb-4">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    </div>
                                    <div className="flex-1 mx-4">
                                        <div className="h-6 bg-gray-100 dark:bg-white/5 rounded-lg flex items-center px-3">
                                            <span className="text-xs text-gray-500 dark:text-gray-400">admin.ielts-software.com/dashboard</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Admin Interface Preview */}
                                <div className="space-y-4">
                                    {/* Header */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-[#FD9A00] flex items-center justify-center text-white">
                                                <LuShield size={20} />
                                            </div>
                                            <div>
                                                <p className="text-gray-900 dark:text-white font-semibold text-sm">Admin Dashboard</p>
                                                <p className="text-gray-500 dark:text-gray-400 text-xs">{language === 'bn' ? 'সব স্টুডেন্টের রেজাল্ট' : 'All Student Results'}</p>
                                            </div>
                                        </div>
                                        <div className="px-3 py-1.5 bg-[#C4EE18]/20 rounded-lg">
                                            <span className="text-[#C4EE18] text-sm font-medium">{language === 'bn' ? 'লাইভ' : 'Live'}</span>
                                        </div>
                                    </div>

                                    {/* Stats Cards */}
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-3 text-center">
                                            <LuUsers className="text-[#FD9A00] mx-auto mb-1" size={20} />
                                            <p className="text-xl font-bold text-gray-900 dark:text-white">156</p>
                                            <p className="text-xs text-gray-500">{language === 'bn' ? 'স্টুডেন্ট' : 'Students'}</p>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-3 text-center">
                                            <LuChartBar className="text-[#C4EE18] mx-auto mb-1" size={20} />
                                            <p className="text-xl font-bold text-gray-900 dark:text-white">7.2</p>
                                            <p className="text-xs text-gray-500">{language === 'bn' ? 'গড় ব্যান্ড' : 'Avg. Band'}</p>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-3 text-center">
                                            <LuBookOpen className="text-blue-500 mx-auto mb-1" size={20} />
                                            <p className="text-xl font-bold text-gray-900 dark:text-white">89</p>
                                            <p className="text-xs text-gray-500">{language === 'bn' ? 'টেস্ট আজ' : 'Tests Today'}</p>
                                        </div>
                                    </div>

                                    {/* Student List Preview */}
                                    <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 space-y-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="font-medium text-gray-900 dark:text-white">{language === 'bn' ? 'সাম্প্রতিক রেজাল্ট' : 'Recent Results'}</span>
                                            <span className="text-[#FD9A00] text-xs cursor-pointer">{language === 'bn' ? 'সব দেখুন' : 'View All'}</span>
                                        </div>
                                        {[
                                            { name: "Rafiq Ahmed", band: "7.5", module: "Listening" },
                                            { name: "Fatima Khan", band: "8.0", module: "Reading" },
                                        ].map((student, i) => (
                                            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-white/5 last:border-0">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-[#FD9A00]/20 flex items-center justify-center text-[#FD9A00] text-xs font-bold">
                                                        {student.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-900 dark:text-white text-sm font-medium">{student.name}</p>
                                                        <p className="text-gray-500 text-xs">{student.module}</p>
                                                    </div>
                                                </div>
                                                <span className="px-2 py-1 bg-[#C4EE18]/20 text-[#C4EE18] rounded-md text-sm font-bold">
                                                    {student.band}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* AI Feature Badge */}
                                    <div className="flex items-center justify-center gap-2 py-2">
                                        <LuBrain className="text-[#FD9A00]" size={16} />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {language === 'bn' ? 'AI Speaking Assessment সহ' : 'With AI Speaking Assessment'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Feature Cards */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-6 -right-6 bg-white dark:bg-[#111] rounded-xl p-4 shadow-xl border border-gray-100 dark:border-white/10 hidden lg:block"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-[#C4EE18]/20 flex items-center justify-center">
                                        <LuCircleCheck className="text-[#C4EE18]" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-gray-900 dark:text-white font-bold">{language === 'bn' ? 'অটো রেজাল্ট' : 'Auto Result'}</p>
                                        <p className="text-gray-500 text-xs">{language === 'bn' ? 'তাৎক্ষণিক মার্কিং' : 'Instant Marking'}</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -bottom-4 -left-6 bg-white dark:bg-[#111] rounded-xl p-4 shadow-xl border border-gray-100 dark:border-white/10 hidden lg:block"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-[#FD9A00]/20 flex items-center justify-center">
                                        <LuGraduationCap className="text-[#FD9A00]" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-gray-900 dark:text-white font-bold">{language === 'bn' ? 'স্টুডেন্ট ড্যাশবোর্ড' : 'Student Dashboard'}</p>
                                        <p className="text-gray-500 text-xs">{language === 'bn' ? 'প্র্যাক্টিস ও রেজাল্ট' : 'Practice & Results'}</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default IeltsHero;
