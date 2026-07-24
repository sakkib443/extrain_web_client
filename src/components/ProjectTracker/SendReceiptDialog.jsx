'use client';

import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { registerPoppins } from '@/lib/poppinsFont';
import {
    FiX, FiDownload, FiSend, FiSave, FiCheckCircle, FiMail, FiSettings, FiEye,
} from 'react-icons/fi';
import { ptApi, bdt, fmtDate, packageLabel } from '@/lib/projectTracker';

const BRAND = '#FD9A00';

// Receipt এর সব লেখা English — jsPDF এর Helvetica ফন্ট Unicode (৳/বাংলা) render করতে পারে না।
// তাই currency "Tk" দিয়ে দেখানো হয় (৳ চিহ্ন garble হয়)।
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

// public/extrain-logo.png কে PNG dataURL হিসেবে লোড (PDF এ বসানোর জন্য)
function loadLogo() {
    return new Promise((resolve) => {
        try {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.naturalWidth;
                    canvas.height = img.naturalHeight;
                    canvas.getContext('2d').drawImage(img, 0, 0);
                    resolve({ dataUrl: canvas.toDataURL('image/png'), w: img.naturalWidth, h: img.naturalHeight });
                } catch { resolve(null); }
            };
            img.onerror = () => resolve(null);
            img.src = '/extrain-logo.png';
        } catch { resolve(null); }
    });
}

// Poppins এ Regular আর Bold-ই embed করা — মাঝের weight নেই। ডান পাশের মানগুলো
// Bold এ বেশি ভারী লাগে, তাই Regular এর উপর চুলের মতো সরু stroke দিয়ে semibold
// এর মতো দেখানো হয় (renderingMode: fillThenStroke)।
// 11pt এ Poppins Regular এর stem ≈ 0.97pt, Bold ≈ 1.54pt। 0.3pt stroke এ
// stem ≈ 1.27pt — অর্থাৎ SemiBold এর কাছাকাছি, Bold এর মতো ভারী নয়।
const SEMI = 0.3;
const setSemibold = (doc, r, g, b) => {
    doc.setFont('Poppins', 'normal');
    doc.setTextColor(r, g, b);
    doc.setDrawColor(r, g, b);
    doc.setLineWidth(SEMI);
};
const semiOpts = (extra) => ({ ...extra, renderingMode: 'fillThenStroke' });

// project থেকে professional English money receipt PDF (jsPDF) — async (logo লোড করে)
export async function generateReceiptPdf(p, options, message, receiptNo) {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    registerPoppins(doc); // পুরো রিসিট Poppins ফন্টে
    doc.setFont('Poppins', 'normal');
    const W = doc.internal.pageSize.getWidth();
    const M = 44;
    let y = 50;

    const logo = await loadLogo();

    // ---- Header: logo (left) + receipt meta (right) ----
    if (logo && logo.w && logo.h) {
        const h = 34;
        const w = Math.min(160, logo.w * (h / logo.h));
        doc.addImage(logo.dataUrl, 'PNG', M, y - 12, w, h);
    } else {
        doc.setFontSize(22); doc.setTextColor(253, 154, 0); doc.setFont('Poppins', 'bold');
        doc.text('Extrain Web', M, y + 8);
    }

    doc.setFontSize(15); doc.setTextColor(30); doc.setFont('Poppins', 'bold');
    doc.text('MONEY RECEIPT', W - M, y, { align: 'right' });
    let ry = y + 16;
    if (p.projectId) {
        doc.setFontSize(9); doc.setTextColor(253, 154, 0); doc.setFont('Poppins', 'bold');
        doc.text(`Project ID: ${p.projectId}`, W - M, ry, { align: 'right' }); ry += 12;
    }
    doc.setFontSize(9); doc.setTextColor(120); doc.setFont('Poppins', 'normal');
    doc.text(`Receipt #${receiptNo || '-'}`, W - M, ry, { align: 'right' }); ry += 12;
    doc.text(fmtDate(new Date()), W - M, ry, { align: 'right' });

    y += 56;
    doc.setDrawColor(253, 154, 0); doc.setLineWidth(2); doc.line(M, y, W - M, y);
    y += 24;

    // ---- Payment confirmed badge ----
    if (options.paymentConfirmation) {
        doc.setFillColor(220, 252, 231); doc.roundedRect(M, y - 13, 138, 20, 4, 4, 'F');
        doc.setTextColor(22, 163, 74); doc.setFont('Poppins', 'bold'); doc.setFontSize(10);
        doc.text('PAYMENT CONFIRMED', M + 10, y + 1);
        y += 26;
    }

    // ---- Message ----
    if (message) {
        doc.setTextColor(71, 85, 105); doc.setFont('Poppins', 'normal'); doc.setFontSize(10.5);
        const lines = doc.splitTextToSize(message, W - 2 * M);
        doc.text(lines, M, y);
        y += lines.length * 14 + 12;
    }

    // ---- Client info ----
    doc.setFontSize(10);
    const info = [
        ['Client', p.clientName || '-'],
        ...(p.companyBrand ? [['Company', p.companyBrand]] : []),
        ['Phone', p.phone || '-'],
        ['Project', `${p.websiteType || ''} (${packageLabel(p.packageType)})`],
    ];
    info.forEach(([k, v]) => {
        doc.setTextColor(100); doc.setFont('Poppins', 'normal'); doc.text(k, M, y);
        setSemibold(doc, 30, 41, 59);
        doc.text(String(v), W - M, y, semiOpts({ align: 'right' }));
        y += 19;
    });
    y += 8;

    // ---- Amounts box ----
    const amounts = buildAmountRows(p, options);
    const boxH = amounts.length * 22 + 14;
    doc.setFillColor(255, 247, 237); doc.roundedRect(M, y, W - 2 * M, boxH, 8, 8, 'F');
    let ay = y + 22;
    amounts.forEach(([k, v, hi, indent, divider]) => {
        if (divider) {
            doc.setDrawColor(234, 214, 188); doc.setLineWidth(0.5);
            doc.line(M + 16, ay - 14, W - M - 16, ay - 14);
        }
        doc.setFont('Poppins', 'normal'); doc.setFontSize(hi ? 12 : indent ? 9.5 : 11);
        doc.setTextColor(indent ? 140 : 100);
        doc.text(k, M + (indent ? 30 : 16), ay);
        doc.setFontSize(hi ? 12 : indent ? 9.5 : 11);
        if (hi) setSemibold(doc, 217, 119, 6);
        else if (indent) setSemibold(doc, 100, 116, 139);
        else setSemibold(doc, 30, 41, 59);
        doc.text(v, W - M - 16, ay, semiOpts({ align: 'right' }));
        ay += 22;
    });
    y += boxH + 20;

    // ---- Installments ----
    if (options.installments && p.installments?.length) {
        autoTable(doc, {
            startY: y, margin: { left: M, right: M },
            head: [['#', 'Note', 'Date', 'Status', 'Amount']],
            body: p.installments.map((i, idx) => [
                i.no || idx + 1, i.note || '-', fmtDate(i.date),
                i.paid === false ? 'Due' : 'Paid', money(i.amount),
            ]),
            headStyles: { fillColor: [253, 154, 0], textColor: 255, fontSize: 9, fontStyle: 'bold', font: 'Poppins' },
            styles: { fontSize: 9, cellPadding: 5, font: 'Poppins' },
            alternateRowStyles: { fillColor: [250, 250, 250] },
            columnStyles: { 4: { halign: 'right' } },
        });
        y = doc.lastAutoTable.finalY + 18;
    }

    // ---- Dates ----
    const extra = [];
    if (options.delivery && p.projectDeliveryDate) extra.push(['Delivery Date', fmtDate(p.projectDeliveryDate)]);
    if (options.due !== false && p.nextPayDate && p.totalDue > 0) extra.push(['Next Payment Date', fmtDate(p.nextPayDate)]);
    extra.forEach(([k, v]) => {
        doc.setFontSize(10); doc.setFont('Poppins', 'normal'); doc.setTextColor(100); doc.text(k, M, y);
        setSemibold(doc, 30, 41, 59);
        doc.text(v, W - M, y, semiOpts({ align: 'right' }));
        y += 19;
    });
    y += 10;

    // ---- Contact + footer ----
    if (options.contact) {
        doc.setDrawColor(226, 232, 240); doc.setLineWidth(0.5); doc.line(M, y, W - M, y); y += 16;
        doc.setFontSize(9.5); doc.setFont('Poppins', 'bold'); doc.setTextColor(90);
        doc.text('Contact', M, y);
        doc.setFont('Poppins', 'normal'); doc.setTextColor(110);
        doc.text(CONTACT_LINE, M, y + 14);
        y += 30;
    }
    // Footer পেজের একদম নিচে পিন (content ছোট হলেও নিচেই থাকবে; বড় হলে content এর পরে)
    const H = doc.internal.pageSize.getHeight();
    const footerY = Math.max(y + 20, H - 42);
    doc.setDrawColor(226, 232, 240); doc.setLineWidth(0.5); doc.line(M, footerY - 16, W - M, footerY - 16);
    doc.setFontSize(9); doc.setFont('Poppins', 'normal'); doc.setTextColor(160);
    doc.text('Thank you for being with us  -  Extrain Web Team', W / 2, footerY, { align: 'center' });

    // ---- Faint logo watermark (anti-copy জলছাপ) — সবার উপরে, page center-এ, uniform (কাটে না) ----
    if (logo && logo.w && logo.h) {
        try {
            const ww = Math.min(W * 0.68, 380);
            const wh = ww * (logo.h / logo.w);
            doc.saveGraphicsState();
            doc.setGState(new doc.GState({ opacity: 0.05 }));
            doc.addImage(logo.dataUrl, 'PNG', (W - ww) / 2, (H - wh) / 2, ww, wh);
            doc.restoreGraphicsState();
        } catch { /* GState না থাকলে watermark skip */ }
    }

    return doc;
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
function ReceiptPreview({ p, options, message, receiptNo }) {
    const rowStyle = { padding: '5px 0', fontSize: 13 };
    return (
        <div className="receipt-poppins relative overflow-hidden bg-white rounded-xl border border-slate-200 p-6 text-slate-800 shadow-sm">
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
