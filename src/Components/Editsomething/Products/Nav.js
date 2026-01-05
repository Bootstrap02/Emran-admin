import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Productdetails } from './Productdetails';
import Productstatus from './Productstatus';
import Contactinformation from './Contactinformation';
import Pricing from './Pricing';
import Productimages from './Productimages';

const Nav = () => {
    const accessedToken = JSON.parse(localStorage.getItem('userData'));
    const [activeComponent, setActiveComponent] = useState('Productdetails'); // Initial active component
    const [modal, setModal] = useState(false);
    const [activeTip, setActiveTip] = useState(null);
  
  
    const handleNavLinkClick = (componentName) => {
      setActiveComponent(componentName);
    };
  
  
      
  
      
    const renderComponent = () => {
      switch (activeComponent) {
        case 'Productdetails':
          return <Productdetails setActiveComponent={setActiveComponent} />;
        case 'Productstatus':
            return <Productstatus setActiveComponent={setActiveComponent} />;
        case 'Contactinformation':
            return <Contactinformation setActiveComponent={setActiveComponent} />;
        case 'Pricing':
            return <Pricing setActiveComponent={setActiveComponent} />;
        case 'Productimages':
            return <Productimages setActiveComponent={setActiveComponent} />;
        default:
          return null;
      }
    };  

  return (
    <div>
<div className='max-lg:hidden p-2 container '>
        <div className='flex justify-end items-center gap-[12rem] '>
        <div className='flex p-2 gap-8 mx-4 my-2 justify-start items-center text-white text-bold '>
        <NavLink   style={{borderBottom: activeComponent === 'Productdetails' ? '2px solid #40EF14' : 'none'}} 
        onClick={() => handleNavLinkClick('Productdetails')}activeClassName='active-link'>Product details</NavLink>

  <NavLink style= {{borderBottom: activeComponent === 'Productstatus'? '2px solid #40EF14' : 'none'}}
  onClick={() => handleNavLinkClick('Productstatus' )}activeClassName='active-link'>Status</NavLink>

  <NavLink style= {{borderBottom: activeComponent === 'Contactinformation'? '2px solid #40EF14' : 'none'}}
  onClick={() => handleNavLinkClick('Contactinformation' )}activeClassName='active-link'>Contact</NavLink>
            
            <NavLink style= {{borderBottom: activeComponent === 'Pricing'? '2px solid #40EF14' : 'none'}}
  onClick={() => handleNavLinkClick('Pricing')}activeClassName='active-link'>Pricing</NavLink>
  
  <NavLink style= {{borderBottom: activeComponent === 'Productimages'? '2px solid #40EF14' : 'none'}}
  onClick={() => handleNavLinkClick('Productimages')}activeClassName='active-link'>Images</NavLink>
        </div>
        <NavLink to='/contact' className=' text-[#FEBD69] '>Help</NavLink>
        </div>
    <div className=' m-2 w-[50%] my-[4rem] '>{renderComponent()}</div>



   </div>
   <div className='hidden max-lg:block p-2 container '>
        <div className='flex justify-end items-center gap-[2rem] '>
        <div className='flex p-2 gap-2 mx-2 my-2 justify-start items-center text-white text-bold '>
        <NavLink   style={{borderBottom: activeComponent === 'Productdetails' ? '2px solid #40EF14' : 'none'}} 
        onClick={() => handleNavLinkClick('Productdetails')}activeClassName='active-link'>Product details</NavLink>

  <NavLink style= {{borderBottom: activeComponent === 'Productstatus'? '2px solid #40EF14' : 'none'}}
  onClick={() => handleNavLinkClick('Productstatus' )}activeClassName='active-link'>Status</NavLink>

  <NavLink style= {{borderBottom: activeComponent === 'Contactinformation'? '2px solid #40EF14' : 'none'}}
  onClick={() => handleNavLinkClick('Contactinformation' )}activeClassName='active-link'>Contact</NavLink>
            
            <NavLink style= {{borderBottom: activeComponent === 'Pricing'? '2px solid #40EF14' : 'none'}}
  onClick={() => handleNavLinkClick('Pricing')}activeClassName='active-link'>Pricing</NavLink>
  
  <NavLink style= {{borderBottom: activeComponent === 'Productimages'? '2px solid #40EF14' : 'none'}}
  onClick={() => handleNavLinkClick('Productimages')}activeClassName='active-link'>Images</NavLink>
        </div>
        <NavLink to='/contact' className=' text-[#FEBD69] '>Help</NavLink>
        </div>
    <div className=' m-2 w-[80%] my-[4rem] '>{renderComponent()}</div>



   </div>
    </div>
   
  )
}

export default Nav
