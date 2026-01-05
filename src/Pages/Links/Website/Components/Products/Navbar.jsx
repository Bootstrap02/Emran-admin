import React from "react";
import { Link } from "react-router-dom"; // Import react-scroll
import Group3 from "../../assets/Group223.png";

const Navbar = () => {
  const handleWhatsAppChat = () => {
      const phoneNumber = "+2348066465593";
      const whatsappUrl = `https://wa.me/${phoneNumber}`;
      window.open(whatsappUrl, "_blank");
    };
  return (
    <nav className="bg-black flex flex-wrap justify-between items-center text-white px-6 py-4 md:px-20 md:py-6">
      {/* Logo */}
      <img src={Group3} alt="Logo" className="w-36 h-16 max-lg:w-24 max-lg:h-10" />

      {/* Navigation Menu */}
      <ul
        className='flex font-bold'
      >
        <li className="cursor-pointer text-lg md:text-md transition-all duration-300 p-2 hover:text-gray-300">
          <Link to="/" >
            Home
          </Link>
        </li>
        <li className="cursor-pointer text-lg md:text-md transition-all duration-300 p-2 hover:text-gray-300">
          <Link to="/about" >
            About
          </Link>
        </li>
        <li className="cursor-pointer text-lg md:text-md transition-all duration-300 p-2 hover:text-gray-300">
        <Link onClick={handleWhatsAppChat}  className=''>Contact</Link>

        </li>
      </ul>
    </nav>
  );
};


