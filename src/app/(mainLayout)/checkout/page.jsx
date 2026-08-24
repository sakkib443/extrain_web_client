"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '@/redux/cartSlice';
import { useRouter } from 'next/navigation';
import { LuShieldCheck, LuPackage, LuCreditCard, LuChevronLeft, LuBadgeCheck, LuSmartphone, LuLoader, LuArrowRight, LuTag, LuCheck, LuX, LuZap, LuCreditCard as LuCreditCardIcon } from 'react-icons/lu';
import { useLanguage } from '@/context/LanguageContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '@/config/api';
import { getStoredUser } from '@/lib/authUser';

const CheckoutContent = () => {
    const { items: cartItems, totalAmount: cartTotal } = useSelector((state) => state.cart || { items: [], totalAmount: 0 });
    const dispatch = useDispatch();
    const router = useRouter();
    const { language } = useLanguage();

    const [isSuccess, setIsSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('manual');
    const [checkoutItems, setCheckoutItems] = useState([]);
    const [totalValue, setTotalValue] = useState(0);
    const [isBooking, setIsBooking] = useState(false);
    const [bookingAmount, setBookingAmount] = useState(0);

    // Coupon states
    const [couponCode, setCouponCode] = useState('');
    const [couponApplying, setCouponApplying] = useState(false);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [discountAmount, setDiscountAmount] = useState(0);

    // Installment states
    const [installments, setInstallments] = useState([]);

    // Manual Payment states
    const [manualPayment, setManualPayment] = useState({
        provider: 'bkash',
        accountNumber: '',
        transactionId: '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
    });

    // Auth Check
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error("Please login to proceed");
            router.push('/login?redirect=/checkout');
        }
    }, [router]);

    // Build checkout from cart items
    useEffect(() => {
        setCheckoutItems(cartItems);
        setTotalValue(cartTotal);

        // Check for bookable items
        const bookableItem = cartItems.find(item => {
            const isBookable = item.isBookingAllowed === true || item.isBookingAllowed === 'true';
            const hasAmount = Number(item.bookingAmount) > 0;
            return isBookable && hasAmount;
        });

        if (bookableItem) {
            const amount = Number(bookableItem.bookingAmount);
            setBookingAmount(amount);
        } else {
            setBookingAmount(0);
            setIsBooking(false);
        }

        setPageLoading(false);
    }, [cartItems, cartTotal, router]);

    const totalValueAfterDiscount = totalValue - discountAmount;

    // Combined Booking + Installment logic
    useEffect(() => {
        if (isBooking && bookingAmount > 0) {
            const count = (appliedCoupon?.installmentEnabled && appliedCoupon.installmentCount) ? appliedCoupon.installmentCount : 2;
            const firstAmount = bookingAmount;
            const remaining = totalValueAfterDiscount - firstAmount;

            let list = [{
                installmentNumber: 1,
                amount: firstAmount,
                dueDate: new Date().toISOString(),
                status: 'pending'
            }];

            if (count > 1) {
                const splitAmount = Math.floor(remaining / (count - 1));
                for (let i = 2; i <= count; i++) {
                    const currentAmount = (i === count) ? (remaining - splitAmount * (count - 2)) : splitAmount;
                    list.push({
                        installmentNumber: i,
                        amount: currentAmount,
                        dueDate: new Date(Date.now() + (i - 1) * 7 * 24 * 60 * 60 * 1000).toISOString(),
                        status: 'pending'
                    });
                }
            }
            setInstallments(list);
        } else if (!isBooking && appliedCoupon?.installmentEnabled && appliedCoupon?.originalInstallments) {
            setInstallments(appliedCoupon.originalInstallments);
        }
    }, [isBooking, bookingAmount, totalValueAfterDiscount, appliedCoupon]);

    // Form state
    const [formData, setFormData] = useState({
        fullName: '', email: '', phone: '', address: ''
    });

    useEffect(() => {
        const user = getStoredUser() || {};
        if (user) {
            setFormData({
                fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || ''
            });
        }
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Apply Coupon
    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            toast.error('Enter a coupon code');
            return;
        }
        setCouponApplying(true);
        try {
            const res = await fetch(`${API_BASE_URL}/coupons/apply`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: couponCode.trim(),
                    cartTotal: totalValue,
                    productType: checkoutItems[0]?.type || 'all'
                })
            });
            const data = await res.json();
            if (data.success && data.data?.valid) {
                setAppliedCoupon({
                    code: data.data.couponCode,
                    discountType: data.data.discountType,
                    discountValue: data.data.discountValue,
                    installmentEnabled: data.data.installmentEnabled,
                    installmentCount: data.data.installmentCount,
                    originalInstallments: data.data.installments
                });
                setDiscountAmount(data.data.discount);

                // Set installments if available
                if (data.data.installmentEnabled && data.data.installments) {
                    setInstallments(data.data.installments);
                    toast.success(`Coupon applied! Pay in ${data.data.installmentCount} installments.`);
                } else {
                    setInstallments([]);
                    const message = data.data.discountType === 'fixed_price'
                        ? `Coupon applied! Final price set to ৳${data.data.discountValue}`
                        : `Coupon applied! You save ৳${data.data.discount}`;
                    toast.success(message);
                }
            } else {
                toast.error(data.message || 'Invalid coupon');
            }
        } catch (error) {
            toast.error('Failed to apply coupon');
        } finally {
            setCouponApplying(false);
        }
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setDiscountAmount(0);
        setInstallments([]);
        setCouponCode('');
        toast.success('Coupon removed');
    };

    const handleUpdateInstallment = (index, value) => {
        const numValue = parseInt(value) || 0;
        const totalToDistribute = totalValue - discountAmount;

        let newInstallments = [...installments];
        newInstallments[index].amount = numValue;

        // Auto-calculate the 3rd (last) installment if it exists
        if (newInstallments.length >= 3) {
            let sumFirstTwo = 0;
            for (let i = 0; i < newInstallments.length - 1; i++) {
                sumFirstTwo += newInstallments[i].amount;
            }
            newInstallments[newInstallments.length - 1].amount = Math.max(0, totalToDistribute - sumFirstTwo);
        }

        setInstallments(newInstallments);
    };

    const isInstallmentActive = installments && installments.length > 0;

    // Calculate final amount to pay now
    const finalAmount = isInstallmentActive ? installments[0].amount : totalValueAfterDiscount;
    const remainingAmount = totalValueAfterDiscount - finalAmount;

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('token');

        try {
            const orderData = {
                items: checkoutItems.map(item => ({
                    productId: item.id,
                    productType: item.type,
                    title: item.title,
                    price: item.price,
                    image: item.image
                })),
                paymentMethod: paymentMethod,
                paymentStatus: 'pending',
                couponCode: appliedCoupon?.code,
                discountAmount: discountAmount,
                isInstallment: installments?.length > 0,
                isBooking: isBooking,
                installmentCount: installments?.length || 1,
                installments: installments?.map(inst => ({
                    installmentNumber: inst.installmentNumber,
                    amount: inst.amount,
                    dueDate: inst.dueDate,
                    status: 'pending'
                })),
                manualPaymentDetails: paymentMethod === 'manual' ? manualPayment : undefined
            };

            const orderRes = await fetch(`${API_BASE_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(orderData)
            });

            const orderResult = await orderRes.json();
            if (!orderRes.ok) throw new Error(orderResult.message || 'Order failed');

            const orderId = orderResult.data._id;

            if (paymentMethod === 'bkash') {
                const bkashRes = await fetch(`${API_BASE_URL}/bkash/create-payment`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ orderId, amount: finalAmount, payerReference: formData.phone })
                });

                const bkashResult = await bkashRes.json();
                if (!bkashRes.ok) throw new Error(bkashResult.message || 'bKash failed');

                const executeRes = await fetch(`${API_BASE_URL}/bkash/execute-payment`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ paymentID: bkashResult.data.paymentID })
                });

                if (!executeRes.ok) throw new Error('Payment execution failed');
            }

            toast.success('Order placed successfully! 🎉');
            setIsSuccess(true);
            dispatch(clearCart());

            // Products are delivered manually by admin — send the buyer to their order history.
            setTimeout(() => router.push('/dashboard/user/purchases'), 2500);

        } catch (error) {
            toast.error(error.message || 'Payment failed');
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-3">
                    <LuLoader className="animate-spin text-[#FD9A00]" size={32} />
                    <p className="text-gray-500 text-sm">Preparing checkout...</p>
                </div>
            </div>
        );
    }

    // Products are delivered manually by admin — buyers track everything in Purchase History.
    const getRedirectUrl = () => '/dashboard/user/purchases';

    const getButtonLabel = () => 'Go to Purchase History';

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6"
                >
                    <LuBadgeCheck className="text-emerald-500 text-4xl" />
                </motion.div>
                <h1 className="text-2xl font-bold text-gray-900 mb-3">Order Placed Successfully!</h1>
                <p className="text-gray-500 text-sm text-center max-w-sm mb-6">
                    Thank you for your purchase. Our team will verify your payment and deliver your product shortly via email/WhatsApp. You can track your order anytime in Purchase History.
                </p>
                <button
                    onClick={() => router.push(getRedirectUrl())}
                    className="px-6 py-3 bg-gray-900 text-white rounded-md font-semibold text-sm hover:bg-[#FD9A00] transition-all flex items-center gap-2"
                >
                    {getButtonLabel()} <LuArrowRight size={16} />
                </button>
            </div>
        );
    }

    if (checkoutItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-5">
                    <LuPackage className="text-gray-400 text-2xl" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-3">Your cart is empty</h2>
                <p className="text-gray-500 mb-6 max-w-sm text-sm">Add some products to continue.</p>
                <button onClick={() => router.push('/website')} className="px-6 py-3 bg-[#FD9A00] text-white rounded-md font-semibold text-sm">
                    Browse Templates
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 lg:py-16">
            <div className="container mx-auto px-4 lg:px-20">
                <div className="flex flex-col lg:flex-row gap-10">

                    {/* Left: Billing Form */}
                    <div className="flex-1 space-y-6">
                        <div className="flex items-center gap-3">
                            <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center bg-white rounded-md border border-gray-200 text-gray-400 hover:text-[#FD9A00] transition-all">
                                <LuChevronLeft size={20} />
                            </button>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Secure Checkout</h1>
                                <p className="text-gray-400 text-xs">Complete your purchase</p>
                            </div>
                        </div>

                        {/* Billing Info */}
                        <div className="bg-white p-6 lg:p-8 rounded-md border border-gray-100 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#FD9A00]/10 rounded-md flex items-center justify-center text-[#FD9A00]">
                                    <LuCreditCardIcon size={20} />
                                </div>
                                <h2 className="text-base font-semibold text-gray-800">Personal Details</h2>
                            </div>

                            <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="text-xs font-medium text-gray-500 mb-1.5 block">Full Name</label>
                                    <input
                                        type="text" required name="fullName" value={formData.fullName} onChange={handleInputChange}
                                        placeholder="Enter your full name"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:border-[#FD9A00] focus:bg-white outline-none transition-all text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-500 mb-1.5 block">Email</label>
                                    <input
                                        type="email" required name="email" value={formData.email} onChange={handleInputChange}
                                        placeholder="your@email.com"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:border-[#FD9A00] focus:bg-white outline-none transition-all text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-500 mb-1.5 block">Phone</label>
                                    <input
                                        type="text" required name="phone" value={formData.phone} onChange={handleInputChange}
                                        placeholder="+880 1XXX-XXXXXX"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:border-[#FD9A00] focus:bg-white outline-none transition-all text-sm"
                                    />
                                </div>

                                <div className="md:col-span-2 pt-4 space-y-4">
                                    <h3 className="text-sm font-semibold text-gray-800">Payment Method</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod('bkash')}
                                            className={`p-4 rounded-md border flex items-center gap-3 transition-all ${paymentMethod === 'bkash'
                                                ? 'border-pink-500 bg-pink-50'
                                                : 'border-gray-200 hover:border-gray-300 bg-white'
                                                }`}
                                        >
                                            <div className="w-10 h-10 bg-pink-500 rounded-md flex items-center justify-center">
                                                <LuSmartphone className="text-white" size={20} />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-semibold text-gray-800 text-sm">bKash</p>
                                                <p className="text-xs text-gray-400">Instant Pay</p>
                                            </div>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod('manual')}
                                            className={`p-4 rounded-md border flex items-center gap-3 transition-all ${paymentMethod === 'manual'
                                                ? 'border-gray-900 bg-gray-900'
                                                : 'border-gray-200 hover:border-gray-300 bg-white'
                                                }`}
                                        >
                                            <div className={`w-10 h-10 rounded-md flex items-center justify-center ${paymentMethod === 'manual' ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'}`}>
                                                <LuCreditCardIcon size={20} />
                                            </div>
                                            <div className="text-left">
                                                <p className={`font-semibold text-sm ${paymentMethod === 'manual' ? 'text-white' : 'text-gray-800'}`}>Manual</p>
                                                <p className="text-xs text-gray-400">Nagad, bKash, Rocket</p>
                                            </div>
                                        </button>
                                    </div>

                                    {/* Manual Payment Section */}
                                    {paymentMethod === 'manual' && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-4 bg-gray-50 rounded-md border border-gray-200 space-y-4"
                                        >
                                            {isInstallmentActive && (
                                                <div className="flex items-center gap-2 p-3 bg-[#FD9A00]/5 border border-[#FD9A00]/20 rounded-md mb-4">
                                                    <div className="w-8 h-8 bg-[#FD9A00] rounded flex items-center justify-center text-white shrink-0 shadow-sm">
                                                        <LuBadgeCheck size={16} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black text-[#FD9A00] uppercase tracking-tighter">{isBooking ? 'Booking Amount Required' : 'Initial Payment Required'}</p>
                                                        <p className="text-[10px] text-[#FD9A00]/60 font-medium">Pay exactly ৳{finalAmount.toLocaleString()} to activate your access</p>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="col-span-2">
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Select Method</label>
                                                    <div className="flex gap-2">
                                                        {['bkash', 'rocket', 'nagad'].map((p) => (
                                                            <button
                                                                key={p}
                                                                type="button"
                                                                onClick={() => setManualPayment({ ...manualPayment, provider: p })}
                                                                className={`px-4 py-2 rounded-md text-xs font-bold uppercase transition-all ${manualPayment.provider === p
                                                                    ? 'bg-rose-600 text-white'
                                                                    : 'bg-white text-gray-400 border border-gray-200'
                                                                    }`}
                                                            >
                                                                {p}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Your Number</label>
                                                    <input
                                                        type="text"
                                                        required={paymentMethod === 'manual'}
                                                        placeholder="017XXXXXXXX"
                                                        value={manualPayment.accountNumber}
                                                        onChange={(e) => setManualPayment({ ...manualPayment, accountNumber: e.target.value })}
                                                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm outline-none focus:border-rose-600"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Transaction ID</label>
                                                    <input
                                                        type="text"
                                                        required={paymentMethod === 'manual'}
                                                        placeholder="TRX12345678"
                                                        value={manualPayment.transactionId}
                                                        onChange={(e) => setManualPayment({ ...manualPayment, transactionId: e.target.value })}
                                                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm outline-none focus:border-rose-600"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Date</label>
                                                    <input
                                                        type="date"
                                                        required={paymentMethod === 'manual'}
                                                        value={manualPayment.date}
                                                        onChange={(e) => setManualPayment({ ...manualPayment, date: e.target.value })}
                                                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm outline-none focus:border-rose-600"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Time</label>
                                                    <input
                                                        type="time"
                                                        required={paymentMethod === 'manual'}
                                                        value={manualPayment.time}
                                                        onChange={(e) => setManualPayment({ ...manualPayment, time: e.target.value })}
                                                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm outline-none focus:border-rose-600"
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                <div className="md:col-span-2 pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3.5 bg-[#FD9A00] hover:bg-teal-500 disabled:bg-gray-300 text-white rounded-md font-semibold text-sm shadow-lg transition-all flex items-center justify-center gap-3"
                                    >
                                        {loading ? (
                                            <><LuLoader className="animate-spin" size={18} /> Processing...</>
                                        ) : (
                                            <>Confirm Payment <LuArrowRight size={16} /></>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="w-full lg:w-[380px]">
                        <div className="bg-white p-6 rounded-md border border-gray-100 space-y-6 lg:sticky lg:top-8">
                            <h3 className="text-base font-semibold text-gray-800 border-b border-gray-100 pb-4">Order Summary</h3>

                            <div className="space-y-4 max-h-[300px] overflow-y-auto">
                                {checkoutItems.map((item) => (
                                    <div key={item.id} className="flex gap-3 items-center">
                                        <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 shrink-0">
                                            <img src={item.image} alt={`Cart Item: ${item.title}`} className="w-full h-full object-cover" />
                                        </div>

                                        {/* Debug Info (Only visible if something is wrong) */}
                                        {false && (
                                            <div className="text-[8px] text-gray-300">
                                                Debug: amount={bookingAmount}, items={checkoutItems.length}, bookable={checkoutItems.some(i => i.isBookingAllowed)}
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-semibold text-gray-800 line-clamp-1">{item.title}</h4>
                                            <span className="text-xs text-gray-400 uppercase">{item.type}</span>
                                        </div>
                                        <div className="text-gray-900 font-semibold text-sm">৳{item.price?.toLocaleString()}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Booking Choice */}
                            {bookingAmount > 0 && (
                                <div className="p-4 bg-rose-50 border border-rose-100 rounded-md space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-rose-500 rounded flex items-center justify-center text-white shrink-0">
                                            <LuZap size={14} />
                                        </div>
                                        <h4 className="text-xs font-bold text-rose-700 uppercase">Booking Option Available</h4>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setIsBooking(false)}
                                            className={`py-2 px-3 rounded text-[10px] font-bold uppercase transition-all ${!isBooking
                                                ? 'bg-rose-600 text-white shadow-sm'
                                                : 'bg-white text-rose-600 border border-rose-200'
                                                }`}
                                        >
                                            Full Payment
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsBooking(true)}
                                            className={`py-2 px-3 rounded text-[10px] font-bold uppercase transition-all ${isBooking
                                                ? 'bg-rose-600 text-white shadow-sm'
                                                : 'bg-white text-rose-600 border border-rose-200'
                                                }`}
                                        >
                                            Book Now (৳{bookingAmount})
                                        </button>
                                    </div>
                                    {isBooking && (
                                        <p className="text-[10px] text-rose-600/70 italic leading-tight">
                                            * Pay ৳{bookingAmount} today and the remaining ৳{remainingAmount.toLocaleString()} after completion.
                                        </p>
                                    )}
                                </div>
                            )}

                            <div className="pt-4 space-y-4 border-t border-gray-100">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-slate-500">Subtotal</span>
                                    <span className="text-sm font-bold text-slate-800">৳{totalValue.toLocaleString()}</span>
                                </div>

                                {/* Coupon Section */}
                                <div className="py-2.5">
                                    {appliedCoupon ? (
                                        <div className="flex items-center justify-between bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/50">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-sm">
                                                    <LuTag className="text-white" size={14} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-emerald-800 text-xs tracking-tight">{appliedCoupon.code}</p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-[10px] font-bold text-emerald-600 bg-white px-1.5 py-0.5 rounded border border-emerald-100 uppercase">
                                                            {appliedCoupon.discountType === 'percentage' ? `${appliedCoupon.discountValue}% OFF` : `৳${appliedCoupon.discountValue} OFF`}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button onClick={removeCoupon} className="text-slate-400 hover:text-red-500 p-1.5 hover:bg-white rounded-lg transition-all">
                                                <LuX size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <div className="flex-1 relative">
                                                <LuTag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                                <input
                                                    type="text"
                                                    placeholder="COUPON CODE"
                                                    value={couponCode}
                                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold uppercase focus:border-[#FD9A00] outline-none transition-all"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleApplyCoupon}
                                                disabled={couponApplying}
                                                className="px-4 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-[#FD9A00] transition-all disabled:opacity-50"
                                            >
                                                {couponApplying ? <LuLoader className="animate-spin" size={14} /> : 'APPLY'}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {discountAmount > 0 && (
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-slate-500">Discount</span>
                                            {appliedCoupon?.discountType === 'percentage' && (
                                                <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase">-{appliedCoupon.discountValue}%</span>
                                            )}
                                            {appliedCoupon?.discountType === 'fixed_price' && (
                                                <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-black uppercase">FIXED PRICE</span>
                                            )}
                                        </div>
                                        <span className="text-sm font-bold text-emerald-600">-৳{discountAmount.toLocaleString()}</span>
                                    </div>
                                )}

                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-slate-500">Processing Fee</span>
                                    <span className="text-sm font-bold text-indigo-500 uppercase tracking-wider">Free</span>
                                </div>

                                {/* Installment Schedule */}
                                {isInstallmentActive && (
                                    <div className="py-5 space-y-4 border-t border-b border-slate-100 bg-slate-50/30 -mx-6 px-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 bg-slate-800 rounded-md flex items-center justify-center text-white">
                                                <LuCreditCardIcon size={14} />
                                            </div>
                                            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                                {isBooking ? 'Booking Payment Schedule' : 'Installment Plan'}
                                            </span>
                                        </div>

                                        <div className="space-y-2.5">
                                            {installments.map((inst, idx) => {
                                                const isEditable = !isBooking && idx < installments.length - 1 && installments.length >= 3;
                                                return (
                                                    <div key={idx} className={`flex justify-between items-center p-3 rounded-md border transition-all ${idx === 0 ? 'bg-white border-[#FD9A00] shadow-sm' : 'bg-white border-slate-100 opacity-90'}`}>
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-6 h-6 flex items-center justify-center rounded-md text-[10px] font-semibold ${idx === 0 ? 'bg-[#FD9A00] text-white' : 'bg-slate-100 text-slate-500'}`}>
                                                                {inst.installmentNumber}
                                                            </div>
                                                            <div>
                                                                <p className={`text-[10px] font-semibold uppercase tracking-tight leading-none mb-1 ${idx === 0 ? 'text-[#FD9A00]' : 'text-slate-500'}`}>
                                                                    {idx === 0 ? 'Pay Now' : `${idx + 1}${idx === 1 ? 'nd' : idx === 2 ? 'rd' : 'th'} Payment`}
                                                                </p>
                                                                <p className={`text-xs font-normal leading-none ${idx === 0 ? 'text-slate-800' : 'text-slate-500'}`}>
                                                                    {idx === 0 ? 'Immediate' : new Date(inst.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <span className={`text-xs font-normal ${idx === 0 ? 'text-slate-400' : 'text-slate-400'}`}>৳</span>
                                                            {isEditable ? (
                                                                <input
                                                                    type="number"
                                                                    value={inst.amount}
                                                                    onChange={(e) => handleUpdateInstallment(idx, e.target.value)}
                                                                    className={`w-24 py-1.5 px-3 text-right text-sm font-medium rounded-md outline-none border transition-all ${idx === 0 ? 'bg-white border-[#FD9A00]/30 text-[#FD9A00]' : 'bg-slate-50 border-slate-200 text-slate-700 focus:border-[#FD9A00]'}`}
                                                                />
                                                            ) : (
                                                                <span className={`text-sm font-medium ${idx === 0 ? 'text-[#FD9A00]' : 'text-slate-700'}`}>
                                                                    {Number(inst.amount).toLocaleString()}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div className="flex justify-between items-center pt-2 px-1">
                                            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Future Dues</span>
                                            <span className="text-sm font-bold text-slate-800">৳{remainingAmount.toLocaleString()}</span>
                                        </div>
                                    </div>
                                )}

                                <div className="pt-4 flex justify-between items-center border-t border-dashed border-slate-200">
                                    <div className="space-y-1">
                                        <span className="text-slate-800 font-semibold uppercase text-[10px] tracking-wider block">
                                            {isInstallmentActive ? 'Amount to Pay Now' : 'Total Order Balance'}
                                        </span>
                                        <p className="text-[10px] text-slate-400 font-normal">Full secure checkout enabled</p>
                                    </div>
                                    <div className="text-right">
                                        {discountAmount > 0 && !isInstallmentActive && (
                                            <span className="text-xs text-slate-400 line-through mr-2">৳{totalValue.toLocaleString()}</span>
                                        )}
                                        <span className={`text-2xl font-bold ${isInstallmentActive ? 'text-[#FD9A00]' : 'text-slate-800'}`}>
                                            ৳{finalAmount.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md border border-gray-100">
                                <LuShieldCheck className="text-teal-500 text-lg shrink-0" />
                                <p className="text-[10px] text-gray-500 leading-tight">
                                    Your payment is secured with SSL encryption
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div >
    );
};

const CheckoutPage = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-3">
                    <LuLoader className="animate-spin text-[#FD9A00]" size={32} />
                    <p className="text-gray-500 text-sm">Loading...</p>
                </div>
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    );
};

export default CheckoutPage;
