import React from 'react';
import "./PageNotFound.css";
import { useNavigate } from 'react-router-dom';

const PageNotFound = () => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(-1, { replace: true });
    }
    return (
        <div className='container-fluid bg-dark'>
        <div className='d-flex justify-content-center align-items-center' style={{ height: "100vh" }}>
            <div >
                <h1 className='text-center text-white pageNotFoundCode'>4<span style={{ color: "red" }}>0</span>4</h1>
                <h5 className='text-center text-white'>Page Not Found!</h5>
                <div className='d-flex justify-content-center'>
                    <button className='btn' style={{ backgroundColor: "white", fontWeight: "600" }} onClick={handleClick}>Back to previous page</button>
                </div>
            </div>
        </div>
    </div>
    );
};

export default PageNotFound;