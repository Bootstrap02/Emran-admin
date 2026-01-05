// pages/Spotlight.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import spotlight1 from '../assets/exxonmobil-logo-white.jpg'; // Add real photos
import spotlight2 from '../assets/exxonmobil-logo-white.jpg';
import spotlight3 from '../assets/exxonmobil-logo-white.jpg';

const Spotlight = () => {
  const spotlights = [
    {
      name: "Dr. Chukwudi Okonkwo",
      achievement: "Earned PhD in Petroleum Engineering",
      story: "After retiring in 2020, Dr. Okonkwo pursued advanced studies and now lectures part-time at University of Port Harcourt while mentoring young engineers.",
      quote: "Retirement is the perfect time to give back knowledge.",
      photo: spotlight1,
    },
    {
      name: "Mrs. Grace Adeyemi",
      achievement: "Founded Tech Startup",
      story: "Established 'GreenEnergy Solutions Ltd' – a renewable energy company focused on solar installations for rural communities in Delta State.",
      quote: "My ExxonMobil experience taught me innovation never retires.",
      photo: spotlight2,
    },
    {
      name: "Engr. Musa Ibrahim",
      achievement: "Community Leadership",
      story: "Elected Chairman of Community Development Association in Abuja. Led construction of borehole and skill acquisition center for youth.",
      quote: "Service to community is the highest calling after service to country.",
      photo: spotlight3,
    },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">

          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-[#001F5B] mb-6">
              Retiree Spotlight
            </h1>
            <p className="text-2xl text-gray-700 max-w-4xl mx-auto">
              Celebrating EMRAN members who continue to excel and impact society after retirement
            </p>
          </div>

          {/* Grid of Spotlights */}
          <div className="grid md:grid-cols-3 gap-12 mb-16">
            {spotlights.map((person, i) => (
              <div key={i} className="group bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-4">
                <div className="relative overflow-hidden">
                  <img 
                    src={person.photo} 
                    alt={person.name}
                    className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                </div>
                <div className="p-10">
                  <h3 className="text-3xl font-bold text-[#001F5B] mb-2">{person.name}</h3>
                  <p className="text-xl text-[#E30613] font-bold mb-4">{person.achievement}</p>
                  <p className="text-gray-700 mb-6 leading-relaxed">{person.story}</p>
                  <blockquote className="text-lg italic text-gray-600 border-l-4 border-[#E30613] pl-6">
                    "{person.quote}"
                  </blockquote>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-[#001F5B] to-[#0A3D6B] text-white rounded-3xl p-16 text-center">
            <h2 className="text-4xl font-bold mb-6">Share Your Story</h2>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              Have you earned a new degree? Started a business? Led community projects?<br />
              Let us celebrate your achievement with the EMRAN family.
            </p>
            <NavLink 
              to="/contact"
              className="inline-block bg-[#E30613] hover:bg-[#c20511] text-white font-bold text-xl px-12 py-6 rounded-full shadow-2xl transition transform hover:scale-105"
            >
              Submit Your Spotlight
            </NavLink>
          </div>

          {/* Back Button */}
          <div className="text-center mt-12">
            <NavLink 
              to="/"
              className="inline-flex items-center gap-3 text-[#E30613] font-bold text-xl hover:underline"
            >
              ← Back to Home
            </NavLink>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Spotlight;