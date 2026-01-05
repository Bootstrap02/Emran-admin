import React, { useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { Secondheader } from '../Components/Subheaders';
import Footer from '../Components/Footer';
import { BigLoader } from '../Modals/Loaders';

export const Deleteaccount = () => {
  const [loading, setLoading] = useState(false);
  const [emailValidation, setEmailValidation] = useState(false);
  const [formData, setFormData] = useState({ email: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'email') {
      if (!value.includes('@')) {
        setEmailValidation(true);
      } else {
        setEmailValidation(false);
      }
    }
  };

  const deleteAccount = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.delete('https://campusbuy-backend-nkmx.onrender.com/deleteaccount', { data: formData });

      if (response.status === 200) {
        alert('Account deleted successfully');
        setFormData({ email: '' }); // Clear the input field
      } else {
        alert('Connection error. Please refresh your network');
      }
    } catch (error) {
      if (error.response?.status === 404) {
        alert('Account not found. Check your email.');
      } else {
        alert('Connection error. Please try again.');
        console.error('Error deleting account:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <Secondheader />
      <div className="max-lg:hidden w-full">
        <div className="flex justify-between">
          <div className="bg-[#0C0908] w-1/2 py-4 px-8 text-white mt-40">
            <div className="text-center mb-4">
              <h1 className="text-xl font-bold">Welcome to Campusify</h1>
              <p className="text-lg">Input your email to delete your account.</p>
            </div>
            <form onSubmit={deleteAccount} className="flex flex-col gap-3">
              <div className="flex flex-col gap-2 p-2">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  name="email"
                  className="p-2 w-full rounded bg-[#F6BD63] text-black"
                  onChange={handleChange}
                  required
                />
                {emailValidation && <strong className="text-sm text-red-700">Invalid email address!</strong>}
              </div>
              <NavLink to="/signin" className="text-xs">Sign in</NavLink>
              <button type="submit" className="p-2 bg-black border-2 border-[#FFD700] text-[#FFB04A] w-full rounded mt-2">
                Submit
              </button>
            </form>
          </div>

          <div className="w-1/2 text-center p-4">
            <h1 className="text-2xl text-white font-bold mt-48">Campusify</h1>
            <p className="text-white my-2">
              For all your campus needs; Utensils, Mattresses, Textbooks, Stationeries, Gadgets etc.
            </p>
            <img
              src="https://res.cloudinary.com/djj8xwuzn/image/upload/v1707425271/Default/Rectangle_318-removebg-preview_b9sdli.png"
              alt="model"
              className="mx-auto"
            />
          </div>
        </div>
      </div>

      {/* Mobile view */}
      <div className="hidden max-lg:block w-full">
        <div className="bg-[#0C0908] w-full py-4 px-4 text-white">
          <div className="flex justify-between items-center mb-4 mt-16">
            <NavLink to="/">
              <img src="https://res.cloudinary.com/dtthdh8tb/image/upload/v1728298440/logo_erit8k.png" width={50} alt="logo" />
            </NavLink>
            <p className="text-xs text-center">
              Don't have an account? <NavLink to="/signup"><strong className="text-[#F6BD63]">Sign up</strong></NavLink>
            </p>
          </div>

          <div className="text-center mb-4">
            <h1 className="text-lg font-bold">Welcome to Campusify</h1>
            <p className="text-lg">Input your email to delete your account.</p>
          </div>
          
          <form onSubmit={deleteAccount} className="flex flex-col gap-3">
            <div className="flex flex-col gap-2 p-2">
              <label className="text-xs font-bold">Email Address</label>
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                name="email"
                className="p-2 rounded bg-[#F6BD63] text-black"
                onChange={handleChange}
                required
              />
              {emailValidation && <strong className="text-xs text-red-700">Invalid email address!</strong>}
            </div>
            <NavLink to="/signin" className="text-xs">Sign in</NavLink>
            <button type="submit" className="p-2 bg-black border-2 border-[#FFD700] text-[#FFB04A] w-full rounded mt-2">
              Submit
            </button>
          </form>

          <div className="text-center my-4">
            <img
              src="https://res.cloudinary.com/djj8xwuzn/image/upload/v1707425271/Default/Rectangle_318-removebg-preview_b9sdli.png"
              alt="model"
              className="mx-auto"
            />
            <div className="text-white mt-4">
              <h1 className="text-lg font-bold">Campusify</h1>
              <p className="text-sm">For all your campus needs; Utensils, Mattresses, Textbooks, Stationeries, Gadgets etc.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="flex flex-col justify-center items-center">
            <p className="text-white mb-2">Deleting account. Please wait...</p>
            <BigLoader />
          </div>
          <Footer/>
        </div>
      )}
      
    </div>
  );
};
