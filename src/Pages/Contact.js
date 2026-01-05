import React, { useState } from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import axios from 'axios';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { BigLoader } from '../Modals/Loaders';
import { FaFacebook } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { FaWhatsappSquare } from "react-icons/fa";
import Nav from '../Modals/General/Nav';


const Contact = () => {
  const navigate = useNavigate();
  const [signin, setSignin] = useState(false);
  const [sendMessageModals, setSendMessageModals] = useState(false);
  const [sendMessageErrorModals, setSendMessageErrorModals] = useState(false);
  const [sendMessageOrAds, setSendMessageOrAds] = useState(true);
  const [loading, setLoading] = useState(false); // Add loading state
  const [buttonLoading, setButtonLoading] = useState(false); // Add button loading state
  const SEND_MESSAGE_API_KEY = 'https://campusbuy-backend-nkmx.onrender.com/contactus';
    const [nav, setNav] = useState(false);

  const openLoading = () => {
    setLoading(true);
  };
  const closeLoading = () => {
    setLoading(false);
  };
  const openNav = () => {
    setNav(true);
  };
  const closeNav = () => {
    setNav(false);
  };
  const openSignin = () => {
    setSignin(true);
  };
  const closeSignin = () => {
    setSignin(false);
  };

  const openSendMessageModal = () => {
    setSendMessageModals(true);
  };
  const closeSendMessageModal = () => {
    setSendMessageModals(false);
  };
  const openSendMessageErrorModal = () => {
    setSendMessageErrorModals(true);
  };
  const closeSendMessageErrorModal = () => {
    setSendMessageErrorModals(false);
  };

  const storedUserData = JSON.parse(localStorage.getItem('userData')); 
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
  if (storedUserData && storedUserData.accessToken){
    setAuthToken(storedUserData.accessToken);
  }

  const sendMessage = async (e) => {
    e.preventDefault();
    try {
      openLoading(); // Set loading to true when starting the request
      setButtonLoading(true); // Set button loading to true when starting the request

      // Check if any required field is empty
      const requiredFields = ['name', 'email', 'message'];
      const formData = new FormData(e.target);
      let hasEmptyField = false;
  
      requiredFields.forEach((field) => {
        if (!formData.get(field)) {
          hasEmptyField = true;
          return;
        }
      });
  
      if (hasEmptyField) {
        // Display an alert for empty required fields
        alert('Please fill in all required fields.');
        return;
      }
  
      // If no empty required fields, proceed with API call
      const userData = {};
      formData.forEach((value, key) => {
        userData[key] = value;
      });
      if (storedUserData && storedUserData.accessToken){
        const response = await axiosInstance.post(SEND_MESSAGE_API_KEY, userData);
        if (response.data) {
          openSendMessageModal();
          e.target.reset();
    
          setTimeout(() => {
            closeSendMessageModal();
          }, 3000);
        } 
      }else{
        await openSignin();
        setTimeout(() => {
          navigate('/signin')
          closeSignin();
        }, 3000);
      }
      
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          openSendMessageErrorModal(true);
          setTimeout(() => {
            closeSendMessageErrorModal();
          }, 3000);
        } else {
          alert('Connection error. Please refresh your network');
        }
      } else {
        alert('Connection error. Please refresh your network');
        console.error('Error creating Account:', error);
      }
    } finally {
      closeLoading(); // Set loading to false after the request (whether success or failure)
      setButtonLoading(false); // Set button loading to false after the request (whether success or failure)
    }
  };

  const openAds = () => {
    // Open the external ad link in a new tab using window.open()
    setSendMessageOrAds(false)
    window.open('https://psolsumoo.net/4/8022756', '_blank');
  };
  return (
    <div className='w-[100] bg-black'>
      <Header className='mb-[2rem] bg-[#171717]' openNav={openNav} closeNav={closeNav}/>
      <div className='w-[100%] bg-[#171717] p-4'>
        <div className='my-[2rem] max-lg:mt-[4rem] py-[2rem] text-white '>
          <div className=' text-2xl text-center mb-6'> <p><strong>Contact</strong></p></div>
          <div className=' flex justify-center gap-2'>
            <NavLink to='/'>Home ||</NavLink> 
            <NavLink to='/contact'>Contact</NavLink>
          </div>
        </div>
        
      </div>
      <div className='max-lg:hidden'>

      <div className='bg-black p-4 flex justify-between'>
        <form onSubmit={sendMessage} className='p-1  w-[30%] flex flex-col gap-[1.5rem] mt-[1rem]'>
          <div className='flex flex-col gap-1 text-[12px]'>
            <input type='text' name='firstname' className='p-2 rounded-[4px] contact-border' required placeholder='Your Name'/>
          </div>
          <div className='flex flex-col gap-1 text-[12px]'>
            <input type='text' name='email' className='p-2 rounded-[4px] contact-border' required placeholder='Email Address'/>
          </div>
          <div className='flex flex-col gap-1 text-[12px]'>
            <textarea name='message' className='p-2 w-[100%] rounded-[6px] contact-border' required placeholder='Please enter your message'/>
          </div>
          <button type="submit" className='p-2 inline-block w-full rounded-[6px] mt-2 bg-black contact-button text-[#FFB04A]'>
            {buttonLoading ? (
              <div>
                <BigLoader/>
              </div>
            ) : (
              'Submit'
            )}
          </button>
        </form>
        <div>
          <div className='flex items-center justify-between w-[60%] m-4'>
          <Link className='navbar-react-icons'><FaFacebook /></Link>
             <Link className='navbar-react-icons'><FaInstagramSquare /></Link>
             <Link className='navbar-react-icons'><FaXTwitter /></Link>
             <Link className='navbar-react-icons'><FaLinkedin /></Link>
             <Link className='navbar-react-icons'><FaWhatsappSquare /></Link>
          </div>
          <div>
            <div className=' flex flex-col gap-6'>
              <p className='text-sm text-white'>37b Sabibatu estate, Inside Otubu Estate, Abule-ado, Satellite-town, Lagos, Nigeria. </p>
              <p className='text-sm text-white'>+2348164910957, +2347042380116, +2349069412463, +2348188317279</p>
              <p className='text-sm text-white'>campusify2@gmail.com.com, louisjoseph131@gmail.com, udegbueconfidence@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
      <div className='flex gap-4 items-center justify-center mt-4'>
        <div>
          <Link to='/'><img className='border border-[#FFD700] rounded-[50%]' src='https://res.cloudinary.com/dtthdh8tb/image/upload/v1728298440/logo_erit8k.png' width={40} alt='logo'/></Link>
        </div>
        <div>
          <NavLink to='/about'><span className='text-white'>About</span></NavLink>
        </div>
        |
        <div>
          <NavLink to='/contact'><span className='text-white'>Contact</span></NavLink>
        </div>
        <div className='flex p-4 m-4 w-[60%] gap-2 items-center justify-center'>
          <div className=''>
            <div className='footer-top-data d-flex align-items-center justify-content-center'>
              <p className='text-white'>Sign Up for Newsletter</p>
            </div>
          </div>
          <div className='w-[60%]'>
            <form className='bg-white footer-top-newsletter d-flex align-items-center'>
              <input className='input' placeholder='Enter Your Email' type='text' />
              <button className='bg-[#FFD700]'><strong>Subscribe</strong></button>
            </form>
          </div>
        </div>
      </div>
      </div>



      <div className='container hidden max-lg:block'>
      
      <div className='bg-black p-4 flex flex-col '>
        <form onSubmit={sendMessage} className='p-1  flex flex-col gap-[1.5rem] m-[1rem] items-start'>
          <div className='flex flex-col gap-1 text-[12px] w-full'>
            <input type='text' name='firstname' className='p-2 rounded-[4px] contact-border' required placeholder='Your Name'/>
          </div>
          <div className='flex flex-col gap-1 text-[12px] w-full'>
            <input type='text' name='email' className='p-2 rounded-[4px] contact-border' required placeholder='Email Address'/>
          </div>
          <div className='flex flex-col gap-1 text-[12px] w-full'>
            <textarea name='message' className='p-2 w-[100%] rounded-[6px] contact-border' required placeholder='Please enter your message'/>
          </div>
          <button type="submit" className='p-2 inline-block w-full rounded-[6px] mt-2 bg-black contact-button text-[#FFB04A]'>
            {buttonLoading ? (
              <div>
                <BigLoader/>
              </div>
            ) : (
              'Submit'
            )}
          </button>
        </form>
        <div className='container'>
          <div className='flex items-center justify-between m-4'>
          <Link className='navbar-react-icons'><FaFacebook /></Link>
             <Link className='navbar-react-icons'><FaInstagramSquare /></Link>
             <Link className='navbar-react-icons'><FaXTwitter /></Link>
             <Link className='navbar-react-icons'><FaLinkedin /></Link>
             <Link className='navbar-react-icons'><FaWhatsappSquare /></Link>
          </div>
          <div>
            <div className=' flex flex-col gap-6'>
              <p className='text-sm text-white'>37b Sabibatu estate, Inside Otubu Estate, Abule-ado, Satellite-town, Lagos, Nigeria. </p>
              <p className='text-sm text-white'>+2348164910957, +2347042380116, +2349069412463, +2348188317279</p>
              <p className='text-sm text-white'>campusify2@gmail.com.com, louisjoseph131@gmail.com, udegbueconfidence@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
      <div className=' mt-4'>
        <div className=" flex gap-4 items-center justify-center">
        <div>
          <Link to='/'><img className='border border-[#FFD700] rounded-[50%]' src='https://res.cloudinary.com/dtthdh8tb/image/upload/v1728298440/logo_erit8k.png' width={40} alt='logo'/></Link>
        </div>
        <div>
          <NavLink to='/about'><span className='text-white'>About</span></NavLink>
        </div>
        <div>
          <NavLink to='/contact'><span className='text-white'>Contact</span></NavLink>
        </div>
        </div>        
      </div>
      </div>
      <div className={`nav-slide ${nav ? 'open' : ''}`}>
  <Nav closeModal={closeNav} setSignin={setSignin}/>
</div>
      <div><Footer/></div>
    </div>
  );
};

export default Contact;
