import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFilter, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { MainContext } from '../../Context';

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { project: allProjects, IMAGE_URL, projectHandler } = useContext(MainContext);

  useEffect(() => {
    projectHandler();
  }, [projectHandler]);

  const filteredProjects =
    selectedCategory === 'All'
      ? allProjects
      : allProjects.filter((p) => p.category?.name === selectedCategory);

  const uniqueCategories = ['All', ...new Set(allProjects.map(p => p.category?.name).filter(Boolean))];

  return (
    <div>
      {/* Header Section */}
      <div className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/60 z-10" />
          <img
            src="./projects-bg.png"
            alt="Bhardwaj Architect Projects"
            className="w-full h-full object-cover absolute inset-0 z-0"
          />
        </div>
        <div className="container relative z-20 mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Projects</h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Discover our portfolio of architectural excellence spanning residential, commercial, and public spaces.
          </p>
        </div>
      </div>

      {/* Filter & Section Title */}
      <section className="bg-white py-16">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
            <div className="max-w-3xl text-left">
              <span className="inline-block text-red-500 font-medium mb-1">OUR PORTFOLIO</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-3">Featured Projects</h2>
              <div className="w-20 h-1 bg-red-500"></div>
            </div>

            {/* Category Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {uniqueCategories.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedCategory(type)}
                  className={`px-4 py-2 rounded-md transition-all duration-300 ${
                    type === selectedCategory
                      ? 'bg-red-500 hover:bg-red-600 text-white shadow-md'
                      : 'bg-bg-secondary hover:bg-red-500/20 border border-red-100/60'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Project Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="group relative h-[400px] rounded-lg overflow-hidden shadow-lg bg-bg-secondary"
              >
                <img
                  src={`${IMAGE_URL}/${project.image}`}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80" />

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transition-all duration-500 ease-in-out">
                  <span className="inline-block px-3 py-1 mb-3 text-xs font-medium bg-red-500 text-white rounded">
                    #{project.category?.name}
                  </span>
                  <h3 className="text-xl font-bold mb-1">{project.title}</h3>
                  <div className="flex items-center text-sm text-gray-300 mb-2">
                    <span>{project.location}</span>
                    <span className="mx-2">•</span>
                    <span>{project.year}</span>
                  </div>

                  <p className="text-sm text-gray-200 max-h-0 overflow-hidden opacity-0 group-hover:max-h-24 group-hover:opacity-100 transition-all duration-500">
                    {project.description}
                  </p>

                  <Link
                    to={`/projects/${project._id}`}
                    className="inline-flex font-semibold items-center text-red-500 bg-red-100/30 px-3 py-1 rounded hover:bg-white/30 transition mt-2"
                  >
                    View <FaArrowRight className="ml-2" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Have a project in mind?</h2>
          <p className="text-text-light mb-8 max-w-2xl mx-auto">
            Let's collaborate to bring your architectural vision to life. Our team of experts is ready to create exceptional spaces tailored to your needs.
          </p>
          <motion.div
            whileHover={{ scale: 1.10, rotate: 2, transition: { type: 'spring', stiffness: 200 } }}
            viewport={{ once: false, amount: 0.3 }}
          >
            <Link to="/contact" className="bg-red-600 text-white font-semibold py-3 px-6 shadow-lg hover:bg-red-700/80 rounded-md">
              Get in Touch
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
