// ===================================================================
// Who is logged in, and what each role may open.
//
// "editor" = handles orders and domain & hosting (never sees an amount of money there), and adds / edits the
// marketplace websites and their categories — but never deletes anything.
// The server enforces all of this on its own (an editor's order / domain responses carry no price at all, and every
// delete answers 403) — the helpers here only decide what the screens show.
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

// the admin-dashboard areas a limited role may open (anything else sends them to their home page)
const AREAS = {
    editor: {
        home: EDITOR_HOME,
        allow: [
            '/dashboard/admin/project-tracker',
            '/dashboard/admin/domain-hosting',
            '/dashboard/admin/website',
            '/dashboard/admin/category',
            '/dashboard/admin/profile',
        ],
        block: ['/dashboard/admin/project-tracker/expenses'],
    },
};

// roles that use the admin dashboard but only part of it
export const isLimitedRole = (role) => !!AREAS[role];

const under = (path, base) => path === base || path.startsWith(base + '/');

export const roleMayOpen = (role, pathname) => {
    const area = AREAS[role];
    if (!area) return true;
    const p = (pathname || '').replace(/\/+$/, '') || '/';
    if (area.block.some((b) => under(p, b))) return false;
    return area.allow.some((a) => under(p, a));
};

export const editorMayOpen = (pathname) => roleMayOpen('editor', pathname);

// where a person lands after login / when they open a page that is not theirs
export const homeForRole = (role) => {
    if (AREAS[role]) return AREAS[role].home;
    switch (role) {
        case 'admin':
            return '/dashboard/admin';
        case 'mentor':
            return '/dashboard/mentor';
        default:
            return '/dashboard/user';
    }
};
