import React from "react";
import { MdCancel } from "react-icons/md";
import success from '../../assets/success.png'
import failed from '../../assets/failed.png'


export const Networkissues = ({closeModal})=> {
    return(   
     <div className=" w-[40%] flex flex-col justify-center items-center gap-2 bg-white max-lg:text-[10px] text-white relative rounded-lg border-2 border-black">
     <div  className='w-[100%] rounded-lg text-center text-xl text-black text-bold bg-[#FEBD69] p-2' >
     Whoops Something went wrong!
     </div>
     <div className='flex flex-col justify-center items-center'>
     <h1 className=" text-md mt-2 text-[#8B0000]">Network or Connection issues. Please try again later.</h1>
     <div><img src={failed} alt='failed' className='w-[40px] h-[40px] ' /></div>
     </div>
     <button className="p-2 mb-2 bg-[#FEBD69] text-black text-bold rounded-lg" onClick={closeModal}>Close</button>
 </div>
    )
 }
export const Somethingwentwrong = ({closeModal})=> {
    return(   
     <div className=" w-[40%] flex flex-col justify-center items-center gap-2 bg-white max-lg:text-[10px] text-white relative rounded-lg border-2 border-black">
     <div  className='w-[100%] rounded-lg text-center text-xl text-black text-bold bg-[#FEBD69] p-2' >
     Whoops Something went wrong!
     </div>
     <div className='flex flex-col justify-center items-center'>
     <h1 className=" text-md mt-2 text-[#8B0000]">Please try again later.</h1>
     <div><img src={failed} alt='failed' className='w-[40px] h-[40px] ' /></div>
     </div>
     <button className="p-2 mb-2 bg-[#FEBD69] text-black text-bold rounded-lg" onClick={closeModal}>Close</button>
 </div>
    )
 }

 export const Incorrectinformation = ({closeModal})=> {
    return(   
     <div className=" w-[40%] flex flex-col justify-center items-center gap-2 bg-white max-lg:text-[10px] text-white relative rounded-lg border-2 border-black">
     <div  className='w-[100%] rounded-lg text-center text-xl text-black text-bold bg-[#FEBD69] p-2' >
     Whoops! Something went wrong!
     </div>
     <div className='flex flex-col justify-center items-center'>
     <h1 className=" text-md mt-2 text-[#8B0000]">Incorrect Information. Please check again.</h1>
     <div><img src={failed} alt='failed' className='w-[40px] h-[40px] ' /></div>
     </div>
     <button className="p-2 mb-2 bg-[#FEBD69] text-black text-bold rounded-lg" onClick={closeModal}>Close</button>
 </div>
    )
 }
 
 export const Sessiontimeout = ({closeModal})=> {
   return(   
    <div className=" w-[100%]  flex flex-col justify-center items-center gap-2 bg-white max-lg:text-[10px] text-white relative rounded-lg border-2 border-black">
    <div  className='w-[100%] rounded-lg text-center text-xl text-black text-bold bg-[#FEBD69] px-4 py-2' >    
    <MdCancel onClick={closeModal}  className='w-[25px] h-[25px] ml-[90%]' />
    </div>
    <div className='flex flex-col justify-center items-center p-[1rem]'>
    <strong className=" text-md mb-2 text-[#8B0000] text-bold">Session timeout. Please sign in.</strong>
    </div>
</div>
   )
}