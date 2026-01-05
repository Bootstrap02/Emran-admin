import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const Pricing = ({ setActiveComponent }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const storedUserData = JSON.parse(localStorage.getItem('userData'));
    const serviceStore =  useSelector((state) => state.editService.editService);

    const [price1, setPrice1] = useState('');
    const [price2, setPrice2] = useState('');
    const [price3, setPrice3] = useState('');
    const [price4, setPrice4] = useState('');
    const [service1, setService1] = useState('');
    const [service2, setService2] = useState('');
    const [service3, setService3] = useState('');
    const [service4, setService4] = useState('');
    

    useEffect(() => {
        if (serviceStore) {
            setPrice1(serviceStore.price1 || '');
            setPrice2(serviceStore.price2 || '');
            setPrice3(serviceStore.price3 || '');
            setPrice4(serviceStore.price4 || '');
            setService1(serviceStore.service1 || '');
            setService2(serviceStore.service2 || '');
            setService3(serviceStore.service3 || '');
            setService4(serviceStore.service4 || '');
           
        }
    }, [serviceStore]);

    const validationSchema = Yup.object().shape({
        price1: Yup.string()
            .matches(/^[0-9]+$/, 'Price must be digits only'),
        price2: Yup.string()
            .matches(/^[0-9]+$/, 'Price must be digits only'),
        price3: Yup.string()
            .matches(/^[0-9]+$/, 'Price must be digits only'),
        price4: Yup.string()
            .matches(/^[0-9]+$/, 'Price must be digits only'),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        if (storedUserData && storedUserData.accessToken) {
            dispatch({ type: 'EDIT_SERVICE_PRICE1', servicePrice1: values.price1 });
            dispatch({ type: 'EDIT_SERVICE_PRICE2', servicePrice2: values.price2 });
            dispatch({ type: 'EDIT_SERVICE_PRICE3', servicePrice3: values.price3 });
            dispatch({ type: 'EDIT_SERVICE_PRICE4', servicePrice4: values.price4 });
            dispatch({ type: 'EDIT_SERVICE_SERVICE1', serviceservice1: values.service1 });
            dispatch({ type: 'EDIT_SERVICE_SERVICE2', serviceservice2: values.service2 });
            dispatch({ type: 'EDIT_SERVICE_SERVICE3', serviceservice3: values.service3 });
            dispatch({ type: 'EDIT_SERVICE_SERVICE4', serviceservice4: values.service4 });
            setActiveComponent('Serviceimages');
        }
        setSubmitting(false);
    };

    return (
        <div>
 <div className='max-lg:hidden'>
            <strong className='text-bold my-[1.5rem] text-xl text-white'>Input Price Details</strong>
            <div className='text-[13px] text-[#40EF14] my-4'>
                <strong>Please Click<span className ='text-[#FEBD69]'> Next</span> when you fill the form to save your service details and proceed to the next page</strong>
            </div>
            <Formik
                initialValues={{
                    price1: price1,
                    price2: price2,
                    price3: price3,
                    price4: price4,
                    service1: service1,
                    service2: service2,
                    service3: service3,
                    service4: service4,
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({ values, isSubmitting }) => (
                    <Form className='w[100%] m-4 text-white'>
                        <div className=' w-[100%] flex items-center justify-between'>
                        <div className=" flex flex-col gap-2 my-4">
                            <label className="mb-2"><h3><strong>Price 1</strong></h3></label>
                            <Field name="price1" className="rounded-lg text-black w-[90%] p-2" placeholder="Name a service Price " />
                            <ErrorMessage name="price1" component="div" className="text-red-500" />
                        </div>
                        <div className=" flex flex-col gap-2 my-4">
                            <label className="mb-2"><h3><strong>Service 1</strong></h3></label>
                            <Field name="service1" className="rounded-lg text-black w-[90%] p-2" placeholder="Name the Service" />
                            <ErrorMessage name="service1" component="div" className="text-red-500" />
                        </div>
                        </div>
                        <div className=' w-[100%] flex items-center justify-between'>
                        <div className=" flex flex-col gap-2 my-4">
                            <label className="mb-2"><h3><strong>Price 2</strong></h3></label>
                            <Field name="price2" className="rounded-lg text-black w-[90%] p-2" placeholder="Name a service Price " />
                            <ErrorMessage name="price2" component="div" className="text-red-500" />
                        </div>
                        <div className=" flex flex-col gap-2 my-4">
                            <label className="mb-2"><h3><strong>Service 2</strong></h3></label>
                            <Field name="service2" className="rounded-lg text-black w-[90%] p-2" placeholder="Name the Service" />
                            <ErrorMessage name="service2" component="div" className="text-red-500" />
                        </div>
                        </div>
                        <div className=' w-[100%] flex items-center justify-between'>
                        <div className=" flex flex-col gap-2 my-4">
                            <label className="mb-2"><h3><strong>Price 3</strong></h3></label>
                            <Field name="price3" className="rounded-lg text-black w-[90%] p-2" placeholder="Name a service Price " />
                            <ErrorMessage name="price3" component="div" className="text-red-500" />
                        </div>
                        <div className=" flex flex-col gap-2 my-4">
                            <label className="mb-2"><h3><strong>Service 3</strong></h3></label>
                            <Field name="service3" className="rounded-lg text-black w-[90%] p-2" placeholder="Name the Service" />
                            <ErrorMessage name="service3" component="div" className="text-red-500" />
                        </div>
                        </div>
                        <div className=' w-[100%] flex items-center justify-between'>
                        <div className=" flex flex-col gap-2 my-4">
                            <label className="mb-2"><h3><strong>Price 4</strong></h3></label>
                            <Field name="price4" className="rounded-lg text-black w-[90%] p-2" placeholder="Name a service Price " />
                            <ErrorMessage name="price4" component="div" className="text-red-500" />
                        </div>
                        <div className=" flex flex-col gap-2 my-4">
                            <label className="mb-2"><h3><strong>Service 4</strong></h3></label>
                            <Field name="service4" className="rounded-lg text-black w-[90%] p-2" placeholder="Name the Service" />
                            <ErrorMessage name="service4" component="div" className="text-red-500" />
                        </div>
                        </div>
                        
                        <button type="submit" className='py-2 px-4 border bg-[#FEBD69] rounded-lg ml-[100%] text-black' disabled={isSubmitting}>
                            <strong>Next</strong>
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
        <div className='hidden max-lg:block pb-[12rem]'>
            <strong className='text-bold my-[0.5rem] text-md text-white'>Input Price Details</strong>
            <div className='text-[8px] text-[#40EF14] my-2'>
                <strong>Please Click<span className ='text-[#FEBD69]'> Next</span> when you fill the form to save your service details and proceed to the next page</strong>
            </div>
            <Formik
                initialValues={{
                    price1: price1,
                    price2: price2,
                    price3: price3,
                    price4: price4,
                    service1: service1,
                    service2: service2,
                    service3: service3,
                    service4: service4,
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({ values, isSubmitting }) => (
                    <Form className='w[100%] m-2 text-white'>
                        <div className=' w-[100%] flex items-center justify-between'>
                        <div className=" flex flex-col gap-2 my-2">
                            <label className="mb-2"><h3><strong>Price 1</strong></h3></label>
                            <Field name="price1" className="rounded-lg text-black w-[90%] p-2" placeholder="Name a service Price " />
                            <ErrorMessage name="price1" component="div" className="text-red-500" />
                        </div>
                        <div className=" flex flex-col gap-2 my-2">
                            <label className="mb-2"><h3><strong>Service 1</strong></h3></label>
                            <Field name="service1" className="rounded-lg text-black w-[90%] p-2" placeholder="Name the Service" />
                            <ErrorMessage name="service1" component="div" className="text-red-500" />
                        </div>
                        </div>
                        <div className=' w-[100%] flex items-center justify-between'>
                        <div className=" flex flex-col gap-2 my-2">
                            <label className="mb-2"><h3><strong>Price 2</strong></h3></label>
                            <Field name="price2" className="rounded-lg text-black w-[90%] p-2" placeholder="Name a service Price " />
                            <ErrorMessage name="price2" component="div" className="text-red-500" />
                        </div>
                        <div className=" flex flex-col gap-2 my-2">
                            <label className="mb-2"><h3><strong>Service 2</strong></h3></label>
                            <Field name="service2" className="rounded-lg text-black w-[90%] p-2" placeholder="Name the Service" />
                            <ErrorMessage name="service2" component="div" className="text-red-500" />
                        </div>
                        </div>
                        <div className=' w-[100%] flex items-center justify-between'>
                        <div className=" flex flex-col gap-2 my-2">
                            <label className="mb-2"><h3><strong>Price 3</strong></h3></label>
                            <Field name="price3" className="rounded-lg text-black w-[90%] p-2" placeholder="Name a service Price " />
                            <ErrorMessage name="price3" component="div" className="text-red-500" />
                        </div>
                        <div className=" flex flex-col gap-2 my-2">
                            <label className="mb-2"><h3><strong>Service 3</strong></h3></label>
                            <Field name="service3" className="rounded-lg text-black w-[90%] p-2" placeholder="Name the Service" />
                            <ErrorMessage name="service3" component="div" className="text-red-500" />
                        </div>
                        </div>
                        <div className=' w-[100%] flex items-center justify-between'>
                        <div className=" flex flex-col gap-2 my-2">
                            <label className="mb-2"><h3><strong>Price 4</strong></h3></label>
                            <Field name="price4" className="rounded-lg text-black w-[90%] p-2" placeholder="Name a service Price " />
                            <ErrorMessage name="price4" component="div" className="text-red-500" />
                        </div>
                        <div className=" flex flex-col gap-2 my-2">
                            <label className="mb-2"><h3><strong>Service 4</strong></h3></label>
                            <Field name="service4" className="rounded-lg text-black w-[90%] p-2" placeholder="Name the Service" />
                            <ErrorMessage name="service4" component="div" className="text-red-500" />
                        </div>
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

export default Pricing;
