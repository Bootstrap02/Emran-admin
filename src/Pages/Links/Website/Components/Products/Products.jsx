import React from "react";
import Assets from "./Assets";
import { Link } from "react-router-dom";

const Products = ({data}) => {
  return (
    <div id="products" className="text-white bg-[#282828]">
      <div className="p-4 max-lg:hidden">
          <h2 className="text-2xl  font-bold">Our Products</h2>
        <div >
          <Assets data={data} />
        </div>
      </div>
      <div className="hidden max-lg:block p-2">
          <h2 className="text-2xl  font-bold p-2">Our Products</h2>
        <div >
          <Assets data={data} />
        </div>
      </div>
    </div>
  );
};

export default Products;
