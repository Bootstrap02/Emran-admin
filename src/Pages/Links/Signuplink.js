import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useNavigate, useParams } from 'react-router-dom'; 
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { NavLink, Link} from 'react-router-dom';
import {Secondheader} from '../../Components/Subheaders';
import Footer from '../../Components/Footer'
import { schools, states } from '../../Constants/Universities';
import {Minifooter} from '../../Components/Subheaders';
import { ColorRing  } from 'react-loader-spinner';
import { MdOutlineVisibility } from "react-icons/md";
import { MdOutlineVisibilityOff } from "react-icons/md";
import { Pricetips, Purchasetips, Bulkgoodstips } from '../../Modals/Tips';
import { BigLoader } from '../../Modals/Loaders';
import { Useralreadyexists, Userdoesnotexist, Resetpasswordlinkexpired, Incorrectpassword,Loginsuccessful,
         Createaccountsuccessful, Resetpasswordemail, Resetpasswordsuccessful, Createaccountmobileerror, Createaccountmobile2error } from '../../Modals/Pages/Signin';
        


export const Signuplink = () => {
    const {id} = useParams();
    const navigate= useNavigate();
  const [createAccountModals, setCreateAccountModals] = useState(false);
  const [createAccountErrorModals, setCreateAccountErrorModals] = useState(false);
  const [mobileErrorModal, setMobileErrorModal] = useState(false);
  const [mobile2ErrorModal, setMobile2ErrorModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [activeTip, setActiveTip] = useState(null);
  const [createAccountOrAds, setCreateAccountOrAds]= useState(true);


  const REFER_USERS_API_KEY = 'https://campusbuy-backend-nkmx.onrender.com/referusers';

  const mainBG = {
    backgroundImage: '  url("https://res.cloudinary.com/dtthdh8tb/image/upload/v1728300443/Rectangle_242_k4pexq.png")   ',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    width: '100%',
    height: '100%'
  };

  const modal = {
    position: 'fixed',
    top: '10%',
    right: '5%',
    zIndex: '4000',
    width: '50%,'
  }

  const customStyles = {
    placeholder: (provided) => ({
      ...provided,
      color: 'black',
      backgroundColor: '#F6BD63',
      fontWeight: 'bold',
    }),
    control: (provided) => ({
      ...provided,
      borderColor: 'black',
      borderWidth: 2,
      borderRadius: '0.375rem',
      backgroundColor: '#F6BD63',
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: 'black',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#F6BD63',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#FEBD69' : '#F6BD63',
      color: 'black',
      '&:hover': {
        backgroundColor: '#FFD700',
      },
    }),
  };

  const SignupSchema = Yup.object().shape({
    firstname: Yup.string().required('First name is required'),
    lastname: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string()
      .matches(/^[A-Za-z0-9]+$/, 'Password can only contain letters and numbers')
      .min(8, 'Password must be at least 8 characters long')
      .required('Password is required'),
    mobile: Yup.string()
      .matches(/^[0-9]{11}$/, 'Mobile number must be exactly 11 digits and contain only numbers.')
      .required('Mobile number is required'),
    mobile2: Yup.string()
      .matches(/^[0-9]{11}$/, 'Mobile number must be exactly 11 digits and contain only numbers.')
      .required('Mobile number is required'),
    university: Yup.string().required('University is required'),
    sex: Yup.string().required('Gender is required'),
    address: Yup.string().required('Address is required'),
});

  const openCreateAccountModal = () => {
    setCreateAccountModals(true);
  };
  const closeCreateAccountModal = () => {
    setCreateAccountModals(false);
  };
  const openCreateAccountErrorModal = () => {
    setCreateAccountErrorModals(true);
  };
  const closeCreateAccountErrorModal = () => {
    setCreateAccountErrorModals(false);
  };
  const openMobileErrorModal = () => {
    setMobileErrorModal(true);
  };
  const closeMobileErrorModal = () => {
    setMobileErrorModal(false);
  };
  const openMobile2ErrorModal = () => {
    setMobile2ErrorModal(true);
  };
  const closeMobile2ErrorModal = () => {
    setMobile2ErrorModal(false);
  };
  const openLoading = () => {
    setLoading(true);
  };
  const closeLoading = () => {
    setLoading(false);
  };

  const showPassword = () => {
    setPasswordVisibility(true);
  };

  const hidePassword = () => {
    setPasswordVisibility(false);
  };

  const togglePassword = () => {
    if (passwordVisibility === false) {
      showPassword();
    } else {
      hidePassword();
    }
  };

  const renderComponent = () => {
    switch (passwordVisibility) {
      case true:
        return <MdOutlineVisibilityOff />;
      case false:
        return <MdOutlineVisibility />;
      default:
        return null;
    }
  };

  const tipsArray = ['Pricetips', 'Purchasetips', 'Bulkgoodstips'];
  const getRandomTip = () => tipsArray[Math.floor(Math.random() * tipsArray.length)];

  useEffect(() => {
    const displayRandomTip = () => {
      const randomTip = getRandomTip();
      setActiveTip(randomTip);
    };

    const displayTipTimeout = setTimeout(() => {
      displayRandomTip();
    }, 50000);

    const changeTipInterval = setInterval(() => {
      displayRandomTip();
    }, 600000);

    return () => {
      clearTimeout(displayTipTimeout);
      clearInterval(changeTipInterval);
    };
  }, []);

  let tipComponent = null;

  if (activeTip === 'Pricetips') {
    tipComponent = <Pricetips closeTips={() => setActiveTip(null)} />;
  } else if (activeTip === 'Purchasetips') {
    tipComponent = <Purchasetips closeTips={() => setActiveTip(null)} />;
  } else if (activeTip === 'Bulkgoodstips') {
    tipComponent = <Bulkgoodstips closeTips={() => setActiveTip(null)} />;
  }

  const createAccount = async (values, { setSubmitting }) => {
    try {
      openLoading();
      const response = await axios.post(`${REFER_USERS_API_KEY}/${id}`, values);
      if (response.data) {
        localStorage.setItem('userData', JSON.stringify(response.data));
        console.log(response.data)
        setTimeout(() => {
          localStorage.removeItem('userData');
        }, 24 * 60 * 60 * 1000);
  
        openCreateAccountModal();
        setTimeout(() => {
          closeCreateAccountModal();
          navigate('/');
        }, 5000);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        openCreateAccountErrorModal();
        setTimeout(() => {
          closeCreateAccountErrorModal();
          navigate('/signin');
        }, 4000);
      }  else if (error.response && error.response.status === 411) {
        openMobileErrorModal();
      } else if (error.response && error.response.status === 412) {
        openMobile2ErrorModal();
      }  else {
        alert('Connection error. Please refresh your network');
      }
    } finally {
      closeLoading();
      setSubmitting(false);
    }
  };
  const openAds = () => {
    // Open the external ad link in a new tab using window.open()
    console.log(createAccountOrAds)
    setCreateAccountOrAds(false)
    window.open('https://psolsumoo.net/4/8022756', '_blank');
  };
  

  const sexOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
    { value: 'preferNotToSay', label: 'Prefer not to say' },
  ];

  return (

    <div className='' style={mainBG}>
   {/* Other meta tags */}
   <meta property="og:url" content="https://campusify.net/signin" />
   <meta property="og:title" content="Signin: Join the student market on campus" />
   <meta
     property="og:description"
     content="The largest student-to-student online marketplace in Nigeria. Buy and sell anything from your fellow students. Textbooks, electronics, clothes, and more! Safe and secure platform with guaranteed delivery."
   />
   <meta property="og:image" content="https://res.cloudinary.com/dtthdh8tb/image/upload/v1728298881/IMG-20240227-WA0015_wdparn.jpg" />
  {/* Add other Open Graph meta tags like og:site_name */}

    <meta property="og:title" content="Campusify" />
    <meta property="og:description" content="The largest student-to-student online marketplace in Nigeria. Buy and sell anything from your fellow students. Textbooks, electronics, clothes, and more! Safe and secure platform with guaranteed delivery." />
    <meta property="og:image" content="" />
    <meta property="og:url" content="https://campusify.net/signin" />
    <meta property="og:type" content="website" />

    
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Campusify" />
    <meta name="twitter:description" content="The largest student-to-student online marketplace in Nigeria. Buy and sell anything from your fellow students. Textbooks, electronics, clothes, and more! Safe and secure platform with guaranteed delivery." />
    <meta name="twitter:image" content="" />
    <div className='w-[15%]  max-lg:w-[20%] all-round-tips rounded-lg bg-[rgba(255, 255, 255, 0.8)]'>
   
</div>

       <div className=''><Secondheader/></div>

<div className='max-lg:hidden w-[100%]'>
<div className='flex justify-between'>
<div className='bg-[#0C0908] w-[50%] py-[1rem] px-[2rem] text-white mt-[10rem] '>
<div className='flex justify-end items-center m-1 gap-20 mr-4'>
  <NavLink to='/'><img src='https://res.cloudinary.com/dtthdh8tb/image/upload/v1728298440/logo_erit8k.png' width={60} alt='logo'/></NavLink>
  <p className=' text-[12px] text-center'>Already have an account? <NavLink to='/signin'><strong>Sign in</strong></NavLink></p>
</div>
<div className='text-center m-1'>
  <h1 className=' text-xl m-2'><strong>Welcome to Campusify</strong></h1>
  <p className=' text-sm'>Sign up today and unlock a world of possiblities. Your adventure begins here.</p>
</div>
<div className='flex flex-col gap-1 justify-center items-center'>
<Formik
              initialValues={{
                firstname: '',
                lastname: '',
                email: '',
                password: '',
                mobile: '',
                mobile2: '',
                university: '',
                sex: '',
                address: ''
              }}
              validationSchema={SignupSchema}
              onSubmit={createAccount}
            >
                {({ isSubmitting }) => (

 <Form  className='p-1  w-full flex flex-col gap-1.5 mt-[1rem]'>
  
   <div className='flex flex-col gap-1  text-[12px] '>
     <label className='text-bold' htmlFor='First Name'><strong>First Name</strong></label>
     <Field type='text' name='firstname' className='p-2 rounded-[6px] signup-border bg-[#F6BD63] text-black' required placeholder='First Name'/>
     <ErrorMessage name='firstname' component='div' className='text-red-500' />
   </div>
   <div className='flex flex-col gap-1  text-[12px] '>
     <label className='text-bold' htmlFor='Last Name'><strong>Last Name</strong></label>
     <Field type='text' name='lastname' className='p-2 rounded-[6px] signup-border bg-[#F6BD63] text-black' required placeholder='Last Name'/>
       <ErrorMessage name='lastname' component='div' className='text-red-500' />
   </div>
   <div className='flex flex-col gap-1  text-[12px] '>
     <label className='text-bold' htmlFor='Email Address'><strong>Email Address</strong></label>
     <Field type='text' name='email' autoComplete="off" className='p-2 rounded-[6px] signup-border bg-[#F6BD63] text-black' required placeholder='Email Address'/>
       <ErrorMessage name='email' component='div' className='text-red-500' />
   </div>
   <div className='flex flex-col gap-1  text-[12px]  '>
     <label className='text-bold' htmlFor='Password'><strong> Password</strong></label>
     <div className='relative rounded-[6px]  signup-border bg-[#F6BD63] text-black '>
     <Field type={passwordVisibility? "text" : "password" } name='password' className='p-2 w-[100%] rounded-[6px] signup-border bg-[#F6BD63] text-black' required placeholder='Password'/>
     <div style={{left: "85%", top: "40%"}} className='absolute' onClick={togglePassword}>{renderComponent()}</div>
     </div>
     <ErrorMessage name='password' component='div' className='text-red-500' />
   </div>
   <div className='flex flex-col gap-1  text-[12px] '>
     <label className='text-bold' htmlFor='Phone Number'><strong>Phone Number</strong></label>
     <Field type='text' name='mobile' className='p-2 rounded-[6px] signup-border bg-[#F6BD63] text-black' required placeholder='Phone Number'/>
       <ErrorMessage name='mobile' component='div' className='text-red-500' />
   </div>
   <div className='flex flex-col gap-1  text-[12px] '>
     <label className='text-bold' htmlFor='Phone Number'><strong>Phone Number 2</strong></label>
     <Field type='text' name='mobile2' className='p-2 rounded-[6px] signup-border bg-[#F6BD63] text-black' required placeholder='Second Phone Number'/>
       <ErrorMessage name='mobile2' component='div' className='text-red-500' />
   </div>
   <div className="col-span-2">
  <label className="font-bold">University</label>
  <Field name="university">
    {({ field, form }) => (
      <Select
        options={schools}
        styles={customStyles}
        placeholder="Select School"
        isClearable
        value={schools.find(option => option.value === field.value) || null}
        onChange={(option) => form.setFieldValue(field.name, option ? option.value : '')}
      />
    )}
  </Field>
  <ErrorMessage name="university" component="div" className="text-red-500 text-sm" />
</div>



<div className="col-span-2">
  <label className="font-bold">Gender</label>
  <Field name="sex">
    {({ field, form }) => (
      <Select
        options={sexOptions}
        styles={customStyles}
        placeholder="Select Gender"
        value={sexOptions.find(option => option.value === field.value) || null}
        onChange={(option) => form.setFieldValue(field.name, option ? option.value : '')}
      />
    )}
  </Field>
  <ErrorMessage name="sex" component="div" className="text-red-500 text-sm" />
</div>

                  <div className='flex flex-col gap-1  text-[12px] '>
     <label className='text-bold' htmlFor='Address'><strong>Address</strong></label>
     <Field type='text' name='address' className='p-2 rounded-[6px] signup-border bg-[#F6BD63] text-black' required placeholder='Address'/>
     <ErrorMessage name='address' component='div' className='text-red-500' />
   </div>
   
   <NavLink to='/forgotpassword' disabled={isSubmitting} className='text-[12px]'>Forgot Password ?</NavLink>

   <button type="submit" className='p-2 inline-block w-full rounded-[6px] mt-2 bg-black border-2 border-[#FFD700] text-[#FFB04A]'>Submit</button>
 </Form>
)}
</Formik>
 </div>
 <div className='text-xl text-center my-5'><Link  to='/contact'><strong>Send us a Message</strong></Link></div>
 </div>
 <div className='w-[50%] text-center p-2'>
   <div className=' text-white  mt-[12rem]'>
     <h1 className=' text-2xl m-4'><strong>Campusify</strong></h1>
     <p className='my-2'>For all your campus needs; Utensils, Mattresses, Textbooks, Stationeries, Gadgets etc. Campusify is the place you need to be to find these things</p>
   </div>
   <img src='https://res.cloudinary.com/djj8xwuzn/image/upload/v1707425271/Default/Rectangle_318-removebg-preview_b9sdli.png' alt='model'
 />
 </div>
 </div>


 <div  style={{position: "fixed", top: "50%", left:"50%"}}>
  {loading && <div className='loading-modal flex flex-col justify-center items-center'>    
  <p style={{ color: 'white', marginTop: '10px' }}>Creating account. Please wait...</p>
 <div className='w-[70%] my-[6rem] ml-[6rem]'><BigLoader /></div>
   </div>}
 </div>
   {createAccountModals && <div style={modal}><Createaccountsuccessful  closeModal={closeCreateAccountModal}/></div>}
   {createAccountErrorModals && <div style={modal}><Useralreadyexists closeModal={closeCreateAccountErrorModal}/></div>}
   {mobileErrorModal && <div style={modal}><Createaccountmobileerror closeModal={closeMobileErrorModal}/></div>}
   {mobile2ErrorModal && <div style={modal}><Createaccountmobile2error closeModal={closeMobile2ErrorModal}/></div>}
 </div>

         
 <div className='hidden max-lg:block w-[100%]'>
<div className=''>
<div className='w-[100%] text-center p-2'>
<p style={{position: "fixed", top: "15%", left:"5%", zIndex:"3000" }} className='text-[10px] text-center text-white'>Already have an account? <NavLink to='/signin'><strong className='text-[#F6BD63]'>Sign in</strong></NavLink></p>
<img className='' src='https://res.cloudinary.com/djj8xwuzn/image/upload/v1707425271/Default/Rectangle_318-removebg-preview_b9sdli.png' alt='model'
/>
   <div className=' text-white'>
     <h1 className=' text-xl m-4'><strong>Campusify</strong></h1>
     <p className='my-2'>Sign up today and unlock a world of possiblities. Your adventure begins here.</p>
   </div>
 </div>
<div className='bg-[#0C0908] w-[100%] py-[1rem] px-[2rem] text-white  '>

<div className='flex flex-col gap-1 justify-center items-center'>
<Formik
              initialValues={{
                firstname: '',
                lastname: '',
                email: '',
                password: '',
                mobile: '',
                mobile2: '',
                university: '',
                sex: '',
                address: ''
              }}
              validationSchema={SignupSchema}
              onSubmit={createAccount}
            >
                {({ isSubmitting }) => (

 <Form  className='p-1  w-full flex flex-col gap-1.5 mt-[1rem]'>
  
   <div className='flex flex-col gap-1  text-[12px] '>
     <label className='text-bold' htmlFor='First Name'><strong>First Name</strong></label>
     <Field type='text' name='firstname' className='p-2 rounded-[6px] signup-border bg-[#F6BD63] text-black' required placeholder='First Name'/>
     <ErrorMessage name='firstname' component='div' className='text-red-500' />
   </div>
   <div className='flex flex-col gap-1  text-[12px] '>
     <label className='text-bold' htmlFor='Last Name'><strong>Last Name</strong></label>
     <Field type='text' name='lastname' className='p-2 rounded-[6px] signup-border bg-[#F6BD63] text-black' required placeholder='Last Name'/>
       <ErrorMessage name='lastname' component='div' className='text-red-500' />
   </div>
   <div className='flex flex-col gap-1  text-[12px] '>
     <label className='text-bold' htmlFor='Email Address'><strong>Email Address</strong></label>
     <Field type='text' name='email' autoComplete="off" className='p-2 rounded-[6px] signup-border bg-[#F6BD63] text-black' required placeholder='Email Address'/>
       <ErrorMessage name='email' component='div' className='text-red-500' />
   </div>
   <div className='flex flex-col gap-1  text-[12px]  '>
     <label className='text-bold' htmlFor='Password'><strong> Password</strong></label>
     <div className='relative rounded-[6px]  signup-border bg-[#F6BD63] text-black '>
     <Field type={passwordVisibility? "text" : "password" } name='password' className='p-2 w-[100%] rounded-[6px] signup-border bg-[#F6BD63] text-black' required placeholder='Password'/>
     <div style={{left: "85%", top: "40%"}} className='absolute' onClick={togglePassword}>{renderComponent()}</div>
     </div>
     <ErrorMessage name='password' component='div' className='text-red-500' />
   </div>
   <div className='flex flex-col gap-1  text-[12px] '>
     <label className='text-bold' htmlFor='Phone Number'><strong>Phone Number</strong></label>
     <Field type='text' name='mobile' className='p-2 rounded-[6px] signup-border bg-[#F6BD63] text-black' required placeholder='Phone Number'/>
       <ErrorMessage name='mobile' component='div' className='text-red-500' />
   </div>
   <div className='flex flex-col gap-1  text-[12px] '>
     <label className='text-bold' htmlFor='Phone Number'><strong>Phone Number 2</strong></label>
     <Field type='text' name='mobile2' className='p-2 rounded-[6px] signup-border bg-[#F6BD63] text-black' required placeholder='Second Phone Number'/>
       <ErrorMessage name='mobile2' component='div' className='text-red-500' />
   </div>
   <div className="col-span-2">
  <label className="font-bold">University</label>
  <Field name="university">
    {({ field, form }) => (
      <Select
        options={schools}
        styles={customStyles}
        placeholder="Select School"
        isClearable
        value={schools.find(option => option.value === field.value) || null}
        onChange={(option) => form.setFieldValue(field.name, option ? option.value : '')}
      />
    )}
  </Field>
  <ErrorMessage name="university" component="div" className="text-red-500 text-sm" />
</div>



<div className="col-span-2">
  <label className="font-bold">Gender</label>
  <Field name="sex">
    {({ field, form }) => (
      <Select
        options={sexOptions}
        styles={customStyles}
        placeholder="Select Gender"
        value={sexOptions.find(option => option.value === field.value) || null}
        onChange={(option) => form.setFieldValue(field.name, option ? option.value : '')}
      />
    )}
  </Field>
  <ErrorMessage name="sex" component="div" className="text-red-500 text-sm" />
</div>

                  <div className='flex flex-col gap-1  text-[12px] '>
     <label className='text-bold' htmlFor='Address'><strong>Address</strong></label>
     <Field type='text' name='address' className='p-2 rounded-[6px] signup-border bg-[#F6BD63] text-black' required placeholder='Address'/>
     <ErrorMessage name='address' component='div' className='text-red-500' />
   </div>
   
   <NavLink to='/forgotpassword' disabled={isSubmitting} className='text-[12px]'>Forgot Password ?</NavLink>

   <button type="submit" className='p-2 inline-block w-full rounded-[6px] mt-2 bg-black border-2 border-[#FFD700] text-[#FFB04A]'>Submit</button>
 </Form>
)}
</Formik>
 </div>
 <div className='text-xl text-center my-5'><Link  to='/contact'><strong>Send us a Message</strong></Link></div>
 </div>
 
 </div>


 <div  style={{position: "fixed", top: "50%", left:"50%"}}>
  {loading && <div className='loading-modal flex flex-col justify-center items-center'>    
  <p style={{ color: 'white', marginTop: '10px' }}>Creating account. Please wait...</p>
 <div className='w-[70%] my-[6rem] ml-[6rem]'><BigLoader /></div>
   </div>}
 </div>
   {createAccountModals && <div style={modal}><Createaccountsuccessful  closeModal={closeCreateAccountModal}/></div>}
   {createAccountErrorModals && <div style={modal}><Useralreadyexists closeModal={closeCreateAccountErrorModal}/></div>}
   {mobileErrorModal && <div style={modal}><Createaccountmobileerror closeModal={closeMobileErrorModal}/></div>}
   {mobile2ErrorModal && <div style={modal}><Createaccountmobile2error closeModal={closeMobile2ErrorModal}/></div>}
   <div><Footer/></div>
 </div>
         {createAccountModals && <div className=' border p-4'><Createaccountsuccessful/></div>}
         {createAccountErrorModals && <div className=' border p-4'><Useralreadyexists/></div>}
     </div>
  );
};