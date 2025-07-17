import React, { useRef, useState, useContext, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { MainContext } from "../../../Context";
import { FaHome } from "react-icons/fa";
import { MdKeyboardArrowRight } from "react-icons/md";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ProjectAdd() {
    const { notify, API_BASE_URL } = useContext(MainContext);
    const navigate = useNavigate();

    const title = useRef();
    const category = useRef();
    const location = useRef();
    const area = useRef();
    const year = useRef();
    const client = useRef();
    const [overview, setOverview] = useState("");
    const [longDescription, setLongDescription] = useState("");
    const [approach, setApproach] = useState("");
    const [featureInput, setFeatureInput] = useState("");
    const [features, setFeatures] = useState([]);
    const [description, setDescription] = useState("");
    const [mainImage, setMainImage] = useState(null);
    const [galleryImages, setGalleryImages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    useEffect(() => {
        const loadCategories = async () => {
            setLoadingCategories(true);
            try {
                const res = await fetch(`${API_BASE_URL}/categories?type=project`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
                });
                const { success, data } = await res.json();
                if (success && Array.isArray(data)) {
                    const options = data.map(cat => ({ label: cat.name, value: cat._id }))
                        .sort((a, b) => a.label.localeCompare(b.label));
                    setCategories(options);
                }
            } catch (err) {
                console.error("Failed to fetch project categories", err);
                notify("Couldn't load categories", 0);
            } finally {
                setLoadingCategories(false);
            }
        };
        loadCategories();
    }, [API_BASE_URL]);

    const handleGalleryChange = (e) => {
        const files = Array.from(e.target.files);
        setGalleryImages(prev => [...prev, ...files]);
        e.target.value = "";
    };

    const handleFeatureChange = (index, value) => {
        const updated = [...features];
        updated[index] = value;
        setFeatures(updated);
    };

    const addFeature = () => setFeatures([...features, ""]);

    const removeFeature = (index) => {
        const updated = features.filter((_, i) => i !== index);
        setFeatures(updated);
    };
    const handleAddFeature = () => {
        if (featureInput.trim() !== "") {
            setFeatures(prev => [...prev, featureInput.trim()]);
            setFeatureInput("");
        }
    };

    const handleRemoveGallery = (index) => {
        setGalleryImages(prev => prev.filter((_, i) => i !== index));
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!title.current.value || !category.current.value || !location.current.value ||
            !area.current.value || !description || !overview ||
            !longDescription || !mainImage) {
            notify("Please fill all required fields", 0);
            return;
        }

        const formData = new FormData();
        formData.append("title", title.current.value);
        formData.append("category", category.current.value);
        formData.append("location", location.current.value);
        formData.append("year", year.current.value);
        formData.append("area", area.current.value);
        formData.append("client", client.current.value);
        formData.append("description", description);
        formData.append("overview", overview);
        formData.append("longDescription", longDescription);
        formData.append("approach", approach);
        formData.append("main", mainImage);
        features.forEach(f => formData.append("features", f));
        galleryImages.forEach(img => formData.append("gallery", img));

        try {
            const res = await fetch(`${API_BASE_URL}/projects/create`, {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
                },
            });
            const text = await res.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error("Response is not valid JSON:", text);
                notify("Unexpected response from server", 0);
                return;
            }
            if (!res.ok || !data.success) {
                notify(data.msg || "Failed to add project", 0);
                return;
            }
            notify(data.message || "Project added successfully", 1);
            navigate("/admin/projects");
        } catch (err) {
            console.error("Unexpected response or JSON parse error:", rawText);
            notify("Server sent unexpected response", 0);
        }
    }

    return (
        <div className="flex">
            <div className="w-full p-6 bg-gray-50 min-h-screen">
                {/* Breadcrumb */}
                <nav className="flex mb-6" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                        <li className="inline-flex items-center">
                            <Link to="/admin" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-800">
                                <FaHome className="w-3 h-3 me-2.5" />
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <MdKeyboardArrowRight className="w-3 h-3 text-gray-400 mx-1" />
                                <Link to="/admin/projects" className="text-sm font-medium text-gray-700 hover:text-blue-800">
                                    Projects
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
                <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow">
                    <h1 className="text-3xl font-bold text-blue-900 mb-6">Add New Project</h1>

                    <form onSubmit={submitHandler} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Title */}
                            <div>
                                <label htmlFor="title" className="block mb-1 font-medium">Project Title</label>
                                <input id="title" ref={title} type="text" className="w-full p-3 border rounded" required />
                            </div>
                            {/* Category */}
                            <div>
                                <label htmlFor="category" className="block font-medium mb-1">Category</label>
                                <select
                                    id="category"
                                    ref={category}
                                    className="w-full p-3 border rounded"
                                    required
                                    disabled={!categories.length && !loadingCategories}
                                >
                                    <option value="">
                                        {loadingCategories ? 'Loading categories...' : 'Select Category'}
                                    </option>
                                    {categories.length ? (
                                        categories.map((cat) => (
                                            <option key={cat.value} value={cat.value}>
                                                {cat.label}
                                            </option>
                                        ))
                                    ) : (
                                        !loadingCategories && <option disabled>No categories found</option>
                                    )}
                                </select>
                            </div>
                            {/* Location */}
                            <div>
                                <label htmlFor="location" className="block mb-1 font-medium">Location</label>
                                <input id="location" ref={location} type="text" className="w-full p-3 border rounded" required />
                            </div>
                            {/* Year */}
                            <div>
                                <label htmlFor="year" className="block mb-1 font-medium">Year</label>
                                <input id="year" ref={year} type="number" className="w-full p-3 border rounded" />
                            </div>
                            {/* Area */}
                            <div>
                                <label htmlFor="area" className="block mb-1 font-medium">Area (sq.ft)</label>
                                <input id="area" ref={area} type="number" className="w-full p-3 border rounded" required />
                            </div>
                            {/* Client */}
                            <div>
                                <label htmlFor="client" className="block mb-1 font-medium">Client</label>
                                <input id="client" ref={client} type="text" className="w-full p-3 border rounded" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="description" className="block font-medium mb-1">Description</label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full p-3 border rounded"
                                rows={2}
                                required
                            />
                        </div>
                        {/* Overview */}
                        <div>
                            <label htmlFor="overview" className="block font-medium mb-1">Project Overview</label>
                            <textarea
                                id="overview"
                                value={overview}
                                onChange={(e) => setOverview(e.target.value)}
                                className="w-full p-3 border rounded"
                                rows={3}
                                required
                            />
                        </div>
                        {/* Long Description */}
                        <div>
                            <label htmlFor="longDescription" className="block font-medium mb-1">Long Description</label>
                            <textarea
                                id="longDescription"
                                value={longDescription}
                                onChange={(e) => setLongDescription(e.target.value)}
                                className="w-full p-3 border rounded"
                                rows={4}
                                required
                            />
                        </div>
                        {/* Approach */}
                        <div>
                            <label htmlFor="approach" className="block font-medium mb-1">Design Approach</label>
                            <textarea
                                id="approach"
                                value={approach}
                                onChange={(e) => setApproach(e.target.value)}
                                className="w-full p-3 border rounded"
                                rows={3}
                            />
                        </div>
                        {/* Features */}
                        <div>
                            <label htmlFor="features" className="block font-medium mb-1">Features</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={featureInput}
                                    onChange={(e) => setFeatureInput(e.target.value)}
                                    className="flex-grow p-3 border rounded"
                                    placeholder="Enter a feature"
                                />
                                <button type="button" onClick={handleAddFeature} className="bg-blue-500 text-white px-4 rounded">
                                    Add
                                </button>
                            </div>
                            {features.length > 0 && (
                                <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-gray-700 ">
                                    {features.map((f, i) => (
                                        <li key={i} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                                            {f}
                                            <button type="button" onClick={() => removeFeature(i)} className="text-white ml-2 bg-red-500 px-1  rounded-full">✕</button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        {/* Main Image */}
                        <div>
                            <label htmlFor="mainImage" className="block font-medium mb-1">Main Image</label>
                            <input
                                id="mainImage"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setMainImage(e.target.files[0])}
                                className="w-full p-3 border rounded"
                                required
                            />
                            {mainImage && (
                                <div className="mt-3 w-40 h-40 border rounded overflow-hidden">
                                    <img
                                        src={URL.createObjectURL(mainImage)}
                                        alt="Main Preview"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                        </div>
                        {/* Gallery Images */}
                        <div>
                            <label htmlFor="gallery" className="block font-medium mb-1">Gallery Images</label>
                            <input
                                id="gallery"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleGalleryChange}
                                className="w-full p-3 border rounded"
                            />
                            {galleryImages.length > 0 && (
                                <div className="flex flex-wrap gap-3 mt-3">
                                    {galleryImages.map((img, i) => (
                                        <div key={i} className="relative w-24 h-24 border rounded overflow-hidden">
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveGallery(i)}
                                                className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded-bl"
                                            >✕</button>
                                            <img
                                                src={URL.createObjectURL(img)}
                                                alt={`Gallery ${i}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition"
                        >
                            Add Project
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
