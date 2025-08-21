'use client';

import React, { useEffect, useState, useRef } from 'react';
import './Services.css';
import Link from 'next/link'; // Replaced 'react-router-dom' Link with 'next/link'
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';

import {
  FaReact, FaNodeJs, FaAws, FaFigma, FaDocker, FaShieldAlt, FaCogs, FaCode, FaLink, FaUsers, FaCloud, FaMobileAlt, FaAndroid
} from 'react-icons/fa';

// Use the correct API_BASE_URL from your .env.local file.
// In Next.js, client-side env variables must be prefixed with NEXT_PUBLIC_
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

// Type definitions for the component's data
interface Service {
  _id: string;
  title: string;
  description: string;
  // You can add more fields if your API provides them, e.g., 'icon'
}

interface ServicesState {
  services: Service[];
  loading: boolean;
  error: string | null;
}

// Data for the new Hexagon Skills Grid
const skillsData = [
  { icon: <FaCogs />, title: "ERP & SAP", description: "Expertise in SAP S/4HANA, ABAP, FICO, MM, SD, PP Modules." },
  { icon: <FaReact />, title: "Full-Stack Web", description: "React, Node.js, Express, MongoDB, Firebase, REST APIs." },
  { icon: <FaAws />, title: "Cloud Tech", description: "AWS, Azure, and Google Cloud Platform solutions." },
  { icon: <FaAndroid />, title: "Mobile Apps", description: "Android & iOS development using Flutter and React Native." },
  { icon: <FaDocker />, title: "DevOps & CI/CD", description: "Docker, Jenkins, GitHub Actions, and Kubernetes." },
  { icon: <FaFigma />, title: "UI/UX Design", description: "Figma, Adobe XD for responsive, user-friendly interfaces." },
  { icon: <FaShieldAlt />, title: "Cybersecurity", description: "Data protection, secure development, and ISO practices." },
];

const stats = [
  { icon: "✨", value: 13, label: "Projects Completed", symbol: '+' },
  { icon: "👍", value: 18, label: "Positive Feedback", symbol: '+' },
  { icon: "⏳", value: 80, label: "Certified Resources", symbol: '%' },
];

// Custom Hook for the 3D Tilt effect (now in TypeScript)
const use3DTilt = (): React.RefObject<HTMLDivElement> => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = element.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;

      const rotateX = (y / height - 0.5) * -25;
      const rotateY = (x / width - 0.5) * 25;

      element.style.setProperty('--rotateX', `${rotateX}deg`);
      element.style.setProperty('--rotateY', `${rotateY}deg`);
    };

    const handleMouseLeave = () => {
      element.style.setProperty('--rotateX', '0deg');
      element.style.setProperty('--rotateY', '0deg');
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return ref;
};

// Function to get a default icon
const getIconForService = (title: string | undefined) => {
  const lowerCaseTitle = (title || '').toLowerCase();
  if (lowerCaseTitle.includes('sap')) return <FaCogs />;
  if (lowerCaseTitle.includes('software') || lowerCaseTitle.includes('development')) return <FaCode />;
  if (lowerCaseTitle.includes('integration')) return <FaLink />;
  if (lowerCaseTitle.includes('consulting')) return <FaUsers />;
  if (lowerCaseTitle.includes('cloud')) return <FaCloud />;
  if (lowerCaseTitle.includes('mobile') || lowerCaseTitle.includes('app')) return <FaMobileAlt />;
  return "⚙️";
};

// Props for the ServiceCard component
interface ServiceCardProps {
  service: Service;
  index: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, index }) => {
  const tiltRef = use3DTilt();

  return (
    <div
      className="service-card-3d"
      ref={tiltRef}
      data-aos="zoom-in-up"
      data-aos-delay={index * 100}
    >
      <div className="service-card-content">
        <div className="service-icon">{getIconForService(service.title)}</div>
        <h3>{service.title}</h3>
        <p>{service.description}</p>
      </div>
    </div>
  );
};


const Services: React.FC = () => {
  const [state, setState] = useState<ServicesState>({
    services: [],
    loading: true,
    error: null,
  });

  const consultationLink = "https://calendly.com/alphaseam-operations/30min";

  useEffect(() => {
    AOS.init({ once: true, duration: 1000, easing: 'ease-in-out' });
    
    axios.get(`${API_BASE_URL}/api/services`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setState(prevState => ({
            ...prevState,
            services: res.data,
            loading: false,
            error: null,
          }));
        } else {
          console.error('API response is not an array:', res.data);
          setState(prevState => ({
            ...prevState,
            services: [],
            loading: false,
            error: 'Invalid data format.',
          }));
        }
      })
      .catch((err) => {
        console.error('Error fetching services:', err);
        setState(prevState => ({
          ...prevState,
          services: [],
          loading: false,
          error: 'Failed to load services. Please try again later.',
        }));
      });
  }, []);

  const { services, loading, error } = state;

  return (
    <div className="services-page">
      <div className="services-hero-section" data-aos="fade-in">
        <h1>Our Services</h1>
        <p>
          Empowered by exceptional talent, Alphaseam elevates your digital landscape by converging innovation and technology to craft bespoke software solutions that drive business success.
        </p>
      </div>

      <section className="services-grid-section">
        <div className="services-grid">
          {loading ? (
            <p className="loading-text">Loading Services...</p>
          ) : error ? (
            <p className="error-text">{error}</p>
          ) : Array.isArray(services) && services.length > 0 ? (
            services.map((service, index) => (
              <ServiceCard key={service._id} service={service} index={index} />
            ))
          ) : (
            <p className="loading-text">No services available at the moment.</p>
          )}
        </div>
      </section>

      <section className="skills-section-v