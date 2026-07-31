// PDF ব্র্যান্ড হেল্পার — Money Receipt ও Bill/Quotation এ একই BRAND রং, কন্ট্যাক্ট লাইন ও money() ফরম্যাট।
// নোট: PDF এখন HTML প্রিভিউ থেকে ছবি বানিয়ে তৈরি হয় (@/lib/pdfCapture), তাই বাংলা render হয়।
// currency আপাতত "Tk" রাখা হলো (চাইলে '৳' এ বদলানো যাবে — এখন Unicode সাপোর্ট করে)।

export const BRAND = '#FD9A00';
export const CONTACT_LINE = '+880 1711-946614   |   info.extrainweb@gmail.com   |   extrainweb.com';
export const money = (n) => 'Tk ' + Number(n || 0).toLocaleString('en-US');

// public/extrain-logo.png কে PNG dataURL হিসেবে লোড (PDF এ বসানোর জন্য)
export function loadLogo() {
    return new Promise((resolve) => {
        try {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.naturalWidth;
                    canvas.height = img.naturalHeight;
                    canvas.getContext('2d').drawImage(img, 0, 0);
                    resolve({ dataUrl: canvas.toDataURL('image/png'), w: img.naturalWidth, h: img.naturalHeight });
                } catch { resolve(null); }
            };
            img.onerror = () => resolve(null);
            img.src = '/extrain-logo.png';
        } catch { resolve(null); }
    });
}

// হালকা লোগো জলছাপ (anti-copy) — সব কন্টেন্ট আঁকা শেষে ডাকতে হবে, যাতে uniform থাকে ও কাটে না
export function drawWatermark(doc, logo) {
    if (!logo || !logo.w || !logo.h) return;
    try {
        const W = doc.internal.pageSize.getWidth();
        const H = doc.internal.pageSize.getHeight();
        const ww = Math.min(W * 0.68, 380);
        const wh = ww * (logo.h / logo.w);
        doc.saveGraphicsState();
        doc.setGState(new doc.GState({ opacity: 0.05 }));
        doc.addImage(logo.dataUrl, 'PNG', (W - ww) / 2, (H - wh) / 2, ww, wh);
        doc.restoreGraphicsState();
    } catch { /* GState না থাকলে watermark skip */ }
}
