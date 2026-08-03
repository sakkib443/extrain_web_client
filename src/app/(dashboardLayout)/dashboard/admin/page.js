'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
    FiRefreshCw, FiTrendingUp, FiTrendingDown, FiClock, FiInbox, FiUsers,
    FiHeart, FiFolder, FiDollarSign, FiArrowRight, FiGlobe, FiFileText, FiBarChart2,
    FiCode, FiLayers, FiEdit3, FiPlus, FiChevronLeft, FiChevronRight,
} from 'react-icons/fi';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useTheme } from '@/providers/ThemeProvider';
import { API_BASE_URL } from '@/config/api';
import { ptApi, bdt, fmtDate, monthLabel, statusStyle } from '@/lib/projectTracker';

const currentMonthKey = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

// "2026-08" থেকে আগের/পরের মাসের key ("2026-07" / "2026-09")
const shiftMonth = (key, delta) => {
    const [y, m] = key.split('-').map(Number);
    const d = new Date(y, m - 1 + delta, 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

const AnimatedCounter = ({ value = 0, duration = 900 }) => {
    const [n, setN] = useState(0);
    useEffect(() => {
        const target = Number(value) || 0;
        if (target === 0) { setN(0); return; }
        const step = target / (duration / 16);
        let cur = 0;
        const t = setInterval(() => {
            cur += step;
            if (cur >= target) { setN(target); clearInterval(t); }
            else setN(Math.floor(cur));
        }, 16);
        return () => clearInterval(t);
    }, [value, duration]);
    return <>{n.toLocaleString('en-US')}</>;
};

// KPI card — top row
const Kpi = ({ isDark, label, value, icon: Icon, color, highlight }) => (
    <div className={`rounded-xl p-4 border shadow-sm ${highlight
        ? isDark ? 'bg-orange-500/10 border-orange-500/30' : 'bg-orange-50 border-orange-200'
        : isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{label}</span>
            <Icon size={16} style={{ color }} />
        </div>
        <p className="text-2xl font-bold" style={highlight ? { color } : {}}>
            <span className={highlight ? '' : (isDark ? 'text-white' : 'text-slate-800')}>{value}</span>
        </p>
    </div>
);

export default function AdminDashboard() {
    const { isDark } = useTheme();
    const thisMonth = currentMonthKey();
    const [month, setMonth] = useState(thisMonth);   // কোন মাসের ডেটা দেখাচ্ছি
    const isCurrent = month === thisMonth;
    const [summary, setSummary] = useState(null);
    const [requests, setRequests] = useState([]);
    const [projects, setProjects] = useState([]);
    const [daily, setDaily] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [metric, setMetric] = useState('collection');

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            const [s, r, p, d, a] = await Promise.all([
                ptApi.getSummary(month).catch(() => null),
                ptApi.getRequests().catch(() => []),
                ptApi.getProjects(month).catch(() => []),
                ptApi.getDailyStats(month).catch(() => []),
                fetch(`${API_BASE_URL}/analytics/dashboard`, { headers: { Authorization: `Bearer ${token}` } }).then((x) => x.json()).catch(() => ({})),
            ]);
            setSummary(s || {}); setRequests(r || []); setProjects(p || []); setDaily(d || []); setStats(a?.data || {});
        } finally { setLoading(false); }
    }, [month]);
    useEffect(() => { load(); }, [load]);

    const cardBox = isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-white border-slate-200';
    const muted = isDark ? 'text-slate-400' : 'text-slate-500';
    const pending = summary?.pendingRequests ?? requests.length;
    const chartTotal = daily.reduce((s, x) => s + (metric === 'collection' ? x.collection : x.orders), 0);
    const sectionLabel = `text-xs font-bold uppercase tracking-wide ${muted}`;

    const miniStats = [
        { label: 'Order Requests', value: pending, icon: FiInbox, color: '#FD9A00', href: '/dashboard/admin/project-tracker/requests', badge: pending },
        { label: 'Projects', value: projects.length, icon: FiFolder, color: '#3b82f6' },
        { label: 'New Clients', value: stats.newUsersThisMonth || 0, icon: FiUsers, color: '#06b6d4' },
        { label: 'Total Likes', value: stats.totalLikes || 0, icon: FiHeart, color: '#ec4899' },
    ];

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Dashboard</h1>
                    <p className={`text-sm ${muted}`}>
                        {isCurrent ? 'This month overview' : 'Past month overview'} — <span className="font-semibold" style={{ color: '#FD9A00' }}>{monthLabel(month)}</span>
                        {!isCurrent && <span className="ml-2 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-600">Previous</span>}
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    {/* Month switcher — আগের / পরের মাস */}
                    <div className={`inline-flex items-center rounded-xl p-1 ${isDark ? 'bg-slate-800' : 'bg-white border border-slate-200'}`}>
                        <button onClick={() => setMonth(shiftMonth(month, -1))} title="Previous month"
                            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${isDark ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-600 hover:bg-slate-100'}`}>
                            <FiChevronLeft size={14} /> Prev
                        </button>
                        <span className={`px-2.5 text-xs font-bold whitespace-nowrap ${isDark ? 'text-white' : 'text-slate-700'}`}>{monthLabel(month)}</span>
                        <button onClick={() => setMonth(shiftMonth(month, 1))} disabled={isCurrent} title="Next month"
                            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${isCurrent
                                ? 'opacity-40 cursor-not-allowed ' + (isDark ? 'text-slate-500' : 'text-slate-400')
                                : isDark ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-600 hover:bg-slate-100'}`}>
                            Next <FiChevronRight size={14} />
                        </button>
                    </div>

                    {!isCurrent && (
                        <button onClick={() => setMonth(thisMonth)}
                            className="px-3 py-2 rounded-xl text-xs font-bold border transition hover:opacity-80"
                            style={{ borderColor: '#FD9A00', color: '#FD9A00' }}>
                            This Month
                        </button>
                    )}

                    <button onClick={load} className={`p-2.5 rounded-xl transition ${isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                        <FiRefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <Link href={`/dashboard/admin/project-tracker/${month}`} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-semibold shadow hover:opacity-90 transition" style={{ background: '#FD9A00' }}>
                        <FiFolder size={16} /> Open Tracker
                    </Link>
                </div>
            </div>

            {/* ===== KPI ROW ===== */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Kpi isDark={isDark} label="Total Profit" value={bdt(summary?.totalProfit)} icon={FiTrendingUp} color="#FD9A00" highlight />
                <Kpi isDark={isDark} label="Collection" value={bdt(summary?.totalCollection)} icon={FiTrendingUp} color="#10b981" />
                <Kpi isDark={isDark} label="Due" value={bdt(summary?.totalDue)} icon={FiClock} color="#f59e0b" />
                <Kpi isDark={isDark} label="Expenses" value={bdt(summary?.totalExpenses)} icon={FiTrendingDown} color="#ef4444" />
            </div>

            {/* ===== MAIN: left (chart + projects) | right (requests + stats) ===== */}
            <div className="grid lg:grid-cols-3 gap-5">
                {/* LEFT */}
                <div className="lg:col-span-2 space-y-5">
                    {/* Chart */}
                    <div className={`rounded-xl p-5 border shadow-sm ${cardBox}`}>
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                            <div>
                                <h3 className={`font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                    <FiBarChart2 style={{ color: '#FD9A00' }} /> Daily {metric === 'collection' ? 'Collection' : 'Orders'}
                                </h3>
                                <p className={`text-xs ${muted}`}>{monthLabel(month)} • Total: <span className="font-semibold" style={{ color: '#FD9A00' }}>{metric === 'collection' ? bdt(chartTotal) : chartTotal}</span></p>
                            </div>
                            <div className={`inline-flex gap-1 p-1 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                {['collection', 'orders'].map((k) => (
                                    <button key={k} onClick={() => setMetric(k)}
                                        className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition ${metric === k ? 'text-white' : isDark ? 'text-slate-300' : 'text-slate-600'}`}
                                        style={metric === k ? { background: '#FD9A00' } : {}}>{k}</button>
                                ))}
                            </div>
                        </div>
                        <div style={{ width: '100%', height: 230 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={daily} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#FD9A00" stopOpacity={0.4} />
                                            <stop offset="100%" stopColor="#FD9A00" stopOpacity={0.02} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} vertical={false} />
                                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: isDark ? '#94a3b8' : '#64748b' }} interval={2} tickLine={false} axisLine={false} />
                                    <YAxis tick={{ fontSize: 11, fill: isDark ? '#94a3b8' : '#64748b' }} tickLine={false} axisLine={false} width={48} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: 12, border: 'none', background: isDark ? '#1e293b' : '#fff', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', color: isDark ? '#fff' : '#1e293b', fontSize: 13 }}
                                        formatter={(v) => [metric === 'collection' ? bdt(v) : v, metric === 'collection' ? 'Collection' : 'Orders']}
                                        labelFormatter={(l) => `Day ${l}`} />
                                    <Area type="monotone" dataKey={metric} stroke="#FD9A00" strokeWidth={2.5} fill="url(#grad)" dot={false} activeDot={{ r: 5, fill: '#FD9A00' }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* This month's projects */}
                    <div className={`rounded-xl border shadow-sm ${cardBox}`}>
                        <div className={`flex items-center justify-between px-5 py-4 border-b ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                            <h3 className={`font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                <FiFolder style={{ color: '#FD9A00' }} /> {isCurrent ? "This Month's Projects" : `${monthLabel(month)} Projects`}
                            </h3>
                            <Link href={`/dashboard/admin/project-tracker/${month}`} className="text-sm font-semibold flex items-center gap-1" style={{ color: '#FD9A00' }}>View all <FiArrowRight size={14} /></Link>
                        </div>
                        <div className="p-2">
                            {projects.length === 0 ? (
                                <p className={`text-center py-10 text-sm ${muted}`}>No projects in {monthLabel(month)}.</p>
                            ) : projects.slice(0, 6).map((p) => (
                                <div key={p._id} className={`flex items-center justify-between px-3 py-2.5 rounded-lg ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className={`font-semibold truncate ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{p.clientName}</p>
                                            {p.projectId && <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: '#FD9A0018', color: '#FD9A00' }}>{p.projectId}</span>}
                                        </div>
                                        <p className={`text-xs ${muted}`}>{bdt(p.totalPaid)} paid • <span className="text-amber-500">{bdt(p.totalDue)} due</span></p>
                                    </div>
                                    <span className={`shrink-0 px-2 py-1 rounded-full text-[11px] font-semibold border ${statusStyle(p.status)}`}>{p.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT */}
                <div className="space-y-5">
                    {/* Order Requests */}
                    <div className={`rounded-xl border shadow-sm ${cardBox}`}>
                        <div className={`flex items-center justify-between px-5 py-4 border-b ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                            <h3 className={`font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                <FiInbox style={{ color: '#FD9A00' }} /> Order Requests
                                {pending > 0 && <span className="ml-1 min-w-5 h-5 px-1.5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">{pending}</span>}
                            </h3>
                            <Link href="/dashboard/admin/project-tracker/requests" className="text-sm font-semibold" style={{ color: '#FD9A00' }}>All</Link>
                        </div>
                        <div className="p-2">
                            {requests.length === 0 ? (
                                <p className={`text-center py-8 text-sm ${muted}`}>No new requests.</p>
                            ) : requests.slice(0, 5).map((r) => (
                                <Link key={r._id} href="/dashboard/admin/project-tracker/requests" className={`block px-3 py-2.5 rounded-lg ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}>
                                    <p className={`font-semibold truncate text-sm ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{r.clientName}</p>
                                    <p className={`text-xs truncate ${muted}`}>{r.websiteType} • {fmtDate(r.createdAt)}</p>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Mini stats */}
                    <div className={`rounded-xl border shadow-sm p-2 ${cardBox}`}>
                        {miniStats.map((m) => {
                            const inner = (
                                <div className={`relative flex items-center gap-3 px-3 py-3 rounded-lg ${m.href ? (isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50') : ''}`}>
                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${m.color}18`, color: m.color }}><m.icon size={18} /></div>
                                    <div>
                                        <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}><AnimatedCounter value={m.value} /></p>
                                        <p className={`text-xs ${muted}`}>{m.label}</p>
                                    </div>
                                    {m.badge > 0 && <span className="absolute top-2 right-2 min-w-5 h-5 px-1.5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">{m.badge}</span>}
                                </div>
                            );
                            return m.href ? <Link key={m.label} href={m.href}>{inner}</Link> : <div key={m.label}>{inner}</div>;
                        })}
                        {!isCurrent && (
                            <p className={`px-3 pt-1 pb-2 text-[11px] leading-snug ${muted}`}>
                                Order Requests, New Clients &amp; Likes are live totals — these are not filtered by month.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* ===== ACTIONS ===== */}
            <div className="grid lg:grid-cols-2 gap-5">
                <div className={`rounded-xl border shadow-sm p-5 ${cardBox}`}>
                    <p className={sectionLabel + ' mb-3'}>Quick Add</p>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: 'Add Website', href: '/dashboard/admin/website/create', icon: FiGlobe },
                            { label: 'Add Software', href: '/dashboard/admin/software/create', icon: FiCode },
                            { label: 'Add Category', href: '/dashboard/admin/category/create', icon: FiLayers },
                            { label: 'Add Blog', href: '/dashboard/admin/blog/create', icon: FiEdit3 },
                        ].map((q) => (
                            <Link key={q.label} href={q.href} className={`flex items-center gap-3 px-3 py-3 rounded-lg border border-dashed transition hover:-translate-y-0.5 ${isDark ? 'border-slate-600 hover:bg-slate-800' : 'border-slate-300 hover:bg-slate-50'}`}>
                                <div className="relative w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: '#FD9A0018', color: '#FD9A00' }}>
                                    <q.icon size={16} />
                                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-white" style={{ background: '#FD9A00' }}><FiPlus size={10} /></span>
                                </div>
                                <span className={`text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{q.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className={`rounded-xl border shadow-sm p-5 ${cardBox}`}>
                    <p className={sectionLabel + ' mb-3'}>Shortcuts</p>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: 'Project Tracker', href: '/dashboard/admin/project-tracker', icon: FiFolder },
                            { label: 'Order Requests', href: '/dashboard/admin/project-tracker/requests', icon: FiInbox },
                            { label: 'Domain / Hosting', href: `/dashboard/admin/project-tracker/${month}`, icon: FiGlobe },
                            { label: 'Reports', href: '/dashboard/admin/reports', icon: FiFileText },
                        ].map((q) => (
                            <Link key={q.label} href={q.href} className={`flex items-center gap-3 px-3 py-3 rounded-lg transition hover:-translate-y-0.5 ${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-50 hover:bg-slate-100'}`}>
                                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white" style={{ background: '#FD9A00' }}><q.icon size={16} /></div>
                                <span className={`text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{q.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
