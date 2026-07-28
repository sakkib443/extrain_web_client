'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FiCreditCard, FiCopy, FiCheck, FiChevronDown } from 'react-icons/fi';

// Personal Send Money নম্বরগুলো — ক্লায়েন্টকে পাঠানোর জন্য, এক ক্লিকে কপি
const METHODS = [
    { key: 'bkash', emoji: '📱', label: 'বিকাশ', value: '01753924093', hint: 'Personal • Send Money' },
    { key: 'rocket', emoji: '🚀', label: 'রকেট', value: '01753924093', hint: 'Personal • Send Money' },
    { key: 'nagad', emoji: '🔶', label: 'নগদ', value: '01753924093', hint: 'Personal • Send Money' },
    { key: 'meghna', emoji: '🏦', label: 'Meghna Bank', value: '111812300000263', hint: 'Sheikh Sakibul Hasan' },
];

// ক্লায়েন্টকে সরাসরি পাঠানোর মতো পুরো মেসেজ
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
            // http/localhost fallback
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
        }
        return true;
    } catch {
        return false;
    }
}

export default function PaymentMethods({ isDark }) {
    const [open, setOpen] = useState(false);
    const [copied, setCopied] = useState(null); // কোনটা এইমাত্র কপি হলো

    const copy = async (key, text, okMsg) => {
        const ok = await copyText(text);
        if (!ok) { toast.error('কপি করা যায়নি'); return; }
        setCopied(key);
        toast.success(okMsg);
        setTimeout(() => setCopied((c) => (c === key ? null : c)), 1500);
    };

    const card = isDark ? 'bg-slate-800/50 border-slate-700/60' : 'bg-white border-slate-200/70';
    const muted = isDark ? 'text-slate-400' : 'text-slate-500';

    return (
        <div className={`rounded-xl border overflow-hidden ${card}`}>
            {/* header — টগল */}
            <button onClick={() => setOpen((o) => !o)}
                className={`w-full flex items-center justify-between gap-3 px-5 py-3.5 ${isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'} transition`}>
                <span className={`flex items-center gap-2 font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    <FiCreditCard style={{ color: '#FD9A00' }} /> পেমেন্ট মাধ্যম (Personal)
                    <span className={`text-xs font-normal ${muted}`}>— ক্লায়েন্টকে পাঠাতে কপি করুন</span>
                </span>
                <FiChevronDown className={`shrink-0 transition-transform ${open ? 'rotate-180' : ''} ${muted}`} />
            </button>

            {open && (
                <div className={`px-5 pb-5 pt-1 border-t ${isDark ? 'border-slate-700/60' : 'border-slate-100'}`}>
                    <div className="grid sm:grid-cols-2 gap-2.5 mt-4">
                        {METHODS.map((m) => (
                            <button key={m.key} onClick={() => copy(m.key, m.value, `${m.label} নম্বর কপি হয়েছে`)}
                                className={`group flex items-center justify-between gap-3 rounded-lg border px-3.5 py-2.5 text-left transition ${isDark ? 'bg-slate-800/60 border-slate-700 hover:border-slate-600' : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-white'}`}>
                                <div className="min-w-0">
                                    <p className={`text-sm font-semibold flex items-center gap-1.5 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                                        <span>{m.emoji}</span> {m.label}
                                    </p>
                                    <p className={`font-mono text-[15px] font-bold tracking-wide ${isDark ? 'text-white' : 'text-slate-900'}`}>{m.value}</p>
                                    <p className={`text-[11px] ${muted}`}>{m.hint}</p>
                                </div>
                                <span className={`shrink-0 grid place-items-center w-8 h-8 rounded-lg ${copied === m.key ? 'text-emerald-500' : `${muted} group-hover:text-[#FD9A00]`}`}>
                                    {copied === m.key ? <FiCheck size={17} /> : <FiCopy size={16} />}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* পুরো মেসেজ এক ক্লিকে */}
                    <button onClick={() => copy('all', FULL_MESSAGE, 'পুরো মেসেজ কপি হয়েছে')}
                        className={`mt-3 w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-white transition ${copied === 'all' ? 'bg-emerald-500' : 'hover:opacity-90'}`}
                        style={copied === 'all' ? {} : { background: '#FD9A00' }}>
                        {copied === 'all' ? <><FiCheck size={16} /> কপি হয়েছে</> : <><FiCopy size={15} /> পুরো মেসেজ কপি করুন</>}
                    </button>
                </div>
            )}
        </div>
    );
}
