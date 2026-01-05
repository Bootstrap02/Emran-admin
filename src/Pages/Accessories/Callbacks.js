import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux'; 
import { useNavigate } from 'react-router-dom';
import { FaArrowCircleUp } from "react-icons/fa";
import { FaArrowAltCircleDown } from "react-icons/fa";
import { BigLoader } from '../../Modals/Loaders.js';
import { Callbackdeleted, Callbacknotdeleted } from '../../Modals/Pages/Callback.js';

const Callbacks = () => {
  const [callbackId, setCallbackId] = useState('');
  const [buttonloading, setButtonloading]= useState('');
  const [deleted, setDeleted]= useState(false);
  const [notdeleted, setNotdeleted]= useState(false);
  const user = JSON.parse(localStorage.getItem('userData'));
  const Callback = JSON.parse(localStorage.getItem('callbackcard'));

  const DELETE_CALLBACK_API_KEY = 'https://campusbuy-backend-nkmx.onrender.com/deletecallback';  
  const GET_CALLBACK_API_KEY = 'https://campusbuy-backend-nkmx.onrender.com/getcallback'; 

  useEffect(()=> {
     localStorage.setItem("unreadcallback", JSON.stringify(false));
    const callbacks=  JSON.parse(localStorage.getItem('unreadcallback'));
    }, []
  )

  const modals = {
    position: 'fixed',
    top: '10%',
    right: '10%',
    zIndex: '4000',
    width: '40%'
  }
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sendCallback = (activePage) => dispatch({ type: 'GET_ACTIVEPAGE', activePage });
  
  const openDeleted = ()=>{
    setDeleted(true)
  }
  const closeDeleted = ()=>{
    setDeleted(false)
  }
  const openNotdeleted = ()=>{
    setNotdeleted(true)
  }
  const closeNotdeleted = ()=>{
    setNotdeleted(false)
  }
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
  
  if (user && user.accessToken){
    setAuthToken(user.accessToken);
  }

  const deleteCallback = async (id) => {
    console.log(id)
    const accessedToken = JSON.parse(localStorage.getItem('userData'));
    setButtonloading(id);
    if (!accessedToken) {
      setTimeout(() => {
        navigate('/signin');
      }, 3000);
    } else {
      try {
        setCallbackId(id);
        const response = await axiosInstance.put(`${DELETE_CALLBACK_API_KEY}/${id}`);
        const getCallback = await axiosInstance.get(GET_CALLBACK_API_KEY);
        setButtonloading('');
        await localStorage.setItem("callbackcard", JSON.stringify(getCallback.data));
        const callbacks=await  JSON.parse(localStorage.getItem('callbackcard'));
        await console.log(callbacks)
       await sendCallback('Callbacks');
       await navigate(`/mainpage/${accessedToken.id ? accessedToken.id : accessedToken._id}`);
       await openDeleted()
        setTimeout(()=>{
        closeDeleted()
        },4000)
        console.log(response.data);
      } catch (error) {
        openNotdeleted()
        setTimeout(()=>{
        closeNotdeleted()
        },4000)
        console.error('Error deleting your callback request:', error);
      }
    }
  };  

  const getRandomColor = () => {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A8', '#FF8F33', '#33FFF5', '#8F33FF'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const getFirstLetter = (name) => {
    if (name && name.length > 0) {
      return name.charAt(0).toUpperCase();
    }
    return 'N'; // Default letter if name is not available
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const day = date.toLocaleDateString();
    return { time, day };
  };

  return (
    <div className='w-[100%]'>
      <div className='max-lg:hidden'>
        <div className='text-2xl font-bold my-4 border shadow-md inline-block w-full max-lg:text-xl'>
          <h1>Callbacks</h1>
        </div>
        
        <div className='flex gap-3 m-2 p-2 w-[100%] max-lg:m-0 max-lg:p-0'>
          <div className='w-[100%]'>
            {Callback && Callback.length > 0 ? Callback.map((callback) => (
              <div key={callback._id} className='flex p-2 m-2 items-center justify-between bg-[#C0C9BB] w-[100%]' style={{ borderBottom: '1px solid #C0C9BB' }}>
                  <div 
                    className='w-[10%] p-3 rounded-[50%] flex items-center justify-center text-white text-[2rem]' 
                    style={{ backgroundColor: getRandomColor() }}
                  >
                    {getFirstLetter(callback.fullname)}
                  </div>
                  <div className='flex flex-col gap-1 justify-center items-center w-[60%]'>
                    <div><strong>{callback.fullname}</strong> requests you to call back on <strong>{callback.mobile}</strong></div>
                    <div className='flex justify-between items-center w-full'>
                      <p>{formatDate(callback.createdAt).day}</p>
                      <p>{formatDate(callback.createdAt).time}</p>
                    </div>
                  </div>
                  <div className='flex flex-col gap-[2rem] items-center w-[10%]'>
                    {callback.sender === user.id ?
                      (<FaArrowCircleUp className='text-red-700 text-lg' />) : (<FaArrowAltCircleDown className='text-green-700 text-lg'/>)
                    }
                    <button onClick={() => deleteCallback(callback._id)} className="btn btn-danger text-sm">{buttonloading === callback._id? (<div><BigLoader/></div>) : ('Delete')}</button>                  
                  </div>
              </div>
            )) : (
              <p>No callbacks available</p>
            )}
          </div>
        </div>
      </div>
      <div className='hidden max-lg:block'>
        <div className='text-xl font-bold my-2 border shadow-md inline-block w-full'>
          <h1>Callbacks</h1>
        </div>
        
        <div className='flex gap-2 w-[100%] text-black text-[10px]'>
          <div className='w-[100%]'>
            {Callback && Callback.length > 0 ? Callback.map((callback) => (
              <div key={callback._id} className='container flex items-center justify-between bg-[#C0C9BB]' style={{ borderBottom: '1px solid #C0C9BB' }}>
                  <div 
                    className='w-[10%] p-2 rounded-[50%] flex items-center justify-center text-white text-[1rem]' 
                    style={{ backgroundColor: getRandomColor() }}
                  >
                    {getFirstLetter(callback.fullname)}
                  </div>
                  <div className='flex flex-col gap-1 justify-center items-center w-[60%]'>
                    <div><strong>{callback.fullname}</strong> requests you to call back on <strong>{callback.mobile}</strong></div>
                    <div className='flex justify-between items-center w-full'>
                      <p>{formatDate(callback.createdAt).day}</p>
                      <p>{formatDate(callback.createdAt).time}</p>
                    </div>
                  </div>
                  <div className='flex flex-col gap-[0.5rem] py-2 items-center justify-start w-[10%]'>
                    {callback.sender === user.id ?
                      (<FaArrowCircleUp className='text-red-700 text-sm' />) : (<FaArrowAltCircleDown className='text-green-700 text-lg'/>)
                    }
                    <button onClick={() => deleteCallback(callback._id)} className="btn btn-danger text-[10px]">{buttonloading === callback._id ? (<div><BigLoader/></div>) : ('Delete')}</button>                  
                  </div>
              </div>
            )) : (
              <p>No callbacks available</p>
            )}
          </div>
        </div>
      </div>
      {deleted && <div style={modals}><Callbackdeleted /></div>}
      {notdeleted && <div style={modals}><Callbacknotdeleted /></div>}

    </div>
  );
}

export default Callbacks;
