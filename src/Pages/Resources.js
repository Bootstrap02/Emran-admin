// pages/Resources.jsx
import React, { useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import Header from '../Components/Header';
import Footer from '../Components/Footer';

const Resources = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) navigate('/signin');
  }, [navigate]);

  const resources = [
    { title: "Retiree Handbook 2024", desc: "Complete guide to your benefits and portal usage", type: "PDF", size: "4.2 MB" },
    { title: "Approved Hospital List", desc: "Nationwide list of HMO-empaneled hospitals", type: "PDF", size: "1.8 MB" },
    { title: "Pension Taxation Guide", desc: "Understanding tax implications on pension income", type: "PDF", size: "980 KB" },
    { title: "EMRAN Constitution", desc: "Governing document of the retirees association", type: "PDF", size: "2.1 MB" },
    { title: "Medical Claim Form", desc: "Form for reimbursement of out-of-pocket expenses", type: "PDF", size: "450 KB" },
    { title: "Beneficiary Nomination Form", desc: "Update your death benefit nominees", type: "PDF", size: "320 KB" },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-[#001F5B] text-center mb-4">
            Resource Center
          </h1>
          <p className="text-xl text-gray-700 text-center mb-12 max-w-3xl mx-auto">
            Download important documents, forms, and guides for retirees
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resources.map((resource, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="text-5xl text-[#E30613]">📄</div>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {resource.type}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#001F5B] mb-3 group-hover:text-[#E30613] transition">
                  {resource.title}
                </h3>
                <p className="text-gray-700 mb-4">{resource.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{resource.size}</span>
                  <button className="text-[#E30613] font-bold hover:underline">
                    Download →
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-lg text-gray-600 mb-6">
              Can't find what you're looking for?
            </p>
            <NavLink
              to="/support"
              className="inline-block bg-[#001F5B] hover:bg-[#001F3F] text-white font-bold py-4 px-10 rounded-xl transition"
            >
              Contact Support
            </NavLink>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Resources;