import React, {useState} from 'react';
import {NavLink, useNavigate} from 'react-router-dom';
import { Tokenerrormodal } from '../../Modals/Forms';


const Selloncampusbuy = () => {

    const navigate = useNavigate();
    const [signin, setSignin] = useState(false);
  
    const openSignin = () => {
      setSignin(true);
    };
  
    const closeSignin = () => {
      setSignin(false);
    };

  
    const accessedToken =   JSON.parse(localStorage.getItem('userData'));

    const postProduct = async () => {
      if (accessedToken) {
        navigate('/createproductpage');
      } else {
        await openSignin();
        setTimeout(() => {
          navigate('/signin');
          closeSignin();
        }, 3000);
      }
    }
    

   
  
    
  

  return (
    <div className='container'>
        <div className='text-xl'><strong>Sell on Campusify</strong></div>
        <div className='mt-4'>
        <ul>
            <li className='my-3'>Click on 
            <NavLink to=''>
          <button className='p-2 sell-product-btn btn-warning text-black' onClick={postProduct}>Sell Something</button>
        </NavLink></li>
        <li className='my-3'>Fill the form</li>
        <li className='my-3'>Click Submit button</li>
        </ul>
        </div>
        <div >{signin && <div className='  border p-4'><Tokenerrormodal/></div>}</div>
    </div>
  )
}

export default Selloncampusbuy