'use client';

// WYSIWYG PDF হেল্পার — Money Receipt / Bill এর React প্রিভিউকেই হুবহু PDF বানায়।
// কেন: jsPDF এর Poppins/Helvetica ফন্টে বাংলা glyph নেই, আর jsPDF complex-script
// shaping (ই/ে-কার, যুক্তাক্ষর সাজানো) পারে না — তাই বাংলা লেখা PDF এ ফাঁকা/ভাঙা আসত।
// সমাধান: প্রিভিউ HTML কে অফস্ক্রিনে রেন্ডার করে ব্রাউজার দিয়েই ছবি বানাই (ব্রাউজার বাংলা
// ঠিকঠাক shape করে), তারপর সেই ছবি A4 পেজে বসাই — বাংলা ও ৳ দুটোই নিখুঁত আসে।

import { jsPDF } from 'jspdf';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';

// A4 @ ~96dpi ≈ 794 × 1123 px — এই প্রস্থে রেন্ডার করলে ছবিটা এক পেজের মাপে বসে
const PAGE_W_PX = 794;

// একটি React element কে অফস্ক্রিনে রেন্ডার → ছবি → A4 jsPDF doc (return)
export async function reactToPdf(element, { widthPx = PAGE_W_PX, scale = 2, marginPt = 24 } = {}) {
    // html2canvas-pro: Tailwind v4 এর oklch() রং সাপোর্ট করে (আসল html2canvas পারে না)
    const { default: html2canvas } = await import('html2canvas-pro');

    // স্ক্রিনের বাইরে (কিন্তু display:none নয় — নাহলে layout তৈরি হয় না) একটা holder
    const holder = document.createElement('div');
    holder.style.cssText =
        `position:fixed;left:-100000px;top:0;width:${widthPx}px;` +
        `background:#ffffff;margin:0;padding:0;z-index:-1;pointer-events:none;`;
    document.body.appendChild(holder);

    const root = createRoot(holder);
    try {
        // flushSync — ছবি তোলার আগেই যেন DOM/layout সিঙ্ক্রোনাসলি তৈরি হয়ে যায়
        flushSync(() => root.render(element));

        // ওয়েবফন্ট (Poppins/Hind Siliguri) ও ইমেজ (লোগো, জলছাপ) লোড হওয়া পর্যন্ত অপেক্ষা
        if (document.fonts?.ready) {
            try { await document.fonts.ready; } catch { /* উপেক্ষা */ }
        }
        await Promise.all(
            Array.from(holder.querySelectorAll('img')).map((img) =>
                img.complete && img.naturalWidth
                    ? Promise.resolve()
                    : new Promise((res) => { img.onload = img.onerror = res; })
            )
        );

        const canvas = await html2canvas(holder, {
            scale,
            backgroundColor: '#ffffff',
            useCORS: true,
            logging: false,
            windowWidth: widthPx,
        });

        return canvasToA4Pdf(canvas, marginPt);
    } finally {
        root.unmount();
        holder.remove();
    }
}

// লম্বা ক্যানভাসকে A4 পেজে margin সহ টুকরো করে বসায় (বড় রিসিট হলে একাধিক পেজ)
function canvasToA4Pdf(canvas, marginPt) {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const imgW = pageW - marginPt * 2;
    const pxPerPt = canvas.width / imgW;                       // ক্যানভাস px ↔ pdf pt
    const sliceHpx = Math.max(1, Math.floor((pageH - marginPt * 2) * pxPerPt)); // প্রতি পেজে px

    let sy = 0;
    let page = 0;
    while (sy < canvas.height) {
        const hpx = Math.min(sliceHpx, canvas.height - sy);
        const slice = document.createElement('canvas');
        slice.width = canvas.width;
        slice.height = hpx;
        slice.getContext('2d').drawImage(canvas, 0, sy, canvas.width, hpx, 0, 0, canvas.width, hpx);

        if (page > 0) doc.addPage();
        // PNG — সাদা ব্যাকগ্রাউন্ডে টেক্সটের কিনারা তীক্ষ্ণ থাকে (JPEG এ ringing হয়)
        doc.addImage(slice.toDataURL('image/png'), 'PNG', marginPt, marginPt, imgW, hpx / pxPerPt);
        sy += hpx;
        page += 1;
    }
    return doc;
}
