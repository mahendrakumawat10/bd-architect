import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { MainContext } from '../../../Context';
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function TeamView() {
  const { API_BASE_URL, notify } = useContext(MainContext);
  const { projectId } = useParams();
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTeam = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/team?projectId=${projectId || ''}`);
      const data = await res.json();
      setTeam(res.ok && Array.isArray(data.data) ? data.data : []);
    } catch {
      notify('Failed to load team members', false);
      setTeam([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadTeam();
  }, [projectId]);

  const removeTeam = async (id) => {
    if (!window.confirm('Confirm delete?')) return;
    const res = await fetch(`${API_BASE_URL}/team/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`
      }
    });

    const resp = await res.json();
    if (resp.success) {
      notify('Delete successfully');
      loadTeam();
    } else notify('Delete failed', false);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-900">Team Members {projectId ? `for Project ${projectId}` : ''}</h1>
        <Link
          to={`/admin/team/add${projectId ? `?projectId=${projectId}` : ''}`}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Add Member
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : team.length > 0 ? (
        <div className="space-y-4">
          {team.map((m) => (
            <div
              key={m._id}
              className="bg-white rounded shadow p-4 flex items-center justify-between"
            >
              {/* Left: Image */}
              <div className="flex items-center space-x-4">
                <img
                  src={
                    m.image
                      ? m.image.startsWith("http")
                        ? m.image
                        : `${API_BASE_URL.replace("/api", "")}/uploads/${m.image.replace(/^\/+/, "")}`
                      : "/placeholder-profile.png"
                  }
                  alt={m.name}
                  className="w-20 h-20 rounded-full object-cover"
                />


                {/* Middle: Name, Role, Bio*/}
                <div>
                  <h2 className="text-lg font-semibold">{m.name}</h2>
                  <p className="text-gray-600">{m.role}</p>
                  {m.bio && <p className="text-gray-500 text-sm">{m.bio}</p>}

                </div>
              </div>

              {/* Right: Edit & Delete buttons */}
              <div className="flex space-x-3">
                <Link
                  to={`/admin/team/edit/${m._id}${projectId ? `?projectId=${projectId}` : ''}`}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded flex items-center gap-2"
                >
                  <FaEdit /> Edit
                </Link>
                <button
                  onClick={() => removeTeam(m._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded flex items-center gap-2"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10">No team members found.</p>
      )}
    </div>
  );
}
