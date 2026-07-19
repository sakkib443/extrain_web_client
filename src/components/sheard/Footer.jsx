/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import React, { useState } from "react";
import { FaFacebook, FaLinkedin, FaYoutube, FaInstagram } from "react-icons/fa";
import { IoCallOutline, IoLocationOutline, IoMailOutline } from "react-icons/io5";
import { LuSend, LuHeart } from "react-icons/lu";
import { useLanguage } from "@/context/LanguageContext";

const Footer = () => {
  const [email, setEmail] = useState("");
  const { t, language } = useLanguage();

  // Apply Bengali font class when language is Bengali
  const bengaliClass = language === "bn" ? "hind-siliguri" : "";

  const quickLinks = [
    { to: "/", label: language === "bn" ? "হোম" : "Home" },
    { to: "/confirm-order", label: language === "bn" ? "অর্ডার করুন" : "Place Order" },
    { to: "/website", label: language === "bn" ? "টেমপ্লেট" : "Templates" },
    { to: "/blog", label: language === "bn" ? "ব্লগ" : "Blog" },
    { to: "/about", label: language === "bn" ? "আমাদের সম্পর্কে" : "About Us" },
    { to: "/contact", label: language === "bn" ? "যোগাযোগ" : "Contact" },
  ];

  const categories = [
    { label: language === "bn" ? "ওয়েবসাইট টেমপ্লেট" : "Website Templates", path: "/website" },
    { label: language === "bn" ? "ওয়ার্ডপ্রেস থিম" : "WordPress Themes", path: "/website?category=wordpress" },
    { label: language === "bn" ? "ই-কমার্স সল্যুশন" : "eCommerce", path: "/website?category=ecommerce" },
    { label: language === "bn" ? "ইউআই/ইউএক্স ডিজাইন" : "UI/UX Design", path: "/website?category=uiux" },
  ];

  const socialLinks = [
    { icon: FaFacebook, href: "https://www.facebook.com/Extrain Web", color: "#1877F2", label: "Facebook" },
    { icon: FaLinkedin, href: "https://www.linkedin.com/company/Extrain Web/", color: "#0A66C2", label: "LinkedIn" },
    { icon: FaYoutube, href: "https://www.youtube.com/@Extrain Web", color: "#FF0000", label: "YouTube" },
    { icon: FaInstagram, href: "https://www.instagram.com/Extrain Web/", color: "#E4405F", label: "Instagram" },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-[#0F172A] dark:via-[#1E293B] dark:to-[#0F172A] overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(12, 178, 169,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(12, 178, 169,0.03)_1px,transparent_1px)] bg-[size:40px_40px] dark:opacity-30"></div>

      {/* Gradient Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#0CB2A9]/5 dark:bg-[#0CB2A9]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#0CB2A9]/5 dark:bg-[#0CB2A9]/10 rounded-full blur-3xl"></div>

      {/* Main Footer Content */}
      <div className="relative container mx-auto px-4 lg:px-16 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">

          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="inline-block relative group" aria-label="Extrain Web home">
              <img src="/extrain-logo.png" alt="Extrain Web" className="h-11 lg:h-12 w-auto object-contain dark:brightness-0 dark:invert" />
            </Link>
            <p className={`text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-w-sm font-medium ${bengaliClass}`}>
              {t("footer.brandDescription") || "Extrain Web is a premium website and software marketplace in Bangladesh, providing high-quality digital products and custom development services."}
            </p>

            {/* Newsletter */}
            <div className="pt-4">
              <h4 className={`text-gray-800 dark:text-white font-black font-poppins uppercase text-xl mb-3 ${bengaliClass}`}>
                {t("footer.subscribeNewsletter") || "Subscribe to Newsletter"}
              </h4>
              <div className="flex gap-0">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("footer.enterEmail") || "Enter your email"}
                  className={`flex-1 px-4 py-3 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-600/50 rounded-l-md text-gray-800 dark:text-gray-200 text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-[#FD9A00] transition-colors ${bengaliClass}`}
                />
                <button className="px-6 py-3 bg-[#FD9A00] hover:bg-[#e68a00] text-white font-bold font-poppins uppercase tracking-wide rounded-r-md transition-colors shadow-lg shadow-[#FD9A00]/20">
                  <LuSend className="text-xl" />
                </button>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 mt-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-md bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-600/50 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-[#FD9A00] hover:text-white hover:border-[#FD9A00] transition-all duration-300 shadow-sm"
                  title={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={`text-gray-800 dark:text-white font-black font-poppins uppercase text-xl mb-6 flex items-center gap-2 ${bengaliClass}`}>
              <span className="w-1.5 h-6 bg-[#FD9A00] rounded-full"></span>
              {t("footer.quickLinks") || "Quick Links"}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.to}
                    className={`text-gray-600 dark:text-gray-400 hover:text-[#FD9A00] text-sm font-normal transition-colors block group ${bengaliClass}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className={`text-gray-800 dark:text-white font-black font-poppins uppercase text-xl mb-6 flex items-center gap-2 ${bengaliClass}`}>
              <span className="w-1.5 h-6 bg-[#FD9A00] rounded-full"></span>
              {t("footer.categories") || "Categories"}
            </h4>
            <ul className="space-y-3">
              {categories.map((cat, index) => (
                <li key={index}>
                  <Link
                    href={cat.path}
                    className={`text-gray-600 dark:text-gray-400 hover:text-[#FD9A00] text-sm font-normal transition-colors block group ${bengaliClass}`}
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className={`text-gray-800 dark:text-white font-black font-poppins uppercase text-xl mb-6 flex items-center gap-2 ${bengaliClass}`}>
              <span className="w-1.5 h-6 bg-[#FD9A00] rounded-full"></span>
              {t("footer.contactUs") || "Contact Us"}
            </h4>
            <ul className="space-y-6">
              <li>
                <div className="group flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#FD9A00]/10 flex items-center justify-center shrink-0 group-hover:bg-[#FD9A00] transition-colors duration-300">
                    <IoCallOutline className="text-[#FD9A00] text-lg group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className={`text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ${bengaliClass}`}>{t("footer.phone") || "Phone"}</p>
                    <a href="tel:+8801711946614" className="text-gray-800 dark:text-white font-poppins font-bold text-lg hover:text-[#FD9A00] transition-colors">+880 1711-946614</a>
                  </div>
                </div>
              </li>
              <li>
                <div className="group flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#FD9A00]/10 flex items-center justify-center shrink-0 group-hover:bg-[#FD9A00] transition-colors duration-300">
                    <IoMailOutline className="text-[#FD9A00] text-lg group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className={`text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ${bengaliClass}`}>{t("footer.email") || "Email"}</p>
                    <a href="mailto:info.extrainweb@gmail.com" className="text-gray-700 dark:text-gray-300 text-sm font-medium hover:text-[#FD9A00] transition-colors">info.extrainweb@gmail.com</a>
                  </div>
                </div>
              </li>
              <li>
                <div className="group flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#FD9A00]/10 flex items-center justify-center shrink-0 group-hover:bg-[#FD9A00] transition-colors duration-300">
                    <IoLocationOutline className="text-[#FD9A00] text-lg group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className={`text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ${bengaliClass}`}>{t("footer.address") || "Address"}</p>
                    <p className={`text-gray-700 dark:text-gray-300 text-sm leading-relaxed ${bengaliClass}`}>
                      {t("footer.addressValue") || "Road - 11, DIT Project, Marul Badda, Badda, Dhaka -1214"}
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-gray-200 dark:border-gray-700/50 bg-white/50 dark:bg-[#0F172A]/80">
        <div className="container mx-auto px-4 lg:px-16 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className={`text-gray-500 dark:text-gray-400 text-sm font-medium text-center md:text-left ${bengaliClass}`}>
              {t("footer.copyright")}
            </p>
            <div className="flex items-center gap-6">
              <span className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-widest">
                {t("footer.tradeLicense")}
              </span>
              <span className={`text-gray-500 dark:text-gray-400 text-sm font-medium flex items-center gap-1 ${bengaliClass}`}>
                {t("footer.madeWith")} <LuHeart className="text-red-500 text-xs" /> {t("footer.inBangladesh")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
