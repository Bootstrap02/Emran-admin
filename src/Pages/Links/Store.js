import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, } from 'react-router-dom';
import Footer from '../../Components/Footer';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { BlackSecondheader } from '../../Components/Subheaders';
import { Mobilemystorecard, Mystorecard } from '../../Components/Productcards';
// import { Mediumadlink1, Mediumadlink2, Mediumadlink3 } from '../../Modals/Adslinks.js';



const Store = () => {
const {id} = useParams();
const navigate= useNavigate();
const [storeOwner, setStoreOwner]= useState();
const GET_STORE_API_KEY= "https://campusbuy-backend-nkmx.onrender.com/getmystore";
    useEffect(()=>{
        const Getstore= async ()=>{
        try{
            const response= await axios.get(`${GET_STORE_API_KEY}/${id}`)
            await localStorage.setItem('yourproductscard', JSON.stringify(response.data.products));
            setStoreOwner(response.data)
        }catch (error){
            alert('error getting this store')
            setTimeout(()=>{
            navigate('/')
            }, 4000)
        }
        }
        Getstore();
    },[])
  
    

  if(storeOwner){
  return (
    <div className='w-[100%]'>
      <div className='mb-[8rem] max-lg:mb-[4rem]'><BlackSecondheader /></div>
      <div className='max-lg:hidden  w-[100%]'>
      <div className=' m-4  trending-products flex items-center justify-start gap-[4rem] '>
        <strong className='text-2xl '>Welcome to {storeOwner.firstname} {storeOwner.lastname}'s Campusify Store</strong>
      </div>
      <div className='text-2xl text-bold my-4 text-center '>
        {/* <strong>All Products in {storedUserData.firstname}'s Store</strong> */}
      </div>
      
      <div className='flex flex-wrap justify-between items-center w-[100%]'>
        <Mystorecard  />
      </div>
      </div>
      <div className='hidden max-lg:block  w-[100%]'>
      <div className=' m-2  trending-products flex items-center justify-start gap-[2rem] '>
        <strong className='text-xl '>Welcome to {storeOwner.firstname} {storeOwner.lastname}'s Campusify Store</strong>
      </div>
      <div className='text-xl text-bold my-2 text-center '>
        {/* <strong>All Products in {storedUserData.firstname}'s Store</strong> */}
      </div>
      
      <div className='flex flex-wrap justify-between items-center w-[100%]'>
        <Mobilemystorecard  />
      </div>
      </div>
      <div>
        </div>
       
      <div className=''><Footer /></div>
    </div>
  );
  }else{
  return(
    <h1 className='text-center '>No Products in store</h1>
  )
  }
  
};

export default Store;