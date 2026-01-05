import React, { useState, useEffect } from 'react';
import { Mystorecard } from '../../Components/Productcards';
import { Mobilemystorecard } from '../../Components/Productcards';
import { ButtonLoader } from '../../Modals/Loaders';

const Mystore = () => {
  const [link, setLink] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showModalorAds, setShowModalOrAds] = useState(true);

  const storedUserData = JSON.parse(localStorage.getItem('userData')); 

  useEffect(() => {
    setLink(`https://campusify.net/store/${storedUserData.id? storedUserData.id : storedUserData._id}`);
  }, [storedUserData._id]);

  const handleStoreLink = () => {
    navigator.clipboard.writeText(link).then(() => {
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
      }, 2000); // Hide modal after 4 seconds
    }).catch((err) => {
      console.error('Failed to copy: ', err);
    });
  };
  const openAds = () => {
    // Open the external ad link in a new tab using window.open()
    setShowModalOrAds(false)
    window.open('https://psolsumoo.net/4/8022756', '_blank');
  };
  const backgroundImageStyle = {
    backgroundImage: `url('https://res.cloudinary.com/dtthdh8tb/image/upload/v1728298881/IMG-20240227-WA0015_wdparn.jpg')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    minHeight: "8rem",
    color: "white",
  };
  

  return (
    <div>
      
      <div className='max-lg:hidden w-[100%]'>
        <div className=' trending-products flex items-center justify-start gap-[4rem]'>
          <button onClick={handleStoreLink} className='p-2 border-2 border-black bg-[#FDD700] rounded-lg text-sm text-black'>{showModal ? (<div><ButtonLoader /></div>) : ('Store Link')}</button>
          <strong className='text-2xl'>Seller's Store</strong>
        </div>
        <div className='text-2xl text-bold my-4 text-center'>
          <strong>All Products in {storedUserData.firstname}'s Store</strong>
        </div>
        
        <div className='flex flex-wrap justify-between items-center w-[100%]'>
          <Mystorecard />
        </div>
      </div>
      
      <div className='hidden max-lg:block container'>
        <div style={backgroundImageStyle} className='text-2xl text-bold my-4 text-center trending-products'>
          <strong>Seller's Store</strong>
        </div>
        <div className='text-2xl text-bold my-4 text-center'>
          <strong>All Products in {storedUserData.firstname}'s Store</strong>
        </div>
        
        <div className='flex flex-wrap justify-between items-center w-[100%]'>
          <Mobilemystorecard />
        </div>
      </div>
    </div>
  );
}

export default Mystore;
