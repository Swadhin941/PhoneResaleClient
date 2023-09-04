import React, { useEffect, useState } from 'react';
import "./FakeCard.css";

const FakeCard = () => {
    const [authenticUser, setAuthenticUser]= useState(0);
    const [happyUser, setHappyUser]= useState(0);
    const [totalUser, setTotalUser]= useState(0);
    const [successRate, setSuccessRate]= useState(0);
    useEffect(()=>{
        let value;
        if(authenticUser!==500){
            value= setInterval(()=>{
                setAuthenticUser(authenticUser+1);
            },1)
        }
        return ()=>clearInterval(value);
    },[authenticUser])

    useEffect(()=>{
        let value;
        if(happyUser!==350){
            value= setInterval(()=>{
                setHappyUser(happyUser+1);
            },2)
        }
        return ()=>clearInterval(value);
    },[happyUser])

    useEffect(()=>{
        let value;
        if(totalUser!==600){
            value= setInterval(()=>{
                setTotalUser(totalUser+1);
            },1)
        }
        return ()=>clearInterval(value);
    },[totalUser])

    useEffect(()=>{
        let value;
        if(successRate!==93){
            value= setInterval(()=>{
                setSuccessRate(successRate+1);
            },100)
        }
        return ()=>clearInterval(value);
    },[successRate])
    // console.log(authenticUser);
    return (    
        <div className='container-fluid mt-3'>
            <div className="row g-2">
                <div className="col-12 col-md-6 col-lg-3">
                    <div className="card cardStyle">
                        <div className="card-body">
                            <h4 className='text-center fw-bold'>Authentic User</h4>
                            <h1 className='text-center' style={{fontWeight:"600"}}>{authenticUser}+</h1>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6 col-lg-3">
                    <div className="card cardStyle">
                        <div className="card-body">
                            <h4 className='text-center fw-bold'>Happy User</h4>
                            <h1 className='text-center' style={{fontWeight:"600"}}>{happyUser}+</h1>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6 col-lg-3">
                    <div className="card cardStyle">
                        <div className="card-body">
                            <h4 className='text-center fw-bold'>Total User</h4>
                            <h1 className='text-center' style={{fontWeight:"600"}}>{totalUser}+</h1>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6 col-lg-3">
                    <div className="card cardStyle">
                        <div className="card-body">
                            <h4 className='text-center fw-bold'>Success rate</h4>
                            <h1 className='text-center' style={{fontWeight:"600"}}>{successRate}%</h1>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default FakeCard;