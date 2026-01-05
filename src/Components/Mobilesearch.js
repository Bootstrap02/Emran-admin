import React, {useState, useEffect} from 'react';
import { NavLink, Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {Searchmobilecategories} from './Mobilecategories.js';
import { IoChevronForwardOutline } from "react-icons/io5";
import { IoChevronBack } from "react-icons/io5";
import {Mobileproductcard} from './Productcards.js';
import { RiArrowUpDownLine } from "react-icons/ri";
import { Mobileheader } from './Subheaders.js';
import Footer from './Footer';
import { Loginmodal } from '../Modals/Pages/Signin.js';
import { Tokenerrormodal, Signedinmodal } from '../Modals/Forms.js';




const Mobilesearch = ()=> {
  const {university, title} = useParams()
  const navigate =  useNavigate();
  const [activeButtonIndex, setActiveButtonIndex] = useState('1');
  const [pageNumber, setPageNumber] = useState(1);
  const [targetValue, setTargetValue] = useState('');
  const [noProducts, setNoProducts] = useState(false);
  const [loginModal, setLoginModal] = useState(false);
  const [loginSuccessModal, setLoginSuccessModal] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const universities = JSON.parse(localStorage.getItem('universities'));
  const searchKeyword = JSON.parse(localStorage.getItem('searchkeyword'));
  const searchedProducts = JSON.parse(localStorage.getItem('searchedproducts'));
  const [slicedProducts, setSlicedProducts] = useState(); // New state for sliced products

  const active = {
    backgroundColor: '#FEBD69',
    border: "black 1px solid",
    fontWeight: "bold",
    borderRadius: "8px",
    padding: "10px 15px",
    color: "black",
  };
  const inactive = {
    fontWeight: "bold",
    color: "#646161",
  };

   useEffect(() => {
      setSlicedProducts(searchedProducts.slice(0, 15));
  }, []);
  
  const openLoginModal= ()=>{
    setLoginModal(true)
  };
  const closeLoginModal= ()=>{
    setLoginModal(false)
  };
  const openLoginError= ()=>{
    setLoginError(true)
  };
  const closeLoginError= ()=>{
    setLoginError(false)
  };
  const openLoginSuccessModal= ()=>{
    setLoginSuccessModal(true)
  };
  const closeLoginSuccessModal= ()=>{
    setLoginSuccessModal(false)
  };

  const handleChange = (e) => {
    setTargetValue(e.target.value); // Update state with input value
  };
  const searchPage = async (e) => {
    e.preventDefault();
  
    const pageValueNum = Number(targetValue); // explicitly convert to number
    const end = pageValueNum * 15;
    const start = end - 15;
      
    await setActiveButtonIndex(null);
    await setPageNumber(pageValueNum);
  
    if (start >= searchedProducts.length) {
      await setNoProducts(true);
      console.log(noProducts); // this will likely still show the old value due to async state
    } else {
      await setSlicedProducts(searchedProducts.slice(start, end));
      await setNoProducts(false); // just to be safe
    }
  };
  

  
  const handleSearch= async(index, num) => {
    const end = num * 15;
    const start = end - 15;
    await setActiveButtonIndex(index);
    await setPageNumber(num);
    if(start.length > searchedProducts.length) {
      await setNoProducts(true);
     }else{
       await setSlicedProducts(searchedProducts.slice(start, end));
     }
  }

  const NEW_API_KEY = `https://campusbuy-backend-nkmx.onrender.com/searchproducts?university=${universities.value}&search=${searchKeyword}&condition=new`;
  const REFURBISHED_API_KEY = `https://campusbuy-backend-nkmx.onrender.com/searchproducts?university=${universities.value}&search=${searchKeyword}&condition=refurbished`;
  const USED_API_KEY = `https://campusbuy-backend-nkmx.onrender.com/searchproducts?university=${universities.value}&search=${searchKeyword}&condition=used`;
  const NEWEST_API_KEY = `https://campusbuy-backend-nkmx.onrender.com/searchproducts?university=${universities.value}&search=${searchKeyword}&sort=createdAt`;
  const NEWEST_API_KEYS = `https://campusbuy-backend-nkmx.onrender.com/searchproducts?search=${searchKeyword}&sort=createdAt`;
  const OLDEST_API_KEY = `https://campusbuy-backend-nkmx.onrender.com/searchproducts?university=${universities.value}&search=${searchKeyword}&sort=-createdAt`;
  const OLDEST_API_KEYS = `https://campusbuy-backend-nkmx.onrender.com/searchproducts?search=${searchKeyword}&sort=-createdAt`;
  const CHEAPEST_API_KEY = `https://campusbuy-backend-nkmx.onrender.com/searchproducts?university=${universities.value}&search=${searchKeyword}&sort=price`;
  const CHEAPEST_API_KEYS = `https://campusbuy-backend-nkmx.onrender.com/searchproducts?search=${searchKeyword}&sort=price`;
  const MOST_EXPENSIVE_API_KEY = `https://campusbuy-backend-nkmx.onrender.com/searchproducts?university=${universities.value}&search=${searchKeyword}&sort=-price`;
  const MOST_EXPENSIVE_API_KEYS = `https://campusbuy-backend-nkmx.onrender.com/searchproducts?search=${searchKeyword}&sort=-price`;
  const SEARCH_API_KEY = `https://campusbuy-backend-nkmx.onrender.com/searchproducts?university=${university}&search=${title}`;
  const SEARCH_API_KEYS = `https://campusbuy-backend-nkmx.onrender.com/searchproducts?search=${title}`;


  useEffect(() => {
    const Reload = async()=> {
      const response = await axios.get(universities.value === "All Universities" ? SEARCH_API_KEYS : SEARCH_API_KEY);
        await localStorage.setItem('searchedproducts', JSON.stringify(response.data.data));
        navigate(`/search/${university}/${title}`)
    }
    Reload()
  }, [title]);


  const Filterproducts = async (Apikey) => {
      
    try {
        const response = await axios.get(Apikey);
          await localStorage.setItem('searchedproducts', JSON.stringify(response.data.data));
        window.location.reload(); // Reload the page after updating localStorage
      
    } catch (error) {
      console.error('Error moving forward:', error);
      alert("No product found!");
    }
  };



    return(
        <div className='w-[100%] bg-[#222121] text-white'>
      <div className="w-[100%]"><Mobileheader/></div>

            <div className='container mt-[5rem]'>
          <div className='bg-black text-white text-xl p-2 m-1 text-center w-[100%]'><h2>Check out Products in other Categories</h2></div>
          <div className='w-[100%] '><Searchmobilecategories/></div>
        </div>
        <div>
          <div className='text-[1rem] text-bold text-center pb-2 mb-2' style={{borderBottom:'solid gray 1px'}}><h1><strong>Available {searchKeyword} in {universities.value}</strong></h1></div>
         <div className='mb-3 container'>
         <div className='container flex shadow-lg items-start justify-between px-3'>
<div className=''>Sort By:</div>
<button onClick={()=>{Filterproducts(universities.value === "All Universities" ? NEWEST_API_KEYS : NEWEST_API_KEY)}} className='px-2 p-1 rounded-sm bg-[#FEBD69] text-[8px] text-black'>Newest</button>
<button onClick={()=>{Filterproducts(universities.value === "All Universities" ? OLDEST_API_KEYS : OLDEST_API_KEY)}} className='px-2 p-1 rounded-sm bg-[#FEBD69] text-[8px] text-black'>Oldest</button>
<button onClick={()=>{Filterproducts(universities.value === "All Universities" ? CHEAPEST_API_KEYS : CHEAPEST_API_KEY)}} className='px-2 p-1 rounded-sm bg-[#FEBD69] text-[8px] text-black'>Cheapest</button>
<button onClick={()=>{Filterproducts(universities.value === "All Universities" ? MOST_EXPENSIVE_API_KEYS : MOST_EXPENSIVE_API_KEY)}} className='px-2 p-1 rounded-sm bg-[#FEBD69] text-[8px] text-black'>Most Expensive</button>          
          </div>
         </div>
         
        </div>
        <section className=' product-listings mb-[7rem]'>
    <div className=' w-[100%] flex flex-wrap justify-between'>
    <Mobileproductcard slicedProducts={slicedProducts} openLoginError={openLoginError} closeLoginError={closeLoginError} openLoginModal={openLoginModal}/>
    </div>
    <div className=' justify-end flex items-center gap-2 m-2'>
        <div className='flex justify-start items-center gap-2 text-[8px] '>
          <button><IoChevronBack className='Search-react-icons-arrow' /></button>
          <button
              onClick={() => handleSearch('1', 1)}
              style={activeButtonIndex === '1' ? active : inactive}
            >
              1
            </button>
          <button
              onClick={() => handleSearch('2', 2)}
              style={activeButtonIndex === '2' ? active : inactive}
            >
              2
            </button>
          <button
              onClick={() => handleSearch('3', 3)}
              style={activeButtonIndex === '3' ? active : inactive}
            >
              3
            </button>
          <button
              onClick={() => handleSearch('4', 4)}
              style={activeButtonIndex === '4' ? active : inactive}
            >
              4
            </button>
          <button
              onClick={() => handleSearch('5', 5)}
              style={activeButtonIndex === '5' ? active : inactive}
            >
              5
            </button>
          <button
              onClick={() => handleSearch('6', 6)}
              style={activeButtonIndex === '6' ? active : inactive}
            >
              6
            </button>
          <button
              onClick={() => handleSearch('7', 7)}
              style={activeButtonIndex === '7' ? active : inactive}
            >
              7
            </button>
          <button
              onClick={() => handleSearch('8', 8)}
              style={activeButtonIndex === '8' ? active : inactive}
            >
              8
            </button>
          <button
              onClick={() => handleSearch('9', 9)}
              style={activeButtonIndex === '9' ? active : inactive}
            >
              9
            </button>
          <button><IoChevronForwardOutline className='categories-react-icons-arrow' /></button>
        </div>
        <form onSubmit={searchPage} className='flex justify-center items-center gap-2 '>
          <p className='text-[8px] text-[#FEBD69]'>Go to page</p>
          <input className='p-2 rounded-md w-[25%] ' type='number' onChange={handleChange}/>
          <button type='submit' className='bg-white p-1 rounded-md '>Go</button>
        </form>
        
      </div>
    </section>
    <Footer/>
    {loginModal &&  <div className='w-[60%] rounded-md flex justify-center ' style={{position:'fixed', top:'10%', left:'0', zIndex:'4000',}}> <Loginmodal closeModal={closeLoginModal} closeLoginSuccessModal={closeLoginSuccessModal} openLoginSuccessModal={openLoginSuccessModal}/></div>}
  {loginSuccessModal &&  <div className=' rounded-md flex justify-center ' style={{position:'fixed', top:'10%', left:'0', zIndex:'4000',}}> <Signedinmodal /></div>}
  {loginError &&  <div className='container rounded-md flex justify-center ' style={{position:'fixed', top:'0', right:'20', zIndex:'4000'}}> <Tokenerrormodal /></div>}
      
        </div>
    )
}

export default Mobilesearch;