import React, { useContext, useState } from 'react';
import "./forgetPassword.css";
import ClockLoader from "react-spinners/ClockLoader";
import { SharedData } from '../SharedData/SharedContext';
import { toast } from 'react-hot-toast';

const ForgetPassword = () => {
    const [buttonLoading, setButtonLoading] = useState(false);
    const { passwordReset, user } = useContext(SharedData);

    const handleSubmit = (e) => {
        e.preventDefault();
        setButtonLoading(true);
        const email = e.target.email.value;
        passwordReset(email)
        .then(()=>{
            toast.success("Reset email sent");
            setButtonLoading(false);
        })
        .catch(error=>{
            toast.error(error.message.split('/')[1].split(')')[0]);
            setButtonLoading(false);
        })
    }

    return (
        <div className='container-fluid forgetPassword'>
            <div className="card">
                <div className="card-header bg-success">
                    <h2 className='text-center ps-4 pe-4 text-white'>Recover your password</h2>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div>
                            <div className='input-group'>
                                <i className='input-group-text bi bi-envelope-at-fill'></i>
                                <input type="email" className='form-control p-2' name='email' placeholder='Enter your remembered email' />
                            </div>
                        </div>
                        <div className='mt-3'>
                            <button className='btn btn-success w-100 d-flex justify-content-center'>{buttonLoading ? <ClockLoader size={24} color='white' /> : "Send reset email"}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgetPassword;