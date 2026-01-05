import React from "react";
import { MdCancel } from "react-icons/md";
import { IoLogoGooglePlaystore } from "react-icons/io5";


export const Pricetips = ({closeTips})=> {
       return(   
        <div className="container bg-black text-white relative p-1 rounded-lg max-lg:rounded-sm border-2 border-[#FEBD69]">
        <div onClick={closeTips} className='mr-auto pb-2'>
            <MdCancel className='w-[15px] h-[12px] max-lg:w-[15px] max-lg:h-[15px]' />
        </div>
        <h1 className="text-center text-[10px] max-lg:text-[10px]">Please make sure your prices of products you post are cheap and affordable for Students. Remember that this is a student platform and if your prices are too high you may struggle to get attention.</h1>
    </div>
    

       )
    }

export const DownloadModal = ({ closeModal }) => {
    // Function to handle navigation
    const handleNavigation = () => {
      window.open(
        "https://play.google.com/store/apps/details?id=com.bootstrap131.appcampusify",
        "_blank"
      );
      closeModal(); // Close the modal after navigation
    };
  
    return (
      <div style={{zIndex: 8000, top: 100, position: "fixed"}} className=" inset-0 hidden max-lg:flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white text-black p-4 rounded-lg shadow-lg max-w-sm w-full relative border-2 border-[#FEBD69]">
          {/* Close Icon */}
          <button onClick={closeModal} className="absolute top-2 right-2">
            <MdCancel className="w-6 h-6 text-gray-600 hover:text-red-500" />
          </button>
  
          {/* Modal Content */}
          <h1 className="text-center text-lg font-semibold">
            Campusify Works Better on Our Mobile App
          </h1>
          <p className="text-center text-sm mt-2">
            Download our mobile app from Google PlayStore.
          </p>
  
          {/* Google Play Store Button */}
          <div className="flex justify-center mt-4">
            <button
              onClick={handleNavigation}
              className="flex items-center gap-2 bg-[#FEBD69] px-4 py-2 rounded-md hover:bg-[#e0a850] transition"
            >
              <IoLogoGooglePlaystore className="w-5 h-5" />
              <span className="text-sm font-medium">Get it on Google Play</span>
            </button>
          </div>
        </div>
      </div>
    );
  };
  
export const Purchasetips = ({closeTips})=> {
       return(   
           <div className=" container bg-black  text-white relative p-1 rounded-lg border-2 border-[#FEBD69]">
    <div onClick={closeTips} className='mr-auto pb-2 '>
        <MdCancel className='w-[15px] h-[15px] ' />
    </div>
      <h1 className="text-center text-[10px] max-lg:text-[10px]">Please make sure you meet the seller of a product face to face and you see the product you are buying before exchanging money. We do not monitor or control trade and so cannot be liable for any fraud or illicit transaction in line with our Trade policy.</h1>
</div>

       )
    }

export const Bulkgoodstips = ({closeTips})=> {
       return(   
           <div className=" container bg-black  text-white relative p-1 rounded-lg border-2 border-[#FEBD69]">
    <div onClick={closeTips} className='mr-auto pb-2 '>
        <MdCancel className='w-[15px] h-[15px] max-lg:w-[15px] max-lg:h-[15px] ' />
    </div>
      <h1 className="text-center text-[10px] max-lg:text-[10px]">When posting bulk properties, please try as much as possible to upload th images of every item. put the items together and take pictures of them to give clear message to buyers.</h1>
</div>

       )
    }
// export const Servicestips = ()=> {
//        return(   
//            <div className=" container bg-black  text-white relative p-1 rounded-lg border-2 border-[#FEBD69]">
//     <div className='' style={{  position: 'absolute', top: '5', left: '93%' }}
// ><MdCancel/></div>
//       <h1 className="text-center text-[10px] mt-4">If you have a service you render, you are welcome on our platform. Upload your service promo and description and we put it out there for you.</h1>
// </div>

//        )
//     }


