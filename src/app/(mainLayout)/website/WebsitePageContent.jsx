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
            className="relative overflow-hidden bg-[color:var(--tone-deep)] pb-10 pt-10 text-white lg:pb-12 lg:pt-14"
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
                    className="absolute left-[48%] top-[16%] hidden xl:block"
                >
                    <Star4 size={38} filled className="decor-float text-[#F8921C]" style={{ animationDuration: "10s" }} />
                </motion.div>
            </div>

            <div className="container relative z-10 mx-auto px-6 lg:px-10">
                {/* one compact row: title on the left, search + stats on the right */}
                <motion.div
                    style={reduce ? undefined : { y: headY }}
                    className="grid items-end gap-8 lg:grid-cols-[1fr_auto] lg:gap-12"
                >
                    <div>
                        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewport} className="mb-5">
                            <BracketLabel bn={bn}>{isBn ? "প্রিমিয়াম ওয়েবসাইট" : "Premium Websites"}</BracketLabel>
                        </motion.div>
                        <motion.h1
                            variants={fadeUp}
                            custom={1}
                            initial="hidden"
                            whileInView="show"
                            viewport={viewport}
                            style={{ color: "#fff" }}
                            className={`text-[1.8rem] font-bold leading-[1.2] sm:text-[2.2rem] lg:text-[2.6rem] ${bn}`}
                        >
                            {isBn ? (
                                <>আমাদের <i className="font-light">মার্কেটপ্লেস</i></>
                            ) : (
                                <>Website <i className="font-light">Marketplace</i></>
                            )}
                        </motion.h1>
                        <motion.p
                            variants={fadeUp}
                            custom={2}
                            initial="hidden"
                            whileInView="show"
                            viewport={viewport}
                            className={`mt-3 max-w-xl text-sm leading-6 text-white/60 sm:text-[15px] ${bn}`}
                        >
                            {isBn
                                ? "রেডি-মেড ওয়েবসাইট, যা আপনার ব্যবসাকে দ্রুত অনলাইনে নিয়ে আসবে।"
                                : "Ready-to-deploy websites for startups and businesses — get online in days, not months."}
                        </motion.p>
                    </div>

                    <motion.div
                        variants={fadeUp}
                        custom={3}
                        initial="hidden"
                        whileInView="show"
                        viewport={viewport}
                        className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto"
                    >
                        {/* search */}
                        <div className="relative w-full sm:flex-1 lg:w-[22rem] lg:flex-none">
                            <LuSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={17} />
                            <input
                                type="text"
                                aria-label={isBn ? "ওয়েবসাইট খুঁজুন..." : "Search websites..."}
                                placeholder={isBn ? "ওয়েবসাইট খুঁজুন..." : "Search websites..."}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`block h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-11 pr-11 text-sm text-white placeholder:text-white/40 outline-none transition-all focus:border-[#F8921C] focus:bg-white/[0.07] focus:ring-4 focus:ring-[#F8921C]/15 ${bn}`}
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery("")}
                                    aria-label={isBn ? "ফিল্টার মুছুন" : "Clear"}
                                    className="absolute right-2.5 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-white/50 transition-colors hover:bg-[#F8921C] hover:text-black"
                                >
                                    <LuX size={15} />
                                </button>
                            )}
                        </div>

                        {/* stats */}
                        <div className="flex h-12 shrink-0 items-center divide-x divide-white/10 rounded-xl border border-white/10 bg-white/[0.03]">
                            {stats.map(({ icon: Icon, value, label }) => (
                                <div key={label} className="flex items-center gap-2 px-4">
                                    <Icon size={16} className="text-[#F8921C]" />
                                    <span className="text-[15px] font-bold text-white">{value}</span>
                                    <span className={`text-[12px] text-white/50 ${bn}`}>{label}</span>
                                </div>
                            ))}
                        </div>
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
            className="relative overflow-hidden border-t border-white/10 bg-[color:var(--tone-soft)] pb-24 pt-8 text-white lg:pb-28 lg:pt-10"
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
