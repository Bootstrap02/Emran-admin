import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import images from "../Constants/images";



const Promoproducts = () => {

 

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    prevArrow: <span className="slick-prev" ><img src={images.picture.arrowleft} width={40} /></span>,
    nextArrow: <span className="slick-next" ><img src={images.picture.arrowright} width={40}/></span>,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const truncateDescription = (description, wordLimit) => {
    const words = description.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    }
    return description;
  };

  return (
    <div className="border-[#d4af37] border-2">
      <Slider {...settings}>
        {images.Card.map((image, index) => (
          <Link
            to={`/productpage/${image?.title}`}
            key={index + 1}
            className="m-2 max-lg:m-2 flex w-[30%] max-lg:p-2 p-2"
          >
            <h3 className="text-center">{image.title}</h3>
            <img
              src={image.photos[0].image_1}
              width={300}
              alt={image.title}
            />
            <div className="text-center flex flex-col gap-4">
              <h2 className="text-bold text-2xl text-green-700">{image.price}</h2>
              <h3>{truncateDescription(image.description, 25)}</h3>
              <h4 className="text-semibold text-xl text-green-500">{image.location}</h4>
            </div>
          </Link>
        ))}
      </Slider>
    </div>
  );
};

export default Promoproducts;
