"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { FiCopy, FiCheck, FiCreditCard } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";

// Personal Send Money নম্বর — ক্লায়েন্ট এখান থেকে দেখে টাকা পাঠাবে
const METHODS = [
    { key: "bkash", emoji: "📱", label: "বিকাশ", labelEn: "bKash", value: "01753924093", hint: "Personal • Send Money" },
    { key: "rocket", emoji: "🚀", label: "রকেট", labelEn: "Rocket", value: "01753924093", hint: "Personal • Send Money" },
    { key: "nagad", emoji: "🔶", label: "নগদ", labelEn: "Nagad", value: "01753924093", hint: "Personal • Send Money" },
    { key: "meghna", emoji: "🏦", label: "Meghna Bank", labelEn: "Meghna Bank", value: "111812300000263", hint: "Sheikh Sakibul Hasan" },
];

const FULL_MESSAGE = `আপনার পেমেন্টটি সম্পন্ন করতে নিচে আমাদের নাম্বার দেওয়া হলো:

💳 পেমেন্ট মাধ্যম (Personal) Send money :

📱 বিকাশ: 01753924093
🚀 রকেট: 01753924093
🔶 নগদ: 01753924093

🔶 Meghna Bank:
111812300000263 [ Sheikh Sakibul Hasan ]

Extrain Web Team`;

async function copyText(text) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
        } else {
            const ta = document.createElement("textarea");
            ta.value = text;
            ta.style.position = "fixed";
            ta.style.opacity = "0";
            document.body.appendChild(ta);
            ta.select();
            document.execCommand("copy");
            document.body.removeChild(ta);
        }
        return true;
    } catch {
        return false;
    }
}

// variant: "card" (Confirm Order পেজে বড় করে) | "footer" (কমপ্যাক্ট)
export default function PaymentMethods({ variant = "card" }) {
    const { language } = useLanguage();
    const isBn = language === "bn";
    const bn = isBn ? "hind-siliguri" : "";
    const [copied, setCopied] = useState(null);

    const copy = async (key, text, okMsg) => {
        const ok = await copyText(text);
        if (!ok) { toast.error(isBn ? "কপি করা যায়নি" : "Copy failed"); return; }
        setCopied(key);
        toast.success(okMsg);
        setTimeout(() => setCopied((c) => (c === key ? null : c)), 1500);
    };

    // ---------- Footer variant — কমপ্যাক্ট ----------
    if (variant === "footer") {
        return (
            <div>
                <h4 className={`text-gray-800 dark:text-white font-black font-poppins uppercase text-xl mb-6 flex items-center gap-2 ${bn}`}>
                    <span className="w-1.5 h-6 bg-[#FD9A00] rounded-full" />
                    {isBn ? "পেমেন্ট মাধ্যম" : "Payment Methods"}
                </h4>
                <p className="text-xs text-gray-400 mb-3">Personal • Send Money</p>
                <ul className="space-y-2.5">
                    {METHODS.map((m) => (
                        <li key={m.key}>
                            <button
                                onClick={() => copy(m.key, m.value, `${isBn ? m.label : m.labelEn} ${isBn ? "নম্বর কপি হয়েছে" : "copied"}`)}
                                className="group w-full flex items-center justify-between gap-2 text-left"
                                title={isBn ? "কপি করুন" : "Copy"}
                            >
                                <span className={`text-sm text-gray-600 dark:text-gray-400 ${bn}`}>
                                    <span className="mr-1">{m.emoji}</span>{isBn ? m.label : m.labelEn}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="font-mono text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-[#FD9A00] transition-colors">{m.value}</span>
                                    {copied === m.key
                                        ? <FiCheck size={14} className="text-emerald-500" />
                                        : <FiCopy size={13} className="text-gray-400 group-hover:text-[#FD9A00] transition-colors" />}
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    // ---------- Card variant — Confirm Order পেজে ----------
    return (
        <div className="rounded-2xl border border-[#0CB2A9]/30 bg-[#0CB2A9]/5 dark:bg-[#0CB2A9]/10 p-4 md:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <p className={`font-bold text-slate-800 dark:text-white flex items-center gap-2 ${bn}`}>
                    <FiCreditCard style={{ color: "#0CB2A9" }} />
                    {isBn ? "পেমেন্ট মাধ্যম" : "Payment Methods"}
                    <span className="text-xs font-normal text-slate-500 dark:text-slate-400">Personal • Send Money</span>
                </p>
                <button
                    type="button"
                    onClick={() => copy("all", FULL_MESSAGE, isBn ? "পুরো তথ্য কপি হয়েছে" : "All details copied")}
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${copied === "all" ? "border-emerald-300 text-emerald-600 bg-emerald-50" : "border-[#0CB2A9]/40 text-[#0CB2A9] hover:bg-[#0CB2A9]/10"} ${bn}`}
                >
                    {copied === "all" ? <><FiCheck size={13} /> {isBn ? "কপি হয়েছে" : "Copied"}</> : <><FiCopy size={13} /> {isBn ? "সব কপি করুন" : "Copy all"}</>}
                </button>
            </div>
            <p className={`text-xs text-slate-500 dark:text-slate-400 mb-3 ${bn}`}>
                {isBn ? "নিচের যেকোনো নম্বরে Send Money করে ট্রানজেকশন আইডি নিচের ফর্মে দিন।" : "Send money to any number below, then enter the transaction ID in the form."}
            </p>

            <div className="grid sm:grid-cols-2 gap-2.5">
                {METHODS.map((m) => (
                    <button
                        key={m.key}
                        type="button"
                        onClick={() => copy(m.key, m.value, `${isBn ? m.label : m.labelEn} ${isBn ? "নম্বর কপি হয়েছে" : "copied"}`)}
                        className="group flex items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 px-3.5 py-2.5 text-left hover:border-[#0CB2A9]/50 transition"
                    >
                        <div className="min-w-0">
                            <p className={`text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 ${bn}`}>
                                <span>{m.emoji}</span> {isBn ? m.label : m.labelEn}
                            </p>
                            <p className="font-mono text-[15px] font-bold tracking-wide text-slate-900 dark:text-white">{m.value}</p>
                            <p className="text-[11px] text-slate-400">{m.hint}</p>
                        </div>
                        <span className={`shrink-0 grid place-items-center w-8 h-8 rounded-lg ${copied === m.key ? "text-emerald-500" : "text-slate-400 group-hover:text-[#0CB2A9]"}`}>
                            {copied === m.key ? <FiCheck size={17} /> : <FiCopy size={16} />}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
