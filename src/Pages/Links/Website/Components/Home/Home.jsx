import React, { useState, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";
import TextChange from "../TextChange";
import home from "../../assets/home.jpg"



const Home = ({data}) => {
  const handleWhatsAppChat = () => {
    const whatsappUrl = `https://wa.me/${data.mobile? data.mobile : +2349069412463 }`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div
  id="home"
  className='text-white flex w-full justify-between items-start p-10 md:p-20 bg-center '
  style={{ backgroundImage: `url(${ home})` }}
>


      <div className="md:w-2/4 md:pt-10 bg-black/50 p-5 rounded-lg">
        <h1 className="text-xl md:text-6xl font-bold flex leading-normal tracking-tighter">
          <TextChange firstname={data.firstname} />
        </h1>
        <p className="text-sm md:text-2xl tracking-tight">
          Where we deliver the best products and services perfect to your taste
        </p>
        <button
          onClick={handleWhatsAppChat}
          className="mt-5 md:mt-10 flex items-center gap-2 text-white py-2 px-3 text-sm md:text-lg md:py-2 md:px-4 hover:opacity-85 duration-300 hover:scale-105 font-semibold rounded-3xl bg-[#25D366]"
        >
          <FaWhatsapp className="text-lg md:text-xl" />
          Chat on WhatsApp
        </button>
      </div>
    </div>
  );
};

export default Home;
