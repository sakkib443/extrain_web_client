'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    FiDollarSign, FiUsers,
    FiShoppingBag, FiRefreshCw, FiGlobe, FiCode,
    FiPackage, FiActivity, FiLayers,
    FiArrowUpRight, FiArrowDownRight, FiDownload
} from 'react-icons/fi';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { useTheme } from '@/providers/ThemeProvider';
import { API_BASE_URL } from "@/config/api";

// Animated counter component
const AnimatedCounter = ({ value, prefix = '', suffix = '' }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const numValue = typeof value === 'number' ? value : parseInt(String(value).replace(/[^0-9]/g, '')) || 0;
        const duration = 1400;
        const increment = numValue / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= numValue) {
                setCount(numValue);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [value]);

    return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
};

// Classic Stat Card
const StatsCard = ({ title, value, icon: Icon, trend, trendValue, accent, loading }) => {
    const { isDark } = useTheme();
    const isPositive = trend === "up";
    return (
        <div className={`group rounded-xl border p-4 transition-all duration-300 hover:-translate-y-0.5 ${isDark
            ? 'bg-slate-800 border-slate-700/60 hover:border-slate-600'
            : 'bg-white border-slate-200/70 shadow-sm hover:shadow-md'
            }`}>
            <div className="flex items-start justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{title}</span>
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? accent.dark : accent.light}`}>
                    <Icon size={15} />
                </span>
            </div>
            <div className="mt-3">
                <h3 className={`text-2xl font-bold tracking-tight leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {loading ? (
                        <div className={`h-7 w-20 animate-pulse rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
                    ) : (
                        <AnimatedCounter value={value} prefix={title.includes('Revenue') ? '৳' : ''} />
                    )}
                </h3>
                {trendValue && !loading && (
                    <div className={`flex items-center mt-2 text-[11px] ${isPositive ? "text-emerald-600" : "text-rose-500"}`}>
                        {isPositive ? <FiArrowUpRight className="w-3.5 h-3.5" /> : <FiArrowDownRight className="w-3.5 h-3.5" />}
                        <span className="font-semibold ml-0.5">{trendValue}</span>
                        <span className="text-slate-400 ml-1">vs last month</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default function AnalyticsPage() {
    const { isDark } = useTheme();
    const router = useRouter();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('30');
    const [recentPurchases, setRecentPurchases] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [categoryRevenue, setCategoryRevenue] = useState({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        categories: {},
    });

    // Use the base URL from config or local default
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || API_BASE_URL;

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            // Fetch all necessary analytics data
            const [dashboardRes, categoryRes, recentRes, topRes] = await Promise.all([
                fetch(`${BASE_URL}/analytics/dashboard`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`${BASE_URL}/analytics/category-revenue`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`${BASE_URL}/analytics/recent-purchases?limit=10`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`${BASE_URL}/analytics/top-products?limit=5`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);

            const dashboardResult = await dashboardRes.json();
            const categoryResult = await categoryRes.json();
            const recentResult = await recentRes.json();
            const topResult = await topRes.json();

            setData(dashboardResult.data);
            if (categoryResult.data) setCategoryRevenue(categoryResult.data);
            if (recentResult.data) setRecentPurchases(recentResult.data);
            if (topResult.data) setTopProducts(topResult.data);
        } catch (err) {
            console.error('Error fetching analytics:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    // Main stats
    const totalProducts = (data?.totalSoftware || 0) + (data?.totalWebsites || 0);

    const mainStats = [
        {
            title: 'Total Revenue',
            value: data?.totalRevenue || 0,
            icon: FiDollarSign,
            trend: 'up',
            trendValue: '12%',
            accent: { light: 'bg-emerald-50 text-emerald-600', dark: 'bg-emerald-500/15 text-emerald-400' },
        },
        {
            title: 'Total Orders',
            value: data?.totalOrders || 0,
            icon: FiShoppingBag,
            trend: 'up',
            trendValue: '8%',
            accent: { light: 'bg-amber-50 text-amber-600', dark: 'bg-amber-500/15 text-amber-400' },
        },
        {
            title: 'Total Users',
            value: data?.totalUsers || 0,
            icon: FiUsers,
            trend: 'up',
            trendValue: '15%',
            accent: { light: 'bg-blue-50 text-blue-600', dark: 'bg-blue-500/15 text-blue-400' },
        },
        {
            title: 'Total Products',
            value: totalProducts,
            icon: FiPackage,
            trend: 'up',
            trendValue: '+5',
            accent: { light: 'bg-violet-50 text-violet-600', dark: 'bg-violet-500/15 text-violet-400' },
        },
    ];

    // Format data for Recharts dynamically
    const chartData = categoryRevenue.labels.map((label, index) => {
        const item = { name: label };
        Object.keys(categoryRevenue.categories).forEach(cat => {
            item[cat] = categoryRevenue.categories[cat][index] || 0;
        });
        return item;
    });

    // Dynamic colors for categories
    const categoryColors = {
        websites: '#10B981',
        software: '#F59E0B',
        fonts: '#EC4899',
        photos: '#8B5CF6',
        audio: '#3B82F6',
        other: '#94A3B8'
    };

    const getCategoryColor = (cat) => categoryColors[cat.toLowerCase()] || categoryColors.other;

    const cardCls = isDark ? 'bg-slate-800 border-slate-700/60' : 'bg-white border-slate-200/70 shadow-sm';
    const headingCls = isDark ? 'text-white' : 'text-slate-800';

    return (
        <div className="space-y-5 pb-10">
            {/* Page Header */}
            <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border px-5 py-4 ${cardCls}`}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm shadow-indigo-500/30">
                        <FiActivity className="text-white" size={18} />
                    </div>
                    <div>
                        <h1 className={`text-lg font-bold tracking-tight ${headingCls}`}>Analytics Overview</h1>
                        <p className="text-xs text-slate-400 mt-0.5">Real-time performance metrics and sales data</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={fetchAnalytics}
                        disabled={loading}
                        className={`flex items-center gap-2 px-3.5 py-2 border rounded-lg text-[13px] font-medium transition-all disabled:opacity-50 ${isDark ? 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                    <button
                        onClick={() => router.push('/dashboard/admin/reports')}
                        className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[13px] font-semibold transition-all shadow-sm shadow-indigo-500/25"
                    >
                        <FiDownload size={14} />
                        Report
                    </button>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {mainStats.map((stat) => (
                    <StatsCard key={stat.title} {...stat} loading={loading} />
                ))}
            </div>

            {/* Revenue & Summary Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Revenue Breakdown */}
                <div className={`lg:col-span-2 rounded-xl border overflow-hidden ${cardCls}`}>
                    <div className={`flex items-center justify-between px-5 py-4 border-b ${isDark ? 'border-slate-700/60' : 'border-slate-100'}`}>
                        <div>
                            <h3 className={`text-[15px] font-bold ${headingCls}`}>Revenue by Category</h3>
                            <p className="text-xs text-slate-400 mt-0.5">Monthly comparison across products</p>
                        </div>
                        <div className="flex items-center gap-3 text-xs flex-wrap">
                            {Object.keys(categoryRevenue.categories).map(cat => (
                                <div key={cat} className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getCategoryColor(cat) }}></div>
                                    <span className="text-slate-400 capitalize">{cat}s</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-5">
                        <div className="h-[280px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        {Object.keys(categoryRevenue.categories).map(cat => (
                                            <linearGradient key={`color${cat}`} id={`color${cat}`} x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={getCategoryColor(cat)} stopOpacity={0.25} />
                                                <stop offset="95%" stopColor={getCategoryColor(cat)} stopOpacity={0} />
                                            </linearGradient>
                                        ))}
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#1e293b' : '#f1f5f9'} />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 11 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 11 }}
                                        tickFormatter={(value) => `৳${value >= 1000 ? (value / 1000).toFixed(0) + 'k' : value}`}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: isDark ? "#0f172a" : "#fff",
                                            border: isDark ? "1px solid #1e293b" : "1px solid #e2e8f0",
                                            borderRadius: "10px",
                                            boxShadow: "0 8px 20px -6px rgba(0, 0, 0, 0.15)",
                                            padding: '10px 12px',
                                            color: isDark ? '#fff' : '#000'
                                        }}
                                        itemStyle={{ fontSize: '11px', fontWeight: '600' }}
                                        formatter={(value) => [`৳${value.toLocaleString()}`, '']}
                                    />
                                    {Object.keys(categoryRevenue.categories).map(cat => (
                                        <Area
                                            key={cat}
                                            type="monotone"
                                            dataKey={cat}
                                            stroke={getCategoryColor(cat)}
                                            strokeWidth={2}
                                            fillOpacity={1}
                                            fill={`url(#color${cat})`}
                                        />
                                    ))}
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        <div className={`flex items-center justify-between mt-5 pt-4 border-t flex-wrap gap-4 ${isDark ? 'border-slate-700/60' : 'border-slate-100'}`}>
                            <div className="flex items-center gap-5 overflow-x-auto pb-1 scrollbar-hide">
                                {Object.keys(categoryRevenue.categories).map(cat => (
                                    <div key={cat} className="flex flex-col min-w-[72px]">
                                        <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider capitalize">{cat}s</span>
                                        <span className="text-[13px] font-bold" style={{ color: getCategoryColor(cat) }}>
                                            ৳{(categoryRevenue.categories[cat][categoryRevenue.categories[cat].length - 1] || 0).toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Total Revenue</p>
                                <p className={`text-lg font-bold ${headingCls}`}>৳{(data?.totalRevenue || 0).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Summary / Platform Status */}
                <div className={`rounded-xl border p-5 ${cardCls}`}>
                    <div className="flex items-center gap-2.5 mb-5">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-indigo-500/15 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                            <FiActivity size={15} />
                        </div>
                        <h3 className={`text-[15px] font-bold ${headingCls}`}>Platform Status</h3>
                    </div>

                    <div className="space-y-3">
                        <div className={`p-4 rounded-lg border ${isDark ? 'bg-slate-700/30 border-slate-700/60' : 'bg-slate-50 border-slate-100'}`}>
                            <p className="text-[11px] text-slate-400 mb-1">Monthly Revenue</p>
                            <h4 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>৳{(data?.monthlyRevenue || 0).toLocaleString()}</h4>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className={`p-4 rounded-lg border ${isDark ? 'bg-slate-700/30 border-slate-700/60' : 'bg-slate-50 border-slate-100'}`}>
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Orders</p>
                                <h4 className="text-lg font-bold text-emerald-600">{data?.totalOrders || 0}</h4>
                            </div>
                            <div className={`p-4 rounded-lg border ${isDark ? 'bg-slate-700/30 border-slate-700/60' : 'bg-slate-50 border-slate-100'}`}>
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">New Users</p>
                                <h4 className="text-lg font-bold text-blue-600">+{data?.newUsersThisMonth || 0}</h4>
                            </div>
                        </div>

                        <div className={`p-4 rounded-lg border ${isDark ? 'bg-slate-700/30 border-slate-700/60' : 'bg-slate-50 border-slate-100'}`}>
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Completed Orders</span>
                                <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-500 text-[9px] font-bold rounded-full tracking-wide">DONE</span>
                            </div>
                            <h4 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{data?.completedOrders || 0}</h4>
                        </div>

                        <div className={`p-4 rounded-lg border ${isDark ? 'bg-slate-700/30 border-slate-700/60' : 'bg-slate-50 border-slate-100'}`}>
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Pending Orders</span>
                                <span className="px-2 py-0.5 bg-amber-500/15 text-amber-500 text-[9px] font-bold rounded-full tracking-wide">ACTION</span>
                            </div>
                            <h4 className="text-lg font-bold text-amber-500">{data?.pendingOrders || 0}</h4>
                        </div>
                    </div>
                </div>
            </div>

            {/* Metrics Grid: Products & Insights */}
            <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                    { title: 'Websites', value: data?.totalWebsites || 0, icon: FiGlobe, accent: { light: 'bg-emerald-50 text-emerald-600', dark: 'bg-emerald-500/15 text-emerald-400' } },
                    { title: 'Software', value: data?.totalSoftware || 0, icon: FiCode, accent: { light: 'bg-indigo-50 text-indigo-600', dark: 'bg-indigo-500/15 text-indigo-400' } },
                    { title: 'Orders', value: data?.totalOrders || 0, icon: FiShoppingBag, accent: { light: 'bg-amber-50 text-amber-600', dark: 'bg-amber-500/15 text-amber-400' } },
                    { title: 'Users', value: data?.totalUsers || 0, icon: FiUsers, accent: { light: 'bg-blue-50 text-blue-600', dark: 'bg-blue-500/15 text-blue-400' } },
                    { title: 'Categories', value: data?.totalCategories || 0, icon: FiLayers, accent: { light: 'bg-violet-50 text-violet-600', dark: 'bg-violet-500/15 text-violet-400' } },
                    { title: 'Likes', value: data?.totalLikes || 0, icon: FiActivity, accent: { light: 'bg-rose-50 text-rose-500', dark: 'bg-rose-500/15 text-rose-400' } },
                ].map((item) => (
                    <div key={item.title} className={`rounded-xl border p-3.5 flex flex-col items-center justify-center text-center group transition-all hover:-translate-y-0.5 ${isDark ? 'bg-slate-800 border-slate-700/60 hover:border-slate-600' : 'bg-white border-slate-200/70 shadow-sm hover:shadow-md'}`}>
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2 transition-transform group-hover:scale-110 ${isDark ? item.accent.dark : item.accent.light}`}>
                            <item.icon size={15} />
                        </div>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{item.title}</p>
                        <p className={`text-lg font-bold tracking-tight ${headingCls}`}>{loading ? '...' : item.value}</p>
                    </div>
                ))}
            </div>

            {/* Recent Purchases & Top Products */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                {/* Recent Purchases */}
                <div className={`xl:col-span-2 rounded-xl border overflow-hidden ${cardCls}`}>
                    <div className={`flex items-center justify-between px-5 py-4 border-b ${isDark ? 'border-slate-700/60' : 'border-slate-100'}`}>
                        <div>
                            <h3 className={`text-[15px] font-bold ${headingCls}`}>Recent Purchases</h3>
                            <p className="text-xs text-slate-400 mt-0.5">Latest transactions from your customers</p>
                        </div>
                        <button className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold transition-all">
                            View All
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className={isDark ? 'bg-slate-900/40' : 'bg-slate-50/70'}>
                                <tr>
                                    <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Customer</th>
                                    <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Product</th>
                                    <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Amount</th>
                                    <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${isDark ? 'divide-slate-700/60' : 'divide-slate-100'}`}>
                                {recentPurchases.length > 0 ? (
                                    recentPurchases.map((purchase) => (
                                        <tr key={purchase._id} className={`transition-colors group ${isDark ? 'hover:bg-slate-700/20' : 'hover:bg-slate-50/60'}`}>
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                                                        {(purchase.user?.firstName || 'U')[0]}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className={`text-[13px] font-semibold truncate ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{purchase.user?.firstName}</p>
                                                        <p className="text-[10px] text-slate-400 truncate">{purchase.user?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className={`px-5 py-3 text-[13px] truncate max-w-[180px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                                {purchase.items?.[0]?.title || 'Product'}
                                            </td>
                                            <td className={`px-5 py-3 font-bold text-[13px] ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>৳{purchase.totalAmount?.toLocaleString()}</td>
                                            <td className="px-5 py-3">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold capitalize ${purchase.paymentStatus === 'completed'
                                                    ? (isDark ? 'bg-emerald-500/15 text-emerald-400' : 'bg-emerald-50 text-emerald-600')
                                                    : (isDark ? 'bg-amber-500/15 text-amber-400' : 'bg-amber-50 text-amber-600')
                                                    }`}>
                                                    {purchase.paymentStatus}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-5 py-10 text-center text-slate-400 text-sm">No recent transactions.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Products */}
                <div className={`rounded-xl border flex flex-col ${cardCls}`}>
                    <div className={`px-5 py-4 border-b ${isDark ? 'border-slate-700/60' : 'border-slate-100'}`}>
                        <h3 className={`text-[15px] font-bold ${headingCls}`}>Top Products</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Most popular items</p>
                    </div>
                    <div className="p-5 space-y-4 flex-1">
                        {topProducts.length > 0 ? (
                            topProducts.map((product, idx) => (
                                <div key={product._id} className="flex items-center gap-3 group">
                                    <div className="relative shrink-0">
                                        <div className={`w-11 h-11 rounded-lg border flex items-center justify-center overflow-hidden ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-100 border-slate-200'
                                            }`}>
                                            {product.images?.[0] ? (
                                                <img src={product.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            ) : (
                                                <FiPackage className="text-slate-300 text-lg" />
                                            )}
                                        </div>
                                        <div className={`absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full shadow-sm border flex items-center justify-center text-[9px] font-bold ${isDark ? 'bg-slate-800 border-slate-700 text-indigo-400' : 'bg-white border-slate-100 text-indigo-600'}`}>
                                            {idx + 1}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className={`text-[13px] font-semibold truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>{product.title}</h4>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[10px] text-slate-400 font-medium">{product.salesCount || 0} sales</span>
                                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                            <span className="text-[10px] text-emerald-600 font-bold">৳{((product.salesCount || 0) * (product.price || 0)).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-slate-400 text-sm py-10">No data available.</p>
                        )}
                    </div>
                    <div className={`p-4 border-t ${isDark ? 'border-slate-700/60' : 'border-slate-100'}`}>
                        <button className={`w-full py-2 text-[11px] font-semibold rounded-lg transition-all uppercase tracking-wider ${isDark ? 'text-indigo-400 hover:bg-slate-700/40' : 'text-indigo-600 hover:bg-indigo-50'}`}>
                            View Detailed Analysis
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
