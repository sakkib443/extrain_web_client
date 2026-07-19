'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    FiFolder, FiTrendingUp, FiTrendingDown, FiDollarSign, FiClock,
    FiInbox, FiRefreshCw, FiCreditCard, FiChevronRight, FiPlus,
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import { ptApi, bdt, monthLabel } from '@/lib/projectTracker';

const StatCard = ({ isDark, icon: Icon, label, value, tone = 'default' }) => {
    const tones = {
        default: 'from-slate-500 to-slate-600',
        green: 'from-emerald-500 to-green-600',
        blue: 'from-blue-500 to-indigo-600',
        red: 'from-rose-500 to-red-600',
        amber: 'from-amber-500 to-orange-600',
    };
    return (
        <div className={`rounded-2xl p-5 border ${isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-white border-slate-200'} shadow-sm`}>
            <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tones[tone]} flex items-center justify-center text-white shadow`}>
                    <Icon size={18} />
                </div>
                <span className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{label}</span>
            </div>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{value}</p>
        </div>
    );
};

export default function ProjectTrackerOverview() {
    const { isDark } = useTheme();
    const router = useRouter();
    const [summary, setSummary] = useState(null);
    const [months, setMonths] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        try {
            const [s, m] = await Promise.all([ptApi.getSummary(), ptApi.getMonths()]);
            setSummary(s);
            setMonths(m);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => { load(); }, []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Project Tracker</h1>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>কাস্টম প্রজেক্ট অর্ডার ও মান্থলি হিসাব</p>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/dashboard/admin/project-tracker/requests"
                        className="relative inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold shadow hover:opacity-90 transition">
                        <FiInbox size={16} /> Order Requests
                        {summary?.pendingRequests > 0 && (
                            <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                                {summary.pendingRequests}
                            </span>
                        )}
                    </Link>
                    <Link href="/dashboard/admin/project-tracker/expenses"
                        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition ${isDark ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
                        <FiCreditCard size={16} /> Expenses
                    </Link>
                    <button onClick={load} className={`p-2.5 rounded-xl transition ${isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                        <FiRefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* Overall summary */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                <StatCard isDark={isDark} icon={FiDollarSign} label="Total Project Value" value={bdt(summary?.totalProjectValue)} tone="blue" />
                <StatCard isDark={isDark} icon={FiTrendingUp} label="Total Collection" value={bdt(summary?.totalCollection)} tone="green" />
                <StatCard isDark={isDark} icon={FiClock} label="Total Due" value={bdt(summary?.totalDue)} tone="amber" />
                <StatCard isDark={isDark} icon={FiTrendingDown} label="Total Expenses" value={bdt(summary?.totalExpenses)} tone="red" />
                <StatCard isDark={isDark} icon={summary?.totalProfit >= 0 ? FiTrendingUp : FiTrendingDown} label="Total Profit" value={bdt(summary?.totalProfit)} tone={summary?.totalProfit >= 0 ? 'green' : 'red'} />
            </div>

            {/* Monthly folders */}
            <div>
                <h2 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    <FiFolder style={{ color: '#FD9A00' }} /> Monthly Folders
                </h2>

                {loading ? (
                    <div className={`text-center py-16 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>লোড হচ্ছে...</div>
                ) : months.length === 0 ? (
                    <div className={`text-center py-16 rounded-2xl border border-dashed ${isDark ? 'border-slate-700 text-slate-400' : 'border-slate-300 text-slate-500'}`}>
                        এখনো কোনো প্রজেক্ট নেই। Order Requests থেকে approve করলে এখানে মাস অনুযায়ী দেখা যাবে।
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {months.map((m) => (
                            <button
                                key={m.monthKey}
                                onClick={() => router.push(`/dashboard/admin/project-tracker/${m.monthKey}`)}
                                className={`group text-left rounded-2xl p-5 border transition-all hover:-translate-y-1 hover:shadow-lg ${isDark ? 'bg-slate-800/60 border-slate-700 hover:border-orange-500/50' : 'bg-white border-slate-200 hover:border-orange-300'} shadow-sm`}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white shadow" style={{ background: '#FD9A00' }}>
                                            <FiFolder size={20} />
                                        </div>
                                        <div>
                                            <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{monthLabel(m.monthKey)}</p>
                                            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{m.projectCount} projects</p>
                                        </div>
                                    </div>
                                    <FiChevronRight className={`${isDark ? 'text-slate-500' : 'text-slate-400'} group-hover:translate-x-1 transition`} />
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <Row isDark={isDark} label="Value" value={bdt(m.totalValue)} />
                                    <Row isDark={isDark} label="Collected" value={bdt(m.totalPaid)} cls="text-emerald-500" />
                                    <Row isDark={isDark} label="Due" value={bdt(m.totalDue)} cls="text-amber-500" />
                                    <Row isDark={isDark} label="Expenses" value={bdt(m.totalExpenses)} cls="text-rose-500" />
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

const Row = ({ isDark, label, value, cls }) => (
    <div className="flex items-center justify-between">
        <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>{label}</span>
        <span className={`font-semibold ${cls || (isDark ? 'text-slate-200' : 'text-slate-700')}`}>{value}</span>
    </div>
);
