import React, { useState, useEffect } from 'react';
import axios from 'axios';
const Notifications = () => {
  useEffect(()=> {
    localStorage.setItem("unreadnotification", JSON.stringify(false));
   const notifications=  JSON.parse(localStorage.getItem('unreadnotification'));
   }, []
 )
  const Notification = JSON.parse(localStorage.getItem('notificationscard'));



  return (
    <div className='w-[100%]'>
      <div className='max-lg:hidden'>
      <div className='text-2xl text-bold my-4 border shadow-md inline-block w-full max-lg:text-xl'>
        <h1>Notifications</h1>
      </div>
      <div className='flex gap-3 m-2 p-2 w-[100%]  max-lg:m-0 max-lg:p-0'>
        <div className='w-[100%]'>
          {Notification? Notification.map((notice, index) => (
            <div key={index} className='flex gap-4 my-3 items-center bg-#C0C9BB' style={{ borderBottom: '1px solid #44444494' }}>
              <div className='flex gap-3 items-center mb-3'>
                <img src={notice.image} width={70} />
                <div>
                  <div><strong>{notice.title}</strong> Check Now!</div>
                </div>
              </div>
            </div>
          )):
          <p>No notifications available</p>}
        </div>
      </div>
      </div>
      <div className='hidden max-lg:block'>
      <div className='text-xl text-bold my-4 border shadow-md inline-block w-full '>
        <h1>Notifications</h1>
      </div>
           <div className='flex   w-[100%]  '>
        <div className='w-[100%]'>
          {Notification? Notification.map((notice, index) => (
            <div key={index} className='flex my-3 gap-3 items-center justify-start bg-#C0C9BB' style={{ borderBottom: '1px solid #44444494' }}>
              <div className='flex gap-3 items-center mb-3'>
                <img src={notice.image} width={50} />
                <div>
                  <div>{notice.title} <strong> Check Now!</strong></div>
                </div>
              </div>
            </div>
          )):
          <p>No notifications available</p>}
        </div>
      </div>
      </div>
    </div>
  );
}

export default Notifications;


