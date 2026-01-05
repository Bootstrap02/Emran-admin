import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { RiAccountPinBoxFill } from "react-icons/ri";
import { IoMenu } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import { MdOutlineHelp } from "react-icons/md";
import Loading from 'react-loading';
import { IoMdCloudDone } from "react-icons/io";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 
import Select from 'react-select';
import { universities } from "../Constants/Universities";
import { GeneralNoticemodal } from './Productmodals';
import { Tokenerrormodal } from "../Modals/Forms";


const Navbar = ({openNav, closeNav}) => {
  const [scrollDirection, setScrollDirection] = useState('up');
const [prevScrollPos, setPrevScrollPos] = useState(0);
const [signin, setSignin] = useState(false);
const [loading, setLoading] = useState(false);
const navigate = useNavigate();
const dispatch = useDispatch();
// Move the declaration of 'university' above its usage
const accessedToken = JSON.parse(localStorage.getItem('userData'));
const Messagenotice = JSON.parse(localStorage.getItem('unreadmessage'));
const unreadcallback = JSON.parse(localStorage.getItem("unreadcallback"));
  const unreadnotification = JSON.parse(localStorage.getItem("unreadnotification"));
 
  
  const openLoading = ()=>{
    setLoading(true)
  }
  const closeLoading = ()=>{
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
  if (accessedToken && accessedToken.accessToken){
    setAuthToken(accessedToken.accessToken);
  }  
  // Now, you can use axiosInstance for your requests with the token included in the headers
  

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
  
 
 

   const Signout= async() => {
    try{
     await localStorage.removeItem('userData');
     await localStorage.removeItem('wishlistcard');
     await localStorage.removeItem('notificationscard');
     await localStorage.removeItem('yourproductscard');
     await localStorage.removeItem('conversationscard');
     await localStorage.removeItem('newmessage');
     await localStorage.removeItem('callbackcard');
     await localStorage.removeItem('usercard');
     
      navigate('/');
}catch (error){
      console.error('Error signing out Account:', error);
    }
    
  }

  const loginOrOut = () =>{
    if(accessedToken){
      Signout();
  }else{
    navigate('/signin')
  }
}


 const [selectedOption, setSelectedOption] = useState(null);

useEffect(() => {
  if (selectedOption) {
    trendingProducts();
  }
}, [selectedOption]);
useEffect(() => {
  const Getsearchinputs= async()=> {
    const response = await axios.get("https://campusbuy-backend-nkmx.onrender.com/getsearchinputs");
      localStorage.setItem('searchinputs', JSON.stringify(response.data));
  }
  Getsearchinputs();
}, []);

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
    localStorage.setItem("universities", JSON.stringify({label:"All Universities", value:"All Universities"}));
  }
};

const customStyles = {
  placeholder: (provided) => ({
    ...provided,
    color: '#FEBD69', // Soft initial color
    fontWeight: 'bold', // Start with normal weight
    fontSize: '10px', // Default size
  }),
  control: (provided) => ({
    ...provided,
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: '0.375rem',
  }),
};


  
  return (
    <div className=" w-[100%] ">
        <header className='upper-mobile-nav w-[100%] flex items-center justify-between text-[12px] gap-2 bg-black'>
        <div className='flex justify-between items-center justify-between py-2 px-4 w-[100%]'>
          <div className='flex text-[10px] text-[#FEBD69] text-bold justify-between  items-center w-[70%] '>
            <NavLink to= ""><span>Logistics</span></NavLink>
            <NavLink to='/'><span>  Excro Payment</span></NavLink>
            <NavLink to='/'><span>  Premium Services</span></NavLink>
            </div>
            <div>
      <a onClick={loginOrOut} className='dropdown-item p-2  rounded-[10px] bg-[#FEBD69] text-8px '>
             {accessedToken ? 'Sign Out' : 'Sign In'}
         </a>
       </div>
      </div>
        </header>
        <header className={`middle-mobile-nav w-[100%] text-[12px] ${scrollDirection === 'down' ? 'scrolled-down' : 'scrolled-up'}`}>
      <div className='flex justify-between items-center px-4'>
        <div>
          <Link to='/'><img className='border border-[#FFD700] rounded-[50%]' src='https://res.cloudinary.com/dtthdh8tb/image/upload/v1728298440/logo_erit8k.png' width={40} alt='logo'/></Link>
        </div>
        <div className=' w-[60%] search-for-schools '>
          <div className="search-container flex w-[100%]">
          <Select
  className='w-[100%] rounded-md border-2 border-black'
  value={selectedOption? selectedOption : university.value}
  onChange={changeSchool}
  options={universities.map((university) => ({
    value: university.title,
    label: university.title,
  }))}
  placeholder={selectedOption? selectedOption : university.value}
    isClearable 
    styles={customStyles}
/>
          </div>
        </div>
   <div className='flex justify-center items-center gap-[1.5rem]'>
   <IoMenu  onClick={openNav} className='navbar-react-icons' />
      </div>
      </div>
      </header>
      {signin && <div className='  border p-4'> <Tokenerrormodal/></div>}

      <div  style={{position: "fixed", top: "40%", left:"40%"}}>
 {loading && <div className='loading-modal flex flex-col justify-center items-center'><Loading type="spin" color="#FFFFFF" height={30} width={30} />
    <p style={{ color: 'white', marginTop: '8px' }}>Please wait...</p>
  </div>}
</div>
    </div>
  );
};

export default Navbar;
