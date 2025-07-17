import React, { useEffect, useRef, useState, useContext } from "react";
import { Link, useParams, useNavigate } from 'react-router-dom';
import { MainContext } from "../../../Context";
import { FaHome } from "react-icons/fa";
import { MdKeyboardArrowRight } from "react-icons/md";
import { toast } from 'react-toastify';

export default function ProjectEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { notify, API_BASE_URL, projectHandler, IMAGE_URL } = useContext(MainContext);

    // Refs for input fields
    const title = useRef();
    const category = useRef();
    const location = useRef();
    const year = useRef();
    const area = useRef();
    const client = useRef();

    // State
    const [categoryId, setCategoryId] = useState("");
    const [description, setDescription] = useState("");
    const [overview, setOverview] = useState("");
    const [longDescription, setLongDescription] = useState("");
    const [approach, setApproach] = useState("");
    const [features, setFeatures] = useState([]);
    const [featureInput, setFeatureInput] = useState("");
    const [mainImage, setMainImage] = useState(null);
    const [mainPreview, setMainPreview] = useState("");
    const [galleryImages, setGalleryImages] = useState([]);
    const [oldGalleryImages, setOldGalleryImages] = useState([]);
    const [deletedImages, setDeletedImages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    useEffect(() => {
        const loadProject = async () => {
            const data = await projectHandler(id);
            console.log("Loaded project:", data);
            if (data) {
                title.current.value = data.title || "";
                setCategoryId(data.category?._id || data.category || "");
                location.current.value = data.location || "";
                year.current.value = data.year || "";
                area.current.value = data.area || "";
                client.current.value = data.client || "";
                setDescription(data.description || "");
                setOverview(data.overview || "");
                setLongDescription(data.longDescription || "");
                setApproach(data.approach || "");
                setFeatures(data.features || []);
                const cleanPath = data.image?.startsWith("/") ? data.image : `/${data.image}`;
                setMainPreview(data.image ? `${IMAGE_URL}${cleanPath}` : "");
                setOldGalleryImages(data.gallery || []);
            }
        };
        loadProject();
    }, [id, projectHandler, IMAGE_URL]);

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

    const removeFeature = (index) => setFeatures(prev => prev.filter((_, i) => i !== index));
    const handleAddFeature = () => {
        if (featureInput.trim() !== "") {
            setFeatures(prev => [...prev, featureInput.trim()]);
            setFeatureInput("");
        }
    };

    const handleRemoveOldGallery = (index) => {
        setDeletedImages(prev => [...prev, oldGalleryImages[index]]);
        setOldGalleryImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleRemoveNewGallery = (index) => {
        setGalleryImages(prev => prev.filter((_, i) => i !== index));
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!title.current.value || !categoryId  || !location.current.value || !area.current.value || !description || !overview || !longDescription) {
            notify("Please fill all required fields", 0);
            return;
        }

        const formData = new FormData();
        formData.append("title", title.current.value);
        formData.append("location", location.current.value);
        formData.append("year", year.current.value);
        formData.append("area", area.current.value);
        formData.append("client", client.current.value);
        formData.append("description", description);
        formData.append("overview", overview);
        formData.append("longDescription", longDescription);
        formData.append("approach", approach);
        formData.append("category", categoryId);
        formData.append("deletedGallery", JSON.stringify(deletedImages));

        if (mainImage) formData.append("main", mainImage);
        features.forEach(f => formData.append("features", f));
        galleryImages.forEach(img => formData.append("gallery", img));
        try {
            const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("adminToken")}`
                },
                body: formData
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                notify(data.msg || "Failed to update project", 0);
                return;
            }
            notify(data.message || "Project updated successfully", 1);
            navigate("/admin/projects");
        } catch (err) {
            notify("Server error occurred", 0);
        }
    };

    return (
        <div className="flex">
            <div className="w-full p-6 bg-gray-50 min-h-screen">
                <nav className="flex mb-6" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-2">
                        <li><Link to="/admin" className="flex items-center text-gray-700 hover:text-blue-800"><FaHome className="mr-2" />Dashboard</Link></li>
                        <li><MdKeyboardArrowRight className="text-gray-400" /></li>
                        <li><Link to="/admin/projects" className="text-gray-700 hover:text-blue-800">Projects</Link></li>
                        <li><MdKeyboardArrowRight className="text-gray-400" /></li>
                        <li className="text-gray-500">Edit</li>
                    </ol>
                </nav>

                <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow">
                    <h1 className="text-3xl font-bold text-blue-900 mb-6">Edit Project</h1>
                    <form onSubmit={submitHandler} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label className="block mb-1 font-medium">Title</label><input ref={title} type="text" className="w-full p-3 border rounded" required /></div>
                            <div>
                                <label className="block mb-1 font-medium">Category</label>
                                <select
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    className="w-full p-3 border rounded"
                                    required
                                    disabled={!categories.length && loadingCategories}
                                >
                                    <option value="">{loadingCategories ? "Loading..." : "Select Category"}</option>
                                    {categories.map(opt => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div><label className="block mb-1 font-medium">Location</label><input ref={location} type="text" className="w-full p-3 border rounded" required /></div>
                            <div><label className="block mb-1 font-medium">Year</label><input ref={year} type="number" className="w-full p-3 border rounded" /></div>
                            <div><label className="block mb-1 font-medium">Area (sq.ft)</label><input ref={area} type="number" className="w-full p-3 border rounded" required /></div>
                            <div><label className="block mb-1 font-medium">Client</label><input ref={client} type="text" className="w-full p-3 border rounded" /></div>
                        </div>

                        <div><label className="block font-medium mb-1">Description</label><textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full p-3 border rounded" rows={2} required /></div>
                        <div><label className="block font-medium mb-1">Project Overview</label><textarea value={overview} onChange={e => setOverview(e.target.value)} className="w-full p-3 border rounded" rows={3} required /></div>
                        <div><label className="block font-medium mb-1">Long Description</label><textarea value={longDescription} onChange={e => setLongDescription(e.target.value)} className="w-full p-3 border rounded" rows={4} required /></div>
                        <div><label className="block font-medium mb-1">Design Approach</label><textarea value={approach} onChange={e => setApproach(e.target.value)} className="w-full p-3 border rounded" rows={3} /></div>

                        <div>
                            <label className="block font-medium mb-1">Features</label>
                            <div className="flex gap-2">
                                <input value={featureInput} onChange={e => setFeatureInput(e.target.value)} className="flex-grow p-3 border rounded" placeholder="Enter a feature" />
                                <button type="button" onClick={handleAddFeature} className="bg-blue-500 text-white px-4 rounded">Add</button>
                            </div>
                            <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-gray-700">
                                {features.map((f, i) => (
                                    <li key={i} className="flex justify-between items-center bg-gray-100 p-2 rounded">{f}
                                        <button type="button" onClick={() => removeFeature(i)} className="ml-2 bg-red-500 text-white px-1 rounded-full">✕</button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Main Image</label>
                            <input type="file" accept="image/*" onChange={e => setMainImage(e.target.files[0])} className="w-full p-3 border rounded" />
                            {mainImage ? (
                                <img src={URL.createObjectURL(mainImage)} className="mt-3 w-40 h-40 object-cover rounded border" alt="New Preview" />
                            ) : mainPreview ? (
                                <img src={mainPreview} className="mt-3 w-40 h-40 object-cover rounded border" alt="Old Main" />
                            ) : (
                                <p className="text-sm text-gray-500 mt-2">No main image available.</p>
                            )}

                        </div>

                        <div>
                            <label className="block font-medium mb-1">Gallery Images</label>
                            <input type="file" accept="image/*" multiple onChange={handleGalleryChange} className="w-full p-3 border rounded" />
                            <div className="flex flex-wrap gap-3 mt-3">
                                {oldGalleryImages.map((img, i) => (
                                    <div key={i} className="relative w-24 h-24 border rounded overflow-hidden">
                                        <button type="button" onClick={() => handleRemoveOldGallery(i)} className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded-bl">✕</button>
                                        <img src={`${IMAGE_URL}${img.startsWith("/") ? "" : "/"}${img}`} className="w-full h-full object-cover" alt={`Old ${i}`} />
                                    </div>
                                ))}
                                {galleryImages.map((img, i) => (
                                    <div key={`new-${i}`} className="relative w-24 h-24 border rounded overflow-hidden">
                                        <button type="button" onClick={() => handleRemoveNewGallery(i)} className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded-bl">✕</button>
                                        <img src={URL.createObjectURL(img)} className="w-full h-full object-cover" alt={`New ${i}`} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition">Update Project</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
