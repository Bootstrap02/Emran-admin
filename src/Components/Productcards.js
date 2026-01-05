import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaHeart } from "react-icons/fa";
import { TbCurrencyNaira } from 'react-icons/tb';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Avatarsample from '../assets/Avatarsample.jpg';
import Productsample from '../assets/Productsample.png';
import unreadIMG from '../assets/unreadIMG.png';
import readIMG from '../assets/readIMG.png';
import { BigLoader, ButtonLoader } from '../Modals/Loaders';


const truncateDescription = (description, wordLimit) => {
  const words = description.split(' ');
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
  }
  return description;
};

export const Trendingproductscards = ({ openLoginError, closeLoginError, openLoginModal, trendingProducts }) => {
  const navigate = useNavigate();
  const [buttonloading, setButtonloading] = useState('');
  const accessedToken = JSON.parse(localStorage.getItem('userData'));

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const axiosInstance = axios.create({
    baseURL: 'https://campusbuy-backend-nkmx.onrender.com',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (accessedToken && accessedToken.accessToken) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessedToken.accessToken}`;
  }



  if (!trendingProducts) {
    return null;
  }

  return (
    <div className="slider-wrapper">
      <Slider {...settings} className='w-[100%]'>
        {trendingProducts.map((Product) => {
          const truncatedDescription = truncateDescription(Product.description, 15);

          const moveForward = async () => {
            await localStorage.setItem('product', JSON.stringify(Product._id));
            await localStorage.setItem('fullproduct', JSON.stringify(Product));
            await navigate(`/trendingproductpage/${Product.slug}/${Product._id}`);
            window.location.reload(); // Reload if no search value
          };

          const addWishlist = async (id) => {
            const accessedToken = JSON.parse(localStorage.getItem('userData'));
            const WISHLIST_API_KEY = 'https://campusbuy-backend-nkmx.onrender.com/addwishlist';
            if (!accessedToken) {
              setButtonloading(false)
              openLoginError();
              setTimeout(() => {
                closeLoginError();
                openLoginModal();
              }, 3000)
            } else {
              setButtonloading(id);

              try {
                const formData = new FormData();
                formData.append('productId', Product._id);
                const response = await axiosInstance.put(WISHLIST_API_KEY, formData);
                setButtonloading(false)
                alert('Added to wishlist!');
              } catch (error) {
                if (error.response.status === 403) {
                  setButtonloading(false)
                  openLoginError();
                  setTimeout(() => {
                    closeLoginError();
                    openLoginModal();
                  }, 3000)
                }
                console.error('Error adding to wishlist:', error);
              }
            }
          };

          return (
            <div className='product-card flex m-3 w-[25%] border-2 border-[#FFD700]' key={Product._id}>
              <div className='card p-2 justify-center items-center bg-[#222121]'>
                <div onClick={moveForward}>
                  <img src={Product.images[0]? Product.images[0] : Productsample} className='card-img-top' alt='...' width={80} />
                  <div className=' text-sm text-white bg-[#222121]'>
                    <div className='flex my-1 justify-between items-center'>
                      {Product.title ? (
                        <div className='product-price d-flex gap-1 align-items-center justify-center'>
                          <TbCurrencyNaira className='naira' />
                          <h3 className='card-price-text text-lg'>{Product.price}</h3>
                        </div>
                      ) : null}
                      <strong className='card-condition-text'>{Product.condition}</strong>
                    </div>
                    <h5 className='card-title m-2'>
                      <strong>{Product.title || Product.name}</strong>
                    </h5>
                    <h6 className='text-[#cfcfc7] m-2'>{truncatedDescription}</h6>

                    <strong className='text-[#cfcfc7]'>{Product.location || Product.coverage}</strong>

                    {Product.title ? (
                      <div className='flex my-1 justify-between items-center text-sm'>
                        <p className='card-brand'>
                          <strong>{Product.brand}</strong>
                        </p>
                      </div>
                    ) : (
                      <div className='flex my-1 justify-between items-center text-sm'>
                        <div className='text-[8px] flex flex-col gap-1'>
                          {Product.price1} {Product.service1}
                        </div>
                        <div className='text-[8px] flex flex-col gap-1'>
                          {Product.price2} {Product.service2}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <NavLink onClick={addWishlist} className='btn btn-secondary text-[10px] flex gap-1'>
                  <p>{buttonloading === Product._id ? <BigLoader /> : 'Add to Wishlist'}</p>
                  <FaHeart className='wishlist-react-icons' />
                </NavLink>
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
};


export const Mobiletrendingproductscards = ({ openLoginError, closeLoginError, openLoginModal, trendingProducts }) => {
  const navigate = useNavigate();
  const [buttonloading, setButtonloading] = useState('');
  const accessedToken = JSON.parse(localStorage.getItem('userData'));

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const axiosInstance = axios.create({
    baseURL: 'https://campusbuy-backend-nkmx.onrender.com',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (accessedToken && accessedToken.accessToken) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessedToken.accessToken}`;
  }



  if (!trendingProducts) {
    return null;
  }
 
  return (
    <div className="slider-wrapper">
      <Slider {...settings} className='w-[100%]'>
        {trendingProducts.map((Product) => {
          const truncatedDescription = truncateDescription(Product.description, 15);

          const moveForward = async () => {
            await console.log(Product)
            await localStorage.setItem('product', JSON.stringify(Product._id));
            await localStorage.setItem('fullproduct', JSON.stringify(Product));
            await navigate(`/trendingproductpage/${Product.slug}/${Product._id}`);
            window.location.reload(); // Reload if no search value
          };

          const addWishlist = async (id) => {
            const accessedToken = JSON.parse(localStorage.getItem('userData'));
            const WISHLIST_API_KEY = 'https://campusbuy-backend-nkmx.onrender.com/addwishlist';
            if (!accessedToken) {
              setButtonloading(false)
              openLoginError();
              setTimeout(() => {
                closeLoginError();
                openLoginModal();
              }, 3000)
            } else {
              setButtonloading(id);

              try {
                const formData = new FormData();
                formData.append('productId', Product._id);
                const response = await axiosInstance.put(WISHLIST_API_KEY, formData);
                setButtonloading(false)
                alert('Added to wishlist!');
              } catch (error) {
                if (error.response.status === 403) {
                  setButtonloading(false)
                  openLoginError();
                  setTimeout(() => {
                    closeLoginError();
                    openLoginModal();
                  }, 3000)
                }
                console.error('Error adding to wishlist:', error);
              }
            }
          };
         
          return (
            <div className='product-card flex m-2 w-[45%] border border-[#FFD700]' key={Product._id}>
              <div className='card p-2 justify-center items-center bg-[#222121]'>
                <div onClick={moveForward} className='card  bg-[#222121] '>
                  <img src={Product.images[0]? Product.images[0] : Productsample} className='card-img-top' alt='...' width={14} />
                  <div className=' w-[100%] text-[9px] text-white bg-[#222121]'>
                    <div className='flex my-1 justify-between'>
                      <div className='product-price flex gap-1 align-items-center w-full'>
                        <TbCurrencyNaira className='mobile-naira' />
                        <h3 className='card-price-text '>{Product.price}</h3>
                      </div>
                      <strong className='card-condition-text'>{Product.condition}</strong>
                    </div>
                    <h5 className='card-title'>
                      <strong>{Product.title || Product.name}</strong>
                    </h5>
                    <div className='flex my-1 justify-between text-[#cfcfc7]'>
                      <strong className='card-brand '>{Product.location || Product.coverage}</strong>
                      <strong>{Product.person || Product.status}</strong>
                    </div>
                    <div className='flex my-1 justify-between items-center '>
                    </div>
                  </div>
                </div>
                <NavLink onClick={addWishlist} className='btn btn-secondary text-[10px] flex gap-1'>
                  <p>{buttonloading === Product._id ? <BigLoader /> : 'Add to Wishlist'}</p>
                  <FaHeart className='wishlist-react-icons' />
                </NavLink>
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
};
export const Latestproductscards = ({ openLoginError, closeLoginError, openLoginModal }) => {
  const navigate = useNavigate();
  const [buttonloading, setButtonloading] = useState('');
  const accessedToken = JSON.parse(localStorage.getItem('userData'));

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const axiosInstance = axios.create({
    baseURL: 'https://campusbuy-backend-nkmx.onrender.com',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (accessedToken && accessedToken.accessToken) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessedToken.accessToken}`;
  }

  const trendingProducts = JSON.parse(localStorage.getItem('latestproductscard'));

  if (!trendingProducts) {
    return null;
  }

  return (
    <div className="slider-wrapper">
      <Slider {...settings} className='w-[100%]'>
        {trendingProducts.map((Product) => {
          const truncatedDescription = truncateDescription(Product.description, 15);

          const moveForward = async () => {
            await localStorage.setItem('product', JSON.stringify(Product._id));
            await localStorage.setItem('fullproduct', JSON.stringify(Product));
            await navigate(`/trendingproductpage/${Product.slug}/${Product._id}`);
          };

          const addWishlist = async (id) => {
            const accessedToken = JSON.parse(localStorage.getItem('userData'));
            const WISHLIST_API_KEY = 'https://campusbuy-backend-nkmx.onrender.com/addwishlist';
            if (!accessedToken) {
              setButtonloading(false)
              openLoginError();
              setTimeout(() => {
                closeLoginError();
                openLoginModal();
              }, 3000)
            } else {
              setButtonloading(id);

              try {
                const formData = new FormData();
                formData.append('productId', Product._id);
                const response = await axiosInstance.put(WISHLIST_API_KEY, formData);
                setButtonloading(false)
                alert('Added to wishlist!');
              } catch (error) {
                if (error.response.status === 403) {
                  setButtonloading(false)
                  openLoginError();
                  setTimeout(() => {
                    closeLoginError();
                    openLoginModal();
                  }, 3000)
                }
                console.error('Error adding to wishlist:', error);
              }
            }
          };

          return (
            <div className='product-card flex m-3 w-[25%] border-2 border-[#FFD700]' key={Product._id}>
              <div className='card p-2 justify-center items-center bg-[#222121]'>
                <div onClick={moveForward}>
                  <img src={Product.images[0]? Product.images[0] : Productsample} className='card-img-top' alt='...' width={80} />
                  <div className=' text-sm text-white bg-[#222121]'>
                    <div className='flex my-1 justify-between items-center'>
                      {Product.title ? (
                        <div className='product-price d-flex gap-1 align-items-center justify-center'>
                          <TbCurrencyNaira className='naira' />
                          <h3 className='card-price-text text-lg'>{Product.price}</h3>
                        </div>
                      ) : null}
                      <strong className='card-condition-text'>{Product.condition}</strong>
                    </div>
                    <h5 className='card-title m-2'>
                      <strong>{Product.title || Product.name}</strong>
                    </h5>
                    <h6 className='text-[#cfcfc7] m-2'>{truncatedDescription}</h6>

                    <strong className='text-[#cfcfc7]'>{Product.location || Product.coverage}</strong>

                    {Product.title ? (
                      <div className='flex my-1 justify-between items-center text-sm'>
                        <p className='card-brand'>
                          <strong>{Product.brand}</strong>
                        </p>
                      </div>
                    ) : (
                      <div className='flex my-1 justify-between items-center text-sm'>
                        <div className='text-[8px] flex flex-col gap-1'>
                          {Product.price1} {Product.service1}
                        </div>
                        <div className='text-[8px] flex flex-col gap-1'>
                          {Product.price2} {Product.service2}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <NavLink onClick={addWishlist} className='btn btn-secondary text-[10px] flex gap-1'>
                  <p>{buttonloading === Product._id ? <BigLoader /> : 'Add to Wishlist'}</p>
                  <FaHeart className='wishlist-react-icons' />
                </NavLink>
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
};


export const Mobilelatestproductscards = ({ openLoginError, closeLoginError, openLoginModal }) => {
  const navigate = useNavigate();
  const [buttonloading, setButtonloading] = useState('');
  const accessedToken = JSON.parse(localStorage.getItem('userData'));

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const axiosInstance = axios.create({
    baseURL: 'https://campusbuy-backend-nkmx.onrender.com',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (accessedToken && accessedToken.accessToken) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessedToken.accessToken}`;
  }

  const trendingProducts = JSON.parse(localStorage.getItem('latestproductscard'));

  if (!trendingProducts) {
    return null;
  }

  return (
    <div className="slider-wrapper">
      <Slider {...settings} className='w-[100%]'>
        {trendingProducts.map((Product) => {

          const moveForward = async () => {
            await localStorage.setItem('product', JSON.stringify(Product._id));
            await localStorage.setItem('fullproduct', JSON.stringify(Product));
            await navigate(`/trendingproductpage/${Product.slug}/${Product._id}`);
          };

          const addWishlist = async (id) => {
            const accessedToken = JSON.parse(localStorage.getItem('userData'));
            const WISHLIST_API_KEY = 'https://campusbuy-backend-nkmx.onrender.com/addwishlist';
            if (!accessedToken) {
              setButtonloading(false)
              openLoginError();
              setTimeout(() => {
                closeLoginError();
                openLoginModal();
              }, 3000)
            } else {
              setButtonloading(id);

              try {
                const formData = new FormData();
                formData.append('productId', Product._id);
                const response = await axiosInstance.put(WISHLIST_API_KEY, formData);
                setButtonloading(false)
                alert('Added to wishlist!');
              } catch (error) {
                if (error.response.status === 403) {
                  setButtonloading(false)
                  openLoginError();
                  setTimeout(() => {
                    closeLoginError();
                    openLoginModal();
                  }, 3000)
                }
                console.error('Error adding to wishlist:', error);
              }
            }
          };
    
          return (
            <div className='product-card flex m-2 w-[45%] border border-[#FFD700]' key={Product._id}>
              <div className='card p-2 justify-center items-center bg-[#222121]'>
                <div onClick={moveForward} className='card  bg-[#222121] '>
                  <img src={Product.images[0]? Product.images[0] : Productsample} className='card-img-top' alt='...' width={14} />
                  <div className=' w-[100%] text-[9px] text-white bg-[#222121]'>
                    <div className='flex my-1 justify-between'>
                      <div className='product-price flex gap-1 align-items-center w-full'>
                        <TbCurrencyNaira className='mobile-naira' />
                        <h3 className='card-price-text '>{Product.price}</h3>
                      </div>
                      <strong className='card-condition-text'>{Product.condition}</strong>
                    </div>
                    <h5 className='card-title'>
                      <strong>{Product.title || Product.name}</strong>
                    </h5>
                    <div className='flex my-1 justify-between text-[#cfcfc7]'>
                      <strong className='card-brand '>{Product.location || Product.coverage}</strong>
                      <strong>{Product.person || Product.status}</strong>
                    </div>
                    <div className='flex my-1 justify-between items-center '>
                    </div>
                  </div>
                </div>
                <NavLink onClick={addWishlist} className='btn btn-secondary text-[10px] flex gap-1'>
                  <p>{buttonloading === Product._id ? <BigLoader /> : 'Add to Wishlist'}</p>
                  <FaHeart className='wishlist-react-icons' />
                </NavLink>
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export const Productcard = ({ slicedProducts, openLoginError, closeLoginError, openLoginModal }) => {

  const navigate = useNavigate();
  const [buttonloading, setButtonloading] = useState('');
  const accessedToken = JSON.parse(localStorage.getItem('userData'));

  const axiosInstance = axios.create({
    baseURL: 'https://campusbuy-backend-nkmx.onrender.com', // Replace with your API base URL
    headers: {
      'Content-Type': 'application/json',
      // Other default headers can be added here
    },
  });

  // Function to set JWT token in the headers
  const setAuthToken = (token) => {
    if (token) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axiosInstance.defaults.headers.common['Authorization'];
    }
  };

  // Use this function to set the token when the user logs in or the token is available
  if (accessedToken && accessedToken.accessToken) {
    setAuthToken(accessedToken.accessToken);
  }


  // Now, you can use axiosInstance for your requests with the token included in the headers




  const Productcard = slicedProducts ? (
    slicedProducts.map((Product) => {
      const truncatedDescription = truncateDescription(Product.description, 15);

      const moveForward = async () => {
        await localStorage.setItem('product', JSON.stringify(Product._id));
        await localStorage.setItem('mainproduct', JSON.stringify(Product));
        await navigate(`/productpage/${Product.slug}/${Product._id}`);
      };


      const addWishlist = async (id) => {
        const accessedToken = JSON.parse(localStorage.getItem('userData'));
        const WISHLIST_API_KEY = 'https://campusbuy-backend-nkmx.onrender.com/addwishlist';
        if (!accessedToken) {
          setButtonloading(false)
          openLoginError();
          setTimeout(() => {
            closeLoginError();
            openLoginModal();
          }, 3000)
        } else {
          setButtonloading(id);

          try {
            const formData = new FormData();
            formData.append('productId', Product._id);
            const response = await axiosInstance.put(WISHLIST_API_KEY, formData);
            setButtonloading(false)
            alert('Added to wishlist!');
          } catch (error) {
            if (error.response.status === 403) {
              setButtonloading(false)
              openLoginError();
              setTimeout(() => {
                closeLoginError();
                openLoginModal();
              }, 3000)
            }
            console.error('Error adding to wishlist:', error);
          }
        }
      };

      return (
        <div className='product-card  flex m-3 w-[25%]  border-2 border-[#FFD700] ' key={Product._id}>
          <div className='card p-2 justify-center items-center bg-[#222121] '>
            <div onClick={moveForward}>
              <img src={Product.images[0]? Product.images[0] : Productsample} className='card-img-top' alt='...' width={80} />
              <div className=' text-sm text-white bg-[#222121]'>
                <div className='flex my-1 justify-between items-center'>
                  {Product.title ? (
                    <div className='product-price d-flex gap-1 align-items-center justify-center'>
                      <TbCurrencyNaira className='naira' />
                      <h3 className='card-price-text text-lg'>{Product.price}</h3>
                    </div>
                  ) : null}
                  <strong className='card-condition-text'>{Product.condition}</strong>
                </div>
                <h5 className='card-title m-2'>
                  <strong>{Product.title || Product.name}</strong>
                </h5>
                <h6 className='text-[#cfcfc7] m-2'>{truncatedDescription}</h6>

                <strong className='text-[#cfcfc7]'>{Product.location || Product.coverage}</strong>

                {Product.title ? (
                  <div className='flex my-1 justify-between items-center text-sm'>
                    <p className='card-brand'>
                      <strong>{Product.brand}</strong>
                    </p>
                  </div>
                ) : (
                  <div className='flex my-1 justify-between items-center text-sm'>
                    <div className='text-[8px] flex flex-col gap-1'>
                      {Product.price1} {Product.service1}
                    </div>
                    <div className='text-[8px] flex flex-col gap-1'>
                      {Product.price2} {Product.service2}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <NavLink onClick={addWishlist} className='btn btn-secondary text-[10px] flex gap-1'>
              <p>{buttonloading === Product._id ? <BigLoader /> : 'Add to Wishlist'}</p>
              <FaHeart className='wishlist-react-icons' />
            </NavLink>
          </div>
        </div>
      );
    })
  ) : (
    <p>No trending products available.</p>
  );

  return Productcard;
};
export const Mobileproductcard = ({ slicedProducts, openLoginError, closeLoginError, openLoginModal }) => {

  const navigate = useNavigate();
  const [buttonloading, setButtonloading] = useState('');
  const accessedToken = JSON.parse(localStorage.getItem('userData'));

  const axiosInstance = axios.create({
    baseURL: 'https://campusbuy-backend-nkmx.onrender.com', // Replace with your API base URL
    headers: {
      'Content-Type': 'application/json',
      // Other default headers can be added here
    },
  });

  // Function to set JWT token in the headers
  const setAuthToken = (token) => {
    if (token) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axiosInstance.defaults.headers.common['Authorization'];
    }
  };

  // Use this function to set the token when the user logs in or the token is available
  if (accessedToken && accessedToken.accessToken) {
    setAuthToken(accessedToken.accessToken);
  }


  // Now, you can use axiosInstance for your requests with the token included in the headers




  const Productcard = slicedProducts ? (
    slicedProducts.map((Product) => {
      const truncatedDescription = truncateDescription(Product.description, 15);

      const moveForward = async () => {
        await localStorage.setItem('product', JSON.stringify(Product._id));
        await localStorage.setItem('mainproduct', JSON.stringify(Product));
        await navigate(`/productpage/${Product.slug}/${Product._id}`);
      };


      const addWishlist = async (id) => {
        const accessedToken = JSON.parse(localStorage.getItem('userData'));
        const WISHLIST_API_KEY = 'https://campusbuy-backend-nkmx.onrender.com/addwishlist';
        if (!accessedToken) {
          setButtonloading(false)
          openLoginError();
          setTimeout(() => {
            closeLoginError();
            openLoginModal();
          }, 3000)
        } else {
          setButtonloading(id);

          try {
            const formData = new FormData();
            formData.append('productId', Product._id);
            const response = await axiosInstance.put(WISHLIST_API_KEY, formData);
            setButtonloading(false)
            alert('Added to wishlist!');
          } catch (error) {
            if (error.response.status === 403) {
              setButtonloading(false)
              openLoginError();
              setTimeout(() => {
                closeLoginError();
                openLoginModal();
              }, 3000)
            }
            console.error('Error adding to wishlist:', error);
          }
        }
      };

      return (
        <div className='product-card flex m-1 w-[45%] border-2 ' key={Product._id}>
          <div className='card p-2 justify-center items-center bg-[#222121]'>
            <div onClick={moveForward} className='card  bg-[#222121] '>
              <img src={Product.images[0]? Product.images[0] : Productsample} className='card-img-top' alt='...' width={14} />
              <div className=' w-[100%] text-[9px] text-white bg-[#222121]'>
                <div className='flex my-1 justify-between'>
                  <div className='product-price flex gap-1 align-items-center w-full'>
                    <TbCurrencyNaira className='mobile-naira' />
                    <h3 className='card-price-text '>{Product.price}</h3>
                  </div>
                  <strong className='card-condition-text'>{Product.condition}</strong>
                </div>
                <h5 className='card-title'>
                  <strong>{Product.title || Product.name}</strong>
                </h5>
                <div className='flex my-1 justify-between text-[#cfcfc7]'>
                  <strong className='card-brand '>{Product.location || Product.coverage}</strong>
                  <strong>{Product.person || Product.status}</strong>
                </div>
                <div className='flex my-1 justify-between items-center '>
                </div>
              </div>
            </div>
            <NavLink onClick={addWishlist} className='btn btn-secondary text-[10px] flex gap-1'>
              <p>{buttonloading === Product._id ? <BigLoader /> : 'Add to Wishlist'}</p>
              <FaHeart className='wishlist-react-icons' />
            </NavLink>
          </div>
        </div>

      );
    })
  ) : (
    <p>No trending products available.</p>
  );

  return Productcard;
};

export const Wishlistcards = () => {
  const wishlistCard = JSON.parse(localStorage.getItem('wishlistcard'));
  const navigate = useNavigate();
  const [buttonloading, setButtonloading] = useState('');
  const WISHLIST_API_KEY = 'https://campusbuy-backend-nkmx.onrender.com/addwishlist';
  const GET_WISHLIST_API_KEY = "https://campusbuy-backend-nkmx.onrender.com/getwishlist";
  const accessedToken = JSON.parse(localStorage.getItem('userData'));
  const dispatch = useDispatch();
  const sendWishlist = (activePage) => dispatch({ type: 'GET_ACTIVEPAGE', activePage });
  const axiosInstance = axios.create({
    baseURL: 'https://campusbuy-backend-nkmx.onrender.com', // Replace with your API base URL
    headers: {
      'Content-Type': 'application/json',
      // Other default headers can be added here
    },
  });
  const deleteButton = { border: "1px solid #8B0000", borderRadius: "5px" }

  // Function to set JWT token in the headers
  const setAuthToken = (token) => {
    if (token) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axiosInstance.defaults.headers.common['Authorization'];
    }
  };

  // Use this function to set the token when the user logs in or the token is available
  if (accessedToken && accessedToken.accessToken) {
    setAuthToken(accessedToken.accessToken);
  }
  // Now, you can use axiosInstance for your requests with the token included in the headers

  if (wishlistCard && wishlistCard.length > 0) {
    return wishlistCard.map((Product, index) => {
      const truncatedDescription = truncateDescription(Product.description, 25);

      const moveForward = async () => {
        await localStorage.setItem('product', JSON.stringify(Product._id));
        await localStorage.setItem('fullproduct', JSON.stringify(Product));
        await navigate(`/trendingproductpage/${Product.slug}/${Product._id}`);
      };

      const deleteWishlist = async (id) => {
        const accessedToken = JSON.parse(localStorage.getItem('userData'));
        setButtonloading(id)
        if (!accessedToken) {
          setButtonloading('');
          setTimeout(() => {
            navigate('/signin');
          }, 3000);
        } else {
          try {
            const formData = new FormData();
            formData.append('productId', Product._id);


            const response = await axiosInstance.put(WISHLIST_API_KEY, formData);
            setButtonloading('');
            const getWishlist = await axiosInstance.get(GET_WISHLIST_API_KEY)
            await localStorage.setItem("wishlistcard", JSON.stringify(getWishlist.data));
            sendWishlist("Wishlist")
            await navigate((`/mainpage/${accessedToken.id ? accessedToken.id : accessedToken._id}`))

            alert("Removed from wishlist!");

          } catch (error) {
            if (error.response.status === 403) {
              setButtonloading('')
              setTimeout(() => {
                navigate('/signin');
              }, 3000);
            }
            console.error('Error removing to wishlist:', error);
          }
        }
      };
      return (
        <div className='product-card w-[40%] text-sm max-lg:w-[95%] flex justify-center items-center  p-1 max-lg:m-0 max-lg:p-0' key={Product._id}>
          <div className='w-[50%]' onClick={moveForward}>
            <img src={Product.images[0]? Product.images[0] : Productsample} className="card-img-top" alt="image" />
          </div>
          <div className="card-body">
            <h5 className="card-title"><strong>{Product.title || Product.name}</strong></h5>
            <div className='product-price d-flex gap-1 text-[#FEBD69]'>
              <TbCurrencyNaira className='wishlist-naira' />
              <h3 className="card-price-text text-sm">{Product.price}</h3>
            </div>
            <p className="card-location"><strong>Location:</strong> {Product.location || Product.coverage}</p>
            <p className="card-brand"><strong>{Product.brand ? "Brand:" : "Category:"}</strong> {Product.brand || Product.category}</p>
            <div className='flex justify-between items-center'>
              <button onClick={moveForward} className="text-[8px] bg-[#FEBD69] rounded-md p-1 "><strong>View Product</strong></button>
              <button onClick={() => { deleteWishlist(Product._id) }} className="text-[8px] p-1 mx-2" style={deleteButton}><strong>{buttonloading === Product._id ? (<div><BigLoader /></div>) : ('Delete Product')}
              </strong></button>
            </div>
          </div>
        </div>

      );
    });


  } else {
    return (
      <div>No products in wishlist</div>
    )
  }
}

export const Wishlistmobilecards = () => {
  const wishlistCard = JSON.parse(localStorage.getItem('wishlistcard'));
  const navigate = useNavigate();
  const [buttonloading, setButtonloading] = useState('');
  const WISHLIST_API_KEY = 'https://campusbuy-backend-nkmx.onrender.com/addwishlist';
  const GET_WISHLIST_API_KEY = "https://campusbuy-backend-nkmx.onrender.com/getwishlist";
  const accessedToken = JSON.parse(localStorage.getItem('userData'));
  const dispatch = useDispatch();
  const sendWishlist = (activePage) => dispatch({ type: 'GET_ACTIVEPAGE', activePage });
  const axiosInstance = axios.create({
    baseURL: 'https://campusbuy-backend-nkmx.onrender.com', // Replace with your API base URL
    headers: {
      'Content-Type': 'application/json',
      // Other default headers can be added here
    },
  });
  const deleteButton = { border: "1px solid #8B0000", borderRadius: "5px" }

  // Function to set JWT token in the headers
  const setAuthToken = (token) => {
    if (token) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axiosInstance.defaults.headers.common['Authorization'];
    }
  };

  // Use this function to set the token when the user logs in or the token is available
  if (accessedToken && accessedToken.accessToken) {
    setAuthToken(accessedToken.accessToken);
  }
  // Now, you can use axiosInstance for your requests with the token included in the headers

  if (wishlistCard && wishlistCard.length > 0) {
    return wishlistCard.map((Product, index) => {
      const truncatedDescription = truncateDescription(Product.description, 25);

      const moveForward = async () => {
        await localStorage.setItem('product', JSON.stringify(Product._id));
        await localStorage.setItem('fullproduct', JSON.stringify(Product));
        await navigate(`/trendingproductpage/${Product.slug}/${Product._id}`);
      };

      const deleteWishlist = async (id) => {
        const accessedToken = JSON.parse(localStorage.getItem('userData'));
        setButtonloading(id)
        if (!accessedToken) {
          setButtonloading('');
          setTimeout(() => {
            navigate('/signin');
          }, 3000);
        } else {
          try {
            const formData = new FormData();
            formData.append('productId', Product._id);


            const response = await axiosInstance.put(WISHLIST_API_KEY, formData);
            setButtonloading('');
            const getWishlist = await axiosInstance.get(GET_WISHLIST_API_KEY)
            await localStorage.setItem("wishlistcard", JSON.stringify(getWishlist.data));
            sendWishlist("Wishlist")
            await navigate((`/mainpage/${accessedToken.id ? accessedToken.id : accessedToken._id}`))

            alert("Removed from wishlist!");

          } catch (error) {
            if (error.response.status === 403) {
              setButtonloading('')
              setTimeout(() => {
                navigate('/signin');
              }, 3000);
            }
            console.error('Error removing to wishlist:', error);
          }
        }
      };

      return (
        <div className='product-card w-[49%] text-[8px]  flex justify-center  items-center my-1 ' key={Product._id}>
          <div className='w-[50%]' onClick={moveForward}>
            <img src={Product.images[0]? Product.images[0] : Productsample} className="card-img-top" alt="image" />
          </div>
          <div className="card-body ">
            <h5 className="card-title"><strong>{Product.title || Product.name}</strong></h5>
            <div className='product-price d-flex gap-1 text-[#FEBD69]'>
              <TbCurrencyNaira className='wishlist-naira' />
              <h3 className="card-price-text text-sm">{Product.price}</h3>
            </div>
            <p className="card-location"><strong>Location:</strong> {Product.location || Product.coverage}</p>
            <p className="card-condition"><strong>{Product.brand ? "Condition:" : "Availability:"}</strong> {Product.condition || Product.availability}</p>
            <div className='flex justify-between items-center'>
              <button onClick={moveForward} className="text-[8px] bg-[#FEBD69] rounded-md p-1 "><strong>View Product</strong></button>
              <button onClick={() => { deleteWishlist(Product._id) }} className="text-[8px] p-1 mx-2" style={deleteButton}><strong>{buttonloading === Product._id ? (<div><BigLoader /></div>) : ('Delete Product')}
              </strong></button>
            </div>
          </div>
        </div>
      );
    });
  } else {
    return (
      <div>No products in wishlist</div>
    )
  }

};

export const Yourproductscards = ({ products }) => {
  const [showModal, setShowModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState('');
  const [copiedLinkId, setCopiedLinkId] = useState('');
  const [buttonLoading, setButtonLoading] = useState('');
  const accessedToken = JSON.parse(localStorage.getItem('userData'));

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const sendYourProducts = (activePage) => dispatch({ type: 'GET_ACTIVEPAGE', activePage });

  const axiosInstance = axios.create({
    baseURL: 'https://campusbuy-backend-nkmx.onrender.com',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const setAuthToken = (token) => {
    if (token) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axiosInstance.defaults.headers.common['Authorization'];
    }
  };

  if (accessedToken && accessedToken.accessToken) {
    setAuthToken(accessedToken.accessToken);
  }

  const handleCopyLink = (link, ID) => {
    navigator.clipboard.writeText(link).then(() => {
      setCopiedLink(link);
      setCopiedLinkId(ID);
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
      }, 4000); // Hide modal after 4 seconds
    }).catch((err) => {
      console.error('Failed to copy: ', err);
    });
  };

  const truncateDescription = (description, length) => {
    return description.length > length ? description.substring(0, length) + '...' : description;
  };

  if (products && products.length > 0) {
    return products.map((Product) => {
      const truncatedDescription = truncateDescription(Product.description, 15);
      const DELETE_PRODUCT_API_KEY = `https://campusbuy-backend-nkmx.onrender.com/deleteproduct/${Product._id}`;
      const GET_YOURPRODUCTS_API_KEY = "https://campusbuy-backend-nkmx.onrender.com/getyourproduct";

      const moveForward = async () => {
        await localStorage.setItem('editproduct', JSON.stringify(Product));

        await navigate(`/yourproductspage/${Product._id}`);
      };

      const deleteProduct = async (id) => {
        const accessedToken = JSON.parse(localStorage.getItem('userData'));
        setButtonLoading(id);


        if (!accessedToken) {
          setTimeout(() => {
            navigate('/signin');
          }, 3000);
        } else {
          try {
            const response = await axiosInstance.delete(DELETE_PRODUCT_API_KEY);
            setButtonLoading('');
            const getYourProducts = await axiosInstance.get(GET_YOURPRODUCTS_API_KEY);
            setButtonLoading('');
            await localStorage.setItem("yourproductscard", JSON.stringify(getYourProducts.data));
            sendYourProducts('Yourproducts');
            await navigate(`/mainpage/${accessedToken.id ? accessedToken.id : accessedToken._id}`);

            alert("Deleted that Product!");

          } catch (error) {
            console.error('Error deleting your product:', error);
          }
        }
      };

      const productLink = `https://campusify.net/productpage/${Product.slug}/${Product._id}`;

      return (
        <div className='product-card w-[40%] text-sm max-lg:w-[95%] flex justify-center items-center p-1 max-lg:m-0 max-lg:p-0' key={Product._id}>
          <div className='w-[50%]' onClick={moveForward} >
            <img src={Product.images[0]? Product.images[0] : Productsample} className="card-img-top" alt="Product" />
          </div>
          <div className="card-body" >
            <div onClick={moveForward}>
              <h5 className="card-title"><strong>{Product.title || Product.name}</strong></h5>
              <div className='product-price d-flex gap-1 text-[#FEBD69]'>
                <TbCurrencyNaira className='wishlist-naira' />
                <h3 className="card-price-text text-sm">{Product.price || Product.price1}</h3>
              </div>
              <p className="card-location"><strong>Location:</strong> {Product.location || Product.coverage}</p>
              <p className="card-brand"><strong>{Product.brand ? "Brand:" : "Category:"}</strong> {Product.brand || Product.category}</p>
              <p className="card-condition"><strong>{Product.brand ? "Condition:" : "Availability:"}</strong> {Product.condition || Product.availability}</p>
            </div>

            <div className='flex justify-between items-center'>
              <button onClick={() => { deleteProduct(Product._id) }} className="text-[8px] p-1 mx-2" style={{ border: "1px solid #8B0000", borderRadius: "5px" }}><strong>{buttonLoading === Product._id ? (<div><BigLoader /></div>) : ('Delete Product')}</strong></button>
              <button onClick={() => handleCopyLink(productLink, Product._id)} className="text-[8px] bg-[#FEBD69] rounded-md p-1 mx-2"><strong>{showModal && copiedLinkId === Product._id ? (<div><ButtonLoader /></div>) : ('Copy Link')}</strong></button>
            </div>
          </div>
        </div>
      );
    });
  } else {
    return (
      <div>No products available</div>
    );
  }
};


export const Yourproductsmobilecards = ({ products }) => {

  const deleteButton = { border: "1px solid #8B0000", borderRadius: "5px" }

  const [showModal, setShowModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState('');
  const [copiedLinkId, setCopiedLinkId] = useState('');
  const [buttonloading, setButtonLoading] = useState('');
  const accessedToken = JSON.parse(localStorage.getItem('userData'));

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const sendYourProducts = (activePage) => dispatch({ type: 'GET_ACTIVEPAGE', activePage });

  const axiosInstance = axios.create({
    baseURL: 'https://campusbuy-backend-nkmx.onrender.com',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const setAuthToken = (token) => {
    if (token) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axiosInstance.defaults.headers.common['Authorization'];
    }
  };

  if (accessedToken && accessedToken.accessToken) {
    setAuthToken(accessedToken.accessToken);
  }

  const handleCopyLink = (link, ID) => {
    navigator.clipboard.writeText(link).then(() => {
      setCopiedLink(link);
      setCopiedLinkId(ID);
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
      }, 4000); // Hide modal after 4 seconds
    }).catch((err) => {
      console.error('Failed to copy: ', err);
    });
  };

  const truncateDescription = (description, length) => {
    return description.length > length ? description.substring(0, length) + '...' : description;
  };

  if (products && products.length > 0) {
    return products.map((Product) => {
      const truncatedDescription = truncateDescription(Product.description, 15);
      const DELETE_PRODUCT_API_KEY = `https://campusbuy-backend-nkmx.onrender.com/deleteproduct/${Product._id}`;
      const GET_YOURPRODUCTS_API_KEY = "https://campusbuy-backend-nkmx.onrender.com/getyourproduct";

      const moveForward = async () => {
        await localStorage.setItem('editproduct', JSON.stringify(Product));

        await navigate(`/yourproductspage/${Product._id}`);
      };

      const deleteProduct = async (id) => {
        const accessedToken = JSON.parse(localStorage.getItem('userData'));
        setButtonLoading(id);


        if (!accessedToken) {
          setTimeout(() => {
            navigate('/signin');
          }, 3000);
        } else {
          try {
            const response = await axiosInstance.delete(DELETE_PRODUCT_API_KEY);
            setButtonLoading('');
            const getYourProducts = await axiosInstance.get(GET_YOURPRODUCTS_API_KEY);
            setButtonLoading('');
            await localStorage.setItem("yourproductscard", JSON.stringify(getYourProducts.data));
            sendYourProducts('Yourproducts');
            await navigate(`/mainpage/${accessedToken.id ? accessedToken.id : accessedToken._id}`);

            alert("Deleted that Product!");

          } catch (error) {
            console.error('Error deleting your product:', error);
          }
        }
      };

      const productLink = `https://campusify.net/productpage/${Product.slug}/${Product._id}`;



      return (
        <div className='product-card w-[49%] text-[8px]  flex justify-center  items-center my-1 ' key={Product._id}>
          <div className='w-[50%]' onClick={moveForward}>
            <img src={Product.images[0]? Product.images[0] : Productsample} className="card-img-top" alt="image" />
          </div>
          <div className="card-body ">
            <div onClick={moveForward}>
              <h5 className="card-title"><strong>{Product.title || Product.name}</strong></h5>
              <div className='product-price d-flex gap-1 text-[#FEBD69]'>
                <TbCurrencyNaira className='wishlist-naira' />
                <h3 className="card-price-text text-sm">{Product.price}</h3>
              </div>
              <p className="card-location"><strong>Location:</strong> {Product.location || Product.coverage}</p>
              <p className="card-brand"><strong>{Product.brand ? "Brand:" : "Category:"}</strong> {Product.brand || Product.category}</p>
              <p className="card-condition"><strong>{Product.brand ? "Condition:" : "Availability:"}</strong> {Product.condition || Product.availability}</p>
            </div>
            <div className='flex justify-between items-center'>
              <button onClick={() => handleCopyLink(productLink, Product._id)} className="text-[8px] bg-[#FEBD69] rounded-md p-1"><strong>{showModal && copiedLinkId === Product._id ? (<div><ButtonLoader /></div>) : ('Copy Link')}</strong></button>
              <button onClick={() => { deleteProduct(Product._id) }} className="text-[8px] p-1 mx-2" style={deleteButton}><strong>{buttonloading === Product._id ? (<div><BigLoader /></div>) : ('Delete Product')}
              </strong></button>
            </div>
          </div>
        </div>

      );
    });

  } else {
    return (
      <div>No products available</div>
    )
  }
}

export const Conversations = ({ setChatRoom }) => {
  const conversation = JSON.parse(localStorage.getItem('conversationscard'));
  const accessedToken = JSON.parse(localStorage.getItem('userData'));
  const navigate = useNavigate();
  const [buttonloading, setButtonloading] = useState(false);
  const dispatch = useDispatch();
  const sendConversations = (activePage) => dispatch({ type: 'GET_ACTIVEPAGE', activePage });
  const Unread = {
    fontWeight: "bold",
  };
  const avatar = {
    borderRadius: '50%',
    border: "3px solid #5D1523",
    width: "40%",
  };
  const miniAvatar = {
    borderRadius: '50%',
    border: "3px solid #5D1523",
    width: "30%",
  };

  const axiosInstance = axios.create({
    baseURL: 'https://campusbuy-backend-nkmx.onrender.com',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const setAuthToken = (token) => {
    if (token) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axiosInstance.defaults.headers.common['Authorization'];
    }
  };

  if (accessedToken && accessedToken.accessToken) {
    setAuthToken(accessedToken.accessToken);
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const truncateDescription = (description, wordLimit) => {
    const words = description.split(' ');
    return words.length > wordLimit ? words.slice(0, wordLimit).join(' ') + '...' : description;
  };

  if (conversation && conversation.length > 0) {
    let unreadCount = 0;

    const sortedConversations = conversation.sort((a, b) => {
      if (a.unread && !b.unread) {
        return -1;
      } else if (!a.unread && b.unread) {
        return 1;
      } else {
        return 0;
      }
    });


    const conversationElements = sortedConversations.map((conversations) => {
      const chats = conversations.length ? conversations.length - 1 : 0;
      if (conversations.unread && accessedToken.firstname === conversations[chats]?.receiver) {
        unreadCount++;
      }

      const truncatedDescription = truncateDescription(conversations?.conversation[0].message || '', 6);
      const formattedDate = formatDate(conversations?.createdAt || '');
      const DELETE_CONVERSATION_API_KEY = `https://campusbuy-backend-nkmx.onrender.com/deleteconversation/${conversations._id}`;
      const READ_CONVERSATION_API_KEY = `https://campusbuy-backend-nkmx.onrender.com/createreadmessages/${conversations._id}`;
      const GET_CONVERSATIONS_API_KEY = "https://campusbuy-backend-nkmx.onrender.com/getconversations";

      const moveForward = async (conversations) => {
        await setChatRoom(conversations);
        const response = await axiosInstance.put(READ_CONVERSATION_API_KEY);
      };


      const deleteConversation = async () => {
        if (!accessedToken) {
          setTimeout(() => {
            navigate('/signin');
          }, 3000);
        } else {
          try {
            const response = await axiosInstance.delete(DELETE_CONVERSATION_API_KEY);
            const getConversations = await axiosInstance.get(GET_CONVERSATIONS_API_KEY);
            await localStorage.setItem("conversationscard", JSON.stringify(getConversations.data));
            sendConversations('Messages');
            await navigate((`/mainpage/${accessedToken.id ? accessedToken.id : accessedToken._id}`));
            alert("Deleted that Conversation!");

          } catch (error) {
            console.error('Error deleting your conversation:', error);
          }
        }
      };

      return (
        <div key={conversations._id} style={conversations.unread && accessedToken.firstname === conversations[chats]?.receiver ? Unread : null}>
          <div style={{ borderBottom: '1px solid black', marginBottom: '10px' }} onClick={() => { moveForward(conversations) }} className='product-card flex gap-1 max-lg:hidden w-[100%] justify-start items-center'>
            {accessedToken && accessedToken.image && accessedToken.image[0] === conversations.senderImage ? (
              <div className='flex gap-1 justify-center items-center w-[85%]'>
                <img src={conversations.receiverImage ? conversations.receiverImage : Avatarsample} alt="Avatar" style={avatar} />
                <div className='flex flex-col gap-2'>
                  <strong className="text-[12px]">{accessedToken.firstname === conversations?.sender ? conversations?.receiver : conversations?.sender}</strong>
                  <strong className="card-text text-[8px]">{truncatedDescription}</strong>
                </div>
              </div>
            ) : (
              <div className='flex gap-1 justify-center items-center w-[85%]'>
                <img src={conversations.senderImage ? conversations.senderImage : Avatarsample} alt="Avatar" style={avatar} />
                <div className='flex flex-col gap-2'>
                  <strong className="text-[12px]">{accessedToken.firstname === conversations?.sender ? conversations?.receiver : conversations?.sender}</strong>
                  <strong className="card-text text-[8px]">{truncatedDescription}</strong>
                </div>
              </div>
            )}
            <div className='flex flex-col items-center gap-1'>
              <strong className="text-[8px]">{formattedDate}</strong>
              <div className='w-[15px]'><img src={conversations.unread === true ? unreadIMG : readIMG} alt="." /></div>
            </div>
          </div>

          <div style={{ borderBottom: '1px solid black', marginBottom: '10px' }} onClick={() => { moveForward(conversations) }} className='product-card hidden gap-1 max-lg:flex w-[100%] justify-between items-center'>
            {accessedToken && accessedToken.image && accessedToken.image[0] === conversations.senderImage ? (
              <div className='flex  justify-center gap-1 items-center w-[85%]'>
                <img src={conversations.receiverImage ? conversations.receiverImage : Avatarsample} alt="Avatar" style={miniAvatar} />
                <div className='flex flex-col gap-2'>
                  <strong className="text-[8px]">{accessedToken.firstname === conversations?.sender ? conversations?.receiver : conversations?.sender}</strong>
                  <strong className="card-text text-[6px]">{truncatedDescription}</strong>
                </div>
              </div>
            ) : (
              <div className='flex gap-3 justify-center gap-1 items-center w-[85%]'>
                <img src={conversations.senderImage ? conversations.senderImage : Avatarsample} alt="Avatar" style={miniAvatar} />
                <div className='flex flex-col gap-1'>
                  <strong className="text-[8px]">{accessedToken.firstname === conversations?.sender ? conversations?.receiver : conversations?.sender}</strong>
                  <strong className="card-text text-[6px]">{truncatedDescription}</strong>
                </div>
              </div>
            )}
            <div className='flex flex-col items-center gap-1'>
              <strong className="text-[8px]">{formattedDate}</strong>
              <div className='w-[10px]'><img src={conversations.unread === true ? unreadIMG : readIMG} alt="." /></div>
            </div>
          </div>
        </div>

      );
    });

    localStorage.setItem('messagenotice', unreadCount.toString());
    const messageNotice = JSON.parse(localStorage.getItem('messagenotice'));
    return conversationElements;
  } else {
    return (
      <div>No messages available</div>
    );
  }
};


export const Mystorecard = () => {

  const navigate = useNavigate();
  const [buttonloading, setButtonloading] = useState('');
  const accessedToken = JSON.parse(localStorage.getItem('userData'));
  const wishlistButton = { border: "1px solid #FEBD69", borderRadius: "5px" }


  const WISHLIST_API_KEY = 'https://campusbuy-backend-nkmx.onrender.com/addwishlist';
  const axiosInstance = axios.create({
    baseURL: 'https://campusbuy-backend-nkmx.onrender.com', // Replace with your API base URL
    headers: {
      'Content-Type': 'application/json',
      // Other default headers can be added here
    },
  });

  // Function to set JWT token in the headers
  const setAuthToken = (token) => {
    if (token) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axiosInstance.defaults.headers.common['Authorization'];
    }
  };

  // Use this function to set the token when the user logs in or the token is available
  if (accessedToken && accessedToken.accessToken) {
    setAuthToken(accessedToken.accessToken);
  }
  // Now, you can use axiosInstance for your requests with the token included in the headers

  const trendingProducts = JSON.parse(localStorage.getItem('yourproductscard'));



  if (trendingProducts && trendingProducts.length > 0) {

    const Productcard = trendingProducts.map((Product) => {
      const truncatedDescription = truncateDescription(Product.description, 25);

      const moveForward = async () => {
        await localStorage.setItem('product', JSON.stringify(Product._id));
        await localStorage.setItem('mainproduct', JSON.stringify(Product));
        await navigate(`/productpage/${Product.slug}/${Product._id}`);
      };


      const addWishlist = async (id) => {
        const accessedToken = JSON.parse(localStorage.getItem('userData'));
        setButtonloading(id)
        if (!accessedToken) {
          setButtonloading('')
          setTimeout(() => {
            navigate('/signin');
          }, 3000);
        } else {
          try {
            const formData = new FormData();
            formData.append('productId', Product._id);

            const response = await axiosInstance.put(WISHLIST_API_KEY, formData);
            setButtonloading('')
            alert("Added to wishlist!");

          } catch (error) {
            if (error.response.status === 403) {
              setButtonloading('')
              setTimeout(() => {
                navigate('/signin');
              }, 3000);
            }
            console.error('Error adding to wishlist:', error);
          }
        }
      };

      return (
        <div className='product-card w-[40%] text-sm max-lg:w-[95%] flex justify-center items-center  p-1 max-lg:m-0 max-lg:p-0' key={Product._id}>
          <div className='w-[50%]' onClick={moveForward}>
            <img src={Product.images[0]? Product.images[0] : Productsample} className="card-img-top" alt="image" />
          </div>
          <div className="card-body">
            <h5 className="card-title"><strong>{Product.title || Product.name}</strong></h5>
            <div className='product-price d-flex gap-1 text-[#FEBD69]'>
              <TbCurrencyNaira className='wishlist-naira' />
              <h3 className="card-price-text text-sm">{Product.price}</h3>
            </div>
            <p className="card-location"><strong>Location:</strong> {Product.location || Product.coverage}</p>
            <p className="card-brand"><strong>{Product.brand ? "Brand:" : "Category:"}</strong> {Product.brand || Product.category}</p>
            <p className="card-condition"><strong>{Product.brand ? "Condition:" : "Availability:"}</strong> {Product.condition || Product.availability}</p>
            <div className='flex justify-between items-center'>
              <button onClick={moveForward} className="text-[8px] bg-[#FEBD69] rounded-md p-1 "><strong>View Product</strong></button>
              <button onClick={() => { addWishlist(Product._id) }} className="text-[8px] p-1 mx-2" style={wishlistButton}><strong>{buttonloading === Product._id ? (<div><BigLoader /></div>) : ('Add Wishlist')}
              </strong></button>
            </div>
          </div>
        </div>

      );
    });

    return Productcard;
  } else {
    return (
      <div className="text-center">No Products found</div>
    );
  }
};

export const Mobilemystorecard = () => {
  const deleteButton = { border: "1px solid #8B0000", borderRadius: "5px" }

  const navigate = useNavigate();
  const [buttonloading, setButtonloading] = useState('');
  const accessedToken = JSON.parse(localStorage.getItem('userData'));

  const WISHLIST_API_KEY = 'https://campusbuy-backend-nkmx.onrender.com/addwishlist';
  const axiosInstance = axios.create({
    baseURL: 'https://campusbuy-backend-nkmx.onrender.com', // Replace with your API base URL
    headers: {
      'Content-Type': 'application/json',
      // Other default headers can be added here
    },
  });

  // Function to set JWT token in the headers
  const setAuthToken = (token) => {
    if (token) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axiosInstance.defaults.headers.common['Authorization'];
    }
  };

  // Use this function to set the token when the user logs in or the token is available
  if (accessedToken && accessedToken.accessToken) {
    setAuthToken(accessedToken.accessToken);
  }


  // Now, you can use axiosInstance for your requests with the token included in the headers  

  const searchedProducts = JSON.parse(localStorage.getItem('yourproductscard'));

  const Productcard = searchedProducts ? (
    searchedProducts.map((Product) => {
      const truncatedDescription = truncateDescription(Product.description, 15);

      const moveForward = async () => {
        await localStorage.setItem('product', JSON.stringify(Product._id));
        await localStorage.setItem('mainproduct', JSON.stringify(Product));
        await navigate(`/productpage/${Product.slug}/${Product._id}`);
      };


      const addWishlist = async (id) => {
        const accessedToken = JSON.parse(localStorage.getItem('userData'));
        setButtonloading(id)
        if (!accessedToken) {
          setButtonloading('')
          setTimeout(() => {
            navigate('/signin');
          }, 3000);
        } else {
          try {
            const formData = new FormData();
            formData.append('productId', Product._id);

            const response = await axiosInstance.put(WISHLIST_API_KEY, formData);
            setButtonloading('')
            alert("Added to wishlist!");

          } catch (error) {
            if (error.response.status === 403) {
              setButtonloading('')
              setTimeout(() => {
                navigate('/signin');
              }, 3000);
            }
            console.error('Error adding to wishlist:', error);
          }
        }
      };



      return (
        <div className='product-card w-[49%] text-[8px]  flex justify-center  items-center my-1 ' key={Product._id}>
          <div className='w-[50%]' onClick={moveForward}>
            <img src={Product.images[0]? Product.images[0] : Productsample} className="card-img-top" alt="image" />
          </div>
          <div className="card-body ">
            <h5 className="card-title"><strong>{Product.title || Product.name}</strong></h5>
            <div className='product-price d-flex gap-1 text-[#FEBD69]'>
              <TbCurrencyNaira className='wishlist-naira' />
              <h3 className="card-price-text text-sm">{Product.price}</h3>
            </div>
            <p className="card-location"><strong>Location:</strong> {Product.location || Product.coverage}</p>
            <p className="card-brand"><strong>{Product.brand ? "Brand:" : "Category:"}</strong> {Product.brand || Product.category}</p>
            <p className="card-condition"><strong>{Product.brand ? "Condition:" : "Availability:"}</strong> {Product.condition || Product.availability}</p>
            <div className='flex justify-between items-center'>
              <button onClick={moveForward} className="text-[8px] bg-[#FEBD69] rounded-md p-1 "><strong>View Product</strong></button>
              <button onClick={() => { addWishlist(Product._id) }} className="text-[8px] p-1 mx-2" style={deleteButton}><strong>{buttonloading === Product._id ? (<div><BigLoader /></div>) : ('Add Wishlist')}
              </strong></button>
            </div>
          </div>
        </div>

      );
    })
  ) : (
    <p>No trending products available.</p>
  );

  return Productcard;
};

export const Sellerproductcard = ({ openLoginError, closeLoginError, openLoginModal }) => {
  const navigate = useNavigate();
  const [buttonloading, setButtonloading] = useState('');
  const accessedToken = JSON.parse(localStorage.getItem('userData'));

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 768,
        settings: { slidesToShow: 2, slidesToScroll: 1 },
      },
      {
        breakpoint: 576,
        settings: { slidesToShow: 2, slidesToScroll: 1 },
      },
    ],
  };

  const WISHLIST_API_KEY = 'https://campusbuy-backend-nkmx.onrender.com/addwishlist';
  const axiosInstance = axios.create({
    baseURL: 'https://campusbuy-backend-nkmx.onrender.com',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (accessedToken && accessedToken.accessToken) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessedToken.accessToken}`;
  }

  const trendingProducts = JSON.parse(localStorage.getItem('sellerstore'));

  if (!trendingProducts) {
    return null;
  }

  // Slice the array to get only the first 40 products
  const slicedProducts = trendingProducts.slice(0, 10);

  return (
    <div className="slider-wrapper">
      <Slider {...settings} className="w-[100%]">
        {slicedProducts.map((Product) => {
          const truncatedDescription = truncateDescription(Product.description, 15);

          const moveForward = async () => {
            await localStorage.setItem('product', JSON.stringify(Product._id));
            await localStorage.setItem('fullproduct', JSON.stringify(Product));
            await navigate(`/trendingproductpage/${Product.slug}/${Product._id}`);
            window.location.reload(); // Reload if no search value
          };

          const addWishlist = async (id) => {
            const accessedToken = JSON.parse(localStorage.getItem('userData'));
            if (!accessedToken) {
              setButtonloading(false);
              openLoginError();
              setTimeout(() => {
                closeLoginError();
                openLoginModal();
              }, 3000);
            } else {
              setButtonloading(id);

              try {
                const formData = new FormData();
                formData.append('productId', Product._id);
                await axiosInstance.put(WISHLIST_API_KEY, formData);
                setButtonloading(false);
                alert('Added to wishlist!');
              } catch (error) {
                if (error.response.status === 403) {
                  setButtonloading(false);
                  openLoginError();
                  setTimeout(() => {
                    closeLoginError();
                    openLoginModal();
                  }, 3000);
                }
                console.error('Error adding to wishlist:', error);
              }
            }
          };


          return (
            <div className="product-card flex gap-2 w-[25%] max-lg:w-[95%] max-lg:flex-col border-2 border-[#FFD700]" key={Product._id}>
              <div className="card p-2 justify-center items-center bg-[#222121]">
                <div onClick={moveForward}>
                  <img src={Product.images[0]? Product.images[0] : Productsample} className="card-img-top" alt="..." width={40} />
                  <div className="text-[8px] text-white bg-[#222121] text-center">
                    <p className="card-title text-[8px]">
                      <strong>{Product.title || Product.name}</strong>
                    </p>
                    <div className="product-price d-flex gap-1 align-items-center justify-center">
                      <TbCurrencyNaira className="naira" />
                      <p className="card-price-text text-sm">{Product.price}</p>
                    </div>
                    <div className="flex justify-between items-center text-[8px]">
                      <p className="card-location">
                        <strong>{Product.location || Product.coverage}</strong>
                      </p>
                      <p>
                        <strong>{Product.person || Product.status}</strong>
                      </p>
                    </div>
                    <div className="flex justify-between items-center text-[8px]">
                      <p className="card-brand">
                        <strong>{Product.brand}</strong>
                      </p>
                      <p className="card-brand text-[#98FB98]">
                        <strong className='card-condition-text'>{Product.condition}</strong>
                      </p>
                    </div>
                  </div>
                </div>
                <NavLink onClick={() => addWishlist(Product._id)} className="btn btn-secondary text-[10px] flex gap-1">
                  <p>
                    {buttonloading ? <div><BigLoader /></div> : 'Add Wishlist'}
                  </p>
                  <FaHeart className="wishlist-react-icons" />
                </NavLink>
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
};


export const Otherproductcard = ({ openLoginError, closeLoginError, openLoginModal }) => {

  const navigate = useNavigate();
  const [buttonloading, setButtonloading] = useState('');
  const accessedToken = JSON.parse(localStorage.getItem('userData'));

  const WISHLIST_API_KEY = 'https://campusbuy-backend-nkmx.onrender.com/addwishlist';
  const axiosInstance = axios.create({
    baseURL: 'https://campusbuy-backend-nkmx.onrender.com', // Replace with your API base URL
    headers: {
      'Content-Type': 'application/json',
      // Other default headers can be added here
    },
  });

  // Function to set JWT token in the headers
  const setAuthToken = (token) => {
    if (token) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axiosInstance.defaults.headers.common['Authorization'];
    }
  };

  // Use this function to set the token when the user logs in or the token is available
  if (accessedToken && accessedToken.accessToken) {
    setAuthToken(accessedToken.accessToken);
  }


  // Now, you can use axiosInstance for your requests with the token included in the headers



  const trendingProducts = JSON.parse(localStorage.getItem('trendingproducts'));

  const Productcard = trendingProducts ? (
    trendingProducts.map((Product) => {
      const truncatedDescription = truncateDescription(Product.description, 15);

      const moveForward = async () => {
        await localStorage.setItem('product', JSON.stringify(Product._id));
        await localStorage.setItem('fullproduct', JSON.stringify(Product));
        await navigate(`/trendingproductpage/${Product.slug}/${Product._id}`);
      };


      const addWishlist = async (id) => {
        const accessedToken = JSON.parse(localStorage.getItem('userData'));
        const WISHLIST_API_KEY = 'https://campusbuy-backend-nkmx.onrender.com/addwishlist';
        if (!accessedToken) {
          setButtonloading(false)
          openLoginError();
          setTimeout(() => {
            closeLoginError();
            openLoginModal();
          }, 3000)
        } else {
          setButtonloading(id);

          try {
            const formData = new FormData();
            formData.append('productId', Product._id);
            const response = await axiosInstance.put(WISHLIST_API_KEY, formData);
            setButtonloading(false)
            alert('Added to wishlist!');
          } catch (error) {
            if (error.response.status === 403) {
              setButtonloading(false)
              openLoginError();
              setTimeout(() => {
                closeLoginError();
                openLoginModal();
              }, 3000)
            }
            console.error('Error adding to wishlist:', error);
          }
        }
      };




      return (
        <div className='product-card  flex m-3 w-[25%] max-lg:w-[95%] max-lg:flex-col border-2 border-[#FFD700] ' key={Product._id}>
          <div className='card p-2 justify-center items-center bg-[#222121] '>
            <div onClick={moveForward}>
              <img src={Product.images[0]? Product.images[0] : Productsample} className='card-img-top' alt='...' width={70} />
              <div className='card-body text-sm text-white bg-[#222121] text-center'>
                <h5 className='card-title'>
                  <strong>{Product.title || Product.name}</strong>
                </h5>
                {Product.title ? (
                  <div className='product-price d-flex gap-1 align-items-center justify-center'>
                    <TbCurrencyNaira className='naira' />
                    <h3 className='card-price-text text-lg'>{Product.price}</h3>
                  </div>
                ) : null}
                <div className='flex my-1 justify-between items-center text-sm'>
                  <p className='card-location'>
                    <strong>{Product.location || Product.coverage}</strong>
                  </p>
                  <p>
                    <strong>{Product.person || Product.status}</strong>
                  </p>
                </div>
                {Product.title ? (
                  <div className='flex my-1 justify-between items-center text-sm'>
                    <p className='card-brand'>
                      <strong>{Product.brand}</strong>
                    </p>
                    <p className='card-brand text-[#98FB98]'>
                      <strong className='card-condition-text'>{Product.condition}</strong>
                    </p>
                  </div>
                ) : (
                  <div className='flex my-1 justify-between items-center text-sm'>
                    <div className='text-[8px] flex flex-col gap-1'>
                      {Product.price1} {Product.service1}
                    </div>
                    <div className='text-[8px] flex flex-col gap-1'>
                      {Product.price2} {Product.service2}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <NavLink onClick={addWishlist} className='btn btn-secondary text-[10px] flex gap-1'>
              {buttonloading === Product._id ? (<div><BigLoader /></div>) : ('Add to Wishlist')}
              <FaHeart className='wishlist-react-icons' />
            </NavLink>
          </div>
        </div>
      );
    })
  ) : (
    <p>No trending products available.</p>
  );

  return Productcard;
};
export const Mobileotherproductcard = ({ openLoginError, closeLoginError, openLoginModal }) => {

  const navigate = useNavigate();
  const [buttonloading, setButtonloading] = useState('');
  const accessedToken = JSON.parse(localStorage.getItem('userData'));

  const WISHLIST_API_KEY = 'https://campusbuy-backend-nkmx.onrender.com/addwishlist';
  const axiosInstance = axios.create({
    baseURL: 'https://campusbuy-backend-nkmx.onrender.com', // Replace with your API base URL
    headers: {
      'Content-Type': 'application/json',
      // Other default headers can be added here
    },
  });

  // Function to set JWT token in the headers
  const setAuthToken = (token) => {
    if (token) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axiosInstance.defaults.headers.common['Authorization'];
    }
  };

  // Use this function to set the token when the user logs in or the token is available
  if (accessedToken && accessedToken.accessToken) {
    setAuthToken(accessedToken.accessToken);
  }


  // Now, you can use axiosInstance for your requests with the token included in the headers


  const trendingProducts = JSON.parse(localStorage.getItem('trendingproducts'));

  const Productcard = trendingProducts ? (
    trendingProducts.map((Product) => {
      const truncatedDescription = truncateDescription(Product.description, 15);

      const moveForward = async () => {
        await localStorage.setItem('product', JSON.stringify(Product._id));
        await localStorage.setItem('fullproduct', JSON.stringify(Product));
        await navigate(`/trendingproductpage/${Product.slug}/${Product._id}`);
      };

      const addWishlist = async (id) => {
        const accessedToken = JSON.parse(localStorage.getItem('userData'));
        const WISHLIST_API_KEY = 'https://campusbuy-backend-nkmx.onrender.com/addwishlist';
        if (!accessedToken) {
          setButtonloading(false)
          openLoginError();
          setTimeout(() => {
            closeLoginError();
            openLoginModal();
          }, 3000)
        } else {
          setButtonloading(id);

          try {
            const formData = new FormData();
            formData.append('productId', Product._id);
            const response = await axiosInstance.put(WISHLIST_API_KEY, formData);
            setButtonloading(false)
            alert('Added to wishlist!');
          } catch (error) {
            if (error.response.status === 403) {
              setButtonloading(false)
              openLoginError();
              setTimeout(() => {
                closeLoginError();
                openLoginModal();
              }, 3000)
            }
            console.error('Error adding to wishlist:', error);
          }
        }
      };




      return (
        <div className='product-card flex m-1 w-[40%] border-2 border-[#FFD700]' key={Product._id}>
          <div className='card p-2 justify-center items-center bg-[#222121]'>
            <div onClick={moveForward} className='card  bg-[#222121] '>
              <img src={Product.images[0]? Product.images[0] : Productsample} className='card-img-top' alt='...' width={12} />
              <div className='card-body w-[100%] text-[9px] text-white bg-[#222121] text-center'>
                <h5 className='card-title'>
                  <strong>{Product.title || Product.name}</strong>
                </h5>
                <div className='product-price d-flex gap-1 align-items-center justify-center w-full'>
                  <TbCurrencyNaira className='naira' />
                  <h3 className='card-price-text '>{Product.price}</h3>
                </div>
                <div className='my-1 justify-between items-center '>
                  <p className='card-location'>
                    <strong>{Product.location || Product.coverage}</strong>
                  </p>
                  <p className=''>
                    <strong>{Product.person || Product.status}</strong>
                  </p>
                </div>
                <div className='flex my-1 justify-between items-center '>
                  <p className='card-brand'>
                    <strong>{Product.brand}</strong>
                  </p>
                  <p className='card-brand text-[#98FB98]'>
                    <strong className='card-condition-text'>{Product.condition}</strong>
                  </p>
                </div>
              </div>
            </div>
            <NavLink onClick={addWishlist} className='btn btn-secondary text-[10px] flex gap-1'>
              {buttonloading === Product._id ? (<div><BigLoader /></div>) : ('Add to Wishlist')}
              <FaHeart className='wishlist-react-icons' />
            </NavLink>
          </div>
        </div>

      );
    })
  ) : (
    <p>No trending products available.</p>
  );

  return Productcard;
};