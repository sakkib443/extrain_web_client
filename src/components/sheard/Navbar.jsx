"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BiMenu, BiX } from "react-icons/bi";
import {
  LuChevronDown, LuLogOut, LuLayoutDashboard, LuShoppingCart,
  LuSearch, LuArrowUpRight, LuArrowRight, LuUser,
} from "react-icons/lu";
import { useSelector } from "react-redux";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/context/LanguageContext";
import { getStoredUser } from "@/lib/authUser";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { items = [] } = useSelector((state) => state.cart || {});
  const { language } = useLanguage();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const t = setTimeout(() => {
      const storedUser = getStoredUser();
      if (storedUser) setUser(storedUser);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileDropdownOpen && !event.target.closest(".profile-dropdown-container")) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isProfileDropdownOpen]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleLogout = () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } catch (e) { /* noop */ }
    setUser(null);
    closeMobileMenu();
    router.replace("/login");
  };

  const menu = [
    { href: "/", label: language === "bn" ? "হোম" : "Home" },
    { href: "/website", label: language === "bn" ? "ওয়েবসাইট" : "Websites" },
    { href: "/ielts-software", label: language === "bn" ? "সফটওয়্যার" : "Software" },
    { href: "/happy-clients", label: language === "bn" ? "ক্লায়েন্ট" : "Clients" },
    { href: "/about", label: language === "bn" ? "আমাদের সম্পর্কে" : "About" },
    { href: "/contact", label: language === "bn" ? "যোগাযোগ" : "Contact" },
  ];

  const bn = language === "bn" ? "hind-siliguri" : "";

  return (
    <>
      {/* ===== Mobile Menu ===== */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
              className="fixed inset-0 bg-black/70 backdrop-blur-md z-[60] lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed lg:hidden top-0 left-0 w-[85%] max-w-[360px] h-full bg-[#0d0d0d] z-[70] shadow-2xl flex flex-col border-r border-white/10"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <Link href="/" onClick={closeMobileMenu} className="flex items-center gap-2">
                  <span className="grid place-items-center w-9 h-9 rounded-lg bg-[#F8921C] text-black font-extrabold">A</span>
                  <span className="text-xl font-extrabold text-white">Extrain</span>
                </Link>
                <button onClick={closeMobileMenu} className="w-10 h-10 grid place-items-center rounded-full bg-white/10 text-white/70 hover:text-white">
                  <BiX className="text-2xl" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="bg-white/5 rounded-2xl p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3 px-2">Language</p>
                  <LanguageSwitcher variant="compact" />
                </div>

                <nav className="space-y-1">
                  {menu.map(({ href, label }) => (
                    <Link
                      key={href} href={href} onClick={closeMobileMenu}
                      className={`group flex items-center justify-between px-4 py-3.5 rounded-xl transition-all ${pathname === href ? "bg-[#F8921C]/10 text-[#F8921C] font-semibold" : "text-white/70 hover:bg-white/5 hover:text-white"}`}
                    >
                      <span className={`text-base ${bn}`}>{label}</span>
                      <LuArrowRight className={`transition-all ${pathname === href ? "opacity-100" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"}`} />
                    </Link>
                  ))}
                </nav>

                <div className="pt-4 border-t border-white/10">
                  {user ? (
                    <div className="grid grid-cols-2 gap-3">
                      <Link
                        href={user.role === "admin" ? "/dashboard/admin" : user.role === "mentor" ? "/dashboard/mentor" : "/dashboard/user"}
                        onClick={closeMobileMenu}
                        className="flex flex-col items-center gap-2 py-4 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-[#F8921C] transition-all"
                      >
                        <LuLayoutDashboard size={20} />
                        <span className="text-[13px] font-bold uppercase tracking-wide">Dashboard</span>
                      </Link>
                      <button onClick={handleLogout} className="flex flex-col items-center gap-2 py-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                        <LuLogOut size={20} />
                        <span className="text-[13px] font-bold uppercase tracking-wide">Logout</span>
                      </button>
                    </div>
                  ) : (
                    <Link href="/login" onClick={closeMobileMenu} className="block w-full text-center py-4 rounded-full bg-[#F8921C] text-black font-bold">
                      Sign In
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ===== Header (overlays the hero on home) ===== */}
      <nav
        className={`${pathname === "/" ? "fixed" : "sticky"} top-0 inset-x-0 z-50 transition-all duration-500 ${
          isSticky || pathname !== "/"
            ? "bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/10 py-3"
            : "bg-transparent border-b border-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between gap-4">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0" aria-label="Extrain Web home">
              <span className="grid place-items-center w-9 h-9 rounded-lg bg-[#F8921C] text-black text-lg font-extrabold">A</span>
              <span className="text-2xl font-extrabold text-white tracking-tight">Extrain</span>
            </Link>

            {/* Center nav */}
            <div className="hidden lg:flex items-center gap-1">
              {menu.map(({ href, label }) => (
                <Link
                  key={href} href={href}
                  className={`group relative flex items-center gap-1 px-4 py-2 text-[15px] font-medium transition-colors ${
                    pathname === href ? "text-[#F8921C]" : "text-white/80 hover:text-white"
                  } ${bn}`}
                >
                  {label}
                  <LuChevronDown size={14} className="opacity-60 group-hover:rotate-180 transition-transform duration-300" />
                </Link>
              ))}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              {/* search */}
              <button
                aria-label="Search"
                className="w-11 h-11 grid place-items-center rounded-full bg-[#F8921C] text-black hover:bg-[#e07d0a] transition-colors"
              >
                <LuSearch size={20} />
              </button>

              {/* language */}
              <div className="hidden lg:block">
                <LanguageSwitcher />
              </div>

              {/* cart */}
              <Link href="/cart" className="relative w-11 h-11 hidden sm:grid place-items-center rounded-full text-white/80 hover:bg-white/10 hover:text-white transition-all">
                <LuShoppingCart size={20} />
                {mounted && items.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#F8921C] text-black text-[9px] font-black rounded-full grid place-items-center">
                    {items.length}
                  </span>
                )}
              </Link>

              {/* profile / get a quote */}
              {mounted && user ? (
                <div className="profile-dropdown-container relative hidden sm:block">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                  >
                    <div className="w-8 h-8 rounded-full border border-[#F8921C]/40 overflow-hidden bg-black">
                      {user.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={user.image} alt="profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full grid place-items-center text-[#F8921C] text-sm font-bold uppercase">
                          {(user.name || "U").charAt(0)}
                        </div>
                      )}
                    </div>
                    <span className={`text-sm font-semibold text-white max-w-[90px] truncate ${bn}`}>
                      {user.name || user.gmail?.split("@")[0] || "User"}
                    </span>
                    <LuChevronDown className={`text-white/50 transition-transform ${isProfileDropdownOpen ? "rotate-180" : ""}`} size={16} />
                  </button>
                  <AnimatePresence>
                    {isProfileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full right-0 mt-2 w-56 bg-[#111] rounded-2xl shadow-xl border border-white/10 overflow-hidden z-50"
                      >
                        <div className="p-2">
                          <Link
                            href={user.role === "admin" ? "/dashboard/admin" : user.role === "mentor" ? "/dashboard/mentor" : "/dashboard/user"}
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/80 hover:bg-white/5 hover:text-white transition-all"
                          >
                            <LuLayoutDashboard size={18} className="text-[#F8921C]" />
                            <span className="text-sm font-semibold">Dashboard</span>
                          </Link>
                          <button
                            onClick={() => { setIsProfileDropdownOpen(false); handleLogout(); }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/60 hover:bg-red-500/10 hover:text-red-400 transition-all"
                          >
                            <LuLogOut size={18} />
                            <span className="text-sm font-semibold">Logout</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : mounted ? (
                <Link
                  href="/contact"
                  className={`hidden sm:inline-flex items-center gap-1.5 px-6 py-3 rounded-full bg-[#F8921C] hover:bg-[#e07d0a] text-black font-bold text-sm transition-all hover:-translate-y-0.5 ${bn}`}
                >
                  {language === "bn" ? "কোটেশন নিন" : "Get a quote"}
                  <LuArrowUpRight size={16} />
                </Link>
              ) : null}

              {/* mobile toggle */}
              <button
                className="lg:hidden w-11 h-11 grid place-items-center rounded-full bg-white/10 text-white"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <BiMenu size={22} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <style jsx global>{`
        .hind-siliguri { font-family: 'Hind Siliguri', sans-serif; }
      `}</style>
    </>
  );
};

export default Navbar;
