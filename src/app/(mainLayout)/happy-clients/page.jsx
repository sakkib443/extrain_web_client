"use client";

import React, { useEffect, useState } from "react";
import { HiXMark } from "react-icons/hi2";
import { LuPlay, LuUsers, LuHeart, LuStar, LuArrowRight, LuQuote, LuThumbsUp } from "react-icons/lu";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { API_BASE_URL } from "@/config/api";

const HappyClientsPage = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const bengaliClass = language === "bn" ? "hind-siliguri" : "";

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/testimonials/public`);
      const data = await res.json();
      if (data.success) {
        setTestimonials(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  const filters = [
    { key: "all", label: language === "bn" ? "সব দেখুন" : "View All" },
    { key: "testimonial", label: language === "bn" ? "ক্লায়েন্ট টেস্টিমোনিয়াল" : "Client Testimonials" },
    { key: "review", label: language === "bn" ? "প্রোডাক্ট রিভিউ" : "Product Reviews" },
  ];

  const filteredTestimonials = activeFilter === "all"
    ? testimonials
    : testimonials.filter(t => t.type === activeFilter);

  const totalClients = testimonials.length;
  const avgRating = testimonials.length > 0
    ? (testimonials.reduce((sum, t) => sum + (t.rating || 5), 0) / testimonials.length).toFixed(1)
    : "5.0";

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300 relative selection:bg-[#FD9A00] selection:text-black">
      {/* Unified Filtered Background - Spans entire page */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{ backgroundImage: 'linear-gradient(#000 0.5px, transparent 0.5px), linear-gradient(90deg, #000 0.5px, transparent 0.5px)', backgroundSize: '40px 40px' }}
        />
      </div>

      {/* Ambient Animated Blobs - Orange Theme */}
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

      {/* Main Content Container */}
      <div className="relative z-10">
        {/* Hero Header Section - Left Aligned */}
        <section className="relative overflow-hidden pt-20 pb-6 lg:pt-24 lg:pb-8">
          <div className="container mx-auto px-4 lg:px-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl"
            >
              {/* Modern Left Header */}
              <div className="flex items-center gap-3 mb-6">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: 40 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="h-[2px] bg-[#FD9A00]"
                />
                <span className={`text-[10px] font-black text-[#FD9A00] uppercase tracking-[0.4em] ${bengaliClass}`}>
                  {language === 'bn' ? 'সন্তুষ্ট ক্লায়েন্ট' : 'Happy Clients'}
                </span>
              </div>

              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className={`text-5xl lg:text-7xl font-black text-gray-950 dark:text-white mb-6 uppercase leading-[0.85] tracking-tighter font-poppins ${bengaliClass}`}
              >
                {language === 'bn' ? 'আমাদের সন্তুষ্ট' : 'Our Happy '}<span className="text-[#FD9A00]">{language === 'bn' ? 'ক্লায়েন্ট' : 'Clients'}</span>
              </motion.h1>

              <p className={`text-gray-500 dark:text-gray-400 text-sm lg:text-base max-w-2xl leading-relaxed mb-10 ${bengaliClass}`}>
                {language === 'bn'
                  ? 'দেখুন কিভাবে আমাদের ক্লায়েন্টরা তাদের ব্যবসার ডিজিটাল সাফল্য অর্জন করছে। তাদের অভিজ্ঞতা এবং রিভিউ থেকে অনুপ্রাণিত হন।'
                  : 'See how our clients are achieving digital success for their businesses. Get inspired by their experiences and reviews.'}
              </p>

              {/* Stats - Left Aligned & Modern */}
              <div className="flex flex-wrap items-center gap-12">
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-gray-50 dark:bg-white/5 rounded-md flex items-center justify-center border border-gray-100 dark:border-white/10 group-hover:border-[#FD9A00] transition-colors">
                    <LuUsers className="text-gray-400 group-hover:text-[#FD9A00] transition-colors text-xl" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-gray-900 dark:text-white font-poppins leading-none mb-1">{totalClients}+</p>
                    <p className={`text-[11px] font-bold text-gray-400 uppercase tracking-widest ${bengaliClass}`}>{language === 'bn' ? 'সন্তুষ্ট ক্লায়েন্ট' : 'Happy Clients'}</p>
                  </div>
                </div>

                <div className="w-px h-12 bg-gray-200 dark:bg-white/10 hidden sm:block"></div>

                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-gray-50 dark:bg-white/5 rounded-md flex items-center justify-center border border-gray-100 dark:border-white/10 group-hover:border-[#FD9A00] transition-colors">
                    <LuThumbsUp className="text-gray-400 group-hover:text-[#FD9A00] transition-colors text-xl" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-gray-900 dark:text-white font-poppins leading-none mb-1">98%</p>
                    <p className={`text-[11px] font-bold text-gray-400 uppercase tracking-widest ${bengaliClass}`}>{language === 'bn' ? 'সন্তুষ্টির হার' : 'Satisfaction'}</p>
                  </div>
                </div>

                <div className="w-px h-12 bg-gray-200 dark:bg-white/10 hidden sm:block"></div>

                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-gray-50 dark:bg-white/5 rounded-md flex items-center justify-center border border-gray-100 dark:border-white/10 group-hover:border-[#FD9A00] transition-colors">
                    <LuStar className="text-gray-400 group-hover:text-[#FD9A00] transition-colors text-xl" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-gray-900 dark:text-white font-poppins leading-none mb-1">{avgRating}/5</p>
                    <p className={`text-[11px] font-bold text-gray-400 uppercase tracking-widest ${bengaliClass}`}>{language === 'bn' ? 'রেটিং' : 'Rating'}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main Content Area */}
        <section className="container mx-auto px-4 lg:px-16 pb-20">
          {/* Filter Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-wrap gap-3 mb-10"
          >
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-6 py-3 rounded-md font-bold text-xs uppercase tracking-widest transition-all duration-300 ${bengaliClass} ${activeFilter === filter.key
                  ? "bg-[#FD9A00] text-black"
                  : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 hover:border-[#FD9A00] hover:text-[#FD9A00]"
                  }`}
              >
                {filter.label}
              </button>
            ))}
          </motion.div>

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-[#FD9A00]/30 border-t-[#FD9A00] rounded-full animate-spin"></div>
            </div>
          ) : filteredTestimonials.length === 0 ? (
            <div className="text-center py-20">
              <LuHeart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className={`text-xl font-bold text-gray-900 dark:text-white mb-2 ${bengaliClass}`}>
                {language === 'bn' ? 'কোন টেস্টিমোনিয়াল নেই' : 'No testimonials yet'}
              </h3>
              <p className={`text-gray-500 dark:text-gray-400 ${bengaliClass}`}>
                {language === 'bn' ? 'শীঘ্রই আমাদের ক্লায়েন্টদের অভিজ্ঞতা দেখতে পাবেন।' : 'Check back soon for client testimonials.'}
              </p>
            </div>
          ) : (
            /* Video Grid */
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredTestimonials.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  onClick={() => setSelectedVideo(item)}
                  className="group cursor-pointer"
                >
                  <div className="relative rounded-md overflow-hidden bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-[#FD9A00] transition-all duration-300 hover:-translate-y-1">
                    {/* Video Thumbnail */}
                    <div className="relative aspect-video">
                      <img
                        src={`https://img.youtube.com/vi/${item.videoId}/maxresdefault.jpg`}
                        alt={language === 'bn' ? (item.titleBn || item.title) : item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                      {/* Play Button */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-md flex items-center justify-center transform scale-90 group-hover:scale-100 transition-all duration-300 group-hover:bg-[#FD9A00]">
                          <LuPlay className="w-6 h-6 text-[#FD9A00] group-hover:text-black ml-1" />
                        </div>
                      </div>

                      {/* Badge */}
                      <div className={`absolute top-3 left-3 px-3 py-1.5 bg-[#FD9A00] text-black text-[10px] font-black uppercase tracking-wider rounded-sm ${bengaliClass}`}>
                        {item.type === "testimonial"
                          ? (language === "bn" ? "টেস্টিমোনিয়াল" : "Testimonial")
                          : (language === "bn" ? "রিভিউ" : "Review")}
                      </div>

                      {/* Rating */}
                      {item.rating && (
                        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-sm">
                          <LuStar className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span className="text-white text-xs font-bold">{item.rating}</span>
                        </div>
                      )}

                      {/* Quote Icon */}
                      <div className="absolute bottom-16 right-3">
                        <LuQuote className="w-5 h-5 text-white/40" />
                      </div>

                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className={`text-white font-bold font-poppins text-lg uppercase mb-2 line-clamp-2 ${bengaliClass}`}>
                          {language === 'bn' ? (item.titleBn || item.title) : item.title}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-[#FD9A00] rounded-sm flex items-center justify-center">
                            <span className="text-black font-bold text-xs">
                              {(language === 'bn' ? (item.clientNameBn || item.clientName) : item.clientName).charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="text-white/90 text-xs font-medium">
                              {language === 'bn' ? (item.clientNameBn || item.clientName) : item.clientName}
                            </p>
                            <p className="text-white/50 text-[10px]">
                              {language === 'bn' ? (item.companyNameBn || item.companyName) : item.companyName}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-16"
          >
            <div className="bg-gray-50 dark:bg-white/5 rounded-md p-8 lg:p-12 border border-gray-200 dark:border-white/10 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-[#FD9A00]/10 rounded-md flex items-center justify-center">
                  <LuHeart className="w-8 h-8 text-[#FD9A00]" />
                </div>
                <div>
                  <h3 className={`text-2xl lg:text-3xl font-black font-poppins uppercase text-gray-900 dark:text-white mb-2 ${bengaliClass}`}>
                    {language === "bn" ? "আপনিও হতে পারেন আমাদের সন্তুষ্ট ক্লায়েন্ট!" : "You Could Be Our Next Happy Client!"}
                  </h3>
                  <p className={`text-gray-500 dark:text-gray-400 text-sm ${bengaliClass}`}>
                    {language === "bn"
                      ? "আজই আমাদের প্রিমিয়াম প্রোডাক্ট দেখুন।"
                      : "Explore our premium products today."}
                  </p>
                </div>
              </div>
              <Link
                href="/website"
                className={`inline-flex items-center gap-3 px-8 py-4 bg-[#FD9A00] text-black rounded-md font-bold text-xs uppercase tracking-widest hover:bg-[#FD9A00]/90 transition-all duration-300 group whitespace-nowrap ${bengaliClass}`}
              >
                <span>{language === "bn" ? "প্রোডাক্ট দেখুন" : "Explore Products"}</span>
                <LuArrowRight className="transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </section>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-md flex justify-center items-center z-50 p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-14 right-0 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-md flex items-center justify-center text-white transition-colors"
            >
              <HiXMark className="w-6 h-6" />
            </button>

            {/* Video */}
            <div className="relative rounded-md overflow-hidden bg-black">
              <div className="aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1`}
                  title={selectedVideo.title}
                  frameBorder="0"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>

            {/* Video Info */}
            <div className="mt-4 text-left">
              <p className={`text-white font-bold font-poppins text-xl uppercase ${bengaliClass}`}>
                {language === 'bn' ? (selectedVideo.titleBn || selectedVideo.title) : selectedVideo.title}
              </p>
              <p className="text-white/60 text-sm">
                {language === 'bn' ? (selectedVideo.clientNameBn || selectedVideo.clientName) : selectedVideo.clientName} — {language === 'bn' ? (selectedVideo.companyNameBn || selectedVideo.companyName) : selectedVideo.companyName}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default HappyClientsPage;
