import React, { useState, useEffect } from 'react';
import { Yourproductscards, Yourproductsmobilecards } from '../../Components/Productcards';
import { IoChevronBack, IoChevronForwardOutline } from 'react-icons/io5';

const Yourproducts = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [slicedProducts, setSlicedProducts] = useState([]);
  const [activeButtonIndex, setActiveButtonIndex] = useState('1');
  const [noProducts, setNoProducts] = useState(false);
  const yourProductCard = JSON.parse(localStorage.getItem('yourproductscard')) || [];

  const activeStyle = {
    backgroundColor: '#FEBD69',
    border: "1px solid black",
    fontWeight: "bold",
    borderRadius: "8px",
    padding: "10px 15px",
    color: "black",
  };
  const inactiveStyle = {
    fontWeight: "bold",
    color: "#646161",
  };

  useEffect(() => {
    handleCategories('1', 1);
  }, []);

  const searchPage = (e) => {
    e.preventDefault();
    const page = e.target.elements.pageInput.value;
    handleCategories(page, parseInt(page, 10));
  };

  const handleCategories = (index, num) => {
    const start = (num - 1) * 15;
    const end = start + 15;
    setActiveButtonIndex(index);
    setPageNumber(num);

    if (start >= yourProductCard.length) {
      setNoProducts(true);
      setSlicedProducts([]);
    } else {
      setNoProducts(false);
      setSlicedProducts(yourProductCard.slice(start, end));
    }
  };

  return (
    <div>
      <div className='max-lg:hidden w-full'>
        <div className='text-2xl font-bold my-4'>
          <h1>Your Products</h1>
        </div>
        <div className='flex flex-wrap justify-between items-center w-full'>
          <Yourproductscards products={slicedProducts} />
          <div className='flex justify-end items-center gap-4 m-4'>
            <button onClick={() => handleCategories(activeButtonIndex - 1, activeButtonIndex - 1)}>
              <IoChevronBack className='categories-react-icons-arrow' />
            </button>
            {[...Array(9).keys()].map(num => (
              <button
                key={num + 1}
                onClick={() => handleCategories((num + 1).toString(), num + 1)}
                style={activeButtonIndex === (num + 1).toString() ? activeStyle : inactiveStyle}
              >
                {num + 1}
              </button>
            ))}
            <button onClick={() => handleCategories(activeButtonIndex + 1, activeButtonIndex + 1)}>
              <IoChevronForwardOutline className='categories-react-icons-arrow' />
            </button>
          </div>
          <form onSubmit={searchPage} className='flex items-center gap-4'>
            <p className='text-xs text-[#FEBD69]'>Go to page</p>
            <input name="pageInput" className='p-2 rounded-md w-[12%]' type='number' min="1" max="9" />
            <button className='bg-white p-2 rounded-md'>Go</button>
          </form>
        </div>
      </div>

      <div className='hidden max-lg:block'>
        <div className='text-2xl font-bold my-4'>
          <h1>Your Products</h1>
        </div>
        <div className='flex flex-wrap justify-between items-center w-full'>
          <Yourproductsmobilecards products={slicedProducts} />
          <div className='flex justify-between items-center gap-2'>
            {[...Array(9).keys()].map(num => (
              <button
                key={num + 1}
                onClick={() => handleCategories((num + 1).toString(), num + 1)}
                style={activeButtonIndex === (num + 1).toString() ? activeStyle : inactiveStyle}
              >
                {num + 1}
              </button>
            ))}
            <form onSubmit={searchPage} className='flex items-center gap-1'>
              <p className='text-xs text-[#FEBD69]'>Go to page</p>
              <input name="pageInput" className='px-2 py-1 rounded-md w-[30%]' type='number' min="1" max="9" />
              <button className='bg-white p-1 rounded-md'>Go</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Yourproducts;
