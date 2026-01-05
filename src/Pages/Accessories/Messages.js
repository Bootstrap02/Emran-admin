import React, { useState, useEffect } from 'react';
import { Conversations } from '../../Components/Productcards';
import axios from 'axios';
import { MdAccountCircle } from "react-icons/md";

const Messages = () => {
  const storedUserData = JSON.parse(localStorage.getItem('userData')); 
  const messageNotice = JSON.parse(localStorage.getItem('messagenotice'));
  const conversation = JSON.parse(localStorage.getItem('conversationscard'));
  const CONVERSATIONS_API_KEY = 'https://campusbuy-backend-nkmx.onrender.com/getconversations';
  const [chatRoom, setChatRoom] = useState(conversation[0]);

  const avatar= {
    borderRadius: '50%',
    border: "3px solid #5D1523",
    width: "35%",
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

  if (storedUserData && storedUserData.accessToken){
    setAuthToken(storedUserData.accessToken);
  }

  return (
    <div>
<div className="max-lg:hidden w-[100%]">
      <div className="text-2xl font-bold my-4">
        <div className="flex justify-between items-center w-[60%]">
          <strong className="text-[#FEBD69] text-lg">All Messages{`(${messageNotice})`}</strong>
          <div className="flex justify-center items-center relative">
            {storedUserData && storedUserData.image && storedUserData.image[0] ? (
              <div className="flex justify-center gap-4 items-center text-sm">
                <img src={storedUserData.image[0]} alt="Avatar" style={avatar} />
                <strong>{storedUserData.firstname}</strong>
              </div>
            ) : (
              <div className="flex gap-4 items-center justify-center">
                <MdAccountCircle className="w-[100%] text-[3.5rem] text-[#FEBD69]" />
                <strong className="text-black text-sm">{storedUserData.firstname}</strong>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="w-[100%] flex">
        <div style={{ height: '400px', overflowY: 'auto' }} className="flex flex-col gap-1 py-2 w-[40%]">
          <Conversations setChatRoom={setChatRoom} />
        </div>
        <div style={{ height: '400px',  }} className="w-[60%]">
        </div>
      </div>
    </div>
    <div className="hidden max-lg:block container">
      <div className="text-xl font-bold my-2">
        <div className="flex justify-between items-center w-[100%]">
          <strong className="text-[#FEBD69] text-lg">All Messages{`(${messageNotice})`}</strong>
          <div className="flex justify-center items-center relative">
            {storedUserData && storedUserData.image && storedUserData.image[0] ? (
              <div className="flex justify-center gap-4 items-center text-sm">
                <img src={storedUserData.image[0]} alt="Avatar" style={avatar} />
                <strong>{storedUserData.firstname}</strong>
              </div>
            ) : (
              <div className="flex gap-4 items-center justify-center">
                <MdAccountCircle className="w-[100%] text-[3.5rem] text-[#FEBD69]" />
                <strong className="text-black text-sm">{storedUserData.firstname}</strong>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="w-[100%] flex">
        <div style={{ height: '400px', overflowY: 'auto' }} className="flex flex-col gap-1 w-[40%]">
          <Conversations setChatRoom={setChatRoom} />
        </div>
        <div style={{ height: '400px',  }} className="w-[60%]">
        </div>
      </div>
    </div>
    </div>
    
  );
}

export default Messages;
