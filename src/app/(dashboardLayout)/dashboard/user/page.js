'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders } from '@/redux/orderSlice';
import {
    FiArrowRight, FiRefreshCw,
    FiCode, FiGlobe, FiZap, FiShoppingBag, FiCreditCard,
    FiUser, FiChevronRight, FiPackage, FiLayers,
    FiCheckCircle, FiAlertCircle, FiClock, FiMessageSquare
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';

export default function UserDashboard() {
    const { isDark } = useTheme();
    const dispatch = useDispatch();
    const [user, setUser] = useState(null);
    const [isSyncing, setIsSyncing] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);

    const { orders, loading: orderLoading } = useSelector((state) => state.order);

    useEffect(() => {
        setHasMounted(true);
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) { }
        }

        dispatch(fetchMyOrders());
    }, [dispatch]);

    const handleSync = () => {
        setIsSyncing(true);
        dispatch(fetchMyOrders());
        setTimeout(() => setIsSyncing(false), 800);
    };

    const cardClass = `rounded-md border transition-all ${isDark
        ? 'bg-[#111827] border-slate-800 shadow-lg shadow-black/20'
        : 'bg-white border-slate-200 shadow-sm'
        }`;

    if (!hasMounted || orderLoading) {
        return (
            <div className="p-6 space-y-6">
                <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-md animate-pulse"></div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-24 bg-slate-100 dark:bg-slate-800 rounded-md animate-pulse"></div>
                    ))}
                </div>
            </div>
        );
    }

    // Calculate stats from orders
    const websiteCount = orders?.reduce((acc, order) =>
        acc + (order.items?.filter(item => item.productType === 'website').length || 0), 0) || 0;
    const softwareCount = orders?.reduce((acc, order) =>
        acc + (order.items?.filter(item => item.productType === 'software').length || 0), 0) || 0;
    const totalProducts = websiteCount + softwareCount;
    const completedOrders = orders?.filter(o => o.paymentStatus === 'completed').length || 0;
    const pendingOrders = orders?.filter(o => o.paymentStatus === 'pending').length || 0;

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
                <div>
                    <h1 className={`text-2xl font-normal tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Welcome, {user?.firstName || 'User'} 👋
                    </h1>
                    <p className="text-sm font-normal text-slate-500 mt-1">
                        View all your products and orders in your dashboard.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleSync}
                        className={`flex items-center gap-2 px-4 py-2 text-xs font-normal rounded-md border transition-all ${isDark
                            ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                    >
                        <FiRefreshCw className={isSyncing ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                    <Link
                        href="/website"
                        className="px-5 py-2.5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white text-xs font-normal rounded-md hover:opacity-90 transition-all uppercase tracking-wider"
                    >
                        Marketplace
                    </Link>
                </div>
            </div>

            {/* Main Section: Digital Assets */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className={`lg:col-span-2 ${cardClass} overflow-hidden p-6 relative group`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <FiLayers size={140} />
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                        <div className="space-y-4">
                            <div>
                                <h2 className={`text-xl font-normal ${isDark ? 'text-white' : 'text-slate-900'}`}>Digital Assets</h2>
                                <p className="text-xs font-normal text-slate-500 mt-1">All your purchased products</p>
                            </div>

                            <div className="flex gap-8">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-normal text-slate-400 uppercase tracking-widest">Total</p>
                                    <p className={`text-4xl font-normal ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        {totalProducts.toString().padStart(2, '0')}
                                    </p>
                                </div>
                                <div className="w-px h-12 bg-slate-200 dark:bg-slate-800 my-auto"></div>
                                <div className="flex gap-6">
                                    <Link href="/dashboard/user/purchases" className="flex items-center gap-3 group/item">
                                        <div className="w-10 h-10 rounded-md bg-teal-500/10 flex items-center justify-center text-teal-500 group-hover/item:scale-110 transition-transform">
                                            <FiGlobe size={20} />
                                        </div>
                                        <div>
                                            <p className={`text-lg font-normal ${isDark ? 'text-white' : 'text-slate-800'}`}>{websiteCount}</p>
                                            <p className="text-[10px] font-normal text-slate-400 uppercase">Websites</p>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="hidden md:flex flex-col gap-2">
                            <Link
                                href="/dashboard/user/purchases"
                                className="px-6 py-3 bg-gradient-to-r from-[#FD9A00] to-[#2dd4bf] text-white rounded-md font-normal text-sm shadow-md hover:scale-[1.02] transition-all block text-center"
                            >
                                View Purchase History
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Secondary Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                    <div className={`${cardClass} p-5 flex items-center gap-4`}>
                        <div className="w-12 h-12 rounded-md bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <FiCheckCircle size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-normal text-slate-400 uppercase">Completed Orders</p>
                            <h3 className={`text-xl font-normal ${isDark ? 'text-white' : 'text-slate-900'}`}>{completedOrders}</h3>
                        </div>
                    </div>
                    <div className={`${cardClass} p-5 flex items-center gap-4`}>
                        <div className="w-12 h-12 rounded-md bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center text-amber-500">
                            <FiClock size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-normal text-slate-400 uppercase">Pending Orders</p>
                            <h3 className={`text-xl font-normal ${isDark ? 'text-white' : 'text-slate-900'}`}>{pendingOrders}</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Lists */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Recent Orders */}
                    <div className={cardClass}>
                        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/10">
                            <h3 className={`font-normal text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>Recent Orders</h3>
                            <Link href="/dashboard/user/purchases" className="text-[10px] font-normal text-slate-400 uppercase tracking-widest hover:text-[#FD9A00]">View All</Link>
                        </div>
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {orders?.length === 0 ? (
                                <div className="p-12 text-center text-slate-400 text-xs font-normal uppercase tracking-widest">No Orders Yet</div>
                            ) : (
                                orders?.slice(0, 5).map((order, idx) => (
                                    <div key={idx} className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all">
                                        <div className="w-12 h-12 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 border border-slate-200 dark:border-slate-700">
                                            <FiShoppingBag size={20} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-normal truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                                                {order.items?.map(i => i.title).join(', ') || 'Product'}
                                            </p>
                                            <p className="text-[10px] font-normal text-slate-400 uppercase mt-0.5">
                                                #{order.orderNumber} • {new Date(order.orderDate).toLocaleDateString('en-US')}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="text-right">
                                                <p className={`text-sm font-normal ${isDark ? 'text-white' : 'text-slate-800'}`}>৳{order.totalAmount?.toLocaleString()}</p>
                                                <div className={`text-[8px] font-normal uppercase px-2 py-0.5 rounded-md inline-flex items-center gap-1 ${order.paymentStatus === 'completed'
                                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                                                    : 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
                                                    }`}>
                                                    {order.paymentStatus === 'completed' ? <FiCheckCircle size={8} /> : <FiAlertCircle size={8} />}
                                                    {order.paymentStatus === 'completed' ? 'Complete' : 'Pending'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Delivery Info */}
                    <div className={`${cardClass} p-6`}>
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-md bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                                <FiPackage size={24} />
                            </div>
                            <div>
                                <h4 className={`text-sm font-normal ${isDark ? 'text-white' : 'text-slate-800'}`}>About Delivery</h4>
                                <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                    After your order is complete, our team will contact you for product setup and customization.
                                    If you have any questions, please contact support.
                                </p>
                                <Link
                                    href="/dashboard/user/support"
                                    className="inline-flex items-center gap-2 mt-3 text-xs text-[#FD9A00] font-normal hover:underline"
                                >
                                    <FiMessageSquare size={14} />
                                    Contact Support
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Profile */}
                    <div className={`${cardClass} p-8 text-center`}>
                        <div className="w-20 h-20 mx-auto rounded-md bg-slate-900 flex items-center justify-center text-2xl font-normal text-white border-2 border-slate-200 dark:border-slate-800 mb-4 shadow-sm">
                            {user?.firstName?.[0] || 'U'}
                        </div>
                        <h4 className={`text-lg font-normal ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {user?.firstName} {user?.lastName}
                        </h4>
                        <p className="text-xs font-normal text-slate-500 mb-6">{user?.email}</p>

                        <Link
                            href="/dashboard/user/profile"
                            className={`w-full py-2.5 rounded-md border text-[10px] font-normal uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            Profile Settings <FiChevronRight size={14} />
                        </Link>
                    </div>

                    {/* Quick Hub */}
                    <div className={`${cardClass} p-3`}>
                        <p className="px-4 py-3 text-[10px] font-normal text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 mb-2">Quick Access</p>
                        <div className="space-y-0.5">
                            {[
                                { label: 'Order History', href: '/dashboard/user/purchases', icon: FiShoppingBag },
                                { label: 'Support Tickets', href: '/dashboard/user/support', icon: FiMessageSquare }
                            ].map((item, i) => (
                                <Link
                                    key={i}
                                    href={item.href}
                                    className="flex items-center justify-between p-3 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800/50 group transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-md flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                            <item.icon size={16} />
                                        </div>
                                        <span className={`text-[11px] font-normal uppercase tracking-tight ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{item.label}</span>
                                    </div>
                                    <FiChevronRight size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-all" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
