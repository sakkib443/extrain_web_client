'use client';

import React, { useState } from 'react';
import {
  FiSearch,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiFilter,
  FiChevronDown,
  FiDownload,
  FiImage,
} from 'react-icons/fi';

export default function ImagesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Sample data - replace with real data from your API
  const images = [
    {
      id: 1,
      name: 'Course Banner 1',
      category: 'Course Banner',
      fileName: 'course-banner-1.jpg',
      size: '2.4 MB',
      uploadDate: 'Dec 10, 2024',
      usedIn: 'Web Development Course',
      status: 'Active',
      thumbnail: '#FF6B6B',
    },
    {
      id: 2,
      name: 'Mentor Profile - John',
      category: 'Mentor Profile',
      fileName: 'mentor-john.jpg',
      size: '1.8 MB',
      uploadDate: 'Dec 08, 2024',
      usedIn: 'John Doe Profile',
      status: 'Active',
      thumbnail: '#4ECDC4',
    },
    {
      id: 3,
      name: 'About Gallery Image',
      category: 'Gallery',
      fileName: 'gallery-about-1.jpg',
      size: '3.2 MB',
      uploadDate: 'Dec 05, 2024',
      usedIn: 'About Page Gallery',
      status: 'Active',
      thumbnail: '#45B7D1',
    },
    {
      id: 4,
      name: 'Partner Logo',
      category: 'Logo',
      fileName: 'partner-logo.png',
      size: '0.8 MB',
      uploadDate: 'Nov 30, 2024',
      usedIn: 'Partners Section',
      status: 'Active',
      thumbnail: '#FFA07A',
    },
    {
      id: 5,
      name: 'Success Story Image',
      category: 'Success Story',
      fileName: 'success-story-5.jpg',
      size: '2.6 MB',
      uploadDate: 'Nov 25, 2024',
      usedIn: 'Success Stories Page',
      status: 'Inactive',
      thumbnail: '#98D8C8',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-50 text-green-700 border border-green-200';
      case 'Inactive':
        return 'bg-gray-50 text-gray-700 border border-gray-200';
      case 'Archived':
        return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
      default:
        return 'bg-blue-50 text-blue-700 border border-blue-200';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Course Banner': 'bg-blue-100 text-blue-700',
      'Mentor Profile': 'bg-purple-100 text-purple-700',
      'Gallery': 'bg-orange-100 text-orange-700',
      'Logo': 'bg-pink-100 text-pink-700',
      'Success Story': 'bg-green-100 text-green-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const formatFileSize = (size) => {
    return size;
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Images</h1>
        <p className="text-slate-600 mt-2">Manage and organize course and content images</p>
      </div>

      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        {/* Search */}
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-3.5 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search images..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition"
          />
        </div>

        {/* Filter & Add Button */}
        <div className="flex gap-3">
          <div className="relative">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition">
              <FiFilter size={18} />
              <span>Category</span>
              <FiChevronDown size={16} />
            </button>
          </div>

          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg btn-gradient text-white font-medium hover:shadow-lg transition">
            <FiPlus size={20} />
            <span>Upload Image</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-slate-600 text-sm">Total Images</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">45</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-slate-600 text-sm">Storage Used</p>
          <p className="text-2xl font-bold text-orange-600 mt-1">128 MB</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-slate-600 text-sm">Active</p>
          <p className="text-2xl font-bold text-green-600 mt-1">42</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-slate-600 text-sm">Unused</p>
          <p className="text-2xl font-bold text-red-600 mt-1">3</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Table Header */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Image
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  File Info
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Used In
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Uploaded
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {images.map((image) => (
                <tr
                  key={image.id}
                  className="border-b border-slate-200 hover:bg-slate-50 transition"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                        style={{ backgroundColor: image.thumbnail }}
                      >
                        <FiImage size={20} />
                      </div>
                      <p className="font-medium text-slate-900">{image.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-slate-900">{image.fileName}</p>
                      <p className="text-xs text-slate-500 mt-1">{image.size}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                        image.category
                      )}`}
                    >
                      {image.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm">
                    {image.usedIn}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {image.uploadDate}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        image.status
                      )}`}
                    >
                      {image.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition">
                        <FiEye size={18} />
                      </button>
                      <button className="p-2 rounded-lg text-orange-600 hover:bg-orange-50 transition">
                        <FiDownload size={18} />
                      </button>
                      <button className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition">
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
          <p className="text-sm text-slate-600">Showing 1 to 5 of 45 results</p>
        </div>
      </div>
    </div>
  );
}

