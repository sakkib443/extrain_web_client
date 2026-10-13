// ===================================================================
// Domain & Hosting — API helper (admin only).  All the logic lives in lib/domainLogic.js.
// ===================================================================
import { API_BASE_URL } from '@/config/api';

const authHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
};

const handle = async (res) => {
    const json = await res.json().catch(() => ({}));
    if (!res.ok || json.success === false) {
        const err = new Error(json.message || 'Something went wrong');
        err.status = res.status; // 409 = "already exists", the form offers "add anyway"
        throw err;
    }
    return json.data;
};

const call = (path, method = 'GET', body) =>
    fetch(`${API_BASE_URL}/domain-hosting${path}`, {
        method,
        headers: authHeaders(),
        body: body === undefined ? undefined : JSON.stringify(body),
    }).then(handle);

export const dhApi = {
    list: () => call(''),
    projects: () => call('/projects'),
    create: (body) => call('', 'POST', body),
    update: (id, body) => call(`/${id}`, 'PATCH', body),
    remove: (id) => call(`/${id}`, 'DELETE'),
    renew: (id, body) => call(`/${id}/renew`, 'POST', body),
    removeRenewal: (id, rid) => call(`/${id}/renewals/${rid}`, 'DELETE'),
    addPayment: (id, body) => call(`/${id}/payments`, 'POST', body),
    removePayment: (id, pid) => call(`/${id}/payments/${pid}`, 'DELETE'),
    reminded: (id) => call(`/${id}/reminded`, 'POST', {}),
};
