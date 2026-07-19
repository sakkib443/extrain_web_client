'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FiX, FiSave, FiPlus, FiTrash2, FiCheck, FiCheckCircle, FiCreditCard, FiCornerUpLeft, FiFileText } from 'react-icons/fi';
import { ptApi, bdt, PACKAGE_TYPES, WEBSITE_TYPES, STATUS_OPTIONS } from '@/lib/projectTracker';

const toInput = (d) => (d ? new Date(d).toISOString().slice(0, 10) : '');
const today = () => new Date().toISOString().slice(0, 10);

// শেষ non-refund installment কে auto করে balance রাখে (সব non-refund installment মিলে total হয়)
const balanceLast = (rows, total) => {
    const idxs = rows.map((r, i) => ({ r, i })).filter((x) => !x.r.isRefund).map((x) => x.i);
    if (idxs.length < 2) return rows.map((r) => ({ ...r, auto: false }));
    const lastIdx = idxs[idxs.length - 1];
    const sumOthers = idxs.slice(0, -1).reduce((s, i) => s + (Number(rows[i].amount) || 0), 0);
    const lastAmt = Math.max(0, (Number(total) || 0) - sumOthers);
    return rows.map((r, i) => (i === lastIdx ? { ...r, amount: lastAmt, auto: true } : { ...r, auto: false }));
};

export default function ProjectModal({ isDark, project, defaultMonth, onClose, onSaved }) {
    const init = project || {};
    const [f, setF] = useState({
        clientName: init.clientName || '',
        companyBrand: init.companyBrand || '',
        phone: init.phone || '',
        email: init.email || '',
        websiteType: init.websiteType || '',
        packageType: init.packageType || 'without_domain_hosting',
        desiredWebsiteName: init.desiredWebsiteName || '',
        referenceWebsite: init.referenceWebsite || '',
        similarToWebsite: init.similarToWebsite || '',
        projectDetails: init.projectDetails || '',
        orderDate: toInput(init.orderDate) || (defaultMonth ? `${defaultMonth}-01` : ''),
        messageDate: toInput(init.messageDate),
        totalProjectAmount: init.totalProjectAmount || '',
        domainClientPaid: init.domainClientPaid || '',
        domainOurCost: init.domainOurCost || '',
        nextPayDate: toInput(init.nextPayDate),
        projectStartDate: toInput(init.projectStartDate),
        projectDeliveryDate: toInput(init.projectDeliveryDate),
        status: init.status || 'pending', // 'request' হলে সেটাই রাখে — edit করলে auto-approve হবে না
        adminNote: init.adminNote || '',
        installmentCount: init.installmentCount || ((init.installments || []).filter((i) => i.note !== 'Refund' && (Number(i.amount) || 0) >= 0).length || ''),
    });
    // paid: false = planned/future (Paid এ ধরা হয় না); isRefund = negative amount
    // NOTE: load এ balanceLast করা হয় না — existing amount অক্ষত রাখতে। শুধু plan/edit এ balance হয়।
    const [installments, setInstallments] = useState(
        (init.installments || []).map((i) => ({
            no: i.no, amount: i.amount, date: toInput(i.date), note: i.note || '',
            isRefund: (Number(i.amount) || 0) < 0 || i.note === 'Refund',
            paid: i.paid !== false,
            auto: false,
        }))
    );
    const [saving, setSaving] = useState(false);

    const claim = init.paymentInfo || null; // ক্লায়েন্টের পেমেন্ট claim
    // claim একবার Advance এ বসালে banner লুকাও (আগে থেকে বসানো থাকলেও)
    const [claimUsed, setClaimUsed] = useState(() => {
        const first = (init.installments || []).find((i) => i.note !== 'Refund' && (Number(i.amount) || 0) >= 0);
        return !!(claim?.amount && first && Number(first.amount) === Number(claim.amount));
    });

    const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

    // Total Amount বদলালে শেষ installment auto-balance হয়
    const setTotalAmount = (e) => {
        const v = e.target.value;
        setF((prev) => ({ ...prev, totalProjectAmount: v }));
        setInstallments((prev) => balanceLast(prev, Number(v) || 0));
    };

    // Total Installments সংখ্যা দিলে সেই অনুযায়ী plan তৈরি হয়
    const generatePlan = (nRaw) => {
        const n = parseInt(nRaw) || 0;
        const total = Number(f.totalProjectAmount) || 0;
        setInstallments((prev) => {
            const refunds = prev.filter((r) => r.isRefund);
            const nonRefunds = prev.filter((r) => !r.isRefund);
            const adv = nonRefunds[0] || { amount: '', date: today(), note: 'Advance', paid: true };
            const advAmount = Number(adv.amount) || 0;
            if (n <= 1) {
                return balanceLast([{ ...adv, no: 1, note: adv.note || 'Advance', isRefund: false, paid: adv.paid !== false }, ...refunds], total);
            }
            const remaining = Math.max(0, total - advAmount);
            const parts = n - 1;
            const base = Math.floor(remaining / parts);
            const rows = [{ ...adv, no: 1, note: adv.note || 'Advance', isRefund: false, paid: adv.paid !== false }];
            for (let k = 0; k < parts; k++) {
                const isLast = k === parts - 1;
                const amt = isLast ? remaining - base * (parts - 1) : base;
                const existing = nonRefunds[k + 1];
                rows.push({
                    no: k + 2,
                    amount: amt,
                    date: existing?.date || '',
                    note: existing?.note || `Installment ${k + 2}`,
                    paid: existing ? existing.paid === true : false,
                    isRefund: false,
                });
            }
            return balanceLast([...rows, ...refunds], total);
        });
    };

    const changeCount = (e) => {
        const v = e.target.value;
        setF((prev) => ({ ...prev, installmentCount: v }));
        if (v) generatePlan(v);
    };

    const addInst = () =>
        setInstallments((prev) => balanceLast([...prev, { no: prev.length + 1, amount: '', date: '', note: prev.filter((r) => !r.isRefund).length === 0 ? 'Advance' : '', paid: prev.length === 0 }], Number(f.totalProjectAmount) || 0));

    // ক্লায়েন্টের claim কে এক ক্লিকে Advance হিসেবে বসানো
    const confirmClaimAsAdvance = () => {
        const amt = Number(claim?.amount) || '';
        setInstallments((prev) => {
            if (prev.length === 0) return [{ no: 1, amount: amt, date: today(), note: 'Advance', paid: true, isRefund: false }];
            const copy = [...prev];
            copy[0] = { ...copy[0], amount: amt !== '' ? amt : copy[0].amount, note: copy[0].note || 'Advance', date: copy[0].date || today(), isRefund: false, paid: true };
            return balanceLast(copy, Number(f.totalProjectAmount) || 0);
        });
        setClaimUsed(true); // banner চলে যাবে
        toast.success('পেমেন্ট Advance হিসেবে বসানো হয়েছে');
    };

    // Refund row — amount negative হিসেবে স্টোর হয়
    const addRefund = () =>
        setInstallments([...installments, { no: installments.length + 1, amount: '', date: today(), note: 'Refund', isRefund: true, paid: true }]);

    const setInstAmount = (idx) => (e) => {
        const raw = Number(e.target.value) || 0;
        setInstallments((prev) => {
            const next = prev.map((r, i) => (i === idx ? { ...r, amount: r.isRefund ? -Math.abs(raw) : raw } : r));
            return balanceLast(next, Number(f.totalProjectAmount) || 0);
        });
    };
    const setInst = (idx, k) => (e) => {
        const next = [...installments];
        next[idx] = { ...next[idx], [k]: e.target.value };
        setInstallments(next);
    };
    const togglePaid = (idx) => (e) => {
        const checked = e.target.checked;
        setInstallments((prev) => prev.map((r, i) => (i === idx ? { ...r, paid: checked } : r)));
    };
    const rmInst = (idx) => setInstallments((prev) => balanceLast(prev.filter((_, i) => i !== idx).map((x, i) => ({ ...x, no: i + 1 })), Number(f.totalProjectAmount) || 0));

    // paid === false হলে planned/future — Paid এ গণনা হয় না। refund (negative) গণনা হয়।
    const totalPaid = installments.reduce((s, i) => s + (i.paid === false ? 0 : (Number(i.amount) || 0)), 0);
    const due = Math.max(0, (Number(f.totalProjectAmount) || 0) - totalPaid);

    // Next Pay Date auto = সবচেয়ে কাছের unpaid installment এর তারিখ
    useEffect(() => {
        const upcoming = installments
            .filter((i) => i.paid === false && i.date && !i.isRefund)
            .map((i) => i.date)
            .sort();
        if (upcoming.length) {
            setF((prev) => (prev.nextPayDate === upcoming[0] ? prev : { ...prev, nextPayDate: upcoming[0] }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [installments]);

    // confirm=true হলে অর্ডার কনফার্ম হয়। receiptInstallmentNo দিলে save এর পর সেই installment এর receipt খোলে।
    const save = async (confirm = false, receiptInstallmentNo = null) => {
        if (!f.clientName || !f.phone || !f.websiteType) {
            toast.error('নাম, ফোন, Website Type দিন');
            return;
        }
        if (confirm && (Number(f.totalProjectAmount) || 0) <= 0) {
            toast.error('অর্ডার কনফার্ম করতে Total Project Amount দিন');
            return;
        }
        // confirm করলে request → working; নাহলে বর্তমান status রাখে
        const nextStatus = confirm && f.status === 'request' ? 'working' : f.status;
        setSaving(true);
        try {
            const body = {
                ...f,
                status: nextStatus,
                totalProjectAmount: Number(f.totalProjectAmount) || 0,
                domainClientPaid: Number(f.domainClientPaid) || 0,
                domainOurCost: Number(f.domainOurCost) || 0,
                installmentCount: f.installmentCount ? Number(f.installmentCount) : undefined,
                installments: installments.map((i, idx) => ({
                    no: idx + 1,
                    amount: Number(i.amount) || 0,
                    date: i.date || undefined,
                    note: i.note || undefined,
                    paid: i.paid !== false,
                })),
            };
            const saved = project?._id ? await ptApi.updateProject(project._id, body) : await ptApi.createProject(body);
            toast.success(confirm ? 'অর্ডার কনফার্ম হয়েছে ✅' : (project ? 'সেভ হয়েছে' : 'যোগ হয়েছে'));
            onSaved(saved, { confirmed: confirm, receiptInstallmentNo });
        } catch (e) {
            toast.error(e.message);
        } finally {
            setSaving(false);
        }
    };

    const label = `text-xs font-semibold mb-1.5 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`;
    const input = `w-full px-3 py-2.5 rounded-lg border outline-none transition text-sm ${isDark ? 'bg-slate-800 border-slate-700 text-white focus:border-orange-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-orange-400 focus:bg-white'}`;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
            <div className={`relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-2xl shadow-2xl ${isDark ? 'bg-slate-900 border border-slate-700' : 'bg-white'}`}>
                {/* Header */}
                <div className={`sticky top-0 flex items-center justify-between px-6 py-4 border-b ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-100'}`}>
                    <div className="flex items-center gap-3">
                        <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{project ? 'Edit Project' : 'Add Project'}</h2>
                        {init.projectId && (
                            <span className="font-mono text-sm font-bold px-2.5 py-1 rounded-lg" style={{ background: '#FD9A0018', color: '#FD9A00' }}>{init.projectId}</span>
                        )}
                    </div>
                    <button onClick={onClose} className={`p-2 rounded-lg ${isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-400 hover:bg-slate-100'}`}><FiX /></button>
                </div>

                <div className="p-5 md:p-6 space-y-4">
                    {/* Request হলে info note — আসল Confirm বাটন নিচে footer এ */}
                    {init.status === 'request' && (
                        <div className="rounded-xl border border-orange-200 bg-orange-50 p-3 text-sm font-medium text-orange-800">
                            এটি এখনো একটি <b>Request</b> — সব তথ্য দিয়ে নিচে <b>Confirm Order</b> চাপলে Tracker এ চলে যাবে (Total Amount দিতে হবে)। শুধু edit সেভ করতে <b>Save Draft</b> চাপুন।
                        </div>
                    )}

                    {/* Client info — 3 columns, compact */}
                    <div className="grid md:grid-cols-3 gap-3">
                        <div><label className={label}>Client Name *</label><input className={input} value={f.clientName} onChange={set('clientName')} /></div>
                        <div><label className={label}>Company / Brand</label><input className={input} value={f.companyBrand} onChange={set('companyBrand')} /></div>
                        <div><label className={label}>Phone *</label><input className={input} value={f.phone} onChange={set('phone')} /></div>
                        <div><label className={label}>Email</label><input className={input} value={f.email} onChange={set('email')} /></div>
                        <div>
                            <label className={label}>Website Type *</label>
                            <select className={input} value={f.websiteType} onChange={set('websiteType')}>
                                <option value="">Select...</option>
                                {WEBSITE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                                {f.websiteType && !WEBSITE_TYPES.includes(f.websiteType) && <option value={f.websiteType}>{f.websiteType}</option>}
                            </select>
                        </div>
                        <div>
                            <label className={label}>Package Type <span className="font-normal text-slate-400">(auto)</span></label>
                            <div className={`px-3 py-2.5 rounded-lg border text-sm font-medium ${init.hasDomainHosting
                                ? (isDark ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700')
                                : (isDark ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500')}`}>
                                {init.hasDomainHosting ? 'With Domain & Hosting' : 'Without Domain & Hosting'}
                            </div>
                            {init.hasDomainHosting ? (
                                <p className="text-[11px] mt-1 text-slate-400">Domain: buy {bdt(init.domainBuy)} • sell {bdt(init.domainSell)} • profit <b className={init.domainProfitLinked >= 0 ? 'text-emerald-500' : 'text-rose-500'}>{bdt(init.domainProfitLinked)}</b></p>
                            ) : (
                                <p className="text-[11px] mt-1 text-slate-400">Domain / Hosting tab এ domain add করে এই project link করলে auto &quot;With&quot; হবে</p>
                            )}
                        </div>
                    </div>

                    {/* Client brief (optional) */}
                    <div className={`rounded-xl p-4 space-y-4 ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                        <p className={`text-xs font-bold uppercase tracking-wide ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Client Brief</p>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div><label className={label}>Website Name</label><input className={input} value={f.desiredWebsiteName} onChange={set('desiredWebsiteName')} /></div>
                            <div><label className={label}>Reference Website</label><input className={input} value={f.referenceWebsite} onChange={set('referenceWebsite')} /></div>
                            <div className="md:col-span-2"><label className={label}>Similar To (our website)</label><input className={input} value={f.similarToWebsite} onChange={set('similarToWebsite')} /></div>
                        </div>
                        <div><label className={label}>Details / Brief</label><textarea rows={2} className={input} value={f.projectDetails} onChange={set('projectDetails')} /></div>
                    </div>

                    {/* Money (Domain/Hosting আপাতত frontend এ নেই — backend এ আছে) */}
                    <div className={`rounded-xl p-4 ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div><label className={label}>Total Project Amount (৳)</label><input type="number" className={input} value={f.totalProjectAmount} onChange={setTotalAmount} /></div>
                        </div>
                    </div>

                    {/* Installments */}
                    <div>
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                            <label className={label + ' !mb-0'}>Payment Installments</label>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1.5">
                                    <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Installments</span>
                                    <input type="number" min="1" placeholder="যেমন 3" value={f.installmentCount} onChange={changeCount}
                                        className={`w-20 px-2 py-1.5 rounded-lg border text-sm outline-none ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`} />
                                </div>
                                <button onClick={addRefund} className="inline-flex items-center gap-1 text-sm font-semibold px-3 py-1.5 rounded-lg border border-rose-300 text-rose-600 hover:bg-rose-50"><FiCornerUpLeft size={14} /> Refund</button>
                                <button onClick={addInst} className="inline-flex items-center gap-1 text-sm font-semibold px-3 py-1.5 rounded-lg text-white" style={{ background: '#FD9A00' }}><FiPlus size={14} /> Add</button>
                            </div>
                        </div>
                        <p className={`text-xs mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                            Total Installments দিলে Advance বাদে বাকি টাকা সমান ভাগে ভাগ হয় (শেষটা auto)। Paid টিক করলে সেটা আদায় হিসেবে ধরা হয় — বাকিগুলো Due তে থাকে।
                        </p>

                        {/* ক্লায়েন্টের পেমেন্ট claim — এক ক্লিকে Advance বসানো (apply হলে চলে যায়) */}
                        {claim && !claimUsed && (claim.amount || claim.transactionId || claim.senderNumber) && (
                            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 mb-3 flex flex-wrap items-center justify-between gap-2">
                                <div className="text-sm text-emerald-800">
                                    <p className="font-semibold flex items-center gap-1.5"><FiCreditCard size={14} /> ক্লায়েন্ট পেমেন্ট claim করেছে</p>
                                    <p className="text-emerald-700 text-xs mt-0.5">
                                        {(claim.method || '').toUpperCase()}
                                        {claim.senderNumber ? ` • ${claim.senderNumber}` : ''}
                                        {claim.amount ? ` • ${bdt(claim.amount)}` : ''}
                                        {claim.transactionId ? ` • TrxID: ${claim.transactionId}` : ''}
                                    </p>
                                </div>
                                <button onClick={confirmClaimAsAdvance} className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600">
                                    <FiCheck size={14} /> Advance বসান
                                </button>
                            </div>
                        )}

                        <div className="space-y-2">
                            {installments.map((inst, idx) => (
                                <div key={idx} className={`grid grid-cols-12 gap-2 items-center ${inst.isRefund ? 'rounded-lg p-1 bg-rose-50/60' : ''}`}>
                                    <div className="col-span-3 relative">
                                        {inst.isRefund && <span className="absolute left-2 top-1/2 -translate-y-1/2 text-rose-500 font-bold text-sm">−</span>}
                                        <input
                                            className={input + (inst.isRefund ? ' pl-6 border-rose-300 text-rose-600' : '') + (inst.auto ? ' opacity-70 cursor-not-allowed' : '')}
                                            type="number" placeholder="Amount" readOnly={inst.auto} title={inst.auto ? 'auto (শেষ installment)' : ''}
                                            value={inst.amount === '' ? '' : (inst.isRefund ? Math.abs(inst.amount) : inst.amount)} onChange={setInstAmount(idx)} />
                                    </div>
                                    <input className={input + ' col-span-3'} type="date" value={inst.date} onChange={setInst(idx, 'date')} />
                                    <input className={input + ' col-span-2'} placeholder="Note" value={inst.note} onChange={setInst(idx, 'note')} />
                                    <label className={`col-span-2 flex items-center gap-1.5 text-xs cursor-pointer select-none ${inst.isRefund ? 'opacity-0 pointer-events-none' : ''} ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                        <input type="checkbox" checked={inst.paid !== false} onChange={togglePaid(idx)} className="w-4 h-4 accent-emerald-500" /> Paid
                                    </label>
                                    <div className="col-span-2 flex items-center justify-end gap-1">
                                        {/* paid + saved project হলে সেই installment এর Receipt পাঠানো যায় */}
                                        {project?._id && !inst.isRefund && inst.paid !== false && (
                                            <button onClick={() => save(false, inst.no)} disabled={saving} title="এই installment এর Receipt পাঠান"
                                                className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-500/10 flex justify-center"><FiFileText size={15} /></button>
                                        )}
                                        <button onClick={() => rmInst(idx)} title="Delete" className="p-2 rounded-lg text-rose-500 hover:bg-rose-500/10 flex justify-center"><FiTrash2 size={15} /></button>
                                    </div>
                                </div>
                            ))}
                            {installments.length === 0 && <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>কোনো installment নেই। উপরে Total Installments দিন, বা Add চাপুন।</p>}
                        </div>
                        <div className={`flex gap-6 mt-3 text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                            <span>Paid: <span className="text-emerald-500">{bdt(totalPaid)}</span></span>
                            <span>Due: <span className="text-amber-500">{bdt(due)}</span></span>
                        </div>
                    </div>

                    {/* Dates + status */}
                    <div className="grid md:grid-cols-3 gap-4">
                        <div><label className={label}>Order Date</label><input type="date" className={input} value={f.orderDate} onChange={set('orderDate')} /></div>
                        <div><label className={label}>Next Pay Date</label><input type="date" className={input} value={f.nextPayDate} onChange={set('nextPayDate')} /></div>
                        <div>
                            <label className={label}>Status</label>
                            <select className={input} value={f.status} onChange={set('status')}>
                                {(f.status === 'request' ? ['request', ...STATUS_OPTIONS] : STATUS_OPTIONS).map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div><label className={label}>Project Start Date</label><input type="date" className={input} value={f.projectStartDate} onChange={set('projectStartDate')} /></div>
                        <div><label className={label}>Delivery Date</label><input type="date" className={input} value={f.projectDeliveryDate} onChange={set('projectDeliveryDate')} /></div>
                        <div><label className={label}>Message Date</label><input type="date" className={input} value={f.messageDate} onChange={set('messageDate')} /></div>
                    </div>

                    <div><label className={label}>Admin Note</label><input className={input} value={f.adminNote} onChange={set('adminNote')} /></div>
                </div>

                {/* Footer — context aware */}
                <div className={`sticky bottom-0 flex flex-wrap justify-end gap-3 px-6 py-4 border-t ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-100'}`}>
                    <button onClick={onClose} className={`px-5 py-2.5 rounded-xl font-semibold ${isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Cancel</button>
                    {init.status === 'request' ? (
                        <>
                            <button onClick={() => save(false)} disabled={saving} className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold ${isDark ? 'bg-slate-700 text-slate-200 hover:bg-slate-600' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}>
                                <FiSave size={16} /> Save Draft
                            </button>
                            <button onClick={() => save(true)} disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold shadow bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60">
                                <FiCheckCircle size={16} /> {saving ? 'হচ্ছে...' : 'Confirm Order'}
                            </button>
                        </>
                    ) : (
                        <button onClick={() => save(false)} disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold shadow disabled:opacity-60" style={{ background: '#FD9A00' }}>
                            <FiSave size={16} /> {saving ? 'Saving...' : 'Save'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
