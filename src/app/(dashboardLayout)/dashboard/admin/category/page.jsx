'use client';

import React, { useEffect, useState } from 'react';
import { FiPlus, FiEdit3, FiTrash2, FiLoader, FiCheck, FiX, FiGrid, FiSearch, FiImage, FiRefreshCw, FiCode, FiLayout, FiFolder, FiChevronRight, FiChevronDown } from 'react-icons/fi';
import Link from 'next/link';
import { API_BASE_URL } from "@/config/api";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [hierarchicalData, setHierarchicalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [viewMode, setViewMode] = useState('tree'); // 'tree' or 'flat'
  const [expandedParents, setExpandedParents] = useState([]);
  const [parentCategories, setParentCategories] = useState([]);

  const fetchCategories = async () => {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || API_BASE_URL;
    const token = localStorage.getItem('token');
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/categories/admin/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      setCategories(result.data || []);

      // Also fetch hierarchical data
      const hierRes = await fetch(`${BASE_URL}/categories/hierarchical${typeFilter !== 'all' ? `?type=${typeFilter}` : ''}`);
      const hierData = await hierRes.json();
      setHierarchicalData(hierData.data || []);

      // Fetch parent categories for edit modal
      const parentsRes = await fetch(`${BASE_URL}/categories/admin/parents`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const parentsData = await parentsRes.json();
      setParentCategories(parentsData.data || []);

      // Auto-expand all parents
      setExpandedParents((hierData.data || []).map(p => p._id));
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, [typeFilter]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to remove this category?")) return;
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || API_BASE_URL;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${BASE_URL}/categories/admin/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchCategories();
      } else {
        const data = await res.json();
        alert(data.message || 'Delete failed');
      }
    } catch (err) { alert("Delete failed"); }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || API_BASE_URL;
    const token = localStorage.getItem('token');

    // Extract parent ID if it's an object
    const parentId = editData.isParent ? null : (
      typeof editData.parentCategory === 'object'
        ? editData.parentCategory?._id
        : editData.parentCategory
    );

    try {
      const res = await fetch(`${BASE_URL}/categories/admin/${editData._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editData.name,
          slug: editData.slug,
          description: editData.description,
          image: editData.image,
          status: editData.status,
          type: editData.type,
          isParent: editData.isParent,
          parentCategory: parentId
        }),
      });
      if (res.ok) {
        setEditData(null);
        fetchCategories();
      } else {
        const err = await res.json();
        alert(`Update failed: ${err.message}`);
      }
    } catch (err) { alert("Network error"); }
  };

  const toggleExpand = (id) => {
    setExpandedParents(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'website': return 'from-emerald-500 to-rose-600';
      case 'software': return 'from-violet-500 to-purple-600';
      default: return 'from-slate-500 to-slate-600';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'website': return <FiLayout size={16} />;
      case 'software': return <FiCode size={16} />;
      default: return <FiGrid size={16} />;
    }
  };

  const stats = {
    total: categories.length,
    website: categories.filter(c => c.type === 'website').length,
    software: categories.filter(c => c.type === 'software').length,
    parents: categories.filter(c => c.isParent).length,
  };

  // Filter for flat view
  const filtered = categories.filter(c => {
    const matchSearch = c.name?.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || c.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="p-6 md:p-10 space-y-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <FiFolder className="text-white" size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 outfit tracking-tight">Category Taxonomy</h1>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Hierarchical Classification</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchCategories} className="p-3.5 bg-white hover:bg-slate-50 text-slate-600 rounded-2xl border border-slate-200 shadow-sm transition-all hover:scale-105">
            <FiRefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          <Link href="/dashboard/admin/category/create">
            <button className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-sm rounded-2xl shadow-xl shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95">
              <FiPlus size={18} /> New Category
            </button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center">
              <FiGrid className="text-white" size={18} />
            </div>
            <span className="text-2xl font-black text-slate-800">{stats.total}</span>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <FiLayout className="text-white" size={18} />
            </div>
            <span className="text-2xl font-black text-slate-800">{stats.website}</span>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Website</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
              <FiCode className="text-white" size={18} />
            </div>
            <span className="text-2xl font-black text-slate-800">{stats.software}</span>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Software</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
              <FiFolder className="text-white" size={18} />
            </div>
            <span className="text-2xl font-black text-slate-800">{stats.parents}</span>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Parents</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/10 outline-none text-sm font-medium transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          {['all', 'website', 'software'].map(type => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${typeFilter === type
                ? 'bg-slate-800 text-white shadow-lg shadow-slate-800/20'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
            >
              {type === 'all' ? 'All' : type}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setViewMode('tree')}
            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${viewMode === 'tree' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
          >
            Tree
          </button>
          <button
            onClick={() => setViewMode('flat')}
            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${viewMode === 'flat' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
          >
            Flat
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <FiLoader className="animate-spin text-indigo-600" size={40} />
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading Taxonomy...</p>
        </div>
      ) : viewMode === 'tree' ? (
        /* Tree View */
        <div className="space-y-4">
          {hierarchicalData.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-[2rem] border border-dashed border-slate-300">
              <FiFolder className="text-4xl text-slate-300 mx-auto mb-4" />
              <p className="text-sm font-black text-slate-600">No Parent Categories</p>
              <p className="text-xs text-slate-400 mt-1">Start by creating a parent category</p>
              <Link href="/dashboard/admin/category/create">
                <button className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl mx-auto">
                  <FiPlus size={14} /> Create Parent
                </button>
              </Link>
            </div>
          ) : (
            hierarchicalData.map(parent => (
              <div key={parent._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Parent Row */}
                <div className="flex items-center gap-4 p-5 hover:bg-slate-50 transition-all">
                  <button
                    onClick={() => toggleExpand(parent._id)}
                    className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-all"
                  >
                    {expandedParents.includes(parent._id) ? <FiChevronDown size={18} /> : <FiChevronRight size={18} />}
                  </button>
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${getTypeColor(parent.type)} flex items-center justify-center text-white shadow-lg overflow-hidden`}>
                    {parent.image ? <img src={parent.image} className="w-full h-full object-cover" /> : <FiFolder size={20} />}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-black text-slate-800">{parent.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 bg-gradient-to-r ${getTypeColor(parent.type)} text-white rounded text-[8px] font-black uppercase`}>{parent.type}</span>
                      <span className="text-[9px] text-slate-400 font-bold">{parent.children?.length || 0} sub-categories</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${parent.status === 'active' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                    {parent.status}
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => setEditData(parent)} className="p-2.5 bg-slate-100 hover:bg-slate-800 hover:text-white text-slate-500 rounded-xl transition-all">
                      <FiEdit3 size={14} />
                    </button>
                    <button onClick={() => handleDelete(parent._id)} className="p-2.5 bg-rose-50 hover:bg-rose-500 hover:text-white text-rose-400 rounded-xl transition-all">
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Children */}
                {expandedParents.includes(parent._id) && parent.children?.length > 0 && (
                  <div className="border-t border-slate-100 bg-slate-50/50">
                    {parent.children.map((child, idx) => (
                      <div key={child._id} className={`flex items-center gap-4 py-4 px-5 pl-20 hover:bg-white transition-all ${idx < parent.children.length - 1 ? 'border-b border-slate-100' : ''}`}>
                        <div className="w-8 h-8 bg-white rounded-lg border border-slate-200 flex items-center justify-center text-slate-400">
                          {getTypeIcon(child.type)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-slate-700">{child.name}</p>
                          <p className="text-[9px] text-slate-400 font-mono">{child.slug}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${child.status === 'active' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                          {child.status}
                        </span>
                        <div className="flex gap-1">
                          <button onClick={() => setEditData(child)} className="p-2 bg-white hover:bg-slate-800 hover:text-white text-slate-400 rounded-lg border border-slate-200 transition-all">
                            <FiEdit3 size={12} />
                          </button>
                          <button onClick={() => handleDelete(child._id)} className="p-2 bg-white hover:bg-rose-500 hover:text-white text-rose-300 rounded-lg border border-slate-200 transition-all">
                            <FiTrash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        /* Flat Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-24 bg-white rounded-[2rem] border border-dashed border-slate-300">
              <FiGrid className="text-4xl text-slate-300 mx-auto mb-4" />
              <p className="text-sm font-black text-slate-600">No Categories Found</p>
            </div>
          ) : (
            filtered.map((cat) => (
              <div key={cat._id} className="group bg-white p-5 rounded-2xl border border-slate-200 hover:shadow-xl transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getTypeColor(cat.type)} flex items-center justify-center text-white shadow-md overflow-hidden`}>
                    {cat.image ? <img src={cat.image} className="w-full h-full object-cover" /> : (cat.isParent ? <FiFolder size={18} /> : getTypeIcon(cat.type))}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-black text-slate-800 line-clamp-1">{cat.name}</h3>
                    <p className="text-[9px] text-slate-400 font-mono">{cat.slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-2 py-0.5 bg-gradient-to-r ${getTypeColor(cat.type)} text-white rounded text-[8px] font-black uppercase`}>{cat.type}</span>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${cat.isParent ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                    {cat.isParent ? 'Parent' : 'Child'}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${cat.status === 'active' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                    {cat.status}
                  </span>
                </div>
                {cat.parentCategory && (
                  <p className="text-[10px] text-slate-400 mb-3">
                    Under: <span className="font-bold text-slate-600">{cat.parentCategory.name}</span>
                  </p>
                )}
                <div className="flex gap-2 pt-3 border-t border-slate-100">
                  <button onClick={() => setEditData(cat)} className="flex-1 py-2 bg-slate-100 hover:bg-slate-800 hover:text-white text-slate-600 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1">
                    <FiEdit3 size={12} /> Edit
                  </button>
                  <button onClick={() => handleDelete(cat._id)} className="p-2 bg-rose-50 hover:bg-rose-500 hover:text-white text-rose-400 rounded-lg transition-all">
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Edit Modal */}
      {editData && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-end z-50 p-4">
          <div className="bg-white h-full w-full max-w-lg rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col">
            <div className="p-8 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-purple-50">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-black text-slate-800 outfit">Edit Category</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase mt-1 tracking-widest">
                    {editData.isParent ? 'Parent Category' : 'Sub-Category'}
                  </p>
                </div>
                <button onClick={() => setEditData(null)} className="w-12 h-12 flex items-center justify-center bg-white hover:bg-slate-800 hover:text-white rounded-2xl transition-all shadow-sm">
                  <FiX size={20} />
                </button>
              </div>
            </div>

            <form onSubmit={handleUpdate} className="p-8 space-y-6 overflow-y-auto flex-1">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Category Name</label>
                <input
                  type="text"
                  value={editData.name || ''}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:border-indigo-400 outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">URL Slug</label>
                <input
                  type="text"
                  value={editData.slug || ''}
                  onChange={(e) => setEditData({ ...editData, slug: e.target.value })}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-mono focus:bg-white focus:border-indigo-400 outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Image URL</label>
                <input
                  type="text"
                  value={editData.image || ''}
                  onChange={(e) => setEditData({ ...editData, image: e.target.value })}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:border-indigo-400 outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Description</label>
                <textarea
                  value={editData.description || ''}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  rows={2}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:bg-white focus:border-indigo-400 outline-none transition-all resize-none"
                ></textarea>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Category Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {['website', 'software'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setEditData({ ...editData, type })}
                      className={`py-3 rounded-xl text-xs font-black uppercase transition-all ${editData.type === type
                        ? `bg-gradient-to-r ${getTypeColor(type)} text-white shadow-lg`
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Parent Category Selector (for non-parents) */}
              {!editData.isParent && (
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Parent Category</label>
                  <select
                    value={editData.parentCategory?._id || editData.parentCategory || ''}
                    onChange={(e) => setEditData({ ...editData, parentCategory: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:border-indigo-400 outline-none transition-all"
                  >
                    <option value="">Select Parent</option>
                    {parentCategories
                      .filter(p => p.type === editData.type)
                      .map(p => (
                        <option key={p._id} value={p._id}>{p.name}</option>
                      ))
                    }
                  </select>
                </div>
              )}

              <div className="flex items-center gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="flex-1">
                  <p className="text-sm font-black text-slate-800">Category Status</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Toggle visibility</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditData({ ...editData, status: editData.status === 'active' ? 'inactive' : 'active' })}
                  className={`w-16 h-9 rounded-full transition-all flex items-center p-1 ${editData.status === 'active' ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'}`}
                >
                  <div className="w-7 h-7 bg-white rounded-full shadow-lg"></div>
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-500/30 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <FiCheck size={18} /> Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
