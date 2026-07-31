'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { reactToPdf } from '@/lib/pdfCapture';
import {
    FiX, FiDownload, FiSend, FiSave, FiCheckCircle, FiMail, FiSettings, FiEye,
} from 'react-icons/fi';
import { ptApi, bdt, fmtDate, packageLabel } from '@/lib/projectTracker';

const BRAND = '#FD9A00';

// PDF এখন প্রিভিউ HTML থেকেই ছবি বানিয়ে তৈরি হয় (দেখুন @/lib/pdfCapture),
// তাই বাংলা নাম/কোম্পানি ও ৳ সব ঠিকঠাক আসে। currency আপাতত "Tk" রাখা হলো।
const money = (n) => 'Tk ' + Number(n || 0).toLocaleString('en-US');
const CONTACT_LINE = '+880 1711-946614   |   info.extrainweb@gmail.com   |   extrainweb.com';
export const DEFAULT_RECEIPT_MESSAGE = (name) =>
    `Dear ${name || 'Customer'}, thank you for your order. Please find your payment and project details below.`;

const ordinal = (n) => {
    const s = ['th', 'st', 'nd', 'rd'], v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

// নির্দিষ্ট installment এর জন্য tailored message (final হলে 100% complete)
function buildReceiptMessage(p, focusNo) {
    if (!focusNo) return DEFAULT_RECEIPT_MESSAGE(p.clientName);
    const inst = (p.installments || []).find((i) => i.no === focusNo);
    if (!inst) return DEFAULT_RECEIPT_MESSAGE(p.clientName);
    const amt = money(inst.amount);
    if ((p.totalDue || 0) <= 0) {
        return `Dear ${p.clientName}, congratulations! Your final payment of ${amt} has been received and your project payment is now 100% complete. Total Paid: ${money(p.totalPaid)}. Thank you for being with us!`;
    }
    const next = p.nextPayDate ? `, Next Payment Date: ${fmtDate(p.nextPayDate)}` : '';
    return `Dear ${p.clientName}, your ${ordinal(inst.no)} installment payment of ${amt} has been received. Total Paid: ${money(p.totalPaid)}, Due: ${money(p.totalDue)}${next}.`;
}

// রিসিটের টাকার সারিগুলো — PDF ও on-screen preview দুই জায়গাতেই এখান থেকেই আসে।
// [label, value, highlight, indent, dividerAbove]
export function buildAmountRows(p, options) {
    const domainAmt = p.domainSellIncluded || 0;
    const split = options.splitDomain && domainAmt > 0;
    const rows = [];

    if (split) {
        const webAmt = p.websiteAmount ?? Math.max(0, (p.totalProjectAmount || 0) - domainAmt);
        const webPaid = p.websitePaid ?? 0;
        const webDue = p.websiteDue ?? Math.max(0, webAmt - webPaid);
        const domPaid = p.domainPaidIncluded || 0;
        const domDue = p.domainDueIncluded ?? Math.max(0, domainAmt - domPaid);

        rows.push(['Website Development', money(webAmt), false, false, false]);
        if (options.paymentConfirmation) rows.push(['Paid', money(webPaid), false, true, false]);
        if (options.due !== false) rows.push(['Due', money(webDue), false, true, false]);

        rows.push(['Domain & Hosting', money(domainAmt), false, false, false]);
        if (options.paymentConfirmation) rows.push(['Paid', money(domPaid), false, true, false]);
        if (options.due !== false) rows.push(['Due', money(domDue), false, true, false]);
    }

    rows.push(['Total Project Amount', money(p.totalProjectAmount), false, false, split]);
    if (options.paymentConfirmation) rows.push(['Total Paid', money(p.totalPaid), false, false, false]);
    if (options.due !== false) rows.push(['Due', money(p.totalDue), true, false, false]);
    return rows;
}

// Money Receipt PDF — নিচের ReceiptPreview কেই (on-screen প্রিভিউ যেটা) হুবহু ছবি বানিয়ে
// A4 তে বসানো হয়। ব্রাউজার বাংলা shape করে বলে নাম/কোম্পানি/৳ সব নিখুঁত আসে।
export async function generateReceiptPdf(p, options, message, receiptNo) {
    return reactToPdf(
        <ReceiptPreview p={p} options={options} message={message} receiptNo={receiptNo} forPrint />
    );
}

export default function SendReceiptDialog({ isDark, project: p, focusInstallmentNo = null, onClose, onSent }) {
    const [options, setOptions] = useState({
        paymentConfirmation: true,
        installments: (p.installments?.length || 0) > 0,
        delivery: !!p.projectDeliveryDate,
        due: true,
        contact: true,
        // ডোমেইন/হোস্টিং প্রজেক্টের দামের ভিতরে থাকলে ডিফল্টে আলাদা করে দেখাই
        splitDomain: (p.domainSellIncluded || 0) > 0,
    });
    const [message, setMessage] = useState(buildReceiptMessage(p, focusInstallmentNo));
    const [busy, setBusy] = useState(false);
    const receiptNo = `EWR-${(p._id || '').toString().slice(-7).toUpperCase()}`;

    const toggle = (k) => (e) => setOptions({ ...options, [k]: e.target.checked });

    const download = async () => {
        const doc = await generateReceiptPdf(p, options, message, receiptNo);
        doc.save(`MoneyReceipt-${p.clientName || 'client'}-${receiptNo}.pdf`);
    };

    const send = async (sendEmail) => {
        setBusy(true);
        try {
            const res = await ptApi.sendReceipt(p._id, { options, message, sendEmail });
            toast.success(res.emailSent ? 'ইমেইলে পাঠানো হয়েছে ও ড্যাশবোর্ডে সেভ হয়েছে ✅' : 'ড্যাশবোর্ডে সেভ হয়েছে ✅');
            onSent && onSent(res);
            onClose();
        } catch (e) {
            toast.error(e.message);
        } finally {
            setBusy(false);
        }
    };

    const chk = 'flex items-center gap-2 text-sm cursor-pointer select-none';
    const card = isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-white border-slate-200';

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose} />
            <div className={`relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl shadow-2xl ${isDark ? 'bg-slate-900 border border-slate-700' : 'bg-white'}`}>
                {/* Header */}
                <div className={`sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-100'}`}>
                    <h2 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        <FiMail style={{ color: BRAND }} /> Order Confirmation & Money Receipt
                    </h2>
                    <button onClick={onClose} className={`p-2 rounded-lg ${isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-400 hover:bg-slate-100'}`}><FiX /></button>
                </div>

                <div className="p-6 grid md:grid-cols-5 gap-6">
                    {/* Customize panel */}
                    <div className="md:col-span-2 space-y-4">
                        <div className={`rounded-xl border p-4 ${card}`}>
                            <p className={`text-xs font-bold uppercase tracking-wide mb-3 flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}><FiSettings size={13} /> কী কী থাকবে</p>
                            <div className={`space-y-2.5 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                                <label className={chk}><input type="checkbox" checked={options.paymentConfirmation} onChange={toggle('paymentConfirmation')} className="w-4 h-4 accent-emerald-500" /> Payment Confirmation</label>
                                <label className={chk}><input type="checkbox" checked={options.installments} onChange={toggle('installments')} className="w-4 h-4 accent-orange-500" /> Installments টেবিল</label>
                                <label className={chk}><input type="checkbox" checked={options.delivery} onChange={toggle('delivery')} className="w-4 h-4 accent-orange-500" /> Delivery Date</label>
                                <label className={chk}><input type="checkbox" checked={options.due} onChange={toggle('due')} className="w-4 h-4 accent-orange-500" /> Due / Next Payment</label>
                                <label className={chk}><input type="checkbox" checked={options.contact} onChange={toggle('contact')} className="w-4 h-4 accent-orange-500" /> Contact তথ্য</label>
                                {(p.domainSellIncluded || 0) > 0 && (
                                    <>
                                        <label className={chk}><input type="checkbox" checked={options.splitDomain} onChange={toggle('splitDomain')} className="w-4 h-4 accent-teal-500" /> ওয়েবসাইট ও ডোমেইনের টাকা আলাদা</label>
                                        <p className={`text-[11px] pl-6 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                            {options.splitDomain
                                                ? `Website ${money(p.websiteAmount)} + Domain ${money(p.domainSellIncluded)} আলাদা লাইনে, নিচে মোট ${money(p.totalProjectAmount)}`
                                                : `শুধু মোট ${money(p.totalProjectAmount)} দেখাবে`}
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className={`text-xs font-semibold mb-1.5 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>মেসেজ (edit করতে পারেন)</label>
                            <textarea rows={4} value={message} onChange={(e) => setMessage(e.target.value)}
                                className={`w-full px-3 py-2.5 rounded-lg border text-sm outline-none ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`} />
                        </div>
                        {!p.email && (
                            <p className="text-xs text-amber-600 bg-amber-50 rounded-lg p-2">⚠️ এই ক্লায়েন্টের email নেই — শুধু PDF ডাউনলোড বা ড্যাশবোর্ডে সেভ করা যাবে।</p>
                        )}
                    </div>

                    {/* Live preview */}
                    <div className="md:col-span-3">
                        <p className={`text-xs font-bold uppercase tracking-wide mb-2 flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}><FiEye size={13} /> Preview</p>
                        <ReceiptPreview p={p} options={options} message={message} receiptNo={receiptNo} />
                    </div>
                </div>

                {/* Footer */}
                <div className={`sticky bottom-0 flex flex-wrap justify-end gap-3 px-6 py-4 border-t ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-100'}`}>
                    <button onClick={download} className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold ${isDark ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                        <FiDownload size={16} /> Download PDF
                    </button>
                    <button onClick={() => send(false)} disabled={busy} className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold disabled:opacity-60 ${isDark ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                        <FiSave size={16} /> Dashboard এ সেভ
                    </button>
                    <button onClick={() => send(true)} disabled={busy || !p.email} title={!p.email ? 'email নেই' : ''} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold shadow disabled:opacity-50" style={{ background: BRAND }}>
                        <FiSend size={16} /> {busy ? 'পাঠানো হচ্ছে...' : 'Email এ পাঠান'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// on-screen preview (email/PDF এর মতোই দেখতে)
function ReceiptPreview({ p, options, message, receiptNo, forPrint = false }) {
    const rowStyle = { padding: '5px 0', fontSize: 13 };
    // forPrint: PDF এ পেজ নিজেই ফ্রেম দেয়, তাই কার্ডের বর্ডার/শ্যাডো বাদ
    const frame = forPrint ? '' : 'rounded-xl border border-slate-200 shadow-sm';
    return (
        <div className={`receipt-poppins relative overflow-hidden bg-white p-6 text-slate-800 ${frame}`}>
            {/* faint logo watermark — anti-copy জলছাপ (কন্টেন্টের উপরে, uniform, কাটে না) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/extrain-logo.png" alt="" aria-hidden="true" draggable="false"
                style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '68%', maxWidth: 360, opacity: 0.05, pointerEvents: 'none', userSelect: 'none', zIndex: 20 }} />
            <div className="relative z-10">
            <div className="flex items-start justify-between border-b-2 pb-3 mb-4" style={{ borderColor: BRAND }}>
                <div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/extrain-logo.png" alt="Extrain Web" style={{ height: 34, width: 'auto', objectFit: 'contain' }} />
                </div>
                <div className="text-right text-[11px] text-slate-500">
                    <p className="font-bold text-slate-700 text-sm">MONEY RECEIPT</p>
                    {p.projectId && <p className="font-mono font-bold" style={{ color: BRAND }}>Project ID: {p.projectId}</p>}
                    <p>Receipt #{receiptNo}</p>
                    <p>{fmtDate(new Date())}</p>
                </div>
            </div>

            {options.paymentConfirmation && (
                <div className="inline-flex items-center gap-1.5 text-emerald-600 font-semibold text-sm mb-3">
                    <FiCheckCircle /> Payment Confirmed
                </div>
            )}
            {message && <p className="text-sm bg-orange-50 rounded-lg p-3 mb-4 text-slate-700 leading-relaxed">{message}</p>}

            <table style={{ width: '100%', marginBottom: 14 }}>
                <tbody>
                    <tr><td style={{ ...rowStyle, color: '#64748b' }}>Client</td><td style={{ ...rowStyle, textAlign: 'right', fontWeight: 600 }}>{p.clientName}</td></tr>
                    {p.companyBrand && <tr><td style={{ ...rowStyle, color: '#64748b' }}>Company</td><td style={{ ...rowStyle, textAlign: 'right' }}>{p.companyBrand}</td></tr>}
                    <tr><td style={{ ...rowStyle, color: '#64748b' }}>Phone</td><td style={{ ...rowStyle, textAlign: 'right' }}>{p.phone}</td></tr>
                    <tr><td style={{ ...rowStyle, color: '#64748b' }}>Project</td><td style={{ ...rowStyle, textAlign: 'right' }}>{p.websiteType} ({packageLabel(p.packageType)})</td></tr>
                </tbody>
            </table>

            <div style={{ background: '#fff7ed', borderRadius: 10, padding: 14, marginBottom: 14 }}>
                <table style={{ width: '100%' }}>
                    <tbody>
                        {buildAmountRows(p, options).map(([k, v, hi, indent, divider], idx) => (
                            <tr key={idx} style={divider ? { borderTop: '1px solid #ead6bc' } : undefined}>
                                <td style={{
                                    ...rowStyle,
                                    color: indent ? '#94a3b8' : '#64748b',
                                    fontWeight: hi ? 600 : 400,
                                    paddingLeft: indent ? 14 : 0,
                                    fontSize: indent ? 11 : undefined,
                                    paddingTop: divider ? 8 : undefined,
                                }}>{k}</td>
                                <td style={{
                                    ...rowStyle,
                                    textAlign: 'right',
                                    fontWeight: hi ? 600 : indent ? 500 : 600,
                                    color: hi ? '#d97706' : indent ? '#64748b' : '#1e293b',
                                    fontSize: indent ? 11 : undefined,
                                    paddingTop: divider ? 8 : undefined,
                                }}>{v}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {options.installments && p.installments?.length > 0 && (
                <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse', marginBottom: 14 }}>
                    <thead>
                        <tr style={{ background: '#f1f5f9' }}>
                            <th style={{ padding: 6, textAlign: 'left' }}>#</th>
                            <th style={{ padding: 6, textAlign: 'left' }}>Note</th>
                            <th style={{ padding: 6, textAlign: 'left' }}>Date</th>
                            <th style={{ padding: 6, textAlign: 'center' }}>Status</th>
                            <th style={{ padding: 6, textAlign: 'right' }}>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {p.installments.map((i, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: 6 }}>{i.no || idx + 1}</td>
                                <td style={{ padding: 6 }}>{i.note || '-'}</td>
                                <td style={{ padding: 6 }}>{fmtDate(i.date)}</td>
                                <td style={{ padding: 6, textAlign: 'center', color: i.paid === false ? '#d97706' : '#16a34a' }}>{i.paid === false ? 'Due' : 'Paid'}</td>
                                <td style={{ padding: 6, textAlign: 'right', fontWeight: 600 }}>{money(i.amount)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <table style={{ width: '100%', marginBottom: 8 }}>
                <tbody>
                    {options.delivery && p.projectDeliveryDate && <tr><td style={{ ...rowStyle, color: '#64748b' }}>Delivery Date</td><td style={{ ...rowStyle, textAlign: 'right', fontWeight: 600 }}>{fmtDate(p.projectDeliveryDate)}</td></tr>}
                    {options.due && p.nextPayDate && p.totalDue > 0 && <tr><td style={{ ...rowStyle, color: '#64748b' }}>Next Payment Date</td><td style={{ ...rowStyle, textAlign: 'right', fontWeight: 600 }}>{fmtDate(p.nextPayDate)}</td></tr>}
                </tbody>
            </table>

            {options.contact && (
                <div className="border-t border-slate-100 pt-3 mt-3 text-center">
                    <p className="text-[11px] font-semibold text-slate-600">Contact</p>
                    <p className="text-[11px] text-slate-500">{CONTACT_LINE}</p>
                </div>
            )}
            <p className="text-[11px] text-slate-400 text-center mt-3">Thank you for being with us  -  Extrain Web Team</p>
            </div>
        </div>
    );
}
