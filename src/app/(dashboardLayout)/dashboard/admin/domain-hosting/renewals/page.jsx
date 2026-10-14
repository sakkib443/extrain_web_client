'use client';

// ===================================================================
// Renewals & Dues — the daily work list.
// Tab 1: whose domain / hosting needs renewing, grouped by the day the money is expected (next payment date, else expiry).
// Tab 2: clients who still owe money.
// Each row has WhatsApp (message already written), Call, Renew and Payment.
// ===================================================================

import React, { Suspense, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
    FiArrowLeft, FiRefreshCw, FiDollarSign, FiMessageCircle, FiPhone, FiSearch, FiCheck, FiRepeat, FiEye,
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import useDomainHosting from '@/components/DomainHosting/useDomainHosting';
import { useDomainModals } from '@/components/DomainHosting/Modals';
import { BRAND, useCx, Kpi, TypePill, DaysText } from '@/components/DomainHosting/ui';
import { isEditor } from '@/lib/access';
import {
    renewalBuckets, clientsDue, distinct, taka, fmtKey, waLink, reminderText, dueText, dayKey, diffDays, relDays,
} from '@/lib/domainLogic';

const TONE = {
    rose: { dot: 'bg-rose-500', text: 'text-rose-500', ring: 'border-rose-500/30' },
    amber: { dot: 'bg-amber-500', text: 'text-amber-500', ring: 'border-amber-500/30' },
    sky: { dot: 'bg-sky-500', text: 'text-sky-500', ring: 'border-sky-500/30' },
    emerald: { dot: 'bg-emerald-500', text: 'text-emerald-500', ring: 'border-emerald-500/30' },
};

function Renewals() {
    const { isDark } = useTheme();
    const cx = useCx(isDark);
    const sp = useSearchParams();
    const editor = isEditor(); // renewal dates only — no expected amounts, no dues tab, no payment button
    const { items, projects, loading, reload, today } = useDomainHosting();
    const { open, element } = useDomainModals({ isDark, items, projects, today, onChanged: reload });

    const [tab, setTab] = useState(!editor && sp.get('tab') === 'dues' ? 'dues' : 'renewals');
    const [horizon, setHorizon] = useState(60);
    const [overdueWindow, setOverdueWindow] = useState('all'); // how far back "overdue" reaches
    const [type, setType] = useState('all');
    const [provider, setProvider] = useState('all');
    const [q, setQ] = useState('');

    const providers = useMemo(() => distinct(items, (i) => i.provider), [items]);

    const filteredItems = useMemo(() => {
        const needle = q.trim().toLowerCase();
        const digits = needle.replace(/\D/g, '');
        return items.filter((it) => {
            if (type !== 'all' && it.type !== type) return false;
            if (provider !== 'all' && it.provider !== provider) return false;
            if (needle && !it.hay.includes(needle) && !(digits.length >= 3 && it.digits.includes(digits))) return false;
            return true;
        });
    }, [items, type, provider, q]);

    const buckets = useMemo(() => {
        const win = overdueWindow === 'all' ? Infinity : Number(overdueWindow);
        return renewalBuckets(filteredItems, horizon).map((b) =>
            b.key === 'overdue' ? { ...b, items: b.items.filter((it) => -it.dueIn <= win) } : b
        );
    }, [filteredItems, horizon, overdueWindow]);

    const dues = useMemo(() => clientsDue(filteredItems, 500), [filteredItems]);

    const expected = (list) => list.reduce((s, it) => s + it.renewPrice, 0);
    const bucket = (k) => buckets.find((b) => b.key === k)?.items || [];
    const overdue = bucket('overdue');
    const week = [...bucket('today'), ...bucket('d7')];
    const month = [...bucket('today'), ...bucket('d7'), ...bucket('d15'), ...bucket('d30')];
    const totalDue = dues.reduce((s, c) => s + c.due, 0);

    const sel = `${cx.ctrl} min-w-0`;

    const remindedText = (it) => {
        if (!it.lastReminderAt) return <span className="text-slate-400">not reminded</span>;
        const n = diffDays(today, dayKey(it.lastReminderAt));
        return <span className={n === 0 ? 'text-emerald-500' : 'text-slate-400'}>{n === 0 ? 'reminded today ✓' : `reminded ${relDays(-n)}`}</span>;
    };

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/admin/domain-hosting" className={cx.iconBtn}><FiArrowLeft size={16} /></Link>
                    <div>
                        <h1 className={`text-2xl font-bold ${cx.strong}`}>{editor ? 'Renewals' : <>Renewals &amp; Dues</>}</h1>
                        <p className={`text-sm ${cx.muted}`}>{editor ? 'কার ডোমেইন/হোস্টিংয়ের মেয়াদ কবে শেষ — রিমাইন্ডার আর রিনিউ' : 'কার কবে পেমেন্ট দেওয়ার কথা — রিমাইন্ডার, রিনিউ আর বকেয়া আদায়'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={reload} title="Refresh" className={cx.iconBtn}><FiRefreshCw size={16} className={loading ? 'animate-spin' : ''} /></button>
                    <Link href="/dashboard/admin/domain-hosting/all" className={cx.ghostBtn}>All records</Link>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <Kpi isDark={isDark} label="Overdue" value={overdue.length} tone={overdue.length ? 'rose' : 'slate'} sub={editor ? 'রিনিউ বাকি' : `${taka(expected(overdue))} পাওনা রিনিউ`} />
                <Kpi isDark={isDark} label="Due within 7 days" value={week.length} tone={week.length ? 'amber' : 'slate'} sub={editor ? 'রিনিউ করাতে হবে' : `${taka(expected(week))} আসার কথা`} />
                <Kpi isDark={isDark} label="Due within 30 days" value={month.length} tone="sky" sub={editor ? 'রিনিউ করাতে হবে' : `${taka(expected(month))} আসার কথা`} />
                {!editor && <Kpi isDark={isDark} label="Unpaid balances" value={taka(totalDue)} tone={totalDue ? 'amber' : 'slate'} sub={`${dues.length}জনের কাছে`} onClick={() => setTab('dues')} />}
            </div>

            {/* Tabs + filters */}
            <div className={`rounded-xl border p-4 space-y-3 ${cx.card}`}>
                <div className="flex flex-wrap items-center gap-2">
                    <div className={`inline-flex gap-1 p-1 rounded-xl ${isDark ? 'bg-slate-800/60' : 'bg-slate-100'}`}>
                        {[['renewals', 'Renewals'], ['dues', 'Unpaid dues']].filter(([k]) => !(editor && k === 'dues')).map(([k, label]) => (
                            <button key={k} onClick={() => setTab(k)}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${tab === k ? 'text-white shadow' : isDark ? 'text-slate-300 hover:bg-slate-700/50' : 'text-slate-600 hover:bg-white'}`}
                                style={tab === k ? { background: BRAND } : {}}>{label}</button>
                        ))}
                    </div>
                    <div className="relative flex-1 min-w-[200px] max-w-sm">
                        <FiSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ডোমেইন, মালিক, ফোন…" className={`${cx.ctrl} w-full pl-9`} />
                    </div>
                    <select value={type} onChange={(e) => setType(e.target.value)} className={sel} aria-label="Type">
                        <option value="all">All types</option><option value="domain">Domain</option><option value="hosting">Hosting</option><option value="both">Domain + Hosting</option>
                    </select>
                    <select value={provider} onChange={(e) => setProvider(e.target.value)} className={sel} aria-label="Provider">
                        <option value="all">All providers</option>{providers.map((p) => <option key={p}>{p}</option>)}
                    </select>
                    {tab === 'renewals' && (
                        <>
                            <select value={horizon} onChange={(e) => setHorizon(Number(e.target.value))} className={sel} aria-label="How far ahead">
                                <option value={30}>Next 30 days</option><option value={60}>Next 60 days</option><option value={90}>Next 90 days</option>
                            </select>
                            <select value={overdueWindow} onChange={(e) => setOverdueWindow(e.target.value)} className={sel} aria-label="How far back">
                                <option value="all">All overdue</option><option value="30">Overdue ≤ 30 days</option><option value="90">Overdue ≤ 90 days</option>
                            </select>
                        </>
                    )}
                </div>
                {tab === 'renewals' && <p className={`text-xs ${cx.muted}`}>তারিখ ধরা হয় <b>Next payment date</b>, সেটা না থাকলে <b>মেয়াদ শেষের তারিখ</b>। শুধু Active রেকর্ড আসে (Suspended / Cancelled নয়)।</p>}
            </div>

            {/* ===== Renewals ===== */}
            {tab === 'renewals' && (
                loading ? (
                    <p className={`text-center py-16 ${cx.muted}`}>লোড হচ্ছে…</p>
                ) : buckets.every((b) => b.items.length === 0) ? (
                    <div className={`rounded-xl border py-16 text-center ${cx.card}`}>
                        <p className="text-3xl mb-2">✅</p>
                        <p className={`font-semibold ${cx.strong}`}>এই ফিল্টারে কোনো রিনিউ বাকি নেই</p>
                        <p className={`text-sm ${cx.muted}`}>সময়সীমা বাড়িয়ে দেখুন বা ফিল্টার সরান।</p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {buckets.filter((b) => b.items.length > 0).map((b) => {
                            const tone = TONE[b.tone];
                            return (
                                <section key={b.key} className={`rounded-xl border overflow-hidden ${cx.card}`}>
                                    <header className={`flex flex-wrap items-center justify-between gap-2 px-5 py-3 border-b ${cx.border} ${isDark ? 'bg-slate-800/40' : 'bg-slate-50/70'}`}>
                                        <h2 className="flex items-center gap-2 font-bold">
                                            <i className={`w-2.5 h-2.5 rounded-full ${tone.dot}`} />
                                            <span className={cx.strong}>{b.label}</span>
                                            <span className={`text-sm font-normal ${cx.muted}`}>· {b.hint}</span>
                                        </h2>
                                        <p className={`text-sm ${cx.muted}`}><b className={cx.strong}>{b.items.length}</b>টা{!editor && <> · আসার কথা <b className={tone.text}>{taka(expected(b.items))}</b></>}</p>
                                    </header>
                                    <ul className={`divide-y ${cx.divide}`}>
                                        {b.items.map((it) => {
                                            const wa = it.phone ? waLink(it.phone, reminderText(it)) : '';
                                            return (
                                                <li key={it.id} className="flex flex-wrap items-center gap-x-5 gap-y-2 px-5 py-3">
                                                    <div className="min-w-0 flex-1 basis-56">
                                                        <p className="flex items-center gap-2 min-w-0">
                                                            <button onClick={() => open.detail(it)} className={`font-semibold truncate hover:underline text-left ${cx.strong}`}>{it.domainName}</button>
                                                            <TypePill type={it.type} isDark={isDark} />
                                                            {it.autoRenew && <FiRepeat size={12} className="text-sky-500 shrink-0" title="Auto-renew চালু" />}
                                                        </p>
                                                        <p className={`${cx.sub} truncate`}>{it.owner || '—'}{it.phone ? ` · ${it.phone}` : ''}{it.provider ? ` · ${it.provider}` : ''}</p>
                                                    </div>
                                                    <div className="w-36 text-sm">
                                                        <p className="whitespace-nowrap"><DaysText days={it.dueIn} /></p>
                                                        <p className={`${cx.sub} whitespace-nowrap`}>{fmtKey(it.dueKey)}{it.nextPay ? ' (payment)' : ''}</p>
                                                    </div>
                                                    {!editor && <div className="w-36 text-sm">
                                                        <p className={`font-bold whitespace-nowrap ${cx.strong}`}>{taka(it.renewPrice)}</p>
                                                        <p className={`${cx.sub} whitespace-nowrap`}>{it.due > 0 ? <span className="text-amber-500">+ {taka(it.due)} বকেয়া</span> : 'renewal fee'}</p>
                                                    </div>}
                                                    <p className="w-32 text-xs hidden xl:block">{remindedText(it)}</p>
                                                    <div className="inline-flex items-center gap-1 ml-auto">
                                                        {wa ? (
                                                            <button onClick={() => open.remind(it)} title="WhatsApp এ রিমাইন্ডার" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-white hover:opacity-90" style={{ background: '#25D366' }}>
                                                                <FiMessageCircle size={14} /> Remind
                                                            </button>
                                                        ) : (
                                                            <button onClick={() => open.edit(it)} title="ফোন নম্বর নেই — যোগ করুন" className={`px-3 py-2 rounded-lg text-xs font-semibold ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>+ phone</button>
                                                        )}
                                                        {it.phone && <a href={`tel:${it.phone}`} title="Call" className="p-2 rounded-lg text-sky-500 hover:bg-sky-500/10"><FiPhone size={16} /></a>}
                                                        <button onClick={() => open.renew(it)} title="Renew" className="p-2 rounded-lg text-emerald-500 hover:bg-emerald-500/10"><FiRefreshCw size={16} /></button>
                                                        {!editor && <button onClick={() => open.pay(it)} title="Add payment" className="p-2 rounded-lg text-orange-500 hover:bg-orange-500/10"><FiDollarSign size={16} /></button>}
                                                        <button onClick={() => open.detail(it)} title="Details" className="p-2 rounded-lg text-slate-400 hover:bg-slate-500/10"><FiEye size={16} /></button>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </section>
                            );
                        })}
                    </div>
                )
            )}

            {/* ===== Dues ===== */}
            {tab === 'dues' && (
                loading ? (
                    <p className={`text-center py-16 ${cx.muted}`}>লোড হচ্ছে…</p>
                ) : dues.length === 0 ? (
                    <div className={`rounded-xl border py-16 text-center ${cx.card}`}>
                        <p className="text-3xl mb-2"><FiCheck className="inline text-emerald-500" /></p>
                        <p className={`font-semibold ${cx.strong}`}>কারও কাছে বকেয়া নেই</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {dues.map((c) => {
                            const wa = c.phone ? waLink(c.phone, dueText(c)) : '';
                            return (
                                <section key={c.key} className={`rounded-xl border overflow-hidden ${cx.card}`}>
                                    <header className={`flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b ${cx.border} ${isDark ? 'bg-slate-800/40' : 'bg-slate-50/70'}`}>
                                        <div className="min-w-0">
                                            <p className={`font-bold truncate ${cx.strong}`}>{c.name}</p>
                                            <p className={cx.sub}>{c.phone || 'ফোন নম্বর নেই'} · {c.count}টা রেকর্ড</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <p className="text-xl font-bold text-amber-500">{taka(c.due)}</p>
                                            {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-white hover:opacity-90" style={{ background: '#25D366' }}><FiMessageCircle size={14} /> বকেয়ার মেসেজ</a>}
                                            {c.phone && <a href={`tel:${c.phone}`} title="Call" className="p-2 rounded-lg text-sky-500 hover:bg-sky-500/10"><FiPhone size={16} /></a>}
                                        </div>
                                    </header>
                                    <ul className={`divide-y ${cx.divide}`}>
                                        {c.items.map((it) => (
                                            <li key={it.id} className="flex flex-wrap items-center gap-x-5 gap-y-1 px-5 py-2.5 text-sm">
                                                <button onClick={() => open.detail(it)} className={`font-semibold hover:underline text-left min-w-0 flex-1 basis-48 truncate ${cx.strong}`}>{it.domainName}</button>
                                                <span className={cx.muted}>total {taka(it.revenue)} · paid {taka(it.paid)}</span>
                                                <span className="font-bold text-amber-500 w-24 text-right">{taka(it.due)}</span>
                                                <button onClick={() => open.pay(it)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: BRAND }}><FiDollarSign size={13} /> Payment</button>
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            );
                        })}
                    </div>
                )
            )}

            {element}
        </div>
    );
}

export default function RenewalsPage() {
    return (
        <Suspense fallback={<div className="py-20 text-center text-slate-400">লোড হচ্ছে…</div>}>
            <Renewals />
        </Suspense>
    );
}
