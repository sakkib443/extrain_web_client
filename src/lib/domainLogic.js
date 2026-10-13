// ===================================================================
// Domain & Hosting — pure logic (no React, no network) so it can be tested on its own.
//
// Money model (the server stores raw values, everything below is derived):
//   revenue = sellPrice + Σ renewals.sellPrice
//   cost    = buyPrice  + Σ renewals.buyPrice
//   profit  = revenue − cost
//   paid    = clientPaid            (total received; the payments ledger explains it)
//   due     = max(0, revenue − paid)
//
// Dates are plain days ("2026-10-14" keys). Stored dates are UTC-midnight values, so a key is the first 10
// characters of the ISO string, and "today" is the visitor's own local day.
// ===================================================================

export const TYPE_LABEL = { domain: 'Domain', hosting: 'Hosting', both: 'Domain + Hosting' };
export const METHODS = ['Cash', 'bKash', 'Nagad', 'Rocket', 'Bank', 'Card', 'Other'];
export const CYCLES = [
    { months: 1, label: '1 month' },
    { months: 3, label: '3 months' },
    { months: 6, label: '6 months' },
    { months: 12, label: '1 year' },
    { months: 24, label: '2 years' },
    { months: 36, label: '3 years' },
    { months: 60, label: '5 years' },
];
export const PROVIDERS = ['Namecheap', 'GoDaddy', 'Hostinger', 'Cloudflare', 'Hetzner', 'Contabo', 'DigitalOcean', 'Vultr', 'Name.com', 'cPanel Reseller', 'BTCL / .bd Registry', 'Own server'];

export const STATE = {
    active: { label: 'Active', cls: 'bg-emerald-100 text-emerald-700 border-emerald-200', dark: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', dot: 'bg-emerald-500' },
    expiring: { label: 'Expiring', cls: 'bg-amber-100 text-amber-700 border-amber-200', dark: 'bg-amber-500/15 text-amber-300 border-amber-500/30', dot: 'bg-amber-500' },
    expired: { label: 'Expired', cls: 'bg-rose-100 text-rose-700 border-rose-200', dark: 'bg-rose-500/15 text-rose-300 border-rose-500/30', dot: 'bg-rose-500' },
    suspended: { label: 'Suspended', cls: 'bg-violet-100 text-violet-700 border-violet-200', dark: 'bg-violet-500/15 text-violet-300 border-violet-500/30', dot: 'bg-violet-500' },
    cancelled: { label: 'Cancelled', cls: 'bg-slate-100 text-slate-600 border-slate-200', dark: 'bg-slate-500/20 text-slate-300 border-slate-500/30', dot: 'bg-slate-400' },
    nodate: { label: 'No expiry date', cls: 'bg-sky-100 text-sky-700 border-sky-200', dark: 'bg-sky-500/15 text-sky-300 border-sky-500/30', dot: 'bg-sky-500' },
};

export const EXPIRING_DAYS = 30;

// ---------------------------------------------------------------
// Dates
// ---------------------------------------------------------------
const pad = (n) => String(n).padStart(2, '0');

export const dayKey = (d) => {
    if (!d) return '';
    const x = new Date(d);
    return Number.isNaN(x.getTime()) ? '' : x.toISOString().slice(0, 10);
};

export const todayKey = (now = new Date()) => `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

const utcMs = (key) => {
    const [y, m, d] = key.split('-').map(Number);
    return Date.UTC(y, m - 1, d);
};

// whole days from b to a (a − b)
export const diffDays = (aKey, bKey) => Math.round((utcMs(aKey) - utcMs(bKey)) / 86400000);

// + months, end-of-month safe (31 Jan + 1 month = 28/29 Feb) — the same rule as the server
export const addMonthsKey = (key, months) => {
    const [y, m, d] = key.split('-').map(Number);
    const total = m - 1 + months;
    const ny = y + Math.floor(total / 12);
    const nm = ((total % 12) + 12) % 12;
    const last = new Date(Date.UTC(ny, nm + 1, 0)).getUTCDate();
    return `${ny}-${pad(nm + 1)}-${pad(Math.min(d, last))}`;
};

export const addDaysKey = (key, days) => {
    const t = new Date(utcMs(key) + days * 86400000);
    return `${t.getUTCFullYear()}-${pad(t.getUTCMonth() + 1)}-${pad(t.getUTCDate())}`;
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const FULL_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// 2026-10-14 → 14 Oct 2026
export const fmtKey = (key) => {
    if (!key) return '—';
    const [y, m, d] = key.split('-').map(Number);
    return `${pad(d)} ${MONTHS[m - 1]} ${y}`;
};
export const monthName = (key) => (key ? `${FULL_MONTHS[Number(key.slice(5, 7)) - 1]} ${key.slice(0, 4)}` : '');
export const monthShort = (key) => `${MONTHS[Number(key.slice(5, 7)) - 1]} ${key.slice(2, 4)}`;

// "in 5 days" / "Today" / "3 days ago"
export const relDays = (n) => {
    if (n === null || n === undefined) return '—';
    if (n === 0) return 'Today';
    const a = Math.abs(n);
    const u = a === 1 ? 'day' : 'days';
    return n > 0 ? `in ${a} ${u}` : `${a} ${u} ago`;
};

export const taka = (n) => '৳' + Number(n || 0).toLocaleString('en-BD', { maximumFractionDigits: 0 });

// ---------------------------------------------------------------
// Names and phone numbers
// ---------------------------------------------------------------
const SLD = new Set(['com', 'org', 'net', 'edu', 'gov', 'co', 'ac', 'info', 'mil']);

// example.com.bd → .com.bd, shop.example.com → .com, "Shop Hosting 10GB" → ''
export const tldOf = (name) => {
    const n = String(name || '').trim().toLowerCase();
    if (!n || /\s/.test(n) || !n.includes('.')) return '';
    const parts = n.split('.').filter(Boolean);
    if (parts.length < 2) return '';
    const last = parts[parts.length - 1];
    if (parts.length >= 3 && last.length === 2 && SLD.has(parts[parts.length - 2])) return `.${parts[parts.length - 2]}.${last}`;
    return `.${last}`;
};

// 01711-946614 / +880 1711 946614 / 1711946614 → 8801711946614 (WhatsApp wants the country code, no plus)
export const waNumber = (phone) => {
    const d = String(phone || '').replace(/\D/g, '');
    if (!d) return '';
    if (d.startsWith('880')) return d;
    if (d.startsWith('0')) return '88' + d;
    if (d.length === 10 && d.startsWith('1')) return '880' + d;
    return d;
};

export const waLink = (phone, text) => {
    const n = waNumber(phone);
    return n ? `https://wa.me/${n}?text=${encodeURIComponent(text || '')}` : '';
};

// ---------------------------------------------------------------
// One record → everything the screens need
// ---------------------------------------------------------------
export const decorate = (d, today = todayKey()) => {
    const renewals = d.renewals || [];
    const payments = d.payments || [];
    const type = d.type || 'domain';

    const renewSell = renewals.reduce((s, r) => s + (Number(r.sellPrice) || 0), 0);
    const renewBuy = renewals.reduce((s, r) => s + (Number(r.buyPrice) || 0), 0);
    const revenue = (Number(d.sellPrice) || 0) + renewSell;
    const cost = (Number(d.buyPrice) || 0) + renewBuy;
    const paid = Number(d.clientPaid) || 0;
    const due = Math.max(0, revenue - paid);

    const expiry = dayKey(d.expiryDate);
    const daysLeft = expiry ? diffDays(expiry, today) : null;
    const nextPay = dayKey(d.nextPaymentDate);
    const dueKey = nextPay || expiry; // the day money is expected
    const dueIn = dueKey ? diffDays(dueKey, today) : null;

    const status = d.status || 'active';
    let state = status;
    if (status === 'active') state = !expiry ? 'nodate' : daysLeft < 0 ? 'expired' : daysLeft <= EXPIRING_DAYS ? 'expiring' : 'active';

    const lastRenewal = renewals.length ? renewals[renewals.length - 1] : null;
    const renewPrice = d.renewalSellPrice ?? lastRenewal?.sellPrice ?? d.sellPrice ?? 0;
    const renewCost = d.renewalBuyPrice ?? lastRenewal?.buyPrice ?? d.buyPrice ?? 0;

    const project = d.project || null;
    const owner = d.owner || project?.clientName || '';
    const phone = d.ownerPhone || project?.phone || '';
    const email = d.ownerEmail || project?.email || '';
    const purchase = dayKey(d.purchaseDate);

    const payStatus = revenue <= 0 ? 'free' : due <= 0 ? 'paid' : paid <= 0 ? 'unpaid' : 'partial';

    const hay = [
        d.domainName, owner, phone, email, d.linkedProjectId, d.linkedClientName, d.provider, d.hostingPlan, d.note,
        project?.clientName, project?.companyBrand, project?.phone,
    ].filter(Boolean).join(' ').toLowerCase();

    return {
        ...d,
        id: d._id,
        type,
        status,
        state,
        tld: tldOf(d.domainName),
        owner, phone, email,
        purchase, expiry, nextPay, dueKey,
        purchaseMonth: purchase.slice(0, 7),
        daysLeft, dueIn,
        revenue, cost, profit: revenue - cost, paid, due, payStatus,
        renewals, payments,
        renewalCount: renewals.length,
        lastRenewal,
        renewPrice: Number(renewPrice) || 0,
        renewCost: Number(renewCost) || 0,
        // payments typed in before the ledger existed (or edited by hand) are not in the ledger
        ledgerPaid: payments.reduce((s, p) => s + (Number(p.amount) || 0), 0),
        projectCode: d.linkedProjectId || '',
        hay,
        digits: phone.replace(/\D/g, ''),
    };
};

// ---------------------------------------------------------------
// Filters
// ---------------------------------------------------------------
export const DEFAULT_FILTERS = {
    q: '', type: 'all', state: 'all', pay: 'all', link: 'all', billing: 'all', provider: 'all', tld: 'all', auto: 'all',
    buyMonth: 'all', buyFrom: '', buyTo: '',
    expiry: 'all', expFrom: '', expTo: '',
    due: 'all', dueFrom: '', dueTo: '',
    sort: 'expiry',
};

export const EXPIRY_PRESETS = [
    { key: 'all', label: 'Any time' },
    { key: 'expired', label: 'Expired' },
    { key: '7', label: 'Next 7 days' },
    { key: '15', label: 'Next 15 days' },
    { key: '30', label: 'Next 30 days' },
    { key: '60', label: 'Next 60 days' },
    { key: '90', label: 'Next 90 days' },
    { key: 'thisMonth', label: 'This month' },
    { key: 'nextMonth', label: 'Next month' },
    { key: 'none', label: 'No expiry date' },
];

export const DUE_PRESETS = [
    { key: 'all', label: 'Any date' },
    { key: 'overdue', label: 'Overdue' },
    { key: 'today', label: 'Today' },
    { key: '7', label: 'Next 7 days' },
    { key: '15', label: 'Next 15 days' },
    { key: '30', label: 'Next 30 days' },
    { key: 'thisMonth', label: 'This month' },
    { key: 'nextMonth', label: 'Next month' },
];

export const SORTS = [
    { key: 'expiry', label: 'Expiry — soonest first' },
    { key: 'expiryDesc', label: 'Expiry — latest first' },
    { key: 'newest', label: 'Newest added' },
    { key: 'oldest', label: 'Oldest added' },
    { key: 'name', label: 'Name A → Z' },
    { key: 'due', label: 'Highest due' },
    { key: 'profit', label: 'Highest profit' },
    { key: 'revenue', label: 'Highest revenue' },
];

const monthOf = (today, add = 0) => addMonthsKey(today.slice(0, 7) + '-01', add).slice(0, 7);

const matchExpiry = (it, f, today) => {
    if (f.expFrom || f.expTo) {
        if (!it.expiry) return false;
        if (f.expFrom && it.expiry < f.expFrom) return false;
        if (f.expTo && it.expiry > f.expTo) return false;
        return true;
    }
    const p = f.expiry;
    if (p === 'all') return true;
    if (p === 'none') return !it.expiry;
    if (!it.expiry) return false;
    if (p === 'expired') return it.daysLeft < 0;
    if (p === 'thisMonth') return it.expiry.slice(0, 7) === monthOf(today, 0);
    if (p === 'nextMonth') return it.expiry.slice(0, 7) === monthOf(today, 1);
    const n = Number(p);
    return Number.isFinite(n) && it.daysLeft >= 0 && it.daysLeft <= n;
};

const matchDue = (it, f, today) => {
    if (f.dueFrom || f.dueTo) {
        if (!it.dueKey) return false;
        if (f.dueFrom && it.dueKey < f.dueFrom) return false;
        if (f.dueTo && it.dueKey > f.dueTo) return false;
        return true;
    }
    const p = f.due;
    if (p === 'all') return true;
    if (!it.dueKey) return false;
    if (p === 'overdue') return it.dueIn < 0;
    if (p === 'today') return it.dueIn === 0;
    if (p === 'thisMonth') return it.dueKey.slice(0, 7) === monthOf(today, 0);
    if (p === 'nextMonth') return it.dueKey.slice(0, 7) === monthOf(today, 1);
    const n = Number(p);
    return Number.isFinite(n) && it.dueIn >= 0 && it.dueIn <= n;
};

const sorters = {
    expiry: (a, b) => (a.expiry || '9999') .localeCompare(b.expiry || '9999') || a.domainName.localeCompare(b.domainName),
    expiryDesc: (a, b) => (b.expiry || '0000').localeCompare(a.expiry || '0000') || a.domainName.localeCompare(b.domainName),
    newest: (a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')),
    oldest: (a, b) => String(a.createdAt || '').localeCompare(String(b.createdAt || '')),
    name: (a, b) => a.domainName.localeCompare(b.domainName),
    due: (a, b) => b.due - a.due || a.domainName.localeCompare(b.domainName),
    profit: (a, b) => b.profit - a.profit,
    revenue: (a, b) => b.revenue - a.revenue,
};

export const applyFilters = (items, f, today = todayKey()) => {
    const needle = (f.q || '').trim().toLowerCase();
    const digits = needle.replace(/\D/g, '');
    const list = items.filter((it) => {
        if (needle && !it.hay.includes(needle) && !(digits.length >= 3 && it.digits.includes(digits))) return false;
        if (f.type !== 'all' && it.type !== f.type) return false;
        if (f.state !== 'all' && it.state !== f.state) return false;
        if (f.pay !== 'all') {
            if (f.pay === 'due' ? !(it.due > 0) : it.payStatus !== f.pay) return false;
        }
        if (f.link === 'project' && !it.projectCode) return false;
        if (f.link === 'standalone' && it.projectCode) return false;
        if (f.link === 'auto' && !it.fromProject) return false;
        if (f.billing !== 'all' && (it.billing || 'separate') !== f.billing) return false;
        if (f.provider !== 'all') {
            if (f.provider === '__none' ? !!it.provider : it.provider !== f.provider) return false;
        }
        if (f.tld !== 'all' && it.tld !== f.tld) return false;
        if (f.auto === 'on' && !it.autoRenew) return false;
        if (f.auto === 'off' && it.autoRenew) return false;
        if (f.buyMonth !== 'all' && it.purchaseMonth !== f.buyMonth) return false;
        if (f.buyFrom && (!it.purchase || it.purchase < f.buyFrom)) return false;
        if (f.buyTo && (!it.purchase || it.purchase > f.buyTo)) return false;
        return matchExpiry(it, f, today) && matchDue(it, f, today);
    });
    list.sort(sorters[f.sort] || sorters.expiry);
    return list;
};

// how many filters are switched on (the search box and sort order do not count)
export const activeFilterCount = (f) =>
    Object.keys(DEFAULT_FILTERS).filter((k) => !['q', 'sort'].includes(k) && f[k] !== DEFAULT_FILTERS[k]).length;

export const distinct = (items, pick) => [...new Set(items.map(pick).filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b)));

// ---------------------------------------------------------------
// Totals and analytics
// ---------------------------------------------------------------
export const totals = (items) =>
    items.reduce(
        (t, it) => ({
            count: t.count + 1,
            revenue: t.revenue + it.revenue,
            cost: t.cost + it.cost,
            profit: t.profit + it.profit,
            paid: t.paid + it.paid,
            due: t.due + it.due,
        }),
        { count: 0, revenue: 0, cost: 0, profit: 0, paid: 0, due: 0 }
    );

// Every sale is an event on its own day: the first purchase and each renewal. Last `n` months ending with this one.
export const monthlySeries = (items, n = 12, today = todayKey()) => {
    const end = today.slice(0, 7);
    const keys = Array.from({ length: n }, (_, i) => addMonthsKey(end + '-01', i - (n - 1)).slice(0, 7));
    const map = new Map(keys.map((k) => [k, { month: k, label: monthShort(k), revenue: 0, cost: 0, profit: 0, purchases: 0, renewals: 0 }]));
    items.forEach((it) => {
        const buy = it.purchaseMonth && map.get(it.purchaseMonth);
        if (buy) {
            buy.revenue += Number(it.sellPrice) || 0;
            buy.cost += Number(it.buyPrice) || 0;
            buy.purchases += 1;
        }
        it.renewals.forEach((r) => {
            const m = map.get(dayKey(r.date).slice(0, 7));
            if (!m) return;
            m.revenue += Number(r.sellPrice) || 0;
            m.cost += Number(r.buyPrice) || 0;
            m.renewals += 1;
        });
    });
    return keys.map((k) => {
        const m = map.get(k);
        return { ...m, profit: m.revenue - m.cost };
    });
};

// Active records by how soon they expire
export const expiryBuckets = (items) => {
    const live = items.filter((it) => it.status === 'active');
    const defs = [
        { key: 'expired', label: 'Expired', tone: 'rose', test: (it) => it.expiry && it.daysLeft < 0 },
        { key: '7', label: 'Within 7 days', tone: 'rose', test: (it) => it.expiry && it.daysLeft >= 0 && it.daysLeft <= 7 },
        { key: '30', label: '8 – 30 days', tone: 'amber', test: (it) => it.expiry && it.daysLeft > 7 && it.daysLeft <= 30 },
        { key: '60', label: '31 – 60 days', tone: 'sky', test: (it) => it.expiry && it.daysLeft > 30 && it.daysLeft <= 60 },
        { key: '90', label: '61 – 90 days', tone: 'sky', test: (it) => it.expiry && it.daysLeft > 60 && it.daysLeft <= 90 },
        { key: 'later', label: 'More than 90 days', tone: 'emerald', test: (it) => it.expiry && it.daysLeft > 90 },
        { key: 'none', label: 'No expiry date', tone: 'slate', test: (it) => !it.expiry },
    ];
    return defs.map((d) => ({ key: d.key, label: d.label, tone: d.tone, count: live.filter(d.test).length }));
};

export const groupTop = (items, keyOf, n = 5) => {
    const map = new Map();
    items.forEach((it) => {
        const k = keyOf(it);
        if (!k) return;
        const g = map.get(k) || { key: k, count: 0, revenue: 0, profit: 0 };
        g.count += 1;
        g.revenue += it.revenue;
        g.profit += it.profit;
        map.set(k, g);
    });
    return [...map.values()].sort((a, b) => b.count - a.count || b.revenue - a.revenue).slice(0, n);
};

// Clients that owe money (grouped by phone, otherwise by name)
export const clientsDue = (items, n = 6) => {
    const map = new Map();
    items.forEach((it) => {
        if (it.due <= 0 || it.status === 'cancelled') return;
        const k = it.digits || it.owner.toLowerCase() || it.domainName;
        const g = map.get(k) || { key: k, name: it.owner || '—', phone: it.phone, due: 0, count: 0, items: [] };
        g.due += it.due;
        g.count += 1;
        g.items.push(it);
        map.set(k, g);
    });
    return [...map.values()].sort((a, b) => b.due - a.due).slice(0, n);
};

// Records that need a phone call soon: expired or expiring, still active, oldest expiry first
export const needsAttention = (items) =>
    items.filter((it) => it.status === 'active' && (it.state === 'expired' || it.state === 'expiring')).sort((a, b) => a.daysLeft - b.daysLeft);

// ---------------------------------------------------------------
// Renewals & dues screen
// ---------------------------------------------------------------
export const RENEWAL_BUCKETS = [
    { key: 'overdue', label: 'Overdue', hint: 'ডেট পার হয়ে গেছে', tone: 'rose', test: (n) => n < 0 },
    { key: 'today', label: 'Today', hint: 'আজই', tone: 'rose', test: (n) => n === 0 },
    { key: 'd7', label: 'Next 7 days', hint: '১–৭ দিনের মধ্যে', tone: 'amber', test: (n) => n >= 1 && n <= 7 },
    { key: 'd15', label: '8 – 15 days', hint: '৮–১৫ দিন', tone: 'amber', test: (n) => n >= 8 && n <= 15 },
    { key: 'd30', label: '16 – 30 days', hint: '১৬–৩০ দিন', tone: 'sky', test: (n) => n >= 16 && n <= 30 },
    { key: 'd60', label: '31 – 60 days', hint: '৩১–৬০ দিন', tone: 'sky', test: (n) => n >= 31 && n <= 60 },
    { key: 'd90', label: '61 – 90 days', hint: '৬১–৯০ দিন', tone: 'emerald', test: (n) => n >= 61 && n <= 90 },
];

// Active records grouped by the day their money is expected (next payment date, else expiry)
export const renewalBuckets = (items, horizonDays = 90) =>
    RENEWAL_BUCKETS.map((b) => ({
        ...b,
        items: items
            .filter((it) => it.status === 'active' && it.dueKey && b.test(it.dueIn) && it.dueIn <= horizonDays)
            .sort((a, c) => a.dueIn - c.dueIn),
    }));

// WhatsApp / SMS text (Bengali) for a client whose domain or hosting is about to end
export const reminderText = (it) => {
    const what = `${it.domainName}${it.type === 'hosting' ? ' হোস্টিং' : it.type === 'both' ? ' ডোমেইন ও হোস্টিং' : ' ডোমেইন'}`;
    const date = fmtKey(it.expiry);
    let when = '';
    if (it.daysLeft === null) when = 'এর রিনিউয়ের সময় হয়েছে';
    else if (it.daysLeft < 0) when = `এর মেয়াদ ${date} তারিখে শেষ হয়ে গেছে`;
    else if (it.daysLeft === 0) when = 'এর মেয়াদ আজ শেষ হচ্ছে';
    else when = `এর মেয়াদ ${date} তারিখে (${it.daysLeft} দিন পরে) শেষ হবে`;
    const lines = [`আসসালামু আলাইকুম${it.owner ? ' ' + it.owner : ''},`, `আপনার ${what} ${when}।`];
    if (it.renewPrice > 0) lines.push(`রিনিউ ফি: ${taka(it.renewPrice)}।`);
    if (it.due > 0) lines.push(`আগের বকেয়া: ${taka(it.due)}।`);
    lines.push('সার্ভিস চালু রাখতে অনুগ্রহ করে দ্রুত রিনিউ করুন। ধন্যবাদ — Extrain Web');
    return lines.join('\n');
};

export const dueText = (c) => {
    const rows = c.items.map((it) => `• ${it.domainName} — ${taka(it.due)}`).join('\n');
    return [`আসসালামু আলাইকুম${c.name && c.name !== '—' ? ' ' + c.name : ''},`, `আপনার মোট বকেয়া ${taka(c.due)}:`, rows, 'অনুগ্রহ করে পেমেন্ট সম্পন্ন করুন। ধন্যবাদ — Extrain Web'].join('\n');
};

// ---------------------------------------------------------------
// Export columns (used with lib/projectSheet.js builders)
// ---------------------------------------------------------------
export const DOMAIN_COLUMNS = [
    { key: 'sl', label: '#', width: 6, type: 'int', center: true, get: (r, i) => i + 1 },
    { key: 'name', label: 'Domain / Hosting', width: 30, type: 'text', get: (r) => r.domainName },
    { key: 'type', label: 'Type', width: 16, type: 'text', get: (r) => TYPE_LABEL[r.type] },
    { key: 'gb', label: 'Hosting GB', width: 11, type: 'int', get: (r) => r.hostingGB || '' },
    { key: 'plan', label: 'Hosting Plan', width: 20, type: 'text', get: (r) => r.hostingPlan },
    { key: 'provider', label: 'Provider', width: 18, type: 'text', get: (r) => r.provider },
    { key: 'owner', label: 'Owner', width: 22, type: 'text', get: (r) => r.owner },
    { key: 'phone', label: 'Owner Phone', width: 16, type: 'text', phone: true, get: (r) => r.phone },
    { key: 'email', label: 'Owner Email', width: 26, type: 'text', get: (r) => r.email },
    { key: 'project', label: 'Project Code', width: 15, type: 'text', get: (r) => r.projectCode },
    { key: 'billing', label: 'Billing', width: 12, type: 'text', get: (r) => (r.projectCode ? (r.billing === 'included' ? 'In project price' : 'Separate') : '') },
    { key: 'purchase', label: 'Purchase Date', width: 14, type: 'date', get: (r) => r.purchase },
    { key: 'expiry', label: 'Expiry Date', width: 14, type: 'date', get: (r) => r.expiry },
    { key: 'daysLeft', label: 'Days Left', width: 10, type: 'int', get: (r) => (r.daysLeft === null ? '' : r.daysLeft) },
    { key: 'state', label: 'Status', width: 12, type: 'text', center: true, get: (r) => STATE[r.state]?.label || r.state },
    { key: 'auto', label: 'Auto-renew', width: 11, type: 'text', center: true, get: (r) => (r.autoRenew ? 'Yes' : 'No') },
    { key: 'next', label: 'Next Payment Date', width: 17, type: 'date', get: (r) => r.nextPay },
    { key: 'cost', label: 'Cost (৳)', width: 12, type: 'money', total: true, get: (r) => r.cost },
    { key: 'revenue', label: 'Revenue (৳)', width: 13, type: 'money', total: true, get: (r) => r.revenue },
    { key: 'profit', label: 'Profit (৳)', width: 12, type: 'money', total: true, get: (r) => r.profit },
    { key: 'paid', label: 'Paid (৳)', width: 12, type: 'money', total: true, get: (r) => r.paid },
    { key: 'due', label: 'Due (৳)', width: 12, type: 'money', total: true, get: (r) => r.due },
    { key: 'renewals', label: 'Renewals', width: 10, type: 'int', get: (r) => r.renewalCount || '' },
    { key: 'lastRenewed', label: 'Last Renewed', width: 14, type: 'date', get: (r) => (r.lastRenewal ? dayKey(r.lastRenewal.date) : '') },
    { key: 'note', label: 'Note', width: 30, type: 'wrap', get: (r) => r.note },
];
