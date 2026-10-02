"use client";
import React, { Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWebsites } from "@/redux/websiteSlice";
import { fetchCategories } from "@/redux/categorySlice";
import dynamic from "next/dynamic";
import { LuGlobe, LuPlus, LuSearch, LuX } from "react-icons/lu";
import { useLanguage } from "@/context/LanguageContext";
import { motion, useTransform } from "framer-motion";
import useSectionMotion from "@/hooks/useSectionMotion";
import BracketLabel from "@/components/Home/BracketLabel";
import { Star4, EdgeDots, OrbitRing } from "@/components/Home/Decor";

// Loading fallback component (orange spinner on the black theme)
const LoadingFallback = ({ bare = false }) => (
    <div className={`flex min-h-[50vh] items-center justify-center py-20 ${bare ? "" : "bg-[color:var(--tone-deep)]"}`}>
        <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-[#F8921C] border-t-transparent" />
    </div>
);

const RightWebsiteDetails = dynamic(
    () => import("@/components/websitepage/RightWebsiteDetails"),
    { ssr: false, loading: () => <LoadingFallback bare /> }
);

const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    show: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.65, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
    }),
};
const viewport = { once: true, amount: 0.2 };

// ---------------------------------------------------------------------------------------------
// Header: label, headline, search and the two small stats. Own component so the motion hook
// only starts once the section is really on the page (it needs the section element).
// ---------------------------------------------------------------------------------------------
function PageHeader({ searchQuery, setSearchQuery, count }) {
    const { language } = useLanguage();
    const isBn = language === "bn";
    const bn = isBn ? "hind-siliguri" : "";

    // smooth scroll + mouse motion (same feel as the home sections)
    const { ref: sectionRef, p, mx, reduce, isLg } = useSectionMotion();
    const s = isLg ? 1 : 0.4;
    const headY = useTransform(p, [0, 1], [20 * s, -20 * s]);
    const ringLX = useTransform(mx, [-0.5, 0.5], [30, -30]);
    const ringLY = useTransform(p, [0, 1], [60, -60]);
    const ringRX = useTransform(mx, [-0.5, 0.5], [-26, 26]);
    const ringRY = useTransform(p, [0, 1], [-54, 54]);
    const starX = useTransform(mx, [-0.5, 0.5], [-22, 22]);
    const starY = useTransform(p, [0, 1], [-60, 60]);

    const stats = [
        { icon: LuGlobe, value: `${count || "0"}+`, label: isBn ? "ওয়েবসাইট" : "Websites" },
        { icon: LuPlus, value: "24/7", label: isBn ? "সাপোর্ট" : "Support" },
    ];

    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden bg-[color:var(--tone-deep)] pb-14 pt-16 text-white lg:pb-16 lg:pt-20"
        >
            {/* ===== background decoration ===== */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                <div className="absolute left-1/2 top-0 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-[#F8921C]/[0.06] blur-3xl" />
                <EdgeDots />
                <motion.div
                    style={reduce ? undefined : { x: ringLX, y: ringLY }}
                    className="absolute -left-[16rem] top-[6%] hidden sm:block"
                >
                    <div className="relative aspect-square w-[32rem]">
                        <OrbitRing className="absolute inset-0 border-white/[0.10]" />
                        <OrbitRing reverse dashed dot="bottom" className="absolute inset-[16%] border-[#F8921C]/25" />
                    </div>
                </motion.div>
                <motion.div
                    style={reduce ? undefined : { x: ringRX, y: ringRY }}
                    className="absolute -right-[13rem] bottom-[-8%] hidden sm:block"
                >
                    <div className="relative aspect-square w-[26rem]">
                        <OrbitRing dashed reverse dot="bottom" className="absolute inset-0 border-white/[0.09]" />
                        <OrbitRing className="absolute inset-[18%] border-white/[0.06]" />
                    </div>
                </motion.div>
                <motion.div
                    style={reduce ? undefined : { x: starX, y: starY }}
                    className="absolute right-[12%] top-[14%] hidden md:block"
                >
                    <Star4 size={38} filled className="decor-float text-[#F8921C]" style={{ animationDuration: "10s" }} />
                </motion.div>
            </div>

            <div className="container relative z-10 mx-auto px-6 lg:px-10">
                <motion.div style={reduce ? undefined : { y: headY }} className="mx-auto max-w-3xl text-center">
                    <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewport} className="mb-7">
                        <BracketLabel bn={bn} size="lg">{isBn ? "প্রিমিয়াম ওয়েবসাইট" : "Premium Websites"}</BracketLabel>
                    </motion.div>

                    <motion.h1
                        variants={fadeUp}
                        custom={1}
                        initial="hidden"
                        whileInView="show"
                        viewport={viewport}
                        style={{ color: "#fff" }}
                        className={`text-[2rem] font-bold leading-[1.2] sm:text-4xl lg:text-[3rem] ${bn}`}
                    >
                        {isBn ? (
                            <>আমাদের <i className="font-light">মার্কেটপ্লেস</i></>
                        ) : (
                            <>Our Website <i className="font-light">Marketplace</i></>
                        )}
                    </motion.h1>

                    <motion.p
                        variants={fadeUp}
                        custom={2}
                        initial="hidden"
                        whileInView="show"
                        viewport={viewport}
                        className={`mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/60 sm:text-base ${bn}`}
                    >
                        {isBn
                            ? "রেডি-মেড ওয়েবসাইট সমাধান যা আপনার ব্যবসাকে দ্রুত অনলাইনে নিয়ে আসবে। আমাদের মার্কেটপ্লেসে আছে সেরা ডিজাইনের ওয়েবসাইট সমুহ।"
                            : "Fully functional, ready-to-deploy websites for startups and enterprises. Get online in minutes with our premium templates."}
                    </motion.p>

                    {/* search */}
                    <motion.div
                        variants={fadeUp}
                        custom={3}
                        initial="hidden"
                        whileInView="show"
                        viewport={viewport}
                        className="relative mx-auto mt-8 max-w-xl"
                    >
                        <LuSearch className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                        <input
                            type="text"
                            aria-label={isBn ? "ওয়েবসাইট খুঁজুন..." : "Search websites..."}
                            placeholder={isBn ? "ওয়েবসাইট খুঁজুন..." : "Search websites..."}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`block h-14 w-full rounded-full border border-white/10 bg-white/[0.04] pl-12 pr-12 text-sm font-medium text-white placeholder:text-white/40 outline-none transition-all focus:border-[#F8921C] focus:bg-white/[0.07] focus:ring-4 focus:ring-[#F8921C]/15 ${bn}`}
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery("")}
                                aria-label={isBn ? "ফিল্টার মুছুন" : "Clear"}
                                className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-white/50 transition-colors hover:bg-[#F8921C] hover:text-black"
                            >
                                <LuX size={16} />
                            </button>
                        )}
                    </motion.div>

                    {/* stats */}
                    <motion.div
                        variants={fadeUp}
                        custom={4}
                        initial="hidden"
                        whileInView="show"
                        viewport={viewport}
                        className="mx-auto mt-8 grid max-w-sm grid-cols-2 gap-3 sm:flex sm:max-w-none sm:justify-center sm:gap-4"
                    >
                        {stats.map(({ icon: Icon, value, label }) => (
                            <div
                                key={label}
                                className="group flex items-center gap-3.5 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[#F8921C]/60 hover:shadow-[0_24px_50px_-28px_rgba(248,146,28,0.55)] sm:min-w-[11rem] sm:px-5"
                            >
                                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#F8921C]/10 text-[#F8921C] transition-colors duration-300 group-hover:bg-[#F8921C] group-hover:text-black">
                                    <Icon size={20} />
                                </span>
                                <span className="min-w-0">
                                    <span className="block text-2xl font-bold leading-none text-white">{value}</span>
                                    <span className={`mt-1.5 block font-semibold uppercase text-white/50 ${bn ? "text-[13px] tracking-normal" : "text-[11px] tracking-[0.2em]"} ${bn}`}>
                                        {label}
                                    </span>
                                </span>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}

// ---------------------------------------------------------------------------------------------
// Listing area: the controls + product grid (RightWebsiteDetails) on the soft tone.
// ---------------------------------------------------------------------------------------------
function ListingArea({ searchQuery, setSearchQuery, selectedType }) {
    const { ref: sectionRef, p, mx, reduce } = useSectionMotion();
    const ringLX = useTransform(mx, [-0.5, 0.5], [26, -26]);
    const ringLY = useTransform(p, [0, 1], [70, -70]);
    const ringRX = useTransform(mx, [-0.5, 0.5], [-24, 24]);
    const ringRY = useTransform(p, [0, 1], [-60, 60]);
    const starX = useTransform(mx, [-0.5, 0.5], [-20, 20]);
    const starY = useTransform(p, [0, 1], [-70, 70]);

    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden border-t border-white/10 bg-[color:var(--tone-soft)] pb-24 pt-10 text-white lg:pb-28 lg:pt-12"
        >
            {/* ===== background decoration (only the glow + dots on narrower screens, so nothing runs behind a card) ===== */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                <div className="absolute -top-20 right-1/4 h-72 w-72 rounded-full bg-[#F8921C]/[0.05] blur-3xl" />
                <div className="absolute bottom-0 left-1/4 h-80 w-80 rounded-full bg-[#F8921C]/[0.04] blur-3xl" />
                <EdgeDots />
                <motion.div
                    style={reduce ? undefined : { x: ringLX, y: ringLY }}
                    className="absolute -left-[19rem] top-[6%] hidden min-[1500px]:block"
                >
                    <div className="relative aspect-square w-[30rem]">
                        <OrbitRing dashed className="absolute inset-0 border-white/[0.10]" />
                        <OrbitRing reverse dot="bottom" className="absolute inset-[16%] border-white/[0.07]" />
                    </div>
                </motion.div>
                <motion.div
                    style={reduce ? undefined : { x: ringRX, y: ringRY }}
                    className="absolute -right-[18rem] top-[46%] hidden min-[1500px]:block"
                >
                    <div className="relative aspect-square w-[28rem]">
                        <OrbitRing reverse dot="bottom" className="absolute inset-0 border-white/[0.09]" />
                        <OrbitRing dashed className="absolute inset-[18%] border-[#F8921C]/20" />
                    </div>
                </motion.div>
                <motion.div
                    style={reduce ? undefined : { x: starX, y: starY }}
                    className="absolute right-[3%] top-[10%] hidden min-[1500px]:block"
                >
                    <Star4 size={34} filled className="decor-float text-[#F8921C]" style={{ animationDuration: "11s" }} />
                </motion.div>
            </div>

            <div className="container relative z-10 mx-auto px-6 lg:px-10">
                <Suspense fallback={<LoadingFallback bare />}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <RightWebsiteDetails
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            selectedType={selectedType}
                        />
                    </motion.div>
                </Suspense>
            </div>
        </section>
    );
}

export default function WebsitePageContent({ initialWebsites = [] }) {
    const dispatch = useDispatch();
    const { websiteList = initialWebsites } = useSelector((state) => state.websites || {});
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType] = useState("All");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // We still dispatch to keep Redux in sync for other components,
        // but initial render uses initialWebsites from props
        dispatch(fetchWebsites());
        dispatch(fetchCategories({ type: 'website' }));
    }, [dispatch]);

    if (!mounted) return <LoadingFallback />;

    return (
        <div className="relative min-h-screen bg-[color:var(--tone-deep)] text-white selection:bg-[#F8921C] selection:text-black">
            <PageHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} count={websiteList.length} />
            <ListingArea searchQuery={searchQuery} setSearchQuery={setSearchQuery} selectedType={selectedType} />
        </div>
    );
}
