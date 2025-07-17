import React, { useContext, useEffect, useState } from 'react'
import { FaArrowRight, FaBullseye, FaHandshake, FaLeaf, FaLightbulb } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import { MainContext } from '../../Context';

const timelineData = [
  {
    phase: "Vision",
    title: "Our Beginning",
    description:
      "Started with a passion for creating architectural designs that blend functionality with aesthetic appeal, focusing on client-centered solutions.",
  },
  {
    phase: "Growth",
    title: "Building Foundations",
    description:
      "Established strong relationships with clients and contractors while developing our signature approach to residential and commercial architecture.",
  },
  {
    phase: "Innovation",
    title: "Design Evolution",
    description:
      "Integrated modern design technologies and sustainable practices to create more efficient and environmentally conscious architectural solutions.",
  },
  {
    phase: "Recognition",
    title: "Industry Acknowledgment",
    description:
      "Gained recognition in the architectural community for our innovative designs and commitment to quality craftsmanship.",
  },
  {
    phase: "Expansion",
    title: "Growing Horizons",
    description:
      "Expanded our services to include interior design, landscape architecture, and comprehensive project management solutions.",
  },
  {
    phase: "Future",
    title: "Continuing Forward",
    description:
      "Committed to pushing boundaries in architectural design while maintaining our core values of excellence, sustainability, and client satisfaction.",
  },
];

const valueData = [
  {
    icon: <FaBullseye />,
    title: "Excellence", text: "We pursue excellence in every aspect of our work, from conceptual design to final execution."
  },
  {
    icon: <FaHandshake />,
    title: "Collaboration", text: "We believe in the power of collaboration, working closely with clients to bring their vision to life."
  },
  {
    icon: <FaLeaf />,
    title: "Sustainability",
    text: "We are committed to sustainable practices that minimize environmental impact and promote well-being."
  },
  {
    icon: <FaLightbulb />,
    title: "Innovation",
    text: "We continuously push boundaries to discover innovative solutions to architectural challenges."
  },
];

const NextArrow = ({ onClick }) => (
  <div
    onClick={onClick}
    className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-red-500 text-white p-3 rounded-full cursor-pointer z-10 hover:bg-red-600 transition"
  >
    <FaArrowRight />
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div
    onClick={onClick}
    className="absolute -left-4 top-1/2 transform -translate-y-1/2 bg-red-500 text-white p-3 rounded-full cursor-pointer z-10 hover:bg-red-600 transition"
  >
    <FaArrowRight className="rotate-180" />
  </div>
);

export default function About() {

  const [teamMembers, setTeamMembers] = useState([]);
  const { teamHandler, IMAGE_URL } = useContext(MainContext);

  useEffect(() => {
    async function fetchTeam() {
      const data = await teamHandler();
      setTeamMembers(Array.isArray(data) ? data : []);
    }

    fetchTeam();
  }, [teamHandler]);

  const teamSliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 5000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 }
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 }
      }
    ]
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/50 z-10"></div>
          <img
            src="/about-bg.png"
            alt="About Bhardwaj Architect"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="container relative z-20 mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            About Us
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-lg text-gray-200 max-w-2xl mx-auto"
          >
            Excellence in architectural design since 2017
          </motion.p>
        </div>
      </section>

      {/* Our Story */}
      <section className="bg-gray-50 px-4 py-16 text-red-950">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left Text Section */}
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            viewport={{ once: false, amount: 0.3 }}
          >
            <div className="max-w-3xl mb-12 text-left">
              <span className="inline-block text-red-600 font-medium mb-1">
                JOURNEY OF EXCELLENCE
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Story</h2>
              <div className="h-1 w-20 bg-red-600 mb-4"></div>
              <div className="space-y-4 mt-6 text-black">
                <p>
                  Founded in 2017, our firm began with a vision to create architectural designs that are not just aesthetically pleasing but also functional, sustainable, and meaningful.
                </p>
                <p>
                  Over the years, we have evolved from a small studio into a comprehensive architecture and design practice, earning a reputation for innovative solutions and exceptional client service.
                </p>
                <p>
                  Today, Bhardwaj Architect stands as a testament to our unwavering commitment to architectural excellence. Our portfolio spans residential, commercial, and public projects, each reflecting our passion for design and attention to detail.
                </p>
                <p>
                  We continue to push boundaries, embracing new technologies and sustainable practices while staying true to our core values of excellence, integrity, and client satisfaction.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Image Section */}
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            viewport={{ once: false, amount: 0.3 }}
            className="relative"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-xl bg-gradient-to-br from-gray-200 to-gray-400 dark:from-gray-800 dark:to-gray-900">
              <img
                src="/about-story.jpg"
                alt="Our Story"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -top-4 -right-4 w-24 h-24 border-2 border-red-600 opacity-70 -z-10"></div>
            <div className="absolute -bottom-8 -left-6 w-32 h-32 border-2 border-red-600 opacity-70 -z-10 rounded-full"></div>
          </motion.div>

        </div>
      </section>

      {/* Our Values */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mb-12 text-center mx-auto">
            <motion.span
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.4 }}
              className="inline-block text-red-600 font-medium mb-1"
            >
              WHAT DRIVES US
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold mb-3"
            >
              Our Values
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5 }}
              className="h-1 w-20 bg-red-600 mb-4 mx-auto origin-left"
            />
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5 }}
              className="text-gray-600"
            >
              Our core values shape every aspect of our work and define who we are as a firm.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {valueData.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className="bg-gray-50 p-8 rounded-lg shadow-md hover:shadow-2xl transition-shadow duration-300 text-center border-t-2 border-red-600/20 hover:border-red-600 "
              >
                <div className="flex justify-center mb-4 text-4xl text-red-600">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-black mb-3">{item.title}</h3>
                <p className="text-gray-700">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            viewport={{ once: false, amount: 0.3 }} className="max-w-3xl text-center mx-auto mb-12" >
            <div className="max-w-3xl text-center mx-auto mb-12">
              <span className="inline-block text-red-600 font-medium mb-1">COMPANY TIMELINE</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-3">Our Journey</h2>
              <div className="h-1 w-20 bg-red-600 mb-4 mx-auto" />
              <p className="text-gray-600">The key milestones that have shaped our growth and success over the years.</p>
            </div>
          </motion.div>
          <div className="mt-16 max-w-4xl mx-auto relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-red-600 transform md:-translate-x-1/2"></div>
            {timelineData.map((item, index) => {
              const isRight = index % 2 === 0;

              return (
                <motion.div
                  key={index}
                  className={`relative flex items-center mb-12  ${isRight ? "md:flex-row-reverse" : ""}`}
                  initial={{ opacity: 0, x: isRight ? 100 : -100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-red-600 rounded-full transform -translate-x-1/2 border-4 border-red-50 z-10"></div>

                  <div className={`ml-12 md:ml-0 md:w-1/2 ${isRight ? "md:pr-8 md:text-right" : "md:pl-8"}`}>
                    <div className="bg-white  p-6 rounded-lg shadow-md">
                      <motion.span
                        initial={{ opacity: 0, y: -10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        viewport={{ once: false, amount: 0.3 }}
                        className="inline-block py-1 px-3 bg-red-500 text-white text-sm font-medium rounded-full mb-2"
                      >
                        {item.phase}
                      </motion.span>

                      <motion.h3
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        viewport={{ once: false, amount: 0.3 }}
                        className="text-xl font-semibold mb-2"
                      >
                        {item.title}
                      </motion.h3>
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        viewport={{ once: false, amount: 0.3 }}
                        className="text-gray-600"
                      >
                        {item.description}
                      </motion.p>
                    </div>
                  </div>
                </motion.div>
              );
            })}

          </div>
        </div>
      </section>

      {/* TEAM SECTION with Slider */}
      <section className="py-16 bg-white text-black">
        <div className="container mx-auto px-4 ">
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }} className="max-w-3xl text-center mx-auto mb-12" >
            <span className="inline-block text-red-600 font-medium mb-2">THE EXPERTS</span> <h2 className="text-3xl md:text-4xl font-bold mb-3">Meet Our Team</h2> <div className="h-1 w-16 bg-red-600 mb-6 mx-auto" /> <p className="text-gray-600">Our talented professionals bring diverse skills and expertise to every project.</p> </motion.div>
          {teamMembers.length > 0 ? (
            <Slider {...teamSliderSettings} className="-mx-3 mt-1 pb-5">
              {teamMembers.map((member, index) => (
                <div key={index} className="px-3 ">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-gray-50 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 "
                  >
                    {/* this member is defined properly */}
                    <div className="h-72 overflow-hidden rounded-t-lg bg-gradient-to-br from-gray-200 to-gray-400 dark:from-gray-800 dark:to-gray-900">
                      <img
                        src={`${IMAGE_URL}/${member.image}`}
                        alt={member.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                      <p className="text-red-600 font-medium mb-2">{member.role}</p>
                      <p className="text-gray-600 italic">{member.description}</p>
                    </div>
                  </motion.div>
                </div>
              ))}
            </Slider>
          ) : (
            <p className="text-center text-gray-500">No team members to display yet.</p>
          )}
        </div>
      </section>

      {/* Careers CTA */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-4">Join Our Team
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }} className="text-gray-600 mb-8 max-w-2xl mx-auto">
            We're always looking for talented individuals who share our passion for exceptional architecture and design.
          </motion.p>
          <Link to="/contact" className=" shadow-lg bg-red-600 text-white hover:bg-red-600 transition py-3 font-semibold rounded-sm px-6">
            View Openings
          </Link>
        </div>
      </section>
    </div>
  );
}
