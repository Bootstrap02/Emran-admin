import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {  Trendingproductscards, Mobiletrendingproductscards, Latestproductscards, Mobilelatestproductscards, Sellerproductcard, Otherproductcard } from './Productcards.js';
import { Tokenerrormodal, Signedinmodal } from '../Modals/Forms.js';
import { Loginmodal } from '../Modals/Pages/Signin.js';



export const Trendingproducts = () => {
    const navigate = useNavigate();
    const [loginModal, setLoginModal] = useState(false);
    const [loginSuccessModal, setLoginSuccessModal] = useState(false);
    const [loginError, setLoginError] = useState(false);
    const [trendingProducts, setTrendingProducts] = useState([])
    let universities = JSON.parse(localStorage.getItem("universities"));
  
    if (!universities) {
      universities = {
        label: "All Universities",
        value: "All Universities",
       };
      localStorage.setItem("universities", JSON.stringify(universities));
    }
  
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

    useEffect(() => {
      const fetchTrendingProducts = async () => {
        try {
          const TRENDING_PRODUCTS_API_KEY = `https://campusbuy-backend-nkmx.onrender.com/getproducts?university=${universities.value}&premiumServices=true`;
          const ALL_TRENDING_PRODUCTS_API_KEY = 'https://campusbuy-backend-nkmx.onrender.com/getpremiumlatestproducts';
      
          const response = await axios.get(universities.value === "All Universities" ? ALL_TRENDING_PRODUCTS_API_KEY : TRENDING_PRODUCTS_API_KEY);
          
          if (response.data) {
            await setTrendingProducts(response.data.data); 
          }
        } catch (error) {
          if (error.response && error.response.status === 404) {
            localStorage.removeItem('trendingproducts');
          } else {
            console.error('Error fetching trending products:', error);
          }
        }
      };
  
      fetchTrendingProducts();
    }, [universities.value]);
  
    
  
  
    return (
      <div>
        <section className='container product-listings max-lg:hidden'>
            <Trendingproductscards openLoginError={openLoginError} closeLoginError={closeLoginError} openLoginModal={openLoginModal} trendingProducts={trendingProducts}/>
        </section>
        <section className='product-listings flex-col justify-start items-center hidden max-lg:block'>
          <div className='w-[100%] justify-center max-lg:flex-col'>
            <Mobiletrendingproductscards openLoginError={openLoginError} closeLoginError={closeLoginError} openLoginModal={openLoginModal} trendingProducts={trendingProducts}/>
          </div>
        </section>
      {loginModal &&  <div className='w-[25%] max-lg:w-[60%] rounded-md flex justify-center ' style={{position:'fixed', top:'10%', left:'0', zIndex:'4000',}}> <Loginmodal closeModal={closeLoginModal} closeLoginSuccessModal={closeLoginSuccessModal} openLoginSuccessModal={openLoginSuccessModal}/></div>}
  {loginSuccessModal &&  <div className=' rounded-md flex justify-center ' style={{position:'fixed', top:'10%', left:'0', zIndex:'4000',}}> <Signedinmodal /></div>}
    {loginError &&  <div className='container rounded-md flex justify-center ' style={{position:'fixed', top:'0', right:'20', zIndex:'4000'}}> <Tokenerrormodal /></div>}
      </div>
    );
  };
export const Latestproducts = () => {
    const navigate = useNavigate();
    const [loginModal, setLoginModal] = useState(false);
    const [loginSuccessModal, setLoginSuccessModal] = useState(false);
    const [loginError, setLoginError] = useState(false);
    let universities = JSON.parse(localStorage.getItem("universities"));
  
    if (!universities) {
      universities = {
        label: "All Universities",
        value: "All Universities",
       };
      localStorage.setItem("universities", JSON.stringify(universities));
    }
  
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
  const trending= JSON.parse(localStorage.getItem("latestproductscard"))
    useEffect(() => {
      const fetchLatestProducts = async () => {
        try {
          const LATEST_PRODUCTS_API_KEY = `https://campusbuy-backend-nkmx.onrender.com/getlatestproducts?university=${universities.value}`;
          const ALL_LATEST_PRODUCTS_API_KEY = 'https://campusbuy-backend-nkmx.onrender.com/getpremiumlatestproducts';
      
          const response = await axios.get(universities.value === "All Universities" ? ALL_LATEST_PRODUCTS_API_KEY : LATEST_PRODUCTS_API_KEY);
          
          if (response.data) {
            localStorage.setItem('latestproductscard', JSON.stringify(response.data.data));
          }
        } catch (error) {
          if (error.response && error.response.status === 404) {
            localStorage.removeItem('latestproductscard');
          } else {
            console.error('Error fetching latest products:', error);
          }
        }
      };
  
      fetchLatestProducts();
    }, [universities.value]);
  
    
  
  
    return (
      <div>
        <section className='container product-listings max-lg:hidden'>
            <Latestproductscards openLoginError={openLoginError} closeLoginError={closeLoginError} openLoginModal={openLoginModal} />
        </section>
        <section className='product-listings flex-col justify-start items-center hidden max-lg:block'>
          <div className='w-[100%] justify-center max-lg:flex-col'>
            <Mobilelatestproductscards openLoginError={openLoginError} closeLoginError={closeLoginError} openLoginModal={openLoginModal} />
          </div>
        </section>
      {loginModal &&  <div className='w-[25%] max-lg:w-[60%] rounded-md flex justify-center ' style={{position:'fixed', top:'10%', left:'0', zIndex:'4000',}}> <Loginmodal closeModal={closeLoginModal} closeLoginSuccessModal={closeLoginSuccessModal} openLoginSuccessModal={openLoginSuccessModal}/></div>}
  {loginSuccessModal &&  <div className=' rounded-md flex justify-center ' style={{position:'fixed', top:'10%', left:'0', zIndex:'4000',}}> <Signedinmodal /></div>}
    {loginError &&  <div className='container rounded-md flex justify-center ' style={{position:'fixed', top:'0', right:'20', zIndex:'4000'}}> <Tokenerrormodal /></div>}
      </div>
    );
  };

export const Sellerproducts = () => {
    const navigate = useNavigate();
    const [loginModal, setLoginModal] = useState(false);
    const [loginSuccessModal, setLoginSuccessModal] = useState(false);
    const [loginError, setLoginError] = useState(false);
    let universities = JSON.parse(localStorage.getItem("universities"));
  
    if (!universities) {
      universities = {
        label: "All Universities",
        value: "All Universities",
       };
      localStorage.setItem("universities", JSON.stringify(universities));
    }
  
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

    
  
    
  
  
    return (
      <div>
        <section className='product-listings max-lg:hidden'>
            <Sellerproductcard closeLoginError={closeLoginError} openLoginModal={openLoginModal}/>
        </section>
        <section className='product-listings flex-col justify-start items-center hidden max-lg:flex'>
          <div className='w-[100%] justify-center max-lg:flex-col'>
          <Sellerproductcard closeLoginError={closeLoginError} openLoginModal={openLoginModal}/>
          </div>
        </section>
      {loginModal &&  <div className='w-[25%] max-lg:w-[60%] rounded-md flex justify-center ' style={{position:'fixed', top:'10%', left:'0', zIndex:'4000',}}> <Loginmodal closeModal={closeLoginModal} closeLoginSuccessModal={closeLoginSuccessModal} openLoginSuccessModal={openLoginSuccessModal}/></div>}
  {loginSuccessModal &&  <div className=' rounded-md flex justify-center ' style={{position:'fixed', top:'10%', left:'0', zIndex:'4000',}}> <Signedinmodal /></div>}
    {loginError &&  <div className='container rounded-md flex justify-center ' style={{position:'fixed', top:'0', right:'20', zIndex:'4000'}}> <Tokenerrormodal /></div>}
      </div>
    );
  };

  
export const Otherproducts = () => {
    const navigate = useNavigate();
    const [loginModal, setLoginModal] = useState(false);
    const [loginSuccessModal, setLoginSuccessModal] = useState(false);
    const [loginError, setLoginError] = useState(false);
  
    let universities = JSON.parse(localStorage.getItem("universities"));
  
    if (!universities) {
      universities = {
        label: "All Universities",
        value: "All Universities",
       };
      localStorage.setItem("universities", JSON.stringify(universities));
    }
  
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

   
    
  
  
    return (
      <div>
        <section className='product-listings max-lg:hidden'>
            <Otherproductcard closeLoginError={closeLoginError} openLoginModal={openLoginModal}/>
        </section>
        <section className='product-listings flex-col justify-start items-center hidden max-lg:flex'>
          <div className='w-[100%] justify-center max-lg:flex-col'>
            <Mobiletrendingproductscards openLoginError={openLoginError} closeLoginError={closeLoginError} openLoginModal={openLoginModal} />
          </div>
        </section>
      {loginModal &&  <div className='w-[25%] max-lg:w-[60%] rounded-md flex justify-center ' style={{position:'fixed', top:'10%', left:'0', zIndex:'4000',}}> <Loginmodal closeModal={closeLoginModal} closeLoginSuccessModal={closeLoginSuccessModal} openLoginSuccessModal={openLoginSuccessModal}/></div>}
  {loginSuccessModal &&  <div className=' rounded-md flex justify-center ' style={{position:'fixed', top:'10%', left:'0', zIndex:'4000',}}> <Signedinmodal /></div>}
    {loginError &&  <div className='container rounded-md flex justify-center ' style={{position:'fixed', top:'0', right:'20', zIndex:'4000'}}> <Tokenerrormodal /></div>}
      </div>
    );
  };
  
