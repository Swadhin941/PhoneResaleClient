import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PhotoProvider, PhotoView } from "react-photo-view";
import 'react-photo-view/dist/react-photo-view.css';
import "./DetailsPage.css";
import { toast } from 'react-hot-toast';
import { format } from "date-fns";
import Spinner from '../Spinner/Spinner';
import { SharedData } from '../SharedData/SharedContext';
import ClockLoader from 'react-spinners/ClockLoader';
import DeleteModal from '../DeleteModal/DeleteModal';
import WishModal from '../WishModal/WishModal';
import ConfirmShippingLocation from '../ConfirmShippingLocation/ConfirmShippingLocation';
import DetailsEdit from '../DetailsEdit/DetailsEdit';
import useTitle from '../CustomHook/useTitle';

const DetailsPage = () => {
    useTitle("Details-page- E-Buy");
    const location = useLocation();
    const { currentPosition, setCurrentPosition, user, logout } = useContext(SharedData);
    const [locationLoading, setLocationLoading] = useState(false);
    const [id, setId] = useState(location.pathname.split('/Details-page/')[1]);
    const [dataLoading, setDataLoading] = useState(true);
    const [DetailsData, setDetailsData] = useState([]);
    const [calculatedDistance, setCalculatedDistance] = useState('');
    const [cartCheck, setCartCheck] = useState(false);
    const [selectedToDelete, setSelectedToDelete] = useState('');
    const [deleteStatus, setDeleteStatus] = useState(false);
    const [wishListCheck, setWishListCheck] = useState(false);
    const [wishState, setWishState] = useState(false);
    const [wishId, setWishId] = useState(null);
    const [updateWishCheck, setUpdateWishCheck] = useState(false);
    const [orderDetails, setOrderDetails] = useState(null);
    const [totalCost, setTotalCost] = useState(0);
    const [itemDelete, setItemDelete] = useState(false);
    const [selectedItem, setSelectedItem]= useState('');
    const [edit, setEdit]= useState(null);
    const [editState, setEditState]= useState(false);
    const navigate = useNavigate();
    let distance = null;
    const showPosition = (position) => {
        setCurrentPosition({ latitude: position.coords.latitude, longitude: position.coords.longitude });
        setLocationLoading(false);
    }
    const showError = (error) => {
        toast.error(error.message);
        setLocationLoading(false);
    }
    useEffect(() => {
        fetch(`https://phone-resale-server-swadhin941.vercel.app/Details/${id}`)
            .then(res => res.json())
            .then(data => {
                setDetailsData(data);
                setDataLoading(false);
            })
            .catch(error => {
                toast.error(error.message);
                setDataLoading(false);
            });
    }, [id, editState])

    useEffect(() => {
        if (DetailsData.length !== 0 && user) {
            fetch(`https://phone-resale-server-swadhin941.vercel.app/wishListCheck/${id}?user=${user?.email}`, {
                method: "GET",
                headers: {
                    authorization: `bearer ${localStorage.getItem('token')}`
                }
            })
                .then(res => {
                    if (res.status === 401) {
                        logout()
                    }
                    return res.json();
                })
                .then(data => {
                    setWishListCheck(data.wishCheck);
                })
        }
    }, [DetailsData, user, updateWishCheck])



    useEffect(() => {
        if (currentPosition !== null) {
            let lat1 = parseFloat(DetailsData[0]?.latitude);
            let lon1 = parseFloat(DetailsData[0]?.longitude);
            let lat2 = currentPosition?.latitude;
            let lon2 = currentPosition?.longitude;
            lat1 = lat1 * Math.PI / 180;
            lat2 = lat2 * Math.PI / 180;
            lon1 = lon1 * Math.PI / 180;
            lon2 = lon2 * Math.PI / 180;

            let dlat = lat2 - lat1;
            let dlon = lon2 - lon1;
            const a = Math.pow(Math.sin(dlat / 2), 2) + Math.cos(lat1) * Math.pow(Math.sin(dlon / 2), 2);
            distance = 6371 * 2 * Math.asin(Math.sqrt(a));
            setCalculatedDistance(`${distance.toFixed(2)} km away`)
        }
    }, [currentPosition, DetailsData])





    const handleLocation = () => {
        setLocationLoading(true);
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    }

    useEffect(() => {
        if (wishState && user) {
            fetch(`https://phone-resale-server-swadhin941.vercel.app/wishList?user=${user?.email}`, {
                method: "POST",
                headers: {
                    authorization: `bearer ${localStorage.getItem('token')}`,
                    'content-type': "application/json"
                },
                body: JSON.stringify({ modelName: wishId?.modelName, productID: wishId?._id, wishListedEmail: wishId?.wishListedEmail, imgURL: wishId?.imgURL, price: wishId?.price })
            })
                .then(res => {
                    if (res.status === 401) {
                        logout()
                    }
                    return res.json();
                })
                .then(data => {
                    if (data.acknowledged) {
                        setWishListCheck(true);
                        setCartCheck(false);
                        setWishState(false);
                    }
                })
                .catch(error => {
                    toast.error(error.message);
                })
        }
    }, [wishState])

    const handleWishList = (data, wishStatus) => {
        const wishListedEmail = user?.email;
        data.wishListedEmail = wishListedEmail;
        if (!wishStatus) {
            setWishId(data);
        }
        else if (wishStatus && user) {
            fetch(`https://phone-resale-server-swadhin941.vercel.app/wishList?user=${user?.email}`, {
                method: "DELETE",
                headers: {
                    authorization: `bearer ${localStorage.getItem('token')}`,
                    'content-type': "application/json"
                },
                body: JSON.stringify({ productID: data._id, wishListedEmail: data.wishListedEmail })
            })
                .then(res => {
                    if (res.status === 401) {
                        logout()
                    }
                    return res.json();
                })
                .then(data => {
                    if (data.deletedCount >= 1) {
                        setWishListCheck(false);
                        setCartCheck(false);
                    }
                })
                .catch(error => {
                    toast.error(error.message);
                })
        }

    }

    const handleCart = ({ email, _id, modelName, imgURL, price, contact }) => {
        const cartedPerson = user?.email;
        fetch(`https://phone-resale-server-swadhin941.vercel.app/addToCart?user=${user?.email}`, {
            method: "POST",
            headers: {
                authorization: `bearer ${localStorage.getItem('token')}`,
                'content-type': "application/json"
            },
            body: JSON.stringify({ productID: _id, cartedPerson, email, modelName, imgURL, purchasedQuantity: 1, price, contact })
        })
            .then(res => {
                if (res.status === 401) {
                    logout()
                }
                if (res.status === 403) {
                    navigate('/forbidden');
                }
                return res.json();

            })
            .then(data => {
                if (data.acknowledged) {
                    setCartCheck(true);
                    toast.success("Added to the cart");
                }
                else {
                    setCartCheck(false);
                    toast.error("Failed to added to the cart");
                }
                setUpdateWishCheck(!updateWishCheck);
            })
    }

    useEffect(() => {
        if (user && DetailsData.length !== 0) {
            fetch(`https://phone-resale-server-swadhin941.vercel.app/cartCheck?user=${user?.email}&&productId=${DetailsData[0]?._id}`, {
                method: "GET",
                headers: {
                    authorization: `bearer ${localStorage.getItem('token')}`
                }
            })
                .then(res => {
                    if (res.status === 401) {
                        logout()
                    }
                    return res.json();
                })
                .then(data => {
                    if (data.acknowledged) {
                        setCartCheck(true);

                    }
                    else {
                        setCartCheck(false);
                    }
                })
        }

    }, [user, DetailsData])

    useEffect(() => {
        if (deleteStatus) {
            const productID = selectedToDelete;
            const cartedPerson = user?.email;
            fetch(`https://phone-resale-server-swadhin941.vercel.app/removeFromCart?user=${user?.email}`, {
                method: "DELETE",
                headers: {
                    authorization: `bearer ${localStorage.getItem('token')}`,
                    "content-type": "application/json",
                },
                body: JSON.stringify({ productID, cartedPerson })
            })
                .then(res => {
                    if (res.status === 401) {
                        logout()
                    }
                    return res.json()
                })
                .then(data => {
                    if (data.deletedCount >= 1) {
                        setCartCheck(false);
                        setUpdateWishCheck(!updateWishCheck);
                        setDeleteStatus(false);
                        toast.success("Deleted from cart");
                    }
                })
        }
    }, [deleteStatus])

    const handleRemoveCart = (data) => {
        setSelectedToDelete(data);
    }

    useEffect(() => {
        if (orderDetails) {
            fetch(`https://phone-resale-server-swadhin941.vercel.app/cartPayment?user=${user?.email}`, {
                method: "POST",
                headers: {
                    authorization: `bearer ${localStorage.getItem('token')}`,
                    "content-type": "application/json"
                },
                body: JSON.stringify({ allCart: [{ productID: DetailsData[0]._id, cartedPerson: user?.email, email: DetailsData[0].email, modelName: DetailsData[0].modelName, imgURL: DetailsData[0].imgURL, purchasedQuantity: 1, price: DetailsData[0].price, contact: DetailsData[0].contact }], ...orderDetails, totalCost: totalCost })
            })
                .then(res => {
                    if (res.status === 401) {
                        logout()
                    }
                    if (res.status === 403) {
                        navigate('/forbidden');
                    }
                    return res.json();
                })
                .then(data => {
                    window.location.href = data.url;
                })
        }
    }, [orderDetails])

    useEffect(() => {
        if (itemDelete) {
            fetch(`https://phone-resale-server-swadhin941.vercel.app/deleteProduct?user=${user?.email}`,{
                method:"DELETE",
                headers:{
                    authorization: `bearer ${localStorage.getItem('token')}`,
                    "content-type": "application/json"
                },
                body: JSON.stringify({_id: selectedItem, email: DetailsData[0].email})
            })
            .then(res=>{
                if(res.status===401){
                    logout()
                }
                if(res.status===403){
                    navigate('/forbidden');
                }
                return res.json();
            })
            .then(data=>{
                if(data.deletedCount>=1){
                    toast.success("Deleted Successfully");
                    navigate(-1);
                    setItemDelete(false);
                }
            })
        }
    }, [itemDelete])

    const handleEdit= (price, details, _id)=>{
        setEdit({price: parseInt(price), details: details, _id: _id});
    }

    if (dataLoading) {
        return <Spinner></Spinner>
    }


    return (
        <div className='container-fluid'>

            {
                DetailsData.map(item => <div className='row' key={item._id}>
                    <div className="col-12 col-md-12 col-lg-12" >
                        <div className='d-flex justify-content-between'>
                            <div>
                                <h2 className='fw-bold'>{item.modelName}</h2>
                                <p className='text-muted mb-0' style={{ fontWeight: "600" }}>Posted on {item.date} at {item.localTime}, {item.city}</p>
                                <p className='text-muted mt-0' style={{ fontWeight: "600" }}>For sale by <span className='text-dark'>{item.userName}</span></p>
                            </div>
                            <div>
                                {
                                    currentPosition === null && !locationLoading ? <p className='text-success fw-bold' style={{ cursor: "pointer" }} onClick={handleLocation}>Tap to see the actual distance between you and author</p> : locationLoading && <ClockLoader size={24} color='green' className='mt-2' />
                                }
                                {
                                    currentPosition !== null && calculatedDistance.length !== 0 && <p className='text-success fw-bold'>{calculatedDistance}</p>
                                }
                            </div>
                        </div>

                        <div className='detailsImageDiv'>
                            <PhotoProvider>
                                <PhotoView src={item.imgURL}>
                                    <img src={item.imgURL} alt="" className='img-fluid' />
                                </PhotoView>
                            </PhotoProvider>
                        </div>
                    </div>
                    <div className="col-12 col-md-12 col-lg-12 mt-2">
                        <div className='detailsContentDiv'>
                            <div className='mb-3'>
                                <h2 style={{ fontWeight: "600" }} className='d-inline'>Tk: {item.price}taka</h2>
                                {
                                    user && <i className={`bi ${wishListCheck ? "bi-heart-fill text-danger" : "bi-heart"} ms-3`} onClick={() => handleWishList(item, wishListCheck)} style={{ cursor: "pointer" }} data-bs-target={!wishListCheck ? "#wishModal" : ""} data-bs-toggle={!wishListCheck ? "modal" : ""}></i>
                                }

                            </div>

                            <div className='d-flex justify-content-between'>
                                <h6 className='text-muted' style={{ fontWeight: "600" }}>Model: {item.modelName}</h6>
                                <h6 className='text-muted' style={{ fontWeight: "600" }}>Brand: {item.brandName}</h6>
                            </div>
                            <div className='d-flex justify-content-between'>
                                <h6 className='text-muted' style={{ fontWeight: "600" }}>Variant: {item.variant}</h6>
                                <h6 className='text-muted' style={{ fontWeight: "600" }}>Edition: {item.edition}</h6>
                            </div>
                            <div className='d-flex justify-content-between'>
                                <h6 className='text-muted' style={{ fontWeight: "600" }}>Condition: {item.condition}</h6>
                                <h6 className='text-muted ' style={{ fontWeight: "600" }}>Authenticity: {item.genuine}</h6>

                            </div>
                            <div className='d-flex justify-content-between'>
                                <h6 className='text-muted' style={{ fontWeight: "600" }}>Country: {item.country}</h6>
                                <h6 className='text-muted' style={{ fontWeight: "600" }}>City: {item.city}</h6>
                            </div>
                            <div className='d-flex justify-content-between'>
                                <h6 className='text-muted' style={{ fontWeight: "600" }}>Borough: {item.borough}</h6>
                                <h6 className='text-muted' style={{ fontWeight: "600" }}>Quantity: {item.Quantity} available</h6>
                            </div>
                            <div className='mt-3'>
                                <h6 className='fw-bold'>Description</h6>
                                <div>
                                    <p className='text-muted'>{item.description}</p>
                                </div>
                            </div>
                            {
                                user && <div className='mt-3'>

                                    {
                                        user && user?.email === item.email ? <><button className='btn btn-danger' onClick={()=>setSelectedItem(item._id)} data-bs-target="#DeleteModal" data-bs-toggle="modal" >Delete Item</button> <button className='ms-2 btn btn-success' data-bs-target="#editModal" data-bs-toggle="modal" onClick={()=>handleEdit(item.price, item.description, item._id)}>Edit</button> </>: item.Quantity !== '0' && item?.status !== 'sold' ? <><button className='btn btn-success' data-bs-target="#confirmShippingLocation" data-bs-toggle="modal" onClick={() => setTotalCost(item.price)}>Buy Now</button>
                                            {
                                                cartCheck ? <button className='btn btn-danger ms-4' onClick={() => { handleRemoveCart(item._id) }} data-bs-target="#DeleteModal" data-bs-toggle="modal">Remove from cart</button> : <button className='btn btn-warning ms-4' onClick={() => handleCart(item)}>Add to cart</button>
                                            }

                                        </>
                                            : <button className={`btn btn-warning ${item?.status !== 'sold' && "ms-4"}`} disabled >Sold</button>
                                    }


                                </div>
                            }

                        </div>
                        {
                            user && user?.email === DetailsData[0].email ? <DeleteModal deleteID={selectedItem} deleteStatus={setItemDelete}></DeleteModal> : <DeleteModal deleteID={selectedToDelete} deleteStatus={setDeleteStatus}></DeleteModal>
                        }

                        <WishModal wishId={wishId} wishState={setWishState}></WishModal>
                        <ConfirmShippingLocation orderDetails={setOrderDetails} totalCost={totalCost}></ConfirmShippingLocation>
                        <DetailsEdit editInfo={edit} editState={setEditState} editValue={editState}></DetailsEdit>
                    </div>
                </div>

                )
            }

        </div>
    );
};

export default DetailsPage;