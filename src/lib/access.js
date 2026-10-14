// ===================================================================
// Who is logged in, and what each role may open.
//
// "editor" = a staff member who handles orders and domain & hosting only, and never sees an amount of money.
// The server enforces that on its own (an editor's API responses carry no price at all, and money / delete
// routes answer 403) — the helpers here only decide what the screens show.
// ===================================================================

export const getStoredUser = () => {
    if (typeof window === 'undefined') return null;
    try {
        return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
        return null;
    }
};

export const getRole = () => getStoredUser()?.role || null;

// Read during render, so call it only from components that mount after the login check (everything under the dashboard)
export const isEditor = () => getRole() === 'editor';

export const EDITOR_HOME = '/dashboard/admin/project-tracker/requests';

const EDITOR_AREAS = [
    '/dashboard/admin/project-tracker',
    '/dashboard/admin/domain-hosting',
    '/dashboard/admin/profile',
];
const EDITOR_BLOCKED = ['/dashboard/admin/project-tracker/expenses'];

const under = (path, base) => path === base || path.startsWith(base + '/');

export const editorMayOpen = (pathname) => {
    const p = (pathname || '').replace(/\/+$/, '') || '/';
    if (EDITOR_BLOCKED.some((b) => under(p, b))) return false;
    return EDITOR_AREAS.some((a) => under(p, a));
};

// where a person lands after login / when they open a page that is not theirs
export const homeForRole = (role) => {
    switch (role) {
        case 'admin':
            return '/dashboard/admin';
        case 'editor':
            return EDITOR_HOME;
        case 'mentor':
            return '/dashboard/mentor';
        default:
            return '/dashboard/user';
    }
};
