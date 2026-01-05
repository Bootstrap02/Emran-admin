import React, { useState, useEffect } from 'react';
import { Wishlistcards } from '../../Components/Productcards';
import { Wishlistmobilecards } from '../../Components/Productcards';

const Wishlist = () => {
  return (
    <div>
      <div className='max-lg:hidden'>
      <div className='text-2xl text-bold my-4  '>
        <h1>Wishlist</h1>
      </div>
      
      <div className='flex flex-wrap justify-between items-center  w-[100%] '>
        <Wishlistcards/>
      </div>
      </div>

      <div className='hidden max-lg:block'>
      <div className='text-xl text-bold my-2  '>
        <h1>Wishlist</h1>
      </div>
      <div className='flex flex-wrap justify-between items-center  w-[100%]    '>
        <Wishlistmobilecards/>
      </div>
      </div>
    </div>
  );
}

export default Wishlist;
