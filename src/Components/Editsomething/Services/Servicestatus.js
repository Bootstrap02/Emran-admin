import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 
import Select from 'react-select';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Createproductscategoriesmodal } from '../../../Modals/General/Categories';

const Servicestatus = ({ setActiveComponent }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const serviceStore =  useSelector((state) => state.editService.editService);
    const storedUserData = JSON.parse(localStorage.getItem('userData'));
    const [category, setCategory] = useState(null);  
    const [categories, setCategories] = useState(false);
    const [duration, setDuration] = useState(null);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        if (serviceStore) {
            setCategory(
                serviceStore.category 
                    ? { value: serviceStore.category, label: serviceStore.category } 
                    : category
            );
            setDuration(serviceStore.duration || '');
            setStatus(serviceStore.status 
                    ? { value: serviceStore.status, label: serviceStore.status } 
                    : status
            );
        }
    }, [serviceStore, category, duration, status]);

    const openCategories = ()=>{
        setCategories(true)
    };
    const closeCategories = ()=>{
        setCategories(false)
    };

    const validationSchema = Yup.object().shape({
        category: Yup.object().required('Category is required'),
        status: Yup.object().required('Status is required'),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        if (storedUserData && storedUserData.accessToken) {
            dispatch({ type: 'EDIT_SERVICE_CATEGORY', serviceCategory: values.category.value });
            dispatch({ type: 'EDIT_SERVICE_DURATION', serviceDuration: values.duration });
            dispatch({ type: 'EDIT_SERVICE_STATUS', serviceStatus: values.status.value });

            setActiveComponent('Contactinformation');
        }
        setSubmitting(false);
    };

    
    const statusOptions = [
        { value: 'Company.Plc', label: 'Company.Plc' },
        { value: 'Company.Ltd', label: 'Company.Ltd' },
        { value: 'Enterprise', label: 'Enterprise' },
        { value: 'Sole Proprietorship', label: 'Sole Proprietorship' },
        { value: 'Basic Services', label: 'Basic Services' },
    ];

return (
    <div>
        <div className='max-lg:hidden'>
        <strong className='text-bold my-[1.5rem] text-xl text-white'>Input Business Status</strong>
        <div className='text-[13px] text-[#40EF14] my-4'>
            <strong>Please Click<span className ='text-[#FEBD69]'> Next</span> when you fill the form to save your service details and proceed to the next page</strong>
        </div>
        <Formik
initialValues={{
    category: category,
    duration: duration,
    status: status,
}}
validationSchema={validationSchema}
onSubmit={handleSubmit}
enableReinitialize
>
{({ setFieldValue, values, isSubmitting }) => (
    <Form className='w[100%] m-4 text-white'>
        <div className="w-[100%] flex flex-col gap-2 my-2 max-lg:flex-col max-lg:gap-4 ">
            <div className='w-[100%] flex flex-col gap-2 my-2'>
                <div className="input-group-prepend">
                    <label className="mb-2" htmlFor="inputGroupSelect01"><strong>Category</strong></label>
                </div>
                <Field name="category">
                    {({ field, form }) => (
                        <div className='flex w-[100%]'>
                            <input
                                type="text"
                                {...field}
                                className="rounded-sm text-black w-[80%] p-2"
                                value={field.value ? field.value.label : ''}
                                placeholder="Select Category"
                                disabled
                            />
                            <button
                                type="button"
                                className='rounded-sm p-1 bg-[#FEBD69] border'
                                onClick={openCategories}
                            >
                                Select
                            </button>
                        </div>
                    )}
                </Field>
                <ErrorMessage name="category" component="div" className="text-red-500" />
            </div>

                        <div className="w-[100%] flex flex-col gap-2 my-4">
            <label className="mb-2"><h3><strong>Service Duration</strong></h3></label>
            <Field name="duration" className="rounded-lg text-black w-[90%] p-2" type="text" placeholder="How long does yous service take" />
        </div>

                        <div className='w-[100%] flex flex-col gap-2 my-2'>
                            <div className="input-group-prepend">
                                <label className="mb-2" htmlFor="inputGroupSelect01"><strong>Status</strong></label>
                            </div>
                            <Select
                                name='status'
                                className="form-control p-2 m-2 border max-lg:m-0 max-lg:p-0 border-gray-400"
                                value={values.status}
                                onChange={(option) => setFieldValue('status', option)}
                                options={statusOptions}
                                placeholder='Business status'
                                isClearable
                            />
                            <ErrorMessage name="status" component="div" className="text-red-500" />
                        </div>
                    </div>
                    <button type="submit" className='py-2 px-4 border bg-[#FEBD69] rounded-lg ml-[100%] text-black' disabled={isSubmitting}>
                        <strong>Next</strong>
                    </button>
                </Form>
            )}
        </Formik>
        {categories && <div><Createproductscategoriesmodal setCategory={setCategory} closeModal={closeCategories}/></div>}
    </div>
    <div className='container hidden max-lg:block pb-[12rem]'>
        <strong className='text-bold my-[0.5rem] text-md text-white'>Input Business Status</strong>
        <div className='text-[8px] text-[#40EF14] my-2'>
            <strong>Please Click<span className ='text-[#FEBD69]'> Next</span> when you fill the form to save your service details and proceed to the next page</strong>
        </div>
        <Formik
initialValues={{
    category: category,
    duration: duration,
    status: status,
}}
validationSchema={validationSchema}
onSubmit={handleSubmit}
enableReinitialize
>
{({ setFieldValue, values, isSubmitting }) => (
    <Form className='w[100%] m-4 text-white'>
        <div className="w-[100%] flex flex-col gap-2 my-2 max-lg:flex-col max-lg:gap-4 ">
            <div className='w-[100%] flex flex-col gap-2 my-2'>
                <div className="input-group-prepend">
                    <label className="mb-2" htmlFor="inputGroupSelect01"><strong>Category</strong></label>
                </div>
                <Field name="category">
                    {({ field, form }) => (
                        <div className='flex w-[100%]'>
                            <input
                                type="text"
                                {...field}
                                className="rounded-sm text-black w-[80%] p-2"
                                value={field.value ? field.value.label : ''}
                                placeholder="Select Category"
                                disabled
                            />
                            <button
                                type="button"
                                className='rounded-sm p-1 bg-[#FEBD69] border'
                                onClick={openCategories}
                            >
                                Select
                            </button>
                        </div>
                    )}
                </Field>
                <ErrorMessage name="category" component="div" className="text-red-500" />
            </div>
                        <div className="w-[100%] flex flex-col gap-2 my-2">
            <label className="mb-2"><h3><strong>Service Duration</strong></h3></label>
            <Field name="duration" className="rounded-lg text-black w-[90%] p-2" type="text" placeholder="How long does yous service take" />
        </div>

                        <div className='w-[100%] flex flex-col gap-2 my-2'>
                            <div className="input-group-prepend">
                                <label className="mb-2" htmlFor="inputGroupSelect01"><strong>Status</strong></label>
                            </div>
                            <Select
                                name='status'
                                className="form-control border border-gray-400"
                                value={values.status}
                                onChange={(option) => setFieldValue('status', option)}
                                options={statusOptions}
                                placeholder='Business status'
                                isClearable
                            />
                            <ErrorMessage name="status" component="div" className="text-red-500" />
                        </div>
                    </div>
                    <button type="submit" className='py-2 px-4 border bg-[#FEBD69] rounded-lg ml-[100%] text-black' disabled={isSubmitting}>
                        <strong>Next</strong>
                    </button>
                </Form>
            )}
        </Formik>
        {categories && <div  style={{position:'fixed', top:'10%', left:'0', zIndex:'4000',}}><Createproductscategoriesmodal setCategory={setCategory} closeModal={closeCategories}/></div>}
    </div>
    </div>
);
};

export default Servicestatus;


