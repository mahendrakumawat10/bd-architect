import React, { useContext, useState } from 'react';
import { FaChevronDown, FaFacebookF, FaInstagram, FaMapMarkerAlt, FaPhoneAlt, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import { FaLocationDot, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa6';
import { FiSend } from "react-icons/fi"
import { motion } from "framer-motion";
import { MainContext } from '../../Context';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      className={`bg-white border border-t-2 p-6 rounded-lg shadow-md hover:border-t-red-500 transition-all duration-300  ${isOpen ? "border-t-red-500" : "border-t-red-200/50"
        }`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.4 }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center w-full text-left text-lg font-semibold mb-2 focus:outline-none"
      >
        <FaChevronDown
          className={`mr-3 text-red-500 transform transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"
            }`}
        />
        {question}
      </button>
      {isOpen && (
        <p className="text-gray-500 hover:text-gray-700 mt-2">{answer}</p>
      )}
    </motion.div>
  );
};

const ContactCard = ({ icon, title, content }) => (
  <div className="min-h-[250px]  bg-white p-6 rounded-lg shadow-md text-center border-t-2 border-red-500/20 hover:border-red-500 transition-all duration-300">
    <div className="w-16 h-16 rounded-full bg-red-100/20 flex items-center justify-center mx-auto mb-4 hover:bg-red-100/50">
      {icon}
    </div>
    <h3 className="text-lg font-bold mb-2">{title}</h3>
    <div className="text-gray-600">
      {Array.isArray(content)
        ? content.map((line, i) => <div key={i}>{line}</div>)
        : content}
    </div>
  </div>
);

const Input = ({ label, ...props }) => (
  <div>
    <label className="block mb-2 font-medium">{label}</label>
    <input
      className="w-full px-4 py-3 rounded-md bg-gray-50 border border-border focus:border-red-500 focus:outline-none transition-colors"
      {...props}
    />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div>
    <label className="block mb-2 font-medium">{label}</label>
    <textarea
      className="w-full px-4 py-3 rounded-md bg-gray-50 border border-border focus:border-red-500 focus:outline-none transition-colors"
      rows="5"
      {...props}
    ></textarea>
  </div>
);

export default function Contact() {
  const { API_BASE_URL, notify } = useContext(MainContext);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  try {
    console.time("submit");

    const res = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    console.timeEnd("submit");

    const contentType = res.headers.get("content-type");
    const result = contentType?.includes("application/json")
      ? await res.json()
      : {};

    if (res.ok && result.success) {
      notify("Message sent successfully!", "success");
      e.target.reset(); // ✅ ONLY ONE reset
    } else {
      notify(result.message || "Something went wrong", "error");
    }

  } catch (err) {
    console.error('Error sending message:', err);
    notify('Failed to send message. Please try again later.');
  } finally {
    setLoading(false);
  }
};


  return (
    <div>
      {/* Hero Section */}
      <motion.section className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/60 z-10"></div>
          <img
            src="/projects-bg.png"
            alt="Bhardwaj Architect Contact"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container relative z-20 mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Get in touch with our team to discuss your architectural project
          </p>
        </div>
      </motion.section>
      {/* Contact Info Section */}
      <section className="py-16 bg-gray-50 text-center"  >
        <div className="container mx-auto  px-4">
          <motion.div className="max-w-3xl mb-12 text-center mx-auto"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false, amount: 0.2 }}>
            <span className="inline-block text-red-500 mb-1">CONTACT INFORMATION</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Get In Touch</h2>
            <div className="h-1 w-20 bg-red-600 mb-3 mx-auto"></div>
            <p className="text-gray-500">
              Have questions or ready to start your project? Reach out to us using any of the following methods.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="min-h-[250px]">
              <ContactCard
                icon={<FaLocationDot size={24} className="text-red-500" />}
                title="Visit Us"
                content={["Bhardwaj Architects", "Najafgarh, New Delhi, 110043", "India"]}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="min-h-[250px]">
              <ContactCard
                icon={<FaPhone size={24} className="text-red-500" />}
                title="Call Us"
                content={[
                  <a href="tel:+918700683138" className="hover:text-black-900 hover:font-semibold hover:underline" key="1">+91-8700683138 <br />

                  </a>,
                ]}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="min-h-[250px]">
              <ContactCard
                icon={<FaEnvelope size={24} className="text-red-500" />}
                title="Email Us"
                content={[
                  <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=info@bhardwajarchitects.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:font-semibold hover:text-black-900 hover:underline"
                  >
                    info@bhardwajarchitects.in
                  </a>
                ]}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="min-h-[250px]">
              <ContactCard
                icon={<FaClock size={24} className="text-red-500 " />}
                title="Working Hours"
                content={[
                  "Mon - Fri: 9:00 AM - 6:00 PM",
                  "Saturday: 10:00 AM - 4:00 PM",
                  "Sunday: Closed",
                ]}
              /></motion.div>
          </div>
        </div>
      </section>

      <motion.section
        className="py-16  from-white via-red-50 to-white text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: false, duration: 0.2 }}
      >
        <div className="container max-w-3xl mx-auto px-4">
          <h3 className="text-xl font-semibold text-black mb-3">Connect With Us</h3>
          <div className='h-1 w-20 mx-auto bg-red-500'></div>
          <div className="flex justify-center space-x-5 mt-4">
            {[
              { icon: <FaFacebookF size={20} />, link: "https://facebook.com" },
              { icon: <FaTwitter size={20} />, link: "https://twitter.com" },
              { icon: <FaInstagram size={20} />, link: "https://www.instagram.com/bhardwaj_architects" },
              { icon: <FaWhatsapp size={20} />, link: "https://wa.me/918700683138" },
            ].map((social, index) => (
              <motion.a
                key={index}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-12 h-12 rounded-full bg-red-50/50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center shadow-sm border border-transparent transition-colors duration-300"
              >
                {social.icon}
              </motion.a>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Form Section */}
      <section className="py-16 bg-white ">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false, duration: 0.2 }}
          >
            <div className="max-w-3xl mb-12 text-left">
              <span className="inline-block text-red-500 font-medium mb-1">GET IN TOUCH</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-3">Send Us a Message</h2>
              <div className="h-1 w-20 bg-red-500 mb-4 "></div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              <Input label="Name : " type="text" name="name" required placeholder="Enter your name" />
              <Input label="Email :" type="email" name="email" required placeholder="Enter your mail" />
              <Input label="Phone :" type="tel" name="phone" placeholder="Enter your number" />
              <Input label="Subject :" type="text" name="subject" required placeholder="Enter your required" />
              <Textarea label="Message :" name="message" required placeholder="Enter your feedback" />
              <div>
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`px-6 py-3 ${loading ? 'bg-red-300 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'} font-semibold text-white rounded-md flex items-center justify-center transition-colors`}
                >
                  {loading ? "Sending..." : "Send Message"} <FiSend className="ml-2" />
                </motion.button>
              </div>

            </form>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false, duration: 0.2 }}>
            <div className="max-w-3xl mb-12 text-left">
              <span className="inline-block text-red-500 font-medium mb-1">FIND US</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Location</h2>
              <div className="h-1 w-20 bg-red-500 mb-4 "></div>
            </div>
            <div className="w-full h-[400px] mt-4 rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7005.208895452224!2d76.975623!3d28.611641!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d0f63e47a820f%3A0x9bccd099845f0da1!2sBHARDWAJ%20ARCHITECTS!5e0!3m2!1sen!2sin!4v1751959263102!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Bhardwaj Architects Map"
              ></iframe>
            </div>

            <motion.div initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: false, duration: 0.2 }} className="mt-6 bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold mb-3">Bhardwaj Architect</h3>
              <p className="text-gray-600 mb-4">
                Najafgarh<br />
                New Delhi, 110043<br />
                India
              </p>
              <div className="flex space-x-4 items-center">
                {/* Get Directions */}
                <div className="space-y-6">
                  {/* External Directions Link */}
                  <a
                    href="https://www.google.com/maps/place/BHARDWAJ+ARCHITECTS/@28.611816,76.974227,15z"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-red-500 hover:text-red-600 font-medium transition-colors py-3 px-6 bg-red-50/50 hover:bg-red-100/50 rounded-lg"
                  >
                    <FaMapMarkerAlt className="mr-2" />
                    Get Directions
                  </a>
                </div>
                {/* Call Us */}
                <motion.a
                  whileTap={{ scale: 0.95, rotate: 1.10 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  href="tel:+918700683138"
                  className="inline-flex items-center justify-center font-medium transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-md cursor-pointer bg-red-500 hover:bg-red-500 text-white shadow-md hover:shadow-lg px-6 py-3"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaPhoneAlt className="mr-2" />
                  Call Us Now
                </motion.a>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </section >

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mb-12 text-center mx-auto">
            <span className="inline-block text-red-500  mb-1">FAQS</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Frequently Asked Questions</h2>
            <div className="h-1 w-28 bg-red-500 mb-3 mx-auto"></div>
            <p className="text-gray-500">Find answers to commonly asked questions about our services.</p>
          </div>

          <div className="mt-12 max-w-4xl mx-auto space-y-10">
            <FAQItem
              question="What services do you provide?"
              answer="We offer a comprehensive range of architectural services including architectural design, interior design, urban planning, landscape design, project management, 3D visualization, and sustainable design solutions."
            />
            <FAQItem
              question="How do I start a project with your firm?"
              answer="Starting a project is easy! Contact us through our form, phone, or email to schedule an initial consultation. We'll discuss your vision, requirements, and budget to develop a tailored approach for your project."
            />
            <FAQItem
              question="Do you work on projects outside of New Delhi?"
              answer="Yes, we work on projects throughout India and have experience with international projects as well. Our team is equipped to handle remote consultations and site visits as required."
            />
            <FAQItem
              question="What is your design process?"
              answer="Our design process includes six key phases: Discovery, Concept Design, Design Development, Documentation, Implementation, and Completion. We ensure client collaboration at every stage to bring your vision to life."
            />
          </div>
        </div>
      </section>

      <section className="py-16 bg-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Vision?</h2>
          <p className="text-text-light mb-8 max-w-2xl mx-auto">
            Contact us today to schedule a consultation and take the first step towards creating exceptional architectural spaces.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {/* Call Us Now */}
            <div tabIndex={0}>
              <a
                href="tel:+918700683138"
                className="inline-flex items-center justify-center font-medium transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-md cursor-pointer bg-red-500 hover:bg-red-500 text-white shadow-md hover:shadow-lg px-6 py-3"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaPhoneAlt className="mr-2" />
                Call Us Now
              </a>
            </div>

            {/* WhatsApp */}
            <div tabIndex={0}>
              <a
                href="https://wa.me/918700683138"
                className="inline-flex items-center justify-center font-medium transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-md cursor-pointer bg-transparent border-2 border-red-500 hover:bg-red-500/10 text-red-500 px-6 py-3"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaWhatsapp className="mr-2" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

    </div >
  );
}

