"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchWebsites, toggleWebsiteLike } from "@/redux/websiteSlice";
import { useLanguage } from "@/context/LanguageContext";
import { addToCart } from "@/redux/cartSlice";
import {
    LuDownload, LuExternalLink, LuClock, LuLayoutGrid, LuEye, LuPackage, LuShieldCheck, LuSettings,
    LuFileCode, LuCheck, LuSparkles, LuZap, LuX, LuChevronLeft, LuChevronRight, LuShoppingCart,
    LuArrowUpRight, LuMonitorSmartphone, LuLayers, LuPlay,
} from "react-icons/lu";
import { FaHeart, FaRegHeart, FaStar, FaWhatsapp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import ReviewsSection from "@/components/Reviews/ReviewsSection";
import { EdgeDots } from "@/components/Home/Decor";
import { reveal } from "@/components/Aboutpage/sections/shared";

// Black theme, same look as the website listing page.
//   top (deep):    breadcrumb · gallery (main image + thumbnails) | purchase panel (sticky)
//   bottom (soft): tabs (overview / features / technical / reviews) | similar websites

const EASE = [0.16, 1, 0.3, 1];

const fmtCount = (n = 0) => (n >= 1000 ? (n / 1000).toFixed(1) + "K" : n.toLocaleString());
const slugOf = (item) =>
    item.slug || item.title?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || item._id;

export default function WebsiteDetailsContent({ initialWebsite }) {
    const router = useRouter();
    const dispatch = useDispatch();
    const { websiteList = [] } = useSelector((state) => state.websites || {});
    const { language } = useLanguage();
    const isBn = language === "bn";
    const bn = isBn ? "hind-siliguri" : "";

    const [website, setWebsite] = useState(initialWebsite); // local copy so likes update instantly
    const [activeTab, setActiveTab] = useState("overview");
    const [activeImg, setActiveImg] = useState(0);
    const [lightbox, setLightbox] = useState(null); // index of the image open full-screen
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [isLiking, setIsLiking] = useState(false);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        if (initialWebsite) {
            setWebsite(initialWebsite);
            dispatch(fetchWebsites());
        }
    }, [initialWebsite, dispatch]);

    const similar = website?._id ? websiteList.filter((w) => w._id !== website._id).slice(0, 4) : [];

    // lightbox keys: ← → Esc
    useEffect(() => {
        if (lightbox === null) return;
        const n = website?.images?.length || 0;
        const onKey = (e) => {
            if (e.key === "Escape") setLightbox(null);
            if (e.key === "ArrowRight") setLightbox((i) => (i + 1) % n);
            if (e.key === "ArrowLeft") setLightbox((i) => (i - 1 + n) % n);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [lightbox, website?.images?.length]);

    const handleAddToCart = () => {
        if (!website) return;
        dispatch(addToCart({
            id: website._id,
            title: website.title,
            price: website.offerPrice || website.price,
            image: website.images?.[0] || website.image || "/images/placeholder.png",
            type: "website",
            productType: "website",
            isBookingAllowed: website.isBookingAllowed,
            bookingAmount: website.bookingAmount,
        }));
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    const handleBuyNow = () => {
        handleAddToCart();
        router.push("/cart");
    };

    const handleToggleLike = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please login to like this website");
            router.push("/login");
            return;
        }
        if (isLiking) return;
        setIsLiking(true);
        try {
            const result = await dispatch(toggleWebsiteLike(website._id)).unwrap();
            setWebsite((prev) => ({ ...prev, isLiked: result.isLiked, likeCount: result.likeCount }));
        } catch (err) {
            console.error("Like error:", err);
            alert(err.message || "Failed to like. Please try again.");
        } finally {
            setIsLiking(false);
        }
    };

    if (!website) {
        return (
            <div className="grid min-h-[80vh] place-items-center bg-[color:var(--tone-deep)] px-6 text-center text-white">
                <div>
                    <p className={`text-2xl font-semibold ${bn}`}>{isBn ? "ওয়েবসাইটটি পাওয়া যায়নি" : "Website not found"}</p>
                    <p className={`mt-2 text-sm text-white/55 ${bn}`}>
                        {isBn ? "লিংকটি ভুল হতে পারে, অথবা ওয়েবসাইটটি সরিয়ে নেওয়া হয়েছে।" : "The link may be wrong, or the website was removed."}
                    </p>
                    <Link href="/website" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#F8921C] px-6 py-3 text-sm font-semibold text-black hover:bg-[#e07d0a]">
                        <LuChevronLeft size={16} />
                        {isBn ? "সব ওয়েবসাইট" : "All websites"}
                    </Link>
                </div>
            </div>
        );
    }

    const images = website.images?.length ? website.images : [website.image || "/images/placeholder.png"];
    const price = website.offerPrice || website.price;
    const hasDiscount = website.offerPrice && website.offerPrice < website.price;
    const off = hasDiscount ? Math.round((1 - website.offerPrice / website.price) * 100) : 0;
    const rating = Number(website.rating || 5).toFixed(1);
    const category = website.category?.name || website.projectType || "Website";
    const ytId = website.videoUrl ? website.videoUrl.split("v=")[1]?.split("&")[0] || website.videoUrl.split("/").pop() : null;
    const waLink = `https://wa.me/8801711946614?text=${encodeURIComponent(`Hello Extrain Web! I have a question about "${website.title}".`)}`;

    const tabs = [
        { id: "overview", label: isBn ? "বিবরণ" : "Overview", icon: LuLayoutGrid },
        { id: "features", label: isBn ? "ফিচার" : "Features", icon: LuZap },
        { id: "technical", label: isBn ? "টেকনিক্যাল" : "Technical", icon: LuSettings },
        { id: "reviews", label: isBn ? "রিভিউ" : "Reviews", icon: FaStar },
    ];

    const included = [
        ["Complete Source Code", "সম্পূর্ণ সোর্স কোড"],
        ["Responsive Design", "রেসপনসিভ ডিজাইন"],
        ["Cross-Browser Compatible", "সব ব্রাউজারে চলে"],
        ["Clean & Documented Code", "পরিষ্কার ও ডকুমেন্টেড কোড"],
        ["SEO Optimized", "SEO অপটিমাইজড"],
        ["Fast Loading Speed", "দ্রুত লোডিং"],
        ["Easy to Customize", "সহজে কাস্টমাইজযোগ্য"],
        ["Free Updates (6 Months)", "ফ্রি আপডেট (৬ মাস)"],
    ];

    const perks = [
        { icon: LuFileCode, en: "Full source code", bn: "সম্পূর্ণ সোর্স কোড" },
        { icon: LuDownload, en: "Instant delivery", bn: "দ্রুত ডেলিভারি" },
        { icon: LuClock, en: "6 months of updates", bn: "৬ মাস আপডেট" },
        { icon: LuShieldCheck, en: "Premium support", bn: "প্রিমিয়াম সাপোর্ট" },
    ];

    return (
        <div className="relative min-h-screen overflow-x-clip bg-[color:var(--tone-deep)] text-white selection:bg-[#F8921C] selection:text-black">
            {/* ======================= TOP: gallery + purchase ======================= */}
            <section className="relative overflow-hidden pb-14 pt-8 lg:pb-20 lg:pt-10">
                <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                    <div className="absolute left-1/4 top-0 h-80 w-[36rem] -translate-x-1/2 rounded-full bg-[#F8921C]/[0.06] blur-3xl" />
                    <EdgeDots />
                </div>

                <div className="container relative z-10 mx-auto px-6 lg:px-10">
                    {/* breadcrumb */}
                    <nav aria-label="Breadcrumb" className={`mb-6 flex items-center gap-2 text-[13px] text-white/45 ${bn}`}>
                        <Link href="/" className="transition-colors hover:text-[#F8921C]">{isBn ? "হোম" : "Home"}</Link>
                        <LuChevronRight size={13} />
                        <Link href="/website" className="transition-colors hover:text-[#F8921C]">{isBn ? "ওয়েবসাইট" : "Websites"}</Link>
                        <LuChevronRight size={13} />
                        <span className="max-w-[220px] truncate text-white/80">{website.title}</span>
                    </nav>

                    <div className="grid items-start gap-8 lg:grid-cols-[1.45fr_1fr] lg:gap-10">
                        {/* ---------- gallery ---------- */}
                        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}>
                            <div className="group relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-[color:var(--tone-soft)]">
                                <AnimatePresence mode="wait">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <motion.img
                                        key={images[activeImg]}
                                        src={images[activeImg]}
                                        alt={`${website.title} — screenshot ${activeImg + 1}`}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="absolute inset-0 h-full w-full cursor-zoom-in object-cover object-top"
                                        onClick={() => setLightbox(activeImg)}
                                    />
                                </AnimatePresence>
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

                                {/* overlay actions */}
                                <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2">
                                    <div className="flex gap-2">
                                        {website.previewUrl && (
                                            <a
                                                href={website.previewUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-[13px] font-semibold text-black shadow-lg transition-colors hover:bg-[#F8921C] ${bn}`}
                                            >
                                                <LuEye size={15} />
                                                {isBn ? "লাইভ প্রিভিউ" : "Live Preview"}
                                            </a>
                                        )}
                                        {ytId && (
                                            <button
                                                type="button"
                                                onClick={() => setShowVideoModal(true)}
                                                className={`inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-black/55 px-4 py-2 text-[13px] font-semibold text-white backdrop-blur-md transition-colors hover:border-[#F8921C] hover:text-[#F8921C] ${bn}`}
                                            >
                                                <LuPlay size={14} />
                                                {isBn ? "ভিডিও দেখুন" : "Watch Video"}
                                            </button>
                                        )}
                                    </div>
                                    {images.length > 1 && (
                                        <span className="rounded-md bg-black/55 px-2.5 py-1 text-[12px] tabular-nums text-white/80 backdrop-blur-md">
                                            {activeImg + 1} / {images.length}
                                        </span>
                                    )}
                                </div>

                                {images.length > 1 && (
                                    <>
                                        <button
                                            type="button"
                                            aria-label="Previous image"
                                            onClick={() => setActiveImg((i) => (i - 1 + images.length) % images.length)}
                                            className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-md transition-all hover:bg-[#F8921C] hover:text-black group-hover:opacity-100"
                                        >
                                            <LuChevronLeft size={20} />
                                        </button>
                                        <button
                                            type="button"
                                            aria-label="Next image"
                                            onClick={() => setActiveImg((i) => (i + 1) % images.length)}
                                            className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-md transition-all hover:bg-[#F8921C] hover:text-black group-hover:opacity-100"
                                        >
                                            <LuChevronRight size={20} />
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* thumbnails */}
                            {images.length > 1 && (
                                <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1">
                                    {images.map((img, i) => (
                                        <button
                                            key={img + i}
                                            type="button"
                                            onClick={() => setActiveImg(i)}
                                            aria-label={`Show image ${i + 1}`}
                                            className={`relative aspect-[16/10] w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-all sm:w-28 ${
                                                i === activeImg ? "border-[#F8921C]" : "border-transparent opacity-55 hover:opacity-100"
                                            }`}
                                        >
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={img} alt="" className="h-full w-full object-cover object-top" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </motion.div>

                        {/* ---------- purchase panel ---------- */}
                        <motion.aside
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
                            className="lg:sticky lg:top-24"
                        >
                            <div className="flex flex-wrap items-center gap-2">
                                <span className={`rounded-md border border-white/15 bg-white/[0.05] px-2.5 py-1 text-[12px] font-semibold text-white/80 ${bn}`}>{category}</span>
                                {website.isFeatured && (
                                    <span className="inline-flex items-center gap-1 rounded-md bg-[#F8921C]/15 px-2.5 py-1 text-[12px] font-semibold text-[#F8921C]">
                                        <LuSparkles size={12} /> {isBn ? "ফিচারড" : "Featured"}
                                    </span>
                                )}
                            </div>

                            <h1 style={{ color: "#fff" }} className={`mt-4 text-[1.7rem] font-bold leading-[1.2] sm:text-[2rem] ${bn}`}>
                                {website.title}
                            </h1>
                            {website.description && (
                                <p className={`mt-3 line-clamp-3 text-[15px] leading-7 text-white/60 ${bn}`}>{website.description}</p>
                            )}

                            {/* rating · sold · likes */}
                            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-white/60">
                                <span className="inline-flex items-center gap-1.5">
                                    <span className="flex gap-0.5 text-[#F8921C]">
                                        {[1, 2, 3, 4, 5].map((s) => <FaStar key={s} size={12} className={s <= Math.round(rating) ? "" : "opacity-25"} />)}
                                    </span>
                                    <b className="font-semibold text-white">{rating}</b>
                                    <span>({website.reviewCount || 0})</span>
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <LuPackage size={14} className="text-white/40" />
                                    {fmtCount(website.salesCount || 0)} {isBn ? "বিক্রি" : "sold"}
                                </span>
                                <button
                                    type="button"
                                    onClick={handleToggleLike}
                                    disabled={isLiking}
                                    aria-pressed={!!website.isLiked}
                                    className={`inline-flex items-center gap-1.5 transition-colors ${website.isLiked ? "text-rose-400" : "hover:text-rose-400"}`}
                                >
                                    {website.isLiked ? <FaHeart size={13} /> : <FaRegHeart size={13} />}
                                    {fmtCount(website.likeCount || 0)}
                                </button>
                            </div>

                            {/* price + actions */}
                            <div className="mt-6 rounded-2xl border border-white/10 bg-[color:var(--tone-soft)] p-5 sm:p-6">
                                <div className="flex items-end justify-between gap-3">
                                    <div>
                                        {hasDiscount && (
                                            <div className="mb-1 flex items-center gap-2">
                                                <span className="text-sm text-white/35 line-through">৳{website.price?.toLocaleString()}</span>
                                                <span className="rounded-md bg-[#F8921C] px-1.5 py-0.5 text-[11px] font-bold text-black">-{off}%</span>
                                            </div>
                                        )}
                                        <span className="text-[2.3rem] font-bold leading-none tracking-tight text-white">৳{price?.toLocaleString()}</span>
                                    </div>
                                    <span className={`text-right text-[12px] text-white/45 ${bn}`}>{isBn ? "এককালীন মূল্য" : "One-time price"}</span>
                                </div>

                                <div className="mt-5 grid gap-2.5">
                                    <button
                                        type="button"
                                        onClick={handleBuyNow}
                                        className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#F8921C] text-sm font-semibold uppercase text-black transition-colors hover:bg-[#e07d0a] ${bn ? "tracking-normal" : "tracking-wide"} ${bn}`}
                                    >
                                        {isBn ? "এখনই কিনুন" : "Buy Now"}
                                        <LuArrowUpRight size={17} />
                                    </button>
                                    <div className="grid grid-cols-2 gap-2.5">
                                        <button
                                            type="button"
                                            onClick={handleAddToCart}
                                            className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border text-[13px] font-semibold transition-colors ${
                                                added ? "border-emerald-500 bg-emerald-500 text-white" : "border-white/15 text-white hover:border-[#F8921C] hover:text-[#F8921C]"
                                            } ${bn}`}
                                        >
                                            {added ? <LuCheck size={16} /> : <LuShoppingCart size={16} />}
                                            {added ? (isBn ? "যোগ হয়েছে" : "Added") : (isBn ? "কার্টে যোগ" : "Add to Cart")}
                                        </button>
                                        <a
                                            href={waLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/15 text-[13px] font-semibold text-white transition-colors hover:border-[#F8921C] hover:text-[#F8921C] ${bn}`}
                                        >
                                            <FaWhatsapp size={16} />
                                            {isBn ? "প্রশ্ন করুন" : "Ask a Question"}
                                        </a>
                                    </div>
                                </div>

                                <ul className="mt-5 grid grid-cols-2 gap-x-3 gap-y-2.5 border-t border-white/10 pt-5">
                                    {perks.map(({ icon: Icon, en, bn: bnText }) => (
                                        <li key={en} className={`flex items-center gap-2 text-[13px] text-white/70 ${bn}`}>
                                            <Icon size={15} className="shrink-0 text-[#F8921C]" />
                                            {isBn ? bnText : en}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.aside>
                    </div>
                </div>
            </section>

            {/* ======================= BOTTOM: details tabs + similar ======================= */}
            <section className="relative border-t border-white/10 bg-[color:var(--tone-soft)] pb-24 pt-12 lg:pb-28 lg:pt-14">
                <div className="container mx-auto px-6 lg:px-10">
                    <div className="grid items-start gap-8 lg:grid-cols-[1.45fr_1fr] lg:gap-10">
                        {/* ---------- tabs ---------- */}
                        <div>
                            <div role="tablist" className="flex gap-1 overflow-x-auto rounded-xl border border-white/10 bg-[color:var(--tone-deep)]/60 p-1">
                                {tabs.map(({ id, label, icon: Icon }) => (
                                    <button
                                        key={id}
                                        type="button"
                                        role="tab"
                                        aria-selected={activeTab === id}
                                        onClick={() => setActiveTab(id)}
                                        className={`inline-flex h-10 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 text-[13.5px] font-semibold transition-colors ${
                                            activeTab === id ? "bg-[#F8921C] text-black" : "text-white/60 hover:text-white"
                                        } ${bn}`}
                                    >
                                        <Icon size={15} />
                                        {label}
                                    </button>
                                ))}
                            </div>

                            <div className="mt-6">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeTab}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -6 }}
                                        transition={{ duration: 0.25 }}
                                    >
                                        {activeTab === "overview" && (
                                            <div className="rounded-2xl border border-white/10 bg-[color:var(--tone-deep)] p-6 sm:p-8">
                                                <SectionTitle bn={bn}>{isBn ? "এই ওয়েবসাইট সম্পর্কে" : "About this website"}</SectionTitle>
                                                <p className={`text-[15px] leading-7 text-white/70 ${bn}`}>{website.description}</p>
                                                {website.longDescription && (
                                                    <p className={`mt-5 whitespace-pre-line border-l-2 border-[#F8921C] pl-5 text-[14.5px] leading-7 text-white/60 ${bn}`}>
                                                        {website.longDescription}
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {activeTab === "features" && (
                                            <div className="grid gap-3 sm:grid-cols-2">
                                                {(website.features?.length ? website.features : []).map((f, i) => (
                                                    <div key={i} className="flex items-start gap-3 rounded-xl border border-white/10 bg-[color:var(--tone-deep)] p-4">
                                                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#F8921C]/10 text-[#F8921C]">
                                                            <LuCheck size={16} />
                                                        </span>
                                                        <span className={`pt-1 text-[14px] leading-6 text-white/80 ${bn}`}>{f}</span>
                                                    </div>
                                                ))}
                                                {!website.features?.length && (
                                                    <p className={`text-sm text-white/50 ${bn}`}>{isBn ? "ফিচার তালিকা শীঘ্রই আসছে।" : "Feature list coming soon."}</p>
                                                )}
                                            </div>
                                        )}

                                        {activeTab === "technical" && (
                                            <div className="space-y-5">
                                                <div className="rounded-2xl border border-white/10 bg-[color:var(--tone-deep)] p-6 sm:p-8">
                                                    <SectionTitle bn={bn}>{isBn ? "টেকনোলজি" : "Technology stack"}</SectionTitle>
                                                    <div className="flex flex-wrap gap-2">
                                                        {(website.techStack || ["HTML5", "CSS3", "JavaScript", "React.js", "Node.js", "MongoDB"]).map((tech) => (
                                                            <span key={tech} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-[13px] text-white/80">
                                                                <LuFileCode size={14} className="text-[#F8921C]" />
                                                                {tech}
                                                            </span>
                                                        ))}
                                                    </div>

                                                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                                        {[
                                                            { icon: LuLayers, k: isBn ? "প্রজেক্ট টাইপ" : "Project type", v: website.projectType || "Full Stack" },
                                                            { icon: LuLayoutGrid, k: isBn ? "মোট পেজ" : "Total pages", v: `${website.totalPages || "10+"} ${isBn ? "পেজ" : "pages"}` },
                                                            { icon: LuMonitorSmartphone, k: isBn ? "রেসপনসিভ" : "Responsive", v: isBn ? "সব ডিভাইসে" : "Fully responsive" },
                                                            { icon: LuShieldCheck, k: isBn ? "ব্রাউজার সাপোর্ট" : "Browser support", v: isBn ? "সব আধুনিক ব্রাউজার" : "All modern browsers" },
                                                        ].map(({ icon: Icon, k, v }) => (
                                                            <div key={k} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                                                                <Icon size={18} className="shrink-0 text-[#F8921C]" />
                                                                <div>
                                                                    <p className={`text-[12px] text-white/45 ${bn}`}>{k}</p>
                                                                    <p className={`text-[14px] font-semibold text-white ${bn}`}>{v}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="rounded-2xl border border-white/10 bg-[color:var(--tone-deep)] p-6 sm:p-8">
                                                    <SectionTitle bn={bn}>{isBn ? "যা যা পাচ্ছেন" : "What's included"}</SectionTitle>
                                                    <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
                                                        {included.map(([en, bnText]) => (
                                                            <li key={en} className={`flex items-center gap-2.5 text-[14px] text-white/75 ${bn}`}>
                                                                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#F8921C] text-black">
                                                                    <LuCheck size={11} strokeWidth={3} />
                                                                </span>
                                                                {isBn ? bnText : en}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === "reviews" && (
                                            <div className="reviews-dark">
                                                <ReviewsSection productId={website._id} productType="website" />
                                            </div>
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* ---------- similar websites ---------- */}
                        {similar.length > 0 && (
                            <motion.aside {...reveal(0)} className="rounded-2xl border border-white/10 bg-[color:var(--tone-deep)] p-5 lg:sticky lg:top-24">
                                <h2 style={{ color: "#fff" }} className={`mb-4 flex items-center gap-2 text-[15px] font-semibold ${bn}`}>
                                    <LuLayoutGrid size={15} className="text-[#F8921C]" />
                                    {isBn ? "একই রকম ওয়েবসাইট" : "Similar websites"}
                                </h2>
                                <div className="space-y-2">
                                    {similar.map((item) => (
                                        <Link
                                            key={item._id}
                                            href={`/website/${slugOf(item)}`}
                                            className="group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-white/[0.04]"
                                        >
                                            <span className="relative aspect-[16/10] w-24 shrink-0 overflow-hidden rounded-lg border border-white/10">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={item.images?.[0] || item.image || "/images/placeholder.png"}
                                                    alt={item.title}
                                                    loading="lazy"
                                                    className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                                />
                                            </span>
                                            <span className="min-w-0 flex-1">
                                                <span className={`line-clamp-2 text-[13.5px] font-medium leading-snug text-white/85 transition-colors group-hover:text-[#F8921C] ${bn}`}>
                                                    {item.title}
                                                </span>
                                                <span className="mt-1 block text-[13px] font-semibold text-white">৳{(item.offerPrice || item.price)?.toLocaleString()}</span>
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                                <Link
                                    href="/website"
                                    className={`mt-4 flex items-center justify-center gap-1.5 rounded-lg border border-white/10 py-2.5 text-[13px] font-semibold text-white/80 transition-colors hover:border-[#F8921C] hover:text-[#F8921C] ${bn}`}
                                >
                                    {isBn ? "সব ওয়েবসাইট দেখুন" : "View all websites"}
                                    <LuArrowUpRight size={15} />
                                </Link>
                            </motion.aside>
                        )}
                    </div>
                </div>
            </section>

            {/* ======================= lightbox + video ======================= */}
            <AnimatePresence>
                {lightbox !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[80] flex items-center justify-center bg-black/95 p-4"
                        onClick={() => setLightbox(null)}
                        role="dialog"
                        aria-modal="true"
                    >
                        <button type="button" aria-label="Close" onClick={() => setLightbox(null)} className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-[#F8921C] hover:text-black">
                            <LuX size={20} />
                        </button>
                        {images.length > 1 && (
                            <>
                                <span className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-sm tabular-nums text-white">
                                    {lightbox + 1} / {images.length}
                                </span>
                                <button type="button" aria-label="Previous image" onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i - 1 + images.length) % images.length); }} className="absolute left-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-[#F8921C] hover:text-black">
                                    <LuChevronLeft size={24} />
                                </button>
                                <button type="button" aria-label="Next image" onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i + 1) % images.length); }} className="absolute right-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-[#F8921C] hover:text-black">
                                    <LuChevronRight size={24} />
                                </button>
                            </>
                        )}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <motion.img
                            key={lightbox}
                            initial={{ scale: 0.94, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            src={images[lightbox]}
                            alt={`${website.title} — screenshot ${lightbox + 1}`}
                            className="max-h-[85vh] max-w-full rounded-lg object-contain shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
                {showVideoModal && ytId && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[80] flex items-center justify-center bg-black/95 p-4"
                        onClick={() => setShowVideoModal(false)}
                        role="dialog"
                        aria-modal="true"
                    >
                        <button type="button" aria-label="Close" onClick={() => setShowVideoModal(false)} className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-[#F8921C] hover:text-black">
                            <LuX size={20} />
                        </button>
                        <div className="relative aspect-video w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
                            <iframe
                                src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
                                className="h-full w-full rounded-lg"
                                allow="autoplay; encrypted-media"
                                allowFullScreen
                                title={`${website.title} video`}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ReviewsSection is built for light pages — re-tone it for the dark theme, here only */}
            <style jsx global>{`
                .reviews-dark > div { margin-top: 0 !important; background: var(--tone-deep) !important; border-color: rgba(255,255,255,0.1) !important; box-shadow: none !important; border-radius: 1rem !important; }
                .reviews-dark .bg-white, .reviews-dark .bg-gray-50, .reviews-dark [class*="bg-gray-50/"] { background: rgba(255,255,255,0.03) !important; }
                .reviews-dark .border-gray-100, .reviews-dark .border-gray-200, .reviews-dark [class*="border-gray-200/"] { border-color: rgba(255,255,255,0.1) !important; }
                .reviews-dark .text-gray-900, .reviews-dark .text-gray-800 { color: #fff !important; }
                .reviews-dark .text-gray-600, .reviews-dark .text-gray-500 { color: rgba(255,255,255,0.6) !important; }
                .reviews-dark .text-gray-400, .reviews-dark .text-gray-300 { color: rgba(255,255,255,0.4) !important; }
                .reviews-dark .bg-gray-200 { background: rgba(255,255,255,0.08) !important; }
                .reviews-dark .bg-gray-900 { background: #f8921c !important; color: #000 !important; box-shadow: none !important; }
                .reviews-dark .bg-gray-900:hover { background: #e07d0a !important; }
                .reviews-dark h2, .reviews-dark h3, .reviews-dark h4 { color: #fff !important; }
                .reviews-dark .text-amber-400 { color: #f8921c !important; }
            `}</style>
        </div>
    );
}

// small heading used inside the tab panels
function SectionTitle({ children, bn }) {
    return (
        <h2 style={{ color: "#fff" }} className={`mb-4 flex items-center gap-2.5 text-[17px] font-semibold ${bn}`}>
            <span className="h-5 w-1 rounded-full bg-[#F8921C]" />
            {children}
        </h2>
    );
}
