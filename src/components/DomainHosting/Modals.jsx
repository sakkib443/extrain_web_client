'use client';

// Add / edit, renew, payment and detail windows for a domain or hosting record,
// plus the `useDomainModals` hook every Domain & Hosting screen uses to open them.
import React, { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
    FiSave, FiRefreshCw, FiDollarSign, FiEdit3, FiTrash2, FiLink2, FiX, FiMessageCircle, FiRotateCcw, FiCheckCircle,
} from 'react-icons/fi';
import { dhApi } from '@/lib/domainHosting';
import { BILLING_MODES } from '@/lib/projectTracker';
import {
    TYPE_LABEL, METHODS, CYCLES, PROVIDERS, addMonthsKey, dayKey, diffDays, fmtKey, taka, waLink, reminderText, relDays,
} from '@/lib/domainLogic';
import { BRAND, useCx, Modal, SectionTitle, StatePill, TypePill, DaysText } from './ui';

const num = (v) => Number(v) || 0;

const projectLabel = (p) => `${p.projectId} · ${p.clientName}${p.companyBrand ? ` (${p.companyBrand})` : ''}`;

// ---------------------------------------------------------------
// Add / edit
// ---------------------------------------------------------------
export function DomainFormModal({ isDark, item, projects, today, onClose, onSaved }) {
    const cx = useCx(isDark);
    const editing = !!item?.id;
    const expTouched = useRef(editing && !!item?.expiry);

    const [f, setF] = useState(() => ({
        type: item?.type || 'domain',
        domainName: item?.domainName || '',
        hostingGB: item?.hostingGB ?? '',
        hostingPlan: item?.hostingPlan || '',
        provider: item?.provider || '',
        owner: item?.owner || '',
        ownerPhone: item?.phone || '',
        ownerEmail: item?.email || '',
        billing: item?.billing || 'separate',
        purchaseDate: item?.purchase || today,
        expiryDate: item?.expiry || addMonthsKey(today, item?.cycleMonths || 12),
        nextPaymentDate: item?.nextPay || '',
        cycleMonths: item?.cycleMonths || 12,
        autoRenew: !!item?.autoRenew,
        status: item?.status || 'active',
        buyPrice: item?.buyPrice ?? '',
        sellPrice: item?.sellPrice ?? '',
        clientPaid: '',
        renewalSellPrice: item?.renewalSellPrice ?? '',
        renewalBuyPrice: item?.renewalBuyPrice ?? '',
        note: item?.note || '',
    }));
    const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));

    // purchase date / term change → the expiry follows, until someone types an expiry by hand
    const onPurchase = (e) => {
        const v = e.target.value;
        setF((p) => ({ ...p, purchaseDate: v, expiryDate: !expTouched.current && v ? addMonthsKey(v, num(p.cycleMonths) || 12) : p.expiryDate }));
    };
    const onCycle = (e) => {
        const m = Number(e.target.value);
        setF((p) => ({ ...p, cycleMonths: m, expiryDate: !expTouched.current && p.purchaseDate ? addMonthsKey(p.purchaseDate, m) : p.expiryDate }));
    };
    const onExpiry = (e) => { expTouched.current = true; setF((p) => ({ ...p, expiryDate: e.target.value })); };

    // ---- project link: type to search the list, pick one ----
    const [projectText, setProjectText] = useState(() => (item?.projectCode ? (item.project ? projectLabel(item.project) : item.projectCode) : ''));
    const linked = useMemo(() => {
        const t = projectText.trim().toLowerCase();
        if (!t) return null;
        return projects.find((p) => projectLabel(p).toLowerCase() === t) || projects.find((p) => p.projectId.toLowerCase() === t) || null;
    }, [projectText, projects]);
    // an existing link that the list does not know any more (deleted project) stays as it is
    const keptCode = !projectText.trim() ? '' : linked ? linked.projectId : item?.projectCode && projectText === (item.project ? projectLabel(item.project) : item.projectCode) ? item.projectCode : '';

    const onProject = (e) => {
        const v = e.target.value;
        setProjectText(v);
        const p = projects.find((x) => projectLabel(x) === v);
        if (p) {
            // fill the owner details that are still empty
            setF((prev) => ({ ...prev, owner: prev.owner || p.clientName || '', ownerPhone: prev.ownerPhone || p.phone || '', ownerEmail: prev.ownerEmail || p.email || '' }));
        }
    };

    const hasHosting = f.type === 'hosting' || f.type === 'both';
    const profit = num(f.sellPrice) - num(f.buyPrice);
    const dueNow = Math.max(0, num(f.sellPrice) - num(f.clientPaid));
    const [saving, setSaving] = useState(false);

    const save = async (force = false) => {
        if (!f.domainName.trim()) { toast.error(hasHosting && f.type === 'hosting' ? 'Site / হোস্টিংয়ের নাম দিন' : 'Domain এর নাম দিন'); return; }
        if (projectText.trim() && !keptCode) { toast.error('তালিকা থেকে একটি প্রজেক্ট বেছে নিন, অথবা ঘরটা ফাঁকা রাখুন'); return; }
        if (f.purchaseDate && f.expiryDate && f.expiryDate <= f.purchaseDate) { toast.error('মেয়াদ শেষের তারিখ কেনার তারিখের পরে হতে হবে'); return; }

        const body = {
            type: f.type,
            domainName: f.domainName,
            hostingGB: hasHosting ? f.hostingGB : '',
            hostingPlan: hasHosting ? f.hostingPlan : '',
            provider: f.provider,
            owner: f.owner,
            ownerPhone: f.ownerPhone,
            ownerEmail: f.ownerEmail,
            linkedProjectId: keptCode,
            billing: keptCode ? f.billing : 'separate',
            purchaseDate: f.purchaseDate,
            expiryDate: f.expiryDate,
            nextPaymentDate: f.nextPaymentDate,
            cycleMonths: f.cycleMonths,
            autoRenew: f.autoRenew,
            buyPrice: f.buyPrice,
            sellPrice: f.sellPrice,
            renewalSellPrice: f.renewalSellPrice,
            renewalBuyPrice: f.renewalBuyPrice,
            note: f.note,
            ...(editing ? { status: f.status } : { clientPaid: f.clientPaid }),
            ...(force ? { force: true } : {}),
        };
        setSaving(true);
        try {
            const saved = editing ? await dhApi.update(item.id, body) : await dhApi.create(body);
            toast.success(editing ? 'আপডেট হয়েছে' : 'যোগ হয়েছে ✅');
            onSaved(saved);
        } catch (e) {
            if (e.status === 409 && !force && confirm(`${e.message}\n\nতবুও সেভ করবেন?`)) { setSaving(false); return save(true); }
            toast.error(e.message);
        } finally {
            setSaving(false);
        }
    };

    const seg = (on) => `px-4 py-2 rounded-lg text-sm font-semibold border transition ${on ? 'text-white border-transparent' : isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`;

    return (
        <Modal
            isDark={isDark}
            size="max-w-3xl"
            title={editing ? 'Edit' : 'Add Domain / Hosting'}
            subtitle={editing ? item.domainName : 'ডোমেইন, হোস্টিং বা দুটোই — প্রজেক্টের সাথে বা আলাদা'}
            onClose={onClose}
            footer={
                <>
                    <button onClick={onClose} className={`px-5 py-2.5 rounded-xl font-semibold ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>Cancel</button>
                    <button onClick={() => save(false)} disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold disabled:opacity-60" style={{ background: BRAND }}>
                        <FiSave size={16} /> {saving ? 'Saving…' : 'Save'}
                    </button>
                </>
            }
        >
            <div>
                <label className={cx.label}>Type</label>
                <div className="flex flex-wrap gap-2">
                    {['domain', 'hosting', 'both'].map((t) => (
                        <button key={t} type="button" onClick={() => setF({ ...f, type: t })} className={seg(f.type === t)} style={f.type === t ? { background: BRAND } : {}}>{TYPE_LABEL[t]}</button>
                    ))}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className={cx.label}>{f.type === 'hosting' ? 'Site / Hosting name' : 'Domain name'} *</label>
                    <input className={cx.input} placeholder={f.type === 'hosting' ? 'যে সাইটের হোস্টিং' : 'example.com'} value={f.domainName} onChange={set('domainName')} />
                </div>
                <div>
                    <label className={cx.label}>Provider <span className="font-normal text-slate-400">(কোথা থেকে কেনা)</span></label>
                    <input className={cx.input} list="dh-providers" placeholder="Namecheap, GoDaddy…" value={f.provider} onChange={set('provider')} />
                    <datalist id="dh-providers">{PROVIDERS.map((p) => <option key={p} value={p} />)}</datalist>
                </div>
            </div>

            {hasHosting && (
                <div className="grid md:grid-cols-2 gap-4">
                    <div><label className={cx.label}>Hosting size (GB)</label><input type="number" min="0" className={cx.input} placeholder="যেমন 10" value={f.hostingGB} onChange={set('hostingGB')} /></div>
                    <div><label className={cx.label}>Plan / Server</label><input className={cx.input} placeholder="যেমন Business, cPanel #2" value={f.hostingPlan} onChange={set('hostingPlan')} /></div>
                </div>
            )}

            <SectionTitle isDark={isDark}>Owner · কার কাছে বিক্রি</SectionTitle>
            <div className="grid md:grid-cols-3 gap-4">
                <div><label className={cx.label}>Name</label><input className={cx.input} value={f.owner} onChange={set('owner')} /></div>
                <div><label className={cx.label}>Phone / WhatsApp</label><input className={cx.input} placeholder="01XXXXXXXXX" value={f.ownerPhone} onChange={set('ownerPhone')} /></div>
                <div><label className={cx.label}>Email</label><input type="email" className={cx.input} value={f.ownerEmail} onChange={set('ownerEmail')} /></div>
            </div>

            <SectionTitle isDark={isDark}>Project · প্রজেক্টের সাথে যোগ (ঐচ্ছিক)</SectionTitle>
            <div>
                <input className={cx.input} list="dh-projects" placeholder="প্রজেক্ট কোড বা ক্লায়েন্টের নাম লিখে বেছে নিন — ফাঁকা থাকলে আলাদা (Standalone)" value={projectText} onChange={onProject} />
                <datalist id="dh-projects">{projects.map((p) => <option key={p.projectId} value={projectLabel(p)} />)}</datalist>
                {keptCode ? (
                    <p className="text-[11px] mt-1.5 text-emerald-500 inline-flex items-center gap-1"><FiLink2 size={12} /> {keptCode} এর সাথে যুক্ত হবে — প্রজেক্টের ফর্ম ও মাসিক Domain/Hosting ট্যাবেও দেখা যাবে
                        <button type="button" onClick={() => setProjectText('')} className="ml-1 underline text-slate-400">বিচ্ছিন্ন করুন</button></p>
                ) : projectText.trim() ? (
                    <p className="text-[11px] mt-1.5 text-amber-500">তালিকা থেকে বেছে নিন (লেখা মিলছে না)</p>
                ) : null}
            </div>
            {keptCode && (
                <div>
                    <label className={cx.label}>পেমেন্ট</label>
                    <div className="grid sm:grid-cols-2 gap-2">
                        {BILLING_MODES.map((b) => (
                            <button key={b.value} type="button" onClick={() => setF({ ...f, billing: b.value })}
                                className={`text-left px-3 py-2.5 rounded-lg border text-sm transition ${f.billing === b.value ? 'border-transparent text-white' : isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                                style={f.billing === b.value ? { background: '#0CB2A9' } : {}}>
                                <span className="font-semibold block">{b.label}</span>
                                <span className={`text-[11px] ${f.billing === b.value ? 'text-white/80' : 'text-slate-400'}`}>{b.hint}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <SectionTitle isDark={isDark}>Dates · মেয়াদ</SectionTitle>
            <div className="grid md:grid-cols-4 gap-4">
                <div><label className={cx.label}>Purchase date</label><input type="date" className={cx.input} value={f.purchaseDate} onChange={onPurchase} /></div>
                <div>
                    <label className={cx.label}>Term</label>
                    <select className={cx.input} value={f.cycleMonths} onChange={onCycle}>
                        {CYCLES.map((c) => <option key={c.months} value={c.months}>{c.label}</option>)}
                    </select>
                </div>
                <div>
                    <label className={cx.label}>Expiry date</label>
                    <input type="date" className={cx.input} value={f.expiryDate} onChange={onExpiry} />
                </div>
                <div>
                    <label className={cx.label}>Next payment date</label>
                    <input type="date" className={cx.input} value={f.nextPaymentDate} onChange={set('nextPaymentDate')} />
                    <p className="text-[11px] mt-1 text-slate-400">ফাঁকা থাকলে মেয়াদ শেষের তারিখই ধরা হয়</p>
                </div>
            </div>
            <label className="inline-flex items-center gap-2 text-sm cursor-pointer select-none">
                <input type="checkbox" checked={f.autoRenew} onChange={(e) => setF({ ...f, autoRenew: e.target.checked })} className="w-4 h-4 accent-orange-500" />
                <span className={cx.text}>Auto-renew চালু আছে (প্রোভাইডার নিজে রিনিউ করে)</span>
            </label>

            <SectionTitle isDark={isDark}>Money · টাকা</SectionTitle>
            <div className="grid md:grid-cols-4 gap-4">
                <div><label className={cx.label}>Buy cost (৳)</label><input type="number" min="0" className={cx.input} value={f.buyPrice} onChange={set('buyPrice')} /></div>
                <div><label className={cx.label}>Sell price (৳)</label><input type="number" min="0" className={cx.input} value={f.sellPrice} onChange={set('sellPrice')} /></div>
                {editing ? (
                    <div>
                        <label className={cx.label}>Paid so far</label>
                        <div className={`px-3 py-2.5 rounded-lg border text-sm font-bold ${cx.soft} text-emerald-500`}>{taka(item.paid)}</div>
                        <p className="text-[11px] mt-1 text-slate-400">পেমেন্ট যোগ/মুছতে Payment বাটন</p>
                    </div>
                ) : (
                    <div>
                        <label className={cx.label}>Paid now (৳)</label>
                        <input type="number" min="0" className={cx.input} value={f.clientPaid} onChange={set('clientPaid')} />
                        <p className="text-[11px] mt-1 text-slate-400">বাকি <b className={dueNow > 0 ? 'text-amber-500' : 'text-emerald-500'}>{taka(dueNow)}</b></p>
                    </div>
                )}
                <div>
                    <label className={cx.label}>Profit (auto)</label>
                    <div className={`px-3 py-2.5 rounded-lg border text-sm font-bold ${cx.soft} ${profit >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>{taka(profit)}</div>
                    <p className="text-[11px] mt-1 text-slate-400">Sell − Buy (প্রথম মেয়াদ)</p>
                </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
                <div><label className={cx.label}>Renewal price for client (৳) <span className="font-normal text-slate-400">ঐচ্ছিক</span></label><input type="number" min="0" className={cx.input} placeholder="ফাঁকা থাকলে Sell price" value={f.renewalSellPrice} onChange={set('renewalSellPrice')} /></div>
                <div><label className={cx.label}>Renewal cost (৳) <span className="font-normal text-slate-400">ঐচ্ছিক</span></label><input type="number" min="0" className={cx.input} placeholder="ফাঁকা থাকলে Buy cost" value={f.renewalBuyPrice} onChange={set('renewalBuyPrice')} /></div>
            </div>

            {editing && (
                <div>
                    <label className={cx.label}>Status</label>
                    <div className="flex flex-wrap gap-2">
                        {[['active', 'Active'], ['suspended', 'Suspended'], ['cancelled', 'Cancelled']].map(([v, l]) => (
                            <button key={v} type="button" onClick={() => setF({ ...f, status: v })} className={seg(f.status === v)} style={f.status === v ? { background: BRAND } : {}}>{l}</button>
                        ))}
                    </div>
                    <p className="text-[11px] mt-1 text-slate-400">Suspended / Cancelled হলে রিনিউয়ের তালিকায় আসে না</p>
                </div>
            )}

            <div><label className={cx.label}>Note</label><input className={cx.input} value={f.note} onChange={set('note')} /></div>
        </Modal>
    );
}

// ---------------------------------------------------------------
// Renew
// ---------------------------------------------------------------
export function RenewModal({ isDark, item, today, onClose, onSaved }) {
    const cx = useCx(isDark);
    const [months, setMonths] = useState(item.cycleMonths || 12);
    const [date, setDate] = useState(today);
    const [manualExpiry, setManualExpiry] = useState('');
    const [sell, setSell] = useState(item.renewPrice || '');
    const [buy, setBuy] = useState(item.renewCost || '');
    const [paidNow, setPaidNow] = useState('');
    const [method, setMethod] = useState('Cash');
    const [note, setNote] = useState('');
    const [saving, setSaving] = useState(false);

    const base = item.expiry || date;
    const autoExpiry = addMonthsKey(base, months);
    const newExpiry = manualExpiry || autoExpiry;
    const profit = num(sell) - num(buy);
    const dueAfter = Math.max(0, item.revenue + num(sell) - item.paid - num(paidNow));
    const stillPast = newExpiry < today;
    const bad = item.expiry && newExpiry <= item.expiry;

    const submit = async () => {
        if (bad) { toast.error('নতুন মেয়াদ আগের মেয়াদের পরে হতে হবে'); return; }
        setSaving(true);
        try {
            await dhApi.renew(item.id, { months, date, newExpiry, sellPrice: num(sell), buyPrice: num(buy), paidNow: num(paidNow), method, note });
            toast.success('রিনিউ হয়েছে ✅');
            onSaved();
        } catch (e) { toast.error(e.message); } finally { setSaving(false); }
    };

    return (
        <Modal
            isDark={isDark}
            size="max-w-xl"
            title="Renew"
            subtitle={`${item.domainName} · এখনকার মেয়াদ ${item.expiry ? fmtKey(item.expiry) : 'দেওয়া নেই'}`}
            onClose={onClose}
            footer={
                <>
                    <button onClick={onClose} className={`px-5 py-2.5 rounded-xl font-semibold ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>Cancel</button>
                    <button onClick={submit} disabled={saving || bad} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold disabled:opacity-60" style={{ background: '#16a34a' }}>
                        <FiRefreshCw size={16} /> {saving ? 'Saving…' : 'Confirm renewal'}
                    </button>
                </>
            }
        >
            <div className="grid sm:grid-cols-3 gap-4">
                <div>
                    <label className={cx.label}>Renew for</label>
                    <select className={cx.input} value={months} onChange={(e) => { setMonths(Number(e.target.value)); setManualExpiry(''); }}>
                        {CYCLES.map((c) => <option key={c.months} value={c.months}>{c.label}</option>)}
                    </select>
                </div>
                <div>
                    <label className={cx.label}>New expiry</label>
                    <input type="date" className={cx.input} value={newExpiry} onChange={(e) => setManualExpiry(e.target.value)} />
                </div>
                <div>
                    <label className={cx.label}>Renewal date</label>
                    <input type="date" className={cx.input} value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
            </div>
            {stillPast && !bad && <p className="text-xs text-amber-500">নতুন মেয়াদও আজকের আগের তারিখ — আরও লম্বা মেয়াদ বেছে নিন বা তারিখ ঠিক করুন।</p>}
            {bad && <p className="text-xs text-rose-500">নতুন মেয়াদ আগের মেয়াদের ({fmtKey(item.expiry)}) পরে হতে হবে।</p>}

            <div className="grid sm:grid-cols-3 gap-4">
                <div><label className={cx.label}>Client price (৳)</label><input type="number" min="0" className={cx.input} value={sell} onChange={(e) => setSell(e.target.value)} /></div>
                <div><label className={cx.label}>Our cost (৳)</label><input type="number" min="0" className={cx.input} value={buy} onChange={(e) => setBuy(e.target.value)} /></div>
                <div>
                    <label className={cx.label}>Profit</label>
                    <div className={`px-3 py-2.5 rounded-lg border text-sm font-bold ${cx.soft} ${profit >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>{taka(profit)}</div>
                </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
                <div><label className={cx.label}>Paid now (৳)</label><input type="number" min="0" className={cx.input} placeholder="0" value={paidNow} onChange={(e) => setPaidNow(e.target.value)} /></div>
                <div>
                    <label className={cx.label}>Method</label>
                    <select className={cx.input} value={method} onChange={(e) => setMethod(e.target.value)}>{METHODS.map((m) => <option key={m}>{m}</option>)}</select>
                </div>
                <div><label className={cx.label}>Note</label><input className={cx.input} value={note} onChange={(e) => setNote(e.target.value)} /></div>
            </div>

            <div className={`rounded-xl border p-3.5 text-sm ${cx.soft}`}>
                <p className={cx.text}>
                    মেয়াদ <b>{item.expiry ? fmtKey(item.expiry) : '—'}</b> → <b style={{ color: '#16a34a' }}>{fmtKey(newExpiry)}</b>
                    <span className={`ml-2 ${cx.muted}`}>({relDays(diffDays(newExpiry, today))})</span>
                </p>
                <p className={`mt-1 ${cx.muted}`}>
                    রিনিউয়ের পর মোট বাকি থাকবে <b className={dueAfter > 0 ? 'text-amber-500' : 'text-emerald-500'}>{taka(dueAfter)}</b>
                </p>
            </div>
        </Modal>
    );
}

// ---------------------------------------------------------------
// Payment
// ---------------------------------------------------------------
export function PaymentModal({ isDark, item, today, onClose, onSaved }) {
    const cx = useCx(isDark);
    const [amount, setAmount] = useState(item.due > 0 ? item.due : '');
    const [date, setDate] = useState(today);
    const [method, setMethod] = useState('Cash');
    const [note, setNote] = useState('');
    const [saving, setSaving] = useState(false);

    const left = Math.max(0, item.due - num(amount));

    const submit = async () => {
        if (num(amount) <= 0) { toast.error('টাকার অঙ্ক দিন'); return; }
        setSaving(true);
        try {
            await dhApi.addPayment(item.id, { amount: num(amount), date, method, note });
            toast.success('পেমেন্ট যোগ হয়েছে ✅');
            onSaved();
        } catch (e) { toast.error(e.message); } finally { setSaving(false); }
    };

    return (
        <Modal
            isDark={isDark}
            size="max-w-md"
            title="Add payment"
            subtitle={`${item.domainName}${item.owner ? ` · ${item.owner}` : ''}`}
            onClose={onClose}
            footer={
                <>
                    <button onClick={onClose} className={`px-5 py-2.5 rounded-xl font-semibold ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>Cancel</button>
                    <button onClick={submit} disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold disabled:opacity-60" style={{ background: BRAND }}>
                        <FiDollarSign size={16} /> {saving ? 'Saving…' : 'Save payment'}
                    </button>
                </>
            }
        >
            <div className={`grid grid-cols-3 gap-2 rounded-xl border p-3 text-center ${cx.soft}`}>
                {[['Total', item.revenue, ''], ['Paid', item.paid, 'text-emerald-500'], ['Due', item.due, item.due > 0 ? 'text-amber-500' : '']].map(([k, v, c]) => (
                    <div key={k}><p className="text-[10px] uppercase tracking-wide text-slate-400">{k}</p><p className={`font-bold ${c}`}>{taka(v)}</p></div>
                ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div><label className={cx.label}>Amount (৳)</label><input type="number" min="0" autoFocus className={cx.input} value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
                <div><label className={cx.label}>Date</label><input type="date" className={cx.input} value={date} onChange={(e) => setDate(e.target.value)} /></div>
                <div>
                    <label className={cx.label}>Method</label>
                    <select className={cx.input} value={method} onChange={(e) => setMethod(e.target.value)}>{METHODS.map((m) => <option key={m}>{m}</option>)}</select>
                </div>
                <div><label className={cx.label}>Note</label><input className={cx.input} value={note} onChange={(e) => setNote(e.target.value)} /></div>
            </div>
            <p className={`text-xs ${cx.muted}`}>এরপর বাকি থাকবে <b className={left > 0 ? 'text-amber-500' : 'text-emerald-500'}>{taka(left)}</b></p>
        </Modal>
    );
}

// ---------------------------------------------------------------
// Detail
// ---------------------------------------------------------------
function Fact({ isDark, label, children }) {
    if (children === undefined || children === null || children === '' || children === false) return null;
    return (
        <div className="min-w-0">
            <p className={`text-[11px] uppercase tracking-wide ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{label}</p>
            <p className={`text-sm font-medium break-words ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{children}</p>
        </div>
    );
}

export function DetailModal({ isDark, item, today, onClose, onEdit, onRenew, onPay, onRemind, onDelete, onChanged }) {
    const cx = useCx(isDark);
    const [busy, setBusy] = useState(false);

    const timeline = useMemo(() => {
        const rows = [];
        item.renewals.forEach((r) => rows.push({ kind: 'renewal', id: r._id, key: dayKey(r.date), r }));
        item.payments.forEach((p) => rows.push({ kind: 'payment', id: p._id, key: dayKey(p.date), p }));
        return rows.sort((a, b) => b.key.localeCompare(a.key));
    }, [item]);
    const lastRenewalId = item.renewals.length ? item.renewals[item.renewals.length - 1]._id : null;
    const earlier = Math.max(0, item.paid - item.ledgerPaid);

    const run = async (fn, ok) => {
        setBusy(true);
        try { await fn(); toast.success(ok); onChanged(); } catch (e) { toast.error(e.message); } finally { setBusy(false); }
    };
    const undoRenewal = (id) => confirm('এই রিনিউ বাতিল করবেন? মেয়াদ আগের তারিখে ফিরে যাবে। (রিনিউয়ের সাথে নেওয়া পেমেন্ট আলাদা — ওটা নিচের তালিকা থেকে নিজে মুছতে হবে)') && run(() => dhApi.removeRenewal(item.id, id), 'রিনিউ বাতিল হয়েছে');
    const delPayment = (id) => confirm('এই পেমেন্ট মুছবেন? মোট পাওয়া টাকা কমে যাবে।') && run(() => dhApi.removePayment(item.id, id), 'পেমেন্ট মুছেছে');

    const projectHref = item.project?.orderDate ? `/dashboard/admin/project-tracker/${dayKey(item.project.orderDate).slice(0, 7)}` : null;
    const wa = item.phone ? waLink(item.phone, reminderText(item)) : '';

    return (
        <Modal
            isDark={isDark}
            size="max-w-3xl"
            title={item.domainName}
            subtitle={`${TYPE_LABEL[item.type]}${item.hostingGB ? ` · ${item.hostingGB} GB` : ''}${item.provider ? ` · ${item.provider}` : ''}`}
            onClose={onClose}
            footer={
                <>
                    <button onClick={() => onDelete(item)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-rose-500 hover:bg-rose-500/10 mr-auto"><FiTrash2 size={15} /> Delete</button>
                    <button onClick={() => onEdit(item)} className={cx.ghostBtn}><FiEdit3 size={15} /> Edit</button>
                    <button onClick={() => onPay(item)} className={cx.ghostBtn}><FiDollarSign size={15} /> Payment</button>
                    <button onClick={() => onRenew(item)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-semibold" style={{ background: '#16a34a' }}><FiRefreshCw size={15} /> Renew</button>
                </>
            }
        >
            <div className="flex flex-wrap items-center gap-2">
                <StatePill state={item.state} />
                <TypePill type={item.type} isDark={isDark} />
                {item.autoRenew && <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-500/15 text-sky-600">Auto-renew</span>}
                {item.fromProject && <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-600">প্রজেক্ট থেকে এসেছে</span>}
                {item.expiry && <span className={`text-sm ${cx.muted}`}>মেয়াদ <b className={cx.strong}>{fmtKey(item.expiry)}</b> · <DaysText days={item.daysLeft} inactive={item.status !== 'active'} /></span>}
            </div>

            <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 rounded-xl border p-4 ${cx.soft}`}>
                {[['Revenue', item.revenue, ''], ['Cost', item.cost, 'text-rose-500'], ['Profit', item.profit, item.profit >= 0 ? 'text-emerald-500' : 'text-rose-500'], ['Due', item.due, item.due > 0 ? 'text-amber-500' : '']].map(([k, v, c]) => (
                    <div key={k}><p className="text-[10px] uppercase tracking-wide text-slate-400">{k}</p><p className={`text-lg font-bold ${c || cx.strong}`}>{taka(v)}</p></div>
                ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Fact isDark={isDark} label="Owner">{item.owner}</Fact>
                <Fact isDark={isDark} label="Phone">{item.phone}</Fact>
                <Fact isDark={isDark} label="Email">{item.email}</Fact>
                <Fact isDark={isDark} label="Purchased">{item.purchase ? fmtKey(item.purchase) : ''}</Fact>
                <Fact isDark={isDark} label="Next payment">{item.nextPay ? fmtKey(item.nextPay) : ''}</Fact>
                <Fact isDark={isDark} label="Term">{item.cycleMonths ? `${item.cycleMonths} months` : ''}</Fact>
                <Fact isDark={isDark} label="Plan / Server">{item.hostingPlan}</Fact>
                <Fact isDark={isDark} label="Renewal price">{item.renewPrice > 0 ? taka(item.renewPrice) : ''}</Fact>
                <Fact isDark={isDark} label="Reminded">{item.lastReminderAt ? fmtKey(dayKey(item.lastReminderAt)) : ''}</Fact>
                <Fact isDark={isDark} label="Project">
                    {item.projectCode ? (
                        <span className="inline-flex flex-wrap items-center gap-1.5">
                            {projectHref ? <Link href={projectHref} className="font-mono font-semibold underline" style={{ color: BRAND }}>{item.projectCode}</Link> : <span className="font-mono font-semibold" style={{ color: BRAND }}>{item.projectCode}</span>}
                            <span className={cx.muted}>{item.linkedClientName}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded ${item.billing === 'included' ? 'bg-amber-500/15 text-amber-600' : 'bg-teal-500/15 text-teal-600'}`}>{item.billing === 'included' ? 'দামের ভিতরে' : 'আলাদা পেমেন্ট'}</span>
                        </span>
                    ) : 'Standalone (কোনো প্রজেক্ট নেই)'}
                </Fact>
            </div>
            {item.note ? <p className={`text-sm rounded-lg border px-3 py-2 ${cx.soft} ${cx.text}`}>{item.note}</p> : null}

            {wa && item.status === 'active' && (
                <button onClick={() => onRemind(item)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-semibold" style={{ background: '#25D366' }}>
                    <FiMessageCircle size={16} /> WhatsApp reminder পাঠান
                </button>
            )}

            <div>
                <p className={`text-[11px] font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>History · রিনিউ ও পেমেন্ট</p>
                {timeline.length === 0 && earlier <= 0 ? (
                    <p className={`text-sm ${cx.muted}`}>এখনো কোনো রিনিউ বা পেমেন্টের রেকর্ড নেই।</p>
                ) : (
                    <ul className={`rounded-xl border divide-y ${cx.soft} ${cx.divide}`}>
                        {timeline.map((t) => (
                            <li key={t.kind + t.id} className="flex items-center gap-3 px-4 py-2.5">
                                <span className={`grid place-items-center w-8 h-8 rounded-full shrink-0 ${t.kind === 'renewal' ? 'bg-emerald-500/15 text-emerald-500' : 'bg-orange-500/15 text-orange-500'}`}>
                                    {t.kind === 'renewal' ? <FiRefreshCw size={14} /> : <FiDollarSign size={14} />}
                                </span>
                                <div className="min-w-0 flex-1 text-sm">
                                    {t.kind === 'renewal' ? (
                                        <>
                                            <p className={`font-semibold ${cx.strong}`}>Renewed · {t.r.months} months → {fmtKey(dayKey(t.r.toExpiry))}</p>
                                            <p className={`text-xs ${cx.muted}`}>{fmtKey(t.key)} · client {taka(t.r.sellPrice)} · cost {taka(t.r.buyPrice)} · profit {taka((t.r.sellPrice || 0) - (t.r.buyPrice || 0))}{t.r.note ? ` · ${t.r.note}` : ''}</p>
                                        </>
                                    ) : (
                                        <>
                                            <p className={`font-semibold ${cx.strong}`}>{taka(t.p.amount)} received{t.p.kind === 'renewal' ? ' (with renewal)' : ''}</p>
                                            <p className={`text-xs ${cx.muted}`}>{fmtKey(t.key)}{t.p.method ? ` · ${t.p.method}` : ''}{t.p.note && t.p.note !== 'Renewal' ? ` · ${t.p.note}` : ''}</p>
                                        </>
                                    )}
                                </div>
                                {t.kind === 'renewal' && t.id === lastRenewalId && (
                                    <button disabled={busy} onClick={() => undoRenewal(t.id)} title="এই রিনিউ বাতিল" className="p-2 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-500/10"><FiRotateCcw size={14} /></button>
                                )}
                                {t.kind === 'payment' && (
                                    <button disabled={busy} onClick={() => delPayment(t.id)} title="পেমেন্ট মুছুন" className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10"><FiX size={14} /></button>
                                )}
                            </li>
                        ))}
                        {earlier > 0 && (
                            <li className="flex items-center gap-3 px-4 py-2.5 text-sm">
                                <span className="grid place-items-center w-8 h-8 rounded-full shrink-0 bg-slate-500/15 text-slate-400"><FiCheckCircle size={14} /></span>
                                <div>
                                    <p className={`font-semibold ${cx.strong}`}>{taka(earlier)} আগে পাওয়া</p>
                                    <p className={`text-xs ${cx.muted}`}>খাতায় তোলার আগের (বা প্রজেক্ট থেকে আসা) টাকা</p>
                                </div>
                            </li>
                        )}
                    </ul>
                )}
            </div>
        </Modal>
    );
}

// ---------------------------------------------------------------
// The hook: one place that owns which window is open
// ---------------------------------------------------------------
export function useDomainModals({ isDark, items, projects, today, onChanged, initialModal = null }) {
    const [modal, setModal] = useState(initialModal); // { kind, id? }

    const find = (id) => items.find((i) => i.id === id) || null;
    const close = () => setModal(null);
    const saved = () => { close(); onChanged(); };

    const remind = async (it) => {
        const link = waLink(it.phone, reminderText(it));
        if (!link) { toast.error('এই রেকর্ডে ফোন নম্বর নেই'); return; }
        window.open(link, '_blank', 'noopener,noreferrer');
        try { await dhApi.reminded(it.id); onChanged(); } catch { /* the message window is already open; the log is a bonus */ }
    };

    const remove = async (it) => {
        const warn = it.projectCode ? `\n\nএটা প্রজেক্ট ${it.projectCode} এর সাথে যুক্ত — মুছলে প্রজেক্টের Domain/Hosting তথ্য থেকেও চলে যাবে।` : '';
        if (!confirm(`"${it.domainName}" মুছে ফেলবেন? রিনিউ ও পেমেন্টের ইতিহাসসহ সব যাবে।${warn}`)) return;
        try { await dhApi.remove(it.id); toast.success('মুছে গেছে'); close(); onChanged(); } catch (e) { toast.error(e.message); }
    };

    const open = {
        create: () => setModal({ kind: 'form' }),
        edit: (it) => setModal({ kind: 'form', id: it.id }),
        renew: (it) => setModal({ kind: 'renew', id: it.id }),
        pay: (it) => setModal({ kind: 'pay', id: it.id }),
        detail: (it) => setModal({ kind: 'detail', id: it.id }),
        remind,
        remove,
    };

    const target = modal?.id ? find(modal.id) : null;
    let element = null;
    if (modal?.kind === 'form' && (!modal.id || target)) element = <DomainFormModal isDark={isDark} item={target} projects={projects} today={today} onClose={close} onSaved={saved} />;
    else if (modal?.kind === 'renew' && target) element = <RenewModal isDark={isDark} item={target} today={today} onClose={close} onSaved={saved} />;
    else if (modal?.kind === 'pay' && target) element = <PaymentModal isDark={isDark} item={target} today={today} onClose={close} onSaved={saved} />;
    else if (modal?.kind === 'detail' && target) {
        element = (
            <DetailModal
                isDark={isDark} item={target} today={today} onClose={close} onChanged={onChanged}
                onEdit={open.edit} onRenew={open.renew} onPay={open.pay} onRemind={remind} onDelete={remove}
            />
        );
    }
    return { open, element };
}

