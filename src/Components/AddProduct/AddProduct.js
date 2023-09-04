import React, { useContext, useEffect, useState } from 'react';
import { SharedData } from '../SharedData/SharedContext';
import { toast } from 'react-hot-toast';
import "./AddProduct.css";
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import ClockLoader from 'react-spinners/ClockLoader';
import MarkerCustom from './MarkerCustom/MarkerCustom';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import useTitle from '../CustomHook/useTitle';

const AddProduct = () => {
    useTitle("Add product- E-Buy");
    const [brandName, setBrandName] = useState([]);
    const [selectedBrandState, setSelectedBrandState] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState('');
    const [modelName, setModelName] = useState([]);
    const condition = ['Excellent', "Good", "Fair",];
    const [selectedModelNameState, setSelectedModelNameState] = useState(false);
    const { logout, user } = useContext(SharedData);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const arrayForMap = [...Array(20).keys()];
    const genuine = ['Original', "Master copy"];
    const [currentPosition, setCurrentPosition] = useState(null);
    const [locationInfo, setLocationInfo] = useState(null);
    const [locationLoading, setLocationLoading] = useState(false);
    const [uploadPicture, setUploadPicture] = useState(null);
    const [uploadPictureError, setUploadPictureError] = useState('');
    const [locationState, setLocationState] = useState(false);
    const [phoneNumberValidation, setPhoneNumberValidation] = useState('');
    const [quantityError, setQuantityError] = useState('')
    const navigate = useNavigate();

    const handlePictureChange = (e) => {
        const checkImage = e.target.files[0].type.split('/')[0];
        const checkType = e.target.files[0].type.split('/')[1];
        if (checkImage !== 'image') {
            setUploadPictureError("Only image can be accepted");
            return;
        }
        if (checkType !== 'jpeg' || checkType !== 'jpg' || checkType !== 'png') {
            setUploadPictureError("Image must be in jpg, jpeg or png format");
        }
        setUploadPicture(URL.createObjectURL(e.target.files[0]));
        setUploadPictureError('');
    }


    useEffect(() => {
        if (user) {
            fetch(`https://phone-resale-server-swadhin941.vercel.app/brandName?user=${user?.email}`, {
                method: "GET",
                headers: {
                    authorization: `bearer ${localStorage.getItem('token')}`
                }
            })
                .then(res => {
                    if (res.status === 401) {
                        logout()
                        navigate('/login')
                    }
                    if (res.status === 403) {
                        navigate('/forbidden')
                    }
                    return res.json();
                })
                .then(data => {
                    // console.log(data);
                    setBrandName(data);
                })
                .catch(error => {
                    toast.error(error.message);
                })
        }
    }, [])
    const handleSelectedBrand = (e) => {
        if (e.target.value !== 'default') {
            setSelectedBrand(e.target.value);
            setSelectedBrandState(true);
        }
    }

    useEffect(() => {
        if (selectedBrandState) {
            fetch(`https://phone-resale-server-swadhin941.vercel.app/modelName/${selectedBrand}`, {
                method: "GET",
                headers: {
                    authorization: `bearer ${localStorage.getItem('token')}`
                }
            })
                .then(res => {
                    if (res.status === 401) {
                        logout()
                        navigate('/login')
                    }
                    if (res.status === 403) {
                        navigate('/forbidden')
                    }
                    return res.json()
                })
                .then(data => {
                    setModelName(data);
                })
                .catch(error => {
                    toast.error(error.message);
                })
        }
    }, [selectedBrandState, selectedBrand])

    const handleSelectedModel = (e) => {
        if (e.target.value !== 'default' || e.target.value !== 'none') {
            setSelectedModelNameState(true);
        }
    }

    const showPosition = (position) => {
        setCurrentPosition({ latitude: position.coords.latitude, longitude: position.coords.longitude })
        setLocationState(true);
        setLocationLoading(false);
    }

    const locationError = (error) => {
        toast.error(error.message)
        setLocationState(false);
        setLocationLoading(false);
    }

    const handleLocation = () => {
        setLocationLoading(true);
        navigator.geolocation.getCurrentPosition(showPosition, locationError);
    }
    const handlePhoneNumber = e => {
        const phoneNumber = e.target.value;
        if (phoneNumber === '') {
            setPhoneNumberValidation('');
        }
        if (/(?=.*[^0-9])/.test(phoneNumber)) {
            setPhoneNumberValidation('Enter a valid Phone number');
            return;
        }
        if (phoneNumber.length !== 11 && phoneNumber !== '') {
            setPhoneNumberValidation("Must be in 11 character");
            return;
        }
        setPhoneNumberValidation('');
    }

    const handleQuantity = (e) => {
        const data = e.target.value;
        if (data < 1) {
            setQuantityError("Quantity can't less than one");
            return;
        }
        setQuantityError('');
    }

    const handleSubmit = e => {
        e.preventDefault();
        const form = e.target;
        if (form.edition.value === 'default' || form.brandName.value === 'default' || form.modelName.value === 'default' || form.modelName.value === 'none' || form.condition.value === 'default' || form.condition.value === "none" || form.genuine.value === "default") {
            toast.error("Please fill up all the requirements");
            return;
        }
        if (!locationState) {
            toast.error("Please select your location");
            return;
        }
        if (uploadPictureError.length !== 0) {
            toast.error("Please upload a valid image");
            return;
        }
        if (phoneNumberValidation.length !== 0) {
            toast.error('Correct your phone number');
            return;
        }
        if (quantityError.length > 0) {
            toast.error("Please update the quantity");
            return;
        }
        const edition = form.edition.value;
        const brandName = form.brandName.value;
        const modelName = form.modelName.value;
        const condition = form.condition.value;
        const genuine = form.genuine.value;
        const variant = form.variant.value;
        const contact = form.contactNumber.value;
        const city = form.city.value;
        const borough = form.borough.value;
        const country = form.country.value;
        const userName = user?.displayName;
        const email = user?.email;
        const description = form.description.value;
        const price = parseInt(form.price.value);
        const timeStamp = Date.now();
        const dateVariable = new Date();
        const date = format(dateVariable, "PP");
        const Quantity = form.quantity.value;
        const localFullTime = dateVariable.toLocaleTimeString();
        const localTime = localFullTime.split(':')[0] + ":" + localFullTime.split(':')[1] + " " + localFullTime.split(":")[2].split(" ")[1];
        // console.log(process.env.REACT_APP_imgBB);
        const formData = new FormData();
        formData.append("image", form.uploadPicture.files[0])
        fetch(`https://api.imgbb.com/1/upload?key=${process.env.REACT_APP_imgBB}`, {
            method: "POST",
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    fetch(`https://phone-resale-server-swadhin941.vercel.app/productPost?user=${user?.email}`, {
                        method: "POST",
                        headers: {
                            authorization: `bearer ${localStorage.getItem('token')}`,
                            "content-type": "application/json"
                        },
                        body: JSON.stringify({ brandName, modelName, condition, price, genuine, variant, contact, latitude: locationInfo.lat, longitude: locationInfo.lon, city, borough, country, description, userName, email, edition, Quantity, imgURL: data.data.url, timeStamp, date, localTime})
                    })
                        .then(res => {
                            if (res.status === 401) {
                                logout()
                                navigate('/login')
                            }
                            if (res.status === 403) {
                                navigate('/forbidden')
                            }
                            return res.json()
                        })
                        .then(data => {
                            if (data.acknowledged) {
                                toast.success("Product uploaded successfully");
                                form.reset();
                            }
                        })
                }

            })
    }

    return (
        <div className='container-fluid'>
            <div className="row">
                <div className="col-12 col-md-12 col-lg-12">
                    <div className="card">
                        <div className="card-body">
                            <h2 className='text-center'>Product Information</h2>
                            <hr className='w-100' />
                            <form className='form' onSubmit={handleSubmit}>
                                <div className='productInfo'>
                                    <div>
                                        <label htmlFor="brandName" className='mb-1 fs-4' style={{ fontWeight: "600" }}>Brand:</label>
                                        <div>
                                            <select name="brandName" id="brandName" defaultValue={'default'} className='form-select' onChange={handleSelectedBrand}>
                                                <option value="default" disabled>---Select a Brand---</option>
                                                {
                                                    brandName.map((item, index) => <option value={item.Name} key={index}>{item.Name}</option>)
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="modelName" className='form-label mb-1 fs-4' style={{ fontWeight: "600" }}>Model:</label>
                                        <div>
                                            <select name="modelName" id="modelName" className='form-select' defaultValue={selectedBrandState ? "default" : "none"} onChange={handleSelectedModel}>
                                                <option value={selectedBrandState ? "default" : "none"} disabled>{selectedBrandState ? "---Select a Model---" : "Select a brand first"}</option>
                                                {
                                                    modelName.length !== 0 && modelName.map((item, index) => <option key={index} value={item.Model}>{item.Model}</option>)
                                                }
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className='productInfo mt-3'>
                                    <div>
                                        <label htmlFor="condition" className='mb-1 fs-4' style={{ fontWeight: "600" }}>Condition:</label>
                                        <div>
                                            <select name="condition" id="condition" defaultValue={selectedModelNameState ? "default" : "none"} className='form-select'>
                                                <option value={selectedModelNameState ? "default" : "none"}>{selectedModelNameState ? "---Select condition---" : "Select a model first"}</option>
                                                {
                                                    selectedModelNameState && condition.map((item, index) => <option key={index} value={item}>{item}</option>)
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="edition" className='mb-1 fs-4' style={{ fontWeight: "600" }}>Last Edition:</label>
                                        <div>
                                            <select name="edition" id="edition" className='form-select' defaultValue={'default'}>
                                                <option value="default" disabled>---Select a year---</option>
                                                {
                                                    arrayForMap.map(item => <option key={item} value={currentYear - item}>{currentYear - item}</option>)
                                                }
                                            </select>
                                        </div>

                                    </div>
                                </div>
                                <div className='productInfo mt-3'>
                                    <div>
                                        <label htmlFor="variant" className='form-label mb-1 fs-4' style={{ fontWeight: '600' }}>Variant: </label>
                                        <div>
                                            <input type="text" className='form-control' name='variant' id='variant' required placeholder='RAM/ROM' />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="genuine" className='fs-4 mb-1' style={{ fontWeight: '600' }}>Genuine:</label>
                                        <div>
                                            <select name="genuine" id="genuine" className='form-select' defaultValue={'default'}>
                                                <option value="default" disabled>Select phone status</option>
                                                {
                                                    genuine.map((item, index) => <option key={index} value={item}>{item}</option>)
                                                }
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className='mt-3 productInfo'>
                                    <div>
                                        <label htmlFor="price" className='fs-4 mb-1 form-label' style={{fontWeight:"600"}}>Price:</label>
                                        <div>
                                            <input type="text" className='form-control' name='price' id='price' placeholder='Price' required />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="quantity" className='mb-1 fs-4 form-label' style={{fontWeight:"600"}}>Quantity: </label>
                                        <div>
                                            <input type="number" className='form-control' name='quantity' id='quantity' required defaultValue={1} onChange={handleQuantity} />
                                        </div>
                                        {quantityError.length > 0 && <p className='text-danger'>{quantityError}</p>}
                                    </div>
                                </div>
                                <div className='productDescription mt-3'>
                                    <div className='input-group '>
                                        <span className='input-group-text bg-white' style={{ fontFamily: "sans-serif" }}>Describe full feature</span>
                                        <textarea name="description" id="description" className='form-control border border-start-0' cols="40" rows="3" placeholder='Description:' style={{ resize: "none" }} required></textarea>
                                    </div>

                                </div>

                                <div className='mt-3 d-flex justify-content-center'>
                                    <div onClick={() => document.querySelector('.uploadPicture').click()}>
                                        <input type="file" name='uploadPicture' className='uploadPicture' hidden onChange={handlePictureChange} />
                                        {
                                            uploadPicture ? <img src={uploadPicture} alt="" height={200} width={200} /> : <div className='d-flex justify-content-center align-items-center' style={{ height: "180px", width: "180px", border: "2px dashed blue" }}> <div className='d-block'><i className='bi bi-plus fs--2' style={{ color: "blue" }}></i></div><div style={{ cursor: "pointer" }}>Upload a picture</div> </div>
                                        }
                                        {uploadPictureError.length !== 0 && <p className='text-danger'>{uploadPictureError}</p>}
                                    </div>
                                </div>
                                <h2 className='text-center mt-3'>Personal Information</h2>
                                <hr className='w-100' />
                                <div className='mt-3'>
                                    <div className='mapCustomContainer'>
                                        <MapContainer center={[24.20753326608496, 90.54969456411499]} zoom={5} scrollWheelZoom={false}>
                                            <TileLayer
                                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            />
                                            {
                                                currentPosition && <MarkerCustom position={currentPosition} locationInfo={setLocationInfo}></MarkerCustom>
                                            }
                                        </MapContainer>

                                    </div>
                                    <div className='mt-4 d-flex justify-content-center'>
                                        {
                                            !locationLoading ? <p className='btn btn-primary' onClick={handleLocation}>Find out location</p> : <p className='btn btn-primary d-flex justify-content-center' style={{ width: "144px" }}><ClockLoader size={24} color='white' /></p>
                                        }

                                    </div>
                                    <div className='mt-3'>
                                        <div className='userContact'>
                                            <div>
                                                <label htmlFor="userName" className='mb-1 fs-4' style={{ fontWeight: "600" }}>User Name:</label>
                                                <div>
                                                    <input type="text" className='form-control bg-ash' defaultValue={user?.displayName} readOnly />
                                                </div>
                                            </div>
                                            <div>
                                                <label htmlFor="email" className='mb-1 fs-4' style={{ fontWeight: "600" }}>
                                                    Email:
                                                </label>
                                                <div>
                                                    <input type="email" className='form-control bg-ash' defaultValue={user?.email} readOnly />
                                                </div>
                                            </div>
                                            <div>
                                                <label htmlFor="contactNumber" className='form-label mb-1 fs-4' style={{ fontWeight: "600" }}>Contact Number:</label>
                                                <div>
                                                    <input type="text" className='form-control' placeholder='Provide your phone No.' name='contactNumber' id='contactNumber' required onChange={handlePhoneNumber} />
                                                </div>
                                                {phoneNumberValidation.length !== 0 && <p className='text-danger'>{phoneNumberValidation}</p>}
                                            </div>
                                        </div>
                                        <div className='userAddress mt-3'>
                                            <div>
                                                <label htmlFor="city" className='form-label mb-1 fs-4' style={{ fontWeight: "600" }}>City:</label>
                                                <div>
                                                    <input type="text" name='city' id='city' className='form-control bg-ash' defaultValue={locationInfo?.address?.city} readOnly />
                                                </div>
                                            </div>
                                            <div>
                                                <label htmlFor="country" className='form-label mb-1 fs-4' style={{ fontWeight: "600" }}>Country:</label>
                                                <div>
                                                    <input type="text" name='country' id='country' className='form-control bg-ash' defaultValue={locationInfo?.address?.country} readOnly />
                                                </div>
                                            </div>
                                            <div>
                                                <label htmlFor="borough" className='form-label mb-1 fs-4' style={{ fontWeight: "600" }}>Borough:</label>
                                                <div>
                                                    <input type="text" name='borough' id='borough' className='form-control bg-ash' defaultValue={locationInfo?.address?.borough} readOnly />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='mt-3 d-flex justify-content-center'>
                                    <button type='submit' className='btn btn-primary'>Submit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;