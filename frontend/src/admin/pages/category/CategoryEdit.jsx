import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { MainContext } from '../../../Context';

export default function EditCategory() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { API_BASE_URL, notify } = useContext(MainContext);
    const [formData, setFormData] = useState({ name: '', type: 'project' });
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        if (!API_BASE_URL) return;

        const fetchCategory = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${API_BASE_URL}/categories/${id}`);
                const data = await res.json();
                console.log("Fetched category data:", data);

                if (data.success && data.data) {
                    setFormData({ name: data.data.name, type: data.data.type });
                } else {
                    notify(data.message || 'Failed to fetch category', false);
                }
            } catch (error) {
                notify('Error loading category', false);
            } finally {
                setLoading(false);
            }
        };

        fetchCategory(); // ✅ Call the function here
    }, [API_BASE_URL, id]);





    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) return notify('Name cannot be empty', false);
        if (!formData.type) return notify('Type is required', false);

        try {
            const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.success) {
                notify('Category updated successfully');
                navigate('/admin/categories');
            } else {
                notify(data.message || 'Update failed', false);
            }
        } catch {
            notify('Something went wrong', false);
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
                            <span className="text-sm font-medium text-gray-500">Edit</span>
                        </div>
                    </li>
                </ol>
            </nav>

            {/* Form */}

            <div className="max-w-lg mx-auto bg-white p-8 shadow rounded mt-10">
                <h1 className="text-2xl font-bold mb-4 text-blue-900">Edit Category</h1>
                {loading ? (
                    <div>Loading category...</div>
                ) : (
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
                            Update Category
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
