'use client';

// ===================================================================
// Add a category — classic, full-width, one short form.
// Only the name is required. No parent = a main category; pick a parent to make a sub-category.
// ===================================================================

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiSave, FiLoader, FiUploadCloud, FiX, FiPlus, FiFolder, FiCornerDownRight } from 'react-icons/fi';
import { API_BASE_URL } from '@/config/api';
import { useTheme } from '@/providers/ThemeProvider';

const BRAND = '#FD9A00';
const EMPTY = { name: '', type: 'website', parentCategory: '', status: 'active', image: '', description: '' };
const token = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : '');

function Section({ cx, title, hint, children }) {
    return (
        <section className={`rounded-xl border ${cx.card}`}>
            <div className="grid lg:grid-cols-[260px_1fr]">
                <div className={`px-5 pt-5 lg:pb-5 lg:border-r ${cx.border}`}>
                    <h2 className={`text-[15px] font-semibold ${cx.strong}`}>{title}</h2>
                    {hint && <p className={`mt-1 text-[13px] leading-relaxed ${cx.muted}`}>{hint}</p>}
                </div>
                <div className="p-5 space-y-4">{children}</div>
            </div>
        </section>
    );
}

export default function CreateCategoryPage() {
    const router = useRouter();
    const { isDark } = useTheme();
    const [f, setF] = useState(EMPTY);
    const [parents, setParents] = useState([]);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [nameError, setNameError] = useState('');
    const [added, setAdded] = useState([]); // names saved with "Save & add another"
    const imageInput = useRef(null);
    const nameInput = useRef(null);

    const loadParents = () =>
        fetch(`${API_BASE_URL}/categories/admin/parents`, { headers: { Authorization: `Bearer ${token()}` } })
            .then((r) => r.json())
            .then((j) => setParents(Array.isArray(j.data) ? j.data : []))
            .catch(() => {});
    useEffect(() => { loadParents(); }, []);

    const set = (k) => (e) => {
        const v = e?.target ? e.target.value : e;
        setF((p) => ({ ...p, [k]: v, ...(k === 'type' ? { parentCategory: '' } : {}) }));
        if (k === 'name') setNameError('');
    };
    const parentsOfType = parents.filter((p) => (p.type || 'website') === f.type);

    const uploadImage = async (file) => {
        if (!file) return;
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append('image', file);
            const res = await fetch(`${API_BASE_URL}/upload/single`, { method: 'POST', headers: { Authorization: `Bearer ${token()}` }, body: fd });
            const j = await res.json();
            if (!res.ok || !j.success) throw new Error(j.message || 'Upload failed');
            setF((p) => ({ ...p, image: j.data.url }));
        } catch (e) {
            toast.error(e.message || 'ছবি আপলোড হয়নি');
        } finally {
            setUploading(false);
            if (imageInput.current) imageInput.current.value = '';
        }
    };

    const save = async (another = false) => {
        if (!f.name.trim()) { setNameError('নাম দিন'); nameInput.current?.focus(); return; }
        if (f.image && !/^https?:\/\//i.test(f.image)) { toast.error('ছবির পুরো লিংক দিন (https://…)'); return; }
        setSaving(true);
        try {
            const res = await fetch(`${API_BASE_URL}/categories/admin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
                body: JSON.stringify({
                    name: f.name.trim(),
                    type: f.type,
                    parentCategory: f.parentCategory || null,
                    isParent: !f.parentCategory,
                    status: f.status,
                    image: f.image.trim(),
                    description: f.description.trim(),
                }),
            });
            const j = await res.json().catch(() => ({}));
            if (!res.ok || j.success === false) throw new Error(j.message || 'Save failed');
            toast.success(`"${f.name.trim()}" যোগ হয়েছে ✅`);
            if (another) {
                // keep type / parent / status so a list of sub-categories goes in quickly
                setAdded((a) => [f.name.trim(), ...a].slice(0, 8));
                setF((p) => ({ ...p, name: '', image: '', description: '' }));
                if (!f.parentCategory) loadParents(); // a new main category can be picked as a parent right away
                nameInput.current?.focus();
            } else {
                router.push('/dashboard/admin/category');
            }
        } catch (e) {
            toast.error(e.message);
        } finally {
            setSaving(false);
        }
    };

    const cx = {
        card: isDark ? 'bg-slate-900/60 border-slate-700/70' : 'bg-white border-slate-200',
        border: isDark ? 'border-slate-700/70' : 'border-slate-200',
        strong: isDark ? 'text-white' : 'text-slate-900',
        text: isDark ? 'text-slate-200' : 'text-slate-700',
        muted: isDark ? 'text-slate-400' : 'text-slate-500',
        input: isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-800',
        soft: isDark ? 'bg-slate-800/60' : 'bg-slate-50',
    };
    const input = `w-full h-11 rounded-lg border px-3.5 text-sm outline-none transition focus:border-[#FD9A00] focus:ring-2 focus:ring-[#FD9A00]/20 ${cx.input}`;
    const label = `mb-1.5 block text-sm font-medium ${cx.text}`;
    const seg = (on) => `flex-1 h-11 rounded-lg border text-sm font-semibold transition ${on ? 'text-white border-transparent' : `${cx.input} hover:opacity-80`}`;
    const ghostBtn = `inline-flex h-10 items-center gap-2 rounded-lg border px-4 text-sm font-semibold transition disabled:opacity-60 ${isDark ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-50'}`;
    const primaryBtn = 'inline-flex h-10 items-center gap-2 rounded-lg px-5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-60';
    const parentName = parentsOfType.find((p) => p._id === f.parentCategory)?.name;

    const actions = (
        <div className="flex flex-wrap items-center gap-2">
            <Link href="/dashboard/admin/category" className={ghostBtn}>Cancel</Link>
            <button type="button" onClick={() => save(true)} disabled={saving} className={ghostBtn}><FiPlus size={15} /> Save &amp; add another</button>
            {/* type=submit: pressing Enter in the form saves (the form's onSubmit calls save) */}
            <button type="submit" disabled={saving} className={primaryBtn} style={{ background: BRAND }}>
                {saving ? <FiLoader className="animate-spin" size={16} /> : <FiSave size={16} />} {saving ? 'Saving…' : 'Save category'}
            </button>
        </div>
    );

    return (
        <form className="w-full space-y-5 pb-4" onSubmit={(e) => { e.preventDefault(); save(false); }}>
            <input ref={imageInput} type="file" accept="image/*" className="hidden" onChange={(e) => uploadImage(e.target.files?.[0])} />

            {/* Header */}
            <div className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border px-5 py-4 ${cx.card}`}>
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/admin/category" className={`grid h-10 w-10 place-items-center rounded-lg border ${cx.border} ${cx.text} hover:opacity-80`} aria-label="Back"><FiArrowLeft size={18} /></Link>
                    <div>
                        <h1 className={`text-xl font-bold ${cx.strong}`}>Add category</h1>
                        <p className={`text-[13px] ${cx.muted}`}>শুধু নাম দিলেই হবে — বাকি সব ঐচ্ছিক।</p>
                    </div>
                </div>
                {actions}
            </div>

            <Section cx={cx} title="Category" hint="Parent না দিলে এটা মূল category হবে। কোনো category-র ভিতরে রাখতে চাইলে parent বেছে নিন।">
                <div>
                    <label className={label}>Name <span className="text-rose-500">*</span></label>
                    <input ref={nameInput} autoFocus className={input + (nameError ? ' !border-rose-500' : '')} value={f.name} onChange={set('name')} placeholder="যেমন: Ecommerce, Portfolio, School Management" />
                    {nameError && <p className="mt-1 text-xs text-rose-500">{nameError}</p>}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label className={label}>For</label>
                        <div className="flex gap-2">
                            {[['website', 'Websites'], ['software', 'Software']].map(([v, l]) => (
                                <button key={v} type="button" onClick={() => set('type')(v)} className={seg(f.type === v)} style={f.type === v ? { background: BRAND } : {}}>{l}</button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className={label}>Parent category</label>
                        <select className={input} value={f.parentCategory} onChange={set('parentCategory')}>
                            <option value="">None — this is a main category</option>
                            {parentsOfType.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
                        </select>
                    </div>
                </div>
                <p className={`flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] ${cx.soft} ${cx.text}`}>
                    {parentName ? <FiCornerDownRight size={14} style={{ color: BRAND }} /> : <FiFolder size={14} style={{ color: BRAND }} />}
                    {parentName
                        ? <span><b>{parentName}</b> এর ভিতরে sub-category হবে: <b>{f.name.trim() || '…'}</b></span>
                        : <span>মূল category হবে: <b>{f.name.trim() || '…'}</b></span>}
                </p>
            </Section>

            <Section cx={cx} title="More (optional)" hint="ছবি আর বর্ণনা পরে দিলেও চলবে।">
                <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                    <div>
                        <label className={label}>Image</label>
                        <input className={input} value={f.image} onChange={set('image')} placeholder="ছবির লিংক, অথবা Upload চাপুন" />
                    </div>
                    <button type="button" onClick={() => imageInput.current?.click()} disabled={uploading} className={ghostBtn + ' h-11'}>
                        {uploading ? <FiLoader className="animate-spin" size={15} /> : <FiUploadCloud size={15} />} {uploading ? 'Uploading…' : 'Upload'}
                    </button>
                </div>
                {f.image && (
                    <div className={`relative h-24 w-32 overflow-hidden rounded-lg border ${cx.border}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={f.image} alt="" className="h-full w-full object-cover" />
                        <button type="button" onClick={() => setF((p) => ({ ...p, image: '' }))} className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-black/60 text-white hover:bg-rose-600" aria-label="Remove image"><FiX size={12} /></button>
                    </div>
                )}
                <div>
                    <label className={label}>Description</label>
                    <textarea rows={3} maxLength={500} className={`w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition focus:border-[#FD9A00] focus:ring-2 focus:ring-[#FD9A00]/20 ${cx.input}`} value={f.description} onChange={set('description')} placeholder="এই category-তে কী ধরনের ওয়েবসাইট থাকবে" />
                </div>
                <div>
                    <label className={label}>Status</label>
                    <div className="flex max-w-sm gap-2">
                        {[['active', 'Active'], ['inactive', 'Hidden']].map(([v, l]) => (
                            <button key={v} type="button" onClick={() => set('status')(v)} className={seg(f.status === v)} style={f.status === v ? { background: BRAND } : {}}>{l}</button>
                        ))}
                    </div>
                </div>
            </Section>

            {added.length > 0 && (
                <p className={`text-[13px] ${cx.muted}`}>এইমাত্র যোগ হয়েছে: {added.join(' · ')}</p>
            )}

            <div className={`sticky bottom-0 z-10 flex items-center justify-between gap-3 rounded-xl border px-5 py-3 backdrop-blur ${isDark ? 'bg-slate-900/90 border-slate-700/70' : 'bg-white/95 border-slate-200'}`}>
                <p className={`hidden text-[13px] sm:block ${cx.muted}`}>Enter চাপলেও সেভ হবে</p>
                {actions}
            </div>
        </form>
    );
}
