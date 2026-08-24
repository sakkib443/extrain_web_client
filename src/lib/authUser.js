'use client';

// localStorage-এ লগইন user নিরাপদে রাখা/পড়ার হেল্পার।
// সমস্যা: JSON.stringify(undefined) === undefined → setItem সেটাকে "undefined" স্ট্রিং বানিয়ে রাখে;
// পরে JSON.parse("undefined") throw করে → পুরো পেজ "Application error" এ ক্র্যাশ করতে পারে।
// এখানে লেখার সময় খারাপ ভ্যালু আটকাই, আর পড়ার সময় নিরাপদে parse করি (poisoned হলে মুছে দিই)।

export function setStoredUser(user) {
    try {
        if (user && typeof user === 'object') {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user'); // undefined/null হলে key-ই রাখি না
        }
    } catch { /* ignore */ }
}

export function getStoredUser() {
    try {
        const raw = localStorage.getItem('user');
        if (!raw || raw === 'undefined' || raw === 'null') return null;
        return JSON.parse(raw);
    } catch {
        try { localStorage.removeItem('user'); } catch { /* ignore */ } // poisoned হলে সরিয়ে দিই
        return null;
    }
}
