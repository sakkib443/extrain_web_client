'use client';

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiFileText, FiDownload, FiRefreshCw, FiCalendar, FiCheckCircle } from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import { ptApi, bdt, fmtDate } from '@/lib/projectTracker';
import { generateReceiptPdf } from '@/components/ProjectTracker/SendReceiptDialog';

export default function UserReceiptsPage() {
    const { isDark } = useTheme();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        try { setProjects(await ptApi.getMyReceipts()); }
        catch (e) { toast.error(e.message); }
        finally { setLoading(false); }
    };
    useEffect(() => { load(); }, []);

    const downloadReceipt = async (p, r) => {
        const options = r.options || { paymentConfirmation: true, installments: true, delivery: true, due: true, contact: true };
        const doc = await generateReceiptPdf(p, options, r.message, r.receiptNo);
        doc.save(`MoneyReceipt-${r.receiptNo}.pdf`);
    };

    const card = isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-white border-slate-200';
    const muted = isDark ? 'text-slate-400' : 'text-slate-500';

    // প্রতিটা receipt আলাদা row হিসেবে
    const rows = projects.flatMap((p) => (p.receipts || []).map((r) => ({ p, r })));

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h1 className={`text-2xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        <FiFileText style={{ color: '#FD9A00' }} /> Money Receipts
                    </h1>
                    <p className={`text-sm ${muted}`}>আপনার অর্ডারের মানি রিসিট — এখান থেকে ডাউনলোড করুন</p>
                </div>
                <button onClick={load} className={`p-2.5 rounded-xl transition ${isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                    <FiRefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

            {loading ? (
                <div className={`text-center py-16 ${muted}`}>লোড হচ্ছে...</div>
            ) : rows.length === 0 ? (
                <div className={`text-center py-20 rounded-2xl border border-dashed ${isDark ? 'border-slate-700 text-slate-400' : 'border-slate-300 text-slate-500'}`}>
                    <FiFileText size={40} className="mx-auto mb-3 opacity-50" />
                    এখনো কোনো রিসিট নেই। অর্ডার কনফার্ম হলে এখানে রিসিট দেখা যাবে।
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-4">
                    {rows.map(({ p, r }, i) => (
                        <div key={i} className={`rounded-2xl border p-5 shadow-sm ${card}`}>
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{p.websiteType}</p>
                                        {p.projectId && <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 rounded" style={{ background: '#FD9A0018', color: '#FD9A00' }}>{p.projectId}</span>}
                                    </div>
                                    <p className={`text-xs ${muted}`}>Receipt #{r.receiptNo}</p>
                                </div>
                                {r.options?.paymentConfirmation && (
                                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full"><FiCheckCircle size={12} /> Confirmed</span>
                                )}
                            </div>
                            <div className={`grid grid-cols-3 gap-2 text-sm mb-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                <div><p className={`text-xs ${muted}`}>Total</p><p className="font-semibold">{bdt(p.totalProjectAmount)}</p></div>
                                <div><p className={`text-xs ${muted}`}>Paid</p><p className="font-semibold text-emerald-500">{bdt(p.totalPaid)}</p></div>
                                <div><p className={`text-xs ${muted}`}>Due</p><p className="font-semibold text-amber-500">{bdt(p.totalDue)}</p></div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className={`text-xs flex items-center gap-1 ${muted}`}><FiCalendar size={12} /> {fmtDate(r.sentAt)}</span>
                                <button onClick={() => downloadReceipt(p, r)} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white font-semibold text-sm shadow" style={{ background: '#FD9A00' }}>
                                    <FiDownload size={15} /> Download PDF
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
