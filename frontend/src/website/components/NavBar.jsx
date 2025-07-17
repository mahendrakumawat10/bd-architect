import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import Enquiry from './EnquiryForm';

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-white shadow-md px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <div className="mr-3">
                <img src="/logo.jpeg" alt="Bhardwaj Architect" className="h-10 rounded-lg shadow-lg" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-wide text-black">Bhardwaj</span>
                <span className="text-sm font-semibold tracking-wider text-black">Architects</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-black font-semibold hover:text-red-800 hover:font-bold transition duration-300">Home</Link>
              <Link to="/about" className="text-black font-semibold hover:text-red-800 hover:font-bold transition duration-300">About</Link>
              <Link to="/projects" className="text-black font-semibold hover:text-red-800 hover:font-bold transition duration-300">Projects</Link>
              <Link to="/services" className="text-black font-semibold hover:text-red-800 hover:font-bold transition duration-300">Services</Link>
              <Link to="/contact" className="text-black font-semibold hover:text-red-800 hover:font-bold transition duration-300">Contact</Link>
              <button
                onClick={() => setShowEnquiryForm(true)}
                className="ml-6 bg-red-600 text-white px-3 py-1 rounded-full font-semibold shadow-md hover:font-bold hover:bg-red-700/80 transition duration-300"
              >
                Enquiry Now
              </button>
            </div>

            {/* Mobile Navigation Toggle */}
            <div className="md:hidden">
              <button
                onClick={() => setMenuOpen(true)}
                className="text-black focus:outline-none"
                aria-label="Open menu"
              >
                <FiMenu size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="fixed top-0 right-0 h-screen w-4/5 bg-white shadow-lg p-6 z-50 transition-transform duration-300">
            <div className="flex justify-end mb-8">
              <button
                onClick={() => setMenuOpen(false)}
                className="text-black focus:outline-none"
                aria-label="Close menu"
              >
                <FiX size={24} />
              </button>
            </div>
            <div className="flex flex-col space-y-6">
              <Link to="/" onClick={() => setMenuOpen(false)} className="text-black font-semibold text-lg hover:text-red-800 hover:font-bold transition duration-300">Home</Link>
              <Link to="/about" onClick={() => setMenuOpen(false)} className="text-black font-semibold text-lg hover:text-red-800 hover:font-bold transition duration-300">About</Link>
              <Link to="/projects" onClick={() => setMenuOpen(false)} className="text-black font-semibold text-lg hover:text-red-800 hover:font-bold transition duration-300">Projects</Link>
              <Link to="/services" onClick={() => setMenuOpen(false)} className="text-black font-semibold text-lg hover:text-red-800 hover:font-bold transition duration-300">Services</Link>
              <Link to="/contact" onClick={() => setMenuOpen(false)} className="text-black font-semibold text-lg hover:text-red-800 hover:font-bold transition duration-300">Contact</Link>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setShowEnquiryForm(true);
                }}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-full text-center shadow-md hover:bg-red-700 transition duration-300"
              >
                Enquiry Now
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Enquiry Modal (global, outside nav) */}
      {showEnquiryForm && (
        <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-red-600">Enquiry Form</h3>
              <button onClick={() => setShowEnquiryForm(false)} className="text-gray-500 hover:text-red-500 text-2xl">&times;</button>
            </div>
            <Enquiry onClose={() => setShowEnquiryForm(false)} />
          </div>
        </div>
      )}
    </>
  );
}
