import React, { useEffect } from 'react';
import "./PaymentFail.css";
import { useNavigate, useSearchParams } from 'react-router-dom';
import Spinner from '../Spinner/Spinner';

const PaymentFail = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    useEffect(() => {
        if (!searchParams.get('trxID') && !searchParams.get('loop')) {
            navigate(-1);
        }
    }, [])

    
    if (!searchParams.get('trxID') && !searchParams.get('loop')) {
        return <Spinner></Spinner>
    }
    const handleClick = () => {
        navigate(-1, { replace: true });
    }
    return (
        <div className='container-fluid paymentFail'>
            <div>
                <div className='d-flex'>
                    <div>
                        <i className='bi bi-exclamation-triangle iconImage'></i>
                    </div>
                    <div>
                        <h5 className='errorText'>Oops! Something went wrong</h5>
                        <small className='mt-0 ms-3 errorExp'>While trying to reserve money from your account</small>
                    </div>

                </div>
                <div>
                    <button className='btn btn-warning w-100' onClick={handleClick}>Try Again</button>
                </div>
            </div>
        </div>
    );
};

export default PaymentFail;