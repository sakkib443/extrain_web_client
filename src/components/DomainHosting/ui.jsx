'use client';

// Small shared pieces of the Domain & Hosting screens.
import React, { useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import { STATE, TYPE_LABEL, relDays } from '@/lib/domainLogic';

export const BRAND = '#FD9A00';

// class names that follow the dashboard theme
export const useCx = (isDark) => ({
    muted: isDark ? 'text-slate-400' : 'text-slate-500',
    strong: isDark ? 'text-white' : 'text-slate-800',
    text: isDark ? 'text-slate-200' : 'text-slate-700',
    card: isDark ? 'bg-slate-800/40 border-slate-700/60' : 'bg-white border-slate-200/70',
    soft: isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200',
    divide: isDark ? 'divide-slate-700/50' : 'divide-slate-100',
    border: isDark ? 'border-slate-700/60' : 'border-slate-100',
    label: `text-xs font-semibold mb-1.5 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`,
    input: `w-full px-3 py-2.5 rounded-lg border outline-none transition text-sm ${isDark ? 'bg-slate-800 border-slate-700 text-white focus:border-orange-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-orange-400 focus:bg-white'}`,
    ctrl: `px-3 py-2 rounded-lg border outline-none text-sm transition ${isDark ? 'bg-slate-800 border-slate-700 text-white focus:border-orange-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-orange-400 focus:bg-white'}`,
    iconBtn: `p-2.5 rounded-xl transition ${isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`,
    ghostBtn: `inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition ${isDark ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`,
    th: `px-2.5 py-2 text-left text-[11px] font-bold uppercase tracking-wide align-bottom sticky top-0 z-10 ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-50 text-slate-500'}`,
    td: `px-2.5 py-2.5 text-[13px] align-top ${isDark ? 'text-slate-200' : 'text-slate-700'}`,
    sub: `text-[11.5px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`,
});

export const StatePill = ({ state, className = '' }) => {
    const { isDark } = useTheme();
    const s = STATE[state] || STATE.active;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border whitespace-nowrap ${isDark ? s.dark : s.cls} ${className}`}>
            <i className={`w-1.5 h-1.5 rounded-full ${s.dot}`} /> {s.label}
        </span>
    );
};

export const TypePill = ({ type, isDark }) => (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
        {TYPE_LABEL[type] || 'Domain'}
    </span>
);

// "in 12 days" / "3 days ago", coloured by urgency
export const DaysText = ({ days, inactive }) => {
    if (days === null || days === undefined) return <span className="text-slate-400">—</span>;
    const cls = inactive ? 'text-slate-400' : days < 0 ? 'text-rose-500' : days <= 7 ? 'text-rose-500' : days <= 30 ? 'text-amber-500' : 'text-emerald-500';
    return <span className={`font-semibold ${cls}`}>{relDays(days)}</span>;
};

export const Kpi = ({ isDark, label, value, sub, tone = 'slate', onClick, icon: Icon }) => {
    const accent = { slate: '#64748b', emerald: '#10b981', amber: '#f59e0b', rose: '#f43f5e', sky: '#0ea5e9', indigo: '#6366f1', brand: BRAND }[tone] || '#64748b';
    const valCls = { emerald: 'text-emerald-500', amber: 'text-amber-500', rose: 'text-rose-500' }[tone] || (isDark ? 'text-white' : 'text-slate-800');
    const Tag = onClick ? 'button' : 'div';
    return (
        <Tag
            type={onClick ? 'button' : undefined}
            onClick={onClick}
            className={`relative text-left rounded-xl pl-5 pr-4 py-3.5 border transition ${isDark ? 'bg-slate-800/50 border-slate-700/60' : 'bg-white border-slate-200/70'} ${onClick ? (isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50 hover:shadow-sm') : ''}`}
        >
            <span className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full" style={{ background: accent }} />
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider mb-1 text-slate-400">
                {Icon ? <Icon size={12} /> : null}{label}
            </p>
            <p className={`text-[22px] leading-tight font-bold ${valCls}`}>{value}</p>
            {sub ? <p className="text-[11.5px] mt-0.5 text-slate-400">{sub}</p> : null}
        </Tag>
    );
};

export function Modal({ isDark, title, subtitle, onClose, children, footer, size = 'max-w-2xl' }) {
    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
            <div className={`relative w-full ${size} max-h-[92vh] overflow-y-auto rounded-2xl shadow-2xl ${isDark ? 'bg-slate-900 border border-slate-700' : 'bg-white'}`}>
                <div className={`sticky top-0 z-10 flex items-center justify-between gap-3 px-5 sm:px-6 py-4 border-b ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-100'}`}>
                    <div className="min-w-0">
                        <h2 className={`text-lg font-bold truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>{title}</h2>
                        {subtitle ? <p className={`text-xs truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{subtitle}</p> : null}
                    </div>
                    <button onClick={onClose} aria-label="Close" className={`p-2 rounded-lg shrink-0 ${isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-400 hover:bg-slate-100'}`}><FiX /></button>
                </div>
                <div className="p-5 sm:p-6 space-y-4">{children}</div>
                {footer ? (
                    <div className={`sticky bottom-0 flex flex-wrap justify-end gap-3 px-5 sm:px-6 py-4 border-t ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-100'}`}>{footer}</div>
                ) : null}
            </div>
        </div>
    );
}

export const SectionTitle = ({ children, isDark }) => (
    <p className={`text-[11px] font-bold uppercase tracking-wider pt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{children}</p>
);

// a vertical stack of progress rows, used on the overview
export const BarRow = ({ label, value, max, tone = 'sky', onClick, isDark }) => {
    const color = { rose: '#f43f5e', amber: '#f59e0b', sky: '#0ea5e9', emerald: '#10b981', slate: '#94a3b8' }[tone] || '#94a3b8';
    const pct = max > 0 ? Math.max(value > 0 ? 4 : 0, Math.round((value / max) * 100)) : 0;
    const Tag = onClick ? 'button' : 'div';
    return (
        <Tag type={onClick ? 'button' : undefined} onClick={onClick} className="w-full text-left group">
            <div className="flex items-center justify-between text-sm mb-1">
                <span className={`${isDark ? 'text-slate-300' : 'text-slate-600'} ${onClick ? 'group-hover:underline' : ''}`}>{label}</span>
                <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{value}</span>
            </div>
            <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-700/60' : 'bg-slate-100'}`}>
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
            </div>
        </Tag>
    );
};
