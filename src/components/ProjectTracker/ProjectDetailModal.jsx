'use client';

import React from 'react';
import {
    FiX, FiEdit3, FiFileText, FiUser, FiBriefcase, FiPhone, FiMail,
    FiGlobe, FiPackage, FiCalendar, FiCheckCircle, FiClock,
} from 'react-icons/fi';
import { bdt, fmtDate, packageLabel, statusStyle } from '@/lib/projectTracker';

const BRAND = '#FD9A00';

const Row = ({ isDark, icon: Icon, label, value }) => {
    if (value === undefined || value === null || value === '') return null;
    return (
        <div className="flex items-start gap-2">
            {Icon && <Icon size={14} className={`mt-0.5 shrink-0 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />}
            <div className="min-w-0">
                <p className={`text-[11px] uppercase tracking-wide ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{label}</p>
                <p className={`text-sm font-medium break-words ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{value}</p>
            </div>
        </div>
    );
};

const Stat = ({ isDark, label, value, cls }) => (
    <div className={`rounded-xl p-3 border ${isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
        <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{label}</p>
        <p className={`text-lg font-bold ${cls || (isDark ? 'text-white' : 'text-slate-800')}`}>{value}</p>
    </div>
);

export default function ProjectDetailModal({ isDark, project: p, onClose, onEdit, onReceipt }) {
    const section = `rounded-xl p-4 ${isDark ? 'bg-slate-800/40' : 'bg-slate-50/70'}`;
    const heading = `text-xs font-bold uppercase tracking-wide mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
            <div className={`relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-2xl shadow-2xl ${isDark ? 'bg-slate-900 border border-slate-700' : 'bg-white'}`}>
                {/* Header */}
                <div className={`sticky top-0 z-10 px-6 py-4 border-b ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-100'}`}>
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{p.clientName}</h2>
                                {p.projectId && <span className="font-mono text-sm font-bold px-2.5 py-1 rounded-lg" style={{ background: `${BRAND}18`, color: BRAND }}>{p.projectId}</span>}
                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusStyle(p.status)}`}>{p.status}</span>
                            </div>
                            {p.companyBrand && <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{p.companyBrand}</p>}
                        </div>
                        <button onClick={onClose} className={`p-2 rounded-lg ${isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-400 hover:bg-slate-100'}`}><FiX /></button>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    {/* Money summary — full width */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <Stat isDark={isDark} label="Total" value={bdt(p.totalProjectAmount)} />
                        <Stat isDark={isDark} label="Paid" value={bdt(p.totalPaid)} cls="text-emerald-500" />
                        <Stat isDark={isDark} label="Due" value={bdt(p.totalDue)} cls="text-amber-500" />
                        <Stat isDark={isDark} label="Due %" value={`${p.duePercentage || 0}%`} />
                    </div>

                    {/* বাকি section গুলো 2-column এ flow করে — স্ক্রল কমাতে */}
                    <div className="lg:columns-2 lg:gap-4 [&>*]:mb-4 [&>*]:break-inside-avoid">
                    {/* Client + project info */}
                    <div className={section}>
                        <p className={heading}>Client & Project</p>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <Row isDark={isDark} icon={FiPhone} label="Phone" value={p.phone} />
                            <Row isDark={isDark} icon={FiMail} label="Email" value={p.email} />
                            <Row isDark={isDark} icon={FiGlobe} label="Website / Service Type" value={p.websiteType} />
                            <Row isDark={isDark} icon={FiPackage} label="Package" value={packageLabel(p.packageType)} />
                        </div>
                    </div>

                    {/* Domain / Hosting (linked থাকলে) */}
                    {p.hasDomainHosting && p.linkedDomains?.length > 0 && (
                        <div className={section}>
                            <p className={heading}>Domain / Hosting</p>
                            <div className="space-y-2">
                                {p.linkedDomains.map((d, i) => (
                                    <div key={i} className={`flex items-center justify-between gap-3 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                        <span className="min-w-0 truncate">
                                            <span className="font-semibold">{d.domainName}</span>
                                            <span className="text-xs ml-1">({d.type === 'both' ? 'Domain + Hosting' : d.type === 'hosting' ? 'Hosting' : 'Domain'}{d.hostingGB ? ` ${d.hostingGB}GB` : ''})</span>
                                        </span>
                                        <span className="shrink-0 text-xs">
                                            buy {bdt(d.buyPrice)} • sell {bdt(d.sellPrice)} • <b className={(d.profit || 0) >= 0 ? 'text-emerald-500' : 'text-rose-500'}>{bdt(d.profit)}</b>
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Brief */}
                    {(p.desiredWebsiteName || p.referenceWebsite || p.similarToWebsite || p.projectDetails) && (
                        <div className={section}>
                            <p className={heading}>Client Brief</p>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <Row isDark={isDark} label="Website Name" value={p.desiredWebsiteName} />
                                <Row isDark={isDark} label="Similar To" value={p.similarToWebsite} />
                                <Row isDark={isDark} label="Reference Website" value={p.referenceWebsite} />
                            </div>
                            {p.projectDetails && <p className={`text-sm mt-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{p.projectDetails}</p>}
                        </div>
                    )}

                    {/* Installments */}
                    {p.installments?.length > 0 && (
                        <div>
                            <p className={heading}>Payment Installments {p.installmentCount ? `(${p.installmentCount})` : ''}</p>
                            <div className={`rounded-xl border overflow-hidden ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                                <table className="w-full text-sm">
                                    <thead className={isDark ? 'bg-slate-800' : 'bg-slate-50'}>
                                        <tr className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                                            <th className="px-3 py-2 text-left text-xs font-bold">#</th>
                                            <th className="px-3 py-2 text-left text-xs font-bold">Note</th>
                                            <th className="px-3 py-2 text-left text-xs font-bold">Date</th>
                                            <th className="px-3 py-2 text-center text-xs font-bold">Status</th>
                                            <th className="px-3 py-2 text-right text-xs font-bold">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className={isDark ? 'divide-y divide-slate-700/50' : 'divide-y divide-slate-100'}>
                                        {p.installments.map((i, idx) => (
                                            <tr key={idx} className={isDark ? 'text-slate-200' : 'text-slate-700'}>
                                                <td className="px-3 py-2">{i.no || idx + 1}</td>
                                                <td className="px-3 py-2">{i.note || '—'}</td>
                                                <td className="px-3 py-2">{fmtDate(i.date)}</td>
                                                <td className="px-3 py-2 text-center">
                                                    <span className={`text-xs font-semibold ${i.paid === false ? 'text-amber-500' : 'text-emerald-500'}`}>{i.paid === false ? 'Due' : 'Paid'}</span>
                                                </td>
                                                <td className={`px-3 py-2 text-right font-semibold ${(Number(i.amount) || 0) < 0 ? 'text-rose-500' : ''}`}>{bdt(i.amount)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Dates */}
                    <div className={section}>
                        <p className={heading}>Timeline</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <Row isDark={isDark} icon={FiCalendar} label="Order Date" value={fmtDate(p.orderDate)} />
                            <Row isDark={isDark} icon={FiClock} label="Next Pay Date" value={p.nextPayDate ? fmtDate(p.nextPayDate) : null} />
                            <Row isDark={isDark} icon={FiCheckCircle} label="Delivery Date" value={p.projectDeliveryDate ? fmtDate(p.projectDeliveryDate) : null} />
                            <Row isDark={isDark} icon={FiCalendar} label="Project Start" value={p.projectStartDate ? fmtDate(p.projectStartDate) : null} />
                            <Row isDark={isDark} icon={FiCalendar} label="Message Date" value={p.messageDate ? fmtDate(p.messageDate) : null} />
                            {p.workingDays ? <Row isDark={isDark} icon={FiClock} label="Working Days" value={`${p.workingDays} days`} /> : null}
                        </div>
                    </div>

                    {/* Payment claim (if any) */}
                    {p.paymentInfo && (p.paymentInfo.transactionId || p.paymentInfo.senderNumber) && (
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
                            <p className="font-semibold mb-1">Client Payment Claim</p>
                            <p>{(p.paymentInfo.method || '').toUpperCase()} • {p.paymentInfo.senderNumber} {p.paymentInfo.amount ? `• ${bdt(p.paymentInfo.amount)}` : ''} {p.paymentInfo.transactionId ? `• TrxID: ${p.paymentInfo.transactionId}` : ''}</p>
                        </div>
                    )}

                    {p.adminNote && (
                        <div className={section}>
                            <p className={heading}>Admin Note</p>
                            <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{p.adminNote}</p>
                        </div>
                    )}

                    {/* Receipts sent */}
                    {p.receipts?.length > 0 && (
                        <div className={section}>
                            <p className={heading}>Receipts Sent ({p.receipts.length})</p>
                            <div className="space-y-1">
                                {p.receipts.map((r, idx) => (
                                    <div key={idx} className={`flex items-center justify-between text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                        <span className="font-mono">{r.receiptNo}</span>
                                        <span className="text-xs">{fmtDate(r.sentAt)} {r.emailSent ? '• emailed' : ''}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    </div>
                </div>

                {/* Footer */}
                <div className={`sticky bottom-0 flex flex-wrap justify-end gap-3 px-6 py-4 border-t ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-100'}`}>
                    <button onClick={onClose} className={`px-5 py-2.5 rounded-xl font-semibold ${isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Close</button>
                    {onReceipt && (
                        <button onClick={() => onReceipt(p)} className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold ${isDark ? 'bg-slate-800 text-emerald-400 hover:bg-slate-700' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}>
                            <FiFileText size={16} /> Receipt
                        </button>
                    )}
                    {onEdit && (
                        <button onClick={() => onEdit(p)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold shadow" style={{ background: BRAND }}>
                            <FiEdit3 size={16} /> Edit
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
