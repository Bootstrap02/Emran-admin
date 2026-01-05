import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'; 
import axios from 'axios';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { BigLoader } from "../../../Modals/Loaders"

const Productimages = ({ setActiveComponent }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const accessedToken = JSON.parse(localStorage.getItem('userData'));  
    const [selectedImages, setSelectedImages] = useState([]);
    const [signin, setSignin] = useState(false);
    const [loading, setLoading] = useState(false);
    const [viewProduct, setViewProduct] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const UPLOAD_IMAGES_API_KEY = 'https://campusbuy-backend-nkmx.onrender.com/uploadproductimage';
    const { id } = useParams();
    const productStore = JSON.parse(localStorage.getItem('editproduct'));
    const UPDATE_PRODUCT_API_KEY = `https://campusbuy-backend-nkmx.onrender.com/updateproduct/${productStore._id}`;
    const updatedProductStore = useSelector((state) => state.editProduct.editProduct);


    const openSignin = () => setSignin(true);
    const closeSignin = () => setSignin(false);
    const openLoading = () => setLoading(true);
    const closeLoading = () => setLoading(false);
    const openViewProduct = () => setViewProduct(true);
    const closeViewProduct = () => setViewProduct(false);

   
    const axiosInstance = axios.create({
        baseURL: 'https://campusbuy-backend-nkmx.onrender.com', // Replace with your API base URL
    });
    
    const setAuthToken = (token) => {
        if (token) {
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axiosInstance.defaults.headers.common['Authorization'];
        }
    };
    
    if (accessedToken && accessedToken.accessToken) {
        setAuthToken(accessedToken.accessToken);
    }

    const moveForward = async (values) => {

        try {
            openLoading();
            const response = await axiosInstance.put(UPDATE_PRODUCT_API_KEY, updatedProductStore);
            

            if (selectedImages) {
                const formData = new FormData();
                selectedImages.forEach((image) => {
                    formData.append('images', image);
                });
    
                
                for (const [key, value] of formData.entries()) {
                    
                }
    
                const uploadImages = await axiosInstance.put(`${UPLOAD_IMAGES_API_KEY}/${productStore._id}`, formData);
    
                
                localStorage.setItem('newproduct', JSON.stringify(uploadImages.data));
    
                if (uploadImages.data) {
                    openViewProduct();
                    setTimeout(() => {
                        closeViewProduct();
                        navigate(`/newproduct/${response.data._id}/${response.data.title}`);
                    }, 3000);
                }
            }

        } catch (error) {
            if (error.response) {
                if (error.response.status === 403) {
                    openSignin(true);
                    setTimeout(() => {
                        closeSignin();
                        navigate('/signin');
                    }, 3000);
                } else {
                    alert('WRONG IMAGE FORMAT: only jpg, jpeg, png, and svg formats allowed');
                    console.error('Error creating your product:', error);
                }
            } else {
                console.error('Unexpected error:', error);
                alert('Connection problems. Please refresh your network');
            }
        } finally {
            closeLoading();
        }
    };

    const handleChange = (e, setFieldValue) => {
        const files = Array.from(e.target.files);
        const allowedExtensions = ['jpg', 'jpeg', 'png', 'svg'];
        const validFiles = [];
        let hasError = false;

        files.forEach((file) => {
            const fileExtension = file.name.split('.').pop().toLowerCase();
            if (allowedExtensions.includes(fileExtension)) {
                validFiles.push(file);
            } else {
                hasError = true;
                setErrorMessage('Unsupported file format. Only jpg, jpeg, png, and svg are allowed.');
            }
        });

        if (!hasError) {
            setSelectedImages((prevImages) => [...prevImages, ...validFiles]);
            setFieldValue("images", validFiles);
            setErrorMessage('');
        }
    };

    const validationSchema = Yup.object().shape({
        images: Yup.mixed().test("fileFormat", "Unsupported Format", (value) => {
            if (value) {
                return value.every((file) => {
                    const fileExtension = file.name.split('.').pop().toLowerCase();
                    return ['jpg', 'jpeg', 'png', 'svg'].includes(fileExtension);
                });
            }
            return true;
        }),
    });

    return (
       <div>
         <div className='max-lg:hidden'>
            <strong className='text-bold my-[1.5rem] text-xl text-white'>Add Images</strong>
            <div className='text-md text-[#40EF14] text-center my-4'>
                <strong>Add Your product images. Note: Only *jpg, jpeg, png and svg* images allowed</strong>
            </div>

            {errorMessage && <div className="text-red-500 my-2">{errorMessage}</div>}

            <Formik
                initialValues={{ images: [] }}
                validationSchema={validationSchema}
                onSubmit={moveForward}
            >
                {({ setFieldValue }) => (
                    <Form className='w[100%] m-4 text-white'>
                        <div className="w-[100%] flex flex-col gap-2 my-4">
                            <label className="mb-2"><h3><strong>1st</strong></h3></label>
                            <input
                                type="file"
                                name="images"
                                accept="image/*"
                                className="rounded-lg w-[90%] p-2"
                                onChange={(e) => handleChange(e, setFieldValue)}
                            />
                            <ErrorMessage name="images" component="div" className="text-red-500" />
                        </div>
                        <div className="w-[100%] flex flex-col gap-2 my-4">
                            <label className="mb-2"><h3><strong>2nd</strong></h3></label>
                            <input
                                type="file"
                                placeholder='(Optional)'
                                name="images"
                                accept="image/*"
                                className="rounded-lg w-[90%] p-2"
                                onChange={(e) => handleChange(e, setFieldValue)}
                            />
                            <ErrorMessage name="images" component="div" className="text-red-500" />
                        </div>
                        <div className="w-[100%] flex flex-col gap-2 my-4">
                            <label className="mb-2"><h3><strong>3rd</strong></h3></label>
                            <input
                                type="file"
                                placeholder='(Optional)'
                                name="images"
                                accept="image/*"
                                className="rounded-lg w-[90%] p-2"
                                onChange={(e) => handleChange(e, setFieldValue)}
                            />
                            <ErrorMessage name="images" component="div" className="text-red-500" />
                        </div>
                        <div className="w-[100%] flex flex-col gap-2 my-4">
                            <label className="mb-2"><h3><strong>4th</strong></h3></label>
                            <input
                                type="file"
                                placeholder='(Optional)'
                                name="images"
                                accept="image/*"
                                className="rounded-lg w-[90%] p-2"
                                onChange={(e) => handleChange(e, setFieldValue)}
                            />
                            <ErrorMessage name="images" component="div" className="text-red-500" />
                        </div>
                        <button type="submit" className='py-2 px-4 border bg-[#FEBD69] rounded-lg ml-[100%] text-black'><strong>{loading ? <BigLoader/> : "finish"}</strong></button>
                    </Form>
                )}
            </Formik>
        </div>
        <div className='hidden max-lg:block pb-[12rem]'>
            <strong className='text-bold my-[0.5rem] text-md text-white'>Add Images</strong>
            <div className='text-[8px] text-[#40EF14] text-center my-2'>
                <strong>Add Your product images. Note: Only *jpg, jpeg, png and svg* images allowed</strong>
            </div>

            {errorMessage && <div className="text-red-500 my-2">{errorMessage}</div>}

            <Formik
                initialValues={{ images: [] }}
                validationSchema={validationSchema}
                onSubmit={moveForward}
            >
                {({ setFieldValue }) => (
                    <Form className='w[100%] m-2 text-white'>
                        <div className="w-[100%] flex flex-col gap-2 my-2">
                            <label className="mb-2"><h3><strong>1st</strong></h3></label>
                            <input
                                type="file"
                                name="images"
                                accept="image/*"
                                className="rounded-lg w-[90%] p-2"
                                onChange={(e) => handleChange(e, setFieldValue)}
                            />
                            <ErrorMessage name="images" component="div" className="text-red-500" />
                        </div>
                        <div className="w-[100%] flex flex-col gap-2 my-2">
                            <label className="mb-2"><h3><strong>2nd</strong></h3></label>
                            <input
                                type="file"
                                name="images"
                                placeholder='(Optional)'
                                accept="image/*"
                                className="rounded-lg w-[90%] p-2"
                                onChange={(e) => handleChange(e, setFieldValue)}
                            />
                            <ErrorMessage name="images" component="div" className="text-red-500" />
                        </div>
                        <div className="w-[100%] flex flex-col gap-2 my-2">
                            <label className="mb-2"><h3><strong>3rd</strong></h3></label>
                            <input
                                type="file"
                                name="images"
                                placeholder='(Optional)'
                                accept="image/*"
                                className="rounded-lg w-[90%] p-2"
                                onChange={(e) => handleChange(e, setFieldValue)}
                            />
                            <ErrorMessage name="images" component="div" className="text-red-500" />
                        </div>
                        <div className="w-[100%] flex flex-col gap-2 my-2">
                            <label className="mb-2"><h3><strong>4th</strong></h3></label>
                            <input
                                type="file"
                                name="images"
                                placeholder='(Optional)'
                                accept="image/*"
                                className="rounded-lg w-[90%] p-2"
                                onChange={(e) => handleChange(e, setFieldValue)}
                            />
                            <ErrorMessage name="images" component="div" className="text-red-500" />
                        </div>
                        <button type="submit" className='py-2 px-4 border bg-[#FEBD69] rounded-lg ml-[100%] text-black'><strong>{loading ? <BigLoader/> : "finish"}</strong></button>
                    </Form>
                )}
            </Formik>
        </div>
       </div>
    );
};

export default Productimages;
