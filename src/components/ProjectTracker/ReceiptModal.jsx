'use client';

import React, { useRef } from 'react';
import { FiX, FiPrinter, FiCheckCircle } from 'react-icons/fi';
import { bdt, fmtDate, packageLabel } from '@/lib/projectTracker';

const BRAND = '#FD9A00';

export default function ReceiptModal({ project: p, onClose }) {
    const ref = useRef(null);

    const print = () => {
        const html = ref.current?.innerHTML;
        if (!html) return;
        const win = window.open('', '_blank', 'width=800,height=900');
        win.document.write(`
            <html><head><title>Money Receipt - ${p.clientName}</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
                *{box-sizing:border-box;font-family:'Poppins','Segoe UI',Arial,sans-serif;}
                body{margin:0;padding:32px;color:#1e293b;}
                .brand{color:${BRAND};}
            </style></head><body>${html}</body></html>`);
        win.document.close();
        win.focus();
        setTimeout(() => { win.print(); }, 300);
    };

    const receiptNo = `EWR-${(p._id || '').toString().slice(-6).toUpperCase()}`;
    // watermark logo — print window-এ relative path resolve হয় না, তাই absolute URL
    const logoSrc = (typeof window !== 'undefined' ? window.location.origin : '') + '/extrain-logo.png';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
                {/* Toolbar */}
                <div className="sticky top-0 flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-white">
                    <span className="font-bold text-slate-800">Money Receipt</span>
                    <div className="flex items-center gap-2">
                        <button onClick={print} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold text-sm" style={{ background: BRAND }}>
                            <FiPrinter size={15} /> Print / PDF
                        </button>
                        <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:bg-slate-100"><FiX /></button>
                    </div>
                </div>

                {/* Receipt body */}
                <div ref={ref} className="receipt-poppins p-8" style={{ position: 'relative', overflow: 'hidden' }}>
                    {/* faint logo watermark — anti-copy জলছাপ (কন্টেন্টের উপরে; inline style যাতে print window-এও কাজ করে) */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={logoSrc} alt="" aria-hidden="true" draggable="false"
                        style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '68%', maxWidth: 380, opacity: 0.05, pointerEvents: 'none', userSelect: 'none', zIndex: 20 }} />
                    <div style={{ position: 'relative', zIndex: 1 }}>
                    <div className="flex items-start justify-between border-b-2 pb-4 mb-5" style={{ borderColor: BRAND }}>
                        <div>
                            <h1 className="text-2xl font-extrabold" style={{ color: BRAND }}>Extrain Web</h1>
                        </div>
                        <div className="text-right text-xs text-slate-500">
                            <p className="font-bold text-slate-700 text-sm">MONEY RECEIPT</p>
                            <p>#{receiptNo}</p>
                            <p>{fmtDate(new Date())}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mb-5 text-emerald-600">
                        <FiCheckCircle /> <span className="font-semibold">Payment Confirmed</span>
                    </div>

                    {/* Client */}
                    <table style={{ width: '100%', fontSize: '14px', marginBottom: '20px' }}>
                        <tbody>
                            <tr><td style={{ padding: '4px 0', color: '#64748b' }}>Client</td><td style={{ padding: '4px 0', fontWeight: 600, textAlign: 'right' }}>{p.clientName}</td></tr>
                            {p.companyBrand && <tr><td style={{ padding: '4px 0', color: '#64748b' }}>Company</td><td style={{ padding: '4px 0', textAlign: 'right' }}>{p.companyBrand}</td></tr>}
                            <tr><td style={{ padding: '4px 0', color: '#64748b' }}>Phone</td><td style={{ padding: '4px 0', textAlign: 'right' }}>{p.phone}</td></tr>
                            <tr><td style={{ padding: '4px 0', color: '#64748b' }}>Project</td><td style={{ padding: '4px 0', textAlign: 'right' }}>{p.websiteType} ({packageLabel(p.packageType)})</td></tr>
                        </tbody>
                    </table>

                    {/* Amounts */}
                    <div style={{ background: '#fff7ed', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                        <table style={{ width: '100%', fontSize: '14px' }}>
                            <tbody>
                                <tr><td style={{ padding: '6px 0', color: '#64748b' }}>Total Project Amount</td><td style={{ padding: '6px 0', fontWeight: 700, textAlign: 'right' }}>{bdt(p.totalProjectAmount)}</td></tr>
                                <tr><td style={{ padding: '6px 0', color: '#64748b' }}>Total Paid</td><td style={{ padding: '6px 0', fontWeight: 700, textAlign: 'right', color: '#059669' }}>{bdt(p.totalPaid)}</td></tr>
                                <tr style={{ borderTop: '1px dashed #fdba74' }}><td style={{ padding: '8px 0 2px', color: '#64748b', fontWeight: 600 }}>Due</td><td style={{ padding: '8px 0 2px', fontWeight: 800, textAlign: 'right', color: '#d97706', fontSize: '16px' }}>{bdt(p.totalDue)}</td></tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Installments */}
                    {p.installments?.length > 0 && (
                        <table style={{ width: '100%', fontSize: '13px', marginBottom: '16px', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#f1f5f9' }}>
                                    <th style={{ padding: '6px 8px', textAlign: 'left' }}>#</th>
                                    <th style={{ padding: '6px 8px', textAlign: 'left' }}>Note</th>
                                    <th style={{ padding: '6px 8px', textAlign: 'left' }}>Date</th>
                                    <th style={{ padding: '6px 8px', textAlign: 'right' }}>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {p.installments.map((i, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '6px 8px' }}>{i.no || idx + 1}</td>
                                        <td style={{ padding: '6px 8px' }}>{i.note || '—'}</td>
                                        <td style={{ padding: '6px 8px' }}>{fmtDate(i.date)}</td>
                                        <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 600 }}>{bdt(i.amount)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    <table style={{ width: '100%', fontSize: '14px', marginBottom: '20px' }}>
                        <tbody>
                            {p.projectDeliveryDate && <tr><td style={{ padding: '4px 0', color: '#64748b' }}>Delivery Date</td><td style={{ padding: '4px 0', fontWeight: 600, textAlign: 'right' }}>{fmtDate(p.projectDeliveryDate)}</td></tr>}
                            {p.nextPayDate && p.totalDue > 0 && <tr><td style={{ padding: '4px 0', color: '#64748b' }}>Next Payment Date</td><td style={{ padding: '4px 0', fontWeight: 600, textAlign: 'right' }}>{fmtDate(p.nextPayDate)}</td></tr>}
                        </tbody>
                    </table>

                    <p style={{ textAlign: 'center', fontSize: '12px', color: '#94a3b8', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                        ধন্যবাদ আমাদের সাথে থাকার জন্য • Extrain Web Team
                    </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
