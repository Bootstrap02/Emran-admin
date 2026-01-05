import React from "react";
import { MdCancel } from "react-icons/md";
import success from '../../assets/success.png'
import failed from '../../assets/failed.png'


export const Subscribedsuccessful = ({closeModal})=> {
       return(   
        <div className=" w-[40%] flex flex-col justify-center items-center gap-2 bg-white max-lg:text-[10px] text-white relative rounded-lg border-2 border-black">
        <div  className='w-[100%] rounded-lg text-center text-xl text-black text-bold bg-[#FEBD69] p-2' >
        Subscription Successful!
        </div>
        <div className='flex flex-col justify-center items-center'>
        <h1 className=" text-md mt-2 text-[#379B07]">You have subscribed successfully.</h1>
        <div><img src={success} alt='successful' className='w-[40px] h-[40px] ' /></div>
        </div>
        <button className="p-2 mb-2 bg-[#FEBD69] text-black text-bold rounded-lg" onClick={closeModal}>Close</button>
    </div>
       )
    }
export const Subscribedfailed = ({closeModal})=> {
       return(   
        <div className=" w-[40%] flex flex-col justify-center items-center gap-2 bg-white max-lg:text-[10px] text-white relative rounded-lg border-2 border-black">
        <div  className='w-[100%] rounded-lg text-center text-xl text-black text-bold bg-[#FEBD69] p-2' >
        Subscription Not Successful!
        </div>
        <div className='flex flex-col justify-center items-center'>
        <h1 className=" text-md mt-2 text-[#8B0000]">Your subscription was not successful. Please try again later.</h1>
        <div><img src={failed} alt='failed' className='w-[40px] h-[40px] ' /></div>
        </div>
        <button className="p-2 mb-2 bg-[#FEBD69] text-black text-bold rounded-lg" onClick={closeModal}>Close</button>
    </div>
       )
    }

export const Verification = ({closeModal})=> {
       return(   
        <div className=" w-[40%] flex flex-col justify-center items-center gap-2 bg-white max-lg:text-[10px] text-white relative rounded-lg border-2 border-black">
        <div  className='w-[100%] rounded-lg text-center text-xl text-black text-bold bg-[#FEBD69] p-[1rem]' >    
        <MdCancel onClick={closeModal}  className='w-[25px] h-[25px] ml-[90%]' />
        </div>
        <div className='flex flex-col justify-center items-center'>
        <strong className=" text-md mb-2 text-black text-bold">Are you sure you want to delete this message.</strong>
        <div className='w-[100%] flex justify-between items-center p-4'>
            <button className='bg-[#379B07] py-2 px-4 rounded-sm '>Yes</button>
            <button className='bg-[#8B0000] py-2 px-4 rounded-sm '>No</button>
        </div>
        </div>
    </div>
       )
    }
export const Positivepopup = ({closeModal})=> {
       return(   
        <div className=" w-[40%] flex flex-col justify-center items-center gap-2 bg-white max-lg:text-[10px] text-white relative rounded-lg border-2 border-black">
        <div  className='w-[100%] rounded-lg text-center text-xl text-black text-bold bg-[#FEBD69] p-[1rem]' >    
        <MdCancel onClick={closeModal}  className='w-[25px] h-[25px] ml-[90%]' />
        </div>
        <div className='flex flex-col justify-center items-center'>
        <strong className=" text-md mb-2 text-[#379B07] text-bold">Your subscription was successful.</strong>
        </div>
    </div>
       )
    }
export const Negativepopup = ({closeModal})=> {
       return(   
        <div className=" w-[40%] flex flex-col justify-center items-center gap-2 bg-white max-lg:text-[10px] text-white relative rounded-lg border-2 border-black">
        <div  className='w-[100%] rounded-lg text-center text-xl text-black text-bold bg-[#FEBD69] p-[1rem]' >    
        <MdCancel onClick={closeModal}  className='w-[25px] h-[25px] ml-[90%]' />
        </div>
        <div className='flex flex-col justify-center items-center'>
        <strong className=" text-md mb-2 text-[#8B0000] text-bold">Your subscription was not successful.</strong>
        </div>
    </div>
       )
    }






    export const Newslettersubscribed = ({closeModal})=> {
        return(   
         <div className=" w-[40%] flex flex-col justify-center items-center gap-2 bg-white max-lg:text-[10px] text-white relative rounded-lg border-2 border-black">
         <div  className='w-[100%] rounded-lg text-center text-xl text-black text-bold bg-[#FEBD69] p-[1rem]' >    
         <MdCancel onClick={closeModal}  className='w-[25px] h-[25px] ml-[90%]' />
         </div>
         <div className='flex flex-col justify-center items-center'>
         <strong className=" text-md mb-2 text-[#379B07] text-bold">You have subscribed successfully.</strong>
         </div>
     </div>
        )
     }
     export const Newsletteralreadysubscribed = ({closeModal})=> {
        return(   
         <div className=" w-[40%] flex flex-col justify-center items-center gap-2 bg-white max-lg:text-[10px] text-white relative rounded-lg border-2 border-black">
         <div  className='w-[100%] rounded-lg text-center text-xl text-black text-bold bg-[#FEBD69] p-[1rem]' >    
         <MdCancel onClick={closeModal}  className='w-[25px] h-[25px] ml-[90%]' />
         </div>
         <div className='flex flex-col justify-center items-center'>
         <strong className=" text-md mb-2 text-[#379B07] text-bold">You have already subscribed.</strong>
         </div>
     </div>
        )
     }
