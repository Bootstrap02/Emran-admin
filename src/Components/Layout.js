import React, {useState} from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
    const [nav, setNav] = useState(false);

    const openNav = ()=>{
      setNav(true)
    }
    const closeNav = ()=>{
      setNav(false)
    }
  return (
    <>
    <Header  openNav={openNav} closeNav={closeNav} nav={nav}/>
    <Outlet/>
    <Footer/>
    </>
  )
}

export default Layout