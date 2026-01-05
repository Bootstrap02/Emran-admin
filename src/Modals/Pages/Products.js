import React from "react";
import { MdCancel } from "react-icons/md";
import success from '../../assets/success.png'
import failed from '../../assets/failed.png'


export const Notaddedtowishlist = ({closeWishlistfailed})=> {
    return(   
     <div className=" w-[100%] flex flex-col justify-center items-center gap-2 bg-white text-white relative rounded-lg border-2 border-black">
     <div  className='w-[100%] rounded-lg text-center text-xl text-black text-bold bg-[#FEBD69] p-[0.5rem]' >    
     <MdCancel onClick={closeWishlistfailed}  className='w-[25px] h-[25px] ml-[90%]' />
     </div>
     <div className='flex flex-col justify-center items-center'>
     <strong className=" text-xl mb-2 text-[#8B0000] text-bold">Product not added to wishlist! Please try again.</strong>
     </div>
 </div>
    )
 }

export const Addedtowishlist = ({closeWishlist})=> {
    return(   
     <div className=" w-[100%] flex flex-col justify-center items-center gap-2 bg-white text-white relative rounded-lg border-2 border-black">
     <div  className='w-[100%] rounded-lg text-center text-xl text-black text-bold bg-[#FEBD69] p-[0.5rem]' >    
     <xlCancel onClick={closeWishlist}  className='w-[25px] h-[25px] ml-[90%]' />
     </div>
     <div className='flex flex-col justify-center items-center'>
     <strong className=" text-xl mb-2 text-[#379B07] text-bold">Product added to wishlist.</strong>
     </div>
 </div>
    )
 }

 export const Productnotfound = ({closeModal})=> {
    return(   
     <div className=" w-[40%] flex flex-col justify-center items-center gap-2 bg-white text-white relative rounded-lg border-2 border-black">
     <div  className='w-[100%] rounded-lg text-center text-xl text-black text-bold bg-[#FEBD69] p-2' >
     Whoops! Product Not Found!
     </div>
     <div className='flex flex-col justify-center items-center'>
     <h1 className=" text-xl mt-2 text-black">No Product was not found. Please try again later .</h1>
     </div>
     <button className="p-2 mb-2 bg-[#FEBD69] text-black text-bold rounded-lg" onClick={closeModal}>Close</button>
 </div>
    )
 }

 export const Noproductincategory = ({closeModal})=> {
    return(   
     <div className=" w-[40%] flex flex-col justify-center items-center gap-2 bg-white text-white relative rounded-lg border-2 border-black">
     <div  className='w-[100%] rounded-lg text-center text-xl text-black text-bold bg-[#FEBD69] p-2' >
     Whoops! No Product In Category!
     </div>
     <div className='flex flex-col justify-center items-center'>
     <h1 className=" text-xl mt-2 text-black">No Product in this category. Please try again later .</h1>
     </div>
     <button className="p-2 mb-2 bg-[#FEBD69] text-black text-bold rounded-lg" onClick={closeModal}>Close</button>
 </div>
    )
 }
 export const Productimageerror = ({closeModal})=> {
    return(   
     <div className=" w-[40%] flex flex-col justify-center items-center gap-2 bg-white text-white relative rounded-lg border-2 border-black">
     <div  className='w-[100%] rounded-lg text-center text-xl text-black text-bold bg-[#FEBD69] p-2' >
     Whoops! Image File Error!
     </div>
     <div className='flex flex-col justify-center items-center'>
     <h1 className=" text-xl mt-2 text-black">file format is not supported. Use only jpg, jpeg, png, svg file formats.</h1>
     <div><img src={failed} alt='failed' className='w-[40px] h-[40px] ' /></div>
     </div>
     <button className="p-2 mb-2 bg-[#FEBD69] text-black text-bold rounded-lg" onClick={closeModal}>Close</button>
 </div>
    )
 }

 export const Productnotcreated = ({closeModal})=> {
    return(   
     <div className=" w-[40%] flex flex-col justify-center items-center gap-2 bg-white text-white relative rounded-lg border-2 border-black">
     <div  className='w-[100%] rounded-lg text-center text-xl text-black text-bold bg-[#FEBD69] p-2' >
     Error! Product Not Created!
     </div>
     <div className='flex flex-col justify-center items-center'>
     <h1 className=" text-xl mt-2 text-[#8B0000]">Product was not created. Please try again later .</h1>
     <div><img src={failed} alt='failed' className='w-[40px] h-[40px] ' /></div>
     </div>
     <button className="p-2 mb-2 bg-[#FEBD69] text-black text-bold rounded-lg" onClick={closeModal}>Close</button>
 </div>
    )
 }
 export const Productnetworkissues = ({closeModal})=> {
    return(   
     <div className=" w-[40%] flex flex-col justify-center items-center gap-2 bg-white text-white relative rounded-lg border-2 border-black">
     <div  className='w-[100%] rounded-lg text-center text-xl text-black text-bold bg-[#FEBD69] p-2' >
     Error! Product Not Created!
     </div>
     <div className='flex flex-col justify-center items-center'>
     <h1 className=" text-xl mt-2 text-[#8B0000]">Product was not created. network issues .</h1>
     <div><img src={failed} alt='failed' className='w-[40px] h-[40px] ' /></div>
     </div>
     <button className="p-2 mb-2 bg-[#FEBD69] text-black text-bold rounded-lg" onClick={closeModal}>Close</button>
 </div>
    )
 }
 export const Productincompletedetails = ({closeModal})=> {
    return(   
     <div className=" w-[40%] flex flex-col justify-center items-center gap-2 bg-white text-white relative rounded-lg border-2 border-black">
     <div  className='w-[100%] rounded-lg text-center text-xl text-black text-bold bg-[#FEBD69] p-2' >
     Error! Product Not Created!
     </div>
     <div className='flex flex-col justify-center items-center'>
     <h1 className=" text-xl mt-2 text-[#8B0000]">Incomplete product details. Please complete the forms.</h1>
     <div><img src={failed} alt='failed' className='w-[40px] h-[40px] ' /></div>
     </div>
     <button className="p-2 mb-2 bg-[#FEBD69] text-black text-bold rounded-lg" onClick={closeModal}>Close</button>
 </div>
    )
 }
 export const Productcreatedsuccessfully = ({closeModal})=> {
    return(   
     <div className=" w-[40%] flex flex-col justify-center items-center gap-2 bg-white text-white relative rounded-lg border-2 border-black">
     <div  className='w-[100%] rounded-lg text-center text-xl text-black text-bold bg-[#FEBD69] p-2' >
     Success! Product Created!
     </div>
     <div className='flex flex-col justify-center items-center'>
     <h1 className=" text-xl mt-2 text-[#379B07]">Your product was successfully created.</h1>
     <div><img src={success} alt='success' className='w-[40px] h-[40px] ' /></div>
     </div>
     <button className="p-2 mb-2 bg-[#FEBD69] text-black text-bold rounded-lg" onClick={closeModal}>Close</button>
 </div>
    )
 }

 export const Messagesent = ({closeModal})=> {
    return(   
     <div className=" w-[40%] flex flex-col justify-center items-center gap-2 bg-white text-white relative rounded-lg border-2 border-black">
     <div  className='w-[100%] rounded-lg text-center text-xl text-black text-bold bg-[#FEBD69] p-[0.5rem]' >    
     <xlCancel onClick={closeModal}  className='w-[25px] h-[25px] ml-[90%]' />
     </div>
     <div className='flex flex-col justify-center items-center'>
     <strong className=" text-xl mb-2 text-[#379B07] text-bold">Message sent successfully.</strong>
     </div>
 </div>
    )

 }

 export const Wishlistnotdeleted = ({closeModal})=> {
    return(   
     <div className=" w-[40%] flex flex-col justify-center items-center gap-2 bg-white text-white relative rounded-lg border-2 border-black">
     <div  className='w-[100%] rounded-lg text-center text-xl text-black text-bold bg-[#FEBD69] p-[0.5rem]' >    
     <xlCancel onClick={closeModal}  className='w-[25px] h-[25px] ml-[90%]' />
     </div>
     <div className='flex flex-col justify-center items-center'>
     <strong className=" text-xl mb-2 text-[#8B0000] text-bold">Product not deleted! Please check your network.</strong>
     </div>
 </div>
    )
 }

export const Wishlistdeleted = ({closeModal})=> {
    return(   
     <div className=" w-[40%] flex flex-col justify-center items-center gap-2 bg-white text-white relative rounded-lg border-2 border-black">
     <div  className='w-[100%] rounded-lg text-center text-xl text-black text-bold bg-[#FEBD69] p-[0.5rem]' >    
     <MdCancel onClick={closeModal}  className='w-[25px] h-[25px] ml-[90%]' />
     </div>
     <div className='flex flex-col justify-center items-center'>
     <strong className=" text-md mb-2 text-[#379B07] text-bold">Product deleted successfully.</strong>
     </div>
 </div>
    )
}

export const Productdeleteverifcation = ({closeModal})=> {
    return(   
     <div className=" w-[40%] flex flex-col justify-center items-center gap-2 bg-white text-white relative rounded-lg border-2 border-black">
     <div  className='w-[100%] rounded-lg text-center text-xl text-black text-bold bg-[#FEBD69] p-[0.5rem]' >    
     <MdCancel onClick={closeModal}  className='w-[25px] h-[25px] ml-[90%]' />
     </div>
     <div className='flex flex-col justify-center items-center'>
     <strong className=" text-md mb-2 text-[#8B0000] text-bold">Are you sure you want to delete this product?.</strong>
     <div className='flex justify-between p-4 my-2 '>
        <button className='p-2 rounded-sm bg-[#379B07] text-white'>Yes</button>
        <button className='p-2 rounded-sm border border-[#8B0000] text-[#8B0000]'>No</button>
        </div>
     </div>
 </div>
    )
 }