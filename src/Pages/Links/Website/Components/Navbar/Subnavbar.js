import React, { useState } from "react";
import { RiCloseLine, RiMenu2Line } from "@remixicon/react";
import Group3 from "../../assets/Group223.png";
import { useNavigate } from "react-router-dom";

const Navbar = ({ data }) => {
  const navigate = useNavigate();
  const [menu, setMenu] = useState(false);
  const toggleMenu = () => setMenu(!menu);

  return (
    <nav className="flex flex-wrap justify-center gap-10 items-center text-black px-2 py-4 md:px-10 md:py-6 relative bg-[#ffd700]">
      <img
        src={data.sellerImage ? data.sellerImage : Group3}
        alt="Logo"
        className="rounded-[50%] w-18 h-12 max-lg:w-10 max-lg:h-10"
      />

      <div className="font-bold mr-[10px] text-sm">
        <p>{data.mobile}</p>
        <p>Welcome to {data.seller}</p>
      </div>

      <div className="flex justify-apart gap-20 items-center">
        <ul
          className={`${
            menu ? "flex" : "hidden"
          } flex-col absolute top-20 left-0 w-full bg-white bg-opacity-90 text-center py-6 px-6 space-y-4 rounded-md shadow-lg md:relative md:top-0 md:flex md:flex-row md:space-y-0 md:space-x-6 md:py-0 md:px-0 md:bg-transparent md:shadow-none`}
        >
          {/* Go Back */}
          <li
            style={{ borderTop: "1px solid green" }}
            className="cursor-pointer text-lg md:text-md transition-all duration-300 p-2 hover:text-gray-300"
            onClick={() => {
              navigate(-1);
              setMenu(false);
            }}
          >
            Go Back
          </li>
        </ul>
      </div>

      {/* Mobile Menu Icon */}
      {menu ? (
        <RiCloseLine
          size={30}
          className="md:hidden absolute right-6 top-6 cursor-pointer"
          onClick={toggleMenu}
        />
      ) : (
        <RiMenu2Line
          size={30}
          className="md:hidden absolute right-6 top-6 cursor-pointer"
          onClick={toggleMenu}
        />
      )}
    </nav>
  );
};

export default Navbar;
