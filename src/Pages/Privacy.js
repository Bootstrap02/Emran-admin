import React, {useState} from 'react';
import { NavLink } from 'react-router-dom';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import Nav from '../Modals/General/Nav';

export const Privacy = () => {
  const [signin, setSignin] = useState(false);
    const [nav, setNav] = useState(false);

    const openNav = () => {
      setNav(true);
    };
    const closeNav = () => {
      setNav(false);
    };

  return (
    <div className='w-[100%]'>
      <Header className='mb-[2rem] bg-black' openNav={openNav} closeNav={closeNav}/>

      <div className='w-[100%] bg-black p-4'>
        <div className='my-[6rem] max-lg:my-[3rem] text-white'>
          <div className='text-2xl text-center mb-6'>
            <p><strong>Privacy Policy</strong></p>
          </div>
          <div className='flex justify-center gap-2'>
            <NavLink to='/'>Home ||</NavLink> <NavLink to='/privacy'>Privacy Policy</NavLink>
          </div>
        </div>
      </div>

      <div className='w-[100%] max-lg:mb-6'>
        <div className='w-[100%]'>
          <div className='mt-4 p-[4rem] max-lg:mt-2 max-lg:p-[2rem]'>
            <div className='mb-4 text-2xl max-lg:text-xl max-lg:mb-1'>
              <strong>Our Commitment to Your Privacy</strong>
            </div>
            <div>
              At Campusify, we prioritize your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our platform.
            </div>
          </div>

          <div className='flex flex-col gap-5 p-[4rem]'>
            <div className='p-2 text-2xl text-center w-full my-4'>
              <strong>Information We Collect</strong>
            </div>
            <div className='text-lg'>
              <ul className='list-disc pl-6'>
                <li><strong>Personal Information:</strong> When you sign up or create an account, we collect details such as your name, email address, and phone number.</li>
                <li><strong>Transaction Information:</strong> Details about the products you buy or sell and any communications you have with other users.</li>
                <li><strong>Device and Usage Information:</strong> Data about your device, browser, and how you interact with our platform.</li>
              </ul>
            </div>

            <div className='p-2 text-2xl text-center w-full my-4'>
              <strong>How We Use Your Information</strong>
            </div>
            <div className='text-lg'>
              <ul className='list-disc pl-6'>
                <li>To facilitate connections between buyers and sellers.</li>
                <li>To improve and personalize your experience on our platform.</li>
                <li>To communicate with you regarding account updates, promotions, or support inquiries.</li>
                <li>To ensure the security of our platform and prevent fraudulent activities.</li>
              </ul>
            </div>

            <div className='p-2 text-2xl text-center w-full my-4'>
              <strong>Sharing Your Information</strong>
            </div>
            <div className='text-lg'>
              We do not sell or rent your personal information to third parties. However, we may share your data with:
              <ul className='list-disc pl-6 mt-2'>
                <li>Service providers who assist us in operating our platform.</li>
                <li>Law enforcement or regulatory authorities when required by law.</li>
                <li>Other users when necessary to facilitate transactions (e.g., sharing contact information with a buyer or seller).</li>
              </ul>
            </div>

            <div className='p-2 text-2xl text-center w-full my-4'>
              <strong>Your Rights and Choices</strong>
            </div>
            <div className='text-lg'>
              <ul className='list-disc pl-6'>
                <li>You can update your account information at any time from your profile settings.</li>
                <li>You can request to delete your account and associated data by contacting us.</li>
                <li>You can opt out of promotional communications through your email preferences.</li>
              </ul>
            </div>

            <div className='p-2 text-2xl text-center w-full my-4'>
              <strong>Data Security</strong>
            </div>
            <div className='text-lg'>
              We take reasonable measures to protect your information from unauthorized access, alteration, or destruction. However, no system is completely secure, and we encourage you to take precautions to safeguard your account credentials.
            </div>

            <div className='p-2 text-2xl text-center w-full my-4'>
              <strong>Updates to This Policy</strong>
            </div>
            <div className='text-lg'>
              We may update this Privacy Policy from time to time. Any changes will be reflected on this page, and we encourage you to review it periodically.
            </div>
          </div>
        </div>
      </div>
      <div className={`nav-slide ${nav ? 'open' : ''}`}>
  <Nav closeModal={closeNav} setSignin={setSignin}/>
</div>
      <Footer />
    </div>
  );
};
