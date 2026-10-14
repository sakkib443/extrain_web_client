'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AdminSidebar from '@/components/Admin/AdminSidebar';
import DashboardHeader from '@/components/Admin/DashboardHeader';
import ProtectedRoute from '@/app/providers/protectedRoutes';
import { ThemeProvider, useTheme } from '@/providers/ThemeProvider';
import { API_BASE_URL } from '@/config/api';
import { EDITOR_HOME, editorMayOpen, getStoredUser, isEditor } from '@/lib/access';

// Import dashboard-specific CSS (separate from frontend)
import '@/app/dashboard.css';

const AdminLayoutContent = ({ children }) => {
  const { isDark } = useTheme();

  return (
    <div className={`dashboard-container min-h-screen transition-colors duration-300 dashboard-fonts ${isDark
      ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800'
      : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'
      }`}>
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="lg:ml-72 transition-all duration-300">
        {/* Header */}
        <DashboardHeader />

        {/* Page Content */}
        <main className={`p-4 lg:p-6 transition-colors duration-300 ${isDark ? 'text-slate-200' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

const STAFF_ROLES = ['admin', 'editor'];

// An editor may only open Project Tracker and Domain & Hosting — every other admin page sends them back to the
// orders page. The saved role is also re-checked against the server once per visit, so a role an admin changed
// takes effect without the person having to log in again.
const RoleGuard = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const blocked = isEditor() && !editorMayOpen(pathname);

  useEffect(() => {
    if (blocked) router.replace(EDITOR_HOME);
  }, [blocked, router]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch(`${API_BASE_URL}/users/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        const role = json?.data?.role;
        const stored = getStoredUser();
        if (role && stored && stored.role !== role) {
          localStorage.setItem('user', JSON.stringify({ ...stored, role }));
          window.location.reload();
        }
      })
      .catch(() => {});
  }, []);

  if (blocked) return null;
  return children;
};

const AdminLayout = ({ children }) => {
  return (
    <ProtectedRoute allowedRoles={STAFF_ROLES}>
      <ThemeProvider>
        <AdminLayoutContent>
          <RoleGuard>{children}</RoleGuard>
        </AdminLayoutContent>
      </ThemeProvider>
    </ProtectedRoute>
  );
};

export default AdminLayout;
