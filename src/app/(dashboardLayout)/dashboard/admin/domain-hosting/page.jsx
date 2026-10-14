'use client';

// ===================================================================
// Domain & Hosting — Overview
// The numbers a domain business watches: what expires soon, who owes money, what the month brought in.
// ===================================================================

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    FiPlus, FiRefreshCw, FiGlobe, FiServer, FiAlertTriangle, FiClock, FiDollarSign, FiTrendingUp, FiList, FiBell,
    FiMessageCircle, FiArrowRight,
} from 'react-icons/fi';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { useTheme } from '@/providers/ThemeProvider';
import useDomainHosting from '@/components/DomainHosting/useDomainHosting';
import { useDomainModals } from '@/components/DomainHosting/Modals';
import { BRAND, useCx, Kpi, StatePill, DaysText, BarRow } from '@/components/DomainHosting/ui';
import { isEditor } from '@/lib/access';
import {
    totals, monthlySeries, expiryBuckets, groupTop, clientsDue, needsAttention, taka, monthName, waLink, reminderText, dueText, fmtKey, addDaysKey,
} from '@/lib/domainLogic';

const Card = ({ cx, title, action, children, className = '' }) => (
    <section className={`rounded-xl border p-5 ${cx.card} ${className}`}>
        <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className={`font-bold ${cx.strong}`}>{title}</h2>
            {action}
        </div>
        {children}
    </section>
);

const MoreLink = ({ href, children }) => (
    <Link href={href} className="inline-flex items-center gap-1 text-xs font-semibold hover:underline" style={{ color: BRAND }}>{children} <FiArrowRight size={12} /></Link>
);

export default function DomainHostingOverview() {
    const { isDark } = useTheme();
    const cx = useCx(isDark);
    const router = useRouter();
    const editor = isEditor(); // an editor sees counts and dates only — no revenue, profit or dues
    const { items, projects, loading, reload, today } = useDomainHosting();
    const { open, element } = useDomainModals({ isDark, items, projects, today, onChanged: reload });

    const live = useMemo(() => items.filter((i) => i.status !== 'cancelled'), [items]);
    const sum = useMemo(() => totals(live), [live]);
    const series = useMemo(() => monthlySeries(items, 12, today), [items, today]);
    const thisMonth = series[series.length - 1];
    const buckets = useMemo(() => expiryBuckets(items), [items]);
    const attention = useMemo(() => needsAttention(items), [items]);
    const dues = useMemo(() => clientsDue(items, 6), [items]);
    const providers = useMemo(() => groupTop(live, (i) => i.provider, 5), [live]);
    const tlds = useMemo(() => groupTop(live, (i) => i.tld, 5), [live]);

    const count = (fn) => items.filter(fn).length;
    const domains = count((i) => i.status !== 'cancelled' && (i.type === 'domain' || i.type === 'both'));
    const hostings = count((i) => i.status !== 'cancelled' && (i.type === 'hosting' || i.type === 'both'));
    const expiring = count((i) => i.state === 'expiring');
    const expired = count((i) => i.state === 'expired');
    const activeOk = count((i) => i.state === 'active' || i.state === 'expiring');
    const owing = count((i) => i.due > 0 && i.status !== 'cancelled');
    const maxBucket = Math.max(1, ...buckets.map((b) => b.count));

    // each bar opens the registry on exactly the same days the bar counted
    const bucketQuery = (key) => {
        const win = { 30: [8, 30], 60: [31, 60], 90: [61, 90] }[key];
        return win ? `expFrom=${addDaysKey(today, win[0])}&expTo=${addDaysKey(today, win[1])}` : `expiry=${key}`;
    };

    const axis = isDark ? '#94a3b8' : '#64748b';
    const grid = isDark ? '#334155' : '#e2e8f0';

    const remindDue = (c) => {
        const link = waLink(c.phone, dueText(c));
        if (link) window.open(link, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className={`text-2xl font-bold ${cx.strong}`}>Domain &amp; Hosting</h1>
                    <p className={`text-sm ${cx.muted}`}>{editor ? 'ডোমেইন ও হোস্টিংয়ের মেয়াদ আর রিনিউ — এক জায়গায়' : 'ডোমেইন ও হোস্টিং বিক্রির হিসাব, মেয়াদ আর বকেয়া — এক জায়গায়'}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <button onClick={reload} title="Refresh" className={cx.iconBtn}><FiRefreshCw size={16} className={loading ? 'animate-spin' : ''} /></button>
                    <Link href="/dashboard/admin/domain-hosting/renewals" className={cx.ghostBtn}><FiBell size={16} /> {editor ? 'Renewals' : <>Renewals &amp; Dues</>}</Link>
                    <Link href="/dashboard/admin/domain-hosting/all" className={cx.ghostBtn}><FiList size={16} /> All records</Link>
                    <button onClick={open.create} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-semibold shadow hover:opacity-90 transition" style={{ background: BRAND }}>
                        <FiPlus size={16} /> Add new
                    </button>
                </div>
            </div>

            {/* The numbers that matter today */}
            <div className={`grid grid-cols-2 gap-3 ${editor ? 'md:grid-cols-3' : 'md:grid-cols-3 xl:grid-cols-6'}`}>
                <Kpi isDark={isDark} icon={FiGlobe} label="Live" value={activeOk} tone="emerald" sub={`${domains} domain · ${hostings} hosting`} />
                <Kpi isDark={isDark} icon={FiClock} label="Expiring ≤ 30 days" value={expiring} tone={expiring > 0 ? 'amber' : 'slate'} sub="রিনিউ করাতে হবে" onClick={() => router.push('/dashboard/admin/domain-hosting/all?state=expiring')} />
                <Kpi isDark={isDark} icon={FiAlertTriangle} label="Expired" value={expired} tone={expired > 0 ? 'rose' : 'slate'} sub="মেয়াদ শেষ" onClick={() => router.push('/dashboard/admin/domain-hosting/all?state=expired')} />
                {!editor && <>
                <Kpi isDark={isDark} icon={FiDollarSign} label="Unpaid dues" value={taka(sum.due)} tone={sum.due > 0 ? 'amber' : 'slate'} sub={`${owing}টা রেকর্ডে বাকি`} onClick={() => router.push('/dashboard/admin/domain-hosting/all?pay=due')} />
                <Kpi isDark={isDark} icon={FiTrendingUp} label={`${monthName(today.slice(0, 7)).split(' ')[0]} revenue`} value={taka(thisMonth?.revenue)} tone="sky" sub={`profit ${taka(thisMonth?.profit)}`} />
                <Kpi isDark={isDark} icon={FiServer} label="All-time profit" value={taka(sum.profit)} tone={sum.profit >= 0 ? 'emerald' : 'rose'} sub={`revenue ${taka(sum.revenue)}`} />
                </>}
            </div>

            <div className="grid xl:grid-cols-3 gap-5">
                {!editor && <Card cx={cx} title="Revenue & profit — last 12 months" className="xl:col-span-2"
                    action={<span className={`text-xs ${cx.muted}`}>নতুন বিক্রি + রিনিউ, তারিখ অনুযায়ী</span>}>
                    <div className="h-[19.5rem]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={series} margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
                                <XAxis dataKey="label" tick={{ fill: axis, fontSize: 11 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: axis, fontSize: 11 }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    formatter={(v, name) => [taka(v), name]}
                                    contentStyle={{ background: isDark ? '#0f172a' : '#fff', border: `1px solid ${grid}`, borderRadius: 10, fontSize: 12 }}
                                    labelStyle={{ color: isDark ? '#e2e8f0' : '#334155', fontWeight: 600 }}
                                    cursor={{ fill: isDark ? 'rgba(148,163,184,0.08)' : 'rgba(100,116,139,0.06)' }}
                                />
                                <Legend wrapperStyle={{ fontSize: 12 }} />
                                <Bar dataKey="revenue" name="Revenue" fill="#0ea5e9" radius={[4, 4, 0, 0]} maxBarSize={22} />
                                <Bar dataKey="profit" name="Profit" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={22} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>}

                <Card cx={cx} title="When things expire" className={editor ? 'xl:col-span-3' : ''} action={<MoreLink href="/dashboard/admin/domain-hosting/all">Filter</MoreLink>}>
                    <div className="space-y-3.5">
                        {buckets.map((b) => (
                            <BarRow key={b.key} isDark={isDark} label={b.label} value={b.count} max={maxBucket} tone={b.tone}
                                onClick={b.key === 'later' ? undefined : () => router.push(`/dashboard/admin/domain-hosting/all?${bucketQuery(b.key)}`)} />
                        ))}
                    </div>
                    <p className={`text-[11px] mt-4 ${cx.muted}`}>শুধু Active রেকর্ড গোনা হয়েছে। ব্যবধানগুলো আজ থেকে।</p>
                </Card>
            </div>

            <div className="grid xl:grid-cols-3 gap-5">
                <Card cx={cx} title="Needs attention" className={editor ? 'xl:col-span-3' : 'xl:col-span-2'}
                    action={<MoreLink href="/dashboard/admin/domain-hosting/renewals">{editor ? 'Renewals' : <>Renewals &amp; Dues</>}</MoreLink>}>
                    {attention.length === 0 ? (
                        <p className={`text-sm py-6 text-center ${cx.muted}`}>{loading ? 'লোড হচ্ছে…' : '✅ এখন কোনো মেয়াদ শেষ বা শেষ হওয়ার কাছাকাছি নেই।'}</p>
                    ) : (
                        <ul className={`divide-y ${cx.divide}`}>
                            {attention.slice(0, 8).map((it) => {
                                const wa = it.phone ? waLink(it.phone, reminderText(it)) : '';
                                return (
                                    <li key={it.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-2.5">
                                        <div className="min-w-0 flex-1 basis-48">
                                            <button onClick={() => open.detail(it)} className={`font-semibold truncate hover:underline text-left max-w-full ${cx.strong}`}>{it.domainName}</button>
                                            <p className={`${cx.sub} truncate`}>{it.owner || '—'}{it.phone ? ` · ${it.phone}` : ''}</p>
                                        </div>
                                        <div className="text-sm text-right">
                                            <DaysText days={it.daysLeft} />
                                            <p className={cx.sub}>{fmtKey(it.expiry)}</p>
                                        </div>
                                        <StatePill state={it.state} />
                                        <div className="inline-flex items-center gap-1">
                                            {wa && <a href={wa} target="_blank" rel="noopener noreferrer" title="WhatsApp reminder" className="p-2 rounded-lg text-[#25D366] hover:bg-[#25D366]/10"><FiMessageCircle size={16} /></a>}
                                            <button onClick={() => open.renew(it)} title="Renew" className="p-2 rounded-lg text-emerald-500 hover:bg-emerald-500/10"><FiRefreshCw size={16} /></button>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                    {attention.length > 8 && <p className={`text-xs mt-3 ${cx.muted}`}>আরও {attention.length - 8}টা — <Link className="underline" href="/dashboard/admin/domain-hosting/renewals">সব দেখুন</Link></p>}
                </Card>

                {!editor && <Card cx={cx} title="Who owes money" action={<MoreLink href="/dashboard/admin/domain-hosting/renewals?tab=dues">All dues</MoreLink>}>
                    {dues.length === 0 ? (
                        <p className={`text-sm py-6 text-center ${cx.muted}`}>{loading ? 'লোড হচ্ছে…' : '✅ কারও কাছে বকেয়া নেই।'}</p>
                    ) : (
                        <ul className={`divide-y ${cx.divide}`}>
                            {dues.map((c) => (
                                <li key={c.key} className="flex items-center gap-3 py-2.5">
                                    <div className="min-w-0 flex-1">
                                        <p className={`font-semibold truncate ${cx.strong}`}>{c.name}</p>
                                        <p className={`${cx.sub} truncate`}>{c.count}টা · {c.items[0].domainName}{c.count > 1 ? '…' : ''}</p>
                                    </div>
                                    <p className="font-bold text-amber-500 whitespace-nowrap">{taka(c.due)}</p>
                                    {c.phone && <button onClick={() => remindDue(c)} title="বকেয়ার মেসেজ পাঠান" className="p-2 rounded-lg text-[#25D366] hover:bg-[#25D366]/10"><FiMessageCircle size={16} /></button>}
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>}
            </div>

            <div className={`grid gap-5 ${editor ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
                <Card cx={cx} title="By provider">
                    {providers.length === 0 ? <p className={`text-sm ${cx.muted}`}>প্রোভাইডার দেওয়া নেই।</p> : (
                        <ul className="space-y-3">
                            {providers.map((p) => (
                                <li key={p.key} className="flex items-center justify-between text-sm gap-3">
                                    <span className={`${cx.text} truncate`}>{p.key}</span>
                                    <span className={cx.muted}><b className={cx.strong}>{p.count}</b>{!editor && <> · profit <span className={p.profit >= 0 ? 'text-emerald-500' : 'text-rose-500'}>{taka(p.profit)}</span></>}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>
                <Card cx={cx} title="By extension (.com, .com.bd…)">
                    {tlds.length === 0 ? <p className={`text-sm ${cx.muted}`}>কোনো ডোমেইন নেই।</p> : (
                        <ul className="space-y-3">
                            {tlds.map((p) => (
                                <li key={p.key} className="flex items-center justify-between text-sm gap-3">
                                    <Link href={`/dashboard/admin/domain-hosting/all?tld=${encodeURIComponent(p.key)}`} className={`${cx.text} hover:underline font-mono`}>{p.key}</Link>
                                    <span className={cx.muted}><b className={cx.strong}>{p.count}</b>{!editor && <> · revenue {taka(p.revenue)}</>}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>
                {!editor && <Card cx={cx} title="Revenue split">
                    <div className="space-y-3 text-sm">
                        {[
                            ['Domain', live.filter((i) => i.type === 'domain')],
                            ['Hosting', live.filter((i) => i.type === 'hosting')],
                            ['Domain + Hosting', live.filter((i) => i.type === 'both')],
                        ].map(([label, list]) => {
                            const t = totals(list);
                            return (
                                <div key={label} className="flex items-center justify-between gap-3">
                                    <span className={cx.text}>{label} <span className={cx.muted}>({t.count})</span></span>
                                    <span className={cx.muted}>{taka(t.revenue)} · <span className={t.profit >= 0 ? 'text-emerald-500' : 'text-rose-500'}>{taka(t.profit)}</span></span>
                                </div>
                            );
                        })}
                        <p className={`text-[11px] pt-1 ${cx.muted}`}>Revenue · Profit (বাতিল বাদে)</p>
                    </div>
                </Card>}
            </div>

            {element}
        </div>
    );
}
