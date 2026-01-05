import React from "react";
import { MdCancel } from "react-icons/md";
import { Categories } from "../../Constants/Universities";

export const Categoriesmodal = ({ fetchCategories, closeModal, setPageNumber }) => {
    let universities = JSON.parse(localStorage.getItem("universities"));
    const SAMPLE_API_KEY= `https://campusbuy-backend-nkmx.onrender.com/searchproducts?university=${universities.value}`;
    const ALL_SAMPLE_API_KEY= 'https://campusbuy-backend-nkmx.onrender.com/searchproducts?';
    const moveForward= async(subcategory)=>{
        await fetchCategories(subcategory, `${SAMPLE_API_KEY}&search=${subcategory}`)
        await setPageNumber(1)
        await closeModal()
    }
    const allMoveForward= async(subcategory)=>{
        await fetchCategories(subcategory, `${ALL_SAMPLE_API_KEY}search=${subcategory}`)
        await setPageNumber(1)
        await closeModal()
    }

    return (
        <div className="w-[100%] h-[500px] flex pb-2 flex-col justify-center items-center gap-2 bg-white max-lg:text-[10px] relative rounded-lg border-2 border-black overflow-hidden">
            <div className='w-[100%] rounded-lg text-center text-xl text-black text-bold bg-[#FEBD69] p-[1rem]'>
                <MdCancel onClick={closeModal} className='w-[25px] h-[25px] ml-[90%]' />
            </div>
                            <div className='h-full overflow-auto flex flex-wrap gap-[1rem] justify-center items-start p-2'>
                    {Categories.map((category, categoryIndex) => (
                        <aside key={categoryIndex} className='flex flex-col justify-center items-start text-[#FEBD69]'>
                            <details>
                            <summary><strong className='text-[15px] my-2 max-lg:text-[12px]'>{category.name}</strong></summary>
                            {category.items.map((subcategory, subcategoryIndex) => (
                                <div key={subcategoryIndex} className='flex flex-col gap-2 justify-center items-center text-black'
                                onClick={()=> {universities.value === "All Universities" ? allMoveForward(subcategory) : moveForward(subcategory)}}>
                                    <p className='text-[12px] max-lg:text-[10px]'>{subcategory}</p>
                                </div>
                            ))}
                        </details>
                        </aside>
                    ))}
                </div>
        </div>
    );
};
export const Createproductscategoriesmodal = ({ setCategory, closeModal }) => {
    
    const moveForward= async(subcategory)=>{
        await setCategory({ value: subcategory, label: subcategory });
        await closeModal();
    };
    

    return (
        <div className="w-[100%] h-[500px] flex pb-2 flex-col justify-center items-center gap-2 bg-[#282828] max-lg:text-[10px] relative rounded-lg border-2 border-black overflow-hidden">
            <div className='w-[100%] rounded-lg text-center text-xl text-black text-bold bg-[#FEBD69] p-[1rem]'>
                <MdCancel onClick={closeModal} className='w-[25px] h-[25px] ml-[90%]' />
            </div>
                            <div className='h-full overflow-auto flex flex-wrap gap-[1rem] justify-center items-start p-2'>
                    {Categories.map((category, categoryIndex) => (
                        <aside key={categoryIndex} className='flex flex-col justify-center items-start text-[#FEBD69]'>
                            <details>
                            <summary><strong className='text-[15px] my-2 max-lg:text-[12px]'>{category.name}</strong></summary>
                            {category.items.map((subcategory, subcategoryIndex) => (
                                <div key={subcategoryIndex} className='flex flex-col gap-2 justify-center items-center text-white'
                                onClick={()=> {moveForward(subcategory)}}>
                                    <p className='text-[12px] max-lg:text-[10px]'>{subcategory}</p>
                                </div>
                            ))}
                        </details>
                        </aside>
                    ))}
                </div>
        </div>
    );
};
