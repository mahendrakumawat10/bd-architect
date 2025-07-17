import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainContext } from '../../Context';
import { RiTeamFill } from "react-icons/ri";
import { FaProjectDiagram } from 'react-icons/fa';
import { MdCategory, MdMiscellaneousServices } from 'react-icons/md';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logoutAdmin, project, services, category, teamHandler } = useContext(MainContext);
  const [teamCount, setTeamCount] = useState(0);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logoutAdmin();
      navigate('/admin/login');
    }
  };
  useEffect(() => {
    async function fetchTeam() {
      const team = await teamHandler();
      setTeamCount(Array.isArray(team) ? team.length : 0);
    }
    fetchTeam();
  }, [teamHandler]);

  return (
    <div className="container flex flex-col md:flex-row min-h-screen ">
      <main className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-900">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Projects */}
          <div
            className="p-6 bg-blue-100 rounded-lg cursor-pointer hover:bg-blue-200 transition"
            onClick={() => navigate('/admin/projects')}
          >
            <h2 className="text-xl font-semibold text-blue-900">Manage Projects</h2>
            <p className="text-sm text-gray-600 mb-2 mt-1">View, edit, or delete real estate projects.</p>
            <p className="flex gap-2 items-center font-semibold text-blue-800"><FaProjectDiagram /> Total Projects : {project.length}</p>
          </div>

          {/* services */}
          <div
            className="p-6 bg-green-100 rounded-lg cursor-pointer hover:bg-green-200 transition"
            onClick={() => navigate('/admin/services')}
          >
            <h2 className="text-xl font-semibold text-green-900">Manage services</h2>
            <p className="text-sm text-gray-600  mb-2 mt-1">Write, edit, or delete services content.</p>
            <p className="flex gap-2 items-center font-semibold text-green-800"><MdMiscellaneousServices /> Total Services : {services.length}</p>
          </div>

          {/* Categories */}
          <div
            className="p-6 bg-yellow-100 rounded-lg cursor-pointer hover:bg-yellow-200 transition"
            onClick={() => navigate('/admin/categories')}
          >
            <h2 className="text-xl font-semibold text-yellow-900">Manage Categories</h2>
            <p className="text-sm text-gray-600  mb-2 mt-1">Create, Edit, or delete property categories.</p>
            <p className="flex gap-2 items-center font-semibold text-yellow-800"><MdCategory /> Total Categories : {category.length}</p>
          </div>

          {/* ✅ Team Members */}
          <div
            className="p-6 bg-purple-100 rounded-lg cursor-pointer hover:bg-purple-200 transition"
            onClick={() => navigate('/admin/team')}
          >
            <h2 className="text-xl font-semibold text-purple-900 ">Manage Team</h2>
            <p className="text-sm text-gray-600  mb-2 mt-1">Add, edit, or remove team members.</p>
            <p className="flex gap-2 items-center font-semibold text-purple-600"><RiTeamFill />
              Total Members : {teamCount}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
