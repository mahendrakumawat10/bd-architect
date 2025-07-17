import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MainContext } from '../../../Context';
import { useState } from 'react';
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


export default function ServiceView() {
    const { API_BASE_URL, services, serviceHandler, deleteService, notify
    } = useContext(MainContext);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const updated = localStorage.getItem('serviceUpdated');
        if (updated) {
            notify('Service updated successfully', 1);
            localStorage.removeItem('serviceUpdated');
        }
    }, []);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                await serviceHandler();
            } catch (error) {
                console.error("Error fetching services:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this service?');
        if (!confirmDelete) return;
        await deleteService(id);
        serviceHandler();
    };
    const toggleActive = async (id, currentStatus) => {
        try {
            const res = await fetch(`${API_BASE_URL}/services/${id}/active`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ active: !currentStatus }),
            });

            if (!res.ok) throw new Error("Failed to toggle status");

            notify(`Service marked as ${!currentStatus ? "active" : "inactive"}`, 1);
            serviceHandler(); // Refresh list
        } catch (err) {
            console.error(err);
            notify("Error updating status", 0);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <main className="flex-1 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-blue-900">All Services</h1>
                    <Link
                        to="/admin/services/add"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                        + Add New Service
                    </Link>
                </div>
                {loading ? (
                    <p className="text-center text-gray-500">Loading...</p>
                ) : (
                    Array.isArray(services) && services.length > 0 ? (
                        <div className="grid gap-4">
                            {services.map((service) => (
                                <div
                                    key={service._id}
                                    className="border p-4 rounded-md shadow-md bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
                                        <div className="text-3xl shrink-0">
                                            {getIconComponent(service.icon)
                                                ? React.createElement(getIconComponent(service.icon))
                                                : <span className="text-red-500">❓</span>}
                                        </div>
                                        <div className="flex-1">
                                            <h2 className="text-lg font-semibold">{service.title}</h2>
                                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{service.description}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-4 justify-end items-center">
                                        <button
                                            disabled={loading}
                                            onClick={() => toggleActive(service._id, service.isActive)}
                                            className={`px-3 py-1 rounded text-white ${service.isActive
                                                ? 'bg-green-600 hover:bg-green-700'
                                                : 'bg-orange-500 hover:bg-orange-600'
                                                }`}
                                        >
                                            {service.isActive ? 'Active' : 'Inactive'}
                                        </button>

                                        <Link
                                            to={`/admin/services/edit/${service._id}`}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
                                        >
                                            Edit
                                        </Link>

                                        <button
                                            onClick={() => handleDelete(service._id)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                    ) : (
                        <p className="text-gray-500 text-center mt-10">No services found.</p>
                    )
                )}
            </main>
        </div>
    );
}
