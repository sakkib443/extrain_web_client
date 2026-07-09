"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LuMail, LuPhone, LuMapPin, LuSend, LuClock, LuArrowRight, LuMessageCircle, LuCheck } from "react-icons/lu";
import { FaFacebookF, FaYoutube, FaLinkedinIn, FaWhatsapp, FaInstagram } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://extrain-web-server.vercel.app/api';

export default function ContactContent() {
    const { t, language } = useLanguage();
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";
    const [isVisible, setIsVisible] = useState(false);
    const [loading, setLoading] = useState(true);

    const [messageSent, setMessageSent] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    // Dynamic content from API
    const [content, setContent] = useState({
        hero: {
            badge: 'Get In Touch',
            badgeBn: 'যোগাযোগ করুন',
            title1: "Let's ",
            title1Bn: 'আমাদের সাথে ',
            title2: 'Connect',
            title2Bn: 'যোগাযোগ করুন',
            subtitle: 'Have questions? We would love to hear from you. Send us a message and we will respond as soon as possible.',
            subtitleBn: 'কোনো প্রশ্ন আছে? আমাদের মেসেজ পাঠান, আমরা যত তাড়াতাড়ি সম্ভব উত্তর দেব।'
        },
        contactInfo: {
            email: 'info.extrainweb@gmail.com',
            phone: '+88 01711946614',
            address: 'Road - 11, DIT Project, Marul Badda, Badda, Dhaka -1214, Bangladesh',
            addressBn: 'রোড - ১১, ডিআইটি প্রজেক্ট, মারুল বাড্ডা, বাড্ডা, ঢাকা -১২১৪, বাংলাদেশ',
            officeHours: 'Sat - Thu: 10:00 AM - 6:00 PM',
            officeHoursBn: 'শনি - বৃহস্পতি: সকাল ১০টা - সন্ধ্যা ৬টা'
        },
        socialLinks: {
            facebook: 'https://www.facebook.com/Extrain Web',
            youtube: 'https://www.youtube.com/@Extrain Web',
            linkedin: 'https://www.linkedin.com/company/Extrain Web',
            whatsapp: 'https://wa.me/8801711946614',
            instagram: 'https://www.instagram.com/Extrain Web/'
        },
        whatsappSection: {
            title: 'Need Quick Help?',
            titleBn: 'দ্রুত সাহায্য দরকার?',
            description: 'Chat with us on WhatsApp for instant support and answers to your questions.',
            descriptionBn: 'তাৎক্ষণিক সাপোর্টের জন্য হোয়াটসঅ্যাপে আমাদের সাথে চ্যাট করুন।',
            buttonText: 'Chat on WhatsApp',
            buttonTextBn: 'হোয়াটসঅ্যাপে চ্যাট করুন'
        },
        mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.5!2d90.4261!3d23.7808!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7d9c3b3b3b3%3A0x0!2sMarul%20Badda%2C%20Badda%2C%20Dhaka!5e0!3m2!1sen!2sbd'
    });

    // Fetch dynamic content
    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await fetch(`${API_URL}/design/contact`);
                const data = await res.json();
                if (data.success && data.data?.contactContent) {
                    setContent(data.data.contactContent);
                }
            } catch (error) {
                console.error('Error fetching contact content:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessageSent(true);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    // Dynamic contact info cards
    const contactInfoCards = [
        {
            icon: LuMail,
            title: language === "bn" ? "ইমেইল করুন" : "Email Us",
            value: content.contactInfo.email,
            link: `mailto:${content.contactInfo.email}`,
        },
        {
            icon: LuPhone,
            title: language === "bn" ? "কল করুন" : "Call Us",
            value: content.contactInfo.phone,
            link: `tel:${content.contactInfo.phone.replace(/\s/g, '')}`,
        },
        {
            icon: LuMapPin,
            title: language === "bn" ? "আমাদের ঠিকানা" : "Visit Us",
            value: language === "bn" ? content.contactInfo.addressBn : content.contactInfo.address,
            link: "#map",
        },
        {
            icon: LuClock,
            title: language === "bn" ? "অফিস আওয়ার" : "Office Hours",
            value: language === "bn" ? content.contactInfo.officeHoursBn : content.contactInfo.officeHours,
            link: null,
        },
    ];

    const socialLinks = [
        { icon: FaFacebookF, href: content.socialLinks.facebook, label: "Facebook" },
        { icon: FaYoutube, href: content.socialLinks.youtube, label: "YouTube" },
        { icon: FaLinkedinIn, href: content.socialLinks.linkedin, label: "LinkedIn" },
        { icon: FaWhatsapp, href: content.socialLinks.whatsapp, label: "WhatsApp" },
        { icon: FaInstagram, href: content.socialLinks.instagram, label: "Instagram" },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300 relative selection:bg-[#FD9A00] selection:text-black">
            {/* Unified Filtered Background - Spans entire page */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
                    style={{ backgroundImage: 'linear-gradient(#000 0.5px, transparent 0.5px), linear-gradient(90deg, #000 0.5px, transparent 0.5px)', backgroundSize: '40px 40px' }}
                />
            </div>

            {/* Ambient Animated Blobs */}
            <motion.div
                animate={{ x: [0, 50, 0], y: [0, 30, 0], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="fixed top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#FD9A00]/5 rounded-full blur-[120px] pointer-events-none z-0"
            />
            <motion.div
                animate={{ x: [0, -30, 0], y: [0, -50, 0], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear", delay: 2 }}
                className="fixed bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#FD9A00]/5 rounded-full blur-[100px] pointer-events-none z-0"
            />


            {/* Success Modal */}
            {messageSent && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
                        onClick={() => setMessageSent(false)}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] w-11/12 max-w-md bg-white dark:bg-[#0a0a0a] rounded-3xl shadow-2xl p-8 text-center border border-gray-100 dark:border-white/10"
                    >
                        <div className="w-20 h-20 bg-[#FD9A00]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <LuCheck className="text-[#FD9A00] text-3xl" />
                        </div>
                        <h3 className={`text-2xl font-black font-poppins uppercase text-gray-900 dark:text-white mb-3 ${bengaliClass}`}>{t("contactPage.messageSent")}</h3>
                        <p className={`text-gray-500 dark:text-gray-400 mb-8 ${bengaliClass}`}>{t("contactPage.messageResponse")}</p>
                        <button
                            onClick={() => setMessageSent(false)}
                            className={`px-8 py-3 bg-[#FD9A00] hover:bg-[#e68a00] text-white font-bold font-poppins uppercase text-xl rounded-xl transition-all shadow-lg shadow-[#FD9A00]/20 ${bengaliClass}`}
                        >
                            {t("contactPage.close")}
                        </button>
                    </motion.div>
                </>
            )}

            <div className="relative z-10 pt-24 lg:pt-32 pb-20 container mx-auto px-4 lg:px-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">

                    {/* Left Side: Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-[2px] bg-[#FD9A00]" />
                            <span className={`text-[12px] font-black text-[#FD9A00] uppercase tracking-[0.3em] ${bengaliClass}`}>
                                {language === "bn" ? content.hero.badgeBn : content.hero.badge}
                            </span>
                        </div>

                        <h1 className={`text-5xl lg:text-7xl font-black text-gray-900 dark:text-white mb-6 uppercase leading-[0.85] tracking-tighter font-poppins ${bengaliClass}`}>
                            {language === "bn" ? "যোগাযোগ " : "Let's "}<span className="text-[#FD9A00]">{language === "bn" ? "করুন" : "Connect"}</span>
                        </h1>

                        <p className={`text-gray-500 dark:text-gray-400 text-lg mb-10 leading-relaxed ${bengaliClass}`}>
                            {language === "bn" ? content.hero.subtitleBn : content.hero.subtitle}
                        </p>

                        <div className="space-y-6">
                            {contactInfoCards.map((item, idx) => (
                                <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:border-[#FD9A00]/30 transition-all duration-300 group">
                                    <div className="w-12 h-12 rounded-lg bg-white dark:bg-white/5 flex items-center justify-center text-[#FD9A00] shadow-sm group-hover:scale-110 transition-transform">
                                        <item.icon size={20} />
                                    </div>
                                    <div>
                                        <h3 className={`text-sm font-bold text-gray-400 uppercase tracking-wider mb-1 font-poppins ${bengaliClass}`}>{item.title}</h3>
                                        {item.link ? (
                                            <a href={item.link} className={`text-lg font-normal text-gray-900 dark:text-white hover:text-[#FD9A00] transition-colors ${bengaliClass}`}>{item.value}</a>
                                        ) : (
                                            <p className={`text-lg font-normal text-gray-900 dark:text-white ${bengaliClass}`}>{item.value}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Social Links */}
                        <div className="mt-10">
                            <h3 className={`text-xl font-black font-poppins uppercase text-gray-900 dark:text-white mb-4 ${bengaliClass}`}>{t("contactPage.followUs")}</h3>
                            <div className="flex gap-3">
                                {socialLinks.map((item, idx) => (
                                    <a
                                        key={idx}
                                        href={item.href}
                                        target="_blank"
                                        className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-500 hover:bg-[#FD9A00] hover:text-white transition-all duration-300"
                                    >
                                        <item.icon size={20} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Side: Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="bg-gray-50 dark:bg-white/5 p-8 lg:p-10 rounded-3xl border border-gray-100 dark:border-white/5"
                    >
                        <h2 className={`text-3xl font-black font-poppins uppercase text-gray-900 dark:text-white mb-8 ${bengaliClass}`}>
                            {t("contactPage.sendMessage")}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className={`text-xs font-bold uppercase tracking-wider text-gray-400 ${bengaliClass}`}>{t("contactPage.yourName")}</label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`w-full bg-white dark:bg-black/20 border-0 rounded-xl p-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#FD9A00]/50 placeholder-gray-300 transition-all font-medium ${bengaliClass}`}
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className={`text-xs font-bold uppercase tracking-wider text-gray-400 ${bengaliClass}`}>{t("contactPage.emailAddress")}</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`w-full bg-white dark:bg-black/20 border-0 rounded-xl p-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#FD9A00]/50 placeholder-gray-300 transition-all font-medium ${bengaliClass}`}
                                        placeholder="hello@example.com"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className={`text-xs font-bold uppercase tracking-wider text-gray-400 ${bengaliClass}`}>{t("contactPage.subject")}</label>
                                <input
                                    type="text"
                                    id="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className={`w-full bg-white dark:bg-black/20 border-0 rounded-xl p-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#FD9A00]/50 placeholder-gray-300 transition-all font-medium ${bengaliClass}`}
                                    placeholder="Project Enquiry"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className={`text-xs font-bold uppercase tracking-wider text-gray-400 ${bengaliClass}`}>{t("contactPage.message")}</label>
                                <textarea
                                    id="message"
                                    rows="5"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className={`w-full bg-white dark:bg-black/20 border-0 rounded-xl p-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#FD9A00]/50 placeholder-gray-300 transition-all font-medium resize-none ${bengaliClass}`}
                                    placeholder="Tell us about your project..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className={`w-full py-4 bg-[#FD9A00] hover:bg-[#e68a00] text-white font-bold font-poppins uppercase text-xl rounded-xl transition-all shadow-lg shadow-[#FD9A00]/20 flex items-center justify-center gap-2 group ${bengaliClass}`}
                            >
                                <span>{t("contactPage.send")}</span>
                                <LuSend className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>
                    </motion.div>
                </div>

                {/* Map Section */}
                <section className="mt-20">
                    <div className="rounded-3xl overflow-hidden border border-gray-100 dark:border-white/10 h-[400px] relative grayscale hover:grayscale-0 transition-all duration-700">
                        <iframe
                            src={content.mapEmbedUrl}
                            width="100%"
                            height="100%"
                            className="border-0"
                            allowFullScreen
                            loading="lazy"
                            title="Office Location"
                        />
                    </div>
                </section>

            </div>
        </div>
    );
}
