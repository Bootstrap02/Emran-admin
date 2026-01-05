import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import Buyoncampusbuy from './FAQuestions/Buyoncampusbuy';
import Customersupport from './FAQuestions/Customersupport';
import Deliveryservice from './FAQuestions/Deliveryservice';
import Paymentservice from './FAQuestions/Paymentservice';
import Selloncampusbuy from './FAQuestions/Selloncampusbuy';
import Subscribenewsletter from './FAQuestions/Subscribenewsletter';
import Unsubscribenewsletter from './FAQuestions/Unsubscribenewsletter';
import { Pricetips, Purchasetips, Bulkgoodstips } from '../Modals/Tips';
import Nav from '../Modals/General/Nav';

const Mainpage = () => {
  const [active, setActive] = useState('how do i contact customer support');
  const [ mobileActive, setMobileActive] = useState(false);
  const [signin, setSignin] = useState(false);
  const [nav, setNav] = useState(false);


  const renderComponent = () => {
    switch (active) {
      case 'how do i contact customer support':
        return <Customersupport />;
      case 'How can i sell on Campusbuy':
        return <Selloncampusbuy />;
      case 'How can i buy on Campusbuy':
        return <Buyoncampusbuy />;
      case 'Does campusbuy offer delivery services':
        return <Deliveryservice />;
      case 'Does campusbuy offer payment services':
        return <Paymentservice />;
      case 'how can i subscribe to campusbuy newsletter':
        return <Subscribenewsletter />;
      case 'how can i unsubscribe to campusbuy newsletter':
        return <Unsubscribenewsletter />;
      default:
        return null;
    }
  };

  const handleNavLinkClick =async (componentName) => {
    await setActive(componentName);
          setMobileActive(componentName)
  };

  const [activeTip, setActiveTip] = useState(null);

  const openMobileActive = () => {
      setMobileActive(true);
  };
  const closeMobileActive = () => {
      setMobileActive(false);
  };
  const closeTips = () => {
      setActiveTip(false);
  };
  const openNav = () => {
    setNav(true);
  };
  const closeNav = () => {
    setNav(false);
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

  return (
    <div className='w-[100%]'>
    <div className=' text-center w-[100%]   max-lg:hidden '>
      <Header className='mb-[2rem] bg-black' openNav={openNav} closeNav={closeNav}/>
      <div className='w-[100%] bg-black p-4'>
      <div className='w-[25%]  max-lg:w-[30%] all-round-tips rounded-lg bg-[rgba(255, 255, 255, 0.8)]'>
   
</div>

<div className='my-[6rem] py=[2rem] text-white '>
<div className=' text-2xl text-center mb-6'> <p><strong>FAQS</strong></p></div>
<div className=' flex justify-center gap-2'><NavLink to='/'>Home ||</NavLink> <NavLink to='/faqs'>FAQS</NavLink></div>
</div>
</div>
      
     <div className='container'>
     <div className='row max-lg:hidden my-4 '>
        <div className='col-2 m-2 flex flex-col gap-2 '>
          <NavLink
            className='m-2 p-2 border border-gray-400   '
            onClick={() => handleNavLinkClick('how do i contact customer support')}
            activeClassName='active-link'
          >
            how do i contact customer support
          </NavLink>
          <NavLink
            className='m-2 p-2 border border-gray-400  '
            onClick={() => handleNavLinkClick('How can i sell on Campusify')}
            activeClassName='active-link'
          >
            How can i sell on Campusify
          </NavLink>
          <NavLink
            className='m-2 p-2 border border-gray-400  '
            onClick={() => handleNavLinkClick('How can i buy on Campusify')}
            activeClassName='active-link'
          >
            How can i buy on campusify
          </NavLink>
          <NavLink
            className='m-2 p-2 border border-gray-400  '
            onClick={() => handleNavLinkClick('Does campusify offer delivery services')}
            activeClassName='active-link'
          >
            Does campusify offer delivery services
          </NavLink>
          <NavLink
            className='m-2 p-2 border border-gray-400  '
            onClick={() => handleNavLinkClick('Does campusify offer payment services')}
            activeClassName='active-link'
          >
            Does campusify offer payment services
          </NavLink>
          <NavLink
            className='m-2 p-2 border border-gray-400  '
            onClick={() => handleNavLinkClick('how can i subscribe to campusify newsletter')}
            activeClassName='active-link'
          >
            how can i subscribe to campusify newsletter
          </NavLink>
          <NavLink
            className='m-2 p-2 border border-gray-400  '
            onClick={() => handleNavLinkClick('how can i unsubscribe to campusify newsletter')}
            activeClassName='active-link'
          >
            how can i unsubscribe to campusify newsletter
          </NavLink>
        </div>
        <div className='col-9 m-2 shadow-md border border-gray-400'>{renderComponent()}</div>
      </div>
     </div>
     <div className='w-[100%] hidden max-lg:block'>
     <div className='row '>
     <div className='w-[25%]  max-lg:w-[30%] mobile-all-round-tips rounded-lg bg-[rgba(255, 255, 255, 0.8)]'>
   
</div>
        <div className='w-[20%]  flex flex-col gap-2 justify-start items-center text-sm '>
          <NavLink
            className=' border border-gray-400 text-center p-2 '
            onClick={() => handleNavLinkClick('how do i contact customer support')}
            activeClassName='active-link'
          >
             how do i contact customer support
          </NavLink>
          <NavLink
            className=' border border-gray-400 text-center p-2  '
            onClick={() => handleNavLinkClick('How can i sell on Campusify')}
            activeClassName='active-link'
          >
            How can i sell on Campusify
          </NavLink>
          <NavLink
            className=' border border-gray-400 text-center p-2  '
            onClick={() => handleNavLinkClick('How can i buy on Campusify')}
            activeClassName='active-link'
          >
             How can i buy on Campusify
          </NavLink>
          <NavLink
            className=' border border-gray-400 text-center p-2  '
            onClick={() => handleNavLinkClick('Does campusify offer delivery services')}
            activeClassName='active-link'
          >
            Does campusify offer delivery services
          </NavLink>
          <NavLink
            className=' border border-gray-400 text-center p-2  '
            onClick={() => handleNavLinkClick('Does campus buy offer payment services')}
            activeClassName='active-link'
          >
             Does campus buy offer payment services
          </NavLink>
          <NavLink
            className=' border border-gray-400 text-center p-2  '
            onClick={() => handleNavLinkClick('how can i subscribe to campusify newsletter')}
            activeClassName='active-link'
          >
            how can i subscribe to campusify newsletter
          </NavLink>
          <NavLink
            className=' border border-gray-400 text-center p-2  '
            onClick={() => handleNavLinkClick('how can i unsubscribe to campusify newsletter')}
            activeClassName='active-link'
          >
            how can i unsubscribe to campusify newsletter
          </NavLink>
        </div>
        <div className='w-[80%] shadow-md border border-gray-400'>{renderComponent()}</div>
      </div>
     </div>
     <div  className=''><Footer/></div>
    </div>
    <div className=' text-center w-[100%]  hidden max-lg:block pb-[8rem] '>
      <Header className='mb-[2rem] bg-black' openNav={openNav} closeNav={closeNav}/>
      <div className='w-[100%] bg-black p-4'>
      
<div className='my-[6rem] py=[2rem] text-white '>
<div className=' text-2xl text-center mb-6'> <p><strong>FAQS</strong></p></div>
<div className=' flex justify-center gap-2'><NavLink to='/'>Home ||</NavLink> <NavLink to='/faqs'>FAQS</NavLink></div>
</div>
</div>
      
     <div className='container'>
      <p className='text-xl text-center'>FAQS</p>
      <strong className='text-2xl text-center text-[#FEBD69]'>Ask us anything</strong>
      <p className='text-lg text-center'>Have any questions, we are here to assist you.</p>
     <div className='flex flex-col gap-3 my-4 '>
        <div className='container m-2 flex flex-col gap-2 '>
          <aside className='m-2 p-2 border border-gray-400'>
          <details>
            <summary><strong>how do i contact customer support</strong></summary>
            <div className='mt-4'>
       <Customersupport/>
        </div>
          </details>
          </aside>
          <aside className='m-2 p-2 border border-gray-400'>
          <details>
            <summary><strong>How can i sell on Campusify</strong></summary>
            <div className='mt-4'>
        <Selloncampusbuy/>
        </div>
          </details>
          </aside>
          <aside className='m-2 p-2 border border-gray-400'>
          <details>
            <summary><strong>How can i buy on campusify</strong></summary>
            <div className='mt-4'>
       <Buyoncampusbuy/>
        </div>
          </details>
          </aside>
          <aside className='m-2 p-2 border border-gray-400'>
          <details>
            <summary><strong> Does campusify offer delivery services</strong></summary>
            <div className='mt-4'>
        <Deliveryservice/>
        </div>
          </details>
          </aside>
          
          <aside className='m-2 p-2 border border-gray-400'>
          <details>
            <summary><strong>Does campusify offer payment services</strong></summary>
            <div className='mt-4'>
        <Paymentservice/>
        </div>
          </details>
          </aside>
          <aside className='m-2 p-2 border border-gray-400'>
          <details>
            <summary><strong>how can i subscribe to campusify newsletter</strong></summary>
            <div className='mt-4'>
       <Subscribenewsletter/>
        </div>
          </details>
          </aside>
          <aside className='m-2 p-2 border border-gray-400'>
          <details>
            <summary><strong>  how can i unsubscribe to campusify newsletter</strong></summary>
            <div className='mt-4'>
        <Unsubscribenewsletter/>
        </div>
          </details>
          </aside>
        </div>
      </div>
     </div>
     <div className={`nav-slide ${nav ? 'open' : ''}`}>
  <Nav closeModal={closeNav} setSignin={setSignin}/>
</div>
     <div  className=''><Footer/></div>
    </div>
    </div>
  );
};

export default Mainpage;
