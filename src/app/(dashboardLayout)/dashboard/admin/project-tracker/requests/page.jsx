'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
    FiArrowLeft, FiInbox, FiRefreshCw, FiCheckCircle, FiEdit3, FiX,
    FiPhone, FiGlobe, FiPackage, FiClock, FiCreditCard,
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import { ptApi, fmtDate, packageLabel, bdt } from '@/lib/projectTracker';
import ProjectModal from '@/components/ProjectTracker/ProjectModal';
import SendReceiptDialog from '@/components/ProjectTracker/SendReceiptDialog';

export default function RequestsPage() {
    const { isDark } = useTheme();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(null);
    const [editing, setEditing] = useState(null);   // edit + confirm modal (single flow)
    const [receiptFor, setReceiptFor] = useState(null); // confirm এর পর receipt popup

    const load = async () => {
        setLoading(true);
        try { setRequests(await ptApi.getRequests()); }
        catch (e) { toast.error(e.message); }
        finally { setLoading(false); }
    };
    useEffect(() => { load(); }, []);

    const reject = async (id) => {
        if (!confirm('এই রিকোয়েস্টটি reject করবেন?')) return;
        setBusy(id);
        try {
            await ptApi.rejectRequest(id);
            toast.success('Rejected');
            setRequests(requests.filter((r) => r._id !== id));
        } catch (e) { toast.error(e.message); }
        finally { setBusy(null); }
    };

    const card = isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-white border-slate-200';
    const muted = isDark ? 'text-slate-400' : 'text-slate-500';

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/admin/project-tracker" className={`p-2.5 rounded-xl transition ${isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                        <FiArrowLeft size={16} />
                    </Link>
                    <div>
                        <h1 className={`text-2xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            <FiInbox style={{ color: '#FD9A00' }} /> Order Requests
                        </h1>
                        <p className={`text-sm ${muted}`}>ক্লায়েন্ট ফর্ম থেকে আসা নতুন অর্ডার — Confirm করলে Tracker এ যাবে</p>
                    </div>
                </div>
                <button onClick={load} className={`p-2.5 rounded-xl transition ${isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                    <FiRefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

            {loading ? (
                <div className={`text-center py-16 ${muted}`}>লোড হচ্ছে...</div>
            ) : requests.length === 0 ? (
                <div className={`text-center py-20 rounded-2xl border border-dashed ${isDark ? 'border-slate-700 text-slate-400' : 'border-slate-300 text-slate-500'}`}>
                    <FiInbox size={40} className="mx-auto mb-3 opacity-50" />
                    কোনো নতুন রিকোয়েস্ট নেই।
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {requests.map((r) => (
                        <div key={r._id} className={`rounded-2xl border p-4 shadow-sm flex flex-col ${card}`}>
                            {/* compact header */}
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className={`font-bold truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>{r.clientName}</h3>
                                        {r.projectId && <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 rounded" style={{ background: '#FD9A0018', color: '#FD9A00' }}>{r.projectId}</span>}
                                    </div>
                                    {r.companyBrand && <p className={`text-xs truncate ${muted}`}>{r.companyBrand}</p>}
                                </div>
                                <span className={`shrink-0 text-[11px] flex items-center gap-1 ${muted}`}><FiClock size={11} /> {fmtDate(r.createdAt)}</span>
                            </div>

                            {/* compact info */}
                            <div className={`text-sm space-y-1 mb-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                <p className="flex items-center gap-1.5"><FiPhone size={13} /> {r.phone}</p>
                                <p className="flex items-center gap-1.5 truncate"><FiGlobe size={13} /> {r.websiteType}</p>
                                <p className="flex items-center gap-1.5 truncate"><FiPackage size={13} /> {packageLabel(r.packageType)}</p>
                                {r.paymentInfo?.transactionId && (
                                    <p className="flex items-center gap-1.5 text-emerald-500"><FiCreditCard size={13} /> পেমেন্ট claim আছে</p>
                                )}
                            </div>

                            {/* actions — একটাই flow: খুললে edit + confirm একসাথে */}
                            <div className="mt-auto grid grid-cols-3 gap-2">
                                <button onClick={() => setEditing(r)} disabled={busy === r._id}
                                    className="col-span-2 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-white font-semibold shadow hover:opacity-90 transition disabled:opacity-60" style={{ background: '#FD9A00' }}>
                                    <FiCheckCircle size={16} /> Confirm / Edit
                                </button>
                                <button onClick={() => reject(r._id)} disabled={busy === r._id}
                                    className="inline-flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm text-rose-500 hover:bg-rose-500/10 transition disabled:opacity-60">
                                    <FiX size={14} /> Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Edit + Confirm (single modal) */}
            {editing && (
                <ProjectModal
                    isDark={isDark}
                    project={editing}
                    onClose={() => setEditing(null)}
                    onSaved={(saved, meta) => {
                        setEditing(null);
                        load();
                        // installment Receipt বা অর্ডার confirm — দুটোতেই receipt popup
                        if (meta?.receiptInstallmentNo && saved) setReceiptFor({ project: saved, focusNo: meta.receiptInstallmentNo });
                        else if (meta?.confirmed && saved) setReceiptFor({ project: saved });
                    }}
                />
            )}

            {/* Order Confirmation + Money Receipt popup */}
            {receiptFor && (
                <SendReceiptDialog
                    isDark={isDark}
                    project={receiptFor.project}
                    focusInstallmentNo={receiptFor.focusNo || null}
                    onClose={() => setReceiptFor(null)}
                />
            )}
        </div>
    );
}
