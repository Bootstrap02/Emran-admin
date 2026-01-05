import React, { useState } from "react";
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux'; 
import { Categoriesmodal } from '../Modals/General/Categories.js';
import { MediumLoader } from '../Modals/Loaders';
import { Mobile } from "../Constants/Hardjson.js";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export const Mobilecategories = () => {
    
    const universities = JSON.parse(localStorage.getItem('universities'));

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const settings = {
        dots: true,
        infinite: true,
        speed: 100,
        slidesToScroll: 2,
        speed: 1000, // 1 second movement speed
        autoplay: true, // Enable autoplay
        autoplaySpeed: 3000, // Autoplay speed in milliseconds (e.g., 3000 milliseconds = 3 seconds)
        slidesToShow: 3, // Adjust this value as needed
        responsive: [
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 2,
              speed: 100,
            },
          },
          {
            breakpoint: 576,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 2,
              speed: 100,
            },
          },
        ],
      };
      

  const sendSearchKeyword = (searchKeyword) => dispatch({ type: 'SEND_SEARCH_KEYWORD', searchKeyword });

  const fetchCategories = async (category, categoryApi) => {
    try {
      const response = await axios.get(categoryApi);
      await sendSearchKeyword(category);
      await localStorage.setItem('searchedproducts', JSON.stringify(response.data.data));
      navigate(`/search/${universities.value}/${category}`);
    } catch (error) {
      console.error('Error fetching categories:', error);
      alert("No Products in this category yet")
      // Handle error as needed
    }
  };

  return (
    <div className="w-[100%] p-2 text-sm text-white bg-[#22395D] rounded-lg ">
      <Slider {...settings}>
        {Mobile.map((mobile) => (
          <NavLink onClick={()=>{fetchCategories(mobile.title, universities.value === "All Universities" ? 
            `${mobile.API}university=${universities.value}&category=${mobile.title}` : 
            `${mobile.API}category=${mobile.title}`)}} className="" key={mobile.title}>
            <div className="flex flex-col gap-3 justify-center items-center  m-1 " key={mobile.title}>
                <div className="w-[50px] h-[40px]"> <img src={mobile.image} alt={mobile.title} width={40} height={40}/></div>     
                 <p><strong>{mobile.title}</strong></p>
            </div>
          </NavLink>
        ))}
      </Slider>
    </div>
  );
};

export const Searchmobilecategories = () => {
    
  const universities = JSON.parse(localStorage.getItem('universities'));

  const dispatch = useDispatch();
  const navigate = useNavigate();
    


const fetchCategories = async (category, categoryApi) => {
  try {
    const response = await axios.get(categoryApi);
    await localStorage.setItem('searchkeyword', JSON.stringify(category));
    await localStorage.setItem('searchedproducts', JSON.stringify(response.data.data));
    window.location.reload(); // Reload the page after updating localStorage
  } catch (error) {
    console.error('Error fetching categories:', error);
    alert("No Products in this category yet")
    // Handle error as needed
  }
};

return (
  <div className="w-[100%] text-white flex flex-wrap  justify-between bg-[black] rounded-md ">
      {Mobile.slice(0, 10).map((mobile) => (
        <NavLink onClick={()=>{fetchCategories(mobile.title, universities.value === "All Universities" ? 
          `${mobile.API}university=${universities.value}&category=${mobile.title}` : 
          `${mobile.API}category=${mobile.title}`)}} className=" w-[15%] " key={mobile.title}>
            <div className="" key={mobile.title} >
              
              <div className="flex flex-col gap-2 m-2 p-1 ">
                <img src={mobile.image} alt={mobile.title} width={25} />
                <strong className='text-[8px]'>{mobile.title}</strong>
              </div>
            </div>
        
        </NavLink>
      ))}
  </div>
);
};

export const Searchcategories = () => {
  const [categories, setCategories] = useState(false);
  const [loader, setLoader] = useState(false);

  const universities = JSON.parse(localStorage.getItem('universities'));

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const openCategories= ()=>{
    setCategories(true)
  };
  const closeCategories= ()=>{
    setCategories(false)
  };
  const openLoader= ()=>{
    setLoader(true)
  };
  const closeLoader= ()=>{
    setLoader(false)
  };
  
  const API_KEY = {
    APARTMENTS_API_KEY : `https://campusbuy-backend-nkmx.onrender.com/searchproducts?university=${universities.value}&search=Apartments`,
    APARTMENTS_API_KEYS: `https://campusbuy-backend-nkmx.onrender.com/searchproducts?search=Apartments`,
    PHONES_API_KEY: `https://campusbuy-backend-nkmx.onrender.com/searchproducts?university=${universities.value}&search=Phones`,
    PHONES_API_KEYS: `https://campusbuy-backend-nkmx.onrender.com/searchproducts?search=Phones`,
    BEDS_AND_FURNITURES_API_KEY: `https://campusbuy-backend-nkmx.onrender.com/searchproducts?university=${universities.value}&search=Beds and Furnitures`,
    BEDS_AND_FURNITURES_API_KEYS: `https://campusbuy-backend-nkmx.onrender.com/searchproducts?search=Beds and Furnitures`,
    LAPTOPS_API_KEY: `https://campusbuy-backend-nkmx.onrender.com/searchproducts?university=${universities.value}&search=Laptops`,
    LAPTOPS_API_KEYS: `https://campusbuy-backend-nkmx.onrender.com/searchproducts?search=Laptops`,
    GENERATORS_API_KEY: `https://campusbuy-backend-nkmx.onrender.com/searchproducts?university=${universities.value}&search=Generators`,
    GENERATORS_API_KEYS: `https://campusbuy-backend-nkmx.onrender.com/searchproducts?search=Generators`,
    POTS_API_KEY: `https://campusbuy-backend-nkmx.onrender.com/searchproducts?university=${universities.value}&search=Pots`,
    POTS_API_KEYS: `https://campusbuy-backend-nkmx.onrender.com/searchproducts?search=Pots`,
    DISHES_API_KEY: `https://campusbuy-backend-nkmx.onrender.com/searchproducts?university=${universities.value}&search=Dishes`,
    DISHES_API_KEYS: `https://campusbuy-backend-nkmx.onrender.com/searchproducts?search=Dishes`,
    WATCHES_API_KEY: `https://campusbuy-backend-nkmx.onrender.com/searchproducts?university=${universities.value}&search=Watches`,
    WATCHES_API_KEYS: `https://campusbuy-backend-nkmx.onrender.com/searchproducts?search=Watches`,
    PLAYSTATION_API_KEY: `https://campusbuy-backend-nkmx.onrender.com/searchproductsuniversity=${universities.value}&?search=Playstation`,
    PLAYSTATION_API_KEYS: `https://campusbuy-backend-nkmx.onrender.com/searchproducts?search=Playstation`,
    GAMES_API_KEY: `https://campusbuy-backend-nkmx.onrender.com/searchproducts?university=${universities.value}&search=Games`,
    GAMES_API_KEYS: `https://campusbuy-backend-nkmx.onrender.com/searchproducts?search=Games`,
    TV_API_KEY: `https://campusbuy-backend-nkmx.onrender.com/searchproducts?university=${universities.value}&search=Tv`,
    TV_API_KEYS: `https://campusbuy-backend-nkmx.onrender.com/searchproducts?search=Tv`,
    GOTV_API_KEY: `https://campusbuy-backend-nkmx.onrender.com/searchproducts?university=${universities.value}&search=Gotv`,
    GOTV_API_KEYS: `https://campusbuy-backend-nkmx.onrender.com/searchproducts?search=Gotv`,
    DSTV_API_KEY: `https://campusbuy-backend-nkmx.onrender.com/searchproducts?university=${universities.value}&search=Dstv`,
    DSTV_API_KEYS: `https://campusbuy-backend-nkmx.onrender.com/searchproducts?search=Dstv`,
    TRICYCLE_API_KEY: `https://campusbuy-backend-nkmx.onrender.com/searchproducts?university=${universities.value}&search=Tricycle`,
    TRICYCLE_API_KEYS: `https://campusbuy-backend-nkmx.onrender.com/searchproducts?search=Tricycle`,
    CARS_API_KEY: `https://campusbuy-backend-nkmx.onrender.com/searchproducts?university=${universities.value}&search=Cars`,
    CARS_API_KEYS: `https://campusbuy-backend-nkmx.onrender.com/searchproducts?search=Cars`,
    TUTORIALS_API_KEY: `https://campusbuy-backend-nkmx.onrender.com/searchproducts?university=${universities.value}&search=Tutorials`,
    TUTORIALS_API_KEYS: `https://campusbuy-backend-nkmx.onrender.com/searchproducts?search=Tutorials`,
    HAIRS_AND_WIGS_API_KEY: `https://campusbuy-backend-nkmx.onrender.com/searchproducts?university=${universities.value}&search=Hairs and Wigs`,
    HAIRS_AND_WIGS_API_KEYS: `https://campusbuy-backend-nkmx.onrender.com/searchproducts?search=Hairs and Wigs`,
    CLOTHES_API_KEY: `https://campusbuy-backend-nkmx.onrender.com/searchproducts?university=${universities.value}&search=Clothes`,
    CLOTHES_API_KEYS: `https://campusbuy-backend-nkmx.onrender.com/searchproducts?search=Clothes`,
    ELECTRICAL_APPLIANCES_API_KEY: `https://campusbuy-backend-nkmx.onrender.com/searchproducts?university=${universities.value}&search=Electrical Appliances`,
    ELECTRICAL_APPLIANCES_API_KEYS: `https://campusbuy-backend-nkmx.onrender.com/searchproducts?search=Electrical Appliances`,
    TEXTBOOKS_HANDOUT_AND_MATERIALS_API_KEY: `https://campusbuy-backend-nkmx.onrender.com/searchproducts?university=${universities.value}&search=Textbooks, Handouts and Materials`,
    TEXTBOOKS_HANDOUT_AND_MATERIALS_API_KEYS: `https://campusbuy-backend-nkmx.onrender.com/searchproducts?search=Textbooks, Handouts and Materials`,
  };


const fetchCategories = async (category, categoryApi) => {
  openLoader();
  closeCategories();
  try {
    const response = await axios.get(categoryApi);
    await localStorage.setItem('searchkeyword', JSON.stringify(category));
    closeLoader();
    await localStorage.setItem('searchedproducts', JSON.stringify(response.data.data));
    window.location.reload(); // Reload the page after updating localStorage
  } catch (error) {
    closeLoader();
    console.error('Error fetching categories:', error);
    alert("No Products in this category yet")
    // Handle error as needed
  }
};

return (
  <div className='container'>
          {/* <div className='flex flex-col gap-1 bg-white justify-center p-2 rounded-md'>
          <p className='homepage-hot-categories'><NavLink onClick={() =>
            { fetchCategories("Clothes", API_KEY.CLOTHES_API_KEY) }} className='text-sm'><strong>Clothes</strong></NavLink></p>
            <p className='homepage-hot-categories'><NavLink onClick={() =>
              { fetchCategories("Apartments", API_KEY.APARTMENTS_API_KEY) }} className='text-sm'><strong>Apartments</strong></NavLink></p>
            <p className='homepage-hot-categories'><NavLink onClick={() =>
              { fetchCategories("Phones", API_KEY.PHONES_API_KEY) }} className='text-sm'><strong>Phones</strong></NavLink></p>
            <p className='homepage-hot-categories'><NavLink onClick={() =>
              { fetchCategories("Laptops", API_KEY.LAPTOPS_API_KEY) }} className='text-sm'><strong>Laptops</strong></NavLink></p>
            <p className='homepage-hot-categories'><NavLink onClick={() =>
              { fetchCategories("Beds", API_KEY.BEDS_AND_FURNITURES_API_KEY) }} className='text-sm'><strong>Beds and Furnitures</strong></NavLink></p>
            <p className='homepage-hot-categories'><NavLink onClick={() =>
              { fetchCategories("Hairs", API_KEY.HAIRS_AND_WIGS_API_KEY) }} className='text-sm'><strong>Hairs and Wigs</strong></NavLink></p>
            <p className='homepage-hot-categories'><NavLink onClick={() =>
              { fetchCategories("Tutorials", API_KEY.TUTORIALS_API_KEY) }} className='text-sm'><strong>Tutorials</strong></NavLink></p>
            <p className='homepage-hot-categories'><NavLink onClick={() =>
              { fetchCategories("Generators", API_KEY.GENERATORS_API_KEY) }} className='text-sm'><strong>Generators</strong></NavLink></p>
            <p className='homepage-hot-categories'><NavLink onClick={() =>
              { fetchCategories("Pot", API_KEY.POTS_API_KEY) }} className='text-sm'><strong>Pot</strong></NavLink></p>
            <p className='homepage-hot-categories'><NavLink onClick={() =>
              { fetchCategories("Dishes", API_KEY.DISHES_API_KEY) }} className='text-sm'><strong>Dishes</strong></NavLink></p>
            <p className='homepage-hot-categories'><NavLink onClick={() =>
              { fetchCategories("Watches", API_KEY.WATCHES_API_KEY) }} className='text-sm'><strong>Watches</strong></NavLink></p>
            <p className='homepage-hot-categories'><NavLink onClick={() =>
              { fetchCategories("Playstation", API_KEY.PLAYSTATION_API_KEY) }} className='text-sm'><strong>Playstation</strong></NavLink></p>
            <p className='homepage-hot-categories'><NavLink onClick={() =>
              { fetchCategories("Tricycle", API_KEY.TRICYCLE_API_KEY) }} className='text-sm'><strong>Tricycle</strong></NavLink></p>
            <p className='homepage-hot-categories'><NavLink onClick={() =>
              { fetchCategories("Cars", API_KEY.CARS_API_KEY) }} className='text-sm'><strong>Cars</strong></NavLink></p>
            <p className='homepage-hot-categories'><NavLink onClick={() =>
              { fetchCategories("Electrical Appliances", API_KEY.ELECTRICAL_APPLIANCES_API_KEY) }} className='text-sm'><strong>Electrical Appliances</strong></NavLink></p>
            <p className='homepage-hot-categories'><NavLink onClick={() =>
              { fetchCategories("Textbooks", API_KEY.TEXTBOOKS_HANDOUT_AND_MATERIALS_API_KEY) }} className='text-sm'><strong>Textbooks, Handouts and Materials</strong></NavLink></p>
            <p className='bg-black text-center text-[#C0C0C0]'><NavLink  onClick={openCategories } className=''><strong>See more...</strong></NavLink></p>
          </div> */}
           <div className='flex flex-col gap-1 bg-white justify-center p-2 rounded-md'>
          <p className='homepage-hot-categories'><NavLink onClick={() =>
            { fetchCategories("Clothes",universities.value === "All Universities" ? API_KEY.CLOTHES_API_KEY : API_KEY.CLOTHES_API_KEYS) }} className='text-sm'><strong>Clothes</strong></NavLink></p>
            <p className='homepage-hot-categories'><NavLink onClick={() =>
              { fetchCategories("Apartments",universities.value === "All Universities" ? API_KEY.APARTMENTS_API_KEY : API_KEY.APARTMENTS_API_KEYS) }} className='text-sm'><strong>Apartments</strong></NavLink></p>
            <p className='homepage-hot-categories'><NavLink onClick={() =>
              { fetchCategories("Phones",universities.value === "All Universities" ? API_KEY.PHONES_API_KEY : API_KEY.PHONES_API_KEYS) }} className='text-sm'><strong>Phones</strong></NavLink></p>
            <p className='homepage-hot-categories'><NavLink onClick={() =>
              { fetchCategories("Laptops",universities.value === "All Universities" ? API_KEY.LAPTOPS_API_KEY : API_KEY.LAPTOPS_API_KEYS) }} className='text-sm'><strong>Laptops</strong></NavLink></p>
            <p className='homepage-hot-categories'><NavLink onClick={() =>
              { fetchCategories("Beds",universities.value === "All Universities" ? API_KEY.BEDS_AND_FURNITURES_API_KEY : API_KEY.FURNITURES_API_KEYS) }} className='text-sm'><strong>Beds and Furnitures</strong></NavLink></p>
            <p className='homepage-hot-categories'><NavLink onClick={() =>
              { fetchCategories("Hairs",universities.value === "All Universities" ? API_KEY.HAIRS_AND_WIGS_API_KEY : API_KEY.HAIRS_AND_WIGS_API_KEYS) }} className='text-sm'><strong>Hairs and Wigs</strong></NavLink></p>
            <p className='homepage-hot-categories'><NavLink onClick={() =>
              { fetchCategories("Tutorials",universities.value === "All Universities" ? API_KEY.TUTORIALS_API_KEY : API_KEY.TUTORIALS_API_KEYS) }} className='text-sm'><strong>Tutorials</strong></NavLink></p>
            <p className='homepage-hot-categories'><NavLink onClick={() =>
              { fetchCategories("Generators",universities.value === "All Universities" ? API_KEY.GENERATORS_API_KEY : API_KEY.GENERATORS_API_KEYS) }} className='text-sm'><strong>Generators</strong></NavLink></p>
            <p className='homepage-hot-categories'><NavLink onClick={() =>
              { fetchCategories("Pot",universities.value === "All Universities" ? API_KEY.POTS_API_KEY : API_KEY.POTS_API_KEYS) }} className='text-sm'><strong>Pot</strong></NavLink></p>
            <p className='homepage-hot-categories'><NavLink onClick={() =>
              { fetchCategories("Dishes",universities.value === "All Universities" ? API_KEY.DISHES_API_KEY : API_KEY.DISHES_API_KEYS) }} className='text-sm'><strong>Dishes</strong></NavLink></p>
            <p className='homepage-hot-categories'><NavLink onClick={() =>
              { fetchCategories("Watches",universities.value === "All Universities" ? API_KEY.WATCHES_API_KEY : API_KEY.WATCHES_API_KEYS) }} className='text-sm'><strong>Watches</strong></NavLink></p>
            <p className='homepage-hot-categories'><NavLink onClick={() =>
              { fetchCategories("Playstation",universities.value === "All Universities" ? API_KEY.PLAYSTATION_API_KEY : API_KEY.PLAYSTATION_API_KEYS) }} className='text-sm'><strong>Playstation</strong></NavLink></p>
            <p className='homepage-hot-categories'><NavLink onClick={() =>
              { fetchCategories("Games",universities.value === "All Universities" ? API_KEY.GAMES_API_KEY : API_KEY.GAMES_API_KEYS) }} className='text-sm'><strong>Games</strong></NavLink></p>
            <p className='homepage-hot-categories'><NavLink onClick={() =>
              { fetchCategories("Tv",universities.value === "All Universities" ? API_KEY.TV_API_KEY : API_KEY.TV_API_KEYS) }} className='text-sm'><strong>Tv</strong></NavLink></p>
            <p className='homepage-hot-categories'><NavLink onClick={() =>
              { fetchCategories("Gotv",universities.value === "All Universities" ? API_KEY.GOTV_API_KEY : API_KEY.GOTV_API_KEYS) }} className='text-sm'><strong>Gotv</strong></NavLink></p>
            <p className='homepage-hot-categories'><NavLink onClick={() =>
              { fetchCategories("Dstv",universities.value === "All Universities" ? API_KEY.DSTV_API_KEY : API_KEY.DSTV_API_KEYS) }} className='text-sm'><strong>Dstv</strong></NavLink></p>
            <p className='homepage-hot-categories'><NavLink onClick={() =>
              { fetchCategories("Tricycle",universities.value === "All Universities" ? API_KEY.TRICYCLE_API_KEY : API_KEY.TRICYCLE_API_KEYS) }} className='text-sm'><strong>Tricycle</strong></NavLink></p>
            <p className='homepage-hot-categories'><NavLink onClick={() =>
              { fetchCategories("Cars",universities.value === "All Universities" ? API_KEY.CARS_API_KEY : API_KEY.CARS_API_KEYS) }} className='text-sm'><strong>Cars</strong></NavLink></p>
            <p className='homepage-hot-categories'><NavLink onClick={() =>
              { fetchCategories("Electrical Appliances",universities.value === "All Universities" ? API_KEY.ELECTRICAL_APPLIANCES_API_KEY : API_KEY.ELECTRICAL_APPLIANCES_API_KEYS) }} className='text-sm'><strong>Electrical Appliances</strong></NavLink></p>
            <p className='homepage-hot-categories'><NavLink onClick={() =>
              { fetchCategories("Textbooks",universities.value === "All Universities" ? API_KEY.TEXTBOOKS_HANDOUT_AND_MATERIALS_API_KEY : API_KEY.TEXTBOOKS_HANDOUT_AND_MATERIALS_API_KEYS) }} className='text-sm'><strong>Textbooks, Handouts and Materials</strong></NavLink></p>
            <p className='bg-black text-center text-[#C0C0C0]'><NavLink  onClick={openCategories } className=''><strong>See more...</strong></NavLink></p>
          </div>
          {categories &&  <div className='container rounded-md flex justify-center ' style={{position:'fixed', top:'10%', left:'0', zIndex:'4000', height: '500px', width: '100%'}}> <Categoriesmodal closeModal={closeCategories} fetchCategories={fetchCategories}/></div>}
        {loader &&  <div className='container rounded-md flex justify-center ' style={{position:'fixed', top:'30%', left:'20%', width:'50%', zIndex:'5000'}}> <MediumLoader /></div>}
        </div>
);
};
