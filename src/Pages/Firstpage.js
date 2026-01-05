// pages/Homepage.jsx — BEAUTIFIED VERSION
import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import heroImage from '../assets/exxonmobil-logo-white.jpg';
import cacCertificate from '../assets/cac-certificate.jpg';

const Homepage = () => {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('userData'));

  // Fade-in animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeIn');
          }
        });
      },
      { threshold: 0.1 }
    );

    document
      .querySelectorAll('.animate-on-scroll')
      .forEach(el => observer.observe(el));
  }, []);

  return (
    <>
      {/* Hero Section */}
      <div className="relative min-h-screen bg-gradient-to-br from-[#001F5B] via-[#001845] to-[#0A3D6B] overflow-hidden">
        <Header />

        {/* Animated Background Orbs */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#E30613]/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#E30613]/30 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16 flex flex-col lg:flex-row items-center justify-between gap-16">
          {/* Text */}
          <div className="text-white text-center lg:text-left max-w-2xl animate-on-scroll">
            <h1 className="text-[20px] sm:text-[15px] lg:text-[15px] font-extrabold leading-tight mb-8 drop-shadow-2xl">
              Welcome Home,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E30613] to-[#ff4444]">
                EMRAN Family
              </span>
            </h1>

            <p className="text-xl lg:text-2xl text-gray-200 mb-8 leading-relaxed opacity-90">
              ExxonMobil Retirees Association of Nigeria – Advancing welfare, unity,
              and comradeship for all retirees.
            </p>

            <p className="text-lg text-gray-300 mb-12">
              Incorporated under CAMA 2020 • Reg. No. 153528 • Serving you since 2020
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-8 justify-center lg:justify-start">
              {userData ? (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="group relative overflow-hidden bg-gradient-to-r from-[#E30613] to-[#c20511] text-white font-bold text-xl px-12 py-6 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-110 hover:shadow-[#E30613]/50"
                >
                  <span className="relative z-10">Go to My Dashboard</span>
                  <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
                </button>
              ) : (
                <>
                  <NavLink
                    to="/signin"
                    className="group relative overflow-hidden bg-gradient-to-r from-[#E30613] to-[#c20511] text-white font-bold text-xl px-12 py-6 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-110 hover:shadow-[#E30613]/50 text-center"
                  >
                    <span className="relative z-10">Sign In</span>
                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
                  </NavLink>

                  <NavLink
                    to="/signup"
                    className="group relative bg-white text-[#001F5B] font-bold text-xl px-12 py-6 rounded-2xl shadow-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-110 hover:bg-gray-50 text-center border-4 border-[#E30613]/20"
                  >
                    Create Account
                  </NavLink>
                </>
              )}
            </div>
          </div>

          {/* Hero Image */}
          <div className="w-full lg:w-1/2 max-w-2xl mx-auto lg:mx-0 animate-on-scroll">
            <div className="relative group">
              <img
                src={heroImage}
                alt="EMRAN Family Gathering"
                className="w-full h-auto rounded-3xl shadow-2xl border-8 border-white/40 object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-auto" viewBox="0 0 1440 220">
            <path
              fill="#F8F9FA"
              d="M0 120L48 130C96 140 192 160 288 155C384 150 480 120 576 115C672 110 768 130 864 140C960 150 1056 150 1152 145C1248 140 1344 130 1392 125L1440 120V220H0V120Z"
            />
          </svg>
        </div>
      </div>

      {/* ================= NEWS & EVENTS SECTION ================= */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#001F5B] mb-4">
              News & Recent Events
            </h2>
            <p className="text-xl text-gray-600">
              Highlights from recent EMRAN activities and engagements
            </p>
          </div>

          <div className="relative group animate-on-scroll">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#E30613] to-[#ff4444] rounded-3xl blur opacity-25 group-hover:opacity-40 transition"></div>

            <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
              <img
                src={heroImage}
                alt="Recent EMRAN Event"
                className="w-full h-full object-cover"
              />

              <div className="p-10 lg:p-14">
                <span className="inline-block mb-6 px-4 py-1 rounded-full bg-[#E30613]/10 text-[#E30613] font-bold text-sm">
                  MOST RECENT EVENT
                </span>

                <h3 className="text-3xl lg:text-4xl font-extrabold text-[#001F5B] mb-6">
                  EMRAN General Meeting & Welfare Briefing
                </h3>

                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Members gathered for discussions on association updates,
                  welfare structure reviews, and upcoming engagement plans.
                </p>

                <button
                  onClick={() => navigate('/news')}
                  className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#E30613] to-[#c20511] text-white font-bold text-lg shadow-xl hover:scale-105 transition"
                >
                  View All News & Events
                  <span className="group-hover:translate-x-1 transition">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Core Pillars */}
<section className="py-24 bg-gray-50">
  <div className="max-w-7xl mx-auto px-6 text-center animate-on-scroll">
    <h2 className="text-5xl font-bold text-[#001F5B] mb-6">
      Our Core Pillars
    </h2>
    <p className="text-2xl text-gray-600 mb-20">
      From EMRAN Constitution – Built for You
    </p>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
      {[
        {
          icon: "🏛️",
          title: "Who We Are",
          desc: "EMRAN is a registered association of ExxonMobil retirees, founded to preserve unity, dignity, and lifelong fellowship.",
          path: "/about",
        },
        {
          icon: "📜",
          title: "Our Purpose",
          desc: "To protect collective interests, promote mutual support, and maintain strong institutional continuity among members.",
          path: "/resources",
        },
        {
          icon: "🤝",
          title: "Our Community",
          desc: "A trusted network built on shared history, transparency, accountability, and mutual respect.",
          path: "/benefits",
        },
      ].map((item, i) => (
        <div
          key={i}
          onClick={() => navigate(item.path)}
          className="group cursor-pointer bg-white p-12 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 focus:outline-none focus:ring-4 focus:ring-[#E30613]/30"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-[#E30613] to-[#c20511] rounded-full flex items-center justify-center mx-auto mb-8 text-5xl text-white shadow-lg group-hover:scale-110 transition">
            {item.icon}
          </div>

          <h3 className="text-3xl font-bold text-[#001F5B] mb-6">
            {item.title}
          </h3>

          <p className="text-gray-600 text-lg mb-8">
            {item.desc}
          </p>

          <span className="inline-flex items-center gap-2 text-[#E30613] font-bold text-lg group-hover:underline">
            Learn More
            <span className="group-hover:translate-x-1 transition">→</span>
          </span>
        </div>
      ))}
    </div>
  </div>
</section>


      {/* Trust Section */}
      <section className="py-24 bg-[#001F5B] text-white">
        <div className="max-w-7xl mx-auto px-6 text-center animate-on-scroll">
          <h2 className="text-5xl font-bold mb-10">Officially Registered & Trusted</h2>
          <p className="text-2xl mb-12 opacity-90">
            Incorporated under CAMA 2020 • Reg. No. 153528
          </p>

          <div className="relative max-w-4xl mx-auto group">
            <img
              src={cacCertificate}
              alt="Official CAC Certificate"
              className="w-full rounded-3xl shadow-2xl border-8 border-[#E30613]/50 object-contain transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          <p className="mt-12 text-2xl opacity-90">
            Proudly serving ExxonMobil retirees since 2020
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Homepage;
