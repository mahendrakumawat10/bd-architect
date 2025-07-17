import React, { useContext, useEffect, useRef, useState } from 'react'
import { FaHome } from 'react-icons/fa';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import { MainContext } from '../../../Context';

export default function TeamAdd() {
  const { API_BASE_URL, notify, createTeam } = useContext(MainContext);
  const navigate = useNavigate();
  const imageInputRef = useRef();

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    description: "",
  });

  const [image, setImage] = useState(null); // Single image file
  const [preview, setPreview] = useState(null); // Image preview URL

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    if (imageInputRef.current) imageInputRef.current.value = null;
  };
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.role || !image) {
      return notify("Name, Role, and Profile Image are required", false);
    }

    try {
      const formPayload = new FormData();
      formPayload.append("name", formData.name);
      formPayload.append("role", formData.role);
      formPayload.append("description", formData.description);
      formPayload.append("image", image); // Single image field

      const res = await fetch(`${API_BASE_URL}/team`, {
        method: "POST",
        body: formPayload,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        notify("Team member added successfully");
        navigate("/admin/team");
      } else {
        console.error("Backend Error:", data);
        notify(data.message || "Failed to add member", false);
      }
    } catch (err) {
      console.error("Submit Error:", err);
      notify("Error adding team member", false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center space-x-2 text-gray-700">
        <Link to="/admin" className="flex items-center hover:text-blue-800">
          <FaHome />
          <span className="ml-1">Dashboard</span>
        </Link>
        <MdKeyboardArrowRight />
        <Link to="/admin/team" className="hover:text-blue-800">
          Team
        </Link>
        <MdKeyboardArrowRight />
        <span className="text-gray-500">Add</span>
      </nav>

      <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-6 text-blue-900">Add Team Member</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium">Name *</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              type="text"
              className="w-full p-3 border rounded"
              placeholder="Full Name"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Role *</label>
            <input
              name="role"
              value={formData.role}
              onChange={handleChange}
              type="text"
              className="w-full p-3 border rounded"
              placeholder="Role or Position"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full p-3 border rounded"
              placeholder="Brief bio or description"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Profile Image *</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={imageInputRef}
              className="w-full p-3 border rounded"
            />

            {preview && (
              <div className="relative mt-4 w-32 h-32 border rounded overflow-hidden shadow">
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-bl px-1 z-10"
                  title="Remove image"
                >
                  ❌
                </button>
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition"
          >
            Add Member
          </button>
        </form>
      </div>
    </div>
  );
}


