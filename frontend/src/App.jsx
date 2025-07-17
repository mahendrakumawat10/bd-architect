import React, { useEffect } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './website/pages/Layout'
import Home from './website/pages/Home'
import About from './website/pages/About'
import Projects from './website/pages/Projects'
import Services from './website/pages/Services'
import Contact from './website/pages/Contact'
import ProjectDetails from './website/pages/ProjectDetails'
import AdminLogin from './admin/pages/AdminLogin'
import AdminLayout from './admin/pages/AdminLayout'
import PrivateRoute from './admin/components/PrivateRouter'
import AdminDashboard from './admin/pages/DashBoard'
import ProjectView from './admin/pages/projects/ProjectView'
import ProjectAdd from './admin/pages/projects/ProjectAdd'
import ProjectEdit from './admin/pages/projects/ProjectEdit'
import ServiceView from './admin/pages/services/ServiceView'
import ServiceAdd from './admin/pages/services/ServiceAdd'
import ServiceEdit from './admin/pages/services/ServiceEdit'
import CategoryView from './admin/pages/category/CategoryView'
import CategoryAdd from './admin/pages/category/CategoryAdd'
import CategoryEdit from './admin/pages/category/CategoryEdit'
import TeamView from './admin/pages/team/TeamView'
import TeamAdd from './admin/pages/team/TeamAdd'
import TeamEdit from './admin/pages/team/TeamEdit'
import Enquiry from './website/components/EnquiryForm'

export default function App() {
  const router = createBrowserRouter(
    [
      {
        path: '/',
        element: <Layout />,
        children: [
          { path: '/', element: <Home /> },
          { path: '/about', element: <About /> },
          { path: '/projects', element: <Projects /> },
          { path: '/projects/:id', element: <ProjectDetails /> },
          { path: '/services', element: <Services /> },
          { path: '/contact', element: <Contact /> },
          { path: 'contact/enquiry', element: <Enquiry /> },
        ]
      },
      { path: '/admin/login', element: <AdminLogin />, },
      {
        path: '/admin',
        element: <AdminLayout />,
        children: [
          { path: "", element: (<PrivateRoute><AdminDashboard /></PrivateRoute>), },
          { path: "projects", element: (<PrivateRoute><ProjectView /></PrivateRoute>), },
          { path: "projects/add", element: (<PrivateRoute><ProjectAdd /></PrivateRoute>), },
          { path: "projects/edit/:id", element: (<PrivateRoute><ProjectEdit /></PrivateRoute>), },
          { path: "services", element: (<PrivateRoute><ServiceView /></PrivateRoute>), },
          { path: "services/add", element: (<PrivateRoute><ServiceAdd /></PrivateRoute>), },
          { path: "services/edit/:id", element: (<PrivateRoute><ServiceEdit /></PrivateRoute>), },
          { path: "categories", element: (<PrivateRoute><CategoryView /></PrivateRoute>), },
          { path: "categories/add", element: (<PrivateRoute><CategoryAdd /></PrivateRoute>), },
          { path: "categories/edit/:id", element: (<PrivateRoute><CategoryEdit /></PrivateRoute>), },
          { path: "team", element: (<PrivateRoute><TeamView /></PrivateRoute>), },
          { path: "team/add", element: (<PrivateRoute><TeamAdd /></PrivateRoute>), },
          { path: "team/edit/:id", element: (<PrivateRoute><TeamEdit /></PrivateRoute>), },
        ]
      }
    ]
  )

  return (
    <RouterProvider router={router} />
  )
}
