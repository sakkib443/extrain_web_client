"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import BracketLabel from "@/components/Home/BracketLabel";
import TiltCard from "@/components/Home/TiltCard";
import { reveal } from "@/components/Aboutpage/sections/shared";
import { LuPhone, LuPresentation, LuSettings, LuRocket, LuChevronRight } from "react-icons/lu";

const IeltsHowItWorks = () => {
    const { language } = useLanguage();
    const isBn = language === "bn";
    const bn = isBn ? "hind-siliguri" : "";

    const steps = [
        {
            icon: LuPhone,
            title: isBn ? "আমাদের সাথে যোগাযোগ করুন" : "Contact Us",
            description: isBn ? "WhatsApp বা ফোনে আমাদের সাথে যোগাযোগ করুন। আপনার প্রয়োজন জানান।" : "Reach us on WhatsApp or phone and tell us what you need.",
        },
        {
            icon: LuPresentation,
            title: isBn ? "ফ্রি ডেমো দেখুন" : "Get a Free Demo",
            description: isBn ? "আমরা আপনাকে সফটওয়্যারের সম্পূর্ণ ডেমো দেখাব। সব ফিচার ব্যাখ্যা করব।" : "We walk you through the full software and explain every feature.",
        },
        {
            icon: LuSettings,
            title: isBn ? "সেটআপ ও ট্রেনিং" : "Setup & Training",
            description: isBn ? "আপনার ইনস্টিটিউটের নামে সেটআপ করে দেব। Admin ট্রেনিং দেব।" : "We set it up under your institute's brand and train your admins.",
        },
        {
            icon: LuRocket,
            title: isBn ? "লাইভ হয়ে যান!" : "Go Live!",
            description: isBn ? "আপনার স্টুডেন্টদের অ্যাক্সেস দিন। BC মানের প্র্যাক্টিস শুরু করুন।" : "Give your students access and start British Council-standard practice.",
        },
    ];

    return (
        <section className="relative overflow-hidden bg-[color:var(--tone-deep)] py-24 text-white lg:py-32">
            <div className="pointer-events-none absolute -top-24 right-1/4 h-80 w-80 rounded-full bg-[#F8921C]/[0.06] blur-3xl" aria-hidden="true" />

            <div className="container relative z-10 mx-auto px-6 lg:px-10">
                <div className="mx-auto max-w-2xl text-center">
                    <motion.div {...reveal(0)} className="mb-7">
                        <BracketLabel bn={bn} size="lg">{isBn ? "সহজ প্রক্রিয়া" : "Simple process"}</BracketLabel>
                    </motion.div>
                    <motion.h2 {...reveal(1)} style={{ color: "#fff" }} className={`text-[1.7rem] font-bold leading-[1.25] sm:text-3xl lg:text-[2.35rem] ${bn}`}>
                        {isBn ? <>কিভাবে <i className="font-light">শুরু করবেন?</i></> : <>How to <i className="font-light">Get Started</i>?</>}
                    </motion.h2>
                    <motion.p {...reveal(2)} className={`mt-4 text-sm leading-7 text-white/60 sm:text-base ${bn}`}>
                        {isBn ? "মাত্র ৪টি সহজ ধাপে আপনার ইনস্টিটিউটে IELTS সফটওয়্যার চালু করুন" : "Launch the IELTS software in your institute in four simple steps."}
                    </motion.p>
                </div>

                <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {steps.map(({ icon: Icon, title, description }, i) => (
                        <motion.div key={title} {...reveal(i)} className="relative h-full">
                            {/* arrow to the next step */}
                            {i < steps.length - 1 && (
                                <span
                                    aria-hidden="true"
                                    className="pointer-events-none absolute -right-[19px] top-[42px] z-20 hidden h-7 w-7 place-items-center rounded-full bg-[#F8921C] text-black shadow-[0_6px_16px_-6px_rgba(248,146,28,0.9)] lg:grid"
                                >
                                    <LuChevronRight size={16} />
                                </span>
                            )}
                            <TiltCard className="h-full" radius="1.25rem">
                                <div className="group flex h-full flex-col rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#F8921C]/60 hover:bg-white/[0.05]">
                                    <div className="flex items-start justify-between">
                                        <span className="grid h-14 w-14 place-items-center rounded-xl bg-[#F8921C]/10 text-[#F8921C] transition-colors duration-300 group-hover:bg-[#F8921C] group-hover:text-black">
                                            <Icon size={24} />
                                        </span>
                                        <span className="text-3xl font-bold tabular-nums text-white/10 transition-colors group-hover:text-[#F8921C]/60">0{i + 1}</span>
                                    </div>
                                    <h3 style={{ color: "#fff" }} className={`mt-6 text-[17px] font-semibold leading-snug ${bn}`}>{title}</h3>
                                    <p className={`mt-2 text-[13.5px] leading-6 text-white/60 ${bn}`}>{description}</p>
                                </div>
                            </TiltCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default IeltsHowItWorks;
