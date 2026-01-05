import React from "react";
import { MdCancel } from "react-icons/md";
import { useDispatch } from "react-redux";
import axios from 'axios';
import { Noticemodal, AllNoticemodal } from '../../Components/Productmodals';
import { Link, NavLink, useNavigate } from "react-router-dom";


const Nav = ({ closeModal, setSignin }) => {
  const dispatch= useDispatch();
  const navigate= useNavigate();

  const handleCloseClick = (e) => {
    e.stopPropagation(); // Prevent event propagation to parent elements
    closeModal(); // Close the modal
  };
  const accessedToken = JSON.parse(localStorage.getItem('userData'));
const Messagenotice = JSON.parse(localStorage.getItem('messagenotice'));
const Unreadcallback = JSON.parse(localStorage.getItem('unreadcallback'));
const Unreadmessage = JSON.parse(localStorage.getItem('unreadmessage'));
const Unreadnotification = JSON.parse(localStorage.getItem('unreadnotification'));


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
  
const GET_WISHLIST_API_KEY= "https://campusbuy-backend-nkmx.onrender.com/getwishlist";  
const GET_NOTIFICATIONS_API_KEY= "https://campusbuy-backend-nkmx.onrender.com/getnotification";
const GET_MESSAGES_API_KEY= "https://campusbuy-backend-nkmx.onrender.com/getconversations";
const GET_CALLBACK_API_KEY= "https://campusbuy-backend-nkmx.onrender.com/getcallback";
const GET_YOURPRODUCTS_API_KEY= "https://campusbuy-backend-nkmx.onrender.com/getyourproduct";


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
        
        // Check if 'id' property exists in accessedToken before navigating
        if (accessedToken.id ? accessedToken.id : accessedToken._id) {
          navigate(`/mainpage/${accessedToken.id ? accessedToken.id : accessedToken._id}`);
        } else {
          console.error('Error navigating to Your Account: Invalid accessedToken');
        }
      } else {
         setSignin(true);
        setTimeout(() => {
        navigate('/signin')
       setSignin(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error navigating to Your Account:', error);
      if (error.response && error.response.status === 403) {
         setSignin(true);
        setTimeout(() => {
        navigate('/signin')
        setSignin(false);
        }, 3000);
      }else{
        alert('Connection error. Please refresh your network')
      }
    }
  };

  const sendWishlist = (activePage) => dispatch({ type: 'GET_ACTIVEPAGE', activePage });
  const sendNotifications = (activePage) => dispatch({ type: 'GET_ACTIVEPAGE', activePage });
  const sendAccount = (activePage) => dispatch({ type: 'GET_ACTIVEPAGE', activePage });
  const sendMessages = (activePage) => dispatch({ type: 'GET_ACTIVEPAGE', activePage });
  const sendYourproducts = (activePage) => dispatch({ type: 'GET_ACTIVEPAGE', activePage });
  const sendCallbacks = (activePage) => dispatch({ type: 'GET_ACTIVEPAGE', activePage });
  const sendMystore = (activePage) => dispatch({ type: 'GET_ACTIVEPAGE', activePage });

  return (
    <div className="container ">
      <nav className="flex flex-col text-white text-center  bg-slate-950 p-1 border-2 border-[#d4af37]">
        <button className="ml-auto m-2 p-1" onClick={handleCloseClick}>
        <MdCancel onClick={closeModal}  className='w-[25px] h-[25px]  text-white ' />
        </button>
        <ul>
          <li
              className='text-[20px] p-1 m-4'
              style={{borderBottom: '1px solid gray'}}
              onClick={() => {
                accountNavigate();
                sendAccount('Account');
              }}
              >
              Account
          </li>
          <li
              className='text-[20px] p-1 m-4'
              style={{borderBottom: '1px solid gray'}}
              onClick={() => { loggedinOrOut(GET_MESSAGES_API_KEY, "conversationscard") 
              sendMessages('Messages')}}
            >
              Messages
            
          </li>
          <li
              className='text-[20px] p-1 m-4'
              style={{borderBottom: '2px solid gray'}}
              onClick={() => { loggedinOrOut(GET_YOURPRODUCTS_API_KEY, "yourproductscard") 
              sendYourproducts('Yourproducts')}}
            >
              My Products
          </li>
          <li
              className='text-[20px] p-1 m-4'
              style={{borderBottom: '2px solid gray'}}
              onClick={() => {  loggedinOrOut(GET_CALLBACK_API_KEY, "callbackcard") 
              sendCallbacks('Callbacks')}}
            >
              Callbacks
              
          </li>
          <li
              className='text-[20px] p-1 m-4'
              style={{borderBottom: '2px solid gray'}}
              onClick={() =>{ loggedinOrOut(GET_NOTIFICATIONS_API_KEY, "notificationscard")
             sendNotifications('Notifications')
            }}
            >
              Notifications
             
          </li>
          <li
              className='text-[20px] p-1 m-4'
              style={{borderBottom: '2px solid gray'}}
              onClick={() => {  loggedinOrOut(GET_WISHLIST_API_KEY, "wishlistcard") 
            sendWishlist('Wishlist')}}
            >
            Wishlist
          </li>
          
          <li
              className='text-[20px] p-1 m-4'
              style={{borderBottom: '2px solid gray'}}
              onClick={() => { loggedinOrOut(GET_YOURPRODUCTS_API_KEY, "yourproductscard") 
                sendMystore   ('Mystore')}}
            >
              My Store
          </li>
          
        </ul>
      </nav>
    </div>
  );
};

export default Nav;
