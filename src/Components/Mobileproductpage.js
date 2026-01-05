import React, {useState, useEffect} from "react";
import axios from 'axios';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import {  useSelector } from 'react-redux';
import { Mobiletrendingproductscards, Mobileproductcard } from "./Productcards";
import { Callbackmodals, Messagemodals } from './Productmodals';
import { TbCurrencyNaira } from 'react-icons/tb';
import { MdCancel } from 'react-icons/md';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import images from "../Constants/images";
import {Editproduct} from "./Editproduct";
import { Tokenerrormodal } from '../Modals/Forms';




export const Editmobileproductpage = () => {

  const [modals, setModals] = useState(false);


const openModals = () => {
  setModals(true);
};

const closeModals = () => {
  setModals(false);
};




const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 2,
  slidesToScroll: 1,
  prevArrow:null,
  nextArrow: null,
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



const productState = JSON.parse(localStorage.getItem('editproduct'));



if (!productState) {
  return (
    <div>
      <h2 className="text-center">Product not found</h2>
    </div>
  );
}


return (
  <div className="container mt-[17.5rem]">
     <div style={{position: "fixed", bottom:"20%", left: "80%"}}>
                    <button  onClick={openModals} className="btn btn-warning">Edit Product</button>
                    </div>
          <div><div className="container">{modals && <Editproduct closeModals= {closeModals}/>} </div></div>
      <div>
     <div>
     
     <div className=" border border-gray-700 mb-3 ">
     <Slider {...settings}>
        {Object.values(productState.images).map((image, index) => (
          <div
          key={index}>
          <img
            src={image}
            alt="main_image"
          />
        </div>
        ))}
         </Slider>
      </div>
          
         
     </div>
     <div>
            <h1 className="text-center text-2xl text-black text-bold shadow-md p-2">
              {productState.title}
            </h1>
            <div className="m-2 flex flex-wrap gap-3 p-2 justify-center">
              <div className="m-1"><strong>Condition:</strong> {productState.condition}</div>
              <div className="m-1"><strong>Brand:</strong> {productState.brand}</div>
              <div className="m-1"><strong>Location:</strong> {productState.location}</div>
              <div className="m-1"><strong>Stock:</strong> {productState.stock}</div>
              <div className='flex justify-between'>
              <div className="product-price d-flex gap-2 m-1 align-items-center">
              <strong>Price:</strong>
                <div className="text-2xl flex gap-2 text-[#5C1818]">
                  <TbCurrencyNaira className="naira" />
                  <h3 className="card-price-text text-2xl">{productState.price}</h3>
                </div>
              </div>
              </div>
              <div className="m-1"><strong>Sold:</strong> {productState.amountSold}</div>
              <div className='flex justify-between text-sm'>
              <div className='flex flex-col' ><p>Color:</p> <strong>{productState.color}</strong></div>
              <div className='flex flex-col' ><p>Owner Status:</p> <strong>{productState.person}</strong></div>
              <div className='flex flex-col' ><p>Fault:</p> <strong>{productState.fault}</strong></div>
              </div>
              
            </div>
            <div className="m-1"><strong>Description:</strong> {productState.description}</div>
              <div className="m-1"><strong>Other Details: </strong>{productState.details}</div>
          </div>
          <div className="p-4 flex flex-col gap-4 border border-red-800">
        <div className="text-center text-bold text-[#5C1818] text-2xl m-2 p-2">
          Seller Information
        </div>
        <div className="flex flex-col gap-6 my-2 justify-center w-[100%] ">
          <div className="flex gap-3 ">
            <div className="flex flex-col gap-3 justify-center ">
              <div className="flex gap-4 justify-between items-center mb-2">
                <div className="bg-[#f5f5f5] rounded-full shadow-lg">
                  {productState.sellerImage && productState.sellerImage.length > 0 && (
<img src={productState.sellerImage} width={100} alt="seller_image" />
)}

                </div>

                <div>
                  <div className="text-bold text-lg">{productState.seller}</div>
                  <div className="text-sm text-gray-600">{productState.sellerLocation}</div>
                </div>
              </div>
              <div className="flex flex-col gap-2 justify-center">
                <div>
                  <h1 className="text-lg text-orange-700 underline text-center rounded-sm border inline-block">
                    Seller Phone Number
                  </h1>
                  <p className="text-[#5C1818] text-bold m-1 p-1">
                   {productState.mobile}
                    <br />
                    {productState.mobile2}
                  </p>
                </div>
              </div>
              <div>
                <h1 className="text-lg text-orange-700 underline text-bold text-center m-2 p-2">
                  Safety Tips
                </h1>
                <ul className="flex flex-col gap-2">
                  <li className="p-2">Never pay in advance, even for delivery</li>
                  <li className="p-2">Always meet with the seller at a safe public place</li>
                  <li className="p-2">Never hurry. Take your time when buying</li>
                  <li className="p-2">Inspect the item thoroughly and ensure it's exactly what you want</li>
                  <li className="p-2">Pay only when you're satisfied</li>
                  <li className="p-2">Keep in touch with the seller</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
  </div>
)


}



export const Mobilenewproductpage = () => {
  const navigate = useNavigate();
  const {id, title} = useParams()
    const newProduct = JSON.parse(localStorage.getItem('newproduct'));
  const GET_PRODUCT_API_KEY = `https://campusbuy-backend-nkmx.onrender.com/getproduct/${id}`;

  useEffect(() => {
    const Reload = async()=> {
      const response = await axios.get(GET_PRODUCT_API_KEY);
        await localStorage.setItem('newproduct', JSON.stringify(response.data));
        navigate(`/newproduct/${id}/${title}`)
    }
    Reload()
  },[]);
  



  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    prevArrow:null,
    nextArrow: null,
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



  if (!newProduct) {
    return (
      <div>
        <h2 className="text-center">Product not found</h2>
      </div>
    );
  }
  

  return (
    <div className="container mt-[17.5rem]">
        <div>
       <div>
       
       <div className=" border border-gray-700 mb-3 ">
       <Slider {...settings}>
          {Object.values(newProduct.images).map((image, index) => (
            <div
            key={index}>
            <img
              src={image}
              alt="main_image"
            />
          </div>
          ))}
           </Slider>
        </div>
            
           
       </div>
       <div>
              <h1 className="text-center text-2xl text-black text-bold shadow-md p-2">
                {newProduct.title}
              </h1>
              <div className="m-2 flex flex-wrap gap-3 p-2 justify-center">
                <div className="m-1"><strong>Condition:</strong> {newProduct.condition}</div>
                <div className="m-1"><strong>Brand:</strong> {newProduct.brand}</div>
                <div className="m-1"><strong>Location:</strong> {newProduct.location}</div>
                <div className="m-1"><strong>Stock:</strong> {newProduct.stock}</div>
                <div className="product-price d-flex gap-2 m-1 align-items-center">
                <strong>Price:</strong>
                  <div className="text-2xl flex gap-2 text-[#5C1818]">
                    <TbCurrencyNaira className="naira" />
                    <h3 className="card-price-text text-2xl">{newProduct.price}</h3>
                  </div>
                </div>
                <div className="m-1"><strong>Sold:</strong> {newProduct.sold}</div>
                <div className='flex justify-between text-sm'>
                <div ><strong>Color: </strong>{newProduct.color}</div>
                <div ><strong>Owner Status: </strong>{newProduct.person}</div>
                <div ><strong>Fault: </strong>{newProduct.fault}</div>

                </div>
              </div>
              <div className='my-3'>
    <div className="m-1"><strong>Description: </strong>{newProduct.description}</div>
                <div className="m-1"><strong>Other Details: </strong>{newProduct.details}</div>
    </div>
            </div>
            <div className="p-4 flex flex-col gap-4 border border-red-800">
          <div className="text-center text-bold text-[#5C1818] text-2xl m-2 p-2">
            Seller Information
          </div>
          <div className="flex flex-col gap-6 my-2 justify-center w-[100%] ">
            <div className="flex gap-3 ">
              <div className="flex flex-col gap-3 justify-center ">
                <div className="flex gap-4 justify-between items-center mb-2">
                  <div className="bg-[#f5f5f5] rounded-full shadow-lg">
                  {newProduct.sellerImage && newProduct.sellerImage.length > 0 && (
  <img src={newProduct.sellerImage} width={100} alt="seller_image" />
)}
                  </div>

                  <div>
                    <div className="text-bold text-lg">{newProduct.seller}</div>
                    <div className="text-sm text-gray-600">{newProduct.sellerLocation}</div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 justify-center">
                  <div>
                    <h1 className="text-lg text-orange-700 underline text-center rounded-sm border inline-block">
                      Seller Phone Number
                    </h1>
                    <p className="text-[#5C1818] text-bold m-1 p-1">
                      {newProduct.mobile}
                      <br />
                      {newProduct.mobile2}
                    </p>
                  </div>
 
                </div>
                <div>
                  <h1 className="text-lg text-orange-700 underline text-bold text-center m-2 p-2">
                    Safety Tips
                  </h1>
                  <ul className="flex flex-col gap-2">
                    <li className="p-2">Never pay in advance, even for delivery</li>
                    <li className="p-2">Always meet with the seller at a safe public place</li>
                    <li className="p-2">Never hurry. Take your time when buying</li>
                    <li className="p-2">Inspect the item thoroughly and ensure it's exactly what you want</li>
                    <li className="p-2">Pay only when you're satisfied</li>
                    <li className="p-2">Keep in touch with the seller</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
    </div>
  )

 
}