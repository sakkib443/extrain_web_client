'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
    FiUser, FiBriefcase, FiPhone, FiMail, FiGlobe, FiPackage,
    FiFileText, FiCheckCircle, FiCreditCard, FiHash, FiChevronRight,
    FiType, FiLink, FiCopy, FiGrid, FiHome, FiInfo,
} from 'react-icons/fi';
import { ptApi, WEBSITE_TYPES } from '@/lib/projectTracker';
import PaymentMethods from '@/components/sheard/PaymentMethods';
import { setStoredUser } from '@/lib/authUser';

const BRAND = '#FD9A00';

export default function ConfirmOrderPage() {
    const [form, setForm] = useState({
        clientName: '', companyBrand: '', phone: '', email: '',
        websiteType: '', packageType: 'without_domain_hosting',
        desiredWebsiteName: '', referenceWebsite: '', similarToWebsite: '', projectDetails: '',
    });
    const [ourWebsites, setOurWebsites] = useState([]);

    // "আমাদের কোন ওয়েবসাইটের মতো" dropdown এর জন্য আমাদের সাইট লিস্ট আনা
    useEffect(() => {
        ptApi.getOurWebsites().then((list) => setOurWebsites(list || [])).catch(() => { });
    }, []);

    // Logged-in user থাকলে নাম/ইমেইল/ফোন auto-fill (editable থাকে)
    useEffect(() => {
        try {
            if (typeof window === 'undefined') return;
            const raw = localStorage.getItem('user');
            if (!raw) return;
            const u = JSON.parse(raw);
            const name = `${u.firstName || ''} ${u.lastName || ''}`.trim();
            setForm((prev) => ({
                ...prev,
                clientName: prev.clientName || name,
                email: prev.email || u.email || '',
                phone: prev.phone || u.phone || u.phoneNumber || '',
            }));
        } catch { /* ignore */ }
    }, []);
    const [showPayment, setShowPayment] = useState(false);
    const [payment, setPayment] = useState({
        method: 'bkash', senderNumber: '', amount: '', transactionId: '', date: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(null);

    const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
    const setPay = (k) => (e) => setPayment({ ...payment, [k]: e.target.value });

    const submit = async (e) => {
        e.preventDefault();
        if (!form.clientName || !form.phone || !form.websiteType) {
            toast.error('নাম, ফোন এবং Website Type অবশ্যই দিন');
            return;
        }
        setSubmitting(true);
        try {
            const body = { ...form };
            if (showPayment && (payment.transactionId || payment.senderNumber)) {
                body.paymentInfo = {
                    method: payment.method,
                    senderNumber: payment.senderNumber,
                    amount: payment.amount ? Number(payment.amount) : undefined,
                    transactionId: payment.transactionId,
                    date: payment.date,
                };
            }
            const data = await ptApi.submitRequest(body);
            // Account তৈরি হলে auto-login — token + user localStorage এ রাখা
            if (data?.account?.accessToken && typeof window !== 'undefined') {
                localStorage.setItem('token', data.account.accessToken);
                setStoredUser(data.account.user); // undefined হলেও "undefined" জমা হবে না
            }
            setDone(data);
            toast.success('অর্ডার রিকোয়েস্ট জমা হয়েছে!');
        } catch (err) {
            toast.error(err.message || 'জমা দেওয়া যায়নি');
        } finally {
            setSubmitting(false);
        }
    };

    if (done) {
        const acc = done.account;
        const hasAccount = acc?.created || acc?.alreadyExists;
        return (
            <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-gradient-to-br from-orange-50 via-white to-amber-50">
                <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl border border-orange-100 p-8 md:p-10 text-center animate-[fadeUp_0.5s_ease]">
                    <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}`}</style>
                    <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{ background: `${BRAND}20` }}>
                        <FiCheckCircle size={44} style={{ color: BRAND }} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">ধন্যবাদ, {done.clientName}! 🎉</h1>
                    <p className="text-slate-500 leading-relaxed mb-5">
                        আপনার অর্ডার রিকোয়েস্ট সফলভাবে জমা হয়েছে। আমাদের টিম দ্রুত যোগাযোগ করে
                        অর্ডার কনফার্ম করবে এবং মানি রিসিট পাঠাবে।
                    </p>

                    {acc?.created && (
                        <div className="text-sm text-left rounded-2xl border border-emerald-100 bg-emerald-50 p-4 mb-6">
                            <p className="font-semibold text-emerald-800 mb-1">✅ আপনার অ্যাকাউন্ট তৈরি হয়েছে</p>
                            <p className="text-emerald-700">ইমেইল: <b>{acc.user?.email}</b></p>
                            <p className="text-emerald-700">পাসওয়ার্ড: <b>আপনার ফোন নম্বর</b> ({acc.user?.phone})</p>
                            <p className="text-emerald-600/80 text-xs mt-1">পরে যেকোনো সময় এই তথ্য দিয়ে লগইন করতে পারবেন।</p>
                        </div>
                    )}
                    {acc?.alreadyExists && (
                        <div className="text-sm text-left rounded-2xl border border-blue-100 bg-blue-50 p-4 mb-6">
                            <p className="text-blue-700">✅ আপনি লগইন অবস্থায় আছেন — সরাসরি ড্যাশবোর্ডে যেতে পারবেন।</p>
                        </div>
                    )}

                    {/* একসাথে একটাই পথ — Dashboard অথবা Home */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {hasAccount ? (
                            <Link href="/dashboard/user" className="flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-bold shadow-lg transition hover:opacity-90" style={{ background: BRAND }}>
                                <FiGrid /> ড্যাশবোর্ডে যান
                            </Link>
                        ) : (
                            <button
                                onClick={() => { setDone(null); setForm({ clientName: '', companyBrand: '', phone: '', email: '', websiteType: '', packageType: 'without_domain_hosting', desiredWebsiteName: '', referenceWebsite: '', similarToWebsite: '', projectDetails: '' }); }}
                                className="flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-bold shadow-lg transition hover:opacity-90" style={{ background: BRAND }}>
                                আরেকটি অর্ডার দিন
                            </button>
                        )}
                        <Link href="/" className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold border border-slate-200 text-slate-700 hover:bg-slate-50 transition">
                            <FiHome /> হোম পেজে যান
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const inputCls = "w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition text-slate-800";
    const iconCls = "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400";

    return (
        <div className="min-h-screen py-6 px-4 bg-gradient-to-br from-orange-50 via-white to-amber-50">
            <div className="container mx-auto">
                {/* Header - compact */}
                <div className="text-center mb-5">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-3" style={{ background: `${BRAND}18`, color: BRAND }}>
                        <FiPackage /> Confirm Your Custom Order
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800">অর্ডার কনফার্মেশন ফর্ম</h1>
                    <p className="text-slate-500 mt-2 max-w-2xl mx-auto text-sm">
                        আমাদের সাথে কথা বলে ডিল ফাইনাল হওয়ার পর ফর্মটি পূরণ করুন — আমরা রিকোয়েস্ট পেয়ে অর্ডার কনফার্ম করে মানি রিসিট পাঠাব।
                    </p>
                </div>

                <form onSubmit={submit} className="bg-white rounded-3xl shadow-xl border border-slate-100 p-5 md:p-7 space-y-4">
                    {/* Section label */}
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">ক্লায়েন্ট ও প্রজেক্ট তথ্য</p>

                    {/* ইংরেজিতে লেখার সুপারিশ — অনেকে বাংলায় লেখেন, কিন্তু নাম/কোম্পানি ইংরেজিতে হলে রিসিট-ডকুমেন্টে প্রফেশনাল দেখায় */}
                    <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-[13px] leading-relaxed text-amber-800">
                        <FiInfo className="mt-0.5 shrink-0" style={{ color: BRAND }} />
                        <span>অনুগ্রহ করে <b>নাম</b> ও <b>কোম্পানি/ব্র্যান্ডের নাম</b> ইংরেজিতে লিখুন (যেমন: <span className="font-semibold">Md Sumon Hossen</span>)। রিসিট ও অফিসিয়াল ডকুমেন্টে সুন্দর ও প্রফেশনাল দেখায়।</span>
                    </div>

                    {/* Client + basic info — 3 columns, compact */}
                    <div className="grid md:grid-cols-3 gap-3">
                        <div className="relative">
                            <FiUser className={iconCls} />
                            <input className={inputCls} placeholder="আপনার নাম * (ইংরেজিতে)" value={form.clientName} onChange={set('clientName')} />
                        </div>
                        <div className="relative">
                            <FiBriefcase className={iconCls} />
                            <input className={inputCls} placeholder="কোম্পানি / ব্র্যান্ড (ইংরেজিতে)" value={form.companyBrand} onChange={set('companyBrand')} />
                        </div>
                        <div className="relative">
                            <FiPhone className={iconCls} />
                            <input className={inputCls} placeholder="ফোন / WhatsApp *" value={form.phone} onChange={set('phone')} />
                        </div>
                        <div className="relative">
                            <FiMail className={iconCls} />
                            <input className={inputCls} placeholder="ইমেইল (optional)" value={form.email} onChange={set('email')} />
                        </div>
                        <div className="relative">
                            <FiGlobe className={iconCls} />
                            <select className={inputCls + ' appearance-none'} value={form.websiteType} onChange={set('websiteType')}>
                                <option value="">Website / Service Type *</option>
                                {WEBSITE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Project brief — সব optional */}
                    <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 space-y-3">
                        <p className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                            <FiFileText style={{ color: BRAND }} /> প্রজেক্ট ব্রিফ <span className="text-xs font-normal text-slate-400">(সব optional)</span>
                        </p>

                        <div className="grid md:grid-cols-3 gap-3">
                            <div className="relative">
                                <FiType className={iconCls} />
                                <input className={inputCls} placeholder="ওয়েবসাইটের নাম" value={form.desiredWebsiteName} onChange={set('desiredWebsiteName')} />
                            </div>
                            <div className="relative">
                                <FiLink className={iconCls} />
                                <input className={inputCls} placeholder="রেফারেন্স ওয়েবসাইট (link)" value={form.referenceWebsite} onChange={set('referenceWebsite')} />
                            </div>
                            <div className="relative">
                                <FiCopy className={iconCls} />
                                <select className={inputCls + ' appearance-none'} value={form.similarToWebsite} onChange={set('similarToWebsite')}>
                                    <option value="">আমাদের কোন সাইটের মতো?</option>
                                    {ourWebsites.map((w) => (
                                        <option key={w._id || w.slug || w.title} value={w.title}>{w.title}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="relative">
                            <FiFileText className="absolute left-4 top-3.5 text-slate-400" />
                            <textarea rows={2} className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition text-slate-800" placeholder="বিস্তারিত ব্রিফ — কী টাইপের ওয়েবসাইট চান, কী কী ফিচার লাগবে..." value={form.projectDetails} onChange={set('projectDetails')} />
                        </div>
                    </div>

                    {/* কোথায় টাকা পাঠাবে — পেমেন্ট মাধ্যম */}
                    <PaymentMethods variant="card" />

                    {/* Optional payment */}
                    <div className="rounded-2xl border border-dashed border-orange-200 bg-orange-50/50 p-4">
                        <label className="flex items-center gap-3 cursor-pointer select-none">
                            <input type="checkbox" checked={showPayment} onChange={(e) => setShowPayment(e.target.checked)} className="w-5 h-5 accent-orange-500" />
                            <span className="font-semibold text-slate-700 flex items-center gap-2">
                                <FiCreditCard style={{ color: BRAND }} /> পেমেন্ট করে থাকলে ডিটেইলস দিন <span className="text-xs font-normal text-slate-400">(optional)</span>
                            </span>
                        </label>

                        {showPayment && (
                            <div className="grid md:grid-cols-4 gap-3 mt-4">
                                <select className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white outline-none text-slate-800" value={payment.method} onChange={setPay('method')}>
                                    <option value="bkash">bKash</option>
                                    <option value="nagad">Nagad</option>
                                    <option value="rocket">Rocket</option>
                                    <option value="bank">Bank</option>
                                </select>
                                <input className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white outline-none text-slate-800" placeholder="যে নম্বর থেকে পাঠিয়েছেন" value={payment.senderNumber} onChange={setPay('senderNumber')} />
                                <input className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white outline-none text-slate-800" placeholder="Amount (৳)" type="number" value={payment.amount} onChange={setPay('amount')} />
                                <div className="relative">
                                    <FiHash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                                    <input className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 bg-white outline-none text-slate-800" placeholder="Transaction ID" value={payment.transactionId} onChange={setPay('transactionId')} />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Submit — inline row so it stays compact */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full sm:w-auto sm:min-w-[280px] flex items-center justify-center gap-2 py-3.5 px-8 rounded-xl text-white font-bold text-lg shadow-lg transition hover:opacity-90 disabled:opacity-60"
                            style={{ background: BRAND }}
                        >
                            {submitting ? 'জমা হচ্ছে...' : <>অর্ডার কনফার্ম করুন <FiChevronRight /></>}
                        </button>
                        <p className="text-xs text-slate-400">
                            Submit করলে আপনার তথ্য আমাদের টিমের কাছে রিকোয়েস্ট হিসেবে যাবে।
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
