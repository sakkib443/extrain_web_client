"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BiMenu, BiX } from "react-icons/bi";
import {
  LuChevronDown, LuLogOut, LuLayoutDashboard, LuShoppingCart,
  LuSearch, LuArrowUpRight, LuArrowRight,
} from "react-icons/lu";
import { useSelector } from "react-redux";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/context/LanguageContext";
import { getStoredUser } from "@/lib/authUser";
import { motion, AnimatePresence } from "framer-motion";
import useIntroReady from "@/hooks/useIntroReady";

// the orange "you are here" pill and the soft hover pill glide between menu items with this spring
const PILL = { type: "spring", stiffness: 420, damping: 34 };

const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState(null);
  const pathname = usePathname();
  const router = useRouter();
  const { items = [] } = useSelector((state) => state.cart || {});
  const { language } = useLanguage();
  const introReady = useIntroReady(); // slides in as the greeting preloader opens

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
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
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
    { href: "/about", label: language === "bn" ? "আমাদের সম্পর্কে" : "About" },
    { href: "/website", label: language === "bn" ? "ওয়েবসাইট" : "Websites" },
    { href: "/ielts-software", label: language === "bn" ? "সফটওয়্যার" : "Software" },
    { href: "/digital-marketing", label: language === "bn" ? "মার্কেটিং" : "Marketing" },
    { href: "/media-content", label: language === "bn" ? "মিডিয়া" : "Media" },
    { href: "/contact", label: language === "bn" ? "যোগাযোগ" : "Contact" },
  ];

  // a page and everything below it counts (e.g. /website/123 keeps "Websites" lit)
  const isActive = (href) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/"));

  const bn = language === "bn" ? "hind-siliguri" : "";
  const onHome = pathname === "/";
  const solid = isSticky || !onHome; // the bar turns solid once the page scrolls (always solid off the home page)

  const roundBtn = "relative grid h-[42px] w-[42px] place-items-center rounded-full border border-white/12 bg-white/[0.05] text-white/85 backdrop-blur-md transition-all duration-300 hover:border-[#F8921C]/70 hover:bg-white/[0.09] hover:text-[#F8921C]";

  return (
    <>
      {/* ===== Mobile / tablet menu ===== */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
              className="fixed inset-0 bg-black/70 backdrop-blur-md z-[60] xl:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed xl:hidden top-0 left-0 w-[85%] max-w-[360px] h-full bg-[#0e0f11] z-[70] shadow-2xl flex flex-col border-r border-white/10"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <Link href="/" onClick={closeMobileMenu} className="flex items-center gap-2.5">
                  <span className="grid place-items-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFB04A] to-[#F8921C] text-black text-lg font-extrabold">A</span>
                  <span className="text-[1.45rem] font-extrabold text-white tracking-tight">Extrain</span>
                </Link>
                <button onClick={closeMobileMenu} className="w-10 h-10 grid place-items-center rounded-full bg-white/10 text-white/70 hover:text-white" aria-label="Close menu">
                  <BiX className="text-2xl" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="bg-white/5 rounded-2xl p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3 px-2">Language</p>
                  <LanguageSwitcher variant="compact" />
                </div>

                <nav className="space-y-1">
                  {menu.map(({ href, label }) => {
                    const active = isActive(href);
                    return (
                      <Link
                        key={href} href={href} onClick={closeMobileMenu}
                        className={`group flex items-center justify-between px-4 py-3.5 rounded-xl transition-all ${active ? "bg-[#F8921C]/10 text-[#F8921C] font-semibold" : "text-white/70 hover:bg-white/5 hover:text-white"}`}
                      >
                        <span className={`text-base ${bn}`}>{label}</span>
                        <LuArrowRight className={`transition-all ${active ? "opacity-100" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"}`} />
                      </Link>
                    );
                  })}
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

      {/* ===== Header (floats over the hero on the home page) ===== */}
      <nav
        className={`${onHome ? "fixed" : "sticky"} top-0 inset-x-0 z-50 transition-all duration-500 ${
          solid
            ? "bg-[#0e0f11]/80 backdrop-blur-xl border-b border-white/[0.08] py-[17px] shadow-[0_18px_40px_-28px_rgba(0,0,0,0.9)]"
            : "bg-gradient-to-b from-black/55 via-black/20 to-transparent border-b border-transparent py-[20px]"
        }`}
      >
        {/* a fine gold line along the bottom edge once the bar is solid */}
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#F8921C]/45 to-transparent transition-opacity duration-500 ${solid ? "opacity-100" : "opacity-0"}`}
        />

        {/* a little wider than the page content (1280) so the header has room to breathe on big screens */}
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={introReady ? { opacity: 1, y: 0 } : { opacity: 0, y: -24 }}
          transition={{ duration: 0.9, delay: introReady ? 0.25 : 0, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto w-full max-w-[1480px] px-5 sm:px-8">
          <div className="flex items-center justify-between gap-4">

            {/* Logo */}
            <Link href="/" className="group flex shrink-0 items-center gap-3" aria-label="Extrain Web home">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#FFB04A] to-[#F8921C] text-[1.25rem] font-extrabold leading-none text-black shadow-[0_8px_20px_-10px_rgba(248,146,28,0.6)] transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105">
                A
              </span>
              <span className="text-[1.6rem] font-extrabold leading-none tracking-tight text-white">Extrain</span>
            </Link>

            {/* Center menu: a glass track, an orange pill for the current page, a soft pill that follows the mouse */}
            <div
              onMouseLeave={() => setHovered(null)}
              className="hidden xl:flex items-center rounded-full border border-white/10 bg-black/25 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md"
            >
              {menu.map(({ href, label }) => {
                const active = isActive(href);
                const hot = hovered === href && !active;
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={active ? "page" : undefined}
                    onMouseEnter={() => setHovered(href)}
                    onFocus={() => setHovered(href)}
                    onBlur={() => setHovered(null)}
                    className={`relative rounded-full px-3.5 py-2 text-[15px] font-medium min-[1400px]:px-4 ${bn}`}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        transition={PILL}
                        className="absolute inset-0 rounded-full bg-[#F8921C] shadow-[0_6px_16px_-8px_rgba(248,146,28,0.7)]"
                      />
                    )}
                    {hot && (
                      <motion.span
                        layoutId="nav-hover"
                        transition={PILL}
                        className="absolute inset-0 rounded-full bg-white/[0.1]"
                      />
                    )}
                    <span className={`relative z-10 whitespace-nowrap transition-colors duration-200 ${active ? "font-semibold text-black" : hot ? "text-white" : "text-white/75"}`}>
                      {label}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* search (wide screens only) */}
              <button aria-label="Search" className={`${roundBtn} hidden min-[1400px]:grid`}>
                <LuSearch size={19} />
              </button>

              {/* language */}
              <div className="hidden lg:block">
                <LanguageSwitcher />
              </div>

              {/* cart */}
              <Link href="/cart" aria-label="Cart" className={roundBtn}>
                <LuShoppingCart size={19} />
                {mounted && items.length > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[#F8921C] px-1 text-[10px] font-extrabold text-black ring-2 ring-[#0e0f11]">
                    {items.length}
                  </span>
                )}
              </Link>

              {/* profile / get a quote */}
              {mounted && user ? (
                <div className="profile-dropdown-container relative hidden sm:block">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex h-[42px] items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] pl-1.5 pr-3.5 backdrop-blur-md transition-all hover:border-[#F8921C]/60 hover:bg-white/[0.09]"
                  >
                    <div className="h-8 w-8 overflow-hidden rounded-full border border-[#F8921C]/50 bg-black">
                      {user.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={user.image} alt="profile" className="h-full w-full object-cover" />
                      ) : (
                        <div className="grid h-full w-full place-items-center text-sm font-bold uppercase text-[#F8921C]">
                          {(user.name || "U").charAt(0)}
                        </div>
                      )}
                    </div>
                    <span className={`max-w-[90px] truncate text-sm font-semibold text-white ${bn}`}>
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
                  className={`group hidden h-[42px] items-center gap-2.5 rounded-full bg-[#F8921C] pl-5 pr-1 text-[14px] font-bold text-black shadow-[0_10px_24px_-12px_rgba(248,146,28,0.8)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ffa133] sm:inline-flex ${bn}`}
                >
                  {language === "bn" ? "কোটেশন নিন" : "Get a quote"}
                  <span className="grid h-[34px] w-[34px] place-items-center rounded-full bg-[#0e0f11] text-[#F8921C] transition-transform duration-300 group-hover:rotate-45">
                    <LuArrowUpRight size={17} />
                  </span>
                </Link>
              ) : null}

              {/* menu button (below the wide-screen layout) */}
              <button
                className="grid h-[42px] w-[42px] place-items-center rounded-full border border-white/12 bg-white/[0.07] text-white transition-colors hover:border-[#F8921C]/60 xl:hidden"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <BiMenu size={23} />
              </button>
            </div>
          </div>
        </motion.div>
      </nav>

      <style jsx global>{`
        .hind-siliguri { font-family: 'Hind Siliguri', sans-serif; }
      `}</style>
    </>
  );
};

export default Navbar;
