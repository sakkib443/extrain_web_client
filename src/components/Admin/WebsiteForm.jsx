'use client';

// ===================================================================
// Add / edit a marketplace website — one classic, full-width form for both pages.
// Only the title and the category are required; everything else can be filled in now or later.
// ===================================================================

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
    FiArrowLeft, FiSave, FiLoader, FiUploadCloud, FiX, FiLink, FiFile, FiStar, FiPlus, FiImage,
} from 'react-icons/fi';
import { API_BASE_URL } from '@/config/api';
import { useTheme } from '@/providers/ThemeProvider';

const BRAND = '#FD9A00';
const PLATFORMS = ['WordPress', 'React', 'Next.js', 'PHP', 'HTML/CSS', 'Vue.js', 'Angular', 'Laravel', 'Other'];
const STATUSES = [
    { value: 'approved', label: 'Published', hint: 'সাইটে দেখা যাবে' },
    { value: 'draft', label: 'Draft', hint: 'শুধু ড্যাশবোর্ডে থাকবে' },
    { value: 'pending', label: 'Pending review', hint: 'রিভিউয়ের অপেক্ষায়' },
];

const EMPTY = {
    title: '', category: '', platform: 'WordPress', accessType: 'paid', price: '', offerPrice: '',
    description: '', longDescription: '', images: [], previewUrl: '', videoUrl: '', downloadFile: '',
    features: [], technologies: [], status: 'approved', isFeatured: false,
};

const isUrl = (v) => /^https?:\/\/\S+$/i.test(v.trim());
const token = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : '');

// ---------------------------------------------------------------
// small pieces
// ---------------------------------------------------------------
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

function Field({ cx, label, required, hint, error, children, className = '' }) {
    return (
        <div className={className}>
            <label className={`mb-1.5 block text-sm font-medium ${cx.text}`}>
                {label} {required && <span className="text-rose-500">*</span>}
            </label>
            {children}
            {error ? <p className="mt-1 text-xs text-rose-500">{error}</p> : hint ? <p className={`mt-1 text-xs ${cx.muted}`}>{hint}</p> : null}
        </div>
    );
}

// type a word and press Enter (or comma) to add it; click × to remove
function TagInput({ cx, value, onChange, placeholder }) {
    const [draft, setDraft] = useState('');
    const add = () => {
        const parts = draft.split(',').map((s) => s.trim()).filter(Boolean);
        if (parts.length) onChange([...value, ...parts.filter((p) => !value.includes(p))]);
        setDraft('');
    };
    return (
        <div className={`flex min-h-11 flex-wrap items-center gap-1.5 rounded-lg border px-2 py-1.5 ${cx.input}`}>
            {value.map((t) => (
                <span key={t} className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ${cx.chip}`}>
                    {t}
                    <button type="button" onClick={() => onChange(value.filter((x) => x !== t))} className="opacity-60 hover:opacity-100" aria-label={`Remove ${t}`}><FiX size={12} /></button>
                </span>
            ))}
            <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(); }
                    if (e.key === 'Backspace' && !draft && value.length) onChange(value.slice(0, -1));
                }}
                onBlur={add}
                placeholder={value.length ? '' : placeholder}
                className="min-w-[140px] flex-1 bg-transparent px-1 py-1 text-sm outline-none"
            />
        </div>
    );
}

// a picture that cannot be loaded (wrong link) shows a clear note instead of the browser's broken-image icon
function Thumb({ src, cx }) {
    const [broken, setBroken] = useState(false);
    if (broken) {
        return <div className={`flex h-full w-full flex-col items-center justify-center gap-1 text-center text-[11px] ${cx.soft} ${cx.muted}`}><FiImage size={18} /> ছবি লোড হয়নি<br />লিংকটা দেখুন</div>;
    }
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt="" onError={() => setBroken(true)} className="h-full w-full object-cover" />;
}

// ---------------------------------------------------------------
// the form
// ---------------------------------------------------------------
export default function WebsiteForm({ id }) {
    const editing = !!id;
    const router = useRouter();
    const { isDark } = useTheme();
    const [f, setF] = useState(EMPTY);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(editing);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [upImages, setUpImages] = useState(false);
    const [upFile, setUpFile] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [imageLink, setImageLink] = useState('');
    const imageInput = useRef(null);
    const fileInput = useRef(null);

    const set = (k) => (e) => {
        const v = e?.target ? (e.target.type === 'checkbox' ? e.target.checked : e.target.value) : e;
        setF((p) => ({ ...p, [k]: v }));
        if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }));
    };

    // categories (and, when editing, the website itself)
    useEffect(() => {
        let alive = true;
        fetch(`${API_BASE_URL}/categories?type=website`)
            .then((r) => r.json())
            .then((j) => { if (alive) setCategories(Array.isArray(j.data) ? j.data : []); })
            .catch(() => {});
        if (editing) {
            fetch(`${API_BASE_URL}/websites/${id}`, { headers: { Authorization: `Bearer ${token()}` } })
                .then((r) => r.json())
                .then((j) => {
                    const w = j.data;
                    if (!alive) return;
                    if (!w) { toast.error('Website পাওয়া যায়নি'); return; }
                    setF({
                        title: w.title || '',
                        category: w.category?._id || w.category || '',
                        platform: w.platform || 'Other',
                        accessType: w.accessType || 'paid',
                        price: w.price ? String(w.price) : '',
                        offerPrice: w.offerPrice ? String(w.offerPrice) : '',
                        description: w.description || '',
                        longDescription: w.longDescription || '',
                        images: (w.images || []).filter(Boolean),
                        previewUrl: w.previewUrl || '',
                        videoUrl: w.videoUrl || '',
                        downloadFile: w.downloadFile || '',
                        features: (w.features || []).filter(Boolean),
                        technologies: (w.technologies || []).filter(Boolean),
                        status: w.status || 'approved',
                        isFeatured: !!w.isFeatured,
                    });
                })
                .catch(() => toast.error('লোড করা যায়নি'))
                .finally(() => { if (alive) setLoading(false); });
        }
        return () => { alive = false; };
    }, [editing, id]);

    // main categories first, each followed by its sub-categories
    const categoryOptions = useMemo(() => {
        const pid = (c) => c.parentCategory?._id || c.parentCategory || null;
        const mains = categories.filter((c) => !pid(c));
        const rows = [];
        mains.forEach((m) => {
            rows.push({ id: m._id, label: m.name });
            categories.filter((c) => pid(c) === m._id).forEach((c) => rows.push({ id: c._id, label: `   ↳ ${c.name}` }));
        });
        // sub-categories whose parent is not in the list
        categories.filter((c) => pid(c) && !mains.some((m) => m._id === pid(c))).forEach((c) => rows.push({ id: c._id, label: c.name }));
        return rows;
    }, [categories]);

    // ---- uploads ----
    const uploadImages = async (files) => {
        const list = [...(files || [])].filter((file) => file.type.startsWith('image/'));
        if (!list.length) return;
        setUpImages(true);
        try {
            const fd = new FormData();
            list.slice(0, 10).forEach((file) => fd.append('images', file));
            const res = await fetch(`${API_BASE_URL}/upload/multiple`, { method: 'POST', headers: { Authorization: `Bearer ${token()}` }, body: fd });
            const j = await res.json();
            if (!res.ok || !j.success) throw new Error(j.message || 'Upload failed');
            const urls = (j.data || []).map((d) => d.url).filter(Boolean);
            setF((p) => ({ ...p, images: [...p.images, ...urls] }));
            toast.success(`${urls.length}টা ছবি যোগ হয়েছে`);
        } catch (e) {
            toast.error(e.message || 'ছবি আপলোড হয়নি');
        } finally {
            setUpImages(false);
            if (imageInput.current) imageInput.current.value = '';
        }
    };

    const uploadFile = async (file) => {
        if (!file) return;
        setUpFile(true);
        try {
            const fd = new FormData();
            fd.append('file', file);
            const res = await fetch(`${API_BASE_URL}/upload/file`, { method: 'POST', headers: { Authorization: `Bearer ${token()}` }, body: fd });
            const j = await res.json();
            if (!res.ok || !j.success) throw new Error(j.message || 'Upload failed');
            setF((p) => ({ ...p, downloadFile: j.data.url }));
            toast.success('ফাইল আপলোড হয়েছে');
        } catch (e) {
            toast.error(e.message || 'ফাইল আপলোড হয়নি');
        } finally {
            setUpFile(false);
            if (fileInput.current) fileInput.current.value = '';
        }
    };

    const addImageLink = () => {
        if (!isUrl(imageLink)) { toast.error('ছবির পুরো লিংক দিন (https://…)'); return; }
        setF((p) => ({ ...p, images: [...p.images, imageLink.trim()] }));
        setImageLink('');
    };
    const removeImage = (i) => setF((p) => ({ ...p, images: p.images.filter((_, k) => k !== i) }));
    const makeCover = (i) => setF((p) => ({ ...p, images: [p.images[i], ...p.images.filter((_, k) => k !== i)] }));

    // ---- save ----
    const validate = () => {
        const e = {};
        if (!f.title.trim()) e.title = 'Title দিন';
        if (!f.category) e.category = 'একটা category বেছে নিন';
        if (f.previewUrl.trim() && !isUrl(f.previewUrl)) e.previewUrl = 'পুরো লিংক দিন (https://…)';
        if (f.videoUrl.trim() && !isUrl(f.videoUrl)) e.videoUrl = 'পুরো লিংক দিন (https://…)';
        if (f.accessType === 'paid' && f.price !== '' && !(Number(f.price) >= 0)) e.price = 'সঠিক দাম দিন';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const save = async () => {
        if (!validate()) { toast.error('লাল চিহ্নিত ঘরগুলো ঠিক করুন'); return; }
        const free = f.accessType === 'free';
        const payload = {
            title: f.title.trim(),
            category: f.category,
            platform: f.platform || 'Other',
            accessType: f.accessType,
            price: free ? 0 : Number(f.price) || 0,
            offerPrice: free ? 0 : Number(f.offerPrice) || 0,
            description: f.description.trim(),
            longDescription: f.longDescription.trim(),
            images: f.images,
            previewUrl: f.previewUrl.trim(),
            videoUrl: f.videoUrl.trim(),
            downloadFile: f.downloadFile.trim(),
            features: f.features,
            technologies: f.technologies,
            status: f.status,
            isFeatured: f.isFeatured,
        };
        setSaving(true);
        try {
            const res = await fetch(`${API_BASE_URL}/websites/admin${editing ? `/managed/${id}` : ''}`, {
                method: editing ? 'PATCH' : 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
                body: JSON.stringify(payload),
            });
            const j = await res.json().catch(() => ({}));
            if (!res.ok || j.success === false) {
                const first = Array.isArray(j.errorMessages) && j.errorMessages[0];
                throw new Error(first ? `${String(first.path || '').replace('body.', '')}: ${first.message}` : j.message || 'Save failed');
            }
            toast.success(editing ? 'সেভ হয়েছে ✅' : 'Website যোগ হয়েছে ✅');
            router.push('/dashboard/admin/website');
        } catch (e) {
            toast.error(e.message);
        } finally {
            setSaving(false);
        }
    };

    // ---- look ----
    const cx = {
        card: isDark ? 'bg-slate-900/60 border-slate-700/70' : 'bg-white border-slate-200',
        border: isDark ? 'border-slate-700/70' : 'border-slate-200',
        strong: isDark ? 'text-white' : 'text-slate-900',
        text: isDark ? 'text-slate-200' : 'text-slate-700',
        muted: isDark ? 'text-slate-400' : 'text-slate-500',
        input: isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-800',
        chip: isDark ? 'bg-slate-700 text-slate-100' : 'bg-slate-100 text-slate-700',
        soft: isDark ? 'bg-slate-800/60' : 'bg-slate-50',
    };
    const input = `w-full h-11 rounded-lg border px-3.5 text-sm outline-none transition focus:border-[#FD9A00] focus:ring-2 focus:ring-[#FD9A00]/20 ${cx.input}`;
    const area = `w-full rounded-lg border px-3.5 py-2.5 text-sm leading-relaxed outline-none transition focus:border-[#FD9A00] focus:ring-2 focus:ring-[#FD9A00]/20 ${cx.input}`;
    const bad = (k) => (errors[k] ? ' !border-rose-500' : '');
    const segBtn = (on) => `flex-1 h-11 rounded-lg border text-sm font-semibold transition ${on ? 'text-white border-transparent' : `${cx.input} hover:opacity-80`}`;
    const ghostBtn = `inline-flex h-10 items-center gap-2 rounded-lg border px-4 text-sm font-semibold transition ${isDark ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-50'}`;
    const primaryBtn = 'inline-flex h-10 items-center gap-2 rounded-lg px-5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-60';

    const actions = (
        <div className="flex items-center gap-2">
            <Link href="/dashboard/admin/website" className={ghostBtn}>Cancel</Link>
            <button type="button" onClick={save} disabled={saving || loading} className={primaryBtn} style={{ background: BRAND }}>
                {saving ? <FiLoader className="animate-spin" size={16} /> : <FiSave size={16} />}
                {saving ? 'Saving…' : editing ? 'Save changes' : 'Add website'}
            </button>
        </div>
    );

    if (loading) {
        return <div className={`py-24 text-center ${cx.muted}`}><FiLoader className="mx-auto mb-3 animate-spin" size={24} /> লোড হচ্ছে…</div>;
    }

    return (
        <div className="w-full space-y-5 pb-4">
            <input ref={imageInput} type="file" accept="image/*" multiple className="hidden" onChange={(e) => uploadImages(e.target.files)} />
            <input ref={fileInput} type="file" accept=".zip,.rar,.7z" className="hidden" onChange={(e) => uploadFile(e.target.files?.[0])} />

            {/* Header */}
            <div className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border px-5 py-4 ${cx.card}`}>
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/admin/website" className={`grid h-10 w-10 place-items-center rounded-lg border ${cx.border} ${cx.text} hover:opacity-80`} aria-label="Back"><FiArrowLeft size={18} /></Link>
                    <div>
                        <h1 className={`text-xl font-bold ${cx.strong}`}>{editing ? 'Edit website' : 'Add website'}</h1>
                        <p className={`text-[13px] ${cx.muted}`}>শুধু <span className="text-rose-500">*</span> চিহ্নের ঘর দুটো লাগবে — বাকি সব ঐচ্ছিক, পরে দিলেও চলবে।</p>
                    </div>
                </div>
                {actions}
            </div>

            {/* Basic */}
            <Section cx={cx} title="Basic info" hint="নাম আর কোন category-তে যাবে।">
                <Field cx={cx} label="Title" required error={errors.title}>
                    <input className={input + bad('title')} value={f.title} onChange={set('title')} placeholder="যেমন: Fashion Shop — Ecommerce Website" autoFocus={!editing} />
                </Field>
                <div className="grid gap-4 md:grid-cols-2">
                    <Field cx={cx} label="Category" required error={errors.category}
                        hint={categoryOptions.length === 0 ? undefined : 'Sub-category থাকলে সেটাই বেছে নিন'}>
                        <select className={input + bad('category')} value={f.category} onChange={set('category')}>
                            <option value="">Category বেছে নিন…</option>
                            {categoryOptions.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
                        </select>
                        {categoryOptions.length === 0 && (
                            <p className={`mt-1 text-xs ${cx.muted}`}>এখনো কোনো category নেই — <Link href="/dashboard/admin/category/create" className="font-semibold underline" style={{ color: BRAND }}>আগে একটা বানান</Link></p>
                        )}
                    </Field>
                    <Field cx={cx} label="Platform">
                        <select className={input} value={f.platform} onChange={set('platform')}>
                            {PLATFORMS.map((p) => <option key={p}>{p}</option>)}
                        </select>
                    </Field>
                </div>
            </Section>

            {/* Price */}
            <Section cx={cx} title="Price" hint="ফ্রি হলে দাম লাগবে না।">
                <div className="flex max-w-sm gap-2">
                    {[['paid', 'Paid'], ['free', 'Free']].map(([v, l]) => (
                        <button key={v} type="button" onClick={() => set('accessType')(v)} className={segBtn(f.accessType === v)} style={f.accessType === v ? { background: BRAND } : {}}>{l}</button>
                    ))}
                </div>
                {f.accessType === 'paid' && (
                    <div className="grid gap-4 md:grid-cols-2">
                        <Field cx={cx} label="Price (৳)" error={errors.price}>
                            <input type="number" min="0" className={input + bad('price')} value={f.price} onChange={set('price')} placeholder="0" />
                        </Field>
                        <Field cx={cx} label="Offer price (৳)" hint="ছাড় থাকলে দিন">
                            <input type="number" min="0" className={input} value={f.offerPrice} onChange={set('offerPrice')} placeholder="0" />
                        </Field>
                    </div>
                )}
            </Section>

            {/* Images */}
            <Section cx={cx} title="Images" hint="প্রথম ছবিটাই কভার। যেকোনো ছবিতে ক্লিক করে কভার বানাতে পারবেন।">
                <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => { e.preventDefault(); setDragOver(false); uploadImages(e.dataTransfer.files); }}
                    onClick={() => !upImages && imageInput.current?.click()}
                    className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-8 text-center transition ${dragOver ? 'border-[#FD9A00] bg-[#FD9A00]/5' : `${cx.border} ${cx.soft} hover:border-[#FD9A00]/60`}`}
                >
                    {upImages ? <FiLoader className="animate-spin" size={26} style={{ color: BRAND }} /> : <FiUploadCloud size={26} style={{ color: BRAND }} />}
                    <p className={`text-sm font-medium ${cx.text}`}>{upImages ? 'আপলোড হচ্ছে…' : 'ছবি এখানে টেনে আনুন, অথবা ক্লিক করে বেছে নিন'}</p>
                    <p className={`text-xs ${cx.muted}`}>JPG, PNG, WEBP · প্রতিটা ৫MB পর্যন্ত · একসাথে ১০টা</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <FiLink className={`absolute left-3 top-1/2 -translate-y-1/2 ${cx.muted}`} size={14} />
                        <input className={input + ' pl-9'} value={imageLink} onChange={(e) => setImageLink(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addImageLink(); } }} placeholder="অথবা ছবির লিংক পেস্ট করুন" />
                    </div>
                    <button type="button" onClick={addImageLink} className={ghostBtn}><FiPlus size={15} /> Add</button>
                </div>
                {f.images.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                        {f.images.map((src, i) => (
                            <div key={src + i} className={`group relative aspect-[4/3] overflow-hidden rounded-lg border ${cx.border}`}>
                                <Thumb src={src} cx={cx} />
                                {i === 0 ? (
                                    <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold text-white" style={{ background: BRAND }}><FiStar size={11} /> Cover</span>
                                ) : (
                                    <button type="button" onClick={() => makeCover(i)} className="absolute left-2 top-2 rounded-md bg-black/60 px-2 py-0.5 text-[11px] font-semibold text-white opacity-0 transition group-hover:opacity-100">Make cover</button>
                                )}
                                <button type="button" onClick={() => removeImage(i)} className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-black/60 text-white hover:bg-rose-600" aria-label="Remove image"><FiX size={14} /></button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className={`flex items-center gap-2 text-xs ${cx.muted}`}><FiImage size={13} /> এখনো কোনো ছবি নেই</p>
                )}
            </Section>

            {/* Description */}
            <Section cx={cx} title="Description" hint="ছোট বর্ণনাটা কার্ডে আর পেজের উপরে দেখায়।">
                <Field cx={cx} label="Short description" hint={`${f.description.length}/1000`}>
                    <textarea rows={3} maxLength={1000} className={area} value={f.description} onChange={set('description')} placeholder="এক-দুই লাইনে ওয়েবসাইটটা কী" />
                </Field>
                <Field cx={cx} label="Full description">
                    <textarea rows={6} className={area} value={f.longDescription} onChange={set('longDescription')} placeholder="বিস্তারিত — কী কী আছে, কার জন্য" />
                </Field>
            </Section>

            {/* Features */}
            <Section cx={cx} title="Features & technology" hint="লিখে Enter চাপুন — একটা একটা করে যোগ হবে।">
                <Field cx={cx} label="Features">
                    <TagInput cx={cx} value={f.features} onChange={set('features')} placeholder="যেমন: Responsive, Payment gateway, Admin panel" />
                </Field>
                <Field cx={cx} label="Technologies">
                    <TagInput cx={cx} value={f.technologies} onChange={set('technologies')} placeholder="যেমন: Next.js, MongoDB, Tailwind" />
                </Field>
            </Section>

            {/* Links & file */}
            <Section cx={cx} title="Demo & download" hint="কেনার পর ক্রেতা যে ফাইলটা পাবে।">
                <div className="grid gap-4 md:grid-cols-2">
                    <Field cx={cx} label="Live demo link" error={errors.previewUrl}>
                        <input className={input + bad('previewUrl')} value={f.previewUrl} onChange={set('previewUrl')} placeholder="https://demo.example.com" />
                    </Field>
                    <Field cx={cx} label="YouTube video link" error={errors.videoUrl}>
                        <input className={input + bad('videoUrl')} value={f.videoUrl} onChange={set('videoUrl')} placeholder="https://youtube.com/watch?v=…" />
                    </Field>
                </div>
                <Field cx={cx} label="Download file" hint="ZIP / RAR আপলোড করুন, অথবা লিংক পেস্ট করুন">
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <FiFile className={`absolute left-3 top-1/2 -translate-y-1/2 ${cx.muted}`} size={14} />
                            <input className={input + ' pl-9'} value={f.downloadFile} onChange={set('downloadFile')} placeholder="https://…/website.zip" />
                        </div>
                        <button type="button" onClick={() => fileInput.current?.click()} disabled={upFile} className={ghostBtn}>
                            {upFile ? <FiLoader className="animate-spin" size={15} /> : <FiUploadCloud size={15} />} {upFile ? 'Uploading…' : 'Upload'}
                        </button>
                    </div>
                </Field>
            </Section>

            {/* Visibility */}
            <Section cx={cx} title="Visibility" hint="Draft রাখলে সাইটে দেখা যাবে না।">
                <div className="grid gap-2 sm:grid-cols-3">
                    {STATUSES.map((s) => (
                        <label key={s.value} className={`flex cursor-pointer items-start gap-3 rounded-lg border px-3.5 py-3 transition ${f.status === s.value ? 'border-[#FD9A00] ring-2 ring-[#FD9A00]/20' : cx.border}`}>
                            <input type="radio" name="status" value={s.value} checked={f.status === s.value} onChange={set('status')} className="mt-0.5 accent-[#FD9A00]" />
                            <span>
                                <span className={`block text-sm font-semibold ${cx.strong}`}>{s.label}</span>
                                <span className={`block text-xs ${cx.muted}`}>{s.hint}</span>
                            </span>
                        </label>
                    ))}
                </div>
                <label className="inline-flex cursor-pointer items-center gap-2.5">
                    <input type="checkbox" checked={f.isFeatured} onChange={set('isFeatured')} className="h-4 w-4 accent-[#FD9A00]" />
                    <span className={`text-sm ${cx.text}`}>Featured — হোমপেজ / উপরের দিকে দেখাবে</span>
                </label>
            </Section>

            {/* Bottom bar */}
            <div className={`sticky bottom-0 z-10 flex items-center justify-between gap-3 rounded-xl border px-5 py-3 backdrop-blur ${isDark ? 'bg-slate-900/90 border-slate-700/70' : 'bg-white/95 border-slate-200'}`}>
                <p className={`hidden text-[13px] sm:block ${cx.muted}`}>{f.title.trim() && f.category ? 'সেভ করার জন্য তৈরি ✓' : 'Title আর Category দিলেই সেভ করা যাবে'}</p>
                {actions}
            </div>
        </div>
    );
}
