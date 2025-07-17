import React, { useContext, useEffect, useRef, useState } from 'react'
import { FaHome } from 'react-icons/fa';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { MainContext } from '../../../Context';

export default function TeamEdit() {
  const { id } = useParams();
  const { API_BASE_URL, notify, IMAGE_URL } = useContext(MainContext);
  const navigate = useNavigate();
  const imageInputRef = useRef();

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    description: '',
  });

  const [existingImage, setExistingImage] = useState(null); // string (filename or URL)
  const [newImageFile, setNewImageFile] = useState(null); // File
  const [previewImage, setPreviewImage] = useState(null); // URL
  const [deleteOldImage, setDeleteOldImage] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/team/${id}`);
        const data = await res.json();

        if (res.ok) {
          const team = data.data || data;
          setFormData({
            name: team.name || '',
            role: team.role || '',
            description: team.bio || team.description || '',
          });
          setExistingImage(team.image || team.images?.[0] || null);
        } else {
          notify('Failed to load team member.', false);
        }
      } catch {
        notify('Error loading data.', false);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      if (previewImage) URL.revokeObjectURL(previewImage);
      setNewImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
      setDeleteOldImage(true);
      setExistingImage(null); // clear reference to old one
    }
  };

  const handleDeleteImage = () => {
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
      setPreviewImage(null);
      setNewImageFile(null);
    }
    if (existingImage) {
      setExistingImage(null);
      setDeleteOldImage(true);
    }
    if (imageInputRef.current) {
      imageInputRef.current.value = null;
    }
  };

  const getImageSrc = () => {
    if (previewImage) return previewImage;
    if (existingImage) {
      if (existingImage.startsWith('http')) return existingImage;
      if (existingImage.startsWith('/uploads'))
        return `${API_BASE_URL}${existingImage}`;
      return `${IMAGE_URL}/${existingImage}`;
    }
    return '';
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const formPayload = new FormData();
    formPayload.append('name', formData.name);
    formPayload.append('role', formData.role);
    formPayload.append('description', formData.description);

    if (newImageFile) {
      formPayload.append('image', newImageFile); // single image
    }

    if (deleteOldImage) {
      formPayload.append('deleteOldImage', 'true');
    }

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        return notify('Login required', false);
      }

      const res = await fetch(`${API_BASE_URL}/team/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formPayload,
      });

      const data = await res.json();
      if (data.success) {
        notify('Team member updated');
        navigate('/admin/team');
      } else {
        notify(data.message || 'Update failed', false);
      }
    } catch {
      notify('Update failed due to network error.', false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-10 bg-gray-50">
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2">
          <li>
            <Link
              to="/admin"
              className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-800"
            >
              <FaHome className="w-3 h-3 me-2.5" />
              Dashboard
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <MdKeyboardArrowRight className="w-3 h-3 text-gray-400 mx-1" />
              <Link
                to="/admin/team"
                className="text-sm font-medium text-gray-700 hover:text-blue-800"
              >
                Team
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

      <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">
          Edit Team Member
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-1 font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Role</label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded"
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
              />
            </div>

                 <div>
              <label className="block mb-1 font-medium">Profile Image</label>
              <input
                type="file"
                accept="image/*"
                ref={imageInputRef}
                onChange={handleImageChange}
                className="w-full"
              />
              {(previewImage || existingImage) && (
                <div className="relative mt-4 w-48 h-48 rounded overflow-hidden border border-gray-300">
                  <img
                    src={getImageSrc()}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleDeleteImage}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold hover:bg-red-700"
                    title="Remove image"
                  >
                    &times;
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-semibold transition"
            >
              Update Team
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
