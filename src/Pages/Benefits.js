// pages/Benefits.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { BigLoader } from '../Modals/Loaders';

const Benefits = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      navigate('/signin');
    }
  }, [navigate]);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-[#001F5B] text-center mb-4">
            Your Retiree Benefits
          </h1>
          <p className="text-xl text-gray-700 text-center mb-12 max-w-3xl mx-auto">
            Comprehensive post-retirement support designed to honor your service to ExxonMobil Nigeria
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                title: "Pension Payments",
                desc: "Monthly pension disbursed on the 25th of every month directly to your registered bank account.",
                amount: "₦485,000/month",
                status: "Active",
                icon: "💰",
              },
              {
                title: "Medical Coverage",
                desc: "Gold Retiree Medical Plan covering you and your immediate family at top-tier hospitals nationwide.",
                coverage: "Family Cover • Inpatient & Outpatient",
                status: "Active",
                icon: "🏥",
              },
              {
                title: "Death Benefit",
                desc: "Lump sum payment to nominated beneficiaries in the event of your passing.",
                amount: "₦500,000",
                status: "Eligible",
                icon: "🛡️",
              },
              {
                title: "Annual Wellness Allowance",
                desc: "Reimbursement for medical check-ups, glasses, dental care, and fitness programs.",
                amount: "Up to ₦150,000/year",
                status: "Available",
                icon: "❤️",
              },
              {
                title: "Housing Support",
                desc: "One-time settlement allowance paid at retirement (already received).",
                amount: "Received in 2018",
                status: "Completed",
                icon: "🏠",
              },
              {
                title: "EMRAN Membership",
                desc: "Lifetime membership in ExxonMobil Retirees Association of Nigeria with dues fully sponsored.",
                status: "Paid until Dec 2026",
                icon: "🎖️",
              },
            ].map((benefit, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                <div className="text-6xl mb-6">{benefit.icon}</div>
                <h3 className="text-2xl font-bold text-[#001F5B] mb-3">{benefit.title}</h3>
                <p className="text-gray-700 mb-6">{benefit.desc}</p>
                {benefit.amount && (
                  <p className="text-3xl font-bold text-[#E30613] mb-2">{benefit.amount}</p>
                )}
                {benefit.coverage && (
                  <p className="text-lg font-medium text-gray-800 mb-2">{benefit.coverage}</p>
                )}
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                  benefit.status.includes('Active') || benefit.status.includes('Eligible')
                    ? 'bg-green-100 text-green-800'
                    : benefit.status.includes('Completed')
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {benefit.status}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-[#001F5B] to-[#0A3D6B] text-white rounded-3xl p-10 text-center">
            <h2 className="text-3xl font-bold mb-4">Need to Update Beneficiaries?</h2>
            <p className="text-xl mb-8">Ensure your family is protected. Update your nomination form today.</p>
            <button className="bg-[#E30613] hover:bg-[#c20511] px-8 py-4 rounded-xl font-bold text-lg transition">
              Download Nomination Form
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Benefits;