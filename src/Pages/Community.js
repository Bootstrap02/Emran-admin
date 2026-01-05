// pages/Community.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import schoolDonation from '../assets/exxonmobil-logo-white.jpg'; // Add photos
import medicalOutreach from '../assets/exxonmobil-logo-white.jpg';
import teachingClass from '../assets/exxonmobil-logo-white.jpg';

const Community = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">

          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-[#001F5B] mb-6">
              Giving Back to Our Community
            </h1>
            <p className="text-2xl text-gray-700 max-w-4xl mx-auto">
              EMRAN retirees continue to make positive impact across Nigeria through education, health, and community support.
            </p>
          </div>

          {/* Intro */}
          <div className="bg-white rounded-3xl shadow-2xl p-12 mb-16 text-center">
            <p className="text-xl text-gray-700 leading-relaxed max-w-5xl mx-auto">
              As proud former ExxonMobil employees, we believe in using our experience, resources, and time to uplift communities. 
              From donating to schools to providing free mentoring and medical outreach, EMRAN members are committed to giving back.
            </p>
          </div>

          {/* Gallery Grid */}
          <div className="grid md:grid-cols-3 gap-10 mb-16">
            {/* School Donation */}
            <div className="group bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500">
              <img 
                src={schoolDonation} 
                alt="EMRAN donates books and supplies to local school"
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="p-8">
                <h3 className="text-2xl font-bold text-[#001F5B] mb-4">Education Support</h3>
                <p className="text-gray-700 mb-6">
                  EMRAN members donated learning materials, uniforms, and scholarships to underprivileged students in Lagos and Rivers State.
                </p>
                <span className="text-[#E30613] font-bold">2025 Initiative →</span>
              </div>
            </div>

            {/* Medical Outreach */}
            <div className="group bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500">
              <img 
                src={medicalOutreach} 
                alt="Free medical checkup by EMRAN retirees"
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="p-8">
                <h3 className="text-2xl font-bold text-[#001F5B] mb-4">Health Outreach</h3>
                <p className="text-gray-700 mb-6">
                  Partnered with local clinics to provide free blood pressure checks, diabetes screening, and health education in rural communities.
                </p>
                <span className="text-[#E30613] font-bold">Annual Program →</span>
              </div>
            </div>

            {/* Retirees Teaching */}
            <div className="group bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500">
              <img 
                src={teachingClass} 
                alt="Retiree mentoring students"
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="p-8">
                <h3 className="text-2xl font-bold text-[#001F5B] mb-4">Knowledge Transfer</h3>
                <p className="text-gray-700 mb-6">
                  Experienced EMRAN members volunteer to teach STEM subjects and career guidance in secondary schools.
                </p>
                <span className="text-[#E30613] font-bold">Ongoing Mentorship →</span>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-[#001F5B] to-[#0A3D6B] text-white rounded-3xl p-12 text-center">
            <h2 className="text-4xl font-bold mb-6">Join Our Impact</h2>
            <p className="text-xl mb-8 opacity-90">
              Have a community project or story to share? Let us celebrate it together.
            </p>
            <NavLink 
              to="/contact"
              className="inline-block bg-[#E30613] hover:bg-[#c20511] text-white font-bold text-xl px-12 py-5 rounded-full shadow-2xl transition transform hover:scale-105"
            >
              Submit Your Story
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

export default Community;