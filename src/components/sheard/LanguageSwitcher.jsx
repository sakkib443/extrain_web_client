"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { HiLanguage } from "react-icons/hi2";
import { LuCheck, LuChevronDown } from "react-icons/lu";

// Black-theme language switcher. "default" = the glass pill in the header with a dropdown; "compact" = the two buttons in the mobile menu.
const LanguageSwitcher = ({ variant = "default" }) => {
    const { language, setLanguage, isLoaded } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const languages = [
        { code: "en", label: "English", shortLabel: "EN", flag: "🇺🇸" },
        { code: "bn", label: "বাংলা", shortLabel: "বাং", flag: "🇧🇩" },
    ];

    const currentLang = languages.find((l) => l.code === language) || languages[0];

    // ALL RENDERING LOGIC AT THE BOTTOM TO ENSURE HOOKS LOADED
    // Compact variant for mobile menu
    const renderCompact = () => (
        <div className="flex gap-2">
            {languages.map((lang) => (
                <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-300 ${language === lang.code
                        ? "bg-[#F8921C]/10 border-[#F8921C] text-white"
                        : "bg-white/5 border-white/10 text-white/70 hover:border-white/25 hover:text-white"
                        }`}
                >
                    <span className="text-lg">{lang.flag}</span>
                    <span className={`text-sm font-medium ${lang.code === "bn" ? "hind-siliguri" : ""}`}>
                        {lang.label}
                    </span>
                    {language === lang.code && (
                        <LuCheck className="text-[#F8921C] text-sm" />
                    )}
                </button>
            ))}
        </div>
    );

    if (!isLoaded) {
        return (
            <div className="h-[42px] w-[86px] animate-pulse rounded-full bg-white/10"></div>
        );
    }

    if (variant === "compact") {
        return renderCompact();
    }

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="group flex h-[42px] items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-3.5 text-white backdrop-blur-md transition-all duration-300 hover:border-[#F8921C]/70 hover:bg-white/[0.09]"
                aria-label="Switch Language"
                aria-expanded={isOpen}
            >
                <HiLanguage className="text-[19px] text-[#F8921C]" />
                <span className={`text-[14px] font-semibold ${language === "bn" ? "hind-siliguri" : ""}`}>
                    {currentLang.shortLabel}
                </span>
                <LuChevronDown
                    className={`text-sm text-white/50 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            {/* Dropdown Menu */}
            <div
                className={`absolute right-0 top-full z-50 mt-3 w-44 overflow-hidden rounded-2xl border border-white/10 bg-[#141518]/95 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl transition-all duration-300 ${isOpen
                    ? "visible translate-y-0 opacity-100"
                    : "invisible -translate-y-2 opacity-0"
                    }`}
            >
                <div className="p-1.5">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => {
                                setLanguage(lang.code);
                                setIsOpen(false);
                            }}
                            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 ${language === lang.code
                                ? "bg-[#F8921C]/12"
                                : "hover:bg-white/[0.06]"
                                }`}
                        >
                            <span className="text-lg">{lang.flag}</span>
                            <span
                                className={`flex-1 text-left text-[13.5px] font-medium ${language === lang.code ? "text-[#F8921C]" : "text-white/75"
                                    } ${lang.code === "bn" ? "hind-siliguri" : ""}`}
                            >
                                {lang.label}
                            </span>
                            {language === lang.code && (
                                <LuCheck className="text-sm text-[#F8921C]" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Accent Line */}
                <div className="h-0.5 bg-gradient-to-r from-transparent via-[#F8921C] to-transparent"></div>
            </div>
        </div>
    );
};

export default LanguageSwitcher;
