"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BiCategory, BiMenu, BiX } from "react-icons/bi";
import {
  LuBookOpenCheck, LuChevronDown, LuLogOut,
  LuLayoutDashboard, LuShoppingCart, LuSearch,
  LuSparkles, LuUser, LuArrowRight, LuSun, LuMoon, LuChevronRight,
  LuCode, LuGlobe, LuBookOpen, LuLayers, LuPalette, LuCpu, LuDatabase, LuSmartphone,
  LuShoppingBag, LuBriefcase, LuNewspaper, LuUtensils, LuBuilding2, LuStethoscope
} from "react-icons/lu";
import { HiOutlineSparkles, HiOutlineUserCircle } from "react-icons/hi2";
import { useSelector } from "react-redux";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

import { API_BASE_URL } from "@/config/api";

// Category icons mapping
const categoryIcons = {
  'web-development': LuGlobe,
  'programming': LuCode,
  'design': LuPalette,
  'database': LuDatabase,
  'mobile': LuSmartphone,
  'software': LuCpu,
  'default': LuLayers
};

// Category Mega Menu Component
// Same 8 website categories as the home "Browse by Category" section.
const NAV_CATEGORIES = [
  { slug: "ecommerce", icon: LuShoppingBag, en: "E-Commerce", bn: "ই-কমার্স", subEn: "Online Stores & Shops", subBn: "অনলাইন স্টোর ও শপ" },
  { slug: "business", icon: LuBriefcase, en: "Business", bn: "বিজনেস", subEn: "Corporate & Agency", subBn: "কর্পোরেট ও এজেন্সি" },
  { slug: "portfolio", icon: LuLayoutDashboard, en: "Portfolio", bn: "পোর্টফোলিও", subEn: "Personal & Creative", subBn: "পার্সোনাল ও ক্রিয়েটিভ" },
  { slug: "blog", icon: LuNewspaper, en: "Blog & News", bn: "ব্লগ ও নিউজ", subEn: "Blog & Magazine", subBn: "ব্লগ ও ম্যাগাজিন" },
  { slug: "restaurant", icon: LuUtensils, en: "Restaurant", bn: "রেস্টুরেন্ট", subEn: "Food & Cafe", subBn: "ফুড ও ক্যাফে" },
  { slug: "real-estate", icon: LuBuilding2, en: "Real Estate", bn: "রিয়েল এস্টেট", subEn: "Property & Listing", subBn: "প্রপার্টি ও লিস্টিং" },
  { slug: "healthcare", icon: LuStethoscope, en: "Healthcare", bn: "হেলথকেয়ার", subEn: "Medical & Clinic", subBn: "মেডিকেল ও ক্লিনিক" },
];

// Category Mega Menu Component — links to /category/<slug> landing pages.
const CategoryMegaMenu = ({ closeMobileMenu, language, bengaliClass }) => {
  const isBn = language === "bn";
  return (
    <div className="p-4">
      <p className={`text-[12px] font-bold font-poppins tracking-widest text-[#FD9A00] mb-3 px-2 ${bengaliClass}`}>
        {isBn ? "ক্যাটাগরি" : "Categories"}
      </p>
      <div className="grid grid-cols-2 gap-1.5">
        {NAV_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              onClick={closeMobileMenu}
              className="flex items-center gap-3 p-2.5 rounded-xl border border-transparent hover:bg-gray-50 dark:hover:bg-white/5 hover:border-gray-100 dark:hover:border-white/10 transition-all duration-200 group"
            >
              <div className="w-10 h-10 shrink-0 rounded-lg bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 flex items-center justify-center group-hover:bg-[#0CB2A9] group-hover:text-black transition-all duration-300">
                <Icon size={18} />
              </div>
              <div className="min-w-0">
                <p className={`text-[15px] font-bold font-poppins tracking-wide text-gray-800 dark:text-white leading-none mb-0.5 truncate ${bengaliClass}`}>
                  {isBn ? cat.bn : cat.en}
                </p>
                <p className={`text-[11px] text-gray-400 dark:text-gray-500 truncate ${bengaliClass}`}>
                  {isBn ? cat.subBn : cat.subEn}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};


const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { items = [] } = useSelector((state) => state.cart || {});
  const { t, language } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Dark mode toggle handler
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
          setIsDarkMode(true);
          document.documentElement.classList.add("dark");
        }
      }
    } catch (error) {
      console.error("Error loading theme:", error);
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    try {
      if (typeof window !== 'undefined') {
        if (!isDarkMode) {
          document.documentElement.classList.add("dark");
          localStorage.setItem("theme", "dark");
        } else {
          document.documentElement.classList.remove("dark");
          localStorage.setItem("theme", "light");
        }
      }
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  };

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setTimeout(() => setUser(JSON.parse(storedUser)), 0);
        }
      }
    } catch (error) {
      console.error("Error loading user:", error);
    }
  }, []);

  const handleLogout = () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
    setUser(null);
    closeMobileMenu();
    router.replace("/login");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileDropdownOpen && !event.target.closest('.profile-dropdown-container')) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isProfileDropdownOpen]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);


  const menu = [
    { href: "/", label: language === 'bn' ? "হোম" : "Home" },
    { href: "/website", label: language === 'bn' ? "ওয়েবসাইট" : "Websites" },

    { href: "/ielts-software", label: language === 'bn' ? "IELTS মকটেস্ট সফটওয়্যার" : "IELTS Mocktest Software" },
    { href: "/happy-clients", label: language === 'bn' ? "সন্তুষ্ট ক্লায়েন্ট" : "Happy Clients" },
    { href: "/about", label: language === 'bn' ? "আমাদের সম্পর্কে" : "About" },
    { href: "/contact", label: language === 'bn' ? "যোগাযোগ" : "Contact" },
  ];

  const bengaliClass = language === "bn" ? "hind-siliguri" : "";

  return (
    <>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Mobile Menu Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] lg:hidden"
            />

            {/* Mobile Menu Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed lg:hidden top-0 left-0 w-[85%] max-w-[360px] h-full bg-white z-[70] shadow-2xl flex flex-col"
            >
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-50">
                <Link href="/" onClick={closeMobileMenu} aria-label="Extrain Web home">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/extrain-logo.png" alt="Extrain Web" className="h-9 w-auto object-contain" />
                </Link>
                <button
                  onClick={closeMobileMenu}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:text-gray-900 transition-colors"
                >
                  <BiX className="text-2xl" />
                </button>
              </div>

              {/* Mobile Scroll Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Language for Mobile */}
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 px-2">Select Language</p>
                  <LanguageSwitcher variant="compact" />
                </div>

                {/* Dark Mode Toggle for Mobile */}
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 px-2">Theme</p>
                  <button
                    onClick={toggleDarkMode}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white hover:bg-gray-100 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      {isDarkMode ? (
                        <LuMoon size={20} className="text-amber-400" />
                      ) : (
                        <LuSun size={20} className="text-amber-500" />
                      )}
                      <span className="text-sm font-semibold text-gray-700">
                        {isDarkMode ? "Dark Mode" : "Light Mode"}
                      </span>
                    </div>
                    <div className={`w-12 h-6 rounded-full transition-all ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} relative`}>
                      <motion.div
                        animate={{ x: isDarkMode ? 24 : 2 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className={`absolute top-1 w-4 h-4 rounded-full ${isDarkMode ? 'bg-amber-400' : 'bg-white shadow-sm'}`}
                      />
                    </div>
                  </button>
                </div>

                {/* Main Navigation */}
                <nav className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 px-2">Main Menu</p>
                  {menu.map(({ href, label }, index) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={closeMobileMenu}
                      className={`group flex items-center justify-between px-4 py-3.5 rounded-xl transition-all ${pathname === href
                        ? "bg-rose-50 text-rose-800 font-medium"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                    >
                      <span className={`text-base ${bengaliClass}`}>{label}</span>
                      <LuArrowRight className={`text-rose-600 transition-all ${pathname === href ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"}`} />
                    </Link>
                  ))}
                </nav>

                {/* User Section Mobile */}
                <div className="pt-6 border-t border-gray-100">
                  {user ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-black/50 border border-gray-100 dark:border-white/10">
                        <div className="w-14 h-14 rounded-full border-2 border-[#0CB2A9] overflow-hidden bg-black">
                          {user.image ? (
                            <img src={user.image} alt={`${user.name || 'User'}'s profile picture`} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#0CB2A9] font-bold text-xl font-poppins uppercase">
                              {(user.name || user.gmail || "U").charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className={`font-bold text-gray-900 dark:text-white font-poppins text-lg uppercase tracking-wide ${bengaliClass}`}>{user.name || user.gmail?.split('@')[0]}</p>
                          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{user.role || 'Member'}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Link
                          href={user.role === 'admin' ? "/dashboard/admin" : user.role === 'mentor' ? "/dashboard/mentor" : "/dashboard/user"}
                          onClick={closeMobileMenu}
                          className="flex flex-col items-center gap-2 py-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-gray-700 dark:text-gray-200 hover:border-[#0CB2A9] hover:text-[#0CB2A9] transition-all"
                        >
                          <LuLayoutDashboard size={20} />
                          <span className="text-[14px] font-bold uppercase font-poppins tracking-wide">Dashboard</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex flex-col items-center gap-2 py-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 text-red-600 dark:text-red-400"
                        >
                          <LuLogOut size={20} />
                          <span className="text-[14px] font-bold uppercase font-poppins tracking-wide">Logout</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Link
                        href={`/login?redirect=${encodeURIComponent(pathname + (typeof window !== 'undefined' ? window.location.search : ''))}`}
                        onClick={closeMobileMenu}
                        className="block w-full text-center py-4 rounded-2xl bg-[#FD9A00] text-white font-bold shadow-lg shadow-[#FD9A00]/30 hover:bg-[#e68a00] transition-all"
                      >
                        Sign In
                      </Link>
                      <Link
                        href={`/register?redirect=${encodeURIComponent(pathname + (typeof window !== 'undefined' ? window.location.search : ''))}`}
                        onClick={closeMobileMenu}
                        className="block w-full text-center py-4 rounded-2xl bg-[#0CB2A9] text-black font-bold uppercase font-poppins text-xl shadow-lg border border-[#0CB2A9] hover:bg-black hover:text-[#0CB2A9] transition-all"
                      >
                        Join Platform
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <nav
        className={`sticky top-0 z-50 transition-all duration-500 ${isSticky
          ? "bg-white/80 dark:bg-[#1E293B]/80 backdrop-blur-2xl border-b border-gray-100 dark:border-white/5 shadow-sm py-2"
          : "bg-white dark:bg-[#1E293B] border-b border-transparent py-4"
          }`}
      >
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between gap-4">

            {/* Left: Logo & Categories */}
            <div className="flex items-center gap-8 xl:gap-12">
              <Link href="/" className="relative flex-shrink-0 group" aria-label="Extrain Web home">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/extrain-logo.png"
                  alt="Extrain Web"
                  className={`w-auto object-contain transition-all duration-300 dark:brightness-0 dark:invert ${isSticky ? "h-8 lg:h-9" : "h-9 lg:h-11"}`}
                />
              </Link>

              {/* Category Dropdown - Desktop */}
              <div className="hidden lg:block relative group">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-200 hover:border-[#FD9A00] hover:text-[#FD9A00] hover:bg-[#FD9A00]/5 hover:shadow-md hover:shadow-[#FD9A00]/10 transition-all duration-300 group-hover:border-[#FD9A00] group-hover:text-[#FD9A00]">
                  <BiCategory size={20} />
                  <span className={`text-[14px] font-bold font-poppins tracking-wide ${language === 'bn' ? 'hind-siliguri text-base font-normal tracking-normal' : ''}`}>
                    {language === 'bn' ? 'ক্যাটাগরি' : 'Category'}
                  </span>
                  <LuChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
                </button>

                {/* Categories Mega Menu */}
                <div className="absolute top-full left-0 mt-4 w-[650px] bg-white/95 dark:bg-[#1E293B]/95 backdrop-blur-2xl rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-gray-100 dark:border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 translate-y-4 transition-all duration-300 z-50 overflow-hidden ring-1 ring-black/5 dark:ring-white/5">
                  <CategoryMegaMenu closeMobileMenu={closeMobileMenu} language={language} bengaliClass={bengaliClass} />
                </div>
              </div>
            </div>

            {/* Center: Navigation Links - Desktop */}
            <div className="hidden xl:flex items-center gap-1">
              {menu.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`relative px-3 py-2 text-[14px] font-poppins tracking-wide whitespace-nowrap transition-all duration-300 group ${pathname === href
                    ? "text-[#FD9A00] font-medium"
                    : "text-gray-600 dark:text-gray-300 hover:text-[#FD9A00] font-medium"
                    } ${language === 'bn' ? 'hind-siliguri text-base font-normal tracking-normal' : ''}`}
                >
                  {label}
                  {/* Animated underline */}
                  <span
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-[#FD9A00] rounded-full transition-all duration-300 ${pathname === href ? "w-4" : "w-0 group-hover:w-4"
                      }`}
                  />
                </Link>
              ))}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 lg:gap-3">
              {/* 1. Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="hidden lg:flex w-10 h-10 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-[#1E293B] dark:hover:bg-[#334155] transition-all duration-300 group"
                aria-label="Toggle dark mode"
              >
                {mounted && (
                  <motion.div
                    animate={{ rotate: isDarkMode ? 180 : 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="relative"
                  >
                    {isDarkMode ? (
                      <LuMoon size={18} className="text-amber-400" />
                    ) : (
                      <LuSun size={18} className="text-amber-500 group-hover:rotate-12 transition-transform" />
                    )}
                  </motion.div>
                )}
              </button>

              {/* 2. Language Switcher */}
              <div className="hidden lg:block">
                <LanguageSwitcher />
              </div>

              {/* 3. Cart */}
              <Link href="/cart" className="relative w-10 h-10 flex items-center justify-center rounded-full text-gray-600 dark:text-gray-300 hover:bg-rose-50 dark:hover:bg-[#334155] hover:text-rose-700 transition-all group">
                <LuShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
                {mounted && items.length > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-amber-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-md">
                    {items.length}
                  </span>
                )}
              </Link>

              {/* 4. Profile with Name & Dropdown */}
              {mounted && user ? (
                <div className="profile-dropdown-container relative hidden sm:block">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 dark:bg-[#1E293B] hover:bg-gray-100 dark:hover:bg-[#334155] border border-gray-100 dark:border-gray-600/50 transition-all"
                  >
                    <div className="w-8 h-8 rounded-full border-2 border-rose-600/30 overflow-hidden">
                      {user.image ? (
                        <img src={user.image} alt={`${user.name || 'User'}'s profile picture`} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-black flex items-center justify-center text-[#0CB2A9] text-sm font-bold font-poppins uppercase">
                          {(user.name || "U").charAt(0)}
                        </div>
                      )}
                    </div>
                    <span className={`text-sm font-bold text-gray-900 dark:text-white max-w-[100px] truncate font-poppins uppercase tracking-wide ${bengaliClass}`}>
                      {user.name || user.gmail?.split('@')[0] || 'User'}
                    </span>
                    <LuChevronDown className={`text-gray-400 transition-transform duration-300 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} size={16} />
                  </button>

                  {/* Profile Dropdown */}
                  <AnimatePresence>
                    {isProfileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-[#1E293B] rounded-2xl shadow-xl border border-gray-100 dark:border-gray-600/50 overflow-hidden z-50"
                      >
                        {/* User Info Header */}
                        <div className="p-4 bg-gray-50 dark:bg-black/50 border-b border-gray-100 dark:border-white/10">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full border-2 border-[#0CB2A9] overflow-hidden bg-black">
                              {user.image ? (
                                <img src={user.image} alt={`${user.name || 'User'}'s profile picture`} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[#0CB2A9] font-bold text-lg font-poppins uppercase">
                                  {(user.name || "U").charAt(0)}
                                </div>
                              )}
                            </div>
                            <div>
                              <p className={`font-bold text-gray-900 dark:text-white text-base font-poppins uppercase tracking-wide ${bengaliClass}`}>{user.name || user.gmail?.split('@')[0]}</p>
                              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{user.role || 'Member'}</p>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="p-2">
                          <Link
                            href={user.role === 'admin' ? "/dashboard/admin" : user.role === 'mentor' ? "/dashboard/mentor" : "/dashboard/user"}
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-black dark:hover:text-white transition-all group border border-transparent hover:border-gray-200 dark:hover:border-white/10"
                          >
                            <LuLayoutDashboard size={18} className="text-gray-400 group-hover:text-[#0CB2A9] transition-colors" />
                            <span className={`text-sm font-bold uppercase tracking-wider font-poppins ${bengaliClass}`}>Dashboard</span>
                          </Link>
                          <button
                            onClick={() => {
                              setIsProfileDropdownOpen(false);
                              handleLogout();
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 transition-all group mt-1"
                          >
                            <LuLogOut size={18} className="text-gray-400 group-hover:text-red-500 transition-colors" />
                            <span className="text-sm font-bold uppercase tracking-wider font-poppins">Logout</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : mounted ? (
                <Link
                  href={`/login?redirect=${encodeURIComponent(pathname + (typeof window !== 'undefined' ? window.location.search : ''))}`}
                  className="hidden sm:flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#FD9A00] hover:bg-[#e68a00] text-white font-bold text-sm transition-all shadow-lg shadow-[#FD9A00]/30 hover:shadow-[#FD9A00]/50 transform hover:-translate-y-0.5"
                >
                  <LuUser size={18} />
                  <span>Login</span>
                </Link>
              ) : null}

              {/* Mobile Toggle */}
              <button
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 border border-gray-100 transition-all"
                onClick={toggleMobileMenu}
              >
                <BiMenu size={22} className="text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Adding custom animation styles */}
      <style jsx global>{`
        .outfit { font-family: 'Outfit', sans-serif; }
        .hind-siliguri { font-family: 'Hind Siliguri', sans-serif; }
      `}</style>
    </>
  );
};

export default Navbar;
