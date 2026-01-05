// pages/AboutUs.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import cacCertificate from '../assets/cac-certificate.jpg';
import trusteesPhoto from '../assets/exxonmobil-logo-white.jpg'; // Add group photo if available

const About = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">

          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-[#001F5B] mb-6">About EMRAN</h1>
            <p className="text-2xl text-gray-700 max-w-4xl mx-auto">
              ExxonMobil Retirees Association of Nigeria – A united family of retirees committed to welfare, advocacy, and community impact.
            </p>
          </div>

          {/* Preamble from Constitution */}
          <div className="bg-white rounded-3xl shadow-2xl p-12 mb-12">
            <h2 className="text-3xl font-bold text-[#001F5B] mb-8 text-center">Our Preamble</h2>
            <p className="text-lg text-gray-700 leading-relaxed text-center max-w-5xl mx-auto italic">
              "We, the members of ExxonMobil Retirees Association of Nigeria, after a thorough analysis of our shared aspirations, desires, ideas, interests, and needs, and having realized the exigency of a strong unity of purpose and a platform for peaceful co-existence, social interaction and promotion of the welfare of members... do hereby make, enact and give to ourselves this Constitution."
            </p>
          </div>

          {/* Mission & Aims */}
          <div className="grid md:grid-cols-3 gap-10 mb-16">
            <div className="bg-gradient-to-br from-[#001F5B] to-[#0A3D6B] text-white p-10 rounded-3xl shadow-xl">
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p>To promote welfare, peaceful coexistence, and maximum benefits for all ExxonMobil retirees in Nigeria.</p>
            </div>
            <div className="bg-white p-10 rounded-3xl shadow-xl border-2 border-[#E30613]">
              <h3 className="text-2xl font-bold text-[#001F5B] mb-4">Core Values</h3>
              <ul className="space-y-3 text-gray-700">
                <li>• Unity & Comradeship</li>
                <li>• Welfare Advocacy</li>
                <li>• Community Impact</li>
                <li>• Transparency</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-[#E30613] to-[#c20511] text-white p-10 rounded-3xl shadow-xl">
              <h3 className="text-2xl font-bold mb-4">Registration</h3>
              <p>Incorporated under CAMA 2020<br />Reg. No. 153528<br />Certified: 6th February 2025</p>
            </div>
          </div>

          {/* CAC Certificate */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#001F5B] mb-8">Official Registration</h2>
            <img 
              src={cacCertificate} 
              alt="CAC Certificate - EMRAN Reg. No. 153528"
              className="max-w-3xl mx-auto rounded-2xl shadow-2xl border-8 border-[#E30613]/20"
            />
          </div>

          {/* Leadership / Trustees */}
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
            <h2 className="text-4xl font-bold text-[#001F5B] mb-8">Our Leadership</h2>
            <p className="text-xl text-gray-700 mb-8 max-w-4xl mx-auto">
              Guided by dedicated trustees and executive committee, including former representatives and industry leaders.
            </p>
            {/* Add trusteesPhoto here when available */}
            <p className="text-lg text-gray-600">Contact: trustees@emran.org.ng</p>
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

export default About;