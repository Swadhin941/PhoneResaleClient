import React, { useContext, useEffect, useState } from 'react';
import { SharedData } from '../SharedData/SharedContext';
import "./WishList.css";
import { useNavigate } from 'react-router-dom';
import Spinner from '../Spinner/Spinner';
import useTitle from '../CustomHook/useTitle';

const WishList = () => {
    useTitle('Wish List- E-Buy');
    const { user, logout } = useContext(SharedData);
    const [allWish, setAllWish] = useState([]);
    const [dataLoading, setDataLoading]= useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        setDataLoading(true);
        if (user) {
            fetch(`${process.env.REACT_APP_SERVER}/allWish?user=${user?.email}`, {
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
                    if(res.status===403){
                        navigate('/forbidden');
                    }
                    return res.json()
                })
                .then(data => {
                    setAllWish(data);
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
                allWish.length === 0 ? <div className='emptyWish'>
                    <h2 className='fw-bold text-white'>No Item in Wish list</h2>
                </div> :

                    <div className="wishListRows">
                        <div className="row">
                            {
                                allWish.map(item => <div className="col-12 col-md-12 col-lg-12" key={item._id}>
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-3 col-md-2  col-lg-2">
                                                    <div className="wishImageDiv">
                                                        <img src={item.imgURL} alt="" />
                                                    </div>
                                                </div>
                                                <div className="col-9 col-md-10 col-lg-10">
                                                    <h5 className='text-primary' onClick={() => navigate(`/Details-page/${item.productID}`)} style={{ cursor: "pointer" }}>{item.modelName}</h5>
                                                    <h6>Price: {item.price}Tk</h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>)
                            }

                        </div>
                    </div>
            }
        </div>
    );
};

export default WishList;