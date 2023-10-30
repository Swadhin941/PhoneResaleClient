import React, { useContext, useEffect, useState } from 'react';
import { SharedData } from '../SharedData/SharedContext';
import useSeller from '../CustomHook/useSeller';
import Spinner from '../Spinner/Spinner';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

const SellerRoute = ({ children }) => {
    const { user, loading, logout } = useContext(SharedData);
    const [isSeller, sellerLoading] = useSeller(user?.email);
    const location = useLocation();
    console.log(sellerLoading, isSeller);
    useEffect(()=>{
        if(!sellerLoading && !isSeller){
            logout()
        }
    },[isSeller, sellerLoading])
    if (loading || sellerLoading) {
        return <Spinner></Spinner>;
    }
    if (user && isSeller) {
        return children;
    }
    return <Navigate to={'/login'} state={{ from: location }} replace></Navigate>
};

export default SellerRoute;