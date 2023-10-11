import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SharedData } from '../SharedData/SharedContext';
import "./Order.css";
import Spinner from '../Spinner/Spinner';
import useTitle from '../CustomHook/useTitle';

const Orders = () => {
    useTitle("Order- E-Buy");
    const [searchParams, setSearchParams] = useSearchParams();
    const { user, logout } = useContext(SharedData);
    const [orders, setOrders] = useState([]);
    const [dataLoading, setDataLoading]= useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        setDataLoading(true);
        if (user) {
            fetch(`${process.env.REACT_APP_SERVER}/orders?user=${user?.email}`, {
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
                    if (res.status === 403) {
                        navigate('/forbidden')
                    }
                    return res.json()
                })
                .then(data => {
                    setOrders(data);
                    setDataLoading(false);
                })
        }
    }, [user])

    if(dataLoading){
        return <Spinner></Spinner>
    }

    return (
        <div className='container-fluid'>
            {
                orders.length === 0 ? <div className='orderSpace'><h1>No item found</h1></div> : <div className="row g-2 mt-2 ">
                    {
                        orders.map((item, index) => <div className={`col-12 col-md-12 col-lg-12 ${searchParams.get('transactionId') && searchParams.get('transactionId') === item.transactionId && 'bg-primary orderText p-3'}`} key={item._id}>
                            <div className='d-flex justify-content-between border border-2 border-success rounded p-3'>
                                <h6>{item.currentDate}</h6>
                                <hr className='w-75' />
                                <h6>{item.currentTime}</h6>
                            </div>
                            <div className='mt-2'>
                                {
                                    item.allCart.map((item2, index2) => <div className={`card my-2 p-2 ${searchParams.get('transactionId') && searchParams.get('transactionId') === item.transactionId && 'bg-primary'}`} key={index}>
                                        <div className={`card-body${searchParams.get('transactionId') && searchParams.get('transactionId') === item.transactionId && 'bg-primary '}`}>
                                            <div className="row g-2">
                                                <div className="col-2 col-md-1 col-lg-1">
                                                    <img src={item2.imgURL} alt="" className='img-fluid' />
                                                </div>
                                                <div className="col-10 col-md-11 col-lg-11">
                                                    <div className='d-flex justify-content-between'>
                                                        <h5 style={{ fontWeight: "600" }}>{item2.modelName}</h5>
                                                        <div>
                                                            <i className='bi bi-telephone-inbound-fill text-success'></i><span className='fw-bold ms-2'>{item2.contact}</span>
                                                        </div>
                                                    </div>
                                                    <h6 style={{ fontWeight: "600" }}>Purchased: {item2.purchasedQuantity}</h6>
                                                    <h6 style={{ fontWeight: "600" }}>Price: {item2.price} Taka</h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>)
                                }
                            </div>
                            <div>
                                <h6 style={{ fontWeight: "600" }}>TrxID: {item.transactionId}</h6>
                                <h6 style={{ fontWeight: "600" }}>Total Cost: {item.totalCost} Taka</h6>
                                <h6 style={{ fontWeight: "600" }}>Shipping City: {item.city}</h6>
                                <h6 style={{ fontWeight: "600" }}>Shipping Area: {item.area}</h6>
                                <h6 style={{ fontWeight: "600" }}>Your Contact: {item.contact}</h6>

                            </div>
                        </div>)
                    }
                </div>
            }

        </div>
    );
};

export default Orders;