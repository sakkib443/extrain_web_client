/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import React, { useState } from "react";
import { FaFacebook, FaLinkedin, FaYoutube, FaInstagram } from "react-icons/fa";
import { IoCallOutline, IoLocationOutline, IoMailOutline } from "react-icons/io5";
import { LuSend, LuHeart } from "react-icons/lu";
import { useLanguage } from "@/context/LanguageContext";
import PaymentMethods from "@/components/sheard/PaymentMethods";
import { EdgeDots } from "@/components/Home/Decor";

const Footer = () => {
  const [email, setEmail] = useState("");
  const { t, language } = useLanguage();

  // Apply Bengali font class when language is Bengali
  const bengaliClass = language === "bn" ? "hind-siliguri" : "";
  // Bengali conjuncts break when letter-spacing is applied, so only English headings are tracked out
  const headTracking = language === "bn" ? "tracking-normal" : "tracking-[0.14em]";

  const quickLinks = [
    { to: "/", label: language === "bn" ? "হোম" : "Home" },
    { to: "/confirm-order", label: language === "bn" ? "অর্ডার করুন" : "Place Order" },
    { to: "/website", label: language === "bn" ? "টেমপ্লেট" : "Templates" },
    { to: "/blog", label: language === "bn" ? "ব্লগ" : "Blog" },
    { to: "/about", label: language === "bn" ? "আমাদের সম্পর্কে" : "About Us" },
    { to: "/contact", label: language === "bn" ? "যোগাযোগ" : "Contact" },
  ];

  const socialLinks = [
    { icon: FaFacebook, href: "https://www.facebook.com/Extrain Web", label: "Facebook" },
    { icon: FaLinkedin, href: "https://www.linkedin.com/company/Extrain Web/", label: "LinkedIn" },
    { icon: FaYoutube, href: "https://www.youtube.com/@Extrain Web", label: "YouTube" },
    { icon: FaInstagram, href: "https://www.instagram.com/Extrain Web/", label: "Instagram" },
  ];

  // Column heading (a plain function, not a component, so typing in the newsletter box never remounts it): orange bar + small bold caps. (Inline colour: the global `h4 { color }` rule beats Tailwind's text-white.)
  const heading = (children) => (
    <h4
      style={{ color: "#fff" }}
      className={`mb-6 flex items-center gap-2.5 text-[15px] font-bold uppercase ${headTracking} ${bengaliClass}`}
    >
      <span className="h-6 w-1.5 rounded-full bg-[#F8921C]" />
      {children}
    </h4>
  );

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[color:var(--tone-deep)] text-white">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <EdgeDots />
        <div className="absolute -top-24 left-[8%] h-72 w-72 rounded-full bg-[#F8921C]/[0.07] blur-3xl" />
        <div className="absolute -bottom-24 right-[8%] h-80 w-80 rounded-full bg-[#F8921C]/[0.05] blur-3xl" />
      </div>

      {/* Main Footer Content */}
      <div className="relative container mx-auto px-6 py-14 lg:px-10 lg:py-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5 lg:gap-8">

          {/* Brand Section */}
          <div className="space-y-5 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5" aria-label="Extrain Web home">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#F8921C] text-xl font-extrabold text-black">A</span>
              <span className="text-[1.7rem] font-extrabold tracking-tight text-white">Extrain</span>
            </Link>
            <p className={`max-w-sm text-sm leading-relaxed text-white/60 ${bengaliClass}`}>
              {t("footer.brandDescription") || "Extrain Web is a premium website and software marketplace in Bangladesh, providing high-quality digital products and custom development services."}
            </p>

            {/* Newsletter */}
            <div className="pt-4">
              <h4
                style={{ color: "#fff" }}
                className={`mb-3 text-[15px] font-bold uppercase ${headTracking} ${bengaliClass}`}
              >
                {t("footer.subscribeNewsletter") || "Subscribe to Newsletter"}
              </h4>
              <div className="flex max-w-md">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("footer.enterEmail") || "Enter your email"}
                  className={`min-w-0 flex-1 rounded-l-full border border-white/10 bg-white/[0.05] px-5 py-3 text-sm text-white placeholder:text-white/40 transition-colors focus:border-[#F8921C] focus:outline-none ${bengaliClass}`}
                />
                <button
                  type="button"
                  aria-label="Subscribe"
                  className="rounded-r-full bg-[#F8921C] px-6 py-3 font-bold text-black transition-colors hover:bg-[#e07d0a]"
                >
                  <LuSend className="text-xl" />
                </button>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-4 flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#F8921C] hover:bg-[#F8921C] hover:text-black"
                  title={social.label}
                >
                  <social.icon size={17} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            {heading(t("footer.quickLinks") || "Quick Links")}
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.to}
                    className={`group inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-[#F8921C] ${bengaliClass}`}
                  >
                    <span className="h-px w-0 bg-[#F8921C] transition-all duration-300 group-hover:w-3" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Payment Methods — ক্লায়েন্ট এখান থেকে টাকা পাঠাতে পারবে */}
          <PaymentMethods variant="footer" />

          {/* Contact Info */}
          <div>
            {heading(t("footer.contactUs") || "Contact Us")}
            <ul className="space-y-6">
              <li>
                <div className="group flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F8921C]/10 transition-colors duration-300 group-hover:bg-[#F8921C]">
                    <IoCallOutline className="text-lg text-[#F8921C] transition-colors group-hover:text-black" />
                  </div>
                  <div>
                    <p className={`mb-1 text-xs font-bold uppercase text-white/40 ${language === "bn" ? "tracking-normal" : "tracking-widest"} ${bengaliClass}`}>{t("footer.phone") || "Phone"}</p>
                    <a href="tel:+8801711946614" className="text-lg font-bold text-white transition-colors hover:text-[#F8921C]">+880 1711-946614</a>
                  </div>
                </div>
              </li>
              <li>
                <div className="group flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F8921C]/10 transition-colors duration-300 group-hover:bg-[#F8921C]">
                    <IoMailOutline className="text-lg text-[#F8921C] transition-colors group-hover:text-black" />
                  </div>
                  <div>
                    <p className={`mb-1 text-xs font-bold uppercase text-white/40 ${language === "bn" ? "tracking-normal" : "tracking-widest"} ${bengaliClass}`}>{t("footer.email") || "Email"}</p>
                    <a href="mailto:info.extrainweb@gmail.com" className="text-sm font-medium text-white/75 transition-colors hover:text-[#F8921C]">info.extrainweb@gmail.com</a>
                  </div>
                </div>
              </li>
              <li>
                <div className="group flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F8921C]/10 transition-colors duration-300 group-hover:bg-[#F8921C]">
                    <IoLocationOutline className="text-lg text-[#F8921C] transition-colors group-hover:text-black" />
                  </div>
                  <div>
                    <p className={`mb-1 text-xs font-bold uppercase text-white/40 ${language === "bn" ? "tracking-normal" : "tracking-widest"} ${bengaliClass}`}>{t("footer.address") || "Address"}</p>
                    <p className={`text-sm leading-relaxed text-white/75 ${bengaliClass}`}>
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
      <div className="relative border-t border-white/10 bg-black/25">
        <div className="container mx-auto px-6 py-6 lg:px-10">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className={`text-center text-sm text-white/50 md:text-left ${bengaliClass}`}>
              {t("footer.copyright")}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <span className={`text-xs font-bold uppercase text-white/35 ${language === "bn" ? "tracking-normal" : "tracking-widest"}`}>
                {t("footer.tradeLicense")}
              </span>
              <span className={`flex items-center gap-1 text-sm text-white/50 ${bengaliClass}`}>
                {t("footer.madeWith")} <LuHeart className="text-xs text-red-500" /> {t("footer.inBangladesh")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
