'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FiX, FiCheckCircle, FiDollarSign, FiCreditCard, FiClipboard } from 'react-icons/fi';
import { ptApi, bdt } from '@/lib/projectTracker';

// অর্ডার কনফার্মেশন ডায়ালগ — Total Payment বাধ্যতামূলক, দুইটি আলাদা confirmation
export default function ConfirmOrderDialog({ isDark, request, onClose, onDone }) {
    const [totalProjectAmount, setTotal] = useState('');
    const [projectDeliveryDate, setDelivery] = useState('');
    const [installmentCount, setInstCount] = useState('');
    const [paymentConfirmed, setPaymentConfirmed] = useState(false);
    const [paidAmount, setPaidAmount] = useState('');
    const [orderConfirmed, setOrderConfirmed] = useState(true);
    const [saving, setSaving] = useState(false);

    const total = Number(totalProjectAmount) || 0;
    const paid = Number(paidAmount) || 0;
    const due = Math.max(0, total - (paymentConfirmed ? paid : 0));

    // Confirm করতে: total লাগবে, অন্তত একটি confirmation, payment হলে paid amount
    const canConfirm =
        total > 0 &&
        (orderConfirmed || paymentConfirmed) &&
        (!paymentConfirmed || paid > 0);

    const confirm = async () => {
        if (total <= 0) { toast.error('Total Payment (অর্ডার অ্যামাউন্ট) দিন'); return; }
        if (paymentConfirmed && paid <= 0) { toast.error('Paid Amount দিন অথবা Payment Confirmation বন্ধ করুন'); return; }
        if (!orderConfirmed && !paymentConfirmed) { toast.error('অন্তত একটি confirmation নির্বাচন করুন'); return; }
        setSaving(true);
        try {
            await ptApi.confirmRequest(request._id, {
                totalProjectAmount: total,
                projectDeliveryDate: projectDeliveryDate || undefined,
                installmentCount: installmentCount ? Number(installmentCount) : undefined,
                paymentConfirmed,
                paidAmount: paymentConfirmed ? paid : 0,
                orderConfirmed,
            });
            toast.success(orderConfirmed ? 'অর্ডার কনফার্ম হয়েছে ✅' : 'পেমেন্ট রেকর্ড হয়েছে');
            onDone();
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
            <div className={`relative w-full max-w-lg rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto ${isDark ? 'bg-slate-900 border border-slate-700' : 'bg-white'}`}>
                {/* Header */}
                <div className={`sticky top-0 flex items-center justify-between px-6 py-4 border-b ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-100'}`}>
                    <div>
                        <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Confirm Order</h2>
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{request.clientName} • {request.phone}</p>
                    </div>
                    <button onClick={onClose} className={`p-2 rounded-lg ${isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-400 hover:bg-slate-100'}`}><FiX /></button>
                </div>

                <div className="p-6 space-y-5">
                    {/* Total Payment (required) */}
                    <div>
                        <label className={label}>Total Payment / অর্ডার অ্যামাউন্ট (৳) <span className="text-rose-500">*</span></label>
                        <div className="relative">
                            <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                            <input type="number" autoFocus className={input + ' pl-9'} placeholder="যেমন 15000" value={totalProjectAmount} onChange={(e) => setTotal(e.target.value)} />
                        </div>
                    </div>

                    {/* Optional fields */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={label}>Delivery Date <span className="text-slate-400 font-normal">(optional)</span></label>
                            <input type="date" className={input} value={projectDeliveryDate} onChange={(e) => setDelivery(e.target.value)} />
                        </div>
                        <div>
                            <label className={label}>Installments <span className="text-slate-400 font-normal">(optional)</span></label>
                            <input type="number" className={input} placeholder="যেমন 3" value={installmentCount} onChange={(e) => setInstCount(e.target.value)} />
                        </div>
                    </div>

                    {/* Two confirmations */}
                    <div className="space-y-3">
                        {/* Payment Confirmation */}
                        <div className={`rounded-xl border p-3 ${paymentConfirmed ? 'border-emerald-300 bg-emerald-50/60' : isDark ? 'border-slate-700 bg-slate-800/40' : 'border-slate-200 bg-slate-50'}`}>
                            <label className="flex items-center gap-3 cursor-pointer select-none">
                                <input type="checkbox" checked={paymentConfirmed} onChange={(e) => setPaymentConfirmed(e.target.checked)} className="w-5 h-5 accent-emerald-500" />
                                <span className={`font-semibold flex items-center gap-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                                    <FiCreditCard className="text-emerald-500" /> Payment Confirmation
                                </span>
                            </label>
                            {paymentConfirmed && (
                                <div className="mt-3 pl-8">
                                    <label className={label}>কত টাকা পেমেন্ট করেছে? (৳) <span className="text-rose-500">*</span></label>
                                    <input type="number" className={input} placeholder="যেমন 5000" value={paidAmount} onChange={(e) => setPaidAmount(e.target.value)} />
                                </div>
                            )}
                        </div>

                        {/* Order Confirmation */}
                        <div className={`rounded-xl border p-3 ${orderConfirmed ? 'border-orange-300 bg-orange-50/60' : isDark ? 'border-slate-700 bg-slate-800/40' : 'border-slate-200 bg-slate-50'}`}>
                            <label className="flex items-center gap-3 cursor-pointer select-none">
                                <input type="checkbox" checked={orderConfirmed} onChange={(e) => setOrderConfirmed(e.target.checked)} className="w-5 h-5 accent-orange-500" />
                                <span className={`font-semibold flex items-center gap-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                                    <FiClipboard style={{ color: '#FD9A00' }} /> Order Confirmation
                                    <span className="text-xs font-normal text-slate-400">(Tracker এ যোগ হবে)</span>
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Live summary */}
                    {total > 0 && (
                        <div className={`rounded-xl p-3 text-sm flex justify-between ${isDark ? 'bg-slate-800/60 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                            <span>Total: <b>{bdt(total)}</b></span>
                            {paymentConfirmed && <span>Paid: <b className="text-emerald-500">{bdt(paid)}</b></span>}
                            <span>Due: <b className="text-amber-500">{bdt(due)}</b></span>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className={`sticky bottom-0 flex justify-end gap-3 px-6 py-4 border-t ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-100'}`}>
                    <button onClick={onClose} className={`px-5 py-2.5 rounded-xl font-semibold ${isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Cancel</button>
                    <button onClick={confirm} disabled={!canConfirm || saving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold shadow disabled:opacity-50" style={{ background: '#FD9A00' }}>
                        <FiCheckCircle size={16} /> {saving ? 'হচ্ছে...' : 'Confirm'}
                    </button>
                </div>
            </div>
        </div>
    );
}
