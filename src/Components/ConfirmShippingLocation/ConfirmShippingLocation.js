import React, { useContext, useEffect, useState } from 'react';
import { SharedData } from '../SharedData/SharedContext';
import ClockLoader from 'react-spinners/ClockLoader';
import { toast } from 'react-hot-toast';

const ConfirmShippingLocation = ({ totalCost, orderDetails }) => {
    const { user, currentPosition, setCurrentPosition } = useContext(SharedData);
    const [locationLoading, setLocationLoading] = useState(false);
    const [geoInfo, setGeoInfo] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneNumberError, setPhoneNumberError] = useState('');
    useEffect(() => {
        if (currentPosition !== null) {
            fetch(`https://us1.locationiq.com/v1/reverse?key=${process.env.REACT_APP_LOCATION_IQ}&lat=${currentPosition.latitude}&lon=${currentPosition.longitude}&format=json`)
                .then(res => res.json())
                .then(data => {
                    setGeoInfo(data);
                })
        }

    }, [currentPosition])

    const handlePhoneNumber = (e) => {
        if (e.target.value.length > 11) {
            setPhoneNumberError("Phone number can't longer than 11 number");
        }
        if (e.target.value.length < 11) {
            setPhoneNumberError("Phone number can't smaller than 11 number");
        }
        if (e.target.value.length === 11) {
            setPhoneNumberError('');
            setPhoneNumber(e.target.value);
        }
        if (e.target.value === '') {
            setPhoneNumberError('');
        }
    }

    const showPosition = (position) => {
        setCurrentPosition({ latitude: position.coords.latitude, longitude: position.coords.longitude })
        setLocationLoading(false);
    }
    const showError = (error) => {
        toast.error(error.message);
        setLocationLoading(false);
    }
    const handleLocation = () => {
        setLocationLoading(true);
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    }

    const handleSubmit = (e)=>{
        e.preventDefault();
        if(phoneNumberError!== ''){
            toast.error("Please complete all details properly");
            return;
        }
        const form= e.target;
        const name= user?.displayName;
        const email= user?.email;
        const city = geoInfo?.address?.city;
        const borough= geoInfo?.address?.borough;
        const postcode = geoInfo?.address?.postcode;
        const contact= phoneNumber;
        const area= form.area.value;
        // console.log(name, email,city, borough, postcode, contact,area);
        orderDetails({Name: name, email, city, borough, postcode, contact, area});
        form.reset();

    }

    return (
        <div className='modal fade' data-bs-keyboard="false" data-bs-backdrop="static" id='confirmShippingLocation'>
            <div className={`modal-dialog ${currentPosition === null && " modal-sm"} modal-dialog-centered modal-dialog-scrollable`}>
                <div className="modal-content">
                    <div className="modal-header" style={{ borderBottom: "0px" }}>
                        <button className='btn btn-close' data-bs-dismiss="modal"></button>
                    </div>
                    <div className="modal-body">
                        {
                            currentPosition === null ? <div className='d-flex justify-content-center'><button className='btn btn-primary d-flex justify-content-center' onClick={handleLocation} style={{ width: "200px" }}>{!locationLoading ? 'Allow Location' : <ClockLoader color='white' size={24} />}</button></div> : <div>
                                <form className='form' onSubmit={handleSubmit}>
                                    <div>
                                        <label htmlFor="name" className='mb-2'>Name:</label>
                                        <div>
                                            <input type="text" className='form-control' name='name' defaultValue={user?.displayName} readOnly style={{ backgroundColor: "#e2e2e2" }} />
                                        </div>
                                    </div>
                                    <div className='mt-2'>
                                        <label htmlFor="email" className='mb-2'>Email:</label>
                                        <div>
                                            <input type="text" className='form-control' name='email' defaultValue={user?.email} readOnly style={{ backgroundColor: "#e2e2e2" }} />
                                        </div>
                                    </div>
                                    <div className='mt-2'>
                                        <label htmlFor="city" className='mb-2'>City:</label>
                                        <div>
                                            <input type="text" className='form-control' name='city' defaultValue={geoInfo?.address?.city} readOnly style={{ backgroundColor: "#e2e2e2" }} />
                                        </div>
                                    </div>
                                    <div className='mt-2'>
                                        <label htmlFor="borough" className='mb-2'>Borough:</label>
                                        <div>
                                            <input type="text" className='form-control' name='borough' defaultValue={geoInfo?.address?.borough} readOnly style={{ backgroundColor: "#e2e2e2" }} />
                                        </div>
                                    </div>
                                    <div className='mt-2'>
                                        <label htmlFor="postCode" className='mb-2'>Post-code:</label>
                                        <div>
                                            <input type="text" className='form-control' name='postCode' defaultValue={geoInfo?.address?.postcode} readOnly style={{ backgroundColor: "#e2e2e2" }} />
                                        </div>
                                    </div>
                                    <div className='mt-2'>
                                        <label htmlFor="contactNumber" className='mb-2'>Contact Number:</label>
                                        <div className='input-group'>
                                            <span className='input-group-text'>88</span>
                                            <input type="text" className='form-control' name='contactNumber' placeholder='Enter your contact number' onChange={handlePhoneNumber} style={{ borderLeft: "0px" }}  required/>
                                        </div>
                                        {phoneNumberError.length !== 0 && <small className='text-danger'><p>{phoneNumberError}</p></small>}
                                    </div>
                                    <div className='mt-1'>
                                        <label htmlFor="Area" className='mb-2'>Area:</label>
                                        <div>
                                            <input type="text" className='form-control' name='area' placeholder='Enter your road number and House number' required/>
                                        </div>
                                    </div>
                                    <div className='d-flex justify-content-center mt-3'>
                                        <button className='btn btn-primary' data-bs-dismiss="modal">Pay { totalCost } taka</button>
                                    </div>
                                </form>
                            </div>
                        }
                    </div>
                    {
                        currentPosition === null && <div className="modal-footer" style={{ borderTop: "0px" }}>

                        </div>
                    }

                </div>
            </div>
        </div>
    );
};

export default ConfirmShippingLocation;