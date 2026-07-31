'use client';

import React, { useState } from 'react';
import {
    FiX, FiDownload, FiFileText, FiSettings, FiEye, FiPlus, FiTrash2, FiRotateCcw,
} from 'react-icons/fi';
import { reactToPdf } from '@/lib/pdfCapture';
import { BRAND, CONTACT_LINE, money } from '@/lib/pdfBrand';
import { fmtDate } from '@/lib/projectTracker';

// ---------- ডিফল্ট টেমপ্লেট (সব লেখা edit করা যাবে) ----------
export const BILL_TEMPLATE = {
    welcome: 'Welcome to Extrain Web',
    intro:
        'Thank you for your interest in our service. Below is the bill for your website project with full details and pricing. Please review it and let us know if you have any questions.',
    note:
        'Work starts after the advance payment is received. Full source code and access are handed over after final payment. Free support for 30 days after delivery.',
    terms: 'This bill is valid for 7 days from the date of issue.',
};

const DH_OPTIONS = [
    { k: 'included', label: 'Included (ফ্রি দিচ্ছি)', cell: 'Included' },
    { k: 'charged', label: 'Extra charge (আলাদা টাকা)', cell: null },
    { k: 'not_included', label: 'Not included (দিচ্ছি না)', cell: 'Not Included' },
];

// request থেকে ডিফল্ট ফর্ম বানায়
export function buildBillForm(r) {
    return {
        ...BILL_TEMPLATE,
        items: [
            {
                desc: `Website Development - ${r.websiteType || 'Website'}`,
                amount: Number(r.totalProjectAmount) || 0,
            },
        ],
        deliveryDays: '',
        domainHosting: r.packageType === 'with_domain_hosting' ? 'included' : 'not_included',
        dhAmount: '',
    };
}

const dhCell = (form) => {
    if (form.domainHosting === 'charged') return money(Number(form.dhAmount) || 0);
    return DH_OPTIONS.find((o) => o.k === form.domainHosting)?.cell || 'Not Included';
};

export const billTotal = (form) =>
    (form.items || []).reduce((s, i) => s + (Number(i.amount) || 0), 0) +
    (form.domainHosting === 'charged' ? Number(form.dhAmount) || 0 : 0);

// ---------- PDF ----------
// Bill PDF — নিচের BillPreview কেই (on-screen প্রিভিউ) হুবহু ছবি বানিয়ে A4 তে বসানো হয়।
// ব্রাউজার বাংলা shape করে বলে ক্লায়েন্টের বাংলা নাম/কোম্পানি ও ৳ সব ঠিকঠাক আসে।
export async function generateBillPdf(r, form, options, billNo) {
    return reactToPdf(
        <BillPreview r={r} form={form} options={options} billNo={billNo} forPrint />
    );
}

// ---------- Dialog ----------
export default function GenerateBillDialog({ isDark, request: r, onClose }) {
    const [form, setForm] = useState(() => buildBillForm(r));
    const [options, setOptions] = useState({ clientInfo: true, note: true, terms: true, contact: true });
    const billNo = `EWB-${(r._id || '').toString().slice(-7).toUpperCase()}`;

    const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
    const toggle = (k) => (e) => setOptions({ ...options, [k]: e.target.checked });

    const setItem = (idx, key, val) => {
        const items = form.items.map((it, i) => (i === idx ? { ...it, [key]: val } : it));
        setForm({ ...form, items });
    };
    const addItem = () => setForm({ ...form, items: [...form.items, { desc: '', amount: '' }] });
    const removeItem = (idx) => setForm({ ...form, items: form.items.filter((_, i) => i !== idx) });
    const resetTemplate = () => setForm({ ...form, ...BILL_TEMPLATE });

    const download = async () => {
        const doc = await generateBillPdf(r, form, options, billNo);
        doc.save(`Bill-${r.clientName || 'client'}-${billNo}.pdf`);
    };

    const card = isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-white border-slate-200';
    const label = `text-xs font-semibold mb-1.5 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`;
    const input = `w-full px-3 py-2 rounded-lg border outline-none text-sm ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`;
    const chk = 'flex items-center gap-2 text-sm cursor-pointer select-none';

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose} />
            <div className={`relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-2xl shadow-2xl ${isDark ? 'bg-slate-900 border border-slate-700' : 'bg-white'}`}>
                {/* Header */}
                <div className={`sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-100'}`}>
                    <h2 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        <FiFileText style={{ color: BRAND }} /> Generate Bill — {r.clientName}
                    </h2>
                    <button onClick={onClose} className={`p-2 rounded-lg ${isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-400 hover:bg-slate-100'}`}><FiX /></button>
                </div>

                <div className="p-6 grid lg:grid-cols-5 gap-6">
                    {/* ---- Edit panel ---- */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className={`rounded-xl border p-4 space-y-3 ${card}`}>
                            <div className="flex items-center justify-between">
                                <p className={`text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}><FiSettings size={13} /> লেখা (edit করতে পারেন)</p>
                                <button onClick={resetTemplate} className={`text-[11px] inline-flex items-center gap-1 px-2 py-1 rounded-lg ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                                    <FiRotateCcw size={11} /> টেমপ্লেট
                                </button>
                            </div>
                            <div><label className={label}>Welcome / শিরোনাম</label><input className={input} value={form.welcome} onChange={set('welcome')} /></div>
                            <div><label className={label}>Intro / ভূমিকা</label><textarea rows={3} className={input} value={form.intro} onChange={set('intro')} /></div>
                        </div>

                        {/* Items */}
                        <div className={`rounded-xl border p-4 space-y-3 ${card}`}>
                            <div className="flex items-center justify-between">
                                <p className={`text-xs font-bold uppercase tracking-wide ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>বিলের লিস্ট</p>
                                <button onClick={addItem} className="text-[11px] inline-flex items-center gap-1 px-2 py-1 rounded-lg text-white" style={{ background: BRAND }}>
                                    <FiPlus size={11} /> যোগ
                                </button>
                            </div>
                            {form.items.map((it, idx) => (
                                <div key={idx} className="flex gap-2 items-center">
                                    <input className={input + ' flex-1'} placeholder="কাজের বর্ণনা" value={it.desc} onChange={(e) => setItem(idx, 'desc', e.target.value)} />
                                    <input type="number" className={input + ' w-28'} placeholder="টাকা" value={it.amount} onChange={(e) => setItem(idx, 'amount', e.target.value)} />
                                    <button onClick={() => removeItem(idx)} className="p-2 rounded-lg text-rose-500 hover:bg-rose-500/10 shrink-0"><FiTrash2 size={14} /></button>
                                </div>
                            ))}

                            <div><label className={label}>ডেলিভারি — কত দিন লাগবে</label><input type="number" className={input} placeholder="যেমন 7" value={form.deliveryDays} onChange={set('deliveryDays')} /></div>

                            <div>
                                <label className={label}>Domain & Hosting দিব কিনা</label>
                                <div className="flex flex-wrap gap-2">
                                    {DH_OPTIONS.map((o) => (
                                        <button key={o.k} type="button" onClick={() => setForm({ ...form, domainHosting: o.k })}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${form.domainHosting === o.k
                                                ? 'text-white border-transparent'
                                                : isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
                                            style={form.domainHosting === o.k ? { background: BRAND } : {}}>
                                            {o.label}
                                        </button>
                                    ))}
                                </div>
                                {form.domainHosting === 'charged' && (
                                    <input type="number" className={input + ' mt-2'} placeholder="ডোমেইন+হোস্টিং কত টাকা" value={form.dhAmount} onChange={set('dhAmount')} />
                                )}
                            </div>

                            <div className={`flex items-center justify-between pt-2 border-t ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                                <span className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Total Payable</span>
                                <span className="text-lg font-bold" style={{ color: BRAND }}>{money(billTotal(form))}</span>
                            </div>
                        </div>

                        <div className={`rounded-xl border p-4 space-y-3 ${card}`}>
                            <div><label className={label}>Note / শর্ত</label><textarea rows={3} className={input} value={form.note} onChange={set('note')} /></div>
                            <div><label className={label}>Validity / মেয়াদ</label><input className={input} value={form.terms} onChange={set('terms')} /></div>
                            <div className={`space-y-2 pt-1 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                                <label className={chk}><input type="checkbox" checked={options.clientInfo} onChange={toggle('clientInfo')} className="w-4 h-4 accent-orange-500" /> Client তথ্য</label>
                                <label className={chk}><input type="checkbox" checked={options.note} onChange={toggle('note')} className="w-4 h-4 accent-orange-500" /> Note</label>
                                <label className={chk}><input type="checkbox" checked={options.terms} onChange={toggle('terms')} className="w-4 h-4 accent-orange-500" /> Validity</label>
                                <label className={chk}><input type="checkbox" checked={options.contact} onChange={toggle('contact')} className="w-4 h-4 accent-orange-500" /> Contact তথ্য</label>
                            </div>
                        </div>

                        <p className="text-xs text-emerald-600 bg-emerald-50 rounded-lg p-2">
                            ✅ বাংলা লিখতে পারেন — PDF এখন প্রিভিউ যেমন দেখাচ্ছে হুবহু সেভাবেই তৈরি হয়, বাংলা ও ৳ ঠিকঠাক আসে।
                        </p>
                    </div>

                    {/* ---- Live preview ---- */}
                    <div className="lg:col-span-3">
                        <p className={`text-xs font-bold uppercase tracking-wide mb-2 flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}><FiEye size={13} /> Preview</p>
                        <BillPreview r={r} form={form} options={options} billNo={billNo} />
                    </div>
                </div>

                {/* Footer */}
                <div className={`sticky bottom-0 flex flex-wrap justify-end gap-3 px-6 py-4 border-t ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-100'}`}>
                    <button onClick={onClose} className={`px-4 py-2.5 rounded-xl font-semibold ${isDark ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-700'}`}>বন্ধ</button>
                    <button onClick={download} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold shadow" style={{ background: BRAND }}>
                        <FiDownload size={16} /> Download Bill PDF
                    </button>
                </div>
            </div>
        </div>
    );
}

// on-screen preview (PDF এর মতোই দেখতে)
function BillPreview({ r, form, options, billNo, forPrint = false }) {
    const row = { padding: '5px 0', fontSize: 13 };
    // forPrint: PDF এ পেজ নিজেই ফ্রেম দেয়, তাই কার্ডের বর্ডার/শ্যাডো বাদ
    const frame = forPrint ? '' : 'rounded-xl border border-slate-200 shadow-sm';
    const items = [
        ...(form.items || []).map((i) => [i.desc || '-', money(i.amount)]),
        ['Domain & Hosting (1 Year)', dhCell(form)],
        ...(form.deliveryDays ? [['Estimated Delivery Time', `${form.deliveryDays} days`]] : []),
    ];
    return (
        <div className={`receipt-poppins relative overflow-hidden bg-white p-6 text-slate-800 ${frame}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/extrain-logo.png" alt="" aria-hidden="true" draggable="false"
                style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '68%', maxWidth: 360, opacity: 0.05, pointerEvents: 'none', userSelect: 'none', zIndex: 20 }} />

            <div className="flex items-start justify-between border-b-2 pb-3 mb-4" style={{ borderColor: BRAND }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/extrain-logo.png" alt="Extrain Web" style={{ height: 34, width: 'auto', objectFit: 'contain' }} />
                <div className="text-right text-[11px] text-slate-500">
                    <p className="font-bold text-slate-700 text-sm">BILL</p>
                    {r.projectId && <p className="font-mono font-bold" style={{ color: BRAND }}>Project ID: {r.projectId}</p>}
                    <p>Bill #{billNo}</p>
                    <p>{fmtDate(new Date())}</p>
                </div>
            </div>

            {form.welcome && <p className="font-bold text-[15px] mb-1.5" style={{ color: BRAND }}>{form.welcome}</p>}
            {form.intro && <p className="text-sm text-slate-600 leading-relaxed mb-4">{form.intro}</p>}

            {options.clientInfo && (
                <table style={{ width: '100%', marginBottom: 14 }}>
                    <tbody>
                        <tr><td style={{ ...row, color: '#64748b' }}>Client</td><td style={{ ...row, textAlign: 'right', fontWeight: 600 }}>{r.clientName}</td></tr>
                        {r.companyBrand && <tr><td style={{ ...row, color: '#64748b' }}>Company</td><td style={{ ...row, textAlign: 'right' }}>{r.companyBrand}</td></tr>}
                        <tr><td style={{ ...row, color: '#64748b' }}>Phone</td><td style={{ ...row, textAlign: 'right' }}>{r.phone}</td></tr>
                        {r.email && <tr><td style={{ ...row, color: '#64748b' }}>Email</td><td style={{ ...row, textAlign: 'right' }}>{r.email}</td></tr>}
                        {r.desiredWebsiteName && <tr><td style={{ ...row, color: '#64748b' }}>Website Name</td><td style={{ ...row, textAlign: 'right' }}>{r.desiredWebsiteName}</td></tr>}
                    </tbody>
                </table>
            )}

            <table style={{ width: '100%', fontSize: 12.5, borderCollapse: 'collapse', marginBottom: 14 }}>
                <thead>
                    <tr style={{ background: BRAND, color: '#fff' }}>
                        <th style={{ padding: '6px 8px', textAlign: 'left', width: 28 }}>#</th>
                        <th style={{ padding: '6px 8px', textAlign: 'left' }}>Description</th>
                        <th style={{ padding: '6px 8px', textAlign: 'right' }}>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(([d, a], i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 ? '#fafafa' : '#fff' }}>
                            <td style={{ padding: '6px 8px' }}>{i + 1}</td>
                            <td style={{ padding: '6px 8px' }}>{d}</td>
                            <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 600 }}>{a}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{ background: '#fff7ed', borderRadius: 10, padding: '12px 16px', marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: '#64748b' }}>Total Payable</span>
                <span style={{ fontWeight: 800, fontSize: 17, color: '#d97706' }}>{money(billTotal(form))}</span>
            </div>

            {options.note && form.note && (
                <div className="mb-3">
                    <p className="text-[12px] font-semibold text-slate-600">Note</p>
                    <p className="text-[12px] text-slate-500 leading-relaxed">{form.note}</p>
                </div>
            )}
            {options.terms && form.terms && <p className="text-[11px] text-slate-400 mb-3">{form.terms}</p>}

            {options.contact && (
                <div className="border-t border-slate-100 pt-3">
                    <p className="text-[11px] font-semibold text-slate-600">Contact</p>
                    <p className="text-[11px] text-slate-500">{CONTACT_LINE}</p>
                </div>
            )}
            <p className="text-[11px] text-slate-400 text-center mt-3">Thank you for being with us  -  Extrain Web Team</p>
        </div>
    );
}
