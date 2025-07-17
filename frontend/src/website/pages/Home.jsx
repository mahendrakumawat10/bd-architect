import React, { useContext, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import {
  FaArrowRight, FaAward, FaCheckCircle, FaClock,
  FaUsers, FaTools, FaQuoteLeft
} from 'react-icons/fa';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { MainContext } from '../../Context';
import * as FaIcons from "react-icons/fa";

const NextArrow = ({ onClick }) => (
  <div
    onClick={onClick}
    className="absolute -right-2 top-1/2 transform -translate-y-1/2 bg-red-500 text-white p-3 rounded-full cursor-pointer z-10 hover:bg-red-600 transition"
  >
    <FaArrowRight />
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div
    onClick={onClick}
    className="absolute -left-2 top-1/2 transform -translate-y-1/2 bg-red-500 text-white p-3 rounded-full cursor-pointer z-10 hover:bg-red-600 transition"
  >
    <FaArrowRight className="rotate-180" />
  </div>
);

const Stat = ({ icon, number, label, trigger }) => {
  const controls = useAnimation();
  const [count, setCount] = useState(0);

  useEffect(() => {
    let interval;
    if (trigger) {
      setCount(0);
      let start = 0;
      const target = parseInt(number);
      const step = Math.ceil(target / 40);

      interval = setInterval(() => {
        start += step;
        if (start >= target) {
          setCount(target);
          clearInterval(interval);
        } else {
          setCount(start);
        }
      }, 30);
    }
    return () => clearInterval(interval);
  }, [trigger, number]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={trigger ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.6 }}
      className="text-center p-4"
    >
      <div className="flex flex-col items-center justify-center">
        <div className="text-red-500 text-3xl mb-3">{icon}</div>
        <h4 className="text-4xl font-bold text-red-500">{count}+</h4>
        <p className="text-gray-600 mt-2">{label}</p>
      </div>
    </motion.div>
  );
};

const slugify = (str) =>
  str.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

const testimonials = [
  {
    name: "Rajesh Sharma",
    title: "CEO, Sharma Properties",
    initials: "RS",
    img: "clients/testimonial1.jpg",
    message: "Bhardwaj Architect transformed our vision into a stunning reality.",
  },
  {
    name: "Priya Patel",
    title: "Homeowner",
    initials: "PP",
    img: "clients/testimonial2.jpg",
    message: "Their ability to blend aesthetics with functionality is unmatched.",
  },
  {
    name: "Anita Verma",
    title: "Director, Horizon Developers",
    initials: "AV",
    img: "clients/testimonial3.jpg",
    message: "Beautiful and functional commercial space—truly collaborative.",
  },
  {
    name: "Rohan Mehta",
    title: "Architectural Critic",
    initials: "RM",
    img: "clients/testimonial4.jpg",
    message: "Bhardwaj Architect's work is a perfect blend of innovation and tradition.",
  }
];

export default function Home() {
  const { project, IMAGE_URL, projectHandler, services, serviceHandler } = useContext(MainContext);

  useEffect(() => {
    projectHandler();
    serviceHandler();
  }, []);

  const dynamicServices = Array.isArray(services)
    ? services.map(service => ({
      Icon: FaIcons[service.icon] || FaTools,
      title: service.title,
      description: service.description,
      link: `#${slugify(service.title)}`,
      isActive: service.isActive,
    }))
    : [];


  const [ref, inView] = useInView({ threshold: 0.3 }); // adjust if needed
  const [statTriggerKey, setStatTriggerKey] = useState(0);

  useEffect(() => {
    if (inView) {
      setStatTriggerKey(prev => prev + 1); // trigger fresh animation
    }
  }, [inView]);

  const testimonialSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 5000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="overflow-x-hidden">
      {/* HERO */}
      <section className="relative h-screen flex items-center justify-center">
        <img src="/hero-bg.png" alt="hero" className="absolute inset-0 object-cover w-full h-full" />
        <div className="absolute inset-0  bg-black/30" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative text-center px-4"
        >
          <p className="text-red-600 mb-4 uppercase tracking-wider animate-pulse">ELEVATING ARCHITECTURE TO NEW HEIGHTS</p>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 transition-transform text-white duration-500 hover:scale-105">
            Crafting Exceptional <br /> <span className="text-red-500">Architectural</span> Experiences
          </h1>
          <p className="max-w-xl mx-auto text-gray-300 mb-8">From concept to completion, we turn visions into lasting realities.</p>
          <div className="space-x-4">
            <Link to="/projects" className="bg-red-500 px-6 py-3 rounded text-white font-semibold hover:bg-red-600 transition shadow-md hover:shadow-lg">Our Projects</Link>
            <Link to="/contact" className="border font-semibold border-red-500 px-6 py-3 rounded text-gray-200 hover:bg-red-500/20 transition">Contact Us</Link>
          </div>
        </motion.div>
      </section>

      {/* ABOUT */}
      <section className="py-16 px-4 bg-white text-950">
        <div className="relative z-10 container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-red-500 uppercase font-semibold mb-2">Our Journey</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">About Bhardwaj Architect</h2>
            <div className="w-20 h-1 bg-red-500 mb-4"></div>
            <p className="mb-4 text-gray-600">At Bhardwaj Architects, we don't just build structures — we craft experiences. What started as a small design studio with a big vision has grown into a trusted name in architecture, known for creativity, precision, and passion.</p>
            <p className="mb-4 text-gray-600">Our journey began with a simple idea: to design spaces that reflect the people who live and work in them. Over the years, we've brought that vision to life through residential, commercial, and urban projects — each one guided by thoughtful planning, timeless aesthetics, and functional innovation.</p>
            <p className="text-gray-600 mb-8">Rooted in architectural excellence and driven by a client-first approach, we blend modern design with practical solutions to create environments that inspire. Whether it's a cozy home or a bold commercial space, every project we take on is a new story waiting to be told — and we're here to help you tell yours.</p>
            <Link to="/about" className="bg-red-500 px-5 py-3 rounded hover:bg-red-600-light transition text-white font-semibold ">Learn More...</Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative group">
              <img
                src="/about-image.jpg"
                alt="About us"
                className="rounded-lg shadow-lg w-full group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute -top-4 -left-4 w-20 h-20 border-4 border-red-600/40 font-semibold rounded-lg"></div>
              <div className="absolute -bottom-5 -right-4 w-28 h-28 border-4 border-red-600/40 font-semibold rounded-full"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="bg-gray-50 py-16 text-center text-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto mb-12"
          >
            <p className="text-red-500 uppercase mb-2">Our Recent Work</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Projects</h2>
            <div className="w-16 h-1 bg-red-500 mx-auto mb-3"></div>
            <p className="text-gray-600">Explore innovative architectural stories we've built.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {project.slice(0, 3).map((p, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.03 }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="group relative h-80 rounded-lg overflow-hidden shadow-lg"
              >
                <img
                  src={`${IMAGE_URL}/${p.image}`}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70" />
                <div className="absolute bottom-0 w-full text-white p-4 text-justify ">
                  <span className=" px-2 py-1 font-semibold text-xs bg-red-500 rounded mb-2 inline-block">
                    #{p.category?.name}
                  </span>
                  <h3 className="text-xl font-bold mb-1">{p.title}</h3>
                  <p className="text-sm text-gray-100">{p.location} • {p.year}</p>
                  <p className="text-sm text-gray-200 max-h-0 overflow-hidden opacity-0 group-hover:max-h-24 group-hover:opacity-100 transition-all duration-500">
                    {p.description}
                  </p>
                  <Link
                    to={`/projects/${p._id}`}
                    className="inline-flex font-semibold items-center text-red-500 bg-red-100/30 px-3 py-1 rounded hover:bg-white/30 transition mt-1"
                  >
                    View <FaArrowRight className="ml-2" />
                  </Link>
                </div>
              </motion.div>
            ))}

          </div>
          <div className="mt-10 text-center">
            <Link
              to="/projects"
              className="bg-red-500 text-white px-5 py-3 rounded hover:bg-red-600 font-semibold transition"
            >
              View All Projects
            </Link>
          </div>
        </div>

      </section>

      {/* SERVICES */}
      <section className="py-16 px-4 bg-white text-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto mb-12 text-center relative z-10"
          >
            <p className="text-red-500 uppercase mb-1">What We Offer</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Our Services</h2>
            <div className="w-24 h-1 bg-red-500 mx-auto mb-3"></div>
            <p className="text-gray-600">
              A full suite of design services to bring your vision to life.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12 relative z-10">
            {dynamicServices.slice(0, 4).map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative p-8 rounded-lg border shadow-md text-center hover:shadow-xl hover:scale-105 transition-all duration-300
      ${!s.isActive ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {/* Status Badge */}
                <span className={`absolute top-2 right-2 text-sm font-semibold px-2 py-1 rounded-md 
      ${s.isActive ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'}`}>
                  {s.isActive ? 'Active' : 'Inactive'}
                </span>

                <div className="w-16 h-16 flex items-center justify-center text-2xl bg-white/10 rounded-full mb-4 mx-auto">
                  <s.Icon className="text-4xl text-red-500" />
                </div>

                <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
                <p className="text-gray-600 mb-4 text-sm">{s.description}</p>

                <div className="text-center">

                  <Link
                    to="/services"
                    state={{ openServiceId: s.link?.split('#')[1] }}
                    className="inline-flex items-center text-red-500 hover:text-black transition"
                  >
                    Learn More <FaArrowRight className="ml-2" />
                  </Link>
                </div>
              </motion.div>
            ))}

          </div>

          <div className="mt-10 text-center">
            <Link
              to="/services"
              className="bg-red-500 text-white px-5 py-3 rounded hover:bg-red-600 font-semibold transition"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 px-4 bg-gray-50 text-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto mb-12 text-center"
          >
            <p className="text-red-500 uppercase mb-2">Client Testimonials</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">What Our Clients Say</h2>
            <div className="w-24 h-1 bg-red-500 mx-auto mb-3"></div>
            <p className="text-gray-600">Their words tell our story.</p>
          </motion.div>

          <Slider {...testimonialSettings} className="mt-12">
            {testimonials.map((t, i) => (
              <div key={i} className="px-4"> {/* 👈 Add horizontal padding here */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white shadow-md rounded-lg p-6 md:p-8 lg:p-10 border border-gray-200 hover:shadow-xl transition-all h-full flex flex-col"
                >
                  <FaQuoteLeft className="text-red-500 text-3xl mb-3 opacity-50" />
                  <p className="text-gray-700 mb-6 leading-relaxed text-base lg:text-lg">"{t.message}"</p>
                  <div className="flex items-center pt-4 border-t border-gray-200">
                    <img
                      src={t.img}
                      alt={t.name}
                      className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover mr-4 border border-red-500"
                    />
                    <div>
                      <h4 className="font-semibold text-base md:text-lg">{t.name}</h4>
                      <p className="text-gray-600 text-sm">{t.title}</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </Slider>

        </div>
      </section>


      {/* STATS */}
      <section
        ref={ref}
        onMouseEnter={() => setStatTriggerKey(prev => prev + 1)}
        className="py-16 px-4  text-center bg-white"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto mb-12 text-center"
          >
            <p className="text-red-500 uppercase mb-1">Company Statistics</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Our Impact in Numbers</h2>
            <div className="w-28 h-1 bg-red-500 mx-auto mb-3"></div>
            <p className="text-gray-600">A glimpse into our journey of growth, innovation, and excellence.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12 mx-w-5xl">
            <Stat icon={<FaClock />} number="9" label="Years of Experience" trigger={statTriggerKey} />
            <Stat icon={<FaCheckCircle />} number="100" label="Projects Completed" trigger={statTriggerKey} />
            <Stat icon={<FaUsers />} number="45" label="Team Members" trigger={statTriggerKey} />
            <Stat icon={<FaAward />} number="18" label="Design Awards" trigger={statTriggerKey} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16  bg-gray-50 text-black text-center">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your <span className="text-red-500">Vision</span>?
            </h2>
            <p className="text-gray-600 mb-8">
              Let’s collaborate to create exceptional architectural spaces just for you.
            </p>
            <Link
              to="/contact"
              className="bg-red-500 px-6 py-3 rounded text-white font-semibold hover:bg-red-500-light transition"
            >
              Get in Touch
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
