import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// import ProductSearch from '../ProductSearch/ProductSearch';
import "./AllProduct.css";
import Spinner from '../../Spinner/Spinner';
import useTitle from '../../CustomHook/useTitle';

const AllProduct = () => {
    useTitle("All Product- E-Buy");
    const location = useLocation();
    const brandName = location.pathname.split('/selected-category/')[1];
    const [allProduct, setAllProduct] = useState([]);
    const [totalData, setTotalData] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [selectedPage, setSelectedPage] = useState(0);
    const [dataLoading, setDataLoading] = useState(false);
    // const [searchText, setSearchText] = useState('')
    const navigate = useNavigate();
    useEffect(() => {
        setDataLoading(true);
        fetch(`https://phone-resale-server-swadhin941.vercel.app/selected-category/${brandName}?pageNum=${selectedPage}`)
            .then(res => res.json())
            .then(data => {
                setAllProduct(data);
                setDataLoading(false);
            })
    }, [brandName, selectedPage])


    //for multi page data

    useEffect(() => {
        fetch(`https://phone-resale-server-swadhin941.vercel.app/countAllProduct?brandName=${brandName}`)
            .then(res => res.json())
            .then(data => {
                setTotalData(data.count);
                if (data.count !== 0) {
                    setTotalPage(Math.ceil(data.count / 4));
                }

            })
    }, [brandName])
    const handleDetailsClick = (data) => {
        navigate(`/Details-page/${data}`);
    };


    return (
        <div className='container-fluid'>
            {
                dataLoading ? <Spinner></Spinner> : allProduct.length === 0 ? <div className='noPostStyle'><h1>No Post Available</h1></div> :

                    <div style={{ height: "500px", overflow: "auto", overflowX: "hidden", overflowY: "auto" }}>
                        {/* <div className="row g-2">
                            <div className="col-12 col-md-12 col-lg-12">
                                <div className='searchBarDiv'>
                                    <ProductSearch searchText={setSearchText}></ProductSearch>
                                </div>
                            </div>
                        </div> */}
                        <div className="row mt-4 g-2">
                            {
                                allProduct.map((item, index) => <div className="col-12 col-md-6 col-lg-6" key={item._id}>
                                    <div className="card" style={{ border: "1px solid blue", cursor: "pointer" }} onClick={() => handleDetailsClick(item._id)} title={item.modelName} >
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-12 col-sm-3 col-md-3 col-lg-3">
                                                    <div className='contentImageDiv'>
                                                        <img src={item.imgURL} alt="" className='img-fluid' />
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-9 col-md-9 col-lg-9">
                                                    <div className='contentDescription'>
                                                        <h4 style={{ fontWeight: "600" }} className='contentName'>{item.modelName}</h4>
                                                        <p className='text-muted mb-0'>{item.city},{item.country}</p>
                                                        <p className='mt-0'>{item.price}<span className='fs-4'>৳</span></p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>)
                            }
                        </div>
                        {
                            totalData > 4 && <div className='d-flex justify-content-center mt-2'>
                                {
                                    [...Array(totalPage).keys()].map((item, index) => <button key={index} className={`btn btn-sm ${selectedPage === item ? 'btn-primary' : "border border-primary text-primary"} mx-2`} onClick={() => setSelectedPage(item)}>{item + 1}</button>)
                                }
                            </div>
                        }
                    </div>
            }
        </div>
    );
};

export default AllProduct;