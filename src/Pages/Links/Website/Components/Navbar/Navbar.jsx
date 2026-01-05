import React, { useState } from "react";
import { RiCloseLine, RiMenu2Line } from "@remixicon/react";
import { Link } from "react-scroll";
import Group3 from "../../assets/Group223.png";
import { useNavigate } from "react-router-dom";

const Navbar = ({ data }) => {
  const navigate = useNavigate();
  const [menu, setMenu] = useState(false);
  const accessedToken = JSON.parse(localStorage.getItem("userData"));

  const toggleMenu = () => setMenu(!menu);

  const Edit = (id) => {
    navigate(`/mainpage/${id}`);
  };

  const Copy = (firstname) => {
    navigator.clipboard
      .writeText(`https://campusify.net/webstore/${firstname}`)
      .then(() => {
        alert("Web address copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <nav className="flex flex-wrap justify-center gap-10 items-center text-black px-2 py-4 md:px-10 md:py-6 relative bg-[#ffd700]">
      <img
        src={data.image ? data.image[0] : Group3}
        alt="Logo"
        className="rounded-[50%] w-18 h-12 max-lg:w-10 max-lg:h-10"
      />

      <div className="font-bold mr-[10px] text-sm">
        <p>{data.mobile}</p>
        <p>{data.email}</p>
      </div>

      <div className="flex justify-apart gap-20 items-center">
        <ul
          className={`${
            menu ? "flex" : "hidden"
          } flex-col absolute top-20 left-0 w-full bg-white bg-opacity-90 text-center py-6 px-6 space-y-4 rounded-md shadow-lg md:relative md:top-0 md:flex md:flex-row md:space-y-0 md:space-x-6 md:py-0 md:px-0 md:bg-transparent md:shadow-none`}
        >
          <li
            style={{ borderTop: "1px solid green" }}
            className="cursor-pointer text-lg md:text-md transition-all duration-300 p-2 hover:text-gray-300"
          >
            <Link to="products" smooth={true} duration={500} onClick={() => setMenu(false)}>
              Our Products
            </Link>
          </li>

          <li
            style={{ borderTop: "1px solid green" }}
            className="cursor-pointer text-lg md:text-md transition-all duration-300 p-2 hover:text-gray-300"
          >
            <Link to="home" smooth={true} duration={500} onClick={() => setMenu(false)}>
              Home
            </Link>
          </li>

          {accessedToken && accessedToken._id === data._id && (
              <li
                style={{ borderTop: "1px solid green" }}
                className="cursor-pointer text-lg md:text-md transition-all duration-300 p-2 hover:text-gray-300 text-green-700"
                onClick={() => Edit(data._id)}
              >
                Edit Website
              </li>
          )}
          {accessedToken && accessedToken._id === data._id && (
              <li
              style={{ borderTop: "1px solid green" }}
              className="cursor-pointer text-lg md:text-md transition-all duration-300 p-2 hover:text-gray-300 text-orange-700"
              onClick={() => Copy(data.firstname)}
            >
              Copy Web Address
            </li>
          )}
        </ul>
      </div>

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
