import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useFormikContext } from 'formik';


export const ServiceDetailsForm = ({ serviceStore }) => {
    const { setValues } = useFormikContext();

    useEffect(() => {
        if (serviceStore) {
            setValues({
                name: serviceStore.name || '',
                address: serviceStore.address || '',
                terms: serviceStore.terms || '',
                availability: serviceStore.availability || '',
                description: serviceStore.description || '',
            });
        }
    }, [serviceStore, setValues]);
    
    return (
        <>
            <div className="w-[100%] flex flex-col gap-2 my-4 max-lg:my-2">
                <label className="mb-2"><h3><strong>Service Name</strong></h3></label>
                <Field name="name" className="rounded-lg text-black w-[100%] p-2" type="text" placeholder="Your Business Name" />
                <ErrorMessage name="name" component="div" className="text-red-500" />
            </div>
            <div className="w-[100%] flex flex-col gap-2 my-4  max-lg:my-2">
                <label className="mb-2"><h3><strong>Service Description</strong></h3></label>
                <Field as="textarea" name="description" className="rounded-lg text-black w-[100%] p-2" placeholder="Describe Your Service" />
                <ErrorMessage name="description" component="div" className="text-red-500" />
            </div>
            <div className="w-[100%] flex flex-col gap-2 my-4  max-lg:my-2">
                <label className="mb-2"><h3><strong>Terms And Conditions</strong></h3></label>
                <Field as="textarea" name="terms" className="rounded-lg text-black w-[100%] p-2" placeholder="Terms And Conditions" />
            </div>
            <div className="w-[100%] flex flex-col gap-2 my-4  max-lg:my-2">
                <label className="mb-2"><h3><strong>Availability</strong></h3></label>
                <Field name="availability" className="rounded-lg text-black w-[100%] p-2" type="text" placeholder="Days And Time Available" />
                <ErrorMessage name="availability" component="div" className="text-red-500" />
            </div>
            <div className="w-[100%] flex flex-col gap-2 my-4  max-lg:my-2">
                <label className="mb-2"><h3><strong>Address</strong></h3></label>
                <Field name="address" className="rounded-lg text-black w-[100%] p-2" type="text" placeholder="Your Business Address" />
                <ErrorMessage name="address" component="div" className="text-red-500" />
            </div>
            
        </>
    );
};






export const Servicedetails = ({ setActiveComponent }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const storedUserData = JSON.parse(localStorage.getItem('userData'));  
    const serviceStore = useSelector((state) => state.createService.createService);

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .matches(/^[a-zA-Z0-9\s]+$/, 'Service title can only contain letters, numbers, and spaces. NO SYMBOLS ALLOWED!!')
            .min(10, 'Service name must be at least 10 characters long')
            .required('Service name is required'),
        address: Yup.string().required('Service address is required'),
        description: Yup.string()
            .min(20, 'Service description must be at least 20 characters long')
            .required('Service description is required'),
        availability: Yup.string().required('Time of availability for your service is required'),
    });
    

    const handleSubmit = async (values, { setSubmitting }) => {
        if (storedUserData && storedUserData.accessToken) {
            dispatch({ type: 'SEND_SERVICE_NAME', serviceName: values.name });
            dispatch({ type: 'SEND_SERVICE_TERMS', serviceTerms: values.terms });
            dispatch({ type: 'SEND_SERVICE_ADDRESS', serviceAddress: values.address });
            dispatch({ type: 'SEND_SERVICE_DESCRIPTION', serviceDescription: values.description });
            dispatch({ type: 'SEND_SERVICE_AVAILABILITY', serviceAvailability: values.availability });

            await setActiveComponent('Servicestatus');
        }
        setSubmitting(false);
    };

    return (
        <div className='container max-lg:pb[4rem]'>
            <strong className='text-bold my-[1.5rem]  max-lg:my-[0.5rem]  max-lg:text-md text-xl text-white'>Input Service Details</strong>
            <div className='text-[13px]  max-lg:text-[8px] text-[#40EF14] my-4  max-lg:my-2'>
                <strong>Please Click<span className ='text-[#FEBD69]'> Next</span> when you fill the form to save your service details and proceed to the next page</strong>
            </div>
            <Formik
    initialValues={{
        name: serviceStore?.name || '',
        description: serviceStore?.description || '',
        terms: serviceStore?.terms || '',
        availability: serviceStore?.availability || '',
        address: serviceStore?.address || '',
    }}
    validationSchema={validationSchema}
    onSubmit={handleSubmit}
>

                {({ isSubmitting }) => (
                    <Form className=' text-white'>
                        <ServiceDetailsForm serviceStore={serviceStore} />
                        <button type="submit" className='py-2 px-4 border-2 border-black bg-[#FEBD69] rounded-lg ml-[100%] text-black' disabled={isSubmitting}>
                            <strong>Next</strong>
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};