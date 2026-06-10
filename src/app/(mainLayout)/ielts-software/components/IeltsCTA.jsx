"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { LuArrowRight, LuPhone, LuMessageCircle, LuSparkles } from "react-icons/lu";
import { FaWhatsapp, FaFacebookMessenger } from "react-icons/fa";

const IeltsCTA = () => {
    const { language } = useLanguage();
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";

    const scrollToPricing = () => {
        document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="py-20 lg:py-28 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
            </div>

            {/* Grid Pattern */}
            <div 
                className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: `linear-gradient(#FD9A00 1px, transparent 1px), linear-gradient(90deg, #FD9A00 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Floating Gradient Orbs */}
            <motion.div
                animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-20 left-10 w-64 h-64 bg-[#FD9A00]/20 rounded-full blur-3xl"
            />
            <motion.div
                animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-20 right-10 w-64 h-64 bg-[#C4EE18]/20 rounded-full blur-3xl"
            />

            <div className="container mx-auto px-10 lg:px-20 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FD9A00]/20 border border-[#FD9A00]/30 text-[#FD9A00] text-sm font-semibold mb-8"
                    >
                        <LuSparkles size={16} />
                        {language === 'bn' ? "১৪ দিন ফ্রি ট্রায়াল" : "14 Days Free Trial"}
                    </motion.div>

                    {/* Heading */}
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className={`text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6 leading-tight ${bengaliClass}`}
                    >
                        {language === 'bn' ? (
                            <>
                                আপনার{" "}
                                <span className="text-[#FD9A00]">
                                    IELTS ইনস্টিটিউটকে
                                </span>{" "}
                                আপগ্রেড করুন
                            </>
                        ) : (
                            <>
                                Upgrade Your{" "}
                                <span className="text-[#FD9A00]">
                                    IELTS Institute
                                </span>{" "}
                                Today!
                            </>
                        )}
                    </motion.h2>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className={`text-lg text-gray-300 mb-10 max-w-2xl mx-auto ${bengaliClass}`}
                    >
                        {language === 'bn'
                            ? "British Council ইন্টারফেসে স্টুডেন্ট প্র্যাক্টিস, অটো মার্কিং, AI Speaking, Admin Dashboard - সব এক প্ল্যাটফর্মে। আজই ফ্রি ডেমো দেখুন।"
                            : "BC interface practice, auto marking, AI Speaking, Admin Dashboard - all in one platform. Book your free demo today."}
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
                    >
                        <motion.button
                            onClick={scrollToPricing}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`group flex items-center gap-3 px-8 py-4 bg-[#FD9A00] hover:bg-[#e68a00] text-white font-bold rounded-xl shadow-lg shadow-[#FD9A00]/30 hover:shadow-[#FD9A00]/50 transition-all ${bengaliClass}`}
                        >
                            {language === 'bn' ? 'ফ্রি ডেমো বুক করুন' : 'Book Free Demo'}
                            <LuArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                        <a
                            href="https://wa.me/8801711946614"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`group flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-xl border border-white/20 hover:bg-white/20 transition-all ${bengaliClass}`}
                        >
                            <FaWhatsapp size={20} className="text-green-400" />
                            {language === 'bn' ? 'সরাসরি কথা বলুন' : 'Talk to Sales'}
                        </a>
                    </motion.div>

                    {/* Contact Options */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex flex-wrap items-center justify-center gap-6"
                    >
                        <a
                            href="tel:+8801711946614"
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                        >
                            <LuPhone size={18} />
                            <span>+880 1711-946614</span>
                        </a>
                        <span className="text-gray-600">|</span>
                        <a
                            href="https://m.me/extrainweb"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                        >
                            <FaFacebookMessenger size={18} />
                            <span>Facebook Messenger</span>
                        </a>
                        <span className="text-gray-600">|</span>
                        <a
                            href="mailto:info.extrainweb@gmail.com"
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                        >
                            <LuMessageCircle size={18} />
                            <span>info.extrainweb@gmail.com</span>
                        </a>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default IeltsCTA;
