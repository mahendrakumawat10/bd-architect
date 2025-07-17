import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import { FaMapMarkerAlt, FaCalendarAlt, FaChartArea, FaArrowRight, FaCircle } from 'react-icons/fa';
import { MainContext } from '../../Context';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Gallery arrows
const GalleryNextArrow = ({ onClick }) => (
  <div onClick={onClick} className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-red-500 text-white p-3 rounded-full cursor-pointer z-10 hover:bg-red-600 transition">
    <FaArrowRight />
  </div>
);

const GalleryPrevArrow = ({ onClick }) => (
  <div onClick={onClick} className="absolute -left-4 top-1/2 transform -translate-y-1/2 bg-red-500 text-white p-3 rounded-full cursor-pointer z-10 hover:bg-red-600 transition">
    <FaArrowRight className="rotate-180" />
  </div>
);

// Gallery settings
const gallerySettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  nextArrow: <GalleryNextArrow />,
  prevArrow: <GalleryPrevArrow />,
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 2 } },
    { breakpoint: 640, settings: { slidesToShow: 1 } },
  ],
};

export default function ProjectDetails() {
  const { id } = useParams(); // this is _id
  const { project: allProjects, IMAGE_URL, projectHandler } = useContext(MainContext);
  const [project, setProject] = useState(null);
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    if (allProjects.length === 0) {
      projectHandler();
    }
  }, [allProjects.length, projectHandler]);

  useEffect(() => {
    const found = allProjects.find(p => p._id === id);
    setProject(found);
  }, [id, allProjects]);

  if (!project) {
    return <div className="p-12 text-center text-xl">Project not found</div>;
  }

  return (
    <main className="flex-grow">
      {/* Banner */}
      <section className="relative h-[60vh]">
        <motion.img
          initial={{ scale: 1.1, rotateZ: 4 }}
          animate={{ scale: 1, rotateZ: 0 }}
          transition={{ duration: 1.4 }}
          src={`${IMAGE_URL}/${project.image}`}
          alt={project.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <motion.div className="absolute inset-0 flex items-end justify-start text-white bg-black/40 p-6 md:p-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}>
          <div className="max-w-2xl space-y-4">
            <span className="text-red-500 text-sm font-bold bg-white py-1 px-2 rounded-full ml-4">
              #{project.category?.name}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold">{project.title}</h1>
            <p className="text-gray-200">{project.description}</p>
            <div className="flex flex-wrap gap-6 text-md text-gray-200 font-semibold">
              <div className="flex items-center gap-2"><FaMapMarkerAlt className="text-red-600" />{project.location}</div>
              <div className="flex items-center gap-2"><FaCalendarAlt className="text-red-600" />{project.year}</div>
              <div className="flex items-center gap-2"><FaChartArea className="text-red-600" />{project.area}</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left */}
          <div className="lg:col-span-2 space-y-12">
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h2 className="text-3xl font-bold mb-4">Overview</h2>
              <p className="text-gray-700">{project.overview}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h2 className="text-3xl font-bold mb-2">Project Details</h2>
              <div className="h-1 w-20 bg-red-500 mb-4" />
              <p className="text-gray-500">{project.longDescription}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h2 className="text-3xl font-bold mb-2">Our Approach</h2>
              <div className="h-1 w-20 bg-red-500 mb-4" />
              <p className="text-gray-600">{project.approach}</p>
            </motion.div>
            {project.features?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h3 className="text-xl font-semibold mb-4">Key Features</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-2">
                  {project.features.map((f, idx) => (
                    <li key={idx} className="flex items-start"><FaCircle className="text-red-500 text-xs mt-1 mr-2" />{f}</li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>

          {/* Right */}
          <div>
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="bg-gray-50 p-6 rounded-lg shadow mb-10">
              <h3 className="text-xl font-semibold mb-4">Project Summary</h3>
              <div className="space-y-4 text-gray-700 text-sm">
                <p><strong>Client:</strong> {project.client}</p>
                <p><strong>Location:</strong> {project.location}</p>
                <p><strong>Year:</strong> {project.year}</p>
                <p><strong>Area:</strong> {project.area}</p>
                <p><strong>Category:</strong> {project.category?.name}</p>
              </div>
            </motion.div>
            <div className="bg-red-100/20 p-6 rounded-lg border-l-4 border-red-500">
              <h3 className="text-xl font-semibold mb-2">Interested in a similar project?</h3>
              <p className="text-gray-500 mb-4">Contact us today to discuss your vision.</p>
              <Link to="/contact" className="inline-block bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition">Get in Touch</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      {project.gallery?.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <p className="text-red-500 font-semibold">Our Gallery</p>
              <h2 className="text-3xl font-bold">Project Showcase</h2>
              <div className="w-20 h-1 bg-red-500 mx-auto mt-2" />
            </motion.div>
            <Slider {...gallerySettings}>
              {project.gallery.map((img, i) => (
                <div key={i} className="px-2">
                  <motion.img
                    src={`${IMAGE_URL}/${img}`}
                    alt={`Gallery ${i + 1}`}
                    className="w-full h-64 object-cover rounded shadow cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.15, ease: "easeInOut" }}
                    onClick={() => setActiveImage(`${IMAGE_URL}/${img}`)}
                  />

                </div>
              ))}
            </Slider>
          </div>
        </section>
      )}
      {activeImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="relative max-w-5xl w-full h-full flex items-center justify-center px-4">
            <img
              src={activeImage}
              alt="Full Preview"
              className="max-h-[90vh] max-w-full object-contain rounded"
            />
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-4 right-4 text-white bg-red-600 hover:bg-red-700 px-2 font-bold rounded-full text-xl shadow"
              aria-label="Close preview"
            >
              ×
            </button>
          </div>
        </div>
      )}
      {/* Back Button */}
      <div className="text-center py-12">
        <Link to="/projects" className="bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700 transition">Back to Projects</Link>
      </div>
    </main>
  );
}
