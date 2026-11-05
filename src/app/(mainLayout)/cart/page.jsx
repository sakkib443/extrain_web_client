"use client";

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, clearCart } from '@/redux/cartSlice';
import Link from 'next/link';
import { LuTrash2, LuShoppingBag, LuChevronRight, LuArrowLeft, LuShieldCheck } from 'react-icons/lu';
import { useLanguage } from '@/context/LanguageContext';

const CartPage = () => {
    const { items, totalAmount } = useSelector((state) => state.cart || { items: [], totalAmount: 0 });
    const dispatch = useDispatch();
    const { language } = useLanguage();
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";

    if (items.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 px-4">
                <div className="w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center mb-6">
                    <LuShoppingBag className="text-[#FD9A00] text-2xl" />
                </div>
                <h2 className={`text-xl font-bold text-gray-900 mb-3 ${bengaliClass}`}>
                    {language === 'bn' ? 'আপনার কার্ট খালি' : 'Your cart is empty'}
                </h2>
                <p className="text-gray-500 mb-8 text-center max-w-sm text-sm">
                    Looks like you haven't added anything to your cart yet.
                </p>
                <Link
                    href="/software"
                    className="px-6 py-3 bg-[#FD9A00] text-white rounded-md font-semibold text-sm shadow-lg hover:shadow-xl transition-all"
                >
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 lg:py-16">
            <div className="container mx-auto px-4 lg:px-16">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <Link href="/" className="p-2.5 bg-white rounded-md border border-gray-200 text-gray-400 hover:text-[#FD9A00] transition-all">
                        <LuArrowLeft size={18} />
                    </Link>
                    <h1 className={`text-xl font-bold text-gray-900 ${bengaliClass}`}>
                        Shopping <span className="text-[#FD9A00]">Cart</span>
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Items List */}
                    <div className="lg:col-span-8 space-y-3">
                        {items.map((item) => (
                            <div key={item.id} className="bg-white p-4 rounded-md border border-gray-100 flex flex-col sm:flex-row items-center gap-4 group hover:shadow-md transition-all">
                                <div className="w-full sm:w-24 aspect-square rounded-md overflow-hidden bg-gray-100 shrink-0">
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                </div>
                                <div className="flex-1 space-y-1 text-center sm:text-left">
                                    <span className="px-2 py-0.5 bg-gray-100 text-[10px] font-semibold uppercase text-gray-500 rounded">
                                        {item.type}
                                    </span>
                                    <h3 className="text-base font-semibold text-gray-900 group-hover:text-[#FD9A00] transition-colors line-clamp-1">
                                        {item.title}
                                    </h3>
                                    <p className="text-xs text-gray-400">Verified digital asset</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-lg font-bold text-[#FD9A00]">৳{item.price?.toLocaleString()}</span>
                                    <button
                                        onClick={() => dispatch(removeFromCart(item.id))}
                                        className="p-2 bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-md transition-all"
                                    >
                                        <LuTrash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        <div className="pt-4">
                            <button
                                onClick={() => dispatch(clearCart())}
                                className="text-xs font-medium text-gray-400 hover:text-red-500 transition-colors flex items-center gap-2"
                            >
                                <LuTrash2 size={14} />
                                Clear Cart
                            </button>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-4 lg:sticky lg:top-24">
                        <div className="bg-white p-6 rounded-md border border-gray-100 shadow-sm space-y-6">
                            <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-4">Order Summary</h3>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-gray-500 text-sm">
                                    <span>Subtotal ({items.length} items)</span>
                                    <span className="text-gray-900 font-semibold">৳{totalAmount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-500 text-sm">
                                    <span>Processing Fee</span>
                                    <span className="text-teal-600 font-semibold">FREE</span>
                                </div>
                                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                                    <span className="text-gray-900 font-bold">Total</span>
                                    <span className="text-xl font-bold text-[#FD9A00]">৳{totalAmount.toLocaleString()}</span>
                                </div>
                            </div>

                            <Link
                                href="/checkout"
                                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#FD9A00] hover:bg-teal-500 text-white rounded-md font-semibold text-sm shadow-lg transition-all group"
                            >
                                Checkout Now
                                <LuChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
                            </Link>

                            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md border border-gray-100">
                                <LuShieldCheck className="text-teal-500 text-lg" />
                                <p className="text-[10px] text-gray-500 leading-tight">
                                    Secure checkout with SSL encryption
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
