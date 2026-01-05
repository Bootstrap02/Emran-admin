import React from 'react';
import { BsSend } from "react-icons/bs";


const Subscribenewsletter = () => {
   
  

  return (
    <div className='container'>
        <div className='text-xl'><strong>Unsubscribe Newsletter</strong></div>
        <div className='mt-4'>
        <div className='row p-4 m-4'>
          <div className='col-5'>
            <div className='footer-top-data d-flex  align-items-center justify-content-center '>
              <BsSend className= 'text-black sender'/>
              <h4 className='text-black text-xl'>Stop Newsletter</h4>
            </div>
          </div>
          <div className='col-6'>
            <form className='bg-white border-2 footer-top-newsletter d-flex  align-items-center '>
              <input className='input' placeholder='Enter Your Email' type='text' />
              <button><strong>Unsubscribe</strong></button>
            </form>
          </div>
        </div>
        </div>
    </div>
  )
}

export default Subscribenewsletter