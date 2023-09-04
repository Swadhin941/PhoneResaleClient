import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import "./MyProducts.css";
import { SharedData } from '../SharedData/SharedContext';
import Spinner from '../Spinner/Spinner';
import useTitle from '../CustomHook/useTitle';

const MyProducts = () => {
    useTitle("My Products- E-Buy");
    const { user, logout } = useContext(SharedData);
    const [allProducts, setAllProducts] = useState([]);
    const [dataLoading, setDataLoading] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        setDataLoading(true);
        if (user) {
            fetch(`https://phone-resale-server-swadhin941.vercel.app/myProducts?user=${user?.email}`, {
                method: "GET",
                headers: {
                    authorization: `bearer ${localStorage.getItem('token')}`
                }
            })
                .then(res => {
                    if (res.status === 401) {
                        logout()
                        navigate('/login');
                    }
                    if (res.status === 403) {
                        navigate("/forbidden");
                    }
                    return res.json();
                })
                .then(data => {
                    // console.log(data);
                    setAllProducts(data);
                    setDataLoading(false);
                })
        }
    }, [user])

    const handleClickDetails=(data)=>{
        navigate(`/Details-page/${data}`);
    }

    if (dataLoading) {
        return <Spinner></Spinner>
    }
    return (
        <div className='container-fluid mt-3'>
            {
                allProducts.length === 0 ? <div className='noProducts'><h1>No Item Found</h1></div> : <div className="row g-2">
                    {
                        allProducts.map(item => <div className='col-12 col-md-12 col-lg-12' key={item._id}>
                            <div className='d-flex justify-content-between border border-success rounded p-3 bg-warning'>
                                <h5>{item.postedDate}</h5>
                                <hr className='w-75 text-light' />
                                <h5>{item.postedTime}</h5>
                            </div>
                            <div className='mt-2'>
                                <div className="card border-warning" onClick={()=>handleClickDetails(item.productID)} style={{cursor:"pointer"}}>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-4 col-sm-3 col-md-2 col-lg-2">
                                                <img src={item.imgURL} alt="" className='img-fluid' />
                                            </div>
                                            <div className="col-8 col-sm-9 col-md-10 col-lg-10">
                                                <h5 className='my-0' style={{ fontWeight: "600" }}>{item.modelName}</h5>
                                                <p className='text-muted my-0'><small>Available: {item.Quantity}</small></p>
                                                <small className='text-muted my-0 d-block'><p>Price: {item.price} taka</p></small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='mt-2'>
                                <div className='d-flex justify-content-center' style={{ fontWeight: "600" }}>
                                    {
                                        item?.buyerData ? <h3 style={{ fontFamily: "'Anton', sans-serif" }}>Buyer Details <span>({item?.buyerData.length})</span> </h3> : "None purchased it yet"
                                    }
                                </div>
                                <div className='row'>
                                {
                                    item?.buyerData && item?.buyerData.map((item2, index2) => <div className='col-12 col-md-6 col-lg-6 mb-3' key={index2+1121}>
                                        <div className="row">
                                            <div className="col-12 col-md-12 col-lg-12">
                                                <table className='table table-striped border border-2'>
                                                    <thead>
                                                        <tr>
                                                            <th>Field</th>
                                                            <th>Values</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td style={{ fontWeight: "600" }}>Transaction ID</td>
                                                            <td style={{ fontWeight: "600" }}>{item2.transactionId}</td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{ fontWeight: "600" }}>Name</td>
                                                            <td style={{ fontWeight: "600" }}>{item2.buyerName}</td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{ fontWeight: "600" }}>Email</td>
                                                            <td style={{ fontWeight: "600" }}>{item2.buyerEmail}</td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{ fontWeight: "600" }}>Purchased</td>
                                                            <td style={{ fontWeight: "600" }}>{item2.purchasedQuantity}</td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{ fontWeight: "600" }}>Area</td>
                                                            <td style={{ fontWeight: "600" }}>{item2.area}</td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{ fontWeight: "600" }}>Borough</td>
                                                            <td style={{ fontWeight: "600" }}>{item2.borough}</td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{ fontWeight: "600" }}>City</td>
                                                            <td style={{ fontWeight: "600" }}>{item2.city}</td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{ fontWeight: "600" }}>Postcode</td>
                                                            <td style={{ fontWeight: "600" }}>{item2.postcode}</td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{ fontWeight: "600" }}>Payment-time</td>
                                                            <td style={{ fontWeight: "600" }}>{item2.paymentTime}</td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{ fontWeight: "600" }}>Payment-date</td>
                                                            <td style={{ fontWeight: "600" }}>{item2.paymentDate}</td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{ fontWeight: "600" }}>Contact</td>
                                                            <td style={{ fontWeight: "600" }}>{item2.contact}</td>
                                                        </tr>

                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                    </div>)
                                }
                                </div>
                                
                            </div>
                        </div>)
                    }
                </div>
            }

        </div>
    );
};

export default MyProducts;