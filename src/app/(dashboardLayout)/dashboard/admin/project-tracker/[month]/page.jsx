'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import {
    FiArrowLeft, FiPlus, FiEdit3, FiTrash2, FiFileText, FiRefreshCw, FiEye,
    FiX, FiSave, FiChevronRight,
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import {
    ptApi, bdt, fmtDate, monthLabel, packageLabel,
    PACKAGE_TYPES, WEBSITE_TYPES, STATUS_OPTIONS, statusStyle,
} from '@/lib/projectTracker';
import ProjectModal from '@/components/ProjectTracker/ProjectModal';
import SendReceiptDialog from '@/components/ProjectTracker/SendReceiptDialog';
import ProjectDetailModal from '@/components/ProjectTracker/ProjectDetailModal';
import ExpensesTab from '@/components/ProjectTracker/ExpensesTab';
import DomainsTab from '@/components/ProjectTracker/DomainsTab';
import PaymentMethods from '@/components/ProjectTracker/PaymentMethods';

const SummaryTile = ({ isDark, label, value, cls, accent }) => (
    <div className={`relative rounded-xl pl-5 pr-4 py-3.5 border ${isDark ? 'bg-slate-800/50 border-slate-700/60' : 'bg-white border-slate-200/70'}`}>
        <span className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full" style={{ background: accent }} />
        <p className={`text-[11px] font-semibold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>{label}</p>
        <p className={`text-[22px] leading-tight font-bold ${cls || (isDark ? 'text-white' : 'text-slate-800')}`}>{value}</p>
    </div>
);

export default function MonthlyTrackerPage() {
    const { isDark } = useTheme();
    const params = useParams();
    const month = params.month;

    const [summary, setSummary] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null); // project object or 'new'
    const [receipt, setReceipt] = useState(null);
    const [viewing, setViewing] = useState(null); // read-only detail view
    const [tab, setTab] = useState('projects'); // projects | expenses | domains

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const [s, p] = await Promise.all([ptApi.getSummary(month), ptApi.getProjects(month)]);
            setSummary(s);
            setProjects(p);
        } catch (e) {
            toast.error(e.message);
        } finally {
            setLoading(false);
        }
    }, [month]);
    useEffect(() => { load(); }, [load]);

    const remove = async (id) => {
        if (!confirm('এই প্রজেক্টটি ডিলিট করবেন?')) return;
        try {
            await ptApi.deleteProject(id);
            toast.success('ডিলিট হয়েছে');
            load();
        } catch (e) { toast.error(e.message); }
    };

    const th = `px-3 py-3 text-left text-xs font-bold uppercase tracking-wide whitespace-nowrap ${isDark ? 'text-slate-400' : 'text-slate-500'}`;
    const td = `px-3 py-3 text-sm whitespace-nowrap ${isDark ? 'text-slate-200' : 'text-slate-700'}`;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/admin/project-tracker" className={`p-2.5 rounded-xl transition ${isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                        <FiArrowLeft size={16} />
                    </Link>
                    <div>
                        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{monthLabel(month)}</h1>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{projects.length} projects এই মাসে</p>
                    </div>
                </div>
                {tab === 'projects' && (
                    <div className="flex items-center gap-2">
                        <button onClick={load} className={`p-2.5 rounded-xl transition ${isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                            <FiRefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                        </button>
                        <button onClick={() => setEditing('new')} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-semibold shadow hover:opacity-90 transition" style={{ background: '#FD9A00' }}>
                            <FiPlus size={16} /> Add Project
                        </button>
                    </div>
                )}
            </div>

            {/* Summary block — সবসময় উপরে (সব tab এ দেখা যায়) */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
                <SummaryTile isDark={isDark} label="Total Project Value" value={bdt(summary?.totalProjectValue)} accent="#6366f1" />
                <SummaryTile isDark={isDark} label="Collection" value={bdt(summary?.totalCollection)} cls="text-emerald-500" accent="#10b981" />
                <SummaryTile isDark={isDark} label="Due" value={bdt(summary?.totalDue)} cls="text-amber-500" accent="#f59e0b" />
                <SummaryTile isDark={isDark} label="Expenses" value={bdt(summary?.totalExpenses)} cls="text-rose-500" accent="#f43f5e" />
                <SummaryTile isDark={isDark} label="Total Profit" value={bdt(summary?.totalProfit)} cls={summary?.totalProfit >= 0 ? 'text-emerald-500' : 'text-rose-500'} accent={summary?.totalProfit >= 0 ? '#10b981' : '#f43f5e'} />
            </div>

            {/* পেমেন্ট মাধ্যম — ক্লায়েন্টকে পাঠাতে এক ক্লিকে কপি */}
            <PaymentMethods isDark={isDark} />

            {/* Tabs — summary এর নিচে */}
            <div className={`inline-flex gap-1 p-1 rounded-xl ${isDark ? 'bg-slate-800/60' : 'bg-slate-100'}`}>
                {[
                    { k: 'projects', label: 'Projects' },
                    { k: 'expenses', label: 'Expenses' },
                    { k: 'domains', label: 'Domain / Hosting' },
                ].map((t) => (
                    <button key={t.k} onClick={() => setTab(t.k)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${tab === t.k
                            ? 'text-white shadow'
                            : isDark ? 'text-slate-300 hover:bg-slate-700/50' : 'text-slate-600 hover:bg-white'}`}
                        style={tab === t.k ? { background: '#FD9A00' } : {}}>
                        {t.label}
                    </button>
                ))}
            </div>

            {/* ===== EXPENSES TAB ===== */}
            {tab === 'expenses' && <ExpensesTab isDark={isDark} month={month} onChanged={load} />}

            {/* ===== DOMAINS TAB ===== */}
            {tab === 'domains' && <DomainsTab isDark={isDark} month={month} />}

            {/* ===== PROJECTS TAB ===== */}
            {tab === 'projects' && <>
            {/* Projects table */}
            <div className={`rounded-xl border overflow-hidden ${isDark ? 'bg-slate-800/40 border-slate-700/60' : 'bg-white border-slate-200/70'}`}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className={isDark ? 'bg-slate-800/70' : 'bg-slate-50/80'}>
                            <tr>
                                <th className={th}>SL</th>
                                <th className={th}>Project ID</th>
                                <th className={th}>Order Date</th>
                                <th className={th}>Client</th>
                                <th className={th}>Company</th>
                                <th className={th}>Phone</th>
                                <th className={th}>Type</th>
                                <th className={th}>Total</th>
                                <th className={th}>Paid</th>
                                <th className={th}>Due</th>
                                <th className={th}>Due%</th>
                                <th className={th}>Next Pay</th>
                                <th className={th}>Delivery</th>
                                <th className={th}>Status</th>
                                <th className={th + ' text-right'}>Actions</th>
                            </tr>
                        </thead>
                        <tbody className={isDark ? 'divide-y divide-slate-700/50' : 'divide-y divide-slate-100'}>
                            {loading ? (
                                <tr><td colSpan={15} className={`text-center py-16 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>লোড হচ্ছে...</td></tr>
                            ) : projects.length === 0 ? (
                                <tr><td colSpan={15} className={`text-center py-16 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>এই মাসে কোনো প্রজেক্ট নেই।</td></tr>
                            ) : projects.map((p, i) => (
                                <tr key={p._id} className={isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50/70'}>
                                    <td className={td + ' text-slate-400'}>{i + 1}</td>
                                    <td className={td + ' font-mono font-semibold'} style={{ color: '#FD9A00' }}>{p.projectId || '—'}</td>
                                    <td className={td}>{fmtDate(p.orderDate)}</td>
                                    <td className={td + ' font-semibold'}>{p.clientName}</td>
                                    <td className={td}>{p.companyBrand || '—'}</td>
                                    <td className={td}>{p.phone}</td>
                                    <td className={td}>{p.websiteType}</td>
                                    {/* Total/Paid/Due — ডোমেইনের অংশ বাদ দিয়ে শুধু ওয়েবসাইটের টাকা */}
                                    <td className={td + ' font-semibold'}>
                                        {bdt(p.websiteAmount ?? p.totalProjectAmount)}
                                        {p.domainSellIncluded > 0 && (
                                            <span className="block text-[11px] font-normal text-slate-400" title={`মোট ${bdt(p.totalProjectAmount)} এর ভিতরে ডোমেইন/হোস্টিং ${bdt(p.domainSellIncluded)}`}>
                                                +{bdt(p.domainSellIncluded)} ডোমেইন
                                            </span>
                                        )}
                                    </td>
                                    <td className={td + ' text-emerald-500 font-semibold'}>{bdt(p.websitePaid ?? p.totalPaid)}</td>
                                    <td className={td + ' text-amber-500 font-semibold'}>{bdt(p.websiteDue ?? p.totalDue)}</td>
                                    <td className={td}>{p.websiteDuePercentage ?? p.duePercentage}%</td>
                                    <td className={td}>{fmtDate(p.nextPayDate)}</td>
                                    <td className={td}>{fmtDate(p.projectDeliveryDate)}</td>
                                    <td className={td}>
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusStyle(p.status)}`}>{p.status}</span>
                                    </td>
                                    <td className={td + ' text-right'}>
                                        <div className="inline-flex items-center gap-1">
                                            <button onClick={() => setViewing(p)} title="View Details" className="p-2 rounded-lg text-slate-500 hover:bg-slate-500/10 transition"><FiEye size={15} /></button>
                                            <button onClick={() => setReceipt({ project: p })} title="Money Receipt" className="p-2 rounded-lg text-emerald-500 hover:bg-emerald-500/10 transition"><FiFileText size={15} /></button>
                                            <button onClick={() => setEditing(p)} title="Edit" className="p-2 rounded-lg text-blue-500 hover:bg-blue-500/10 transition"><FiEdit3 size={15} /></button>
                                            <button onClick={() => remove(p._id)} title="Delete" className="p-2 rounded-lg text-rose-500 hover:bg-rose-500/10 transition"><FiTrash2 size={15} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ওয়েবসাইট থেকে মাসের লাভ — ডোমেইন/হোস্টিং এই হিসাবের বাইরে (ওটা নিজের ট্যাবে) */}
            <div className="flex justify-end">
                <div className={`w-full sm:w-[340px] rounded-xl border overflow-hidden ${isDark ? 'bg-slate-800/50 border-slate-700/60' : 'bg-white border-slate-200/70'}`}>
                    <div className={`px-5 py-3 border-b ${isDark ? 'border-slate-700/60' : 'border-slate-100'}`}>
                        <p className={`text-[11px] font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
                            Total Profit for Website
                        </p>
                    </div>
                    <div className="px-5 py-3.5 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Collection</span>
                            <span className="font-semibold text-emerald-500">{bdt(summary?.totalCollection)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Expenses</span>
                            <span className="font-semibold text-rose-500">− {bdt(summary?.totalExpenses)}</span>
                        </div>
                        <div className={`flex items-center justify-between pt-2.5 border-t ${isDark ? 'border-slate-700/60' : 'border-slate-100'}`}>
                            <span className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Profit</span>
                            <span className={`text-[22px] leading-tight font-bold ${(summary?.websiteProfit ?? 0) >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {bdt(summary?.websiteProfit)}
                            </span>
                        </div>
                        <p className={`text-[11px] pt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                            ডোমেইন/হোস্টিং এখানে ধরা হয়নি — ওটা নিজের ট্যাবে
                        </p>
                    </div>
                </div>
            </div>
            </>}

            {editing && (
                <ProjectModal
                    isDark={isDark}
                    project={editing === 'new' ? null : editing}
                    defaultMonth={month}
                    onClose={() => setEditing(null)}
                    onSaved={(saved, meta) => {
                        setEditing(null);
                        load();
                        // installment Receipt বাটন থেকে এলে সেই installment focus সহ receipt খোলো
                        if (meta?.receiptInstallmentNo && saved) setReceipt({ project: saved, focusNo: meta.receiptInstallmentNo });
                        else if (meta?.confirmed && saved) setReceipt({ project: saved });
                    }}
                />
            )}
            {receipt && (
                <SendReceiptDialog
                    isDark={isDark}
                    project={receipt.project}
                    focusInstallmentNo={receipt.focusNo || null}
                    onClose={() => setReceipt(null)}
                />
            )}

            {viewing && (
                <ProjectDetailModal
                    isDark={isDark}
                    project={viewing}
                    onClose={() => setViewing(null)}
                    onEdit={(p) => { setViewing(null); setEditing(p); }}
                    onReceipt={(p) => { setViewing(null); setReceipt({ project: p }); }}
                />
            )}
        </div>
    );
}
