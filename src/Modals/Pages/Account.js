import React from "react";
import { MdCancel } from "react-icons/md";
import success from '../../assets/success.png'
import failed from '../../assets/failed.png'


export const Accountdeleteverifcation = ({deleteAccount, closeAccountDelete})=> {
   
    return(   
     <div className=" w-[100%] flex flex-col justify-center items-center gap-2 bg-white max-lg:text-[10px] text-white relative rounded-lg border-2 border-black">
     <div  className='w-[100%] rounded-lg text-center text-xl text-black text-bold bg-[#FEBD69] p-[1rem]' >    
     <MdCancel onClick={closeAccountDelete}  className='w-[25px] h-[25px] ml-[90%]' />
     </div>
     <div className='flex flex-col justify-center items-center'>
     <strong className=" text-lg mb-2 text-[#8B0000] text-bold p-2">Are you sure you want to delete your account?.</strong>
     <div className='flex gap-[4rem] p-4 my-2 '>
        <button onClick={deleteAccount} className='py-2 px-4 rounded-sm bg-[#379B07] text-white'>Yes</button>
        <button style={{border: "2px solid #8B0000"}} onClick={closeAccountDelete} className='py-2 px-4 rounded-sm border  text-[#8B0000]'>No</button>
        </div>
     </div>
 </div>
    )
 }

 export const Accountdeleted = ({closeAccountDeleted})=> {
    return(   
     <div className=" w-[100%] flex flex-col justify-center items-center gap-2 bg-white max-lg:text-[10px] text-white relative rounded-lg border-2 border-black">
     <div  className='w-[100%] rounded-lg text-center text-xl text-black text-bold bg-[#FEBD69] p-[1rem]' >    
     <MdCancel onClick={closeAccountDeleted}  className='w-[25px] h-[25px] ml-[90%]' />
     </div>
     <div className='flex flex-col justify-center items-center'>
     <strong className=" text-lg mb-2 text-[#379B07] text-bold p-2">Account successfully deleted.</strong>
     </div>
 </div>
    )
 }

 export const Accountnotdeleted = ({closeAccountNotDeleted})=> {
    return(   
     <div className=" w-[100%] flex flex-col justify-center items-center gap-2 bg-white max-lg:text-[10px] text-white relative rounded-lg border-2 border-black">
     <div  className='w-[100%] rounded-lg text-center text-xl text-black text-bold bg-[#FEBD69] p-[1rem]' >    
     <MdCancel onClick={closeAccountNotDeleted}  className='w-[25px] h-[25px] ml-[90%]' />
     </div>
     <div className='flex flex-col justify-center items-center'>
     <strong className=" text-lg mb-2 text-[#8B0000] text-bold p-2">Account not deleted! Please try again.</strong>
     </div>
 </div>
    )
 }

export const Accountupdateverifcation = ({closeSaveVerification, updateUser})=> {
   
    return(   
     <div className=" w-[100%] flex flex-col justify-center items-center gap-2 bg-white max-lg:text-[10px] text-white relative rounded-lg border-2 border-black">
     <div  className='w-[100%] rounded-lg text-center text-xl text-black text-bold bg-[#FEBD69] p-[1rem]' >    
     <MdCancel onClick={closeSaveVerification}  className='w-[25px] h-[25px] ml-[90%]' />
     </div>
     <div className='flex flex-col justify-center items-center'>
     <strong className=" text-lg mb-2 text-[#8B0000] text-bold p-2">Are you sure you want to save these changes to your account?.</strong>
     <div className='flex gap-[4rem] p-4 my-2 '>
        <button onClick={updateUser} className='py-2 px-4 rounded-sm bg-[#379B07] text-white'>Yes</button>
        <button style={{border: "2px solid #8B0000"}} onClick={closeSaveVerification} className='py-2 px-4 rounded-sm border  text-[#8B0000]'>No</button>
        </div>
     </div>
 </div>
    )
 }

 export const Accountupdated = ({closeModal})=> {
    return(   
     <div className=" w-[100%] flex flex-col justify-center items-center gap-2 bg-white max-lg:text-[10px] text-white relative rounded-lg border-2 border-black">
     <div  className='w-[100%] rounded-lg text-center text-xl text-black text-bold bg-[#FEBD69] p-[1rem]' >    
     <MdCancel onClick={closeModal}  className='w-[25px] h-[25px] ml-[90%]' />
     </div>
     <div className='flex flex-col justify-center items-center'>
     <strong className=" text-lg mb-2 text-[#379B07] text-bold p-2">Account successfully updated.</strong>
     </div>
 </div>
    )
 }

 export const Accountnotupdated = ({closeModal})=> {
    return(   
     <div className=" w-[100%] flex flex-col justify-center items-center gap-2 bg-white max-lg:text-[10px] text-white relative rounded-lg border-2 border-black">
     <div  className='w-[100%] rounded-lg text-center text-xl text-black text-bold bg-[#FEBD69] p-[1rem]' >    
     <MdCancel onClick={closeModal}  className='w-[25px] h-[25px] ml-[90%]' />
     </div>
     <div className='flex flex-col justify-center items-center'>
     <strong className=" text-lg mb-2 text-[#8B0000] text-bold p-2">Account not updated! Please try again.</strong>
     </div>
 </div>
    )
 }