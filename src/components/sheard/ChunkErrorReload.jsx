'use client';

import { useEffect } from 'react';

// নতুন deploy-এর পরপর: পুরনো cache-এর ব্রাউজার নতুন build-এর JS/CSS chunk খুঁজে না পেলে
// "ChunkLoadError / Loading chunk failed" throw হয় → Next.js পুরো পেজে "Application error:
// a client-side exception has occurred..." দেখায়। এখানে সেই এররটা ধরে সেশনে একবার hard-reload
// করি — নতুন build লোড হয়ে সমস্যা মিটে যায়। reload-loop এড়াতে প্রতি সেশনে সর্বোচ্চ একবার।

const CHUNK_RE = /ChunkLoadError|Loading chunk [\w-]+ failed|Loading CSS chunk|Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed/i;

function reloadOnce() {
    try {
        if (sessionStorage.getItem('__chunkReloaded')) return; // এই সেশনে একবারই
        sessionStorage.setItem('__chunkReloaded', '1');
    } catch { /* sessionStorage না থাকলেও reload করব */ }
    window.location.reload();
}

export default function ChunkErrorReload() {
    useEffect(() => {
        const isChunkError = (msg) => typeof msg === 'string' && CHUNK_RE.test(msg);
        const onError = (e) => {
            const msg = (e && (e.message || (e.error && e.error.message))) || '';
            if (isChunkError(msg)) reloadOnce();
        };
        const onRejection = (e) => {
            const r = e && e.reason;
            const msg = (r && (r.message || (typeof r === 'string' ? r : ''))) || '';
            if (isChunkError(msg)) reloadOnce();
        };
        window.addEventListener('error', onError);
        window.addEventListener('unhandledrejection', onRejection);
        return () => {
            window.removeEventListener('error', onError);
            window.removeEventListener('unhandledrejection', onRejection);
        };
    }, []);
    return null;
}
