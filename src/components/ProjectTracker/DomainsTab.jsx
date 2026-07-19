'use client';

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
    FiPlus, FiTrash2, FiEdit3, FiRefreshCw, FiX, FiSave, FiGlobe,
    FiTrendingUp, FiTrendingDown, FiDollarSign,
} from 'react-icons/fi';
import { ptApi, bdt, fmtDate } from '@/lib/projectTracker';

const Stat = ({ isDark, icon: Icon, label, value, tone }) => {
    const tones = { blue: 'from-blue-500 to-indigo-600', red: 'from-rose-500 to-red-600', green: 'from-emerald-500 to-green-600', slate: 'from-slate-500 to-slate-600' };
    return (
        <div className={`rounded-2xl p-4 border ${isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-white border-slate-200'} shadow-sm`}>
            <div className="flex items-center gap-2 mb-2">
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${tones[tone] || tones.slate} flex items-center justify-center text-white`}><Icon size={16} /></div>
                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{label}</span>
            </div>
            <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{value}</p>
        </div>
    );
};

const emptyForm = { domainName: '', type: 'domain', hostingGB: '', owner: '', linkedProjectId: '', linkedClientName: '', provider: '', buyPrice: '', sellPrice: '', purchaseDate: '', expiryDate: '', note: '' };

const TYPE_LABEL = { domain: 'Domain', hosting: 'Hosting', both: 'Domain + Hosting' };

export default function DomainsTab({ isDark }) {
    const [domains, setDomains] = useState([]);
    const [summary, setSummary] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null); // null | 'new' | domain
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);

    const load = async () => {
        setLoading(true);
        try {
            const [d, s, p] = await Promise.all([ptApi.getDomains(), ptApi.getDomainSummary(), ptApi.getProjects()]);
            setDomains(d); setSummary(s); setProjects(p);
        } catch (e) { toast.error(e.message); }
        finally { setLoading(false); }
    };
    useEffect(() => { load(); }, []);

    const openNew = () => { setForm(emptyForm); setEditing('new'); };
    const openEdit = (d) => {
        setForm({
            domainName: d.domainName || '', type: d.type || 'domain', hostingGB: d.hostingGB ?? '',
            owner: d.owner || '', linkedProjectId: d.linkedProjectId || '',
            linkedClientName: d.linkedClientName || '', provider: d.provider || '',
            buyPrice: d.buyPrice ?? '', sellPrice: d.sellPrice ?? '',
            purchaseDate: d.purchaseDate ? new Date(d.purchaseDate).toISOString().slice(0, 10) : '',
            expiryDate: d.expiryDate ? new Date(d.expiryDate).toISOString().slice(0, 10) : '',
            note: d.note || '',
        });
        setEditing(d);
    };

    const profit = (Number(form.sellPrice) || 0) - (Number(form.buyPrice) || 0);

    const onSelectProject = (e) => {
        const pid = e.target.value;
        const pr = projects.find((x) => x.projectId === pid);
        setForm({ ...form, linkedProjectId: pid, linkedClientName: pr ? `${pr.clientName}${pr.companyBrand ? ' (' + pr.companyBrand + ')' : ''}` : '' });
    };

    const save = async () => {
        if (!form.domainName) { toast.error('Domain name দিন'); return; }
        setSaving(true);
        try {
            const body = { ...form, buyPrice: Number(form.buyPrice) || 0, sellPrice: Number(form.sellPrice) || 0 };
            if (editing && editing._id) await ptApi.updateDomain(editing._id, body);
            else await ptApi.createDomain(body);
            toast.success(editing?._id ? 'আপডেট হয়েছে' : 'ডোমেইন যোগ হয়েছে');
            setEditing(null); load();
        } catch (e) { toast.error(e.message); }
        finally { setSaving(false); }
    };

    const remove = async (id) => {
        if (!confirm('এই ডোমেইন ডিলিট করবেন?')) return;
        try { await ptApi.deleteDomain(id); toast.success('ডিলিট হয়েছে'); load(); }
        catch (e) { toast.error(e.message); }
    };

    const muted = isDark ? 'text-slate-400' : 'text-slate-500';
    const th = `px-3 py-3 text-left text-xs font-bold uppercase whitespace-nowrap ${muted}`;
    const td = `px-3 py-3 text-sm whitespace-nowrap ${isDark ? 'text-slate-200' : 'text-slate-700'}`;
    const label = `text-xs font-semibold mb-1.5 block ${muted}`;
    const input = `w-full px-3 py-2.5 rounded-lg border outline-none text-sm ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`;

    return (
        <div className="space-y-4">
            {/* Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <Stat isDark={isDark} icon={FiGlobe} label="Total Domains" value={summary?.count || 0} tone="slate" />
                <Stat isDark={isDark} icon={FiTrendingDown} label="Total Buy Cost" value={bdt(summary?.totalBuy)} tone="red" />
                <Stat isDark={isDark} icon={FiDollarSign} label="Total Sell" value={bdt(summary?.totalSell)} tone="blue" />
                <Stat isDark={isDark} icon={FiTrendingUp} label="Total Profit" value={bdt(summary?.totalProfit)} tone={(summary?.totalProfit || 0) >= 0 ? 'green' : 'red'} />
            </div>

            <div className="flex items-center justify-between">
                <h3 className={`font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}><FiGlobe style={{ color: '#FD9A00' }} /> Domain List</h3>
                <div className="flex gap-2">
                    <button onClick={load} className={`p-2.5 rounded-xl ${isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                        <FiRefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <button onClick={openNew} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-semibold shadow" style={{ background: '#FD9A00' }}>
                        <FiPlus size={16} /> Add Domain
                    </button>
                </div>
            </div>

            <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-slate-800/40 border-slate-700' : 'bg-white border-slate-200'} shadow-sm`}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className={isDark ? 'bg-slate-800' : 'bg-slate-50'}>
                            <tr>
                                <th className={th}>Domain / Name</th>
                                <th className={th}>Type</th>
                                <th className={th}>Owner</th>
                                <th className={th}>Linked Project</th>
                                <th className={th}>Provider</th>
                                <th className={th}>Buy</th>
                                <th className={th}>Sell</th>
                                <th className={th}>Profit</th>
                                <th className={th}>Expiry</th>
                                <th className={th + ' text-right'}>Actions</th>
                            </tr>
                        </thead>
                        <tbody className={isDark ? 'divide-y divide-slate-700/50' : 'divide-y divide-slate-100'}>
                            {loading ? (
                                <tr><td colSpan={10} className={`text-center py-14 ${muted}`}>লোড হচ্ছে...</td></tr>
                            ) : domains.length === 0 ? (
                                <tr><td colSpan={10} className={`text-center py-14 ${muted}`}>কোনো ডোমেইন নেই। Add Domain চাপুন।</td></tr>
                            ) : domains.map((d) => (
                                <tr key={d._id} className={isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}>
                                    <td className={td + ' font-semibold'}>{d.domainName}</td>
                                    <td className={td}>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>{TYPE_LABEL[d.type] || 'Domain'}</span>
                                        {(d.type === 'hosting' || d.type === 'both') && d.hostingGB ? <span className={`ml-1.5 text-xs ${muted}`}>{d.hostingGB} GB</span> : null}
                                    </td>
                                    <td className={td}>{d.owner || '—'}</td>
                                    <td className={td}>
                                        {d.linkedProjectId ? (
                                            <span><span className="font-mono font-semibold" style={{ color: '#FD9A00' }}>{d.linkedProjectId}</span>{d.linkedClientName ? ` • ${d.linkedClientName}` : ''}</span>
                                        ) : '—'}
                                    </td>
                                    <td className={td}>{d.provider || '—'}</td>
                                    <td className={td + ' text-rose-500 font-semibold'}>{bdt(d.buyPrice)}</td>
                                    <td className={td + ' text-blue-500 font-semibold'}>{bdt(d.sellPrice)}</td>
                                    <td className={td + ' font-bold ' + ((d.profit || 0) >= 0 ? 'text-emerald-500' : 'text-rose-500')}>{bdt(d.profit)}</td>
                                    <td className={td}>{d.expiryDate ? fmtDate(d.expiryDate) : '—'}</td>
                                    <td className={td + ' text-right'}>
                                        <div className="inline-flex gap-1">
                                            <button onClick={() => openEdit(d)} className="p-2 rounded-lg text-blue-500 hover:bg-blue-500/10"><FiEdit3 size={15} /></button>
                                            <button onClick={() => remove(d._id)} className="p-2 rounded-lg text-rose-500 hover:bg-rose-500/10"><FiTrash2 size={15} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit modal */}
            {editing && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setEditing(null)} />
                    <div className={`relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl shadow-2xl ${isDark ? 'bg-slate-900 border border-slate-700' : 'bg-white'}`}>
                        <div className={`sticky top-0 flex items-center justify-between px-6 py-4 border-b ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-100'}`}>
                            <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{editing?._id ? 'Edit Domain' : 'Add Domain'}</h2>
                            <button onClick={() => setEditing(null)} className={`p-2 rounded-lg ${isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-400 hover:bg-slate-100'}`}><FiX /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            {/* Type: শুধু ডোমেইন / শুধু হোস্টিং / দুইটাই */}
                            <div>
                                <label className={label}>Type</label>
                                <div className="flex flex-wrap gap-2">
                                    {['domain', 'hosting', 'both'].map((t) => (
                                        <button key={t} type="button" onClick={() => setForm({ ...form, type: t })}
                                            className={`px-4 py-2 rounded-lg text-sm font-semibold border transition ${form.type === t
                                                ? 'text-white border-transparent'
                                                : isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                                            style={form.type === t ? { background: '#FD9A00' } : {}}>
                                            {TYPE_LABEL[t]}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div><label className={label}>{form.type === 'hosting' ? 'Name / Site' : 'Domain Name'} *</label><input className={input} placeholder={form.type === 'hosting' ? 'যে সাইটের হোস্টিং' : 'example.com'} value={form.domainName} onChange={(e) => setForm({ ...form, domainName: e.target.value })} /></div>
                                {(form.type === 'hosting' || form.type === 'both') ? (
                                    <div><label className={label}>Hosting (GB) — কত জিবি</label><input type="number" className={input} placeholder="যেমন 10" value={form.hostingGB} onChange={(e) => setForm({ ...form, hostingGB: e.target.value })} /></div>
                                ) : (
                                    <div><label className={label}>Owner (মালিক)</label><input className={input} value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} /></div>
                                )}
                            </div>

                            {(form.type === 'hosting' || form.type === 'both') && (
                                <div><label className={label}>Owner (মালিক)</label><input className={input} value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} /></div>
                            )}
                            <div>
                                <label className={label}>Linked Project (কোন প্রজেক্টে ব্যবহার)</label>
                                <select className={input} value={form.linkedProjectId} onChange={onSelectProject}>
                                    <option value="">— None —</option>
                                    {projects.map((pr) => (
                                        <option key={pr._id} value={pr.projectId}>{pr.projectId} • {pr.clientName}{pr.companyBrand ? ` (${pr.companyBrand})` : ''}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div><label className={label}>Buy Price (৳)</label><input type="number" className={input} value={form.buyPrice} onChange={(e) => setForm({ ...form, buyPrice: e.target.value })} /></div>
                                <div><label className={label}>Sell Price (৳)</label><input type="number" className={input} value={form.sellPrice} onChange={(e) => setForm({ ...form, sellPrice: e.target.value })} /></div>
                                <div>
                                    <label className={label}>Profit (auto)</label>
                                    <div className={`px-3 py-2.5 rounded-lg border text-sm font-bold ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'} ${profit >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>{bdt(profit)}</div>
                                </div>
                            </div>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div><label className={label}>Provider</label><input className={input} placeholder="Namecheap ইত্যাদি" value={form.provider} onChange={(e) => setForm({ ...form, provider: e.target.value })} /></div>
                                <div><label className={label}>Purchase Date</label><input type="date" className={input} value={form.purchaseDate} onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })} /></div>
                                <div><label className={label}>Expiry Date</label><input type="date" className={input} value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} /></div>
                            </div>
                            <div><label className={label}>Note</label><input className={input} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} /></div>
                        </div>
                        <div className={`sticky bottom-0 flex justify-end gap-3 px-6 py-4 border-t ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-100'}`}>
                            <button onClick={() => setEditing(null)} className={`px-5 py-2.5 rounded-xl font-semibold ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>Cancel</button>
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
