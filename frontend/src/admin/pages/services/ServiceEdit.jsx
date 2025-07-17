import React, { useContext, useEffect, useState } from 'react';
import { FaHome } from 'react-icons/fa';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { MainContext } from '../../../Context';
import * as FaIcons from "react-icons/fa";
import * as MdIcons from "react-icons/md";
import * as AiIcons from "react-icons/ai";
import * as GiIcons from "react-icons/gi";

const iconLibraries = {
    Fa: FaIcons,
    Md: MdIcons,
    Ai: AiIcons,
    Gi: GiIcons,
};

const getIconComponent = (iconName) => {
    const prefix = iconName.slice(0, 2);
    const iconSet = iconLibraries[prefix];
    return iconSet?.[iconName] || null;
};

export default function ServiceEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { notify, API_BASE_URL, IMAGE_URL } = useContext(MainContext);

    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        title: '',
        description: '',
        icon: '',
        processSteps: [''],
        isActive: true,
        image: null,
        preview: null
    });

    useEffect(() => {
        const fetchService = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/services/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('adminToken')}`
                    }
                });
                const { success, data } = await res.json();
                if (success && data) {
                    setForm({
                        title: data.title || '',
                        description: data.description || '',
                        icon: data.icon || '',
                        processSteps: data.processSteps || [''],
                        isActive: data.isActive ?? true,
                        image: null,
                        preview: data.image ? `${IMAGE_URL}/${data.image}` : null
                    });
                }
            } catch (err) {
                console.error('Error fetching service:', err);
                notify('Failed to load service data', false);
            } finally {
                setLoading(false);
            }
        };
        fetchService();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm(prev => ({
                ...prev,
                image: file,
                preview: URL.createObjectURL(file)
            }));
        }
    };

    const removeImage = () => {
        setForm(prev => ({ ...prev, image: null, preview: null }));
    };

    const handleStepChange = (index, value) => {
        const updated = [...form.processSteps];
        updated[index] = value;
        setForm(prev => ({ ...prev, processSteps: updated }));
    };

    const addStep = () => {
        setForm(prev => ({
            ...prev,
            processSteps: [...prev.processSteps, '']
        }));
    };

    const removeStep = (index) => {
        const updated = [...form.processSteps];
        updated.splice(index, 1);
        setForm(prev => ({ ...prev, processSteps: updated }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', form.title);
        formData.append('icon', form.icon);
        formData.append('description', form.description);
        formData.append('isActive', form.isActive);
        formData.append('processSteps', JSON.stringify(form.processSteps));
        if (form.image) {
            formData.append('image', form.image);
        }

        try {
            const res = await fetch(`${API_BASE_URL}/services/${id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                notify('Service updated successfully!');
                navigate('/admin/services');
            } else {
                notify(data.message || 'Update failed', false);
            }
        } catch (err) {
            console.error('Error updating service:', err);
            notify('Something went wrong', false);
        }
    };

    if (loading) return <div className="text-center py-20">Loading...</div>;

    return (
        <div className="min-h-screen px-4 py-10 bg-gray-50">
            <nav className="flex mb-6">
                <ol className="inline-flex items-center space-x-1 md:space-x-2">
                    <li className="inline-flex items-center">
                        <Link to="/admin" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-800">
                            <FaHome className="w-3 h-3 mr-2.5" />
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <div className="flex items-center">
                            <MdKeyboardArrowRight className="text-gray-400 mx-1" />
                            <Link to="/admin/services" className="text-sm font-medium text-gray-700 hover:text-blue-800">Services</Link>
                        </div>
                    </li>
                    <li>
                        <div className="flex items-center">
                            <MdKeyboardArrowRight className="text-gray-400 mx-1" />
                            <span className="text-sm font-medium text-gray-500">Edit</span>
                        </div>
                    </li>
                </ol>
            </nav>

            <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow">
                <h1 className="text-3xl font-bold text-blue-900 mb-6">Edit Service</h1>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Title */}
                    <div>
                        <label className="block mb-1 font-medium">Title</label>
                        <input type="text" name="title" value={form.title} onChange={handleChange} className="w-full p-3 border rounded" />
                    </div>
                    {/* Icon */}
                    <div>
                        <label className="block mb-1 font-medium">Icon (e.g. FaHome, MdEmail, AiIcons, GiIcons)</label>
                        <input
                            type="text"
                            name="icon"
                            value={form.icon}
                            onChange={handleChange}
                            className="w-full p-3 border rounded"
                        />
                        {form.icon && (
                            <div className="mt-2 text-xl text-blue-600">
                                {getIconComponent(form.icon)
                                    ? React.createElement(getIconComponent(form.icon))
                                    : <span className="text-red-500 text-sm">Invalid icon</span>}
                            </div>
                        )}
                    </div>
                    {/* Description */}
                    <div>
                        <label className="block mb-1 font-medium">Description</label>
                        <textarea name="description" rows="4" value={form.description} onChange={handleChange} className="w-full p-3 border rounded" />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block mb-1 font-medium">Image</label>
                        <input type="file" accept="image/*" onChange={handleFileChange} className="w-full border p-3 rounded" />
                        {form.preview && (
                            <div className="relative w-40 h-40 mt-4 border rounded overflow-hidden">
                                <img src={form.preview} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-1 right-1 bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center shadow hover:bg-red-700"
                                >
                                    ×
                                </button>
                            </div>
                        )}
                    </div>
                    {/* Process Steps */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Process Steps</h3>
                        {form.processSteps.map((step, index) => (
                            <div key={index} className="flex gap-2 items-center mb-2">
                                <input
                                    type="text"
                                    value={step}
                                    onChange={(e) => handleStepChange(index, e.target.value)}
                                    className="w-full p-3 border rounded"
                                    placeholder={`Step ${index + 1}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => removeStep(index)}
                                    className="text-red-600 text-sm"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button type="button" onClick={addStep} className="text-sm text-blue-700">+ Add Step</button>
                    </div>

                    {/* Active */}
                    <div className="flex items-center gap-3">
                        <label className="font-medium">Active</label>
                        <input
                            type="checkbox"
                            checked={form.isActive}
                            onChange={(e) => setForm(prev => ({ ...prev, isActive: e.target.checked }))}
                        />
                    </div>

                    <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition">
                        Update Service
                    </button>
                </form>
            </div>
        </div>
    );
}
