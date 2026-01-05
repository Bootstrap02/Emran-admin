import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { RiAccountPinBoxFill } from "react-icons/ri";
import { IoMdNotifications } from "react-icons/io";
import { FaHeart } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { IoMdCloudDone } from "react-icons/io";
import Select from 'react-select';
import Navbar from './Navbar';
import { BigLoader } from '../Modals/Loaders';
import { universities } from '../Constants/Universities';
import Nav from "../Modals/General/Nav";
import { Tokenerrormodal } from '../Modals/Forms';
import { IoIosAdd } from "react-icons/io";
import { MdHome } from "react-icons/md";
import { MdAddIcCall } from "react-icons/md";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import { TbWorld } from "react-icons/tb";
import { BsSearch } from 'react-icons/bs';
import { IoMenu } from "react-icons/io5";
import Loading from 'react-loading';
import { BsSend } from "react-icons/bs";
import { Noticemodal, AllNoticemodal, GeneralNoticemodal } from './Productmodals';
import { FaFacebook } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { FaWhatsappSquare } from "react-icons/fa";
import { IoLogoGooglePlaystore } from "react-icons/io5";
import { FaAppStoreIos } from "react-icons/fa6";







export const Secondheader = () => {
  const [scrollDirection, setScrollDirection] = useState('up');
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [signin, setSignin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Move the declaration of 'university' above its usage
  const accessedToken = JSON.parse(localStorage.getItem('userData'));
  const Messagenotice = JSON.parse(localStorage.getItem('messagenotice'));
  const unreadcallback = JSON.parse(localStorage.getItem("unreadcallback"));
  const unreadnotification = JSON.parse(localStorage.getItem("unreadnotification"));
  const getSearchInputs = JSON.parse(localStorage.getItem("searchinputs"));



  const openLoading = () => {
    setLoading(true)
  }
  const closeLoading = () => {
    setLoading(false)
  }

  let university = JSON.parse(localStorage.getItem("universities"));

  if (!university) {
    university = {
      label: "All Universities",
      value: "All Universities",
    };
    localStorage.setItem("universities", JSON.stringify(university));
  }


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

  const GET_WISHLIST_API_KEY = "https://campusbuy-backend-nkmx.onrender.com/getwishlist";
  const GET_NOTIFICATIONS_API_KEY = "https://campusbuy-backend-nkmx.onrender.com/getnotification";
  const GET_MESSAGES_API_KEY = "https://campusbuy-backend-nkmx.onrender.com/getconversations";
  const GET_CALLBACK_API_KEY = "https://campusbuy-backend-nkmx.onrender.com/getcallback";
  const GET_YOURPRODUCTS_API_KEY = "https://campusbuy-backend-nkmx.onrender.com/getyourproduct";

  useEffect(() => {
    const getApis = async () => {
      try {
        if (accessedToken && accessedToken.accessToken) {
          const yourReferrals = await axiosInstance.get("https://campusbuy-backend-nkmx.onrender.com/getyourreferrals");
          localStorage.setItem('referrals', JSON.stringify(yourReferrals.data));
        }
      } catch (error) {
        console.error('Error getting APIs:', error);
      }
    };
    getApis();
  }, []);





  const handleScroll = () => {
    const currentScrollPos = document.documentElement.scrollTop;

    if (currentScrollPos > prevScrollPos) {
      setScrollDirection('down');

      const openLoading = () => {
        setLoading(true);
      }
      const closeLoading = () => {
        setLoading(false);
      }



    } else {
      setScrollDirection('up');
    }

    setPrevScrollPos(currentScrollPos);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);


  const postProduct = async () => {
    if (accessedToken) {
      navigate('/createproductpage')
    } else {
      await setSignin(true);
      setTimeout(() => {
        navigate('/signin')
        setSignin(false);
      }, 3000);
    }

  }

  const [filteredInputs, setFilteredInputs] = useState([]);

  const handleSearchChange = (newValue, actionMeta) => {
    if (actionMeta.action === 'input-change') {
      setSearchValue(newValue);
    } else if (actionMeta.action === 'select-option') {
      setSearchValue(newValue.label);
      setSelectedOption(newValue);
    }
  };
  const sendSearchKeyword = (searchKeyword) => dispatch({ type: 'SEND_SEARCH_KEYWORD', searchKeyword });
  const moveForward = async () => {
    const SEARCH_API_KEY = `https://campusbuy-backend-nkmx.onrender.com/searchproducts?university=${university.value}&search=${searchValue}`;
    const SEARCH_API_KEYS = `https://campusbuy-backend-nkmx.onrender.com/searchproducts?search=${searchValue}`;

    try {
      if (!searchValue) {
        navigate("#")
      } else {
        openLoading()
        const response = await axios.get(university.value === "All Universities" ? SEARCH_API_KEYS : SEARCH_API_KEY);
        setSearchValue('');
        setSelectedOption(null);
        if (response.data) {
          closeLoading()
        }
        await sendSearchKeyword(searchValue);
        await localStorage.setItem('searchkeyword', JSON.stringify(searchValue));


        await localStorage.setItem('searchedproducts', JSON.stringify(response.data.data));
        navigate(`/search/${university.value}/${searchValue}`)
        window.location.reload(); // Reload if no search value

      };

    } catch (error) {
      closeLoading()
      console.error('Error moving forward:', error);
      alert("No product found!")
    }
  };
  useEffect(() => {
    if (searchValue) {
      const filtered = getSearchInputs.filter(input =>
        input.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredInputs(filtered.map(input => ({ value: input, label: input })));
    } else {
      setFilteredInputs([]);
    }
  }, [searchValue, getSearchInputs]);




  const Signout = async () => {
    try {
      await localStorage.removeItem('userData');
      await localStorage.removeItem('wishlistcard');
      await localStorage.removeItem('notificationscard');
      await localStorage.removeItem('yourproductscard');
      await localStorage.removeItem('conversationscard');
      await localStorage.removeItem('newmessage');
      await localStorage.removeItem('callbackcard');
      await localStorage.removeItem('usercard');

      navigate('/');
    } catch (error) {
      console.error('Error signing out Account:', error);
    }

  }

  const loginOrOut = () => {
    if (accessedToken) {
      Signout();
    } else {
      navigate('/signin')
    }
  }



  const loggedinOrOut = async (API, store) => {
    try {
      if (accessedToken) {
        const response = await axiosInstance.get(API);

        await localStorage.setItem(store, JSON.stringify(response.data));

        // Check if 'id' property exists in accessedToken before navigating
        if (accessedToken.id ? accessedToken.id : accessedToken._id) {
          navigate(`/mainpage/${accessedToken.id ? accessedToken.id : accessedToken._id}`);
        } else {
          console.error('Error navigating to Your Account: Invalid accessedToken');
        }
      } else {
        await setSignin(true);
        setTimeout(() => {
          navigate('/signin')
          setSignin(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error navigating to Your Account:', error);
      if (error.response && error.response.status === 403) {
        await setSignin(true);
        setTimeout(() => {
          navigate('/signin')
          setSignin(false);
        }, 3000);
      } else {
        alert('Connection error. Please refresh your network')
      }
    }
  };




  const accountNavigate = async () => {
    try {
      if (accessedToken) {
        // Check if 'id' property exists in accessedToken before navigating
        if (accessedToken.id ? accessedToken.id : accessedToken._id) {
          navigate(`/mainpage/${accessedToken.id ? accessedToken.id : accessedToken._id}`);
        } else {
          console.error('Error navigating to Your Account: Invalid accessedToken');
        }
      } else {
        navigate('/signin');
      }
    } catch (error) {
      console.error('Error navigating to Your Account:', error);
    }
  };


  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    if (selectedOption) {
      trendingProducts();
    }
  }, [selectedOption]);



  const trendingProducts = async () => {
    try {
      const TRENDING_PRODUCTS_API_KEY = `https://campusbuy-backend-nkmx.onrender.com/getproducts?university=${selectedOption.value}&premiumServices=true`;
      const ALL_TRENDING_PRODUCTS_API_KEY = 'https://campusbuy-backend-nkmx.onrender.com/getpremiumlatestproducts';

      const response = await axios.get(selectedOption.value === "All Universities" ? ALL_TRENDING_PRODUCTS_API_KEY : TRENDING_PRODUCTS_API_KEY);

      if (response.data) {
        await localStorage.setItem('trendingproducts', JSON.stringify(response.data.data));
        console.log(response.data)
        window.location.reload(); // Reload the page after updating localStorage
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        localStorage.removeItem('trendingproducts');
      } else {
        console.error('Error fetching trending products:', error);
      }
    }
  };

  const changeSchool = (selectedOption) => {
    if (selectedOption) {
      setSelectedOption(selectedOption);
      localStorage.setItem("universities", JSON.stringify(selectedOption));
    } else {
      localStorage.setItem("universities", JSON.stringify({
        label: "All Universities",
        value: "All Universities",
      },));
    }
  };

  const customStyles = {
    placeholder: (provided) => ({
      ...provided,
      color: '#FEBD69',
      fontWeight: 'bold',
    }),
    control: (provided) => ({
      ...provided,
      borderColor: 'black',
      borderWidth: 2,
      borderRadius: '0.375rem', // rounded-md equivalent
    }),
  };
  const sendWishlist = (activePage) => dispatch({ type: 'GET_ACTIVEPAGE', activePage });
  const sendNotifications = (activePage) => dispatch({ type: 'GET_ACTIVEPAGE', activePage });
  const sendAccount = (activePage) => dispatch({ type: 'GET_ACTIVEPAGE', activePage });
  const sendMessages = (activePage) => dispatch({ type: 'GET_ACTIVEPAGE', activePage });
  const sendYourproducts = (activePage) => dispatch({ type: 'GET_ACTIVEPAGE', activePage });
  const sendCallbacks = (activePage) => dispatch({ type: 'GET_ACTIVEPAGE', activePage });
  const sendMystore = (activePage) => dispatch({ type: 'GET_ACTIVEPAGE', activePage });



  return (
    <div>
      <div className='w-[100%] header-top-strip max-lg:hidden'>
        <header>
          <div className='container-xxl'>
            <div className='flex justify-between items-center py-2'>
              <button onClick={postProduct} className='flex gap-1 text-[10px] text-[#FEBD69] text-bold justify-center items-center bg-[#0C0908] p-1.5 rounded-md sell-something-button'>
                <span>Sell on Campus</span> <IoIosAdd className='header-react-icons-add' /></button>
              <div className='w-[50%]'>
                <div className='text-bold m-4 w-full'>
                  <div className='flex items-center justify-center w-full search-bar'>
                    <form onSubmit={moveForward} className='flex items-center w-[85%]'>
                      <Select
                        className='search-input'
                        value={selectedOption}
                        options={filteredInputs}
                        onInputChange={handleSearchChange}
                        onChange={handleSearchChange}
                        placeholder="Search for Products or Services"
                        isClearable
                        openMenuOnClick={false}
                        openMenuOnFocus={false}
                      />
                    </form>
                    <button onClick={moveForward} type="submit" className='w-[15%] text-center px-[1rem] py-[0.5rem] sell-something-button bg-black' id='basic-addon2' disabled={!searchValue}>
                      {loading ? (<div><BigLoader /></div>) : (<BsSearch className='header-react-icons-add' />)}
                    </button>
                  </div>
                </div>
              </div>
              <div className='col-md-3 search-for-schools '>
                <div className="search-container flex w-[100%]">
                  <Select
                    className='w-[100%] rounded-md border-2 border-[#424242]'
                    value={selectedOption ? selectedOption : university.value}
                    onChange={changeSchool}
                    options={universities.map((university) => ({
                      value: university.title,
                      label: university.title,
                    }))}
                    placeholder={selectedOption ? selectedOption : university.value}
                    isClearable
                    styles={customStyles}
                  />

                </div>
              </div>
            </div>
          </div>
        </header>
        <header className={`second-header-upper w-[100%] pt-2 pb-1 text-[12px] max-lg:hidden ${scrollDirection === 'down' ? 'scrolled-down' : 'scrolled-up'}`}>
          <div className='flex justify-between items-center px-4'>
            <div>
              <Link to='/'><img className='border border-[#FFD700] rounded-[50%]' src='https://res.cloudinary.com/dtthdh8tb/image/upload/v1728298440/logo_erit8k.png' width={40} alt='logo' /></Link>
            </div>
            <div className='flex justify-center gap-[1.5rem]'>
              <div>
                <NavLink to='/'><span className=' text-white'>Home</span></NavLink>
              </div>
              <div>
                <NavLink to='/about'><span className=' text-white'>About us</span></NavLink>
              </div>
              <div>
                <NavLink to='/contact'><span className=' text-white'>Contact</span></NavLink>
              </div>
              <div>
                <NavLink to='/faqs'><span className=' text-white'>FAQs</span></NavLink>
              </div>
            </div>
            <div className='flex justify-center items-center gap-[1.5rem]'>
              <div className='col-3'>
                <a
                  className=' flex justify-center items-center'
                  onClick={() => {
                    loggedinOrOut(GET_NOTIFICATIONS_API_KEY, "notificationscard")
                    sendNotifications('Notifications')
                  }}
                >
                  <IoMdNotifications className='header-react-icons' />
                </a>
              </div>
              <div className='dropdown mt-[-0.38rem]'>
                <button
                  className=' btn btn-secondary dropdown-toggle  dropdown-toggle-no-caret border-none'
                  type='button'
                  id='dropdownMenuButton1'
                  data-bs-toggle='dropdown'
                  aria-expanded='false'
                >
                  <div className='flex  flex-col gap-1 justify-center items-center'>
                    <RiAccountPinBoxFill className='mobile-header-react-icons' />
                  </div>

                </button>
                <ul className='dropdown-menu' aria-labelledby='dropdownMenuButton1'>
                  <li>
                    <a
                      className='dropdown-item text-[12px]'

                      onClick={() => {
                        accountNavigate();
                        sendAccount('Account');
                      }}
                    >
                      Account
                    </a>
                  </li>
                  <li>
                    <a
                      className='dropdown-item text-[12px]'

                      onClick={() => {
                        loggedinOrOut(GET_MESSAGES_API_KEY, "conversationscard")
                        sendMessages('Messages')
                      }}
                    >
                      Messages
                    </a>
                    {Messagenotice ? <div style={{ position: 'absolute', top: '20%', right: '15%' }}>
                      <Noticemodal /></div> : null}
                  </li>
                  <li>
                    <a
                      className='dropdown-item text-[12px]'

                      onClick={() => {
                        loggedinOrOut(GET_YOURPRODUCTS_API_KEY, "yourproductscard")
                        sendYourproducts('Yourproducts')
                      }}
                    >
                      My Products
                    </a>
                  </li>
                  <li>
                    <a
                      className='dropdown-item text-[12px]'

                      onClick={() => {
                        loggedinOrOut(GET_CALLBACK_API_KEY, "callbackcard")
                        sendCallbacks('Callbacks')
                      }}
                    >
                      Callbacks
                    </a>
                  </li>
                  <li>
                    <a
                      className='dropdown-item text-[12px]'

                      onClick={() => {
                        loggedinOrOut(GET_WISHLIST_API_KEY, "wishlistcard")
                        sendWishlist('Wishlist')
                      }}
                    >
                      Wishlist
                    </a>
                  </li>

                  <li>
                    <a
                      className='dropdown-item text-[12px]'

                      onClick={() => {
                        loggedinOrOut(GET_YOURPRODUCTS_API_KEY, "yourproductscard")
                        sendMystore('Mystore')
                      }}
                    >
                      My Store
                    </a>
                  </li>

                </ul>
              </div>

              <div>
                <a onClick={loginOrOut} className='dropdown-item py-2 p-3 rounded-[40px] bg-[#FEBD69] text-bold '>
                  {accessedToken ? 'Sign Out' : 'Sign In'}
                </a>
              </div>
            </div>
          </div>
        </header>
        {signin && <div className='  border p-4'><Tokenerrormodal /></div>}
      </div>
      <div className='header-mobile w-[100%] hidden max-lg:block'><Mobileheader /></div>
    </div>
  )
}


export const BlackSecondheader = () => {
  const [scrollDirection, setScrollDirection] = useState('up');
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [signin, setSignin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Move the declaration of 'university' above its usage
  const accessedToken = JSON.parse(localStorage.getItem('userData'));
  const unreadcallback = JSON.parse(localStorage.getItem("unreadcallback"));
  const Messagenotice = JSON.parse(localStorage.getItem('messagenotice'));
  const unreadnotification = JSON.parse(localStorage.getItem("unreadnotification"));
  const getSearchInputs = JSON.parse(localStorage.getItem("searchinputs"));


  const openSignin = () => {
    setSignin(true)
  }
  const closeSignin = () => {
    setSignin(false)
  }
  const openLoading = () => {
    setLoading(true)
  }
  const closeLoading = () => {
    setLoading(false)
  }

  let university = JSON.parse(localStorage.getItem("universities"));

  if (!university) {
    university = {
      label: "All Universities",
      value: "All Universities",
    };
    localStorage.setItem("universities", JSON.stringify(university));
  }

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

  const GET_WISHLIST_API_KEY = "https://campusbuy-backend-nkmx.onrender.com/getwishlist";
  const GET_NOTIFICATIONS_API_KEY = "https://campusbuy-backend-nkmx.onrender.com/getnotification";
  const GET_MESSAGES_API_KEY = "https://campusbuy-backend-nkmx.onrender.com/getconversations";
  const GET_CALLBACK_API_KEY = "https://campusbuy-backend-nkmx.onrender.com/getcallback";
  const GET_YOURPRODUCTS_API_KEY = "https://campusbuy-backend-nkmx.onrender.com/getyourproduct";

  useEffect(() => {
    const getApis = async () => {
      try {
        if (accessedToken && accessedToken.accessToken) {
          const yourReferrals = await axiosInstance.get("https://campusbuy-backend-nkmx.onrender.com/getyourreferrals");
          localStorage.setItem('referrals', JSON.stringify(yourReferrals.data));
        }
      } catch (error) {
        console.error('Error getting APIs:', error);
      }
    };
    getApis();
  }, []);





  const handleScroll = () => {
    const currentScrollPos = document.documentElement.scrollTop;

    if (currentScrollPos > prevScrollPos) {
      setScrollDirection('down');

      const openLoading = () => {
        setLoading(true);
      }
      const closeLoading = () => {
        setLoading(false);
      }



    } else {
      setScrollDirection('up');
    }

    setPrevScrollPos(currentScrollPos);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);


  const postProduct = async () => {
    if (accessedToken) {
      navigate('/createproductpage')
    } else {
      await setSignin(true);
      setTimeout(() => {
        navigate('/signin')
        setSignin(false);
      }, 3000);
    }

  }

  const [filteredInputs, setFilteredInputs] = useState([]);

  const handleSearchChange = (newValue, actionMeta) => {
    if (actionMeta.action === 'input-change') {
      setSearchValue(newValue);
    } else if (actionMeta.action === 'select-option') {
      setSearchValue(newValue.label);
      setSelectedOption(newValue);
    }
  };

  const sendSearchKeyword = (searchKeyword) => dispatch({ type: 'SEND_SEARCH_KEYWORD', searchKeyword });
  const moveForward = async () => {
    const SEARCH_API_KEY = `https://campusbuy-backend-nkmx.onrender.com/searchproducts?university=${university.value}&search=${searchValue}`;
    const SEARCH_API_KEYS = `https://campusbuy-backend-nkmx.onrender.com/searchproducts?search=${searchValue}`;
    try {
      if (!searchValue) {
        navigate("#")
      } else {
        openLoading()
        const response = await axios.get(university.value === "All Universities" ? SEARCH_API_KEYS : SEARCH_API_KEY);
        setSearchValue('');
        setSelectedOption(null);
        if (response.data) {
          closeLoading()
        }
        await sendSearchKeyword(searchValue);
        await localStorage.setItem('searchkeyword', JSON.stringify(searchValue));


        await localStorage.setItem('searchedproducts', JSON.stringify(response.data.data));
        navigate(`/search/${university.value}/${searchValue}`)
      };

    } catch (error) {
      closeLoading()
      console.error('Error moving forward:', error);
      alert("No product found!")
    }
  };
  useEffect(() => {
    if (searchValue) {
      const filtered = getSearchInputs.filter(input =>
        input.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredInputs(filtered.map(input => ({ value: input, label: input })));
    } else {
      setFilteredInputs([]);
    }
  }, [searchValue, getSearchInputs]);





  const Signout = async () => {
    try {
      await localStorage.removeItem('userData');
      await localStorage.removeItem('wishlistcard');
      await localStorage.removeItem('notificationscard');
      await localStorage.removeItem('yourproductscard');
      await localStorage.removeItem('conversationscard');
      await localStorage.removeItem('newmessage');
      await localStorage.removeItem('callbackcard');
      await localStorage.removeItem('usercard');

      navigate('/');
    } catch (error) {
      console.error('Error signing out Account:', error);
    }

  }

  const loginOrOut = () => {
    if (accessedToken) {
      Signout();
    } else {
      navigate('/signin')
    }
  }



  const loggedinOrOut = async (API, store) => {
    try {
      if (accessedToken) {
        const response = await axiosInstance.get(API);

        await localStorage.setItem(store, JSON.stringify(response.data));

        // Check if 'id' property exists in accessedToken before navigating
        if (accessedToken.id ? accessedToken.id : accessedToken._id) {
          navigate(`/mainpage/${accessedToken.id ? accessedToken.id : accessedToken._id}`);
        } else {
          console.error('Error navigating to Your Account: Invalid accessedToken');
        }
      } else {
        await setSignin(true);
        setTimeout(() => {
          navigate('/signin')
          setSignin(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error navigating to Your Account:', error);
      if (error.response && error.response.status === 403) {
        await setSignin(true);
        setTimeout(() => {
          navigate('/signin')
          setSignin(false);
        }, 3000);
      } else {
        alert('Connection error. Please refresh your network')
      }
    }
  };




  const accountNavigate = async () => {
    try {
      if (accessedToken) {
        // Check if 'id' property exists in accessedToken before navigating
        if (accessedToken.id ? accessedToken.id : accessedToken._id) {
          navigate(`/mainpage/${accessedToken.id ? accessedToken.id : accessedToken._id}`);
        } else {
          console.error('Error navigating to Your Account: Invalid accessedToken');
        }
      } else {
        navigate('/signin');
      }
    } catch (error) {
      console.error('Error navigating to Your Account:', error);
    }
  };


  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    if (selectedOption) {
      trendingProducts();
    }
  }, [selectedOption]);



  const trendingProducts = async () => {
    try {
      const TRENDING_PRODUCTS_API_KEY = `https://campusbuy-backend-nkmx.onrender.com/getproducts?university=${selectedOption.value}&premiumServices=true`;

      const response = await axios.get(TRENDING_PRODUCTS_API_KEY);

      if (response.data) {
        // localStorage.setItem('trendingproducts', JSON.stringify(response.data.data)); 
        console.log(response.data)
        window.location.reload(); // Reload the page after updating localStorage
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        localStorage.removeItem('trendingproducts');
      } else {
        console.error('Error fetching trending products:', error);
      }
    }
  };

  const changeSchool = (selectedOption) => {
    if (selectedOption) {
      setSelectedOption(selectedOption);
      localStorage.setItem("universities", JSON.stringify(selectedOption));
    } else {
      localStorage.setItem("universities", JSON.stringify({
        label: "All Universities",
        value: "All Universities",
      }));
    }
  };

  const customStyles = {
    placeholder: (provided) => ({
      ...provided,
      color: '#FEBD69',
      fontWeight: 'bold',
    }),
    control: (provided) => ({
      ...provided,
      borderColor: 'black',
      borderWidth: 2,
      borderRadius: '0.375rem', // rounded-md equivalent
    }),
  };
  const sendWishlist = (activePage) => dispatch({ type: 'GET_ACTIVEPAGE', activePage });
  const sendNotifications = (activePage) => dispatch({ type: 'GET_ACTIVEPAGE', activePage });
  const sendAccount = (activePage) => dispatch({ type: 'GET_ACTIVEPAGE', activePage });
  const sendMessages = (activePage) => dispatch({ type: 'GET_ACTIVEPAGE', activePage });
  const sendYourproducts = (activePage) => dispatch({ type: 'GET_ACTIVEPAGE', activePage });
  const sendCallbacks = (activePage) => dispatch({ type: 'GET_ACTIVEPAGE', activePage });
  const sendMystore = (activePage) => dispatch({ type: 'GET_ACTIVEPAGE', activePage });



  return (
    <div className='w-[100%]'>
      <div className='w-[100%] subheader-top-strip max-lg:hidden'>
        <header>
          <div className='container-xxl'>
            <div className='flex justify-between items-center py-2'>
              <button onClick={postProduct} className='flex gap-1 text-[10px] text-[#FEBD69] text-bold justify-center items-center bg-[#0C0908] p-1.5 rounded-md sell-something-button'>
                <span>Sell on Campus</span> <IoIosAdd className='header-react-icons-add' /></button>
              <div className='w-[50%]'>
                <div className='text-bold m-4 w-full'>
                  <div className='flex items-center justify-center w-full search-bar'>
                    <form onSubmit={moveForward} className='flex items-center w-[85%]'>
                      <Select
                        className='search-input'
                        value={selectedOption}
                        options={filteredInputs}
                        onInputChange={handleSearchChange}
                        onChange={handleSearchChange}
                        placeholder="Search for Products or Services"
                        isClearable
                        openMenuOnClick={false}
                        openMenuOnFocus={false}
                      />
                    </form>
                    <button onClick={moveForward} type="submit" className='w-[15%] text-center px-[1rem] py-[0.5rem] sell-something-button bg-black' id='basic-addon2' disabled={!searchValue}>
                      {loading ? (<div><BigLoader /></div>) : (<BsSearch className='header-react-icons-add' />)}
                    </button>
                  </div>
                </div>
              </div>
              <div className='col-md-3 search-for-schools '>
                <div className="search-container flex w-[100%]">
                  <Select
                    className='w-[100%] rounded-md border-2 border-[#424242]'
                    value={selectedOption ? selectedOption : university.value}
                    onChange={changeSchool}
                    options={universities.map((university) => ({
                      value: university.title,
                      label: university.title,
                    }))}
                    placeholder={selectedOption ? selectedOption : university.value}
                    isClearable
                    styles={customStyles}
                  />

                </div>
              </div>
            </div>
          </div>
        </header>
        <header className={`subheader-upper w-[100%] pt-2 pb-1 text-[12px] max-lg:hidden ${scrollDirection === 'down' ? 'scrolled-down' : 'scrolled-up'}`}>
          <div className='flex justify-between items-center px-4'>
            <div>
              <Link to='/'><img className='border border-[#FFD700] rounded-[50%]' src='https://res.cloudinary.com/dtthdh8tb/image/upload/v1728298440/logo_erit8k.png' width={40} alt='logo' /></Link>
            </div>
            <div className='flex justify-center gap-[1.5rem]'>
              <div>
                <NavLink to='/'><span className=' text-white'>Home</span></NavLink>
              </div>
              <div>
                <NavLink to='/about'><span className=' text-white'>About us</span></NavLink>
              </div>
              <div>
                <NavLink to='/contact'><span className=' text-white'>Contact</span></NavLink>
              </div>
              <div>
                <NavLink to='/faqs'><span className=' text-white'>FAQs</span></NavLink>
              </div>
            </div>
            <div className='flex justify-center items-center gap-[1.5rem]'>
              <div className='col-3'>
                <a
                  className=' flex justify-center items-center'
                  onClick={() => {
                    loggedinOrOut(GET_NOTIFICATIONS_API_KEY, "notificationscard")
                    sendNotifications('Notifications')
                  }}
                >
                  <IoMdNotifications className='header-react-icons' />
                </a>
              </div>
              <div className='dropdown mt-[-0.38rem]'>
                <button
                  className=' btn btn-secondary dropdown-toggle  dropdown-toggle-no-caret border-none'
                  type='button'
                  id='dropdownMenuButton1'
                  data-bs-toggle='dropdown'
                  aria-expanded='false'
                >
                  <div className='flex  flex-col gap-1 justify-center items-center'>
                    <RiAccountPinBoxFill className='mobile-header-react-icons' />
                  </div>

                </button>
                <ul className='dropdown-menu' aria-labelledby='dropdownMenuButton1'>
                  <li>
                    <a
                      className='dropdown-item text-[12px]'

                      onClick={() => {
                        accountNavigate();
                        sendAccount('Account');
                      }}
                    >
                      Account
                    </a>
                  </li>
                  <li>
                    <a
                      className='dropdown-item text-[12px]'

                      onClick={() => {
                        loggedinOrOut(GET_MESSAGES_API_KEY, "conversationscard")
                        sendMessages('Messages')
                      }}
                    >
                      Messages
                    </a>
                    {Messagenotice ? <div style={{ position: 'absolute', top: '20%', right: '15%' }}>
                      <Noticemodal /></div> : null}
                  </li>
                  <li>
                    <a
                      className='dropdown-item text-[12px]'

                      onClick={() => {
                        loggedinOrOut(GET_YOURPRODUCTS_API_KEY, "yourproductscard")
                        sendYourproducts('Yourproducts')
                      }}
                    >
                      My Products
                    </a>
                  </li>
                  <li>
                    <a
                      className='dropdown-item text-[12px]'

                      onClick={() => {
                        loggedinOrOut(GET_CALLBACK_API_KEY, "callbackcard")
                        sendCallbacks('Callbacks')
                      }}
                    >
                      Callbacks
                    </a>
                  </li>
                  <li>
                    <a
                      className='dropdown-item text-[12px]'

                      onClick={() => {
                        loggedinOrOut(GET_WISHLIST_API_KEY, "wishlistcard")
                        sendWishlist('Wishlist')
                      }}
                    >
                      Wishlist
                    </a>
                  </li>

                  <li>
                    <a
                      className='dropdown-item text-[12px]'

                      onClick={() => {
                        loggedinOrOut(GET_YOURPRODUCTS_API_KEY, "yourproductscard")
                        sendMystore('Mystore')
                      }}
                    >
                      My Store
                    </a>
                  </li>

                </ul>
              </div>

              <div>
                <a onClick={loginOrOut} className='dropdown-item py-2 p-3 rounded-[40px] bg-[#FEBD69] text-bold '>
                  {accessedToken ? 'Sign Out' : 'Sign In'}
                </a>
              </div>
            </div>
          </div>
        </header>
        {signin && <div className='  border p-4'><Tokenerrormodal /></div>}
      </div>
      <div className='header-mobile container hidden max-lg:block'><Mobileheader /></div>
    </div>
  )
}

export const Miniheader = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accessedToken = JSON.parse(localStorage.getItem('userData'));


  let university = JSON.parse(localStorage.getItem("universities"));

  if (!university) {
    university = {
      label: "All Universities",
      value: "All Universities",
    };
    localStorage.setItem("universities", JSON.stringify(university));
  }


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

  const sendSearchKeyword = (searchKeyword) => dispatch({ type: 'SEND_SEARCH_KEYWORD', searchKeyword });



  const postProduct = () => {
    if (accessedToken) {
      navigate('/createproductpage')
    } else {
      navigate('/signin')
    }

  }
  return (
    <div className='container'>
      <header className='w-[100%] header-top-strip  max-lg:hidden'>
        <div className='container-xxl'>
          <div className='flex justify-between items-center py-2'>
            <div className='flex text-[10px] text-[#FEBD69] text-bold gap-[2rem] mx-[1.5rem] items-center '>
              <button onClick={postProduct} className='flex gap-1 justify-center items-center bg-black p-1.5 rounded-md sell-something-button'>
                <span>Sell on Campus</span> <IoIosAdd className='header-react-icons-add' /></button>
              <div className=' text-center'>
                <NavLink to="">
                  <span>Logistics</span></NavLink>
              </div>
              <div className=' text-center'>
                <NavLink to='/'>
                  <span>  Excro Payment</span></NavLink>
              </div>
              <div className=' text-center'>
                <NavLink to='/'>
                  <span>  Premium Services</span></NavLink>
              </div>
            </div>
            <div className='col-md-3 search-for-schools '>
            </div>
          </div>
        </div>
      </header>

    </div>
  )
}

export const Minifooter = () => {

  const [categories, setCategories] = useState([]);
  const university = JSON.parse(localStorage.getItem('universities'));

  const API_KEY = [
    { APARTMENTS_API_KEY: 'https://campusbuy-backend-nkmx.onrender.com/getproducts?category=Apartments' },
    { PHONES_API_KEY: 'https://campusbuy-backend-nkmx.onrender.com/getproducts?category=Phones' },
    { LAPTOPS_API_KEY: 'https://campusbuy-backend-nkmx.onrender.com/getproducts?category=Laptops' },
    { BAGS_API_KEY: 'https://campusbuy-backend-nkmx.onrender.com/getproducts?category=Bags' },
    { ACCESSORIES_API_KEY: 'https://campusbuy-backend-nkmx.onrender.com/getproducts?category=Accessories' },
    { HAIRS_AND_WIGS_API_KEY: 'https://campusbuy-backend-nkmx.onrender.com/getproducts?category=Hairs and Wigs' },
    { CLOTHES_API_KEY: 'https://campusbuy-backend-nkmx.onrender.com/getproducts?category=Clothes' },
  ]

  const dispatch = useDispatch()
  const getCategory = (category) => dispatch({ type: 'GET_CATEGORY', category: category })
  const returnedCategory = useSelector(state => state.category.category)





  const fetchCategories = async (categoryApi) => {
    try {
      const response = await axios.get(categoryApi);
      setCategories(response.data);
      getCategory(response.data); // Pass the updated data directly
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Handle error as needed
    }
  };


  return (
    <>
      <footer className='py-4 '>
        <div className='container'>
          <div className='row p-2 m-2'>
            <div className='col-5'>
              <div className='footer-top-data d-flex  align-items-center justify-content-center '>
                <BsSend className='text-white sender' />
                <h4 className='text-white text-sm'>Sign Up for Newsletter</h4>
              </div>
            </div>
            <div className='col-6 text-[8px]'>
              <form className='bg-white footer-top-newsletter d-flex  align-items-center '>
                <input className='input' placeholder='Enter Your Email' type='text' />
                <button><strong>Subscribe</strong></button>
              </form>
            </div>
          </div>
        </div>
      </footer>
      <footer className='py-4 text-white p-2 '>
        <div className='container'>
          <div className='row'>
            <div className='col-3 flex flex-col gap-1 text-[8px]'>
              <h4 className='text-sm'>Contact Us</h4>
              <div className=' flex flex-col gap-1'>
                <h6 className='text-[10px]'>Campusbuy Office</h6>
                <p>37b Sabibatu estate, Inside Otubu Estate, Abule-ado, Satellite-town, Lagos, Nigeria. </p>
                <p>+2348164910957, +2347042380116, +2349069412463, +2348188317279</p>
                <p>campusify2@gmail.com.com, louisjoseph131@gmail.com, udegbueconfidence@gmail.com</p>
                <div className='social-media-links d-flex align-items-center'>
                  <Link className='navbar-react-icons'><FaFacebook /></Link>
                  <Link className='navbar-react-icons'><FaInstagramSquare /></Link>
                  <Link className='navbar-react-icons'><FaXTwitter /></Link>
                  <Link className='navbar-react-icons'><FaLinkedin /></Link>
                  <Link className='navbar-react-icons'><FaWhatsappSquare /></Link>
                </div>
              </div>
            </div>
            <div className='col-2 flex flex-col gap-1'>
              <h4 className='text-sm'>Our Policy</h4>
              <div className='flex flex-col gap-1 text-[8px]'>
                <p> <Link className='text-white' href='#'>Privacy policy</Link></p>
                <p> <Link className='text-white' href='#'>Shipping policy</Link></p>
                <p> <Link className='text-white' href='#'>Payment policy</Link></p>
                <p> <Link className='text-white' href='#'>Cookie policy</Link></p>
                <p> <Link className='text-white' href='#'>Copyright Infringement policy</Link></p>
                <p> <Link className='text-white' href='#'>Terms of Service </Link></p>
                <p> <Link className='text-white' href='#'>Blog </Link></p>
              </div>
            </div>
            <div className='col-2 flex flex-col gap-1'>
              <h4 className='text-sm'>Account</h4>
              <div className='flex flex-col gap-1 text-[8px]'>
                <p><NavLink className='text-white' href='#'>Search</NavLink></p>
                <p><NavLink className='text-white' href='#'>About Us</NavLink></p>
                <p><NavLink to='/faqs' className='text-white' href='#'>FAQs</NavLink></p>
                <p><NavLink className='text-white' href='#'>Contact</NavLink></p>
                <p><NavLink className='text-white' href='#'>Safety Tips</NavLink></p>
              </div>
            </div>
            <div className='col-2 flex flex-col gap-1'>
              <h4 className='text-sm'>Quick Links</h4>
              <div className='flex flex-col gap-1 text-[8px]'>
                <p><NavLink onClick={() => {
                  fetchCategories(API_KEY[0].APARTMENTS_API_KEY)
                }} className='text-white' href='#'>Apartments</NavLink></p>
                <p><NavLink onClick={() => {
                  fetchCategories(API_KEY[1].ACCESSORIES_API_KEY)
                }} className='text-white' href='#'>Accessories</NavLink></p>
                <p><NavLink onClick={() => {
                  fetchCategories(API_KEY[2].PHONES_API_KEY)
                }} className='text-white' href='#'>Phones</NavLink></p>
                <p><NavLink onClick={() => {
                  fetchCategories(API_KEY[3].BAGS_API_KEY)
                }} className='text-white' href='#'>Bags</NavLink></p>
                <p><NavLink onClick={() => {
                  fetchCategories(API_KEY[4].CLOTHES_API_KEY)
                }} className='text-white' href='#'>Clothes</NavLink></p>
                <p><NavLink onClick={() => {
                  fetchCategories(API_KEY[5].LAPTOPS_API_KEY)
                }} className='text-white' href='#'>Laptops</NavLink></p>
                <p><NavLink onClick={() => {
                  fetchCategories(API_KEY[6].HAIRS_AND_WIGS_API_KEY)
                }} className='text-white' href='#'>Hair and Wigs</NavLink></p>
              </div>
            </div>
            <div className='col-3 flex flex-col gap-1'>
              <h4 className='text-sm'>Our App</h4>
              <div className='text-[8px]'>
                <p>Download our app for convenience in finding products, contacting buyers and getting daily notifications on your favorite products.</p>
                <div className='social-media-links d-flex align-items-center'>
                  <Link className='navbar-react-icons'><FaAppStoreIos /></Link>
                  <Link className='navbar-react-icons'><IoLogoGooglePlaystore /></Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <footer className='py-4 '>
        <div className='container'>
          <div className='row'>
            <div className='col-12'>
              <p className='text-center mb-0 text-white text-[8px]'>
                &copy; {new Date().getFullYear()}; Powered by Campusbuy.Inc(" ")
              </p>
            </div>
          </div>
        </div>
      </footer>
      <footer className='mobile-footer w-[100%] hidden max-lg:block bg-[#232f3e] shadow-md shadow-[#3b4149]'>
        <div className="upper-mobile-links flex gap-2 m-2 p-1 justify-between items-center">
          <div><NavLink to='/' className='flex  flex-col gap-1 justify-center items-center'><MdHome className='mobile-footer-react-icons' />  <span className='text-white text-[10px]'>  Home</span></NavLink></div>
          <div><NavLink to='/faqs' className='flex  flex-col gap-1 justify-center items-center'><BsFillQuestionCircleFill className='mobile-footer-react-icons' />  <span className='text-white text-[10px]'>  FAQs</span></NavLink></div>
          <div><NavLink to='/about' className='flex  flex-col gap-1 justify-center items-center'><TbWorld className='mobile-footer-react-icons' />  <span className='text-white text-[10px]'>  About</span></NavLink></div>
          <div><NavLink to='/contact' className='flex  flex-col gap-1 justify-center items-center'><MdAddIcCall className='mobile-footer-react-icons' />  <span className='text-white text-[10px]'>  Contact</span></NavLink></div>
        </div>
      </footer>
    </>
  )
}

export const Firstheader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const accessedToken = JSON.parse(localStorage.getItem('userData'));


  let university = JSON.parse(localStorage.getItem("universities"));

  if (!university) {
    university = {
      label: "All Universities",
      value: "All Universities",
    };
    localStorage.setItem("universities", JSON.stringify(university));
  }


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

  const GET_WISHLIST_API_KEY = "https://campusbuy-backend-nkmx.onrender.com/getwishlist";
  const GET_NOTIFICATIONS_API_KEY = "https://campusbuy-backend-nkmx.onrender.com/getnotification";
  const GET_MESSAGES_API_KEY = "https://campusbuy-backend-nkmx.onrender.com/getconversations";
  const GET_CALLBACK_API_KEY = "https://campusbuy-backend-nkmx.onrender.com/getcallback";
  const GET_YOURPRODUCTS_API_KEY = "https://campusbuy-backend-nkmx.onrender.com/getyourproduct";

  useEffect(() => {
    const getApis = async () => {
      try {
        if (accessedToken && accessedToken.accessToken) {
          const yourReferrals = await axiosInstance.get("https://campusbuy-backend-nkmx.onrender.com/getyourreferrals");
          localStorage.setItem('referrals', JSON.stringify(yourReferrals.data));
        }
      } catch (error) {
        console.error('Error getting APIs:', error);
      }
    };
    getApis();
  }, []);





  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const sendSearchKeyword = (searchKeyword) => dispatch({ type: 'SEND_SEARCH_KEYWORD', searchKeyword });

  const moveForward = async (e) => {
    e.preventDefault();
    const SEARCH_API_KEY = `https://campusbuy-backend-nkmx.onrender.com/searchproducts?university=${university.value}&search=${searchValue}`;
    const SEARCH_API_KEYS = `https://campusbuy-backend-nkmx.onrender.com/searchproducts?search=${searchValue}`;

    try {
      if (!searchValue) {
        navigate("#")
      } else {
        const response = await axios.get(university.value === "All Universities" ? SEARCH_API_KEYS : SEARCH_API_KEY);
        await sendSearchKeyword(searchValue);
        await localStorage.setItem('searchkeyword', JSON.stringify(searchValue));


        await localStorage.setItem('searchedproducts', JSON.stringify(response.data.data));
        navigate(`/search/${university.value}/${searchValue}`)
      };

    } catch (error) {
      console.error('Error moving forward:', error);
      alert("No product found!")
    }
  };



  const postProduct = () => {
    if (accessedToken) {
      navigate('/createproductpage')
    } else {
      navigate('/signin')
    }

  }


  const Signout = async () => {
    try {
      await localStorage.removeItem('userData');
      await localStorage.removeItem('wishlistcard');
      await localStorage.removeItem('notificationscard');
      await localStorage.removeItem('yourproductscard');
      await localStorage.removeItem('conversationscard');
      await localStorage.removeItem('callbackcard');
      await localStorage.removeItem('usercard');

      navigate('/');
    } catch (error) {
      console.error('Error signing out Account:', error);
    }

  }






  const accountNavigate = async () => {
    try {
      if (accessedToken) {
        // Check if 'id' property exists in accessedToken before navigating
        if (accessedToken.id ? accessedToken.id : accessedToken._id) {
          navigate(`/mainpage/${accessedToken.id ? accessedToken.id : accessedToken._id}`);
        } else {
          console.error('Error navigating to Your Account: Invalid accessedToken');
        }
      } else {
        navigate('/signin');
      }
    } catch (error) {
      console.error('Error navigating to Your Account:', error);
    }
  };


  const loggedinOrOut = async (API, store) => {
    try {
      if (accessedToken) {
        const response = await axiosInstance.get(API);

        await localStorage.setItem(store, JSON.stringify(response.data));
        navigate(`/mainpage/${accessedToken.id ? accessedToken.id : accessedToken._id}`);
      } else {
        navigate('/signin');
      }
    } catch (error) {
      console.error('Error navigating to Your Account:', error);
    }
  };

  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    if (selectedOption) {
      trendingProducts();
    }
  }, [selectedOption]);

  const trendingProducts = async () => {
    try {
      const TRENDING_PRODUCTS_API_KEY = `https://campusbuy-backend-nkmx.onrender.com/getproducts?university=${selectedOption.value}&premiumServices=true`;
      const ALL_TRENDING_PRODUCTS_API_KEY = 'https://campusbuy-backend-nkmx.onrender.com/getpremiumlatestproducts';

      const response = await axios.get(selectedOption.value === "All Universities" ? ALL_TRENDING_PRODUCTS_API_KEY : TRENDING_PRODUCTS_API_KEY);

      if (response.data) {
        await localStorage.setItem('trendingproducts', JSON.stringify(response.data.data));
        console.log(response.data)
        window.location.reload(); // Reload the page after updating localStorage
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        localStorage.removeItem('trendingproducts');
      } else {
        console.error('Error fetching trending products:', error);
      }
    }
  };

  const changeSchool = (selectedOption) => {
    if (selectedOption) {
      setSelectedOption(selectedOption);
      localStorage.setItem("universities", JSON.stringify(selectedOption));
    } else {
      localStorage.setItem("universities", JSON.stringify({
        label: "All Universities",
        value: "All Universities",
      }));
    }
  };

  const customStyles = {
    placeholder: (provided) => ({
      ...provided,
      color: '#FEBD69',
      fontWeight: 'bold',
    }),
    control: (provided) => ({
      ...provided,
      borderColor: 'black',
      borderWidth: 2,
      borderRadius: '0.375rem', // rounded-md equivalent
    }),
  };
  const sendWishlist = (activePage) => dispatch({ type: 'GET_ACTIVEPAGE', activePage });
  const sendNotifications = (activePage) => dispatch({ type: 'GET_ACTIVEPAGE', activePage });
  const sendAccount = (activePage) => dispatch({ type: 'GET_ACTIVEPAGE', activePage });
  const sendMessages = (activePage) => dispatch({ type: 'GET_ACTIVEPAGE', activePage });
  const sendYourproducts = (activePage) => dispatch({ type: 'GET_ACTIVEPAGE', activePage });
  const sendCallbacks = (activePage) => dispatch({ type: 'GET_ACTIVEPAGE', activePage });


  return (
    <header className='w-[100%] header-top-strip  max-lg:hidden'>
      <div className='container-xxl'>
        <div className='flex justify-between items-center py-2'>
          <div className='flex text-[10px] text-[#FEBD69] text-bold gap-[2rem] mx-[1.5rem] items-center '>
            <button onClick={postProduct} className='flex gap-1 justify-center items-center bg-black p-1.5 rounded-md sell-something-button'>
              <span>Sell on Campus</span> <IoIosAdd className='header-react-icons-add' /></button>
            <div className=' text-center'>
              <NavLink to="">
                <span>Logistics</span></NavLink>
            </div>
            <div className=' text-center'>
              <NavLink to='/'>
                <span>  Excro Payment</span></NavLink>
            </div>
            <div className=' text-center'>
              <NavLink to='/'>
                <span>  Premium Services</span></NavLink>
            </div>
          </div>
          <div className='col-md-3 search-for-schools '>
            <div className="search-container flex w-[100%]">
              <Select
                className='w-[100%] rounded-md border-2 border-black'
                value={selectedOption ? selectedOption : university.value}
                onChange={changeSchool}
                options={universities.map((university) => ({
                  value: university.title,
                  label: university.title,
                }))}
                placeholder={selectedOption ? selectedOption : university.value}
                isClearable
                styles={customStyles}
              />

            </div>
          </div>
        </div>
      </div>
    </header>
  )
}



export const Mobileheader = () => {
  const [scrollDirection, setScrollDirection] = useState('up');
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [signin, setSignin] = useState(false);
  const [nav, setNav] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Move the declaration of 'university' above its usage
  const accessedToken = JSON.parse(localStorage.getItem('userData'));
  const unreadcallback = JSON.parse(localStorage.getItem("unreadcallback"));
  const Messagenotice = JSON.parse(localStorage.getItem("unreadmessage"));
  const unreadnotification = JSON.parse(localStorage.getItem("unreadnotification"));
  const getSearchInputs = JSON.parse(localStorage.getItem("searchinputs"));




  const openNav = () => {
    setNav(true)
  }
  const closeNav = () => {
    setNav(false)
  }
  const openLoading = () => {
    setLoading(true)
  }
  const closeLoading = () => {
    setLoading(false)
  }

  let university = JSON.parse(localStorage.getItem("universities"));

  if (!university) {
    university = {
      label: "All Universities",
      value: "All Universities",
    };
    localStorage.setItem("universities", JSON.stringify(university));
  }

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

  const GET_WISHLIST_API_KEY = "https://campusbuy-backend-nkmx.onrender.com/getwishlist";
  const GET_NOTIFICATIONS_API_KEY = "https://campusbuy-backend-nkmx.onrender.com/getnotification";
  const GET_MESSAGES_API_KEY = "https://campusbuy-backend-nkmx.onrender.com/getconversations";
  const GET_CALLBACK_API_KEY = "https://campusbuy-backend-nkmx.onrender.com/getcallback";
  const GET_YOURPRODUCTS_API_KEY = "https://campusbuy-backend-nkmx.onrender.com/getyourproduct";

  useEffect(() => {
    const getApis = async () => {
      try {
        if (accessedToken && accessedToken.accessToken) {
          const yourReferrals = await axiosInstance.get("https://campusbuy-backend-nkmx.onrender.com/getyourreferrals");
          localStorage.setItem('referrals', JSON.stringify(yourReferrals.data));
        }
      } catch (error) {
        console.error('Error getting APIs:', error);
      }
    };
    getApis();
  }, []);





  const handleScroll = () => {
    const currentScrollPos = document.documentElement.scrollTop;

    if (currentScrollPos > prevScrollPos) {
      setScrollDirection('down');
    } else {
      setScrollDirection('up');
    }

    setPrevScrollPos(currentScrollPos);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);


  const postProduct = async () => {
    if (accessedToken) {
      navigate('/createproductpage')
    } else {
      await setSignin(true);
      setTimeout(() => {
        navigate('/signin')
        setSignin(false);
      }, 3000);
    }

  }





  const Signout = async () => {
    try {
      await localStorage.removeItem('userData');
      await localStorage.removeItem('wishlistcard');
      await localStorage.removeItem('notificationscard');
      await localStorage.removeItem('yourproductscard');
      await localStorage.removeItem('conversationscard');
      await localStorage.removeItem('newmessage');
      await localStorage.removeItem('callbackcard');
      await localStorage.removeItem('usercard');

      navigate('/');
    } catch (error) {
      console.error('Error signing out Account:', error);
    }

  }

  const loginOrOut = () => {
    if (accessedToken) {
      Signout();
    } else {
      navigate('/signin')
    }
  }



  const handleInputChange = (newValue) => {
    setSearchValue(newValue);
  };

  const handleOptionSelect = (newValue) => {
    setSearchValue(newValue?.label || '');
    setSelectedOption(newValue);
  };



  const [filteredInputs, setFilteredInputs] = useState([]);

  const handleSearchChange = (newValue, actionMeta) => {
    if (actionMeta.action === 'input-change') {
      setSearchValue(newValue);
    } else if (actionMeta.action === 'select-option') {
      setSearchValue(newValue.label);
      setSelectedOption(newValue);
    }
  };

  const sendSearchKeyword = (searchKeyword) => dispatch({ type: 'SEND_SEARCH_KEYWORD', searchKeyword });
  const moveForward = async () => {
    const SEARCH_API_KEY = `https://campusbuy-backend-nkmx.onrender.com/searchproducts?university=${university.value}&search=${searchValue}`;
    const SEARCH_API_KEYS = `https://campusbuy-backend-nkmx.onrender.com/searchproducts?search=${searchValue}`;
    try {
      if (!searchValue) {
        navigate("#")
      } else {
        openLoading()
        const response = await axios.get(university.value === "All Universities" ? SEARCH_API_KEYS : SEARCH_API_KEY);
        setSearchValue('');
        setSelectedOption(null);
        if (response.data) {
          closeLoading()
        }
        await sendSearchKeyword(searchValue);
        await localStorage.setItem('searchkeyword', JSON.stringify(searchValue));


        await localStorage.setItem('searchedproducts', JSON.stringify(response.data.data));
        navigate(`/search/${university.value}/${searchValue}`)
        window.location.reload(); // Reload if no search value

      };

    } catch (error) {
      closeLoading()
      console.error('Error moving forward:', error);
      alert("No product found!")
    }
  };
  useEffect(() => {
    if (searchValue) {
      const filtered = getSearchInputs.filter(input =>
        input.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredInputs(filtered.map(input => ({ value: input, label: input })));
    } else {
      setFilteredInputs([]);
    }
  }, [searchValue, getSearchInputs]);

  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    if (selectedOption) {
      trendingProducts();
    }
  }, [selectedOption]);

  const trendingProducts = async () => {
    try {
      const TRENDING_PRODUCTS_API_KEY = `https://campusbuy-backend-nkmx.onrender.com/getproducts?university=${selectedOption.value}&premiumServices=true`;
      const ALL_TRENDING_PRODUCTS_API_KEY = 'https://campusbuy-backend-nkmx.onrender.com/getpremiumlatestproducts';

      const response = await axios.get(selectedOption.value === "All Universities" ? ALL_TRENDING_PRODUCTS_API_KEY : TRENDING_PRODUCTS_API_KEY);

      if (response.data) {
        await localStorage.setItem('trendingproducts', JSON.stringify(response.data.data));
        console.log(response.data)
        window.location.reload(); // Reload the page after updating localStorage
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        localStorage.removeItem('trendingproducts');
      } else {
        console.error('Error fetching trending products:', error);
      }
    }
  };

  const changeSchool = (selectedOption) => {
    if (selectedOption) {
      setSelectedOption(selectedOption);
      localStorage.setItem("universities", JSON.stringify(selectedOption));
    } else {
      localStorage.setItem("universities", JSON.stringify({
        label: "All Universities",
        value: "All Universities",
      }));
    }
  };

  const customStyles = {
    placeholder: (provided) => ({
      ...provided,
      color: '#FEBD69',
      fontWeight: 'bold',
      fontSize: '12px',
    }),
    control: (provided) => ({
      ...provided,
      borderColor: 'black',
      borderWidth: 2,
      borderRadius: '0.375rem', // rounded-md equivalent
    }),
  };

  return (
    <div className=" w-[100%] ">
      <header className='container upper-mobile-nav text-[12px] bg-black'>
        <div className='flex justify-between items-center  py-2 w-[100%]'>
          <button onClick={postProduct} className='text-[8px] text-[#FEBD69] py-2 rounded-sm sell-something-button text-bold text-[#FEBD69]'>Sell Something</button>
          <div className="search-container flex w-[55%] text-[12px]">
            <Select
              className='w-[100%] rounded-md border-2 border-white'
              value={selectedOption ? selectedOption : university.value}
              onChange={changeSchool}
              options={universities.map((university) => ({
                value: university.title,
                label: university.title,
              }))}
              placeholder={selectedOption ? selectedOption : university.value}
              isClearable
              styles={customStyles}
            />
          </div>
          <div>
            <a onClick={loginOrOut} className='dropdown-item p-2  rounded-[10px] bg-[#FEBD69] text-8px '>
              {accessedToken ? 'Sign Out' : 'Sign In'}
            </a>
          </div>
        </div>
      </header>
      <header className={`container middle-mobile-nav w-[100%] text-[12px] ${scrollDirection === 'down' ? 'scrolled-down' : 'scrolled-up'}`}>
        <div className='flex justify-between items-center px-1'>
          <div>
            <Link to='/'><img className='border border-[#FFD700] rounded-[50%]' src='https://res.cloudinary.com/dtthdh8tb/image/upload/v1728298440/logo_erit8k.png' width={40} alt='logo' /></Link>
          </div>
          <div className=' w-[70%] search-for-schools '>
            <div>
              <div className='text-bold  w-full'>
                <div className='flex items-center justify-center w-full search-bar'>
                  <form onSubmit={moveForward} className='flex text-black items-center w-[85%] max-lg:text-[12px]'>
                    <Select
                      className='search-input'
                      value={selectedOption}
                      options={filteredInputs}
                      onInputChange={handleSearchChange}
                      onChange={handleSearchChange}
                      placeholder="Search for Products or Services"
                      isClearable
                      openMenuOnClick={false}
                      openMenuOnFocus={false}
                    />
                  </form>
                  <button onClick={moveForward} type="submit" className='w-[15%] text-center px-[1rem] py-[0.6rem] sell-something-button bg-black' id='basic-addon2' disabled={!searchValue}>
                    {loading ? (<div><BigLoader /></div>) : (<BsSearch className='header-react-icons-add' />)}
                  </button>
                </div>
              </div>
            </div>

          </div>
          <div className='flex justify-center items-center gap-[1.5rem]'>
            <IoMenu onClick={openNav} className='header-react-icons' />

          </div>
        </div>
      </header>
      <div className='  border p-4'>{signin && <Tokenerrormodal />}</div>
      <div className='w-[40%] rounded-md ' style={{ position: 'fixed', top: '10%', left: '60%', zIndex: '4000' }}>{nav && <Nav closeModal={closeNav} />}</div>
      <div style={{ position: "fixed", top: "40%", left: "40%" }}>
        {loading && <div className='loading-modal flex flex-col justify-center items-center'><Loading type="spin" color="#FFFFFF" height={30} width={30} />
          <p style={{ color: 'white', marginTop: '8px' }}>Please wait...</p>
        </div>}
      </div>
    </div>
  );
};