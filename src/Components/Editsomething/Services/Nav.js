import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Servicedetails } from './Servicedetails';
import Servicestatus from './Servicestatus';
import Contactinformation from './Contactinformation';
import Pricing from './Pricing';
import Serviceimages from './Serviceimages';

const Nav = () => {
    const accessedToken = JSON.parse(localStorage.getItem('userData'));
    const [activeComponent, setActiveComponent] = useState('Servicedetails'); // Initial active component
    const [modal, setModal] = useState(false);
    const [activeTip, setActiveTip] = useState(null);

  
    const handleNavLinkClick = (componentName) => {
      setActiveComponent(componentName);
    };
  
  
      
  
      
    const renderComponent = () => {
      switch (activeComponent) {
        case 'Servicedetails':
          return <Servicedetails setActiveComponent={setActiveComponent} />;
        case 'Servicestatus':
            return <Servicestatus setActiveComponent={setActiveComponent} />;
        case 'Contactinformation':
            return <Contactinformation setActiveComponent={setActiveComponent} />;
        case 'Pricing':
            return <Pricing setActiveComponent={setActiveComponent} />;
        case 'Serviceimages':
            return <Serviceimages setActiveComponent={setActiveComponent} />;
        default:
          return null;
      }
    };  

  return (
  <div>
     <div className='max-lg:hidden p-2 container '>
        <div className='flex justify-end items-center gap-[12rem] '>
        <div className='flex p-2 gap-8 mx-4 my-2 justify-start items-center text-white text-bold '>
        <NavLink   style={{borderBottom: activeComponent === 'Servicedetails' ? '2px solid #40EF14' : 'none'}} 
        onClick={() => handleNavLinkClick('Servicedetails')}activeClassName='active-link'>Service details</NavLink>

  <NavLink style= {{borderBottom: activeComponent === 'Servicestatus'? '2px solid #40EF14' : 'none'}}
  onClick={() => handleNavLinkClick('Servicestatus')}activeClassName='active-link'>Status</NavLink>

  <NavLink style= {{borderBottom: activeComponent === 'Contactinformation'? '2px solid #40EF14' : 'none'}}
  onClick={() => handleNavLinkClick('Contactinformation')}activeClassName='active-link'>Contact</NavLink>
            
            <NavLink style= {{borderBottom: activeComponent === 'Pricing'? '2px solid #40EF14' : 'none'}}
  onClick={() => handleNavLinkClick('Pricing')}activeClassName='active-link'>Pricing</NavLink>
  
  <NavLink style= {{borderBottom: activeComponent === 'Serviceimages'? '2px solid #40EF14' : 'none'}}
  onClick={() => handleNavLinkClick('Serviceimages')}activeClassName='active-link'>Images</NavLink>
        </div>
        <NavLink to='/contact' className=' text-[#FEBD69] '>Help</NavLink>
        </div>
    <div className=' m-2 w-[50%] my-[4rem] '>{renderComponent()}</div>



   </div>
   <div className='hidden max-lg:block p-2 container border-2'>
        <div className='flex justify-end items-center '>
        <div className='flex p-2 gap-2 mx-2 my-2 justify-start items-center text-white text-bold '>
        <NavLink   style={{borderBottom: activeComponent === 'Servicedetails' ? '2px solid #40EF14' : 'none'}} 
        onClick={() => handleNavLinkClick('Servicedetails')}activeClassName='active-link'>Service details</NavLink>

  <NavLink style= {{borderBottom: activeComponent === 'Servicestatus'? '2px solid #40EF14' : 'none'}}
  onClick={() => handleNavLinkClick('Servicestatus')}activeClassName='active-link'>Status</NavLink>

  <NavLink style= {{borderBottom: activeComponent === 'Contactinformation'? '2px solid #40EF14' : 'none'}}
  onClick={() => handleNavLinkClick('Contactinformation')}activeClassName='active-link'>Contact</NavLink>
            
            <NavLink style= {{borderBottom: activeComponent === 'Pricing'? '2px solid #40EF14' : 'none'}}
  onClick={() => handleNavLinkClick('Pricing')}activeClassName='active-link'>Pricing</NavLink>
  
  <NavLink style= {{borderBottom: activeComponent === 'Serviceimages'? '2px solid #40EF14' : 'none'}}
  onClick={() => handleNavLinkClick('Serviceimages')}activeClassName='active-link'>Images</NavLink>
        </div>
        <NavLink to='/contact' className=' text-[#FEBD69] '>Help</NavLink>
        </div>
    <div className=' m-2 w-[80%] my-[4rem] '>{renderComponent()}</div>



   </div>
  </div>
  )
}

export default Nav
