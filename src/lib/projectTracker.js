// ===================================================================
// Project Tracker - Frontend API helper
// সব project-tracker API call + formatting এখান থেকে
// ===================================================================
import { API_BASE_URL } from '@/config/api';

const authHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
};

const handle = async (res) => {
    const json = await res.json().catch(() => ({}));
    if (!res.ok || json.success === false) {
        throw new Error(json.message || 'Something went wrong');
    }
    return json.data;
};

export const ptApi = {
    // ---- Public ----
    // "আমাদের কোন ওয়েবসাইটের মতো" dropdown এর জন্য আমাদের সাইটগুলোর title list
    getOurWebsites: () =>
        fetch(`${API_BASE_URL}/websites?limit=100`)
            .then((r) => r.json())
            .then((j) => (Array.isArray(j.data) ? j.data : j.data?.data || j.data?.websites || [])),
    submitRequest: (body) =>
        fetch(`${API_BASE_URL}/project-tracker/request`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        }).then(handle),

    // ---- Requests ----
    getRequests: () =>
        fetch(`${API_BASE_URL}/project-tracker/admin/requests`, { headers: authHeaders() }).then(handle),
    approveRequest: (id) =>
        fetch(`${API_BASE_URL}/project-tracker/admin/requests/${id}/approve`, {
            method: 'PATCH',
            headers: authHeaders(),
        }).then(handle),
    rejectRequest: (id) =>
        fetch(`${API_BASE_URL}/project-tracker/admin/requests/${id}/reject`, {
            method: 'PATCH',
            headers: authHeaders(),
        }).then(handle),
    confirmRequest: (id, body) =>
        fetch(`${API_BASE_URL}/project-tracker/admin/requests/${id}/confirm`, {
            method: 'PATCH',
            headers: authHeaders(),
            body: JSON.stringify(body),
        }).then(handle),

    // ---- Months + summary ----
    getMonths: () =>
        fetch(`${API_BASE_URL}/project-tracker/admin/months`, { headers: authHeaders() }).then(handle),
    getSummary: (month) =>
        fetch(`${API_BASE_URL}/project-tracker/admin/summary${month ? `?month=${month}` : ''}`, {
            headers: authHeaders(),
        }).then(handle),
    getDailyStats: (month) =>
        fetch(`${API_BASE_URL}/project-tracker/admin/daily-stats?month=${month}`, {
            headers: authHeaders(),
        }).then(handle),

    // ---- Projects ----
    getProjects: (month) =>
        fetch(`${API_BASE_URL}/project-tracker/admin/projects${month ? `?month=${month}` : ''}`, {
            headers: authHeaders(),
        }).then(handle),
    createProject: (body) =>
        fetch(`${API_BASE_URL}/project-tracker/admin/projects`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(body),
        }).then(handle),
    updateProject: (id, body) =>
        fetch(`${API_BASE_URL}/project-tracker/admin/projects/${id}`, {
            method: 'PATCH',
            headers: authHeaders(),
            body: JSON.stringify(body),
        }).then(handle),
    deleteProject: (id) =>
        fetch(`${API_BASE_URL}/project-tracker/admin/projects/${id}`, {
            method: 'DELETE',
            headers: authHeaders(),
        }).then(handle),
    sendReceipt: (id, body) =>
        fetch(`${API_BASE_URL}/project-tracker/admin/projects/${id}/send-receipt`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(body),
        }).then(handle),

    // ---- Domains / Hosting (মাসভিত্তিক — purchaseDate অনুযায়ী) ----
    getDomains: (month) =>
        fetch(`${API_BASE_URL}/project-tracker/admin/domains${month ? `?month=${month}` : ''}`, { headers: authHeaders() }).then(handle),
    getDomainSummary: (month) =>
        fetch(`${API_BASE_URL}/project-tracker/admin/domains/summary${month ? `?month=${month}` : ''}`, { headers: authHeaders() }).then(handle),
    createDomain: (body) =>
        fetch(`${API_BASE_URL}/project-tracker/admin/domains`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(body) }).then(handle),
    updateDomain: (id, body) =>
        fetch(`${API_BASE_URL}/project-tracker/admin/domains/${id}`, { method: 'PATCH', headers: authHeaders(), body: JSON.stringify(body) }).then(handle),
    deleteDomain: (id) =>
        fetch(`${API_BASE_URL}/project-tracker/admin/domains/${id}`, { method: 'DELETE', headers: authHeaders() }).then(handle),

    // ---- User dashboard ----
    getMyReceipts: () =>
        fetch(`${API_BASE_URL}/project-tracker/my-receipts`, { headers: authHeaders() }).then(handle),

    // ---- Expenses ----
    getExpenses: (month) =>
        fetch(`${API_BASE_URL}/project-tracker/admin/expenses${month ? `?month=${month}` : ''}`, {
            headers: authHeaders(),
        }).then(handle),
    createExpense: (body) =>
        fetch(`${API_BASE_URL}/project-tracker/admin/expenses`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(body),
        }).then(handle),
    updateExpense: (id, body) =>
        fetch(`${API_BASE_URL}/project-tracker/admin/expenses/${id}`, {
            method: 'PATCH',
            headers: authHeaders(),
            body: JSON.stringify(body),
        }).then(handle),
    deleteExpense: (id) =>
        fetch(`${API_BASE_URL}/project-tracker/admin/expenses/${id}`, {
            method: 'DELETE',
            headers: authHeaders(),
        }).then(handle),
};

// ---------- Formatting helpers ----------
export const bdt = (n) =>
    '৳' + Number(n || 0).toLocaleString('en-BD', { maximumFractionDigits: 0 });

export const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

export const monthLabel = (key) => {
    if (!key) return '';
    const [y, m] = key.split('-');
    const names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${names[Number(m) - 1]} ${y}`;
};

export const WEBSITE_TYPES = [
    'Ecommerce', 'Learning Management', 'LMS', 'IELTS Software', 'Visa Processing',
    'Business Website', 'Portfolio', 'Restaurant Website', 'News/Blog', 'Landing Page', 'Custom Software', 'Other',
];

// packageType — Confirm Order এ বেছে নেওয়া হয়; Domain/Hosting registry তে রেকর্ড auto যোগ হয়
export const PACKAGE_TYPES = [
    { value: 'without_domain_hosting', label: 'Without Domain & Hosting', short: 'Without' },
    { value: 'with_domain', label: 'With Domain', short: 'Domain' },
    { value: 'with_hosting', label: 'With Hosting', short: 'Hosting' },
    { value: 'with_domain_hosting', label: 'With Domain & Hosting', short: 'Domain + Hosting' },
];

export const packageLabel = (v) =>
    PACKAGE_TYPES.find((p) => p.value === v)?.label || 'Without Domain & Hosting';

// ডোমেইন/হোস্টিংয়ের দাম প্রজেক্টের টোটালের ভিতরে, নাকি আলাদা পেমেন্ট
export const BILLING_MODES = [
    {
        value: 'included',
        label: 'প্রজেক্টের দামের ভিতরে',
        hint: 'Total Project Amount এর ভিতরেই ধরা — লাভে শুধু আমাদের খরচ বাদ যাবে',
    },
    {
        value: 'separate',
        label: 'আলাদা পেমেন্ট',
        hint: 'প্রজেক্টের টাকার বাইরে — লাভে (Sell − Buy) যোগ হবে',
    },
];

export const billingLabel = (v) => (v === 'included' ? 'Included' : 'Separate');

// ডোমেইনের নিজের লাভ — যত টাকায় বেচা, তত টাকায় কেনা বাদ
export const domainProfit = (d) => (Number(d?.sellPrice) || 0) - (Number(d?.buyPrice) || 0);

// ডোমেইন বাবদ ক্লায়েন্টের কাছে কত বাকি
export const domainDue = (d) =>
    Math.max(0, (Number(d?.sellPrice) || 0) - (Number(d?.clientPaid) || 0));

// মাসের মোট লাভে এই রেকর্ড কতটা যোগ করে (server এর domainRevenueImpact এর মিরর)।
// included হলে Sell টা প্রজেক্টের Total এ ধরা — Tracker এর collection থেকে clientPaid বাদ
// দিয়ে website collection হয়, তাই এখানে clientPaid ধরা হয়।
export const domainRevenueImpact = (d) =>
    (d?.billing === 'included' ? Number(d?.clientPaid) || 0 : Number(d?.sellPrice) || 0) -
    (Number(d?.buyPrice) || 0);

export const STATUS_OPTIONS = ['pending', 'working', 'done', 'cancelled'];

export const statusStyle = (s) => {
    const map = {
        request: 'bg-amber-100 text-amber-700 border-amber-200',
        pending: 'bg-blue-100 text-blue-700 border-blue-200',
        working: 'bg-indigo-100 text-indigo-700 border-indigo-200',
        done: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        cancelled: 'bg-rose-100 text-rose-700 border-rose-200',
        rejected: 'bg-slate-100 text-slate-600 border-slate-200',
    };
    return map[s] || map.pending;
};
