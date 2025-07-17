import axios from 'axios';
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { login, logout } from './redux/reducers/adminSlice';

const MainContext = createContext();

export default function Context({ children }) {
    const dispatch = useDispatch();

    // ✅ Base URLs
    const API_BASE_URL = 'http://localhost:5000/api';
    const PROJECT_URL = '/projects';
    const CATEGORY_URL = '/categories';
    const ADMIN_URL = '/admin';
    const IMAGE_URL = 'http://localhost:5000/uploads';
    const SERVICE_URL = '/services';
    const TEAM_URL = '/team';

    // ✅ State
    const [project, setProject] = useState([]);
    const [category, setCategory] = useState([]);
    const [adminToken, setAdminToken] = useState(null);
    const [services, setServices] = useState([]);

    // ✅ Toast
    const notify = (msg, flag = true) =>
        toast(msg, { type: flag ? 'success' : 'error' });
    // ✅ Logout Handler
    function logoutAdmin() {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");
        setAdminToken(null);
        dispatch(logout());
        notify("Logged out", true);
    }

    useEffect(() => {
        projectHandler();
        serviceHandler();
        categoryHandler();
    }, []);
    // ✅ Token check
    useEffect(() => {
        const storedToken = localStorage.getItem('adminToken');
        if (storedToken) {
            try {
                const decoded = jwtDecode(storedToken);
                if (decoded.exp * 1000 < Date.now()) {
                    localStorage.removeItem('adminToken');
                    localStorage.removeItem('admin');
                    notify("Session expired. Please login again.", false);
                } else {
                    setAdminToken(storedToken);
                    const storedAdmin = localStorage.getItem('admin');
                    if (storedAdmin) {
                        const parsedAdmin = JSON.parse(storedAdmin);
                        dispatch(login(parsedAdmin)); // ✅ full restore
                    }
                }
            } catch (err) {
                localStorage.removeItem('adminToken');
                localStorage.removeItem('admin');
                notify("Session expired. Please login again.", false);
            }
        }
    }, [dispatch]);

    // 📁 Project Handlers
    const projectHandler = useCallback(async (projectId = null) => {
        let url = API_BASE_URL + PROJECT_URL;
        if (projectId) url += `/${projectId}`;

        try {
            const res = await axios.get(url);
            const data = res.data;

            if (projectId) {
                setProject(data.data);
                return data.data;
            } else {
                setProject(data.data);
            }
        } catch (err) {
            console.error(err);
            notify('Failed to load project(s)', false);
        }
    }, [API_BASE_URL, PROJECT_URL])

    function createProject(data) {
        axios
            .post(API_BASE_URL + PROJECT_URL, data, {
                headers: {
                    Authorization: `Bearer ${adminToken}`,
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then(() => {
                notify('Project added successfully');
                projectHandler();
            })
            .catch((err) => {
                console.error(err);
                notify('Failed to add project', false);
            });
    }

    function updateProject(projectId, data) {
        axios
            .put(`${API_BASE_URL + PROJECT_URL}/${projectId}`, data, {
                headers: {
                    Authorization: `Bearer ${adminToken}`,
                    'Content-Type': 'multipart/form-data'
                },
            })
            .then(() => {
                notify('Project updated');
                projectHandler();
            })
            .catch((err) => {
                console.error(err);
                notify('Failed to update project', false);
            });
    }

    function deleteProject(projectId) {
        axios
            .delete(`${API_BASE_URL + PROJECT_URL}/${projectId}`, {
                headers: {
                    Authorization: `Bearer ${adminToken}`,
                },
            })
            .then(() => {
                notify('Project deleted');
                projectHandler();
            })
            .catch((err) => {
                console.error(err);
                notify('Failed to delete project', false);
            });
    }

    const serviceHandler = useCallback(async (serviceId = null) => {
        let url = API_BASE_URL + SERVICE_URL;
        if (serviceId) url += `/${serviceId}`;

        try {
            const res = await axios.get(url);
            const data = res.data;

            if (serviceId) {
                setServices(data.data);
                return data.data;
            } else {
                setServices(Array.isArray(data.data) ? data.data : []);
            }
        } catch (err) {
            console.error(err);
            notify('Failed to load service(s)', false);
            setServices([]);
        }
    }, [API_BASE_URL, SERVICE_URL]);

    function createService(data) {
        axios
            .post(API_BASE_URL + SERVICE_URL, data, {
                headers: {
                    Authorization: `Bearer ${adminToken}`,
                    'Content-Type': 'application/json',
                },
            })
            .then(() => {
                notify('Service added successfully');
                serviceHandler();
            })
            .catch((err) => {
                console.error(err);
                notify('Failed to add service', false);
            });
    }

    function updateService(serviceId, data) {
        axios
            .put(`${API_BASE_URL + SERVICE_URL}/${serviceId}`, data, {
                headers: {
                    Authorization: `Bearer ${adminToken}`,
                    'Content-Type': 'application/json',
                },
            })
            .then(() => {
                notify('Service updated successfully');
                serviceHandler();
            })
            .catch((err) => {
                console.error(err);
                notify('Failed to update service', false);
            });
    }

    function deleteService(serviceId) {
        axios
            .delete(`${API_BASE_URL + SERVICE_URL}/${serviceId}`, {
                headers: {
                    Authorization: `Bearer ${adminToken}`,
                },
            })
            .then(() => {
                notify('Service deleted');
                serviceHandler();
            })
            .catch((err) => {
                console.error(err);
                notify('Failed to delete service', false);
            });
    }

    const categoryHandler = useCallback(async (categoryId = null, type = null) => {
        let url = API_BASE_URL + CATEGORY_URL;
        if (categoryId) {
            url += `/${categoryId}`;
        } else if (type) {
            url += `?type=${type}`;
        }

        try {
            const res = await axios.get(url);
            const data = res.data;

            if (categoryId) {
                return data.data;
            } else {
                setCategory(data.data);
            }
        } catch (err) {
            console.error(err);
            notify('Failed to load category(ies)', false);
        }
    }, [API_BASE_URL, CATEGORY_URL]);

    async function createCategory(data) {
        try {
            const res = await axios.post(API_BASE_URL + CATEGORY_URL + '/create', data, {
                headers: {
                    Authorization: `Bearer ${adminToken}`,
                },
            });
            notify('Category created');
            await categoryHandler();
            return res.data;
        } catch (err) {
            console.error(err);
            notify('Failed to add category', false);
        }
    }
    async function updateCategory(categoryId, data) {
        try {
            const res = await axios.put(`${API_BASE_URL + CATEGORY_URL}/${categoryId}`, data, {
                headers: {
                    Authorization: `Bearer ${adminToken}`,
                },
            });
            notify('Category updated');
            await categoryHandler();
            return res.data;
        } catch (err) {
            console.error(err);
            notify('Failed to update category', false);
        }
    }

    async function deleteCategory(categoryId) {
        try {
            await axios.delete(`${API_BASE_URL + CATEGORY_URL}/${categoryId}`, {
                headers: {
                    Authorization: `Bearer ${adminToken}`,
                },
            });
            notify('Category deleted');
            await categoryHandler();
        } catch (err) {
            console.error(err);
            notify('Failed to delete category', false);
        }
    }
    const teamHandler = useCallback(async (teamId = null) => {
        let url = API_BASE_URL + TEAM_URL;
        if (teamId) url += `/${teamId}`;

        try {
            const res = await axios.get(url);
            const data = res.data;

            if (teamId) {
                return data.data;
            } else {
                return data.data || [];
            }
        } catch (err) {
            console.error(err);
            notify('Failed to load team member(s)', false);
            return [];
        }
    }, [API_BASE_URL, TEAM_URL]);

    function createTeam(data) {
        axios
            .post(API_BASE_URL + TEAM_URL, data, {
                headers: {
                    Authorization: `Bearer ${adminToken}`,
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then(() => {
                notify('Team member added successfully');
            })
            .catch((err) => {
                console.error(err.response?.data || err);
                notify('Failed to add team member', false);
            });
    }

    function updateTeam(teamId, data) {
        axios
            .put(`${API_BASE_URL + TEAM_URL}/${teamId}`, data, {
                headers: {
                    Authorization: `Bearer ${adminToken}`,
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then(() => {
                notify('Team member updated successfully');
            })
            .catch((err) => {
                console.error(err);
                notify('Failed to update team member', false);
            });
    }

    function deleteTeam(teamId) {
        axios
            .delete(`${API_BASE_URL + TEAM_URL}/${teamId}`, {
                headers: {
                    Authorization: `Bearer ${adminToken}`,
                },
            })
            .then(() => {
                notify('Team member deleted');
            })
            .catch((err) => {
                console.error(err);
                notify('Failed to delete team member', false);
            });
    }
    return (
        <MainContext.Provider
            value={{
                notify, API_BASE_URL, PROJECT_URL, CATEGORY_URL, ADMIN_URL, project, adminToken, setAdminToken, projectHandler, createProject, updateProject, deleteProject,
                category, categoryHandler, createCategory, updateCategory, deleteCategory, services, serviceHandler, createService, updateService, deleteService, teamHandler, createTeam, updateTeam, deleteTeam,
                logoutAdmin, IMAGE_URL,
            }} >
            {children}
            <ToastContainer />
        </MainContext.Provider>
    );
}

export { MainContext };
