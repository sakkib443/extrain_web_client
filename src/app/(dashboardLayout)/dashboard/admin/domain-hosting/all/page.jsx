'use client';

// ===================================================================
// All Domains & Hosting — the registry.
// Add / edit / renew / take payment / delete, with every filter a domain business needs
// (type, status, payment, project link, provider, TLD, purchase month, expiry window, payment-due window).
// What is on screen can be downloaded as Excel / CSV or copied into a Google Sheet.
// ===================================================================

import React, { Suspense, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import {
    FiArrowLeft, FiPlus, FiRefreshCw, FiSearch, FiEdit3, FiTrash2, FiDollarSign, FiDownload, FiCopy, FiFileText,
    FiX, FiMessageCircle, FiFilter, FiChevronDown, FiExternalLink, FiRepeat,
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import useDomainHosting from '@/components/DomainHosting/useDomainHosting';
import { useDomainModals } from '@/components/DomainHosting/Modals';
import { BRAND, useCx, Kpi, StatePill, TypePill, DaysText } from '@/components/DomainHosting/ui';
import {
    DEFAULT_FILTERS, EXPIRY_PRESETS, DUE_PRESETS, SORTS, STATE, DOMAIN_COLUMNS,
    applyFilters, activeFilterCount, distinct, totals, taka, fmtKey, monthName, waLink, reminderText, dayKey, relDays,
} from '@/lib/domainLogic';
import { downloadXLSX, downloadCSV, copyForSheets } from '@/lib/projectSheet';

const PAGE = 50;

const initialFilters = (sp) => {
    const f = { ...DEFAULT_FILTERS };
    Object.keys(DEFAULT_FILTERS).forEach((k) => {
        const v = sp.get(k);
        if (v !== null && v !== '') f[k] = v;
    });
    return f;
};

const short = (key) => (key ? new Date(key + 'T00:00:00Z').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit', timeZone: 'UTC' }) : '—');

function Registry() {
    const { isDark } = useTheme();
    const cx = useCx(isDark);
    const sp = useSearchParams();
    const { items, projects, loading, reload, today } = useDomainHosting();

    const [f, setF] = useState(() => initialFilters(sp));
    const [showMore, setShowMore] = useState(() => {
        const init = initialFilters(sp);
        return ['provider', 'tld', 'link', 'billing', 'auto', 'buyMonth', 'buyFrom', 'buyTo', 'expFrom', 'expTo', 'due', 'dueFrom', 'dueTo'].some((k) => init[k] !== DEFAULT_FILTERS[k]);
    });
    const [limit, setLimit] = useState(PAGE);

    const { open, element } = useDomainModals({ isDark, items, projects, today, onChanged: reload, initialModal: sp.get('new') ? { kind: 'form' } : null });

    const set = (k) => (e) => { setF((p) => ({ ...p, [k]: e.target.value })); setLimit(PAGE); };
    const patch = (o) => { setF((p) => ({ ...p, ...o })); setLimit(PAGE); };

    const filtered = useMemo(() => applyFilters(items, f, today), [items, f, today]);
    const sum = useMemo(() => totals(filtered), [filtered]);
    const shown = filtered.slice(0, limit);

    const providers = useMemo(() => distinct(items, (i) => i.provider), [items]);
    const tlds = useMemo(() => distinct(items, (i) => i.tld), [items]);
    const buyMonths = useMemo(() => distinct(items, (i) => i.purchaseMonth).reverse(), [items]);

    const nFilters = activeFilterCount(f);
    const anything = nFilters > 0 || f.q.trim();
    const clear = () => { setF({ ...DEFAULT_FILTERS, sort: f.sort }); setLimit(PAGE); };

    // ---- export: what you see is what you get ----
    const base = () => `Domain-Hosting_${today}`;
    const guard = () => { if (!filtered.length) { toast.error('ডাউনলোড করার মতো কিছু নেই'); return false; } return true; };
    const totalLabel = (n) => `Total · ${n} records`;
    const doExcel = () => { if (!guard()) return; downloadXLSX(filtered, `${base()}.xlsx`, DOMAIN_COLUMNS, 'Domain & Hosting', totalLabel); toast.success(`${filtered.length}টা রেকর্ড Excel এ নামছে`); };
    const doCsv = () => { if (!guard()) return; downloadCSV(filtered, `${base()}.csv`, DOMAIN_COLUMNS); toast.success(`${filtered.length}টা রেকর্ড CSV এ নামছে`); };
    const doCopy = async () => {
        if (!guard()) return;
        try { await copyForSheets(filtered, DOMAIN_COLUMNS); toast.success('কপি হয়েছে ✅ Google Sheet এ গিয়ে Ctrl+V করুন', { duration: 5000 }); }
        catch { toast.error('কপি করা যায়নি — Excel/CSV ব্যবহার করুন'); }
    };

    const sel = `${cx.ctrl} min-w-0`;
    const COLS = 8;
    const iconBtn = (extra) => `p-1.5 rounded-lg transition ${extra}`;

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/admin/domain-hosting" className={cx.iconBtn}><FiArrowLeft size={16} /></Link>
                    <div>
                        <h1 className={`text-2xl font-bold ${cx.strong}`}>All Domains &amp; Hosting</h1>
                        <p className={`text-sm ${cx.muted}`}>{loading ? 'লোড হচ্ছে…' : `মোট ${items.length}টা · এখন দেখাচ্ছে ${filtered.length}টা`}</p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <button onClick={reload} title="Refresh" className={cx.iconBtn}><FiRefreshCw size={16} className={loading ? 'animate-spin' : ''} /></button>
                    <button onClick={doExcel} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-semibold shadow hover:opacity-90 transition" style={{ background: '#16a34a' }}><FiDownload size={16} /> Excel</button>
                    <button onClick={doCsv} className={cx.ghostBtn}><FiFileText size={16} /> CSV</button>
                    <button onClick={doCopy} title="কপি করে Google Sheet এ Paste করুন" className={cx.ghostBtn}><FiCopy size={16} /> Copy</button>
                    <button onClick={open.create} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-semibold shadow hover:opacity-90 transition" style={{ background: BRAND }}><FiPlus size={16} /> Add</button>
                </div>
            </div>

            {/* Filters */}
            <div className={`rounded-xl border p-4 space-y-3 ${cx.card}`}>
                <div className="flex flex-wrap items-center gap-2">
                    <div className="relative flex-1 min-w-[220px] max-w-md">
                        <FiSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input value={f.q} onChange={set('q')} placeholder="ডোমেইন, মালিক, ফোন, প্রজেক্ট কোড, প্রোভাইডার…" className={`${cx.ctrl} w-full pl-9`} />
                    </div>
                    <select value={f.type} onChange={set('type')} className={sel} aria-label="Type">
                        <option value="all">All types</option><option value="domain">Domain</option><option value="hosting">Hosting</option><option value="both">Domain + Hosting</option>
                    </select>
                    <select value={f.state} onChange={set('state')} className={sel} aria-label="Status">
                        <option value="all">All status</option>
                        {Object.entries(STATE).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                    <select value={f.pay} onChange={set('pay')} className={sel} aria-label="Payment">
                        <option value="all">All payments</option><option value="paid">Fully paid</option><option value="due">Has due</option><option value="partial">Partly paid</option><option value="unpaid">Nothing paid</option>
                    </select>
                    <select value={f.sort} onChange={set('sort')} className={sel} aria-label="Sort">
                        {SORTS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
                    </select>
                    <button onClick={() => setShowMore((v) => !v)} className={`inline-flex items-center gap-1.5 ${cx.ctrl} hover:opacity-80`}>
                        <FiFilter size={14} /> More filters{nFilters > 0 ? <span className="ml-0.5 px-1.5 rounded-full text-[11px] font-bold text-white" style={{ background: BRAND }}>{nFilters}</span> : null}
                        <FiChevronDown size={14} className={`transition ${showMore ? 'rotate-180' : ''}`} />
                    </button>
                    {anything && (
                        <button onClick={clear} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-rose-500 hover:bg-rose-500/10 transition"><FiX size={14} /> Clear</button>
                    )}
                </div>

                {/* expiry window — the question asked most often */}
                <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-xs font-semibold uppercase tracking-wide ${cx.muted}`}>Expires</span>
                    {EXPIRY_PRESETS.map((p) => {
                        const on = f.expiry === p.key && !f.expFrom && !f.expTo;
                        return (
                            <button key={p.key} onClick={() => patch({ expiry: p.key, expFrom: '', expTo: '' })}
                                className={`px-3 py-1 rounded-full text-[13px] font-semibold border transition ${on ? 'text-white border-transparent shadow' : isDark ? 'text-slate-300 border-slate-700 hover:bg-slate-700/50' : 'text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                                style={on ? { background: BRAND } : {}}>{p.label}</button>
                        );
                    })}
                </div>

                {showMore && (
                    <div className={`grid sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t ${cx.border}`}>
                        <div><label className={cx.label}>Provider</label>
                            <select value={f.provider} onChange={set('provider')} className={`${sel} w-full`}><option value="all">All providers</option><option value="__none">— not set —</option>{providers.map((p) => <option key={p}>{p}</option>)}</select></div>
                        <div><label className={cx.label}>Extension (.com, .com.bd…)</label>
                            <select value={f.tld} onChange={set('tld')} className={`${sel} w-full`}><option value="all">All</option>{tlds.map((p) => <option key={p}>{p}</option>)}</select></div>
                        <div><label className={cx.label}>Project link</label>
                            <select value={f.link} onChange={set('link')} className={`${sel} w-full`}><option value="all">All</option><option value="project">Linked to a project</option><option value="standalone">Standalone</option><option value="auto">Came from a project form</option></select></div>
                        <div><label className={cx.label}>Billing (linked only)</label>
                            <select value={f.billing} onChange={set('billing')} className={`${sel} w-full`}><option value="all">All</option><option value="included">Inside project price</option><option value="separate">Separate payment</option></select></div>

                        <div><label className={cx.label}>Auto-renew</label>
                            <select value={f.auto} onChange={set('auto')} className={`${sel} w-full`}><option value="all">All</option><option value="on">On</option><option value="off">Off</option></select></div>
                        <div><label className={cx.label}>Purchased in</label>
                            <select value={f.buyMonth} onChange={set('buyMonth')} className={`${sel} w-full`}><option value="all">Any month</option>{buyMonths.map((m) => <option key={m} value={m}>{monthName(m)}</option>)}</select></div>
                        <div><label className={cx.label}>Purchased from</label><input type="date" value={f.buyFrom} onChange={set('buyFrom')} className={`${cx.ctrl} w-full`} /></div>
                        <div><label className={cx.label}>Purchased to</label><input type="date" value={f.buyTo} onChange={set('buyTo')} className={`${cx.ctrl} w-full`} /></div>

                        <div><label className={cx.label}>Expires from</label><input type="date" value={f.expFrom} onChange={set('expFrom')} className={`${cx.ctrl} w-full`} /></div>
                        <div><label className={cx.label}>Expires to</label><input type="date" value={f.expTo} onChange={set('expTo')} className={`${cx.ctrl} w-full`} /></div>
                        <div><label className={cx.label}>Payment due (next payment date)</label>
                            <select value={f.due} onChange={(e) => patch({ due: e.target.value, dueFrom: '', dueTo: '' })} className={`${sel} w-full`}>{DUE_PRESETS.map((p) => <option key={p.key} value={p.key}>{p.label}</option>)}</select></div>
                        <div className="grid grid-cols-2 gap-2">
                            <div><label className={cx.label}>Due from</label><input type="date" value={f.dueFrom} onChange={set('dueFrom')} className={`${cx.ctrl} w-full`} /></div>
                            <div><label className={cx.label}>Due to</label><input type="date" value={f.dueTo} onChange={set('dueTo')} className={`${cx.ctrl} w-full`} /></div>
                        </div>
                    </div>
                )}
            </div>

            {/* What is on screen, added up */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <Kpi isDark={isDark} label="Records" value={sum.count} tone="indigo" />
                <Kpi isDark={isDark} label="Revenue" value={taka(sum.revenue)} tone="sky" />
                <Kpi isDark={isDark} label="Paid" value={taka(sum.paid)} tone="emerald" />
                <Kpi isDark={isDark} label="Due" value={taka(sum.due)} tone={sum.due > 0 ? 'amber' : 'slate'} />
                <Kpi isDark={isDark} label="Profit" value={taka(sum.profit)} tone={sum.profit >= 0 ? 'emerald' : 'rose'} sub={`cost ${taka(sum.cost)}`} />
            </div>

            {/* Table */}
            <div className={`rounded-xl border overflow-hidden ${isDark ? 'bg-slate-900 border-slate-700/60' : 'bg-white border-slate-200/70'}`}>
                <div className="overflow-auto max-h-[72vh]">
                    <table className="w-full min-w-[1040px] table-fixed">
                        <colgroup>{[3, 20, 14, 12, 18, 12, 10, 11].map((w, i) => <col key={i} style={{ width: `${w}%` }} />)}</colgroup>
                        <thead>
                            <tr>
                                <th className={cx.th}>#</th>
                                <th className={cx.th}>Domain / Hosting<span className="block text-[10px] font-medium normal-case tracking-normal text-slate-400">type · size · provider</span></th>
                                <th className={cx.th}>Owner<span className="block text-[10px] font-medium normal-case tracking-normal text-slate-400">name · phone</span></th>
                                <th className={cx.th}>Project<span className="block text-[10px] font-medium normal-case tracking-normal text-slate-400">link · billing</span></th>
                                <th className={cx.th}>Term<span className="block text-[10px] font-medium normal-case tracking-normal text-slate-400">bought → expires</span></th>
                                <th className={cx.th}>Money<span className="block text-[10px] font-medium normal-case tracking-normal text-slate-400">revenue · due</span></th>
                                <th className={cx.th}>Status<span className="block text-[10px] font-medium normal-case tracking-normal text-slate-400">renewals</span></th>
                                <th className={cx.th + ' text-right'}>&nbsp;</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${cx.divide}`}>
                            {loading ? (
                                <tr><td colSpan={COLS} className={`text-center py-20 ${cx.muted}`}>লোড হচ্ছে...</td></tr>
                            ) : shown.length === 0 ? (
                                <tr><td colSpan={COLS} className={`text-center py-20 ${cx.muted}`}>
                                    {items.length === 0 ? 'এখনো কিছু যোগ করা হয়নি — ওপরের "Add" চাপুন।' : 'এই ফিল্টারে কিছু মেলেনি।'}
                                </td></tr>
                            ) : shown.map((it, i) => {
                                const inactive = it.status !== 'active';
                                const wa = it.phone ? waLink(it.phone, reminderText(it)) : '';
                                return (
                                    <tr key={it.id} className={isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50/70'}>
                                        <td className={cx.td + ' text-slate-400 tabular-nums'}>{i + 1}</td>

                                        <td className={cx.td}>
                                            <button onClick={() => open.detail(it)} className={`block max-w-full text-left font-semibold truncate hover:underline ${inactive ? 'opacity-60' : ''}`} title={it.domainName}>{it.domainName}</button>
                                            <p className={`${cx.sub} mt-0.5 flex items-center gap-1.5 min-w-0`}>
                                                <TypePill type={it.type} isDark={isDark} />
                                                <span className="truncate">{[it.hostingGB ? `${it.hostingGB} GB` : '', it.provider].filter(Boolean).join(' · ')}</span>
                                                {it.autoRenew && <FiRepeat size={11} className="shrink-0 text-sky-500" title="Auto-renew" />}
                                            </p>
                                        </td>

                                        <td className={cx.td}>
                                            <p className="font-semibold truncate" title={it.owner}>{it.owner || <span className="text-slate-400">—</span>}</p>
                                            <p className={`${cx.sub} mt-0.5 flex items-center gap-1.5`}>
                                                <span className="truncate tabular-nums">{it.phone || '—'}</span>
                                                {wa && <a href={wa} target="_blank" rel="noopener noreferrer" title="WhatsApp" className="shrink-0 text-[#25D366] hover:opacity-80"><FiMessageCircle size={13} /></a>}
                                            </p>
                                        </td>

                                        <td className={cx.td}>
                                            {it.projectCode ? (
                                                <>
                                                    <p className="font-mono font-semibold truncate" style={{ color: BRAND }} title={it.linkedClientName}>{it.projectCode}</p>
                                                    <p className={`${cx.sub} mt-0.5 truncate`}>{it.billing === 'included' ? 'দামের ভিতরে' : 'আলাদা পেমেন্ট'}{it.fromProject ? ' · auto' : ''}</p>
                                                </>
                                            ) : (
                                                <p className="text-slate-400">Standalone</p>
                                            )}
                                        </td>

                                        <td className={cx.td}>
                                            <p className="whitespace-nowrap">{short(it.purchase)} <span className="text-slate-400">→</span> <b>{short(it.expiry)}</b></p>
                                            <p className={`${cx.sub} mt-0.5 whitespace-nowrap`}>
                                                <DaysText days={it.daysLeft} inactive={inactive} />
                                                {it.nextPay ? <span className="ml-1.5">· pay {short(it.nextPay)}</span> : null}
                                            </p>
                                        </td>

                                        <td className={cx.td}>
                                            <p className="font-bold whitespace-nowrap">{taka(it.revenue)}</p>
                                            <p className={`${cx.sub} mt-0.5 whitespace-nowrap`}>
                                                {it.revenue <= 0 ? <span className="text-slate-400">free</span> : it.due > 0 ? <span className="text-amber-500 font-semibold">{taka(it.due)} due</span> : <span className="text-emerald-500">paid in full</span>}
                                            </p>
                                        </td>

                                        <td className={cx.td}>
                                            <StatePill state={it.state} />
                                            <p className={`${cx.sub} mt-1 whitespace-nowrap`}>{it.renewalCount ? `renewed ×${it.renewalCount}` : 'not renewed'}</p>
                                        </td>

                                        <td className={`${cx.td} !px-1.5 text-right whitespace-nowrap`}>
                                            <div className="inline-flex items-center">
                                                <button onClick={() => open.renew(it)} disabled={it.status === 'cancelled'} title="Renew" className={iconBtn('text-emerald-500 hover:bg-emerald-500/10 disabled:opacity-30')}><FiRefreshCw size={15} /></button>
                                                <button onClick={() => open.pay(it)} title="Add payment" className={iconBtn('text-orange-500 hover:bg-orange-500/10')}><FiDollarSign size={15} /></button>
                                                <button onClick={() => open.edit(it)} title="Edit" className={iconBtn('text-blue-500 hover:bg-blue-500/10')}><FiEdit3 size={15} /></button>
                                                <button onClick={() => open.remove(it)} title="Delete" className={iconBtn('text-rose-500 hover:bg-rose-500/10')}><FiTrash2 size={15} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {filtered.length > shown.length && (
                    <div className={`flex items-center justify-center gap-3 py-3 border-t ${cx.border}`}>
                        <span className={`text-sm ${cx.muted}`}>{shown.length} / {filtered.length}</span>
                        <button onClick={() => setLimit((l) => l + PAGE)} className={cx.ghostBtn}>আরও {Math.min(PAGE, filtered.length - shown.length)}টা দেখুন</button>
                        <button onClick={() => setLimit(filtered.length)} className={`text-sm underline ${cx.muted}`}>সব দেখুন</button>
                    </div>
                )}
            </div>

            <p className={`text-xs ${cx.muted}`}>
                নামের উপর ক্লিক করলে রিনিউ ও পেমেন্টের পুরো ইতিহাস দেখা যায়। প্রজেক্টের ফর্ম থেকে যোগ করা ডোমেইন/হোস্টিংও এখানে আসে, আর এখান থেকে প্রজেক্ট বেছে দিলে সেটা প্রজেক্টের মাসিক <b>Domain/Hosting</b> ট্যাবেও দেখা যায়।
                Excel/CSV/Google Sheet এ ঠিক যা দেখছেন (ফিল্টারসহ) সেটাই নামে।
            </p>

            {element}
        </div>
    );
}

export default function AllDomainHostingPage() {
    return (
        <Suspense fallback={<div className="py-20 text-center text-slate-400">লোড হচ্ছে…</div>}>
            <Registry />
        </Suspense>
    );
}
