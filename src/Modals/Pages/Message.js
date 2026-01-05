import React from "react";
import { MdCancel } from "react-icons/md";
import success from '../../assets/success.png'
import failed from '../../assets/failed.png'
import { MdAccountCircle } from "react-icons/md";


export const Messagenotsent = ({closeMessagenotsent})=> {
    return(   
     <div className=" w-[40%] flex flex-col justify-center items-center gap-2 bg-white max-lg:text-[10px] text-white relative rounded-lg border-2 border-black">
     <div  className='w-[100%] rounded-lg text-center text-xl text-black text-bold bg-[#FEBD69] p-[1rem]' >    
     <MdCancel onClick={closeMessagenotsent}  className='w-[25px] h-[25px] ml-[97%]' />
     </div>
     <div className='flex flex-col justify-center items-center'>
     <strong className=" text-xl mb-2 text-[#8B0000] text-bold">Message not sent! Please check your network.</strong>
     </div>
 </div>
    )
 }

export const Messagesent = ({closeMessagesent})=> {
    return(   
     <div className=" w-[100%] flex flex-col justify-center items-center gap-2 bg-white max-lg:text-[10px] text-white relative rounded-lg border-2 border-black">
     <div  className='w-[100%] rounded-lg text-center text-xl text-black text-bold bg-[#FEBD69] p-[1rem]' >    
     <MdCancel onClick={closeMessagesent}  className='w-[25px] h-[25px] ml-[97%]' />
     </div>
     <div className='flex flex-col justify-center items-center'>
     <strong className=" text-xl mb-2 text-[#379B07] text-bold">Message sent successfully.</strong>
     </div>
 </div>
    )

 }

 export const Messagenotdeleted = ({closeModal})=> {
    return(   
     <div className=" w-[40%] flex flex-col justify-center items-center gap-2 bg-white max-lg:text-[10px] text-white relative rounded-lg border-2 border-black">
     <div  className='w-[100%] rounded-lg text-center text-xl text-black text-bold bg-[#FEBD69] p-[1rem]' >    
     <MdCancel onClick={closeModal}  className='w-[25px] h-[25px] ml-[97%]' />
     </div>
     <div className='flex flex-col justify-center items-center'>
     <strong className=" text-xl mb-2 text-[#8B0000] text-bold">Message not deleted! Please check your network.</strong>
     </div>
 </div>
    )
 }

export const Messagedeleted = ({closeModal})=> {
    return(   
     <div className=" w-[40%] flex flex-col justify-center items-center gap-2 bg-white max-lg:text-[10px] text-white relative rounded-lg border-2 border-black">
     <div  className='w-[100%] rounded-lg text-center text-xl text-black text-bold bg-[#FEBD69] p-[1rem]' >    
     <MdCancel onClick={closeModal}  className='w-[25px] h-[25px] ml-[97%]' />
     </div>
     <div className='flex flex-col justify-center items-center'>
     <strong className=" text-xl mb-2 text-[#379B07] text-bold">Message deleted successfully.</strong>
     </div>
 </div>
    )
}

export const Messagedeleteverifcation = ({closeModal})=> {
    return(   
     <div className=" w-[40%] flex flex-col justify-center items-center gap-2 bg-white max-lg:text-[10px] text-white relative rounded-lg border-2 border-black">
     <div  className='w-[100%] rounded-lg text-center text-xl text-black text-bold bg-[#FEBD69] p-[1rem]' >    
     <MdCancel onClick={closeModal}  className='w-[25px] h-[25px] ml-[97%]' />
     </div>
     <div className='flex flex-col justify-center items-center'>
     <strong className=" text-xl mb-2 text-[#8B0000] text-bold">Are you sure you want to delete this conversation?.</strong>
     <div className='flex justify-between p-4 my-2 '>
        <button className='p-2 rounded-sm bg-[#379B07] text-white'>Yes</button>
        <button className='p-2 rounded-sm border border-[#8B0000] text-[#8B0000]'>No</button>
        </div>
     </div>
 </div>
    )
 }

 export const ContactSeller = ({closeSeller, openMessage, openCallback})=> {
   const productState = JSON.parse(localStorage.getItem('fullproduct'));
   const avatar= {
      borderRadius: '50%',
      border: "2px solid #5D1523",
      width: "100%",
    }

   return(   
    <div className=" w-[100%] flex flex-col justify-center items-center gap-2 bg-white max-lg:text-[10px] text-white relative rounded-lg border-2 border-black">
    <strong className='w-[100%] rounded-lg text-center text-xl text-black text-bold bg-[#FEBD69] p-2' >
    Contact Seller
    </strong>
    <div className='flex flex-col gap-2 justify-center items-center'>
    <div className="flex justify-center items-center relative">
  {productState && productState.sellerImage ? (
      <img src={productState.sellerImage} alt="Avatar" style={avatar} />     
  ) : (
      <MdAccountCircle className="w-[50%] " />
  )}
</div>
    <strong className=" text-xl my-2 text-[#FEBD69]">{productState.seller }</strong>
    <div className='text-black'>{productState.mobile}/{productState.mobile2}</div>
    {/* <div className='flex justify-between p-4 my-2 '>
        <button className='p-2 rounded-sm bg-[#379B07] text-white' onClick={openMessage}>Send Message</button>
        <button className='p-2 rounded-sm border border-[#379B07] text-black' onClick={openCallback}>Request Call</button>
        </div> */}
    </div>
    <button className="p-2 mb-2 bg-[#FEBD69] text-black text-bold rounded-lg" onClick={closeSeller}>Close</button>
</div>
   )
}
 export const SearchedContactSeller = ({closeSeller, openMessage, openCallback})=> {
   const productState = JSON.parse(localStorage.getItem('mainproduct'));
   const avatar= {
      borderRadius: '50%',
      border: "2px solid #5D1523",
      width: "100%",
    }

   return(   
    <div className=" w-[100%] flex flex-col justify-center items-center gap-2 bg-white max-lg:text-[10px] text-white relative rounded-lg border-2 border-black">
    <strong className='w-[100%] rounded-lg text-center text-xl text-black text-bold bg-[#FEBD69] p-2' >
    Contact Seller
    </strong>
    <div className='flex flex-col gap-2 justify-center items-center'>
    <div className="flex justify-center items-center relative">
  {productState && productState.sellerImage ? (
      <img src={productState.sellerImage} alt="Avatar" style={avatar} />     
  ) : (
      <MdAccountCircle className="w-[50%] " />
  )}
</div>
    <strong className=" text-xl my-2 text-[#FEBD69]">{productState.seller}</strong>
    <div className='text-black'>{productState.mobile}/{productState.mobile2}</div>
    {/* <div className='flex justify-between p-4 my-2 '>
        <button className='p-2 rounded-sm bg-[#379B07] text-white' onClick={openMessage}>Send Message</button>
        <button className='p-2 rounded-sm border border-[#379B07] text-black' onClick={openCallback}>Request Call</button>
        </div> */}
    </div>
    <button className="p-2 mb-2 bg-[#FEBD69] text-black text-bold rounded-lg" onClick={closeSeller}>Close</button>
</div>
   )
}
// npx update-browserslist-db@latest