import React from 'react'
import AdminSidebar from '../components/AdminSidebar'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header'

export default function AdminLayout() {
    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            <AdminSidebar />

            <div className="flex-1 flex flex-col bg-gray-50">
                <Header />
                <main className="flex-1 px-4 md:px-10 py-6">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
