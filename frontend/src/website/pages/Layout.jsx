import React, { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

export default function Layout() {
  const location = useLocation();

  useEffect(() => {
    // Smooth scroll to top on every location change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location]);

  return (
    <>
      <NavBar />
      <div className='min-h-screen'>
        <Outlet key={location.pathname + location.search} />
      </div>
      <Footer />
    </>
  )
}
