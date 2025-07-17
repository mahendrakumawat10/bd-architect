import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MainContext } from '../../../Context';

export default function ProjectView() {
    const {
        API_BASE_URL,
        IMAGE_URL,
        project: projects,
        projectHandler,
        deleteProject,
        notify,
    } = useContext(MainContext);

    useEffect(() => {
        const updated = localStorage.getItem('projectUpdated');
        if (updated) {
            notify('Project updated successfully', 1);
            localStorage.removeItem('projectUpdated');
        }
    }, []);

    useEffect(() => {
        projectHandler();
    }, []);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            deleteProject(id);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <main className="flex-1 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-blue-900">All Projects</h1>
                    <Link
                        to="/admin/projects/add"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                        + Add New Project
                    </Link>
                </div>

                {Array.isArray(projects) && projects.length > 0 ? (
                    <div className="grid gap-5">
                        {projects.map((project) => {
                            const imageUrl = project.image
                                ? `${IMAGE_URL}${project.image.startsWith("/") ? "" : "/"}${project.image}`
                                : '/placeholder.jpg';
                            console.log('Image URL:', imageUrl);
                            return (
                                <div
                                    key={project._id}
                                    className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                                >
                                    {/* Project Thumbnail & Info */}
                                    <div className="flex items-center gap-4 flex-1">
                                        <img
                                            src={imageUrl}
                                            alt={project.title}
                                            className="w-32 h-24 object-cover rounded border"
                                        />
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-800">{project.title}</h2>
                                            <p className="text-sm text-gray-600">Location: {project.location}</p>
                                            <p className="text-sm text-gray-600">Year: {project.year || 'N/A'}</p>
                                            <p className="text-sm text-gray-600">Category: {project.category?.name || 'N/A'}</p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 justify-end md:justify-start">
                                        <Link
                                            to={`/admin/projects/edit/${project._id}`}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(project._id)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-gray-500">No projects found.</p>
                )}
            </main>
        </div>
    );
}
