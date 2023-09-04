import React, { useEffect, useState } from 'react';
import "./Categories.css";
import Spinner from '../../Spinner/Spinner';
import { toast } from 'react-hot-toast';
import ClockLoader from 'react-spinners/ClockLoader';
import { useNavigate } from 'react-router-dom';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [categoryQuantity, setCategoryQuantity] = useState(6);
    const [showSpinner, setShowSpinner] = useState(true);
    const [buttonLoading, setButtonLoading]= useState(true);
    const navigate= useNavigate();
    useEffect(() => {
        fetch(`https://phone-resale-server-swadhin941.vercel.app/allCategories?quantity=${categoryQuantity}`)
            .then(res => res.json())
            .then(data => {
                setShowSpinner(false);
                setCategories(data);
                setButtonLoading(false);
            })
            .catch(error=>{
                alert("Check your internet connection or reload this page");
                setButtonLoading(false);
            })
    }, [categoryQuantity])

    const handleCategoryClick=(data)=>{
        navigate(`/selected-category/${data}`);
    }

    return (

        showSpinner ? <Spinner> </Spinner> : <div className='container-fluid mt-5'>
            <h4 className='text-bold'>Categories</h4>
            <div className="row g-2">
                <hr />
                {
                    categories.map((item, index) => <div className='col-6 col-sm-4 col-md-3 col-lg-2' key={item._id}>
                        <div className="card  categoriesCard p-2 " onClick={()=>handleCategoryClick(item.Name)}>
                            <div className="card-body">
                                <h4 className='text-center' style={{ fontWeight: "600" }}>{item.Name}</h4>
                            </div>
                        </div>
                    </div>)
                }
            </div>
            <div className="row mt-3">
                <div className="d-flex justify-content-center">
                    {
                        categoryQuantity === 6 ? <button className='btn btn-primary' onClick={() => { setShowSpinner(true); setCategoryQuantity(0); }}>Show more</button> : <button className='btn btn-success d-flex justify-content-center' onClick={() => { setShowSpinner(true); setCategoryQuantity(6); }}>{buttonLoading? <ClockLoader size={24} color='white' />: 'Show less'}</button>
                    }
                </div>
            </div>
        </div>


    );
};

export default Categories;