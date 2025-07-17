import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import { MdKeyboardArrowRight } from 'react-icons/md';
import axios from 'axios';
import { MainContext } from '../../../Context';

export default function AddCategory() {
  const { API_BASE_URL = 'http://localhost:5000/api', notify } = useContext(MainContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', type: 'project' });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) return notify('Name is required', false);
    if (!formData.type) return notify('Type is required', false);

    try {
      const res = await axios.post(`${API_BASE_URL}/categories`, formData);
      if (res.data.success) {
        notify('Category created successfully');
        navigate('/admin/categories');
      } else {
        notify(res.data.message || 'Failed to create category', false);
      }
    } catch (error) {
      console.error('Error creating category:', error);
      notify('Error creating category', false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-10 bg-gray-50">
      {/* Breadcrumb */}
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2">
          <li className="inline-flex items-center">
            <Link to="/admin" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-800">
              <FaHome className="w-3 h-3 me-2.5" />
              Dashboard
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <MdKeyboardArrowRight className="w-3 h-3 text-gray-400 mx-1" />
              <Link to="/admin/categories" className="text-sm font-medium text-gray-700 hover:text-blue-800">
                Categories
              </Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <MdKeyboardArrowRight className="w-3 h-3 text-gray-400 mx-1" />
              <span className="text-sm font-medium text-gray-500">Add</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Form */}
      <div className="max-w-lg mx-auto bg-white p-8 shadow rounded mt-10">
        <h1 className="text-2xl font-bold mb-4 text-blue-900">Add Category</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-medium mb-1">Category Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full p-3 border rounded"
              required
            >
              <option value="project">Project</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
          >
            Create Category
          </button>
        </form>
      </div>
    </div>
  );
}
