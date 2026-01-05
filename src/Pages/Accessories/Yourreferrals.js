import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import Avatarsample from '../../assets/Avatarsample.jpg';
import { FailedMessage, Referrals, SuccessMessage } from '../../Modals/Pages/Referrals';
import Nav from '../../Modals/General/Nav';

export const Yourreferrals = () => {
  const [modal, setModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [failedMessage, setFailedMessage] = useState(false);
  const referrals = JSON.parse(localStorage.getItem('referrals'));
  const [signin, setSignin] = useState(false);
  const [nav, setNav] = useState(false);

  const avatar = {
    borderRadius: '50%',
    border: "3px solid #5D1523",
    width: "40px", // Smaller size to fit in the flex container
  };

  const modals = {
    position: 'fixed',
    top: '30%',
    right: '30%',
    zIndex: '4000',
    width: '50%',
  };

  const openModal = () => {
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
  };
  const openNav = () => {
    setNav(true);
  };
  const closeNav = () => {
    setNav(false);
  };
  

  const openSuccessMessage = () => {
    setSuccessMessage(true);
  };

  const closeSuccessMessage = () => {
    setSuccessMessage(false);
  };

  const openFailedMessage = () => {
    setFailedMessage(true);
  };

  const closeFailedMessage = () => {
    setFailedMessage(false);
  };

  // Helper function to format the date to "Month Year"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const groupReferralsByMonth = (referrals) => {
    if (!referrals || referrals.length === 0) {
      return {};
    }

    return referrals.reduce((acc, user) => {
      const monthYear = formatDate(user.createdAt);
      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      acc[monthYear].push(user);
      return acc;
    }, {});
  };

  // Ensure referrals and referrals.users exist before calling groupReferralsByMonth
  const groupedReferrals = referrals ? groupReferralsByMonth(referrals) : {};

  return (
    <div className='w-[100%]'>
      <Header className='mb-[2rem] bg-black' openNav={openNav} closeNav={closeNav}/>
      <div className='w-[100%] bg-black p-4'>
        <div className='my-[6rem] max-lg:m-[3rem] text-white'>
          <div className='text-2xl text-center mb-6'>
            <p><strong>Your Referrals</strong></p>
          </div>
          <div className='flex justify-center gap-2'>
            <NavLink to='/'>Home ||</NavLink>
            <NavLink to='/about'>Referrals</NavLink>
          </div>
        </div>
      </div>

      <div className='w-[100%] text-white bg-black'>
        <div className='container'>
        <div className='flex flex-col'> <button onClick={openModal} className='p-2 rounded-md mr-auto bg-gray-500 border my-4 '>Request Payment</button>
        <strong className='text-[#FFD700] text-[8px] mb-2 '>Minimum withdrawal = NGN1000</strong>
        </div> 

          {/* Check if there are any referred users */}
          {Object.keys(groupedReferrals).length === 0 ? (
            <div className="text-center mt-6">
              <p>No referred users</p>
            </div>
          ) : (
            Object.keys(groupedReferrals).map((monthYear, idx) => (
              <div >
                {/* Monthly Bar */}
                <div className='bg-gray-500 flex max-lg:text-[12px]  justify-between items-center text-center p-2 border text-black'>
                <strong>NGN70/REFERRAL</strong>
                  <strong>{groupedReferrals[monthYear].length} Users</strong>
                  {groupedReferrals[monthYear].length > 14 ? <strong> Amount Earned: NGN{groupedReferrals[monthYear].length * 70}</strong> : null } 
                </div>

                {/* Referral list */}
                <div className='flex flex-wrap justify-start items-start gap-4'>
                  {groupedReferrals[monthYear].map((user) => (
                    <div key={user._id} className='w-[45%] p-4 bg-[#1A1A1A] rounded-md flex items-center gap-4'>
                      {/* Display only the date part of createdAt */}
                      <div className='w-[60%]'>{user.firstname} {user.lastname}</div>
                      <img src={user.image && user.image.length > 0 ? user.image[0] : Avatarsample} alt="Avatar" style={avatar} />
                      <div className='flex flex-col'>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {modal && <div style={modals}><Referrals closeModal={closeModal} openSuccessMessage={openSuccessMessage} openFailedMessage={openFailedMessage} /></div>}
      {successMessage && <div style={modals}><SuccessMessage closeMessage={closeSuccessMessage}  /></div>}
      {failedMessage && <div style={modals}><FailedMessage closeMessage={closeFailedMessage}  /></div>}
      <div className={`nav-slide ${nav ? 'open' : ''}`}>
  <Nav closeModal={closeNav} setSignin={setSignin}/>
</div>
      <Footer />
    </div>
  );
};
