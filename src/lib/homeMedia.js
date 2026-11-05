// ===================================================================
// Home page photos: what the admin saved, laid over the built-in defaults.
// Anything missing or malformed in the saved copy falls back to the default for that spot,
// so a half-filled save can never leave a hole on the home page.
// ===================================================================

import { DEFAULT_HOME_MEDIA } from "@/data/homeMedia";

export const HOME_MEDIA_KEY = "home-media";
export const HOME_MEDIA_PREVIEW_KEY = "home-media-preview"; // unsaved changes, read by /?preview=home-media (same browser only)

export const LIMITS = { slides: 6, rows: 3, columns: 30, rowMin: 220, rowMax: 480, colMin: 120, colMax: 800, overlayMax: 90 };

// a picture address: https://… or a file of this site (/… but not //other-host) — nothing that could break out of a url('…')
export const okSrc = (s) => typeof s === "string" && s.length <= 1000 && /^(https?:\/\/[^\s"'<>\\]+|\/(?!\/)[^\s"'<>\\]*)$/.test(s);
// focal point, e.g. "50% 25%"
export const okPos = (p) => typeof p === "string" && /^(100|\d{1,2}(\.\d{1,2})?)% (100|\d{1,2}(\.\d{1,2})?)%$/.test(p);
const text = (v, max = 120) => (typeof v === "string" ? v.slice(0, max) : "");
// a number inside the allowed range, otherwise the default (a corrupted value never turns into an extreme one)
const clamp = (n, lo, hi, fallback) => {
    const v = Math.round(Number(n));
    return n !== null && n !== "" && Number.isFinite(v) && v >= lo && v <= hi ? v : fallback;
};

const cleanPhoto = (x, fallback = {}) => {
    if (!x || !okSrc(x.src)) return null;
    return {
        src: x.src,
        full: okSrc(x.full) ? x.full : x.src,
        label: text(x.label) || fallback.label || "",
        labelBn: text(x.labelBn) || fallback.labelBn || "",
        alt: text(x.alt) || fallback.alt || "",
        pos: okPos(x.pos) ? x.pos : fallback.pos || "50% 50%",
    };
};

const cleanSlots = (saved, defaults) =>
    defaults.map((d, i) => {
        const s = Array.isArray(saved) ? saved[i] : null;
        return s && okSrc(s.src) ? { src: s.src, pos: okPos(s.pos) ? s.pos : d.pos } : d;
    });

const cleanRows = (rows) =>
    (Array.isArray(rows) ? rows : [])
        .slice(0, LIMITS.rows)
        .map((r) => ({
            columns: (Array.isArray(r?.columns) ? r.columns : [])
                .slice(0, LIMITS.columns)
                .map((c) => ({
                    w: clamp(c?.w, LIMITS.colMin, LIMITS.colMax, 300),
                    items: (Array.isArray(c?.items) ? c.items : []).slice(0, 2).map((x) => cleanPhoto(x)).filter(Boolean),
                }))
                .filter((c) => c.items.length > 0),
        }))
        .filter((r) => r.columns.length > 0);

export function mergeHomeMedia(saved) {
    const d = DEFAULT_HOME_MEDIA;
    const s = saved && typeof saved === "object" ? saved : {};
    const slides = (Array.isArray(s.hero?.slides) ? s.hero.slides : []).slice(0, LIMITS.slides).map((x) => cleanPhoto(x)).filter(Boolean);
    const rows = cleanRows(s.gallery?.rows);
    return {
        hero: {
            slides: slides.length ? slides : d.hero.slides.map((x) => cleanPhoto(x)),
            background: okSrc(s.hero?.background) ? s.hero.background : d.hero.background,
            overlay: clamp(s.hero?.overlay, 0, LIMITS.overlayMax, d.hero.overlay),
        },
        services: cleanSlots(s.services, d.services),
        roadmap: cleanSlots(s.roadmap, d.roadmap),
        gallery: {
            rowHeight: clamp(s.gallery?.rowHeight, LIMITS.rowMin, LIMITS.rowMax, d.gallery.rowHeight),
            rows: rows.length ? rows : cleanRows(d.gallery.rows),
        },
    };
}

// server side (the home page is rendered with the saved photos, refreshed every minute)
export async function fetchHomeMedia(apiBase) {
    try {
        const res = await fetch(`${apiBase}/site-content/${HOME_MEDIA_KEY}`, {
            next: { revalidate: 60 },
            signal: AbortSignal.timeout(4000),
        });
        if (!res.ok) return null;
        const json = await res.json();
        return json?.data || null;
    } catch {
        return null;
    }
}
