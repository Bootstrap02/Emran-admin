import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const Pricing = ({ setActiveComponent }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const storedUserData = JSON.parse(localStorage.getItem('userData'));
    const productStore = useSelector((state) => state.editProduct.editProduct);

    const [price, setPrice] = useState('');
    const [promoPrice, setPromoPrice] = useState('');
    const [promoQuantity, setPromoQuantity] = useState('');

    useEffect(() => {
        if (productStore) {
            setPrice(productStore.price || '');
            setPromoPrice(productStore.promoPrice || '');
            setPromoQuantity(productStore.promoQuantity || '');
        }
    }, [productStore]);

    const validationSchema = Yup.object().shape({
        price: Yup.string()
            .matches(/^[0-9]+$/, 'Price must be digits only')
            .required('Price is required'),
        promoPrice: Yup.string()
            .matches(/^[0-9]*$/, 'Promo Price must be digits only'),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        if (storedUserData && storedUserData.accessToken) {
            dispatch({ type: 'EDIT_PRODUCT_PRICE', productPrice: values.price });
            dispatch({ type: 'EDIT_PRODUCT_PROMOPRICE', productPromoPrice: values.promoPrice });
            dispatch({ type: 'EDIT_PRODUCT_PROMOQUANTITY', productPromoQuantity: values.promoQuantity });

            setActiveComponent('Productimages');
        }
        setSubmitting(false);
    };

    return (
        <div>
            <div className='max-lg:hidden'>
            <strong className='text-bold my-[1.5rem] text-xl text-white'>Input Price Details</strong>
            <div className='text-[13px] text-[#40EF14] my-4'>
                <strong>Please Click<span className ='text-[#FEBD69]'> Next</span> when you fill the form to save your product details and proceed to the next page</strong>
            </div>
            <Formik
                initialValues={{
                    price: price,
                    promoPrice: promoPrice,
                    promoQuantity: promoQuantity,
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({ values, isSubmitting }) => (
                    <Form className='w[100%] m-4 text-white'>
                        <div className="w-[100%] flex flex-col gap-2 my-4">
                            <label className="mb-2"><h3><strong>Price</strong></h3></label>
                            <Field name="price" className="rounded-lg text-black w-[90%] p-2" placeholder="Your Product Price" />
                            <ErrorMessage name="price" component="div" className="text-red-500" />
                            <strong className='text-[10px] max-lg:text-[7px] text-red-700 mt-[-8px]'>No symbol, comma or letters allowed just numbers</strong>
                        </div>
                        <div className="w-[100%] flex flex-col gap-2 my-4">
                            <label className="mb-2"><h3><strong>Promo Price</strong></h3></label>
                            <Field name="promoPrice" className="rounded-lg text-black w-[90%] p-2" placeholder="(Optional)" />
                            <ErrorMessage name="promoPrice" component="div" className="text-red-500" />
                        </div>
                        <div className="w-[100%] flex flex-col gap-2 my-4">
                            <label className="mb-2"><h3><strong>Promo Quantity</strong></h3></label>
                            <Field name="promoQuantity" className="rounded-lg text-black w-[90%] p-2" placeholder="(Optional)" />
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
                <strong>Please Click<span className ='text-[#FEBD69]'> Next</span> when you fill the form to save your product details and proceed to the next page</strong>
            </div>
            <Formik
                initialValues={{
                    price: price,
                    promoPrice: promoPrice,
                    promoQuantity: promoQuantity,
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({ values, isSubmitting }) => (
                    <Form className='w[100%] m-2 text-white'>
                        <div className="w-[100%] flex flex-col gap-2 my-2">
                            <label className="mb-2"><h3><strong>Price</strong></h3></label>
                            <Field name="price" className="rounded-lg text-black w-[90%] p-2" placeholder="Your Product Price" />
                            <ErrorMessage name="price" component="div" className="text-red-500" />
                            <strong className='text-[10px] max-lg:text-[7px] text-red-700 mt-[-8px]'>No symbol, comma or letters allowed just numbers</strong>
                        </div>
                        <div className="w-[100%] flex flex-col gap-2 my-2">
                            <label className="mb-2"><h3><strong>Promo Price</strong></h3></label>
                            <Field name="promoPrice" className="rounded-lg text-black w-[90%] p-2" placeholder="(Optional)" />
                            <ErrorMessage name="promoPrice" component="div" className="text-red-500" />
                        </div>
                        <div className="w-[100%] flex flex-col gap-2 my-2">
                            <label className="mb-2"><h3><strong>Promo Quantity</strong></h3></label>
                            <Field name="promoQuantity" className="rounded-lg text-black w-[90%] p-2" placeholder="(Optional)" />
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
