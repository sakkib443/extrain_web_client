'use client';

// ===================================================================
// All Projects — প্রতি মাসের সব প্রজেক্ট এক শিটে
// তারিখ / মাস / স্ট্যাটাস / এমপ্লয়ি অনুযায়ী ফিল্টার, দামের উপর হোভার করলে দামের ইতিহাস,
// আর যা দেখা যাচ্ছে সেটাই Excel / CSV / Google Sheet এ নামানো যায়।
// ===================================================================

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
    FiArrowLeft, FiRefreshCw, FiDownload, FiCopy, FiSearch, FiEye, FiEdit3, FiExternalLink,
    FiX, FiArrowUp, FiArrowDown, FiFileText, FiClock,
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import { TEAM } from '@/data/team';
import { ptApi, bdt, fmtDate, monthLabel, statusStyle } from '@/lib/projectTracker';
import {
    buildSheetRows, isoDay, shortDate, toUrl, downloadXLSX, downloadCSV, copyForSheets,
} from '@/lib/projectSheet';
import ProjectModal from '@/components/ProjectTracker/ProjectModal';
import SendReceiptDialog from '@/components/ProjectTracker/SendReceiptDialog';
import ProjectDetailModal from '@/components/ProjectTracker/ProjectDetailModal';

const BRAND = '#FD9A00';

// 20 Jan 26 — short enough for the narrow Project cell (Excel / CSV keep the full date)
const shortFmt = (d) => (d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }) : '—');

// ---------------------------------------------------------------
// Date presets
// ---------------------------------------------------------------
const monthRange = (y, m) => ({ from: isoDay(new Date(y, m, 1)), to: isoDay(new Date(y, m + 1, 0)) });

const PRESETS = [
    { key: 'all', label: 'All time', range: () => ({ from: '', to: '' }) },
    { key: 'this-month', label: 'This month', range: () => { const n = new Date(); return monthRange(n.getFullYear(), n.getMonth()); } },
    { key: 'last-month', label: 'Last month', range: () => { const n = new Date(); return monthRange(n.getFullYear(), n.getMonth() - 1); } },
    {
        key: '3m',
        label: 'Last 3 months',
        range: () => {
            const n = new Date();
            return { from: isoDay(new Date(n.getFullYear(), n.getMonth() - 2, 1)), to: isoDay(new Date(n.getFullYear(), n.getMonth() + 1, 0)) };
        },
    },
    { key: 'year', label: 'This year', range: () => { const y = new Date().getFullYear(); return { from: `${y}-01-01`, to: `${y}-12-31` }; } },
];

const BY_US_STYLE = {
    'Domain + Hosting': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Domain: 'bg-sky-100 text-sky-700 border-sky-200',
    Hosting: 'bg-violet-100 text-violet-700 border-violet-200',
    No: 'bg-slate-100 text-slate-500 border-slate-200',
};

// ---------------------------------------------------------------
// Small pieces
// ---------------------------------------------------------------
const SummaryTile = ({ isDark, label, value, cls, accent }) => (
    <div className={`relative rounded-xl pl-5 pr-4 py-3.5 border ${isDark ? 'bg-slate-800/50 border-slate-700/60' : 'bg-white border-slate-200/70'}`}>
        <span className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full" style={{ background: accent }} />
        <p className="text-[11px] font-semibold uppercase tracking-wider mb-1 text-slate-400">{label}</p>
        <p className={`text-[22px] leading-tight font-bold ${cls || (isDark ? 'text-white' : 'text-slate-800')}`}>{value}</p>
    </div>
);

// Click-to-edit text cell. Saves on Enter / when you click away, Escape cancels.
function EditCell({ isDark, value, placeholder = '+ add', listId, onSave, display, title }) {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(value || '');
    const cancelled = useRef(false);

    // the draft is taken from the saved value at the moment editing starts (no effect needed)
    const start = () => { cancelled.current = false; setDraft(value || ''); setEditing(true); };

    const commit = async () => {
        if (cancelled.current) return;
        const v = draft.trim();
        if (v === (value || '')) { setEditing(false); return; }
        try {
            await onSave(v);
        } catch (e) {
            toast.error(e.message || 'Save failed');
            setDraft(value || '');
        }
        setEditing(false);
    };

    if (editing) {
        return (
            <input
                autoFocus
                list={listId}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={commit}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') e.currentTarget.blur();
                    if (e.key === 'Escape') { cancelled.current = true; setDraft(value || ''); setEditing(false); }
                }}
                className={`w-full min-w-0 px-2 py-1 rounded-md border outline-none text-sm ${isDark ? 'bg-slate-800 border-orange-500/60 text-white' : 'bg-white border-orange-400 text-slate-800'}`}
            />
        );
    }
    return (
        <span className="group relative flex min-w-0 max-w-full items-center" title={title}>
            {display || (
                <button type="button" onClick={start} className="text-left truncate">
                    {value ? value : <span className="italic text-slate-400">{placeholder}</span>}
                </button>
            )}
            <button type="button" onClick={start} aria-label="Edit" className={`absolute right-0 top-1/2 -translate-y-1/2 rounded p-0.5 opacity-0 group-hover:opacity-100 focus:opacity-100 transition text-slate-400 hover:text-orange-500 ${isDark ? 'bg-slate-900/90' : 'bg-white/90'}`}>
                <FiEdit3 size={12} />
            </button>
        </span>
    );
}

// Price + the history popover (hover on a mouse, tap/click to pin it)
function PriceCell({ r, isDark }) {
    const btnRef = useRef(null);
    const closeTimer = useRef(null);
    const [open, setOpen] = useState(false);
    const [pinned, setPinned] = useState(false);
    const [pos, setPos] = useState(null);

    const place = () => {
        const b = btnRef.current?.getBoundingClientRect();
        if (!b) return;
        const W = 340;
        const left = Math.min(Math.max(8, b.left), window.innerWidth - W - 8);
        const spaceBelow = window.innerHeight - b.bottom;
        setPos(spaceBelow > 330 ? { left, top: b.bottom + 6 } : { left, bottom: window.innerHeight - b.top + 6 });
    };

    const show = () => { clearTimeout(closeTimer.current); place(); setOpen(true); };
    const hideSoon = () => { if (pinned) return; closeTimer.current = setTimeout(() => setOpen(false), 140); };
    const toggle = () => {
        if (pinned) { setPinned(false); setOpen(false); }
        else { setPinned(true); show(); }
    };

    // a pinned popover closes when you click anywhere else
    useEffect(() => {
        if (!pinned) return;
        const onDown = (e) => {
            if (btnRef.current?.contains(e.target) || e.target.closest?.('[data-price-pop]')) return;
            setPinned(false);
            setOpen(false);
        };
        document.addEventListener('mousedown', onDown);
        return () => document.removeEventListener('mousedown', onDown);
    }, [pinned]);

    useEffect(() => () => clearTimeout(closeTimer.current), []);

    const hasHistory = r.priceChanges.length + r.installments.length > 0;
    const muted = isDark ? 'text-slate-400' : 'text-slate-500';

    return (
        <>
            <button
                ref={btnRef}
                type="button"
                onMouseEnter={show}
                onMouseLeave={hideSoon}
                onClick={toggle}
                className={`text-left rounded-lg px-2 py-1 -mx-2 transition ${open ? (isDark ? 'bg-slate-700/60' : 'bg-orange-50') : 'hover:bg-slate-500/10'}`}
            >
                <span className="block font-bold">{bdt(r.price)}</span>
                <span className="block text-[11px] font-normal whitespace-nowrap">
                    {r.price <= 0
                        ? <span className="text-slate-400">no price yet</span>
                        : r.due > 0
                            ? <span className="text-amber-500">{bdt(r.due)} due</span>
                            : <span className="text-emerald-500">paid in full</span>}
                </span>
            </button>

            {open && pos && typeof document !== 'undefined' && createPortal(
                <div
                    data-price-pop
                    onMouseEnter={() => clearTimeout(closeTimer.current)}
                    onMouseLeave={hideSoon}
                    style={{ position: 'fixed', width: 340, zIndex: 120, ...pos }}
                    className={`rounded-xl border shadow-2xl overflow-hidden text-sm ${isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-700'}`}
                >
                    <div className={`flex items-center justify-between px-4 py-2.5 border-b ${isDark ? 'border-slate-700 bg-slate-800/60' : 'border-slate-100 bg-slate-50'}`}>
                        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Price history</p>
                        <p className="font-mono text-xs font-semibold" style={{ color: BRAND }}>{r.code || '—'}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 px-4 py-3">
                        {[['Price', r.price, ''], ['Paid', r.paid, 'text-emerald-500'], ['Due', r.due, 'text-amber-500']].map(([k, v, c]) => (
                            <div key={k}>
                                <p className="text-[10px] uppercase tracking-wide text-slate-400">{k}</p>
                                <p className={`font-bold ${c}`}>{bdt(v)}</p>
                            </div>
                        ))}
                    </div>
                    {r.domainSellIncluded > 0 && (
                        <p className={`px-4 pb-2 text-[11px] ${muted}`}>এর ভিতরে ডোমেইন/হোস্টিং {bdt(r.domainSellIncluded)}</p>
                    )}

                    <div className={`max-h-64 overflow-y-auto px-4 py-3 space-y-3 border-t ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                        {!hasHistory && <p className={`text-xs ${muted}`}>এখনো কোনো পেমেন্ট বা দাম বদলের রেকর্ড নেই।</p>}

                        {r.priceChanges.length > 0 && (
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1.5">Price changes</p>
                                <ul className="space-y-1.5">
                                    {r.priceChanges.map((c, i) => (
                                        <li key={i} className="flex items-baseline justify-between gap-3">
                                            <span className={`text-xs ${muted}`}>{shortDate(c.at) || '—'}</span>
                                            <span className="font-semibold text-right">
                                                {c.from > 0 ? <>{bdt(c.from)} <span className="text-slate-400">→</span> {bdt(c.to)}</> : <>set {bdt(c.to)}</>}
                                                {c.note && c.from > 0 ? <span className="block text-[11px] font-normal text-slate-400">{c.note}</span> : null}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {r.installments.length > 0 && (
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1.5">Payments</p>
                                <ul className="space-y-1.5">
                                    {r.installments.map((i, k) => {
                                        const refund = i.amount < 0;
                                        const dot = !i.paid ? 'bg-amber-400' : refund ? 'bg-rose-500' : 'bg-emerald-500';
                                        return (
                                            <li key={k} className="flex items-baseline justify-between gap-3">
                                                <span className="flex items-center gap-2 min-w-0">
                                                    <span className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />
                                                    <span className={`text-xs ${muted}`}>{shortDate(i.date) || 'no date'}</span>
                                                </span>
                                                <span className="text-right">
                                                    <span className={`font-semibold ${refund ? 'text-rose-500' : !i.paid ? 'text-amber-500' : ''}`}>
                                                        {refund ? '−' : ''}{bdt(Math.abs(i.amount))}
                                                    </span>
                                                    <span className="block text-[11px] text-slate-400">
                                                        {!i.paid ? 'planned' : refund ? 'refund' : 'paid'}{i.note ? ` · ${i.note}` : ''}
                                                    </span>
                                                </span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}

// ---------------------------------------------------------------
// Page
// ---------------------------------------------------------------
export default function AllProjectsPage() {
    const { isDark } = useTheme();

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    // filters
    const [preset, setPreset] = useState('all');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [month, setMonth] = useState('');
    const [basis, setBasis] = useState('order'); // order = Project Date, submit = Submit Date
    const [status, setStatus] = useState('all');
    const [employee, setEmployee] = useState('all');
    const [q, setQ] = useState('');
    const [newestFirst, setNewestFirst] = useState(false);

    // modals
    const [editing, setEditing] = useState(null);
    const [viewing, setViewing] = useState(null);
    const [receipt, setReceipt] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            setProjects(await ptApi.getProjects()); // no month = every project
        } catch (e) {
            toast.error(e.message);
        } finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => { load(); }, [load]);

    const rows = useMemo(() => buildSheetRows(projects), [projects]);

    // options for the dropdowns
    const months = useMemo(() => {
        const set = new Set();
        rows.forEach((r) => { const d = isoDay(basis === 'submit' ? r.submitDate : r.date); if (d) set.add(d.slice(0, 7)); });
        return [...set].sort().reverse();
    }, [rows, basis]);
    const statuses = useMemo(() => [...new Set(rows.map((r) => r.status).filter(Boolean))], [rows]);
    const people = useMemo(
        () => [...new Set([...TEAM.map((m) => m.name), ...rows.flatMap((r) => [r.employee, r.submittedBy]).filter(Boolean)])].sort(),
        [rows]
    );
    const employees = useMemo(
        () => [...new Set([...TEAM.map((m) => m.name), ...rows.map((r) => r.employee).filter(Boolean)])].sort(),
        [rows]
    );

    const filtered = useMemo(() => {
        const needle = q.trim().toLowerCase();
        const digits = needle.replace(/\D/g, '');
        const list = rows.filter((r) => {
            const day = isoDay(basis === 'submit' ? r.submitDate : r.date);
            if ((from || to) && !day) return false;
            if (from && day < from) return false;
            if (to && day > to) return false;
            if (status !== 'all' && r.status !== status) return false;
            if (employee === '__none' ? !!r.employee : employee !== 'all' && r.employee !== employee) return false;
            if (needle) {
                const hay = [r.code, r.name, r.type, r.owner, r.company, r.siteText, r.domainText, r.hostingText, r.submittedBy, r.employee, r.phone]
                    .join(' ')
                    .toLowerCase();
                if (!hay.includes(needle) && !(digits.length >= 3 && r.phone.replace(/\D/g, '').includes(digits))) return false;
            }
            return true;
        });
        list.sort((a, b) => {
            const ta = a.date ? new Date(a.date).getTime() : 0;
            const tb = b.date ? new Date(b.date).getTime() : 0;
            return ta - tb || String(a.code).localeCompare(String(b.code), undefined, { numeric: true });
        });
        return newestFirst ? list.reverse() : list;
    }, [rows, basis, from, to, status, employee, q, newestFirst]);

    const totals = useMemo(
        () => filtered.reduce((t, r) => ({ price: t.price + r.price, paid: t.paid + r.paid, due: t.due + r.due }), { price: 0, paid: 0, due: 0 }),
        [filtered]
    );

    const filtersOn = preset !== 'all' || from || to || month || status !== 'all' || employee !== 'all' || q.trim();

    const applyPreset = (key) => {
        const p = PRESETS.find((x) => x.key === key);
        const r = p.range();
        setPreset(key); setFrom(r.from); setTo(r.to); setMonth('');
    };
    const pickMonth = (m) => {
        setMonth(m);
        if (!m) { applyPreset('all'); return; }
        const [y, mm] = m.split('-').map(Number);
        const r = monthRange(y, mm - 1);
        setPreset('month'); setFrom(r.from); setTo(r.to);
    };
    const clearFilters = () => { applyPreset('all'); setStatus('all'); setEmployee('all'); setQ(''); };

    // ---- export (what you see is what you get) ----
    const fileBase = () => `All-Projects_${from || to ? `${from || 'start'}_to_${to || 'today'}` : isoDay(new Date())}`;
    const guard = () => { if (!filtered.length) { toast.error('ডাউনলোড করার মতো কোনো প্রজেক্ট নেই'); return false; } return true; };
    const doExcel = () => { if (!guard()) return; downloadXLSX(filtered, `${fileBase()}.xlsx`); toast.success(`${filtered.length}টা প্রজেক্ট Excel এ নামানো হচ্ছে`); };
    const doCsv = () => { if (!guard()) return; downloadCSV(filtered, `${fileBase()}.csv`); toast.success(`${filtered.length}টা প্রজেক্ট CSV এ নামানো হচ্ছে`); };
    const doCopy = async () => {
        if (!guard()) return;
        try {
            await copyForSheets(filtered);
            toast.success('কপি হয়েছে ✅ এবার Google Sheet এ গিয়ে Ctrl+V করুন', { duration: 5000 });
        } catch {
            toast.error('কপি করা যায়নি — Excel/CSV ব্যবহার করুন');
        }
    };

    // ---- inline edit ----
    const saveField = async (id, field, value) => {
        await ptApi.updateProjectSheet(id, { [field]: value });
        setProjects((prev) => prev.map((p) => (p._id === id ? { ...p, [field]: value } : p)));
        toast.success('Saved', { duration: 1200 });
    };

    const card = isDark ? 'bg-slate-800/40 border-slate-700/60' : 'bg-white border-slate-200/70';
    const ctrl = `px-3 py-2 rounded-lg border outline-none text-sm transition ${isDark ? 'bg-slate-800 border-slate-700 text-white focus:border-orange-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-orange-400 focus:bg-white'}`;
    const iconBtn = `p-2.5 rounded-xl transition ${isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`;
    const th = `px-2 py-2 text-left text-[11px] font-bold uppercase tracking-wide align-bottom sticky top-0 z-10 ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-50 text-slate-500'}`;
    const td = `px-2 py-2.5 text-[13px] align-top ${isDark ? 'text-slate-200' : 'text-slate-700'}`;
    const sub = `text-[11.5px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`; // the second line of a cell
    const hsub = 'block text-[10px] font-medium normal-case tracking-normal text-slate-400 truncate'; // header sub-label
    const tag = 'text-[10px] font-bold uppercase tracking-wide text-slate-400';
    const link = 'inline-flex min-w-0 max-w-full items-center gap-1 text-sky-500 hover:underline';

    const COLS = 9;

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/admin/project-tracker" className={iconBtn}><FiArrowLeft size={16} /></Link>
                    <div>
                        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>All Projects</h1>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {loading ? 'লোড হচ্ছে…' : `মোট ${rows.length}টা প্রজেক্ট · এখন দেখাচ্ছে ${filtered.length}টা`}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <button onClick={load} title="Refresh" className={iconBtn}><FiRefreshCw size={16} className={loading ? 'animate-spin' : ''} /></button>
                    <button onClick={doExcel} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-semibold shadow hover:opacity-90 transition" style={{ background: '#16a34a' }}>
                        <FiDownload size={16} /> Excel
                    </button>
                    <button onClick={doCsv} className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition ${isDark ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
                        <FiFileText size={16} /> CSV
                    </button>
                    <button onClick={doCopy} title="কপি করে Google Sheet এ Paste করুন" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-semibold shadow hover:opacity-90 transition" style={{ background: BRAND }}>
                        <FiCopy size={16} /> Copy for Google Sheets
                    </button>
                    <a href="https://sheets.new" target="_blank" rel="noopener noreferrer" title="নতুন Google Sheet খুলুন" className={iconBtn}><FiExternalLink size={16} /></a>
                </div>
            </div>

            {/* Filters */}
            <div className={`rounded-xl border p-4 space-y-3 ${card}`}>
                <div className="flex flex-wrap items-center gap-2">
                    {PRESETS.map((p) => (
                        <button key={p.key} onClick={() => applyPreset(p.key)}
                            className={`px-3.5 py-1.5 rounded-full text-sm font-semibold border transition ${preset === p.key
                                ? 'text-white border-transparent shadow'
                                : isDark ? 'text-slate-300 border-slate-700 hover:bg-slate-700/50' : 'text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                            style={preset === p.key ? { background: BRAND } : {}}>
                            {p.label}
                        </button>
                    ))}

                    <span className="mx-1 hidden md:block h-6 w-px bg-slate-500/20" />

                    <div className="flex items-center gap-2">
                        <input type="date" value={from} max={to || undefined} onChange={(e) => { setFrom(e.target.value); setPreset('custom'); setMonth(''); }} className={ctrl} aria-label="From date" />
                        <span className="text-slate-400 text-sm">→</span>
                        <input type="date" value={to} min={from || undefined} onChange={(e) => { setTo(e.target.value); setPreset('custom'); setMonth(''); }} className={ctrl} aria-label="To date" />
                    </div>

                    <select value={month} onChange={(e) => pickMonth(e.target.value)} className={ctrl} aria-label="Month">
                        <option value="">Month…</option>
                        {months.map((m) => <option key={m} value={m}>{monthLabel(m)}</option>)}
                    </select>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <div className="relative flex-1 min-w-[220px] max-w-md">
                        <FiSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="নাম, ফোন, কোম্পানি, প্রজেক্ট কোড, ডোমেইন…" className={`${ctrl} w-full pl-9`} />
                    </div>

                    <select value={basis} onChange={(e) => { setBasis(e.target.value); setMonth(''); }} className={ctrl} aria-label="Filter dates by">
                        <option value="order">Filter by Project Date</option>
                        <option value="submit">Filter by Submit Date</option>
                    </select>

                    <select value={status} onChange={(e) => setStatus(e.target.value)} className={ctrl} aria-label="Status">
                        <option value="all">All status</option>
                        {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>

                    <select value={employee} onChange={(e) => setEmployee(e.target.value)} className={ctrl} aria-label="Employee">
                        <option value="all">All employees</option>
                        <option value="__none">— not set —</option>
                        {employees.map((n) => <option key={n} value={n}>{n}</option>)}
                    </select>

                    <button onClick={() => setNewestFirst((v) => !v)} className={`inline-flex items-center gap-1.5 ${ctrl} hover:opacity-80`}>
                        {newestFirst ? <FiArrowDown size={14} /> : <FiArrowUp size={14} />} {newestFirst ? 'Newest first' : 'Oldest first'}
                    </button>

                    {filtersOn && (
                        <button onClick={clearFilters} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-rose-500 hover:bg-rose-500/10 transition">
                            <FiX size={14} /> Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Summary of what is on screen */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <SummaryTile isDark={isDark} label="Projects" value={filtered.length} accent="#6366f1" />
                <SummaryTile isDark={isDark} label="Total Price" value={bdt(totals.price)} accent="#0ea5e9" />
                <SummaryTile isDark={isDark} label="Paid" value={bdt(totals.paid)} cls="text-emerald-500" accent="#10b981" />
                <SummaryTile isDark={isDark} label="Due" value={bdt(totals.due)} cls="text-amber-500" accent="#f59e0b" />
            </div>

            {/* Sheet — every project is a two-line row, so the whole table fits the screen without sideways scrolling.
                (The Excel / CSV file keeps one column per item.) */}
            <div className={`rounded-xl border overflow-hidden ${isDark ? 'bg-slate-900 border-slate-700/60' : 'bg-white border-slate-200/70'}`}>
                <div className="overflow-auto max-h-[72vh]">
                    <table className="w-full min-w-[900px] table-fixed">
                        <colgroup>
                            {[3, 14, 10, 13, 19, 10, 16, 8, 7].map((w, i) => <col key={i} style={{ width: `${w}%` }} />)}
                        </colgroup>
                        <thead>
                            <tr>
                                <th className={th}>#</th>
                                <th className={th}>Project<span className={hsub}>name · code · date</span></th>
                                <th className={th}>Owner<span className={hsub}>name · phone</span></th>
                                <th className={th}>Company<span className={hsub}>company · website link</span></th>
                                <th className={th}>Domain / Hosting<span className={hsub}>domain · hosting · by us?</span></th>
                                <th className={th}>Price<span className={hsub}>hover for history</span></th>
                                <th className={th}>People<span className={hsub}>submitted by · employee</span></th>
                                <th className={th}>Status<span className={hsub}>submit date</span></th>
                                <th className={th + ' text-right'}>&nbsp;</th>
                            </tr>
                        </thead>
                        <tbody className={isDark ? 'divide-y divide-slate-700/50' : 'divide-y divide-slate-100'}>
                            {loading ? (
                                <tr><td colSpan={COLS} className={`text-center py-20 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>লোড হচ্ছে...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={COLS} className={`text-center py-20 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                    {rows.length === 0 ? 'এখনো কোনো প্রজেক্ট নেই।' : 'এই ফিল্টারে কোনো প্রজেক্ট মেলেনি।'}
                                </td></tr>
                            ) : filtered.map((r, i) => (
                                <tr key={r.id} className={isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50/70'}>
                                    <td className={td + ' text-slate-400 tabular-nums'}>{i + 1}</td>

                                    {/* Project: name / code · date */}
                                    <td className={td}>
                                        <p className="font-semibold truncate" title={r.name}>{r.name || '—'}</p>
                                        <p className={`${sub} mt-0.5 flex items-center gap-1.5 whitespace-nowrap`}>
                                            <span className="font-mono font-semibold" style={{ color: BRAND }}>{r.code || '—'}</span>
                                            <span className="text-slate-300">·</span>
                                            <span className="truncate" title={fmtDate(r.date)}>{shortFmt(r.date)}</span>
                                        </p>
                                    </td>

                                    {/* Owner: name / phone */}
                                    <td className={td}>
                                        <p className="font-semibold truncate" title={r.owner}>{r.owner}</p>
                                        <p className={`${sub} mt-0.5 truncate tabular-nums`}>{r.phone}</p>
                                    </td>

                                    {/* Company / website link (editable; otherwise taken from the domain we registered) */}
                                    <td className={td}>
                                        <p className="truncate" title={r.company}>{r.company || <span className="text-slate-400">—</span>}</p>
                                        <div className={`${sub} mt-0.5 min-w-0`}>
                                            <EditCell
                                                isDark={isDark}
                                                value={r.raw.websiteUrl || ''}
                                                placeholder="+ add link"
                                                title={r.raw.websiteUrl ? '' : r.siteText ? 'ডোমেইন থেকে নেওয়া — নিজে দিতে এডিট করুন' : ''}
                                                onSave={(v) => saveField(r.id, 'websiteUrl', v)}
                                                display={r.siteUrl ? (
                                                    <a href={r.siteUrl} target="_blank" rel="noopener noreferrer" className={link} title={r.siteUrl}>
                                                        <span className="truncate">{r.siteText.replace(/^https?:\/\//i, '').replace(/\/$/, '')}</span>
                                                        <FiExternalLink size={11} className="shrink-0" />
                                                    </a>
                                                ) : null}
                                            />
                                        </div>
                                    </td>

                                    {/* Domain + "by us?" / hosting */}
                                    <td className={td}>
                                        <div className="flex items-center gap-2 min-w-0">
                                            <span className="min-w-0 flex-1 truncate">
                                                {r.domainText
                                                    ? r.domainText.split(', ').map((d, k) => (
                                                        <React.Fragment key={d}>
                                                            {k > 0 && ', '}
                                                            <a href={toUrl(d)} target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:underline">{d}</a>
                                                        </React.Fragment>
                                                    ))
                                                    : <span className="text-slate-400">—</span>}
                                            </span>
                                            <span title={`Domain & Hosting by us: ${r.byUs}`} className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold border whitespace-nowrap ${BY_US_STYLE[r.byUs] || BY_US_STYLE.No}`}>
                                                {r.byUs === 'No' ? 'Not by us' : r.byUs.replace(' + ', '+')}
                                            </span>
                                        </div>
                                        <p className={`${sub} mt-0.5 truncate`} title={r.hostingText}>{r.hostingText || '—'}</p>
                                    </td>

                                    <td className={td}><PriceCell r={r} isDark={isDark} /></td>

                                    {/* People: submitted by / employee (both editable) */}
                                    <td className={td}>
                                        <div className="flex items-center gap-1.5 min-w-0">
                                            <span className={`${tag} w-10 shrink-0`}>By</span>
                                            <div className="min-w-0 flex-1">
                                                <EditCell isDark={isDark} value={r.submittedBy} placeholder="+ add" listId="pt-people-list" onSave={(v) => saveField(r.id, 'submittedBy', v)} />
                                            </div>
                                        </div>
                                        <div className="mt-0.5 flex items-center gap-1.5 min-w-0">
                                            <span className={`${tag} w-10 shrink-0`}>Under</span>
                                            <div className="min-w-0 flex-1">
                                                <EditCell isDark={isDark} value={r.employee} placeholder="+ add" listId="pt-people-list" onSave={(v) => saveField(r.id, 'assignedEmployee', v)} />
                                            </div>
                                        </div>
                                    </td>

                                    {/* Status / submit date */}
                                    <td className={td}>
                                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusStyle(r.status)}`}>{r.status}</span>
                                        <p className={`${sub} mt-1 whitespace-nowrap`}>{r.submitDate ? fmtDate(r.submitDate) : '—'}</p>
                                    </td>

                                    <td className={td + ' text-right whitespace-nowrap'}>
                                        <div className="inline-flex items-center">
                                            <button onClick={() => setViewing(r.raw)} title="View Details" className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-500/10 transition"><FiEye size={15} /></button>
                                            <button onClick={() => setEditing(r.raw)} title="Edit" className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-500/10 transition"><FiEdit3 size={15} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <datalist id="pt-people-list">{people.map((n) => <option key={n} value={n} />)}</datalist>

            <p className={`flex items-center gap-1.5 text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                <FiClock size={12} /> Price এর উপর মাউস নিলে (বা ক্লিক করলে) দামের ইতিহাস দেখা যায়। &quot;Website Link&quot;, &quot;Submitted By&quot;, &quot;Employee&quot; ঘরে ক্লিক করে সরাসরি লিখুন।
                Excel / CSV / Google Sheet এ ঠিক যা দেখছেন (ফিল্টার সহ) সেটাই নামবে।
            </p>

            {editing && (
                <ProjectModal
                    isDark={isDark}
                    project={editing}
                    onClose={() => setEditing(null)}
                    onSaved={(saved, meta) => {
                        setEditing(null);
                        load();
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
