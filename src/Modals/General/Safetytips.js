import React from "react";
import { MdCancel } from "react-icons/md";

export const Safetytips = ({closeSafety})=> {
    return(   
     <div className=" w-[100%] flex flex-col justify-center items-center gap-2 bg-white max-lg:text-[10px] text-white relative rounded-lg border-2 border-black">
     <div  className='w-[100%] rounded-lg text-center text-xl text-black text-bold bg-[#FEBD69] p-[1rem]' >    
     <MdCancel onClick={closeSafety}  className='w-[25px] h-[25px] ml-[90%]' />
     </div>
     <div className='flex flex-col justify-center items-center'>
     <strong className="text-xl text-orange-700 underline text-bold  text-center m-2 p-2">
                    Safety Tips
                  </strong>
                  <ul className="flex flex-col gap-2 text-black">
                    <li className="p-2">Never pay in advance, even for delivery</li>
                    <li className="p-2">Always meet with the seller at a safe public place</li>
                    <li className="p-2">Never hurry. Take your time when buying</li>
                    <li className="p-2">Inspect the item thoroughly and ensure it's exactly what you want</li>
                    <li className="p-2">Pay only when you're satisfied</li>
                    <li className="p-2">Keep in touch with the seller</li>
                  </ul>     
    </div>
 </div>
    )
 }

<div>     
                </div>