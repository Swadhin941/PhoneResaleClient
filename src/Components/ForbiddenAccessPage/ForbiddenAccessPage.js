import React from 'react';
import "./ForbiddenAccessPage.css";
import { useNavigate } from 'react-router-dom';

const ForbiddenAccessPage = () => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(-1, { replace: true });
    }
    return (
        <div className='container-fluid bg-dark'>
        <div className='d-flex justify-content-center align-items-center' style={{ height: "100vh" }}>
            <div >
                <h1 className='text-center text-white forbiddenCode'>4<span style={{ color: "red" }}>0</span>3</h1>
                <h5 className='text-center text-white'>Forbidden Access!</h5>
                <div className='d-flex justify-content-center'>
                    <button className='btn' style={{ backgroundColor: "white", fontWeight: "600" }} onClick={handleClick}>Back to previous page</button>
                </div>
            </div>
        </div>
    </div>
    );
};

export default ForbiddenAccessPage;