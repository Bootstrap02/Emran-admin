import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { universities } from '../../../Constants/Universities';

const Contactinformation = ({ setActiveComponent }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const storedUserData = JSON.parse(localStorage.getItem('userData'));
    const productStore = useSelector((state) => state.createProduct.createProduct);

    const [seller, setSeller] = useState('');
    const [sellerLocation, setSellerLocation] = useState('');
    const [university, setUniversity] = useState(null);
    const [mobile, setMobile] = useState('');
    const [mobile2, setMobile2] = useState('');

    useEffect(() => {
        if (productStore) {
            setSeller(productStore.seller || '');
            setSellerLocation(productStore.sellerLocation || '');
            setUniversity(productStore.university ? { value: productStore.university, label: productStore.university } : null);
            setMobile(productStore.mobile || '');
            setMobile2(productStore.mobile2 || '');
        }
    }, [productStore]);

    const validationSchema = Yup.object().shape({
        seller: Yup.string().required('Names are required'),
        sellerLocation: Yup.string().required('Location is required'),
        university: Yup.object().required('University is required'),
        mobile: Yup.string()
            .matches(/^[0-9]{11}$/, 'Mobile must be exactly 11 digits')
            .required('Mobile is required'),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        if (storedUserData && storedUserData.accessToken) {
            dispatch({ type: 'SEND_PRODUCT_SELLER', productSeller: values.seller });
            dispatch({ type: 'SEND_PRODUCT_SELLERLOCATION', productSellerLocation: values.sellerLocation });
            dispatch({ type: 'SEND_PRODUCT_UNIVERSITY', productUniversity: values.university.value });
            dispatch({ type: 'SEND_PRODUCT_MOBILE', productMobile: values.mobile });
            dispatch({ type: 'SEND_PRODUCT_MOBILE2', productMobile2: values.mobile2 });

            setActiveComponent('Pricing');
        }
        setSubmitting(false);
    };

    return (
        <div>
<div className='container max-lg:hidden pb-[12rem]'>
            <strong className='text-bold my-[1.5rem] text-xl text-white'>Contact Information</strong>
            <div className='text-[13px] text-[#40EF14] my-4'>
                <strong>Please Click<span className ='text-[#FEBD69]'> Next</span> when you fill the form to save your contact details and proceed to the next page</strong>
            </div>
            <Formik
                initialValues={{
                    seller: seller,
                    sellerLocation: sellerLocation,
                    university: university,
                    mobile: mobile,
                    mobile2: mobile2,
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({ setFieldValue, values, isSubmitting }) => (
                    <Form className='w[100%] m-4 text-white'>
                        <div className="w-[100%] flex flex-col gap-2 my-4">
                            <label className="mb-2"><h3><strong>Your Names</strong></h3></label>
                            <Field name="seller" className="rounded-lg text-black w-[100%] p-2" placeholder="Your First and Last Name" />
                            <ErrorMessage name="seller" component="div" className="text-red-500" />
                        </div>
                        <div className="w-[100%] flex flex-col gap-2 my-4">
                            <label className="mb-2"><h3><strong>Location</strong></h3></label>
                            <Field name="sellerLocation" className="rounded-lg text-black w-[100%] p-2" placeholder="Your Location" />
                            <ErrorMessage name="sellerLocation" component="div" className="text-red-500" />
                        </div>
                        <div className='w-[100%] flex flex-col gap-2 my-2'>
                            <div className="input-group-prepend">
                                <label className="mb-2" htmlFor="inputGroupSelect01"><strong>School</strong></label>
                            </div>
                            <Select
                                name='university'
                                className="form-control p-2 m-2 border max-lg:m-0 max-lg:p-0 border-gray-400"
                                value={values.university}
                                onChange={(option) => setFieldValue('university', option)}
                                options={universities.map((university) => ({
                                    value: university.title,
                                    label: university.title,
                                }))}
                                placeholder="Search for your School..."
                                isClearable
                            />
                            <ErrorMessage name="university" component="div" className="text-red-500" />
                        </div>
                        <div className="w-[100%] flex flex-col gap-2 my-4">
                            <label className="mb-2"><h3><strong>Phone Number 1</strong></h3></label>
                            <Field name="mobile" className="rounded-lg text-black w-[100%] p-2" placeholder="Your Phone Number 1" />
                            <ErrorMessage name="mobile" component="div" className="text-red-500" />
                        </div>
                        <div className="w-[100%] flex flex-col gap-2 my-4">
                            <label className="mb-2"><h3><strong>Phone Number 2</strong></h3></label>
                            <Field name="mobile2" className="rounded-lg text-black w-[100%] p-2" placeholder="(Optional)" />
                        </div>

                        <button type="submit" className='py-2 px-4 border bg-[#FEBD69] rounded-lg ml-[100%] text-black' disabled={isSubmitting}>
                            <strong>Next</strong>
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
        <div className='container hidden max-lg:block'>
            <strong className='text-bold my-[0.5rem] text-md text-white'>Contact Information</strong>
            <div className='text-[8px] text-[#40EF14] my-2'>
                <strong>Please Click<span className ='text-[#FEBD69]'> Next</span> when you fill the form to save your contact details and proceed to the next page</strong>
            </div>
            <Formik
                initialValues={{
                    seller: seller,
                    sellerLocation: sellerLocation,
                    university: university,
                    mobile: mobile,
                    mobile2: mobile2,
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({ setFieldValue, values, isSubmitting }) => (
                    <Form className='w-[100%] m-2 text-white'>
                        <div className="w-[100%] flex flex-col gap-2 my-2">
                            <label className="mb-2"><h3><strong>Your Names</strong></h3></label>
                            <Field name="seller" className="rounded-lg text-black w-[100%] p-2" placeholder="Your First and Last Name" />
                            <ErrorMessage name="seller" component="div" className="text-red-500" />
                        </div>
                        <div className="w-[100%] flex flex-col gap-2 my-2">
                            <label className="mb-2"><h3><strong>Location</strong></h3></label>
                            <Field name="sellerLocation" className="rounded-lg text-black w-[100%] p-2" placeholder="Your Location" />
                            <ErrorMessage name="sellerLocation" component="div" className="text-red-500" />
                        </div>
                        <div className='w-[100%] flex flex-col gap-2 my-2'>
                            <div className="input-group-prepend">
                                <label className="mb-2" htmlFor="inputGroupSelect01"><strong>School</strong></label>
                            </div>
                            <Select
                                name='university'
                                className="form-control p-2 m-2 border max-lg:m-0 max-lg:p-0 border-gray-400"
                                value={values.university}
                                onChange={(option) => setFieldValue('university', option)}
                                options={universities.map((university) => ({
                                    value: university.title,
                                    label: university.title,
                                }))}
                                placeholder="Search for your School..."
                                isClearable
                            />
                            <ErrorMessage name="university" component="div" className="text-red-500" />
                        </div>
                        <div className="w-[100%] flex flex-col gap-2 my-2">
                            <label className="mb-2"><h3><strong>Phone Number 1</strong></h3></label>
                            <Field name="mobile" className="rounded-lg text-black w-[100%] p-2" placeholder="Your Phone Number 1" />
                            <ErrorMessage name="mobile" component="div" className="text-red-500" />
                        </div>
                        <div className="w-[100%] flex flex-col gap-2 my-2">
                            <label className="mb-2"><h3><strong>Phone Number 2</strong></h3></label>
                            <Field name="mobile2" className="rounded-lg text-black w-[100%] p-2" placeholder="(Optional)" />
                        </div>

                        <button type="submit" className='py-2 px-4 border bg-[#FEBD69] rounded-lg ml-[100%] text-black' disabled={isSubmitting}>
                            <strong>Next</strong>
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
        </div>
        
    );
};

export default Contactinformation;
