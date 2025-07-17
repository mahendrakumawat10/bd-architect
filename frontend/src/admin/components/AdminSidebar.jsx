import React, { useContext, useState } from 'react';
import { LuLayoutDashboard } from "react-icons/lu";
import { CiLogout } from "react-icons/ci";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MainContext } from '../../Context';
import { FiMenu } from "react-icons/fi";
import { FaDiagramProject } from 'react-icons/fa6';
import { MdCategory, MdMiscellaneousServices } from 'react-icons/md';
import { RiTeamFill } from 'react-icons/ri';

export default function AdminSidebar() {
    const token = localStorage.getItem('adminToken');
    const { logoutAdmin } = useContext(MainContext);
    const [isOpen, setIsOpen] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            logoutAdmin();
            navigate('/admin/login');
        }
    };

    const menu = token ? [
        { title: 'Dashboard', icon: <LuLayoutDashboard />, link: '/admin' },
        { title: 'Projects', icon: <FaDiagramProject />, link: '/admin/projects' },
        { title: 'Services', icon: <MdMiscellaneousServices />, link: '/admin/services' },
        { title: 'Categories', icon: <MdCategory />, link: '/admin/categories' },
        { title: 'Team', icon: <RiTeamFill />, link: '/admin/team' },
    ] : [];

    return (
        <>
            {/* Hamburger menu for mobile */}
            <div className="md:hidden p-4 bg-[#111c43]  text-white flex justify-between items-center">
                <h2 className="font-bold text-lg">Admin Panel</h2>
                <FiMenu className="text-2xl cursor-pointer" onClick={() => setIsOpen(!isOpen)} />
            </div>

            {/* Sidebar */}
            <div className={`bg-[#111c43] min-h-screen w-56 fixed md:static z-20 top-0 left-0 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                <div className="flex items-center gap-2 p-4 bg-white">
                    <img src="/logo.jpeg" alt="Logo" className="h-10 rounded" />
                    <div>
                        <span className="text-lg font-bold">Bhardwaj</span><br />
                        <span className="text-sm font-semibold">Architects</span>
                    </div>
                </div>
                <ul className="flex flex-col gap-8 p-4 font-semibold text-xl pt-10 text-white">
                    {menu.map((item, i) => (
                        <li
                            key={i}
                            className={`p-4 rounded hover:bg-[#1e2d63] hover:scale-110 duration-300 border-b border-gray-700 ${location.pathname === item.link ? 'bg-[#1e2d63]' : ''}`}
                        >
                            <Link to={item.link} className="flex items-center gap-6">
                                {item.icon}
                                <span>{item.title}</span>
                            </Link>
                        </li>
                    ))}
                    {token && (
                        <li
                            onClick={handleLogout}
                            className="p-3 rounded hover:scale-110 duration-300 hover:bg-red-600 flex items-center border-b border-gray-700 gap-3 cursor-pointer"
                        >
                            <CiLogout />
                            <span>Logout</span>
                        </li>
                    )}
                </ul>
            </div>
        </>
    );
}
