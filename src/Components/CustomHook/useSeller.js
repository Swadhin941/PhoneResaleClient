import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

const useSeller = (email) => {
    const [isSeller, setIsSeller]= useState(false);
    const [sellerLoading, setSellerLoading]= useState(true);
    useEffect(()=>{
        if(email){
            fetch(`${process.env.REACT_APP_SERVER}/sellerCheck/${email}`)
            .then(res=> res.json())
            .then(data=>{
                setIsSeller(data.isSeller);
                setSellerLoading(false)
            })
            .catch(error=>{
                toast.error(error.message);
                setSellerLoading(false);
            });
        }
        if(!email){
            setSellerLoading(false);
        }
    },[email])
    return [isSeller, sellerLoading];
};

export default useSeller;