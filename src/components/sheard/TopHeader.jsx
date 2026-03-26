"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { LuMail, LuPhone, LuMapPin } from "react-icons/lu";
import { FaFacebookF, FaLinkedinIn, FaYoutube, FaWhatsapp } from "react-icons/fa";

const TopHeader = () => {
  const [isDark, setIsDark] = useState(false);
  const { language } = useLanguage();
  const [topCoupon, setTopCoupon] = useState(null);

  const bengaliClass = language === "bn" ? "hind-siliguri" : "";

  useEffect(() => {
    const checkDarkMode = () => {
      try {
        if (typeof window !== 'undefined') {
          const savedTheme = localStorage.getItem("theme");
          setIsDark(savedTheme === "dark" || document.documentElement.classList.contains("dark"));
        }
      } catch (error) {
        setIsDark(document.documentElement.classList.contains("dark"));
      }
    };

    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    const fetchTopCoupon = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL || 'https://motionboss-backend.vercel.app/api'}/coupons/top-header`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.success && data.data) {
          setTopCoupon(data.data);
        }
      } catch (error) {
        console.error("Error fetching top header coupon:", error);
      }
    };
    fetchTopCoupon();

    return () => observer.disconnect();
  }, []);

  return (
    <div className={`w-full font-poppins transition-all duration-300 ${isDark
      ? 'bg-gray-900 border-b border-gray-800'
      : 'bg-gray-900'
      }`}>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-9">

          {/* Left - Contact Info */}
          <div className="hidden lg:flex items-center gap-4 text-[13px]">
            <a
              href="mailto:info.extrainweb@gmail.com"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <LuMail className="w-3.5 h-3.5" />
              <span>info.extrainweb@gmail.com</span>
            </a>

            <span className="text-gray-700">|</span>

            <a
              href="tel:+8801711946614"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <LuPhone className="w-3.5 h-3.5" />
              <span>+880 1711-946614</span>
            </a>
          </div>

          {/* Center - Announcement */}
          <div className="flex items-center justify-center flex-1 lg:flex-none">
            <span className={`text-[13px] text-gray-400 ${bengaliClass}`}>
              {topCoupon ? (
                topCoupon.topHeaderMessage || (
                  language === 'bn'
                    ? <>কোড ব্যবহার করুন: <span className="text-[#FD9A00] font-semibold">{topCoupon.code}</span></>
                    : <>Use Code: <span className="text-[#FD9A00] font-semibold">{topCoupon.code}</span></>
                )
              ) : (
                language === 'bn'
                  ? <>প্রিমিয়াম টেমপ্লেটে <span className="text-white font-medium">৩০% ছাড়</span> — কোড: <span className="text-[#FD9A00] font-semibold">EXTRA30</span></>
                  : <>Get <span className="text-white font-medium">30% OFF</span> on Premium Templates — Code: <span className="text-[#FD9A00] font-semibold">EXTRA30</span></>
              )}
            </span>
          </div>

          {/* Right - Social Links */}
          <div className="hidden md:flex items-center gap-3">
            {[
              { Icon: FaFacebookF, href: "https://facebook.com/extrainweb" },
              { Icon: FaLinkedinIn, href: "https://linkedin.com/company/extrainweb" },
              { Icon: FaYoutube, href: "https://youtube.com/@extrainweb" },
              { Icon: FaWhatsapp, href: "https://wa.me/8801711946614" },
            ].map(({ Icon, href }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-white transition-colors"
              >
                <Icon className="w-3.5 h-3.5" />
              </a>
            ))}

            <span className="text-gray-700 ml-1">|</span>

            <div className="flex items-center gap-1.5 text-gray-400 text-[13px]">
              <LuMapPin className="w-3.5 h-3.5" />
              <span>Bangladesh</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;
