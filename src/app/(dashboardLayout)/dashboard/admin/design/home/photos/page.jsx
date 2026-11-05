'use client';

// ===================================================================
// Home page photos — every picture on the home page in one place:
// the hero slides + background, the two three-photo sections, and the gallery (rows, columns, widths, order).
// Click on any photo to choose which part of it stays in view. "Preview" shows unsaved changes on the real page.
// ===================================================================

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
    FiArrowLeft, FiSave, FiLoader, FiUploadCloud, FiX, FiLink, FiEye, FiRotateCcw, FiPlus, FiTrash2,
    FiChevronLeft, FiChevronRight, FiChevronUp, FiChevronDown, FiMaximize2, FiImage, FiCrosshair,
} from 'react-icons/fi';
import { API_BASE_URL } from '@/config/api';
import { useTheme } from '@/providers/ThemeProvider';
import { HOME_MEDIA_KEY, HOME_MEDIA_PREVIEW_KEY, LIMITS, mergeHomeMedia, okSrc } from '@/lib/homeMedia';

const BRAND = '#FD9A00';
const GAP = 16;
const token = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : '');
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, Math.round(n)));
const DEF = mergeHomeMedia(null);

const TABS = [
    { key: 'hero', label: 'Hero', hint: 'বড় ছবি + পেছনের ছবি' },
    { key: 'services', label: 'Digital Growth', hint: 'সার্ভিসের ৩টা কার্ড' },
    { key: 'roadmap', label: 'Growth Roadmap', hint: '৩টা ছবির কোলাজ' },
    { key: 'gallery', label: 'Gallery', hint: 'সারি, কলাম, সাইজ' },
];
const SERVICE_NAMES = ['Digital Marketing (বাঁয়ে)', 'Web Design & Development (মাঝে, বড়)', 'Content & Media (ডানে)'];
const SERVICE_ASPECT = ['20 / 21', '3 / 2', '20 / 21'];
const ROADMAP_NAMES = ['Web Design & Development (উপরে)', 'Digital Marketing (নিচে বাঁয়ে)', 'Content & Media (নিচে ডানে)'];
const ROADMAP_ASPECT = ['16 / 9', '6 / 7', '3 / 4'];

// ---- uploads (10 per request, the server's limit) ----
async function uploadImages(files) {
    const list = [...(files || [])].filter((f) => f.type.startsWith('image/'));
    const urls = [];
    for (let i = 0; i < list.length; i += 10) {
        const fd = new FormData();
        list.slice(i, i + 10).forEach((f) => fd.append('images', f));
        const res = await fetch(`${API_BASE_URL}/upload/multiple`, { method: 'POST', headers: { Authorization: `Bearer ${token()}` }, body: fd });
        const j = await res.json().catch(() => ({}));
        if (!res.ok || !j.success) throw new Error(j.message || 'Upload failed');
        urls.push(...(j.data || []).map((d) => d.url).filter(Boolean));
    }
    return urls;
}

// width ÷ height of a picture (cached), used to size gallery columns so photos are not cut much
const aspectCache = new Map();
const aspectOf = (src) => {
    if (aspectCache.has(src)) return aspectCache.get(src);
    const p = new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 0.75);
        img.onerror = () => resolve(0.75);
        img.src = src;
    });
    aspectCache.set(src, p);
    return p;
};
const autoWidth = async (items, rowH) => {
    const a = await Promise.all(items.map((it) => aspectOf(it.src)));
    const tileH = items.length === 2 ? (rowH - GAP) / 2 : rowH;
    const avg = a.reduce((s, x) => s + x, 0) / a.length;
    return clamp(avg * tileH, LIMITS.colMin, LIMITS.colMax);
};

// what goes to the server: exactly the saved shape, nothing else
const toPayload = (m) => ({
    hero: {
        slides: m.hero.slides.map((s) => ({ src: s.src, full: s.full || s.src, alt: s.alt || '', pos: s.pos })),
        background: m.hero.background,
        overlay: m.hero.overlay,
    },
    services: m.services.map((s) => ({ src: s.src, pos: s.pos })),
    roadmap: m.roadmap.map((s) => ({ src: s.src, pos: s.pos })),
    gallery: {
        rowHeight: m.gallery.rowHeight,
        rows: m.gallery.rows.map((r) => ({
            columns: r.columns.map((c) => ({
                w: c.w,
                items: c.items.map((it) => ({ src: it.src, full: it.full || it.src, label: it.label || '', labelBn: it.labelBn || '', pos: it.pos })),
            })),
        })),
    },
});

// ---------------------------------------------------------------
// one photo: click to set which part stays in view, change / paste a link / reset
// ---------------------------------------------------------------
function PhotoSlot({ cx, value, onChange, aspect = '4 / 3', fallback, title, overlay, compact = false, focus = true, children }) {
    const input = useRef(null);
    const [busy, setBusy] = useState(false);
    const [linkOpen, setLinkOpen] = useState(false);
    const [link, setLink] = useState('');
    const [x, y] = (value.pos || '50% 50%').split(' ').map((v) => parseFloat(v));

    const pick = (e) => {
        const r = e.currentTarget.getBoundingClientRect();
        const px = clamp(((e.clientX - r.left) / r.width) * 100, 0, 100);
        const py = clamp(((e.clientY - r.top) / r.height) * 100, 0, 100);
        onChange({ ...value, pos: `${px}% ${py}%` });
    };
    const upload = async (files) => {
        setBusy(true);
        try {
            const [url] = await uploadImages(files);
            if (url) onChange({ ...value, src: url, full: url, pos: '50% 50%' });
        } catch (e) {
            toast.error(e.message || 'আপলোড হয়নি');
        } finally {
            setBusy(false);
            if (input.current) input.current.value = '';
        }
    };
    const applyLink = () => {
        if (!okSrc(link.trim())) { toast.error('ছবির পুরো লিংক দিন (https://…)'); return; }
        onChange({ ...value, src: link.trim(), full: link.trim(), pos: '50% 50%' });
        setLink(''); setLinkOpen(false);
    };
    const btn = `inline-flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-xs font-semibold transition ${cx.ghost}`;

    return (
        <div className={`rounded-xl border ${cx.card} ${compact ? 'p-3' : 'p-4'}`}>
            <input ref={input} type="file" accept="image/*" className="hidden" onChange={(e) => upload(e.target.files)} />
            {title && <p className={`mb-2 text-sm font-semibold ${cx.strong}`}>{title}</p>}
            <div
                role="button"
                tabIndex={0}
                onClick={focus ? pick : undefined}
                title={focus ? 'ক্লিক করে ঠিক করুন কোন অংশ দেখা যাবে' : undefined}
                className={`relative w-full overflow-hidden rounded-lg bg-slate-900 ${focus ? 'cursor-crosshair' : ''}`}
                style={{ aspectRatio: aspect }}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={value.src} alt="" draggable={false} className="h-full w-full object-cover" style={{ objectPosition: value.pos || '50% 50%' }} />
                {overlay !== undefined && <span className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${overlay / 100})` }} />}
                {focus && <span className="pointer-events-none absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_2px_rgba(0,0,0,0.45)]" style={{ left: `${x}%`, top: `${y}%` }} />}
                {busy && <span className="absolute inset-0 grid place-items-center bg-black/50 text-white"><FiLoader className="animate-spin" size={22} /></span>}
            </div>
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                <button type="button" onClick={() => input.current?.click()} disabled={busy} className={btn}><FiUploadCloud size={13} /> Change</button>
                <button type="button" onClick={() => setLinkOpen((v) => !v)} className={btn}><FiLink size={13} /> Link</button>
                {fallback && value.src !== fallback.src && (
                    <button type="button" onClick={() => onChange({ ...value, src: fallback.src, full: fallback.full || fallback.src, pos: fallback.pos })} className={btn} title="আগের (default) ছবিতে ফেরত"><FiRotateCcw size={13} /> Default</button>
                )}
                {focus && <span className={`ml-auto inline-flex items-center gap-1 text-[11px] ${cx.muted}`}><FiCrosshair size={11} /> {value.pos || '50% 50%'}</span>}
            </div>
            {linkOpen && (
                <div className="mt-2 flex gap-1.5">
                    <input value={link} onChange={(e) => setLink(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && applyLink()} placeholder="https://…/photo.jpg" className={`h-9 flex-1 rounded-md border px-2.5 text-xs outline-none ${cx.input}`} />
                    <button type="button" onClick={applyLink} className="h-9 rounded-md px-3 text-xs font-semibold text-white" style={{ background: BRAND }}>Use</button>
                </div>
            )}
            {children}
        </div>
    );
}

// ---------------------------------------------------------------
// page
// ---------------------------------------------------------------
export default function HomePhotosPage() {
    const { isDark } = useTheme();
    const [m, setM] = useState(DEF);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [dirty, setDirty] = useState(false);
    const [savedAt, setSavedAt] = useState(null);
    const [tab, setTab] = useState('gallery');
    const [sel, setSel] = useState({ row: 0, col: 0 }); // selected gallery column
    const [adding, setAdding] = useState(null); // row index while photos upload
    const addInput = useRef(null);
    const addRow = useRef(0);
    const secondInput = useRef(null);

    useEffect(() => {
        let alive = true;
        fetch(`${API_BASE_URL}/site-content/${HOME_MEDIA_KEY}`)
            .then((r) => r.json())
            .then((j) => { if (alive) { setM(mergeHomeMedia(j?.data)); setSavedAt(j?.meta?.updatedAt || null); } })
            .catch(() => toast.error('লোড করা যায়নি — default ছবিগুলো দেখানো হচ্ছে'))
            .finally(() => { if (alive) setLoading(false); });
        return () => { alive = false; };
    }, []);

    useEffect(() => {
        if (!dirty) return;
        const warn = (e) => { e.preventDefault(); e.returnValue = ''; };
        window.addEventListener('beforeunload', warn);
        return () => window.removeEventListener('beforeunload', warn);
    }, [dirty]);

    const update = (fn) => { setM((cur) => fn(structuredClone(cur))); setDirty(true); };
    const rowH = m.gallery.rowHeight;

    // ---- save / preview / reset ----
    const save = async () => {
        setSaving(true);
        try {
            const res = await fetch(`${API_BASE_URL}/site-content/${HOME_MEDIA_KEY}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
                body: JSON.stringify(toPayload(m)),
            });
            const j = await res.json().catch(() => ({}));
            if (!res.ok || j.success === false) throw new Error(j.message || 'Save failed');
            setDirty(false);
            setSavedAt(j?.meta?.updatedAt || new Date().toISOString());
            toast.success('সেভ হয়েছে ✅ — হোম পেজে দেখা যাবে');
        } catch (e) {
            toast.error(e.message);
        } finally {
            setSaving(false);
        }
    };
    const preview = () => {
        try { localStorage.setItem(HOME_MEDIA_PREVIEW_KEY, JSON.stringify(toPayload(m))); } catch { /* storage full / blocked */ }
        window.open(`/?preview=${HOME_MEDIA_KEY}${tab === 'gallery' ? '#gallery' : ''}`, '_blank', 'noopener');
    };
    const resetTab = () => {
        if (!confirm('এই অংশটা default ছবিতে ফেরত যাবে (সেভ না করা পর্যন্ত সাইটে কিছু বদলাবে না)। নিশ্চিত?')) return;
        update((c) => { c[tab] = structuredClone(DEF[tab]); return c; });
        if (tab === 'gallery') setSel({ row: 0, col: 0 });
    };

    // ---- gallery helpers ----
    const startAdd = (row) => { addRow.current = row; addInput.current?.click(); };
    const onAddFiles = async (files) => {
        const row = addRow.current;
        setAdding(row);
        try {
            const urls = await uploadImages(files);
            const cols = await Promise.all(urls.map(async (u) => ({ w: await autoWidth([{ src: u }], rowH), items: [{ src: u, full: u, label: '', labelBn: '', pos: '50% 30%' }] })));
            update((c) => { c.gallery.rows[row].columns.unshift(...cols); return c; });
            setSel({ row, col: 0 });
            toast.success(`${urls.length}টা ছবি সারির শুরুতে যোগ হয়েছে`);
        } catch (e) {
            toast.error(e.message || 'আপলোড হয়নি');
        } finally {
            setAdding(null);
            if (addInput.current) addInput.current.value = '';
        }
    };
    const fitRow = async (row) => {
        const widths = await Promise.all(m.gallery.rows[row].columns.map((col) => autoWidth(col.items, rowH)));
        update((c) => { c.gallery.rows[row].columns.forEach((col, i) => { col.w = widths[i]; }); return c; });
        toast.success('ছবির মাপ অনুযায়ী চওড়া ঠিক করা হয়েছে');
    };
    const moveCol = (dir) => {
        const { row, col } = sel; const j = col + dir;
        if (j < 0 || j >= m.gallery.rows[row].columns.length) return;
        update((c) => { const cols = c.gallery.rows[row].columns; [cols[col], cols[j]] = [cols[j], cols[col]]; return c; });
        setSel({ row, col: j });
    };
    const moveColToRow = (to) => {
        const { row, col } = sel;
        const emptied = m.gallery.rows[row].columns.length === 1;
        update((c) => {
            const [moved] = c.gallery.rows[row].columns.splice(col, 1);
            c.gallery.rows[to].columns.unshift(moved);
            if (!c.gallery.rows[row].columns.length) c.gallery.rows.splice(row, 1);
            return c;
        });
        setSel({ row: emptied && row < to ? to - 1 : to, col: 0 });
    };
    const removeCol = () => {
        if (!confirm('এই কলামটা গ্যালারি থেকে সরাবেন?')) return;
        const { row, col } = sel;
        const rowGone = m.gallery.rows[row].columns.length === 1 && m.gallery.rows.length > 1;
        update((c) => {
            const cols = c.gallery.rows[row].columns;
            cols.splice(col, 1);
            if (!cols.length) {
                if (c.gallery.rows.length > 1) c.gallery.rows.splice(row, 1);
                else cols.push(structuredClone(DEF.gallery.rows[0].columns[0]));
            }
            return c;
        });
        setSel({ row: rowGone ? Math.max(0, row - 1) : row, col: Math.max(0, col - 1) });
    };
    const removePhoto = (k) => update((c) => {
        const col = c.gallery.rows[sel.row].columns[sel.col];
        col.items.splice(k, 1);
        return c;
    });
    const onSecondPhoto = async (files) => {
        try {
            const [u] = await uploadImages(files);
            if (!u) return;
            update((c) => {
                const col = c.gallery.rows[sel.row].columns[sel.col];
                col.items.push({ src: u, full: u, label: '', labelBn: '', pos: '50% 50%' });
                return c;
            });
        } catch (e) {
            toast.error(e.message || 'আপলোড হয়নি');
        } finally {
            if (secondInput.current) secondInput.current.value = '';
        }
    };

    const selCol = m.gallery.rows[sel.row]?.columns[sel.col] || null;
    const galleryCount = useMemo(() => m.gallery.rows.reduce((n, r) => n + r.columns.reduce((k, c) => k + c.items.length, 0), 0), [m.gallery]);

    // ---- look ----
    const cx = {
        card: isDark ? 'bg-slate-900/60 border-slate-700/70' : 'bg-white border-slate-200',
        border: isDark ? 'border-slate-700/70' : 'border-slate-200',
        strong: isDark ? 'text-white' : 'text-slate-900',
        text: isDark ? 'text-slate-200' : 'text-slate-700',
        muted: isDark ? 'text-slate-400' : 'text-slate-500',
        input: isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-800',
        ghost: isDark ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-50',
        soft: isDark ? 'bg-slate-800/60' : 'bg-slate-50',
    };
    const ghostBtn = `inline-flex h-10 items-center gap-2 rounded-lg border px-4 text-sm font-semibold transition disabled:opacity-50 ${cx.ghost}`;
    const smallBtn = `inline-flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-xs font-semibold transition disabled:opacity-40 ${cx.ghost}`;
    const input = `h-9 w-full rounded-md border px-2.5 text-sm outline-none focus:border-[#FD9A00] ${cx.input}`;

    if (loading) return <div className={`py-24 text-center ${cx.muted}`}><FiLoader className="mx-auto mb-3 animate-spin" size={24} /> লোড হচ্ছে…</div>;

    return (
        <div className="w-full space-y-5 pb-4">
            <input ref={addInput} type="file" accept="image/*" multiple className="hidden" onChange={(e) => onAddFiles(e.target.files)} />
            <input ref={secondInput} type="file" accept="image/*" className="hidden" onChange={(e) => onSecondPhoto(e.target.files)} />

            {/* header */}
            <div className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border px-5 py-4 ${cx.card}`}>
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/admin/design/home" className={`grid h-10 w-10 place-items-center rounded-lg border ${cx.border} ${cx.text}`} aria-label="Back"><FiArrowLeft size={18} /></Link>
                    <div>
                        <h1 className={`text-xl font-bold ${cx.strong}`}>Home page photos</h1>
                        <p className={`text-[13px] ${cx.muted}`}>
                            ছবি বদলান, ছবিতে ক্লিক করে ঠিক করুন কোন অংশ দেখা যাবে, তারপর Preview দেখে Save।
                            {savedAt ? ` শেষ সেভ: ${new Date(savedAt).toLocaleString('en-GB')}` : ' এখনো কিছু সেভ হয়নি — default ছবি চলছে।'}
                        </p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <button type="button" onClick={preview} className={ghostBtn}><FiEye size={15} /> Preview</button>
                    <button type="button" onClick={save} disabled={saving || !dirty} className="inline-flex h-10 items-center gap-2 rounded-lg px-5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50" style={{ background: BRAND }}>
                        {saving ? <FiLoader className="animate-spin" size={16} /> : <FiSave size={16} />} {saving ? 'Saving…' : dirty ? 'Save' : 'Saved'}
                    </button>
                </div>
            </div>

            {/* tabs */}
            <div className={`flex flex-wrap gap-1 rounded-xl border p-1 ${cx.card}`}>
                {TABS.map((t) => (
                    <button key={t.key} type="button" onClick={() => setTab(t.key)}
                        className={`flex-1 rounded-lg px-4 py-2.5 text-left transition ${tab === t.key ? 'text-white shadow' : `${cx.text} hover:opacity-80`}`}
                        style={tab === t.key ? { background: BRAND } : {}}>
                        <span className="block text-sm font-semibold">{t.label}</span>
                        <span className={`block text-[11px] ${tab === t.key ? 'text-white/80' : cx.muted}`}>{t.key === 'gallery' ? `${galleryCount}টা ছবি · ${t.hint}` : t.hint}</span>
                    </button>
                ))}
            </div>

            {/* ===================== HERO ===================== */}
            {tab === 'hero' && (
                <div className="space-y-5">
                    <section className={`rounded-xl border p-5 ${cx.card}`}>
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                            <div>
                                <h2 className={`font-semibold ${cx.strong}`}>বড় ছবি (ডানে)</h2>
                                <p className={`text-[13px] ${cx.muted}`}>একাধিক দিলে তীর চেপে বদলানো যায়। প্রথমটা আগে দেখায়। সর্বোচ্চ {LIMITS.slides}টা।</p>
                            </div>
                            <button type="button" disabled={m.hero.slides.length >= LIMITS.slides} onClick={() => update((c) => { c.hero.slides.push(structuredClone(DEF.hero.slides[0])); return c; })} className={smallBtn}><FiPlus size={13} /> ছবি যোগ</button>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {m.hero.slides.map((s, i) => (
                                <PhotoSlot key={i} cx={cx} aspect="7 / 5" value={s} fallback={DEF.hero.slides[i]} title={`Slide ${i + 1}${i === 0 ? ' · আগে দেখায়' : ''}`}
                                    onChange={(v) => update((c) => { c.hero.slides[i] = v; return c; })}>
                                    <input className={`${input} mt-2`} value={s.alt || ''} maxLength={120} onChange={(e) => update((c) => { c.hero.slides[i].alt = e.target.value; return c; })} placeholder="ছবির বর্ণনা (alt) — যেমন: আমাদের অফিসে টিম" />
                                    <div className="mt-2 flex gap-1.5">
                                        <button type="button" disabled={i === 0} onClick={() => update((c) => { [c.hero.slides[i - 1], c.hero.slides[i]] = [c.hero.slides[i], c.hero.slides[i - 1]]; return c; })} className={smallBtn}><FiChevronLeft size={13} /> আগে</button>
                                        <button type="button" disabled={i === m.hero.slides.length - 1} onClick={() => update((c) => { [c.hero.slides[i + 1], c.hero.slides[i]] = [c.hero.slides[i], c.hero.slides[i + 1]]; return c; })} className={smallBtn}>পরে <FiChevronRight size={13} /></button>
                                        <button type="button" disabled={m.hero.slides.length <= 1} onClick={() => update((c) => { c.hero.slides.splice(i, 1); return c; })} className={`${smallBtn} ml-auto text-rose-500`}><FiTrash2 size={13} /></button>
                                    </div>
                                </PhotoSlot>
                            ))}
                        </div>
                    </section>
                    <section className={`rounded-xl border p-5 ${cx.card}`}>
                        <h2 className={`font-semibold ${cx.strong}`}>পেছনের ছবি (লেখার পেছনে)</h2>
                        <p className={`mb-4 text-[13px] ${cx.muted}`}>লেখা পড়তে সুবিধার জন্য উপরে কালো আস্তরণ থাকে — কম-বেশি করতে পারেন।</p>
                        <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
                            <PhotoSlot cx={cx} aspect="2 / 1" focus={false} overlay={m.hero.overlay} value={{ src: m.hero.background, pos: '50% 50%' }} fallback={{ src: DEF.hero.background, pos: '50% 50%' }}
                                onChange={(v) => update((c) => { c.hero.background = v.src; return c; })} />
                            <div className={`rounded-xl border p-4 ${cx.card}`}>
                                <label className={`text-sm font-semibold ${cx.strong}`}>Overlay (কালো আস্তরণ)</label>
                                <div className="mt-3 flex items-center gap-3">
                                    <input type="range" min="0" max={LIMITS.overlayMax} value={m.hero.overlay} onChange={(e) => update((c) => { c.hero.overlay = Number(e.target.value); return c; })} className="flex-1 accent-[#FD9A00]" />
                                    <span className={`w-12 text-right text-sm font-semibold tabular-nums ${cx.strong}`}>{m.hero.overlay}%</span>
                                </div>
                                <p className={`mt-2 text-xs ${cx.muted}`}>০% = শুধু ছবি · ৫০%+ = লেখা বেশি স্পষ্ট</p>
                            </div>
                        </div>
                    </section>
                </div>
            )}

            {/* ===================== SERVICES / ROADMAP ===================== */}
            {(tab === 'services' || tab === 'roadmap') && (
                <section className={`rounded-xl border p-5 ${cx.card}`}>
                    <h2 className={`font-semibold ${cx.strong}`}>{tab === 'services' ? 'Services That Power Your Digital Growth' : 'Growth roadmap — কোলাজ'}</h2>
                    <p className={`mb-4 text-[13px] ${cx.muted}`}>প্রতিটা ঘর সাইটের মাপেই দেখানো হচ্ছে। ছবিতে ক্লিক করে মুখ / মূল জিনিসটা মাঝখানে আনুন।</p>
                    <div className={`grid gap-4 ${tab === 'services' ? 'lg:grid-cols-[1fr_1.85fr_1fr]' : 'md:grid-cols-3'}`}>
                        {m[tab].map((s, i) => (
                            <PhotoSlot key={i} cx={cx} value={s} fallback={DEF[tab][i]}
                                aspect={tab === 'services' ? SERVICE_ASPECT[i] : ROADMAP_ASPECT[i]}
                                title={tab === 'services' ? SERVICE_NAMES[i] : ROADMAP_NAMES[i]}
                                onChange={(v) => update((c) => { c[tab][i] = { src: v.src, pos: v.pos }; return c; })} />
                        ))}
                    </div>
                </section>
            )}

            {/* ===================== GALLERY ===================== */}
            {tab === 'gallery' && (
                <div className="space-y-5">
                    <section className={`flex flex-wrap items-center gap-x-6 gap-y-3 rounded-xl border p-5 ${cx.card}`}>
                        <div className="min-w-[240px] flex-1">
                            <label className={`text-sm font-semibold ${cx.strong}`}>সারির উচ্চতা (ছবির সাইজ)</label>
                            <div className="mt-2 flex items-center gap-3">
                                <input type="range" min={LIMITS.rowMin} max={LIMITS.rowMax} step="10" value={rowH} onChange={(e) => update((c) => { c.gallery.rowHeight = Number(e.target.value); return c; })} className="flex-1 accent-[#FD9A00]" />
                                <span className={`w-16 text-right text-sm font-semibold tabular-nums ${cx.strong}`}>{rowH}px</span>
                            </div>
                        </div>
                        <p className={`max-w-xl text-[13px] leading-relaxed ${cx.muted}`}>
                            প্রতিটা সারি পাশাপাশি চলতে থাকে (১ম বাঁয়ে, ২য় ডানে)। একটা কলামে ১টা লম্বা ছবি বা ২টা উপর-নিচে।
                            নিচের প্রিভিউতে কলামে ক্লিক করে চওড়া, ক্রম আর ছবি বদলান। <b>Auto-fit</b> চাপলে প্রতিটা ছবির মাপ অনুযায়ী চওড়া ঠিক হয় — ছবি কম কাটে।
                        </p>
                        <button type="button" onClick={resetTab} className={smallBtn}><FiRotateCcw size={13} /> Default গ্যালারি</button>
                    </section>

                    {m.gallery.rows.map((row, ri) => {
                        const S = 0.42; // preview scale
                        return (
                            <section key={ri} className={`rounded-xl border ${cx.card}`}>
                                <div className={`flex flex-wrap items-center justify-between gap-2 border-b px-5 py-3 ${cx.border}`}>
                                    <h3 className={`text-sm font-semibold ${cx.strong}`}>
                                        সারি {ri + 1} <span className={`font-normal ${cx.muted}`}>· {ri % 2 ? 'ডানে চলে' : 'বাঁয়ে চলে'} · {row.columns.length} কলাম</span>
                                    </h3>
                                    <div className="flex flex-wrap gap-1.5">
                                        <button type="button" onClick={() => startAdd(ri)} disabled={adding !== null} className={smallBtn}>{adding === ri ? <FiLoader className="animate-spin" size={13} /> : <FiPlus size={13} />} ছবি যোগ</button>
                                        <button type="button" onClick={() => fitRow(ri)} className={smallBtn}><FiMaximize2 size={13} /> Auto-fit</button>
                                        {m.gallery.rows.length > 1 && (
                                            <button type="button" onClick={() => { if (confirm(`সারি ${ri + 1} পুরোটা সরাবেন?`)) { update((c) => { c.gallery.rows.splice(ri, 1); return c; }); setSel({ row: 0, col: 0 }); } }} className={`${smallBtn} text-rose-500`}><FiTrash2 size={13} /></button>
                                        )}
                                    </div>
                                </div>
                                {/* the row exactly as on the site, scaled down */}
                                <div className="overflow-x-auto px-5 py-4">
                                    <div className="flex w-max items-start" style={{ gap: GAP * S }}>
                                        {row.columns.map((col, ci) => {
                                            const on = sel.row === ri && sel.col === ci;
                                            return (
                                                <button key={ci} type="button" onClick={() => setSel({ row: ri, col: ci })}
                                                    className={`flex shrink-0 flex-col rounded-[10px] outline-none transition ${on ? 'ring-[3px] ring-[#FD9A00] ring-offset-2' : 'hover:opacity-85'} ${isDark ? 'ring-offset-slate-900' : 'ring-offset-white'}`}
                                                    style={{ width: col.w * S, height: rowH * S, gap: GAP * S }}
                                                    aria-label={`Column ${ci + 1}`}>
                                                    {col.items.map((it, k) => (
                                                        <span key={k} className="relative block min-h-0 w-full flex-1 overflow-hidden rounded-[8px] bg-slate-800">
                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                            <img src={it.src} alt="" draggable={false} className="h-full w-full object-cover" style={{ objectPosition: it.pos }} />
                                                        </span>
                                                    ))}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* the selected column */}
                                {sel.row === ri && selCol && (
                                    <div className={`border-t px-5 py-4 ${cx.border} ${cx.soft}`}>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className={`mr-auto text-sm font-semibold ${cx.strong}`}>কলাম {sel.col + 1} <span className={`font-normal ${cx.muted}`}>· {selCol.items.length === 2 ? '২টা ছবি উপর-নিচে' : '১টা লম্বা ছবি'}</span></p>
                                            <button type="button" onClick={() => moveCol(-1)} disabled={sel.col === 0} className={smallBtn}><FiChevronLeft size={13} /> বাঁয়ে</button>
                                            <button type="button" onClick={() => moveCol(1)} disabled={sel.col === row.columns.length - 1} className={smallBtn}>ডানে <FiChevronRight size={13} /></button>
                                            {m.gallery.rows.map((_, to) => to !== ri && (
                                                <button key={to} type="button" onClick={() => moveColToRow(to)} className={smallBtn}>{to < ri ? <FiChevronUp size={13} /> : <FiChevronDown size={13} />} সারি {to + 1}-এ</button>
                                            ))}
                                            <button type="button" onClick={removeCol} className={`${smallBtn} text-rose-500`}><FiTrash2 size={13} /> কলাম সরান</button>
                                        </div>
                                        <div className="mt-3 flex flex-wrap items-center gap-3">
                                            <label className={`text-sm ${cx.text}`}>চওড়া</label>
                                            <input type="range" min={LIMITS.colMin} max={LIMITS.colMax} step="5" value={selCol.w} onChange={(e) => update((c) => { c.gallery.rows[sel.row].columns[sel.col].w = Number(e.target.value); return c; })} className="w-64 accent-[#FD9A00]" />
                                            <span className={`w-14 text-sm font-semibold tabular-nums ${cx.strong}`}>{selCol.w}px</span>
                                            <button type="button" onClick={async () => { const w = await autoWidth(selCol.items, rowH); update((c) => { c.gallery.rows[sel.row].columns[sel.col].w = w; return c; }); }} className={smallBtn}><FiMaximize2 size={13} /> ছবির মাপে</button>
                                            {selCol.items.length === 1 && (
                                                <button type="button" onClick={() => secondInput.current?.click()} className={smallBtn}><FiPlus size={13} /> নিচে আরেকটা ছবি (২টা উপর-নিচে)</button>
                                            )}
                                        </div>
                                        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                            {selCol.items.map((it, k) => (
                                                <PhotoSlot key={`${sel.col}-${k}-${it.src}`} cx={cx} compact value={it}
                                                    aspect={`${selCol.w} / ${selCol.items.length === 2 ? (rowH - GAP) / 2 : rowH}`}
                                                    title={selCol.items.length === 2 ? (k === 0 ? 'উপরের ছবি' : 'নিচের ছবি') : 'ছবি'}
                                                    onChange={(v) => update((c) => { c.gallery.rows[sel.row].columns[sel.col].items[k] = { ...it, ...v }; return c; })}>
                                                    <div className="mt-2 grid grid-cols-2 gap-1.5">
                                                        <input className={input} value={it.label || ''} maxLength={120} placeholder="Label (English)" onChange={(e) => update((c) => { c.gallery.rows[sel.row].columns[sel.col].items[k].label = e.target.value; return c; })} />
                                                        <input className={input} value={it.labelBn || ''} maxLength={120} placeholder="লেবেল (বাংলা)" onChange={(e) => update((c) => { c.gallery.rows[sel.row].columns[sel.col].items[k].labelBn = e.target.value; return c; })} />
                                                    </div>
                                                    {selCol.items.length === 2 && (
                                                        <button type="button" onClick={() => removePhoto(k)} className={`${smallBtn} mt-2 text-rose-500`}><FiX size={13} /> এই ছবিটা সরান</button>
                                                    )}
                                                </PhotoSlot>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </section>
                        );
                    })}

                    {m.gallery.rows.length < LIMITS.rows && (
                        <button type="button" onClick={() => { update((c) => { c.gallery.rows.push({ columns: [structuredClone(DEF.gallery.rows[0].columns[0])] }); return c; }); }} className={`${ghostBtn} w-full justify-center border-dashed`}>
                            <FiPlus size={15} /> নতুন সারি যোগ করুন
                        </button>
                    )}
                </div>
            )}

            {tab !== 'gallery' && (
                <div className="flex justify-end">
                    <button type="button" onClick={resetTab} className={smallBtn}><FiRotateCcw size={13} /> এই অংশ default-এ ফেরত</button>
                </div>
            )}

            {/* bottom bar */}
            <div className={`sticky bottom-0 z-10 flex items-center justify-between gap-3 rounded-xl border px-5 py-3 backdrop-blur ${isDark ? 'bg-slate-900/90 border-slate-700/70' : 'bg-white/95 border-slate-200'}`}>
                <p className={`flex items-center gap-2 text-[13px] ${dirty ? 'text-amber-600' : cx.muted}`}><FiImage size={14} /> {dirty ? 'সেভ না করা বদল আছে' : 'সব সেভ করা আছে'}</p>
                <div className="flex gap-2">
                    <button type="button" onClick={preview} className={ghostBtn}><FiEye size={15} /> Preview</button>
                    <button type="button" onClick={save} disabled={saving || !dirty} className="inline-flex h-10 items-center gap-2 rounded-lg px-5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50" style={{ background: BRAND }}>
                        {saving ? <FiLoader className="animate-spin" size={16} /> : <FiSave size={16} />} {saving ? 'Saving…' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    );
}

