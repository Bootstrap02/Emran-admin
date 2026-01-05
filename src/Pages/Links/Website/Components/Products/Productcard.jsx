import React from "react";
import { useNavigate } from "react-router-dom";
import Images from "../Constant/Images";
import { TbCurrencyNaira } from "react-icons/tb";

const truncateDescription = (description, wordLimit) => {
  if (!description) return "";
  const words = description.split(" ");
  return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "..." : description;
};

export const Productcard = ({data}) => {
  const navigate = useNavigate();

  const moveForward = async(product, id) => {
    await localStorage.setItem('productpages', JSON.stringify(product));
    await navigate(`/webproductpage/${id}`);
  };
  return (
    <div className="container flex  flex-wrap items-center justify-center ">
      {data.products.map((product) => {
        const truncatedDescription = truncateDescription(product.description, 10); // Ensure truncation
        return (
          <div key={product._id} className="w-[40%]">
            {/* Large Screen */}
            <div className="flex ">
              <div
                onClick={() => moveForward(product, product.title)}
                className=" flex m-3"
              >
                <div className="card p-2 justify-center items-center bg-[#222121]">
                  <div onClick={() => moveForward(product, product.title)} className="flex">
                    <div className="w-[60%]"><img src={product.images[0]} className="card-img-top" alt="Product" /></div>
                    <div className="text-sm text-white bg-[#222121]">
                      <div className="flex my-1 justify-between items-center">
                        {product.title && (
                          <div className="product-price flex gap-1 items-center font-bold text-[#FFD700]">
                            <TbCurrencyNaira style={{width: 30, height: 30}} />
                            <h3 className="card-price-text text-lg">{product.price}</h3>
                          </div>
                        )}
                      </div>
                      <h5 className="card-title m-2">
                        <strong>{product.title}</strong>
                      </h5>
                      <h6 className="text-[#cfcfc7] m-2">{truncatedDescription}</h6>
                      <strong className="text-[#cfcfc7]">{product.location}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>            
          </div>
        );
      })}
    </div>
  );
};


export const Mobileproductcard = ({data}) => {
  const navigate = useNavigate();

  const moveForward = async(product, title) => {
    await localStorage.setItem('productpages', JSON.stringify(product));
    await navigate(`/webproductpage/${title}`);
  };

  return (
    <div className="container flex  flex-wrap items-center justify-center">
      {data.products.map((product) => {
        const truncatedDescription = truncateDescription(product.description, 10); // Ensure truncation
        return (
          <div key={product._id} className="w-[50%]">
            {/* Large Screen */}
            <div className="">
              <div
                onClick={() => moveForward(product, product.title)}
                className=" m-1 "
              >
                <div className="card p-2 justify-center items-center bg-[#222121]">
                  <div onClick={() => moveForward(product, product.title)} className="bg-[#222121]">
                  <div className=""><img src={product.images[0]} className="card-img-top" alt="Product" /></div>
                  <div className="w-full text-[9px] text-white bg-[#222121]">
                      <div className="flex my-1 justify-between">
                        <div className="product-price flex gap-1 items-center w-full font-bold text-[#FFD700]">
                          <TbCurrencyNaira style={{width: 30, height: 30}} />
                          <h3 className="card-price-text">{product.price}</h3>
                        </div>
                      </div>
                      <h5 className="card-title">
                        <strong>{product.title}</strong>
                      </h5>
                      <div className="flex my-1 justify-between text-[#cfcfc7]">
                        <strong className="card-brand">{product.location}</strong>
                      </div>
                      <h6 className="text-[#cfcfc7]">{truncatedDescription}</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            
          </div>
        );
      })}
    </div>
  );
};
