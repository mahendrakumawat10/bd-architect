import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MainContext } from "../../../Context";
import { FaHome } from "react-icons/fa";
import { MdKeyboardArrowRight } from "react-icons/md";
import * as FaIcons from "react-icons/fa";
import * as MdIcons from "react-icons/md";
import * as AiIcons from "react-icons/ai";
import * as GiIcons from 'react-icons/gi';

const iconLibraries = {
  Fa: FaIcons,
  Md: MdIcons,
  Ai: AiIcons,
  Gi: GiIcons,
};

export default function ServiceAdd() {
  const { notify, API_BASE_URL } = useContext(MainContext);
  const navigate = useNavigate();


  const getIconComponent = (iconName) => {
    const prefix = iconName.slice(0, 2);
    const iconSet = iconLibraries[prefix];
    return iconSet?.[iconName] || null;
  };


  const [form, setForm] = useState({
    title: '',
    icon: '',
    description: '',
    processSteps: [''],
    isActive: true,
    image: null,
    preview: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleStepChange = (index, value) => {
    const updated = [...form.processSteps];
    updated[index] = value;
    setForm(prev => ({ ...prev, processSteps: updated }));
  };
  const removeImage = () => {
    setForm(prev => ({
      ...prev,
      image: null,
      preview: null
    }));
  };

  const addStep = () => {
    setForm(prev => ({
      ...prev,
      processSteps: [...prev.processSteps, '']
    }));
  };

  const removeStep = (index) => {
    const updated = form.processSteps.filter((_, i) => i !== index);
    setForm(prev => ({ ...prev, processSteps: updated }));
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

  const resetForm = () => {
    setForm({
      title: '',
      icon: '',
      description: '',
      processSteps: [''],
      isActive: true,
      image: null,
      preview: null
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("icon", form.icon);
    formData.append("description", form.description);
    formData.append("isActive", form.isActive.toString());
    formData.append("processSteps", JSON.stringify(form.processSteps));
    if (form.image) {
      formData.append("image", form.image);
    }

    try {
      const res = await fetch(`${API_BASE_URL}/services`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        notify(data.error || "Failed to add service", 0);
        return;
      }

      notify("Service added successfully", 1);
      localStorage.setItem("serviceUpdated", "1");
      resetForm();
      navigate("/admin/services");
    } catch (err) {
      console.error(err);
      notify("Server error", 0);
    }
  };
  const iconComponent = getIconComponent(form.icon);

  return (
    <div className="w-full p-6 bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-2">
          <li>
            <FaHome className="inline mr-2" />
            <a href="/admin" className="text-sm font-medium text-gray-700 hover:text-blue-800">Dashboard</a>
          </li>
          <MdKeyboardArrowRight className="text-gray-400" />
          <li>
            <a href="/admin/services" className="text-sm font-medium text-gray-700 hover:text-blue-800">Services</a>
          </li>
          <MdKeyboardArrowRight className="text-gray-400" />
          <li className="text-sm font-medium text-gray-500">Add</li>
        </ol>
      </nav>

      {/* Form */}
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold text-blue-900 mb-6">Add New Service</h2>
        <form onSubmit={submitHandler} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <input
              type="text"
              name="title"
              placeholder="Service title"
              className="w-full border p-3 rounded"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Icon */}
          <div>
            <label className="block mb-1 font-medium">Icon (FaIcon, MdIcon, AiIcon, GiIcon)</label>
            <input
              type="text"
              name="icon"
              placeholder="React icon name"
              className="w-full border p-3 rounded"
              value={form.icon}
              onChange={handleChange}
              required
            />
            {form.icon && (
              <div className="mt-2 text-xl text-blue-600">
                {iconComponent
                  ? React.createElement(iconComponent)
                  : <span className="text-red-500 text-sm">Invalid icon name</span>}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="w-full border p-3 rounded"
              rows={4}
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block mb-1 font-medium">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border p-3 rounded"
              required
            />
            {form.preview && (
              <div className="relative w-40 h-40 mt-4 border rounded overflow-hidden">
                <img
                  src={form.preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
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
            <label className="block font-medium mb-1">Process Steps</label>
            {form.processSteps.map((step, i) => (
              <div key={i} className="relative mb-2">
                <input
                  type="text"
                  placeholder={`Step ${i + 1}`}
                  className="w-full border p-2 rounded"
                  value={step}
                  onChange={(e) => handleStepChange(i, e.target.value)}
                />
                {form.processSteps.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeStep(i)}
                    className="absolute top-2 right-2 text-red-500 font-bold"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addStep} className="text-sm text-blue-600">
              + Add Step
            </button>
          </div>

          {/* Active Toggle */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm(prev => ({ ...prev, isActive: e.target.checked }))}
            />
            <label className="text-sm">Active</label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-600 text-white w-full py-3 rounded hover:bg-blue-700 transition"
          >
            Add Service
          </button>
        </form>
      </div>
    </div>
  );
}
