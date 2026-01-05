import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 
import Select from 'react-select';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Createproductscategoriesmodal } from '../../../Modals/General/Categories';
const Productstatus = ({ setActiveComponent }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const productStore = useSelector((state) => state.editProduct.editProduct);
    const storedUserData = JSON.parse(localStorage.getItem('userData'));  
    const [category, setCategory] = useState(null);
    const [categories, setCategories] = useState(false);
    const [condition, setCondition] = useState(null);
    const [person, setPerson] = useState(null);

    const openCategories = ()=>{
        setCategories(true)
    };
    const closeCategories = ()=>{
        setCategories(false)
    };

    useEffect(() => {
        if (productStore) {
            setCategory(
                productStore.category 
                    ? { value: productStore.category, label: productStore.category } 
                    : category
            );
            setCondition(productStore.condition 
                    ? { value: productStore.condition, label: productStore.condition } 
                    : condition
            );
            setPerson(productStore.person 
                    ? { value: productStore.person, label: productStore.person } 
                    : person
            );
        }
    }, [productStore, category, condition, person]);

    const validationSchema = Yup.object().shape({
        category: Yup.object().required('Category is required'),
        condition: Yup.object().required('Condition is required'),
        person: Yup.object().required('Status is required'),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        if (storedUserData && storedUserData.accessToken) {
            dispatch({ type: 'EDIT_PRODUCT_CATEGORY', productCategory: values.category.value });
            dispatch({ type: 'EDIT_PRODUCT_CONDITION', productCondition: values.condition.value });
            dispatch({ type: 'EDIT_PRODUCT_PERSON', productPerson: values.person.value });

            setActiveComponent('Contactinformation');
        }
        setSubmitting(false);
    };

    const conditionOptions = [
        { value: 'new', label: 'New' },
        { value: 'refurbished', label: 'Refurbished' },
        { value: 'used', label: 'Used' },
    ];
    const personOptions = [
        { value: 'individual', label: 'Individual' },
        { value: 'store', label: 'Store' },
        { value: 'company', label: 'Company' },
    ];

    return (
        <div>
 <div className='max-lg:hidden'>
            <strong className='text-bold my-[1.5rem] text-xl text-white'>Input Product Status</strong>
            <div className='text-[13px] text-[#40EF14] my-4'>
                <strong>Please Click<span className ='text-[#FEBD69]'> Next</span> when you fill the form to save your product details and proceed to the next page</strong>
            </div>
            <Formik
    initialValues={{
        category: category,
        condition: condition,
        person: person,
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

                            <div className='w-[100%] flex flex-col gap-2 my-2'>
                                <div className="input-group-prepend">
                                    <label className="mb-2" htmlFor="inputGroupSelect01"><strong>Condition</strong></label>
                                </div>
                                <Select
                                    name='condition'
                                    className="form-control p-2 m-2 border max-lg:m-0 max-lg:p-0 border-gray-400"
                                    value={values.condition}
                                    onChange={(option) => setFieldValue('condition', option)}
                                    options={conditionOptions}
                                    placeholder='Product condition'
                                    isClearable
                                />
                                <ErrorMessage name="condition" component="div" className="text-red-500" />
                            </div>

                            <div className='w-[100%] flex flex-col gap-2 my-2'>
                                <div className="input-group-prepend">
                                    <label className="mb-2" htmlFor="inputGroupSelect01"><strong>Status</strong></label>
                                </div>
                                <Select
                                    name='person'
                                    className="form-control p-2 m-2 border max-lg:m-0 max-lg:p-0 border-gray-400"
                                    value={values.person}
                                    onChange={(option) => setFieldValue('person', option)}
                                    options={personOptions}
                                    placeholder='Seller Status'
                                    isClearable
                                />
                                <ErrorMessage name="person" component="div" className="text-red-500" />
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
        <div className='hidden max-lg:block pb-[12rem]'>
            <strong className='text-bold my-[0.5rem] text-md text-white'>Input Product Status</strong>
            <div className='text-[8px] text-[#40EF14] my-2'>
                <strong>Please Click<span className ='text-[#FEBD69]'> Next</span> when you fill the form to save your product details and proceed to the next page</strong>
            </div>
            <Formik
    initialValues={{
        category: category,
        condition: condition,
        person: person,
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

                            <div className='w-[100%] flex flex-col gap-2 my-2'>
                                <div className="input-group-prepend">
                                    <label className="mb-2" htmlFor="inputGroupSelect01"><strong>Condition</strong></label>
                                </div>
                                <Select
                                    name='condition'
                                    className="form-control  border border-gray-400"
                                    value={values.condition}
                                    onChange={(option) => setFieldValue('condition', option)}
                                    options={conditionOptions}
                                    placeholder='Product condition'
                                    isClearable
                                />
                                <ErrorMessage name="condition" component="div" className="text-red-500" />
                            </div>

                            <div className='w-[100%] flex flex-col gap-2 my-2'>
                                <div className="input-group-prepend">
                                    <label className="mb-2" htmlFor="inputGroupSelect01"><strong>Status</strong></label>
                                </div>
                                <Select
                                    name='person'
                                    className="form-control  border border-gray-400"
                                    value={values.person}
                                    onChange={(option) => setFieldValue('person', option)}
                                    options={personOptions}
                                    placeholder='Seller Status'
                                    isClearable
                                />
                                <ErrorMessage name="person" component="div" className="text-red-500" />
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

export default Productstatus;
