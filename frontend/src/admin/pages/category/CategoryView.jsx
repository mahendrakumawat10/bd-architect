import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MainContext } from '../../../Context';

const AdminCategoryList = () => {
  const { category, categoryHandler, deleteCategory, notify } = useContext(MainContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const updated = localStorage.getItem('categoryUpdated');
    if (updated) {
      notify('Category updated successfully', 1);
      localStorage.removeItem('categoryUpdated');
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    categoryHandler().finally(() => setLoading(false));
  }, [categoryHandler]);

  const handleDelete = (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this category?');
    if (!confirmDelete) return;

    deleteCategory(id);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-900">All Categories</h1>
          <Link
            to="/admin/categories/add"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            + Add New Category
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-500 text-center">Loading categories...</p>
        ) : Array.isArray(category) && category.length > 0 ? (
          <div className="grid gap-4">
            {category.map((cat) => (
              <div
                key={cat._id}
                className="border p-4 rounded-md shadow-md flex justify-between items-center bg-white"
              >
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">{cat.name}</h2>
                  <p className="text-sm text-gray-500">{cat.slug}</p>
                  <span
                    className={`inline-block mt-1 text-sm font-medium px-2 py-0.5 rounded ${
                      cat.type === 'project'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {cat.type.charAt(0).toUpperCase() + cat.type.slice(1)}
                  </span>
                </div>
                <div className="flex gap-3">
                  <Link
                  
                    to={`/admin/categories/edit/${cat._id}`}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-10">No categories found.</p>
        )}
      </main>
    </div>
  );
};

export default AdminCategoryList;
