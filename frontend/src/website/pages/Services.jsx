import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaChevronDown, FaTools, FaCheckCircle,
} from 'react-icons/fa';
import { IoIosArrowDown } from "react-icons/io";
import { motion } from 'framer-motion';
import { MainContext } from '../../Context';
import * as FaIcons from 'react-icons/fa';
import * as MdIcons from 'react-icons/md';
import * as AiIcons from 'react-icons/ai';
import * as GiIcons from 'react-icons/gi';

const iconLibraries = {
  Fa: FaIcons,
  Md: MdIcons,
  Ai: AiIcons,
  Gi: GiIcons,
};
const getIconComponent = (iconName) => {
  const prefix = iconName?.slice(0, 2); // Fa, Md, Ai etc.
  const iconSet = iconLibraries[prefix];
  return iconSet?.[iconName] || null;
};
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const slugify = str =>
  str.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

// Service Section Component
function ServiceSection({ id, title, description, icon, image, items, isOpen, onToggle, isActive }) {
  return (
    <div id={id} className="scroll-mt-24">
      <div className={`border border-red-400/20 rounded-lg overflow-hidden ${isOpen ? 'bg-gray-50' : 'bg-white'}`}>
        <div className="p-6 cursor-pointer flex justify-between items-center" onClick={onToggle}>
          <div className="flex items-center">
            <div className="mr-4 text-red-600 text-4xl">{icon}</div>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold text-red-950">{title}</h3>
              {!isActive && (
                <span className="text-sm font-medium bg-red-100 text-red-700 px-2 py-0.5 rounded">
                  Inactive
                </span>
              )}
            </div>

          </div>
          <div
            className="text-red-600 transition-transform duration-300"
            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}
          >
            <FaChevronDown />
          </div>
        </div>
        {isOpen && (
          <div className="overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 pt-0 border-t border-border">
              <div>
                <p className="text-gray-500 my-4">{description}</p>
                <h4 className="text-lg font-semibold mb-3">Our Process</h4>
                {items.length > 0 ? (
                  <ul className="space-y-2 mb-6">
                    {items.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <FaCheckCircle className="text-red-600 mt-1 mr-2" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-400 mb-6">No process steps available.</p>
                )}
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center font-medium transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-md cursor-pointer bg-transparent border-2 border-red-200 hover:bg-red-500/10 text-red-500 px-6 py-3 mt-4"
                >
                  Inquire About This Service
                </Link>
              </div>
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-lg">
                <img
                  loading="lazy"
                  src={image}
                  alt={title}
                  onError={(e) => (e.target.src = '/fallback.jpg')}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Main Services Component
export default function Services() {
  const { API_BASE_URL, IMAGE_URL } = useContext(MainContext);
  const [openServiceId, setOpenServiceId] = useState(null);
  const location = useLocation();
  const [servicesList, setServicesList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/services`);
        if (!res.ok) throw new Error("Failed to fetch services");
        const data = await res.json();
        setServicesList(data.data || []);
      } catch (err) {
        console.error("Error fetching services:", err.message);
      } finally {
        setLoading(false);
      }
    }; fetchServices();
  }, [API_BASE_URL]);

  useEffect(() => {
    if (!loading && location.state?.openServiceId) {
      const id = location.state.openServiceId;
      setOpenServiceId(id);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150); // optional: fine-tune delay
    }
  }, [location.state, loading]);

  const handleToggle = (id) => {
    setOpenServiceId(prev => (prev === id ? null : id));
  };

  const scrollToAndOpen = (id) => {
    setOpenServiceId(id); // Trigger render/update
  };
  useEffect(() => {
    if (openServiceId) {
      const el = document.getElementById(openServiceId);
      if (el) {
        // Slight delay gives time for DOM to update/render
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }
    }
  }, [openServiceId]);

  const services = servicesList.map(service => {
    const iconComp = getIconComponent(service?.icon);
    if (!iconComp) console.warn(`Unknown icon: ${service?.icon}`);

    return {
      Icon: iconComp || FaTools,
      title: service.title,
      description: service.description,
      link: `#${slugify(service.title)}`,
      isActive: service.isActive,
    };
  });

  const servicesDetails = servicesList.map(service => ({
    id: slugify(service.title),
    title: service.title,
    description: service.description,
    icon: React.createElement(getIconComponent(service?.icon) || FaTools),
    image: `${IMAGE_URL}/${service.image}`,
    items: Array.isArray(service.processSteps) ? service.processSteps : [],
    isActive: service.isActive, // ✅ important!
  }));


  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <div className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/60 z-10" />
          <img src="/services-bg.png" alt="Bhardwaj Architect Services" className="w-full h-full object-cover" />
        </div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={fadeInUp}
          className="container relative z-20 mx-auto px-4 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Services</h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Comprehensive architectural solutions tailored to your unique vision and requirements
          </p>
        </motion.div>
      </div>

      {/* What We Offer */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto">
          <div className="max-w-3xl mb-12 text-center mx-auto">
            <span className="inline-block text-red-500 font-medium mb-1">OUR SERVICES</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">What We Offer</h2>
            <div className="h-1 w-20 bg-red-500 mb-4 mx-auto" />
            <p className="text-gray-500">We provide a comprehensive range of architectural and design services to bring your vision to life.</p>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-md animate-pulse">
                  <div className="w-12 h-12 bg-red-200 rounded-full mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-2"></div>
                  <div className="h-3 bg-gray-100 rounded w-3/4 mx-auto mb-4"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/2 mx-auto"></div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
            >
              {services.map(({ Icon, title, description, link, isActive }, idx) => (
                <motion.div
                  key={idx}
                  variants={cardVariants}
                  whileHover={{ y: -8, transition: { type: 'spring', stiffness: 200 } }}
                  className={`relative bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-center border-t-2
      border-red-500/20 hover:border-red-500
      ${!isActive ? 'opacity-60 ' : ''}`}
                >
                  {/* Status Badge */}
                  <span className={`absolute top-2 right-2 text-sm font-semibold px-2 py-1  rounded-md 
      ${isActive ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'}`}>
                    {isActive ? 'Active' : 'Inactive'}
                  </span>

                  <div className="flex justify-center mb-4">
                    <Icon className="text-4xl text-red-600" />
                  </div>

                  <h3 className="text-2xl font-semibold mb-2">{title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{description}</p>


                  <button
                    onClick={() => scrollToAndOpen(link.replace('#', ''))}
                    className="inline-flex items-center text-red-500 hover:text-red-700 font-medium transition-colors duration-300"
                  >
                    Learn More <IoIosArrowDown className="w-4 h-4 ml-2" />
                  </button>

                </motion.div>
              ))}

            </motion.div>
          )}
        </div>
      </section>

      {/* Expertise Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto text-center mb-12">
          <span className="text-red-500 font-semibold mb-1 flex items-center justify-center gap-3">
            <FaTools className="text-red-600" /> OUR EXPERTISE
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Service Details</h2>
          <div className="h-1 w-20 bg-red-500 mb-3 mx-auto" />
          <p className="text-gray-500">Explore our comprehensive range of architectural services in detail.</p>
        </div>
        <div className="container mx-auto space-y-12 pb-12">
          {servicesDetails.map(service => (
            <motion.div
              key={service.id}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
            >
              <ServiceSection
                {...service}
                isOpen={openServiceId === service.id}
                onToggle={() => handleToggle(service.id)}
              />
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
