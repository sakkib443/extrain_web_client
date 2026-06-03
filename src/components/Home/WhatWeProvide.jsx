"use client";

import { LuLayoutGrid, LuCode, LuHeadphones, LuArrowRight } from "react-icons/lu";
import { HiOutlineSparkles } from "react-icons/hi2";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

const WhatWeProvide = () => {
  const { t, language } = useLanguage();
  const bengaliClass = language === "bn" ? "hind-siliguri" : "";

  const features = [
    { icon: LuLayoutGrid, titleKey: "premiumDesign", descKey: "premiumDesignDesc", emoji: "✨", color: "lime" },
    { icon: LuCode, titleKey: "readyScripts", descKey: "readyScriptsDesc", emoji: "🚀", color: "lime" },
    { icon: LuHeadphones, titleKey: "lifetimeSupport", descKey: "lifetimeSupportDesc", emoji: "🛠️", color: "lime" }
  ];

  const getColorClasses = (color) => ({
    gradient: 'from-[#C4EE18] to-[#C4EE18]',
    light: 'bg-[#C4EE18]/5',
    text: 'text-[#C4EE18]',
    border: 'border-[#C4EE18]/20'
  });

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-[10%] w-72 h-72 bg-[#C4EE18]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-[10%] w-80 h-80 bg-[#C4EE18]/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-16 relative z-10">
        <div className="flex flex-col items-center text-center mb-10 px-2">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-[2px] bg-[#C4EE18]" />
            <span className={`text-[10px] font-black text-[#C4EE18] uppercase tracking-[0.4em] ${bengaliClass}`}>
              {t("whatWeProvide.badge")}
            </span>
            <div className="w-10 h-[2px] bg-[#C4EE18]" />
          </div>
          <h2 className={`text-4xl lg:text-5xl font-black text-gray-950 dark:text-white mb-2 uppercase leading-[0.85] tracking-tighter max-w-3xl font-teko ${bengaliClass}`}>
            {t("whatWeProvide.title1")}{' '}
            <span className="text-[#C4EE18]">{t("whatWeProvide.title2")}</span>
          </h2>
          <div className="w-20 h-1 bg-gray-100 dark:bg-white/10 mb-2" />
          <p className={`text-gray-500 dark:text-gray-400 text-sm lg:text-base max-w-2xl leading-relaxed ${bengaliClass}`}>
            {t("whatWeProvide.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const colors = getColorClasses(feature.color);
            return (
              <div key={index} className="group relative bg-white dark:bg-[#0d0d0d] rounded-md p-8 border border-gray-200 dark:border-white/10 transition-shadow duration-300 hover:shadow-lg overflow-hidden">
                <div className={`absolute -top-10 -right-10 w-24 h-24 rounded-full bg-gradient-to-br ${colors.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
                <div className="relative z-10">
                  <div className="relative mb-5">
                    <div className={`w-16 h-16 ${colors.light} rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                      <feature.icon size={28} className={colors.text} />
                    </div>
                  </div>
                  <h3 className={`text-2xl font-black uppercase font-teko text-gray-900 dark:text-white mb-3 flex items-center gap-2 ${bengaliClass}`}>{t(`whatWeProvide.features.${feature.titleKey}`)} <span className="text-xl">{feature.emoji}</span></h3>
                  <p className={`text-sm text-gray-500 dark:text-gray-400 mb-6 ${bengaliClass}`}>{t(`whatWeProvide.features.${feature.descKey}`)}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/10">
                    <span className={`text-xs font-bold text-gray-900 dark:text-white uppercase tracking-widest ${bengaliClass}`}>{t("whatWeProvide.learnMore")}</span>
                    <div className={`w-8 h-8 rounded-lg ${colors.light} group-hover:bg-[#C4EE18] transition-colors duration-300 flex items-center justify-center`}><LuArrowRight size={16} className="text-black dark:text-white -rotate-45" /></div>
                  </div>
                </div>
                <div className={`absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r ${colors.gradient} rounded-b-2xl group-hover:w-full transition-all duration-500`} />
              </div>
            );
          })}
        </div>

        <div className="flex justify-start px-2 mt-14">
          <Link href="/about" className={`group relative bg-white dark:bg-[#0d0d0d] rounded-md px-8 py-4 border border-gray-200 dark:border-white/10 hover:shadow-lg flex items-center gap-4 transition-all duration-300 ${bengaliClass} font-poppins`}>
            <span className="font-medium text-gray-900 dark:text-white">{t("whatWeProvide.learnMoreAboutUs")}</span>
            <div className="w-10 h-10 rounded-md bg-[#C4EE18]/10 flex items-center justify-center group-hover:bg-[#C4EE18] transition-colors duration-300">
              <LuArrowRight size={18} className="text-slate-700 dark:text-slate-300 group-hover:text-black" />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WhatWeProvide;
