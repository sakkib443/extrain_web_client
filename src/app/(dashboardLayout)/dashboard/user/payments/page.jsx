'use client';

import React, { useEffect, useState } from 'react';
import {
    FiCreditCard, FiClock, FiCheck, FiX, FiAlertCircle,
    FiRefreshCw, FiChevronRight, FiHash, FiCalendar,
    FiSmartphone, FiArrowRight, FiShield
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useTheme } from '@/providers/ThemeProvider';
import { API_BASE_URL } from '@/config/api';

export default function UserPaymentsPage() {
    const { isDark } = useTheme();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showPayModal, setShowPayModal] = useState(false);
    const [activeInstallment, setActiveInstallment] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const [paymentForm, setPaymentForm] = useState({
        provider: 'bkash',
        accountNumber: '',
        transactionId: '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
    });

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/orders/my`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            // Filter only installment orders
            setOrders(data.data?.filter(o => o.isInstallment) || []);
        } catch (err) {
            console.error('Error fetching payments:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handlePaySubmit = async (e) => {
        e.preventDefault();
        if (!selectedOrder || !activeInstallment) return;

        try {
            setSubmitting(true);
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/orders/pay-installment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    orderId: selectedOrder._id,
                    installmentNumber: activeInstallment.installmentNumber,
                    paymentDetails: paymentForm
                })
            });

            if (res.ok) {
                toast.success('Payment proof submitted! Waiting for admin approval.');
                setShowPayModal(false);
                fetchOrders();
            } else {
                toast.error('Failed to submit payment proof');
            }
        } catch (err) {
            toast.error('Submission error');
        } finally {
            setSubmitting(false);
        }
    };

    const cardClass = `rounded-2xl border transition-all duration-300 ${isDark
        ? 'bg-slate-800/50 border-white/5'
        : 'bg-white border-slate-200/60 shadow-sm'
        }`;

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className={`p-6 ${cardClass} flex flex-col md:flex-row md:items-center justify-between gap-4 overflow-hidden relative`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full" />
                <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                        <FiCreditCard size={24} />
                    </div>
                    <div>
                        <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>My Installments</h1>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Track and pay your remaining balances</p>
                    </div>
                </div>
                <button
                    onClick={fetchOrders}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${isDark ? 'bg-slate-700 text-slate-200' : 'bg-slate-100 text-slate-600'}`}
                >
                    <FiRefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
                </button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2].map(i => <div key={i} className={`h-64 animate-pulse ${cardClass}`} />)}
                </div>
            ) : orders.length === 0 ? (
                <div className={`p-16 text-center ${cardClass}`}>
                    <FiShield size={48} className="mx-auto mb-4 text-slate-300" />
                    <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>No Installment Orders</h3>
                    <p className="text-slate-500 max-w-xs mx-auto mt-2">You don't have any active installment payments at the moment.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {orders.map((order) => {
                        const completedCount = order.installments?.filter(i => i.status === 'completed').length || 0;
                        const totalCount = order.installments?.length || 1;
                        const progress = (completedCount / totalCount) * 100;

                        return (
                            <motion.div
                                key={order._id}
                                layout
                                className={`${cardClass} overflow-hidden`}
                            >
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row justify-between gap-6">
                                        <div className="space-y-4 flex-1">
                                            <div className="flex items-center gap-3">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-500 text-white`}>
                                                    #{order.orderNumber}
                                                </span>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${order.paymentStatus === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                                    {order.paymentStatus}
                                                </span>
                                            </div>
                                            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                                {order.items?.map(i => i.title).join(', ')}
                                            </h3>

                                            {/* Progress Bar */}
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-xs font-bold">
                                                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Payment Progress</span>
                                                    <span className="text-indigo-500">{completedCount} of {totalCount} Paid</span>
                                                </div>
                                                <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${progress}%` }}
                                                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`md:w-48 p-4 rounded-2xl flex flex-col justify-center items-center text-center ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase">Total Amount</p>
                                            <p className="text-2xl font-black text-indigo-500">৳{order.totalAmount?.toLocaleString()}</p>
                                        </div>
                                    </div>

                                    {/* Installment Items */}
                                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {order.installments?.map((inst) => (
                                            <div
                                                key={inst.installmentNumber}
                                                className={`p-4 rounded-xl border relative overflow-hidden transition-all ${inst.status === 'completed'
                                                        ? isDark ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-emerald-50 border-emerald-100'
                                                        : inst.status === 'pending' && inst.paymentDetails
                                                            ? isDark ? 'bg-amber-500/5 border-amber-500/20' : 'bg-amber-50 border-amber-100'
                                                            : isDark ? 'bg-slate-800/50 border-white/5' : 'bg-slate-50 border-slate-100'
                                                    }`}
                                            >
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${inst.status === 'completed' ? 'bg-emerald-500 text-white' : 'bg-slate-500 text-white'}`}>
                                                        {inst.installmentNumber}
                                                    </div>
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${inst.status === 'completed' ? 'text-emerald-500' :
                                                            inst.status === 'pending' && inst.paymentDetails ? 'text-amber-500' : 'text-slate-400'
                                                        }`}>
                                                        {inst.status === 'pending' && inst.paymentDetails ? 'Waiting Approval' : inst.status}
                                                    </span>
                                                </div>
                                                <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>৳{inst.amount?.toLocaleString()}</p>
                                                <p className={`text-[10px] font-medium mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                                    Due: {new Date(inst.dueDate).toLocaleDateString()}
                                                </p>

                                                {inst.status !== 'completed' && !(inst.status === 'pending' && inst.paymentDetails) && (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedOrder(order);
                                                            setActiveInstallment(inst);
                                                            setShowPayModal(true);
                                                        }}
                                                        className="mt-4 w-full py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2"
                                                    >
                                                        Pay Now <FiArrowRight size={14} />
                                                    </button>
                                                )}

                                                {inst.status === 'completed' && (
                                                    <div className="mt-4 text-emerald-500 flex items-center gap-1.5 text-xs font-bold">
                                                        <FiCheck size={14} /> Paid on {inst.paidAt ? new Date(inst.paidAt).toLocaleDateString() : 'N/A'}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Payment Modal */}
            <AnimatePresence>
                {showPayModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowPayModal(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className={`relative w-full max-w-md ${isDark ? 'bg-slate-900 border border-white/10' : 'bg-white'} rounded-3xl overflow-hidden shadow-2xl`}
                        >
                            <div className="p-6 border-b border-slate-100 dark:border-white/5 bg-gradient-to-r from-indigo-500 to-purple-500">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-bold text-white">Pay Installment #{activeInstallment?.installmentNumber}</h2>
                                    <button onClick={() => setShowPayModal(false)} className="p-2 hover:bg-white/20 rounded-full text-white transition-all">
                                        <FiX size={20} />
                                    </button>
                                </div>
                                <p className="text-indigo-100 text-sm mt-1">Amount to pay: ৳{activeInstallment?.amount?.toLocaleString()}</p>
                            </div>

                            <form onSubmit={handlePaySubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">Select Payment Method</label>
                                    <div className="flex gap-2">
                                        {['bkash', 'rocket', 'nagad'].map(m => (
                                            <button
                                                key={m}
                                                type="button"
                                                onClick={() => setPaymentForm({ ...paymentForm, provider: m })}
                                                className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase border-2 transition-all ${paymentForm.provider === m
                                                        ? 'border-indigo-500 bg-indigo-500/10 text-indigo-500'
                                                        : 'border-slate-100 dark:border-white/5 text-slate-400'
                                                    }`}
                                            >
                                                {m}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Your Number</label>
                                        <div className="relative">
                                            <FiSmartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="text"
                                                required
                                                placeholder="017XXXXXXXX"
                                                value={paymentForm.accountNumber}
                                                onChange={(e) => setPaymentForm({ ...paymentForm, accountNumber: e.target.value })}
                                                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none text-sm ${isDark ? 'bg-slate-800 border-white/5 focus:border-indigo-500' : 'bg-slate-50 border-slate-200 focus:border-indigo-500'}`}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Transaction ID</label>
                                        <div className="relative">
                                            <FiHash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="text"
                                                required
                                                placeholder="TRX123456"
                                                value={paymentForm.transactionId}
                                                onChange={(e) => setPaymentForm({ ...paymentForm, transactionId: e.target.value })}
                                                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none text-sm ${isDark ? 'bg-slate-800 border-white/5 focus:border-indigo-500' : 'bg-slate-50 border-slate-200 focus:border-indigo-500'}`}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Date</label>
                                        <input
                                            type="date"
                                            required
                                            value={paymentForm.date}
                                            onChange={(e) => setPaymentForm({ ...paymentForm, date: e.target.value })}
                                            className={`w-full px-4 py-2.5 rounded-xl border outline-none text-sm ${isDark ? 'bg-slate-800 border-white/5 focus:border-indigo-500' : 'bg-slate-50 border-slate-200 focus:border-indigo-500'}`}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Time</label>
                                        <input
                                            type="time"
                                            required
                                            value={paymentForm.time}
                                            onChange={(e) => setPaymentForm({ ...paymentForm, time: e.target.value })}
                                            className={`w-full px-4 py-2.5 rounded-xl border outline-none text-sm ${isDark ? 'bg-slate-800 border-white/5 focus:border-indigo-500' : 'bg-slate-50 border-slate-200 focus:border-indigo-500'}`}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
                                >
                                    {submitting ? <FiRefreshCw className="animate-spin" /> : <><FiCheck /> Submit Payment Proof</>}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
