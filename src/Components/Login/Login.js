import React, { useContext, useEffect, useState } from 'react';
import "./Login.css";
import { SharedData } from '../SharedData/SharedContext';
import { toast } from 'react-hot-toast';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import useToken from '../CustomHook/useToken';
import ClockLoader from 'react-spinners/ClockLoader';
import useTitle from '../CustomHook/useTitle';

const Login = () => {
    useTitle("Login- E-Buy");
    const [showPassword, setShowPassword] = useState(false);
    const { googleLogin, login, user } = useContext(SharedData);
    const [buttonLoading, setButtonLoading]= useState(false);
    const [token] = useToken(user?.email);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';
    useEffect(() => {
        if (token) {
            navigate(from, { replace: true });
        }
    }, [token])
    const handleGoogle = () => {
        googleLogin()
            .then(result => {
                console.log(result.user)
            })
            .catch(error => {
                toast.error(error.message);
            })
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        setButtonLoading(true);
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;
        login(email, password)
            .then((result) => {
                const user = result.user;
                setButtonLoading(false);
            })
            .catch(error => {
                toast.error(error.message.split('/')[1].split(')')[0]);
                setButtonLoading(false);
            });

    }

    return (
        <div className='container-fluid login'>
            <div className="card">
                <div className="card-body">
                    <h2 className='text-center'>Login</h2>
                    <form className='form mt-4' onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className='input-label mb-1'>Email:</label>
                            <div className="input-group">
                                <i className='bi bi-envelope-at-fill input-group-text'></i>
                                <input type="email" name='email' placeholder='Enter your email' className='form-control border border-start-0' required />
                            </div>
                        </div>
                        <div className='mt-3'>
                            <label htmlFor="email" className='input-label mb-1'>Password:</label>
                            <div className="input-group">
                                <i className='bi bi-key input-group-text'></i>
                                <input type={showPassword ? "text" : "password"} name='password' placeholder='Enter your password' className='form-control border border-start-0 border-end-0' required />
                                <i className={`bi ${showPassword ? "bi-eye" : "bi-eye-slash"} input-group-text bg-white`} onClick={() => setShowPassword(!showPassword)}></i>
                            </div>
                        </div>
                        <div className='d-flex justify-content-end'>
                            <p className='text-primary text-decoration-underline' style={{ cursor: "pointer" }} onClick={() => navigate('/forgetPassword', { replace: true })}>Forget Password?</p>
                        </div>
                        <div className='mt-3'>
                            <button type='submit' className='btn btn-dark w-100 d-flex justify-content-center'>{buttonLoading? <ClockLoader size={24} color='white' />: "Login"}</button>
                        </div>
                    </form>
                    <div className='mt-2 d-flex justify-content-evenly'>
                        <hr className='w-100' />
                        <h4 className='ms-1 me-1'>OR</h4>
                        <hr className='w-100' />
                    </div>
                    <div className='mt-2'>
                        <button className='btn btn-outline-dark w-100 d-flex justify-content-between' onClick={handleGoogle}> <div style={{ height: "28px", width: "28px" }}><img src={`https://i.ibb.co/Y8TSkVN/google-icon.png`} alt="google_icon" className='img-fluid' style={{ height: "100%", width: "100%" }} /></div> <span className='googleButtonText'> Continue with Google</span></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;