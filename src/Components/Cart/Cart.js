import React, { useContext, useEffect, useState } from 'react';
import { SharedData } from '../SharedData/SharedContext';
import { useNavigate } from 'react-router-dom';
import "./Cart.css";
import Spinner from '../Spinner/Spinner';
import { toast } from 'react-hot-toast';
import DeleteModal from '../DeleteModal/DeleteModal';
import WishModal from '../WishModal/WishModal';
import ConfirmShippingLocation from '../ConfirmShippingLocation/ConfirmShippingLocation';
import useTitle from '../CustomHook/useTitle';

const Cart = () => {
    useTitle("Cart- E-Buy");
    const { user, logout } = useContext(SharedData);
    const navigate = useNavigate();
    const [allCart, setAllCart] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [totalCost, setTotalCost] = useState(0);
    const [totalCostState, setTotalCostState] = useState(true);
    const [dataLoading, setDataLoading] = useState(true);
    const [deleteStatus, setDeleteStatus] = useState(false);
    const [selectedToDelete, setSelectedToDelete] = useState('');
    const [deleteCartReload, setDeleteCartReload] = useState(false);
    const [cartReload, setCartReload] = useState(false);
    const [wishData, setWishData] = useState(null);
    const [showTotal, setShowTotal] = useState(false);
    const [wishState, setWishState] = useState(false);
    const [showEmpty, setShowEmpty] = useState(false);
    const [orderDetails, setOrderDetails] = useState(null);

    useEffect(() => {
        if (user !== null) {
            fetch(`${process.env.REACT_APP_SERVER}/getTotalCost?user=${user?.email}`, {
                method: "GET",
                headers: {
                    authorization: `bearer ${localStorage.getItem('token')}`
                }
            })
                .then(res => {
                    if (res.status === 401) {
                        logout()
                        navigate("/login")
                    }
                    return res.json();
                })
                .then(data => {
                    setTotalCost(data.totalCost);
                    setCartReload(!cartReload);
                })
        }

    }, [user, totalCostState, deleteCartReload, showTotal])

    const handleQuantity = (id, purchasedQuantity) => {

        fetch(`${process.env.REACT_APP_SERVER}/incrDecr?user=${user?.email}`, {
            method: "PUT",
            headers: {
                authorization: `bearer ${localStorage.getItem('token')}`,
                "content-type": "application/json"
            },
            body: JSON.stringify({ id, purchasedQuantity })
        })
            .then(res => {
                if (res.status === 401) {
                    logout()
                    navigate('/login')
                }
                if(res.status===403){
                    navigate('/forbidden')
                }
                return res.json()
            })
            .then(data => {
                if (data.modifiedCount >= 1) {
                    setTotalCostState(!totalCostState);
                    setCartReload(!cartReload)
                    setDataLoading(false);
                }
            })
            .catch(error => {
                toast.error(error.message);
            })
    }

    useEffect(() => {
        setDataLoading(true);
        if (user !== null) {
            fetch(`${process.env.REACT_APP_SERVER}/allCart?user=${user?.email}`, {
                method: 'GET',
                headers: {
                    authorization: `bearer ${localStorage.getItem('token')}`
                }
            })
                .then(res => {
                    if (res.status === 401) {
                        logout()
                        navigate('/login')
                    }
                    return res.json();
                })
                .then(data => {
                    setAllCart(data);
                    if (data.length === 0) {
                        setShowTotal(false);
                        setShowEmpty(true);
                    }
                    else {
                        setShowTotal(true);
                        setShowEmpty(false);
                    }
                    setDataLoading(false);
                })
                .catch(error => {
                    toast.error(error.message);
                    setDataLoading(false);
                })
        }
    }, [user, cartReload])

    useEffect(() => {
        if (deleteStatus) {
            const productID = selectedToDelete;
            const cartedPerson = user?.email;
            fetch(`${process.env.REACT_APP_SERVER}/removeFromCart?user=${user?.email}`, {
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
                        navigate('/login')
                    }
                    return res.json()
                })
                .then(data => {
                    if (data.deletedCount >= 1) {
                        setDeleteStatus(false);
                        setCartReload(!cartReload);
                        setTotalCostState(!totalCostState);
                        toast.success("Deleted from cart")
                    }
                })
        }
    }, [deleteStatus])

    const handleDelete = (id) => {
        setSelectedToDelete(id);
    }


    useEffect(() => {
        if (wishState && user) {
            fetch(`${process.env.REACT_APP_SERVER}/wishList?user=${user?.email}`, {
                method: "POST",
                headers: {
                    authorization: `bearer ${localStorage.getItem('token')}`,
                    "content-type": "application/json"
                },
                body: JSON.stringify({ productID: wishData?.productID, imgURL: wishData?.imgURL, modelName: wishData?.modelName, wishListedEmail: wishData?.cartedPerson, price: wishData?.price })
            })
                .then(res => {
                    if (res.status === 401) {
                        logout()
                        navigate('/login')
                    }
                    return res.json();
                })
                .then(data => {
                    if (data.acknowledged) {
                        setCartReload(!cartReload);
                        toast.success("Successfully added to wish list");
                    }
                })
        }
    }, [wishState])

    const handleWishList = (data, wishStatus) => {
        // console.log(data, wishStatus);
        setWishData(data);
    }





    const handleDetailsClick = (id) => {
        navigate(`/Details-page/${id}`)
    }

    useEffect(() => {
        if (orderDetails) {
            fetch(`${process.env.REACT_APP_SERVER}/cartPayment?user=${user?.email}`, {
                method: "POST",
                headers: {
                    authorization: `bearer ${localStorage.getItem("token")}`,
                    "content-type": "application/json"
                },
                body: JSON.stringify({ allCart: allCart, ...orderDetails, totalCost })
            })
                .then(res => {
                    if (res.status === 401) {
                        logout()
                        navigate('/login')
                    }
                    return res.json()
                })
                .then(data => {
                    window.location.replace(data.url);
                })
                .catch(error=>{
                    toast.error(error.message);
                })
        }
    }, [orderDetails])




    if (dataLoading) {
        return <Spinner></Spinner>
    }

    return (
        <div className='container-fluid'>
            {
                showEmpty ? <div className='emptyCart'>
                    <h2 className='text-white fw-bold'>No item in Cart</h2>
                </div> :
                    <div className='cartRowsDiv'>
                        <div className="row g-2 mt-2">
                            {
                                allCart.map((item, index) => <div className='col-12 col-sm-12 col-md-12 col-lg-12' key={item._id}>
                                    <div className="card">
                                        <div className="card-body mt-0">
                                            <div className="row">
                                                <div className="col-3 col-md-2 col-lg-2">
                                                    <div className='cartImageDiv'>
                                                        <img src={item.imgURL} alt="" className='img-fluid' />
                                                    </div>

                                                </div>
                                                <div className="col-9 col-md-10 col-lg-10">
                                                    <h5 className='mb-0 mt-0 text-primary' onClick={() => handleDetailsClick(item.productID)} style={{ cursor: "pointer" }}>{item.modelName}</h5>
                                                    <div className='d-flex justify-content-between'>
                                                        <div>
                                                            <small className='d-block mb-0'><p className='my-0'>Available: {item.Quantity - item.purchasedQuantity}</p></small>
                                                            <small className='d-block mt-0'><p className='my-0'>Price: <span className='fs-6'>৳</span>{item.price}</p></small>
                                                            <div>
                                                                <i className='bi-trash3-fill' style={{ cursor: "pointer" }} onClick={() => handleDelete(item.productID)} data-bs-toggle="modal" data-bs-target="#DeleteModal"></i>
                                                                <i className={`bi ${!item?.wishList ? 'bi-heart' : 'bi-heart-fill text-danger'} ms-2`} onClick={() => handleWishList(item, item?.wishList ? false : true)} style={{ cursor: "pointer" }} data-bs-target="#wishModal" data-bs-toggle="modal"></i>
                                                            </div>
                                                        </div>

                                                        {
                                                            item.Quantity > 1 && <div> <div className='d-flex justify-content-end'>
                                                                <button className='btn btn-sm btn-light border border-1' onClick={() => handleQuantity(item._id, item.purchasedQuantity - 1)} disabled={item.purchasedQuantity === 1 ? true : false}><i className='bi bi-dash'></i></button>
                                                                <span className='ms-1 me-1'> {item.purchasedQuantity} </span>
                                                                <button className='btn btn-light btn-sm border border-1' onClick={() => handleQuantity(item._id, item.purchasedQuantity + 1)} disabled={item.purchasedQuantity === item.Quantity ? true : false}><i className='bi bi-plus b'></i></button>
                                                            </div></div>
                                                        }

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>)
                            }
                            <DeleteModal deleteID={selectedToDelete} deleteStatus={setDeleteStatus}></DeleteModal>
                            <WishModal wishId={wishData?.productID} wishState={setWishState}></WishModal>
                        </div>
                    </div>
            }
            {
                showTotal && <div className="row mt-3" style={{ borderTop: "1px solid black" }}>
                    <div className="col-12 col-md-12 col-lg-12">
                        <div className="card border border-0">
                            <div className="card-body">
                                <div className="d-flex justify-content-end mt-5">
                                    <h4 style={{ fontWeight: "600" }}>Total Cost: <span className='text-success'>{totalCost}taka</span></h4>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-12 col-lg-12">
                        <div className='d-flex justify-content-end'>
                            <button className='btn btn-primary' data-bs-target="#confirmShippingLocation" data-bs-toggle="modal">Payment</button>
                        </div>
                        <ConfirmShippingLocation totalCost={totalCost} orderDetails={setOrderDetails}></ConfirmShippingLocation>
                    </div>
                </div>
            }


        </div>
    );
};

export default Cart;