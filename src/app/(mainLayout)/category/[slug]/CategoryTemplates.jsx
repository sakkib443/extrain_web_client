"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LuArrowRight, LuLoader } from "react-icons/lu";
import ProductCard from "@/components/sheard/ProductCard";
import { API_BASE_URL } from "@/config/api";
import { useLanguage } from "@/context/LanguageContext";

const norm = (s) => (s || "").toString().toLowerCase().replace(/[^a-z0-9]/g, "");

// Map a route slug to the category names/slugs that may exist in the backend
// (backend data has typos/variations, e.g. "ecommercee").
const ALIASES = {
    ecommerce: ["ecommerce", "ecommercee", "e-commerce", "shop", "store"],
    business: ["business", "corporate", "company", "agency", "startup"],
    portfolio: ["portfolio", "personal", "resume", "cv"],
    blog: ["blog", "news", "magazine", "article"],
    restaurant: ["restaurant", "food", "cafe", "catering", "menu"],
    "real-estate": ["realestate", "real-estate", "property", "realty"],
    healthcare: ["healthcare", "health", "medical", "clinic", "hospital", "doctor"],
};

export default function CategoryTemplates({ slug, name }) {
    const { language } = useLanguage();
    const isBn = language === "bn";
    const t = (en, b) => (isBn ? b : en);
    const bn = isBn ? "hind-siliguri" : "";
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        (async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/websites`);
                const json = await res.json();
                const all = Array.isArray(json.data) ? json.data : [];

                const tokens = Array.from(
                    new Set([...(ALIASES[slug] || [slug]), slug, slug.replace(/-/g, "")].map(norm).filter(Boolean))
                );

                const matched = all.filter((w) => {
                    const cands = [norm(w?.category?.slug), norm(w?.category?.name)].filter(Boolean);
                    return cands.some((c) => tokens.some((t) => c.includes(t) || t.includes(c)));
                });

                if (active) setItems(matched);
            } catch (e) {
                if (active) setItems([]);
            } finally {
                if (active) setLoading(false);
            }
        })();
        return () => {
            active = false;
        };
    }, [slug]);

    if (loading) {
        return (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
                <LuLoader className="animate-spin text-[#FD9A00]" size={30} />
                <p className={`text-sm text-gray-400 ${bn}`}>{t("Loading templates…", "টেমপ্লেট লোড হচ্ছে…")}</p>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="py-20 text-center rounded-2xl border-2 border-dashed border-[#ecedf1] dark:border-white/10">
                <p className={`text-gray-500 dark:text-gray-400 mb-5 ${bn}`}>
                    {isBn ? `${name} টেমপ্লেট শীঘ্রই আসছে।` : `New ${name} templates are coming soon.`}
                </p>
                <Link
                    href="/contact"
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[#FD9A00] text-white font-bold text-sm hover:bg-[#e68a00] transition-all ${bn}`}
                >
                    {isBn ? `কাস্টম ${name} সাইট অর্ডার করুন` : `Request a Custom ${name} Site`} <LuArrowRight size={16} />
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
                <ProductCard key={item._id} product={item} type="website" />
            ))}
        </div>
    );
}
