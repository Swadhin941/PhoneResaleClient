import React, { useContext, useState } from 'react';
import { SharedData } from '../SharedData/SharedContext';
import useSeller from '../CustomHook/useSeller';
import Spinner from '../Spinner/Spinner';
import { Navigate, useLocation } from 'react-router-dom';

const SellerRoute = ({ children }) => {
    const { user, loading, logout } = useContext(SharedData);
    const [isSeller, sellerLoading] = useSeller(user?.email);
    const location = useLocation();
    if (loading || sellerLoading) {
        return <Spinner></Spinner>;
    }

    if (user && isSeller) {
        return children;
    }
    logout()
    return <Navigate to={'/login'} state={{ from: location }} replace></Navigate>

};

export default SellerRoute;