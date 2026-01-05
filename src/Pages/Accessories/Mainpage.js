import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { BlackSecondheader } from '../../Components/Subheaders';
import Footer from '../../Components/Footer';
import Account from './Account';
import Wishlist from './Wishlist';
import Notifications from './Notifications';
import Messages from './Messages';
import Callbacks from './Callbacks';
import Yourproducts from './Yourproducts';
import Mystore from './Mystore';
import { Pricetips, Purchasetips, Bulkgoodstips } from '../../Modals/Tips';
import { MdAccountCircle } from "react-icons/md";
import { MdModeEdit } from "react-icons/md";
import { MediumLoader } from '../../Modals/Loaders';
import { Sessiontimeout } from '../../Modals/General/Failed'
import { Accountdeleted, Accountdeleteverifcation, Accountnotdeleted } from '../../Modals/Pages/Account';
import { ButtonLoader } from '../../Modals/Loaders';
// import { Mediumadlink1, Mediumadlink2, Mediumadlink3 } from '../../Modals/Adslinks.js';



const Mainpage = () => {
  const [activeComponent, setActiveComponent] = useState(); // Initial active component
  const [modal, setModal] = useState(false);
  const [signin, setSignin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [accountDelete, setAccountDelete] = useState(false);
  const [accountDeleted, setAccountDeleted] = useState(false);
  const [accountNotDeleted, setAccountNotDeleted] = useState(false);
  const [link, setLink] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showModalorAds, setShowModalOrAds] = useState(true);
  const [storeLink, setStoreLink] = useState('');
  const [showStoreModal, setShowStoreModal] = useState(false);
  
  const updateProduct = useSelector(state => state.editProduct.editProduct);
   const storedUserData = JSON.parse(localStorage.getItem('userData'));  


  useEffect(() => {
    const Setlinks= async()=>{
      const storedUserData = await JSON.parse(localStorage.getItem('userData'));  
      if (storedUserData) {
        
       await setLink(`https://campusify.net/signuplink/${storedUserData.id? storedUserData.id : storedUserData._id}`);
       await setStoreLink(`https://campusify.net/store/${storedUserData.id? storedUserData.id : storedUserData._id}`);
      }
    }
    Setlinks()
   
  }, [storedUserData?.id]);

  const AccountreferralLink = () => {
    navigator.clipboard.writeText(link).then(() => {
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
      }, 2000); // Hide modal after 2 seconds
    }).catch((err) => {
      console.error('Failed to copy: ', err);
    });
  };

  const handleStoreLink = () => {
    navigator.clipboard.writeText(storeLink).then(() => {
      setShowStoreModal(true);
      setTimeout(() => {
        setShowStoreModal(false);
      }, 2000); // Hide modal after 4 seconds
    }).catch((err) => {
      console.error('Failed to copy: ', err);
    });
  };
  const openAds = () => {
    // Open the external ad link in a new tab using window.open()
    setShowModalOrAds(false)
    window.open('https://psolsumoo.net/4/8022756', '_blank');
  };

  const openModal = () => {
    if (updateProduct === 'Editproduct') {
      setModal(true);
    }
  };
  openModal();

  const openSignin = ()=>{
    setSignin(true)
  }
  const closeSignin = ()=>{
    setSignin(false)
  }
  const openLoading = ()=>{
    setLoading(true)
  }
  const closeLoading = ()=>{
    setLoading(false)
  }
  const openAccountDelete = ()=>{
    setAccountDelete(true)
  }
  const closeAccountDelete = ()=>{
    setAccountDelete(false)
  }
  const openAccountDeleted = ()=>{
    setAccountDeleted(true)
  }
  const closeAccountDeleted = ()=>{
    setAccountDeleted(false)
  }
  const openAccountNotDeleted = ()=>{
    setAccountNotDeleted(true)
  }
  const closeAccountNotDeleted = ()=>{
    setAccountNotDeleted(false)
  }

  const accessedToken = JSON.parse(localStorage.getItem('userData'));


const avatar= {
  borderRadius: '50%',
  border: "5px solid #5D1523",
  width: "25%",
}
const mobileAvatar= {
  borderRadius: '50%',
  border: "5px solid #FFD700",
  width: "60%",
}
const activepage = {
  font: '16px',
  fontWeight: 'bold',
}
const modals = {
  position: 'fixed',
  top: '30%',
  right: '30%',
  zIndex: '4000',
  width: '50%,'
}

  const GET_WISHLIST_API_KEY= "https://campusbuy-backend-nkmx.onrender.com/getwishlist";  
const GET_NOTIFICATIONS_API_KEY= "https://campusbuy-backend-nkmx.onrender.com/getnotification";
const GET_MESSAGES_API_KEY= "https://campusbuy-backend-nkmx.onrender.com/getconversations";
const GET_CALLBACK_API_KEY= "https://campusbuy-backend-nkmx.onrender.com/getcallback";
const GET_YOURPRODUCTS_API_KEY= "https://campusbuy-backend-nkmx.onrender.com/getyourproduct";
const GET_YOURREFERRALS_API_KEY= "https://campusbuy-backend-nkmx.onrender.com/getyourreferrals";
const UPDATE_AVATAR_API_KEY = 'https://campusbuy-backend-nkmx.onrender.com/uploaduserimage';
const DELETE_USER_API_KEY = 'https://campusbuy-backend-nkmx.onrender.com/deleteuser'

const axiosInstance = axios.create({
  baseURL: 'https://campusbuy-backend-nkmx.onrender.com', // Replace with your API base URL
});

// Function to set JWT token in the headers
const setAuthToken = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
};

// Use this function to set the token when the user logs in or the token is available
if (accessedToken && accessedToken.accessToken){
  setAuthToken(accessedToken.accessToken);
}  
// Now, you can use axiosInstance for your requests with the token included in the headers

  const handleNavLinkClick = (componentName) => {
    setActiveComponent(componentName);
  };

   const returnedPage = useSelector(state => state.activePage.activePage);

    // Use the result in a meaningful way
    const navigate = useNavigate();
   
    useEffect(() => {
      // Set the active component when the returnedPage changes
      setActiveComponent(returnedPage);
    }, [returnedPage]);

const loadPage = async (API, store) => {
        try {

          if (accessedToken) {
            const response = await axiosInstance.get(API);
            await localStorage.setItem(store, JSON.stringify(response.data));
          }
        } catch (error) {
          console.error('Error navigating to Your Account:', error);
        }
      };

      const handleAvatarChange = async (e) => {
        e.preventDefault();
        const file = e.target.files[0];
          try {
           
            const formData = new FormData();
            formData.append('images', file);
        
            const response = await axiosInstance.put(`${UPDATE_AVATAR_API_KEY}/${storedUserData.id? storedUserData.id : storedUserData._id}`,  formData)
            localStorage.setItem('userData', JSON.stringify(response.data));
            navigate(`/mainpage/${storedUserData.id? storedUserData.id : storedUserData._id}`)
        
            // Log the parsed user data    
      
          } catch (error) {
            // Handle error
            alert('Invalid image format or network issues');
            console.error('Error updating avatar:', error);
          } 
        
        
      };
    
    
  const renderComponent = () => {
    switch (activeComponent) {
      case 'Account':
        return <Account setActiveComponent={setActiveComponent}/>;
      case 'Wishlist':
        loadPage(GET_WISHLIST_API_KEY, "wishlistcard")
        return <Wishlist />;
      case 'Notifications':
        loadPage(GET_NOTIFICATIONS_API_KEY, "notificationscard")
        return <Notifications />;
      case 'Messages':
        loadPage(GET_MESSAGES_API_KEY, "conversationscard")
        return <Messages />;
      case 'Yourproducts':
        loadPage(GET_YOURPRODUCTS_API_KEY, "yourproductscard")
        return <Yourproducts />;
      case 'Mystore':
        loadPage(GET_YOURPRODUCTS_API_KEY, "mystorecard")
        return <Mystore />;
      case 'Callbacks':
        loadPage(GET_CALLBACK_API_KEY, "callbackcard")
        return <Callbacks />;
      default:
        return null;
    }
  };
  
  
  
  const { id } = useParams();

  useEffect(() => {
    // Check if the userId matches the id from useParams
    const storedUserData = JSON.parse(localStorage.getItem('userData'));

    if (storedUserData && storedUserData.id) {
      // Use the stored user data id as a parameter for the route
      navigate(`/mainpage/${storedUserData.id? storedUserData.id : storedUserData._id}`);
    }
  }, [navigate]);
  
  
  const Signout= async() => {
    try{
     await localStorage.removeItem('userData');
     await localStorage.removeItem('wishlistcard');
     await localStorage.removeItem('notificationscard');
     await localStorage.removeItem('yourproductscard');
     await localStorage.removeItem('callbackcard');
     await localStorage.removeItem('usercard');
     
      navigate('/');
}catch (error){
      console.error('Error signing out Account:', error);
    }
    
  }
  const Referrals= () => {
    window.open('/yourreferrals', '_blank');
  }

  const deleteAccount = async()=> {
    try {
      closeAccountDelete();
        openLoading();
        const response = await axiosInstance.delete(`${DELETE_USER_API_KEY}/${storedUserData.id? storedUserData.id : storedUserData._id}`)
        setTimeout(() => {
          closeLoading();
          openAccountDeleted();
          localStorage.removeItem('userData');
          navigate("/");
        }, 4000);
        
    } catch (error){
      if(error.response){
        if (error.response.status === 403) {
            openSignin(true);
            setTimeout(() => {
              closeSignin();
              navigate('/signin')
            }, 3000);
          }else if(error.response.status === 404) {
            alert('User not found. please signin');
          }else {
            openAccountNotDeleted();
            setTimeout(() => {
              closeAccountNotDeleted();
            }, 5000);
      console.error('Error creating your product:', error);
    // Handle error as needed
          }
     }
    }finally {
      closeLoading(); // Set loading to false after the request (whether success or failure)
    }
        };

  // Tips Setup start

  const [activeTip, setActiveTip] = useState(null);

const closeTips = () => {
    setActiveTip(false);
};

const tipsArray = ['Pricetips', 'Purchasetips', 'Bulkgoodstips'];
const getRandomTip = () => tipsArray[Math.floor(Math.random() * tipsArray.length)];const selectTips = Math.floor(Math.random() * 3); 
useEffect(() => {
    const displayRandomTip = () => {
      const randomTip = getRandomTip();
      setActiveTip(randomTip);
    };

    // Display a random tip 30 seconds after the page mounts
    const displayTipTimeout = setTimeout(() => {
      displayRandomTip();
    }, 30000);

    // Change the tip every 10 minutes
    const changeTipInterval = setInterval(() => {
      displayRandomTip();
    }, 600000);

    // Clear the interval when the component unmounts
    return () => {
      clearTimeout(displayTipTimeout);
      clearInterval(changeTipInterval);
    };
  }, []); // Empty dependency array ensures that this effect runs only once on mount

let tipComponent = null;

  if (activeTip === 'Pricetips') {
    tipComponent = <Pricetips closeTips={closeTips} />;
  } else if (activeTip === 'Purchasetips') {
    tipComponent = <Purchasetips closeTips={closeTips} />;
  } else if (activeTip === 'Bulkgoodstips') {
    tipComponent = <Bulkgoodstips closeTips={closeTips} />;
  }

// Tips setup ends here


  if(storedUserData){
  return (
    <div className='w-[100%] max-lg:bg-black'>
      <div className='max-lg:mb-[4rem] mb-[12rem]'><BlackSecondheader /></div>
      <div className='container'>
        <div className='row max-lg:hidden '>
        <div className='w-[20%] flex justify-center items-center  all-round-tips rounded-lg bg-[rgba(255, 255, 255, 0.8)]'>
   
</div>
        

          <div className='col-3 flex flex-col gap-2 text-center items-center justify-start'>
          <div className="flex justify-center items-center relative">
  {storedUserData && storedUserData.image && storedUserData.image[0] ? (
    <div className='flex flex-col gap-1 justify-center items-center'>
      <img src={storedUserData.image[0]} alt="Avatar" style={avatar} />
      <div className='flex flex-col gap-1 justify-center px-4 items-center m-2'>
        <div className='flex flex-col gap-1 '>
          <strong className='text-[12px]'>{storedUserData.firstname}  {storedUserData.lastname}</strong>
          <strong className='text-[8px]'>{storedUserData.email}</strong>
        </div>
        <input
          id="file-input"
          type="file"
          name="image"
          accept="image/*"
          onChange={handleAvatarChange}
          className="hidden-input"
        />
        <label htmlFor="file-input" className="file-label text-[12px]">Change Image</label>
      </div>
    </div>
  ) : (
    <div className='flex flex-col gap-1 items-center justify-center'>
      <MdAccountCircle className="w-[100%] text-[6rem] text-[#FEBD69]" />
      <div className='flex flex-col gap-1 justify-center px-4 items-center m-2'>
        <div className='flex flex-col gap-1 '>
          <strong className='text-[12px]'>{storedUserData.firstname}  {storedUserData.lastname}</strong>
          <strong className='text-[8px]'>{storedUserData.email}</strong>
        </div>
        <input
          id="file-input"
          type="file"
          name="image"
          accept="image/*"
          onChange={handleAvatarChange}
          className="hidden-input"
        />
        <label htmlFor="file-input" className="file-label text-[12px]">Change Image</label>
      </div>
    </div>
  )}
</div>

            <NavLink
              className='m-2 mainpage-components'
              style={activeComponent === 'Account'? activepage : null }
              onClick={() => handleNavLinkClick('Account')}
              activeclassname='active-link'
            >
              Account
            </NavLink>
            <NavLink
              className='m-2 mainpage-components'
              style={activeComponent === 'Wishlist'? activepage : null}
              onClick={() => handleNavLinkClick('Wishlist')}
              activeclassname='active-link'
            >
              Wishlist
            </NavLink>
            <NavLink
              className='m-2 mainpage-components'
              style={activeComponent === 'Notification'? activepage : null}
              onClick={() => handleNavLinkClick('Notifications')}
              activeclassname='active-link'
            >
              Notifications
            </NavLink>
            <NavLink
              className='m-2 mainpage-components'
              style={activeComponent === 'Messages'? activepage : null}
              onClick={() => handleNavLinkClick('Messages')}
              activeclassname='active-link'
            >
              Messages
            </NavLink>
            <NavLink
              className='m-2 mainpage-components'
              style={activeComponent === 'Yourproducts'? activepage : null}
              onClick={() => handleNavLinkClick('Yourproducts')}
              activeclassname='active-link'
            >
              My Products
            </NavLink>
            <NavLink
              className='m-2 mainpage-components'
              style={activeComponent === 'Mystore'? activepage : null}
              onClick={() => handleNavLinkClick('Mystore')}
              activeclassname='active-link'
            >
              My Store
            </NavLink>
            <NavLink
              className='m-2 mainpage-components'
              style={activeComponent === 'Callbacks'? activepage : null}
              onClick={() => handleNavLinkClick('Callbacks')}
              activeclassname='active-link'
            >
              Callback Requests
            </NavLink>
            <NavLink
              className='m-2 mainpage-components'
              style={activeComponent === 'Deleteaccount'? activepage : null}
              onClick={openAccountDelete}
              activeclassname='active-link'
            >Delete Account
            </NavLink>
            <NavLink
              className='m-2 mainpage-components'
              style={activeComponent === 'account'? activepage : null}
              onClick={Signout}
              activeclassname='active-link'
            >Sign out
            </NavLink>
          </div>
          <div className='col-8 shadow-md border border-gray-400'>{renderComponent()}</div>
        </div>
        <div>
          {loading && <div style={modals}><MediumLoader /></div>}
          {signin && <Sessiontimeout />}
          {accountDelete && <div style={modals}><Accountdeleteverifcation deleteAccount={deleteAccount} closeAccountDelete={closeAccountDelete}/></div>}
          {accountDeleted && <div style={modals}><Accountdeleted closeAccountDeleted={closeAccountDeleted}/></div>}
          {accountNotDeleted && <div style={modals}><Accountnotdeleted closeAccountNotDeleted={closeAccountNotDeleted}/></div>}
        </div>
        
      </div>
      <div className=' hidden max-lg:block p-2 container text-white'>
        <div className=''>
        <div style={{zIndex:"4000"}} className='w-[30%] mobile-all-round-tips rounded-lg bg-[rgba(255, 255, 255, 0.8)]'>
   
</div>
        
<div className='flex justify-between items-center my-4 '>
<div className="w-[30%] flex justify-center items-center relative">
  {storedUserData && storedUserData.image && storedUserData.image[0] ? (
    <div className='flex flex-col gap-1 justify-center items-center'>
      <img src={storedUserData.image[0]} alt="Avatar" style={mobileAvatar} />
      <div className='flex flex-col gap-1 justify-center px-4 items-center m-2'>
        <div className='flex flex-col gap-1 '>
          <strong className='text-[8px]'>{storedUserData.firstname}  {storedUserData.lastname}</strong>
          <strong className='text-[7px]'>{storedUserData.email}</strong>
        </div>
        <input
          id="file-input"
          type="file"
          name="image"
          accept="image/*"
          onChange={handleAvatarChange}
          className="hidden-input"
        />
        <label htmlFor="file-input" className="mobile-file-label text-[8px]">Change Image</label>
      </div>
    </div>
  ) : (
    <div className='flex flex-col gap-1 items-center justify-center'>
      <MdAccountCircle className="w-[100%] text-[3rem] text-[#FEBD69]" />
      <div className='flex flex-col gap-1 justify-center px-1 items-center m-2'>
        <div className='flex flex-col gap-1 '>
          <strong className='text-[8px]'>{storedUserData.firstname}  {storedUserData.lastname}</strong>
          <strong className='text-[7px]'>{storedUserData.email}</strong>
        </div>
        <input
          id="file-input"
          type="file"
          name="image"
          accept="image/*"
          onChange={handleAvatarChange}
          className="hidden-input"
        />
        <label htmlFor="file-input" className="mobile-file-label text-[8px]">Change Image</label>
      </div>
    </div>
  )}
</div>
<div className='flex flex-wrap gap-1 text-[10px]'>
<button onClick={showModalorAds? openAds : AccountreferralLink}  className="p-2 bg-[#0d6efd] rounded-md ">{showModal ? (<div><ButtonLoader /></div>) : ('Referral Link')}</button>
<button onClick={showModalorAds? openAds : handleStoreLink}  className="p-2 bg-[#0d6efd] rounded-md ">{showStoreModal ? (<div><ButtonLoader /></div>) : ('Store Link')}</button>
<button className='bg-[#c61a09] text-white border border-[#FDD700] rounded-md'
        onClick={openAccountDelete} activeClassName='active-link'>Delete Account</button>   
        <button className='bg-[#FF6701] text-white border rounded-md'
        onClick={Signout} activeClassName='active-link'>Signout</button>   
        <button className='bg-[#FF6701] text-white border rounded-md'
        onClick={showModalorAds? openAds : Referrals} activeClassName='active-link'>Referrals</button>   
</div>
        </div>

        <div className='flex my-2 justify-between items-center text-white text-bold text-[10px] '>
        <NavLink   style={{borderBottom: activeComponent === 'Account' ? '2px solid #40EF14' : 'none'}} 
        onClick={() => handleNavLinkClick('Account')}activeClassName='active-link'>Account</NavLink>

  <NavLink style= {{borderBottom: activeComponent === 'Wishlist'? '2px solid #40EF14' : 'none'}}
  onClick={() => handleNavLinkClick('Wishlist' )}activeClassName='active-link'>Wishlist</NavLink>

  <NavLink style= {{borderBottom: activeComponent === 'Notifications'? '2px solid #40EF14' : 'none'}}
  onClick={() => handleNavLinkClick('Notifications' )}activeClassName='active-link'>Notifications</NavLink>
            
            <NavLink style= {{borderBottom: activeComponent === 'Messages'? '2px solid #40EF14' : 'none'}}
  onClick={() => handleNavLinkClick('Messages')}activeClassName='active-link'>Messages</NavLink>
  
  <NavLink style= {{borderBottom: activeComponent === 'Yourproducts'? '2px solid #40EF14' : 'none'}}
  onClick={() => handleNavLinkClick('Yourproducts')}activeClassName='active-link'>My Products</NavLink>
  <NavLink style= {{borderBottom: activeComponent === 'Mystore'? '2px solid #40EF14' : 'none'}}
  onClick={() => handleNavLinkClick('Mystore')}activeClassName='active-link'>My Store</NavLink>
  <NavLink style= {{borderBottom: activeComponent === 'Callbacks'? '2px solid #40EF14' : 'none'}}
  onClick={() => handleNavLinkClick('Callbacks')}activeClassName='active-link'>Callbacks</NavLink>
        </div>
          <div className='w-[100%] shadow-md border border-gray-400'>{renderComponent()}</div>
        </div>
          {loading && <div style={modals}><MediumLoader /></div>}
          {signin && <Sessiontimeout />}
          {accountDelete && <div style={modals}><Accountdeleteverifcation deleteAccount={deleteAccount} closeAccountDelete={closeAccountDelete}/></div>}
          {accountDeleted && <div style={modals}><Accountdeleted closeAccountDeleted={closeAccountDeleted}/></div>}
          {accountNotDeleted && <div style={modals}><Accountnotdeleted closeAccountNotDeleted={closeAccountNotDeleted}/></div>}
      </div>
      <div>
        </div>
       
      <div className=''><Footer /></div>
    </div>
  );
  }else{
  return(
  null
  )
  }
  
};

export default Mainpage;

