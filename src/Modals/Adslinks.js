// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { MdCancel } from "react-icons/md";
// import hotproducts from '../assets/hotproducts.png';
// import buildwebsite from '../assets/buildwebsite.jpg';
// import shipchina from '../assets/shipchina.png';
// import studyabraod from '../assets/studyabroad.png';
// import scholarships from '../assets/scholarships.png';
// import auctiongoods from '../assets/Group 209.png';
// import boostsales from '../assets/How-to-Grow-Busines-Sales.webp';
// import airtime from '../assets/airtime.png';
// import playgames from '../assets/playgames.png';

// export const Bigadlink1 = ({closeAdslink})=> {
//     const navigate = useNavigate();
//    const moveForward = () => {
//     // Open the external ad link in a new tab using window.open()
//     window.open('https://psolsumoo.net/4/8022756', '_blank');
//   };
    
//        return(   
//         <div onClick={moveForward} className="container bg-black text-white relative p-1 rounded-lg max-lg:rounded-sm border-2 border-[#FEBD69]">
//         <div  onClick={closeAdslink}  className='mr-auto pb-2'>
//             <MdCancel className='w-[15px] h-[12px] max-lg:w-[15px] max-lg:h-[15px]' />
//         </div>
//        <img onClick={moveForward} src={hotproducts} alt="big image 1" className="p-[2rem]"/>
//         <button onClick={moveForward} className="btn btn-primary">Learn More.</button>
//     </div>
    

//        )
//     }
// export const Bigadlink2 = ({closeAdslink})=> {
//     const navigate = useNavigate();
//     const moveForward= ()=>{
//         window.open('https://oagroucestou.net/4/8022758', '_blank');

//     }
      
//        return(   
//            <div onClick={moveForward} className=" container bg-black  text-white relative p-1 rounded-lg border-2 border-[#FEBD69]">
//     <div onClick={closeAdslink} className='mr-auto pb-2 '>
//         <MdCancel  className='w-[15px] h-[15px] ' />
//     </div>
//    <img onClick={moveForward} src={buildwebsite} alt="big image 2" className="p-[2rem]"/>
//         <button onClick={moveForward} className="btn btn-primary">Learn More.</button>
//     </div>

//        )
//     }

// export const Bigadlink3 = ({closeAdslink})=> {
//     const navigate = useNavigate();
//    const moveForward = () => {
//     // Open the external ad link in a new tab using window.open()
//     window.open('https://psolsumoo.net/4/8022756', '_blank');
//   };
//        return(   
//            <div onClick={moveForward} className=" container bg-black  text-white relative p-1 rounded-lg border-2 border-[#FEBD69]">
//     <div onClick={closeAdslink} className='mr-auto pb-2 '>
//         <MdCancel  className='w-[15px] h-[15px] max-lg:w-[15px] max-lg:h-[15px] ' />
//     </div>
//    <img onClick={moveForward} src={shipchina} alt="big image 3" className="p-[2rem]"/>
//         <button onClick={moveForward} className="btn btn-primary">Learn More.</button>
//     </div>

//        )
//     }
// export const Mediumadlink1 = ({closeAdslink})=> {
//       const backgroundImageStyle = {
//     backgroundImage: `url(${studyabraod})`,
//     backgroundSize: "cover",
//     backgroundPosition: "center",
//     backgroundRepeat: "no-repeat",
//     minHeight: "8rem",
//     color: "white",
//   };
//   const navigate = useNavigate();
//   const moveForward= ()=>{
//       window.open('https://oagroucestou.net/4/8022758', '_blank');

//   }
//        return(   
//         <div onClick={moveForward} style={backgroundImageStyle} className="container bg-black text-white relative p-1 rounded-lg max-lg:rounded-sm border-2 border-[#FEBD69]">
//         <div onClick={closeAdslink} className='mr-auto pb-2'>
//             <MdCancel className='w-[15px] h-[12px] max-lg:w-[15px] max-lg:h-[15px]' />
//         </div>
//         <button onClick={moveForward} className="btn btn-primary">Learn More.</button>
//     </div>
    

//        )
//     }
// export const Mediumadlink2 = ({closeAdslink})=> {
//       const backgroundImageStyle = {
//     backgroundImage: `url(${auctiongoods})`,
//     backgroundSize: "cover",
//     backgroundPosition: "center",
//     backgroundRepeat: "no-repeat",
//     minHeight: "8rem",
//     color: "white",
//   };
//   const navigate = useNavigate();
//   const moveForward= ()=>{
//       window.open('https://oagroucestou.net/4/8022758', '_blank');

//   }
//        return(   
//            <div onClick={moveForward} style={backgroundImageStyle} className=" container bg-black  text-white relative p-1 rounded-lg border-2 border-[#FEBD69]">
//     <div onClick={closeAdslink} className='mr-auto pb-2 '>
//         <MdCancel className='w-[15px] h-[15px] ' />
//     </div>
//     <button onClick={moveForward} className="btn btn-primary">Learn More.</button>
//     </div>

//        )
//     }

// export const Mediumadlink3 = ({closeAdslink})=> {
//       const backgroundImageStyle = {
//     backgroundImage: `url(${boostsales})`,
//     backgroundSize: "cover",
//     backgroundPosition: "center",
//     backgroundRepeat: "no-repeat",
//     minHeight: "8rem",
//     color: "white",
//   };
//   const navigate = useNavigate();
//   const moveForward= ()=>{
//       window.open('https://oagroucestou.net/4/8022758', '_blank');

//   }
//        return(   
//            <div onClick={moveForward} style={backgroundImageStyle} className=" container bg-black  text-white relative p-1 rounded-lg border-2 border-[#FEBD69]">
//     <div onClick={closeAdslink} className='mr-auto pb-2 '>
//         <MdCancel className='w-[15px] h-[15px] max-lg:w-[15px] max-lg:h-[15px] ' />
//     </div>
//     <button onClick={moveForward} className="btn btn-primary">Learn More.</button>
//     </div>

//        )
//     }
// export const Smalladlink1 = ({closeAdslink})=> {
//       const backgroundImageStyle = {
//     backgroundImage: `url(${airtime})`,
//     backgroundSize: "cover",
//     backgroundPosition: "center",
//     backgroundRepeat: "no-repeat",
//     minHeight: "8rem",
//     color: "white",
//   };
//    const navigate = useNavigate();
//     const moveForward= ()=>{
//         window.open('https://oagroucestou.net/4/8022758', '_blank');

//     }
//        return(   
//         <div onClick={moveForward} style={backgroundImageStyle} className="container bg-black text-white relative p-1 rounded-lg max-lg:rounded-sm border-2 border-[#FEBD69]">
//         <div onClick={closeAdslink} className='mr-auto pb-2'>
//             <MdCancel className='w-[15px] h-[12px] max-lg:w-[15px] max-lg:h-[15px]' />
//         </div>
//         <button onClick={moveForward} className="btn btn-primary">Learn More.</button>
//     </div>
    

//        )
//     }
// export const Smalladlink2 = ({closeAdslink})=> {
//       const backgroundImageStyle = {
//     backgroundImage: `url(${scholarships})`,
//     backgroundSize: "cover",
//     backgroundPosition: "center",
//     backgroundRepeat: "no-repeat",
//     minHeight: "8rem",
//     color: "white",
//   };
//    const navigate = useNavigate();
//     const moveForward= ()=>{
//         window.open('https://oagroucestou.net/4/8022758', '_blank');

//     }
//        return(   
//            <div onClick={moveForward} style={backgroundImageStyle} className=" container bg-black  text-white relative p-1 rounded-lg border-2 border-[#FEBD69]">
//     <div onClick={closeAdslink} className='mr-auto pb-2 '>
//         <MdCancel className='w-[15px] h-[15px] ' />
//     </div>
//     <button onClick={moveForward} className="btn btn-primary">Learn More.</button>
//     </div>

//        )
//     }

// export const Smalladlink3 = ({closeAdslink})=> {
//       const backgroundImageStyle = {
//     backgroundImage: `url(${playgames})`,
//     backgroundSize: "cover",
//     backgroundPosition: "center",
//     backgroundRepeat: "no-repeat",
//     minHeight: "8rem",
//     color: "white",
//   };
//    const navigate = useNavigate();
//     const moveForward= ()=>{
//         window.open('https://oagroucestou.net/4/8022758', '_blank');

//     }
//        return(   
//            <div onClick={moveForward} style={backgroundImageStyle} className=" container bg-black  text-white relative p-1 rounded-lg border-2 border-[#FEBD69]">
//     <div onClick={closeAdslink} className='mr-auto pb-2 '>
//         <MdCancel className='w-[15px] h-[15px] max-lg:w-[15px] max-lg:h-[15px] ' />
//     </div>
//     <button onClick={moveForward} className="btn btn-primary">Learn More.</button>
//     </div>

//        )
//     }
// export const Adlink1 = ({closeAdslink})=> {
//       const backgroundImageStyle = {
//     backgroundImage: `url(${hotproducts})`,
//     backgroundSize: "cover",
//     backgroundPosition: "center",
//     backgroundRepeat: "no-repeat",
//     minHeight: "8rem",
//     color: "white",
//   };
//    const navigate = useNavigate();
//     const moveForward= ()=>{
//         window.open('https://oagroucestou.net/4/8022758', '_blank');

//     }
//        return(   
//         <div onClick={moveForward} style={backgroundImageStyle} className="container bg-black text-white relative p-1 rounded-lg max-lg:rounded-sm border-2 border-[#FEBD69]">
//         <div onClick={closeAdslink} className='mr-auto pb-2'>
//             <MdCancel className='w-[15px] h-[12px] max-lg:w-[15px] max-lg:h-[15px]' />
//         </div>
//         <button onClick={moveForward} className="btn btn-primary">Learn More.</button>
//     </div>
    

//        )
//     }
// export const Adlink2 = ({closeAdslink})=> {
//       const backgroundImageStyle = {
//     backgroundImage: `url(${buildwebsite})`,
//     backgroundSize: "cover",
//     backgroundPosition: "center",
//     backgroundRepeat: "no-repeat",
//     minHeight: "8rem",
//     color: "white",
//   };
//    const navigate = useNavigate();
//     const moveForward= ()=>{
//         window.open('https://oagroucestou.net/4/8022758', '_blank');

//     }
//        return(   
//            <div onClick={moveForward} style={backgroundImageStyle} className=" container bg-black  text-white relative p-1 rounded-lg border-2 border-[#FEBD69]">
//     <div onClick={closeAdslink} className='mr-auto pb-2 '>
//         <MdCancel className='w-[15px] h-[15px] ' />
//     </div>
//     <button onClick={moveForward} className="btn btn-primary">Learn More.</button>
//     </div>

//        )
//     }

// export const Adlink3 = ({closeAdslink})=> {
//       const backgroundImageStyle = {
//     backgroundImage: `url(${shipchina})`,
//     backgroundSize: "cover",
//     backgroundPosition: "center",
//     backgroundRepeat: "no-repeat",
//     minHeight: "8rem",
//     color: "white",
//   };
//    const navigate = useNavigate();
//     const moveForward= ()=>{
//         window.open('https://oagroucestou.net/4/8022758', '_blank');

//     }
//        return(   
//            <div onClick={moveForward} style={backgroundImageStyle} className=" container bg-black  text-white relative p-1 rounded-lg border-2 border-[#FEBD69]">
//     <div onClick={closeAdslink} className='mr-auto pb-2 '>
//         <MdCancel className='w-[15px] h-[15px] max-lg:w-[15px] max-lg:h-[15px] ' />
//     </div>
//     <button onClick={moveForward} className="btn btn-primary">Learn More.</button>
//     </div>

//        )
//     }
// export const Affiliateslink1 = ({closeAdslink})=> {
//       const backgroundImageStyle = {
//     backgroundImage: `url(${hotproducts})`,
//     backgroundSize: "cover",
//     backgroundPosition: "center",
//     backgroundRepeat: "no-repeat",
//     minHeight: "8rem",
//     color: "white",
//   };
//    const navigate = useNavigate();
//     const moveForward= ()=>{
//         window.open('https://oagroucestou.net/4/8022758', '_blank');

//     }
//        return(   
//         <div onClick={moveForward} style={backgroundImageStyle} className="container bg-black text-white relative p-1 rounded-lg max-lg:rounded-sm border-2 border-[#FEBD69]">
//         <div onClick={closeAdslink} className='mr-auto pb-2'>
//             <MdCancel className='w-[15px] h-[12px] max-lg:w-[15px] max-lg:h-[15px]' />
//         </div>
//         <button onClick={moveForward} className="btn btn-primary">Learn More.</button>
//     </div>
    

//        )
//     }
// export const Affiliateslink2 = ({closeAdslink})=> {
//       const backgroundImageStyle = {
//     backgroundImage: `url(${buildwebsite})`,
//     backgroundSize: "cover",
//     backgroundPosition: "center",
//     backgroundRepeat: "no-repeat",
//     minHeight: "8rem",
//     color: "white",
//   };
//    const navigate = useNavigate();
//     const moveForward= ()=>{
//         window.open('https://oagroucestou.net/4/8022758', '_blank');

//     }
//        return(   
//            <div onClick={moveForward} style={backgroundImageStyle} className=" container bg-black  text-white relative p-1 rounded-lg border-2 border-[#FEBD69]">
//     <div onClick={closeAdslink} className='mr-auto pb-2 '>
//         <MdCancel className='w-[15px] h-[15px] ' />
//     </div>
//     <button onClick={moveForward} className="btn btn-primary">Learn More.</button>
//     </div>

//        )
//     }

// export const Affiliateslink3 = ({closeAdslink})=> {
//       const backgroundImageStyle = {
//     backgroundImage: `url(${shipchina})`,
//     backgroundSize: "cover",
//     backgroundPosition: "center",
//     backgroundRepeat: "no-repeat",
//     minHeight: "8rem",
//     color: "white",
//   };
//    const navigate = useNavigate();
//     const moveForward= ()=>{
//         window.open('https://oagroucestou.net/4/8022758', '_blank');

//     }
//        return(   
//            <div onClick={moveForward} style={backgroundImageStyle} className=" container bg-black  text-white relative p-1 rounded-lg border-2 border-[#FEBD69]">
//     <div onClick={closeAdslink} className='mr-auto pb-2 '>
//         <MdCancel className='w-[15px] h-[15px] max-lg:w-[15px] max-lg:h-[15px] ' />
//     </div>
//     <button onClick={moveForward} className="btn btn-primary">Learn More.</button>
//     </div>

//        )
//     }
