"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useTransform } from "framer-motion";
import {
    LuMail, LuPhone, LuMapPin, LuSend, LuClock, LuArrowUpRight, LuMoveRight, LuCheck,
} from "react-icons/lu";
import { FaFacebookF, FaYoutube, FaLinkedinIn, FaWhatsapp, FaInstagram } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";
import useSectionMotion from "@/hooks/useSectionMotion";
import BracketLabel from "@/components/Home/BracketLabel";
import { Star4, EdgeDots, OrbitRing } from "@/components/Home/Decor";
import { outlineStyle, filledAccent, reveal } from "@/components/Aboutpage/sections/shared";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://extrain-web-server.vercel.app/api";

// Fallback content — replaced by the admin-editable version from the API when it loads.
const DEFAULT_CONTENT = {
    hero: {
        badge: "Get In Touch",
        badgeBn: "যোগাযোগ করুন",
        subtitle: "Have questions? We would love to hear from you. Send us a message and we will respond as soon as possible.",
        subtitleBn: "কোনো প্রশ্ন আছে? আমাদের মেসেজ পাঠান, আমরা যত তাড়াতাড়ি সম্ভব উত্তর দেব।",
    },
    contactInfo: {
        email: "info.extrainweb@gmail.com",
        phone: "+88 01711946614",
        address: "Road - 11, DIT Project, Marul Badda, Badda, Dhaka -1214, Bangladesh",
        addressBn: "রোড - ১১, ডিআইটি প্রজেক্ট, মারুল বাড্ডা, বাড্ডা, ঢাকা -১২১৪, বাংলাদেশ",
        officeHours: "Sat - Thu: 10:00 AM - 6:00 PM",
        officeHoursBn: "শনি - বৃহস্পতি: সকাল ১০টা - সন্ধ্যা ৬টা",
    },
    socialLinks: {
        facebook: "https://www.facebook.com/Extrain Web",
        youtube: "https://www.youtube.com/@Extrain Web",
        linkedin: "https://www.linkedin.com/company/Extrain Web",
        whatsapp: "https://wa.me/8801711946614",
        instagram: "https://www.instagram.com/Extrain Web/",
    },
};

// Office location: Progoti Tower, Pragati Sarani, Merul Badda. Kept in code on purpose — the map URL
// stored in the admin panel pointed at another company's office.
const MAP_EMBED_URL =
    "https://maps.google.com/maps?q=" + encodeURIComponent("Pragati Tower, Kha-214/E, Pragati Sarani, Merul Badda, Dhaka 1212") + "&z=17&output=embed";

const inputCls =
    "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-white placeholder-white/30 outline-none transition-colors focus:border-[#F8921C] focus:bg-white/[0.06]";
const labelCls = "mb-2 block text-[12px] font-semibold uppercase text-white/50";

export default function ContactContent() {
    const { t, language } = useLanguage();
    const isBn = language === "bn";
    const bn = isBn ? "hind-siliguri" : "";

    const [content, setContent] = useState(DEFAULT_CONTENT);
    const [messageSent, setMessageSent] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

    // admin-editable content
    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`${API_URL}/design/contact`);
                const data = await res.json();
                if (data.success && data.data?.contactContent) {
                    // merge so a field missing from the API never blanks the page
                    const c = data.data.contactContent;
                    setContent((prev) => ({
                        ...prev,
                        ...c,
                        hero: { ...prev.hero, ...c.hero },
                        contactInfo: { ...prev.contactInfo, ...c.contactInfo },
                        socialLinks: { ...prev.socialLinks, ...c.socialLinks },
                    }));
                }
            } catch (error) {
                console.error("Error fetching contact content:", error);
            }
        })();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessageSent(true);
    };
    const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

    const info = content.contactInfo;
    const tel = `tel:${info.phone.replace(/[\s-]/g, "")}`;

    // the three quickest ways to reach us (hero panel)
    const quick = [
        { icon: LuPhone, label: isBn ? "কল করুন" : "Call us", value: info.phone, href: tel },
        { icon: FaWhatsapp, label: isBn ? "হোয়াটসঅ্যাপ" : "WhatsApp", value: isBn ? "এখনই চ্যাট করুন" : "Chat with us now", href: content.socialLinks.whatsapp, external: true },
        { icon: LuMail, label: isBn ? "ইমেইল করুন" : "Email us", value: info.email, href: `mailto:${info.email}` },
    ];

    const socials = [
        { icon: FaFacebookF, href: content.socialLinks.facebook, label: "Facebook" },
        { icon: FaYoutube, href: content.socialLinks.youtube, label: "YouTube" },
        { icon: FaLinkedinIn, href: content.socialLinks.linkedin, label: "LinkedIn" },
        { icon: FaWhatsapp, href: content.socialLinks.whatsapp, label: "WhatsApp" },
        { icon: FaInstagram, href: content.socialLinks.instagram, label: "Instagram" },
    ].filter((s) => s.href);

    // ---- hero motion (same feel as the About hero) ----
    const { ref: heroRef, p, mx, reduce, isLg } = useSectionMotion();
    const k = isLg ? 1 : 0.4;
    const textY = useTransform(p, [0, 1], [14 * k, -34 * k]);
    const panelY = useTransform(p, [0, 1], [22 * k, -22 * k]);
    const glowX = useTransform(mx, [-0.5, 0.5], [-50, 50]);
    const ringX = useTransform(mx, [-0.5, 0.5], [-28, 28]);
    const ringY = useTransform(p, [0, 1], [-50, 50]);
    const starY = useTransform(p, [0, 1], [-60, 60]);
    const starX = useTransform(mx, [-0.5, 0.5], [-24, 24]);

    return (
        <div className="relative overflow-x-clip bg-[color:var(--tone-deep)] text-white selection:bg-[#F8921C] selection:text-black">
            {/* ======================= 1. HERO ======================= */}
            <section ref={heroRef} className="relative overflow-hidden bg-[color:var(--tone-deep)]">
                <div className="pointer-events-none absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/hero-bg.webp')" }} />
                <div className="pointer-events-none absolute inset-0 bg-black/30" />

                <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                    <motion.div
                        style={reduce ? undefined : { x: glowX }}
                        className="absolute -bottom-32 left-[8%] h-96 w-96 rounded-full bg-[#F8921C]/[0.10] blur-3xl"
                    />
                    <EdgeDots />
                    <motion.div style={reduce ? undefined : { x: ringX, y: ringY }} className="absolute -right-[16rem] top-[6%] hidden sm:block">
                        <div className="relative aspect-square w-[36rem]">
                            <OrbitRing dashed className="absolute inset-0 border-white/[0.12]" />
                            <OrbitRing reverse dot="bottom" className="absolute inset-[16%] border-[#F8921C]/25" />
                        </div>
                    </motion.div>
                    <motion.div style={reduce ? undefined : { x: starX, y: starY }} className="absolute left-[44%] top-[12%] hidden lg:block">
                        <Star4 size={34} filled className="decor-float text-[#F8921C]" style={{ animationDuration: "10s" }} />
                    </motion.div>
                </div>

                <div className="container relative z-10 mx-auto px-6 lg:px-10">
                    <div className="grid items-center gap-14 pb-16 pt-32 lg:min-h-[min(calc(100svh-65px),780px)] lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:pb-20">
                        {/* ---------- left: copy ---------- */}
                        <motion.div style={reduce ? undefined : { y: textY }}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                                className="mb-12"
                            >
                                <BracketLabel bn={bn} size="lg">{isBn ? content.hero.badgeBn : content.hero.badge}</BracketLabel>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                                style={{ color: "#fff" }}
                                className="relative font-bold uppercase leading-[1.08] tracking-[-0.015em] text-[clamp(2.6rem,6.4vw,5.4rem)]"
                            >
                                {/* top-left bracket */}
                                <span aria-hidden="true" className="pointer-events-none absolute -top-4 left-0 hidden h-16 w-16 border-l border-t border-white/90 sm:block">
                                    <i className="absolute -left-[5px] -top-[5px] h-2.5 w-2.5 bg-[#F8921C]" />
                                    <i className="absolute -bottom-[5px] -left-[5px] h-2.5 w-2.5 bg-[#F8921C]" />
                                </span>

                                <span className="block text-white sm:pl-[0.55em]">LET&apos;S</span>
                                <span className="block">
                                    <span className="relative inline-block">
                                        <span style={outlineStyle}>
                                            T<span style={filledAccent}>A</span>LK
                                        </span>
                                        <span style={filledAccent}>.</span>
                                        {/* bottom-right bracket */}
                                        <span aria-hidden="true" className="pointer-events-none absolute -bottom-3 -right-8 hidden h-14 w-14 border-b border-r border-white/90 sm:block">
                                            <i className="absolute -right-[5px] -top-[5px] h-2.5 w-2.5 bg-[#F8921C]" />
                                            <i className="absolute -bottom-[5px] -right-[5px] h-2.5 w-2.5 bg-[#F8921C]" />
                                        </span>
                                    </span>
                                </span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                className={`mt-9 max-w-md border-l-2 border-[#F8921C] py-0.5 pl-5 text-base leading-relaxed text-white/70 lg:text-lg ${bn}`}
                            >
                                {isBn ? content.hero.subtitleBn : content.hero.subtitle}
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.4 }}
                                className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4"
                            >
                                <div className="flex items-center gap-2">
                                    <a
                                        href="#message"
                                        className={`inline-flex items-center rounded-full bg-[#F8921C] px-8 py-4 text-sm font-semibold uppercase text-black transition-colors hover:bg-[#e07d0a] ${bn ? "tracking-normal" : "tracking-wide"} ${bn}`}
                                    >
                                        {isBn ? "মেসেজ পাঠান" : "Send a Message"}
                                    </a>
                                    <a
                                        href="#message"
                                        aria-label={isBn ? "মেসেজ পাঠান" : "Send a Message"}
                                        className="grid h-[52px] w-[52px] place-items-center rounded-full bg-white text-[#0a0a0a] transition-colors hover:bg-[#F8921C]"
                                    >
                                        <LuMoveRight size={22} />
                                    </a>
                                </div>
                                <a
                                    href={tel}
                                    className={`inline-flex items-center gap-2 rounded-full border border-white/25 px-8 py-4 text-sm font-semibold uppercase text-white transition-colors hover:border-[#F8921C] hover:text-[#F8921C] ${bn ? "tracking-normal" : "tracking-wide"} ${bn}`}
                                >
                                    <LuPhone size={16} />
                                    {isBn ? "কল করুন" : "Call Now"}
                                </a>
                            </motion.div>
                        </motion.div>

                        {/* ---------- right: quick-contact panel ---------- */}
                        <motion.div style={reduce ? undefined : { y: panelY }} className="relative mx-auto w-full max-w-[540px] lg:max-w-none">
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                                className="relative"
                            >
                                {/* offset outline behind the panel (same as the About photo) */}
                                <div
                                    aria-hidden="true"
                                    className="pointer-events-none absolute inset-0 translate-x-3 translate-y-3 rounded-[2rem] rounded-tl-[6rem] border border-[#F8921C]/40 sm:translate-x-4 sm:translate-y-4"
                                />

                                <div className="relative overflow-hidden rounded-[2rem] rounded-tl-[6rem] border border-white/10 bg-[color:var(--tone-soft)]/85 p-6 pt-14 backdrop-blur-md sm:p-9 sm:pt-16">
                                    <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#F8921C]/[0.12] blur-3xl" />

                                    <p className={`relative text-[12px] font-semibold uppercase text-[#F8921C] ${bn ? "tracking-normal" : "tracking-[0.2em]"} ${bn}`}>
                                        {isBn ? "সরাসরি যোগাযোগ" : "Reach us directly"}
                                    </p>

                                    <div className="relative mt-5 divide-y divide-white/10">
                                        {quick.map(({ icon: Icon, label, value, href, external }) => (
                                            <a
                                                key={label}
                                                href={href}
                                                target={external ? "_blank" : undefined}
                                                rel={external ? "noopener noreferrer" : undefined}
                                                className="group flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                                            >
                                                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#F8921C]/10 text-[#F8921C] transition-colors duration-300 group-hover:bg-[#F8921C] group-hover:text-black">
                                                    <Icon size={20} />
                                                </span>
                                                <span className="min-w-0 flex-1">
                                                    <span className={`block text-[12px] uppercase text-white/50 ${bn ? "tracking-normal" : "tracking-[0.14em]"} ${bn}`}>{label}</span>
                                                    <span className={`block truncate text-[15px] font-semibold text-white transition-colors group-hover:text-[#F8921C] sm:text-base ${bn}`}>{value}</span>
                                                </span>
                                                <LuArrowUpRight size={20} className="shrink-0 text-white/30 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#F8921C]" />
                                            </a>
                                        ))}
                                    </div>

                                    {/* office hours */}
                                    <div className="relative mt-7 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3.5">
                                        <span className="relative flex h-2.5 w-2.5 shrink-0">
                                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F8921C] opacity-60" />
                                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#F8921C]" />
                                        </span>
                                        <LuClock size={16} className="shrink-0 text-white/50" />
                                        <span className={`text-[13px] text-white/75 ${bn}`}>{isBn ? info.officeHoursBn : info.officeHours}</span>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ======================= 2. FORM ======================= */}
            <section id="message" className="relative scroll-mt-20 overflow-hidden bg-[color:var(--tone-soft)] py-24 lg:py-32">
                <div className="pointer-events-none absolute -left-24 top-1/3 h-80 w-80 rounded-full bg-[#F8921C]/[0.05] blur-3xl" aria-hidden="true" />

                <div className="container relative z-10 mx-auto px-6 lg:px-10">
                    <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
                        {/* ---------- left: heading + address + socials ---------- */}
                        <div>
                            <motion.div {...reveal(0)} className="mb-7">
                                <BracketLabel bn={bn} size="lg">{isBn ? "মেসেজ পাঠান" : "Send a message"}</BracketLabel>
                            </motion.div>
                            <motion.h2
                                {...reveal(1)}
                                style={{ color: "#fff" }}
                                className={`text-[1.7rem] font-bold leading-[1.25] sm:text-3xl lg:text-[2.35rem] ${bn}`}
                            >
                                {isBn ? (
                                    <>আপনার প্রজেক্ট নিয়ে <i className="font-light">কথা বলি</i>।</>
                                ) : (
                                    <>Tell Us About <i className="font-light">Your Project</i>.</>
                                )}
                            </motion.h2>
                            <motion.p {...reveal(2)} className={`mt-4 max-w-md text-sm leading-7 text-white/60 sm:text-base ${bn}`}>
                                {isBn
                                    ? "ফর্মটি পূরণ করুন, আমাদের টিম এক কর্মদিবসের মধ্যে আপনার সাথে যোগাযোগ করবে।"
                                    : "Fill in the form and our team will get back to you within one working day."}
                            </motion.p>

                            <motion.div {...reveal(3)} className="mt-10 space-y-4">
                                <a href="#map" className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-[#F8921C]/60">
                                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#F8921C]/10 text-[#F8921C] transition-colors group-hover:bg-[#F8921C] group-hover:text-black">
                                        <LuMapPin size={20} />
                                    </span>
                                    <span>
                                        <span className={`block text-[12px] uppercase text-white/50 ${bn ? "tracking-normal" : "tracking-[0.14em]"} ${bn}`}>
                                            {isBn ? "আমাদের ঠিকানা" : "Visit us"}
                                        </span>
                                        <span className={`mt-1 block text-[15px] leading-6 text-white ${bn}`}>{isBn ? info.addressBn : info.address}</span>
                                    </span>
                                </a>
                            </motion.div>

                            {socials.length > 0 && (
                                <motion.div {...reveal(4)} className="mt-10">
                                    <p className={`text-[12px] font-semibold uppercase text-white/50 ${bn ? "tracking-normal" : "tracking-[0.2em]"} ${bn}`}>
                                        {t("contactPage.followUs")}
                                    </p>
                                    <div className="mt-4 flex flex-wrap gap-2.5">
                                        {socials.map(({ icon: Icon, href, label }) => (
                                            <a
                                                key={label}
                                                href={href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label={label}
                                                className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-[#F8921C] hover:bg-[#F8921C] hover:text-black"
                                            >
                                                <Icon size={16} />
                                            </a>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* ---------- right: form ---------- */}
                        <motion.div {...reveal(1)}>
                            <form
                                onSubmit={handleSubmit}
                                className="relative rounded-[1.75rem] border border-white/10 bg-[color:var(--tone-deep)] p-6 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)] sm:p-9"
                            >
                                <span aria-hidden="true" className="absolute left-9 top-0 h-[3px] w-16 -translate-y-1/2 rounded-full bg-[#F8921C]" />

                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="name" className={`${labelCls} ${bn}`}>{t("contactPage.yourName")}</label>
                                        <input id="name" type="text" required value={formData.name} onChange={handleChange} className={`${inputCls} ${bn}`} placeholder={isBn ? "আপনার নাম" : "John Doe"} />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className={`${labelCls} ${bn}`}>{t("contactPage.emailAddress")}</label>
                                        <input id="email" type="email" required value={formData.email} onChange={handleChange} className={inputCls} placeholder="hello@example.com" />
                                    </div>
                                </div>
                                <div className="mt-5">
                                    <label htmlFor="subject" className={`${labelCls} ${bn}`}>{t("contactPage.subject")}</label>
                                    <input id="subject" type="text" value={formData.subject} onChange={handleChange} className={`${inputCls} ${bn}`} placeholder={isBn ? "প্রজেক্ট সম্পর্কে" : "Project enquiry"} />
                                </div>
                                <div className="mt-5">
                                    <label htmlFor="message" className={`${labelCls} ${bn}`}>{t("contactPage.message")}</label>
                                    <textarea
                                        id="message"
                                        rows={6}
                                        required
                                        value={formData.message}
                                        onChange={handleChange}
                                        className={`${inputCls} resize-none ${bn}`}
                                        placeholder={isBn ? "আপনার প্রজেক্ট সম্পর্কে লিখুন..." : "Tell us about your project..."}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className={`group mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#F8921C] px-8 py-4 text-sm font-semibold uppercase text-black transition-colors hover:bg-[#e07d0a] ${bn ? "tracking-normal" : "tracking-wide"} ${bn}`}
                                >
                                    {t("contactPage.send")}
                                    <LuSend size={16} className="transition-transform group-hover:translate-x-1" />
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ======================= 3. MAP ======================= */}
            <section id="map" className="relative scroll-mt-20 bg-[color:var(--tone-deep)] py-20 lg:py-24">
                <div className="container mx-auto px-6 lg:px-10">
                    <motion.div {...reveal(0)} className="relative">
                        <div className="h-[380px] overflow-hidden rounded-[2rem] border border-white/10 grayscale transition-all duration-700 hover:grayscale-0 sm:h-[440px]">
                            <iframe
                                src={MAP_EMBED_URL}
                                width="100%"
                                height="100%"
                                className="border-0"
                                allowFullScreen
                                loading="lazy"
                                title="Office Location"
                            />
                        </div>
                        {/* address card over the map */}
                        <div className="pointer-events-none mt-4 rounded-2xl border border-white/10 bg-[color:var(--tone-soft)] p-5 sm:absolute sm:bottom-6 sm:left-6 sm:mt-0 sm:max-w-sm sm:bg-black/70 sm:backdrop-blur-md">
                            <div className="flex items-start gap-3">
                                <LuMapPin size={20} className="mt-0.5 shrink-0 text-[#F8921C]" />
                                <div>
                                    <p className={`text-sm font-semibold text-white ${bn}`}>{isBn ? "এক্সট্রেইন ওয়েব অফিস" : "Extrain Web Office"}</p>
                                    <p className={`mt-1 text-[13px] leading-5 text-white/65 ${bn}`}>{isBn ? info.addressBn : info.address}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ======================= success modal ======================= */}
            <AnimatePresence>
                {messageSent && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
                            onClick={() => setMessageSent(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.92, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            role="dialog"
                            aria-modal="true"
                            className="fixed left-1/2 top-1/2 z-[60] w-11/12 max-w-md -translate-x-1/2 -translate-y-1/2 rounded-[1.75rem] border border-white/10 bg-[color:var(--tone-soft)] p-8 text-center shadow-2xl"
                        >
                            <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-[#F8921C]/10 text-[#F8921C]">
                                <LuCheck size={34} />
                            </div>
                            <h3 style={{ color: "#fff" }} className={`mb-3 text-2xl font-bold ${bn}`}>{t("contactPage.messageSent")}</h3>
                            <p className={`mb-8 text-white/60 ${bn}`}>{t("contactPage.messageResponse")}</p>
                            <button
                                onClick={() => setMessageSent(false)}
                                className={`rounded-full bg-[#F8921C] px-10 py-3.5 text-sm font-semibold uppercase text-black transition-colors hover:bg-[#e07d0a] ${bn}`}
                            >
                                {t("contactPage.close")}
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
