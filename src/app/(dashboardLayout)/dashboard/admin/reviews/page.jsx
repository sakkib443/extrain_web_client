"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllReviews, updateReviewStatus, deleteReview } from "@/redux/reviewSlice";
import { FiCheck, FiX, FiTrash2, FiSearch, FiFilter, FiStar } from "react-icons/fi";
import { useTheme } from "@/providers/ThemeProvider";

const AdminReviewsPage = () => {
    const dispatch = useDispatch();
    const { isDark } = useTheme();
    const { adminReviews: reviews, loading, adminTotalReviews: total } = useSelector((state) => state.reviews);

    const [filterStatus, setFilterStatus] = useState("");
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        dispatch(fetchAllReviews({ page, limit: 10, status: filterStatus }));
    }, [dispatch, page, filterStatus]);

    const handleStatusUpdate = (id, status) => {
        if (confirm(`Are you sure you want to ${status} this review?`)) {
            dispatch(updateReviewStatus({ reviewId: id, status }));
        }
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this review? This action cannot be undone.")) {
            dispatch(deleteReview(id));
        }
    };

    const StatusBadge = ({ status }) => {
        const styles = {
            approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
            rejected: "bg-rose-100 text-rose-700 border-rose-200",
            pending: "bg-amber-100 text-amber-700 border-amber-200",
        };
        return (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wide ${styles[status]}`}>
                {status}
            </span>
        );
    };

    const filteredReviews = reviews.filter(r =>
        r.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={`p-6 min-h-screen ${isDark ? 'text-white' : 'text-slate-800'}`}>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold font-outfit">Reviews Management</h1>
                    <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Manage and moderate customer reviews ({total} total)
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search reviews..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDark ? 'bg-slate-800 border-slate-700 placeholder-slate-500' : 'bg-white border-slate-200'
                                }`}
                        />
                    </div>
                    <div className="relative">
                        <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className={`pl-10 pr-8 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                                }`}
                        >
                            <option value="">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className={`rounded-xl border overflow-hidden ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className={`text-xs uppercase tracking-wider font-semibold ${isDark ? 'bg-slate-800/50 text-slate-400' : 'bg-slate-50 text-slate-500'}`}>
                                <th className="p-4">Product</th>
                                <th className="p-4">User</th>
                                <th className="p-4">Review</th>
                                <th className="p-4">Rating</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="p-12 text-center text-slate-400">
                                        Loading reviews...
                                    </td>
                                </tr>
                            ) : filteredReviews.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-12 text-center text-slate-400">
                                        No reviews found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredReviews.map((review) => (
                                    <tr key={review._id} className={`group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors`}>
                                        <td className="p-4 align-top">
                                            <div className="flex flex-col">
                                                <span className="uppercase text-[10px] text-rose-600 font-bold tracking-wider mb-0.5">{review.productType}</span>
                                                <span className="font-semibold text-sm line-clamp-2 max-w-[180px] text-slate-700 dark:text-slate-200" title={review.productDetails?.title}>
                                                    {review.productDetails?.title || <span className="text-slate-400 italic">Unknown Product</span>}
                                                </span>
                                                <span className="text-[10px] font-mono text-slate-400 mt-1 truncate w-24">ID: {review.product}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 align-top">
                                            <div className="flex items-center gap-3">
                                                {review.user?.avatar ? (
                                                    <img src={review.user.avatar} alt="User" className="w-8 h-8 rounded-full object-cover" />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                                                        {review.user?.firstName?.[0]}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-sm font-medium">{review.user?.firstName} {review.user?.lastName}</p>
                                                    <p className="text-xs text-slate-400">{review.user?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 align-top max-w-sm">
                                            <p className="font-bold text-sm mb-1">{review.title}</p>
                                            <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">{review.comment}</p>
                                            <div className="mt-2 text-xs text-slate-400">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                                {review.isVerifiedPurchase && (
                                                    <span className="ml-2 text-emerald-600 font-medium">Verified Purchase</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 align-top">
                                            <div className="flex items-center text-amber-400 gap-0.5">
                                                <span className="font-bold text-slate-700 dark:text-slate-200 mr-1">{review.rating}</span>
                                                <FiStar className="fill-current" size={14} />
                                            </div>
                                        </td>
                                        <td className="p-4 align-top">
                                            <StatusBadge status={review.status} />
                                        </td>
                                        <td className="p-4 align-top text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {review.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatusUpdate(review._id, 'approved')}
                                                            className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                                                            title="Approve"
                                                        >
                                                            <FiCheck size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(review._id, 'rejected')}
                                                            className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors"
                                                            title="Reject"
                                                        >
                                                            <FiX size={16} />
                                                        </button>
                                                    </>
                                                )}
                                                {review.status === 'rejected' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(review._id, 'approved')}
                                                        className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                                                        title="Approve"
                                                    >
                                                        <FiCheck size={16} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(review._id)}
                                                    className="p-2 bg-slate-50 text-slate-500 rounded-lg hover:bg-rose-50 hover:text-rose-600 transition-colors"
                                                    title="Delete"
                                                >
                                                    <FiTrash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className={`p-4 border-t flex items-center justify-between ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                    <span className="text-sm text-slate-500">
                        Page {page} of {Math.ceil(total / 10) || 1}
                    </span>
                    <div className="flex gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="px-3 py-1 text-sm border rounded-lg disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:hover:bg-transparent transition-colors"
                        >
                            Previous
                        </button>
                        <button
                            disabled={page * 10 >= total}
                            onClick={() => setPage(p => p + 1)}
                            className="px-3 py-1 text-sm border rounded-lg disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:hover:bg-transparent transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminReviewsPage;
