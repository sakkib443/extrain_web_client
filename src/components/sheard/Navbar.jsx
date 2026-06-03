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
  LuCode, LuGlobe, LuBookOpen, LuLayers, LuPalette, LuCpu, LuDatabase, LuSmartphone
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
const CategoryMegaMenu = ({ closeMobileMenu, language, bengaliClass }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeParent, setActiveParent] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/categories`);
        const data = await res.json();
        if (data.success) {
          // Organize categories into parent and child structure
          const allCategories = data.data || [];
          // Software marketplace temporarily hidden — exclude software-type categories from the menu.
          const parentCategories = allCategories.filter(cat => !cat.parentCategory && cat.type !== 'software');
          const organized = parentCategories.map(parent => ({
            ...parent,
            children: allCategories.filter(cat =>
              cat.parentCategory &&
              (cat.parentCategory._id === parent._id || cat.parentCategory === parent._id)
            )
          }));
          setCategories(organized);
          if (organized.length > 0) {
            setActiveParent(organized[0]._id);
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (slug, type) => {
    closeMobileMenu();
    if (type === 'website') {
      router.push(`/website?category=${slug}`);
    } else if (type === 'software') {
      router.push(`/software?category=${slug}`);
    } else {
      router.push(`/website?category=${slug}`);
    }
  };

  const getIcon = (slug) => {
    const IconComponent = categoryIcons[slug] || categoryIcons['default'];
    return IconComponent;
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-rose-600/30 border-t-rose-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p className={bengaliClass}>{language === 'bn' ? 'কোনো ক্যাটাগরি পাওয়া যায়নি' : 'No categories found'}</p>
      </div>
    );
  }

  const activeCategory = categories.find(cat => cat._id === activeParent);

  return (
    <div className="flex h-[380px]">
      {/* Left Side - Parent Categories */}
      <div className="w-[240px] bg-gray-50/50 dark:bg-black/20 p-4 border-r border-gray-100 dark:border-white/5 flex flex-col gap-2">
        <p className="text-[12px] font-bold font-teko uppercase tracking-widest text-[#FD9A00] mb-2 px-2">
          {language === 'bn' ? 'ক্যাটাগরি' : 'Categories'}
        </p>
        <div className="space-y-1 overflow-y-auto custom-scrollbar pr-1">
          {categories.map((category) => {
            const Icon = getIcon(category.slug);
            const isActive = activeParent === category._id;
            return (
              <button
                key={category._id}
                onMouseEnter={() => setActiveParent(category._id)}
                onClick={() => handleCategoryClick(category.slug, category.type)}
                className={`w-full flex items-center justify-between gap-3 px-3 py-3 rounded-xl transition-all duration-300 group ${isActive
                  ? 'bg-white dark:bg-[#1E293B] shadow-lg shadow-black/5 dark:shadow-black/20 border border-gray-100 dark:border-white/5'
                  : 'hover:bg-white/60 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 border border-transparent'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 ${isActive
                    ? 'bg-gradient-to-br from-[#FD9A00] to-[#FF8A00] text-white shadow-md shadow-[#FD9A00]/30 scale-110'
                    : 'bg-gray-100 dark:bg-white/10 text-gray-400 dark:text-gray-500 group-hover:bg-[#FD9A00]/10 group-hover:text-[#FD9A00]'
                    }`}>
                    <Icon size={18} />
                  </div>
                  <span className={`text-[15px] font-bold font-teko uppercase tracking-wide transition-colors ${isActive ? 'text-gray-900 dark:text-white' : 'group-hover:text-gray-900 dark:group-hover:text-white'} ${bengaliClass}`}>
                    {language === 'bn' && category.nameBn ? category.nameBn : category.name}
                  </span>
                </div>
                {isActive && (
                  <motion.div layoutId="active-indicator" className="text-[#FD9A00]">
                    <LuChevronRight size={16} />
                  </motion.div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Side - Child Categories */}
      <div className="flex-1 p-6 bg-white dark:bg-[#1E293B]/50">
        {activeCategory && (
          <div className="h-full flex flex-col">
            {/* Active Parent Header */}
            <div className="flex items-center gap-4 pb-4 mb-4 border-b border-gray-100 dark:border-white/5">
              <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center text-black dark:text-white">
                {(() => {
                  const Icon = getIcon(activeCategory.slug);
                  return <Icon size={24} />;
                })()}
              </div>
              <div>
                <h4 className={`text-3xl font-bold font-teko uppercase text-gray-900 dark:text-white leading-none ${bengaliClass}`}>
                  {language === 'bn' && activeCategory.nameBn ? activeCategory.nameBn : activeCategory.name}
                </h4>
                <p className={`text-sm font-medium text-gray-400 uppercase tracking-wider ${bengaliClass}`}>
                  {activeCategory.children?.length || 0} {language === 'bn' ? 'টি সাব-ক্যাটাগরি' : 'Subcategories'}
                </p>
              </div>
            </div>

            {/* Child Categories Grid */}
            {activeCategory.children && activeCategory.children.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 content-start overflow-y-auto custom-scrollbar pr-2">
                {activeCategory.children.map((child) => (
                  <button
                    key={child._id}
                    onClick={() => handleCategoryClick(child.slug, child.type)}
                    className="flex items-center gap-3 py-2 text-left group transition-all duration-200"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 group-hover:bg-[#FD9A00] transition-colors"></div>
                    <span className={`text-[17px] font-medium font-teko uppercase text-gray-600 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors ${bengaliClass}`}>
                      {language === 'bn' && child.nameBn ? child.nameBn : child.name}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
                <div className="w-20 h-20 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center mb-4">
                  <LuLayers className="text-gray-300 dark:text-gray-600" size={32} />
                </div>
                <p className={`text-base font-medium text-gray-400 ${bengaliClass}`}>
                  {language === 'bn' ? 'এই ক্যাটাগরিতে কোনো সাব-ক্যাটাগরি নেই' : 'No subcategories found in this section'}
                </p>
                <button
                  onClick={() => handleCategoryClick(activeCategory.slug, activeCategory.type)}
                  className={`mt-6 px-6 py-2 rounded-full bg-[#FD9A00]/10 text-[#FD9A00] hover:bg-[#FD9A00] hover:text-white font-teko font-bold uppercase transition-all ${bengaliClass}`}
                >
                  {language === 'bn' ? 'সব দেখুন' : 'View All Items'}
                </button>
              </div>
            )}
          </div>
        )}
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
                <Link href="/" onClick={closeMobileMenu}>
                  <h2 className="text-3xl font-black font-teko uppercase text-black leading-none tracking-tight">
                    EXTRAIN <span className="text-[#FD9A00]">WEB</span>
                    <span className="text-[#FD9A00]">.</span>
                  </h2>
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
                        <div className="w-14 h-14 rounded-full border-2 border-[#C4EE18] overflow-hidden bg-black">
                          {user.image ? (
                            <img src={user.image} alt={`${user.name || 'User'}'s profile picture`} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#C4EE18] font-bold text-xl font-teko uppercase">
                              {(user.name || user.gmail || "U").charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className={`font-bold text-gray-900 dark:text-white font-teko text-lg uppercase tracking-wide ${bengaliClass}`}>{user.name || user.gmail?.split('@')[0]}</p>
                          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{user.role || 'Member'}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Link
                          href={user.role === 'admin' ? "/dashboard/admin" : user.role === 'mentor' ? "/dashboard/mentor" : "/dashboard/user"}
                          onClick={closeMobileMenu}
                          className="flex flex-col items-center gap-2 py-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-gray-700 dark:text-gray-200 hover:border-[#C4EE18] hover:text-[#C4EE18] transition-all"
                        >
                          <LuLayoutDashboard size={20} />
                          <span className="text-[14px] font-bold uppercase font-teko tracking-wide">Dashboard</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex flex-col items-center gap-2 py-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 text-red-600 dark:text-red-400"
                        >
                          <LuLogOut size={20} />
                          <span className="text-[14px] font-bold uppercase font-teko tracking-wide">Logout</span>
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
                        className="block w-full text-center py-4 rounded-2xl bg-[#C4EE18] text-black font-bold uppercase font-teko text-xl shadow-lg border border-[#C4EE18] hover:bg-black hover:text-[#C4EE18] transition-all"
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
              <Link href="/" className="relative flex-shrink-0 group">
                <h2 className={`font-black font-teko uppercase text-black dark:text-white leading-none transition-all duration-300 tracking-tight ${isSticky ? "text-3xl" : "text-4xl"}`}>
                  EXTRAIN <span className="text-[#FD9A00]">WEB</span>
                  <span className="text-[#FD9A00]">.</span>
                </h2>
              </Link>

              {/* Category Dropdown - Desktop */}
              <div className="hidden lg:block relative group">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-200 hover:border-[#FD9A00] hover:text-[#FD9A00] hover:bg-[#FD9A00]/5 hover:shadow-md hover:shadow-[#FD9A00]/10 transition-all duration-300 group-hover:border-[#FD9A00] group-hover:text-[#FD9A00]">
                  <BiCategory size={20} />
                  <span className={`text-[18px] font-bold font-teko uppercase tracking-wide ${language === 'bn' ? 'hind-siliguri text-base font-normal tracking-normal' : ''}`}>
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
                  className={`relative px-4 py-2 text-[18px] font-teko uppercase tracking-wide transition-all duration-300 group ${pathname === href
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
                        <div className="w-full h-full bg-black flex items-center justify-center text-[#C4EE18] text-sm font-bold font-teko uppercase">
                          {(user.name || "U").charAt(0)}
                        </div>
                      )}
                    </div>
                    <span className={`text-sm font-bold text-gray-900 dark:text-white max-w-[100px] truncate font-teko uppercase tracking-wide ${bengaliClass}`}>
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
                            <div className="w-12 h-12 rounded-full border-2 border-[#C4EE18] overflow-hidden bg-black">
                              {user.image ? (
                                <img src={user.image} alt={`${user.name || 'User'}'s profile picture`} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[#C4EE18] font-bold text-lg font-teko uppercase">
                                  {(user.name || "U").charAt(0)}
                                </div>
                              )}
                            </div>
                            <div>
                              <p className={`font-bold text-gray-900 dark:text-white text-base font-teko uppercase tracking-wide ${bengaliClass}`}>{user.name || user.gmail?.split('@')[0]}</p>
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
                            <LuLayoutDashboard size={18} className="text-gray-400 group-hover:text-[#C4EE18] transition-colors" />
                            <span className={`text-sm font-bold uppercase tracking-wider font-teko ${bengaliClass}`}>Dashboard</span>
                          </Link>
                          <button
                            onClick={() => {
                              setIsProfileDropdownOpen(false);
                              handleLogout();
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 transition-all group mt-1"
                          >
                            <LuLogOut size={18} className="text-gray-400 group-hover:text-red-500 transition-colors" />
                            <span className="text-sm font-bold uppercase tracking-wider font-teko">Logout</span>
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
