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
    const serviceStore =  useSelector((state) => state.editService.editService);

    const [seller, setSeller] = useState('');
    const [sellerLocation, setSellerLocation] = useState('');
    const [coverage, setCoverage] = useState('');
    const [university, setUniversity] = useState(null);
    const [mobile, setMobile] = useState('');
    const [mobile2, setMobile2] = useState('');

    useEffect(() => {
        if (serviceStore) {
            setSeller(serviceStore.seller || '');
            setSellerLocation(serviceStore.sellerLocation || '');
            setCoverage(serviceStore.coverage || '');
            setUniversity(serviceStore.university ? { value: serviceStore.university, label: serviceStore.university } : null);
            setMobile(serviceStore.mobile || '');
            setMobile2(serviceStore.mobile2 || '');
        }
    }, [serviceStore]);

    const validationSchema = Yup.object().shape({
        seller: Yup.string().required('Your Names are required'),
        sellerLocation: Yup.string().required('Your Location is required'),
        coverage: Yup.string().required('The region(territory) your business serves is required'),
        university: Yup.object().required('University is required'),
        mobile: Yup.string()
            .matches(/^[0-9]{11}$/, 'Mobile must be exactly 11 digits')
            .required('Mobile is required'),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        if (storedUserData && storedUserData.accessToken) {
            dispatch({ type: 'EDIT_SERVICE_SELLER', serviceSeller: values.seller });
            dispatch({ type: 'EDIT_SERVICE_SELLERLOCATION', serviceSellerLocation: values.sellerLocation });
            dispatch({ type: 'EDIT_SERVICE_COVERAGE', serviceCoverage: values.coverage });
            dispatch({ type: 'EDIT_SERVICE_UNIVERSITY', serviceUniversity: values.university.value });
            dispatch({ type: 'EDIT_SERVICE_MOBILE', serviceMobile: values.mobile });
            dispatch({ type: 'EDIT_SERVICE_MOBILE2', serviceMobile2: values.mobile2 });

            setActiveComponent('Pricing');
        }
        setSubmitting(false);
    };

    return (
        <div>
            <div className='max-lg:hidden'>
            <strong className='text-bold my-[1.5rem] text-xl text-white'>Contact Information</strong>
            <div className='text-[13px] text-[#40EF14] my-4'>
                <strong>Please Click<span className ='text-[#FEBD69]'> Next</span> when you fill the form to save your contact details and proceed to the next page</strong>
            </div>
            <Formik
                initialValues={{
                    seller: seller,
                    sellerLocation: sellerLocation,
                    coverage: coverage,
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
                            <Field name="seller" className="rounded-lg text-black w-[90%] p-2" placeholder="Your First and Last Name" />
                            <ErrorMessage name="seller" component="div" className="text-red-500" />
                        </div>
                        <div className="w-[100%] flex flex-col gap-2 my-4">
                            <label className="mb-2"><h3><strong>Business Location</strong></h3></label>
                            <Field name="sellerLocation" className="rounded-lg text-black w-[90%] p-2" placeholder="Your Business Location" />
                            <ErrorMessage name="sellerLocation" component="div" className="text-red-500" />
                        </div>
                        <div className="w-[100%] flex flex-col gap-2 my-4">
                            <label className="mb-2"><h3><strong>Business Territory</strong></h3></label>
                            <Field name="coverage" className="rounded-lg text-black w-[90%] p-2" placeholder="eg. Nigeria, eg. Lagos only" />
                            <ErrorMessage name="coverage" component="div" className="text-red-500" />
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
                            <Field name="mobile" className="rounded-lg text-black w-[90%] p-2" placeholder="Your Phone Number 1" />
                            <ErrorMessage name="mobile" component="div" className="text-red-500" />
                        </div>
                        <div className="w-[100%] flex flex-col gap-2 my-4">
                            <label className="mb-2"><h3><strong>Phone Number 2</strong></h3></label>
                            <Field name="mobile2" className="rounded-lg text-black w-[90%] p-2" placeholder="Your Phone Number 2" />
                        </div>

                        <button type="submit" className='py-2 px-4 border bg-[#FEBD69] rounded-lg ml-[100%] text-black' disabled={isSubmitting}>
                            <strong>Next</strong>
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
        <div className='container hidden max-lg:block pb-[12rem]'>
            <strong className='text-bold my-[0.5rem] text-md text-white'>Contact Information</strong>
            <div className='text-[8px] text-[#40EF14] my-2'>
                <strong>Please Click<span className ='text-[#FEBD69]'> Next</span> when you fill the form to save your contact details and proceed to the next page</strong>
            </div>
            <Formik
                initialValues={{
                    seller: seller,
                    sellerLocation: sellerLocation,
                    coverage: coverage,
                    university: university,
                    mobile: mobile,
                    mobile2: mobile2,
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({ setFieldValue, values, isSubmitting }) => (
                    <Form className='w[100%] m-2 text-white'>
                        <div className="w-[100%] flex flex-col gap-2 my-2">
                            <label className="mb-2"><h3><strong>Your Names</strong></h3></label>
                            <Field name="seller" className="rounded-lg text-black w-[90%] p-2" placeholder="Your First and Last Name" />
                            <ErrorMessage name="seller" component="div" className="text-red-500" />
                        </div>
                        <div className="w-[100%] flex flex-col gap-2 my-2">
                            <label className="mb-2"><h3><strong>Business Location</strong></h3></label>
                            <Field name="sellerLocation" className="rounded-lg text-black w-[90%] p-2" placeholder="Your Business Location" />
                            <ErrorMessage name="sellerLocation" component="div" className="text-red-500" />
                        </div>
                        <div className="w-[100%] flex flex-col gap-2 my-2">
                            <label className="mb-2"><h3><strong>Business Territory</strong></h3></label>
                            <Field name="coverage" className="rounded-lg text-black w-[90%] p-2" placeholder="eg. Nigeria, eg. Lagos only" />
                            <ErrorMessage name="coverage" component="div" className="text-red-500" />
                        </div>
                        <div className='w-[100%] flex flex-col gap-2 my-2'>
                            <div className="input-group-prepend">
                                <label className="mb-2" htmlFor="inputGroupSelect01"><strong>School</strong></label>
                            </div>
                            <Select
                                name='university'
                                className="form-control border border-gray-400"
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
                            <Field name="mobile" className="rounded-lg text-black w-[90%] p-2" placeholder="Your Phone Number 1" />
                            <ErrorMessage name="mobile" component="div" className="text-red-500" />
                        </div>
                        <div className="w-[100%] flex flex-col gap-2 my-2">
                            <label className="mb-2"><h3><strong>Phone Number 2</strong></h3></label>
                            <Field name="mobile2" className="rounded-lg text-black w-[90%] p-2" placeholder="Your Phone Number 2" />
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
