import React, { useState, useEffect, useContext } from 'react';
import { FiSend } from "react-icons/fi";
import { MainContext } from '../../Context';

export default function Enquiry({ onClose }) {
  const { API_BASE_URL, notify } = useContext(MainContext);
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/services`);
        const data = await res.json();
        if (res.ok) {
          setServices(data.services || data.data || []);
        } else {
          notify("Failed to load services", "error");
        }
      } catch (err) {
        console.error("Error fetching services:", err);
        notify("Service fetch error", "error");
      }
    };

    fetchServices();
  }, [API_BASE_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch(`${API_BASE_URL}/contact/enquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (res.ok && result.success) {
        notify("Enquiry sent successfully!", "success");
        e.target.reset();
        if (onClose) onClose();
      } else {
        notify(result.message || "Something went wrong", "error");
      }
    } catch (err) {
      notify("Failed to send enquiry. Please try again later.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input type="text" name="name" required className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-red-500" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input type="email" name="email" required className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-red-500" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Phone</label>
        <input type="tel" name="phone" required className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-red-500" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Service Required</label>
        <select
          name="subject"
          required
          className="w-full border rounded px-4 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-red-500"
        >
          <option value="">Select a service</option>
          {services.length === 0 ? <option disabled>Loading...</option> : services.map(service => (
            <option key={service._id} value={service.title}>{service.title}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Project Location (Optional)</label>
        <input type="text" name="location" className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-red-500" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Message</label>
        <textarea name="message" required rows="4" className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-red-500" placeholder="Brief about your project..." />
      </div>
      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded flex justify-center items-center transition duration-300 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        {loading ? 'Sending...' : 'Send Enquiry'} <FiSend className="ml-2" />
      </button>
    </form>
  );
}
