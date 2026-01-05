import React from "react";
import { MdCancel } from "react-icons/md";
import success from '../../assets/success.png'
import failed from '../../assets/failed.png'


export const Callbacknotsent = ({closeCallbacknotsent})=> {
    return(   
     <div className=" w-[40%] flex flex-col justify-center items-center gap-2 bg-white max-lg:w-[100%] text-white relative rounded-lg border-2 border-black">
     <div  className='w-[100%] rounded-lg text-center text-xl text-black text-bold bg-[#FEBD69] p-[1rem]' >    
     <MdCancel onClick={closeCallbacknotsent}  className='w-[25px] h-[25px] ml-[90%]' />
     </div>
     <div className='flex flex-col justify-center items-center'>
     <strong className=" text-md mb-2 text-[#8B0000] text-bold">Callback not sent! Please check your network.</strong>
     </div>
 </div>
    )
 }

export const Callbacksent = ({closeCallbacksent})=> {
    return(   
     <div className=" w-[40%] flex flex-col justify-center items-center gap-2 bg-white max-lg:w-[100%] text-white relative rounded-lg border-2 border-black">
     <div  className='w-[100%] rounded-lg text-center text-xl text-black text-bold bg-[#FEBD69] p-[1rem]' >    
     <MdCancel onClick={closeCallbacksent}  className='w-[25px] h-[25px] ml-[90%]' />
     </div>
     <div className='flex flex-col justify-center items-center'>
     <strong className=" text-md mb-2 text-[#379B07] text-bold">Callback sent successfully.</strong>
     </div>
 </div>
    )

 }

 export const Callbacknotdeleted = ({closeModal})=> {
    return(   
     <div className=" w-[40%] flex flex-col justify-center items-center gap-2 bg-white max-lg:w-[100%] text-white relative rounded-lg border-2 border-black">
     <div  className='w-[100%] rounded-lg text-center text-xl text-black text-bold bg-[#FEBD69] p-[1rem]' >    
     <MdCancel onClick={closeModal}  className='w-[25px] h-[25px] ml-[90%]' />
     </div>
     <div className='flex flex-col justify-center items-center'>
     <strong className=" text-md mb-2 text-[#8B0000] text-bold">Callback not deleted! Please check your network.</strong>
     </div>
 </div>
    )
 }

export const Callbackdeleted = ({closeModal})=> {
    return(   
     <div className=" w-[40%] flex flex-col justify-center items-center gap-2 bg-white max-lg:w-[100%] text-white relative rounded-lg border-2 border-black">
     <div  className='w-[100%] rounded-lg text-center text-xl text-black text-bold bg-[#FEBD69] p-[1rem]' >    
     <MdCancel onClick={closeModal}  className='w-[25px] h-[25px] ml-[90%]' />
     </div>
     <div className='flex flex-col justify-center items-center'>
     <strong className=" text-md mb-2 text-[#379B07] text-bold">Callback deleted successfully.</strong>
     </div>
 </div>
    )
}

export const Callbackdeleteverifcation = ({closeModal})=> {
    return(   
     <div className=" w-[40%] flex flex-col justify-center items-center gap-2 bg-white max-lg:w-[100%] text-white relative rounded-lg border-2 border-black">
     <div  className='w-[100%] rounded-lg text-center text-xl text-black text-bold bg-[#FEBD69] p-[1rem]' >    
     <MdCancel onClick={closeModal}  className='w-[25px] h-[25px] ml-[90%]' />
     </div>
     <div className='flex flex-col justify-center items-center'>
     <strong className=" text-md mb-2 text-[#8B0000] text-bold">Are you sure you want to delete this callback request?.</strong>
     <div className='flex justify-between p-4 my-2 '>
        <button className='p-2 rounded-sm bg-[#379B07] text-white'>Yes</button>
        <button className='p-2 rounded-sm border border-[#8B0000] text-[#8B0000]'>No</button>
        </div>
     </div>
 </div>
    )
 }