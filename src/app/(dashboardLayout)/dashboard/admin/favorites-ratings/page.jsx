"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllReviews, deleteReview } from "@/redux/reviewSlice";
import { FiHeart, FiStar, FiSearch, FiFilter, FiEye, FiPackage, FiUsers, FiTrash2 } from "react-icons/fi";
import { useTheme } from "@/providers/ThemeProvider";
import { API_BASE_URL } from "@/config/api";
import Link from "next/link";

const FavoritesRatingsPage = () => {
    const dispatch = useDispatch();
    const { isDark } = useTheme();
    const { adminReviews: reviews, loading: reviewsLoading, adminTotalReviews: totalReviews } = useSelector((state) => state.reviews);

    const [favorites, setFavorites] = useState([]);
    const [loadingFavorites, setLoadingFavorites] = useState(true);
    const [activeTab, setActiveTab] = useState("favorites"); // "favorites" or "ratings"
    const [searchTerm, setSearchTerm] = useState("");
    const [deletingReviewId, setDeletingReviewId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [reviewToDelete, setReviewToDelete] = useState(null);

    // Fetch all favorites
    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                setLoadingFavorites(true);
                const token = localStorage.getItem("token");
                const res = await fetch(`${API_BASE_URL}/wishlist/all`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    cache: 'no-store'
                });
                const data = await res.json();
                if (data.success) {
                    setFavorites(data.data || []);
                }
            } catch (error) {
                console.error("Error fetching favorites:", error);
            } finally {
                setLoadingFavorites(false);
            }
        };
        fetchFavorites();
    }, []);

    // Fetch all reviews for ratings tab
    useEffect(() => {
        if (activeTab === "ratings") {
            dispatch(fetchAllReviews({ page: 1, limit: 100, status: "approved" }));
        }
    }, [dispatch, activeTab]);

    // Filter and Sort favorites
    const filteredFavorites = favorites
        .filter(fav =>
            (fav.product?.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (fav.user?.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (fav.user?.firstName?.toLowerCase() || "").includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Filter reviews by search
    const filteredReviews = reviews.filter(r =>
        (r.productDetails?.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (r.user?.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (r.comment?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );

    // Stats
    const totalFavorites = favorites.length;
    const avgRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length).toFixed(1)
        : 0;

    // Handle delete review
    const handleDeleteClick = (review) => {
        setReviewToDelete(review);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!reviewToDelete) return;
        setDeletingReviewId(reviewToDelete._id);
        try {
            await dispatch(deleteReview(reviewToDelete._id)).unwrap();
            setShowDeleteModal(false);
            setReviewToDelete(null);
        } catch (error) {
            console.error("Delete review error:", error);
            alert("Failed to delete review: " + error);
        } finally {
            setDeletingReviewId(null);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setReviewToDelete(null);
    };

    return (
        <div className={`p-6 min-h-screen ${isDark ? 'text-white' : 'text-slate-800'}`}>
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold font-outfit flex items-center gap-3">
                        <span className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center text-white">
                            <FiHeart size={20} />
                        </span>
                        Like & Rating
                    </h1>
                    <p className={`text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        View all product likes and customer ratings
                    </p>
                </div>

                {/* Search */}
                <div className="relative w-full md:w-auto">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-rose-500 w-full md:w-64 ${isDark ? 'bg-slate-800 border-slate-700 placeholder-slate-500' : 'bg-white border-slate-200'
                            }`}
                    />
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className={`p-6 rounded-2xl border transition-all hover:shadow-lg ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-14 h-14 bg-rose-500/10 text-rose-600 rounded-2xl flex items-center justify-center">
                            <FiHeart size={28} className="fill-current" />
                        </div>
                        <div className="px-3 py-1 bg-rose-500/10 text-rose-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            Real-time
                        </div>
                    </div>
                    <div>
                        <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Engagement</p>
                        <p className="text-3xl font-bold font-outfit mt-1 tracking-tight">{totalFavorites} <span className="text-sm font-normal text-slate-400">Likes</span></p>
                    </div>
                </div>

                <div className={`p-6 rounded-2xl border transition-all hover:shadow-lg ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-14 h-14 bg-amber-500/10 text-amber-600 rounded-2xl flex items-center justify-center">
                            <FiStar size={28} className="fill-current" />
                        </div>
                        <div className="px-3 py-1 bg-amber-500/10 text-amber-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            Customer Feedback
                        </div>
                    </div>
                    <div>
                        <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Reviews</p>
                        <p className="text-3xl font-bold font-outfit mt-1 tracking-tight">{totalReviews}</p>
                    </div>
                </div>

                <div className={`p-6 rounded-2xl border transition-all hover:shadow-lg ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-14 h-14 bg-emerald-500/10 text-emerald-600 rounded-2xl flex items-center justify-center">
                            <FiStar size={28} />
                        </div>
                        <div className="px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            Quality Score
                        </div>
                    </div>
                    <div>
                        <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Average Rating</p>
                        <div className="flex items-baseline gap-2 mt-1">
                            <p className="text-3xl font-bold font-outfit tracking-tight">{avgRating}</p>
                            <div className="flex text-amber-400 gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <FiStar key={i} size={12} className={i < Math.round(avgRating) ? "fill-current" : "text-slate-300"} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setActiveTab("favorites")}
                    className={`px-5 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 transition-all ${activeTab === "favorites"
                        ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/30"
                        : isDark ? "bg-slate-800 text-slate-400 hover:text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                >
                    <FiHeart size={16} />
                    Likes ({totalFavorites})
                </button>
                <button
                    onClick={() => setActiveTab("ratings")}
                    className={`px-5 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 transition-all ${activeTab === "ratings"
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30"
                        : isDark ? "bg-slate-800 text-slate-400 hover:text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                >
                    <FiStar size={16} />
                    Reviews ({totalReviews})
                </button>
            </div>

            {/* Content */}
            <div className={`rounded-xl border overflow-hidden ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                {activeTab === "favorites" ? (
                    /* Favorites Tab */
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className={`text-xs uppercase tracking-wider font-semibold ${isDark ? 'bg-slate-800/50 text-slate-400' : 'bg-slate-50 text-slate-500'}`}>
                                    <th className="p-4">Product Details</th>
                                    <th className="p-4">Type</th>
                                    <th className="p-4">Total Likes</th>
                                    <th className="p-4">Liked By</th>
                                    <th className="p-4">Interaction Date</th>
                                    <th className="p-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {loadingFavorites ? (
                                    <tr>
                                        <td colSpan="6" className="p-12 text-center text-slate-400">
                                            Loading favorites...
                                        </td>
                                    </tr>
                                ) : filteredFavorites.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="p-12 text-center text-slate-400">
                                            <FiHeart size={40} className="mx-auto mb-3 opacity-30" />
                                            No favorites found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredFavorites.map((fav) => (
                                        <tr key={fav._id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    {fav.product?.images?.[0] || fav.product?.thumbnail ? (
                                                        <img
                                                            src={fav.product?.images?.[0] || fav.product?.thumbnail}
                                                            alt=""
                                                            className="w-12 h-12 rounded-lg object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                                                            <FiPackage className="text-slate-400" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-semibold text-sm line-clamp-1">{fav.product?.title || "Unknown Product"}</p>
                                                        <p className="text-xs text-slate-400">৳{fav.product?.price?.toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${fav.productType === 'course' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400' :
                                                    fav.productType === 'website' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' :
                                                        'bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400'
                                                    }`}>
                                                    {fav.productType}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-500">
                                                        <FiHeart size={18} className="fill-current" />
                                                    </div>
                                                    <span className="font-bold text-slate-700 dark:text-slate-200">
                                                        {fav.product?.likeCount || 0}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center font-bold text-sm">
                                                        {fav.user?.firstName?.[0] || fav.user?.email?.[0]?.toUpperCase() || "U"}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold truncate max-w-[150px]">{fav.user?.firstName} {fav.user?.lastName}</p>
                                                        <p className="text-[11px] text-slate-400 truncate max-w-[150px]">{fav.user?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="text-sm">
                                                    <p className="font-medium">{new Date(fav.createdAt).toLocaleDateString()}</p>
                                                    <p className="text-[11px] text-slate-400">{new Date(fav.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                </div>
                                                {new Date() - new Date(fav.createdAt) < 24 * 60 * 60 * 1000 && (
                                                    <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-500 text-white text-[9px] font-bold uppercase rounded-full">Recent</span>
                                                )}
                                            </td>
                                            <td className="p-4 text-right">
                                                <Link
                                                    href={`/${fav.productType === 'course' ? 'courses' : fav.productType}/${fav.product?._id}`}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-medium transition-colors"
                                                >
                                                    <FiEye size={14} />
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    /* Ratings/Reviews Tab */
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className={`text-xs uppercase tracking-wider font-semibold ${isDark ? 'bg-slate-800/50 text-slate-400' : 'bg-slate-50 text-slate-500'}`}>
                                    <th className="p-4">Product</th>
                                    <th className="p-4">User</th>
                                    <th className="p-4">Review</th>
                                    <th className="p-4">Rating</th>
                                    <th className="p-4">Date</th>
                                    <th className="p-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {reviewsLoading ? (
                                    <tr>
                                        <td colSpan="6" className="p-12 text-center text-slate-400">
                                            Loading reviews...
                                        </td>
                                    </tr>
                                ) : filteredReviews.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="p-12 text-center text-slate-400">
                                            <FiStar size={40} className="mx-auto mb-3 opacity-30" />
                                            No reviews found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredReviews.map((review) => (
                                        <tr key={review._id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="p-4">
                                                <div className="flex flex-col">
                                                    <span className="uppercase text-[10px] text-rose-600 font-bold tracking-wider mb-0.5">{review.productType}</span>
                                                    <span className="font-semibold text-sm line-clamp-1 max-w-[180px]">
                                                        {review.productDetails?.title || "Unknown Product"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                                                        {review.user?.firstName?.[0]}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">{review.user?.firstName} {review.user?.lastName}</p>
                                                        <p className="text-xs text-slate-400">{review.user?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 max-w-xs">
                                                <p className="font-bold text-sm mb-1">{review.title}</p>
                                                <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">{review.comment}</p>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center text-amber-400 gap-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <FiStar key={i} size={14} className={i < review.rating ? "fill-current" : "text-slate-200"} />
                                                    ))}
                                                    <span className="ml-1 text-sm font-bold text-slate-700 dark:text-slate-200">{review.rating}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm text-slate-500">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 text-right">
                                                <button
                                                    onClick={() => handleDeleteClick(review)}
                                                    disabled={deletingReviewId === review._id}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                                                >
                                                    <FiTrash2 size={14} />
                                                    {deletingReviewId === review._id ? "Deleting..." : "Delete"}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className={`p-6 rounded-2xl shadow-2xl max-w-md w-full mx-4 ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                <FiTrash2 className="text-red-600" size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">Delete Review</h3>
                                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>This action cannot be undone</p>
                            </div>
                        </div>
                        <p className={`mb-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                            Are you sure you want to delete this review by <strong>{reviewToDelete?.user?.firstName} {reviewToDelete?.user?.lastName}</strong>?
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={handleCancelDelete}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                disabled={deletingReviewId}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                            >
                                {deletingReviewId ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FavoritesRatingsPage;
