import React, { useState } from "react";
import { MdCancel, MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { NavLink, useNavigate } from 'react-router-dom';
import success from '../../assets/success.png';
import failed from '../../assets/failed.png';
import { BigLoader } from "../Loaders";

export const Loginmodal = ({ closeModal, openLoginSuccessModal, closeLoginSuccessModal}) => {
  const navigate = useNavigate();
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginModals, setLoginModals] = useState(false);
  const [unexistingUserModals, setUnexistingUserModals] = useState(false);
  const [unauthorizedModals, setUnauthorizedModals] = useState(false);
  const LOGIN_API_KEY = 'https://campusbuy-backend-nkmx.onrender.com/login';

  const togglePassword = () => {
    setPasswordVisibility(prevState => !prevState);
  };

  const renderComponent = () => {
    return passwordVisibility ? <MdOutlineVisibilityOff /> : <MdOutlineVisibility />;
  };

  const openLoading = () => {
    setLoading(true);
  };

  const closeLoading = () => {
    setLoading(false);
  };

  const openLoginModal = () => setLoginModals(true);
  const closeLoginModal = () => setLoginModals(false);
  const openUnexistingUserModal = () => setUnexistingUserModals(true);
  const closeUnexistingUserModal = () => setUnexistingUserModals(false);
  const openUnauthorizedModal = () => setUnauthorizedModals(true);
  const closeUnauthorizedModal = () => setUnauthorizedModals(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
      .matches(/^[A-Za-z0-9]+$/, 'Password can only contain letters and numbers')
      .min(8, 'Password must be at least 8 characters long')
      .required('Password is required')
  });

  const handleLogin = async (values, { resetForm }) => {
    try {
      openLoading();
      const response = await axios.post(LOGIN_API_KEY, values);
      if (response.data) {
        await localStorage.setItem('userData', JSON.stringify(response.data));
        setTimeout(() => localStorage.removeItem('userData'), 24 * 60 * 60 * 1000);      closeLoading();
        closeLoading();
        openLoginSuccessModal();
        resetForm();
        setTimeout(() => {
          closeLoginSuccessModal();
        }, 3000);
       await closeModal();
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 403) {
          openUnexistingUserModal();
          closeLoading();
          alert('User does not exist. please sign up');
          setTimeout(() => {
            closeUnexistingUserModal();
            navigate('/signup');
          }, 4000);
        } else if (error.response.status === 401) {
          openUnauthorizedModal();
          closeLoading();
          alert('Incorrect Password. Try Again!');
          setTimeout(() => {
            closeUnauthorizedModal();
          }, 9000);
        } else {
          alert('Connection error. Please refresh your network');
          closeLoading();
        }
      } else {
        alert('Connection error. Please refresh your network');
        console.error('Unexpected error:', error);
      }
    } finally {
    }
  };

  return (
    <div className="w-[100%]  flex flex-col justify-center items-center bg-white max-lg:text-[8px] text-white relative rounded-lg border-2 border-black">
      <div className='w-[100%] flex justify-between items-center rounded-lg text-center text-xl text-bold bg-[#FEBD69] px-4 py-2'>
      <h1 className=" text-md mt-2 text-[#379B07]">Sign in!</h1>
      <MdCancel onClick={closeModal} className='w-[25px] h-[25px]  text-black' />
      </div>
      <div className='flex flex-col gap-1 justify-center items-center w-[100%] p-4'>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={handleLogin}
        >
          {({ isSubmitting }) => (
            <Form className=' w-[100%] flex flex-col gap-1.5 mt-[1rem]'>
              <div className='text-[12px] w-[100%]'>
                <Field type='text' name='email' autoComplete="off" className='p-2 rounded-[6px] signup-border bg-[#F6BD63] text-black w-[100%]' required placeholder='Email Address' />
                <ErrorMessage name='email' component='div' className='text-red-500' />
              </div>
              <div className='text-[12px] w-[100%]'>
                <div className='relative rounded-[6px] signup-border bg-[#F6BD63] text-black'>
                  <Field type={passwordVisibility ? "text" : "password"} name='password' autoComplete="off" className='p-2 w-[100%] rounded-[6px] signup-border bg-[#F6BD63] text-black' required placeholder='Password' />
                  <div style={{ left: "85%", top: "40%" }} className='absolute' onClick={togglePassword}>{renderComponent()}</div>
                </div>
                <ErrorMessage name='password' component='div' className='text-red-500' />
              </div>
              <NavLink to='/forgotpassword' disabled={isSubmitting} className='text-[12px] text-blue-500'>Forgot Password ?</NavLink>
              <button type="submit" className='p-2 inline-block w-full rounded-[6px]  bg-[#379B07] text-white'>{loading ? (<div><BigLoader/></div>) : ('Submit')}</button>
            
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export const Sessionexpired = ({closeModal})=> {
    return(   
     <div className=" w-[100%]   flex flex-col justify-center items-center gap-2 bg-white max-lg:text-[8px] text-white relative rounded-lg border-2 border-black">
     <div  className='w-[100%] rounded-lg text-center text-xl max-lg:text-md max-lg:px-2 max-lg:py-1 text-black text-bold bg-[#FEBD69] px-4 py-2' >
     Timeout! Your Session has expired!
     </div>
     <div className='flex flex-col justify-center items-center p-[1rem] max-lg:p-[0.5rem]'>
     <h1 className=" text-md mt-2 text-[#8B0000]">Please sign in again.</h1>
     <div><img src={failed} alt='failed' className='w-[40px] h-[40px] ' /></div>
     </div>
     <button className="p-2 mb-2 bg-[#FEBD69] text-black text-bold rounded-lg" onClick={closeModal}>Close</button>
 </div>
    )
 }

export const Useralreadyexists = ({closeModal})=> {
    return(   
     <div className=" w-[100%]  flex flex-col justify-center items-center gap-2 bg-white max-lg:text-[8px] text-white relative rounded-lg border-2 border-black">
     <div  className='w-[100%] rounded-lg text-center text-xl text-black text-bold bg-[#FEBD69] px-4 py-2' >
     Whoops! User already exists!
     </div>
     <div className='flex flex-col justify-center items-center p-[1rem] max-lg:p-[0.5rem]'>
     <h1 className=" text-md mt-2 text-[#8B0000]">Please sign in.</h1>
     <div><img src={failed} alt='failed' className='w-[40px] h-[40px] ' /></div>
     </div>
     <button className="p-2 mb-2 bg-[#FEBD69] text-black text-bold rounded-lg" onClick={closeModal}>Close</button>
 </div>
    )
 }
export const Userdoesnotexist = ({closeModal})=> {
    return(   
     <div className=" w-[100%]  flex flex-col justify-center items-center gap-2 bg-white max-lg:text-[8px] text-white relative rounded-lg border-2 border-black">
     <div  className='w-[100%] rounded-lg text-center text-xl text-black text-bold bg-[#FEBD69] px-4 py-2' >
     Whoops! User does not exist!
     </div>
     <div className='flex flex-col justify-center items-center p-[1rem] max-lg:p-[0.5rem]'>
     <h1 className=" text-md mt-2 text-[#8B0000]">Please create an account.</h1>
     <div><img src={failed} alt='failed' className='w-[40px] h-[40px] ' /></div>
     </div>
     <button className="p-2 mb-2 bg-[#FEBD69] text-black text-bold rounded-lg" onClick={closeModal}>Close</button>
 </div>
    )
 }
export const Createaccountmobileerror = ({closeModal})=> {
    return(   
     <div className=" w-[100%]  flex flex-col justify-center items-center gap-2 bg-white max-lg:text-[8px] text-white relative rounded-lg border-2 border-black">
     <div  className='w-[100%] rounded-lg text-center text-xl text-black text-bold bg-[#FEBD69] px-4 py-2' >
     Whoops! Mobile Number 1 already used!
     </div>
     <div className='flex flex-col justify-center items-center p-[1rem] max-lg:p-[0.5rem]'>
     <h1 className=" text-md mt-2 text-[#8B0000]">Your phone number 1 has already been registered with a user. please change it.</h1>
     <div><img src={failed} alt='failed' className='w-[40px] h-[40px] ' /></div>
     </div>
     <button className="p-2 mb-2 bg-[#FEBD69] text-black text-bold rounded-lg" onClick={closeModal}>Close</button>
 </div>
    )
 }
export const Createaccountmobile2error = ({closeModal})=> {
    return(   
     <div className=" w-[100%]  flex flex-col justify-center items-center gap-2 bg-white max-lg:text-[8px] text-white relative rounded-lg border-2 border-black">
     <div  className='w-[100%] rounded-lg text-center text-xl text-black text-bold bg-[#FEBD69] px-4 py-2' >
     Whoops! Mobile Number 2 already used!
     </div>
     <div className='flex flex-col justify-center items-center p-[1rem] max-lg:p-[0.5rem]'>
     <h1 className=" text-md mt-2 text-[#8B0000]">Your phone number 2 has already been registered with a user. please change it.</h1>
     <div><img src={failed} alt='failed' className='w-[40px] h-[40px] ' /></div>
     </div>
     <button className="p-2 mb-2 bg-[#FEBD69] text-black text-bold rounded-lg" onClick={closeModal}>Close</button>
 </div>
    )
 }
export const Resetpasswordlinkexpired = ({closeModal})=> {
    return(   
     <div className=" w-[100%]  flex flex-col justify-center items-center gap-2 bg-white max-lg:text-[8px] text-white relative rounded-lg border-2 border-black">
     <div  className='w-[100%] rounded-lg text-center text-xl text-black text-bold bg-[#FEBD69] px-4 py-2' >
     Whoops! Password Link Expired!
     </div>
     <div className='flex flex-col justify-center items-center p-[1rem] max-lg:p-[0.5rem]'>
     <h1 className=" text-md mt-2 text-[#8B0000]">Your reset password link has expired. Please try again later</h1>
     <div><img src={failed} alt='failed' className='w-[40px] h-[40px] ' /></div>
     </div>
     <button className="p-2 mb-2 bg-[#FEBD69] text-black text-bold rounded-lg" onClick={closeModal}>Close</button>
 </div>
    )
 }

 export const Incorrectpassword = ({closeModal})=> {
    return(   
     <div className=" w-[100%]  flex flex-col justify-center items-center gap-2 bg-white max-lg:text-[8px] text-white relative rounded-lg border-2 border-black">
     <div  className='w-[100%] rounded-lg text-center text-xl text-black text-bold bg-[#FEBD69] px-4 py-2' >    
     <MdCancel onClick={closeModal}  className='w-[25px] h-[25px] ml-[90%]' />
     </div>
     <div className='flex flex-col justify-center items-center p-[1rem] max-lg:p-[0.5rem]'>
     <strong className=" text-md mb-2 text-[#8B0000] text-bold">Incorrect Password! Please try again.</strong>
     </div>
 </div>
    )
 }

 export const Loginsuccessful = ({closeModal})=> {
    return(   
     <div className=" w-[100%]  flex flex-col justify-center items-center gap-2 bg-white max-lg:text-[8px] text-white relative rounded-lg border-2 border-black">
     <div  className='w-[100%] rounded-lg text-center text-xl text-black text-bold bg-[#FEBD69] px-4 py-2' >    
     <MdCancel onClick={closeModal}  className='w-[25px] h-[25px] ml-[90%]' />
     </div>
     <div className='flex flex-col justify-center items-center p-[1rem] max-lg:p-[0.5rem]'>
     <strong className=" text-md mb-2 text-[#379B07] text-bold">You have successfully signed in to your account.</strong>
     </div>
 </div>
    )
 }

 export const Createaccountsuccessful = ({closeModal})=> {
    return(   
     <div className=" w-[100%]  flex flex-col justify-center items-center gap-2 bg-white max-lg:text-[8px] text-white relative rounded-lg border-2 border-black">
     <div  className='w-[100%] rounded-lg text-center text-xl text-black text-bold bg-[#FEBD69] px-4 py-2' >    
     <MdCancel onClick={closeModal}  className='w-[25px] h-[25px] ml-[90%]' />
     </div>
     <div className='flex flex-col justify-center items-center p-[1rem] max-lg:p-[0.5rem]'>
     <strong className=" text-md mb-2 text-[#379B07] text-bold">Your account has been successfully created.</strong>
     </div>
 </div>
    )
 }

 export const Updateaccountsuccessful = ({closeSigninAgain})=> {
    return(   
     <div className=" w-[100%]  flex flex-col justify-center items-center gap-2 bg-white max-lg:text-[8px] text-white relative rounded-lg border-2 border-black">
     <div  className='w-[100%] rounded-lg text-center text-xl text-black text-bold bg-[#FEBD69] px-4 py-2' >
     Account updated successfully!
     </div>
     <div className='flex flex-col justify-center items-center p-[1rem] max-lg:p-[0.5rem]'>
     <h1 className=" text-md mt-2 text-black">Your account has been updated successfully. Please sign in again.</h1>
     </div>
     <button className="p-2 mb-2 bg-[#FEBD69] text-black text-bold rounded-lg" onClick={closeSigninAgain}>Close</button>
 </div>
    )
 }
 export const Resetpasswordemail = ({closeModal})=> {
    return(   
     <div className=" w-[100%]  flex flex-col justify-center items-center gap-2 bg-white max-lg:text-[8px] text-white relative rounded-lg border-2 border-black">
     <div  className='w-[100%] rounded-lg text-center text-xl text-black text-bold bg-[#FEBD69] px-4 py-2' >
     Email sent successfully!
     </div>
     <div className='flex flex-col justify-center items-center p-[1rem] max-lg:p-[0.5rem]'>
     <h1 className=" text-md mt-2 text-black">A reset password link has been sent to your email. please check your email.</h1>
     </div>
     <button className="p-2 mb-2 bg-[#FEBD69] text-black text-bold rounded-lg" onClick={closeModal}>Close</button>
 </div>
    )
 }

 export const Resetpasswordsuccessful = ({closeModal})=> {
    return(   
     <div className=" w-[100%]  flex flex-col justify-center items-center gap-2 bg-white max-lg:text-[8px] text-white relative rounded-lg border-2 border-black">
     <div  className='w-[100%] rounded-lg text-center text-xl text-black text-bold bg-[#FEBD69] px-4 py-2' >
     Password reset successful!
     </div>
     <div className='flex flex-col justify-center items-center p-[1rem] max-lg:p-[0.5rem]'>
     <h1 className=" text-md mt-2 text-[#379B07]">Your password has been successfully updated. Please sign in</h1>
     <div><img src={success} alt='success' className='w-[40px] h-[40px] ' /></div>
     </div>
     <button className="p-2 mb-2 bg-[#FEBD69] text-black text-bold rounded-lg" onClick={closeModal}>Close</button>
 </div>
    )
 }