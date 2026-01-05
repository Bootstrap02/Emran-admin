import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useFormikContext } from 'formik';


export const ProductDetailsForm = ({ productStore }) => {
    const { setValues } = useFormikContext();

    useEffect(() => {
        if (productStore) {
            setValues({
                title: productStore.title || '',
                location: productStore.location || '',
                brand: productStore.brand || '',
                color: productStore.color || '',
                description: productStore.description || '',
                details: productStore.details || ''
            });
        }
    }, [productStore, setValues]);

    return (
        <>
            <div className="w-[100%] flex flex-col gap-2 my-4 max-lg:my-2">
                <label className="mb-2"><h3><strong>Product Title</strong></h3></label>
                <Field name="title" className="rounded-lg text-black w-[100%] p-2" type="text" placeholder="Your Product Name" />
                <ErrorMessage name="title" component="div" className="text-red-500" />
            </div>
            <div className="w-[100%] flex flex-col gap-2 my-4 max-lg:my-2">
                <label className="mb-2"><h3><strong>Product Brand</strong></h3></label>
                <Field name="brand" className="rounded-lg text-black w-[100%] p-2" type="text" placeholder="Your Product Brand" />
            </div>
            <div className="w-[100%] flex flex-col gap-2 my-4 max-lg:my-2">
                <label className="mb-2"><h3><strong>Color</strong></h3></label>
                <Field name="color" className="rounded-lg text-black w-[100%] p-2" type="text" placeholder="Your Product Color" />
            </div>
            <div className="w-[100%] flex flex-col gap-2 my-4 max-lg:my-2">
                <label className="mb-2"><h3><strong>Location</strong></h3></label>
                <Field name="location" className="rounded-lg text-black w-[100%] p-2" type="text" placeholder="Your Product Location" />
                <ErrorMessage name="location" component="div" className="text-red-500" />
            </div>
            <div className="w-[100%] flex flex-col gap-2 my-4 max-lg:my-2">
                <label className="mb-2"><h3><strong>Product Description</strong></h3></label>
                <Field as="textarea" name="description" className="rounded-lg text-black w-[100%] p-2" placeholder="Describe Your Product" />
                <ErrorMessage name="description" component="div" className="text-red-500" />
            </div>
            <div className="w-[100%] flex flex-col gap-2 my-4 max-lg:my-2">
                <label className="mb-2"><h3><strong>Product Additional Details</strong></h3></label>
                <Field as="textarea" name="details" className="rounded-lg text-black w-[100%] p-2" placeholder="(Optional)" />
            </div>
        </>
    );
};






export const Productdetails = ({ setActiveComponent }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const storedUserData = JSON.parse(localStorage.getItem('userData'));  
    const productStore = useSelector((state) => state.createProduct.createProduct);

    const validationSchema = Yup.object().shape({
        title: Yup.string()
            .matches(/^[a-zA-Z0-9\s]+$/, 'Product title can only contain letters, numbers, and spaces. NO SYMBOLS ALLOWED!!')
            .min(10, 'Product title must be at least 10 characters long')
            .required('Product title is required'),
        location: Yup.string().required('Product location is required'),
        description: Yup.string()
        .min(20, 'Product description must be at least 20 characters long')
            .required('Product description is required'),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        if (storedUserData && storedUserData.accessToken) {
            dispatch({ type: 'SEND_PRODUCT_TITLE', productTitle: values.title });
            dispatch({ type: 'SEND_PRODUCT_BRAND', productBrand: values.brand });
            dispatch({ type: 'SEND_PRODUCT_LOCATION', productLocation: values.location });
            dispatch({ type: 'SEND_PRODUCT_COLOR', productColor: values.color });
            dispatch({ type: 'SEND_PRODUCT_DESCRIPTION', productDescription: values.description });
            dispatch({ type: 'SEND_PRODUCT_DETAILS', productDetails: values.details });

            await setActiveComponent('Productstatus');
        }
        setSubmitting(false);
    };

    return (
        <div className='container max-lg:pb-[8rem]'>
            <strong className='text-bold my-[1.5rem] max-lg:my-[0.5rem] text-xl max-lg:text-md text-white'>Input Product Details</strong>
            <div className='text-[13px] max-lg:text-[8px] text-[#40EF14] my-4 max-lg:my-2'>
                <strong>Please Click<span className ='text-[#FEBD69]'> Next</span> when you fill the form to save your product details and proceed to the next page</strong>
            </div>
            <Formik
                initialValues={{
                    title: '',
                    brand: '',
                    color: '',
                    location: '',
                    description: '',
                    details: ''
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form className=' text-white'>
                        <ProductDetailsForm productStore={productStore} />
                        <button type="submit" className='py-2 px-4 border-2 border-black bg-[#FEBD69] rounded-lg ml-[100%] text-black' disabled={isSubmitting}>
                            <strong>Next</strong>
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};