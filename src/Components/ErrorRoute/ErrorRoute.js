import React, { useContext } from 'react';
import { useNavigate, useRouteError } from 'react-router-dom';
import { SharedData } from '../SharedData/SharedContext';

const ErrorRoute = () => {
    const error = useRouteError();
    const {user, logout}= useContext(SharedData);
    const navigate = useNavigate();
    const handleLogout=()=>{
        logout()
        navigate('/login');
    }
    console.log(error);
    return (
        <div className='container-fluid'>
            <div className="row">
                <div className="col-12 col-md-12 col-lg-12">
                    <div>
                        <p className='text-center'>Something Went Wrong! Please <span className='text-primary' onClick={handleLogout}>Logout</span> and login again. </p>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ErrorRoute;