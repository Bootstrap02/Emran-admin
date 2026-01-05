import React, { useState } from "react";
import { MdCancel, MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { NavLink, useNavigate } from 'react-router-dom';
import success from '../../assets/success.png';
import { jsPDF } from 'jspdf';
import { BigLoader } from "../Loaders";

export const Referrals = ({ closeModal, openSuccessMessage, openFailedMessage }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showModalOrAds, setShowModalOrAds] = useState(true);
  const user = JSON.parse(localStorage.getItem('userData'));
  const referrals = JSON.parse(localStorage.getItem('referrals'));

  const [formData, setFormData] = useState({
    fullName: "",
    email: user.email,
    phoneNumber: "",
    totalNumber: referrals.length,
    userID: user.id || user._id,
    expectedAmount: 70 * referrals.length,
    accountName: "",
    accountNumber: "",
    bank: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      // xvgpezyq
      const response = await fetch("https://formspree.io/f/xeqbpyny", {
        action: "https://formspree.io/f/xeqbpyny",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Save the form data in localStorage for the payment slip
        localStorage.setItem('paymentslip', JSON.stringify(formData));

        setLoading(false);
        console.log("Form submitted successfully!");
        closeModal();
        openSuccessMessage();
      } else {
        setLoading(false);
        console.error("Form submission failed.");
        openFailedMessage();
      }
    } catch (error) {
      console.error("Email sending failed:", error);
      setLoading(false);
      openFailedMessage();
    }
  };
  const openAds = (e) => {
    // Open the external ad link in a new tab using window.open()
    e.preventDefault();
    setShowModalOrAds(false)
    window.open('https://psolsumoo.net/4/8022756', '_blank');
  };

  return (
    <div className="w-[100%] flex flex-col justify-center items-center bg-white max-lg:text-[8px] text-white relative rounded-lg border-2 border-black">
      <div className='w-[100%] flex justify-between items-center rounded-lg text-center text-xl text-bold bg-[#FEBD69] px-4 py-2'>
        <h1 className=" text-md mt-2 text-[#379B07]">Cash Out!</h1>
        <MdCancel onClick={closeModal} className='w-[25px] h-[25px] text-black' />
      </div>
      <div className='flex flex-col gap-1 justify-center items-center w-[100%] p-4'>
        <form onSubmit={showModalOrAds? openAds : handleFormSubmit} className='w-[100%] flex flex-col gap-1.5 mt-[1rem]'>
          <div className='text-[12px] w-[100%]'>
            <input
              type='text'
              name='fullName'
              value={formData.fullName}
              onChange={handleInputChange}
              className='p-2 rounded-[6px] signup-border bg-[#F6BD63] text-black w-[100%]'
              required
              placeholder='Full Name'
            />
          </div>
          <div className='text-[12px] w-[100%]'>
            <div className='relative rounded-[6px] signup-border bg-[#F6BD63] text-black'>
              <input
                name='phoneNumber'
                value={formData.phoneNumber}
                onChange={handleInputChange}
                autoComplete="off"
                className='p-2 w-[100%] rounded-[6px] signup-border bg-[#F6BD63] text-black'
                required
                placeholder='Phone Number'
              />
            </div>
          </div>
          <div className='text-[12px] w-[100%]'>
            <div className='relative rounded-[6px] signup-border bg-[#F6BD63] text-black'>
              <input
                name='bank'
                value={formData.bank}
                onChange={handleInputChange}
                autoComplete="off"
                className='p-2 w-[100%] rounded-[6px] signup-border bg-[#F6BD63] text-black'
                required
                placeholder='Bank Name'
              />
            </div>
          </div>
          <div className='text-[12px] w-[100%]'>
            <div className='relative rounded-[6px] signup-border bg-[#F6BD63] text-black'>
              <input
                name='accountName'
                value={formData.accountName}
                onChange={handleInputChange}
                autoComplete="off"
                className='p-2 w-[100%] rounded-[6px] signup-border bg-[#F6BD63] text-black'
                required
                placeholder='Account Name'
              />
            </div>
          </div>
          <div className='text-[12px] w-[100%]'>
            <div className='relative rounded-[6px] signup-border bg-[#F6BD63] text-black'>
              <input
                name='accountNumber'
                value={formData.accountNumber}
                onChange={handleInputChange}
                autoComplete="off"
                className='p-2 w-[100%] rounded-[6px] signup-border bg-[#F6BD63] text-black'
                required
                placeholder='Account Number'
              />
            </div>
          </div>
          <button type="submit" className='p-2 inline-block w-full rounded-[6px] bg-[#379B07] text-white'>
            {loading ? (<BigLoader />) : ('Submit')}
          </button>
        </form>
      </div>
    </div>
  );
};

export const SuccessMessage = ({ closeMessage }) => {
  const referrals = JSON.parse(localStorage.getItem('paymentslip'));

  const createPDFPaymentSlip = async () => {
    try {
      // Extract data from local storage
      const { fullName, email, bank, accountName, accountNumber, expectedAmount, totalNumber } = referrals;

      // Create a new jsPDF instance
      const doc = new jsPDF();

      // Add content to the PDF
      doc.setFontSize(16);
      doc.text('Payment Slip', 10, 10);
      doc.setFontSize(12);
      doc.text(`Full Name: ${fullName}`, 10, 30);
      doc.text(`Email: ${email}`, 10, 40);
      doc.text(`Bank: ${bank}`, 10, 50);
      doc.text(`Account Name: ${accountName}`, 10, 60);
      doc.text(`Account Number: ${accountNumber}`, 10, 70);
      doc.text(`Amount: $${expectedAmount}`, 10, 80);
      doc.text(`Total Users: ${totalNumber}`, 10, 90);

      // Save the PDF and trigger the download
      doc.save('PaymentSlip.pdf');
    } catch (error) {
      console.error('Failed to create payment slip:', error);
    }
  };

  return (
    <div className="w-[100%] flex flex-col justify-center items-center gap-2 bg-white max-lg:text-[10px] text-white relative rounded-lg border-2 border-black">
      <div className="w-[100%] rounded-lg text-center text-xl text-black text-bold bg-[#FEBD69] p-[1rem]">
        <MdCancel onClick={closeMessage} className="w-[25px] h-[25px] ml-[90%]" />
      </div>
      <div className="flex flex-col justify-center items-center">
        <strong className="text-lg mb-2 text-[#379B07] text-bold p-2">
          Payment Request successfully! Please await payment within 5 business days.
        </strong>
      </div>
      <button onClick={createPDFPaymentSlip} className="p-2 rounded-md text-sm ml-auto bg-green-500 border">
        Download Payment Slip
      </button>
    </div>
  );
};

export const FailedMessage = ({closeMessage})=> {
  return(   
   <div className=" w-[100%] flex flex-col justify-center items-center gap-2 bg-white max-lg:text-[10px] text-white relative rounded-lg border-2 border-black">
   <div  className='w-[100%] rounded-lg text-center text-xl text-black text-bold bg-[#FEBD69] p-[1rem]' >    
   <MdCancel onClick={closeMessage}  className='w-[25px] h-[25px] ml-[90%]' />
   </div>
   <div className='flex flex-col justify-center items-center'>
   <strong className=" text-lg mb-2 text-[#8B0000] text-bold p-2">Payment Request not successful! Please try again or Contact us.</strong>
   </div>
</div>
  )
}


