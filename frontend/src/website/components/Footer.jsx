import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaArrowUp,
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      viewport={{ amount: 0.2 }}
      className="relative bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 text-white py-16 pb-8 px-4"
    >
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ amount: 0.2 }}
            className="space-y-5 "
          >
            <Link className="flex items-center space-x-4" to="/">
              <img
                src="/logo.jpeg"
                alt="Bhardwaj Architect"
                className="h-12 w-12 rounded-lg shadow-lg object-cover"
              />
              <div className="leading-tight">
                <h2 className="text-xl font-bold text-primary">Bhardwaj</h2>
                <p className="text-sm text-gray-300">Architects</p>
              </div>
            </Link>

            <p className="text-gray-400 leading-relaxed">
              Excellence in architectural design and innovation, creating spaces that inspire and endure.
            </p>

            {/* Social Media Icons */}
            <div className="flex flex-wrap gap-1 text-xl">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#3b5998] hover:text-white hover:bg-[#2d4373] p-2 rounded-full transition-colors"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1da1f2] hover:text-white hover:bg-[#0d8ddb] p-2 rounded-full transition-colors"
              >
                <FaTwitter />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#e4405f] hover:text-white hover:bg-[#d02c4a] p-2 rounded-full transition-colors"
              >
                <FaInstagram />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0077b5] hover:text-white hover:bg-[#005582] p-2 rounded-full transition-colors"
              >
                <FaLinkedinIn />
              </a>
              <a
                href="https://wa.me/+918700683138"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#25D366] hover:text-white hover:bg-[#1da851] p-2 rounded-full transition-colors"
              >
                <FaWhatsapp />
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ amount: 0.2 }}
            className="space-y-5 ml-14"
          >
            <h4 className="text-lg font-semibold text-primary">Quick Links</h4>
            <ul className="space-y-3 text-gray-400">
              {['Home', 'Projects', 'About', 'Services', 'Contact'].map((name, idx) => (
                <li key={idx}>
                  <Link to={`/${name.toLowerCase()}`} className="hover:text-white transition">
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Our Services */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ amount: 0.2 }}
            className="space-y-5"
          >
            <h4 className="text-lg font-semibold text-primary">Our Services</h4>
            <ul className="space-y-3 text-gray-400">
              {[
                'Architectural Design',
                'Interior Design',
                'Urban Planning',
                'Landscape Design',
                'Project Management',
                '3D Visualization',
              ].map((service, idx) => (
                <li key={idx}>
                  <Link
                    to={`/services#${service.toLowerCase().replace(/\s+/g, '-')}`}
                    className="hover:text-white transition"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ amount: 0.2 }}
            className="space-y-5"
          >
            <h4 className="text-lg font-semibold text-primary">Contact Information</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-primary mt-1" />
                <span>Bhardwaj Architects, Najafgarh, New Delhi, 110043</span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhone className="text-primary" />
                <a href="tel:+918700683138" className="hover:text-white transition">
                  +91 8700683138
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-primary" />
                <a href="mailto:bhardwajarchitects1@gmail.com" className="hover:text-white transition">
                  bhardwajarchitects1@gmail.com
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Footer Bottom */}
        <div className="text-center text-xs text-gray-500 border-t border-gray-700 pt-6">
          © 2025 Bhardwaj Architects. All rights reserved.
        </div>

      
      </div>
    </motion.footer>
  );
}
