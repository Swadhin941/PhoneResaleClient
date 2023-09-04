import React, { useContext, useEffect, useState } from 'react';
import "./Register.css";
import { SharedData } from '../SharedData/SharedContext';
import useToken from '../CustomHook/useToken';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import ClockLoader from 'react-spinners/ClockLoader';
import useTitle from '../CustomHook/useTitle';

const Register = () => {
    useTitle("Register- E-Buy");
    const [showPassword, setShowPassword] = useState(false);
    const [buttonLoading, setButtonLoading]= useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('')
    const [passwordAcceptance, setPasswordAcceptance] = useState(false)
    const { createAccount, user, setUser, updateName, verifyEmail } = useContext(SharedData);
    const [emailValue, setEmailValue] = useState(null);
    const [token] = useToken(emailValue?.email);
    // console.log("form email value",emailValue);
    // // console.log(token);
    const navigate = useNavigate();
    useEffect(() => {
        if (token) {
            navigate('/');
        }
    }, [token])
    const handlePassword = (e) => {
        const data = e.target.value;
        if (data.length < 6) {
            setPasswordAcceptance(false);
            setPasswordError("Password Must be 6 character long or more");
            return;
        }
        if (!/(?=.*[!@&$#])/.test(data)) {
            setPasswordAcceptance(false);
            setPasswordError("Password should contains a !,@,$,& or #");
            return;
        }
        if (/(?=.*[\s])/.test(data)) {
            setPasswordAcceptance(false);
            setPasswordError("Password should not contains a space");
            return;
        }
        setPasswordError('');
        setPasswordAcceptance(true);
    }

    const handleSubmit = e => {
        e.preventDefault();
        setButtonLoading(true);
        const form = e.target;
        if (form.confirmPassword.value !== form.password.value) {
            setConfirmPasswordError("Password is not matching");
            setButtonLoading(false);
            return;
        }
        setConfirmPasswordError('');
        createAccount(form.email.value, form.password.value)
            .then((result) => {

                updateName(form.fullName.value)
                    .then(() => {
                        verifyEmail()
                            .then(() => {
                                toast.success("An mail has been sent to your email account")
                                fetch(`https://phone-resale-server-swadhin941.vercel.app/user`, {
                                    method: "POST",
                                    headers: {
                                        "content-type": "application/json"
                                    },
                                    body: JSON.stringify({ email: form.email.value, fullName: form.fullName.value, role: form.accountType.value })
                                })
                                    .then(res => res.json())
                                    .then(data => {
                                        if (data.acknowledged) {
                                            setEmailValue(user);
                                            setButtonLoading(false);
                                        }

                                    })
                                    .catch(error => {
                                        toast.error(error.message);
                                        setButtonLoading(false);
                                        //unset the user from the state
                                    })
                            })
                            .catch(error=>{
                                toast.error(error.message);
                                setButtonLoading(false);
                            })

                    })
                    .catch(error => {
                        toast.error(error.message);
                        setButtonLoading(false);
                    })

            })
            .catch(error => {
                toast.error(error.message.split('/')[1].split(')')[0])
            })
    }
    return (
        <div className='container-fluid register'>
            <div className="card">
                <div className="card-body">
                    <h2 className='text-center'>Sign up</h2>
                    <form className='form mt-3' onSubmit={handleSubmit}>
                        <div >
                            <label htmlFor="fullName" className='input-label mb-1'>Full Name:</label>
                            <div className="input-group">
                                <i className='bi bi-person input-group-text'></i>
                                <input type="text" name='fullName' placeholder='Enter your full name' className='form-control border border-start-0' required />
                            </div>
                        </div>
                        <div className='mt-3'>
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
                                <input type={showPassword ? "text" : "password"} name='password' placeholder='Enter your password' className='form-control border border-start-0' onChange={handlePassword} required />
                            </div>
                            {passwordError && <p className='text-danger'><small>{passwordError}</small></p>}
                        </div>
                        <div className='mt-3'>
                            <label htmlFor="confirmPassword" className='input-label mb-1'>Confirm Password:</label>
                            <div className="input-group">
                                <i className='bi bi-key input-group-text'></i>
                                <input type={showPassword ? "text" : "password"} name='confirmPassword' placeholder='Confirm your password' className='form-control border border-start-0' required disabled={passwordAcceptance ? false : true} />
                            </div>
                            {confirmPasswordError && <p className='text-danger'><small>{confirmPasswordError}</small></p>}
                        </div>
                        <div className='mt-3'>
                            <input type="checkbox" name='checkbox' className='form-check-input' onClick={() => setShowPassword(!showPassword)} />
                            <span className='ms-2'>{showPassword ? "Hide password" : "Show password"}</span>
                        </div>
                        <div className='mt-3'>
                            Select account type: <select name="accountType" id="accountType" className='form-select' defaultValue={'buyer'}>
                                <option value="buyer" defaultChecked>Buyer</option>
                                <option value="seller">Seller</option>
                            </select>
                        </div>
                        <div className='mt-4'>
                            <button type='submit' className='btn btn-dark d-flex justify-content-center  w-100'>{buttonLoading? <ClockLoader size={24} color='white'/>:'Register'}</button>
                        </div>
                    </form>
                    <div className='mt-2 d-flex justify-content-center'>
                        <Link to={'/login'} className='text-primary'>Already have a account?</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;