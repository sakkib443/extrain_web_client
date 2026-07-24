'use client';

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiRefreshCw, FiX, FiSave } from 'react-icons/fi';
import { ptApi, bdt, fmtDate, monthLabel, EXPENSE_CATEGORIES, expenseCategoryLabel } from '@/lib/projectTracker';

export default function ExpensesTab({ isDark, month, onChanged }) {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [filter, setFilter] = useState('all'); // কোন খাত দেখাচ্ছি
    const [form, setForm] = useState({ reason: '', category: 'ads', amount: '', costDate: `${month}-01` });

    const load = async () => {
        setLoading(true);
        try { setExpenses(await ptApi.getExpenses(month)); }
        catch (e) { toast.error(e.message); }
        finally { setLoading(false); }
    };
    useEffect(() => { load(); }, [month]);

    const total = expenses.reduce((s, e) => s + (e.amount || 0), 0);

    // খাত অনুযায়ী মোট — যে খাতে এই মাসে খরচ আছে শুধু সেগুলোই chip হিসেবে দেখাই
    const byCategory = expenses.reduce((acc, e) => {
        const k = e.category || 'other';
        acc[k] = (acc[k] || 0) + (e.amount || 0);
        return acc;
    }, {});
    const usedCategories = [
        ...EXPENSE_CATEGORIES.filter((c) => byCategory[c.value] !== undefined),
        // পুরনো ডেটায় তালিকার বাইরের কোনো খাত থাকলে সেটাও দেখাই
        ...Object.keys(byCategory)
            .filter((k) => !EXPENSE_CATEGORIES.some((c) => c.value === k))
            .map((k) => ({ value: k, label: k })),
    ];

    const shown = filter === 'all' ? expenses : expenses.filter((e) => (e.category || 'other') === filter);
    const shownTotal = shown.reduce((s, e) => s + (e.amount || 0), 0);

    const save = async () => {
        if (!form.reason || !form.amount) { toast.error('Reason ও Amount দিন'); return; }
        setSaving(true);
        try {
            await ptApi.createExpense({ ...form, amount: Number(form.amount) });
            toast.success('খরচ যোগ হয়েছে');
            setShowForm(false);
            setForm({ reason: '', category: 'ads', amount: '', costDate: `${month}-01` });
            load(); onChanged && onChanged();
        } catch (e) { toast.error(e.message); }
        finally { setSaving(false); }
    };

    const remove = async (id) => {
        if (!confirm('এই খরচ ডিলিট করবেন?')) return;
        try { await ptApi.deleteExpense(id); toast.success('ডিলিট হয়েছে'); load(); onChanged && onChanged(); }
        catch (e) { toast.error(e.message); }
    };

    const muted = isDark ? 'text-slate-400' : 'text-slate-500';
    const input = `px-3 py-2.5 rounded-lg border outline-none text-sm ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`;

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className={`rounded-2xl px-5 py-3 border ${isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <span className={`text-sm ${muted}`}>
                        {monthLabel(month)} {filter === 'all' ? 'মোট খরচ' : `${expenseCategoryLabel(filter)} খরচ`}:{' '}
                    </span>
                    <span className="text-xl font-bold text-rose-500">{bdt(shownTotal)}</span>
                    {filter !== 'all' && <span className={`text-sm ${muted}`}> / মোট {bdt(total)}</span>}
                </div>
                <div className="flex gap-2">
                    <button onClick={load} className={`p-2.5 rounded-xl ${isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                        <FiRefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-semibold shadow" style={{ background: '#FD9A00' }}>
                        <FiPlus size={16} /> Add Expense
                    </button>
                </div>
            </div>

            {/* খাত অনুযায়ী ফিল্টার — প্রতিটায় ওই খাতের মোট খরচ দেখা যায় */}
            {usedCategories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {[{ value: 'all', label: 'সব খাত', amount: total }, ...usedCategories.map((c) => ({ ...c, amount: byCategory[c.value] }))].map((c) => {
                        const active = filter === c.value;
                        return (
                            <button key={c.value} onClick={() => setFilter(c.value)}
                                className={`px-3.5 py-2 rounded-xl border text-sm transition ${active
                                    ? 'text-white border-transparent shadow'
                                    : isDark ? 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                style={active ? { background: '#FD9A00' } : {}}>
                                <span className="font-semibold">{c.label}</span>
                                <span className={`ml-2 font-bold ${active ? 'text-white' : 'text-rose-500'}`}>{bdt(c.amount)}</span>
                            </button>
                        );
                    })}
                </div>
            )}

            <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-slate-800/40 border-slate-700' : 'bg-white border-slate-200'} shadow-sm`}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className={isDark ? 'bg-slate-800' : 'bg-slate-50'}>
                            <tr>
                                {['SL', 'Date', 'Reason', 'Category', 'Amount', ''].map((h, i) => (
                                    <th key={i} className={`px-4 py-3 text-left text-xs font-bold uppercase ${muted} ${i === 4 ? 'text-right' : ''}`}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className={isDark ? 'divide-y divide-slate-700/50' : 'divide-y divide-slate-100'}>
                            {loading ? (
                                <tr><td colSpan={6} className={`text-center py-14 ${muted}`}>লোড হচ্ছে...</td></tr>
                            ) : shown.length === 0 ? (
                                <tr><td colSpan={6} className={`text-center py-14 ${muted}`}>
                                    {filter === 'all' ? 'এই মাসে কোনো খরচ নেই।' : `${expenseCategoryLabel(filter)} খাতে এই মাসে কোনো খরচ নেই।`}
                                </td></tr>
                            ) : shown.map((e, i) => (
                                <tr key={e._id} className={isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}>
                                    <td className={`px-4 py-3 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{e.slNo || i + 1}</td>
                                    <td className={`px-4 py-3 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{fmtDate(e.costDate)}</td>
                                    <td className={`px-4 py-3 text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{e.reason}</td>
                                    <td className="px-4 py-3 text-sm">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>{expenseCategoryLabel(e.category)}</span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-right font-bold text-rose-500">{bdt(e.amount)}</td>
                                    <td className="px-4 py-3 text-right">
                                        <button onClick={() => remove(e._id)} className="p-2 rounded-lg text-rose-500 hover:bg-rose-500/10"><FiTrash2 size={15} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showForm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setShowForm(false)} />
                    <div className={`relative w-full max-w-md rounded-2xl shadow-2xl p-6 ${isDark ? 'bg-slate-900 border border-slate-700' : 'bg-white'}`}>
                        <div className="flex items-center justify-between mb-5">
                            <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Add Expense — {monthLabel(month)}</h2>
                            <button onClick={() => setShowForm(false)} className={`p-2 rounded-lg ${isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-400 hover:bg-slate-100'}`}><FiX /></button>
                        </div>
                        <div className="space-y-4">
                            <input className={input + ' w-full'} placeholder="Reason (যেমন: Facebook Ads)" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
                            <div className="grid grid-cols-2 gap-3">
                                <select className={input + ' w-full'} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                                    {EXPENSE_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                                </select>
                                <input className={input + ' w-full'} type="number" placeholder="Amount (৳)" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
                            </div>
                            <input className={input + ' w-full'} type="date" value={form.costDate} onChange={(e) => setForm({ ...form, costDate: e.target.value })} />
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={() => setShowForm(false)} className={`px-5 py-2.5 rounded-xl font-semibold ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>Cancel</button>
                            <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold disabled:opacity-60" style={{ background: '#FD9A00' }}>
                                <FiSave size={16} /> {saving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
