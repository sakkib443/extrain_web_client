"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import BracketLabel from "@/components/Home/BracketLabel";
import { OrbitRing, Star4 } from "@/components/Home/Decor";
import { reveal } from "@/components/Aboutpage/sections/shared";
import { LuMoveRight, LuPhone, LuMail } from "react-icons/lu";
import { FaWhatsapp, FaFacebookMessenger } from "react-icons/fa";

const IeltsCTA = () => {
    const { language } = useLanguage();
    const isBn = language === "bn";
    const bn = isBn ? "hind-siliguri" : "";

    const scrollToPricing = () => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });

    const contacts = [
        { icon: LuPhone, text: "+880 1711-946614", href: "tel:+8801711946614" },
        { icon: FaFacebookMessenger, text: "Messenger", href: "https://m.me/extrainweb", external: true },
        { icon: LuMail, text: "info.extrainweb@gmail.com", href: "mailto:info.extrainweb@gmail.com" },
    ];

    return (
        <section className="relative overflow-hidden bg-[color:var(--tone-soft)] py-24 text-white lg:py-28">
            <div className="container relative z-10 mx-auto px-6 lg:px-10">
                <motion.div
                    {...reveal(0)}
                    className="relative overflow-hidden rounded-[2rem] rounded-tl-[5rem] border border-white/10 bg-[color:var(--tone-deep)] px-6 py-16 text-center sm:px-12 lg:py-20"
                >
                    {/* decoration */}
                    <div className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: "url('/hero-bg.webp')" }} aria-hidden="true" />
                    <div className="pointer-events-none absolute -bottom-24 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-[#F8921C]/[0.14] blur-3xl" aria-hidden="true" />
                    <div className="pointer-events-none absolute -right-40 -top-40 hidden aspect-square w-[26rem] sm:block" aria-hidden="true">
                        <OrbitRing dashed className="absolute inset-0 border-white/[0.10]" />
                        <OrbitRing reverse dot="bottom" className="absolute inset-[18%] border-[#F8921C]/25" />
                    </div>
                    <Star4 size={28} filled className="decor-float pointer-events-none absolute bottom-10 left-10 hidden text-[#F8921C] md:block" />

                    <div className="relative mx-auto max-w-3xl">
                        <div className="mb-7">
                            <BracketLabel bn={bn} size="lg">{isBn ? "১৪ দিন ফ্রি ট্রায়াল" : "14 days free trial"}</BracketLabel>
                        </div>
                        <h2 style={{ color: "#fff" }} className={`text-[1.9rem] font-bold leading-[1.2] sm:text-4xl lg:text-[3rem] ${bn}`}>
                            {isBn ? (
                                <>আপনার IELTS ইনস্টিটিউটকে <i className="font-light text-[#F8921C]">আপগ্রেড করুন</i></>
                            ) : (
                                <>Upgrade Your IELTS Institute <i className="font-light text-[#F8921C]">Today</i></>
                            )}
                        </h2>
                        <p className={`mx-auto mt-5 max-w-2xl text-base leading-7 text-white/65 ${bn}`}>
                            {isBn
                                ? "British Council ইন্টারফেসে স্টুডেন্ট প্র্যাক্টিস, অটো মার্কিং, AI Speaking, Admin Dashboard — সব এক প্ল্যাটফর্মে। আজই ফ্রি ডেমো দেখুন।"
                                : "BC-interface practice, auto marking, AI Speaking and an Admin Dashboard — all in one platform. Book your free demo today."}
                        </p>

                        <div className="mt-9 flex flex-wrap items-center justify-center gap-x-5 gap-y-4">
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={scrollToPricing}
                                    className={`inline-flex items-center rounded-full bg-[#F8921C] px-8 py-4 text-sm font-semibold uppercase text-black transition-colors hover:bg-[#e07d0a] ${bn ? "tracking-normal" : "tracking-wide"} ${bn}`}
                                >
                                    {isBn ? "ফ্রি ডেমো বুক করুন" : "Book Free Demo"}
                                </button>
                                <button
                                    type="button"
                                    onClick={scrollToPricing}
                                    aria-label={isBn ? "প্যাকেজ দেখুন" : "See packages"}
                                    className="grid h-[52px] w-[52px] place-items-center rounded-full bg-white text-[#0a0a0a] transition-colors hover:bg-[#F8921C]"
                                >
                                    <LuMoveRight size={22} />
                                </button>
                            </div>
                            <a
                                href="https://wa.me/8801711946614"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-flex items-center gap-2 rounded-full border border-white/25 px-8 py-4 text-sm font-semibold uppercase text-white transition-colors hover:border-[#F8921C] hover:text-[#F8921C] ${bn ? "tracking-normal" : "tracking-wide"} ${bn}`}
                            >
                                <FaWhatsapp size={17} />
                                {isBn ? "সরাসরি কথা বলুন" : "Talk to Sales"}
                            </a>
                        </div>

                        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 border-t border-white/10 pt-7">
                            {contacts.map(({ icon: Icon, text, href, external }) => (
                                <a
                                    key={text}
                                    href={href}
                                    target={external ? "_blank" : undefined}
                                    rel={external ? "noopener noreferrer" : undefined}
                                    className="inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-[#F8921C]"
                                >
                                    <Icon size={16} className="text-[#F8921C]" />
                                    {text}
                                </a>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default IeltsCTA;
