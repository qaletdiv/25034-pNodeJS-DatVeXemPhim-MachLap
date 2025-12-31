import React, { useEffect } from 'react'
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import Header from '../../Component/Header/Header';
import Footer from '../../Component/Footer/Footer';


const CommonPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    console.log(location);

    useEffect(() => {
        if (location.pathname === "/") {
            // return 
            navigate("/home");
        }
    }, [location.pathname])

    return (
        <div>
            <Header />
            <Outlet></Outlet>
            <Footer />
        </div>
    )
}

export default CommonPage
