"use client";

import { useState } from "react";
import Link from "next/link";
import { LuCheck, LuArrowRight, LuArrowUpRight, LuSparkles } from "react-icons/lu";
import { useLanguage } from "@/context/LanguageContext";
import { getCategory } from "@/data/categories";
import CategoryTemplates from "./CategoryTemplates";
import CategoryHeroVisual from "./CategoryHeroVisual";

export default function CategoryView({ slug }) {
    const { language } = useLanguage();
    const isBn = language === "bn";
    const t = (en, bn) => (isBn ? bn : en);
    const bn = isBn ? "hind-siliguri" : "";

    const [activeTab, setActiveTab] = useState(0);

    const cat = getCategory(slug);
    const name = isBn ? cat.nameBn : cat.name;
    const tagline = isBn ? cat.taglineBn : cat.tagline;
    const description = isBn ? cat.descriptionBn : cat.description;

    return (
        <div className="bg-white dark:bg-[#0a0a0a]">
            {/* ───────── HERO + SERVICE DETAILS (left / right) ───────── */}
            <section className="relative overflow-hidden border-b border-gray-100 dark:border-white/5">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-[#FD9A00]/10 to-transparent rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-[#C4EE18]/10 to-transparent rounded-full blur-3xl" />
                </div>

                <div className="container mx-auto px-4 lg:px-16 relative z-10 py-14 lg:py-20">
                    <div className="grid lg:grid-cols-2 gap-10 items-center">
                        <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C4EE18]/10 border border-[#C4EE18]/30 mb-6">
                            <LuSparkles size={14} className="text-[#7a9100]" />
                            <span className={`text-[11px] font-black uppercase tracking-[0.25em] text-[#5f7000] ${bn}`}>
                                {name} {t("Service", "সার্ভিস")}
                            </span>
                        </div>

                        <h1 className={`text-4xl lg:text-6xl font-black uppercase font-teko ${isBn ? "leading-[1.1]" : "leading-[0.9]"} tracking-tight text-gray-900 dark:text-white mb-4 ${bn}`}>
                            <span className="block text-3xl lg:text-4xl text-gray-700 dark:text-gray-300">{name} {t("Website", "ওয়েবসাইট")}</span>
                            <span className="text-[#FD9A00]">{tagline}</span>
                        </h1>

                        <p className={`text-gray-500 dark:text-gray-400 text-base lg:text-lg leading-relaxed max-w-2xl mb-8 ${bn}`}>
                            {description}
                        </p>

                        <div className="flex flex-wrap gap-3">
                            <a
                                href="#pricing"
                                className={`inline-flex items-center gap-2 px-7 py-3.5 rounded-md bg-[#FD9A00] hover:bg-[#e68a00] text-white font-bold text-sm shadow-lg shadow-[#FD9A00]/30 transition-all hover:-translate-y-0.5 ${bn}`}
                            >
                                {t("View Pricing", "প্রাইসিং দেখুন")} <LuArrowRight size={16} />
                            </a>
                            <Link
                                href="/contact"
                                className={`inline-flex items-center gap-2 px-7 py-3.5 rounded-md bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-sm hover:bg-black transition-all hover:-translate-y-0.5 ${bn}`}
                            >
                                {t("Get a Quote", "কোটেশন নিন")} <LuArrowUpRight size={16} />
                            </Link>
                        </div>
                        </div>
                        <CategoryHeroVisual />
                    </div>

                    {/* What's included */}
                    <div className="mt-12">
                        <h2 className={`text-sm font-black uppercase tracking-[0.3em] text-gray-400 mb-8 ${bn}`}>
                            {t("What's Included", "যা যা থাকছে")}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {cat.services.map((s, i) => (
                                <div
                                    key={i}
                                    className="group p-6 rounded-xl bg-gray-50/70 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 hover:border-[#FD9A00]/40 hover:shadow-lg hover:shadow-[#FD9A00]/5 transition-all duration-300"
                                >
                                    <div className="w-9 h-9 rounded-md bg-[#FD9A00]/10 text-[#FD9A00] flex items-center justify-center font-black font-teko text-lg mb-4 group-hover:bg-[#FD9A00] group-hover:text-white transition-colors">
                                        {String(i + 1).padStart(2, "0")}
                                    </div>
                                    <h3 className={`text-base font-bold text-gray-800 dark:text-gray-100 mb-1.5 ${bn}`}>
                                        {isBn ? s.titleBn : s.title}
                                    </h3>
                                    <p className={`text-sm text-gray-500 dark:text-gray-400 leading-relaxed ${bn}`}>
                                        {isBn ? s.descBn : s.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ───────── PRICING ───────── */}
            <section id="pricing" className="py-20 lg:py-28 bg-gray-50/50 dark:bg-[#0d0d0d]">
                <div className="container mx-auto px-4 lg:px-16">

                    {/* Section header */}
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="w-10 h-[2px] bg-[#C4EE18]" />
                            <span className={`text-[10px] font-black text-[#7a9100] uppercase tracking-[0.4em] ${bn}`}>
                                {t("Pricing", "প্রাইসিং")}
                            </span>
                            <div className="w-10 h-[2px] bg-[#C4EE18]" />
                        </div>
                        <h2 className={`text-4xl lg:text-5xl font-black uppercase font-teko text-gray-900 dark:text-white leading-none ${bn}`}>
                            {name} <span className="text-[#FD9A00]">{t("Packages", "প্যাকেজ")}</span>
                        </h2>
                        <p className={`text-gray-500 dark:text-gray-400 text-sm mt-3 ${bn}`}>
                            {t(
                                "Transparent pricing. No hidden charges. Pick the plan that fits your business.",
                                "স্বচ্ছ প্রাইসিং। কোনো লুকানো চার্জ নেই। আপনার ব্যবসার উপযোগী প্যাকেজ বেছে নিন।"
                            )}
                        </p>
                    </div>

                    <div className="max-w-5xl mx-auto">

                        {/* Tab bar — underline style */}
                        <div className="flex border-b-2 border-gray-100 dark:border-white/[0.07] mb-0">
                            {cat.pricing.map((p, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveTab(i)}
                                    className={`relative flex-1 flex flex-col items-center pt-2 pb-4 px-2 transition-all duration-200 ${
                                        activeTab === i ? "" : "hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                                    }`}
                                >
                                    {p.popular && (
                                        <span className={`mb-1 px-2.5 py-0.5 rounded-full bg-[#FD9A00]/15 text-[#FD9A00] text-[9px] font-black uppercase tracking-wider ${bn}`}>
                                            {t("Popular", "জনপ্রিয়")}
                                        </span>
                                    )}
                                    {!p.popular && <span className="mb-1 h-4" />}
                                    <span className={`text-[11px] font-black uppercase font-teko tracking-widest ${activeTab === i ? "text-[#FD9A00]" : "text-gray-400 dark:text-gray-500"} ${bn}`}>
                                        {isBn ? p.nameBn : p.name}
                                    </span>
                                    <span className={`text-2xl font-black font-teko leading-tight ${activeTab === i ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-500"}`}>
                                        ৳{p.price.toLocaleString()}
                                    </span>
                                    {/* Active underline */}
                                    <span className={`absolute bottom-[-2px] left-0 right-0 h-[3px] rounded-full transition-all duration-200 ${activeTab === i ? "bg-[#FD9A00]" : "bg-transparent"}`} />
                                </button>
                            ))}
                        </div>

                        {/* Plan panels */}
                        {cat.pricing.map((plan, i) => (
                            <div
                                key={i}
                                className={`rounded-b-2xl border-x border-b border-gray-100 dark:border-white/[0.07] overflow-hidden ${activeTab === i ? "flex flex-col lg:flex-row" : "hidden"}`}
                            >
                                {/* Left — plan info */}
                                <div className="lg:w-64 shrink-0 flex flex-col p-7 bg-gradient-to-br from-[#FD9A00]/[0.07] via-[#FD9A00]/[0.03] to-transparent dark:from-[#FD9A00]/[0.1] dark:to-transparent border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-white/[0.07]">
                                    {plan.popular && (
                                        <span className={`self-start mb-4 px-3 py-1 rounded-full bg-[#FD9A00] text-white text-[10px] font-black uppercase tracking-widest shadow-sm ${bn}`}>
                                            {t("Most Popular", "সবচেয়ে জনপ্রিয়")}
                                        </span>
                                    )}
                                    <h3 className={`text-2xl font-black uppercase font-teko tracking-wide text-gray-900 dark:text-white mb-1 ${bn}`}>
                                        {isBn ? plan.nameBn : plan.name}
                                    </h3>
                                    <p className={`text-xs text-gray-500 dark:text-gray-400 mb-6 leading-relaxed ${bn}`}>
                                        {isBn ? plan.summaryBn : plan.summary}
                                    </p>
                                    <div className="mb-1">
                                        <span className="text-5xl font-black font-teko text-gray-900 dark:text-white leading-none">
                                            ৳{plan.price.toLocaleString()}
                                        </span>
                                    </div>
                                    <span className={`text-xs text-gray-400 mb-8 ${bn}`}>{t("one-time payment", "ওয়ান-টাইম পেমেন্ট")}</span>
                                    <Link
                                        href="/contact"
                                        className={`mt-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#FD9A00] hover:bg-[#e68a00] text-white font-bold text-sm shadow-lg shadow-[#FD9A00]/25 transition-all hover:-translate-y-0.5 ${bn}`}
                                    >
                                        {t("Get Started", "শুরু করুন")} <LuArrowRight size={15} />
                                    </Link>
                                </div>

                                {/* Right — features */}
                                <div className="flex-1 p-6 bg-white dark:bg-[#141414]">

                                    {/* Domino Chain strip */}
                                    {plan.dominoChain && (
                                        <div className="mb-5 p-4 rounded-2xl bg-gradient-to-r from-[#FD9A00]/10 via-[#FD9A00]/5 to-[#C4EE18]/10 border border-[#FD9A00]/20">
                                            <p className={`text-[10px] font-black uppercase tracking-[0.2em] text-[#FD9A00] mb-2 ${bn}`}>
                                                ⚡ {isBn ? plan.dominoChain.labelBn : plan.dominoChain.label}
                                            </p>
                                            <div className="flex flex-wrap items-center gap-1.5">
                                                {(isBn ? plan.dominoChain.stepsBn : plan.dominoChain.steps).map((step, si) => (
                                                    <span key={si} className="flex items-center gap-1.5">
                                                        <span className={`px-2.5 py-1 rounded-lg bg-white dark:bg-[#1a1a1a] border border-[#FD9A00]/30 text-xs font-bold text-gray-700 dark:text-gray-200 shadow-sm ${bn}`}>
                                                            {step}
                                                        </span>
                                                        {si < (isBn ? plan.dominoChain.stepsBn : plan.dominoChain.steps).length - 1 && (
                                                            <span className="text-[#FD9A00] text-sm font-black">→</span>
                                                        )}
                                                    </span>
                                                ))}
                                            </div>
                                            <p className={`text-xs text-gray-500 dark:text-gray-400 mt-2 ${bn}`}>
                                                {isBn ? plan.dominoChain.descBn : plan.dominoChain.desc}
                                            </p>
                                        </div>
                                    )}

                                    {plan.featuresRich ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {plan.featuresRich.map((f, j) => (
                                                <div key={j} className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 dark:bg-white/[0.03] border-l-[3px] border-[#FD9A00]/30 hover:border-[#FD9A00] hover:bg-[#FD9A00]/[0.03] transition-all duration-200">
                                                    <span className="mt-0.5 w-5 h-5 rounded-full bg-[#FD9A00]/15 text-[#FD9A00] flex items-center justify-center shrink-0">
                                                        <LuCheck size={11} strokeWidth={3} />
                                                    </span>
                                                    <div>
                                                        <p className={`text-sm font-bold text-gray-800 dark:text-gray-100 leading-snug ${bn}`}>
                                                            {isBn ? f.titleBn : f.title}
                                                        </p>
                                                        <p className={`text-xs mt-0.5 text-gray-500 dark:text-gray-400 leading-snug ${bn}`}>
                                                            {isBn ? f.descBn : f.desc}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                            {(isBn ? plan.featuresBn : plan.features).map((f, j) => (
                                                <div key={j} className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-50 dark:bg-white/[0.03] border-l-[3px] border-[#FD9A00]/30 hover:border-[#FD9A00] transition-colors">
                                                    <span className="w-4 h-4 rounded-full bg-[#FD9A00]/15 text-[#FD9A00] flex items-center justify-center shrink-0">
                                                        <LuCheck size={10} strokeWidth={3} />
                                                    </span>
                                                    <span className={`text-sm text-gray-600 dark:text-gray-300 ${bn}`}>{f}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            </section>

            {/* ───────── TEMPLATES ───────── */}
            <section className="py-20 lg:py-28">
                <div className="container mx-auto px-4 lg:px-16">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-[2px] bg-[#C4EE18]" />
                                <span className={`text-[10px] font-black text-[#7a9100] uppercase tracking-[0.4em] ${bn}`}>
                                    {t("Ready-Made", "রেডিমেড")}
                                </span>
                            </div>
                            <h2 className={`text-4xl lg:text-5xl font-black uppercase font-teko text-gray-900 dark:text-white leading-none ${bn}`}>
                                {name} <span className="text-[#FD9A00]">{t("Templates", "টেমপ্লেট")}</span>
                            </h2>
                        </div>
                        <Link
                            href={`/website?category=${cat.slug}`}
                            className={`inline-flex items-center gap-2 px-6 py-3 rounded-md border border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-200 font-bold text-sm hover:border-[#FD9A00] hover:text-[#FD9A00] transition-all self-start ${bn}`}
                        >
                            {t("View All Templates", "সব টেমপ্লেট দেখুন")} <LuArrowRight size={16} />
                        </Link>
                    </div>

                    <CategoryTemplates slug={cat.slug} name={name} />
                </div>
            </section>
        </div>
    );
}
