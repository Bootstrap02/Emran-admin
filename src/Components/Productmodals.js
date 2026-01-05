import React, { useState, useEffect, useRef } from "react";
import { MdCancel } from "react-icons/md";
import axios from 'axios';
import { useParams, NavLink, useNavigate } from 'react-router-dom';
import { BigLoader } from "../Modals/Loaders";

export const Callbackmodals = ({ closeCallback, openCallbacksent, openCallbacknotsent, closeCallbacksent , closeCallbacknotsent, closeSeller }) => {
  const navigate = useNavigate();
  const CALLBACK_API_KEY = 'https://campusbuy-backend-nkmx.onrender.com/requestcallback';
  const accessedToken = JSON.parse(localStorage.getItem('userData'));
  const productState = JSON.parse(localStorage.getItem('fullproduct'));
  const [fullname, setFullname] = useState('');
  const [mobile, setMobile] = useState('');
  const [buttonloading, setButtonloading] = useState(false)



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


  const handleNameChange = (e) => {
    setFullname(e.target.value);
  };

  const handlePhoneChange = (e) => {
    setMobile(e.target.value);
  };

  const sendCallback = async (e) => {
    setButtonloading(true)
    e.preventDefault();

    if (!accessedToken) {
      setTimeout(() => {
        navigate('/signin');
      }, 3000);
    } else {
      try {
        const formData = new FormData();
        formData.append('fullname', fullname);
        formData.append('mobile', mobile);

        const response = await axiosInstance.post(`${CALLBACK_API_KEY}/${productState._id}`, formData);
        setButtonloading(false)
        closeCallback();
        openCallbacksent();
       
        setTimeout(()=>{
          closeCallback();
        }, 4000)
        
      } catch (error) {
        if (error.response && error.response.status === 403) {
          navigate('/signin');
        } else {
          openCallbacknotsent()
          setTimeout(()=>{
            closeCallbacknotsent()  
            },4000) 
          console.error('Error sending your Callback:', error);
        }
      }
      setButtonloading(false); // Reset button loading state in case of error
    }
  };

  return (
    <div className="w-[100%] flex flex-col justify-center items-center gap-2 bg-white max-lg:text-[10px] text-white relative rounded-lg border-2 border-black">
        <div className="flex justify-center items-center gap-3 w-[100%]">
        <strong className='w-[100%] flex justify-between items-center rounded-lg text-center text-md text-black text-bold bg-[#FEBD69] p-2' >
        <h5>Input your details</h5>   
        <MdCancel onClick={closeCallback} className="ml-auto w-[30px] h-[30px]" />
        </strong>
          
        </div>
       <form onSubmit={sendCallback} className="w-[100%] flex flex-col justify-center items-center gap-2 ">
        <div className="container ">
          <input
            name="fullname"
            onChange={handleNameChange}
            className="border border-gray-600 inline-block p-2 text-black"
            type="text"
            placeholder="Your Name"
          />
        </div>
        <div>
          <input
            name="mobile"
            onChange={handlePhoneChange}
            className="border border-gray-600 inline-block p-2 text-black"
            type="tel"
            placeholder="Your Phone number"
          />
        </div>
        <button type="submit" className="border-2 border-[#379B07] p-2 rounded-md text-black inline-block container m-2" disabled={buttonloading}>
        {buttonloading ? (<div><BigLoader/></div>) : ('Request Callback')}
        </button>
      </form>
    </div>
  );
};
export const Messagemodals = ({ closeMessage, openMessagesent, openMessagenotsent, closeMessagesent, closeMessagenotsent, closeSeller }) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
const [isButtonDisabled, setIsButtonDisabled] = useState(false); 
const [buttonloading, setButtonloading] = useState(false);

  const MESSAGE_API_KEY = 'https://campusbuy-backend-nkmx.onrender.com/createmessage';

  const accessedToken = JSON.parse(localStorage.getItem('userData'));

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

  const productState = JSON.parse(localStorage.getItem('mainproduct'));

  const handleMessage = (e) => {
    setMessage(e.target.value);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    setButtonloading(true);
    setIsButtonDisabled(true);

    if (!accessedToken) {
      setTimeout(() => {
        navigate('/signin');
      }, 3000);
    } else {
      try {
        const formData = new FormData();
        formData.append('message', message);

        
        const response = await axiosInstance.post(`${MESSAGE_API_KEY}/${productState._id}`, formData);
        setButtonloading(false);
        closeMessage();
        openMessagesent();
       
        setTimeout(() => {
          closeMessagesent();
        }, 4000);

        

      } catch (error) {
        if (error.response) {
          if (error.response.status === 403) {
            navigate('/signin');
          } else {
            openMessagenotsent();
            setTimeout(() => {
              closeMessagenotsent();
            }, 4000);
            console.error('Error sending your message:', error);
          }
        }
        setButtonloading(false); // Reset button loading state in case of error
        setIsButtonDisabled(false);
      }
    }
  };

  return (
    <div className="w-[100%] flex flex-col justify-center items-center gap-2 bg-white max-lg:text-[10px] text-white relative rounded-lg border-2 border-black">
      <form onSubmit={sendMessage} className="w-[100%] flex flex-col justify-center items-center">
        <div className="flex w-[100%] justify-between items-center rounded-lg text-md text-black text-bold bg-[#FEBD69] p-2">
          <label htmlFor="message">Type your message:</label>
          <MdCancel onClick={closeMessage} className="ml-auto w-[30px] h-[30px]" />
        </div>
        <textarea onChange={handleMessage} id="message" name="message" placeholder="type your message" className="border border-gray-600 container p-4 text-black" />
        <button type="submit" className="border-2 bg-[#379B07] p-2 container m-2" disabled={isButtonDisabled}>
          {buttonloading ? <BigLoader /> : 'Send Message'}
        </button>
      </form>
    </div>
  );
};

export const Trendingmessagemodals = ({ closeMessage, openMessagesent, openMessagenotsent, closeMessagesent, closeMessagenotsent, closeSeller }) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
const [isButtonDisabled, setIsButtonDisabled] = useState(false); 
const [buttonloading, setButtonloading] = useState(false);

  const MESSAGE_API_KEY = 'https://campusbuy-backend-nkmx.onrender.com/createmessage';

  const accessedToken = JSON.parse(localStorage.getItem('userData'));

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

  const productState = JSON.parse(localStorage.getItem('fullproduct'));

  const handleMessage = (e) => {
    setMessage(e.target.value);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    setButtonloading(true);
    setIsButtonDisabled(true);

    if (!accessedToken) {
      setTimeout(() => {
        navigate('/signin');
      }, 3000);
    } else {
      try {
        const formData = new FormData();
        formData.append('message', message);

        
        const response = await axiosInstance.post(`${MESSAGE_API_KEY}/${productState._id}`, formData);
        setButtonloading(false);
        closeMessage();
        openMessagesent();
       
        setTimeout(() => {
          closeMessagesent();
        }, 4000);

        

      } catch (error) {
        if (error.response) {
          if (error.response.status === 403) {
            navigate('/signin');
          } else {
            openMessagenotsent();
            setTimeout(() => {
              closeMessagenotsent();
            }, 4000);
            console.error('Error sending your message:', error);
          }
        }
        setButtonloading(false); // Reset button loading state in case of error
        setIsButtonDisabled(false);
      }
    }
  };

  return (
    <div className="w-[100%] flex flex-col justify-center items-center gap-2 bg-white max-lg:text-[10px] text-white relative rounded-lg border-2 border-black">
      <form onSubmit={sendMessage} className="w-[100%] flex flex-col justify-center items-center">
        <div className="flex w-[100%] justify-between items-center rounded-lg text-md text-black text-bold bg-[#FEBD69] p-2">
          <label htmlFor="message">Type your message:</label>
          <MdCancel onClick={closeMessage} className="ml-auto w-[30px] h-[30px]" />
        </div>
        <textarea onChange={handleMessage} id="message" name="message" placeholder="type your message" className="border border-gray-600 container p-4 text-black" />
        <button type="submit" className="border-2 bg-[#379B07] p-2 container m-2" disabled={isButtonDisabled}>
          {buttonloading ? <BigLoader /> : 'Send Message'}
        </button>
      </form>
    </div>
  );
};
export const Noticemodal = ()=> {

  const messageNotice = JSON.parse(localStorage.getItem('messagenotice'))

  return(
    <div className=''>
      <strong style={{zIndex: "4000"}} className='px-2 py-1 rounded-full bg-red-700 text-white text-[10px]'>{messageNotice}</strong>
    </div>
  )
}
export const GeneralNoticemodal = ()=> {
  return(
    <div className=''>
      <strong style={{zIndex: "4000"}} className='p-1 rounded-full bg-red-700 text-white text-[6px]'>New !</strong>
    </div>
  )
}
export const AllNoticemodal = ()=> {
  return(
    <div className=''>
  <strong 
    style={{ zIndex: "4000", color: 'red' }} 
    className='rounded-full text-[20px]'>
    !
  </strong>
</div>

  )
}