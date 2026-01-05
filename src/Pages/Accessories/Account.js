import React, { useState, useEffect } from 'react';
import { schools,  } from '../../Constants/Universities'; 
import { useNavigate, useParams } from 'react-router-dom'; 
import Select from 'react-select';
import { ColorRing  } from 'react-loader-spinner'
import axios from 'axios';
import { Tokenerrormodal } from '../../Modals/Forms';
import { MdAccountCircle } from "react-icons/md";
import { MediumLoader } from '../../Modals/Loaders';
import { ButtonLoader } from '../../Modals/Loaders';
import { Updateaccountsuccessful } from '../../Modals/Pages/Signin';
import { Accountupdateverifcation } from '../../Modals/Pages/Account';


const Account = ({setActiveComponent}) => {
const navigate = useNavigate();

const [signin, setSignin] = useState(false);
const [signinAgain, setSigninAgain] = useState(false);
const [loading, setLoading] = useState(false);
const [buttonLoading, setButtonLoading]= useState(false);
const [mobileValidation, setMobileValidation] = useState(false);
const [emailValidation, setEmailValidation] = useState(false);
const [passwordValidation, setPasswordValidation] = useState(false);
const [saveVerification, setSaveVerification] = useState(false);
const [selectedOption, setSelectedOption] = useState(null);
const storedUserData = JSON.parse(localStorage.getItem('userData')); 
const [link, setLink] = useState('');
const [showModal, setShowModal] = useState(false);
const [showModalOrAds, setShowModalOrAds] = useState(false);


  useEffect(() => {
    setLink(`https://campusify.net/signuplink/${storedUserData.id? storedUserData.id : storedUserData._id}`);
  }, [storedUserData._id]);

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
  const openAds = () => {
    // Open the external ad link in a new tab using window.open()
    setShowModalOrAds(false)
    window.open('https://psolsumoo.net/4/8022756', '_blank');
  };


const [formData, setFormData] = useState({
  firstname: '',
  lastname: '',
  email: '',
  mobile: '',
  mobile2: '',
  password: '',
  university: '',
  sex: ''
});

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });
};

const handleSelectChange = (selectedOption, name) => {
  setFormData({ ...formData, [name]: selectedOption ? selectedOption.value : '' });
};

const modal = {
  position: 'fixed',
  top: '30%',
  right: '30%',
  zIndex: '4000',
  width: '50%,'
}
const avatar= {
  borderRadius: '50%',
  border: "5px solid #5D1523",
  width: "50%",
}
  
  const openSigninAgain = ()=>{
    setSigninAgain(true)
  }
  const closeSigninAgain = ()=>{
    setSigninAgain(false)
  }
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
  const handleMobileValidation = ()=>{
    setMobileValidation(true)
  }
  const handleEmailValidation = ()=>{
    setEmailValidation(true)
  }
  const handlePasswordValidation = ()=>{
    setPasswordValidation(true)
  }
  const closeMobileValidation = ()=>{
    setMobileValidation(false)
  }
  const closeEmailValidation = ()=>{
    setEmailValidation(false)
  }
  const closePasswordValidation = ()=>{
    setPasswordValidation(false)
  }
  const openSaveVerification = ()=>{
    setSaveVerification(true)
  }
  const closeSaveVerification = ()=>{
    setSaveVerification(false)
  }

  const Referrals= () => {
    window.open('/yourreferrals', '_blank');
  }

  const GET_ACCOUNT_API_KEY= 'https://campusbuy-backend-nkmx.onrender.com/getuser';  
  const UPDATE_ACCOUNT_API_KEY = 'https://campusbuy-backend-nkmx.onrender.com/updateuser'
  const UPDATE_AVATAR_API_KEY = 'https://campusbuy-backend-nkmx.onrender.com/uploaduserimage'

  useEffect(() => {
    const getAccount = async () => {
      try {
        const response = await axiosInstance.get(`${GET_ACCOUNT_API_KEY}/${storedUserData.id}}`);
        console.log(response.data);
        await localStorage.setItem("usercard", JSON.stringify(response.data));
      } catch (error) {
        console.error('Error getting your account:', error);
        // Handle error as needed
      }
    };
  
    getAccount(); // Invoking the getAccount function when the component mounts
  }, []);
  
  

   

  const { id } = useParams();



  // Create an Axios instance with default headers
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
  if (storedUserData && storedUserData.accessToken){
    setAuthToken(storedUserData.accessToken);
  }  
  // Now, you can use axiosInstance for your requests with the token included in the headers
  
 const handleAvatarChange = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
      try {
       
        const formData = new FormData();
        formData.append('images', file);
    
        const response = await axiosInstance.put(`${UPDATE_AVATAR_API_KEY}/${storedUserData.id}`,  formData)
        localStorage.setItem('userData', JSON.stringify(response.data));
        navigate(`/mainpage/${storedUserData.id}`)
        setActiveComponent('Account')
        // Log the parsed user data
        console.log(response.data);

  
      } catch (error) {
        // Handle error
        alert('Invalid image format or network issues');
        console.error('Error updating avatar:', error);
      } 
    
    
  };



  const updateUser = async () => {
    closeSaveVerification();
    setButtonLoading(true);
    try {
      openLoading();
      
      const response = await axiosInstance.put(`${UPDATE_ACCOUNT_API_KEY}/${storedUserData.id}`, formData);
      
      await localStorage.setItem("userData", JSON.stringify(response.data));
      openSigninAgain();
      setButtonLoading(false);
      setTimeout(() => {
        closeSigninAgain();
        navigate('/signin');
      }, 4000);
      
      console.log(response.data);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 403) {
          openSignin(true);
          setTimeout(() => {
            closeSignin();
            navigate('/signin');
          }, 3000);
        } else if (error.response.status === 404) {
          alert('User not found. Please sign in.');
        }else if (error.response.status === 400) {
          alert('Email address already used. Please use another.');
        }else if (error.response.status === 401) {
          alert('Phone Number 1 already used. Please use another.');
        }else if (error.response.status === 402) {
          alert('Phone Number 2 already used. Please use another.');
        } else {
          alert('Connection error. Please refresh your network.');
        }
      } else {
        alert('Connection error. Please refresh your network.');
        console.error('Unexpected error:', error);
      }
    } finally {
      closeLoading(); 
    }
  };
  
  

    const sexOptions = [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
      { value: 'other', label: 'Other' },
      { value: 'preferNotToSay', label: 'Prefer not to say' },
    ];


  return (
    <div className=' w-full '>
      <div className='max-lg:hidden '>
     <div className='flex justify-between ites-center w-[60%]'>
      <div>
        <button onClick={ showModalOrAds? openAds : AccountreferralLink} className='p-2 border-2 border-black bg-[#FDD700] rounded-lg text-sm text-black'>{showModal ? (<div><ButtonLoader /></div>) : ('Referral Link')}</button>
        <button onClick={showModalOrAds? openAds : Referrals} className='p-2 border-2 border-black bg-[#FDD700] rounded-lg text-sm text-black'>Your Referrals</button>
      </div>
     <div className="flex justify-center items-center relative">
  {storedUserData && storedUserData.image && storedUserData.image[0] ? (
    <div className='flex flex-col gap-1 justify-center items-center'>
      <img src={storedUserData.image[0]} alt="Avatar" style={avatar} />
      <div className='flex flex-col gap-1 justify-center px-4 items-center m-1'>
        <div className='flex flex-col gap-1 justify-center items-center '>
          <strong >{storedUserData.firstname}  {storedUserData.lastname}</strong>
          <strong className='text-[12px]'>{storedUserData.email}</strong>
        </div>
        <input
          id="file-input"
          type="file"
          name="image"
          accept="image/*"
          onChange={handleAvatarChange}
          className="hidden-input"
        />
        <label htmlFor="file-input" className="file-label">Change Image</label>
</div>
</div>
  ) : (
    <div className='flex flex-col gap-1 items-center justify-center'>
      <MdAccountCircle className="w-[100%] text-[6rem] text-[#FEBD69]" />
      <div className='flex flex-col gap-1 justify-center px-4 items-center m-2'>
        <div className='flex flex-col gap-1 '>
          <strong >{storedUserData.firstname}  {storedUserData.lastname}</strong>
          <strong className='text-[12px]'>{storedUserData.email}</strong>
        </div>
        <input
          id="file-input"
          type="file"
          name="image"
          accept="image/*"
          onChange={handleAvatarChange}
          className="hidden-input text-[12px]"
        />
        <label htmlFor="file-input" className="file-label">Change Image</label>
</div>    </div>
  )}
</div>

</div>

    <div className='flex flex-col gap-2 m-2 p-2   max-lg:m-0 max-lg:p-0'>
      <div className='flex flex-col gap-2 m-2 p-2'>
      <label>Firstname</label>
      <input onChange={handleChange} type='text' placeholder='Firstname' value={formData.firstname} name='firstname' className='p-2 m-2  border border-gray-400 bg-[#D9D9D9] rounded-lg'/>
      </div>
      <div className='flex flex-col gap-2 m-2 p-2'>
      <label>Lastname</label>
      <input onChange={handleChange} type='text' placeholder='Lastname' value={formData.lastname} name='lastname' className='p-2 m-2  border border-gray-400 bg-[#D9D9D9] rounded-lg'/>
      </div>
      <div className='flex flex-col gap-2 m-2 p-2'>
  <label>Email Address</label>
  <input
    type='text'
    placeholder='Email Address'
    value={formData.email}
    name='email'
    className='p-2 m-2 border border-gray-400 bg-[#D9D9D9] rounded-lg'
    onChange={(e) => {
      const value = e.target.value;
      const { name } = e.target;
      setFormData({ ...formData, [name]: value });

      if (!value.includes('@')) {
        handleEmailValidation();
      } else {
        closeEmailValidation();
      }
    }}
  />   
  {emailValidation && <strong className='text-[9px] mx-2 text-[#8B0000]'>Invalid email address!</strong>}
</div>
      <div className='flex flex-col gap-2 m-2 p-2'>
      <label>Phone Number 1</label>
      <input
   type='text'
  placeholder='Phone Number'
  value={formData.mobile}
  name='mobile'
  className='p-2 m-2 border border-gray-400 bg-[#D9D9D9] rounded-lg'
  pattern="\d{11}" // Ensures only digits are allowed and exactly 11 digits
  minLength={11}   // Minimum length of 11 digits
  maxLength={11}   // Maximum length of 11 digits
  onChange={(e) => {
    const value = e.target.value;
    const { name } = e.target;
  setFormData({ ...formData, [name]: value });
    if (!/^\d*$/.test(value)) {
      // Update state or perform other actions with the valid input
      handleMobileValidation()
    } else if (value.length < 11){
      handleMobileValidation()
    }else{
      closeMobileValidation()
    }
  }}
/>       
{mobileValidation && <strong className='text-[9px] mx-2 text-[#8B0000]'>Phone Number must be 11 digits </strong>}
   </div>
      <div className='flex flex-col gap-2 m-2 p-2'>
      <label>Phone Number 2</label>
<input
   type='text'
  placeholder='Second Phone Number'
  value={formData.mobile2}
  name='mobile2'
  className='p-2 m-2 border border-gray-400 bg-[#D9D9D9] rounded-lg'
  pattern="\d{11}" // Ensures only digits are allowed and exactly 11 digits
  minLength={11}   // Minimum length of 11 digits
  maxLength={11}   // Maximum length of 11 digits
  onChange={(e) => {
    const value = e.target.value;
    const { name } = e.target;
  setFormData({ ...formData, [name]: value });
    if (!/^\d*$/.test(value)) {
      // Update state or perform other actions with the valid input
      handleMobileValidation()
    } else if (value.length < 11){
      handleMobileValidation()
    }else{
      closeMobileValidation()
    }
  }}
/>   
{mobileValidation && <strong className='text-[9px] mx-2 text-[#8B0000]'>Phone Number must be 11 digits </strong>}
   </div>
      <div className='flex flex-col gap-2 m-2 p-2'>
      <label>Password</label>
      <input
   type='text'
  placeholder='Password'
  value={formData.password}
  name='password'
  className='p-2 m-2 border border-gray-400 bg-[#D9D9D9] rounded-lg'
  minLength={8}   // Minimum length of 11 digits
  onChange={(e) => {
    const value = e.target.value;
    const { name } = e.target;
  setFormData({ ...formData, [name]: value });
    if (value.length < 8) {
      // Update state or perform other actions with the valid input
      handlePasswordValidation()
    } else{
      closePasswordValidation()
    }
  }}
/>   
{passwordValidation && <strong className='text-[9px] mx-2 text-[#8B0000]'>Password must be more than 8 digits</strong>}
       </div>
      <div className='flex justify-between'>
      <div className="w-[100%]">
      <Select           
      name='university' 
      className="form-control p-2 m-2 border max-lg:m-0 max-lg:p-0 bg-[#D9D9D9]"
      value={formData.university}
      onChange={handleSelectChange}
        options={schools}
        placeholder="Search for your School..."
        isClearable
      />
</div>
<div className="input-group mb-3">
        <Select
        name='sex' 
        value={formData.sex}
          className="form-control p-2 m-2 border max-lg:m-0 max-lg:p-0 bg-[#D9D9D9]"
          onChange={handleSelectChange}
          options={sexOptions}
          placeholder='Select Gender'
          isClearable
        />
      </div>
</div>

<div className='flex justify-center'><button onClick={openSaveVerification} className='p-2 m-2 btn-success border rounded-md  max-lg:m-0 max-lg:p-0'>Save Changes</button></div>
      </div>
{signin && <div className='  border p-4'><Tokenerrormodal/></div>}
{loading && <div style={modal}><MediumLoader /></div>}
{signinAgain && <div style={modal}><Updateaccountsuccessful closeSigninAgain={closeSigninAgain}/></div>}
{saveVerification && <div style={modal}><Accountupdateverifcation closeSaveVerification={closeSaveVerification} updateUser={updateUser}/></div>}
      </div>
      <div className='hidden max-lg:block text-white '>
    <div className='flex flex-col gap-2 '>
      <div className='flex flex-col gap-2 m-2 p-2'>
      <label>Firstname</label>
      <input onChange={handleChange} type='text' placeholder='Firstname' value={formData.firstname} name='firstname' className='p-2 m-2  border border-gray-400 bg-[#FEBD69] text-black rounded-lg'/>
      </div>
      <div className='flex flex-col gap-2 m-2 p-2'>
      <label>Lastname</label>
      <input onChange={handleChange} type='text' placeholder='Lastname' value={formData.lastname} name='lastname' className='p-2 m-2  border border-gray-400 bg-[#FEBD69] text-black rounded-lg'/>
      </div>
      <div className='flex flex-col gap-2 m-2 p-2'>
  <label>Email Address</label>
  <input
    type='text'
    placeholder='Email Address'
    value={formData.email}
    name='email'
    className='p-2 m-2 border border-gray-400 bg-[#FEBD69] text-black rounded-lg'
    onChange={(e) => {
      const value = e.target.value;
      const { name } = e.target;
      setFormData({ ...formData, [name]: value });

      if (!value.includes('@')) {
        handleEmailValidation();
      } else {
        closeEmailValidation();
      }
    }}
  />   
  {emailValidation && <strong className='text-[9px] mx-2 text-[#8B0000]'>Invalid email address!</strong>}
</div>
      <div className='flex flex-col gap-2 m-2 p-2'>
      <label>Phone Number 1</label>
      <input
   type='text'
  placeholder='Phone Number'
  value={formData.mobile}
  name='mobile'
  className='p-2 m-2 border border-gray-400 bg-[#FEBD69] text-black rounded-lg'
  pattern="\d{11}" // Ensures only digits are allowed and exactly 11 digits
  minLength={11}   // Minimum length of 11 digits
  maxLength={11}   // Maximum length of 11 digits
  onChange={(e) => {
    const value = e.target.value;
    const { name } = e.target;
  setFormData({ ...formData, [name]: value });
    if (!/^\d*$/.test(value)) {
      // Update state or perform other actions with the valid input
      handleMobileValidation()
    } else if (value.length < 11){
      handleMobileValidation()
    }else{
      closeMobileValidation()
    }
  }}
/>       
{mobileValidation && <strong className='text-[9px] mx-2 text-[#8B0000]'>Phone Number must be 11 digits </strong>}
   </div>
      <div className='flex flex-col gap-2 m-2 p-2'>
      <label>Phone Number 2</label>
<input
   type='text'
  placeholder='Second Phone Number'
  value={formData.mobile2}
  name='mobile2'
  className='p-2 m-2 border border-gray-400 bg-[#FEBD69] text-black rounded-lg'
  pattern="\d{11}" // Ensures only digits are allowed and exactly 11 digits
  minLength={11}   // Minimum length of 11 digits
  maxLength={11}   // Maximum length of 11 digits
  onChange={(e) => {
    const value = e.target.value;
    const { name } = e.target;
  setFormData({ ...formData, [name]: value });
    if (!/^\d*$/.test(value)) {
      // Update state or perform other actions with the valid input
      handleMobileValidation()
    } else if (value.length < 11){
      handleMobileValidation()
    }else{
      closeMobileValidation()
    }
  }}
/>   
{mobileValidation && <strong className='text-[9px] mx-2 text-[#8B0000]'>Phone Number must be 11 digits </strong>}
   </div>
      <div className='flex flex-col gap-2 m-2 p-2'>
      <label>Password</label>
      <input
   type='text'
  placeholder='Password'
  value={formData.password}
  name='password'
  className='p-2 m-2 border border-gray-400 bg-[#FEBD69] text-black rounded-lg'
  minLength={8}   // Minimum length of 11 digits
  onChange={(e) => {
    const value = e.target.value;
    const { name } = e.target;
  setFormData({ ...formData, [name]: value });
    if (value.length < 8) {
      // Update state or perform other actions with the valid input
      handlePasswordValidation()
    } else{
      closePasswordValidation()
    }
  }}
/>   
{passwordValidation && <strong className='text-[9px] mx-2 text-[#8B0000]'>Password must be more than 8 digits</strong>}
       </div>
      <div className='flex justify-between'>
      <div className="w-[100%]">
      <Select           
      name='university' 
      className="form-control p-2 m-2 border max-lg:m-0 max-lg:p-0 bg-[#FEBD69] text-black"
      value={formData.university}
      onChange={handleSelectChange}
        options={schools}
        placeholder="Search for your School..."
        isClearable
      />
</div>
<div className="input-group mb-3">
        <Select
        name='sex' 
        value={formData.sex}
          className="form-control p-2 m-2 border max-lg:m-0 max-lg:p-0 bg-[#FEBD69] text-black"
          onChange={handleSelectChange}
          options={sexOptions}
          placeholder='Select Gender'
          isClearable
        />
      </div>
</div>

<div className='flex justify-center'><button onClick={openSaveVerification} className='p-2 m-2 btn-success border rounded-md  max-lg:m-0 max-lg:p-0'>Save Changes</button></div>
      </div>
{signin && <div className='  border p-4'><Tokenerrormodal/></div>}
{loading && <div style={modal}><MediumLoader /></div>}
{signinAgain && <div style={modal}><Updateaccountsuccessful closeSigninAgain={closeSigninAgain}/></div>}
{saveVerification && <div style={modal}><Accountupdateverifcation closeSaveVerification={closeSaveVerification} updateUser={updateUser}/></div>}
      </div>
    </div>
  )
}

export default Account
