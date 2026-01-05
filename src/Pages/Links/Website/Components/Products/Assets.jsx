import React from "react";
import {Productcard, Mobileproductcard } from "./Productcard";
import Navbar from "./Navbar";

const Assets = ({data}) => {

  return (
    <div className=" text-white">
      <div className="">
      <div className="max-lg:hidden">
      <Productcard data={data} />
      </div>
      <div className="hidden max-lg:block">
        <Mobileproductcard data={data}/>
      </div>
      </div>
      
    </div>
  );
};

export default Assets;
