'use client';

import React, { useEffect, useState } from 'react';
import {
    FiShoppingBag, FiSearch, FiRefreshCw, FiEye,
    FiChevronLeft, FiChevronRight, FiUser,
    FiDollarSign, FiPackage, FiCheck, FiClock, FiX,
    FiCalendar, FiMail, FiPhone, FiEdit3, FiSave,
    FiCreditCard, FiHash, FiMapPin, FiAlertCircle, FiTrash2
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '@/config/api';

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const [editMode, setEditMode] = useState(false);
    const [editStatus, setEditStatus] = useState('');
    const [saving, setSaving] = useState(false);

    const BASE_URL = API_BASE_URL;

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await fetch(`${BASE_URL}/orders/admin/all`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setOrders(data.data || []);
        } catch (err) {
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleUpdateStatus = async () => {
        if (!selectedOrder || !editStatus) return;
        try {
            setSaving(true);
            const token = localStorage.getItem('token');
            const res = await fetch(`${BASE_URL}/orders/admin/${selectedOrder._id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ status: editStatus })
            });
            if (res.ok) {
                toast.success('Order status updated!');
                setEditMode(false);
                setSelectedOrder(null);
                fetchOrders();
            } else {
                toast.error('Failed to update');
            }
        } catch (err) {
            toast.error('Failed to update order');
        } finally {
            setSaving(false);
        }
    };

    const handleApproveInstallment = async (orderId, installmentNumber, status) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${BASE_URL}/orders/admin/approve-installment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ orderId, installmentNumber, status })
            });
            if (res.ok) {
                toast.success(`Installment #${installmentNumber} ${status === 'completed' ? 'approved' : 'rejected'}!`);
                await fetchOrders();
                if (selectedOrder && selectedOrder._id === orderId) {
                    const updatedRes = await fetch(`${BASE_URL}/orders/admin/all`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const updatedData = await updatedRes.json();
                    const newOrder = (updatedData.data || []).find(o => o._id === orderId);
                    if (newOrder) setSelectedOrder(newOrder);
                }
            } else {
                toast.error('Failed to update installment');
            }
        } catch (err) {
            toast.error('Error updating installment');
        }
    };

    const handleDeleteOrder = async (orderId) => {
        if (!confirm('Are you sure you want to delete this order?\n\nThis will permanently remove:\n• The order\n• Related downloads\n• Course enrollments\n\nThis action cannot be undone!')) {
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${BASE_URL}/orders/admin/${orderId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                toast.success('Order deleted successfully!');
                setSelectedOrder(null);
                fetchOrders();
            } else {
                toast.error('Failed to delete order');
            }
        } catch (err) {
            toast.error('Error deleting order');
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchSearch =
            order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
        let matchStatus = statusFilter === 'all' || order.paymentStatus === statusFilter;
        if (statusFilter === 'installment') matchStatus = order.isInstallment === true && !order.isBooking;
        if (statusFilter === 'booking') matchStatus = order.isBooking === true;
        return matchSearch && matchStatus;
    });

    const itemsPerPage = 10;
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const getPaymentStyle = (status) => {
        switch (status) {
            case 'completed': return 'bg-emerald-100 text-emerald-700';
            case 'pending': return 'bg-amber-100 text-amber-700';
            case 'failed': return 'bg-red-100 text-red-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed': return <FiCheck className="text-emerald-500" size={12} />;
            case 'pending': return <FiClock className="text-amber-500" size={12} />;
            case 'failed': return <FiX className="text-red-500" size={12} />;
            default: return null;
        }
    };

    // Calculate installment stats
    const getInstallmentStats = (order) => {
        if (!order.installments || order.installments.length === 0) {
            return { totalPaid: 0, remaining: order.totalAmount || 0, completedCount: 0, totalCount: 0 };
        }
        const completedInstallments = order.installments.filter(i => i.status === 'completed');
        const totalPaid = completedInstallments.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
        const remaining = (order.totalAmount || 0) - totalPaid;
        return { totalPaid, remaining, completedCount: completedInstallments.length, totalCount: order.installments.length };
    };

    // Calculate actual paid revenue (including partial installments)
    const totalRevenue = orders.reduce((sum, order) => {
        // For full payment completed orders (no installments)
        if (order.paymentStatus === 'completed' && (!order.installments || order.installments.length === 0)) {
            return sum + (order.totalAmount || 0);
        }
        // For installment/booking orders - count only completed installments
        if (order.installments && order.installments.length > 0) {
            const paidAmount = order.installments
                .filter(i => i.status === 'completed')
                .reduce((instSum, i) => instSum + (Number(i.amount) || 0), 0);
            return sum + paidAmount;
        }
        return sum;
    }, 0);

    const pendingOrders = orders.filter(o => o.paymentStatus === 'pending').length;
    const completedOrders = orders.filter(o => o.paymentStatus === 'completed').length;

    const openOrderDetails = (order) => {
        setSelectedOrder(order);
        setEditStatus(order.paymentStatus);
        setEditMode(false);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                        <FiShoppingBag className="text-white text-xl" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">Orders Management</h1>
                        <p className="text-sm text-slate-500">{orders.length} total orders</p>
                    </div>
                </div>
                <button onClick={fetchOrders} disabled={loading} className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition-all disabled:opacity-50">
                    <FiRefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="bg-white rounded-2xl border border-slate-200/60 p-6 hover:shadow-lg transition-all">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-lg">
                            <FiDollarSign size={22} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-800">৳{totalRevenue.toLocaleString()}</p>
                            <p className="text-sm text-slate-500">Total Revenue</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200/60 p-6 hover:shadow-lg transition-all">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg">
                            <FiClock size={22} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-800">{pendingOrders}</p>
                            <p className="text-sm text-slate-500">Pending Orders</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200/60 p-6 hover:shadow-lg transition-all">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-lg">
                            <FiCheck size={22} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-800">{completedOrders}</p>
                            <p className="text-sm text-slate-500">Completed</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-slate-200/60 p-4 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by order number, customer name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
                        {['all', 'completed', 'pending', 'failed', 'installment', 'booking'].map(status => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wide transition-all whitespace-nowrap ${statusFilter === status ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                            >
                                {status === 'all' ? 'All' : status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Order</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Payment Info</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-16 text-center">
                                        <FiRefreshCw className="animate-spin mx-auto mb-3 text-indigo-500" size={28} />
                                        <p className="text-slate-500">Loading orders...</p>
                                    </td>
                                </tr>
                            ) : paginatedOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-16 text-center">
                                        <FiShoppingBag className="mx-auto mb-3 text-slate-300" size={32} />
                                        <p className="text-slate-500">No orders found</p>
                                    </td>
                                </tr>
                            ) : (
                                paginatedOrders.map((order) => {
                                    const stats = getInstallmentStats(order);
                                    const isInstallmentOrder = (order.isInstallment || order.isBooking) && stats.totalCount > 0;
                                    const hasPendingPayment = order.installments?.some(i => i.status === 'pending' && i.paymentDetails);

                                    return (
                                        <tr key={order._id} className={`hover:bg-slate-50 transition-colors ${hasPendingPayment ? 'bg-amber-50/50' : ''}`}>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 w-fit">
                                                        #{order.orderNumber || order._id?.slice(-6).toUpperCase()}
                                                    </span>
                                                    {order.isBooking && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-600 uppercase w-fit">Booking</span>}
                                                    {order.isInstallment && !order.isBooking && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-600 uppercase w-fit">Installment</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                                                        {order.user?.firstName?.charAt(0) || 'U'}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-slate-800 text-sm">{order.user?.firstName} {order.user?.lastName}</p>
                                                        <p className="text-xs text-slate-500">{order.user?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-bold text-emerald-600 text-lg">৳{order.totalAmount?.toLocaleString()}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {isInstallmentOrder ? (
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(stats.completedCount / stats.totalCount) * 100}%` }} />
                                                            </div>
                                                            <span className="text-[10px] font-bold text-slate-500">{stats.completedCount}/{stats.totalCount}</span>
                                                        </div>
                                                        <p className="text-[10px]">
                                                            <span className="text-emerald-600 font-semibold">Paid: ৳{stats.totalPaid.toLocaleString()}</span>
                                                            <span className="mx-1 text-slate-300">|</span>
                                                            <span className="text-orange-500 font-semibold">Due: ৳{stats.remaining.toLocaleString()}</span>
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-slate-400">Full Payment</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold capitalize w-fit ${getPaymentStyle(order.paymentStatus)}`}>
                                                        {getStatusIcon(order.paymentStatus)}
                                                        {order.paymentStatus}
                                                    </span>
                                                    {hasPendingPayment && (
                                                        <span className="text-[9px] font-bold text-amber-600 animate-pulse">⚡ Action Required</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-slate-600">
                                                    {order.orderDate ? new Date(order.orderDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => openOrderDetails(order)} className="p-2.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition-colors" title="View Details">
                                                        <FiEye size={16} />
                                                    </button>
                                                    <button onClick={() => handleDeleteOrder(order._id)} className="p-2.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors" title="Delete Order">
                                                        <FiTrash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
                        <p className="text-sm text-slate-500">
                            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length}
                        </p>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 transition-all">
                                <FiChevronLeft size={16} />
                            </button>
                            <span className="px-3 py-1 text-sm font-medium text-slate-600">{currentPage} / {totalPages}</span>
                            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 transition-all">
                                <FiChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-white">Order Details</h3>
                                    <p className="text-indigo-100 text-sm flex items-center gap-2 mt-1">
                                        <FiHash size={14} /> {selectedOrder.orderNumber || selectedOrder._id?.slice(-6).toUpperCase()}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {!editMode ? (
                                        <button onClick={() => setEditMode(true)} className="p-2 hover:bg-white/20 rounded-lg text-white transition-all flex items-center gap-2">
                                            <FiEdit3 size={16} /> Edit
                                        </button>
                                    ) : (
                                        <button onClick={handleUpdateStatus} disabled={saving} className="px-4 py-2 bg-white text-indigo-600 rounded-lg font-semibold text-sm flex items-center gap-2 hover:bg-indigo-50 transition-all disabled:opacity-50">
                                            <FiSave size={16} /> {saving ? 'Saving...' : 'Save'}
                                        </button>
                                    )}
                                    <button onClick={() => handleDeleteOrder(selectedOrder._id)} className="p-2 hover:bg-red-500/80 bg-red-500/50 rounded-lg text-white transition-all flex items-center gap-2" title="Delete Order">
                                        <FiTrash2 size={16} />
                                    </button>
                                    <button onClick={() => { setSelectedOrder(null); setEditMode(false); }} className="p-2 hover:bg-white/20 rounded-lg text-white transition-all">
                                        <FiX size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Order Info */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-slate-50 rounded-xl p-4">
                                    <p className="text-xs text-slate-500 mb-1">Order Date</p>
                                    <p className="font-semibold text-slate-800 text-sm">
                                        {selectedOrder.orderDate ? new Date(selectedOrder.orderDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}
                                    </p>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-4">
                                    <p className="text-xs text-slate-500 mb-1">Order Time</p>
                                    <p className="font-semibold text-slate-800 text-sm">
                                        {selectedOrder.orderDate ? new Date(selectedOrder.orderDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                                    </p>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-4">
                                    <p className="text-xs text-slate-500 mb-1">Payment Method</p>
                                    <p className="font-semibold text-slate-800 text-sm capitalize flex items-center gap-2">
                                        <FiCreditCard size={14} className="text-indigo-500" />
                                        {selectedOrder.paymentMethod || 'N/A'}
                                    </p>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-4">
                                    <p className="text-xs text-slate-500 mb-1">Payment Status</p>
                                    {editMode ? (
                                        <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-300 focus:border-indigo-400 outline-none text-sm font-semibold">
                                            <option value="pending">Pending</option>
                                            <option value="completed">Completed</option>
                                            <option value="failed">Failed</option>
                                            <option value="refunded">Refunded</option>
                                        </select>
                                    ) : (
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold capitalize ${getPaymentStyle(selectedOrder.paymentStatus)}`}>
                                            {getStatusIcon(selectedOrder.paymentStatus)}
                                            {selectedOrder.paymentStatus}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Customer Info */}
                            <div className="bg-slate-50 rounded-xl p-5">
                                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Customer Information</h4>
                                <div className="flex items-start gap-4">
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                                        {selectedOrder.user?.firstName?.charAt(0) || 'U'}
                                    </div>
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <p className="text-xs text-slate-500">Full Name</p>
                                            <p className="font-semibold text-slate-800">{selectedOrder.user?.firstName} {selectedOrder.user?.lastName}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500">Email</p>
                                            <p className="font-semibold text-slate-800 flex items-center gap-1">
                                                <FiMail size={12} className="text-slate-400" />
                                                {selectedOrder.user?.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div>
                                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Order Items ({selectedOrder.items?.length || 0})</h4>
                                <div className="space-y-3">
                                    {selectedOrder.items?.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-white shadow-sm shrink-0">
                                                {item.image ? <img src={item.image} alt={item.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-slate-100"><FiPackage className="text-slate-300" size={24} /></div>}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-slate-800">{item.title}</p>
                                                <span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-600 rounded capitalize">{item.productType}</span>
                                            </div>
                                            <span className="text-xl font-bold text-emerald-600">৳{item.price?.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl p-6 text-white">
                                <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/20">
                                    <span className="text-indigo-100">Subtotal</span>
                                    <span className="font-semibold">৳{selectedOrder.totalAmount?.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-semibold">Total Amount</span>
                                    <span className="text-3xl font-bold">৳{selectedOrder.totalAmount?.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Payment Proof */}
                            {selectedOrder.manualPaymentDetails && (
                                <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
                                    <h4 className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-3">Payment Proof</h4>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                        <div><p className="text-xs text-amber-500">Provider</p><p className="font-bold text-slate-800 uppercase">{selectedOrder.manualPaymentDetails.provider}</p></div>
                                        <div><p className="text-xs text-amber-500">Account</p><p className="font-bold text-slate-800">{selectedOrder.manualPaymentDetails.accountNumber}</p></div>
                                        <div><p className="text-xs text-amber-500">Transaction ID</p><p className="font-mono font-bold text-amber-700">{selectedOrder.manualPaymentDetails.transactionId}</p></div>
                                        <div><p className="text-xs text-amber-500">Date & Time</p><p className="font-bold text-slate-800">{selectedOrder.manualPaymentDetails.date} • {selectedOrder.manualPaymentDetails.time}</p></div>
                                    </div>
                                </div>
                            )}

                            {/* Installments */}
                            {(selectedOrder.isInstallment || selectedOrder.isBooking) && selectedOrder.installments?.length > 0 && (
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                            {selectedOrder.isBooking ? 'Booking Payments' : 'Installment Schedule'}
                                        </h4>
                                        <div className="text-xs">
                                            <span className="text-emerald-600 font-bold">Paid: ৳{getInstallmentStats(selectedOrder).totalPaid.toLocaleString()}</span>
                                            <span className="mx-2 text-slate-300">|</span>
                                            <span className="text-orange-500 font-bold">Due: ৳{getInstallmentStats(selectedOrder).remaining.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        {selectedOrder.installments.map((inst, idx) => (
                                            <div key={idx} className={`p-4 rounded-xl border ${inst.status === 'completed' ? 'bg-emerald-50 border-emerald-200' : inst.paymentDetails ? 'bg-amber-50 border-amber-300' : 'bg-slate-50 border-slate-200'}`}>
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${inst.status === 'completed' ? 'bg-emerald-500 text-white' : inst.paymentDetails ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-600'}`}>
                                                            {inst.status === 'completed' ? <FiCheck size={18} /> : inst.installmentNumber}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-800">৳{inst.amount?.toLocaleString()}</p>
                                                            <p className="text-xs text-slate-500">Due: {new Date(inst.dueDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</p>
                                                        </div>
                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${inst.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : inst.status === 'failed' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                                                            {inst.status}
                                                        </span>
                                                    </div>
                                                    {inst.paymentDetails && (
                                                        <div className="text-[10px] bg-white px-2 py-1 rounded border border-slate-200">
                                                            <span className="font-bold uppercase text-slate-500">{inst.paymentDetails.provider}:</span> {inst.paymentDetails.accountNumber} | <span className="font-mono text-indigo-600">{inst.paymentDetails.transactionId}</span>
                                                        </div>
                                                    )}
                                                    {inst.status !== 'completed' && (
                                                        <div className="flex gap-2">
                                                            <button onClick={() => handleApproveInstallment(selectedOrder._id, inst.installmentNumber, 'completed')} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1">
                                                                <FiCheck size={12} /> Approve
                                                            </button>
                                                            <button onClick={() => handleApproveInstallment(selectedOrder._id, inst.installmentNumber, 'failed')} className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-bold flex items-center gap-1">
                                                                <FiX size={12} /> Reject
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
