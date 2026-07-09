"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    FiTarget,
    FiZap,
    FiGlobe,
    FiUsers
} from 'react-icons/fi';
import { useLanguage } from '@/context/LanguageContext';

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
        <div className="w-12 h-[2px] bg-[#0CB2A9]" />
        <span className="text-sm lg:text-base uppercase tracking-widest font-bold text-[#0CB2A9] font-poppins">
            {text}
        </span>
    </motion.div>
);

const MissionSection = () => {
    const { language } = useLanguage();
    const isBN = language === 'bn';

    return (
        <section className="py-24 lg:py-32 relative bg-white dark:bg-[#0A0A0A]">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="grid lg:grid-cols-2 gap-20">
                    <div>
                        <SectionLabel text={isBN ? "মিশন" : "OUR MISSION"} />
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-4xl lg:text-6xl font-black uppercase font-poppins leading-[0.9] text-gray-900 dark:text-white mb-8"
                        >
                            EMPOWERING <span className="text-[#0CB2A9]">NEXT-GEN</span> <br />
                            DIGITAL LEADERS.
                        </motion.h2>
                    </div>
                    <div className="space-y-8">
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed"
                        >
                            We believe in a world where technology is accessible, beautiful, and functional. Our mission is to provide the highest quality digital assets and education to help you succeed in the modern economy.
                        </motion.p>

                        <div className="grid sm:grid-cols-2 gap-6">
                            {[
                                { icon: FiTarget, title: "Precision", desc: "Pixel-perfect execution in every project." },
                                { icon: FiZap, title: "Speed", desc: "Optimized for performance and scale." },
                                { icon: FiGlobe, title: "Global", desc: "Connecting minds across borders." },
                                { icon: FiUsers, title: "Community", desc: "Building a network of elite creators." }
                            ].map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.3 + (idx * 0.1) }}
                                    className="p-6 border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 rounded-xl hover:border-[#0CB2A9] transition-colors group"
                                >
                                    <item.icon className="text-[#0CB2A9] text-2xl mb-4 group-hover:scale-110 transition-transform" />
                                    <h3 className="font-bold text-lg font-poppins uppercase tracking-wide mb-2">{item.title}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MissionSection;
