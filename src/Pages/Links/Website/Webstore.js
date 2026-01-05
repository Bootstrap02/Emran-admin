import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Home from "./Components/Home/Home";
import Navbar from "./Components/Navbar/Navbar";
import Products from "./Components/Products/Products";
import Footer from "../../../Components/Footer";

const Webstore = () => {
  const { webname } = useParams(); // extract the webname param from the URL
  const [websiteData, setWebsiteData] = useState(null);
  const [productsData, setProductsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const GET_WEBSITE = "https://campusbuy-backend-nkmx.onrender.com/getwebsite";
  const GET_MYSTORE_API_KEY = 'https://campusbuy-backend-nkmx.onrender.com/getmystore';

  useEffect(() => {
    const fetchWebsiteData = async () => {
      try {
        const response = await axios.get(`${GET_WEBSITE}/${webname}`);
        setWebsiteData(response.data);
        const sellerStore = await axios.get(`${GET_MYSTORE_API_KEY}/${response.data._id}`);  
        setProductsData(sellerStore.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch website data:", err);
        setError("Unable to load website data.");
        setLoading(false);
      }
    };

    if (webname) {
      fetchWebsiteData();
    }
  }, [webname]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <Navbar data={websiteData} />
      <div id="home">
        <Home data={websiteData} />
      </div>
      <div id="products">
        <Products data={productsData} />
      </div>
      <Footer/>
    </div>
  );
};

export default Webstore;
