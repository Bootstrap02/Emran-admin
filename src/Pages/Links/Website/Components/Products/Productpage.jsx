import React, { useState, useEffect } from "react";
import { TbCurrencyNaira } from "react-icons/tb";
import Navbar from "../Navbar/Subnavbar";
import Footer from "../../../../../Components/Footer";
import { FaWhatsapp } from "react-icons/fa";

const Productpage = () => {
  const productState = JSON.parse(localStorage.getItem("productpages"));
  const handleWhatsAppChat = () => {
    const whatsappUrl = `https://wa.me/${productState.mobile ? productState.mobile : "+2349069412463"}`;
    window.open(whatsappUrl, "_blank");
  };

  const [selectedImage, setSelectedImage] = useState(
    productState?.images[0] || ""
  );

  if (!productState) {
    return <div className="p-6 text-white text-center">No product details available.</div>;
  }

  return (
    <div className="relative bg-[#282828] pb-20"> {/* Added padding-bottom to prevent overlap */}
      <Navbar data={productState} />

      {/* Desktop View */}
      <div className="container p-6 text-white max-lg:hidden flex flex-wrap">
        <div className="w-1/3 flex flex-col gap-4">
          <div className="w-2/3">
            <img src={selectedImage} alt="big_image" className="w-full h-auto" />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {Object.values(productState.images || []).map((image, index) => (
              <img
                key={index}
                src={image}
                width={70}
                alt="product_thumbnail"
                className={`cursor-pointer border ${selectedImage === image ? 'border-[#FFD700]' : 'border-transparent'}`}
                onClick={() => setSelectedImage(image)}
              />
            ))}
          </div>
        </div>

        <div className="w-2/3">
          <h1 className="text-2xl font-bold">{productState.title}</h1>
          <p><strong>Description:</strong> {productState.description}</p>
          <div className="flex gap-2 items-center">
            <strong>Price:</strong>
            <span className="text-2xl flex items-center text-[#FFD700]">
              <TbCurrencyNaira /> {productState.price}
            </span>
          </div>
          <p><strong>Location:</strong> {productState.location}</p>
        </div>
      </div>

      {/* Mobile View */}
      <div className="container p-6 text-white lg:hidden text-sm flex flex-col gap-4">
        <div className="flex flex-col items-center">
          <img src={selectedImage} alt="big_image" className="w-40 h-auto" />
          <div className="flex gap-2 overflow-x-auto">
            {Object.values(productState.images).map((image, index) => (
              <img
                key={index}
                src={image}
                width={30}
                alt="product_thumbnail"
                className={`cursor-pointer border ${selectedImage === image ? 'border-[#FFD700]' : 'border-transparent'}`}
                onClick={() => setSelectedImage(image)}
              />
            ))}
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-lg font-bold">{productState.title || productState.name}</h1>
          <p><strong>Description:</strong> {productState.description}</p>
          <p><strong>Brand:</strong> {productState.brand || "N/A"}</p>
          <div className="flex gap-2 items-center justify-center">
            <strong>Price:</strong>
            <span className="text-lg flex items-center text-[#FFD700]">
              <TbCurrencyNaira /> {productState.price}
            </span>
          </div>
          <p><strong>Location:</strong> {productState.sellerLocation || "N/A"}</p>
          <p><strong>Condition:</strong> {productState.condition || "N/A"}</p>
          <p><strong>Color:</strong> {productState.color || "N/A"}</p>
          <p><strong>Details:</strong> {productState.details || "N/A"}</p>
        </div>
      </div>

      <Footer />

      {/* ✅ Fixed WhatsApp Button */}
      <div className="fixed bottom-40 right-5 z-50">
        <button
          onClick={handleWhatsAppChat}
          className="flex items-center gap-2 text-white py-2 px-4 text-sm md:text-lg hover:opacity-85 duration-300 hover:scale-105 font-semibold rounded-full bg-[#25D366] shadow-lg"
        >
          <FaWhatsapp className="text-lg md:text-xl" />
          Chat on WhatsApp
        </button>
      </div>
    </div>
  );
};

export default Productpage;
