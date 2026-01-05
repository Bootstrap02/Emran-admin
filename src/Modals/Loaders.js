// components/Modals.jsx
import React from "react";
import { ClipLoader, HashLoader } from "react-spinners";
import exxonLogo from "../assets/exxonmobil-logo-white.jpg"; // Add this logo (white on red)

// ===================================================================
// 1. FULL PAGE LOADER (Used on initial app load)
// ===================================================================
export const PageLoader = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#001F5B] to-[#0A3D6B] flex flex-col items-center justify-center z-50">
      {/* Subtle Nigerian flag-inspired stripes at top */}
      <div className="absolute top-0 left-0 w-full h-2 flex">
        <div className="w-1/3 bg-green-600"></div>
        <div className="w-1/3 bg-white"></div>
        <div className="w-1/3 bg-green-600"></div>
      </div>

      <div className="text-center space-y-8 animate-fadeIn">
        <img 
          src={exxonLogo} 
          alt="ExxonMobil Nigeria Retirees" 
          className="w-64 mx-auto drop-shadow-2xl"
        />
        
        <div className="flex justify-center">
          <HashLoader 
            color="#E30613" 
            size={80} 
            speedMultiplier={0.8}
          />
        </div>

        <div className="text-white space-y-2">
          <p className="text-xl font-medium">Welcome back, Retiree</p>
          <p className="text-sm opacity-80">Loading your benefits portal...</p>
        </div>
      </div>

      <footer className="absolute bottom-6 text-white text-xs opacity-70">
        © {new Date().getFullYear()} ExxonMobil Retirees Association of Nigeria
      </footer>
    </div>
  );
};

// ===================================================================
// 2. LARGE CENTERED MODAL LOADER (For login, form submit, etc.)
// ===================================================================
export const BigLoader = ({ message = "Processing your request..." }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full mx-4 text-center border border-gray-100">
        <div className="mb-6">
          <ClipLoader color="#E30613" size={70} />
        </div>
        
        <h3 className="text-2xl font-semibold text-[#001F5B] mb-2">
          {message}
        </h3>
        <p className="text-gray-600">Please wait while we securely process your information</p>
        
        <div className="mt-6 flex justify-center space-x-2">
          <div className="w-3 h-3 bg-[#E30613] rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-[#E30613] rounded-full animate-bounce delay-100"></div>
          <div className="w-3 h-3 bg-[#E30613] rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    </div>
  );
};

// ===================================================================
// 3. MEDIUM INLINE LOADER (For login forms, etc.)
// ===================================================================
export const MediumLoader = ({ text = "Authenticating..." }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 text-center">
      <ClipLoader color="#E30613" size={50} />
      <p className="mt-6 text-lg font-medium text-[#001F5B]">{text}</p>
      <p className="text-sm text-gray-500 mt-1">This won't take long</p>
    </div>
  );
};

// ===================================================================
// 4. BUTTON LOADER (Inline inside buttons)
// ===================================================================
export const ButtonLoader = ({ size = 20 }) => {
  return (
    <ClipLoader 
      color="white" 
      size={size} 
      className="inline-block"
    />
  );
};

// ===================================================================
// 5. SUCCESS FEEDBACK (Replaces "Copied!" button)
// ===================================================================
export const SuccessToast = ({ message = "Success!" }) => {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-green-600 text-white px-8 py-4 rounded-full shadow-2xl z-50 animate-slideUp">
      <span className="font-medium">{message}</span>
    </div>
  );
};

// ===================================================================
// 6. ERROR / INFO MODAL (Optional - reusable)
// ===================================================================
export const InfoModal = ({ title, message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
        <div className="w-16 h-16 bg-[#E30613] rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl text-white font-bold">i</span>
        </div>
        <h3 className="text-2xl font-bold text-[#001F5B] mb-3">{title}</h3>
        <p className="text-gray-700 mb-8">{message}</p>
        <button 
          onClick={onClose}
          className="bg-[#E30613] hover:bg-[#c20511] text-white font-semibold py-3 px-10 rounded-full transition"
        >
          Okay
        </button>
      </div>
    </div>
  );
};
